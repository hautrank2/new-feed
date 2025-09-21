import "server-only";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { UserModel } from "~/types/user";

type SessionPayload = JWTPayload;

export const getUserData = (localStorage: Storage): UserModel | null => {
  const localData = localStorage.getItem("userData");
  if (localData && localData !== "undefined") {
    return JSON.parse(localData) as UserModel;
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
