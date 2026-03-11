import { NextRequest, NextResponse } from "next/server";

import { getFinance, saveFinance, type FinanceSnapshot } from "@/services/database";

export const runtime = "nodejs";

export async function GET() {
  const snapshot = await getFinance();
  return NextResponse.json(snapshot);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<FinanceSnapshot>;

  if (
    body.essentials === undefined ||
    body.wants === undefined ||
    body.savings === undefined ||
    body.totalAmount === undefined
  ) {
    return NextResponse.json(
      { error: "Missing finance fields" },
      { status: 400 },
    );
  }

  const snapshot: FinanceSnapshot = {
    monthLabel: body.monthLabel ?? "",
    essentials: body.essentials,
    wants: body.wants,
    savings: body.savings,
    totalAmount: body.totalAmount,
  };

  await saveFinance(snapshot);
  return NextResponse.json(snapshot);
}

