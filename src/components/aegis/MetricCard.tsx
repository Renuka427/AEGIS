import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TONE, type ToneKey } from "@/lib/pipeline";

export function MetricCard({
  label,
  value,
  delta,
  direction = "flat",
  hint,
  tone = "insight",
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  direction?: "up" | "down" | "flat";
  hint?: string;
  tone?: ToneKey;
  icon?: LucideIcon;
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <div className={cn("panel relative overflow-hidden p-5", className)}>
      <span className={cn("absolute inset-x-0 top-0 h-px", t.fill, "opacity-60")} />
      <div className="flex items-start justify-between gap-3">
        <span className="label-caps">{label}</span>
        {Icon && (
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-lg border",
              t.bg,
              t.border,
              t.text,
            )}
          >
            <Icon className="size-4" strokeWidth={1.9} />
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      <div className="mt-1.5 flex items-center gap-1.5 text-xs">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium tabular-nums",
              direction === "up" && "text-safe",
              direction === "down" && "text-threat",
              direction === "flat" && "text-muted-foreground",
            )}
          >
            {direction === "up" && <ArrowUpRight className="size-3.5" />}
            {direction === "down" && <ArrowDownRight className="size-3.5" />}
            {delta}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}