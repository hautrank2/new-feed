import { UserModel } from "./user";

export type FeedModel = {
  id: string;
  title: string;
  desc: string;
  imgs: [];
  createdAt: string;
  tym: string[];
};

export type CommentModel = {
  id: string;
  feedId: string;
  authorId: string;
  content: string;
  createdAt: string;
  parentId: string | null;

  // When GET DATA have:
  author?: UserModel | null;
  children?: CommentModel[];
};

export type CreateCommentDto = {
  feedId: string;
  authorId: string;
  content: string;
  parentId?: string;
};
