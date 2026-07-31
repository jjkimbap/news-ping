import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 같은 Wi-Fi의 모바일 기기(LAN IP)나 ngrok 터널로 접속해 테스트할 때 HMR 리소스 차단을 막기 위함.
  // LAN IP는 네트워크가 바뀌면 매번 갱신 필요 (ipconfig getifaddr en0).
  allowedDevOrigins: ["192.168.35.65", "192.168.0.211", "ventricle-footwear-boondocks.ngrok-free.dev"],
  // 로컬 개발 전용: 배포 환경에서는 vercel.ts의 rewrite가 이 역할을 대신한다.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
