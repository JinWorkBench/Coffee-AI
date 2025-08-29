import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "OPENAI_API_KEY가 존재하지 않습니다." }, { status: 500 });
  }

  // 하드 코딩 (기본)
  const model = "gpt-4o-mini";

  // 프롬프트 입력 받기
  const { prompt } = await req.json();
  const input = String(prompt ?? "").trim();
  if (!input) {
    return Response.json({ error: "prompt가 비어 있습니다." }, { status: 400 });
  }

  const response = await client.responses.create({ model, input });

  // 결과 텍스트 반환
  return Response.json({ text: response.output_text });
}