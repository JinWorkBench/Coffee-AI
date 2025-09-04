import OpenAI from "openai";
import { detectProcess } from "@/lib/coffee/process";
import { detectVariety } from "@/lib/coffee/variety";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "OPENAI_API_KEY가 존재하지 않습니다." },
      { status: 500 },
    );
  }

  const model = "gpt-4o-mini";

  const raw = await req.json().catch(() => ({}));
  const r = raw as Record<string, unknown>;
  const prompt = typeof r.prompt === "string" ? r.prompt : undefined;
  const name = typeof r.name === "string" ? r.name : undefined;
  const cupnote = typeof r.cupnote === "string" ? r.cupnote : undefined;

  const userText = (prompt ?? name ?? "").trim();
  if (!userText) {
    return Response.json({ error: "prompt가 비어 있습니다." }, { status: 400 });
  }

  const sourceForDetect =
    [name ?? "", cupnote ?? ""].join(" ").trim() || userText;
  const proc = detectProcess(sourceForDetect);
  const variety = detectVariety(sourceForDetect);

  const facts = {
    name: name ?? userText,
    cupnote: cupnote ?? null,
    process_phrase: proc?.phrase ?? null,
    variety_phrase: variety?.phrase ?? null,
  };

  const response = await client.responses.create({
    model,
    input: [
      {
        role: "system",
        content: [
          "입력 받은 원두 제품명의 정보를 요약해서 출력",
          "한국어로 4~5 문장으로 작성",
          "process_phrase가 null이면 가공 방식 언급을 생략",
          "variety_phrase가 null이면 품종 언급을 생략",
          "입력은 문자열(prompt) 또는 JSON({name,cupnote})일 수 있음",
          "cupnote가 제공됐으면 단어를 그대로 전달하지 말고 정보를 토대로 맛의 방향/느낌으로 자연스럽게 반영, 없으면 언급 생략",
          "언급을 생략하는 과정에서 생략과 관련된 표현 금지",
        ].join("\n"),
      },
      { role: "user", content: userText },
      {
        role: "user",
        content: JSON.stringify({ facts }),
      },
    ],
  });

  // 결과 텍스트 반환
  return Response.json({
    text: (response.output_text ?? "").trim(),
  });
}
