import { MAX_KEYWORDS_PER_USER } from "@newsping/shared";
import { keywordRepository } from "../../db/repositories/keyword.repository.js";
import { normalizeKeyword } from "../../common/normalize.js";
import { Errors } from "../../common/errors.js";

export const keywordService = {
  list(userId: string) {
    return keywordRepository.listByUser(userId);
  },

  async create(userId: string, keywordText: string) {
    const normalizedText = normalizeKeyword(keywordText);

    const [count, existing] = await Promise.all([
      keywordRepository.count(userId),
      keywordRepository.findByNormalized(userId, normalizedText),
    ]);

    if (existing) {
      throw Errors.duplicateKeyword();
    }
    if (count >= MAX_KEYWORDS_PER_USER) {
      throw Errors.keywordLimitReached(MAX_KEYWORDS_PER_USER);
    }

    return keywordRepository.create(userId, keywordText.trim(), normalizedText);
  },

  async update(userId: string, keywordId: string, keywordText: string) {
    const keyword = await keywordRepository.findById(keywordId);
    if (!keyword || keyword.userId !== userId) {
      throw Errors.notFound("키워드");
    }

    const normalizedText = normalizeKeyword(keywordText);
    const existing = await keywordRepository.findByNormalized(userId, normalizedText);
    if (existing && existing.id !== keywordId) {
      throw Errors.duplicateKeyword();
    }

    return keywordRepository.update(keywordId, keywordText.trim(), normalizedText);
  },

  async remove(userId: string, keywordId: string) {
    const keyword = await keywordRepository.findById(keywordId);
    if (!keyword || keyword.userId !== userId) {
      throw Errors.notFound("키워드");
    }
    await keywordRepository.remove(keywordId);
  },
};
