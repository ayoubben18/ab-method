# AB Method

![AB Method — grill the problem, deepen the code it lands in, ship a pull request reviewed against your seams](.github/assets/cover.png)

A workflow system for Claude Code and Codex. It grills a problem into a domain-grounded plan, then either drives it through test-driven missions you review one at a time, or hands it to an autonomous `/goal` loop that runs to a verifiable stop condition.

## Install

```bash
npx ab-method
```

The installer detects `.claude/` and/or `.agents/` and installs slash commands and skills for Claude Code, Codex, or both (it asks if neither exists). It also adds `.ab-method/` (workflow definitions and the path index), `docs/` scaffolding, `AGENTS.md` for Codex, and optional subagents for Claude Code.

### Or as a plugin

Nothing is copied into your project; the plugin updates on its own.

```bash
# Claude Code
/plugin marketplace add ayoubben18/ab-method
/plugin install ab-method@ab-method

# Codex
codex plugin marketplace add ayoubben18/ab-method
codex plugin add ab-method@ab-method
```

Skills are namespaced `ab-method:<name>`: run `/ab-method:ab-create-task` (Claude Code) or `$ab-method:ab-create-task` (Codex), or describe what you want. A project's own `.ab-method/structure/index.yaml` overrides the bundled one. The plugin ships no slash commands or subagents. Don't combine it with `npx ab-method` in one project, or every workflow shows up twice.

## Commands

On Claude Code, run a workflow as a slash command. Codex has no shared slash commands, so use the matching skill (`$ab-create-task`) or describe your intent.

| Command | Purpose |
|---|---|
| `/mastermind` | Entry point: routes your intent to the right workflow |
| `/create-task` | Grill a problem into a holistic task: deepen what it touches, design new seams, composed missions |
| `/resume-task` | Continue a task from its progress tracker |
| `/start-task` | Run a task autonomously to a reviewed PR, one commit per mission (`inline` skips mission subagents) |
| `/extend-task` | Add missions to an existing task |
| `/create-task-from-handoff` | Turn a tangent parked mid-grill into a task |
| `/create-goal` | Write a prompt for an autonomous `/goal` loop |
| `/extend-goal` | Extend a goal from what its run built |
| `/create-roadmap` | Split a bigger idea into a dependency-ordered graph of tasks |
| `/start-roadmap` | Run a planned roadmap in dependency order |
| `/analyze-project` | Document domain, tech stack and patterns (`/analyze-frontend`, `/analyze-backend` for one side) |
| `/update-architecture` | Refresh architecture and domain docs |
| `/ab-cleanup` | Compact docs to budget and remove task leftovers; also the 3.x → 4.0 migration |
| `/ab-master [name]` | List workflows, or run one by name |

**Task, goal or roadmap?** A task keeps you in the loop mission by mission. A goal is one objective with a checkable stop condition, run unattended. A roadmap is several ordered tasks; it can leave open decisions and uncharted areas for later.

## How it works

1. **Always grill.** Every task and goal starts with `grill-with-docs`, which checks your terms against `UBIQUITOUS_LANGUAGE.md` and `CONTEXT.md` and records decisions as ADRs.
2. **Plan before code, holistically.** Each task scans the modules it will touch and plans the refactors that deepen them first. Every capability gets a placement (reuse, extend, extract, adopt or introduce); a large or already-solved capability is checked against open-source libraries first, and one is adopted only if it is actively maintained and fits your exact stack; a new seam is designed several ways before any code, and new UI gets a throwaway HTML prototype to pick from. Missions are composed slices, not one-layer steps.
3. **Seams are documented.** `docs/seams/` records where the app's seams live and what callers must never do. Seven defaults come from *A Philosophy of Software Design*; `analyze-project` maps them onto your code.
4. **Test what must not break.** After coding, a protect step tests through the seams and proves each test can fail. Bug fixes stay test-first (`verify: repro`).
5. **Critics on both sides.** `critique-plan` checks the plan against the domain model and the seams before coding; `review-implementation` and `sync-architecture` check the diff and the docs after; `review-pr` reviews the open PR against the seams and the coding rules. They stay silent unless there is a real problem.
6. **Measure the blast radius.** `change-map` predicts which modules a task will touch, then compares that with the real diff.
7. **Park, don't guess.** A question nobody can answer yet goes in `unresolved-questions.md` with a placeholder behind one seam (`TODO(UQ-n)`); a tangent becomes a handoff.
8. **Small docs.** Domain and architecture docs have word budgets, hold only current state, and are checked by `npx ab-method check-docs`.
9. **Parallel only when you agree.** Missions and roadmap tasks run sequentially unless you allow tagging them for parallel subagents. `/start-task <task> inline` runs every mission in the conversation instead of in subagents.

## File layout

```
.ab-method/
  core/                  Workflow definitions
  rules/                 Communication, code and docs rules for every workflow
  structure/index.yaml   Paths, outputs and doc budgets (all configurable)

UBIQUITOUS_LANGUAGE.md   Domain glossary
CONTEXT.md               Bounded-context overview

docs/
  architecture/          tech-stack.md, frontend/ and backend/ pattern topics
  adr/                   Decision records
  seams/                 Where the app's seams live (living docs)
  tasks/<task>/          progress-tracker.md, change-map.md, review.md, ...
  goals/<goal>/          goal.md + progress-tracker.md
  handoffs/              Tangents awaiting their own task
```

## Upgrading to 5.0

Existing trackers keep working: legacy `verify: test` missions and `## Test Plan` sections still run through `tdd`.

- **Map your seams.** Run `/analyze-project` and pick `[5] Seams only` to write `docs/seams/` from the code.
- **`/start-task` now ends in a pull request.** It pushes the branch, opens a draft PR, reviews it with `review-pr`, then marks it ready. It needs a git remote and an authenticated `gh`; without them it writes the PR body to `docs/tasks/<task>/pr-body.md` and reviews the branch locally.
- **`/test-mission` is gone.** Tests now come from the protect step every task runs after coding. The npx installer doesn't delete files, so remove `.ab-method/core/test-mission.md` and `.claude/commands/test-mission.md` from repos installed before 5.0.
- Coming from 3.x: run `/ab-cleanup` once to migrate `index.yaml` and split pattern docs.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for developing the plugin.
