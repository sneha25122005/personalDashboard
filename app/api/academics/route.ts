import { NextRequest, NextResponse } from "next/server";

import {
  getAcademics,
  saveAcademics,
  type AcademicItem,
} from "@/services/database";

export const runtime = "nodejs";

export async function GET() {
  const items = await getAcademics();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as AcademicItem[];

  if (!Array.isArray(body)) {
    return NextResponse.json(
      { error: "Body must be an array of academic items" },
      { status: 400 },
    );
  }

  await saveAcademics(body);
  return NextResponse.json({ ok: true });
}

