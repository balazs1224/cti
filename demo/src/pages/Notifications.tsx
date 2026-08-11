import { Panel } from "../components/Panel";
import { Table, type Column } from "../components/Table";
import { NotificationStatusBadge, SeverityBadge } from "../components/Badge";
import { customerById, notifications } from "../lib/mockData";
import type { Notification } from "../lib/types";

function fmtTime(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function Notifications() {
  const columns: Column<Notification>[] = [
    { header: "Customer", render: (n) => customerById(n.customerId)?.code ?? n.customerId },
    { header: "Channel", render: (n) => n.channel },
    { header: "Severity", render: (n) => <SeverityBadge severity={n.severity} /> },
    { header: "Status", render: (n) => <NotificationStatusBadge status={n.status} /> },
    { header: "Attempts", render: (n) => n.attemptCount, numeric: true },
    {
      header: "Dedup key",
      render: (n) => (
        <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
          {n.deduplicationKey}
        </span>
      ),
    },
    { header: "First delivery", render: (n) => fmtTime(n.firstDeliveryAt) },
  ];

  const delivered = notifications.filter((n) => n.status === "DELIVERED").length;

  return (
    <Panel
      title="Notifications"
      subtitle={`${notifications.length} total · ${delivered} delivered · every row traces back to a hunt execution and decision`}
    >
      <Table columns={columns} rows={notifications} rowKey={(n) => n.id} />
    </Panel>
  );
}
