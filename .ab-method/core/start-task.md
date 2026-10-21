# Start Task Workflow

## Purpose

Run an existing task **autonomously to completion** — `/resume-task` with the `/goal` philosophy. Read the tracker, announce the plan, then execute every remaining mission without prompting: each mission runs in a **subagent** that **updates the tracker itself**; the parent verifies and **commits after every finished mission**.

Use it when the task is well-defined (grilled at creation) and you want to review commits, not missions. Use `/resume-task` to stay in the loop per mission.

## Critical Step

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where task documents and architecture docs live. Paths are user-configurable.

Follow `.ab-method/rules/communication.md` for every message, and `.ab-method/rules/code.md` for every line of code (seed it into each subagent).

## Process

### 1. Identify the Task

Use the task name or tracker path the user passed; otherwise list `docs/tasks/` and ask.

### 2. Read the Progress Tracker

From `docs/tasks/<task>/progress-tracker.md`, identify:
- Status, completed missions and their summaries
- Remaining missions in order, with `[pp-x]` tags, `⚠️ UQ-n` markers and `verify:` tags (untagged = `verify: test`, pre-4.0 trackers)
- `## Placement`, `## Test Plan`, `## UI Spec` (if present), and the Constraints / Notes
- `## Planned` in `change-map.md`, if present — read it, never edit it (Step 5d measures against it)

**Vagueness gate**: an autonomous run cannot stop to ask. If a remaining mission is too vague to execute without judgment calls, grill it (`grill-with-docs`) **before** the run — never mid-run.

**An open `UQ-n` is not vagueness.** The placeholder was agreed at task creation; the run builds it exactly as recorded and keeps going. Stop only if a mission is marked `⚠️ UQ-n` with no entry (or no placeholder) in `unresolved-questions.md`, or the entry says the placeholder can't carry the mission. Never answer a parked question or "improve" a placeholder mid-run.

**No prototyping.** An autonomous run never runs `prototype-ui`. If the tracker has a `## UI Spec`, UI missions build to it, using the reference HTML in `docs/tasks/<task>/prototype/`.

### 3. Announce the Run — then start immediately

The invocation is the consent: show the plan and begin in the same turn, no "Proceed?".

```
Starting: <Task Name>

Remaining missions:
[ ] Mission 3: [Name] — verify: build
[ ] Mission 4: [Name] [pp-1] — verify: test (UC1)
[ ] Mission 5: [Name] [pp-1] — verify: build
[ ] Mission 6: [Name] ⚠️ UQ-2 — verify: test (UC2)

Open questions (building on placeholders, not stopping):
  UQ-2 Refund window fixed or per-merchant? → fixed 30 days (Mission 6)

Running now: one subagent per mission, one commit per mission (per [pp-x] group), full suite once at the end, no prompts unless something goes red.
```

Drop the "Open questions" block when nothing is parked. Set status to `In dev` and go to Step 4.

### 4. Load Context

Invoke `Skill("tdd")` in the parent before any mission work if any remaining mission is `verify: test` — you need the playbook to judge the summaries.

Read once, to seed every subagent (paths from `.ab-method/structure/index.yaml`): `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md`, `docs/architecture/tech-stack.md` (incl. the Testing section and the typecheck/lint/build commands), `docs/adr/`, and for patterns each layer's `docs/architecture/<layer>/index.md` plus only the topic files the task touches. Legacy repo (only `frontend-patterns.md` / `backend-patterns.md` exist): read those and suggest `/ab-cleanup` once in the final report. Check `git log --oneline` for commit conventions.

### 5. The Loop — Execute Remaining Missions

Walk the remaining missions top to bottom, no prompts in between.

#### Sequential mission (untagged)

Spawn **one subagent**. Its prompt includes:

- The mission objective, its `verify:` tag, and the relevant Constraints / Notes and `## Placement` lines
- `.ab-method/rules/code.md` — applied while writing, not left for review
- **`verify: test (UCn)`** → follow the `tdd` discipline for that Test Plan use case: meaningful red at the boundary the plan named, smallest change to green, local refactor; red/green evidence and verification limits in the summary
- **`verify: build`** → no new test: implement, then run typecheck/lint/build and the focused existing tests for the touched area; report what ran. A placement extraction must leave existing tests green
- UI missions with a `## UI Spec`: build to the spec and the reference HTML in `prototype/`
- Docs to read (paths from the index) and prior mission summaries
- `⚠️ UQ-n`: that entry from `unresolved-questions.md` verbatim, and the instruction to build the **recorded placeholder** behind one named seam marked `TODO(UQ-n)` with a test naming the UQ (`create-task.md` § 10), never invent the answer or fabricate data, and update the entry's **Marker** line
- **Update `progress-tracker.md` itself**: check off the mission and append its summary (format: `create-task.md` § 10)
- Return a tight technical summary

#### Parallel group (`[pp-x]`)

