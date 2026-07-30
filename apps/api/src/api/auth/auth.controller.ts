import type { Response } from "express";
import type { AuthedRequest } from "../../common/middleware/auth.js";
import { Errors } from "../../common/errors.js";
import { authService } from "./auth.service.js";

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

function toUserDto(user: {
  id: string;
  provider: string;
  nickname: string;
  profileImage: string | null;
  notificationEnabled: boolean;
  onboardingCompleted: boolean;
  createdAt: Date;
}) {
  return {
    id: user.id,
    provider: user.provider,
    nickname: user.nickname,
    profileImage: user.profileImage,
    notificationEnabled: user.notificationEnabled,
    onboardingCompleted: user.onboardingCompleted,
    createdAt: user.createdAt.toISOString(),
  };
}

export const authController = {
  async kakaoCallback(req: AuthedRequest, res: Response) {
    const { code } = req.body;
    const { user, token } = await authService.loginWithKakao(code);
    res.cookie("session", token, SESSION_COOKIE_OPTIONS);
    res.json(toUserDto(user));
  },

  async naverCallback(req: AuthedRequest, res: Response) {
    const { code, state } = req.body;
    const { user, token } = await authService.loginWithNaver(code, state);
    res.cookie("session", token, SESSION_COOKIE_OPTIONS);
    res.json(toUserDto(user));
  },

  async logout(_req: AuthedRequest, res: Response) {
    res.clearCookie("session");
    res.status(204).send();
  },

  async me(req: AuthedRequest, res: Response) {
    const user = await authService.me(req.userId!);
    if (!user) {
      throw Errors.notFound("사용자");
    }
    res.json(toUserDto(user));
  },
};
