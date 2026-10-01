import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/aegis/AppShell";
import { PageHeader } from "@/components/aegis/PageHeader";
import { DataTable } from "@/components/aegis/DataTable";
import { StatusBadge } from "@/components/aegis/StatusBadge";
import { auditLogs, type AuditRecord } from "@/lib/mock-data";

export const Route = createFileRoute("/audit/")({
  head: () => ({
    meta: [
      { title: "Audit Trail — Aegis" },
      {
        name: "description",
        content: "An append-only record of every AI request, decision and policy change.",
      },
      { property: "og:title", content: "Audit Trail — Aegis" },
      { property: "og:description", content: "Append-only evidence for AI compliance reviews." },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Compliance"
        title="Audit Trail"
        description="Select any record to replay the full request trace, stage by stage."
      />

      <div className="panel p-5">
        <DataTable<AuditRecord>
          rows={auditLogs}
          searchPlaceholder="Search by request, person, model or action…"
          searchFields={(r) => `${r.id} ${r.user} ${r.action} ${r.model} ${r.result}`}
          onRowClick={(r) => navigate({ to: "/audit/$requestId", params: { requestId: r.id } })}
          columns={[
            {
              key: "id",
              header: "Request",
              render: (r) => (
                <div>
                  <p className="font-mono text-xs">{r.id}</p>
                  <p className="text-xs text-muted-foreground">{r.timestamp}</p>
                </div>
              ),
            },
            { key: "user", header: "Person", render: (r) => r.user },
            { key: "action", header: "Action", render: (r) => <span className="text-xs">{r.action}</span> },
            { key: "model", header: "Model", render: (r) => <span className="text-xs">{r.model}</span> },
            { key: "result", header: "Result", render: (r) => <StatusBadge value={r.result} /> },
            {
              key: "meta",
              header: "Tokens / latency",
              render: (r) => (
                <span className="text-xs tabular-nums text-muted-foreground">
                  {r.inputTokens + r.outputTokens} tk · {r.latencyMs} ms
                </span>
              ),
            },
          ]}
        />
      </div>
    </AppShell>
  );
}