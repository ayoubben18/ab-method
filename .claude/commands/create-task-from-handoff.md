# Create Task From Handoff

## Description
Resume a handoff — a side-topic that was captured mid-grill via the `handoff` skill — and turn it into a test-driven task. The bridge between two grilling sessions.

## Usage
```
/create-task-from-handoff [handoff-slug]
```

Pass a slug to resume a specific handoff from `docs/handoffs/`. Omit it to pick from the pending list.

## Behavior
Loads and executes the create-task-from-handoff workflow from `.ab-method/core/create-task-from-handoff.md`

This workflow will:
1. Locate the handoff (by slug, or by listing `docs/handoffs/`)
2. Absorb its context — treat everything it already settled as given
3. **Continue the grill via `grill-with-docs`**, driving only the branches the handoff left open
4. Hand off to the standard create-task flow (project analysis → missions → `tdd`)
5. Retire the handoff once the task document exists

## Workflow Details
- **A handoff is a paused grill** — resume it, don't restart it
- **Reuses `create-task` wholesale** from project analysis onward
- **Always grill, always TDD** — same guarantees as `/create-task`

## How handoffs get created
During any grilling session, when a tangent emerges that deserves its own task, invoke the `handoff` skill to capture it under `docs/handoffs/` — without derailing the current grill. Resume it later with this command.

## Examples
```
/create-task-from-handoff rate-limit-redis-vs-token-bucket
# Resumes that specific handoff and grills the open branches

/create-task-from-handoff
# Lists pending handoffs and asks which to resume
```

## Alternative Usage
```
/ab-master create-task-from-handoff
```
