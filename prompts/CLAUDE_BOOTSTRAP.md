# Claude bootstrap prompt

Copy the prompt below into a fresh Claude Code session after opening this repository.

```text
You are working on the IOC Hunt & Notify repository.

First read CLAUDE.md. Then use the product-context skill and read only the documents it references.

Current objective:
Prepare the repository for the first end-to-end synthetic vertical slice of a managed IOC hunting and notification service.

Important scope:
- The customer has no portal in the current MVP.
- OpenCTI or a compatible TI backend is operated separately.
- n8n is an orchestrator, not the system of record.
- The service queries an existing customer SIEM through a restricted API.
- A match is enriched, deduplicated and sent through a notification adapter.
- No automatic blocking, isolation or containment is allowed.
- Use synthetic fixtures only.

Do not implement all SIEM adapters. The first real SIEM and notification channel are still open decisions.

For this session, do not write application code yet.

Tasks:
1. Inspect the repository and check the consistency of all current documents.
2. Identify contradictions, missing decisions and unnecessary scope.
3. Propose the minimal repository structure for a Python modular monolith, n8n workflow exports and tests.
4. Propose the exact first vertical slice using:
   - one synthetic IPv4 IOC;
   - a mock TI adapter;
   - a mock SIEM adapter;
   - one synthetic match;
   - deterministic severity;
   - a mock webhook notification;
   - complete audit trace;
   - retry and deduplication tests.
5. Produce a file-by-file implementation plan.
6. Produce no more than 12 ordered implementation tasks, each with acceptance criteria and dependencies.
7. Mark every item that depends on an unresolved decision in docs/OPEN_DECISIONS.md.
8. Report architecture, operations, sizing, security, delivery and customer-communication implications.

Do not add dependencies or files until the plan is internally consistent.
```

## Prompt for the first implementation session

Use this only after the bootstrap review is accepted.

```text
Read CLAUDE.md and the product-context skill.

Implement only the approved Phase 0 engineering baseline and the first synthetic vertical-slice skeleton. Do not implement a real SIEM connector.

Before changing files:
- state the exact scope and non-goals;
- list the documents and decisions that govern the work;
- identify the expected test commands.

Required qualities:
- modular monolith;
- customer context in all domain operations;
- deterministic idempotency;
- no credentials;
- synthetic fixtures;
- structured logs;
- health endpoints;
- unit, integration and contract-test structure;
- one-command local startup;
- no unnecessary services.

After implementation:
- run formatting, linting, type checking and tests;
- show the resulting repository structure;
- map implemented behavior to docs/ACCEPTANCE_CRITERIA.md;
- report unresolved risks and next task only.
```
