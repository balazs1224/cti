import { useMemo, useState } from "react";
import { Panel } from "../components/Panel";
import { SeverityBadge } from "../components/Badge";
import { customerById, huntExecutions, iocById } from "../lib/mockData";

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function EvidenceDecisions() {
  const matched = useMemo(() => huntExecutions.filter((h) => h.evidence.length > 0), []);
  const [selectedId, setSelectedId] = useState(matched[0]?.id);
  const selected = matched.find((h) => h.id === selectedId) ?? matched[0];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
      <Panel title="Matched hunts" subtitle={`${matched.length} executions with evidence`} className="lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto">
        <div className="flex flex-col divide-y" style={{ borderColor: "var(--gridline)" }}>
          {matched.map((h) => {
            const ioc = iocById(h.iocId);
            const active = h.id === selected?.id;
            return (
              <button
                key={h.id}
                onClick={() => setSelectedId(h.id)}
                className="flex items-center justify-between gap-2 py-2.5 text-left first:pt-0 last:pb-0"
                style={{ borderColor: "var(--gridline)" }}
              >
                <div className="min-w-0">
                  <div
                    className="truncate font-mono text-xs font-medium"
                    style={{ color: active ? "var(--accent)" : "var(--text-primary)" }}
                  >
                    {ioc?.value ?? h.iocId}
                  </div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {customerById(h.customerId)?.code} · {h.siemAdapter}
                  </div>
                </div>
                {h.decision && <SeverityBadge severity={h.decision.severity} />}
              </button>
            );
          })}
        </div>
      </Panel>

      {selected && (
        <div className="flex flex-col gap-4">
          <Panel
            title={iocById(selected.iocId)?.value}
            subtitle={`${customerById(selected.customerId)?.displayName} · correlation ${selected.correlationId}`}
            action={selected.decision && <SeverityBadge severity={selected.decision.severity} />}
          >
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>SIEM adapter</div>
                <div style={{ color: "var(--text-primary)" }}>{selected.siemAdapter}</div>
              </div>
              <div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>Result count</div>
                <div style={{ color: "var(--text-primary)" }}>{selected.resultCount}</div>
              </div>
              <div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>Started</div>
                <div style={{ color: "var(--text-primary)" }}>{fmtTime(selected.startedAt)}</div>
              </div>
              <div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>Window</div>
                <div style={{ color: "var(--text-primary)" }}>
                  {fmtTime(selected.windowStart)} – {fmtTime(selected.windowEnd)}
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Evidence" subtitle={`${selected.evidence.length} record(s) from ${selected.siemAdapter}`}>
            <div className="flex flex-col gap-3">
              {selected.evidence.map((ev) => (
                <div key={ev.id} className="rounded-lg border p-3 text-sm" style={{ borderColor: "var(--border)" }}>
                  <div style={{ color: "var(--text-primary)" }}>{ev.summary}</div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span>dataset: {ev.dataset}</span>
                    {ev.host && <span>host: {ev.host}</span>}
                    {ev.userName && <span>user: {ev.userName}</span>}
                    {ev.sourceIp && <span>src: {ev.sourceIp}</span>}
                    {ev.destinationIp && <span>dst: {ev.destinationIp}</span>}
                    <span>{fmtTime(ev.eventTime)}</span>
                  </div>
                </div>
              ))}
              {selected.evidence.length === 0 && (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No evidence recorded.</p>
              )}
            </div>
          </Panel>

          {selected.enrichment.length > 0 && (
            <Panel title="Enrichment" subtitle="External verdict providers">
              <div className="flex flex-col gap-3">
                {selected.enrichment.map((e) => (
                  <div key={e.id} className="flex items-center justify-between rounded-lg border p-3 text-sm" style={{ borderColor: "var(--border)" }}>
                    <div>
                      <div style={{ color: "var(--text-primary)" }}>{e.provider}</div>
                      <div className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>{e.summary}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{e.verdict}</div>
                      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{e.confidence}% confidence</div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {selected.decision && (
            <Panel title="Severity decision" subtitle={`Outcome: ${selected.decision.outcome}`}>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>{selected.decision.explanation}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.decision.reasonCodes.map((code) => (
                  <span
                    key={code}
                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                  >
                    {code}
                  </span>
                ))}
              </div>
            </Panel>
          )}
        </div>
      )}
    </div>
  );
}
