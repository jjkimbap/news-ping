"use client";

import { useEffect, useState } from "react";
import type { MatchNotificationDto } from "@newkey/shared";
import { notificationsApi } from "@/lib/api/notifications";

export default function NotificationsPage() {
  const [items, setItems] = useState<MatchNotificationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsApi
      .list()
      .then((res) => setItems(res.items))
      .finally(() => setLoading(false));
  }, []);

  async function handleMarkRead(id: string) {
    await notificationsApi.markRead(id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }

  if (loading) return <p className="text-sm text-gray-500">불러오는 중...</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">나의 키워드 알림</h1>
        <button
          onClick={async () => {
            await notificationsApi.markAllRead();
            setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
          }}
          className="text-sm text-gray-500 underline"
        >
          모두 읽음 처리
        </button>
      </div>

      <ul className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
        {items.map((n) => (
          <li key={n.id} className={`py-3 ${n.isRead ? "opacity-60" : ""}`}>
            <a
              href={n.article.url}
              target="_blank"
              onClick={() => handleMarkRead(n.id)}
              className="font-medium hover:underline"
            >
              {n.article.title}
            </a>
            <div className="mt-1 flex flex-wrap gap-1">
              {n.matchedKeywords.map((k) => (
                <span key={k} className="rounded-full bg-black/5 px-2 py-0.5 text-xs dark:bg-white/10">
                  #{k}
                </span>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {n.article.source} · {new Date(n.sentAt).toLocaleString("ko-KR")}
            </p>
          </li>
        ))}
        {items.length === 0 && (
          <li className="py-3 text-sm text-gray-500">아직 도착한 알림이 없습니다.</li>
        )}
      </ul>
    </div>
  );
}
