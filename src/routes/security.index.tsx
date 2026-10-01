import { Link, createFileRoute } from "@tanstack/react-router";
import { Ban, EyeOff, Radar, ShieldAlert } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { AppShell } from "@/components/aegis/AppShell";
import { PageHeader } from "@/components/aegis/PageHeader";
import { MetricCard } from "@/components/aegis/MetricCard";
import { RiskMeter } from "@/components/aegis/RiskMeter";
import { SecurityEventCard } from "@/components/aegis/SecurityEventCard";
import { securityTimeline } from "@/lib/pipeline";
import { securityEvents } from "@/lib/mock-data";

export const Route = createFileRoute("/security/")({
  head: () => ({
    meta: [
      { title: "Threat Center — Aegis" },
      {
        name: "description",
        content: "Live threat posture for AI usage: blocked secrets, injections and PII leaks.",
      },
      { property: "og:title", content: "Threat Center — Aegis" },
      { property: "og:description", content: "Live AI threat posture and open investigations." },
    ],
  }),
  component: ThreatCenter,
});

function ThreatCenter() {
  const open = securityEvents.filter((e) => e.status !== "CLOSED");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Security operations"
        title="Threat Center"
        description="What Aegis stopped in the last 24 hours, and what still needs a human decision."
        actions={
          <Link
            to="/security/events"
            className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            All events
          </Link>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <RiskMeter />
        <section className="panel p-5">
          <p className="label-caps">Events over the day</p>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={securityTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="events" fill="var(--color-scan)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="critical" fill="var(--color-threat)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Secrets blocked" value="92" tone="threat" icon={Ban} hint="30 days" />
        <MetricCard label="Injections stopped" value="57" tone="policy" icon={ShieldAlert} hint="30 days" />
        <MetricCard label="PII redactions" value="486" tone="sanitize" icon={EyeOff} hint="30 days" />
        <MetricCard label="Open investigations" value={String(open.length)} tone="scan" icon={Radar} hint="needs review" />
      </div>

      <h2 className="mt-7 mb-3 text-sm font-semibold">Needs attention</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {open.map((e) => (
          <SecurityEventCard key={e.id} event={e} />
        ))}
      </div>
    </AppShell>
  );
}