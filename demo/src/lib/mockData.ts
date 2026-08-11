import type {
  AuditEvent,
  Customer,
  Decision,
  EnrichmentResult,
  Evidence,
  HuntExecution,
  HuntStatus,
  Ioc,
  IocType,
  Notification,
  Severity,
  SiemAdapter,
} from "./types";

// Deterministic PRNG so the demo looks stable across reloads.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const hex = (len: number) => {
  const chars = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(rand() * 16)];
  return out;
};
const ipv4 = () => `${int(1, 223)}.${int(0, 255)}.${int(0, 255)}.${int(1, 254)}`;
const domain = () =>
  `${pick(["auth", "cdn", "update", "mail", "portal", "api", "static"])}-${hex(6)}.${pick([
    "top",
    "xyz",
    "info",
    "click",
    "com",
  ])}`;

const now = new Date("2026-08-11T09:00:00Z").getTime();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();

export const customers: Customer[] = [
  { id: "cust-1", code: "NORDIC-BANK", displayName: "Nordic Bank Group", status: "ACTIVE", timezone: "Europe/Stockholm" },
  { id: "cust-2", code: "HELIX-MFG", displayName: "Helix Manufacturing", status: "ACTIVE", timezone: "Europe/Budapest" },
  { id: "cust-3", code: "ARDENT-RETAIL", displayName: "Ardent Retail Group", status: "ACTIVE", timezone: "Europe/London" },
  { id: "cust-4", code: "VELOX-LOG", displayName: "Velox Logistics", status: "PAUSED", timezone: "Europe/Warsaw" },
];

const siemAdapters: SiemAdapter[] = ["QRadar", "Defender XDR", "Splunk", "FortiSIEM"];
const iocTypes: IocType[] = ["IPV4", "IPV6", "DOMAIN", "URL", "MD5", "SHA1", "SHA256"];
const tiSources = ["OpenCTI / MISP feed", "OpenCTI / commercial feed", "OpenCTI / community feed", "OpenCTI / ISAC share"];
const labelPool = ["ransomware", "c2", "phishing-kit", "malware-loader", "botnet", "apt-suspected", "credential-harvesting"];

function makeIocValue(type: IocType): string {
  switch (type) {
    case "IPV4":
      return ipv4();
    case "IPV6":
      return `2001:db8:${hex(4)}:${hex(4)}::${hex(2)}`;
    case "DOMAIN":
      return domain();
    case "URL":
      return `https://${domain()}/${pick(["login", "update", "invoice", "wp-admin", "gate"])}.php`;
    case "MD5":
      return hex(32);
    case "SHA1":
      return hex(40);
    case "SHA256":
      return hex(64);
  }
}

export const iocs: Ioc[] = Array.from({ length: 42 }, (_, i) => {
  const type = pick(iocTypes);
  const ingested = minutesAgo(int(5, 60 * 24 * 6));
  return {
    id: `ioc-${i + 1}`,
    type,
    value: makeIocValue(type),
    fingerprint: `${type}:${hex(12)}`,
    state: pick<Ioc["state"]>(["ACTIVE", "ACTIVE", "ACTIVE", "EXPIRED", "SUPPRESSED"]),
    confidence: int(45, 98),
    source: pick(tiSources),
    labels: Array.from(new Set([pick(labelPool), pick(labelPool)])),
    tlp: pick(["TLP:CLEAR", "TLP:GREEN", "TLP:AMBER"]),
    firstIngestedAt: ingested,
    lastIngestedAt: ingested,
  };
});

const severities: Severity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFORMATIONAL"];
const reasonCodesBySeverity: Record<Severity, string[]> = {
  CRITICAL: ["MULTI_ASSET_MATCH", "HIGH_CONFIDENCE_TI_SOURCE", "MALICIOUS_ENRICHMENT_VERDICT"],
  HIGH: ["RECENT_INTELLIGENCE", "MALICIOUS_ENRICHMENT_VERDICT", "OUTBOUND_C2_PATTERN"],
  MEDIUM: ["MODERATE_TI_CONFIDENCE", "SINGLE_ASSET_MATCH"],
  LOW: ["LOW_TI_CONFIDENCE", "STALE_INTELLIGENCE"],
  INFORMATIONAL: ["ALLOWLIST_PARTIAL_MATCH", "BENIGN_ENRICHMENT_VERDICT"],
};

