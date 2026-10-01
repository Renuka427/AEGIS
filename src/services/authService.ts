import { users, type Role } from "@/lib/mock-data";
import { api } from "./api";

export interface Session {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    department: string;
  };
}

const STORAGE_KEY = "aegis.session";

/**
 * ASSUMPTION (documented): the Spring Boot backend will expose
 * POST /api/auth/login -> { token, user } and the JWT is attached by src/services/api.ts.
 * Until that endpoint exists, login resolves against mock identities.
 */
export const authService = {
  async login(email: string, password: string, role: Role): Promise<Session> {
    await api.simulateLatency();
    if (!email || !password) throw new Error("Email and password are required.");
    if (password.length < 4) throw new Error("Invalid credentials. Please try again.");

    const match = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    const resolvedRole = match?.role ?? role;
    const session: Session = {
      token: `mock.jwt.${Math.random().toString(36).slice(2, 10)}`,
      user: {
        id: match?.id ?? "USR-0000",
        name: match?.name ?? (email.split("@")[0] ?? "User").replace(/^\w/, (c) => c.toUpperCase()),
        email: match?.email ?? email.trim(),
        role: resolvedRole,
        department: match?.department ?? "Unassigned",
      },
    };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
    return session;
  },

  restore(): Session | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  },

  logout() {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  },
};