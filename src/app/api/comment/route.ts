import { randomUUID } from "crypto";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { CommentModel, CreateCommentDto } from "~/types/feed";
import { AppJWT } from "~/types/session";
import { UserModel } from "~/types/user";
import { readJsonFile, writeJsonFile } from "~/utils/file";

export async function GET(req: NextRequest) {
  try {
    const feedId = req.nextUrl.searchParams.get("feedId"); // optional

    const comments = await readJsonFile<CommentModel[]>(
      "src/data/comment.json"
    );
    const users = await readJsonFile<UserModel[]>("src/data/user.json");

    const filtered = feedId
      ? comments.filter((c) => c.feedId === feedId)
      : comments;

    const tree = buildCommentTreeWithUser(filtered, users);

    return NextResponse.json(tree);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to read comments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = (await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET, // đồng bộ với NextAuth
    })) as AppJWT | null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dto = (await req.json()) as CreateCommentDto | null;
    if (!dto || !dto.feedId || !dto.content?.trim()) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const comments: CommentModel[] = await readJsonFile<CommentModel[]>(
      "src/data/comment.json"
    ).catch(() => []);

    // Lấy authorId từ token (ưu tiên token.id do bạn đã chuẩn hoá, fallback sub)
    const authorId = token.id || token.sub;
    if (!authorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newComment: CommentModel = {
      id: randomUUID(),
      feedId: dto.feedId,
      authorId,
      content: dto.content.trim(),
      parentId: dto.parentId ?? null,
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    await writeJsonFile("src/data/comment.json", comments);

    return NextResponse.json(newComment, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
export function buildCommentTreeWithUser(
  list: CommentModel[],
  users: UserModel[]
): CommentModel[] {
  const userMap = new Map<string, UserModel>();
  users.forEach((u) => userMap.set(u.id, u));

  const sorted = [...list].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const nodeMap = new Map<string, CommentModel>();
  const roots: CommentModel[] = [];

  for (const c of sorted) {
    nodeMap.set(c.id, {
      ...c,
      author: userMap.get(c.authorId) ?? null,
      children: [],
    });
  }

  for (const node of nodeMap.values()) {
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children!.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}
