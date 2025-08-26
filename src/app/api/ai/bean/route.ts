import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "OPENAI_API_KEY가 존재하지 않습니다." }, { status: 500 });
  }

  // 하드 코딩 (기본)
  const model = "gpt-4o-mini";
  const input = "에티오피아 시다모 G1 아르베고나 물루게타 문타샤 레게제 LOT 내추럴";

  const response = await client.responses.create({ model, input });

  // 결과 텍스트 반환
  return Response.json({ text: response.output_text });
}