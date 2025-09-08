"use client";

import React from "react";
import { useFeed } from "../context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";
import ImageGrid from "~/components/ui/image-grid";

export const FeedPage = () => {
  const { feedData, feeds } = useFeed();

  return (
    <div className="mt-[var(--header-height)] pt-8 container mx-auto max-w-4xl">
      {feeds.map((feed, index) => {
        const isFirst = index === 0;
        return (
          <Card key={feed.id + index} className={cn(isFirst ? "" : "mt-4")}>
            <CardHeader>
              <CardTitle>{feed.title}</CardTitle>
              <CardDescription>{feed.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageGrid imgs={feed.imgs} objectFit="cover" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
