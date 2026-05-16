# AB Method

A workflow system for Claude Code and Codex. It grills a problem into a domain-grounded plan, then either drives it through test-driven missions you review one at a time, or hands it to an autonomous `/goal` loop that runs to a verifiable stop condition.

## Installation

```bash
npx ab-method
```

The installer detects your environment and installs accordingly:

| Detected        | Result                                                  |
|-----------------|---------------------------------------------------------|
| `.claude/` only | Slash commands + skills under `.claude/`                |
| `.agents/` only | Skills under `.agents/skills/` (Codex layout)           |
| Both            | Both targets receive the right files                    |
| Neither         | Asks which to install (default: both)                   |

It also installs in every case:

- `.ab-method/` — workflow definitions and the structure index
- `docs/architecture/` and `docs/tasks/` — output scaffolding
- Helper skills: `grill-with-docs`, `grill-me`, `tdd`, `domain-model`, `ubiquitous-language`, `improve-codebase-architecture`, `request-refactor-plan`, `to-issues`, `to-prd`, `write-a-skill`
- Workflow skills: `ab-create-task`, `ab-create-goal`, `ab-analyze-project`, and one per workflow
- Slash commands (Claude only): `/ab-master` plus one per workflow
- `AGENTS.md` (Codex only): orients Codex and lists the workflow skills
- Optional built-in subagents (Claude only, prompted)

Skills are copied as real files, not symlinks — portable across OS and CI.

## Claude Code vs Codex

The workflows are identical; only the trigger differs.

- **Claude Code** — run a workflow with its slash command: `/create-task`, `/create-goal`, `/analyze-project`, etc.
- **Codex** — Codex has no repo-shared slash commands, so each workflow ships as an `ab-*` skill. Invoke one explicitly with `/skills` or `$ab-create-task`, or just describe your intent and Codex matches the skill by its description. `AGENTS.md` tells Codex the rest.

Both read the same `.ab-method/core/*.md` definitions and the same `.ab-method/structure/index.yaml`.

## Commands

| Command               | Purpose                                                                 |
|-----------------------|-------------------------------------------------------------------------|
| `/create-task`        | Define a task; always grills, runs every mission through `tdd`          |
| `/create-goal`        | Produce a ready-to-run prompt for an autonomous `/goal` loop            |
| `/extend-goal`        | Extend an existing goal, building on what the `/goal` run implemented   |
| `/resume-task`        | Continue an existing task from its progress tracker                     |
| `/extend-task`        | Append new missions to an existing task                                 |
| `/test-mission`       | Retroactive test coverage for code not written test-first               |
| `/analyze-project`    | Full architecture sweep — domain + tech-stack + FE/BE patterns          |
| `/analyze-frontend`   | Frontend patterns only                                                  |
| `/analyze-backend`    | Backend patterns only                                                   |
| `/update-architecture`| Refresh architecture and domain docs after impactful changes            |
| `/ab-master [name]`   | Master controller — lists workflows, or runs the named one              |

## Core principles

1. Always grill — `/create-task` and `/create-goal` invoke `grill-with-docs` on every run, no skip.
2. Always TDD — every mission runs red-green-refactor through the `tdd` skill; the test is the spec.
3. No mission docs — missions are one-line entries in `progress-tracker.md`; tight summaries on completion.
4. One task at a time — focus, conserve context.
5. Backend-first for full-stack tasks — types feed the frontend.

`grill-with-docs` reads `UBIQUITOUS_LANGUAGE.md` and `CONTEXT.md`, challenges terminology against them, and updates `CONTEXT.md` and `docs/adr/` inline as decisions crystallise.

## Task vs Goal

- `/create-task` breaks work into missions you review and run through `tdd` yourself, one at a time. Use when you want to stay in the loop.
- `/create-goal` does the same grilling and doc-grounding, but emits a single `goal.md` prompt for an autonomous `/goal` loop (Claude Code or Codex) plus a `progress-tracker.md` the loop maintains. Use for one continuous objective with a verifiable stop condition.

## Workflow phases

1. Baseline — `/analyze-project` produces `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md`, and three lean architecture docs.
2. Sharpen — the `domain-model` skill grills the domain language and captures ADRs.
3. Build — `/create-task` or `/create-goal` grills, then either TDD-loops missions or hands off a goal prompt.
4. Maintain — `/update-architecture` keeps the baseline fresh.

## File layout

```
.claude/commands/        Slash commands (one per workflow)
.ab-method/
  core/                  Workflow definitions
  structure/index.yaml   Configurable paths and outputs

UBIQUITOUS_LANGUAGE.md   Domain glossary
CONTEXT.md               Bounded-context overview
                         (or CONTEXT-MAP.md + per-context files)

docs/
  architecture/          tech-stack.md, frontend-patterns.md, backend-patterns.md
  adr/                   Decision records, created lazily by /domain-model
  tasks/<task-name>/     progress-tracker.md (single source of truth)
  goals/<goal-name>/     goal.md + progress-tracker.md
```

## Configuration

All paths are configurable in `.ab-method/structure/index.yaml`. Every workflow checks this file first to know where to read from and write to. `workflow_outputs` maps each workflow to its output destinations.

## Examples

```bash
/create-task
# Grills (problem, scope, behavior, constraints, anchors), reads the
# domain + architecture docs, writes a slim progress-tracker.md with
# all missions, then runs each mission through the tdd skill.

/create-goal
# Grills the same way, then writes docs/goals/<name>/goal.md — paste
# its contents into /goal to run the objective autonomously.

/resume-task
# Reads progress-tracker.md, loads context, continues the next mission.
```
