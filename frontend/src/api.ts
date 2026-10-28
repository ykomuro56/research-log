import { apiUrl } from "./config";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `通信に失敗しました（${response.status}）`;

    try {
      const contentType =
        response.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        const errorData = await response.json();

        if (
          typeof errorData === "object" &&
          errorData !== null &&
          typeof errorData.message === "string"
        ) {
          message = errorData.message;
        }
      } else {
        const text = await response.text();

        if (text) {
          message = text;
        }
      }
    } catch {
      // エラー本文を読み取れない場合は既定のメッセージを使用する
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const responseText = await response.text();

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}
