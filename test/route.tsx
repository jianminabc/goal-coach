import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "✅ Vercel API 正常運作！",
    time: new Date().toISOString(),
  });
}
