"use client";

import { useState, useEffect, useCallback } from "react";

type Props = {
  beanName: string; // 원두 명
  cupnote?: string; // 컵노트
  fallbackDesc?: string; // API 실패 시 보여줄 기본 설명
};

export default function BeanSummary({
  beanName,
  cupnote,
  fallbackDesc,
}: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setErr(null);
    setText("");
    try {
      const body = {
        name: beanName,
        cupnote: cupnote ?? null,
      };

      const res = await fetch("/api/ai/bean", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "서버 오류");
      setText(data.text ?? "(응답 없음)");
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : typeof e === "string"
          ? e
          : "알 수 없는 오류";
      setErr(message);
      setText(fallbackDesc || "");
    } finally {
      setLoading(false);
    }
  }, [beanName, cupnote, fallbackDesc]);

  useEffect(() => {
    run();
  }, [run]);

  return (
    <div className="rounded-2xl border bg-white p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-700">AI 요약</h2>
        <button
          onClick={run}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50"
        >
          {loading ? "생성 중…" : "요약 생성"}
        </button>
      </div>

      {err && <p className="text-xs text-red-600">오류: {err}</p>}
      <pre className="whitespace-pre-wrap leading-relaxed text-neutral-800 min-h-[56px]">
        {text || "(생성 대기 중)"}
      </pre>
      <p className="text-[11px] text-neutral-500">
        ※ 데모/프리뷰 환경에서는 고정 응답 또는 실패 시 기본 설명으로 대체될 수
        있습니다.
      </p>
    </div>
  );
}
