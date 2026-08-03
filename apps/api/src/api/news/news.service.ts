import { NEWS_FEED_PAGE_SIZE } from "@newsping/shared";
import { articleRepository } from "../../db/repositories/article.repository.js";

export const newsService = {
  async listLatest(cursor: string | null) {
    const items = await articleRepository.listLatest(cursor, NEWS_FEED_PAGE_SIZE + 1);
    const hasMore = items.length > NEWS_FEED_PAGE_SIZE;
    const page = hasMore ? items.slice(0, -1) : items;
    return {
      items: page,
      nextCursor: hasMore ? page[page.length - 1].id : null,
    };
  },
};
