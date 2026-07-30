import { config } from "../../../common/config.js";
import type { ProviderProfile } from "./kakao.js";

interface NaverTokenResponse {
  access_token: string;
}

interface NaverUserResponse {
  response: {
    id: string;
    nickname?: string;
    profile_image?: string;
  };
}

export async function fetchNaverProfile(code: string, state: string): Promise<ProviderProfile> {
  const tokenUrl = new URL("https://nid.naver.com/oauth2.0/token");
  tokenUrl.searchParams.set("grant_type", "authorization_code");
  tokenUrl.searchParams.set("client_id", config.naver.clientId);
  tokenUrl.searchParams.set("client_secret", config.naver.clientSecret);
  tokenUrl.searchParams.set("code", code);
  tokenUrl.searchParams.set("state", state);

  const tokenRes = await fetch(tokenUrl, { method: "POST" });
  if (!tokenRes.ok) {
    throw new Error(`네이버 토큰 발급 실패: ${tokenRes.status}`);
  }
  const { access_token: accessToken } = (await tokenRes.json()) as NaverTokenResponse;

  const profileRes = await fetch("https://openapi.naver.com/v1/nid/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!profileRes.ok) {
    throw new Error(`네이버 프로필 조회 실패: ${profileRes.status}`);
  }
  const { response } = (await profileRes.json()) as NaverUserResponse;

  return {
    providerUid: response.id,
    nickname: response.nickname ?? "네이버 사용자",
    profileImage: response.profile_image ?? null,
  };
}
