import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import httpClient from "~/api/httpClient";
import { useFeedCtx } from "../context";
import { CommentModel, CreateCommentDto } from "~/types/feed";

const commentSchema = z.object({
  content: z.string().trim().min(1, "Comment cannot be empty"),
});
export type CommentFormValues = z.infer<typeof commentSchema>;

type FeedCommentProps = {
  feedData: { id: string };
};

export const useFeedComment = ({ feedData }: FeedCommentProps) => {
  const [replyingCmt, setReplyingCmt] = useState<CommentModel | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { session } = useFeedCtx();

  const queryKey = ["feed", "comments", feedData.id] as const;

  // GET comments
  const { data = [], refetch } = useQuery({
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
        parentId: payload.parentId ?? undefined,
        authorId: session?.user.id ?? "",
      };
      const res = await httpClient.post<CommentModel>("/api/comment", body);
      return res.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const { mutate: deleteMutate, isPending: deleteLoading } = useMutation({
    mutationFn: async (id: string) => {
      const res = await httpClient.delete<CommentModel>(`/api/comment/${id}`);
      return res.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const loading = useMemo(
    () => deleteLoading || isPending,
    [isPending, deleteLoading]
  );

  const onSubmit = (values: CommentFormValues) => {
    mutate(
      { content: values.content, parentId: replyingCmt?.id ?? null },
      {
        onSuccess: () => {
          form.reset({ content: "" });
          const scrollToOptions: ScrollToOptions = {
            behavior: "smooth",
            top: 4,
          };
          if (!!replyingCmt) {
            document.getElementById(replyingCmt.id)?.scrollTo(scrollToOptions);
          } else {
            containerRef.current?.scrollTo(scrollToOptions);
          }
          setReplyingCmt(null);
        },
      }
    );
  };

  const handleDelete = (item: CommentModel) => {
    deleteMutate(item.id);
  };

  const onReply = (cmt: CommentModel) => {
    setReplyingCmt(cmt);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const cancelReply = () => {
    setReplyingCmt(null);
  };

  useEffect(() => {
    if (replyingCmt) {
      inputRef.current?.focus();
    }
  }, [replyingCmt]);

  return {
    data,
    form,
    onSubmit,
    inputRef,
    containerRef,
    onReply,
    cancelReply,
    replyingCmt,
    isPosting: isPending,
    handleDelete,
    postError: error as unknown,
    loading,
  };
};
