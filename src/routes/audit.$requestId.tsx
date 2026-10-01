import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/aegis/AppShell";
import { PageHeader } from "@/components/aegis/PageHeader";
import { RequestTrace } from "@/components/aegis/RequestTrace";
import { StatusBadge } from "@/components/aegis/StatusBadge";
import { auditLogs } from "@/lib/mock-data";

export const Route = createFileRoute("/audit/$requestId")({
  loader: ({ params }) => {
    const record = auditLogs.find((r) => r.id === params.requestId);
    if (!record) throw notFound();
    return { record };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.record.id} — Aegis Audit` },
          {
            name: "description",
            content: `Full governance trace for request ${loaderData.record.id}.`,
          },
          { property: "og:title", content: `${loaderData.record.id} — Aegis Audit` },
          {
            property: "og:description",
            content: `Full governance trace for request ${loaderData.record.id}.`,
          },
        ]
      : [{ title: "Unavailable — Aegis Audit" }, { name: "robots", content: "noindex" }],
  }),
  component: AuditDetail,
});

function AuditDetail() {
  const { record } = Route.useLoaderData();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Compliance"
        title={`Request ${record.id}`}
        description={`${record.user} · ${record.timestamp}`}
        actions={
          <Link
            to="/audit"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Back
          </Link>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <section className="panel h-fit p-5">
          <p className="label-caps">Summary</p>
          <dl className="mt-3 space-y-2.5 text-sm">
            {[
              ["Result", <StatusBadge key="r" value={record.result} />],
              ["Action", record.action],
              ["Resource", record.resource],
              ["Model", record.model],
              ["Policy", record.policy],
              ["Latency", `${record.latencyMs} ms`],
              ["Input tokens", record.inputTokens.toLocaleString()],
              ["Output tokens", record.outputTokens.toLocaleString()],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex items-center justify-between gap-3">
                <dt className="label-caps">{k}</dt>
                <dd className="text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="panel p-5">
          <p className="label-caps mb-4">Governance trace</p>
          <RequestTrace stages={record.trace} requestId={record.id} />
        </section>
      </div>
    </AppShell>
  );
}