"use client";
import React, { useReducer } from "react";
import { AppSession } from "~/types/session";
import { feedReducer } from "./reducer";

export type FeedContextValue = {};

const FeedContext = React.createContext<FeedContextValue | undefined>(
  undefined
);

export default function FeedProvider({
  children,
  session = null,
}: {
  children: React.ReactNode;
  session: AppSession | null;
}) {
  const [state, dispatch] = useReducer(feedReducer, {
    session,
  });

  return (
    <FeedContext.Provider value={{ state, dispatch }}>
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const ctx = React.useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be used within <FeedProvider>");
  return ctx;
}
