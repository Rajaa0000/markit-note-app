"use client";

export type User = {
  user_id: number;
  username: string;
  email?: string;
};

type AuthPayload = {
  username: string;
  password: string;
  email?: string;
};

type ApiOptions = RequestInit & {
  skipAuthRefresh?: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://notes-app-1-88gd.onrender.com";

const USER_KEY = "markit_user";

let accessToken: string | null = null;

function persistUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

async function parseResponse(response: Response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;

  const contentType = response.headers.get("content-type") ?? "";
  const looksLikeHtml = contentType.includes("text/html") || /^\s*<!doctype html/i.test(text);

  if (looksLikeHtml) {
    return {
      error:
        "The backend returned an HTML error page instead of JSON. Please try again or adjust the request data.",
    };
  }

  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const data = error as { error?: unknown; errors?: unknown; detail?: unknown };
    const message = data.error ?? data.errors ?? data.detail;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
    if (message && typeof message === "object") {
      return Object.entries(message)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(" ") : value}`)
        .join(" ");
    }
  }
  return fallback;
}

export async function apiFetch(path: string, options: ApiOptions = {}) {
  const { skipAuthRefresh, headers, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  if (response.status !== 401 || skipAuthRefresh) return response;

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    accessToken = null;
    persistUser(null);
    return response;
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...headers,
    },
  });
}

export async function apiJson<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const response = await apiFetch(path, options);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw data ?? { error: `Request failed with status ${response.status}` };
  }

  return data as T;
}

export async function refreshAccessToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/user/auth/token/refresh/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });

    if (!response.ok) return false;
    const data = (await response.json()) as { access: string };
    accessToken = data.access;
    return true;
  } catch {
    return false;
  }
}

export async function initAuth() {
  const restored = await refreshAccessToken();
  return { isAuthenticated: restored, user: restored ? getStoredUser() : null };
}

export async function login(data: AuthPayload) {
  const response = await fetch(`${API_BASE_URL}/user/auth/login/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username: data.username, password: data.password }),
  });
  const body = await parseResponse(response);

  if (!response.ok) return { ok: false, status: response.status, error: body };

  accessToken = body.access;
  persistUser(body.user);
  return { ok: true, status: response.status, user: body.user as User };
}

export async function register(data: Required<AuthPayload>) {
  const response = await fetch(`${API_BASE_URL}/user/auth/account/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });
  const body = await parseResponse(response);

  if (!response.ok) return { ok: false, status: response.status, error: body };

  accessToken = body.access;
  persistUser({ ...body.user, email: data.email });
  return { ok: true, status: response.status, user: { ...body.user, email: data.email } as User };
}

export async function logout() {
  await fetch(`${API_BASE_URL}/user/auth/logout/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  accessToken = null;
  persistUser(null);
}

export async function requestPasswordReset(email: string) {
  return apiJson<{ message: string }>("/user/auth/password/reset/", {
    method: "POST",
    body: JSON.stringify({ email }),
    skipAuthRefresh: true,
  });
}

export async function confirmPasswordReset(uid: string, token: string, newPassword: string) {
  return apiJson<{ message: string }>("/user/auth/password/reset/confirm/", {
    method: "POST",
    body: JSON.stringify({ uid, token, new_password: newPassword }),
    skipAuthRefresh: true,
  });
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const data = await apiJson<{ access: string; message: string }>("/user/auth/password/change/", {
    method: "POST",
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });
  accessToken = data.access;
  return data;
}

export async function deleteAccount() {
  await apiJson<null>("/user/auth/account/", { method: "DELETE" });
  accessToken = null;
  persistUser(null);
}
