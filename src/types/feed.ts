import { UserModel } from "./user";

export type FeedModel = {
  id: string;
  title: string;
  desc: string;
  imgs: [];
  tym: string[];
  liked: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  user?: UserModel;
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

export type PatchFeedDto = FeedModel;
