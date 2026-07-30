import { Router } from "express";
import { requireAuth } from "../../common/middleware/auth.js";
import { asyncHandler } from "../../common/middleware/error-handler.js";
import { authController } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/kakao/callback", asyncHandler(authController.kakaoCallback));
authRouter.post("/naver/callback", asyncHandler(authController.naverCallback));
authRouter.post("/logout", asyncHandler(authController.logout));
authRouter.get("/me", requireAuth, asyncHandler(authController.me));
