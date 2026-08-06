# Delivery plan

## Delivery principle

Build one complete, supportable vertical slice before adding more SIEMs, IOC types or notification channels. Every phase must produce a demonstrable outcome and an operable component.

## Phase 0: Repository and engineering baseline

Deliverables:

- agreed product scope and non-goals;
- architecture and data-model review;
- threat model;
- Python project skeleton;
- Docker Compose development environment;
- PostgreSQL migrations;
- Redis queue selection;
- structured logging and health endpoints;
- test, lint and type-check commands;
- synthetic mock services;
- CI pipeline;
- secret-scanning and dependency checks.

Exit criteria:

- local environment starts with one command;
- CI passes without production credentials;
- no unresolved decision blocks the first vertical slice.

## Phase 1: IOC intake and lifecycle

Recommended first IOC type: **IPv4 address**.

Deliverables:

- TI adapter contract;
- mock OpenCTI endpoint or fixtures;
- IOC normalization and validation;
- source assertions and provenance;
- active, expired, revoked and suppressed states;
- eligible-customer policy evaluation;
- idempotent hunt creation;
- unit and integration tests.

Exit criteria:

- synthetic IOCs are imported, deduplicated and evaluated correctly;
- invalid and expired IOCs cannot start hunts;
- provenance remains traceable.

## Phase 2: First SIEM adapter

Select exactly one pilot platform based on the first real customer opportunity. Do not implement all four adapters in parallel.

Deliverables:

- adapter interface;
- mock SIEM API;
- versioned query template;
- search execution and polling where required;
- timeout, cancellation, rate-limit and error mapping;
- normalized evidence;
- adapter contract tests;
- query performance and scope review.

Exit criteria:

- no-match, single-match, multiple-match, timeout and retry scenarios pass end to end;
- query is limited to the approved scope and lookback;
- no real customer credential is required in CI.

## Phase 3: Enrichment and deterministic decision

Deliverables:

- one enrichment adapter plus a mock;
- enrichment cache and expiry;
- partial-failure handling;
- deterministic severity and confidence rules;
- reason codes and policy version;
- allowlist or suppression support;
- tests for conflicting and missing enrichment.

Exit criteria:

- a SIEM match can be enriched and classified without an opaque AI-only decision;
- failed enrichment does not erase valid evidence.

## Phase 4: Notification and deduplication

Recommended first channel: email or generic webhook.

Deliverables:

- canonical notification model;
- customer-safe template;
- notification adapter;
- delivery retry and idempotency;
- deduplication and update policy;
- delivery audit trail;
- local mail sink or webhook receiver for testing.

Exit criteria:

- a repeated execution does not create duplicate messages;
- notification contains evidence, provenance, confidence and recommended action;
- no provider secret or internal stack detail is exposed.

## Phase 5: n8n orchestration

Deliverables:

- version-controlled n8n workflow export;
- workflow invokes narrow Hunt Service APIs;
- workflow exchanges compact identifiers and status objects;
- operational failure branch;
- execution-retention configuration;
- workflow import and update instructions;
- regression test for the end-to-end flow.

Exit criteria:

- n8n can trigger and observe the workflow;
- restarting n8n does not lose durable business state;
- workflow export contains no credentials.

## Phase 6: Operational hardening

Deliverables:

- metrics and dashboards;
- operator alerts;
- dead-letter workflow;
- credential-expiry monitoring;
- backup and restore test;
- queue replay procedure;
- customer pause switch;
- audit review;
- load test and initial capacity report;
- operations runbooks.

Exit criteria:

- a failed connector or notification is visible and recoverable;
- restore does not generate duplicate notifications;
- pilot sizing is based on measured test results.

## Phase 7: Pilot onboarding

Deliverables:

- customer technical questionnaire;
- least-privilege access design;
- endpoint and network validation;
- query scope approval;
- test IOC and controlled evidence validation;
- notification recipient approval;
- operational contacts and escalation path;
- documented known limitations;
- production readiness review.

Exit criteria:

- customer signs off the technical scope and responsibilities;
- test alert is received and traceable end to end;
- monitoring and rollback are active.

## Phase 8: Additional adapters

Only after the first adapter is stable:

- add the next SIEM adapter using the same contract;
- add Teams, Slack or ticketing channels;
- expand IOC types;
- introduce batch hunting where safe;
- add customer-specific tuning.

Each adapter requires its own technical spike, contract tests, sizing validation and customer communication.

## Initial backlog sequence for Claude

1. Create the project skeleton and development commands.
2. Implement domain enums and Pydantic contracts.
3. Implement IOC normalization for IPv4.
4. Implement PostgreSQL persistence and migration.
5. Implement idempotent hunt creation.
6. Implement mock TI adapter.
7. Implement mock SIEM adapter.
8. Implement one real SIEM adapter only after selection.
9. Implement normalized evidence.
10. Implement deterministic decision rules.
11. Implement notification adapter and deduplication.
12. Add n8n orchestration.
13. Add observability and operational runbooks.
14. Execute a complete synthetic E2E test.

## Explicit delivery risks

- implementing four SIEMs before proving the common contract;
- using n8n as the system of record;
- committing credentials during connector testing;
- generating broad or expensive SIEM queries;
- underestimating customer-specific API and permission differences;
- using AI output as an unaudited security verdict;
- retaining more customer telemetry than the service requires;
- selling production capacity before benchmark data exists.
