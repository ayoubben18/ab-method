# AB Method Master

## Description
Master controller for the AB Method - an incremental tasking workflow system that transforms problems into tasks, then into focused missions.

## Usage
```
/ab-master [workflow-name]
```

## Behavior

### When called without a workflow name:
Greets the user with:
```
Welcome to the AB Method Master Controller!

The AB Method transforms problems into tasks, then into focused missions for incremental progress.

Choose a workflow to get started:
```
Then lists all available workflows below.

### When called with a workflow name:
Loads and executes the specified workflow from `.ab-method/core/[workflow-name].md`

## Available Workflows

> **Not sure which workflow you need?** Use `/mastermind` — it reasons about
> your intent, helps you decide goal vs task, and routes you to the right
> workflow. This menu is the static list; mastermind is the smart entry point.

### Roadmaps (multi-task)
- **create-roadmap** — Turn a bigger idea into a dependency-ordered DAG of tasks; grills the decomposition once, then hands back a `/create-task` prompt per task in dep order
- **start-roadmap** — Execute a planned roadmap in dependency order; verifies plans exist first, each task runs like `start-task`, independent tasks optionally parallel (git worktrees or sequential)

### Tasks
- **create-task** — Define a new task; always grills via `grill-with-docs`, decides placement, prototypes new UI as disposable HTML, plans only the tests worth having (`verify: test` missions run through `tdd`). Roadmap-aware: planning a roadmap task auto-syncs its `roadmap.md` entry
- **create-task-from-handoff** — Resume a handoff spun off mid-grill (`docs/handoffs/`) into a task; continues the grill where it left off, then runs `create-task`
- **create-goal** — Produce a ready-to-run goal prompt for an autonomous `/goal` loop; always grills via `grill-with-docs`, no mission breakdown
- **extend-goal** — Extend an existing goal, building on what the earlier `/goal` run implemented; always grills via `grill-with-docs`
- **resume-task** — Continue an existing task from its progress tracker (no mission docs to recover)
- **start-task** — Run an existing task autonomously to completion: each mission in a subagent (tracker updated per mission), a commit after every green mission
- **extend-task** — Append new missions to an existing task
- **test-mission** — Backfill the few tests worth having for code that wasn't written test-first

### Analysis
- **analyze-project** — Full architecture sweep: domain (UBIQ + CONTEXT) + tech-stack + FE/BE pattern topics
- **analyze-frontend** — Frontend pattern topics only
- **analyze-backend** — Backend pattern topics only

### Architecture
- **update-architecture** — Refresh architecture/domain docs after impactful changes, edited in place within budget
- **ab-cleanup** — Clean up a repo already using AB Method: compact docs to budget, split pattern files, remove task leftovers, migrate 3.x → 4.0

## Workflow Details

The AB Method runs in four phases:
1. **Baseline** — `/analyze-project` produces UBIQ + CONTEXT + `tech-stack.md` + small per-topic pattern docs, all within budget
2. **Sharpen** — `/domain-model` (skill) grills the language and captures ADRs
3. **Build** — `/create-task` always grills, places the work, prototypes new UI, and plans the few tests worth having; `verify: test` missions run through `tdd`. No mission docs.
4. **Maintain** — docs are edited in place within `check-docs` budgets; `/update-architecture` refreshes them, `/ab-cleanup` compacts a repo whose docs already grew

## Examples

```
/ab-master create-task
# Always grills, then plans and runs the missions

/ab-master analyze-project
# Full architecture sweep, 4 agents in parallel

/ab-master resume-task
# Continues from the progress tracker
```

## Workflow Files Location
All workflow definitions are stored in `.ab-method/core/`