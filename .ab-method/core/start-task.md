# Start Task Workflow

## Purpose

Run an existing task **autonomously to completion** — `/resume-task` with the `/goal` philosophy. Read the tracker, announce the plan, then execute every remaining mission without prompting: each mission runs in a **subagent** that **updates the tracker itself**; the parent verifies and **commits after every finished mission**. Then it protects what must not break, reviews, opens a pull request and reviews that against the seams and the coding rules.

Use it when the task is well-defined (grilled at creation) and you want to review a PR, not missions. Use `/resume-task` to stay in the loop per mission.

## Arguments

`/start-task <task> [inline]`

- **`inline`** — the parent runs every mission itself, in this conversation, with no mission subagents. Parallel groups run one mission after another. Everything else is unchanged: one commit per mission, and the reviewers (`review-implementation`'s critics, `review-pr`'s two reviewers) are still subagents, because a review needs a context that didn't write the code. Use it when you want to watch the work, or the missions share so much context that handing it to subagents costs more than it saves.

## Critical Step

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where task documents and architecture docs live. Paths are user-configurable.

Follow `.ab-method/rules/communication.md` for every message, and `.ab-method/rules/code.md` for every line of code (seed it into each subagent).

## Process

### 1. Identify the Task

Use the task name or tracker path the user passed; otherwise list `docs/tasks/` and ask.

### 2. Read the Progress Tracker

From `docs/tasks/<task>/progress-tracker.md`, identify:
- Status, completed missions and their summaries
- Remaining missions in order, with their steps, `[pp-x]` tags, `⚠️ UQ-n` markers and `verify:` tags (`build`, `repro`; legacy `test (UCn)` or untagged = run through `tdd` for its `## Test Plan` entry)
- `## Placement`, `## UI Spec` (if present), a legacy `## Test Plan` (if present), and the Constraints / Notes
- `## Planned` in `change-map.md`, if present — read it, never edit it (Step 5d measures against it)

**Vagueness gate**: an autonomous run cannot stop to ask. If a remaining mission is too vague to execute without judgment calls, grill it (`grill-with-docs`) **before** the run — never mid-run.

**An open `UQ-n` is not vagueness.** The placeholder was agreed at task creation; the run builds it exactly as recorded and keeps going. Stop only if a mission is marked `⚠️ UQ-n` with no entry (or no placeholder) in `unresolved-questions.md`, or the entry says the placeholder can't carry the mission. Never answer a parked question or "improve" a placeholder mid-run.

**No prototyping.** An autonomous run never runs `prototype-ui`. If the tracker has a `## UI Spec`, UI missions build to it, using the reference HTML in `docs/tasks/<task>/prototype/`.

### 3. Announce the Run — then start immediately

The invocation is the consent: show the plan and begin in the same turn, no "Proceed?".

```
Starting: <Task Name>

Branch: feat/admin-partial-refunds (new, from main)

Remaining missions:
[ ] Mission 2: [Name] — verify: build
[ ] Mission 3: [Name] [pp-1] — verify: build
[ ] Mission 4: [Name] [pp-1] — verify: repro
[ ] Mission 5: [Name] ⚠️ UQ-2 — verify: build

Open questions (building on placeholders, not stopping):
  UQ-2 Refund window fixed or per-merchant? → fixed 30 days (Mission 5)

Running now: one subagent per mission (inline: in this conversation), one commit per mission, then full suite → protect → review → draft PR → PR review. No prompts unless something goes red.
```

Drop the "Open questions" block when nothing is parked.

**Branch.** The run ends in a pull request, so it needs its own branch. If the current branch is the repo's default branch, create one before the first commit, named by the repo's conventions (its `CLAUDE.md` / `CONTRIBUTING.md`), else `<type>/<task-slug>`. An existing feature branch is used as is.

Set status to `In dev` and go to Step 4.

### 4. Load Context

Invoke `Skill("tdd")` in the parent before any mission work if any remaining mission is `verify: repro` (or a legacy `verify: test`) — you need the playbook to judge the summaries. The protect step loads it again either way.

Read once, to seed every subagent (paths from `.ab-method/structure/index.yaml`): `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md`, `docs/architecture/tech-stack.md` (incl. the Testing section and the typecheck/lint/build commands), `docs/seams/index.md` plus the seam docs the task touches, `docs/adr/`, and for patterns each layer's `docs/architecture/<layer>/index.md` plus only the topic files the task touches. Legacy repo (only `frontend-patterns.md` / `backend-patterns.md` exist): read those and suggest `/ab-cleanup` once in the final report. Check `git log --oneline` for commit conventions.

