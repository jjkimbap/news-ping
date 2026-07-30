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

  listAllNormalized() {
    return prisma.keyword.findMany({
      select: { id: true, userId: true, keywordText: true, normalizedText: true },
    });
  },
};
