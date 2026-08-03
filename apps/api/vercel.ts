import { routes, type VercelConfig } from "@vercel/config/v1";

// Vercel Hobby 플랜은 크론잡을 하루 1회로 제한해 5분 주기 크롤링에 못 쓴다. 대신 외부 무료
// 크론 서비스(예: cron-job.org)에서 5분마다 GET /internal/pipeline/crawl-and-match를
// `Authorization: Bearer <CRON_SECRET>` 헤더와 함께 호출하도록 설정한다.
export const config: VercelConfig = {
  rewrites: [routes.rewrite("/(.*)", "/api/$1")],
};
