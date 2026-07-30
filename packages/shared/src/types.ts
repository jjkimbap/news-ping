import type { AUTH_PROVIDERS } from "./constants.js";

export type AuthProvider = (typeof AUTH_PROVIDERS)[number];

export interface UserDto {
  id: string;
  provider: AuthProvider;
  nickname: string;
  profileImage: string | null;
  notificationEnabled: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface KeywordDto {
  id: string;
  keywordText: string;
  createdAt: string;
}

export interface ArticleDto {
  id: string;
  source: string;
  title: string;
  bodySnippet: string;
  url: string;
  publishedAt: string;
}

export interface MatchNotificationDto {
  id: string;
  article: ArticleDto;
  matchedKeywords: string[];
  isRead: boolean;
  sentAt: string;
}

export interface TrendingKeywordDto {
  keywordText: string;
  mentionCount: number;
  changeRate: number;
}

export interface KeywordTrendPointDto {
  date: string;
  mentionCount: number;
}

export interface PressVolumeDto {
  source: string;
  articleCount: number;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
