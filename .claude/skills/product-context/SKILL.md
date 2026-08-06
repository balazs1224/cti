---
name: product-context
description: Use when planning product behavior, scope, backlog, user stories, architecture boundaries or customer-facing behavior for IOC Hunt & Notify.
---

# IOC Hunt & Notify product context

Read these files before making product or scope decisions:

1. `docs/PRODUCT_POSITIONING_HU.md`
2. `docs/PRODUCT_REQUIREMENTS.md`
3. `docs/OPEN_DECISIONS.md`
4. `docs/ACCEPTANCE_CRITERIA.md`

## Core product rule

The current product is a managed black-box IOC hunting and notification service. The customer provides approved SIEM API access and receives actionable notifications. The provider operates threat-intelligence ingestion, IOC lifecycle, queries, orchestration, enrichment, deduplication and notification delivery.

## Scope guardrails

Do not add these without an explicit approved decision:

- customer portal;
- replacement SIEM;
- raw log collection;
- full OpenCTI clone;
- dark web monitoring;
- attack-surface management;
- malware sandbox;
- case-management suite;
- automatic blocking or isolation;
- four SIEM adapters implemented in parallel.

## Planning output

For every proposed feature, state:

- customer or operator value;
- in-scope behavior;
- explicit non-goals;
- dependencies;
- acceptance criteria;
- operational impact;
- sizing impact;
- security and customer-data risk;
- customer communication required;
- whether an open decision must be resolved first.

Prefer the smallest end-to-end vertical slice that can be tested with synthetic data.
