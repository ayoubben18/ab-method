# Extend Task

## Description
Add missions to an existing task — when requirements change, scope grows, or a parked question finally gets answered.

## Usage
```
/extend-task
```

## Behavior
Loads and executes the extend-task workflow from `.ab-method/core/extend-task.md`:
1. Pick the task and show its missions
2. Surface open `⚠️ UQ-n` questions — **this is where a parked question gets answered**: grill the answer, swap the `TODO(UQ-n)` seam (or plan missions if it's more than a swap), mark the entry `RESOLVED`
3. Gather the new work (grills if vague), then plan it like `/create-task`: placement (reuse / extend / extract, extractions first), new `## Test Plan` entries, and the `prototype-ui` gate if it adds new UI
4. Append one-line missions with `verify:` tags to `progress-tracker.md`
5. `critique-plan` on the new missions, then a dated `## Planned (extension N)` change-map block (the original is never edited)
6. Reopen the task — and its `roadmap.md` entry if it belongs to a roadmap — so `/start-roadmap` re-runs the new work in order

## Notes
- `[pp-x]` tags on new missions only with your explicit yes
- No mission docs — missions live in the tracker

## Alternative Usage
```
/ab-master extend-task
```
