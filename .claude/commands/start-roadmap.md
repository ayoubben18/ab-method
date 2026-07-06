# Start Roadmap

## Description
Execute a roadmap autonomously to completion — the layer above
`/start-task`. Verifies the dependency tree is planned, then runs each
task in dependency order (each task like `/start-task`), with independent
tasks optionally running in parallel. Executor only.

## Usage
```
/start-roadmap [name]
```

## Behavior
Loads and executes the start-roadmap workflow from `.ab-method/core/start-roadmap.md`.

It will:
1. **Always check `.ab-method/structure/index.yaml` first** for paths.
2. Read `roadmap.md`, build the DAG from `depends-on` edges.
3. **Dependency-tree verification gate (before anything runs):** walk from the roots down; a task is runnable only if it **has a plan** and its deps are `done`. If a needed dependency task is **unplanned**, it **stops loudly** and tells you which task to `/create-task` first. It executes the fully-planned prefix and stops cleanly where planning runs out.
4. **Starts immediately — no "Proceed?" prompt.** Parallelism comes from the invocation: **sequential by default** (dead safe), or **git worktrees** when you ask for it (true isolation + speedup for independent tasks). Then runs autonomously.
5. Execute in dependency order; each task runs by `/start-task` rules (subagent per mission, `tdd`, commit per green mission). **Runtime-adaptive shape:** on Claude Code it **nests by default** (task-subagent → mission-subagents) for per-task context isolation; on Codex it stays flat (parent → mission-subagents), since Codex can't nest subagents. Unknown runtime falls back to flat. Update `roadmap.md` statuses as tasks complete.

## Notes
- Re-runs resume from `roadmap.md` — re-verifies and continues from the frontier.
- **Incremental / extend case:** after a roadmap completes, use `/extend-task` to add missions to any task (it reopens that task in `roadmap.md`), then re-run `/start-roadmap` — it runs only the tasks that now have unchecked missions, in dependency order, and skips finished ones. A task "needs work" whenever its tracker has an unchecked mission, regardless of its `status:` flag. Common after long PRD-driven builds you want to tweak.
- Stops loudly on red (never commits broken work), exactly like `/start-task`, one level up.

## Examples
```
/start-roadmap payments
# Verifies plans, asks worktrees vs sequential, then runs the graph end to end
```
