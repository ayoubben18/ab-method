# Start Roadmap Workflow

## Purpose

Execute a **roadmap** autonomously to completion — the layer above
`/start-task`. Reads `roadmap.md`, verifies the dependency tree is
planned, then runs each task in dependency order. Each task executes
exactly like `/start-task` (its missions in subagents under `tdd`, a
commit per mission), and **independent tasks can run concurrently**.

`/start-roadmap` is an **executor** workflow (like `/start-task` and
`/goal`). It does not define or reshape tasks — that's `/create-roadmap`
and `/create-task`. It runs what's already planned.

## Critical Step

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where
roadmaps and tasks are stored and how they reference each other. Paths
are user-configurable.

## Process

### 1. Identify the Roadmap

- If the user passed a roadmap name or a path to its `roadmap.md`, use it.
- Otherwise list folders under `docs/roadmaps/` and ask which to start.

Read `roadmap.md`: the Objective, the task list with `depends-on` edges,
and each task's `plan:` and `status:` fields. Build the DAG in memory.

**`status:` is a hint; the tracker is the truth.** A task truly "needs
work" when its `docs/tasks/<slug>/progress-tracker.md` has **any
unchecked mission**, regardless of its roadmap `status:`. This matters for
re-runs: a task marked `done` that was later extended (new missions added
by `/extend-task`) has unchecked missions again — it's **reopened** and
must run. Treat `status: done` + all-missions-checked as truly done;
anything with unchecked missions is pending work. (`/extend-task` flips a
reopened task's `status:` back to `pending`, but always confirm against
the tracker rather than trusting the flag.)

### 2. Dependency-Tree Verification Gate — BEFORE anything runs

**This whole pass runs to completion before a single task executes.** Its
job: prove the part of the graph you're about to run is fully planned.

Determine the **executable frontier** by walking the DAG from the roots
down:

- A task is **runnable** only if it **has a plan** (`plan: ✅ planned` —
  confirm its `docs/tasks/<slug>/progress-tracker.md` actually exists with
  missions) **and** all of its `depends-on` tasks are truly done (no
  unchecked missions in their trackers).
- A task **needs work** if its tracker has any unchecked mission — whether
  it's a never-run task or a `done` task reopened by `/extend-task`.
  Already-done tasks with everything checked are skipped.
- Walk down the tree through planned tasks as far as you can. The
  executable set is the maximal fully-planned prefix in topological order,
  restricted to tasks that need work.

**Stop conditions — halt loudly, never plough on:**

- If a task that something depends on is **unplanned** (`plan: ⬜`) — a
  live dependency with no `/create-task` plan — **STOP before executing
  anything**. Name the exact task and tell the user to plan it first:

  ```
  Cannot start roadmap: <Name>

  Task 'charge-api' has no plan yet, and 'checkout-ui' depends on it.
  Plan it first:

    /create-task  (for charge-api — it belongs to roadmap <Name>)

  Then re-run /start-roadmap <Name>.
  ```

- If the graph has a cycle, or a `depends-on` names a task not in the
  roadmap, stop and report it — the roadmap is malformed.

Only when the verification pass succeeds (every task on the executable
frontier is planned and its deps are satisfiable) do you continue. If
only part of the tree is planned, that's fine — you execute the planned
prefix and stop cleanly where planning runs out, reporting what remains.

### 3. Announce the Run — then start immediately, no confirmation

Like `/start-task`, `/start-roadmap` does **not** ask "Proceed?" — the
invocation is the consent. It announces the plan and begins in the same
turn.

**Parallelism mode is chosen by the invocation, not by a prompt:**
- **Default = sequential.** Independent tasks run one at a time. Dead
  safe, no git collisions. This is what runs unless the user opted into
  worktrees.
- **Worktrees = opt-in.** Only when the user invokes it that way (e.g.
  `/start-roadmap <name> worktrees`, or asks for parallel/worktrees in
  the request) do independent tasks run concurrently, each in its own git
  worktree, merged back. Never switch to worktrees on your own — parallel
  commits to one tree are the hard part, so it stays explicit.

Announce what will happen, then proceed straight into Step 4:

