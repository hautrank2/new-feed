// app/api/feed/[id]/heart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { readJsonFile, writeJsonFile } from "~/utils/file";
import { FeedModel } from "~/types/feed";
import { AppJWT } from "~/types/session";

const FEED_PATH = "src/data/feed.json";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })) as AppJWT | null;

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await ctx.params;
    const feeds = await readJsonFile<FeedModel[]>(FEED_PATH);
    const feed = feeds.find((f) => f.id === id);

    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    // đảm bảo tym luôn là mảng
    feed.tym = Array.isArray(feed.tym) ? feed.tym : [];

    let liked: boolean;
    if (feed.tym.includes(token.id)) {
      feed.tym = feed.tym.filter((u) => u !== token.id);
      liked = false;
    } else {
      feed.tym.push(token.id);
      liked = true;
    }

    await writeJsonFile(FEED_PATH, feeds);

    return NextResponse.json({
      ...feed,
      liked,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to toggle heart" },
      { status: 500 }
    );
  }
}
