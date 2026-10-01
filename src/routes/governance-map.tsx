import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aegis/AppShell";
import { PageHeader } from "@/components/aegis/PageHeader";
import { AegisFlow } from "@/components/aegis/AegisFlow";
import { ExplainPanel } from "@/components/aegis/ExplainPanel";
import { TONE, pipeline } from "@/lib/pipeline";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/governance-map")({
  head: () => ({
    meta: [
      { title: "Governance Map — Aegis" },
      {
        name: "description",
        content: "A visual map of how Aegis governs an AI request from person to safe answer.",
      },
      { property: "og:title", content: "Governance Map — Aegis" },
      {
        property: "og:description",
        content: "See every control Aegis applies between a person and an AI model.",
      },
    ],
  }),
  component: GovernanceMap,
});

function GovernanceMap() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Architecture"
        title="Governance Map"
        description="Person → request → safety check → decision → AI model → safe result. Every layer is enforced in the runtime, not in policy documents."
      />

      <AegisFlow />

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="panel p-5">
          <p className="label-caps">Control layers</p>
          <ul className="mt-3 space-y-2">
            {pipeline.map((s) => {
              const t = TONE[s.tone];
              return (
                <li
                  key={s.key}
                  className={cn("flex items-start gap-3 rounded-xl border px-3.5 py-2.5", t.border, t.bg)}
                >
                  <span className={cn("mt-0.5", t.text)}>
                    <s.icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.technical}</p>
                  </div>
                  <span className={cn("ml-auto text-xs tabular-nums", t.text)}>{s.metric}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <ExplainPanel
          headline="Worked example · REQ-8392A"
          answer="Someone pasted a live cloud access key into a prompt heading to an external AI provider. Aegis stopped it at the security scan, so the key never left the company."
          steps={[
            { label: "Person", value: "John Carter · Finance", tone: "identity" },
            { label: "Requested model", value: "Claude 3.5 (external)", tone: "ai" },
            { label: "Detected", value: "AWS access key", tone: "threat" },
            { label: "Policy", value: "POL-003 · Secret protection", tone: "policy" },
            { label: "Decision", value: "Blocked before sending", tone: "threat" },
            { label: "Record", value: "Audit entry + security event", tone: "insight" },
          ]}
        />
      </div>
    </AppShell>
  );
}