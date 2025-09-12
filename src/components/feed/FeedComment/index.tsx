import { CommentModel, FeedModel } from "~/types/feed";
import { useFeedComment } from "./hook";
import { Avatar } from "~/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Typography } from "~/components/ui/typography";
import { formatDateTime } from "~/utils/datetime";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { OctagonX, SendHorizonal, Trash2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { Badge } from "~/components/ui/badge";
import { useFeedCtx } from "../context";

export type FeedCommentProps = {
  feedData: FeedModel;
};

export const FeedComment = (props: FeedCommentProps) => {
  const {
    data,
    form,
    onSubmit,
    replyingCmt,
    cancelReply,
    inputRef,
    onReply,
    containerRef,
    handleDelete,
    loading,
  } = useFeedComment(props);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;
  return (
    <div ref={containerRef} className="h-full overflow-y-auto relative">
      <ul>
        {data.map((item, index) => {
          return (
            <li id={item.id} key={item.id + index} className="mt-2">
              <FeedCommentItem
                loading={loading}
                cmtData={item}
                onReply={() => {
                  onReply(item);
                }}
                onDelete={() => {
                  handleDelete(item);
                }}
              />
            </li>
          );
        })}
      </ul>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sticky items-center bottom-0 bg-background inset-x-0 flex justify-between gap-2 mt-2 p-2"
      >
        {replyingCmt && (
          <Badge variant={"outline"}>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => cancelReply()}
            >
              <OctagonX />
            </Button>
            {replyingCmt.author?.name}
          </Badge>
        )}
        <Controller
          name="content"
          control={form.control}
          render={({ field }) => (
            <Input
              {...field} // must pass value, onChange, onBlur, name
              ref={inputRef}
              placeholder="Write a comment..."
              className="flex-1"
            />
          )}
        />
        <Button
          type="submit"
          variant="outline"
          disabled={isSubmitting || loading}
        >
          <SendHorizonal size={18} />
        </Button>
      </form>

      {errors.content && (
        <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
      )}
    </div>
  );
};

type FeedCommentItemProps = {
  cmtData: CommentModel;
  onReply?: () => void; // chỉ dùng cho cấp 1
  depth?: number; // mặc định 0 = cấp 1
  onDelete: (value: CommentModel) => void;
  loading: boolean;
};
const getInitials = (name?: string | null) =>
  (name ?? "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "U";

const FeedCommentItem = ({
  cmtData,
  onReply,
  depth = 0,
  onDelete,
  loading,
}: FeedCommentItemProps) => {
  const { session } = useFeedCtx();
  const canReply = depth === 0 && !!onReply;
  const authorName = cmtData.author?.name ?? "User";
  const authorImage = cmtData.author?.image ?? undefined;

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={authorImage} alt={authorName} />
          <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
        </Avatar>

        <div className="w-full">
          <div className="p-2 bg-foreground/5 w-full rounded-lg relative">
            <Typography variant="p" className="font-semibold mr-2">
              {authorName}
            </Typography>
            {cmtData.author?.email === session?.user.email && (
              <Button
                disabled={loading}
                variant={"ghost"}
                size={"sm"}
                className="absolute top-0 right-0"
                onClick={() => onDelete(cmtData)}
              >
                <Trash2 />
              </Button>
            )}
            <Typography variant="p">{cmtData.content}</Typography>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Typography
              variant="p"
              className="text-xs text-muted-foreground px-2"
            >
              {formatDateTime(cmtData.createdAt)}
            </Typography>

            {canReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 hover:bg-transparent hover:underline"
                onClick={onReply}
                disabled={loading}
              >
                Reply
              </Button>
            )}
          </div>
        </div>
      </div>

      {!!cmtData.children?.length && (
        <div className="ml-12 space-y-2">
          {cmtData.children.map((child) => (
            <FeedCommentItem
              key={child.id}
              cmtData={child}
              depth={depth + 1}
              onDelete={onDelete}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
};
