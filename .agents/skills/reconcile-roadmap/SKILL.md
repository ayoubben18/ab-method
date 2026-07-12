---
name: reconcile-roadmap
description: Cross-plan coherence critic for a whole roadmap. Reads roadmap.md plus every planned task's progress-tracker.md and pushes back ONLY on genuine discrepancies BETWEEN the finished plans — broken seams, coverage gaps, duplicated work, reversed/missing edges, terminology drift, conflicting assumptions. Read-only; silent when the plans cohere. Run standalone after planning finishes and before /start-roadmap.
---

# Reconcile Roadmap (pre-execution, cross-plan)

Brush across **all the finished task plans of a roadmap at once** and stress-test that they
**cohere as a system** — that the seams the roadmap's `depends-on` edges promised are actually
honored by the missions on both sides — **before** `/start-roadmap` executes anything. This
skill produces **pushbacks, not suggestions**; it never gold-plates plans that already fit
together.

> **Silence is the expected outcome.** A set of plans whose seams line up, whose coverage is
> complete, and whose terms agree gets a one-line "No discrepancies — the plans cohere." Do not
> manufacture concerns to look thorough.

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** for where roadmaps, tasks, and the
domain model live — paths are user-configurable, never hardcode them.

## Where this sits (and what it is NOT)

Three critics guard a roadmap at three different moments. Keep them distinct:

```
critique-plan          → ONE plan vs the domain model          (pre-plan / per-task)
reconcile-roadmap      → ALL plans vs EACH OTHER               (pre-execution, whole roadmap)  ← this skill
review-implementation  → one task's diff vs quality critics    (post-implementation)
```

`critique-plan` at roadmap time only saw the **coarse DAG** (one-line task scopes), and each
task's own `critique-plan` only saw **that one task's missions**. Neither ever reads the whole
**set** of finished `progress-tracker.md` files together, so discrepancies that only exist
*between* plans slip through to execution. That is exactly the gap this skill closes: it is the
pre-execution counterpart of an integration test, run at the plan level.

It is **read-only and advisory** — it surfaces discrepancies and points at the fix; it never
edits a plan, reshapes a task, or blocks a run. It is **standalone**: invoke it manually
(`/reconcile-roadmap <name>`), typically once planning is done and before `/start-roadmap`.

## Process

### 1. Identify the roadmap

- If the user passed a roadmap name or a path to its `roadmap.md`, use it.
- Otherwise list folders under `docs/roadmaps/` and ask which to reconcile.

### 2. Load the material

