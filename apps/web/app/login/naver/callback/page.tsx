"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";

export default function NaverCallbackPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-sm text-gray-500">불러오는 중...</p>}>
      <NaverCallbackHandler />
    </Suspense>
  );
}

function NaverCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code || !state) return;

    const expectedState = sessionStorage.getItem("naver_oauth_state");
    const loginResult =
      state === expectedState
        ? authApi.loginWithNaver(code, state)
        : Promise.reject(new Error("STATE_MISMATCH"));

    loginResult
      .then((user) => {
        sessionStorage.removeItem("naver_oauth_state");
        router.replace(user.onboardingCompleted ? "/" : "/onboarding");
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error && e.message === "STATE_MISMATCH"
            ? "네이버 로그인 요청이 올바르지 않습니다."
            : "네이버 로그인에 실패했습니다.",
        );
      });
  }, [router, code, state]);

  return (
    <p className="py-16 text-center text-sm text-gray-500">
      {error ?? (code && state ? "로그인 처리 중입니다..." : "네이버 로그인 요청이 올바르지 않습니다.")}
    </p>
  );
}
