import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { pipeline } from "@/lib/pipeline";
import type { Role } from "@/lib/mock-data";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Aegis AI Governance" },
      { name: "description", content: "Sign in to the Aegis enterprise AI governance console." },
      { property: "og:title", content: "Sign in — Aegis AI Governance" },
      {
        property: "og:description",
        content: "Sign in to the Aegis enterprise AI governance console.",
      },
    ],
  }),
  component: LoginPage,
});

const ROLES: { role: Role; label: string; blurb: string }[] = [
  { role: "EMPLOYEE", label: "Employee", blurb: "Ask AI safely" },
  { role: "ADMIN", label: "Administrator", blurb: "Govern the platform" },
  { role: "SECURITY", label: "Security Officer", blurb: "Watch for threats" },
];

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex@company.com");
  const [password, setPassword] = useState("aegis-demo");
  const [role, setRole] = useState<Role>("ADMIN");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password, role);
      navigate({ to: "/" });
    } catch {
      setError("Those sign-in details were not accepted.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border p-10 lg:flex">
        <div className="absolute inset-0 grid-backdrop opacity-60" />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-identity to-ai text-primary-foreground">
              <ShieldAlert className="size-4.5" />
            </span>
            <p className="text-sm font-semibold tracking-tight">AEGIS</p>
          </div>
          <h1 className="mt-10 max-w-md text-3xl leading-tight font-semibold tracking-tight">
            AI is powerful. Aegis keeps the organisation in control.
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Every request passes through identity, security, policy and audit before an AI model
            ever sees it.
          </p>
        </div>

        <ol className="relative space-y-1.5">
          {pipeline.slice(1, 8).map((s) => (
            <li key={s.key} className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <span className="flex size-7 items-center justify-center rounded-lg border border-border bg-surface">
                <s.icon className="size-3.5" />
              </span>
              {s.label}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-center justify-center px-6 py-14">
        <form onSubmit={submit} className="panel w-full max-w-sm p-6">
          <h2 className="text-lg font-semibold tracking-tight">Sign in to Aegis</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose the role you want to demonstrate.
          </p>

          <label className="label-caps mt-6 block">Work email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-identity"
          />

          <label className="label-caps mt-4 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-identity"
          />

          <p className="label-caps mt-5">Role</p>
          <div className="mt-1.5 space-y-1.5">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.role}
                onClick={() => setRole(r.role)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  role === r.role
                    ? "border-identity/50 bg-identity/10 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {r.label}
                <span className="text-[11px] text-muted-foreground">{r.blurb}</span>
              </button>
            ))}
          </div>

          {error && <p className="mt-3 text-xs text-threat">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-identity to-ai px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Enter command center"}
          </button>
        </form>
      </div>
    </div>
  );
}