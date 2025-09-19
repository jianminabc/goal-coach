import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { goal } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `請將這個大目標 "${goal}" 拆分成中目標和小目標，JSON 格式輸出。`,
      }),
    });

    const data = await response.json();
    // 依照 Responses API 回傳格式拿到文字結果
    const result = data.output_text || JSON.stringify(data, null, 2);

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: "生成失敗" });
  }
}
