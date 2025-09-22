import { FeedView } from "~/components/feed";
import { auth } from "~/lib/auth";
import { AppSession } from "~/types/session";

const HomePage = async () => {
  const session = await auth();
  return <FeedView session={session as AppSession} />;
};

export default HomePage;
