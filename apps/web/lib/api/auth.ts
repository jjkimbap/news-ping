import type { UserDto } from "@newkey/shared";
import { apiClient } from "./client";

export const authApi = {
  loginWithKakao: (code: string) => apiClient.post<UserDto>("/auth/kakao/callback", { code }),
  loginWithNaver: (code: string, state: string) =>
    apiClient.post<UserDto>("/auth/naver/callback", { code, state }),
  logout: () => apiClient.post<void>("/auth/logout"),
  me: () => apiClient.get<UserDto>("/auth/me"),
};
