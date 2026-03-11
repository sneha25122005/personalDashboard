import { NextRequest, NextResponse } from "next/server";

// Simple upload endpoint that accepts form-data and
// returns basic info about the uploaded files.
// This does NOT persist files on disk, so it is safe for deployment
// even on platforms without writable file systems.

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const filesInfo: { field: string; filename: string }[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        filesInfo.push({
          field: key,
          filename: value.name,
        });
      }
    }

    return NextResponse.json(
      {
        ok: true,
        files: filesInfo,
        message:
          "Files received successfully. This endpoint only echoes metadata and does not store files.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to process upload" },
      { status: 500 },
    );
  }
}

