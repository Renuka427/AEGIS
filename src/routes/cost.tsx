import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/aegis/AppShell";
import { PageHeader } from "@/components/aegis/PageHeader";
import { MetricCard } from "@/components/aegis/MetricCard";
import { departmentSpend, modelSpend, models } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cost")({
  head: () => ({
    meta: [
      { title: "Cost & Usage — Aegis" },
      {
        name: "description",
        content: "AI spend by department and model, with budget guardrails and routing savings.",
      },
      { property: "og:title", content: "Cost & Usage — Aegis" },
      { property: "og:description", content: "AI spend, budgets and routing savings." },
    ],
  }),
  component: CostPage,
});

function CostPage() {
  const total = departmentSpend.reduce((s, d) => s + d.spend, 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Insights"
        title="Cost & Usage"
        description="Aegis routes to the cheapest approved model that still satisfies the policy, so governance also reduces spend."
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Spend this month" value={`$${total.toLocaleString()}`} delta="+3.6%" direction="up" tone="ai" />
        <MetricCard label="Saved by routing" value="$412" delta="+11%" direction="up" tone="safe" />
        <MetricCard label="Cost / 1k requests" value="$9.84" delta="-2.1%" direction="down" tone="insight" />
        <MetricCard label="Budget used" value="72%" hint="of $1,850" tone="policy" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="panel p-5">
          <p className="label-caps">Department budgets</p>
          <ul className="mt-4 space-y-3.5">
            {departmentSpend.map((d) => {
              const pct = Math.round((d.spend / d.budget) * 100);
              return (
                <li key={d.department}>
                  <div className="flex items-center justify-between text-xs">
                    <span>{d.department}</span>
                    <span className="tabular-nums text-muted-foreground">
                      ${d.spend} / ${d.budget}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        pct > 85 ? "bg-threat" : pct > 65 ? "bg-warn" : "bg-safe",
                      )}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="panel p-5">
          <p className="label-caps">Spend by model</p>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelSpend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="model" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="spend" fill="var(--color-ai)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="panel mt-4 p-5">
        <p className="label-caps">Unit economics</p>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="pb-2 font-medium">Model</th>
              <th className="pb-2 font-medium">Cost / 1k tokens</th>
              <th className="pb-2 font-medium">Share of traffic</th>
              <th className="pb-2 font-medium">Routing priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {models.map((m) => (
              <tr key={m.id}>
                <td className="py-2.5">{m.name}</td>
                <td className="py-2.5 tabular-nums">${m.costPer1k.toFixed(3)}</td>
                <td className="py-2.5 tabular-nums">{m.usageShare}%</td>
                <td className="py-2.5 tabular-nums">#{m.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}