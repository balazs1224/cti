# Open decisions

Claude must not silently choose these items. Resolve each through an ADR or an explicit project decision before implementation depends on it.

## D-01: First pilot SIEM

Candidates:

- IBM QRadar;
- Microsoft Defender XDR;
- Splunk;
- FortiSIEM.

Decision criteria:

- first customer opportunity;
- available test environment;
- API accessibility and permissions;
- query cost and operational impact;
- team experience;
- ability to create deterministic synthetic tests.

Current status: **OPEN**.

## D-02: First notification channel

Candidates:

- email;
- generic webhook;
- Microsoft Teams;
- Slack;
- ticketing platform.

Recommended MVP preference: email or generic webhook because they are straightforward to mock and test.

Current status: **OPEN**.

## D-03: TI integration mode

Options:

- polling OpenCTI GraphQL API;
- OpenCTI stream or connector-based integration;
- event pushed into the Hunt Service;
- provider-specific intermediate adapter.

Required inputs:

- OpenCTI deployment ownership;
- expected IOC volume and latency;
- authentication and network topology;
- marking and provenance requirements.

Current status: **OPEN**.

## D-04: Queue implementation

Options:

- Celery with Redis;
- Dramatiq with Redis;
- another explicitly justified worker model.

Decision criteria:

- retry semantics;
- idempotency support;
- observability;
- dead-letter handling;
- operational familiarity;
- n8n interaction model.

Current status: **OPEN**.

## D-05: Secret management

Options depend on deployment environment, for example:

- HashiCorp Vault;
- cloud-native secret manager;
- Kubernetes secrets with an approved encryption and access model;
- another enterprise secret platform.

Plain environment files are permitted only for local development with fake values and must never be committed.

Current status: **OPEN**.

## D-06: n8n responsibility boundary

The baseline decision is that n8n orchestrates but does not own durable state. The exact split between n8n and the Hunt Service still requires a sequence-level design.

Questions:

- Does n8n poll OpenCTI or does the Hunt Service?
- Does n8n invoke notification adapters directly or through the Hunt Service?
- Which errors require an n8n operational branch?
- What execution data is retained?

Current status: **PARTIALLY DECIDED**.

## D-07: Customer tenancy model

The MVP can run as one shared service with strict logical customer isolation, but the production packaging may require:

- shared application and shared database with customer-scoped rows;
- shared application with separate schema or database;
- dedicated deployment per customer.

Decision criteria:

- contractual isolation;
- customer network connectivity;
- operating cost;
- scale;
- compliance requirements;
- upgrade model.

Current status: **OPEN**.

## D-08: Evidence storage

Options:

- normalized metadata and source record reference only;
- bounded event excerpt;
- encrypted raw payload for a limited retention period;
- customer-side retrieval without provider-side raw storage.

Default direction: minimize provider-side customer telemetry.

Current status: **OPEN**.

## D-09: IOC batching

Batching may reduce query count but can complicate evidence attribution and platform-specific syntax.

Questions:

- Which IOC types can be batched safely?
- What is the maximum batch size per SIEM?
- How are timeouts and partial results attributed?
- How does batching affect deduplication and query cost?

Current status: **DEFERRED until the single-IOC vertical slice is measured**.

## D-10: Severity model

Inputs and thresholds must be agreed before customer use. The model must distinguish:

- TI source confidence;
- SIEM evidence quality;
- asset criticality;
- enrichment verdict;
- number and recency of observations;
- allowlists and known benign context.

Current status: **OPEN**.

## D-11: Retention

No default legal retention is assumed. Define separately for:

- hunt metadata;
- normalized evidence;
- raw payloads;
- notification history;
- audit history;
- n8n execution data.

Current status: **OPEN**.

## D-12: Service objectives and support

To be defined before commercial commitment:

- IOC processing objective;
- hunting frequency;
- notification delivery objective;
- supported hours;
- connector incident response;
- planned maintenance;
- customer responsibilities;
- exclusions for unavailable or throttled customer APIs.

Current status: **OPEN**.
