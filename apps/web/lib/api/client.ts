import type { ApiError } from "@newsping/shared";

export class ApiRequestError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

// Next.js는 raw fetch() 호출에 basePath를 자동으로 붙여주지 않으므로 직접 붙인다.
// 로컬 개발에서는 비워두고, saerolab.com/news-ping 프록시 하위로 배포될 때만 값을 설정한다.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_PATH}/api${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const body = await res.json();

  if (!res.ok) {
    const err = body as ApiError;
    throw new ApiRequestError(res.status, err.error.code, err.error.message);
  }

  return body as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
