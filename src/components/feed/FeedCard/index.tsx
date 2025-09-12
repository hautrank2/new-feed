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
import { Heart } from "lucide-react";

import { useFeedCard } from "./hook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { FeedComment } from "../FeedComment";
import { Separator } from "~/components/ui/separator";
import { HeartButton } from "./HeartBtn";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Image from "next/image";
import { formatDateTime } from "~/utils/datetime";
import { Typography } from "~/components/ui/typography";

export type FeedCardProps = {
  feedId: string;
};
export const FeedCard = (props: FeedCardProps) => {
  const {
    feed,
    handleOpenComment,
    handleCloseComment,
    openComment,
    handleToggleHeart,
  } = useFeedCard(props);

  return feed ? (
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
          />
          <Button
            className="flex-1"
            variant={"ghost"}
            onClick={() => handleOpenComment(feed)}
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
  ) : (
    <div></div>
  );
};
