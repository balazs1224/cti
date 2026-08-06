# Integration contracts

## 1. Design principle

The core domain must not contain platform-specific SIEM, TI, enrichment or notification logic. All external systems are accessed through explicit adapters with normalized request and response contracts.

## 2. Common adapter behavior

Every adapter must define:

- configuration schema;
- credential requirements;
- connectivity test;
- timeout behavior;
- retry classification;
- rate-limit behavior;
- health status;
- version and capabilities;
- structured and redacted error output;
- contract tests using synthetic fixtures.

Errors must be categorized as:

- `TRANSIENT`;
- `AUTHENTICATION`;
- `AUTHORIZATION`;
- `RATE_LIMIT`;
- `INVALID_REQUEST`;
- `INVALID_RESPONSE`;
- `UNSUPPORTED`;
- `INTERNAL`.

## 3. Threat-intelligence adapter

### Input capability

The adapter should support polling or receiving indicators from OpenCTI or another compatible source.

### Normalized output

```json
{
  "source": "opencti",
  "source_object_id": "indicator--example",
  "type": "domain",
  "original_value": "Example.COM",
  "normalized_value": "example.com",
  "confidence": 80,
  "labels": ["malicious-activity"],
  "valid_from": "2026-08-06T00:00:00Z",
  "valid_until": "2026-09-06T00:00:00Z",
  "marking": "TLP:CLEAR",
  "context_summary": "Synthetic test indicator"
}
```

The adapter must not convert arbitrary descriptions into executable logic.

## 4. SIEM adapter interface

### Capabilities

```text
health_check(configuration) -> HealthResult
validate_configuration(configuration) -> ValidationResult
build_query(ioc, hunt_window, policy) -> QueryPlan
execute(query_plan, execution_context) -> SearchHandle or SearchResult
poll(search_handle) -> SearchResult
cancel(search_handle) -> CancelResult
normalize(raw_result, context) -> list[Evidence]
```

### Query plan

A query plan should contain:

- platform identifier;
- query template identifier and version;
- rendered or parameterized query;
- time window;
- data scope;
- maximum results;
- timeout;
- polling policy;
- sensitive-field flags;
- stable query fingerprint.

### Normalized evidence

```json
{
  "event_time": "2026-08-06T10:11:12Z",
  "source_product": "synthetic-siem",
  "dataset": "network-events",
  "host": "host-001.example.test",
  "user": null,
  "source_ip": "192.0.2.10",
  "destination_ip": "198.51.100.25",
  "domain": "example.test",
  "url": null,
  "file_hash": null,
  "process": null,
  "summary": "Synthetic IOC match",
  "source_record_reference": "event-123",
  "evidence_fingerprint": "sha256:...",
  "normalization_warnings": []
}
```

## 5. Platform-specific adapter notes

These notes are design targets, not claims about current licensed features. Authentication and API availability must be validated in the actual customer environment during onboarding.

### IBM QRadar

Adapter concerns:

- Ariel search creation and polling;
- AQL template management;
- search timeout and cancellation;
- pagination and result limits;
- tenant or domain scope where applicable;
- offense creation is out of scope unless separately approved.

### Microsoft Defender XDR

Adapter concerns:

- Microsoft identity and application permissions;
- Advanced Hunting query execution;
- KQL templates;
- result limits and time range handling;
- tenant isolation;
- incident modification is out of scope for the first hunting adapter.

### Splunk

Adapter concerns:

- search job creation and polling;
- SPL template versioning;
- earliest and latest time handling;
- index and role restrictions;
- result pagination;
- saved searches are optional, not required for the core contract.

### FortiSIEM

Adapter concerns:

- supported API and authentication method must be confirmed per deployed version;
- query and result semantics must be isolated in the adapter;
- organization or tenant scope must be explicit;
- API limitations must be discovered during a technical spike before delivery commitment.

## 6. Enrichment adapter interface

```text
health_check(configuration) -> HealthResult
enrich(ioc, context) -> EnrichmentResult
```

Normalized result:

```json
{
  "provider": "synthetic-provider",
  "status": "SUCCESS",
  "verdict": "MALICIOUS",
  "confidence": 85,
  "summary": "Synthetic enrichment result",
  "attributes": {},
  "observed_at": "2026-08-06T10:15:00Z",
  "expires_at": "2026-08-07T10:15:00Z",
  "raw_reference": null
}
```

The core must tolerate partial enrichment failure.

## 7. Notification adapter interface

```text
health_check(configuration) -> HealthResult
render(notification, template_version) -> RenderedNotification
deliver(rendered_notification, idempotency_key) -> DeliveryResult
update(existing_delivery_reference, rendered_notification) -> DeliveryResult
```

Canonical notification fields:

- notification ID;
- customer-safe title;
- severity and confidence;
- IOC details;
- evidence summary;
- affected entities;
- enrichment summary;
- recommended actions;
- timestamps;
- investigation ID;
- deduplication reason;
- provider contact reference.

Supported target adapters:

- email;
- Microsoft Teams;
- Slack;
- generic webhook;
- ticketing adapter implemented only after a target platform is selected.

## 8. Customer configuration

Per customer and integration, store references to:

- adapter type and version;
- endpoint or tenant identifier;
- secret reference, never the secret value in application configuration exports;
- allowed data scope;
- rate limit;
- query timeout;
- enabled IOC types;
- notification policy;
- operational owner;
- last successful health check;
- onboarding approval and change history.

## 9. Contract testing

Every adapter must provide fixtures for:

- successful connection;
- no-match result;
- single match;
- paginated multiple matches;
- asynchronous search;
- malformed response;
- authentication failure;
- authorization failure;
- timeout;
- rate limit;
- transient server error;
- cancellation;
- duplicate retry.

Tests must run without a production API credential.
