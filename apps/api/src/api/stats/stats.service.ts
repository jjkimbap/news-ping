import { statsRepository } from "../../db/repositories/stats.repository.js";

export const statsService = {
  async trendingKeywords(limit = 10) {
    const rows = await statsRepository.trendingKeywords(limit);
    return rows.map((row) => {
      const recent = Number(row.recent_count);
      const previous = Number(row.previous_count);
      const changeRate = previous === 0 ? recent : (recent - previous) / previous;
      return { keywordText: row.keyword_text, mentionCount: recent, changeRate };
    });
  },

  async keywordTrend(keywordText: string, days = 7) {
    const rows = await statsRepository.keywordTrend(keywordText, days);
    return rows.map((row) => ({
      date: row.date.toISOString().slice(0, 10),
      mentionCount: Number(row.mention_count),
    }));
  },

  pressVolume(days = 1) {
    return statsRepository.pressVolume(days);
  },
};
