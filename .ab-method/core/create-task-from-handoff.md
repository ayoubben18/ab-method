# Create Task From Handoff Workflow

## Purpose

Resume a side-topic captured as a handoff (usually spun off mid-grill via the `handoff` skill) and turn it into a task. The handoff froze the tangent; this workflow thaws it and grills it to completion.

## Critical Step

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where handoffs live (`docs/handoffs/`) and where task documents are written.

Follow `.ab-method/rules/communication.md` for every message.

## Process

### 1. Locate the handoff

- A slug or path was passed → read that handoff from `docs/handoffs/`.
- Nothing passed → list `docs/handoffs/` (goal line, newest first) and ask which.
- None pending → say so and offer `/create-task`.

### 2. Absorb the handoff context

Read it in full — goal, decisions, open branches, ruled-out options, references. **Don't re-ask what it already answers.** Follow its references (parent tracker, ADRs, diffs) to rebuild context.

### 3. Continue the grill — `grill-with-docs`

Invoke `grill-with-docs` **seeded with the handoff**: treat its settled decisions as given, drive only the open branches, use the canonical domain terms. Same exit bar as `create-task`: every branch resolved or parked as an unresolved question with an agreed placeholder (`create-task.md` § 1), and problem, scope, behavior, constraints and existing-code anchors covered.

### 4. Hand off to the create-task flow

Follow `.ab-method/core/create-task.md` from **"2. Analyze Project Context"** onward, with no divergence — project analysis, placement decisions, the prototype gate for new UI, the Test Plan, `verify:` tags on missions, `critique-plan`, the planned change map, confirmation, then the mission loop and the post-implementation passes.

### 5. Retire the handoff

Once the task exists, note in its `progress-tracker.md` that it came from the handoff (with the path), then delete the handoff from `docs/handoffs/`. Confirm first if the user may want to keep it.

## Key Principles

- **A handoff is a paused grill** — resume it, don't restart it
- **Reuse `create-task` wholesale** — this workflow only adds the handoff front-end
- **Leave the pending list clean** — retire the handoff once it becomes a task
