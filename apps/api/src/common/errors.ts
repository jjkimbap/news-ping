export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export const Errors = {
  unauthorized: () => new HttpError(401, "UNAUTHORIZED", "로그인이 필요합니다."),
  notFound: (what: string) => new HttpError(404, "NOT_FOUND", `${what}을(를) 찾을 수 없습니다.`),
  keywordLimitReached: (max: number) =>
    new HttpError(422, "KEYWORD_LIMIT_REACHED", `키워드는 최대 ${max}개까지 등록할 수 있습니다.`),
  duplicateKeyword: () => new HttpError(409, "DUPLICATE_KEYWORD", "이미 등록된 키워드입니다."),
  forbidden: () => new HttpError(403, "FORBIDDEN", "접근 권한이 없습니다."),
};
