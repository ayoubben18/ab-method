# Resume Task

## Description
Resume an existing task from its progress tracker, one mission at a time.

## Usage
```
/resume-task
```

## Behavior
Loads and executes the resume-task workflow from `.ab-method/core/resume-task.md`:
1. Read `progress-tracker.md` (no mission docs) and show what's done and what's next
2. Load the domain docs, `tech-stack.md`, the seam docs and pattern topics the mission touches, and its steps / placement / UI Spec lines
3. Run the mission: `verify: build` → typecheck/lint/build + focused existing tests, no new test; `verify: repro` → `tdd` (reproducing test red → fix → green)
4. Append the mission summary and ask before the next one
5. After the last mission: full suite once, the protect step, `review-implementation` and `sync-architecture` (interactive), `change-map` drift walk-through, optionally a PR reviewed by `review-pr`, then `Completed`

## Notes
- Legacy `verify: test (UCn)` and untagged missions still run through `tdd` for their `## Test Plan` entry
- `[pp-x]` groups are offered as a parallel batch; you can still choose sequential
- Open `⚠️ UQ-n` questions are surfaced once; unanswered ones ship as placeholders

## Alternative Usage
```
/ab-master resume-task
```
