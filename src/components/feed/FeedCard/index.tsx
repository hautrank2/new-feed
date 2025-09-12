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
        <CardTitle>{feed.title}</CardTitle>
        <CardDescription>{feed.desc}</CardDescription>
      </CardHeader>
      <CardContent>
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
