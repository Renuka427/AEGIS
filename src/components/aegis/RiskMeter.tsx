import { cn } from "@/lib/utils";
import { TONE, severityCounts } from "@/lib/pipeline";

export function RiskMeter({ score = 98.7 }: { score?: number }) {
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="panel p-5">
      <p className="label-caps">Security status</p>
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <div className="relative size-32 shrink-0">
          <svg viewBox="0 0 120 120" className="size-32 -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--color-safe)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold tabular-nums">{score}%</span>
            <span className="text-[10px] tracking-[0.14em] text-safe uppercase">Protected</span>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
          {severityCounts.map((s) => {
            const t = TONE[s.tone];
            return (
              <div key={s.level} className={cn("rounded-xl border p-3", t.border, t.bg)}>
                <p className={cn("text-[10px] font-semibold tracking-wider", t.text)}>{s.level}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{s.count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}