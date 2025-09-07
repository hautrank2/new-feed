import { JWT } from "next-auth/jwt";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "~/types/user";

const MAX_AGE = +(process.env.NEXTAUTH_MAXAGE || 60 * 60 * 24 * 30);
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: MAX_AGE,
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn(props: any) {
      const { account, profile } = props;
      if (account?.provider === "google") {
        return true;
      }
      return true;
    },
    jwt({ token, ...rest }) {
      console.log("callbacks token", token, rest);
      return token;
    },
    session({ session, token }) {
      console.log("callbacks session", session, token);
      session.user = token as User & JWT;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
