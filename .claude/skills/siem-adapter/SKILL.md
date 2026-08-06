---
name: siem-adapter
description: Use when designing, implementing, testing or reviewing a QRadar, Defender XDR, Splunk or FortiSIEM hunting adapter.
---

# SIEM adapter development

Before implementation, read:

- `docs/INTEGRATION_CONTRACTS.md`
- `docs/WORKFLOW_SPEC.md`
- `docs/SECURITY.md`
- `docs/OPERATIONS_AND_SIZING.md`

## Required sequence

1. Identify the exact deployed product and API version assumptions.
2. Define the minimum permissions and approved search scope.
3. Document authentication, network and certificate requirements.
4. Define versioned query templates for each supported IOC type.
5. Create synthetic fixtures before real API integration.
6. Implement health check and configuration validation.
7. Implement safe query rendering.
8. Implement execution, polling, pagination, timeout and cancellation.
9. Normalize results into the canonical evidence contract.
10. Add contract tests for all required error paths.
11. Measure query duration and customer-side impact.
12. Update onboarding and operations documentation.

## Mandatory behavior

- Never place SIEM-specific fields in the core domain contract.
- Never concatenate untrusted report text into a query.
- Always bound lookback, result count, timeout and concurrency.
- Classify authentication, authorization, rate-limit, transient and permanent errors separately.
- Keep the same hunt identity across retries.
- Do not store full raw telemetry by default.
- Redact tokens, authorization headers and sensitive event fields from logs.
- Include customer context in every lock, cache, persistence and audit operation.
- Do not create offenses, incidents, tickets or response actions unless a separate adapter and approved scope require it.

## Platform review points

### QRadar

Check Ariel search lifecycle, AQL syntax, domain scope, result pagination, search cancellation and API permissions.

### Defender XDR

Check tenant identity, application permissions, Advanced Hunting/KQL limits, result limits and time-window semantics.

### Splunk

Check search-job lifecycle, SPL escaping, earliest/latest handling, index/role scope, result pagination and search concurrency impact.

### FortiSIEM

Verify the exact deployed version and supported API before committing delivery. Do not infer API behavior from another version.

## Completion report

Report:

- adapter capabilities;
- required permissions;
- query templates and supported IOC types;
- test coverage;
- performance measurements;
- known platform limitations;
- retry and failure behavior;
- operational metrics;
- unresolved customer dependencies.
