import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Ban, Coins, ShieldCheck, Users as UsersIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/aegis/AppShell";
import { AegisFlow } from "@/components/aegis/AegisFlow";
import { MetricCard } from "@/components/aegis/MetricCard";
import { RiskMeter } from "@/components/aegis/RiskMeter";
import { StatusBadge } from "@/components/aegis/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { departmentRequests, eventDistribution, TONE } from "@/lib/pipeline";
import { requestVolume, securityEvents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center — Aegis AI Governance" },
      {
        name: "description",
        content:
          "Live view of every governed AI request: volume, blocked threats, spend and the Aegis decision pipeline.",
      },
      { property: "og:title", content: "Command Center — Aegis AI Governance" },
      {
        property: "og:description",
        content: "Live view of every governed AI request across the organisation.",
      },
    ],
  }),
  component: CommandCenter,
});

function CommandCenter() {
  const { session } = useAuth();
  const role = session?.user.role ?? "EMPLOYEE";

  return (
    <AppShell>
      <header className="mb-6">
        <p className="label-caps">Aegis command center</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">
          {session ? `Welcome back, ${session.user.name.split(" ")[0]}` : "Welcome to Aegis"}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          Aegis sits between your people and every AI model. Nothing reaches a model until it has
          passed identity, security and policy checks.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <AegisFlow />
        <RiskMeter />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Requests" value="12,842" delta="+12.4%" direction="up" hint="7 days" tone="access" icon={Activity} />
        <MetricCard label="Blocked" value="722" delta="+8.1%" direction="up" hint="threats stopped" tone="threat" icon={Ban} />
        <MetricCard label="Security events" value="96" delta="-4.2%" direction="down" hint="vs last week" tone="policy" icon={ShieldCheck} />
        <MetricCard label="AI spend" value="$1,284" delta="+3.6%" direction="up" hint="this month" tone="ai" icon={Coins} />
        <MetricCard label="Active users" value="214" delta="+6" direction="up" hint="last 24h" tone="identity" icon={UsersIcon} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <section className="panel p-5 xl:col-span-2">
          <p className="label-caps">Allowed vs blocked requests</p>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={requestVolume}>
                <defs>
                  <linearGradient id="gAllowed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-safe)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-safe)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-threat)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-threat)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="allowed" stroke="var(--color-safe)" fill="url(#gAllowed)" strokeWidth={2} />
                <Area type="monotone" dataKey="blocked" stroke="var(--color-threat)" fill="url(#gBlocked)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel p-5">
          <p className="label-caps">What gets stopped</p>
          <ul className="mt-4 space-y-3">
            {eventDistribution.map((e) => {
              const t = TONE[e.tone];
              return (
                <li key={e.type}>
                  <div className="flex items-center justify-between text-xs">
                    <span>{e.type}</span>
                    <span className="tabular-nums text-muted-foreground">{e.share}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", t.fill)} style={{ width: `${e.share}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentRequests}>
                <XAxis dataKey="department" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="requests" fill="var(--color-identity)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="panel mt-4 p-5">
        <div className="flex items-center justify-between">
          <p className="label-caps">Latest security activity</p>
          {role !== "EMPLOYEE" && (
            <Link to="/security/events" className="text-xs font-medium text-identity hover:underline">
              View all events
            </Link>
          )}
        </div>
        <ul className="mt-3 divide-y divide-border">
          {securityEvents.slice(0, 4).map((e) => (
            <li key={e.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
              <StatusBadge value={e.severity} />
              <span className="font-medium">{e.type}</span>
              <span className="text-xs text-muted-foreground">
                {e.user} · {e.model}
              </span>
              <span className="ml-auto flex items-center gap-2.5 text-xs text-muted-foreground">
                <StatusBadge value={e.action} />
                {e.ago}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}