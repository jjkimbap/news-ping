import { NOTIFICATION_PAGE_SIZE } from "@newsping/shared";
import { notificationRepository } from "../../db/repositories/notification.repository.js";
import { Errors } from "../../common/errors.js";

export const notificationService = {
  async list(userId: string, cursor: string | null, keyword?: string) {
    const items = await notificationRepository.listByUser(userId, {
      cursor,
      take: NOTIFICATION_PAGE_SIZE + 1,
      keyword,
    });

    const hasMore = items.length > NOTIFICATION_PAGE_SIZE;
    const page = hasMore ? items.slice(0, -1) : items;
    return {
      items: page,
      nextCursor: hasMore ? page[page.length - 1].id : null,
    };
  },

  async markRead(userId: string, notificationId: string) {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification || notification.userId !== userId) {
      throw Errors.notFound("알림");
    }
    return notificationRepository.markRead(notificationId);
  },

  markAllRead(userId: string) {
    return notificationRepository.markAllRead(userId);
  },
};
