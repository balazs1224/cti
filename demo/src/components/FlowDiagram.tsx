import { ArrowRight } from "lucide-react";

export interface FlowStage {
  label: string;
  count: number;
  sublabel?: string;
}

export function FlowDiagram({ stages }: { stages: FlowStage[] }) {
  return (
    <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
      {stages.map((stage, i) => (
        <div key={stage.label} className="flex items-stretch">
          <div
            className="flex w-36 shrink-0 flex-col justify-center rounded-lg border px-3 py-3"
            style={{ borderColor: "var(--border)", background: "var(--panel)" }}
          >
            <div className="text-[22px] font-semibold leading-none tabular-nums" style={{ color: "var(--text-primary)" }}>
              {stage.count.toLocaleString()}
            </div>
            <div className="mt-1.5 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              {stage.label}
            </div>
            {stage.sublabel && (
              <div className="mt-0.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
                {stage.sublabel}
              </div>
            )}
          </div>
          {i < stages.length - 1 && (
            <div className="flex w-6 shrink-0 items-center justify-center">
              <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
