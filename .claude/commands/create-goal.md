# Create Goal

## Description
Produce a ready-to-run goal prompt for an autonomous `/goal` loop (Claude Code or Codex), using the AB Method's grilling + domain-grounding workflow.

## Usage
```
/create-goal
```

## Behavior
Loads and executes the create-goal workflow from `.ab-method/core/create-goal.md`

This workflow will:
1. **Always invoke `grill-with-docs`** to interview the user and pin down the objective, a *verifiable* measurable end state, the feedback loops that steer the loop, and constraints (no skip)
2. Read UBIQ + CONTEXT + tech-stack + patterns + ADRs to ground the goal in canonical terms
3. Write `docs/goals/<goal-name>/goal.md` — the prompt you paste into `/goal`
4. Write `docs/goals/<goal-name>/progress-tracker.md` — an empty notes log the loop fills as it runs
5. Stop. `/create-goal` produces the files; the `/goal` loop does the work

## `/create-goal` vs `/create-task`
- **`/create-goal`** — one continuous objective with a verifiable stop condition, handed to an autonomous loop you walk away from
- **`/create-task`** — broken into missions you review and run through `tdd` yourself, one at a time

## Workflow Details
- **Always grill** — `grill-with-docs` runs on every invocation
- **Verifiable end state required** — if "done" can't be checked by a command, the workflow keeps grilling or recommends `/create-task`
- **Feedback loops steer the run** — the grill captures the checks (tests, type-check, build, visual checks) the `/goal` loop runs every iteration to self-correct
- **The loop is told about the tracker** — `goal.md` explicitly instructs the `/goal` loop to maintain `progress-tracker.md`, logging only important discovered facts (no generic narration)
- **References docs, doesn't inline them** — the loop reads UBIQ/CONTEXT/architecture in-repo

## Examples
```
/create-goal
# Starts interactive goal creation
# Grills for objective, measurable end state, feedback loops, constraints
# Outputs docs/goals/<goal-name>/goal.md ready to paste into /goal
```

## Alternative Usage
```
/ab-master create-goal
```
