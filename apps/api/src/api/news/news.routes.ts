import { Router } from "express";
import { asyncHandler } from "../../common/middleware/error-handler.js";
import { newsController } from "./news.controller.js";

export const newsRouter = Router();

newsRouter.get("/", asyncHandler(newsController.list));
