export type VarietyKey = "geisha" | "pink_bourbon";

const KEYWORDS: Record<VarietyKey, string[]> = {
  geisha: ["게이샤", "게샤", "geisha", "gesha"],
  pink_bourbon: ["핑크 버번", "핑크버번", "핑크 부르봉", "pink bourbon", "pinkbourbon", "pink borbon"],
};

const PHRASE: Record<VarietyKey, string> = {
  geisha: "게이샤(Geisha) 품종 특유의 풍부하고 섬세한 향미가 느껴집니다",
  pink_bourbon: "핑크 버번(Pink Bourbon) 품종 특유의 좋은 단맛과 은은한 꽃향이 매력적입니다",
};

export function detectVariety(raw: string): { key: VarietyKey; phrase: string } | null {
  const t = (raw || "").toLowerCase();                    
  for (const key of ["geisha", "pink_bourbon"] as VarietyKey[]) { 
    if (KEYWORDS[key].some(w => t.includes(w.toLowerCase()))) {   
      return { key, phrase: PHRASE[key] };                        
    }
  }
  return null;                                                    
}