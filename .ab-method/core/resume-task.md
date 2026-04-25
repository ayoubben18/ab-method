# Resume Task Workflow

## Purpose
Continue work on an existing task. The progress tracker is the source of truth — no mission docs to read.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where task documents are stored.

## Process

### 1. Identify the Task
Ask: "Which task should we resume?" If unsure, list folders under `docs/tasks/`.

### 2. Read the Progress Tracker
Open `docs/tasks/<task>/progress-tracker.md`. From it, identify:
- Task status (Brainstormed / Validated / In dev / Testing / Completed)
- Which missions are completed (with their technical summaries)
- Which mission is next (or in progress)
- Any constraints/notes from the original grill-me session

### 3. Display Resume Context
```
Resuming: <Task Name>
Status: <In dev>

Missions:
✓ Mission 1: [Name] — Completed
✓ Mission 2: [Name] — Completed
⏳ Mission 3: [Name] — next up
○ Mission 4: [Name] — pending

Ready to continue with Mission 3?
```

### 4. Load Context for the Next Mission
Read (paths from `.ab-method/structure/index.yaml`):
- `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md`
- `docs/architecture/tech-stack.md` (incl. Testing section)
- `docs/architecture/frontend-patterns.md` and/or `backend-patterns.md` — only the ones the mission touches
- `docs/adr/`
- Mission summaries already in the progress tracker

### 5. Run the Mission Through `tdd`
- If the mission's one-line description is vague → invoke `grill-me` first
- Otherwise → invoke the `tdd` skill and run red-green-refactor
- Optionally deploy a subagent if the mission warrants it (large surface, specialized domain). Pick by need, not by mission type.

### 6. On Completion
Append a tight technical summary to the progress tracker (same format as `create-task.md` § 8.6). Skip empty bullets. Then prompt:
"Mission N completed. Ready to start Mission N+1?"

When all missions are done, set task status to `Completed`.

## Remember
- The progress tracker carries everything you need; there are no mission docs by design
- Tests + technical summaries are the persistent context across sessions
- Always TDD via the `tdd` skill, never skip it
