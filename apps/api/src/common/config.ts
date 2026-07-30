import "dotenv/config";

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: requireEnv("JWT_SECRET", "dev-secret-change-me"),
  // Vercel Cron이 CRON_SECRET 설정 시 자동으로 Authorization 헤더에 실어 보내는 값과 대조한다.
  internalPipelineSecret: requireEnv("CRON_SECRET", "dev-pipeline-secret"),
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
  kakao: {
    clientId: process.env.KAKAO_CLIENT_ID ?? "",
    // 카카오 디벨로퍼스에서 Client Secret 기능을 켠 경우에만 값이 존재하며, 토큰 발급 시 필수로 포함해야 한다.
    clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
    redirectUri: process.env.KAKAO_REDIRECT_URI ?? "",
  },
  naver: {
    clientId: process.env.NAVER_CLIENT_ID ?? "",
    clientSecret: process.env.NAVER_CLIENT_SECRET ?? "",
    redirectUri: process.env.NAVER_REDIRECT_URI ?? "",
  },
};