```
Starting roadmap: <Name>   (mode: sequential | worktrees)
Executable now (in dependency order):
  task-a → (task-b ∥ task-c) → task-d
Not yet planned (will stop before): task-e

Running autonomously now — commit per mission, no prompts unless red.
```

Set the roadmap **Status** to `In dev` and continue — do not wait for a
reply. (The only thing that can stop a run before it starts is the Step 2
verification gate: a needed-but-unplanned dependency.)

### 4. Execute in Dependency Order

Walk the DAG topologically. A task becomes eligible the moment all its
`depends-on` tasks are `done`.

#### Execution shape — nested on Claude by default, flat on Codex

The number of subagent levels is decided by the runtime, because the two
differ in a hard way (verified empirically):

- **Claude Code** — nested subagents work: a subagent can spawn its own.
- **Codex** — nesting is **unavailable**: `multi_agent_v1.spawn_agent` is
  one level deep; a subagent cannot spawn another (`NESTING_UNAVAILABLE`).

Pick the shape by runtime:

- **On Claude Code — NEST BY DEFAULT.** Wrap each eligible task in its own
  **task-subagent** that runs that task's mission loop and spawns the
  **mission-subagents** inside it: `roadmap → task-agent → mission-agents`.
  This is the fractal shape realized, and its point is **per-task context
  isolation** — the parent orchestrator's context stays lean no matter how
  big the roadmap, because each task's mission churn lives in its own
  window. The task-subagent updates its `progress-tracker.md`, runs the
  `start-task` loop (tdd, commit per mission), and returns a tight summary;
  the parent only tracks `roadmap.md` status and commits/merges. Drop to
  the flat shape only for a trivially small roadmap where a task layer is
  pure overhead.
- **On Codex — FLAT (only what works).** The parent `/start-roadmap` run
  holds the mission loop and spawns each task's **mission-subagents
  directly** — one subagent level, never a task-subagent-that-spawns-
  subagents. Task-level structure is bookkeeping in `roadmap.md`, not an
  extra agent layer.

If you genuinely can't tell which runtime you're on, **fall back to
flat** — it runs correctly on both. But on Claude Code the default is
nested.

**For each eligible task (either shape):**
- Set its `status:` to `in-dev` in `roadmap.md`.
- Run its missions per `.ab-method/core/start-task.md` — each mission in a
  subagent under `tdd`, the mission's own `[pp-x]` groups honored, the
  task's `progress-tracker.md` updated per mission, a commit after every
  green mission. **Who runs this loop is the only difference between the
  shapes:** on Claude (nested) it's the task-subagent; on Codex (flat)
  it's the parent directly. The mission subagents are the same either way.
- On green completion, set `status:` to `done` in `roadmap.md` and check
  off its line.

**Post-implementation review is inherited per task.** Because each task
runs by `start-task` rules, its Step 5b runs the `review-implementation`
skill on that task's diff — three read-only critics
(`cleaner-architecture`, `slop-defender`, `reusability-inspector`), safe
fixes auto-applied and everything written to that task's
`docs/tasks/<slug>/review.md`. The review's critic subagents follow the
**same nesting rule as the mission subagents**: on **Claude** the
task-subagent spawns them (nested); on **Codex** the parent spawns them
at its own level (flat). Nothing extra to wire here — it comes for free
with running each task as a `start-task`. The roadmap orchestrator only
collects the resulting `review.md` locations for the final report.

#### Running independent tasks concurrently

- **Sequential mode (default):** run eligible tasks one after another in
  topological order. Simplest, always safe, portable everywhere.
- **Worktrees mode (opt-in):** give each independent, eligible task its
  own git worktree. On **Claude** you may run a task-subagent per worktree
  (which nests its mission-subagents); on **Codex** the parent drives each
  worktree's mission-subagents directly (flat — no nesting). Either way,
  when tasks finish green, merge each worktree back in turn, running the
  test suite after each merge as the integration check. A merge that can't
  go clean → stop (§ 6). On a runtime without worktree support, fall back
  to sequential and say so.

**Between tasks:** no user prompts — the run is autonomous from
invocation, exactly like `/start-task`.

For a **reopened** task (extended after it was done), execute **only its
unchecked missions** — `start-task` already runs "remaining missions," so
completed ones are left alone. Its already-done missions and their commits
stay untouched; only the new missions produce new commits. When its
tracker is fully checked again, set `status:` back to `done`.

