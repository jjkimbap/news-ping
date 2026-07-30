import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 같은 Wi-Fi의 모바일 기기에서 LAN IP로 접속해 테스트할 때 HMR 리소스 차단을 막기 위함.
  allowedDevOrigins: ["192.168.35.65"],
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
