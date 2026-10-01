import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/aegis/AppShell";
import { PageHeader } from "@/components/aegis/PageHeader";
import { DataTable } from "@/components/aegis/DataTable";
import { StatusBadge } from "@/components/aegis/StatusBadge";
import { policies, type Policy } from "@/lib/mock-data";

export const Route = createFileRoute("/policies/")({
  head: () => ({
    meta: [
      { title: "Policies — Aegis" },
      {
        name: "description",
        content: "The rules Aegis enforces on every AI request, and how often each one fires.",
      },
      { property: "og:title", content: "Policies — Aegis" },
      { property: "og:description", content: "Rules enforced on every AI request in the runtime." },
    ],
  }),
  component: PoliciesPage,
});

function PoliciesPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Governance"
        title="Policies"
        description="Each policy is evaluated in priority order on every request. A single BLOCK stops the request before any model sees it."
        actions={
          <Link
            to="/policies/builder"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-identity to-ai px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-3.5" /> New policy
          </Link>
        }
      />

      <div className="panel p-5">
        <DataTable<Policy>
          rows={policies}
          searchPlaceholder="Search policies…"
          searchFields={(p) => `${p.name} ${p.description} ${p.action} ${p.scope}`}
          columns={[
            {
              key: "name",
              header: "Policy",
              render: (p) => (
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                </div>
              ),
            },
            { key: "action", header: "Action", render: (p) => <StatusBadge value={p.action} /> },
            { key: "severity", header: "Severity", render: (p) => <StatusBadge value={p.severity} /> },
            { key: "scope", header: "Scope", render: (p) => <span className="text-xs">{p.scope}</span> },
            { key: "status", header: "Status", render: (p) => <StatusBadge value={p.status} /> },
            {
              key: "triggers",
              header: "Fired (30d)",
              render: (p) => (
                <span className="tabular-nums text-xs">{p.triggers30d.toLocaleString()}</span>
              ),
            },
          ]}
        />
      </div>
    </AppShell>
  );
}