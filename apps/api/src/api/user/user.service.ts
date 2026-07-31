import { userRepository } from "../../db/repositories/user.repository.js";
import { pushTokenRepository } from "../../db/repositories/push-token.repository.js";
import { Errors } from "../../common/errors.js";

export const userService = {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw Errors.notFound("사용자");
    return user;
  },

  async updateProfile(userId: string, input: { nickname?: string }) {
    return userRepository.updateProfile(userId, input);
  },

  completeOnboarding(userId: string) {
    return userRepository.markOnboardingCompleted(userId);
  },

  registerPushToken(userId: string, token: string) {
    return pushTokenRepository.upsert(userId, token);
  },
};
