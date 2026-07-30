import type { MatchNotificationDto, PaginatedResult } from "@newkey/shared";
import { apiClient } from "./client";

export const notificationsApi = {
  list: (params?: { cursor?: string; keyword?: string }) => {
    const query = new URLSearchParams();
    if (params?.cursor) query.set("cursor", params.cursor);
    if (params?.keyword) query.set("keyword", params.keyword);
    const qs = query.toString();
    return apiClient.get<PaginatedResult<MatchNotificationDto>>(
      `/notifications${qs ? `?${qs}` : ""}`,
    );
  },
  markRead: (id: string) =>
    apiClient.patch<MatchNotificationDto>(`/notifications/${id}/read`),
  markAllRead: () => apiClient.patch<void>("/notifications/read-all"),
};
