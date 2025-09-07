import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const name = searchParams.get("name") ?? undefined;
  const username = searchParams.get("username") ?? email?.split("@").shift();

  if (!email) {
    return NextResponse.json({ error: "'email' is required" }, { status: 400 });
  }

  const found = await findUserByEmail(email);
  if (found) {
    return NextResponse.json({ user: found, created: false });
  }

  const created = await upsertUserByEmail({ email, name, username });
  return NextResponse.json({ user: created, created: true });
}
