export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border p-5 ${className}`}
      style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
    >
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
