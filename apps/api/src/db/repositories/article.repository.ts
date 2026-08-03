import { prisma } from "../client.js";

export const articleRepository = {
  findByDedupHash(dedupHash: string) {
    return prisma.article.findUnique({ where: { dedupHash } });
  },

  create(input: {
    source: string;
    title: string;
    bodySnippet: string;
    url: string;
    publishedAt: Date;
    dedupHash: string;
  }) {
    return prisma.article.create({ data: input });
  },

  listLatest(cursor: string | null, take: number) {
    return prisma.article.findMany({
      orderBy: { publishedAt: "desc" },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });
  },

  // MatchNotification은 Article에 onDelete: Cascade라 오래된 기사를 지우면 관련 알림도 함께 정리된다.
  deleteOlderThan(cutoff: Date) {
    return prisma.article.deleteMany({ where: { publishedAt: { lt: cutoff } } });
  },
};
