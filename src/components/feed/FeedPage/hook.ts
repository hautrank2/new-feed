"use client";

import { FeedModel } from "~/types/feed";
import { useState } from "react";

export const useFeedPage = () => {
  const [openComment, setOpenComment] = useState<FeedModel | null>(null);

  const handleOpenComment = (feed: FeedModel) => {
    setOpenComment(feed);
  };

  const handleCloseComment = (refetch?: boolean) => {
    setOpenComment(null);
  };

  return {
    openComment,
    handleOpenComment,
    handleCloseComment,
  };
};
