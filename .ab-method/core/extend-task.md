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
✓ Mission 1 — Completed
✓ Mission 2 — Completed
○ Mission 3 — Pending
```

### 3. Gather New Mission Requirements
- If the user's description is clear → add the missions as one-line entries
- If vague → invoke the `grill-me` skill before drafting them

`grill-me` reads `UBIQUITOUS_LANGUAGE.md` + `CONTEXT.md` and explores the codebase, so the new missions land in canonical terms.

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

### 5. Update Task Status
If the task was `Completed`, move it back to `Validated` (or `In dev` if work has already started on the new missions).

### 6. Confirm with User
"Added [N] missions. Ready to start Mission X?"

When the user confirms, hand off to `/resume-task` (or continue inline) — each new mission runs through the `tdd` skill, same as missions created at task time.

## Remember
- Add to `progress-tracker.md`, never create separate mission files
- Sequential numbering, no gaps
- Use `grill-me` whenever the new mission descriptions are vague
- The `tdd` skill runs on every mission, including extensions
