import { Lock, Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import type { AegisModel } from "@/lib/mock-data";

export function ModelCard({ model }: { model: AegisModel }) {
  const isPrivate = model.type === "PRIVATE";
  const tone = isPrivate
    ? { text: "text-safe", bg: "bg-safe/10", border: "border-safe/35", fill: "bg-safe" }
    : { text: "text-ai", bg: "bg-ai/10", border: "border-ai/35", fill: "bg-ai" };

  return (
    <article className={cn("panel relative overflow-hidden p-5", isPrivate && "border-safe/25")}>
      <span className={cn("absolute inset-x-0 top-0 h-px opacity-70", tone.fill)} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-xl border",
              tone.bg,
              tone.border,
              tone.text,
            )}
          >
            {isPrivate ? <Lock className="size-4" /> : <Sparkle className="size-4" />}
          </span>
          <div>
            <h3 className="text-sm font-semibold">{model.name}</h3>
            <p className="text-xs text-muted-foreground">
              {model.provider} · {isPrivate ? "Private" : "External"}
            </p>
          </div>
        </div>
        <StatusBadge value={model.status} />
      </div>

      {isPrivate && (
        <p className="mt-3 rounded-lg border border-safe/25 bg-safe/10 px-3 py-2 text-xs text-safe">
          Private model — data never leaves the organisation.
        </p>
      )}

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Share of requests</span>
          <span className="tabular-nums">{model.usageShare}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full rounded-full", tone.fill)} style={{ width: `${model.usageShare}%` }} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {model.capabilities.map((c) => (
          <span key={c} className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
            {c}
          </span>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
        <div>
          <dt className="label-caps">Cost</dt>
          <dd className="mt-0.5 tabular-nums">${model.costPer1k.toFixed(3)} / 1k tokens</dd>
        </div>
        <div>
          <dt className="label-caps">Route priority</dt>
          <dd className="mt-0.5 tabular-nums">#{model.priority}</dd>
        </div>
      </dl>

      <div className="mt-3 space-y-1">
        <p className="label-caps">Access rules</p>
        {model.access.map((a) => (
          <div key={a.role} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{a.role}</span>
            <span className={a.allowed ? "text-safe" : "text-threat"}>
              {a.allowed ? "Allowed" : "Denied"}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}