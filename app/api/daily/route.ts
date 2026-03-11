import { NextRequest, NextResponse } from "next/server";

import { getDailyLogs, saveDailyLog } from "@/services/database";
import type { DailyLog } from "@/types/DailyLog";

export const runtime = "nodejs";

export async function GET() {
  const logs = await getDailyLogs();
  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<DailyLog>;

  if (!body.date) {
    return NextResponse.json(
      { error: "Missing 'date' in body" },
      { status: 400 },
    );
  }

  const entry: DailyLog = {
    date: body.date,
    mood: body.mood ?? 3,
    stress: body.stress ?? 3,
    energy: body.energy ?? 3,
    note: body.note ?? "",
    sleepHours: body.sleepHours ?? 0,
  };

  await saveDailyLog(entry);

  return NextResponse.json(entry, { status: 201 });
}

