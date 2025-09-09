import { CommentModel, FeedModel } from "~/types/feed";
import { useFeedComment } from "./hook";
import { AvatarGroup } from "~/components/ui/shadcn-io/avatar-group";
import { Avatar } from "~/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Typography } from "~/components/ui/typography";
import { formatDateTime } from "~/utils/datetime";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SendHorizonal } from "lucide-react";

export type FeedCommentProps = {
  feedData: FeedModel;
};

export const FeedComment = (props: FeedCommentProps) => {
  const { data } = useFeedComment(props);
  return (
    <div className="relative">
      <ul>
        {data.map((item) => {
          return (
            <li key={item.id} className="mt-2">
              <FeedCommentItem cmtData={item} onReply={() => {}} />
            </li>
          );
        })}
      </ul>

      <div className="sticky top-full inset-x-0 flex justify-between gap-2 mt-2">
        <Input />
        <Button variant={"outline"}>
          <SendHorizonal />
        </Button>
      </div>
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
