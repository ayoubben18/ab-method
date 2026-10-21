# Start Roadmap Workflow

## Purpose

Execute a **roadmap** autonomously to completion — the layer above `/start-task`. Read `roadmap.md`, verify the dependency tree is planned, then run each task in dependency order, each exactly like `/start-task` (missions in subagents, `verify:` tags honoured, a commit per mission). **Independent tasks can run concurrently.**

`/start-roadmap` is an **executor**: it never defines or reshapes tasks — that's `/create-roadmap` and `/create-task`.

## Critical Step

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** for where roadmaps and tasks live and how they reference each other. Paths are user-configurable.

Follow `.ab-method/rules/communication.md` for every message; every task run applies `.ab-method/rules/code.md` (seeded into its subagents by the `start-task` rules).

## Process

### 1. Identify the Roadmap

Use the name or path the user passed; otherwise list `docs/roadmaps/` and ask.

Read `roadmap.md`: the Objective, tasks with `depends-on` edges, each task's `plan:` and `status:`, and — when present — `## Open decisions`, `## Not yet specified`, `## Out of scope`. Build the DAG in memory.

**`status:` is a hint; the tracker is the truth.** A task needs work when its `docs/tasks/<slug>/progress-tracker.md` has **any unchecked mission** — including a `done` task reopened by `/extend-task`. All missions checked = truly done.

### 2. Dependency-Tree Verification Gate — before anything runs

This pass completes before a single task executes. Walk the DAG from the roots:

- A task is **runnable** only if it has a plan (`plan: ✅` **and** its tracker exists with missions), all its `depends-on` tasks are truly done, and **no open decision `blocks:` it**.
- The executable set is the maximal fully-planned prefix in topological order, restricted to tasks that need work.

**Stop conditions — halt loudly:**

- A live dependency is **unplanned** (`plan: ⬜`):
  ```
  Cannot start roadmap: <Name>
  Task 'charge-api' has no plan yet, and 'checkout-ui' depends on it.
  Plan it first with /create-task, then re-run /start-roadmap <Name>.
  ```
- An **open decision blocks a frontier task** — only a grilling, research or prototype session with the user can resolve it:
  ```
  Cannot start roadmap: <Name>
  Task 'refund-api' is blocked by D1 (grilling) — fixed refund window, or per-merchant?
  Resolve it first (create-roadmap.md § 2b), then re-run /start-roadmap <Name>.
  ```
  A decision that blocks nothing on the frontier is mentioned in the announcement, not a stop.
- A cycle, or a `depends-on` naming a task not in the roadmap — the roadmap is malformed.

**Fog is never a stop condition**, and the run **never graduates fog, adds tasks, or edits `## Out of scope`** — that's a planning act. When a finished task clearly sharpens a fog patch, report it as a *candidate*.

A partly planned tree is fine: run the planned prefix and stop cleanly where planning runs out.

### 3. Announce the Run — then start immediately

The invocation is the consent; no "Proceed?".

**Parallelism comes from the invocation:**
- **Sequential (default)** — independent tasks run one at a time. No git collisions.
- **Worktrees (opt-in)** — only when invoked that way (`/start-roadmap <name> worktrees`, or the user asks for parallel): each independent task in its own git worktree, merged back. Never switch on your own.

```
Starting roadmap: <Name>   (mode: sequential | worktrees)
Executable now: task-a → (task-b ∥ task-c) → task-d
Not yet planned (will stop before): task-e
Open questions (building on placeholders): checkout-ui UQ-1 currencies → USD only
Running now — commit per mission, no prompts unless red.
```

Set the roadmap **Status** to `In dev` and go to Step 4.

### 4. Execute in Dependency Order

A task is eligible the moment all its `depends-on` tasks are `done`.

#### Execution shape — nested on Claude, flat on Codex

- **Claude Code — nest by default.** Each eligible task runs in its own **task-subagent** that runs the `start-task` loop and spawns the **mission-subagents**: `roadmap → task-agent → mission-agents`. This keeps the orchestrator's context lean — each task's churn lives in its own window. Go flat only for a trivially small roadmap.
- **Codex — flat.** `spawn_agent` is one level deep (`NESTING_UNAVAILABLE`), so the parent runs each task's loop and spawns mission-subagents directly.
- Unknown runtime → flat; it works on both.

