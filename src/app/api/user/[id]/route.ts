import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "~/types/user";
import { readJsonFile } from "~/utils/file";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const users = await readJsonFile<UserModel[]>("src/data/user.json");
    const find = users.find((e) => e.id === userId);
    if (find) {
      return NextResponse.json(find);
    }
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to read comments" },
      { status: 500 }
    );
  }
}
