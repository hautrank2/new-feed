import { FeedAction, FeedState } from "./type";

export const feedReducer = (
  state: FeedState,
  action: FeedAction
): FeedState => {
  switch (action.type) {
    default:
      return state;
  }
};
