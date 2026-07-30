"use client";

import { getKakaoAuthorizeUrl, getNaverAuthorizeUrl } from "@/lib/oauth";

export default function LoginPage() {
  function handleNaverLogin() {
    const state = crypto.randomUUID();
    sessionStorage.setItem("naver_oauth_state", state);
    window.location.href = getNaverAuthorizeUrl(state);
  }

  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <h1 className="mb-4 text-xl font-semibold">간편 로그인</h1>
      <a
        href={getKakaoAuthorizeUrl()}
        className="w-64 rounded-lg bg-[#FEE500] px-4 py-3 text-center text-sm font-medium text-black"
      >
        카카오로 시작하기
      </a>
      <button
        onClick={handleNaverLogin}
        className="w-64 rounded-lg bg-[#03C75A] px-4 py-3 text-center text-sm font-medium text-white"
      >
        네이버로 시작하기
      </button>
    </div>
  );
}
