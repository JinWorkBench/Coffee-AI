import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const RULE = [
  "너는 커피 원두 제품명 분석기야. 가능한 말투(~합니다/~했습니다)로 답변해 줘",
  "입력으로 주어진 '원두 제품명'에 포함된 정보만 사용하고, 임의 추정 및 창작은 금지",
  "아래 ‘출력 형식(마크다운)’을 정확히 지켜줘.",
  "",
  "[출력 형식(마크다운)]",
  "- 지역: 국가 > 지역 > 세부지역 순으로 가능한 범위만 기입, 없으면 없는 부분만 미표기",
  "- 농장: 농장/생산자",
  "- 고도: '####m' 또는 '####–####m' 범위(en-dash, m 단위)",
  "- 품종: 원두의 품종",
  "- 가공 방식: 내추럴/워시드/허니/아나에어로빅/카보닉 매서레이션 등 한국어 표기로 통일",
  "- 컵노트: 원두의 향미",
].join("\n");
export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "OPENAI_API_KEY가 존재하지 않습니다." }, { status: 500 });
  }

  // 하드 코딩 (기본)
  const model = "gpt-4o-mini";

  // 프롬프트 입력 받기
  const { prompt } = await req.json();
  const user = String(prompt ?? "").trim();
  if (!user) {
    return Response.json({ error: "prompt가 비어 있습니다." }, { status: 400 });
  }

  // 규칙 + 사용자 입력
  const input = `${RULE}\n\n---\n사용자 입력:\n${user}`;

  const response = await client.responses.create({ model, input });

  // 결과 텍스트 반환
  return Response.json({ text: response.output_text });
}