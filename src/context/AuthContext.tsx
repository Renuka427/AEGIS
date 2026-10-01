import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Role } from "@/lib/mock-data";
import { authService, type Session } from "@/services/authService";

interface AuthContextValue {
  session: Session | null;
  ready: boolean;
  signIn: (email: string, password: string, role: Role) => Promise<Session>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(authService.restore());
    setReady(true);
  }, []);

  const signIn = useCallback(async (email: string, password: string, role: Role) => {
    const next = await authService.login(email, password, role);
    setSession(next);
    return next;
  }, []);

  const signOut = useCallback(() => {
    authService.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, ready, signIn, signOut }),
    [session, ready, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}