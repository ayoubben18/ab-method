# Start Task

## Description
Run an existing task autonomously to a reviewed pull request — `/resume-task` with the `/goal` philosophy. Each remaining mission runs in a subagent (or in this conversation with `inline`) that updates the tracker; the parent verifies and commits after every mission. Starts on invocation, then no prompts until done (or red).

## Usage
```
/start-task [task-name] [inline]
```

- `inline` — run every mission in this conversation, no mission subagents. Reviewers stay subagents.

## Behavior
Loads and executes the start-task workflow from `.ab-method/core/start-task.md`:
1. Read `progress-tracker.md`; grill any mission too vague to run — before the run, never mid-run
2. Announce the plan and start immediately — invoking the command is the consent
3. One subagent per mission (or inline): `verify: build` missions add no test, `verify: repro` bug fixes run test-first through `tdd`; placement, seam docs and `.ab-method/rules/code.md` applied while writing
4. Focused checks after each mission, then a commit (one per mission, one per `[pp-x]` group); the full suite once after the last mission
5. **Protect**: the tests worth having, through seam interfaces, each proven red → `## Protected`
6. `review-implementation` (autonomous) → `review.md`; `sync-architecture` edits docs (seam docs included) in place within the `check-docs` budget; `change-map` reports drift
7. Draft PR with the `pr` skill body → `review-pr` (seams + rules reviewers, safe fixes pushed) → PR marked ready
8. Deletes the disposable `prototype/` folder; stops loudly on red, never commits broken work

## `/start-task` vs `/resume-task`
- **`/start-task`** — walk away, review the PR instead of missions
- **`/resume-task`** — stay in the loop per mission

## Notes
- Never runs `prototype-ui`; UI missions build to the tracker's `## UI Spec`
- A `⚠️ UQ-n` mission builds the recorded placeholder and keeps going; open questions are listed in the final report
- Executor, not producer — missions come from `/create-task` / `/extend-task`

## Alternative Usage
```
/ab-master start-task
```
