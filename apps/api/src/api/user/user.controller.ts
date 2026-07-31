import type { Response } from "express";
import type { AuthedRequest } from "../../common/middleware/auth.js";
import { userService } from "./user.service.js";

function toProfileDto(user: {
  id: string;
  provider: string;
  nickname: string;
  profileImage: string | null;
  onboardingCompleted: boolean;
  createdAt: Date;
}) {
  return {
    id: user.id,
    nickname: user.nickname,
    onboardingCompleted: user.onboardingCompleted,
    createdAt: user.createdAt.toISOString(),
    // provider/profileImage는 간편로그인 원본 정보라 조회만 가능, 프론트에서 수정불가 표시로 렌더링
    readonly: {
      provider: user.provider,
      profileImage: user.profileImage,
    },
  };
}

export const userController = {
  async getMe(req: AuthedRequest, res: Response) {
    const user = await userService.getProfile(req.userId!);
    res.json(toProfileDto(user));
  },

  async updateMe(req: AuthedRequest, res: Response) {
    const { nickname } = req.body;
    const user = await userService.updateProfile(req.userId!, { nickname });
    res.json(toProfileDto(user));
  },

  async completeOnboarding(req: AuthedRequest, res: Response) {
    const user = await userService.completeOnboarding(req.userId!);
    res.json(toProfileDto(user));
  },

  async registerPushToken(req: AuthedRequest, res: Response) {
    await userService.registerPushToken(req.userId!, req.body.token);
    res.status(204).send();
  },
};
