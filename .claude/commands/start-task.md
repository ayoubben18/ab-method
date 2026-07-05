# Start Task

## Description
Run an existing task autonomously to completion — `/resume-task` with the `/goal` philosophy. Each remaining mission runs in a subagent that follows `tdd` and updates the progress tracker itself; the parent verifies tests and commits after every finished mission. Starts immediately on invocation — no "Proceed?" prompt — then no prompts until done (or something goes red).

## Usage
```
/start-task [task-name]
```

## Behavior
Loads and executes the start-task workflow from `.ab-method/core/start-task.md`

This workflow will:
1. Identify the task and read its `progress-tracker.md` (single source of truth)
2. Gate on vagueness — any mission too fuzzy to run without judgment calls gets grilled **before** the run, never mid-run
3. Announce the plan (missions, parallel groups, commit-per-mission) and **start immediately** — no "Proceed?"; invoking the command is the consent
4. **Run every remaining mission in a subagent** through the `tdd` discipline; the subagent checks off its mission and appends its technical summary to the tracker
5. Verify the test suite after each mission, then **commit** (one commit per mission, one per `[pp-x]` group)
6. Stop loudly on red — never commits broken work, never starts the next mission on a broken state

## `/start-task` vs `/resume-task`
- **`/start-task`** — trust the roadmap, walk away, review commits instead of missions
- **`/resume-task`** — stay in the loop, review each mission before moving on

## Workflow Details
- **No confirmation — starts immediately, then autonomous** — no "Proceed?" gate, no prompting between missions
- **Group-aware** — `[pp-x]` missions run concurrently in subagents; siblings skip the tracker (the parent merges their summaries) to avoid write conflicts
- **Green tests gate every commit** — a red feedback loop takes priority over progress, exactly like `/goal`
- **Executor, not producer** — missions are defined by `/create-task` / `/extend-task`; this workflow only runs them

## Examples
```
/start-task single-source-schema-types
# Reads docs/tasks/single-source-schema-types/progress-tracker.md,
# announces the remaining missions and starts immediately, running each
# in a subagent with a commit after every green mission.

/start-task
# Lists docs/tasks/ and asks which task to start.
```

## Alternative Usage
You can also use the traditional AB Method master controller:
```
/ab-master start-task
```
