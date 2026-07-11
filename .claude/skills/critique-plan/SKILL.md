---
name: critique-plan
description: Pre-implementation critic. Spins up a read-only domain critic that challenges a drafted plan — a task's missions or a roadmap's task graph — against the ubiquitous language, CONTEXT.md, and ADRs, and pushes back ONLY on genuine conflicts. Silent when the plan is sound. Use before implementing (from create-task / create-roadmap) or standalone to stress-test a plan against the project's domain model.
---

# Critique Plan (pre-implementation)

Stress-test a **drafted plan** against the project's domain model **before** any code is written. This
skill produces **pushbacks, not suggestions** — it never gold-plates a plan that is already sound.

> **Silence is the expected outcome.** A plan that speaks the canonical language and respects the
> documented decisions gets a one-line "No objections." Do not manufacture concerns to look thorough.

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** for where the domain model lives — paths are
user-configurable.

"The plan" is the drafted **mission list** (from create-task), the **task DAG** (from create-roadmap), or
whatever the user pastes in (standalone).

## Process

### 1. Load the domain model

Read only what exists; skip missing files silently (don't flag them or offer to create them):
`UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md` (or `CONTEXT-MAP.md` + each `src/<context>/CONTEXT.md`),
`docs/adr/`, and `docs/architecture/*`.

### 2. Spin up ONE read-only domain critic (subagent)

Spawn a single subagent — `domain-critic` — with the plan verbatim, the files from Step 1, and the rule
that it is **read-only**: it returns pushbacks as text and edits nothing. Isolating it keeps the critique
out of the planning context. Its brief:

**Fire ONLY on a genuine conflict**, one of:
- **Terminology drift** — the plan names a concept differently from the glossary/`CONTEXT.md`, or reuses
  a canonical term for a new meaning.
- **Wrong bounded context** — work placed in the wrong context, or a unit that straddles a documented
  boundary.
- **Contradicts an ADR** — reverses a recorded decision *and* the friction is real enough to reopen it.
  Cite `ADR-NNNN`.
- **Bad graph seam** (roadmap) — a `depends-on` edge crosses a seam the wrong way, two "independent"
  tasks share a domain concept, or a task is mis-scoped (an epic, or a single mission dressed as a task).
- **Reinvents a named concept** — introduces a new abstraction for something the domain model names.

For each, return **What** (the mission/task/decision), **Conflicts with** (the exact term / `CONTEXT.md`
section / `ADR-NNNN`), **Why it matters** (concrete cost, not taste), **Suggested resolution**.

> Example pushback: *"Mission 3 calls it `archiveOrder`, but the glossary defines archiving as retention
> only — this mission also stops billing, which is **Cancellation**. Rename to `cancelOrder` so the code
> matches the domain, or the two concepts will blur across the codebase."*

**Out of scope for this critic:** implementation quality, performance, tests, code style, "you could
also…" ideas — anything not anchored in the domain model. Those belong to the post-implementation
[review-implementation](../review-implementation/SKILL.md) skill. With nothing anchored, the critic
returns exactly: `No objections — the plan is consistent with the domain model.`

### 3. Surface pushbacks — advisory, never blocking

Bring the pushbacks back into the planning session. The user resolves each their way:
- **Accept** → amend the plan (rename, re-scope, fix the edge, move contexts) right there.
- **Dismiss** → drop it. If the dismissal rests on a **load-bearing reason** a future planner would need
  in order not to re-raise it, offer to record an ADR ([../domain-model/ADR-FORMAT.md](../domain-model/ADR-FORMAT.md)).
  Skip ephemeral ("not now") and self-evident reasons.

When a resolution sharpens a term, update `CONTEXT.md` inline
([../domain-model/CONTEXT-FORMAT.md](../domain-model/CONTEXT-FORMAT.md)) — same discipline as `/domain-model`.

If the critic returned "No objections," say so in one line and move on. Don't pad it.

`/domain-model` is a full interactive re-grill of the design; `critique-plan` is a **single-pass,
silent-by-default gate** — one critic, real conflicts only, then straight back to the workflow.
