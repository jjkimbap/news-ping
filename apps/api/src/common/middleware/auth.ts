import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { Errors } from "../errors.js";

export interface AuthedRequest extends Request {
  userId?: string;
}

interface SessionPayload {
  userId: string;
}

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.session;
  if (!token) {
    next(Errors.unauthorized());
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as SessionPayload;
    req.userId = payload.userId;
    next();
  } catch {
    next(Errors.unauthorized());
  }
}

export function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.session;
  if (!token) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as SessionPayload;
    req.userId = payload.userId;
  } catch {
    // 비로그인 취급
  }
  next();
}

export function requireInternalSecret(req: Request, _res: Response, next: NextFunction) {
  // Vercel Cron은 CRON_SECRET 환경변수가 설정되어 있으면 자동으로
  // `Authorization: Bearer <CRON_SECRET>` 헤더를 붙여 호출한다.
  const authHeader = req.header("authorization");
  if (authHeader !== `Bearer ${config.internalPipelineSecret}`) {
    next(Errors.forbidden());
    return;
  }
  next();
}
