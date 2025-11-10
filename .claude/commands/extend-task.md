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
3. Gather requirements for new missions
4. Create new mission documents
5. Update the progress tracker with additional missions

## Workflow Details
The extend-task workflow provides:
- **Task Selection** - Choose which task to extend
- **Progress Review** - See what missions are already completed
- **Mission Planning** - Define new missions to add
- **Context Preservation** - Maintain technical context from existing missions
- **Progress Tracking** - Update task documentation with new missions

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

