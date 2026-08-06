# Customer onboarding checklist

## 1. Commercial and scope confirmation

Confirm in writing:

- selected SIEM platform and deployed version;
- supported IOC types;
- hunting frequency and lookback;
- included feeds and minimum confidence;
- notification channel and recipients;
- evidence presented in the notification;
- expected customer response process;
- service hours and escalation contacts;
- exclusions and current limitations;
- data retention and deletion expectations;
- whether customer-side testing or change approval is required.

Do not promise fixed capacity, universal API compatibility or response automation before technical validation.

## 2. Architecture discovery

Collect:

- SIEM deployment model: on-premises, cloud or hybrid;
- API endpoint and network route;
- proxy, firewall, VPN, private-link or allowlist requirements;
- high availability and maintenance topology;
- authentication method;
- customer tenant, domain, organization or search scope;
- available test environment;
- expected query concurrency and API limits;
- responsible SIEM and SOC contacts.

## 3. Least-privilege access

Document:

- exact API permissions requested;
- why every permission is required;
- data sources or indexes in scope;
- whether the account can create, update or delete objects;
- token lifetime and rotation;
- secret owner;
- revocation process;
- IP or network restrictions;
- audit visibility available to the customer.

The MVP should require read/search permissions only. Ticket or incident creation uses a separate integration and credential where possible.

## 4. Query validation

For each query template:

- review syntax with the customer SIEM owner;
- validate time range;
- validate indexes, domains, tenants or datasets;
- validate field mappings;
- test representative IOC types;
- measure execution duration;
- measure result count;
- configure timeout and maximum results;
- verify that the query cannot access out-of-scope data;
- record template version and customer approval.

## 5. Test scenarios

Run with synthetic or customer-approved test data:

1. connectivity succeeds;
2. invalid credential is detected and safely reported;
3. no-match hunt finishes without threat notification;
4. controlled match creates normalized evidence;
5. enrichment succeeds;
6. enrichment fails without losing evidence;
7. notification is delivered to the agreed test recipient;
8. repeated execution is deduplicated;
9. SIEM timeout triggers bounded retry;
10. service pause stops new hunts;
11. credential revocation is detected;
12. end-to-end audit trace is available.

## 6. Notification approval

Customer approves:

- title format;
- severity vocabulary;
- recipient list;
- included IOC and evidence fields;
- treatment of user and host identifiers;
- enrichment wording;
- recommended next steps;
- ticket routing and priority mapping where applicable;
- update versus new-notification behavior;
- service-health communication channel.

## 7. Go-live gate

Go live only when:

- technical scope is approved;
- API permission and search scope are validated;
- credentials are stored in the approved secret mechanism;
- network routes and TLS validation work;
- test notification is accepted;
- monitoring and operational alerting are active;
- backup and restore are validated;
- customer and provider contacts are confirmed;
- rollback and pause procedures are documented;
- known limitations are communicated.

## 8. Ongoing customer communication

Provide a concise service report containing agreed metrics, for example:

- active IOC count processed;
- hunts executed;
- matched hunts;
- notifications created and suppressed;
- SIEM API failures and throttling;
- feed or connector incidents;
- query-template changes;
- capacity or performance concerns;
- actions required from the customer.

Avoid exposing internal workflow noise. Separate security findings from service-health issues.

## 9. Change notification

The customer must notify the provider before:

- SIEM upgrade;
- API endpoint or certificate change;
- identity or permission change;
- index, dataset, domain or tenant restructuring;
- maintenance affecting search APIs;
- notification platform or recipient change;
- network allowlist or proxy change.

The provider must notify the customer before:

- material query-scope change;
- hunting-frequency increase;
- new IOC type;
- new enrichment provider affecting data handling;
- retention change;
- planned service interruption;
- change in required permissions.

## 10. Customer-facing positioning

Use language equivalent to:

> A szolgáltatás a szolgáltatói oldalon kezelt threat intelligence alapján, előre jóváhagyott és korlátozott API-hozzáféréssel keres az ügyfél SIEM-rendszerében. Találat esetén kontextussal és bizonyítékkal ellátott értesítést küld. Az ügyfél megtartja a döntést és az incidenskezelési felelősséget; automatikus blokkolás az alap szolgáltatás részeként nem történik.
