import { useQuery } from "@tanstack/react-query";
import { FeedCommentProps } from ".";
import httpClient from "~/api/httpClient";
import { CommentModel } from "~/types/feed";

export const useFeedComment = ({ feedData }: FeedCommentProps) => {
  const { data } = useQuery<CommentModel[]>({
    queryKey: ["feed", "comments"],
    initialData: [],
    queryFn: () =>
      httpClient
        .get<CommentModel[]>(
          `/api/comment?${new URLSearchParams({
            feedId: feedData.id,
          }).toString()}`
        )
        .then((res) => res.data),
  });

  return {
    data,
  };
};
