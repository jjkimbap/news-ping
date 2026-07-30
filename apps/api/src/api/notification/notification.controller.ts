import type { Response } from "express";
import type { AuthedRequest } from "../../common/middleware/auth.js";
import { notificationService } from "./notification.service.js";

function toDto(notification: {
  id: string;
  matchedKeywords: string[];
  isRead: boolean;
  sentAt: Date;
  article: {
    id: string;
    source: string;
    title: string;
    bodySnippet: string;
    url: string;
    publishedAt: Date;
  };
}) {
  return {
    id: notification.id,
    matchedKeywords: notification.matchedKeywords,
    isRead: notification.isRead,
    sentAt: notification.sentAt.toISOString(),
    article: {
      id: notification.article.id,
      source: notification.article.source,
      title: notification.article.title,
      bodySnippet: notification.article.bodySnippet,
      url: notification.article.url,
      publishedAt: notification.article.publishedAt.toISOString(),
    },
  };
}

export const notificationController = {
  async list(req: AuthedRequest, res: Response) {
    const cursor = (req.query.cursor as string) || null;
    const keyword = (req.query.keyword as string) || undefined;
    const { items, nextCursor } = await notificationService.list(req.userId!, cursor, keyword);
    res.json({ items: items.map(toDto), nextCursor });
  },

  async markRead(req: AuthedRequest, res: Response) {
    const notification = await notificationService.markRead(req.userId!, req.params.id);
    res.json(toDto(notification));
  },

  async markAllRead(req: AuthedRequest, res: Response) {
    await notificationService.markAllRead(req.userId!);
    res.status(204).send();
  },
};
