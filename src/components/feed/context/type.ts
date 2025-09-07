import { AppSession } from "~/types/session";

export type FeedState = {
  session: AppSession | null;
};

export type FeedAction = {
  type: string;
  payload: string;
};
