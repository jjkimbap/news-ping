import { apiClient } from "./client";

export interface UserProfileDto {
  id: string;
  nickname: string;
  onboardingCompleted: boolean;
  createdAt: string;
  readonly: {
    provider: "kakao" | "naver";
    profileImage: string | null;
  };
}

export const userApi = {
  getMe: () => apiClient.get<UserProfileDto>("/users/me"),
  updateMe: (input: { nickname?: string }) => apiClient.patch<UserProfileDto>("/users/me", input),
  completeOnboarding: () =>
    apiClient.post<UserProfileDto>("/users/me/onboarding-complete"),
  registerPushToken: (token: string) =>
    apiClient.post<void>("/users/me/push-tokens", { token }),
};
