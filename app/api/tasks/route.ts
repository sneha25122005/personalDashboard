import { NextRequest, NextResponse } from "next/server";

import { getTasks, saveTasks, type TaskItem } from "@/services/database";

export const runtime = "nodejs";

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as TaskItem[];

  if (!Array.isArray(body)) {
    return NextResponse.json(
      { error: "Body must be an array of tasks" },
      { status: 400 },
    );
  }

  await saveTasks(body);
  return NextResponse.json({ ok: true });
}

