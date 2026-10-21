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
- `verify:` tags — `verify: test (UCn)` or `verify: build`; untagged missions (pre-4.0 trackers) are `verify: test`
- `⚠️ UQ-n` markers — read `unresolved-questions.md` for the question and agreed placeholder
- `## Placement`, `## Test Plan`, `## UI Spec` (if present), and Constraints / Notes
- `## Planned` in `change-map.md`, if present — for orientation; never edit it

### 3. Display Resume Context
```
Resuming: <Task Name> (In dev)

[x] Mission 1: [Name]
[ ] Mission 2: [Name] — verify: build — next up
[ ] Mission 3: [Name] — verify: test (UC1)

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

### 4. Load the `tdd` Skill — `verify: test` missions only

For a `verify: test` mission, invoke `Skill("tdd")` **first** — before reading mission context, grilling, or touching the code. The playbook drives the use case, boundary, red → green and value challenge; writing a test first is not the same thing.

A `verify: build` mission skips this: it adds no test.

### 5. Load Context for the Mission
Read (paths from `.ab-method/structure/index.yaml`):
- `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md`, `docs/adr/`
- `docs/architecture/tech-stack.md` (Testing section, typecheck/lint/build commands)
- Patterns: `docs/architecture/<layer>/index.md`, then only the topic files the mission touches. Legacy repo (only `frontend-patterns.md` / `backend-patterns.md`): read those and suggest `/ab-cleanup` once
- The mission's `## Placement` lines, its Test Plan entry, and `## UI Spec` + `docs/tasks/<task>/prototype/` for UI missions
- Prior mission summaries

### 6. Run the Mission
- Vague one-line description → `grill-with-docs` first
- `⚠️ UQ-n` → build the **recorded placeholder** behind one named seam marked `TODO(UQ-n)`, with a test naming the UQ (`create-task.md` § 10). Never invent the answer or fabricate data around it
- **`verify: test (UCn)`** → red → green under the loaded `tdd` skill for that use case: meaningful red, smallest fix, refactor what you touched
- **`verify: build`** → implement, then run typecheck/lint/build and the focused existing tests for the area. No new test. An extraction mission must leave existing tests green
- Apply `.ab-method/rules/code.md` while writing; task-wide cleanup is `review-implementation`'s job
- Optionally use a subagent for a large or specialized mission; for `verify: test`, load `tdd` in the parent first

**`[pp-x]` group the user approved:** follow **Parallel group execution** in `create-task.md` § 10 — one subagent per remaining mission, single message, disjoint files, detail to `sub-agents-outputs/`; then run focused checks once at the parent level to verify the merge.

### 7. On Completion
Append the mission summary to the tracker (format: `create-task.md` § 10; skip empty bullets), then ask: "Mission N done. Start Mission N+1?" For a group, one summary per mission and one prompt per group.

When all missions are done: run the **full test suite once**, then Steps 8–9, then delete `docs/tasks/<task>/prototype/` if it exists, and only then set status to `Completed`.

### 8. Post-Implementation Review — `review-implementation` (interactive)

Invoke the `review-implementation` skill on the task's diff in **interactive mode**: it presents findings by lens (`safe-fix` / `needs-judgment`) and you apply what the user approves, keeping tests green. Then optionally `sync-architecture` (interactive) for doc deltas, applied in place under `.ab-method/rules/docs.md` with `check-docs` green.

### 9. Actual Change Map + Drift — `change-map`

After the review and any sync (their fixes are part of the diff), invoke `change-map`'s *actual* pass. It appends `## Actual` and `## Drift` to `change-map.md` without touching `## Planned`. Walk the drift with the user: unplanned modules, planned-but-untouched modules (re-read that mission's summary), heavier verdicts. Route findings to `/improve-codebase-architecture` or `/domain-model`; never back-fill a missing `## Planned`.

Then set status to `Completed`.

## Remember
- The tracker carries everything; there are no mission docs
- `Skill("tdd")` first for every `verify: test` mission; `verify: build` missions add no test
- Focused checks per mission, full suite once at the end
- `## Planned` in `change-map.md` is read-only
- Never invent `[pp-x]` tags; confirm before a parallel run
- `⚠️ UQ-n`: ask once, then build the recorded placeholder; open questions never block completion
