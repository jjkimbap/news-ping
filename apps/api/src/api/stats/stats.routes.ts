import { Router } from "express";
import { asyncHandler } from "../../common/middleware/error-handler.js";
import { statsController } from "./stats.controller.js";

export const statsRouter = Router();

statsRouter.get("/trending", asyncHandler(statsController.trending));
statsRouter.get("/press-volume", asyncHandler(statsController.pressVolume));
statsRouter.get("/keyword/:keyword", asyncHandler(statsController.keywordTrend));
