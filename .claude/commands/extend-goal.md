# Extend Goal

## Description
Extend an existing goal — broaden or add to its objective, building on top of what the earlier `/goal` run already implemented.

## Usage
```
/extend-goal
```

## Behavior
Loads and executes the extend-goal workflow from `.ab-method/core/extend-goal.md`

This workflow will:
1. Identify the goal and read its `goal.md` + `progress-tracker.md`, then confirm the real code state
2. **Always invoke `grill-with-docs`** to pin down the extension, a verifiable new measurable end state, and new constraints
3. Update `goal.md` in place — extended objective, new end state, plus an `Already implemented` section so the loop builds on existing work
4. Keep the same `progress-tracker.md` — its Notes carry forward, never reset

## Workflow Details
- **Always grill** — `grill-with-docs` runs on every invocation
- **Update in place** — one `goal.md` per goal; never a second file
- **Build on, do not rebuild** — the `Already implemented` section tells the `/goal` loop what to keep
- **No checklist** — `progress-tracker.md` is a notes log; the loop runs until the measurable end state holds

## Examples
```
/extend-goal
# Reads the existing goal, grills for the extension,
# rewrites goal.md to target the extended objective
```

## Alternative Usage
```
/ab-master extend-goal
```
