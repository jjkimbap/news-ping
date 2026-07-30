import jwt from "jsonwebtoken";
import { config } from "../../common/config.js";
import { userRepository } from "../../db/repositories/user.repository.js";
import { fetchKakaoProfile } from "./providers/kakao.js";
import { fetchNaverProfile } from "./providers/naver.js";
import type { ProviderProfile } from "./providers/kakao.js";

const SESSION_TTL = "30d";

async function loginWithProfile(provider: "kakao" | "naver", profile: ProviderProfile) {
  const user = await userRepository.upsertFromProvider({
    provider,
    providerUid: profile.providerUid,
    nickname: profile.nickname,
    profileImage: profile.profileImage,
  });

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: SESSION_TTL });
  return { user, token };
}

export const authService = {
  async loginWithKakao(code: string) {
    const profile = await fetchKakaoProfile(code);
    return loginWithProfile("kakao", profile);
  },

  async loginWithNaver(code: string, state: string) {
    const profile = await fetchNaverProfile(code, state);
    return loginWithProfile("naver", profile);
  },

  async me(userId: string) {
    return userRepository.findById(userId);
  },
};
