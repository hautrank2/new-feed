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

export type FeedCardProps = {
  feedId: string;
};
export const FeedCard = (props: FeedCardProps) => {
  const { feed, handleOpenComment, handleCloseComment, openComment } =
    useFeedCard(props);

  return feed ? (
    <Card>
      <CardHeader>
        <CardTitle>{feed.title}</CardTitle>
        <CardDescription>{feed.desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <ImageGrid imgs={feed.imgs} objectFit="cover" />
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-center w-full gap-2">
          <Button className="flex-1" variant={"ghost"}>
            <Heart />
            Heart ({feed.tym.length})
          </Button>
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
