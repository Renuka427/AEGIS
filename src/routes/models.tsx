import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aegis/AppShell";
import { PageHeader } from "@/components/aegis/PageHeader";
import { ModelCard } from "@/components/aegis/ModelCard";
import { models } from "@/lib/mock-data";

export const Route = createFileRoute("/models")({
  head: () => ({
    meta: [
      { title: "AI Models — Aegis" },
      {
        name: "description",
        content: "Approved AI models, routing priority, cost per 1k tokens and who may use them.",
      },
      { property: "og:title", content: "AI Models — Aegis" },
      { property: "og:description", content: "Approved models, routing priority and access rules." },
    ],
  }),
  component: ModelsPage,
});

function ModelsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Governance"
        title="AI Models"
        description="Aegis routes each request to the cheapest approved model that satisfies the policy — confidential work stays on private models."
      />
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {models.map((m) => (
          <ModelCard key={m.id} model={m} />
        ))}
      </div>
    </AppShell>
  );
}