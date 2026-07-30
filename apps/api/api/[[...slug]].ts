import type { IncomingMessage, ServerResponse } from "node:http";
import { app } from "../src/app.js";

// Vercel Node.js Function 엔트리. vercel.ts의 rewrite로 모든 경로가 이 함수로 들어오고,
// 이후 라우팅은 src/app.ts의 Express 앱이 그대로 처리한다.
export default function handler(req: IncomingMessage, res: ServerResponse) {
  app(req, res);
}
