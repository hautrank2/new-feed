import { Session } from "next-auth";
import { User } from "./user";

export type AppSession = Session & {
  user: User;
};
