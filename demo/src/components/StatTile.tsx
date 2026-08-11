import type { Tone } from "./Badge";

const toneColor: Record<Tone, string> = {
  good: "var(--status-good)",
  warning: "var(--status-warning)",
  serious: "var(--status-serious)",
  critical: "var(--status-critical)",
  neutral: "var(--text-secondary)",
  accent: "var(--accent)",
};

export function StatTile({
  label,
  value,
  delta,
  deltaLabel,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  tone?: Tone;
  icon?: React.ReactNode;
}) {
  const deltaGood = delta !== undefined && delta >= 0;
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        {icon && (
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: `color-mix(in oklab, ${toneColor[tone]} 14%, transparent)`, color: toneColor[tone] }}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 text-[28px] font-semibold leading-none" style={{ color: "var(--text-primary)" }}>
        {value}
      </div>
      {delta !== undefined && (
        <div
          className="mt-2 text-xs font-medium"
          style={{ color: deltaGood ? "var(--status-good)" : "var(--status-critical)" }}
        >
          {deltaGood ? "+" : ""}
          {delta}% {deltaLabel}
        </div>
      )}
    </div>
  );
}
