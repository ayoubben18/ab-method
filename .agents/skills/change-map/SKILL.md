---
name: change-map
description: Draw a task's blast radius twice. BEFORE implementing, a PLANNED map of the modules the missions expect to add, change or touch; AFTER the reviewers pass, an ACTUAL map derived from the real diff, plus the DRIFT between them. Writes docs/tasks/<task>/change-map.md. Use from create-task / extend-task (planned pass), and after review-implementation + sync-architecture in create-task / resume-task / start-task / start-roadmap (actual pass), or standalone on a task.
---

# Change Map (pre- and post-implementation)

The artifact that answers **"where in the codebase does this task live?"** — asked twice, on purpose:

- **Planned** — before a line is written, from the missions: which modules the task expects to add,
  change, or brush against.
- **Actual** — after the missions are green and the reviewers have passed, from the real diff: which
  modules it *did*.
- **Drift** — the difference between them. **Drift is the deliverable**; the two maps exist so it can be
  computed at all.

Where the other post-implementation skills *judge* the change —
[../review-implementation/SKILL.md](../review-implementation/SKILL.md) asks "is this good code?",
[../sync-architecture/SKILL.md](../sync-architecture/SKILL.md) asks "do the docs know about it?" — this
one only describes its **shape**. It never reviews code, never edits code, never edits the architecture
docs.

> **Reduction is the point.** A task that touched 40 files gets 6 rows; the cap is 10. A map that reads
> as an inventory of the diff has failed — the tracker's mission summaries already list the files. The map
> exists to be understood in seconds, months later, by someone who will not read the diff.

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** for where tasks and the architecture/domain docs
live — paths are user-configurable. The rendering rules, the line types, and a full worked file live in
[DIAGRAM-FORMAT.md](DIAGRAM-FORMAT.md); read it before drawing either pass.

## What counts as a module here

Not "a directory". The map partitions the codebase the way **this project** partitions it, in this order:

1. **`CONTEXT.md` / `CONTEXT-MAP.md`** — the bounded contexts, named in the project's own ubiquitous
   language. Best source by far: the map then speaks the domain, and a row nobody predicted reads as *a
   context boundary being crossed*, not as "another folder changed".
2. **`docs/architecture/*`** — documented entry points, layers, and pattern groupings.
3. **The source tree** — top-level source directories, one level deeper where a directory is large.

A module is a module in the [../codebase-design/SKILL.md](../codebase-design/SKILL.md) sense — an
interface with an implementation hidden behind it — and rows are named the way the docs already name it.
Never invent a taxonomy the project doesn't use; a map in private vocabulary is unreadable to everyone but
the session that drew it.

## Pass 1 — the planned map

**When**: `/create-task` § 7.6 (after `critique-plan`, before the user validates the plan) and
`/extend-task` (appended for the new missions). It is drawn from the plan, never from code you wrote.

**Inputs**: the drafted missions, the grill's constraints and existing-code anchors, the architecture +
domain docs, and enough of a read of the named modules to tell `[NEW]` from `[extended]`.

- One row per module the missions touch, with the missions that touch it in the right-hand column
  (`M2 · M4`).
- **`+` lines list only interfaces the plan actually commits to** — an endpoint the mission names, a
  function the grill agreed on, a type the tracker records. If the plan names none, omit the line. A
  predicted symbol nobody promised is the single thing that makes the later drift meaningless: it turns a
  prediction into a guess, and drift against a guess measures nothing.
- Seam lines (`└ will use`, `▲ will be called by`) only where a mission genuinely crosses them.
- The `→` line — one sentence on what this module will do that it doesn't today — is **mandatory**. A row
  with an unwritten `→` is not publishable.

**If drawing the map forces you to invent a module, the plan is wrong — not the map.** This pass is a
second read on the missions: a module you can't attribute to a mission, or a mission whose row you can't
place anywhere, is a planning gap `critique-plan` didn't catch. Say so out loud and fix the missions
before the user validates them. That is most of this pass's value; the picture is the by-product.

The planned map is shown to the user in `/create-task` § 8 **alongside** the mission list — they are
validating the blast radius, not just the sentences.

## Pass 2 — the actual map

**When**: after `review-implementation` and `sync-architecture` have run, before the task's status is set
to `Completed`. Not earlier: the reviewers apply safe fixes and commit append-only doc additions, so a map
drawn before them describes a diff that no longer exists.

Derive it from the task's **commit range**, never the working tree:

```bash
git diff --name-status -M <base>..<head>   # what changed, and how
git diff --numstat    -M <base>..<head>    # how much, for the verdicts
```

`<base>..<head>` is the task's own range — the parent of its first mission commit through the last commit
the task made (including the review and doc-sync commits). If the working tree is dirty, say so and commit
first; a map of uncommitted work is not reproducible.

