import { AppSession } from "~/types/session";
import FeedProvider from "./context";
import { FeedPage } from "./FeedPage";

export * from "./FeedPage";

export type FeedProps = {
  session: AppSession;
};
export const Feed = ({ session }: FeedProps) => {
  return (
    <FeedProvider session={session}>
      <FeedPage />
    </FeedProvider>
  );
};
