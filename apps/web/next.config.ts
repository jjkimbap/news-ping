import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