Read (skip missing files silently — don't flag them or offer to create them):

- **`roadmap.md`** — the Objective, the task list, and every `depends-on` edge (the DAG).
- **Every planned task's tracker** — for each task marked `plan: ✅`, read
  `docs/tasks/<slug>/progress-tracker.md`. **Confirm the file actually exists with missions;
  don't trust the flag alone** (same discipline as `/start-roadmap`).
- **The domain model that exists** — `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md` (or `CONTEXT-MAP.md`
  + per-context `src/<context>/CONTEXT.md`), `docs/adr/`, `docs/architecture/*`. Used to judge
  terminology and seam ownership, not re-critiqued per plan.

### 3. Handle partial planning

Reconcile **only the planned subset**. A roadmap may be partially planned — that's fine.

- Any task still `plan: ⬜` (or whose `progress-tracker.md` is missing) is reported as
  **"couldn't check."**
- Any seam that touches an unplanned task is flagged **unverifiable**, not assumed fine — you
  can't confirm a handoff whose other end doesn't exist yet.

(This mirrors `/start-roadmap`'s tolerance for running a planned prefix.)

### 4. Spin up ONE read-only reconciler subagent

Spawn a single subagent — `reconciler` — with the roadmap, **all** the planned trackers, and the
domain-model files from Step 2, and the rule that it is **read-only**: it returns discrepancies
as text and edits nothing. Isolating it keeps the cross-plan analysis out of the main context.
(For a very large roadmap you *may* fan out one reconciler per seam, but the default is one
reconciler holding the whole set — the discrepancies live in the relationships *between* plans,
so a single reader sees them best.)

Its brief — **fire ONLY on a genuine cross-plan discrepancy**, one of:

1. **Broken seam / contract mismatch** — Task B `depends-on` A, and B's missions consume a
   type / endpoint / table / interface that A's missions never produce, or produce under a
   different name or shape. The edge promised a handoff the plans don't honor.
2. **Coverage gap** — a piece of the roadmap Objective, or a seam implied by an edge, that **no**
   task's missions actually implement. Work that falls between tasks.
3. **Overlap / duplication** — two tasks plan the **same** artifact (same file, table, function,
   endpoint) — a double-build or a merge collision waiting to happen at execution.
4. **Ordering / edge defect** — a mission in an **upstream** task actually needs an artifact only
   produced **downstream** (an edge is reversed, or a needed edge is missing). This is grounded
   in the *actual missions*, which the roadmap-time `critique-plan` never saw.
5. **Cross-task terminology drift** — the same concept named differently across two tasks'
   missions (e.g. `cancelOrder` in one, `voidOrder` in another), which will fragment the
   codebase. `critique-plan` sees one task at a time and structurally cannot catch this.
6. **Conflicting assumptions** — two tasks assume incompatible things about a shared entity or
   contract (soft- vs hard-delete of the same record, sync vs async on the same boundary,
   differing auth or ownership model).

For each finding, return: **What** (the tasks/missions involved), **Discrepancy** (the exact
mismatch, citing *both* sides — `task-slug` + the mission on each), **Why it matters** (the
concrete cost at execution, not taste), **Suggested resolution**.

> Example pushback: *"**Broken seam.** `checkout-ui` (mission 2, "call POST /charges") depends-on
> `charge-api`, but `charge-api`'s missions only plan `POST /payments` — no `/charges` endpoint
> is ever produced. At execution `checkout-ui` will build against a route that doesn't exist.
> Either rename `charge-api`'s endpoint to `/charges`, or fix `checkout-ui`'s mission to call
> `/payments` — and align the glossary term so both tasks agree."*

**Out of scope for this critic** — do not raise:
- single-plan domain conflicts (terminology/context/ADR issues *within* one task) → that's
  [critique-plan](../critique-plan/SKILL.md),
- implementation quality, tests, performance, code style → that's post-implementation
  [review-implementation](../review-implementation/SKILL.md),
- reshaping or re-scoping tasks → that's `/create-task` / `/extend-task`.

With nothing anchored across the plans, the reconciler returns exactly:
`No discrepancies — the plans cohere.`

### 5. Surface findings — advisory, never blocking

Bring the pushbacks back into the session. The user resolves each their way:

- **Amend a tracker** — add or fix a mission so the seam is honored (via `/extend-task`, or
  inline in that task's `progress-tracker.md`).
- **Redraw an edge** in `roadmap.md` — add, remove, or reverse a `depends-on` so ordering matches
  what the missions actually need.
- **Rename to the canonical term** across the affected trackers so both tasks speak one language.
- **Dismiss** → drop it. If the dismissal rests on a **load-bearing reason** a future reader
  would need in order not to re-raise it, offer to record an ADR
  ([../domain-model/ADR-FORMAT.md](../domain-model/ADR-FORMAT.md)). Skip ephemeral ("not now")
  and self-evident reasons.

Also report the **"couldn't check"** list from Step 3 (unplanned tasks and unverifiable seams)
so the user knows the reconciliation's coverage, not just its findings.

If the reconciler returned "No discrepancies," say so in one line (plus the couldn't-check list
if any) and stop. Don't pad it.

## Key Principles

- **Cross-plan, not single-plan** — the discrepancies live in the relationships *between*
  finished plans; that's the whole reason this skill exists alongside `critique-plan`.
- **Silent by default** — coherent plans get one line; never invent concerns.
- **Read-only and advisory** — surfaces and points at the fix; the user resolves. It never edits
  a plan or blocks a run.
- **Standalone** — invoked manually, typically after planning and before `/start-roadmap`; not
  auto-wired into any workflow.
- **Reconcile what's planned** — a partial roadmap is fine; report what couldn't be checked
  rather than assuming unplanned seams are sound.

## Remember

- Check `.ab-method/structure/index.yaml` for paths and the `relationships` map.
- Confirm each `plan: ✅` task's `progress-tracker.md` truly exists with missions — don't trust
  the flag alone.
- Roadmaps and tasks are referenced by slug; tasks live in the normal `docs/tasks/<slug>/`.
