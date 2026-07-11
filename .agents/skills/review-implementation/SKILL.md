---
name: review-implementation
description: Post-implementation review. Spins up three read-only critics on a completed task's diff — cleaner-architecture, slop-defender, reusability-inspector — that push back ONLY on real issues. Autonomous runs apply safe fixes (tests-green-gated) and write everything to review.md next to progress-tracker.md; interactive runs present findings to pick. Use after a task's missions are done (from start-task / start-roadmap / create-task) or standalone on a diff.
---

# Review Implementation (post-implementation)

Review a **completed task's diff** through three lenses, each a read-only critic subagent. The
counterpart to [../critique-plan/SKILL.md](../critique-plan/SKILL.md): that guards the plan *before*
coding; this guards the result *after*.

> **Silence is the default output.** A clean diff produces no findings — that is the normal case. A
> finding survives only if a senior engineer, looking at this diff, would actually make the change. State
> each as a concrete cost, not a preference. Never invent refactors to look thorough.

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** for paths (task location, domain model,
`review.md`). Review **only what this task changed** — the cohesive diff across its missions (`git diff`
for the commit range). This is not a whole-codebase audit; that's `/improve-codebase-architecture`.

## Process

### 1. Gather diff + context

The changed files and their `git diff`, plus (read only what exists): `UBIQUITOUS_LANGUAGE.md` /
`CONTEXT.md` (canonical terms, spotting reinvented concepts), `docs/architecture/*` (the documented way
things are built here), `docs/adr/` (don't propose what an ADR settled).

### 2. Spin up THREE read-only critics — in parallel

Spawn three subagents **in one batch**, named exactly:

| Agent | Lens | Brief |
|---|---|---|
| `cleaner-architecture` | depth / deepening | [ARCHITECTURE.md](ARCHITECTURE.md) |
| `slop-defender` | AI code-slop | [SLOP.md](SLOP.md) |
| `reusability-inspector` | duplication / reuse | [REUSE.md](REUSE.md) |

Each is **read-only** — analyses the diff, returns a findings list (often empty), edits nothing. Seed
each with the diff + context + its lens file. On **Codex** (`spawn_agent` is one level deep) spawn them
at the orchestrator's own level — flat; on **Claude** they may nest. Flat works on both.

### 3. Collect + classify

Merge the lists. Drop anything that's a preference (not a concrete cost), an ADR already settled, or a
design change bigger than this task (note it open, don't act). Classify each survivor:

- **`safe-fix`** — confirmed, mechanical, **covered by existing tests**, **no interface/behavior change**
  (delete dead code, inline a pass-through, drop a redundant comment, call an existing util of identical
  semantics).
- **`needs-judgment`** — real but design-level, risky, behavior/interface-affecting, or not test-covered.

### 4. Act — by mode

**Interactive** (manual create-task tail, or standalone): present findings grouped by lens, each marked
`safe-fix`/`needs-judgment`; apply what the user approves; run tests; report.

**Autonomous** (`start-task` / `start-roadmap` — afk): the **orchestrator** (never the parallel critics)
applies fixes, so there are no concurrent writes:
1. For each `safe-fix`: apply it, **re-run the test suite** (command from `tech-stack.md`). Green → keep.
   Red → **revert it**, downgrade to `needs-judgment` with a note (`attempted, reverted — broke <test>`).
2. Commit kept fixes as one `refactor(<task>): post-review cleanup` (repo convention). Nothing kept → no commit.
3. **Write `docs/tasks/<task>/review.md`** (below) — every finding, applied or open. Never prompt;
   anything uncertain stays open rather than being changed.

### 5. `review.md` format

Written next to `progress-tracker.md`. Always write it in autonomous mode — even when clean — so the afk
user knows the review ran.

```markdown
# Post-Implementation Review: <Task Name>
**Reviewed**: YYYY-MM-DD   **Scope**: missions <a–z> / commit <range>

## Applied — safe fixes ✅ (commit <hash>)
- [slop-defender] removed pass-through wrapper `fooProxy` — src/foo.ts
- [cleaner-architecture] inlined shallow `formatName` into its one caller — src/user.ts

## Open — need your judgment ⬜
### [reusability-inspector] duplicates `paymentService.calculateTax`
- **Files**: src/checkout/tax.ts
- **Why it matters**: two tax formulas will drift; a rate change must be made twice.
- **Suggested change**: call the existing `paymentService.calculateTax` instead.

## Clean lenses
- slop-defender: no further findings
```

If all three lenses are clean and nothing was applied, the whole body is one line:
`All three lenses clean — no findings.`
