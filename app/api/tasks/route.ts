import { NextRequest, NextResponse } from "next/server";

import {
  getTasks,
  saveTasks,
  type TaskItem,
  updateDailyLog,
} from "@/services/database";

export const runtime = "nodejs";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

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

  const tasksTotal = body.length;
  const tasksCompleted = body.filter((t) => t.category === "completed").length;

  await updateDailyLog(todayISO(), {
    tasksTotal,
    tasksCompleted,
  });

  return NextResponse.json({ ok: true });
}

