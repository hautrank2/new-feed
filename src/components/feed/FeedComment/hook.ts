import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AxiosResponse } from "axios";
import httpClient from "~/api/httpClient";
import { useFeed } from "../context";
import { CommentModel, CreateCommentDto } from "~/types/feed";

const commentSchema = z.object({
  content: z.string().trim().min(1, "Comment cannot be empty"),
});
type CommentFormValues = z.infer<typeof commentSchema>;

type FeedCommentProps = {
  feedData: { id: string };
};

export const useFeedComment = ({ feedData }: FeedCommentProps) => {
  const [replyingCmtId, setReplyingCmtId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const { session } = useFeed();

  const queryKey = ["feed", "comments", feedData.id] as const;

  // GET comments
  const { data = [] } = useQuery({
    initialData: [],
    queryKey,
    queryFn: () =>
      httpClient
        .get<CommentModel[]>("/api/comment", {
          params: { feedId: feedData.id },
        })
        .then((res) => res.data),
  });

  // Form
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  // Mutation POST comment
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (payload: {
      content: string;
      parentId: string | null;
    }) => {
      const body: CreateCommentDto = {
        feedId: feedData.id,
        content: payload.content,
        parentId: payload.parentId,
        authorId: session?.user.id ?? null,
      };
      const res = await httpClient.post<CommentModel>("/api/comment", body);
      return res.data;
    },

    // Optimistic update
    onMutate: async ({ content, parentId }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<CommentModel[]>(queryKey) ?? [];
      const tempId = `temp-${crypto.randomUUID?.() ?? Date.now()}`;

      const optimisticItem: CommentModel = {
        id: tempId,
        feedId: feedData.id,
        content,
        createdAt: new Date().toISOString(),
        parentId: parentId ?? null,
        authorId: session?.user.id ?? null,
      };

      queryClient.setQueryData<CommentModel[]>(queryKey, (old = []) => [
        optimisticItem,
        ...old,
      ]);

      return { previous, tempId };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData<CommentModel[]>(queryKey, ctx.previous);
      }
    },

    onSuccess: (serverItem, _vars, ctx) => {
      // Replace temp by server item
      queryClient.setQueryData<CommentModel[]>(queryKey, (old = []) =>
        old.map((c) => (c.id === ctx?.tempId ? serverItem : c))
      );
    },

    onSettled: () => {
      // Nếu muốn đồng bộ tuyệt đối với server
      // queryClient.invalidateQueries({ queryKey });
    },
  });

  const onSubmit = (values: CommentFormValues) => {
    mutate(
      { content: values.content, parentId: replyingCmtId },
      {
        onSuccess: () => {
          form.reset({ content: "" });
          setReplyingCmtId(null);
          inputRef.current?.focus();
        },
      }
    );
  };

  const onReply = (cmt: CommentModel) => {
    setReplyingCmtId(cmt.id);
    // focus input để gõ nhanh
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const cancelReply = () => setReplyingCmtId(null);

  useEffect(() => {
    if (replyingCmtId) {
      inputRef.current?.focus();
    }
  }, [replyingCmtId]);

  return {
    data,
    form,
    onSubmit,
    inputRef,
    onReply,
    cancelReply,
    replyingCmtId,
    isPosting: isPending,
    postError: error as unknown,
  };
};
