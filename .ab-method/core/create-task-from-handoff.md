# Create Task From Handoff Workflow

## Purpose

Resume a side-topic that was captured as a handoff (usually spun off mid-grill via the `handoff` skill) and turn it into a proper task. This is the bridge between two grilling sessions: the handoff froze the tangent so the original grill could continue; this workflow thaws it and grills it to completion.

## Critical Step

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where handoffs live (`docs/handoffs/`) and where task documents are written.

## Process

### 1. Locate the handoff

- If the user passed a slug or path, read that handoff from `docs/handoffs/`.
- If nothing was passed, list `docs/handoffs/` and ask which one to resume (show each handoff's goal line, newest first).
- If the directory is empty or missing, tell the user there are no pending handoffs and offer to run `/create-task` instead.

### 2. Absorb the handoff context

Read the handoff in full. It already contains the goal, what was decided, what's still open, what was ruled out, and references to related artifacts. **Do not re-ask what the handoff already answers.** Follow its references (parent task's `progress-tracker.md`, ADRs, diffs) to rebuild context cheaply.

### 3. Continue the grill — invoke `grill-with-docs`

Invoke the `grill-with-docs` skill, **seeded with the handoff**. The grill picks up exactly where the handoff left off:

- Treat everything the handoff already settled as given — confirm, don't re-litigate.
- Drive down only the branches the handoff left open.
- Read `UBIQUITOUS_LANGUAGE.md` / `CONTEXT.md` so the resulting task speaks canonical domain language.

By the end the grill must have resolved every open branch and covered problem framing, scope, behavior, constraints, and existing-code anchors — the same bar as `create-task`.

### 4. Hand off to the create-task flow

From here the work is identical to `create-task` starting at its Step 2. Follow `.ab-method/core/create-task.md` from **"2. Analyze Project Context"** onward:

- Analyze project context (architecture + domain docs, relevant code).
- Identify task type and complexity.
- Create the task folder and slim `progress-tracker.md`.
- Define all missions upfront.
- Confirm with the user, then run each mission through the `tdd` skill.

### 5. Retire the handoff

Once the task document is created, the handoff has served its purpose. Note in the new `progress-tracker.md` that it originated from the handoff (reference the handoff path), then delete the handoff file from `docs/handoffs/` so the pending list reflects only un-actioned work. Confirm the deletion with the user if they may want to keep it.

## Key Principles

- **A handoff is a paused grill** — resume it, don't restart it. The handoff's settled decisions are inputs, not open questions.
- **Reuse `create-task` wholesale** — this workflow only adds the "load the handoff and continue the grill" front-end; everything from project analysis onward is `create-task.md`.
- **Always grill, always TDD** — same guarantees as `create-task`.
- **Leave the pending list clean** — retire the handoff once it becomes a task.

## Remember

- Check `.ab-method/structure/index.yaml` for the handoffs and tasks paths
- Seed `grill-with-docs` with the handoff; only grill the open branches
- After the grill, follow `create-task.md` from Step 2 onward — no divergence
- Delete the handoff once the task exists
