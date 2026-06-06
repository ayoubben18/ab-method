# Start Task Workflow

## Purpose

Run an existing task **autonomously to completion** — `/resume-task` with the `/goal` philosophy. Reads the task's `progress-tracker.md`, confirms the plan once, then executes every remaining mission without prompting in between: each mission runs in a **subagent** that follows the `tdd` discipline and **updates the progress tracker itself** when done; the parent verifies the work and **commits after every finished mission**.

Use this when the task is already well-defined (it was grilled at creation) and you want to hand execution off and walk away — the task-shaped counterpart of pasting a `goal.md` into `/goal`.

## When to use this instead of `/resume-task`

- **`/start-task`** — the remaining missions are concrete, you trust the roadmap, and you want them executed end-to-end with a commit trail. You review commits, not missions.
- **`/resume-task`** — you want to stay in the loop and review each mission before moving on.

## Critical Step

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where task documents are stored. Paths are user-configurable.

## Process

### 1. Identify the Task

- If the user passed a task name or a path to its `progress-tracker.md`, use that.
- Otherwise list folders under `docs/tasks/` and ask which task to start.

### 2. Read the Progress Tracker

Open `docs/tasks/<task>/progress-tracker.md`. From it, identify:
- Task status and which missions are completed (with their technical summaries)
- The remaining missions, in order, including any `[pp-x]` parallel-group tags
- Constraints/notes from the original grill-with-docs session

**Vagueness gate**: an autonomous run cannot stop to ask questions. If any remaining mission's one-line description is too vague to execute without judgment calls, say so now and grill it (`grill-with-docs`) **before** the run starts — never mid-run.

### 3. Confirm the Run — ONCE, upfront

This is the only prompt in the whole workflow. Show the plan and get explicit consent — it covers every commit the run will make:

```
Starting: <Task Name>

Remaining missions:
[ ] Mission 3: [Name]
[ ] Mission 4: [Name] [pp-1]
[ ] Mission 5: [Name] [pp-1]
[ ] Mission 6: [Name]

This will run autonomously:
- each mission in a subagent (tdd discipline, updates the tracker itself)
- test suite verified after each mission
- one commit per mission (one per [pp-x] group)
- no further prompts unless something goes red

Proceed?
```

On confirmation, set the task status to `In dev`.

### 4. Load the `tdd` Skill — STEP ZERO

Invoke `Skill("tdd")` in the parent context before any mission work. Subagents do the implementing, but you need the playbook loaded to evaluate the summaries they return.

Also read once, for context you'll seed every subagent with (paths from `.ab-method/structure/index.yaml`): `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md`, `docs/architecture/tech-stack.md` (incl. Testing section — you need the test command for the feedback loop), the patterns docs the task touches, `docs/adr/`. Check `git log --oneline` for the repo's commit message conventions.

### 5. The Loop — Execute Remaining Missions

Walk the remaining missions top to bottom. No user prompts between missions.

#### Sequential mission (untagged)

Spawn **one subagent** for the mission. Its prompt must include:

- The mission's one-line objective plus the relevant constraints/notes from the tracker
- The instruction to follow the `tdd` red-green-refactor discipline: failing test first, smallest change to green, refactor
- Which architecture/domain docs to read (paths from `.ab-method/structure/index.yaml`) and the prior mission summaries from the tracker
- The instruction to **update `progress-tracker.md` itself on completion**: check off its mission line and append the technical summary (same format as `create-task.md` § 9.6 — Files / Built / Tests / Patterns / Integrates with / Gotchas, skip empty bullets)
- To return a tight technical summary as its final message

#### Parallel group (`[pp-x]`)

Follow **Parallel group execution** in `create-task.md` § 9 — all uncompleted missions sharing the tag, one subagent each, spawned in a single message, disjoint files — with **one exception**: group siblings must **NOT** write to `progress-tracker.md` (concurrent writes to the same file conflict). They write detailed output to `docs/tasks/<task>/sub-agents-outputs/mission-N-<slug>.md` and return summaries; the **parent** checks off the group's missions and appends their summaries after all return.

#### After each mission (or group) — verify, then commit

1. **Verify**: run the test suite (command from `tech-stack.md` Testing section) at the parent level. For groups this is also the merge check.
2. **Red is a stop sign**: if tests fail, fix forward in the parent context. If you cannot get green, **stop the run** — do not commit broken work, do not start the next mission. Leave the working tree as is and report exactly where and why it stopped (§ 7).
3. **Commit**: stage the mission's changes plus the tracker update and commit, following the repo's existing message conventions. Reference the mission, e.g.:
   - `feat(<task-name>): mission 3 — <one-line description>`
   - `feat(<task-name>): missions 4-5 [pp-1] — <short group description>`
   One commit per sequential mission; one commit per parallel group.

Then move straight to the next mission.

### 6. On Full Completion

Set the task status to `Completed` in the tracker (include it in the final mission's commit, or a final `chore` commit if needed). Report:

```
Task completed: <Task Name>
Missions run: 3, 4-5 [pp-1], 6
Commits: <n> (<short hashes>)
Tests: <command> green
```

### 7. On Failure — Stop Loudly, Never Plough On

If a mission subagent fails, tests stay red, or a merge conflict can't be resolved cleanly:

- Stop the run immediately. **Never commit red work** and never start the next mission on top of a broken state.
- Leave the working tree for inspection; completed missions' commits are already safe.
- Report precisely: which mission, what failed (with the failing output), what was attempted.
- The tracker keeps the truth: finished missions are checked off with summaries; the failed one stays unchecked. The user fixes or re-grills, then re-runs `/start-task` (or drops to `/resume-task` to finish interactively).

## Key Principles

- **One confirmation, then autonomous** — the upfront confirmation covers all commits; no prompting between missions
- **Executor, not producer** — `/start-task` does not define or reshape missions; that's `/create-task` and `/extend-task`. The vagueness gate is the only place grilling happens, and only before the run
- **Every mission in a subagent** — the subagent runs tdd and updates the tracker itself; the parent verifies and commits
- **Commit after each mission** — green tests are the gate; one commit per mission, one per `[pp-x]` group
- **Red stops the run** — exactly like a `/goal` feedback loop: a failing check takes priority over progress
- **Tracker is the single source of truth** — same as every task workflow; subagent updates for sequential missions, parent updates for parallel groups

## Remember

- Check `.ab-method/structure/index.yaml` for paths
- `Skill("tdd")` in the parent first, every run
- Seed each subagent with: docs paths, prior mission summaries, constraints, the tracker-update instruction, and the disjoint-files boundary for groups
- Parallel group siblings never touch the tracker — the parent merges their summaries
- Follow the repo's commit conventions (`git log --oneline` before the first commit)
- Stopped runs resume with `/start-task` again — the tracker carries everything forward
