# Resume Task

## Description
Resume an existing task from where it was paused, continuing with the next incomplete mission.

## Usage
```
/resume-task
```

## Behavior
Loads and executes the resume-task workflow from `.ab-method/core/resume-task.md`

This workflow will:
1. Identify the task and read its `progress-tracker.md` (single source of truth — there are no mission docs)
2. Show progress: which missions are done, which is next
3. Load UBIQ + CONTEXT + tech-stack + patterns + ADRs for the next mission
4. **Run the next mission through the `tdd` skill** (red-green-refactor)
5. Append a tight technical summary on completion

## Workflow Details
- The progress tracker carries the mission list and per-mission technical summaries from prior sessions — that's the entire context
- Tests + summaries are the persistent artifacts across sessions
- Always TDD via the `tdd` skill, never skip it

## Examples
```
/resume-task
# Finds the most recent incomplete task
# Reviews progress and continues with next mission
# Maintains all previous context and technical constraints
```

## Alternative Usage
You can also use the traditional AB Method master controller:
```
/ab-master resume-task
```