Verdicts here are **derived, not judged** (thresholds in [DIAGRAM-FORMAT.md](DIAGRAM-FORMAT.md)). The
`+` / `−` lines are exported symbols that exist at head but not base, or the reverse — re-exports and
`export default` are skipped, because a barrel forwarding a symbol is not new logic. A `−` line is often
the most informative thing on the page: it is where the task *removed* a concept.

Generated and vendored files (lockfiles, migration snapshots, generated route trees, i18n catalogs, build
output) are excluded from **ranking**, so a 9,000-line generated file can't push the real change off the
map. They still appear in the `also touched:` tail.

Write each `→` line **after reading the module** — never paraphrased from the symbol names. Names say what
moved; only the sentence says what it now does.

## Pass 3 — drift

Three findings, in a table (format in [DIAGRAM-FORMAT.md](DIAGRAM-FORMAT.md)):

- **Unplanned** — in Actual, absent from Planned. The blast radius was wider than the plan said. State
  *why* in one clause, citing the mission that reached it. This is the most valuable row on the page.
- **Predicted, untouched** — in Planned, absent from Actual. Either the plan over-drew the scope (fine —
  note it and move on) or **a mission claimed that module and didn't deliver it** (not fine — re-read that
  mission's summary in the tracker and say so before the task is closed).
- **Escalated** — the same module, at a heavier verdict than planned (`[touched]` → `[rewritten]`,
  `[extended]` → `[NEW]` siblings). The plan under-read the work.

A task that landed where its plan said gets exactly one line — `No drift — the change landed where the
plan said it would.` — and that is the good, common outcome for a well-grilled task. Never manufacture
drift to look thorough.

**What drift is actually for.** It routes; it never fixes:

| Drift pattern | What it means | Route to |
|---|---|---|
| The same unplanned module keeps appearing across tasks | Changes keep leaking there — a locality problem | `/improve-codebase-architecture` (`codebase-design`: leverage, locality) |
| An unplanned row crosses a bounded context | The boundary in `CONTEXT.md` may be drawn in the wrong place | `/domain-model` |
| A predicted-untouched row whose mission claimed it | The mission may not have done what its summary says | Re-read that mission before setting the task `Completed` |
| Wide drift on almost every task | Missions are being drafted without reading the code | `/create-task` § 2 — the project-analysis step is being skipped |

## Output — `change-map.md`

Written next to `progress-tracker.md`, at `docs/tasks/<task>/change-map.md`.

- The planned pass **creates** the file with `## Planned` only.
- The actual pass **appends** `## Actual` and `## Drift`.

The actual pass **never rewrites `## Planned`**. The planned map is a record of what you believed before
you knew, and it stays wrong on the page — editing it to match reality destroys the only thing the file is
for.

## Modes

**Interactive** (`/create-task`, `/resume-task`, `/extend-task`, standalone): show the map inline. On the
actual pass, walk the drift findings with the user before closing the task.

**Autonomous** (`/start-task`, `/start-roadmap`): write the file, commit it as
`docs(<task>): change map` (repo convention), and put the drift lines in the run's final report. Never
prompt — an afk user must not discover a wider-than-planned blast radius by accident.

## When there is no planned map

A task created before this skill existed, or one you're mapping standalone, has no `## Planned` section.
Draw `## Actual` and record `Drift: no planned map — nothing to compare.`

**Never back-fill a planned map from the diff.** A prediction reverse-engineered from the answer is a lie,
and every drift computation that reads the file afterwards inherits it.

## What this skill does NOT do

It does not review the change (that's `review-implementation`), does not update the architecture or domain
docs (that's `sync-architecture` / `/update-architecture`), and does not edit code. It only describes
shape. Keep it that way: judgment living in two places drifts, and a map that argues stops being a map.

## Key Principles

- **Drift is the deliverable** — the two maps are the instrument, not the product.
- **Reduction over inventory** — 10 rows maximum, siblings collapsed; the mission summaries already list files.
- **Predict only what the plan commits to** — an invented symbol or module makes the drift measure nothing.
- **The planned map is immutable once written** — it records a belief, and being wrong is its whole value.
- **Never back-fill a prediction from the answer** — a task with no planned map has no drift, and that's fine.
- **Speak the project's language** — rows come from `CONTEXT.md` and the architecture docs, never a taxonomy you made up.
- **Report, never fix** — drift routes to `/improve-codebase-architecture`, `/domain-model`, or a re-read of a mission.

## Remember

- Check `.ab-method/structure/index.yaml` for paths; read [DIAGRAM-FORMAT.md](DIAGRAM-FORMAT.md) before drawing.
- The planned pass runs **after** `critique-plan` (missions may still change) and **before** the user validates.
- The actual pass runs **after** `review-implementation` **and** `sync-architecture` — their commits are part of the diff it maps.
- Map the commit range, not the working tree; a dirty tree means commit first.
- Every `→` is written by you, after reading the module. A map shipped with an unfilled `→` advertises that nobody read the change.
- The `## Actual` block plus its `also touched:` line is exactly what goes at the top of this task's PR body.
