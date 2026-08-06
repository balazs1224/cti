# MVP acceptance criteria

## 1. End-to-end scenario

Given an active synthetic IPv4 IOC from the mock TI source and an enabled synthetic customer policy:

1. the IOC is normalized and stored with provenance;
2. exactly one hunt execution is created for the policy and time window;
3. the selected SIEM adapter receives a safe query plan;
4. a synthetic match is normalized into evidence;
5. enrichment is executed or safely reported as unavailable;
6. deterministic severity and confidence are calculated;
7. deduplication decides whether to notify;
8. a customer-safe notification is delivered to the test channel;
9. the notification is traceable to the IOC, hunt, evidence and decision;
10. rerunning the same workflow does not create duplicate evidence or notification.

## 2. IOC handling

Accepted when:

- valid IPv4 values are canonicalized;
- malformed values are rejected with a bounded error;
- identical canonical values are deduplicated;
- different source assertions remain linked to the same IOC;
- expired, revoked and suppressed IOCs do not create new hunts;
- provenance, confidence and marking are retained.

## 3. Customer and policy isolation

Accepted when:

- all customer-specific operations require customer context;
- customer A credentials cannot be selected for customer B;
- customer A evidence cannot appear in customer B notification;
- cache, lock, idempotency and deduplication keys contain customer context;
- automated negative tests verify isolation.

## 4. SIEM adapter

Accepted when the first adapter supports:

- connectivity validation;
- least-privilege configuration documentation;
- approved data scope;
- safe query rendering;
- configurable lookback and result limit;
- success with no match;
- success with one and multiple matches;
- asynchronous polling when required;
- timeout and cancellation;
- rate-limit response;
- authentication and authorization failure classification;
- malformed response handling;
- contract tests without production credentials.

## 5. Evidence

Accepted when:

- adapter results are mapped to the canonical evidence model;
- event time and source record reference are retained where available;
- evidence fingerprint prevents duplicate persistence;
- large or sensitive raw payloads are not stored by default;
- normalization warnings are visible to operators;
- evidence is traceable to the query template and hunt execution.

## 6. Enrichment and decision

Accepted when:

- enrichment results contain source, time, expiry and status;
- one failed enrichment source does not invalidate the SIEM evidence;
- severity and confidence include reason codes;
- the decision policy is versioned;
- an allowlisted IOC can be suppressed;
- AI output is not the sole source of verdict or severity.

## 7. Notification

Accepted when:

- the canonical notification contains IOC, evidence, source, confidence and recommended next actions;
- untrusted values are escaped in every channel;
- secrets, internal URLs and stack traces are absent;
- delivery state and external reference are persisted;
- transient delivery failure is retried;
- retries do not create duplicate tickets or messages where idempotent update is supported;
- repeated matching evidence follows the configured suppression or update policy.

## 8. n8n workflow

Accepted when:

- the workflow is exportable and version-controlled;
- no credentials are present in the export;
- durable state remains in the application database;
- large SIEM payloads are not retained in workflow history;
- workflow errors lead to explicit application or operational states;
- restarting n8n does not lose or duplicate the business transaction.

## 9. Security

Accepted when:

- no credential or real customer data exists in repository history;
- secrets are referenced through an external mechanism;
- all external responses are schema-validated and bounded;
- query injection tests pass;
- cross-customer authorization tests pass;
- logs are reviewed for credential and telemetry leakage;
- network destinations can be restricted;
- no automatic blocking or isolation action is enabled;
- dependency, secret and static scans run in CI.

## 10. Operations

Accepted when:

- health and readiness endpoints exist;
- structured logs contain correlation IDs;
- metrics cover queue, adapter, hunt and notification status;
- operator alerts exist for authentication failure, backlog and notification failure;
- dead-letter items can be inspected and replayed safely;
- customer processing can be paused independently;
- backup and restore have been tested;
- restore or replay does not duplicate customer notifications.

## 11. Performance validation

No production capacity claim is accepted without a test report containing:

- IOC volume;
- customer count;
- hunt frequency;
- SIEM response-time distribution;
- query concurrency;
- match ratio;
- notification count;
- CPU, memory and database usage;
- queue lag;
- identified bottleneck;
- safe operating limit and assumptions.

## 12. Documentation

Accepted when the repository documents:

- product scope and non-goals;
- architecture and trust boundaries;
- data model;
- workflow state transitions;
- adapter contracts;
- security controls;
- operations and sizing assumptions;
- local setup and test commands;
- configuration placeholders;
- pilot onboarding and rollback.
