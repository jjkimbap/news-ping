import { createHash } from "node:crypto";
import Parser from "rss-parser";
import { articleRepository } from "../../db/repositories/article.repository.js";
import { NEWS_SOURCES } from "./sources.js";

const parser = new Parser();

function dedupHashFor(url: string): string {
  return createHash("sha256").update(url).digest("hex");
}

async function collectFromSource(source: (typeof NEWS_SOURCES)[number]) {
  const feed = await parser.parseURL(source.rssUrl);
  const newArticles = [];

  for (const item of feed.items) {
    if (!item.link || !item.title) continue;

    const dedupHash = dedupHashFor(item.link);
    const existing = await articleRepository.findByDedupHash(dedupHash);
    if (existing) continue;

    const article = await articleRepository.create({
      source: source.name,
      title: item.title,
      bodySnippet: (item.contentSnippet ?? item.content ?? "").slice(0, 500),
      url: item.link,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      dedupHash,
    });
    newArticles.push(article);
  }

  return newArticles;
}

export async function collectNewArticles() {
  const results = await Promise.allSettled(NEWS_SOURCES.map(collectFromSource));

  const newArticles = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      newArticles.push(...result.value);
    } else {
      console.error("뉴스 수집 실패:", result.reason);
    }
  }
  return newArticles;
}
