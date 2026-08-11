import { useMemo, useState } from "react";
import { Panel } from "../components/Panel";
import { Table, type Column } from "../components/Table";
import { IocStateBadge } from "../components/Badge";
import { iocs } from "../lib/mockData";
import type { Ioc, IocType } from "../lib/types";

const types: (IocType | "ALL")[] = ["ALL", "IPV4", "IPV6", "DOMAIN", "URL", "MD5", "SHA1", "SHA256"];

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function IocFeed() {
  const [type, setType] = useState<IocType | "ALL">("ALL");
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      iocs.filter(
        (i) =>
          (type === "ALL" || i.type === type) &&
          (query === "" || i.value.toLowerCase().includes(query.toLowerCase())),
      ),
    [type, query],
  );

  const columns: Column<Ioc>[] = [
    {
      header: "Indicator",
      render: (i) => (
        <span className="font-mono text-xs" style={{ color: "var(--text-primary)" }}>
          {i.value}
        </span>
      ),
    },
    { header: "Type", render: (i) => i.type },
    { header: "State", render: (i) => <IocStateBadge state={i.state} /> },
    { header: "Confidence", render: (i) => `${i.confidence}%`, numeric: true },
    { header: "TLP", render: (i) => i.tlp },
    {
      header: "Labels",
      render: (i) => (
        <div className="flex flex-wrap gap-1">
          {i.labels.map((l) => (
            <span
              key={l}
              className="rounded-full px-2 py-0.5 text-[11px]"
              style={{ background: "var(--gridline)", color: "var(--text-secondary)" }}
            >
              {l}
            </span>
          ))}
        </div>
      ),
    },
    { header: "Source", render: (i) => i.source },
    { header: "Last ingested", render: (i) => fmtTime(i.lastIngestedAt) },
  ];

  return (
    <Panel
      title="IOC feed"
      subtitle={`${rows.length} of ${iocs.length} indicators from OpenCTI`}
      action={
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search value…"
            className="rounded-md border px-2 py-1.5 text-xs"
            style={{ borderColor: "var(--border)", background: "var(--panel)", color: "var(--text-secondary)" }}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as IocType | "ALL")}
            className="rounded-md border px-2 py-1.5 text-xs"
            style={{ borderColor: "var(--border)", background: "var(--panel)", color: "var(--text-secondary)" }}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "ALL" ? "All types" : t}
              </option>
            ))}
          </select>
        </div>
      }
    >
      <Table columns={columns} rows={rows} rowKey={(i) => i.id} />
    </Panel>
  );
}
