# Create Task

## Description
Define a holistic task: deepen the code it lands in, plan where its code lives, then run its missions. Tests are chosen after the code exists.

## Usage
```
/create-task
```

## Behavior
Loads and executes the workflow in `.ab-method/core/create-task.md`:

1. Roadmap check, then `grill-with-docs` (short when the request is already specific)
2. Read domain docs, tech-stack, `docs/seams/` and only the pattern topics the task touches
3. **Deepening scan** over the blast radius (book red flags); every finding becomes a refactor mission placed first
4. **Placement**: reuse / extend / extract / introduce per capability
5. **Seam design gate** (introduce, or a seam's interface changing): Design It Twice, your pick becomes `docs/seams/<slug>.md` before any code
6. **New UI**: `prototype-ui` builds disposable HTML variants; your pick becomes the `## UI Spec`
7. Composed missions, tagged `verify: build` (typecheck / lint / build) or `verify: repro` (bug fix, test first through `tdd`)
8. `critique-plan` and the planned `change-map`, then you validate
9. Missions run; focused checks per mission, full suite once at the end
10. **Protect**: the tests worth having, through seam interfaces, each proven red
11. `review-implementation`, `sync-architecture` (in-place doc edits gated by `check-docs`), actual `change-map`, then optionally a PR reviewed by `review-pr`

## Alternative Usage
```
/ab-master create-task
```
