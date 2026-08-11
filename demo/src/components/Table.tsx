export interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  numeric?: boolean;
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyLabel = "No rows match the current filters.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyLabel?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--border)" }}>
            {columns.map((col) => (
              <th
                key={col.header}
                className={`whitespace-nowrap px-3 py-2 text-left text-xs font-medium ${col.numeric ? "text-right" : ""}`}
                style={{ color: "var(--text-muted)" }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                {emptyLabel}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? "cursor-pointer" : ""}
              style={{ borderBottom: "1px solid var(--gridline)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gridline)33")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={`px-3 py-2.5 align-middle ${col.numeric ? "text-right tabular-nums" : ""} ${col.className ?? ""}`}
                  style={{ color: "var(--text-secondary)" }}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
