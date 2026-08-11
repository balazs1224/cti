export interface BarListItem {
  label: string;
  value: number;
  color: string;
}

export function BarList({ items }: { items: BarListItem[] }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="w-32 shrink-0 truncate text-xs" style={{ color: "var(--text-secondary)" }}>
            {item.label}
          </div>
          <div className="h-3 flex-1 overflow-hidden rounded-full" style={{ background: "var(--gridline)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(item.value / max) * 100}%`,
                background: item.color,
              }}
            />
          </div>
          <div className="w-10 shrink-0 text-right text-xs tabular-nums font-medium" style={{ color: "var(--text-primary)" }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
