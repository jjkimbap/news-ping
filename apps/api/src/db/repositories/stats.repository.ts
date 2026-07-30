import { prisma } from "../client.js";

interface TrendingRow {
  keyword_text: string;
  recent_count: bigint;
  previous_count: bigint;
}

export const statsRepository = {
  async trendingKeywords(limit: number) {
    // matchedKeywords는 Postgres text[] 컬럼이라 unnest로 펼쳐서 집계한다.
    return prisma.$queryRaw<TrendingRow[]>`
      WITH recent AS (
        SELECT unnest("matchedKeywords") AS keyword_text, COUNT(*) AS cnt
        FROM "MatchNotification"
        WHERE "sentAt" >= NOW() - INTERVAL '24 hours'
        GROUP BY keyword_text
      ),
      previous AS (
        SELECT unnest("matchedKeywords") AS keyword_text, COUNT(*) AS cnt
        FROM "MatchNotification"
        WHERE "sentAt" >= NOW() - INTERVAL '48 hours' AND "sentAt" < NOW() - INTERVAL '24 hours'
        GROUP BY keyword_text
      )
      SELECT
        recent.keyword_text AS keyword_text,
        recent.cnt AS recent_count,
        COALESCE(previous.cnt, 0) AS previous_count
      FROM recent
      LEFT JOIN previous ON previous.keyword_text = recent.keyword_text
      ORDER BY recent.cnt DESC
      LIMIT ${limit};
    `;
  },

  async keywordTrend(keywordText: string, days: number) {
    return prisma.$queryRaw<{ date: Date; mention_count: bigint }[]>`
      SELECT date_trunc('day', "sentAt") AS date, COUNT(*) AS mention_count
      FROM "MatchNotification"
      WHERE ${keywordText} = ANY("matchedKeywords")
        AND "sentAt" >= NOW() - (${days} || ' days')::interval
      GROUP BY date
      ORDER BY date ASC;
    `;
  },

  async pressVolume(days: number) {
    const rows = await prisma.article.groupBy({
      by: ["source"],
      where: { publishedAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } },
      _count: { _all: true },
    });
    return rows
      .map((row) => ({ source: row.source, articleCount: row._count._all }))
      .sort((a, b) => b.articleCount - a.articleCount);
  },
};
