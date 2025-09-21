import { FeedModel } from "~/types/feed";
import { FeedCardProps } from ".";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import httpClient from "~/api/httpClient";
import { ToggleHeart } from "./HeartBtn";
import { useFeedCtx } from "../context";

export const useFeedCard = ({ feedId }: FeedCardProps) => {
  const { session } = useFeedCtx();
  const {
    data: feed,
    refetch,
    isFetching: loading,
  } = useQuery({
    queryKey: ["feedId", feedId],
    queryFn: () =>
      httpClient.get<FeedModel>(`/api/feed/${feedId}`).then((res) => res.data),
  });

  const [openComment, setOpenComment] = useState<FeedModel | null>(null);

  const handleOpenComment = (feed: FeedModel) => {
    setOpenComment(feed);
  };

  const handleCloseComment = () => {
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
    } catch (err) {
      console.log(err);
    }
    return {
      liked: false,
      count: 0,
    };
  };

  return {
    session,
    handleOpenComment,
    handleCloseComment,
    openComment,
    feed,
    handleToggleHeart,
    loading,
  };
};
