"use client";

import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
} from "@tanstack/react-query";
import React, { Ref, useEffect, useMemo, useRef, useState } from "react";
import httpClient from "~/api/httpClient";
import { TableResponse } from "~/types/api";
import { FeedModel } from "~/types/feed";
import { AppSession } from "~/types/session";
import { FeedFilterValues } from "./FeedFilter/type";
import { UserModel } from "~/types/user";
import { prettyObject } from "~/utils/common";
import { startOfDay, addDays } from "date-fns";

export type FeedContextValue = {
  feedData: UseInfiniteQueryResult<
    InfiniteData<TableResponse<FeedModel>, unknown>
  >;
  feeds: FeedModel[];
  session: AppSession | null;
  users: UserModel[];
  onFilter: (value: FeedFilterValues) => void;
  containerRef: Ref<HTMLDivElement | null>;
};

const FeedContext = React.createContext<FeedContextValue | undefined>(
  undefined
);
const THRESHOLD = 40;
const REARM_GAP = 200;

export function serializeFilters(f: FeedFilterValues) {
  return {
    title: f.title?.trim() || undefined,
    description: f.description?.trim() || undefined,
    createdBy: f.createdBy || undefined,
    from: f.from ? startOfDay(f.from).toISOString() : undefined,
    to: f.to ? addDays(startOfDay(f.to), 1).toISOString() : undefined,
  };
}

export default function FeedProvider({
  children,
  session = null,
}: {
  children: React.ReactNode;
  session: AppSession | null;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<FeedFilterValues>({});
  const PAGE_SIZE = 8;
  const armedRef = useRef(true);
  const serialized = useMemo(() => serializeFilters(filters), [filters]);
  const feedData = useInfiniteQuery({
    queryKey: ["feed", serialized],
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        ...serialized, // ✅ dùng object đã serialize
        page: String(pageParam),
        pageSize: String(PAGE_SIZE),
      };
      const { data } = await httpClient.get<TableResponse<FeedModel>>(
        "/api/feed",
        { params }
      );
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pageSize, count } = lastPage;
      const hasNext = page * pageSize < count;
      return hasNext ? page + 1 : undefined;
    },
  });

  const { data: users } = useQuery<UserModel[]>({
    initialData: [],
    queryKey: ["users"],
    queryFn: async () => httpClient.get("/api/user").then((res) => res.data),
  });

  const feeds = useMemo(() => {
    if (!feedData.data) return [];
    return feedData.data.pages.flatMap((page) => page.items);
  }, [feedData.data]);

  const onFilter = (values: FeedFilterValues) => {
    setFilters(values);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const dist = el.scrollHeight - el.scrollTop - el.clientHeight;

        // Re-arm: chỉ khi user kéo NGƯỢC lên đủ xa khỏi đáy
        if (!armedRef.current && dist > THRESHOLD + REARM_GAP) {
          armedRef.current = true;
        }

        // Trigger chỉ khi đã “lên cò” + chạm đáy
        if (
          armedRef.current &&
          dist <= THRESHOLD &&
          feedData.hasNextPage &&
          !feedData.isFetchingNextPage
        ) {
          armedRef.current = false; // disarm ngay để không bắn liên tiếp
          feedData.fetchNextPage();
        }
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
    // chỉ theo dõi các cờ của query
  }, [feedData.hasNextPage, feedData.isFetchingNextPage]);

  return (
    <FeedContext.Provider
      value={{ feedData, feeds, session, onFilter, users, containerRef }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export function useFeedCtx() {
  const ctx = React.useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be used within <FeedProvider>");
  return ctx;
}
