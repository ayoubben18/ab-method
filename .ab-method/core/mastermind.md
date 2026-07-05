# Mastermind Workflow

## Purpose

The **intelligent entry point** to the AB Method. Unlike `/ab-master`
(a static menu that lists workflows), mastermind figures out what you
actually want and routes you to the right workflow — or explains how the
method fits together end to end.

Mastermind is deliberately **thin**. It does NOT reproduce the logic of
`create-task`, `create-goal`, `start-task`, or any other workflow. It
reads the source of truth, matches your intent, and hands off. When it
delegates, the target workflow owns the process from there.

## Critical Step

**ALWAYS check `.ab-method/structure/index.yaml` FIRST.** It defines
where every workflow reads from and writes to. Paths are
user-configurable; never hardcode them.

## How mastermind orients itself

Mastermind does not carry a hardcoded catalogue of what each workflow
does. It discovers them at runtime so it never drifts from reality:

1. Read `.ab-method/structure/index.yaml` for the file layout.
2. List `.ab-method/core/` to see which workflows exist.
3. Read the **first section** (Purpose / When to use) of only the
   workflow files relevant to the user's intent — not all of them.

This keeps mastermind correct even as workflows are added, renamed, or
changed. If a workflow's own file contradicts anything below, the
workflow file wins.

## Behavior

### 1. Understand intent

If the user's intent is clear from their message, skip straight to
routing. If `/mastermind` is invoked bare or the ask is vague, ask **one**
short question: *what are you trying to accomplish?* Do not dump the whole
method on them.

### 2. Route

Match intent to a workflow, then **load and run that workflow from
`.ab-method/core/<name>.md`** (Claude) or invoke the matching `ab-<name>`
skill (Codex). Do not re-explain or reimplement it here.

Common routes:

| The user wants to… | Route to |
|---|---|
| Start a focused piece of work, stay in the loop | `create-task` |
| Hand a big continuous objective to an autonomous loop | `create-goal` |
| Resume a task already in progress | `resume-task` |
| Add more work to an existing task | `extend-task` |
| Extend a goal after its loop ran | `extend-goal` |
| Run an existing task autonomously to completion | `start-task` |
| Continue a tangent that got parked mid-grill | `create-task-from-handoff` |
| Understand the codebase (arch / domain) | `analyze-project` / `analyze-frontend` / `analyze-backend` |
| Refresh architecture docs after big changes | `update-architecture` |
| Backfill tests for code written without them | `test-mission` |

### 3. Help decide: goal or task?

The most common fork. Decide it with the user, don't guess blindly:

- **`create-task`** — you want to **stay in the loop**: review each
  mission, drive red-green-refactor yourself. Bounded, focused scope
  broken into TDD missions. Pick this when the work is a single feature
  or fix you want to shepherd.
- **`create-goal`** — one continuous objective with a verifiable stop
  condition that you want to **hand off and walk away** from (migrations,
  large refactors, "make all tests pass"). Produces a `goal.md` for an
  autonomous `/goal` loop; no mission breakdown.

Rule of thumb: a goal is *bigger than one prompt but smaller than an
open-ended backlog*. If the request is genuinely several unrelated pieces
of work, that's multiple tasks — steer to `create-task` (one at a time).

### 4. Explain the method (when asked)

If the user asks how the AB Method works, give a concise end-to-end tour
grounded in the actual files, not from memory:

1. **Baseline** — `analyze-project` → UBIQ + CONTEXT + architecture docs.
2. **Sharpen** — `domain-model` grills the language, captures ADRs.
3. **Build** — `create-task` grills, then drives each mission through the
   `tdd` skill (red-green-refactor). Or `create-goal` for autonomous runs.
4. **Maintain** — `update-architecture` keeps the baseline fresh.

Keep it short. Point them at `/ab-master` for the full workflow menu.

## Principles mastermind upholds

- **Always grill before defining work** (`grill-with-docs`).
- **Every mission runs through `tdd`** (the test is the spec).
- **`progress-tracker.md` is the single source of truth** per task.
- **One task at a time** to conserve context.
- Never reimplement a workflow — delegate to it.

## Out of scope (future)

Multi-task orchestration — turning an idea into a dependency-ordered
roadmap and driving each task's implementation via subagents (respecting
inter-task dependencies and `[pp-x]` parallel groups) — is **not** part of
mastermind yet. It is being designed separately. For now, mastermind
routes and advises; it does not autonomously execute a chain of tasks.
