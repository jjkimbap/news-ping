import type { ArticleDto, PaginatedResult } from "@newsping/shared";
import { apiClient } from "./client";

export const newsApi = {
  listLatest: (cursor?: string) =>
    apiClient.get<PaginatedResult<ArticleDto>>(`/news${cursor ? `?cursor=${cursor}` : ""}`),
};
