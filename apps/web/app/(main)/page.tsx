"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ArticleDto, TrendingKeywordDto } from "@newkey/shared";
import { newsApi } from "@/lib/api/news";
import { statsApi } from "@/lib/api/stats";

export default function MainPage() {
  const [articles, setArticles] = useState<ArticleDto[]>([]);
  const [trending, setTrending] = useState<TrendingKeywordDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([newsApi.listLatest(), statsApi.trending()])
      .then(([news, stats]) => {
        setArticles(news.items);
        setTrending(stats.items);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-500">불러오는 중...</p>;

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">최근 24시간 급상승 키워드</h2>
        <ul className="flex flex-wrap gap-2">
          {trending.map((k) => (
            <li
              key={k.keywordText}
              className="rounded-full bg-black/5 px-3 py-1 text-sm dark:bg-white/10"
            >
              #{k.keywordText} ({k.mentionCount})
            </li>
          ))}
          {trending.length === 0 && (
            <li className="text-sm text-gray-500">아직 집계된 데이터가 없습니다.</li>
          )}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">최신 뉴스</h2>
        <ul className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
          {articles.map((article) => (
            <li key={article.id} className="py-3">
              <Link href={article.url} target="_blank" className="font-medium hover:underline">
                {article.title}
              </Link>
              <p className="mt-1 text-xs text-gray-500">
                {article.source} · {new Date(article.publishedAt).toLocaleString("ko-KR")}
              </p>
            </li>
          ))}
          {articles.length === 0 && (
            <li className="py-3 text-sm text-gray-500">아직 수집된 뉴스가 없습니다.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
