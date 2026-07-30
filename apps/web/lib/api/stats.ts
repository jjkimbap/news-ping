import type { KeywordTrendPointDto, PressVolumeDto, TrendingKeywordDto } from "@newkey/shared";
import { apiClient } from "./client";

export const statsApi = {
  trending: () => apiClient.get<{ items: TrendingKeywordDto[] }>("/stats/trending"),
  keywordTrend: (keyword: string) =>
    apiClient.get<{ items: KeywordTrendPointDto[] }>(
      `/stats/keyword/${encodeURIComponent(keyword)}`,
    ),
  pressVolume: () => apiClient.get<{ items: PressVolumeDto[] }>("/stats/press-volume"),
};
