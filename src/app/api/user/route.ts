import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "~/types/user";
import { readJsonFile, writeJsonFile } from "~/utils/file";

export async function POST(req: NextRequest) {
  try {
    const dto = (await req.json()) as UserModel;
    if (!dto) {
      return NextResponse.json(
        { error: "Request body is missing" },
        { status: 400 }
      );
    }

    const users = await readJsonFile<UserModel[]>("src/data/user.json");

    // Nếu muốn check trùng email/id
    const exists = users.find((u) => u.id === dto.id || u.email === dto.email);
    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    users.push(dto);
    await writeJsonFile("src/data/user.json", users);

    return NextResponse.json(users, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = (await readJsonFile<UserModel[]>("src/data/user.json")) ?? [];
    return NextResponse.json(users, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
