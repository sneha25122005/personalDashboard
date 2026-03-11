import { NextRequest, NextResponse } from "next/server";

import {
  getResources,
  saveResources,
  type ResourceItem,
} from "@/services/database";

export const runtime = "nodejs";

export async function GET() {
  const items = await getResources();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ResourceItem[];

  if (!Array.isArray(body)) {
    return NextResponse.json(
      { error: "Body must be an array of resources" },
      { status: 400 },
    );
  }

  await saveResources(body);
  return NextResponse.json({ ok: true });
}

