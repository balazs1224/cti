# Product requirements

## 1. Objective

Deliver a managed service that repeatedly hunts selected indicators of compromise in customer SIEM platforms and sends enriched, deduplicated, actionable notifications when evidence is found.

## 2. Primary users

### Service operator

- manages TI sources and IOC selection;
- manages customer configurations and SIEM connections;
- monitors executions, failures and notification delivery;
- investigates false positives and tunes hunts;
- maintains adapter query templates.

### Customer SOC analyst

- receives the notification;
- validates the evidence in the customer environment;
- continues investigation or incident response;
- provides feedback on relevance and false positives.

The MVP does not require a customer-facing user interface.

## 3. Core use cases

### UC-01: Acquire an IOC

The system imports or receives an active IOC from OpenCTI or a compatible TI source. It validates and normalizes the indicator, records provenance and determines whether the IOC is eligible for hunting.

### UC-02: Schedule a hunt

The system creates a hunt execution for every eligible customer and SIEM integration according to the configured frequency, lookback window and IOC policy.

### UC-03: Query a SIEM

The SIEM adapter converts the normalized IOC and hunt policy into a safe, parameterized platform-specific query. It submits the query, polls when required and returns normalized evidence.

### UC-04: Handle no match

When no evidence is found, the execution is recorded as successful with zero matches. No customer notification is sent unless an explicit operational reporting policy requires it.

### UC-05: Handle a match

The system records evidence, enriches the IOC, calculates severity and confidence, applies deduplication and prepares a notification.

### UC-06: Deliver a notification

The notification adapter sends the event through the configured channel and records delivery status, external message or ticket identifier and retry history.

### UC-07: Retry safely

Transient errors are retried without creating duplicate hunts, evidence records, tickets or messages.

### UC-08: Suppress duplicates

Repeated evidence for the same customer, IOC and relevant event identity is merged or suppressed according to the deduplication policy.

### UC-09: Audit an alert

An operator can trace a notification back to:

- IOC and source;
- customer and integration;
- query template and parameters;
- hunt execution;
- raw or referenced SIEM evidence;
- enrichment results;
- severity decision;
- notification delivery.

## 4. IOC types

Initial supported types:

- IPv4 and IPv6 address;
- domain;
- URL;
- file hash: MD5, SHA-1 and SHA-256.

Later candidates, not required for the first vertical slice:

- email address;
- process or file name;
- certificate fingerprint;
- registry path;
- vulnerability identifier.

## 5. IOC lifecycle

Every IOC must contain or derive:

- canonical type and value;
- source and provenance reference;
- creation or ingestion timestamp;
- valid-from timestamp when available;
- expiry or valid-until timestamp when available;
- confidence;
- TLP or equivalent handling marking when available;
- active, expired, revoked or suppressed state;
- customer eligibility policy.

Expired, revoked or suppressed IOCs must not start new hunts.

## 6. Hunt policy

A customer policy may define:

- enabled IOC types;
- SIEM integration;
- query lookback;
- maximum frequency;
- minimum source confidence;
- excluded feeds or labels;
- notification threshold;
- notification channel;
- timezone and maintenance window;
- deduplication window;
- evidence retention reference.

## 7. Notification requirements

Every notification must include:

- customer-safe title;
- severity and confidence;
- IOC type and value;
- TI source summary;
- first and most recent relevant observation;
- SIEM source and evidence summary;
- affected asset, user or workload when available;
- enrichment summary;
- recommended analyst actions;
- investigation identifier;
- timestamp and service contact details.

Do not expose provider credentials, internal workflow URLs, stack traces or other customers' data.

## 8. Non-functional requirements

### Security

- least-privilege credentials;
- encrypted transport;
- encrypted secret storage;
- customer-context isolation;
- comprehensive audit trail;
- output encoding and injection protection;
- no autonomous containment.

### Reliability

- idempotent jobs;
- bounded retries with backoff;
- dead-letter handling;
- connector timeouts;
- circuit breaking or temporary disablement for failing integrations;
- resumable workflows.

### Operations

- health and readiness endpoints;
- structured logs;
- metrics by customer, adapter and workflow stage;
- alerting for execution backlog, failed hunts and failed notifications;
- documented recovery procedures.

### Performance

The implementation must support configurable concurrency and rate limits. No fixed production capacity is claimed until benchmarked with representative IOC volume, customer count, SIEM latency and query cost.

## 9. MVP success criteria

The MVP is successful when one SIEM adapter and one notification adapter complete the following end-to-end flow with synthetic data:

1. ingest a supported IOC;
2. create a customer hunt;
3. execute a SIEM query;
4. normalize a match;
5. enrich and score it;
6. deduplicate it;
7. send a notification;
8. provide an auditable execution trail;
9. recover safely from a simulated transient failure.
