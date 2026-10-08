/**
 * Tiny fetch wrapper used by every API service.
 * - base URL comes from VITE_API_BASE_URL
 * - sends/receives JSON
 * - adds "Authorization: Bearer <token>" when a token is passed
 * - every failure becomes an ApiError with a message you can show
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  constructor(message, { status = 0, code = "UNKNOWN", data = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status; // HTTP status (0 = no response)
    this.code = code; // machine readable code from the backend
    this.data = data; // full error body
  }
}

export async function apiRequest(
  path,
  { method = "GET", body, token, signal } = {}
) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;

    throw new ApiError("ارتباط با سرور برقرار نشد. اینترنت خود را بررسی کنید.", {
      code: "NETWORK_ERROR",
    });
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.message ?? "خطایی رخ داد. دوباره تلاش کنید.", {
      status: response.status,
      code: data?.code,
      data,
    });
  }

  return data;
}

/** Message that is safe to show to the user. */
export const getErrorMessage = (error) =>
  error instanceof ApiError
    ? error.message
    : "خطایی رخ داد. دوباره تلاش کنید.";