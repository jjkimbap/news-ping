import { prisma } from "../client.js";

export const keywordRepository = {
  listByUser(userId: string) {
    return prisma.keyword.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  },

  count(userId: string) {
    return prisma.keyword.count({ where: { userId } });
  },

  findByNormalized(userId: string, normalizedText: string) {
    return prisma.keyword.findUnique({
      where: { userId_normalizedText: { userId, normalizedText } },
    });
  },

  create(userId: string, keywordText: string, normalizedText: string) {
    return prisma.keyword.create({
      data: { userId, keywordText, normalizedText },
    });
  },

  update(id: string, keywordText: string, normalizedText: string) {
    return prisma.keyword.update({
      where: { id },
      data: { keywordText, normalizedText },
    });
  },

  findById(id: string) {
    return prisma.keyword.findUnique({ where: { id } });
  },

  remove(id: string) {
    return prisma.keyword.delete({ where: { id } });
  },

  // 푸시를 받을 기기(토큰)가 하나도 등록되지 않은 사용자는 매칭 대상에서 제외한다 —
  // 알림을 받을 수 없는 사용자에게 알림 리스트만 쌓이는 걸 방지하기 위함.
  listAllNormalized() {
    return prisma.keyword.findMany({
      where: { user: { pushTokens: { some: {} } } },
      select: { id: true, userId: true, keywordText: true, normalizedText: true },
    });
  },
};
