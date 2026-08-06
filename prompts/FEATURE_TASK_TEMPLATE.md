# Token-efficient Claude task template

Use one narrowly scoped task per Claude Code session.

```text
Read CLAUDE.md.

Task:
<one concrete deliverable>

Relevant context only:
- <document or skill 1>
- <document or skill 2>
- <affected module or contract>

Acceptance criteria:
1. <observable result>
2. <observable result>
3. <required failure or retry behavior>
4. <required tests>

Non-goals:
- <explicitly excluded work>
- <unrelated refactor>
- <additional adapter or UI>

Constraints:
- use synthetic data only;
- do not add dependencies without justification;
- preserve customer isolation and idempotency;
- do not modify unrelated files;
- do not expand the product scope.

Before coding:
1. inspect only the relevant files;
2. summarize the planned changes by file;
3. identify security, operations and sizing implications;
4. stop if an open decision blocks correctness.

After coding:
1. run the relevant format, lint, type and test commands;
2. report changed files and behavior;
3. map results to the acceptance criteria;
4. report remaining risks;
5. propose only the next smallest task.
```

## Review prompt

```text
Review the current diff against CLAUDE.md and the relevant repository contracts.

Focus on:
- scope creep;
- customer-context isolation;
- credential or telemetry leakage;
- SIEM query safety;
- idempotency and duplicate notifications;
- retry and dead-letter behavior;
- external input validation;
- operational visibility;
- unnecessary complexity.

Do not rewrite the implementation. Return prioritized findings with file references, realistic failure scenarios, recommended fixes and missing tests.
```

## Context discipline

- Do not ask Claude to read the entire repository.
- Reference two or three governing documents, not every document.
- Use the project skills for specialized tasks.
- Start a new session when moving between architecture, implementation and review.
- Preserve decisions in repository documents instead of repeatedly pasting them into prompts.
