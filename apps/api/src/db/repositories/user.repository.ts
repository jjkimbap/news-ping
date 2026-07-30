import type { AuthProvider } from "@prisma/client";
import { prisma } from "../client.js";

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByProvider(provider: AuthProvider, providerUid: string) {
    return prisma.user.findUnique({
      where: { provider_providerUid: { provider, providerUid } },
    });
  },

  upsertFromProvider(input: {
    provider: AuthProvider;
    providerUid: string;
    nickname: string;
    profileImage: string | null;
  }) {
    return prisma.user.upsert({
      where: { provider_providerUid: { provider: input.provider, providerUid: input.providerUid } },
      create: input,
      // profileImage는 provider 원본이라 로그인마다 최신화하되, nickname은 사용자가 앱 내에서
      // 직접 수정할 수 있는 필드이므로 재로그인 시 provider 값으로 덮어쓰지 않는다.
      update: { profileImage: input.profileImage },
    });
  },

  updateProfile(id: string, data: { nickname?: string; notificationEnabled?: boolean }) {
    return prisma.user.update({ where: { id }, data });
  },

  markOnboardingCompleted(id: string) {
    return prisma.user.update({ where: { id }, data: { onboardingCompleted: true } });
  },
};
