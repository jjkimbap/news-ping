import { config } from "../../../common/config.js";

interface KakaoTokenResponse {
  access_token: string;
}

interface KakaoUserResponse {
  id: number;
  kakao_account?: {
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
}

export interface ProviderProfile {
  providerUid: string;
  nickname: string;
  profileImage: string | null;
}

export async function fetchKakaoProfile(code: string): Promise<ProviderProfile> {
  const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: config.kakao.clientId,
      redirect_uri: config.kakao.redirectUri,
      code,
      // Client Secret이 비활성화된 앱이면 값이 비어 있으므로 생략한다. 활성화된 앱은 필수이며,
      // 누락 시 카카오 토큰 발급이 KOE101(invalid_client)로 실패한다.
      ...(config.kakao.clientSecret ? { client_secret: config.kakao.clientSecret } : {}),
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`카카오 토큰 발급 실패: ${tokenRes.status}`);
  }
  const { access_token: accessToken } = (await tokenRes.json()) as KakaoTokenResponse;

  const profileRes = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!profileRes.ok) {
    throw new Error(`카카오 프로필 조회 실패: ${profileRes.status}`);
  }
  const profile = (await profileRes.json()) as KakaoUserResponse;

  return {
    providerUid: String(profile.id),
    nickname: profile.kakao_account?.profile?.nickname ?? "카카오 사용자",
    profileImage: profile.kakao_account?.profile?.profile_image_url ?? null,
  };
}
