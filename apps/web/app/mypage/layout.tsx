"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { ApiRequestError } from "@/lib/api/client";

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    authApi
      .me()
      .then(() => setChecked(true))
      .catch((e) => {
        if (e instanceof ApiRequestError && e.status === 401) {
          router.replace("/login");
          return;
        }
        setChecked(true);
      });
  }, [router]);

  if (!checked) return null;

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex gap-4 border-b border-black/10 pb-3 text-sm dark:border-white/10">
        <Link href="/mypage/notifications">알림 리스트</Link>
        <Link href="/mypage/keywords">키워드 설정</Link>
        <Link href="/mypage/profile">개인정보 수정</Link>
      </nav>
      {children}
      <footer className="mt-8 flex flex-wrap gap-3 border-t border-black/10 pt-4 text-xs text-gray-500 dark:border-white/10">
        <Link href="/policy/about">서비스 소개</Link>
        <Link href="/policy/terms">이용약관</Link>
        <Link href="/policy/privacy">개인정보처리방침</Link>
        <Link href="/policy/contact">문의</Link>
      </footer>
    </div>
  );
}
