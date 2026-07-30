import { prisma } from "../client.js";

export const notificationRepository = {
  createMany(
    entries: { userId: string; articleId: string; matchedKeywords: string[] }[],
  ) {
    return prisma.$transaction(
      entries.map((entry) => prisma.matchNotification.create({ data: entry })),
    );
  },

  listByUser(
    userId: string,
    options: { cursor: string | null; take: number; keyword?: string },
  ) {
    return prisma.matchNotification.findMany({
      where: {
        userId,
        ...(options.keyword ? { matchedKeywords: { has: options.keyword } } : {}),
      },
      include: { article: true },
      orderBy: { sentAt: "desc" },
      take: options.take,
      ...(options.cursor ? { skip: 1, cursor: { id: options.cursor } } : {}),
    });
  },

  findById(id: string) {
    return prisma.matchNotification.findUnique({ where: { id } });
  },

  markRead(id: string) {
    return prisma.matchNotification.update({
      where: { id },
      data: { isRead: true },
      include: { article: true },
    });
  },

  markAllRead(userId: string) {
    return prisma.matchNotification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },
};
