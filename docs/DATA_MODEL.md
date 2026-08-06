# Initial domain data model

## 1. Design goals

The data model must support traceability from an IOC to a customer notification without storing unnecessary customer telemetry. It must preserve provenance, customer isolation, idempotency and adapter-independent evidence.

This is a logical model. Exact SQL schema and indexes are implementation decisions to be documented with migrations and ADRs.

## 2. Customer

```text
Customer
- id: UUID
- code: string, unique, non-sensitive
- display_name: string
- status: ACTIVE | PAUSED | OFFBOARDING | DISABLED
- timezone: string
- created_at
- updated_at
```

Rules:

- customer context is mandatory for every customer-specific object;
- shared logs should prefer `code` or a pseudonymous identifier;
- pausing a customer prevents new hunts but does not delete audit history.

## 3. Integration

```text
Integration
- id: UUID
- customer_id: UUID
- category: TI | SIEM | ENRICHMENT | NOTIFICATION
- adapter_type: string
- adapter_version: string
- name: string
- endpoint_reference: string
- secret_reference: string
- configuration: JSONB
- status: ACTIVE | DEGRADED | PAUSED | DISABLED
- last_health_status
- last_health_at
- created_at
- updated_at
```

Never store secret values in `configuration`.

## 4. IOC

```text
IOC
- id: UUID
- type: IPV4 | IPV6 | DOMAIN | URL | MD5 | SHA1 | SHA256
- original_value: string
- normalized_value: string
- fingerprint: string, unique by type and normalized value
- state: ACTIVE | EXPIRED | REVOKED | SUPPRESSED
- valid_from
- valid_until
- first_ingested_at
- last_ingested_at
- created_at
- updated_at
```

The same canonical IOC may have multiple source assertions.

## 5. IOC source assertion

```text
IOCSourceAssertion
- id: UUID
- ioc_id: UUID
- source_integration_id: UUID
- source_object_id: string
- confidence: integer
- marking: string
- labels: JSONB
- context_summary: text, bounded
- observed_at
- valid_from
- valid_until
- raw_reference: string, optional
- created_at
- updated_at
```

This preserves provenance without duplicating the IOC.

## 6. Hunt policy

```text
HuntPolicy
- id: UUID
- customer_id: UUID
- siem_integration_id: UUID
- name: string
- version: integer
- enabled_ioc_types: JSONB
- minimum_confidence: integer
- lookback_seconds: integer
- frequency_seconds: integer
- max_results: integer
- query_timeout_seconds: integer
- deduplication_window_seconds: integer
- notification_threshold: string
- data_scope: JSONB
- exclusions: JSONB
- status: DRAFT | ACTIVE | RETIRED
- approved_at
- created_at
- updated_at
```

Activated policy versions are immutable. Changes create a new version.

## 7. Hunt execution

```text
HuntExecution
- id: UUID
- customer_id: UUID
- ioc_id: UUID
- hunt_policy_id: UUID
- siem_integration_id: UUID
- idempotency_key: string, unique
- correlation_id: string
- status: RECEIVED | SCHEDULED | QUERYING | RETRY_PENDING | NO_MATCH | MATCHED | ENRICHING | DECIDING | NOTIFICATION_PENDING | DELIVERED | FAILED | SUPPRESSED
- window_start
- window_end
- query_template_id: string
- query_template_version: string
- query_fingerprint: string
- attempt_count: integer
- result_count: integer
- started_at
- completed_at
- next_retry_at
- error_category
- error_summary: text, redacted and bounded
- created_at
- updated_at
```

## 8. Evidence

```text
Evidence
- id: UUID
- customer_id: UUID
- hunt_execution_id: UUID
- ioc_id: UUID
- evidence_fingerprint: string
- event_time
- observed_at
- source_product: string
- dataset: string
- host: string, optional
- user_name: string, optional
- source_ip: string, optional
- destination_ip: string, optional
- domain: string, optional
- url: string, optional
- file_hash: string, optional
- process_name: string, optional
- summary: text, bounded
- source_record_reference: string, optional
- raw_reference: string, optional
- normalization_warnings: JSONB
- created_at
```

Unique constraint should prevent duplicate evidence for the same customer and fingerprint within the intended identity semantics.

## 9. Enrichment result

```text
EnrichmentResult
- id: UUID
- customer_id: UUID
- hunt_execution_id: UUID
- ioc_id: UUID
- provider_integration_id: UUID
- status: SUCCESS | NO_DATA | TRANSIENT_FAILURE | PERMANENT_FAILURE
- verdict: MALICIOUS | SUSPICIOUS | BENIGN | UNKNOWN
- confidence: integer
- summary: text, bounded
- attributes: JSONB, allowlisted
- observed_at
- expires_at
- raw_reference: string, optional
- error_category
- created_at
```

## 10. Decision

```text
Decision
- id: UUID
- customer_id: UUID
- hunt_execution_id: UUID
- severity: CRITICAL | HIGH | MEDIUM | LOW | INFORMATIONAL
- confidence: integer
- outcome: NOTIFY | SUPPRESS | UPDATE_EXISTING
- reason_codes: JSONB
- policy_name: string
- policy_version: string
- explanation: text
- created_at
```

The explanation must be deterministic and auditable. AI may assist with wording but must not be the only basis for severity or outcome.

## 11. Notification

```text
Notification
- id: UUID
- customer_id: UUID
- hunt_execution_id: UUID
- decision_id: UUID
- notification_integration_id: UUID
- idempotency_key: string, unique
- deduplication_key: string
- severity: string
- status: PENDING | DELIVERING | DELIVERED | RETRY_PENDING | FAILED | SUPPRESSED
- template_id: string
- template_version: string
- external_reference: string, optional
- first_delivery_at
- last_delivery_at
- attempt_count: integer
- error_category
- error_summary: text, bounded and redacted
- created_at
- updated_at
```

## 12. Audit event

```text
AuditEvent
- id: UUID
- customer_id: UUID, nullable only for platform-wide events
- actor_type: OPERATOR | SERVICE | WORKER | N8N
- actor_id: string
- action: string
- object_type: string
- object_id: UUID or string
- correlation_id: string
- outcome: SUCCESS | FAILURE
- metadata: JSONB, redacted
- occurred_at
```

Audit events should be append-only from the application's perspective.

## 13. Operational event and dead-letter record

```text
DeadLetter
- id: UUID
- customer_id: UUID
- operation: string
- object_type: string
- object_id: string
- error_category: string
- redacted_payload_reference: string, optional
- first_failed_at
- last_failed_at
- attempt_count
- status: OPEN | REPLAYED | DISCARDED
- resolution_note
```

## 14. Indexing direction

Likely indexes:

- IOC fingerprint and state;
- active source assertions by expiry;
- hunt executions by customer, status and next retry;
- unique hunt idempotency key;
- evidence by customer, IOC and event time;
- unique evidence fingerprint under customer context;
- notification deduplication key and status;
- audit event by customer, correlation ID and time;
- integration health status and last health time.

Indexes must be validated with measured query patterns rather than added indiscriminately.

## 15. Retention direction

Different records require different retention:

- customer and integration configuration: contract lifecycle plus approved post-termination period;
- hunt execution metadata: operational and audit requirement;
- normalized evidence: minimum necessary period;
- raw evidence: avoided by default or retained briefly when explicitly required;
- enrichment cache: until expiry plus limited operational window;
- notifications: contractual and ticketing traceability period;
- audit events: longer protected retention according to service and compliance requirements.

No legal or regulatory retention period is asserted here. It must be agreed contractually and validated for the target jurisdiction and customer.
