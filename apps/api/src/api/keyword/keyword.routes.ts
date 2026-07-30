import { Router } from "express";
import { requireAuth } from "../../common/middleware/auth.js";
import { asyncHandler } from "../../common/middleware/error-handler.js";
import { keywordController } from "./keyword.controller.js";

export const keywordRouter = Router();

keywordRouter.use(requireAuth);
keywordRouter.get("/", asyncHandler(keywordController.list));
keywordRouter.post("/", asyncHandler(keywordController.create));
keywordRouter.patch("/:id", asyncHandler(keywordController.update));
keywordRouter.delete("/:id", asyncHandler(keywordController.remove));
