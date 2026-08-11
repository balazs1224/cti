import { useMemo, useState } from "react";
import { Panel } from "../components/Panel";
import { Table, type Column } from "../components/Table";
import { Badge } from "../components/Badge";
import { auditEvents } from "../lib/mockData";
import type { AuditActorType, AuditEvent } from "../lib/types";

const actorTypes: (AuditActorType | "ALL")[] = ["ALL", "OPERATOR", "SERVICE", "WORKER", "N8N"];

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function AuditTrail() {
  const [actorType, setActorType] = useState<AuditActorType | "ALL">("ALL");

  const rows = useMemo(
    () => auditEvents.filter((a) => actorType === "ALL" || a.actorType === actorType),
    [actorType],
  );

  const columns: Column<AuditEvent>[] = [
    { header: "Time", render: (a) => fmtTime(a.occurredAt) },
    { header: "Actor", render: (a) => `${a.actorType} · ${a.actorId}` },
    { header: "Action", render: (a) => a.action },
    { header: "Object", render: (a) => `${a.objectType} ${a.objectId}` },
    {
      header: "Correlation ID",
      render: (a) => (
        <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
          {a.correlationId}
        </span>
      ),
    },
    { header: "Outcome", render: (a) => <Badge tone={a.outcome === "SUCCESS" ? "good" : "critical"}>{a.outcome}</Badge> },
  ];

  return (
    <Panel
      title="Audit trail"
      subtitle="Append-only. Every notification traces back to IOC, hunt execution, evidence and decision (UC-09)."
      action={
        <select
          value={actorType}
          onChange={(e) => setActorType(e.target.value as AuditActorType | "ALL")}
          className="rounded-md border px-2 py-1.5 text-xs"
          style={{ borderColor: "var(--border)", background: "var(--panel)", color: "var(--text-secondary)" }}
        >
          {actorTypes.map((t) => (
            <option key={t} value={t}>
              {t === "ALL" ? "All actors" : t}
            </option>
          ))}
        </select>
      }
    >
      <Table columns={columns} rows={rows.slice(0, 60)} rowKey={(a) => a.id} />
    </Panel>
  );
}
