import { createHash } from "node:crypto";
import Parser from "rss-parser";
import iconv from "iconv-lite";
import { articleRepository } from "../../db/repositories/article.repository.js";
import { NEWS_SOURCES } from "./sources.js";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const parser = new Parser();

function dedupHashFor(url: string): string {
  return createHash("sha256").update(url).digest("hex");
}

// 언론사마다 봇 차단 기준이 반대다: 일부(국민일보, 이데일리)는 User-Agent가 없으면 406을 반환하고,
// 반대로 일부(한국경제)는 브라우저 User-Agent가 붙으면 403을 반환한다. 그래서 헤더 없이 먼저 시도하고
// 실패할 때만 User-Agent를 붙여 재시도한다.
async function fetchRss(url: string): Promise<Response> {
  const plain = await fetch(url);
  if (plain.ok) return plain;

  const withUserAgent = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (withUserAgent.ok) return withUserAgent;

  throw new Error(`RSS 요청 실패: ${plain.status} (UA 포함 재시도 ${withUserAgent.status})`);
}

// 일부 언론사(국민일보 등)는 EUC-KR로 응답하는데 rss-parser는 항상 UTF-8로 디코딩하므로,
// XML 프롤로그의 encoding을 직접 확인해 필요할 때만 iconv로 변환한다.
async function fetchFeedXml(url: string): Promise<string> {
  const res = await fetchRss(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  const prolog = buffer.subarray(0, 200).toString("ascii");
  const encoding = prolog.match(/encoding=["']([^"']+)["']/i)?.[1]?.toLowerCase();
  if (encoding && encoding !== "utf-8" && encoding !== "utf8") {
    return iconv.decode(buffer, encoding);
  }
  return buffer.toString("utf-8");
}

async function collectFromSource(source: (typeof NEWS_SOURCES)[number]) {
  const xml = await fetchFeedXml(source.rssUrl);
  const feed = await parser.parseString(xml);
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
