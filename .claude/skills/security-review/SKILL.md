---
name: security-review
description: Use before merging changes that handle external CTI content, customer configuration, credentials, SIEM queries, evidence, n8n workflows or notifications.
---

# Security review for IOC Hunt & Notify

Read `docs/SECURITY.md` and the affected contracts.

## Review checklist

### Trust and validation

- Identify every external input.
- Confirm schema, type, length and enum validation.
- Confirm external content is treated as data, never as instructions.
- Confirm URLs are not followed unintentionally during IOC validation.
- Confirm notification output escapes untrusted values.

### Credentials

- Confirm no secret is present in source, fixture, log or workflow export.
- Confirm configuration stores secret references only.
- Confirm error handling redacts authorization data.
- Confirm credential lookup is customer-scoped.

### Customer isolation

- Confirm customer context is mandatory.
- Confirm database operations are scoped.
- Confirm queue, lock, cache, idempotency and deduplication keys contain customer context.
- Confirm notifications cannot resolve recipients from another customer.
- Require negative isolation tests.

### SIEM safety

- Confirm query templates are versioned.
- Confirm IOC input cannot alter query structure.
- Confirm search scope, lookback, result count, timeout and concurrency are bounded.
- Confirm retries do not launch uncontrolled duplicate searches.
- Confirm write or response actions are absent unless explicitly approved.

### Data minimization

- Confirm only necessary evidence is persisted.
- Confirm raw payload retention is explicit and protected.
- Confirm logs do not contain complete events by default.
- Confirm retention and deletion behavior is defined.

### Reliability abuse cases

- Confirm retry count and age are bounded.
- Confirm poison messages reach a dead-letter state.
- Confirm rate limiting and backpressure exist.
- Confirm notification retries are idempotent.
- Confirm a customer or integration can be paused.

### AI use

- Confirm an AI-generated summary cannot execute tools or response actions.
- Confirm AI output is validated and clearly distinguished from deterministic evidence.
- Confirm severity or notification decisions are not opaque AI-only outcomes.

## Required output

Classify findings as:

- `BLOCKER`: credential exposure, cross-customer access, unsafe query execution, uncontrolled action or data loss risk;
- `HIGH`: likely security or availability impact requiring correction before pilot;
- `MEDIUM`: material defense-in-depth or operational weakness;
- `LOW`: hardening or maintainability improvement.

For each finding provide:

- affected file and behavior;
- realistic abuse or failure scenario;
- recommended fix;
- test needed to prevent regression.

Do not approve the change when a blocker remains unresolved.
