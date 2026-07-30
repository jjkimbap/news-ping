import { prisma } from "../client.js";

export const pushTokenRepository = {
  upsert(userId: string, token: string) {
    return prisma.pushToken.upsert({
      where: { token },
      create: { userId, token },
      update: { userId },
    });
  },

  listTokensForUsers(userIds: string[]) {
    return prisma.pushToken.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, token: true },
    });
  },
};
