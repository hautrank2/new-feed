// app/api/feed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readJsonFile } from "~/utils/file";
import type { FeedModel } from "~/types/feed";

const FEED_PATH = "src/data/feed.json";

// helpers
const qp = (sp: URLSearchParams, key: string) => {
  const v = sp.get(key);
  if (v == null) return undefined;
  const t = v.trim();
  return t === "" || t === "undefined" ? undefined : t;
};
const parseISO = (s?: string) => {
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
};
const lower = (s?: string) => (s ?? "").toString().toLowerCase();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // paging
    const page = Math.max(1, Number(qp(searchParams, "page") ?? "1") || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number(qp(searchParams, "pageSize") ?? "10") || 10)
    );

    // filters
    const title = qp(searchParams, "title");
    const description = qp(searchParams, "description");
    const createdBy = qp(searchParams, "createdBy");
    // from: inclusive; to: exclusive (client đã gửi startOfDay(to)+1day)
    const from = parseISO(qp(searchParams, "from"));
    const to = parseISO(qp(searchParams, "to"));

    const feeds = await readJsonFile<FeedModel[]>(FEED_PATH);

    const fromTs = from?.getTime();
    const toTs = to?.getTime();
    const titleL = lower(title);
    const descL = lower(description);

    const filtered = feeds.filter((f) => {
      // time range
      const cat = f.createdAt ? new Date(f.createdAt).getTime() : NaN;
      if (fromTs !== undefined && !(cat >= fromTs)) return false;
      if (toTs !== undefined && !(cat < toTs)) return false;

      // text contains (case-insensitive)
      if (title && !lower(f.title).includes(titleL)) return false;
      if (description && !lower(f.desc).includes(descL)) return false;

      // createdBy exact match (string id)
      if (createdBy && f.createdBy !== createdBy) return false;

      return true;
    });

    const count = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = filtered.slice(start, end);

    return NextResponse.json({ count, page, pageSize, items });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to read feed" }, { status: 500 });
  }
}
