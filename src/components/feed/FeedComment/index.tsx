import { CommentModel, FeedModel } from "~/types/feed";
import { useFeedComment } from "./hook";
import { Avatar } from "~/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Typography } from "~/components/ui/typography";
import { formatDateTime } from "~/utils/datetime";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { Controller } from "react-hook-form";

export type FeedCommentProps = {
  feedData: FeedModel;
};

export const FeedComment = (props: FeedCommentProps) => {
  const { data, form, onSubmit, inputRef, onReply } = useFeedComment(props);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div>
      <ul>
        {data.map((item) => {
          return (
            <li key={item.id} className="mt-2">
              <FeedCommentItem
                cmtData={item}
                onReply={() => {
                  onReply(item);
                }}
              />
            </li>
          );
        })}
      </ul>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sticky bottom-0 bg-background inset-x-0 flex justify-between gap-2 mt-2 p-2"
      >
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
        <Button type="submit" variant="outline" disabled={isSubmitting}>
          <SendHorizonal size={18} />
        </Button>
      </form>

      {errors.content && (
        <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
      )}
    </div>
  );
};

const FeedCommentItem = ({
  cmtData,
  onReply,
}: {
  cmtData: CommentModel;
  onReply: () => void;
}) => {
  return (
    <div>
      {cmtData.author && (
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={cmtData.author.avatarUrl} />
            <AvatarFallback>{cmtData.author.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="w-full">
            <div className="p-2 bg-foreground/5 w-full rounded-lg">
              <Typography variant={"p"} className="font-semibold">
                {cmtData.author.name}
              </Typography>
              <Typography variant={"p"}>{cmtData.content}</Typography>
            </div>
            <div className="flex items-center">
              <Typography variant={"p"} className="text-sm px-2">
                {formatDateTime(cmtData.createdAt)}
              </Typography>
              {cmtData.parentId ?? (
                <Button
                  variant="ghost"
                  size={"sm"}
                  className="hover:bg-transparent hover:underline"
                  onClick={() => onReply()}
                >
                  Reply
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
