# Extend Task

## Description
Add new missions to an existing task after initial missions have been completed. Useful when requirements change or new features need to be added to an ongoing task.

## Usage
```
/extend-task
```

## Behavior
Loads and executes the extend-task workflow from `.ab-method/core/extend-task.md`

This workflow will:
1. Select a task to extend
2. Review current mission progress
3. Gather requirements for new missions (grills if vague)
4. Append the new missions as one-line entries in `progress-tracker.md` (no mission docs)
5. Reopen the task if it was `Completed` — and, if it belongs to a roadmap, reopen its `roadmap.md` entry too (`status: done → pending`) so a `/start-roadmap` re-run picks up the new work in dependency order

## Workflow Details
The extend-task workflow provides:
- **Task Selection** - Choose which task to extend
- **Progress Review** - See what missions are already completed
- **Mission Planning** - Define new missions to add
- **Context Preservation** - Maintain technical context from existing missions
- **Progress Tracking** - Update `progress-tracker.md` with new missions (one-line entries, no separate mission docs)
- **Roadmap-aware** - If the task is part of a roadmap, reopening it updates `roadmap.md` so `/start-roadmap` re-runs the extended work in dependency order
- **Optional Parallel Groups** - Independent new missions can be tagged `[pp-x]` (or join a pending group) for concurrent subagent execution — only with the user's explicit yes

## Examples
```
/extend-task
# Selects a task and adds new missions
# Creates detailed mission documents
# Updates progress tracker with additional missions
```

## Alternative Usage
You can also use the traditional AB Method master controller:
```
/ab-master extend-task
```

