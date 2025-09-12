import { NextRequest, NextResponse } from "next/server";
import { FeedModel } from "~/types/feed";
import { getFilePath, readJsonFile } from "~/utils/file";

const FEED_PATH = getFilePath("src/data/feed.json");
const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");

    const feedRes = await readJsonFile<FeedModel[]>(FEED_PATH);

    const count = feedRes.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = feedRes.slice(start, end);

    return NextResponse.json({
      count,
      page,
      pageSize,
      items,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to read feed" }, { status: 500 });
  }
}
