import type { ArticleDto, PaginatedResult } from "@newkey/shared";
import { apiClient } from "./client";

export const newsApi = {
  listLatest: (cursor?: string) =>
    apiClient.get<PaginatedResult<ArticleDto>>(`/news${cursor ? `?cursor=${cursor}` : ""}`),
};
