import { normalizeKeyword } from "../../common/normalize.js";

export interface MatchableKeyword {
  userId: string;
  keywordText: string;
  normalizedText: string;
}

export interface ArticleMatchResult {
  userId: string;
  matchedKeywords: string[];
}

/**
 * 제목을 우선 검사하고, 제목에서 매칭되지 않은 키워드만 본문(스니펫)을 추가로 검사한다.
 * 1차 구현은 단순 substring 매칭이며, 사용자/키워드 수 증가 시 Aho-Corasick 등으로 교체 가능하도록
 * 이 함수의 시그니처(제목/본문 + 키워드 목록 → 매칭 결과)는 유지한다.
 */
export function matchArticleAgainstKeywords(
  article: { title: string; bodySnippet: string },
  keywords: MatchableKeyword[],
): ArticleMatchResult[] {
  const normalizedTitle = normalizeKeyword(article.title);
  const normalizedBody = normalizeKeyword(article.bodySnippet);

  const matchedByUser = new Map<string, Set<string>>();

  for (const keyword of keywords) {
    const matched =
      normalizedTitle.includes(keyword.normalizedText) ||
      normalizedBody.includes(keyword.normalizedText);
    if (!matched) continue;

    const set = matchedByUser.get(keyword.userId) ?? new Set<string>();
    set.add(keyword.keywordText);
    matchedByUser.set(keyword.userId, set);
  }

  return Array.from(matchedByUser.entries()).map(([userId, keywordTexts]) => ({
    userId,
    matchedKeywords: Array.from(keywordTexts),
  }));
}
