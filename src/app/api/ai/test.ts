// src/app/api/ai/test.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { goal, language } = await req.json();

    return NextResponse.json({
      success: true,
      goal,
      language,
      message: "測試 API 成功！",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
