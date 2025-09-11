import { NextRequest, NextResponse } from "next/server";
import { CommentModel } from "~/types/feed";
import { readJsonFile, writeJsonFile } from "~/utils/file";

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const comments: CommentModel[] = await readJsonFile<CommentModel[]>(
      "src/data/comment.json"
    ).catch(() => []);

    const index = comments.findIndex((c) => c.id === id);
    if (index === -1)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const deleteCmt = comments.splice(index, 1);
    await writeJsonFile("src/data/comment.json", comments);

    return NextResponse.json(deleteCmt, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
