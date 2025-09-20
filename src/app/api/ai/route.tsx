import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { goal, language } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("❌ OpenAI API Key is missing (環境變數沒設定)");
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

    const prompt = `
你是一個 AI 目標教練。
請將以下大目標拆解成 2-3 個中目標，每個中目標再拆解成 2-3 個小目標。
**分類標準：**
- 小目標 (SubGoal)：1 天~1 週可完成，只需個人努力，屬於練習與經驗累積。
- 中目標 (MidGoal)：2 週~3 個月可完成，需要協作或資源，屬於里程碑與階段性成就。
- 大目標 (MainGoal)：最終成果，需整合所有中目標的能力與資源。

**額外要求：**
- 嚴格只回傳 JSON，不要有任何問候或說明文字。
- 每個目標都要包含：
  - "timeframe": 預估完成所需時間
  - "resourceLevel": "個人" 或 "協作"
  - "growthLevel": "練習" / "里程碑" / "成就"
- 嚴格使用雙引號，確保 JSON 可直接 JSON.parse()。

大目標：${goal}
${langInstruction}
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    // 取得文字輸出
    let text = response.output_text ?? "{}";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // 嘗試從文字中抓取最外層 JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
