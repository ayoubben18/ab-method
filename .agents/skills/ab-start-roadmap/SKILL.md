---
name: ab-start-roadmap
description: Execute a roadmap autonomously to completion — the layer above start-task. Use when a roadmap's tasks are planned and you want them run in dependency order, with independent tasks optionally in parallel. Verifies the dependency tree is planned before running; stops if a needed task has no plan. Executor only.
---

This skill runs the AB Method **start-roadmap** workflow.

Follow the workflow defined in `.ab-method/core/start-roadmap.md` exactly — it contains the dependency-tree verification gate, the parallelism-mode prompt, the topological execution loop, and the failure/resume rules.

Before doing anything, check `.ab-method/structure/index.yaml`. It defines where roadmaps and tasks are stored and how they reference each other. Paths are user-configurable; never hardcode them.

**Locating `.ab-method/`.** Every `.ab-method/...` path — here and inside the workflow files — is resolved in this order:

1. **The project root (the current working directory) first.** If `<project>/.ab-method/...` exists, use it. A project's own `.ab-method/structure/index.yaml` is how it customises its paths, so it always wins — check for it even when the bundled copy is right there.
2. **Only if the project has no such file** (AB Method installed as a plugin rather than with `npx ab-method`), read the bundled copy: `../../../.ab-method/` relative to this `SKILL.md`.

The bundled copy is read-only reference material. Every path the index or a workflow names (`docs/...`, `CONTEXT.md`, `UBIQUITOUS_LANGUAGE.md`, ...) is relative to the **project root** — never to the folder the bundled files live in. Never write inside that folder.

Key points: build the DAG from `roadmap.md`; **verify the whole dependency tree before executing** — a task is runnable only if it has a real plan (`progress-tracker.md` with missions) and its deps are `done`; if a needed dependency is unplanned, STOP and tell the user to plan it first with `ab-create-task`. No "Proceed?" prompt — it starts on invocation. Parallelism comes from the invocation: sequential by default (safe, portable), git worktrees only when explicitly asked. Each task runs by `ab-start-task` rules (subagent per mission, `tdd`, commit per green mission). On Codex the parent orchestrates **flat** — one subagent level, no agent-in-agent — because Codex's `spawn_agent` is one level deep and cannot nest (`NESTING_UNAVAILABLE`); never design a task as a subagent that spawns mission-subagents here. (Claude Code, which can nest, defaults to the nested task-subagent → mission-subagent shape for context isolation — that's the Claude path, not this one.) Update `roadmap.md` statuses as tasks complete; re-runs resume from the frontier. **Re-runnable / incremental:** a task NEEDS WORK whenever its `progress-tracker.md` has any unchecked mission, regardless of its `status:` field — so after a completed roadmap, `ab-extend-task` can add missions (reopening those tasks), and re-running executes only the tasks with new work, in dependency order, skipping finished ones. Never define or reshape tasks — this is executor only.
