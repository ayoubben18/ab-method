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
1. Find and load the most recent incomplete task
2. Review the current progress and mission status
3. Continue with the next pending mission
4. Maintain context from previous work

## Workflow Details
The resume-task workflow ensures continuity by:
- **Task Discovery** - Finding paused or incomplete tasks
- **Progress Review** - Understanding what has been completed
- **Context Recovery** - Loading previous work and technical details
- **Mission Continuation** - Picking up from the last incomplete mission
- **Incremental Progress** - Building on existing work

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