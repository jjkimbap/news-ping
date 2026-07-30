"use client";

import { useEffect, useState } from "react";
import { MAX_KEYWORDS_PER_USER, type KeywordDto } from "@newkey/shared";
import { keywordsApi } from "@/lib/api/keywords";
import { ApiRequestError } from "@/lib/api/client";

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<KeywordDto[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    keywordsApi
      .list()
      .then((res) => setKeywords(res.items))
      .finally(() => setLoading(false));
  }, []);

  const isFull = keywords.length >= MAX_KEYWORDS_PER_USER;

  async function handleAdd() {
    if (!input.trim()) return;
    setError(null);
    try {
      const created = await keywordsApi.create(input.trim());
      setKeywords((prev) => [...prev, created]);
      setInput("");
    } catch (e) {
      setError(e instanceof ApiRequestError ? e.message : "키워드 등록에 실패했습니다.");
    }
  }

  async function handleRemove(id: string) {
    await keywordsApi.remove(id);
    setKeywords((prev) => prev.filter((k) => k.id !== id));
  }

  if (loading) return <p className="text-sm text-gray-500">불러오는 중...</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">
        키워드 설정 ({keywords.length}/{MAX_KEYWORDS_PER_USER})
      </h1>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isFull}
          placeholder={isFull ? "기존 키워드를 수정 또는 삭제해주세요" : "키워드를 입력하세요"}
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm disabled:opacity-50 dark:border-white/10"
        />
        <button
          onClick={handleAdd}
          disabled={isFull}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          등록
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <ul className="flex flex-wrap gap-2">
        {keywords.map((k) => (
          <li
            key={k.id}
            className="flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-sm dark:bg-white/10"
          >
            {k.keywordText}
            <button onClick={() => handleRemove(k.id)} className="text-gray-400 hover:text-black dark:hover:text-white">
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