Follow **Parallel group execution** in `create-task.md` § 10 (one subagent per mission, single message, disjoint files), except siblings must **NOT** write `progress-tracker.md` or `unresolved-questions.md`. They write detail to `docs/tasks/<task>/sub-agents-outputs/mission-N-<slug>.md` and return summaries; the parent checks off the missions, appends summaries, and fills any reported `TODO(UQ-n)` paths into the **Marker** lines.

#### After each mission (or group) — verify, then commit

1. **Verify** at the parent level: the focused tests for what the mission touched, plus typecheck/build. The full suite runs once, in Step 5a. For a group this is also the merge check.
2. **Red stops the run**: fix forward in the parent; if it won't go green, stop — don't commit, don't start the next mission (§ 7).
3. **Commit** the mission plus tracker update in the repo's convention, e.g. `feat(<task>): mission 3 — <description>` or `feat(<task>): missions 4-5 [pp-1] — <description>`. One commit per mission, one per group.

### 5a. Full Suite — once

After the last mission, run the full test suite (command from `tech-stack.md`). Red here is a stop like any other (§ 7).

### 5b. Post-Implementation Review — `review-implementation` (autonomous mode)

Invoke the `review-implementation` skill on the task's commit range. Its three critics (`cleaner-architecture`, `slop-defender`, `reusability-inspector`) push back only on real issues. In autonomous mode it:
1. Applies only `safe-fix` findings, one at a time, re-running tests after each; a fix that goes red is reverted and left open.
2. Commits kept fixes as `refactor(<task>): post-review cleanup` (none → no commit).
3. Writes `docs/tasks/<task>/review.md` with every finding, applied ✅ or open ⬜ — even when clean.

The skill owns the logic and format; don't duplicate them.

### 5c. Documentation Sync — `sync-architecture` (autonomous mode)

Invoke the `sync-architecture` skill on the same diff. It finds what the change introduced that the docs don't capture and routes each to its doc. In autonomous mode it:
1. Applies only `safe-edit` findings **in place** (merge into or replace the closest entry, never append), under `.ab-method/rules/docs.md`, and must leave `check-docs` green. A delta that can't fit the budget is reverted and deferred.
2. Commits them as `docs(<task>): sync architecture docs` (none → no commit).
3. Records `needs-judgment` findings (domain reshapes, ADR candidates, deferred deltas) in `review.md` under **Architecture sync**, pointing at `/domain-model` / `/update-architecture`.

### 5d. Actual Change Map + Drift — `change-map` (autonomous mode)

Last, after the review and sync commits (they're part of the diff), invoke the `change-map` skill's *actual* pass. It derives the map from the task's commit range, appends `## Actual` and `## Drift` to `change-map.md` without touching `## Planned`, and commits `docs(<task>): change map`. It never prompts, never acts on drift, and never back-fills a missing `## Planned` (it records `no planned map — nothing to compare`). Every drift line goes in the final report.

### 6. On Full Completion

Delete `docs/tasks/<task>/prototype/` if it exists (disposable). Set status to `Completed` (in the last commit, or a `chore` commit). Report:

```
Task completed: <Task Name>
Missions: 3, 4-5 [pp-1], 6 — <n> commits (<short hashes>)
Tests: <full-suite command> green
Review: docs/tasks/<task>/review.md — <k> applied, <m> open
Drift: platform/audit unplanned — mission 2 made every charge write an audit row
Black boxes: UQ-2 refund window → fixed 30 days, src/billing/refund.ts:14
```

Omit the Drift and Black boxes lines when empty. Neither blocks completion, but an afk user can't reconstruct them from the commit log, so they're always reported when present.

### 7. On Failure — Stop Loudly

If a subagent fails, tests stay red, or a merge conflict can't be resolved cleanly: stop immediately, never commit red work, leave the working tree for inspection, and report which mission, what failed (with output), and what was tried. The tracker keeps the truth; the user fixes or re-grills, then re-runs `/start-task` (or `/resume-task`).

## Key Principles

- **Starts on invocation** — the only pre-run pause is the vagueness gate
- **Executor, not producer** — never defines or reshapes missions; that's `/create-task` / `/extend-task`
- **Every mission in a subagent**; the parent verifies and commits per mission / group
- **Tests only where the plan put them** — `verify: test` missions run `tdd`; `verify: build` missions add no test
- **Focused checks per mission, full suite once** before the review
- **A black box is not a blocker** — build the recorded placeholder; report every open UQ
- **Red stops the run**; **tracker is the single source of truth**

## Remember

- Check `.ab-method/structure/index.yaml` for paths
- Seed each subagent with: its `verify:` tag, `rules/code.md`, placement lines, docs paths, prior summaries, the tracker-update instruction, and disjoint files for groups
- Never run `prototype-ui`; delete `prototype/` on completion
- Stopped runs resume with `/start-task` — the tracker carries everything forward
