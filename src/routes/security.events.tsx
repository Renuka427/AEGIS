import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aegis/AppShell";
import { PageHeader } from "@/components/aegis/PageHeader";
import { SecurityEventCard } from "@/components/aegis/SecurityEventCard";
import { securityEvents, type Severity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/security/events")({
  head: () => ({
    meta: [
      { title: "Security Events — Aegis" },
      {
        name: "description",
        content: "Every AI security event Aegis raised, with severity, detection and outcome.",
      },
      { property: "og:title", content: "Security Events — Aegis" },
      { property: "og:description", content: "Full AI security event feed with drill-down." },
    ],
  }),
  component: SecurityEventsPage,
});

const FILTERS: (Severity | "ALL")[] = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

function SecurityEventsPage() {
  const [filter, setFilter] = useState<Severity | "ALL">("ALL");
  const rows = securityEvents.filter((e) => filter === "ALL" || e.severity === filter);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Security operations"
        title="Security Events"
        description="Each card explains what happened in plain language. Open one to see the full request trace."
        actions={
          <div className="flex gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-xs",
                  filter === f
                    ? "border-identity/50 bg-identity/10 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-3 lg:grid-cols-2">
        {rows.map((e) => (
          <SecurityEventCard key={e.id} event={e} />
        ))}
      </div>
      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">No events at this severity.</p>
      )}
    </AppShell>
  );
}