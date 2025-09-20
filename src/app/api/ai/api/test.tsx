import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 呼叫公開 API 測試
    const res = await fetch("https://catfact.ninja/fact");
    const data = await res.json();

    return NextResponse.json({
      success: true,
      source: "catfact.ninja",
      fact: data.fact,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
