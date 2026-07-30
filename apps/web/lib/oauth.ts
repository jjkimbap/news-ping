function buildUrl(base: string, params: Record<string, string>) {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
}

export function getKakaoAuthorizeUrl() {
  return buildUrl("https://kauth.kakao.com/oauth/authorize", {
    client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? "",
    redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ?? "",
    response_type: "code",
  });
}

export function getNaverAuthorizeUrl(state: string) {
  return buildUrl("https://nid.naver.com/oauth2.0/authorize", {
    client_id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ?? "",
    redirect_uri: process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI ?? "",
    response_type: "code",
    state,
  });
}