const evidenceSummaries = [
  "Outbound connection observed from workstation to indicator over TLS",
  "DNS resolution for indicator recorded from internal resolver",
  "Proxy log entry matching indicator URL pattern",
  "Endpoint process created network connection to indicator IP",
  "File hash matched on endpoint during scheduled AV scan",
];

function buildEvidence(huntId: string, adapter: SiemAdapter, n: number): Evidence[] {
  const datasetByAdapter: Record<SiemAdapter, string> = {
    QRadar: "Network Activity",
    "Defender XDR": "DeviceNetworkEvents",
    Splunk: "index=proxy",
    FortiSIEM: "Traffic Log",
  };
  return Array.from({ length: n }, (_, i) => ({
    id: `${huntId}-ev-${i + 1}`,
    huntExecutionId: huntId,
    sourceProduct: adapter,
    dataset: datasetByAdapter[adapter],
    eventTime: minutesAgo(int(1, 240)),
    host: `${pick(["ws", "srv", "vpn", "lt"])}-${int(100, 999)}`,
    userName: rand() > 0.4 ? `${pick(["j.smith", "a.kovacs", "m.nagy", "p.dubois", "s.andersson"])}` : undefined,
    sourceIp: ipv4(),
    destinationIp: ipv4(),
    summary: pick(evidenceSummaries),
  }));
}

function buildEnrichment(huntId: string, verdict: EnrichmentResult["verdict"]): EnrichmentResult[] {
  return [
    {
      id: `${huntId}-enr-1`,
      huntExecutionId: huntId,
      provider: pick(["VirusTotal", "AbuseIPDB", "GreyNoise", "Recorded Future"]),
      status: "SUCCESS",
      verdict,
      confidence: int(55, 96),
      summary:
        verdict === "MALICIOUS"
          ? "Multiple independent sources flag this indicator as actively malicious."
          : verdict === "SUSPICIOUS"
            ? "Indicator shares infrastructure with known malicious campaigns."
            : verdict === "BENIGN"
              ? "No corroborating malicious signal found; likely benign or shared infrastructure."
              : "Insufficient data to reach a verdict.",
    },
  ];
}

const statusWeights: [HuntStatus, number][] = [
  ["NO_MATCH", 46],
  ["DELIVERED", 14],
  ["QUERYING", 6],
  ["RETRY_PENDING", 5],
  ["ENRICHING", 4],
  ["DECIDING", 3],
  ["NOTIFICATION_PENDING", 4],
  ["MATCHED", 4],
  ["SCHEDULED", 4],
  ["RECEIVED", 3],
  ["FAILED", 4],
  ["SUPPRESSED", 3],
];
function weightedStatus(): HuntStatus {
  const total = statusWeights.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [status, w] of statusWeights) {
    if (r < w) return status;
    r -= w;
  }
  return "NO_MATCH";
}

const matchedStates: HuntStatus[] = [
  "MATCHED",
  "ENRICHING",
  "DECIDING",
  "NOTIFICATION_PENDING",
  "DELIVERED",
];

