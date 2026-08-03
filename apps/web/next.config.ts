import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // saerolab.com은 별도의 Next.js Multi-Zone Proxy(jjkimbap/proxy)가 루트를 차지하고 있어서,
  // 이 앱은 /news-ping 경로 하위로 붙는다 (프록시가 프리픽스 그대로 이 배포에 전달, 여기서 해석).
  // 로컬 개발(ngrok/LAN IP 테스트 포함)은 프록시를 거치지 않으므로 basePath 없이 그대로 둔다.
  basePath: process.env.VERCEL ? "/news-ping" : undefined,
  // 같은 Wi-Fi의 모바일 기기(LAN IP)나 ngrok 터널로 접속해 테스트할 때 HMR 리소스 차단을 막기 위함.
  // LAN IP는 네트워크가 바뀌면 매번 갱신 필요 (ipconfig getifaddr en0).
  allowedDevOrigins: ["192.168.35.65", "192.168.0.211", "ventricle-footwear-boondocks.ngrok-free.dev"],
  // 로컬 개발 전용: 배포 환경에서는 vercel.ts의 rewrite가 이 역할을 대신한다.
  // Vercel에 배포되면 이 rewrites()를 건너뛰어야 한다 — 안 그러면 플랫폼 레벨 rewrite가
  // basePath 프리픽스 때문에 안 걸릴 때 여기로 폴스루되어 localhost:4000으로 프록시를 시도한다.
  async rewrites() {
    if (process.env.VERCEL) return [];
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
