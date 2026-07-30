import { randomUUID } from "node:crypto";
import type { AuthProvider } from "@newkey/shared";

// TODO: 실제 DB(Neon 등) 연동 전까지 사용하는 임시 인메모리 저장소.
// 프로세스가 재시작되면 데이터가 초기화되고, 서버리스 환경에서는 인스턴스 간 공유되지 않는다.

export interface UserRecord {
  id: string;
  provider: AuthProvider;
  providerUid: string;
  nickname: string;
  profileImage: string | null;
  notificationEnabled: boolean;
  onboardingCompleted: boolean;
  createdAt: Date;
}

export interface KeywordRecord {
  id: string;
  userId: string;
  keywordText: string;
  normalizedText: string;
  createdAt: Date;
}

export interface ArticleRecord {
  id: string;
  source: string;
  title: string;
  bodySnippet: string;
  url: string;
  publishedAt: Date;
  dedupHash: string;
  collectedAt: Date;
}

export interface MatchNotificationRecord {
  id: string;
  userId: string;
  articleId: string;
  matchedKeywords: string[];
  isRead: boolean;
  sentAt: Date;
}

export interface PushTokenRecord {
  id: string;
  userId: string;
  token: string;
  createdAt: Date;
}

const globalForStore = globalThis as unknown as {
  __newkeyMemoryStore?: {
    users: UserRecord[];
    keywords: KeywordRecord[];
    articles: ArticleRecord[];
    notifications: MatchNotificationRecord[];
    pushTokens: PushTokenRecord[];
  };
};

// 개발 중 hot-reload(tsx watch)로 모듈이 재평가돼도 데이터가 유지되도록 globalThis에 보관한다.
export const store =
  globalForStore.__newkeyMemoryStore ??
  (globalForStore.__newkeyMemoryStore = {
    users: [],
    keywords: [],
    articles: [],
    notifications: [],
    pushTokens: [],
  });

export function generateId(): string {
  return randomUUID();
}
