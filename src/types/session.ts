import { Session } from "next-auth";
import { UserModel } from "./user";

export type AppSession = Session & {
  user: UserModel;
};

export type AppJWT = {
  name: string;
  email: string;
  picture: string; // avatar key mặc định của NextAuth
  sub: string; // provider user id (Google sub)
  id: string; // id đã chuẩn hoá của bạn (trùng sub)
  image: string; // avatar key chuẩn hoá của bạn
  username: string;
  iat: number; // issued-at (Unix seconds)
  exp: number; // expires-at (Unix seconds)
  jti: string; // unique token id
};
