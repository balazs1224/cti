import type { HuntStatus, IocState, NotificationStatus, Severity } from "../lib/types";

export type Tone = "good" | "warning" | "serious" | "critical" | "neutral" | "accent";

const toneStyles: Record<Tone, string> = {
  good: "text-[var(--status-good)] bg-[var(--status-good-bg)]",
  warning: "text-[#8a5a00] dark:text-[var(--status-warning)] bg-[var(--status-warning-bg)]",
  serious: "text-[var(--status-serious)] bg-[var(--status-serious-bg)]",
  critical: "text-[var(--status-critical)] bg-[var(--status-critical-bg)]",
  neutral: "text-[var(--text-secondary)] bg-[var(--gridline)]/60",
  accent: "text-[var(--accent)] bg-[var(--accent-soft)]",
};

export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${toneStyles[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

const severityTone: Record<Severity, Tone> = {
  CRITICAL: "critical",
  HIGH: "serious",
  MEDIUM: "warning",
  LOW: "good",
  INFORMATIONAL: "neutral",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <Badge tone={severityTone[severity]}>{severity}</Badge>;
}

const huntStatusTone: Record<HuntStatus, Tone> = {
  RECEIVED: "neutral",
  SCHEDULED: "neutral",
  QUERYING: "accent",
  RETRY_PENDING: "warning",
  NO_MATCH: "good",
  MATCHED: "accent",
  ENRICHING: "accent",
  DECIDING: "accent",
  NOTIFICATION_PENDING: "accent",
  DELIVERED: "good",
  FAILED: "critical",
  SUPPRESSED: "neutral",
};

export function HuntStatusBadge({ status }: { status: HuntStatus }) {
  return <Badge tone={huntStatusTone[status]}>{status.replace(/_/g, " ")}</Badge>;
}

const notificationStatusTone: Record<NotificationStatus, Tone> = {
  PENDING: "neutral",
  DELIVERING: "accent",
  DELIVERED: "good",
  RETRY_PENDING: "warning",
  FAILED: "critical",
  SUPPRESSED: "neutral",
};

export function NotificationStatusBadge({ status }: { status: NotificationStatus }) {
  return <Badge tone={notificationStatusTone[status]}>{status.replace(/_/g, " ")}</Badge>;
}

const iocStateTone: Record<IocState, Tone> = {
  ACTIVE: "good",
  EXPIRED: "neutral",
  REVOKED: "critical",
  SUPPRESSED: "neutral",
};

export function IocStateBadge({ state }: { state: IocState }) {
  return <Badge tone={iocStateTone[state]}>{state}</Badge>;
}
