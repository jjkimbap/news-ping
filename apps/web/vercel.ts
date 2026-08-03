import { routes, deploymentEnv, type VercelConfig } from "@vercel/config/v1";

// apps/api는 별도 Vercel 프로젝트로 배포된다. API_ORIGIN 환경변수(Vercel 프로젝트 설정)에
// 그 배포 URL(예: https://news-ping-api.vercel.app)을 저장해두면, 브라우저 입장에서는
// 이 웹앱과 동일 origin의 /api/* 로만 호출하는 것처럼 보인다 (CORS 불필요).
export const config: VercelConfig = {
  framework: "nextjs",
  rewrites: [routes.rewrite("/api/(.*)", `${deploymentEnv("API_ORIGIN")}/api/$1`)],
};
