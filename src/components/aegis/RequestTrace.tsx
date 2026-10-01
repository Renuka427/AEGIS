import { Check, Minus, ShieldAlert, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StageStatus, TraceStage } from "@/lib/mock-data";

const STAGE_STYLE: Record<StageStatus, { ring: string; text: string; icon: typeof Check }> = {
  PASS: { ring: "border-success/40 bg-success/10", text: "text-success", icon: Check },
  WARN: { ring: "border-medium/40 bg-medium/10", text: "text-medium", icon: TriangleAlert },
  FAIL: { ring: "border-critical/40 bg-critical/10", text: "text-critical", icon: X },
  SKIPPED: { ring: "border-border bg-muted/30", text: "text-muted-foreground", icon: Minus },
};

export function RequestTrace({
  stages,
  requestId,
  compact = false,
}: {
  stages: TraceStage[];
  requestId?: string;
  compact?: boolean;
}) {
  return (
    <div>
      {requestId && (
        <div className="mb-4 flex items-center gap-2 text-xs">
          <ShieldAlert className="size-4 text-primary" />
          <span className="label-caps">Request</span>
          <span className="font-mono text-foreground">{requestId}</span>
        </div>
      )}
      <ol className="relative">
        {stages.map((stage, i) => {
          const s = STAGE_STYLE[stage.status];
          const Icon = s.icon;
          const last = i === stages.length - 1;
          return (
            <li key={stage.name} className="relative flex gap-3 pb-4 last:pb-0">
              {!last && (
                <span
                  className="absolute top-7 left-3.5 h-[calc(100%-1.75rem)] w-px bg-border"
                  aria-hidden
                />
              )}
              <span
                className={cn(
                  "z-10 flex size-7 shrink-0 items-center justify-center rounded-full border",
                  s.ring,
                  s.text,
                )}
              >
                <Icon className="size-3.5" strokeWidth={2.5} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className={cn("text-sm font-medium", stage.status === "SKIPPED" && "text-muted-foreground")}>
                  {stage.name}
                </p>
                {!compact && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{stage.detail}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}