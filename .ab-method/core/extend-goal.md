# Extend Goal Workflow

## Purpose

Extend an existing goal — broaden the objective or add to it, building
on top of what the goal's earlier `/goal` run already implemented. The
result is an updated `goal.md` you paste back into `/goal`.

`/extend-goal` is a **producer** workflow. It updates the goal files and
stops. It does NOT execute the goal — `/goal` does that.

## Critical Step

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where
goal documents live. Paths are user-configurable.

## Process

### 1. Identify the Goal

Ask: "Which goal should we extend?" If unsure, list folders under
`docs/goals/`.

### 2. Read the Existing Goal State

Open both files in `docs/goals/<goal-name>/`:

- `goal.md` — the current objective, measurable end state, constraints
- `progress-tracker.md` — the **Notes** log: what the earlier run
  discovered and what is already implemented

Then check the actual code state. The Notes are a record, not a
guarantee — confirm against the codebase what genuinely exists so the
extension builds on reality.

### 3. Gather the Extension — ALWAYS invoke the `grill-with-docs` skill

**Invoke `grill-with-docs` on every `/extend-goal` invocation.** A vague
extension handed to an autonomous loop burns tokens.

The skill walks the decision tree one question at a time and reads
`UBIQUITOUS_LANGUAGE.md` / `CONTEXT.md` so the extension speaks canonical
terms. It must pin down, before exiting:

- **What the extension adds** on top of the current goal
- **The new measurable end state** — verifiable (a command exits 0, a
  build is clean, a route returns 200). If you cannot name a verifiable
  end state, keep grilling.
- **Any new constraints** the extended work must respect

#### Proceed when:
- The grill has resolved every branch it walked down
- The extension, new measurable end state, and constraints are concrete
- The end state is verifiable by a command or observable check
- The user has confirmed the gathered understanding

### 4. Update `goal.md` in Place

Rewrite `goal.md` so it targets the **extended** objective. Never create
a second goal file — the goal evolves in place. The updated file must:

- State the new or expanded **Objective**
- State the new **Measurable end state**
- Carry forward the existing **Constraints** and add any new ones
- Add an **Already implemented** section summarising what the earlier
  run completed — sourced from the `progress-tracker.md` Notes and the
  confirmed code state — so the loop builds on existing work instead of
  redoing it
- Keep the **Context**, **Progress tracking**, and **Keep going until**
  blocks (same format as `create-goal.md` § 4)

```markdown
## Already implemented
[What the earlier /goal run completed and verified. The loop should
treat this as done and build on top of it, not rebuild it.]
```

### 5. Keep the Same `progress-tracker.md`

Do NOT reset it. The Notes log carries forward — it is the running
record of what exists. The next `/goal` run keeps appending to it.
Update its `**Status**` line if appropriate.

### 6. Hand Off to the User

```
Goal extended: docs/goals/[goal-name]/goal.md

Paste the updated goal.md into /goal again. The loop builds on what is
already implemented and keeps going until the new measurable end state
holds.
```

## Key Principles

- **Always grill** — `grill-with-docs` runs on every invocation
- **Update in place** — one `goal.md` per goal; never a second file
- **Build on, do not rebuild** — the `Already implemented` section tells
  the loop what to keep
- **Notes carry forward** — `progress-tracker.md` is never reset
- **No checklist** — the loop runs until the measurable end state holds
- **Verifiable end state or it is not ready** — same bar as `/create-goal`

## Remember

- Check `.ab-method/structure/index.yaml` for paths
- Read both `goal.md` and `progress-tracker.md`, then confirm against code
- Name the exact verification command in the new measurable end state
