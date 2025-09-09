import { NextRequest, NextResponse } from "next/server";
import { CommentModel } from "~/types/feed";
import { UserModel } from "~/types/user";
import { readJsonFile } from "~/utils/file";

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

export function buildCommentTreeWithUser(
  list: CommentModel[],
  users: UserModel[]
): CommentModel[] {
  // Map user theo username (trùng với authorId)
  const userMap = new Map<string, UserModel>();
  users.forEach((u) => userMap.set(u.username, u));

  // sort theo thời gian để output ổn định
  const sorted = [...list].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // khởi tạo node có kèm author
  const nodeMap = new Map<string, CommentModel>();
  const roots: CommentModel[] = [];

  for (const c of sorted) {
    nodeMap.set(c.id, {
      ...c,
      author: userMap.get(c.authorId) ?? null,
      children: [],
    });
  }

  // gắn con vào cha
  for (const node of nodeMap.values()) {
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children!.push(node);
      } else {
        // nếu dữ liệu thiếu cha -> đẩy lên root để không mất dữ liệu
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}
