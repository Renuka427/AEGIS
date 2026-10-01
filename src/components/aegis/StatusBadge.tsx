import { cn } from "@/lib/utils";

type Tone = "success" | "critical" | "high" | "medium" | "info" | "neutral";

const TONE_MAP: Record<string, Tone> = {
  ALLOWED: "success",
  SUCCESS: "success",
  ACTIVE: "success",
  PASS: "success",
  CLOSED: "success",
  ALLOW: "success",
  BLOCKED: "critical",
  BLOCK: "critical",
  FAIL: "critical",
  CRITICAL: "critical",
  SUSPENDED: "critical",
  HIGH: "high",
  ESCALATE: "high",
  OPEN: "high",
  REDACTED: "medium",
  REDACT: "medium",
  WARN: "medium",
  MEDIUM: "medium",
  FLAGGED: "medium",
  INVESTIGATING: "info",
  EXTERNAL: "medium",
  PRIVATE: "info",
  LOW: "neutral",
  DISABLED: "neutral",
  SKIPPED: "neutral",
};

const TONE_CLASS: Record<Tone, string> = {
  success: "text-success border-success/30 bg-success/10",
  critical: "text-critical border-critical/30 bg-critical/10",
  high: "text-high border-high/30 bg-high/10",
  medium: "text-medium border-medium/30 bg-medium/10",
  info: "text-info border-info/30 bg-info/10",
  neutral: "text-muted-foreground border-border bg-muted/40",
};

export function StatusBadge({
  value,
  tone,
  dot = true,
  className,
}: {
  value: string;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  const resolved = tone ?? TONE_MAP[value.toUpperCase()] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        TONE_CLASS[resolved],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {value}
    </span>
  );
}