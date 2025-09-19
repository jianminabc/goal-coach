import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { goal, language } = await req.json();

    // 檢查 API Key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API Key is missing");
    }

    // 在 handler 內初始化 OpenAI 客戶端
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 支援的語言指令
    const langMap: Record<string, string> = {
      "zh-TW": "請用繁體中文回答",
      "zh-CN": "请用简体中文回答",
      "en": "Please answer in English",
      "ja": "日本語で答えてください",
      "ko": "한국어로 답변해주세요",
    };
    const langInstruction = langMap[language] ?? langMap["zh-TW"];

    // 呼叫 OpenAI Responses API
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

    // 取得文字輸出
    let text = response.output_text ?? "{}";

    // 移除可能出現的 Markdown 區塊符號
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // 嘗試解析 JSON
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
