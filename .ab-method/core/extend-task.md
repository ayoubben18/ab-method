# Extend Task Workflow

## Purpose
Add new missions to an existing task — when requirements change, scope grows, or follow-up work surfaces during development.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find task locations.

## Process

### 1. Identify the Task
Ask: "Which task should we extend?"

### 2. Read the Progress Tracker
Show current state:
```
Extending: <Task Name>
Status: <Current>

Missions:
[x] Mission 1 — Completed
[x] Mission 2 — Completed
[ ] Mission 3 — Pending
```

### 2.5 Resolving an Unresolved Question — the swap-the-black-box case

If the task has an `unresolved-questions.md` with `OPEN` entries, show them alongside the missions:

```
Open questions (docs/tasks/<task>/unresolved-questions.md):
  UQ-1 Which currencies at launch?  → shipped placeholder: USD only, src/billing/currency.ts:8
```

**This is the main reason a task gets extended** — the answer finally arrived and the placeholder has to
become real. When the user is here to resolve one:

1. **Grill the answer, don't just take it.** Invoke `grill-with-docs` on that question — an answer that
   was too hard to give at creation time usually brings its own branches.
2. **Size the swap honestly** using the entry's *If the answer differs* line:
   - **Constant swap** — the recorded seam takes the real value, its placeholder test becomes the real
     test, the `TODO(UQ-n)` comment goes. One new mission, sometimes none if it's a one-liner you do
     right here.
   - **Real work** — the answer invalidates the shape, not just the value. Draft proper missions for it
     like any other extension; `grep -rn 'TODO(UQ-n)'` gives you the blast radius.
3. **Close the entry**: mark it `RESOLVED <date>` with the answer and where it was applied. The entry
   stays in the file — the record of what was guessed and what it became is the point. Drop the
   `⚠️ UQ-n` markers from the affected mission lines and the tracker's Unresolved Questions section
   (remove the section when the last one closes).
4. **Consider an ADR.** A question hard enough to park, once answered, often clears the ADR bar (hard to
   reverse, surprising without context, a real trade-off). `grill-with-docs` offers it — take the offer
   when all three hold.

Leaving a question open is a fine outcome too: extending a task for *other* reasons doesn't oblige the
user to resolve anything. Never resolve one on their behalf.

### 3. Gather New Mission Requirements
- If the user's description is clear → add the missions as one-line entries
- If vague → invoke the `grill-with-docs` skill before drafting them

`grill-with-docs` reads `UBIQUITOUS_LANGUAGE.md` + `CONTEXT.md` and explores the codebase, so the new missions land in canonical terms.

### 4. Append Missions to the Progress Tracker
Continue numbering sequentially:
```markdown
## Missions
- [x] Mission 1: ... — Completed
- [x] Mission 2: ... — Completed
- [ ] Mission 3: ... — Pending
- [ ] Mission 4: [Layer] — [one-line description]   ← NEW
- [ ] Mission 5: [Layer] — [one-line description]   ← NEW
```

**No mission docs.** Same rule as `/create-task`: missions live as one-line entries in the progress tracker. The `tdd` skill drives implementation when each mission is run.

#### Optional: parallel-group tags on new missions (`[pp-x]`)

If two or more of the **new** missions are independent of each other (disjoint files, no shared types, neither consumes the other's output), they are candidates for a parallel group — same notation and semantics as `create-task.md` § 7. New missions may also join an existing **pending** group when they're independent of every sibling in it.

**Never tag on your own — always ask the user first**; they might not want parallel execution. If they decline, the new missions stay sequential. Continue group numbering from the highest existing tag (existing `[pp-2]` → next group is `[pp-3]`). Never retag completed missions or groups already underway.

### 5. Update Task Status
If the task was `Completed`, move it back to `Validated` (or `In dev` if work has already started on the new missions).

#### If the task belongs to a roadmap — reopen it there too
Check `docs/roadmaps/*/roadmap.md` (the `relationships` map in `.ab-method/structure/index.yaml` documents the link). If this task's slug appears in a roadmap:

- Flip its roadmap entry's `status:` from `done` back to `pending` (it has unfinished work again) and uncheck its roadmap line. Leave `plan: ✅` as is — the task is still planned, just extended.
- If the roadmap's overall **Status** was `Completed`, move it back to `In dev` (or `Ready`).

This is what lets a later `/start-roadmap` re-run notice the new work. Extending a task that others depend on does **not** auto-reopen those downstream tasks — their own missions are still done. If the tweak actually changes what a downstream task needs, extend that task too; `/start-roadmap` will then run both in dependency order.

### 5.5 Pre-implementation Critique — invoke the `critique-plan` skill on the NEW missions

Before confirming, run the newly drafted missions past the domain model — same discipline as
`/create-task` § 7.5. **Invoke the `critique-plan` skill** scoped to the *new* missions (with the
existing ones as context): a read-only domain critic pushes back only on genuine conflicts (terminology
drift, wrong context, an ADR contradiction, a reinvented concept). Advisory and silent when the
additions are sound. Resolve any real pushback (amend a mission, or dismiss with a load-bearing reason
that may become an ADR) and update the tracker before Step 6.

### 5.6 Extend the Planned Change Map — invoke the `change-map` skill (planned pass)

New missions mean new blast radius. **Invoke the `change-map` skill** in its *planned* pass, scoped to the
**new** missions, and append the result to `docs/tasks/<task>/change-map.md` as a dated extension block:

```markdown
## Planned (extension 1) — YYYY-MM-DD, missions 4–5
```

**Never edit the original `## Planned` section**, and never fold the new rows into it. Each block records
what was believed at the moment those missions were drafted; merging them would silently rewrite a
prediction the task has already been measured against. The actual pass computes drift against the union of
the blocks.

Two cases worth calling out when you draw it:

- **The extension lands entirely inside modules the original map already covers** — good sign, and worth
  saying: the task grew in depth, not in reach.
- **The extension reaches a module the original never named** — the task's scope genuinely widened. Ask
  whether this is still one task or two; a `handoff` is often the honest answer.

Skip this step only when the task has no `change-map.md` at all (it predates the map). Never back-fill one
from what the completed missions already did.

### 6. Confirm with User
"Added [N] missions. Ready to start Mission X?"

When the user confirms, choose how to run the new missions:
- **Standalone task** → hand off to `/resume-task` (or continue inline); each new mission runs through the `tdd` skill.
- **Roadmap task** → the user can run the new missions right here via `/resume-task`, **or** re-run `/start-roadmap <name>` to execute every extended task across the roadmap in dependency order (the common case after a big roadmap implementation, when several tasks got tweaks).

## Remember
- Add to `progress-tracker.md`, never create separate mission files
- New missions get their own dated `## Planned (extension N)` block in `change-map.md` — the original block is never edited or merged into
- Sequential numbering, no gaps
- Use `grill-with-docs` whenever the new mission descriptions are vague
- `/extend-task` is where a parked `UQ-n` gets answered: grill the answer, swap the `TODO(UQ-n)` seam (or plan missions if it's more than a swap), mark the entry `RESOLVED` — never resolve one the user didn't answer
- The `tdd` skill runs on every mission, including extensions
- `[pp-x]` tags on new missions only with the user's explicit yes — sequential is the default
- If the task is in a roadmap, reopen its `roadmap.md` entry (`status: done → pending`) so a `/start-roadmap` re-run picks up the new missions in dependency order
