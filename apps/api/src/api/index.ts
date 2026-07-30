import { Router } from "express";
import { authRouter } from "./auth/auth.routes.js";
import { keywordRouter } from "./keyword/keyword.routes.js";
import { notificationRouter } from "./notification/notification.routes.js";
import { newsRouter } from "./news/news.routes.js";
import { statsRouter } from "./stats/stats.routes.js";
import { userRouter } from "./user/user.routes.js";

// 전체 사용자 대면 API가 이 파일 한 곳에 모여있다 — 새 기능을 추가할 땐 여기에 라우터만 등록하면 된다.
export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/keywords", keywordRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/news", newsRouter);
apiRouter.use("/stats", statsRouter);
apiRouter.use("/users", userRouter);
