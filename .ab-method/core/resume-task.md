# Resume Task Workflow

## Purpose
Continue an existing task one mission at a time. The progress tracker is the source of truth — there are no mission docs.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where task documents and architecture docs live.

Follow `.ab-method/rules/communication.md` for every message and `.ab-method/rules/code.md` for every line of code.

## Process

### 1. Identify the Task
Ask which task to resume; list `docs/tasks/` if unsure.

### 2. Read the Progress Tracker
From `docs/tasks/<task>/progress-tracker.md`, identify:
- Status, completed missions (with summaries), and the next mission
- `[pp-x]` tags (same tag = user-approved concurrent batch; untagged = sequential barrier)
- Each mission's steps and `verify:` tag — `verify: build` or `verify: repro` (bug fix, test first); legacy `verify: test (UCn)` and untagged missions run through `tdd` for their `## Test Plan` entry
- `⚠️ UQ-n` markers — read `unresolved-questions.md` for the question and agreed placeholder
- `## Placement`, `## UI Spec` (if present), a legacy `## Test Plan` (if present), and Constraints / Notes
- `## Planned` in `change-map.md`, if present — for orientation; never edit it

### 3. Display Resume Context
```
Resuming: <Task Name> (In dev)

[x] Mission 1: [Name]
[ ] Mission 2: [Name] — verify: build — next up
[ ] Mission 3: [Name] — verify: repro

Continue with Mission 2?
```

If the next mission is in a `[pp-x]` group, show the remaining group members and ask: run them in parallel in subagents, or one at a time? The tag records permission, not obligation.

#### Open unresolved questions — ask once, then move on

If `unresolved-questions.md` has `OPEN` entries feeding a remaining `⚠️ UQ-n` mission, surface them once:

```
2 open questions feed the remaining missions:
  UQ-1 Which currencies at launch?           → placeholder: USD only      (Mission 4)
  UQ-2 Refund window fixed or per-merchant?  → placeholder: fixed 30 days (Mission 6)
Answer either now and I'll build the real thing — otherwise we ship the placeholders.
```

If answered: mark the entry `RESOLVED <date>` with the answer, drop the `⚠️ UQ-n` markers and its line in the tracker's Unresolved Questions section (remove the section when empty), and build the real behaviour (if it grows beyond a seam swap, point at `/extend-task`). If not, proceed on the placeholders without re-asking.

### 4. Load the `tdd` Skill — `verify: repro` missions only

For a `verify: repro` mission (or a legacy `verify: test`), invoke `Skill("tdd")` **first** — before reading mission context, grilling, or touching the code. The playbook drives the reproduction, boundary, red → green and value challenge.

A `verify: build` mission skips this: it adds no test. The protect step decides the task's tests once the code exists.

### 5. Load Context for the Mission
Read (paths from `.ab-method/structure/index.yaml`):
- `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md`, `docs/adr/`
- `docs/seams/index.md` and the seam docs the mission touches: a capability a seam owns goes through it
- `docs/architecture/tech-stack.md` (Testing section, typecheck/lint/build commands)
- Patterns: `docs/architecture/<layer>/index.md`, then only the topic files the mission touches. Legacy repo (only `frontend-patterns.md` / `backend-patterns.md`): read those and suggest `/ab-cleanup` once
- The mission's steps and `## Placement` lines, and `## UI Spec` + `docs/tasks/<task>/prototype/` for UI missions
- Prior mission summaries

### 6. Run the Mission
- Vague one-line description → `grill-with-docs` first
- `⚠️ UQ-n` → build the **recorded placeholder** behind one named seam marked `TODO(UQ-n)` (`create-task.md` § 10). Never invent the answer or fabricate data around it
- **`verify: build`** → implement every step, then run typecheck/lint/build and the focused existing tests for the area. No new test. Existing tests and checks follow **Existing tests** and **Checks against the base** in `create-task.md` § 10
- **`verify: repro`** → under the loaded `tdd` skill: a test that reproduces the bug and fails for the right reason, then the smallest fix to green
- **legacy `verify: test (UCn)`** → red → green under `tdd` for that `## Test Plan` use case
- Apply `.ab-method/rules/code.md` while writing; task-wide cleanup is `review-implementation`'s job
- Optionally use a subagent for a large or specialized mission; for `verify: repro`, load `tdd` in the parent first

**`[pp-x]` group the user approved:** follow **Parallel group execution** in `create-task.md` § 10 — one subagent per remaining mission, single message, disjoint files, detail to `sub-agents-outputs/`; then run focused checks once at the parent level to verify the merge.

### 7. On Completion
Append the mission summary to the tracker (format: `create-task.md` § 10; skip empty bullets), then ask: "Mission N done. Start Mission N+1?" For a group, one summary per mission and one prompt per group.

When all missions are done: run the **full test suite once**, then Steps 8–11, then delete `docs/tasks/<task>/prototype/` if it exists, and only then set status to `Completed`.

### 8. Protect

Run the protect step (the `tdd` skill's `PROTECT.md`, interactive): it proposes what must not break from the diff and the seam docs, you confirm, and it writes those tests through seam interfaces, each proven red by breaking the behaviour. Results go in `## Protected`.

### 9. Post-Implementation Review — `review-implementation` (interactive)

Invoke the `review-implementation` skill on the task's diff in **interactive mode**: it presents findings by lens (`safe-fix` / `needs-judgment`) and you apply what the user approves, keeping tests green. Then `sync-architecture` (interactive) for doc deltas, seam docs included, applied in place under `.ab-method/rules/docs.md` with `check-docs` green.

### 10. Actual Change Map + Drift — `change-map`

After the review and any sync (their fixes are part of the diff), invoke `change-map`'s *actual* pass. It appends `## Actual` and `## Drift` to `change-map.md` without touching `## Planned`. Walk the drift with the user: unplanned modules, planned-but-untouched modules (re-read that mission's summary), heavier verdicts. A module changes keep leaking into is a deepening for the next task's planning scan; a bounded-context crossing goes to `/domain-model`. Never back-fill a missing `## Planned`.

### 11. Pull Request

Ask whether to open one. On yes, follow `start-task.md` § 6: a draft PR with the `pr` skill body, `review-pr` in **interactive** mode (present the seams and rules findings, apply and push what the user approves), then mark it ready.

Then set status to `Completed`.

## Remember
- The tracker carries everything; there are no mission docs
- `Skill("tdd")` first for every `verify: repro` mission; `verify: build` missions add no test
- Focused checks per mission, full suite once at the end, then the protect step writes the tests
- `## Planned` in `change-map.md` is read-only
- Never invent `[pp-x]` tags; confirm before a parallel run
- `⚠️ UQ-n`: ask once, then build the recorded placeholder; open questions never block completion
