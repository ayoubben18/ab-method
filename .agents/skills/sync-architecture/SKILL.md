---
name: sync-architecture
description: Post-implementation documentation-sync detector. Spins up ONE read-only subagent on a completed task's diff to find everything the change introduced that the architecture docs don't yet know about — new endpoints, patterns, dependencies, domain terms, ADR-worthy decisions — routed to the exact doc each belongs in. Autonomous runs apply only append-only safe additions and defer domain/ADR reshapes; interactive runs present the proposed doc deltas to pick. Use after a task's missions are done (from create-task / start-task / start-roadmap) or standalone on a diff.
---

# Sync Architecture (post-implementation)

Keep `docs/architecture/*` and the domain docs **live** by detecting, from a completed task's diff, what
the change introduced that the docs haven't caught up with — then proposing the exact doc deltas. It runs
in the same post-implementation phase as [../review-implementation/SKILL.md](../review-implementation/SKILL.md),
but asks a **different question**:

> `review-implementation` asks *"is this diff good code?"* — this skill asks *"does this diff introduce
> anything the docs don't yet know about?"* The first is code debt; this is **documentation drift**.

It is the **automated detection half** of the manual `/update-architecture` workflow. Where
`/update-architecture` is a heavy, human-invoked pass (and also runs the `improve-codebase-architecture`
deepening loop), this skill is a lightweight detector that runs automatically after each task so the docs
stop silently drifting. It **reuses `/update-architecture`'s routing table** — it does not invent its own.

> **Silence is the default output.** A task that introduced nothing doc-worthy (a bug fix, styling, a
> trivial CRUD following existing patterns) produces no deltas — that is the normal case. A finding
> survives only if the docs are genuinely now wrong or incomplete. Never invent doc churn to look thorough.

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** for where the architecture and domain docs live —
paths are user-configurable. Sweep **only what this task changed** — the cohesive diff across its missions
(`git diff` for the commit range) plus its `progress-tracker.md` mission summaries. This is not a
whole-repo doc audit.

## Process

### 1. Gather diff + context

- The changed files and their `git diff` for the task's commit range.
- The task's `progress-tracker.md` **Mission Summaries** — the per-mission **Files / Built / Integrates
  with** bullets already enumerate most of what's new.
- The **current** architecture + domain docs, so the detector proposes only what's genuinely *missing*
  (skip files that don't exist): `docs/architecture/tech-stack.md`, `frontend-patterns.md`,
  `backend-patterns.md`, `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md`, `docs/adr/`.

### 2. Spin up ONE read-only detector subagent

Spawn a single subagent — `architecture-sync` — with the diff, the mission summaries, and the current
docs. It is **read-only**: it returns a routed findings list (often empty) and edits nothing. Isolating it
keeps the doc analysis out of the orchestrator's context. On **Codex** (`spawn_agent` is one level deep)
spawn it at the orchestrator's own level; on **Claude** it may nest. One detector is enough — the whole
point is a single sweep of the change.

Its brief — **detect only what the docs don't already capture**, routed with `/update-architecture`'s
table:

| Finding | Routes to (update-architecture step) |
|---|---|
| New / renamed / moved endpoint, CLI command, cron, webhook, queue consumer | `tech-stack.md` **Entry Points** (2a) — and `backend-patterns.md` § API if a *convention* shifted |
| New component / service / state / auth **pattern**, or a pattern swapped | `frontend-patterns.md` / `backend-patterns.md` (2b) |
| New dependency, third-party API/queue, new limit/budget, test-framework shift | `tech-stack.md` Stack / External Services / Constraints / Testing (2c) |
| New domain term used in code, or a term whose meaning shifted | `UBIQUITOUS_LANGUAGE.md` (+ `CONTEXT.md` if meaning shifted) (2d) |
| A hard-to-reverse, surprising, trade-off-carrying **decision** | ADR candidate (2e) — **never written inline; defer to `/domain-model`** |

For each finding return: **What** (the concrete thing the diff introduced, citing the file/mission),
**Doc** (the exact target file + section), **Proposed delta** (the append-only line or short section to
add), **Class** (see Step 3).

> Example: *"New endpoint `POST /charges` (src/api/charges.ts, mission 2) — not in tech-stack.md Entry
> Points. Proposed delta: add `POST /charges — create a charge (auth: bearer)` under Entry Points.
> Class: safe-add."*

**Out of scope** — do not raise: code-quality issues (that's `review-implementation`), whole-repo
deepening opportunities (that's `/improve-codebase-architecture`), or rewrites of existing prose. With
nothing the docs are missing, return exactly: `Docs in sync — no architecture updates needed.`

### 3. Classify each finding

- **`safe-add`** — an **append-only** addition that follows `/update-architecture`'s "add, don't rewrite"
  rule: a new Entry Points line, a new dependency, a new pattern subsection, a new glossary term. Purely
  additive, no existing prose touched.
- **`needs-judgment`** — anything that would **change or deprecate existing prose** (a pattern was
  *swapped*, a term's *meaning shifted*, an endpoint convention *moved*), a new bounded context, or an
  **ADR candidate**. These reshape the docs and belong to a human — route them to `/domain-model` (domain
  / ADR) or `/update-architecture` (prose deprecation), don't apply them here.

### 4. Act — by mode

**Interactive** (manual create-task tail, or standalone): present the proposed deltas grouped by target
doc, each marked `safe-add` / `needs-judgment`. Apply the `safe-add`s the user approves; for
`needs-judgment` findings, point at the right workflow (`/domain-model`, `/update-architecture`) rather
than editing. Report what landed.

**Autonomous** (`start-task` / `start-roadmap` — afk): the **orchestrator** (not the detector) applies:
1. Apply every **`safe-add`** to its target doc — append-only, preserving format and tone, with a
   `### Recent Updates (YYYY-MM-DD)` block for a notable shift (per `/update-architecture` Step 3). Docs
   are prose, not code, so there is no test to re-run — but **never rewrite or delete** existing content;
   if a finding can't be expressed as a pure addition, it isn't a `safe-add` — leave it open.
2. Commit the doc additions as one `docs(<task>): sync architecture docs` (repo convention). Nothing to
   add → no commit.
3. **Leave every `needs-judgment` finding for the user** — record them in the task's `review.md` (the
   `review-implementation` skill's file, if it ran) under an **Architecture sync** heading, or in a short
   note in the run report. Never write an ADR and never deprecate prose autonomously — those need
   `/domain-model` / `/update-architecture`.

Never prompt in autonomous mode — anything that isn't a pure safe-add stays open for the user.

## Key Principles

- **Documentation drift, not code quality** — a distinct lens from `review-implementation`; the two run
  side by side in the post-impl phase.
- **Detection half of `/update-architecture`** — reuses its routing table (2a–2e) and its "add, don't
  rewrite" rule; the full manual workflow still owns prose deprecation + the deepening loop.
- **Silent by default** — most tasks introduce nothing doc-worthy; produce no deltas then.
- **Autonomous stays conservative** — append-only safe-adds only; domain reshapes and ADRs are always
  deferred to a human, so the docs never fill with noise.
- **Scoped to the task's diff** — never a whole-repo doc audit.

## Remember

- Check `.ab-method/structure/index.yaml` for paths.
- The task's mission summaries already list Files / Built — start there, confirm against the diff.
- **Always check Entry Points** for API drift, even when the diff didn't obviously touch routing — the
  most common stale-doc victim (inherited from `/update-architecture`).
- Defer anything that rewrites prose, reshapes the domain, or is ADR-worthy to `/domain-model` /
  `/update-architecture` — this skill only adds.
