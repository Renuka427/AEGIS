import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  deltaTone = "neutral",
  hint,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  hint?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("panel p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="label-caps">{label}</span>
        {Icon && <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta && (
          <span
            className={cn(
              "font-medium tabular-nums",
              deltaTone === "up" && "text-success",
              deltaTone === "down" && "text-critical",
              deltaTone === "neutral" && "text-muted-foreground",
            )}
          >
            {delta}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}