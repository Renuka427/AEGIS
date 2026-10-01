import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/aegis/AppShell";
import { PageHeader } from "@/components/aegis/PageHeader";
import { MetricCard } from "@/components/aegis/MetricCard";
import { departmentRequests, tokenTrend } from "@/lib/pipeline";
import { latencyTrend, requestVolume } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Aegis" },
      {
        name: "description",
        content: "AI usage analytics: volume, latency, token consumption and departmental demand.",
      },
      { property: "og:title", content: "Analytics — Aegis" },
      { property: "og:description", content: "Usage, latency and demand analytics for governed AI." },
    ],
  }),
  component: AnalyticsPage,
});

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
};

function AnalyticsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="How the organisation actually uses AI — and what governance costs in latency."
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Requests" value="12,842" delta="+12.4%" direction="up" tone="access" />
        <MetricCard label="Avg latency" value="1.31s" delta="-4.0%" direction="down" tone="scan" />
        <MetricCard label="Tokens" value="6.6M" delta="+9.2%" direction="up" tone="ai" />
        <MetricCard label="Block rate" value="5.6%" delta="+0.4pt" direction="up" tone="threat" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="panel p-5">
          <p className="label-caps">Request volume</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={requestVolume}>
                <defs>
                  <linearGradient id="aVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-identity)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-identity)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="allowed" stroke="var(--color-identity)" fill="url(#aVol)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel p-5">
          <p className="label-caps">Latency with governance applied</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="ms" stroke="var(--color-scan)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel p-5">
          <p className="label-caps">Requests by department</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentRequests} layout="vertical">
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="department" type="category" width={90} stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={tooltipStyle} />
                <Bar dataKey="requests" fill="var(--color-ai)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel p-5">
          <p className="label-caps">Token consumption (thousands)</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tokenTrend}>
                <defs>
                  <linearGradient id="aTok" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-insight)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-insight)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="tokens" stroke="var(--color-insight)" fill="url(#aTok)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </AppShell>
  );
}