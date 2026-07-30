import { Router } from "express";
import { requireAuth } from "../../common/middleware/auth.js";
import { asyncHandler } from "../../common/middleware/error-handler.js";
import { userController } from "./user.controller.js";

export const userRouter = Router();

userRouter.use(requireAuth);
userRouter.get("/me", asyncHandler(userController.getMe));
userRouter.patch("/me", asyncHandler(userController.updateMe));
userRouter.post("/me/onboarding-complete", asyncHandler(userController.completeOnboarding));
userRouter.post("/me/push-tokens", asyncHandler(userController.registerPushToken));
