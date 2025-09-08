export type FeedModel = {
  id: string;
  title: string;
  desc: string;
  imgs: [];
  createdAt: Date;
};

export type CommentModel = {
  id: string;
  feedId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  parentId?: string;
};
