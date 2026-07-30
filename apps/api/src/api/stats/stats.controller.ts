import type { Request, Response } from "express";
import { statsService } from "./stats.service.js";

export const statsController = {
  async trending(_req: Request, res: Response) {
    const items = await statsService.trendingKeywords();
    res.json({ items });
  },

  async keywordTrend(req: Request, res: Response) {
    const items = await statsService.keywordTrend(req.params.keyword);
    res.json({ items });
  },

  async pressVolume(_req: Request, res: Response) {
    const items = await statsService.pressVolume();
    res.json({ items });
  },
};
