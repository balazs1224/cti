# Operations and sizing

## 1. Operating model

IOC Hunt & Notify is a managed service. The provider owns platform availability, connector health, workflow execution, feed handling, query maintenance, alert delivery and operational reporting.

The customer owns:

- availability and correctness of the provided SIEM API endpoint;
- approval of service-account permissions and search scope;
- notification recipients;
- incident response after receiving an alert;
- timely communication of SIEM upgrades and environment changes.

## 2. Service components to monitor

- TI backend availability and ingestion lag;
- active IOC count and IOC expiry backlog;
- hunt queue depth and oldest queued job;
- worker utilization and failure rate;
- SIEM adapter latency, errors and rate limiting;
- query count and query result volume per customer;
- enrichment latency, quota and failures;
- deduplication and suppression count;
- notification delivery success and retry backlog;
- PostgreSQL health, connections, storage and backup;
- Redis queue and memory health;
- n8n execution failures and retained execution data;
- certificate and credential expiry.

## 3. Recommended operational metrics

### IOC metrics

```text
active_iocs_total
new_iocs_total
expired_iocs_total
rejected_iocs_total
ioc_ingestion_lag_seconds
```

### Hunting metrics

```text
hunt_executions_total{customer,adapter,status}
hunt_duration_seconds{adapter}
hunt_queue_depth{customer,adapter}
hunt_oldest_job_age_seconds
hunt_matches_total{customer,adapter,ioc_type}
hunt_query_timeouts_total{customer,adapter}
hunt_rate_limit_events_total{customer,adapter}
```

### Notification metrics

```text
notifications_created_total{customer,severity}
notifications_suppressed_total{customer,reason}
notification_delivery_total{customer,channel,status}
notification_delivery_latency_seconds{channel}
```

Customer identifiers exposed to shared observability must be pseudonymous or appropriately access-controlled.

## 4. Operational alerts

Minimum alerts:

- TI ingestion has stopped or exceeded lag threshold;
- hunt queue age exceeds the customer processing objective;
- SIEM authentication or authorization failure;
- SIEM timeout/error ratio exceeds threshold;
- customer query rate approaches the approved limit;
- notification delivery repeatedly fails;
- dead-letter queue contains messages;
- database backup fails;
- disk or database capacity reaches warning threshold;
- credential or certificate approaches expiry;
- n8n executions fail or accumulate unexpectedly.

Separate threat findings from service-health alerts. Customers must not receive a threat notification for a technical connector failure unless a dedicated service-health channel is agreed.

## 5. Sizing inputs

Production sizing must be based on measured inputs. Required variables:

```text
C = number of customers
I = average active IOCs eligible per customer
F = average hunt frequency per IOC per day
Q = average SIEM query duration
R = average normalized results per query
E = enrichment calls per matched IOC
M = match ratio
N = notification ratio after deduplication
D = retention days for metadata and evidence references
P = peak-to-average arrival multiplier
```

Derived workload indicators:

```text
hunts_per_day = C * I * F
peak_hunts_per_second = hunts_per_day / 86400 * P
concurrent_queries ≈ peak_hunts_per_second * Q
matches_per_day = hunts_per_day * M
notifications_per_day = matches_per_day * N
enrichment_calls_per_day = matches_per_day * E
```

These formulas are planning aids, not performance guarantees. Benchmark the selected SIEM APIs because customer-side query concurrency and latency are likely to be the primary constraint.

## 6. Development profile

Suggested local or cloud-development profile:

- 4 vCPU;
- 12–16 GB RAM;
- 50–100 GB storage;
- PostgreSQL, Redis, n8n, API and worker through Docker Compose;
- mock TI, SIEM and notification endpoints;
- small synthetic fixture set.

Do not deploy full production OpenCTI and multiple search-heavy components in a restricted cloud coding environment unless resource usage has been validated.

## 7. Initial pilot profile

A conservative pilot starting point for a small number of customers and controlled IOC volume:

### Application node

- 4–8 vCPU;
- 16–32 GB RAM;
- stateless API plus bounded worker concurrency.

### PostgreSQL

- 4 vCPU;
- 16 GB RAM;
- fast SSD;
- point-in-time recovery or equivalent backup strategy.

### Redis

- 2–4 vCPU;
- 4–8 GB RAM;
- persistence appropriate to the selected queue implementation.

### n8n

- 2–4 vCPU;
- 4–8 GB RAM;
- external PostgreSQL;
- execution-data retention configured explicitly.

These are only engineering starting points. Final sizing requires a load test using representative IOC volume, customer count, SIEM latency, query concurrency and retention.

## 8. Capacity risks

### Query explosion

A naive `customers × IOCs × frequency` model can create excessive SIEM load. Mitigations:

- batch compatible IOC types where the SIEM supports it;
- group by time window and data source;
- prioritize high-confidence and recent IOCs;
- avoid re-querying unchanged expired data;
- configure per-customer query budgets;
- maintain backpressure.

### Long-running SIEM searches

Mitigations:

- strict lookback limits;
- approved index or dataset scopes;
- asynchronous polling;
- timeouts and cancellation;
- limited result count;
- query template performance tests.

### Evidence retention growth

Mitigations:

- store normalized evidence and references by default;
- avoid storing full raw event payloads unless required;
- compress or archive approved raw evidence;
- enforce retention and deletion jobs;
- monitor bytes per match and bytes per customer.

### n8n execution-history growth

Mitigations:

- keep payloads compact;
- configure successful and failed execution retention;
- avoid placing SIEM result sets in workflow history;
- monitor execution database growth.

## 9. Backup and recovery

Back up:

- PostgreSQL configuration and state;
- n8n workflow definitions and required metadata;
- infrastructure configuration;
- query templates;
- notification templates;
- encryption metadata and documented secret-recovery process;
- audit records according to retention requirements.

Do not back up secrets in unencrypted workflow exports or source control.

Recovery validation must include:

1. restoring the database;
2. restoring workflow definitions;
3. reconnecting secret references;
4. resuming queued work without duplicate notifications;
5. verifying customer isolation;
6. validating one synthetic end-to-end hunt.

## 10. Change management

Changes requiring customer coordination:

- SIEM endpoint or authentication method;
- application permission changes;
- query scope or lookback changes;
- new IOC type;
- increased query frequency;
- notification recipients or ticket-project changes;
- retention changes;
- customer SIEM upgrade affecting API or query syntax.

Maintain versioned query templates and a rollback path. Validate changes against a test or controlled customer scope before broad rollout.

## 11. Operational runbooks to create before pilot

- SIEM authentication failure;
- SIEM query timeout or rate limiting;
- feed ingestion stopped;
- enrichment quota exhausted;
- notification delivery failure;
- duplicate notification incident;
- suspected customer-data crossover;
- credential compromise and revocation;
- database restore;
- queue backlog and safe replay;
- platform pause per customer.