**For each eligible task:**
- Set its `status:` to `in-dev` in `roadmap.md`.
- Run its remaining missions per `.ab-method/core/start-task.md`: one subagent per mission, `verify: test` missions under `tdd`, `verify: build` missions with no new test, `[pp-x]` groups honoured, tracker updated per mission, a commit after every green mission, the full suite once at the end of the task. **Never run `prototype-ui`** — UI missions build to the tracker's `## UI Spec` if present.
- On green completion, set `status:` to `done` and check off its line.

**Inherited per task from `start-task`** (nothing extra to wire; critic subagents follow the same nesting rule as mission subagents):
- **Unresolved questions** — black boxes are built as recorded; the run never stops for them and no subagent answers one. The orchestrator surfaces every open UQ in the announcement and again, with seam paths, in the final report. A `⚠️ UQ-n` with no entry is a planning gap: stop before that task.
- **`review-implementation`** (autonomous) — safe fixes applied, everything in that task's `review.md`.
- **`sync-architecture`** (autonomous) — in-place doc edits that pass `check-docs`, committed as `docs(<task>): sync architecture docs`; anything over budget or needing judgment is deferred to `review.md`.
- **`change-map`** actual pass — `## Actual` + `## Drift` per task. The orchestrator owes one thing the task level can't see: collect the **unplanned modules across every task** and report them together. Several tasks reaching the same unmapped module is a locality finding for `/improve-codebase-architecture` (or `/domain-model` if it crosses a bounded context). Report it; reshape nothing.
- **`prototype/` cleanup** — each task deletes its disposable `prototype/` folder on completion.

#### Running independent tasks concurrently

- **Sequential:** eligible tasks one after another in topological order.
- **Worktrees:** one worktree per independent eligible task (a task-subagent per worktree on Claude; parent-driven on Codex). Merge each back in turn, running the full suite after each merge as the integration check. An unclean merge stops the run (§ 6). No worktree support → sequential, and say so.

No prompts between tasks. A **reopened** task runs only its unchecked missions; its finished missions and commits stay untouched. When its tracker is fully checked again, set `status:` back to `done`.

### 4b. Re-running After Extension

`/start-roadmap` is re-runnable. After `/extend-task` reopens tasks, a re-run:
1. Re-runs the verification gate.
2. Finds every task with unchecked missions, including reopened ones.
3. Executes them in dependency order — an extended upstream task's new missions run before an extended downstream task's.
4. Skips tasks that are genuinely done.

Extending a task does not reopen its dependents; extend them too if they're affected.

### 5. On Full Completion

Set the roadmap **Status** to `Completed`. Report:

```
Roadmap completed: <Name>
Tasks: task-a, (task-b ∥ task-c), task-d — <n> commits
Tests: <command> green
Reviews: task-b/review.md — 2 open; task-d/review.md — 1 open
Cross-task drift: platform/audit reached by task-b, task-c, task-d (unplanned)
Still uncharted: fog "refund flow" likely sharpened by charge-api → /create-roadmap
```

Omit empty lines. Uncharted fog and open decisions are **candidates, not changes** — graduating them is the user's next planning session.

Stopped at an unplanned frontier:
```
Roadmap partially executed: <Name>
Done: task-a, task-b, task-c
Blocked: task-d needs task-e planned first → /create-task, then /start-roadmap <Name>
```

### 6. On Failure — Stop Loudly

- A red mission stops its task and therefore the roadmap. Never commit red work; never start a downstream task on a broken dependency.
- An unmergeable worktree stops the run; leave it for inspection.
- Completed tasks' commits are safe; `roadmap.md` keeps the truth.
- Report which task, which mission, and the failing output. The user fixes or re-plans, then re-runs `/start-roadmap`.

## Key Principles

- **Verify before you run** — the whole gate passes before any task executes
- **Starts on invocation**; parallelism comes from the invocation, sequential by default
- **Executor, not producer** — never reshapes tasks or the map; reports candidates
- **An open decision blocks its tasks; fog blocks nothing**
- **Each task runs by `start-task` rules** — tests only where its Test Plan put them, full suite once per task, review + sync + change map per task
- **Drift is collected across the roadmap**
- **Nested on Claude, flat on Codex**
- **`roadmap.md` is the single source of truth** — re-runs resume from it

## Remember

- Check `.ab-method/structure/index.yaml` for paths and the `relationships` map
- Confirm each runnable task's tracker truly exists — don't trust `plan: ✅` alone
- Stopped runs resume with `/start-roadmap` again
- Follow the repo's commit conventions (`git log --oneline` first)
