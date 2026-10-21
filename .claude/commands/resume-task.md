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
2. Load the domain docs, `tech-stack.md`, the patterns index plus only the relevant topic files, and the mission's placement / Test Plan / UI Spec lines
3. Run the mission: `verify: test` → `tdd` (red → green); `verify: build` → typecheck/lint/build + focused existing tests, no new test
4. Append the mission summary and ask before the next one
5. After the last mission: full suite once, `review-implementation` (interactive), `change-map` drift walk-through, then `Completed`

## Notes
- Untagged missions (pre-4.0 trackers) are treated as `verify: test`
- `[pp-x]` groups are offered as a parallel batch; you can still choose sequential
- Open `⚠️ UQ-n` questions are surfaced once; unanswered ones ship as placeholders

## Alternative Usage
```
/ab-master resume-task
```
