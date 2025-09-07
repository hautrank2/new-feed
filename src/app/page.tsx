import { Feed } from "~/components/feed";
import { auth } from "~/lib/auth";
import { AppSession } from "~/types/session";

export const HomePage = async () => {
  const session = await auth();
  return <Feed session={session as AppSession} />;
};

export default HomePage;
