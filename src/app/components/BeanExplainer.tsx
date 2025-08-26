'use client';

import { useState } from 'react';

export default function Page() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setText('');
    try {
      const res = await fetch('/api/ai/bean', { method: 'POST' });
      if (!res.ok) throw new Error('서버 오류');
      const data = await res.json();
      setText(data.text ?? '(응답 없음)');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setText('요청 실패: ' + message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 mt-5 max-w-xl mx-auto border border-[#e5e7eb] rounded-lg">
      <button onClick={run} disabled={loading} className="px-3 py-2 border rounded">
        {loading ? '생성 중…' : '생성하기'}
      </button>
      <pre className="mt-3 whitespace-pre-wrap border rounded p-3 min-h-[60px]">{text}</pre>
    </main>
  );
}