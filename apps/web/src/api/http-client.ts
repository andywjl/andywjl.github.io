type ApiEnvelope<T> = {
  code: number;
  data: T;
  msg: string;
};

const viteEnv =
  typeof import.meta !== "undefined"
    ? (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env
    : undefined;

const DEFAULT_API_BASE =
  typeof window === "undefined" ? "http://localhost:3000/api/v1" : "/api/v1";

const API_BASE =
  viteEnv?.VITE_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_API_BASE;

export async function fetchApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || payload.code !== 0) {
    throw new Error(payload.msg || `Request failed: ${response.status}`);
  }

  return payload.data;
}
