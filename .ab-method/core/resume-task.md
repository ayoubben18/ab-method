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
- Any constraints/notes from the original grill-with-docs session

### 3. Display Resume Context
```
Resuming: <Task Name>
Status: <In dev>

Missions:
[x] Mission 1: [Name] — Completed
[x] Mission 2: [Name] — Completed
[ ] Mission 3: [Name] — next up
[ ] Mission 4: [Name] — pending

Ready to continue with Mission 3?
```

### 4. Load the `tdd` Skill — STEP ZERO, before anything else for the mission

Invoke the `tdd` skill via the Skill tool: `Skill("tdd")`.

Do this **first**, every resumed mission, no exceptions — before reading mission context, before grilling, before any Read / Edit / Write / Bash for the mission's work. The skill loads `SKILL.md` plus its companions (`tests.md`, `mocking.md`, `interface-design.md`, `refactoring.md`, `deep-modules.md`) which drive every subsequent decision. Writing the test first is not enough; the discipline lives in those companion files. If you catch yourself about to touch the codebase without having called `Skill("tdd")` for this mission, stop and call it.

### 5. Load Context for the Next Mission
Read (paths from `.ab-method/structure/index.yaml`):
- `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md`
- `docs/architecture/tech-stack.md` (incl. Testing section)
- `docs/architecture/frontend-patterns.md` and/or `backend-patterns.md` — only the ones the mission touches
- `docs/adr/`
- Mission summaries already in the progress tracker

### 6. Run the Mission Through `tdd` (red-green-refactor)
- If the mission's one-line description is vague → invoke `grill-with-docs` first
- Run red-green-refactor under the already-loaded `tdd` skill — consult the companion files, don't improvise
- Optionally deploy a subagent if the mission warrants it (large surface, specialized domain). Pick by need, not by mission type. A subagent does not exempt you from Step 4 — load `tdd` in the parent context first.

### 7. On Completion
Append a tight technical summary to the progress tracker (same format as `create-task.md` § 8.6). Skip empty bullets. Then prompt:
"Mission N completed. Ready to start Mission N+1?"

When all missions are done, set task status to `Completed`.

## Remember
- The progress tracker carries everything you need; there are no mission docs by design
- Tests + technical summaries are the persistent context across sessions
- Always `Skill("tdd")` first, before any other mission work — never skip the load, even when you "know" how to TDD
