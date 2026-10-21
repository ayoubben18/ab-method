# Create Task

## Description
Define a task, plan where its code lives and what deserves a test, then run its missions.

## Usage
```
/create-task
```

## Behavior
Loads and executes the workflow in `.ab-method/core/create-task.md`:

1. Roadmap check, then `grill-with-docs` (short when the request is already specific)
2. Read domain docs, tech-stack and only the pattern topics the task touches
3. **Placement**: reuse / extend / extract per capability; extractions become refactor missions placed first
4. **New UI**: `prototype-ui` builds disposable HTML variants; your pick becomes the `## UI Spec`
5. **Test Plan**: the short list of use cases worth a test. Nothing else gets one
6. Missions tagged `verify: test` (through `tdd`) or `verify: build` (typecheck / lint / build)
7. `critique-plan` and the planned `change-map`, then you validate
8. Missions run; focused tests per mission, full suite once at the end
9. `review-implementation`, `sync-architecture` (in-place doc edits gated by `check-docs`), actual `change-map`

## Alternative Usage
```
/ab-master create-task
```
