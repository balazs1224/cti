import { Fingerprint, Radar, ShieldAlert, BellRing } from "lucide-react";
import { Panel } from "../components/Panel";
import { StatTile } from "../components/StatTile";
import { BarList } from "../components/BarList";
import { FlowDiagram } from "../components/FlowDiagram";
import { HuntStatusBadge, SeverityBadge } from "../components/Badge";
import { auditEvents, customerById, huntExecutions, iocById, iocs } from "../lib/mockData";
import type { Severity } from "../lib/types";

const severityOrder: Severity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFORMATIONAL"];
const severityColor: Record<Severity, string> = {
  CRITICAL: "var(--status-critical)",
  HIGH: "var(--status-serious)",
  MEDIUM: "var(--status-warning)",
  LOW: "var(--status-good)",
  INFORMATIONAL: "var(--text-muted)",
};
const adapterColor: Record<string, string> = {
  QRadar: "var(--series-1)",
  "Defender XDR": "var(--series-2)",
  Splunk: "var(--series-3)",
  FortiSIEM: "var(--series-4)",
};

export function Overview() {
  const totalHunts = huntExecutions.length;
  const matched = huntExecutions.filter((h) => h.resultCount > 0).length;
  const enriched = huntExecutions.filter((h) => h.enrichment.length > 0).length;
  const delivered = huntExecutions.filter((h) => h.notification?.status === "DELIVERED").length;
  const failed = huntExecutions.filter((h) => h.status === "FAILED").length;
  const activeIocs = iocs.filter((i) => i.state === "ACTIVE").length;

  const severityCounts = severityOrder.map((s) => ({
    label: s,
    value: huntExecutions.filter((h) => h.decision?.severity === s).length,
    color: severityColor[s],
  }));

  const adapterCounts = Object.entries(adapterColor).map(([label, color]) => ({
    label,
    value: huntExecutions.filter((h) => h.siemAdapter === label).length,
    color,
  }));

  const recent = huntExecutions.slice(0, 8);
  const recentAudit = auditEvents.slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label="Active IOCs" value={activeIocs.toLocaleString()} tone="accent" icon={<Fingerprint size={15} />} />
        <StatTile label="Hunt executions (5d)" value={totalHunts.toLocaleString()} tone="neutral" icon={<Radar size={15} />} />
        <StatTile
          label="Confirmed matches"
          value={matched.toLocaleString()}
          delta={Math.round((matched / totalHunts) * 100)}
          deltaLabel="of hunts"
          tone="serious"
          icon={<ShieldAlert size={15} />}
        />
        <StatTile
          label="Notifications delivered"
          value={delivered.toLocaleString()}
          tone="good"
          icon={<BellRing size={15} />}
        />
      </div>

      <Panel title="End-to-end pipeline" subtitle="Live counts across the current execution window">
        <FlowDiagram
          stages={[
            { label: "IOCs acquired", count: iocs.length, sublabel: "from OpenCTI feed" },
            { label: "Hunts executed", count: totalHunts, sublabel: "across 4 SIEM adapters" },
            { label: "Matches found", count: matched, sublabel: "evidence recorded" },
            { label: "Enriched", count: enriched, sublabel: "verdict + confidence" },
            { label: "Notified", count: delivered, sublabel: "delivered to customer" },
          ]}
        />
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Notifications by severity" subtitle="Decisions recorded across all customers">
          <BarList items={severityCounts} />
        </Panel>
        <Panel title="Hunts by SIEM adapter" subtitle="Distribution across integrated platforms">
          <BarList items={adapterCounts} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Recent hunt executions" subtitle="Most recently started">
          <div className="flex flex-col divide-y" style={{ borderColor: "var(--gridline)" }}>
            {recent.map((h) => {
              const ioc = iocById(h.iocId);
              const customer = customerById(h.customerId);
              return (
                <div key={h.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0" style={{ borderColor: "var(--gridline)" }}>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {ioc?.value ?? h.iocId}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {customer?.code} · {h.siemAdapter}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {h.decision && <SeverityBadge severity={h.decision.severity} />}
                    <HuntStatusBadge status={h.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Recent audit events" subtitle="Operator, service and n8n activity">
          <div className="flex flex-col divide-y" style={{ borderColor: "var(--gridline)" }}>
            {recentAudit.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0" style={{ borderColor: "var(--gridline)" }}>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {a.action}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {a.actorType.toLowerCase()} · {a.actorId}
                  </div>
                </div>
                <span
                  className="shrink-0 text-xs font-medium"
                  style={{ color: a.outcome === "SUCCESS" ? "var(--status-good)" : "var(--status-critical)" }}
                >
                  {a.outcome}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {failed > 0 && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {failed} hunt execution(s) currently in FAILED state — see Hunt Executions for details.
        </p>
      )}
    </div>
  );
}
