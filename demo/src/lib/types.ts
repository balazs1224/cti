export type IocType = "IPV4" | "IPV6" | "DOMAIN" | "URL" | "MD5" | "SHA1" | "SHA256";
export type IocState = "ACTIVE" | "EXPIRED" | "REVOKED" | "SUPPRESSED";
export type SiemAdapter = "QRadar" | "Defender XDR" | "Splunk" | "FortiSIEM";
export type NotificationChannel = "Email" | "Microsoft Teams" | "Slack" | "Ticket";

export type HuntStatus =
  | "RECEIVED"
  | "SCHEDULED"
  | "QUERYING"
  | "RETRY_PENDING"
  | "NO_MATCH"
  | "MATCHED"
  | "ENRICHING"
  | "DECIDING"
  | "NOTIFICATION_PENDING"
  | "DELIVERED"
  | "FAILED"
  | "SUPPRESSED";

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFORMATIONAL";

export type EnrichmentVerdict = "MALICIOUS" | "SUSPICIOUS" | "BENIGN" | "UNKNOWN";

export type NotificationStatus =
  | "PENDING"
  | "DELIVERING"
  | "DELIVERED"
  | "RETRY_PENDING"
  | "FAILED"
  | "SUPPRESSED";

export interface Customer {
  id: string;
  code: string;
  displayName: string;
  status: "ACTIVE" | "PAUSED" | "OFFBOARDING" | "DISABLED";
  timezone: string;
}

export interface Ioc {
  id: string;
  type: IocType;
  value: string;
  fingerprint: string;
  state: IocState;
  confidence: number;
  source: string;
  labels: string[];
  tlp: "TLP:CLEAR" | "TLP:GREEN" | "TLP:AMBER" | "TLP:RED";
  firstIngestedAt: string;
  lastIngestedAt: string;
}

export interface Evidence {
  id: string;
  huntExecutionId: string;
  sourceProduct: string;
  dataset: string;
  eventTime: string;
  host?: string;
  userName?: string;
  sourceIp?: string;
  destinationIp?: string;
  summary: string;
}

export interface EnrichmentResult {
  id: string;
  huntExecutionId: string;
  provider: string;
  status: "SUCCESS" | "NO_DATA" | "TRANSIENT_FAILURE" | "PERMANENT_FAILURE";
  verdict: EnrichmentVerdict;
  confidence: number;
  summary: string;
}

export interface Decision {
  id: string;
  huntExecutionId: string;
  severity: Severity;
  confidence: number;
  outcome: "NOTIFY" | "SUPPRESS" | "UPDATE_EXISTING";
  reasonCodes: string[];
  explanation: string;
}

export interface Notification {
  id: string;
  huntExecutionId: string;
  decisionId: string;
  customerId: string;
  channel: NotificationChannel;
  severity: Severity;
  status: NotificationStatus;
  deduplicationKey: string;
  attemptCount: number;
  firstDeliveryAt?: string;
  lastDeliveryAt?: string;
}

export interface HuntExecution {
  id: string;
  correlationId: string;
  customerId: string;
  iocId: string;
  siemAdapter: SiemAdapter;
  status: HuntStatus;
  resultCount: number;
  attemptCount: number;
  startedAt: string;
  completedAt?: string;
  windowStart: string;
  windowEnd: string;
  evidence: Evidence[];
  enrichment: EnrichmentResult[];
  decision?: Decision;
  notification?: Notification;
}

export type AuditActorType = "OPERATOR" | "SERVICE" | "WORKER" | "N8N";

export interface AuditEvent {
  id: string;
  occurredAt: string;
  actorType: AuditActorType;
  actorId: string;
  action: string;
  objectType: string;
  objectId: string;
  correlationId: string;
  outcome: "SUCCESS" | "FAILURE";
}
