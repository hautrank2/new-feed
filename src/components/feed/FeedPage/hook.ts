"use client";

import { useQuery } from "@tanstack/react-query";
import { TableResponse, TableResponseBase } from "~/types/api";
import httpClient from "~/api/httpClient";
import { FeedModel } from "~/types/feed";
import { useState } from "react";

export const useFeedPage = () => {
  const [openComment, setOpenComment] = useState<FeedModel | null>(null);

  const handleOpenComment = (feed: FeedModel) => {
    setOpenComment(feed);
  };

  const handleCloseComment = () => {
    setOpenComment(null);
  };

  return {
    openComment,
    handleOpenComment,
    handleCloseComment,
  };
};
