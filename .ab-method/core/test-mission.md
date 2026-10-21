# Test Mission Workflow

## Purpose
Add tests **retroactively** to code that wasn't written test-first — and only the tests worth having.

> **Default path is planning, not this workflow.** `/create-task` decides up front which use cases get a test (`## Test Plan`) and runs those missions through `tdd`. Use `/test-mission` only when:
> - Pre-existing untested code needs protection
> - A bug escaped (write the regression test, then fix)
> - A feature shipped before the AB Method was adopted

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find task and documentation locations.

Follow `.ab-method/rules/communication.md` for every message and `.ab-method/rules/code.md` for test code.

## Process

### 1. Identify the Target
Ask which task (or which code, for pre-AB-Method features) needs tests. For a task, read its `progress-tracker.md` — mission summaries list the files; there are no mission docs.

### 2. Load Testing Context
- The Testing section of `docs/architecture/tech-stack.md` — framework, file patterns, commands
- Nearby existing tests and test utilities — extend before adding
- `UBIQUITOUS_LANGUAGE.md` / `CONTEXT.md` so test names use domain terms

### 3. Draft the Test Plan — the fewest tests that protect the most
Invoke `Skill("tdd")` and use its steps 1–3 and 6 to choose. List candidate use cases, then keep only those where a regression would hurt a user: domain rules, money/permissions/data-loss paths, critical flows, and reproduced bugs. Drop anything that only proves the framework works, duplicates an existing test, or would break on a harmless refactor. No coverage targets — coverage is not the goal.

```
Proposed tests for <task>:
  UC1 Partial refund past the window is rejected → service boundary
  UC2 Admin refunds an order end to end          → e2e
Skipped (low value): rendering of RefundBadge, Zod schema shape
Proceed?
```

Wait for the user's confirmation.

### 4. Write the Tests
For each approved use case, under the loaded `tdd` skill:
- Write the test at the agreed boundary
- **Prove it can fail**: for retroactive tests there's no natural red, so break the behaviour temporarily (or reproduce the bug) and confirm the test fails for the right reason, then restore
- A regression test for a bug goes red first, then the fix makes it green
- Run the focused tests; run the full suite once at the end

Use a subagent only for a large surface; give it the approved plan, not a mandate for "comprehensive" coverage.

### 5. Record It
Append to the task's `progress-tracker.md`, like any mission:
- Add the use cases to `## Test Plan` (continue `UCn` numbering; create the section if the tracker predates it)
- Add a checked mission line — `- [x] Mission N: Test — <scope> — verify: test (UC4, UC5)` — and its summary (format: `create-task.md` § 10), including the red evidence and anything you could not verify

## Remember
- Check `.ab-method/structure/index.yaml` for paths
- Fewest valuable tests; justify every one by what breaks for the user
- Prove each test can fail before trusting it
- No mission docs — the tracker is the record
