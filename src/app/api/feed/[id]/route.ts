import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { FeedModel, PatchFeedDto } from "~/types/feed";
import { AppJWT } from "~/types/session";
import { getFilePath, readJsonFile, writeJsonFile } from "~/utils/file";

const FEED_PATH = getFilePath("src/data/feed.json");
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })) as AppJWT | null;

    const { id } = await ctx.params;
    const feeds = await readJsonFile<FeedModel[]>(FEED_PATH);
    const find = feeds.find((e) => e.id === id);
    if (find) {
      find.liked = token ? find.tym.includes(token.id) : false;
      return NextResponse.json(find);
    }
    return NextResponse.json({ error: "Feed not found" }, { status: 404 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to read comments" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET, // đồng bộ với NextAuth
    })) as AppJWT | null;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dto = (await req.json()) as PatchFeedDto | null;
    const { id } = await ctx.params;
    if (!dto || !id) {
      return NextResponse.json(
        { error: "Bad request: payload invalid" },
        { status: 400 }
      );
    }

    const feeds = await readJsonFile<FeedModel[]>(FEED_PATH);
    const index = feeds.findIndex((e) => e.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    feeds[index] = dto;
    await writeJsonFile(FEED_PATH, feeds);
    return NextResponse.json(dto, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to read comments" },
      { status: 500 }
    );
  }
}
