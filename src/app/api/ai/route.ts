// src/app/api/ai/test/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

// CORS 設定
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // 可以限制來源，例如改成 "https://your-framer-site.com"
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ 支援 GET（瀏覽器直接打開）
export async function GET() {
  return NextResponse.json(
    { message: "✅ API 正常運作，請使用 POST 送資料" },
    { headers: corsHeaders }
  );
}

// ✅ 支援 POST（AI Coach 功能）
export async function POST(req: Request) {
  try {
    const { goal, language } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API Key is missing");
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const langMap: Record<string, string> = {
      "zh-TW": "請用繁體中文回答",
      "zh-CN": "请用简体中文回答",
      "en": "Please answer in English",
      "ja": "日本語で答えてください",
      "ko": "한국어로 답변해주세요",
    };
    const langInstruction = langMap[language] ?? langMap["zh-TW"];

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
你是一個 AI 目標教練。
請將以下大目標拆解成 2-3 個中目標，每個中目標再拆解成 2-3 個小目標。

**分類標準：**
- 小目標 (SubGoal)：1 天~1 週可完成，只需個人努力，屬於練習與經驗累積。
- 中目標 (MidGoal)：2 週~3 個月可完成，需要協作或資源，屬於里程碑與階段性成就。
- 大目標 (MainGoal)：最終成果，需整合所有中目標的能力與資源。

**額外要求：**
- 每個目標都要包含：
  - "timeframe": 預估完成所需時間
  - "resourceLevel": "個人" 或 "協作"
  - "growthLevel": "練習" / "里程碑" / "成就"
- 嚴格只回傳 JSON。
- 不要加任何註解、說明、Markdown 語法。
- 不要出現 \`\`\`json 或 \`\`\`。
- 使用雙引號，確保 JSON 可直接 JSON.parse()。

JSON 格式範例：
{
  "title": "大目標",
  "midGoals": [
    {
      "id": "mid-1",
      "title": "中目標名稱",
      "timeframe": "2 個月",
      "resourceLevel": "協作",
      "growthLevel": "里程碑",
      "subGoals": [
        {
          "id": "sub-1",
          "title": "小目標名稱",
          "timeframe": "3 天",
          "resourceLevel": "個人",
          "growthLevel": "練習",
          "completed": false
        }
      ]
    }
  ]
}

大目標：${goal}
${langInstruction}
      `,
    });

    let text = response.output_text ?? "{}";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(text);

    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// ✅ 處理 OPTIONS (CORS 預檢請求)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
