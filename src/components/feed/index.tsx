"use client";

import { AppSession } from "~/types/session";
import FeedProvider from "./context";
import { FeedPage } from "./FeedPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({});

export type FeedProps = {
  session: AppSession;
};
export const FeedView = ({ session }: FeedProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <FeedProvider session={session}>
        <FeedPage />
      </FeedProvider>
    </QueryClientProvider>
  );
};
