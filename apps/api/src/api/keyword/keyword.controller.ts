import type { Response } from "express";
import type { AuthedRequest } from "../../common/middleware/auth.js";
import { keywordService } from "./keyword.service.js";

function toDto(keyword: { id: string; keywordText: string; createdAt: Date }) {
  return {
    id: keyword.id,
    keywordText: keyword.keywordText,
    createdAt: keyword.createdAt.toISOString(),
  };
}

export const keywordController = {
  async list(req: AuthedRequest, res: Response) {
    const keywords = await keywordService.list(req.userId!);
    res.json({ items: keywords.map(toDto) });
  },

  async create(req: AuthedRequest, res: Response) {
    const keyword = await keywordService.create(req.userId!, req.body.keywordText);
    res.status(201).json(toDto(keyword));
  },

  async update(req: AuthedRequest, res: Response) {
    const keyword = await keywordService.update(req.userId!, req.params.id, req.body.keywordText);
    res.json(toDto(keyword));
  },

  async remove(req: AuthedRequest, res: Response) {
    await keywordService.remove(req.userId!, req.params.id);
    res.status(204).send();
  },
};
