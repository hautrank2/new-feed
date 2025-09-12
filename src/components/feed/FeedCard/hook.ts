import { FeedModel } from "~/types/feed";
import { FeedCardProps } from ".";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import httpClient from "~/api/httpClient";

export const useFeedCard = ({ feedId }: FeedCardProps) => {
  const { data: feed, refetch } = useQuery({
    queryKey: ["feedId", feedId],
    queryFn: () =>
      httpClient.get<FeedModel>(`/api/feed/${feedId}`).then((res) => res.data),
  });

  const [openComment, setOpenComment] = useState<FeedModel | null>(null);

  const handleOpenComment = (feed: FeedModel) => {
    setOpenComment(feed);
  };

  const handleCloseComment = (fetch?: boolean) => {
    if (refetch) {
      refetch();
    }
    setOpenComment(null);
  };

  return { handleOpenComment, handleCloseComment, openComment, feed };
};
