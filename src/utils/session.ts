import { User } from "~/types/user";
import "server-only";
import { SignJWT, jwtVerify } from "jose";

type SessionPayload = {};

export const getUserData = (localStorage: Storage): User | null => {
  const localData = localStorage.getItem("userData");
  if (localData && localData !== "undefined") {
    return JSON.parse(localData) as User;
  }
  return null;
};

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = "",
  secret = encodedKey
) {
  try {
    const result = await jwtVerify(session, secret, {
      algorithms: ["HS256"],
    });
    return result.payload;
  } catch {
    console.log("Failed to verify session");
  }
}
