import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aegis/AppShell";
import { PageHeader } from "@/components/aegis/PageHeader";
import { DataTable } from "@/components/aegis/DataTable";
import { StatusBadge } from "@/components/aegis/StatusBadge";
import { MetricCard } from "@/components/aegis/MetricCard";
import { users, type AegisUser } from "@/lib/mock-data";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users & Access — Aegis" },
      {
        name: "description",
        content: "Manage who can use AI, which models they reach and how much they consume.",
      },
      { property: "og:title", content: "Users & Access — Aegis" },
      { property: "og:description", content: "Role-based AI access control for every employee." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const totalRequests = users.reduce((s, u) => s + u.requests, 0);
  const totalBlocked = users.reduce((s, u) => s + u.blocked, 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Governance"
        title="Users & Access"
        description="Every identity, the models they may reach, and how often Aegis had to intervene."
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Identities" value={String(users.length)} hint="provisioned" tone="identity" />
        <MetricCard label="Requests" value={totalRequests.toLocaleString()} hint="all time" tone="access" />
        <MetricCard label="Blocked" value={String(totalBlocked)} hint="policy interventions" tone="threat" />
      </div>

      <div className="panel p-5">
        <DataTable<AegisUser>
          rows={users}
          searchPlaceholder="Search people, departments or roles…"
          searchFields={(u) => `${u.name} ${u.email} ${u.department} ${u.role}`}
          columns={[
            {
              key: "name",
              header: "Person",
              render: (u) => (
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              ),
            },
            { key: "department", header: "Department", render: (u) => u.department },
            { key: "role", header: "Role", render: (u) => <StatusBadge value={u.role} /> },
            { key: "status", header: "Status", render: (u) => <StatusBadge value={u.status} /> },
            {
              key: "models",
              header: "Model access",
              render: (u) => (
                <div className="flex flex-wrap gap-1">
                  {u.models.map((m) => (
                    <span
                      key={m.name}
                      className={
                        m.allowed
                          ? "rounded-md border border-safe/30 bg-safe/10 px-1.5 py-0.5 text-[11px] text-safe"
                          : "rounded-md border border-threat/30 bg-threat/10 px-1.5 py-0.5 text-[11px] text-threat"
                      }
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              ),
            },
            {
              key: "usage",
              header: "Usage",
              render: (u) => (
                <span className="text-xs tabular-nums text-muted-foreground">
                  {u.requests} req · {u.blocked} blocked · {(u.tokens / 1000).toFixed(1)}k tokens
                </span>
              ),
            },
          ]}
        />
      </div>
    </AppShell>
  );
}