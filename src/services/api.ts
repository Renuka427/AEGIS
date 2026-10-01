/**
 * Centralised API layer for the Aegis console.
 *
 * The production backend is Java + Spring Boot with JWT auth. Every service in
 * this folder calls through `api.request` once the endpoint exists; where it does
 * not yet exist the service returns mock data from src/lib/mock-data.ts and the
 * assumption is documented in that service file.
 */

export const API_BASE_URL = "/api";

function authHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("aegis.session");
    const token = raw ? (JSON.parse(raw) as { token?: string }).token : undefined;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export const api = {
  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
        ...(init.headers ?? {}),
      },
    });
    if (!res.ok) throw new Error(`Aegis API error ${res.status}`);
    return (await res.json()) as T;
  },

  simulateLatency(ms = 550) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};