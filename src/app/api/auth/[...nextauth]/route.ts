import { JWT } from "next-auth/jwt";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialPovider from "next-auth/providers/credentials";
import { decrypt, encrypt } from "~/lib/session";
import { IUser } from "~/types/user";
import httpClient from "~/api/httpClient";

const MAX_AGE = +(process.env.NEXTAUTH_MAXAGE || 10);
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "";
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialPovider({
      name: "Credentials",
      credentials: {
        username: { label: "Name", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const res = await httpClient.post(`${API_ENDPOINT}/auth/signin`, {
            username: credentials?.username,
            password: credentials?.password,
          });
          const userData = await res.data;
          console.log("user", userData);
          return userData.user;
        } catch {
          throw new Error("Username or password incorret!");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: MAX_AGE,
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    maxAge: MAX_AGE,
    encode: async (params) => {
      const { token } = params;
      try {
        const user = (await userService.findByFilter({ email: token?.email }))
          .data;
        console.log("endcode", user);
        return await encrypt({
          ...user,
          name: token?.name || "",
          email: token?.email || "",
        });
      } catch {
        // Nếu không tìm thấy user, vẫn mã hóa với name + email có sẵn
        return await encrypt({
          name: token?.name || "",
          email: token?.email || "",
        });
      }
    },
    async decode(params): Promise<JWT | null> {
      // params = {
      //   token: string;
      //   secret: string;
      // }
      const decrypted = await decrypt(params.token);
      return decrypted || null;
    },
  },
  callbacks: {
    async signIn(data) {
      const { email } = data.user;
      try {
        const exist = await userService.findByFilter({ email });
        if (exist) {
          return true;
        }
        await userService.signupByEmail(email || "");
        return true;
      } catch (err) {
        console.log(err);
      }
      return false;
    },
    jwt({ token, user, account, ...rest }) {
      console.log("callbacks token", token, user, account, rest);
      return token;
    },
    async session({ session, token, ...rest }) {
      session.user = token as IUser & JWT;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
