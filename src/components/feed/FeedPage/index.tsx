"use client";

import React from "react";
import { useFeedCtx } from "../context";
import { useFeedPage } from "./hook";
import { FeedCard } from "../FeedCard";
import { cn } from "~/lib/utils";
import { FeedFilter } from "../FeedFilter";
import { Skeleton } from "~/components/ui/skeleton";

export const FeedPage = () => {
  const { feedData, feeds, containerRef } = useFeedCtx();
  const {} = useFeedPage();
  return (
    <div
      ref={containerRef}
      className="mt-[var(--header-height)] pt-8 pb-8 min-h-[calc(100vh-var(--header-height))] h-[calc(100vh-var(--header-height))] overflow-y-auto"
    >
      {/* filter */}
      <FeedFilter />
      <ul className="px-4 container mx-auto max-w-4xl">
        {feeds.map((feed, index) => {
          const isFirst = index === 0;
          return (
            <li key={feed.id + index} className={cn(isFirst ? "" : "mt-4")}>
              <FeedCard feedId={feed.id} />
            </li>
          );
        })}
      </ul>
      {feedData.isFetching && (
        <div className="flex space-y-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        </div>
      )}
    </div>
  );
};
