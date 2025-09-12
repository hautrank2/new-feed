"use client";

import React from "react";
import { useFeed } from "../context";
import { useFeedPage } from "./hook";
import { FeedCard } from "../FeedCard";
import { cn } from "~/lib/utils";

export const FeedPage = () => {
  const { feedData, feeds } = useFeed();
  const {} = useFeedPage();

  return (
    <div className="mt-[var(--header-height)] pt-8 container mx-auto max-w-4xl pb-8">
      {/* filter */}
      <ul className="px-4">
        {feeds.map((feed, index) => {
          const isFirst = index === 0;
          return (
            <li key={feed.id + index} className={cn(isFirst ? "" : "mt-4")}>
              <FeedCard feedId={feed.id} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