### 4b. Re-running After Extension — the incremental case

`/start-roadmap` is **re-runnable**, and this is a first-class use case:
a big roadmap (often generated from a PRD) runs for hours to completion,
then you tweak it — `/extend-task` adds a few missions to one or more
tasks. Those tasks reopen (`status: done → pending`, new unchecked
missions). Re-running `/start-roadmap <name>` then:

1. Re-runs the **verification gate** — same rules; the graph must still be
   coherent and any live dependency still planned.
2. Finds every task that **needs work** (unchecked missions), including
   reopened ones.
3. Executes them **in dependency order down the line** — if an extended
   upstream task and an extended downstream task both have new missions,
   the upstream one's new missions run first, respecting the same DAG.
4. Skips tasks that are genuinely done (all missions checked), so it never
   redoes finished work.

This means the whole roadmap-level dependency discipline applies to
follow-up tweaks exactly as it did to the first build. Extend the tasks
you want to change, re-run `/start-roadmap`, and the increment lands in
the right order with the same commit-per-mission trail. (Extending a task
does not auto-reopen its dependents; if a tweak changes what a downstream
task needs, extend that one too and the re-run orders both correctly.)

### 5. On Full Completion

Set the roadmap **Status** to `Completed`. Report:

```
Roadmap completed: <Name>
Tasks run: task-a, (task-b ∥ task-c), task-d
Commits: <n> across <m> tasks
Tests: <command> green
Reviews: docs/tasks/<slug>/review.md per task — <total> safe fixes applied, <total> open for you
```

List each task's `review.md` with its open-finding count so the afk user
can jump straight to the ones that want their judgment.

If execution stopped at an unplanned frontier rather than finishing,
report what ran and what still needs planning:

```
Roadmap partially executed: <Name>
Done: task-a, task-b, task-c
Blocked: task-d needs task-e planned first
Next: plan task-e (/create-task), then /start-roadmap <Name> again
```

### 6. On Failure — Stop Loudly, Never Plough On

Same discipline as `/start-task`, one level up:

- A task's mission going red stops that task (per `start-task` rules) and
  therefore stops the roadmap. Never commit red work; never start a
  downstream task on a broken dependency.
- In worktrees mode, an unmergeable worktree stops the run — leave it for
  inspection.
- Completed tasks' commits are already safe. `roadmap.md` keeps the truth:
  `done` tasks are checked off, the failed/blocked one is not.
- Report precisely: which task, which mission, the failing output. The
  user fixes or re-plans, then re-runs `/start-roadmap` — it re-verifies
  and resumes from the frontier.

## Key Principles

- **Verify before you run** — the whole dependency-tree gate passes
  before any task executes; a needed-but-unplanned task halts the run
- **No confirmation — starts on invocation** — announces the plan and
  begins immediately; the only pre-run stop is the verification gate.
  Parallelism mode comes from the invocation (sequential by default,
  worktrees only when explicitly asked), not from a prompt
- **Executor, not producer** — never define or reshape tasks; run what
  `/create-roadmap` + `/create-task` planned
- **Each task runs by `start-task` rules** — same subagent-per-mission,
  tdd, commit trail, and post-implementation `review-implementation` pass
  (safe fixes applied, `review.md` written per task)
- **Execution shape is runtime-adaptive** — on **Claude Code, nest by
  default** (task-subagent → mission-subagents) for per-task context
  isolation; on **Codex** stay flat (parent → mission-subagents) because
  `spawn_agent` is one level deep (`NESTING_UNAVAILABLE`). If the runtime
  is unknown, fall back to flat — it works on both
- **Parallel isolation is the user's call** — worktrees for real
  concurrency, sequential for zero git risk
- **`roadmap.md` is the single source of truth** — plan state and
  execution state live there; re-runs resume from it

## Remember

- Check `.ab-method/structure/index.yaml` for paths and the
  `relationships` map
- Confirm each runnable task's `progress-tracker.md` truly exists — don't
  trust the `plan: ✅` flag alone
- Stopped or partial runs resume with `/start-roadmap` again — the
  roadmap carries everything forward
- Follow the repo's commit conventions (`git log --oneline` first)
