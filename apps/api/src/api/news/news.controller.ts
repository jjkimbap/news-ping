import type { Request, Response } from "express";
import { newsService } from "./news.service.js";

export const newsController = {
  async list(req: Request, res: Response) {
    const cursor = (req.query.cursor as string) || null;
    const { items, nextCursor } = await newsService.listLatest(cursor);
    res.json({
      items: items.map((article) => ({
        id: article.id,
        source: article.source,
        title: article.title,
        bodySnippet: article.bodySnippet,
        url: article.url,
        publishedAt: article.publishedAt.toISOString(),
      })),
      nextCursor,
    });
  },
};
