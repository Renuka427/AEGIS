import { useState } from "react";
import { Check, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TONE, pipeline, type PipelineStage } from "@/lib/pipeline";
import { useViewMode } from "@/context/ViewModeContext";

/**
 * GovernanceNode — one stage of the Aegis pipeline.
 */
function GovernanceNode({
  stage,
  active,
  onSelect,
}: {
  stage: PipelineStage;
  active: boolean;
  onSelect: () => void;
}) {
  const t = TONE[stage.tone];
  const { mode } = useViewMode();
  return (
    <button
      onClick={onSelect}
      className={cn(
        "group panel-flat w-full min-w-40 flex-1 p-3 text-left transition-all hover:-translate-y-0.5",
        active && cn("ring-2", t.ring, t.bg),
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl border",
          t.bg,
          t.border,
          t.text,
        )}
      >
        <stage.icon className="size-4.5" strokeWidth={1.9} />
      </span>
      <p className="mt-2.5 text-sm font-semibold">{stage.label}</p>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
        {mode === "SIMPLE" ? stage.short : stage.technical}
      </p>
      <p className={cn("mt-2 text-[11px] font-medium tabular-nums", t.text)}>{stage.metric}</p>
    </button>
  );
}

export function AegisFlow({ stages = pipeline }: { stages?: PipelineStage[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const { mode } = useViewMode();
  const current = stages.find((s) => s.key === selected);

  return (
    <section className="panel grid-backdrop overflow-hidden p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-caps">Aegis request flow</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">
            Every AI request travels this path
          </h2>
          <p className="mt-1 max-w-xl text-xs text-muted-foreground">
            {mode === "SIMPLE"
              ? "Select any step to see what Aegis checks there."
              : "Select a stage to inspect its evaluators, decisions and metrics."}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-safe/35 bg-safe/10 px-3 py-1 text-xs font-medium text-safe">
          <span className="size-1.5 rounded-full bg-safe" /> Pipeline healthy
        </span>
      </div>

      <div className="flex flex-wrap items-stretch gap-2">
        {stages.map((stage, i) => (
          <div key={stage.key} className="flex min-w-40 flex-1 items-center gap-2">
            <GovernanceNode
              stage={stage}
              active={selected === stage.key}
              onSelect={() => setSelected(selected === stage.key ? null : stage.key)}
            />
            {i < stages.length - 1 && (
              <ChevronRight className="hidden size-4 shrink-0 text-muted-foreground xl:block" />
            )}
          </div>
        ))}
      </div>

      {current && (
        <div className={cn("mt-4 rounded-xl border p-4", TONE[current.tone].border, TONE[current.tone].bg)}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={cn("text-sm font-semibold", TONE[current.tone].text)}>
                {current.label.toUpperCase()}
              </p>
              <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
                {mode === "SIMPLE" ? current.simple : current.technical}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              aria-label="Close stage details"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {current.checks.map((c) => (
              <li
                key={c.name}
                className="flex items-center justify-between rounded-lg bg-background/40 px-3 py-2 text-xs"
              >
                <span className="text-muted-foreground">{c.name}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-medium",
                    c.ok ? "text-safe" : "text-warn",
                  )}
                >
                  {c.ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                  {c.result}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}