export const huntExecutions: HuntExecution[] = Array.from({ length: 168 }, (_, i) => {
  const status = weightedStatus();
  const customer = pick(customers.filter((c) => c.status === "ACTIVE"));
  const ioc = pick(iocs);
  const adapter = pick(siemAdapters);
  const startedAt = minutesAgo(int(2, 60 * 24 * 5));
  const id = `hunt-${i + 1}`;
  const hasMatch = matchedStates.includes(status) || status === "FAILED" && rand() > 0.5;
  const resultCount = hasMatch ? int(1, 6) : 0;

  const exec: HuntExecution = {
    id,
    correlationId: `corr-${hex(10)}`,
    customerId: customer.id,
    iocId: ioc.id,
    siemAdapter: adapter,
    status,
    resultCount,
    attemptCount: status === "RETRY_PENDING" ? int(2, 4) : 1,
    startedAt,
    completedAt: ["NO_MATCH", "DELIVERED", "FAILED", "SUPPRESSED"].includes(status)
      ? minutesAgo(int(0, 2))
      : undefined,
    windowStart: minutesAgo(int(60, 120)),
    windowEnd: minutesAgo(int(0, 59)),
    evidence: [],
    enrichment: [],
  };

  if (matchedStates.includes(status)) {
    exec.evidence = buildEvidence(id, adapter, resultCount);
  }
  if (["ENRICHING", "DECIDING", "NOTIFICATION_PENDING", "DELIVERED"].includes(status)) {
    const verdict = pick<EnrichmentResult["verdict"]>(["MALICIOUS", "MALICIOUS", "SUSPICIOUS", "BENIGN"]);
    exec.enrichment = buildEnrichment(id, verdict);
  }
  if (["DECIDING", "NOTIFICATION_PENDING", "DELIVERED"].includes(status)) {
    const severity = pick(severities);
    const decision: Decision = {
      id: `${id}-dec`,
      huntExecutionId: id,
      severity,
      confidence: int(50, 95),
      outcome: severity === "INFORMATIONAL" && rand() > 0.6 ? "SUPPRESS" : "NOTIFY",
      reasonCodes: reasonCodesBySeverity[severity],
      explanation: `Severity derived from TI confidence, ${exec.evidence.length} evidence record(s), and enrichment verdict per policy v3.`,
    };
    exec.decision = decision;
  }
  if (["NOTIFICATION_PENDING", "DELIVERED"].includes(status) && exec.decision?.outcome === "NOTIFY") {
    const channel = pick<Notification["channel"]>(["Email", "Microsoft Teams", "Slack", "Ticket"]);
    exec.notification = {
      id: `${id}-notif`,
      huntExecutionId: id,
      decisionId: exec.decision.id,
      customerId: customer.id,
      channel,
      severity: exec.decision.severity,
      status: status === "DELIVERED" ? "DELIVERED" : "PENDING",
      deduplicationKey: `${customer.id}:${ioc.fingerprint}:${exec.decision.severity}`,
      attemptCount: status === "DELIVERED" ? 1 : 0,
      firstDeliveryAt: status === "DELIVERED" ? minutesAgo(int(0, 1)) : undefined,
      lastDeliveryAt: status === "DELIVERED" ? minutesAgo(int(0, 1)) : undefined,
    };
  }

  return exec;
}).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

export const notifications: Notification[] = huntExecutions
  .map((h) => h.notification)
  .filter((n): n is Notification => Boolean(n));

const auditActions = [
  { action: "hunt.created", objectType: "HuntExecution" },
  { action: "hunt.completed", objectType: "HuntExecution" },
  { action: "decision.recorded", objectType: "Decision" },
  { action: "notification.sent", objectType: "Notification" },
  { action: "notification.retry", objectType: "Notification" },
  { action: "ioc.ingested", objectType: "IOC" },
  { action: "integration.health_check", objectType: "Integration" },
  { action: "operator.hunt_policy_updated", objectType: "HuntPolicy" },
];

export const auditEvents: AuditEvent[] = Array.from({ length: 80 }, (_, i) => {
  const template = pick(auditActions);
  const actorType = pick<AuditEvent["actorType"]>(["SERVICE", "WORKER", "N8N", "N8N", "OPERATOR"]);
  const relatedHunt = pick(huntExecutions);
  return {
    id: `audit-${i + 1}`,
    occurredAt: minutesAgo(int(1, 60 * 24 * 3)),
    actorType,
    actorId: actorType === "OPERATOR" ? pick(["j.doe@provider", "a.szabo@provider"]) : `${actorType.toLowerCase()}-worker-${int(1, 4)}`,
    action: template.action,
    objectType: template.objectType,
    objectId: relatedHunt.id,
    correlationId: relatedHunt.correlationId,
    outcome: rand() > 0.06 ? ("SUCCESS" as const) : ("FAILURE" as const),
  };
}).sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

export function customerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}
export function iocById(id: string): Ioc | undefined {
  return iocs.find((i) => i.id === id);
}
