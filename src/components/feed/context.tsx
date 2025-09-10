"use client";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import React, { useMemo, useReducer } from "react";
import httpClient from "~/api/httpClient";
import { TableResponse, TableResponseBase } from "~/types/api";
import { FeedModel } from "~/types/feed";
import { AppSession } from "~/types/session";

export type FeedContextValue = {
  feedData: UseInfiniteQueryResult<
    InfiniteData<TableResponse<FeedModel>, unknown>
  >;
  feeds: FeedModel[];
  session: AppSession | null;
};

const FeedContext = React.createContext<FeedContextValue | undefined>(
  undefined
);

export default function FeedProvider({
  children,
  session = null,
}: {
  children: React.ReactNode;
  session: AppSession | null;
}) {
  const PAGE_SIZE = 10;
  const feedData = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam = 1 }) =>
      httpClient
        .get<TableResponse<FeedModel>>(
          `/api/feed?${new URLSearchParams({
            page: pageParam.toString(),
            pageSize: PAGE_SIZE.toString(),
          }).toString()}`
        )
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pageSize, count } = lastPage;
      const hasNext = page * pageSize < count;
      return hasNext ? page + 1 : undefined;
    },
  });

  console.log(feedData.data);

  const feeds = useMemo(() => {
    if (!feedData.data) return [];
    return feedData.data.pages.flatMap((page) => page.items);
  }, [feedData.data]);

  return (
    <FeedContext.Provider value={{ feedData, feeds, session }}>
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const ctx = React.useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be used within <FeedProvider>");
  return ctx;
}
