import { Router } from "express";
import { requireInternalSecret } from "../common/middleware/auth.js";
import { asyncHandler } from "../common/middleware/error-handler.js";
import { runCrawlAndMatch } from "../pipeline/run-crawl-and-match.js";

// 사용자 API가 아닌 배치 파이프라인 전용 라우터. Vercel Cron이 내부 시크릿과 함께 호출한다.
export const internalRouter = Router();

internalRouter.get(
  "/pipeline/crawl-and-match",
  requireInternalSecret,
  asyncHandler(async (_req, res) => {
    const result = await runCrawlAndMatch();
    res.json(result);
  }),
);
