import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import ImageGrid from "~/components/ui/image-grid";
import { Button } from "~/components/ui/button";

import { useFeedCard } from "./hook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { FeedComment } from "../FeedComment";
import { HeartButton } from "./HeartBtn";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { formatDateTime } from "~/utils/datetime";
import { Typography } from "~/components/ui/typography";
import { Skeleton } from "~/components/ui/skeleton";

export type FeedCardProps = {
  feedId: string;
};
export const FeedCard = (props: FeedCardProps) => {
  const {
    session,
    feed,
    handleOpenComment,
    handleCloseComment,
    openComment,
    handleToggleHeart,
    loading,
  } = useFeedCard(props);

  return feed ? (
    loading ? (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-24" />
      </div>
    ) : (
      <Card className="pb-0">
        <CardHeader>
          {feed.user && (
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={feed.user.image} alt={feed.user.name} />
                <AvatarFallback>{feed.user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{feed.user.name}</CardTitle>
                <CardDescription>{`${feed.user.email} - ${formatDateTime(
                  feed.createdAt
                )}`}</CardDescription>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Typography variant={"h4"} className="mb-2">
              {feed.title}
            </Typography>
            <Typography variant={"p"}>{feed.desc}</Typography>
          </div>
          <ImageGrid imgs={feed.imgs} objectFit="cover" />
        </CardContent>
        <CardFooter className="border-t p-2!">
          <div className="flex items-center justify-center w-full gap-2">
            <HeartButton
              count={feed.tym.length}
              liked={feed.liked}
              onToggleHeart={handleToggleHeart}
              disabled={!session}
            />
            <Button
              className="flex-1"
              variant={"ghost"}
              onClick={() => handleOpenComment(feed)}
              disabled={!session}
            >
              Comment
            </Button>
          </div>
        </CardFooter>
        <Dialog
          open={!!openComment}
          onOpenChange={(open) => {
            if (!open) {
              handleCloseComment();
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px] md:max-w-[60vw] lg:max-w-[40vw]">
            <DialogHeader>
              <DialogTitle>Comment</DialogTitle>
            </DialogHeader>
            <div className="max-h-[80vh]">
              {openComment && <FeedComment feedData={openComment} />}
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    )
  ) : (
    <div data-testid="feed-null" className="feed-null"></div>
  );
};
