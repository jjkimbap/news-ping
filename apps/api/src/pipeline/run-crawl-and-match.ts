import { collectNewArticles } from "./crawler/index.js";
import { matchArticleAgainstKeywords } from "./matcher/index.js";
import { sendGroupedPush, type UserNotificationBatch } from "./pusher/index.js";
import { keywordRepository } from "../db/repositories/keyword.repository.js";
import { notificationRepository } from "../db/repositories/notification.repository.js";

export async function runCrawlAndMatch() {
  const newArticles = await collectNewArticles();
  if (newArticles.length === 0) {
    return { articlesCollected: 0, notificationsCreated: 0 };
  }

  const keywords = await keywordRepository.listAllNormalized();

  const notificationEntries: { userId: string; articleId: string; matchedKeywords: string[] }[] = [];
  const batchByUser = new Map<string, UserNotificationBatch>();

  for (const article of newArticles) {
    const matches = matchArticleAgainstKeywords(article, keywords);

    for (const match of matches) {
      notificationEntries.push({
        userId: match.userId,
        articleId: article.id,
        matchedKeywords: match.matchedKeywords,
      });

      const existing = batchByUser.get(match.userId);
      if (existing) {
        existing.notificationCount += 1;
      } else {
        batchByUser.set(match.userId, {
          userId: match.userId,
          notificationCount: 1,
          sampleArticleTitle: article.title,
          sampleKeyword: match.matchedKeywords[0],
        });
      }
    }
  }

  if (notificationEntries.length > 0) {
    await notificationRepository.createMany(notificationEntries);
    await sendGroupedPush(Array.from(batchByUser.values()));
  }

  return { articlesCollected: newArticles.length, notificationsCreated: notificationEntries.length };
}
