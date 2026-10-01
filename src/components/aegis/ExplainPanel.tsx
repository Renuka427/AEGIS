import { ArrowDown, Ban, ShieldQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { TONE, type ToneKey } from "@/lib/pipeline";

export interface ExplainStep {
  label: string;
  value: string;
  tone: ToneKey;
}

/**
 * "Why did Aegis do this?" — turns a technical decision into a plain-language
 * chain a non-technical evaluator can follow.
 */
export function ExplainPanel({
  headline,
  question = "Why did Aegis stop this request?",
  answer,
  steps,
}: {
  headline: string;
  question?: string;
  answer: string;
  steps: ExplainStep[];
}) {
  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg border border-threat/35 bg-threat/10 text-threat">
          <Ban className="size-4" />
        </span>
        <p className="text-sm font-semibold">{headline}</p>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background/40 p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <ShieldQuestion className="size-3.5" /> {question}
        </p>
        <p className="mt-1.5 text-sm">{answer}</p>
      </div>

      <ol className="mt-4 space-y-1.5">
        {steps.map((s, i) => {
          const t = TONE[s.tone];
          return (
            <li key={s.label}>
              <div className={cn("flex items-center justify-between rounded-xl border px-3.5 py-2.5", t.border, t.bg)}>
                <span className="label-caps">{s.label}</span>
                <span className={cn("text-sm font-semibold", t.text)}>{s.value}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="size-3.5 text-muted-foreground" />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}