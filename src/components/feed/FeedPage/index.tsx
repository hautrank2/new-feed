"use client";

import React from "react";
import { useFeed } from "../context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";
import ImageGrid from "~/components/ui/image-grid";
import { Button } from "~/components/ui/button";
import { Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useFeedPage } from "./hook";
import { FeedComment } from "../FeedComment";

export const FeedPage = () => {
  const { feedData, feeds } = useFeed();
  const { handleOpenComment, handleCloseComment, openComment } = useFeedPage();

  return (
    <div className="mt-[var(--header-height)] pt-8 container mx-auto max-w-4xl pb-8">
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
            <CardFooter>
              <div className="flex items-center justify-center w-full gap-2">
                <Button className="flex-1" variant={"ghost"}>
                  <Heart />
                  Like
                </Button>
                <Button
                  className="flex-1"
                  variant={"ghost"}
                  onClick={() => handleOpenComment(feed)}
                >
                  Comment
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}

      <Dialog
        open={!!openComment}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseComment();
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px] md:max-w-[60vw] lg:max-w-[40vw]">
          <DialogHeader>
            <DialogTitle>Comment</DialogTitle>
          </DialogHeader>
          <div className="max-h-[80vh] overflow-y-auto relative">
            {openComment && <FeedComment feedData={openComment} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
