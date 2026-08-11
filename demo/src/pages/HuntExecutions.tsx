import { useMemo, useState } from "react";
import { Panel } from "../components/Panel";
import { Table, type Column } from "../components/Table";
import { HuntStatusBadge, SeverityBadge } from "../components/Badge";
import { customerById, huntExecutions, iocById } from "../lib/mockData";
import type { HuntExecution, HuntStatus, SiemAdapter } from "../lib/types";

const statuses: (HuntStatus | "ALL")[] = [
  "ALL",
  "RECEIVED",
  "SCHEDULED",
  "QUERYING",
  "RETRY_PENDING",
  "NO_MATCH",
  "MATCHED",
  "ENRICHING",
  "DECIDING",
  "NOTIFICATION_PENDING",
  "DELIVERED",
  "FAILED",
  "SUPPRESSED",
];
const adapters: (SiemAdapter | "ALL")[] = ["ALL", "QRadar", "Defender XDR", "Splunk", "FortiSIEM"];

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HuntExecutions() {
  const [status, setStatus] = useState<HuntStatus | "ALL">("ALL");
  const [adapter, setAdapter] = useState<SiemAdapter | "ALL">("ALL");

  const rows = useMemo(
    () =>
      huntExecutions.filter(
        (h) => (status === "ALL" || h.status === status) && (adapter === "ALL" || h.siemAdapter === adapter),
      ),
    [status, adapter],
  );

  const columns: Column<HuntExecution>[] = [
    {
      header: "IOC",
      render: (h) => {
        const ioc = iocById(h.iocId);
        return (
          <div className="min-w-0">
            <div className="truncate font-mono text-xs font-medium" style={{ color: "var(--text-primary)" }}>
              {ioc?.value ?? h.iocId}
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {ioc?.type}
            </div>
          </div>
        );
      },
    },
    {
      header: "Customer",
      render: (h) => customerById(h.customerId)?.code ?? h.customerId,
    },
    { header: "SIEM adapter", render: (h) => h.siemAdapter },
    { header: "Status", render: (h) => <HuntStatusBadge status={h.status} /> },
    { header: "Severity", render: (h) => (h.decision ? <SeverityBadge severity={h.decision.severity} /> : <span style={{ color: "var(--text-muted)" }}>—</span>) },
    { header: "Results", render: (h) => h.resultCount, numeric: true },
    { header: "Attempts", render: (h) => h.attemptCount, numeric: true },
    { header: "Started", render: (h) => fmtTime(h.startedAt) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Panel
        title="Hunt executions"
        subtitle={`${rows.length.toLocaleString()} of ${huntExecutions.length.toLocaleString()} executions`}
        action={
          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as HuntStatus | "ALL")}
              className="rounded-md border px-2 py-1.5 text-xs"
              style={{ borderColor: "var(--border)", background: "var(--panel)", color: "var(--text-secondary)" }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === "ALL" ? "All statuses" : s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <select
              value={adapter}
              onChange={(e) => setAdapter(e.target.value as SiemAdapter | "ALL")}
              className="rounded-md border px-2 py-1.5 text-xs"
              style={{ borderColor: "var(--border)", background: "var(--panel)", color: "var(--text-secondary)" }}
            >
              {adapters.map((a) => (
                <option key={a} value={a}>
                  {a === "ALL" ? "All adapters" : a}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <Table columns={columns} rows={rows.slice(0, 60)} rowKey={(h) => h.id} />
        {rows.length > 60 && (
          <p className="mt-3 text-center text-xs" style={{ color: "var(--text-muted)" }}>
            Showing 60 of {rows.length.toLocaleString()} matching executions.
          </p>
        )}
      </Panel>
    </div>
  );
}
