export type ProcessKey = "washed" | "natural" | "honey" | "pulped" | "anaerobic" | "carbonic" | "other";

const KEYWORDS: Record<ProcessKey, string[]> = {
  washed:   ["워시드", "washed"],
  natural:  ["내추럴", "natural"],
  honey:    ["허니", "honey"],
  pulped:   ["펄프드", "펄프드 내추럴", "pulped natural", "pulped"],
  anaerobic:["언에어로빅", "아나에어로빅", "에네로빅", "무산소", "무산소 발효", "anaerobic"],
  carbonic: ["카보닉", "카보닉 매서레이션", "cm", "carbonic", "maceration"],
  other:    ["더블 워시드", "세미 워시드", "experimental", "experimental process"]
};

// 산미를 제외한 향미 표현
const PHRASE: Record<ProcessKey, string> = {
  washed:   "워시드 가공으로 단맛이 적고 산미가 산뜻하며, 바디감이 가볍고 깔끔한 맛을 선사함",
  natural:  "내추럴 가공으로 과일향과 단맛이 강하고, 바디감이 있으며, 다채로운 향을 선사함",
  honey:    "점액질 제거 정도에 따라 차이가 있고, 부드럽고 깔끔한 단맛과 산미를 선사함",
  pulped:   "풍부한 단맛과 깔끔한 산미가 조화롭고 균형 잡힌 맛을 선사함",
  anaerobic:"풍부한 과일향과 독특하고 강렬한 산미가 복합적이고 와인 같은 향을 선사함",
  carbonic: "풍부한 과일향과 독특하고 강렬한 산미가 복합적이고 와인 같은 향을 선사함",
  other:    "개성 있는 가공 특성이 드러납니다"
};

export function detectProcess(raw: string): { key: ProcessKey; phrase: string; } | null {
  const t = (raw || "").toLowerCase();
  for (const key of ["washed","natural","honey","pulped","anaerobic","carbonic","other"] as ProcessKey[]) {
    if (KEYWORDS[key].some(k => t.includes(k.toLowerCase()))) {
      return { key, phrase: PHRASE[key] };
    }
  }
  return null;
}