### 5. The Loop — Execute Remaining Missions

Walk the remaining missions top to bottom, no prompts in between.

**`inline` mode:** the parent does each mission itself with the same instructions a subagent would get below, updates the tracker, and commits. `[pp-x]` groups run sequentially. Skip the subagent spawning; nothing else changes.

#### Sequential mission (untagged)

Spawn **one subagent**. Its prompt includes:

- The mission objective and every step under it, its `verify:` tag, and the relevant Constraints / Notes and `## Placement` lines
- `.ab-method/rules/code.md` — applied while writing, not left for review — and the seam docs the mission touches: a capability a seam owns goes through it
- **`verify: build`** → no new test (the protect step decides those): implement every step, then run typecheck/lint/build and the focused existing tests for the touched area; report what ran. Existing tests and checks follow **Existing tests** and **Checks against the base** in `create-task.md` § 10 (edits to existing tests listed in the summary; failures already red on the base don't count)
- **`verify: repro`** → follow the `tdd` skill test-first: a test that reproduces the bug and fails for the right reason, then the smallest fix to green; red/green evidence in the summary
- **legacy `verify: test (UCn)`** → the `tdd` discipline for that `## Test Plan` use case
- UI missions with a `## UI Spec`: build to the spec and the reference HTML in `prototype/`
- Docs to read (paths from the index) and prior mission summaries
- `⚠️ UQ-n`: that entry from `unresolved-questions.md` verbatim, and the instruction to build the **recorded placeholder** behind one named seam marked `TODO(UQ-n)` (`create-task.md` § 10), never invent the answer or fabricate data, and update the entry's **Marker** line
- **Update `progress-tracker.md` itself**: check off the mission and append its summary (format: `create-task.md` § 10)
- Return a tight technical summary

#### Parallel group (`[pp-x]`)

Follow **Parallel group execution** in `create-task.md` § 10 (one subagent per mission, single message, disjoint files), except siblings must **NOT** write `progress-tracker.md` or `unresolved-questions.md`. They write detail to `docs/tasks/<task>/sub-agents-outputs/mission-N-<slug>.md` and return summaries; the parent checks off the missions, appends summaries, and fills any reported `TODO(UQ-n)` paths into the **Marker** lines.

#### After each mission (or group) — verify, then commit

1. **Verify** at the parent level: the focused tests for what the mission touched, plus typecheck/build, compared against the base branch (only new failures count). The full suite runs once, in Step 5a. For a group this is also the merge check.
2. **Red stops the run**: fix forward in the parent; if it won't go green, stop — don't commit, don't start the next mission (§ 8).
3. **Commit** the mission plus tracker update in the repo's convention, typed by the mission's kind: `refactor(<task>): mission 1 — <description>` for a deepening or extraction, `fix(<task>)` for `verify: repro`, `feat(<task>)` for a feature, e.g. `feat(<task>): missions 4-5 [pp-1] — <description>`. One commit per mission, one per group.

### 5a. Full Suite, then Protect

After the last mission, run the full test suite (command from `tech-stack.md`). Red here is a stop like any other (§ 8).

Then run the **protect step** (the `tdd` skill's `PROTECT.md`, autonomous): it reads the diff and the seam docs, decides what must not break, writes those tests through seam interfaces and domain rules, proves each red by breaking the behaviour, fills `## Protected`, and commits `test(<task>): protect <scope>`. A test that won't go green against the real code has found a defect: fix it forward under the same rule as a red mission (§ 5): small and inside the task's scope → fix it in its own `fix(<task>)` commit and note it in `## Protected`; otherwise stop (§ 8).

### 5b. Post-Implementation Review — `review-implementation` (autonomous mode)

Invoke the `review-implementation` skill on the task's commit range. Its three critics (`cleaner-architecture`, `slop-defender`, `reusability-inspector`) push back only on real issues. In autonomous mode it:
1. Applies only `safe-fix` findings, one at a time, re-running tests after each; a fix that goes red is reverted and left open.
2. Commits kept fixes as `refactor(<task>): post-review cleanup` (none → no commit).
3. Writes `docs/tasks/<task>/review.md` with every finding, applied ✅ or open ⬜ — even when clean.

The skill owns the logic and format; don't duplicate them.

### 5c. Documentation Sync — `sync-architecture` (autonomous mode)

Invoke the `sync-architecture` skill on the same diff. It finds what the change introduced that the docs don't capture, seam docs included (files, interface, status `introducing` → `migrating` → `settled`), and routes each to its doc. In autonomous mode it:
1. Applies only `safe-edit` findings **in place** (merge into or replace the closest entry, never append), under `.ab-method/rules/docs.md`, and must leave `check-docs` green. A delta that can't fit the budget is reverted and deferred.
2. Commits them as `docs(<task>): sync architecture docs` (none → no commit).
3. Records `needs-judgment` findings (domain reshapes, ADR candidates, deferred deltas) in `review.md` under **Architecture sync**, pointing at `/domain-model` / `/update-architecture`.

### 5d. Actual Change Map + Drift — `change-map` (autonomous mode)

Last, after the review and sync commits (they're part of the diff), invoke the `change-map` skill's *actual* pass. It derives the map from the task's commit range, appends `## Actual` and `## Drift` to `change-map.md` without touching `## Planned`, and commits `docs(<task>): change map`. It never prompts, never acts on drift, and never back-fills a missing `## Planned` (it records `no planned map — nothing to compare`). Every drift line goes in the final report.

### 6. Pull Request, then Final Review

1. **Push** the branch and open a **draft** PR (`gh pr create --draft`) against the repo's default branch, unless its conventions name another base. The body is written with the `pr` skill: Summary from `change-map.md` `## Actual`, Evidence from `## Protected` and any `verify: repro` red/green, Merge Danger from the ADRs and seam docs. Follow the repo's PR conventions (template, closing keywords, attribution).
2. **`review-pr`** (autonomous mode) on the open PR: two reviewers in parallel, each in a fresh subagent — **seams** (every capability a documented seam owns goes through it; the seam docs still match the code) and **rules** (`rules/code.md`, the book's red flags, the repo's standards). It applies safe fixes one at a time with tests green, commits them as `refactor(<task>): PR review fixes`, pushes, and records the rest in `review.md` under `## PR review` and in one PR comment.
3. **Mark it ready** (`gh pr ready`). Open `needs-judgment` findings don't block this; they're on the PR for the human reviewer.

A push or PR command that fails (no remote, no `gh` auth) is not a red test: write the `pr` body to `docs/tasks/<task>/pr-body.md`, run `review-pr` in its no-PR mode against the branch, say so in the report, and leave the commits on the branch.

### 7. On Full Completion

Delete `docs/tasks/<task>/prototype/` if it exists (disposable). Set status to `Completed` (in the last commit, or a `chore` commit, pushed to the PR). Report:

```
Task completed: <Task Name>
PR: <url> — ready for review
Missions: 2, 3-4 [pp-1], 5 — <n> commits (<short hashes>)
Tests: <full-suite command> green · protected: UC1, UC2
Review: docs/tasks/<task>/review.md — <k> applied, <m> open (PR review: <j> applied, <i> open)
Drift: platform/audit unplanned — mission 2 made every charge write an audit row
Black boxes: UQ-2 refund window → fixed 30 days, src/billing/refund.ts:14
```

Omit the Drift and Black boxes lines when empty. Neither blocks completion, but an afk user can't reconstruct them from the commit log, so they're always reported when present.

### 8. On Failure — Stop Loudly

If a subagent fails, tests stay red, or a merge conflict can't be resolved cleanly: stop immediately, never commit red work, leave the working tree for inspection, and report which mission, what failed (with output), and what was tried. The tracker keeps the truth; the user fixes or re-grills, then re-runs `/start-task` (or `/resume-task`).

## Key Principles

- **Starts on invocation** — the only pre-run pause is the vagueness gate
- **Executor, not producer** — never defines or reshapes missions; that's `/create-task` / `/extend-task`
- **Every mission in a subagent** (or in the parent with `inline`); the parent verifies and commits per mission / group
- **Tests after the code** — the protect step writes them through seam interfaces; only `verify: repro` bug fixes are test-first
- **Focused checks per mission, full suite once** before the protect step
- **Ends in a reviewed PR** — draft, `review-pr` against seams and rules, then ready
- **A black box is not a blocker** — build the recorded placeholder; report every open UQ
- **Red stops the run**; **tracker is the single source of truth**

## Remember

- Check `.ab-method/structure/index.yaml` for paths
- Seed each subagent with: its steps, its `verify:` tag, `rules/code.md`, the seam docs it touches, placement lines, docs paths, prior summaries, the tracker-update instruction, and disjoint files for groups
- `inline` changes who runs the missions, never the reviewers
- Never run `prototype-ui`; delete `prototype/` on completion
- Stopped runs resume with `/start-task` — the tracker carries everything forward
