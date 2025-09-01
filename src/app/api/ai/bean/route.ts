import OpenAI from "openai";
import { detectProcess } from "@/lib/coffee/process";
import { detectVariety } from "@/lib/coffee/variety";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "OPENAI_API_KEY가 존재하지 않습니다." }, { status: 500 });
  }

  const model = "gpt-4o-mini";

  const { prompt } = await req.json();
  const user = String(prompt ?? "").trim();
  if (!user) {
    return Response.json({ error: "prompt가 비어 있습니다." }, { status: 400 });
  }

  const proc = detectProcess(user);
  const variety = detectVariety(user);

  const facts = {
    name: user,
    process_phrase: proc?.phrase ?? null,
    variety_phrase: variety?.phrase ?? null,
  };

  const response = await client.responses.create({ 
    model,
    input: [
      {
        role:"system",
        content: [
          "입력 받은 원두 제품명의 정보를 요약해서 출력",
          "한국어로 4~5 문장으로 작성",
          "process_phrase가 null이면 가공 방식 언급을 생략",
          "varietal_phrase가 null이면 품종 언급을 생략",
          "너가 아는 컵노트를 기반으로 맛의 방향성을 제시",
          "언급을 생략하는 과정에서 포함되어 있지 않다는 식의 표현 금지"
        ].join("\n"),
      },
      { 
        role: "user",
        content: JSON.stringify({ facts })
      },
    ],
  });

  // 결과 텍스트 반환
  return Response.json({
    text: (response.output_text ?? "").trim()
  });
}