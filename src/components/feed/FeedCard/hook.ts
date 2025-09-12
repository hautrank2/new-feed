import { FeedModel } from "~/types/feed";
import { FeedCardProps } from ".";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import httpClient from "~/api/httpClient";
import { ToggleHeart } from "./HeartBtn";

export const useFeedCard = ({ feedId }: FeedCardProps) => {
  const { data: feed, refetch } = useQuery({
    queryKey: ["feedId", feedId],
    queryFn: () =>
      httpClient.get<FeedModel>(`/api/feed/${feedId}`).then((res) => res.data),
  });

  const {
    mutate: toggleHeartMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const res = await httpClient.post<FeedModel>(
        `/api/feed/${feedId}/toggleHeart`
      );
      return res.data;
    },
    onSuccess: () => {
      refetch();
    },
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

  const handleToggleHeart = async (): Promise<ToggleHeart> => {
    try {
      const res = await httpClient.post<FeedModel>(
        `/api/feed/${feedId}/toggleHeart`
      );
      return {
        liked: res.data.liked,
        count: res.data.tym.length,
      };
    } catch (err) {}
    return {
      liked: false,
      count: 0,
    };
  };

  return {
    handleOpenComment,
    handleCloseComment,
    openComment,
    feed,
    handleToggleHeart,
  };
};
