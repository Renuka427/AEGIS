import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/aegis/AppShell";
import { PageHeader } from "@/components/aegis/PageHeader";
import { StatusBadge } from "@/components/aegis/StatusBadge";
import { policyService } from "@/services/aegisService";
import type { PolicyAction, Severity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/policies/builder")({
  head: () => ({
    meta: [
      { title: "Policy Builder — Aegis" },
      {
        name: "description",
        content: "Build an AI governance rule in plain language: when this happens, do that.",
      },
      { property: "og:title", content: "Policy Builder — Aegis" },
      { property: "og:description", content: "Compose AI guardrails without writing code." },
    ],
  }),
  component: PolicyBuilder,
});

const FIELDS = ["Data Classification", "Detection", "Model Type", "Role", "Requests / hour"];
const OPERATORS = ["equals", "contains", "greater than", "not equals"];
const ACTIONS: { action: PolicyAction; blurb: string }[] = [
  { action: "ALLOW", blurb: "Let the request through" },
  { action: "WARN", blurb: "Allow but flag it" },
  { action: "REDACT", blurb: "Hide sensitive parts first" },
  { action: "BLOCK", blurb: "Stop before any model" },
  { action: "ESCALATE", blurb: "Block and alert security" },
];
const SEVERITIES: Severity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function PolicyBuilder() {
  const navigate = useNavigate();
  const [name, setName] = useState("Block confidential data on external models");
  const [description, setDescription] = useState(
    "Confidential content must never reach a third-party AI provider.",
  );
  const [scope, setScope] = useState("Organization");
  const [action, setAction] = useState<PolicyAction>("BLOCK");
  const [severity, setSeverity] = useState<Severity>("CRITICAL");
  const [conditions, setConditions] = useState([
    { field: "Data Classification", operator: "equals", value: "CONFIDENTIAL" },
  ]);
  const [saved, setSaved] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const created = await policyService.create({
      name,
      description,
      status: "ACTIVE",
      action,
      severity,
      scope,
      conditions,
    });
    setSaved(created.id);
    setBusy(false);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Governance"
        title="Policy Builder"
        description="Describe the situation, then choose what Aegis should do. The preview shows the rule in plain language."
        actions={
          <button
            onClick={() => navigate({ to: "/policies" })}
            className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Back to policies
          </button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="panel space-y-5 p-5">
          <div>
            <label className="label-caps">Policy name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-identity"
            />
          </div>
          <div>
            <label className="label-caps">What it protects</label>
            <textarea
              value={description}
              rows={2}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full resize-none rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-identity"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="label-caps">When all of these are true</label>
              <button
                onClick={() =>
                  setConditions((c) => [...c, { field: "Detection", operator: "equals", value: "PII" }])
                }
                className="inline-flex items-center gap-1 text-xs font-medium text-identity"
              >
                <Plus className="size-3.5" /> Add condition
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {conditions.map((c, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background/40 p-2">
                  <select
                    value={c.field}
                    onChange={(e) =>
                      setConditions((cs) => cs.map((x, j) => (j === i ? { ...x, field: e.target.value } : x)))
                    }
                    className="rounded-lg border border-input bg-surface px-2 py-1.5 text-xs"
                  >
                    {FIELDS.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                  <select
                    value={c.operator}
                    onChange={(e) =>
                      setConditions((cs) => cs.map((x, j) => (j === i ? { ...x, operator: e.target.value } : x)))
                    }
                    className="rounded-lg border border-input bg-surface px-2 py-1.5 text-xs"
                  >
                    {OPERATORS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <input
                    value={c.value}
                    onChange={(e) =>
                      setConditions((cs) => cs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
                    }
                    className="min-w-32 flex-1 rounded-lg border border-input bg-surface px-2 py-1.5 text-xs"
                  />
                  {conditions.length > 1 && (
                    <button
                      aria-label="Remove condition"
                      onClick={() => setConditions((cs) => cs.filter((_, j) => j !== i))}
                      className="text-muted-foreground hover:text-threat"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="label-caps">Then Aegis will</label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {ACTIONS.map((a) => (
                <button
                  key={a.action}
                  onClick={() => setAction(a.action)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-left transition-colors",
                    action === a.action ? "border-identity/50 bg-identity/10" : "border-border",
                  )}
                >
                  <StatusBadge value={a.action} />
                  <p className="mt-1 text-xs text-muted-foreground">{a.blurb}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="label-caps">Severity</label>
              <div className="mt-1.5 flex gap-1.5">
                {SEVERITIES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeverity(s)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1 text-xs",
                      severity === s ? "border-identity/50 bg-identity/10" : "border-border text-muted-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-caps">Applies to</label>
              <input
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="mt-1.5 rounded-lg border border-input bg-background/60 px-3 py-1.5 text-xs"
              />
            </div>
          </div>
        </section>

        <section className="panel h-fit p-5">
          <p className="label-caps">Plain-language preview</p>
          <div className="mt-3 rounded-xl border border-border bg-background/40 p-4 text-sm leading-relaxed">
            <span className="text-muted-foreground">When a request where </span>
            {conditions.map((c, i) => (
              <span key={i}>
                <span className="font-medium text-identity">{c.field}</span>{" "}
                <span className="text-muted-foreground">{c.operator}</span>{" "}
                <span className="font-medium text-scan">{c.value || "…"}</span>
                {i < conditions.length - 1 && <span className="text-muted-foreground"> and </span>}
              </span>
            ))}
            <span className="text-muted-foreground">, Aegis will </span>
            <span className="font-semibold text-threat">{action.toLowerCase()}</span>
            <span className="text-muted-foreground"> the request for </span>
            <span className="font-medium">{scope}</span>.
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Request</span>
            <ArrowRight className="size-3.5" />
            <span>Policy engine</span>
            <ArrowRight className="size-3.5" />
            <StatusBadge value={action} />
          </div>

          <button
            onClick={save}
            disabled={busy}
            className="mt-5 w-full rounded-lg bg-gradient-to-r from-identity to-ai px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save policy"}
          </button>
          {saved && (
            <p className="mt-2 text-xs text-safe">
              Policy {saved} created and armed on the next request.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}