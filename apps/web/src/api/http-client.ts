type ApiEnvelope<T> = {
  code: number;
  data: T;
  msg: string;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000/api/v1";

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
