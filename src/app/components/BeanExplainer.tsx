'use client';

import { useState } from 'react';

export default function Page() {
  const [prompt, setPrompt] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setText('');
    try {
      const res = await fetch('/api/ai/bean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || '서버 오류');
      setText(data.text ?? '(응답 없음)');
    } catch (e: any) {
      setText('요청 실패: ' + (e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 mt-5 max-w-xl mx-auto border rounded">
      <textarea value={prompt} onChange={(e)=>setPrompt(e.target.value)} className="w-full h-28 border rounded p-3" placeholder="프롬프트 입력" />
      <button onClick={run} disabled={loading} className="mt-3 px-3 py-2 border rounded">
        {loading ? '생성 중…' : '생성하기'}
      </button>
      <pre className="mt-3 whitespace-pre-wrap border rounded p-3 min-h-[60px]">{text}</pre>
    </main>
  );
}
