import type { KeywordDto } from "@newkey/shared";
import { apiClient } from "./client";

export const keywordsApi = {
  list: () => apiClient.get<{ items: KeywordDto[] }>("/keywords"),
  create: (keywordText: string) => apiClient.post<KeywordDto>("/keywords", { keywordText }),
  update: (id: string, keywordText: string) =>
    apiClient.patch<KeywordDto>(`/keywords/${id}`, { keywordText }),
  remove: (id: string) => apiClient.delete<void>(`/keywords/${id}`),
};
