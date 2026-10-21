# Start Task

## Description
Run an existing task autonomously to completion — `/resume-task` with the `/goal` philosophy. Each remaining mission runs in a subagent that updates the tracker itself; the parent verifies and commits after every mission. Starts on invocation, then no prompts until done (or red).

## Usage
```
/start-task [task-name]
```

## Behavior
Loads and executes the start-task workflow from `.ab-method/core/start-task.md`:
1. Read `progress-tracker.md`; grill any mission too vague to run — before the run, never mid-run
2. Announce the plan and start immediately — invoking the command is the consent
3. One subagent per mission: `verify: test` missions run through `tdd`, `verify: build` missions add no test; placement decisions and `.ab-method/rules/code.md` applied while writing
4. Focused checks after each mission, then a commit (one per mission, one per `[pp-x]` group); the full suite once after the last mission
5. `review-implementation` (autonomous) → `review.md`; `sync-architecture` edits docs in place within the `check-docs` budget; `change-map` reports drift
6. Deletes the disposable `prototype/` folder; stops loudly on red, never commits broken work

## `/start-task` vs `/resume-task`
- **`/start-task`** — walk away, review commits instead of missions
- **`/resume-task`** — stay in the loop per mission

## Notes
- Never runs `prototype-ui`; UI missions build to the tracker's `## UI Spec`
- A `⚠️ UQ-n` mission builds the recorded placeholder and keeps going; open questions are listed in the final report
- Executor, not producer — missions come from `/create-task` / `/extend-task`

## Alternative Usage
```
/ab-master start-task
```
