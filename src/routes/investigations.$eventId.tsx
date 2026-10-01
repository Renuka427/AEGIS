import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/aegis/PageHeader";
import { StatusBadge } from "@/components/aegis/StatusBadge";
import { securityEvents } from "@/lib/mock-data";

export const Route = createFileRoute("/investigations/$eventId")({
  head: () => ({
    meta: [
      { title: "Investigation — Aegis Security Console" },
      {
        name: "description",
        content: "Review a flagged AI security event, its detection details and policy match.",
      },
      { property: "og:title", content: "Investigation — Aegis Security Console" },
      {
        property: "og:description",
        content: "Review a flagged AI security event, its detection details and policy match.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ params }) => {
    const event = securityEvents.find((e) => e.id === params.eventId);
    if (!event) throw notFound();
    return { event };
  },
  component: InvestigationPage,
});

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-caps mb-1">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

function InvestigationPage() {
  const { event } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link
        to="/"
        className="mb-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back
      </Link>

      <PageHeader
        eyebrow={`Investigation · ${event.id}`}
        title={event.type}
        description={event.summary}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge value={event.severity} dot={false} />
            <StatusBadge value={event.status} dot={false} />
          </div>
        }
      />

      <div className="panel grid gap-5 p-5 sm:grid-cols-2">
        <Field label="User" value={event.user} />
        <Field label="Model" value={event.model} />
        <Field label="Action taken" value={event.action} />
        <Field label="Detected at" value={event.timestamp} />
        <Field label="Request ID" value={event.requestId} />
        <Field label="Policy" value={event.policy} />
        <Field label="Detection" value={event.detection} />
        <Field label="Forwarded to provider" value={event.forwarded ? "Yes" : "No"} />
      </div>
    </div>
  );
}