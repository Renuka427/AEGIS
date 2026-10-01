import { useEffect, type ReactNode } from "react";
import { Link, useNavigate, useRouterState, type LinkProps } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bot,
  Coins,
  FileClock,
  LayoutDashboard,
  LogOut,
  Network,
  Radar,
  Scale,
  ShieldAlert,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useViewMode } from "@/context/ViewModeContext";
import type { Role } from "@/lib/mock-data";

interface NavItem {
  to: NonNullable<LinkProps["to"]>;
  label: string;
  icon: LucideIcon;
  roles: Role[];
}

const GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: "Command center",
    items: [
      { to: "/", label: "Overview", icon: LayoutDashboard, roles: ["EMPLOYEE", "ADMIN", "SECURITY"] },
      { to: "/workspace", label: "AI Workspace", icon: Bot, roles: ["EMPLOYEE", "ADMIN", "SECURITY"] },
      { to: "/governance-map", label: "Governance Map", icon: Network, roles: ["ADMIN", "SECURITY"] },
    ],
  },
  {
    group: "Governance",
    items: [
      { to: "/users", label: "Users", icon: Users, roles: ["ADMIN"] },
      { to: "/models", label: "AI Models", icon: Activity, roles: ["ADMIN", "EMPLOYEE"] },
      { to: "/policies", label: "Policies", icon: Scale, roles: ["ADMIN", "SECURITY"] },
    ],
  },
  {
    group: "Security",
    items: [
      { to: "/security", label: "Threat Center", icon: Radar, roles: ["SECURITY", "ADMIN"] },
      { to: "/security/events", label: "Security Events", icon: ShieldAlert, roles: ["SECURITY", "ADMIN"] },
    ],
  },
  {
    group: "Insights",
    items: [
      { to: "/analytics", label: "Analytics", icon: BarChart3, roles: ["ADMIN", "SECURITY"] },
      { to: "/cost", label: "Cost & Usage", icon: Coins, roles: ["ADMIN"] },
    ],
  },
  {
    group: "Compliance",
    items: [
      { to: "/audit", label: "Audit Trail", icon: FileClock, roles: ["ADMIN", "SECURITY", "EMPLOYEE"] },
    ],
  },
];

const ROLE_LABEL: Record<Role, string> = {
  EMPLOYEE: "Employee",
  ADMIN: "Administrator",
  SECURITY: "Security Officer",
};

export function AppShell({ children }: { children: ReactNode }) {
  const { session, ready, signOut } = useAuth();
  const { mode, setMode } = useViewMode();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const role: Role = session?.user.role ?? "EMPLOYEE";

  useEffect(() => {
    if (ready && !session) navigate({ to: "/login" });
  }, [ready, session, navigate]);

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl lg:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-identity to-ai text-primary-foreground">
            <ShieldAlert className="size-4.5" strokeWidth={2.2} />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight">AEGIS</p>
            <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              AI Governance
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {GROUPS.map((g) => {
            const items = g.items.filter((i) => i.roles.includes(role));
            if (!items.length) return null;
            return (
              <div key={g.group} className="mb-5">
                <p className="label-caps px-2.5 pb-2">{g.group}</p>
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const active =
                      item.to === "/" ? pathname === "/" : pathname.startsWith(String(item.to));
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                            active
                              ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                              : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                          )}
                        >
                          <item.icon
                            className={cn("size-4", active && "text-identity")}
                            strokeWidth={1.9}
                          />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-background/70 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs">
            <span className="size-2 rounded-full bg-safe glow-dot text-safe" />
            <span className="text-muted-foreground">System health</span>
            <span className="font-semibold tabular-nums">98.7%</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-border p-0.5 text-xs">
              {(["SIMPLE", "TECHNICAL"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-md px-2.5 py-1 font-medium transition-colors",
                    mode === m
                      ? "bg-identity/15 text-identity"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m === "SIMPLE" ? "Simple view" : "Technical view"}
                </button>
              ))}
            </div>

            {session && (
              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <p className="text-xs font-medium">{session.user.name}</p>
                  <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                    {ROLE_LABEL[session.user.role]}
                  </p>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    navigate({ to: "/login" });
                  }}
                  aria-label="Sign out"
                  className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="min-w-0 flex-1 px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}