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

### Tasks
- **create-task** — Define a new task; always grills via `grill-with-docs`, runs every mission through the `tdd` skill
- **create-task-from-handoff** — Resume a handoff spun off mid-grill (`docs/handoffs/`) into a task; continues the grill where it left off, then runs `create-task`
- **create-goal** — Produce a ready-to-run goal prompt for an autonomous `/goal` loop; always grills via `grill-with-docs`, no mission breakdown
- **extend-goal** — Extend an existing goal, building on what the earlier `/goal` run implemented; always grills via `grill-with-docs`
- **resume-task** — Continue an existing task from its progress tracker (no mission docs to recover)
- **start-task** — Run an existing task autonomously to completion: each mission in a subagent (tdd, tracker updated per mission), a commit after every green mission
- **extend-task** — Append new missions to an existing task
- **test-mission** — Retroactive test coverage for code that wasn't written test-first

### Analysis
- **analyze-project** — Full architecture sweep: domain (UBIQ + CONTEXT) + tech-stack + FE/BE patterns
- **analyze-frontend** — Frontend patterns only
- **analyze-backend** — Backend patterns only

### Architecture
- **update-architecture** — Refresh architecture/domain docs after impactful changes

## Workflow Details

The AB Method runs in four phases:
1. **Baseline** — `/analyze-project` produces UBIQ + CONTEXT + 3 lean architecture docs
2. **Sharpen** — `/domain-model` (skill) grills the language and captures ADRs
3. **Build** — `/create-task` always grills, then drives every mission through the `tdd` skill (red-green-refactor). No mission docs.
4. **Maintain** — `/update-architecture` keeps the baseline fresh

## Examples

```
/ab-master create-task
# Always grills, then TDD-loops through each mission

/ab-master analyze-project
# Full architecture sweep, 4 agents in parallel

/ab-master resume-task
# Continues from the progress tracker
```

## Workflow Files Location
All workflow definitions are stored in `.ab-method/core/`