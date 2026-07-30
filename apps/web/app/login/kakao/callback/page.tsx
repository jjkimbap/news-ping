"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-sm text-gray-500">불러오는 중...</p>}>
      <KakaoCallbackHandler />
    </Suspense>
  );
}

function KakaoCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    authApi
      .loginWithKakao(code)
      .then((user) => {
        router.replace(user.onboardingCompleted ? "/" : "/onboarding");
      })
      .catch(() => setError("카카오 로그인에 실패했습니다."));
  }, [router, code]);

  return (
    <p className="py-16 text-center text-sm text-gray-500">
      {error ?? (code ? "로그인 처리 중입니다..." : "인가 코드가 없습니다.")}
    </p>
  );
}
