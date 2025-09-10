import { Session } from "next-auth";
import { UserModel } from "./user";

export type AppSession = Session & {
  user: UserModel;
};
