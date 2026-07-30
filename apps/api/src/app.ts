import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./common/config.js";
import { apiRouter } from "./api/index.js";
import { internalRouter } from "./internal/internal.routes.js";
import { errorHandler } from "./common/middleware/error-handler.js";

export const app = express();

app.use(cors({ origin: config.webOrigin, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api", apiRouter);
app.use("/internal", internalRouter);

app.use(errorHandler);
