import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  rewrites: [routes.rewrite("/(.*)", "/api/$1")],
  crons: [{ path: "/internal/pipeline/crawl-and-match", schedule: "*/5 * * * *" }],
};
