import { Router } from "express";
import { requireAuth } from "../../common/middleware/auth.js";
import { asyncHandler } from "../../common/middleware/error-handler.js";
import { notificationController } from "./notification.controller.js";

export const notificationRouter = Router();

notificationRouter.use(requireAuth);
notificationRouter.get("/", asyncHandler(notificationController.list));
notificationRouter.patch("/read-all", asyncHandler(notificationController.markAllRead));
notificationRouter.patch("/:id/read", asyncHandler(notificationController.markRead));
