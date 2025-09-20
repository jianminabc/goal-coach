import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { goal, language } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("❌ OpenAI API Key is missing (環境變數沒設定)");
    }

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
      input: `大目標：${goal}\n${langInstruction}`,
    });

    let text = response.output_text ?? "{}";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
