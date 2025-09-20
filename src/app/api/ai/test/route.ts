// src/app/api/ai/test.ts
import { NextResponse } from "next/server";

// 簡單的 CORS 設定
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  // 處理 preflight 請求
  return new NextResponse(null, { headers: corsHeaders });
}

export async function GET() {
  return new NextResponse(
    JSON.stringify({ message: "API 可以運作，但請使用 POST 送資料" }),
    { status: 200, headers: corsHeaders }
  );
}

export async function POST(req: Request) {
  try {
    const { goal, language } = await req.json();

    return new NextResponse(
      JSON.stringify({
        success: true,
        goal,
        language,
        message: "測試 API 成功！",
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
