---
name: sync-architecture
description: Post-implementation documentation-sync detector. Spins up ONE read-only subagent on a completed task's diff to find everything the change introduced that the architecture docs don't yet know about — new endpoints, patterns, dependencies, domain terms, ADR-worthy decisions — routed to the exact doc each belongs in. Autonomous runs apply only in-place safe edits that pass the check-docs budget gate and defer domain/ADR reshapes; interactive runs present the proposed doc deltas to pick. Use after a task's missions are done (from create-task / start-task / start-roadmap) or standalone on a diff.
---

# Sync Architecture (post-implementation)

Detect, from a completed task's diff, what the change introduced that the architecture and domain docs
don't know yet — then fold it **into** the docs in place. It runs beside
[../review-implementation/SKILL.md](../review-implementation/SKILL.md) but asks a different question:
that skill asks *"is this diff good code?"*, this one asks *"are the docs now wrong or incomplete?"*

It is the automated detection half of `/update-architecture` and reuses its routing table. Talk to the
user per `.ab-method/rules/communication.md`; every doc write follows `.ab-method/rules/docs.md`.

> **Silence is the default output.** A bug fix, styling, or CRUD that follows existing patterns produces
> no deltas. A finding survives only if a doc is genuinely now wrong or incomplete. Never invent churn.

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** for where the docs live — paths are
user-configurable. Use the project root's copy; only if the project has none (plugin install), read the
bundled default at `../../../.ab-method/structure/index.yaml` relative to this `SKILL.md`. Every path it
names is relative to the **project root**. Sweep **only this task's diff** (its commit range) plus its
`progress-tracker.md` mission summaries — never a whole-repo audit.

## Process

### 1. Gather diff + context

- The task's `git diff` for its commit range and its **Mission Summaries** (Files / Built / Integrates with).
- The current docs, so only what's missing is proposed (skip absent files): `tech-stack.md`, the
  `index.md` of `docs/architecture/frontend/` and `backend/` (then only the topic files the diff touches),
  `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md`, `docs/adr/`.
- Legacy single-file `frontend-patterns.md` / `backend-patterns.md` instead of the split folders: route to
  them as they are, and note once in the report that `/ab-cleanup` migrates them.

### 2. Spin up ONE read-only detector subagent

Spawn a single subagent, `architecture-sync`, with the diff, the mission summaries, the current docs, and
the task's `unresolved-questions.md` if present. It returns a routed findings list (often empty) and edits
nothing. On **Codex** spawn it at the orchestrator's level; on **Claude** it may nest.

Its brief — detect only what the docs don't already capture, routed with `/update-architecture`'s table:

| Finding | Routes to (update-architecture step) |
|---|---|
| New / renamed / moved endpoint, CLI command, cron, webhook, queue consumer | `tech-stack.md` **Entry Points** (2a) — plus the backend `api` topic if a *convention* shifted |
| New or swapped component / service / state / auth **pattern** | the closest topic file under `docs/architecture/<layer>/` (2b) |
| New dependency, third-party API/queue, new limit, test-framework shift | `tech-stack.md` Stack / External Services / Constraints / Testing (2c) |
| New domain term, or a term whose meaning shifted | `UBIQUITOUS_LANGUAGE.md` (+ `CONTEXT.md` if meaning shifted) (2d) |
| A hard-to-reverse, surprising, trade-off-carrying **decision** | ADR candidate (2e) — never written inline; defer to `/domain-model` |

For each finding return: **What** (the thing introduced, citing file/mission), **Doc** (target file +
section or topic), **Proposed delta** (the in-place edit: which entry it merges into or replaces, and the
new wording), **Class** (Step 3).

> Example: *"New endpoint `POST /charges` (src/api/charges.ts, mission 2) — missing from tech-stack.md
> Entry Points. Delta: add `POST /charges — create a charge (bearer auth)` to the Entry Points list.
> Class: safe-edit."*

Deltas obey `.ab-method/rules/docs.md`: the rule plus **one** exemplar path, never a list of instances;
no task names, "added in", or dated blocks; no `[DEPRECATED]` — what stopped being true is deleted; the
why is an ADR link, not prose. A new topic file only when no existing topic fits, plus its one line in
that layer's `index.md`.

**Never document a black box as established practice.** A placeholder behind a `TODO(UQ-n)` seam recorded
in `unresolved-questions.md` is provisional: don't write it as a constraint, a pattern, or a term, and a
parked question is never an ADR candidate. Route what the change built *around* it (the endpoint, the
dependency, the seam's existence) and describe the placeholder only as what it is ("currency fixed to USD
pending UQ-1").

**Out of scope:** code quality (`review-implementation`), whole-repo deepening
(`/improve-codebase-architecture`). With nothing missing, return exactly:
`Docs in sync — no architecture updates needed.`

### 3. Classify each finding

- **`safe-edit`** — an in-place edit that makes the doc match the diff with no judgment call: add a line to
  an existing list, merge into the closest entry, replace an entry the diff made untrue (the old pattern is
  gone from the code), add a glossary term.
- **`needs-judgment`** — a term's meaning shifted, a new bounded context, an ADR candidate, or an edit that
  can't pass the budget gate without deciding what else to cut. Route to `/domain-model` (domain / ADR) or
  `/update-architecture` (larger reshapes); don't apply here.

### 4. Act — by mode

After applying any edit, run the gate:

```bash
node .ab-method/scripts/check-docs.js   # plugin installs: npx ab-method check-docs
```

**Interactive** (create-task tail, or standalone): present deltas grouped by target doc, each marked
`safe-edit` / `needs-judgment`. Apply the `safe-edit`s the user approves, run the gate, and compact any
failing file under `.ab-method/rules/docs.md` before reporting. Point `needs-judgment` findings at the
right workflow.

**Autonomous** (`start-task` / `start-roadmap`) — the orchestrator, not the detector, applies:
1. Apply every `safe-edit` in place, then run the gate.
2. If a touched file fails and can only pass by cutting content that needs a judgment call, **revert that
   file's edit** and record the delta as open. Pre-existing failures in files this run didn't touch are
   noted, not fixed.
3. Commit what passed as one `docs(<task>): sync architecture docs`. Nothing applied → no commit.
4. Record every open finding (`needs-judgment` and reverted deltas) in the task's `review.md` under an
   **Architecture sync** heading, or in the run report if no `review.md` exists. Never write an ADR and
   never prompt.

## Remember

- Index first; the mission summaries already list Files / Built — start there, confirm against the diff.
- **Always check Entry Points** for API drift, even when routing wasn't obviously touched.
- Edit in place, never append; a doc write isn't done until `check-docs` passes.
- Silent by default; scoped to the task's diff; domain reshapes and ADRs always go to a human.
