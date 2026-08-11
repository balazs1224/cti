import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Radar,
  Fingerprint,
  ShieldAlert,
  BellRing,
  ScrollText,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/hunts", label: "Hunt Executions", icon: Radar },
  { to: "/iocs", label: "IOC Feed", icon: Fingerprint },
  { to: "/evidence", label: "Evidence & Decisions", icon: ShieldAlert },
  { to: "/notifications", label: "Notifications", icon: BellRing },
  { to: "/audit", label: "Audit Trail", icon: ScrollText },
];

export function Layout() {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--page-plane)" }}>
      <aside
        className="hidden md:flex w-60 shrink-0 flex-col gap-1 border-r px-3 py-5"
        style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
      >
        <div className="flex items-center gap-2 px-2 pb-6">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "var(--accent)" }}
          >
            <ShieldCheck className="h-4.5 w-4.5 text-white" size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              IOC Hunt &amp; Notify
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              Operator console (demo)
            </div>
          </div>
        </div>

        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? "" : "hover:bg-[var(--gridline)]/50"
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? "var(--accent)" : "var(--text-secondary)",
              background: isActive ? "var(--accent-soft)" : "transparent",
            })}
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}

        <div className="mt-auto px-3 pt-6 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Synthetic data only. No customer telemetry. Internal demo build.
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
        >
          <div>
            <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Operator Console
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Managed IOC hunting, enrichment and notification pipeline
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
            <span className="h-2 w-2 rounded-full" style={{ background: "var(--status-good)" }} />
            All integrations operational
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
