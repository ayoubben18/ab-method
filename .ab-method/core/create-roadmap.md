# Create Roadmap Workflow

## Purpose

Turn a larger **idea** into a dependency-ordered **roadmap of tasks** —
the layer above `/create-task`. Where a task decomposes into missions,
a roadmap decomposes into *tasks* with explicit dependencies between
them. Independent tasks can later run concurrently; dependent ones wait.

`/create-roadmap` is a **producer** workflow (like `/create-task` and
`/create-goal`). It grills the idea once to draw the task graph, writes
`roadmap.md`, and then hands you the per-task planning prompts. It does
**not** execute anything — `/start-roadmap` does that once the tasks are
planned.

This is the fractal shape of the AB Method:

```
roadmap ──► tasks   (roadmap.md; depends-on edges; independent tasks parallelize)
task    ──► missions (progress-tracker.md; [pp-x] groups; untagged = barrier)
```

## When to use this instead of `/create-task`

- **`/create-roadmap`** — the work is several distinct tasks with real
  ordering between them (a schema before the API that uses it, an API
  before the UI that calls it). You want the whole graph drawn before
  committing to implementation.
- **`/create-task`** — the work is a single focused task. If it's really
  one task, use `create-task` directly; don't wrap one task in a roadmap.
- **`/create-goal`** — one continuous objective for an autonomous loop,
  not a graph of discrete tasks.

## Critical Step

**ALWAYS check `.ab-method/structure/index.yaml` FIRST.** It defines
where roadmaps and tasks are stored and how they reference each other
(the `relationships` section). Paths are user-configurable; never
hardcode them.

## Process

### 1. Grill the Idea — ONCE — to draw the task graph

Invoke the `grill-with-docs` skill, but aimed at **decomposition**, not
at the internals of any single task. The goal of this grill is to answer:

- What are the discrete tasks? Each should be independently plannable and
  shippable — a natural `/create-task` unit, not a whole epic and not a
  single mission.
- What are the **seams** between them? Where does one task hand types,
  data, or endpoints to another?
- What **depends on** what? Draw the edges. A depends-on B means B must be
  done before A can run.
- Which tasks are **independent** (share no edge, touch disjoint areas)?
  Those are the parallelization candidates at execution time.

Read `UBIQUITOUS_LANGUAGE.md` / `CONTEXT.md` so task slugs and scopes use
canonical domain terms. This is the only grill that happens in the main
session — per-task grilling happens later, in isolation (Step 3).

Keep tasks coarse here: one line of scope each. Do **not** define missions
now — that's each task's own `/create-task` grill.

### 2. Write the Roadmap

Based on `.ab-method/structure/index.yaml`, create
`docs/roadmaps/<name>/roadmap.md`. This file is the **roadmap-level
single source of truth** — the counterpart of `progress-tracker.md` one
level up.

```markdown
# Roadmap: [Name]

**Created**: YYYY-MM-DD
**Status**: Planning

## Objective
[1–3 sentences from the decomposition grill: what this whole roadmap
delivers.]

## Tasks
- [ ] **task-slug-a** — one-line scope
      depends-on: []
      plan: ⬜ unplanned      status: pending
- [ ] **task-slug-b** — one-line scope
      depends-on: [task-slug-a]
      plan: ⬜ unplanned      status: pending
- [ ] **task-slug-c** — one-line scope
      depends-on: [task-slug-a]
      plan: ⬜ unplanned      status: pending
- [ ] **task-slug-d** — one-line scope
      depends-on: [task-slug-b, task-slug-c]
      plan: ⬜ unplanned      status: pending
```

Rules for the graph:
- `depends-on: []` = a root; nothing blocks it.
- Two tasks with the same (or non-overlapping) dependencies and no edge
  between them are **independent** → parallelizable at execution.
- The graph must be a DAG — no cycles. If two tasks depend on each other,
  they're really one task; merge them.
- `plan:` tracks whether the task has a real `/create-task` plan yet
  (`⬜ unplanned` → `✅ planned`). `status:` tracks execution
  (`pending` → `in-dev` → `done`).

Set the roadmap **Status** flow: `Planning → Ready → In dev → Completed`.
It becomes `Ready` once every task is `✅ planned`.

### 2.5 Pre-implementation Critique — invoke the `critique-plan` skill on the DAG

With the `roadmap.md` draft written, run the **task graph** past the domain model before handing off
per-task planning. **Invoke the `critique-plan` skill** — it spins up a read-only domain critic that
challenges the *decomposition* (not any single task's internals) against `UBIQUITOUS_LANGUAGE.md`,
`CONTEXT.md`, and ADRs.

At the roadmap level the pushbacks it looks for are graph-shaped: a `depends-on` edge that crosses a
documented seam the wrong way, two "independent" tasks that actually share a domain concept, a task
mis-scoped as an epic or a single mission, or a slug that reinvents a canonical term. It is **advisory and
opt-in-silent** — a sound graph gets "No objections." Resolve any real pushback with the user (re-draw an
edge, re-scope or rename a task, move work to the right context) and update `roadmap.md` before Step 3.

The skill owns the critique logic; it reads `.ab-method/structure/index.yaml` for where the domain model
lives.

### 3. Plan Each Task — in dependency order, in its own session

Tasks are planned **foundational-first**: a task is only planned after
the tasks it depends on are, so its `/create-task` grill can build on
their figured-out plans and mission summaries. Walk the DAG in
topological order (roots first).

For each task, hand the user a ready-to-paste `/create-task` prompt,
seeded with:
- the task slug and its one-line scope from the roadmap,
- the roadmap **Objective** for framing,
- the names + summaries of its already-planned upstream deps,
- a note that this task belongs to roadmap `<name>` (so `create-task`'s
  roadmap-awareness step recognizes it and flips `plan:` to ✅ on
  completion).

**Two ways to run the per-task planning:**

- **Fresh session per task (RECOMMENDED).** Paste each prompt into a new
  Claude Code / Codex session. Each task gets deep, isolated grilling and
  a clean context. This is the default recommendation.
- **Inline in this session (DISCOURAGED — warn the user).** You *can*
  run the `/create-task` grills back-to-back here, but grilling several
  tasks in one context bloats it fast and degrades later grills. Say so
  explicitly before doing it, and only if the user insists.

Present the prompts in dependency order and tell the user they can plan
as many or as few now as they want — `/start-roadmap` will verify the
plans exist before executing (and stop cleanly if a needed one is
missing).

### 4. Hand Off to Execution

Once some or all tasks are planned, the roadmap is ready to run:

```
Roadmap created: <Name>
Tasks: <n> (<k> planned, <n−k> unplanned)
Graph: task-a → (task-b ∥ task-c) → task-d

Plan the remaining tasks with the prompts above (fresh session each),
then run /start-roadmap <name> to execute in dependency order.
```

Do not execute here. `/create-roadmap` stops once the roadmap and the
planning prompts are delivered.

## How this stays in sync with `/create-task`

`create-task` is **roadmap-aware**: when you run it for a task that
appears in a `roadmap.md` marked `plan: ⬜ unplanned`, it recognizes the
task as a roadmap task, seeds its grill with the roadmap Objective and
upstream summaries, and flips that task's `plan:` to `✅ planned` when the
tracker is written. You never have to hand-edit the roadmap after
planning a task — the two workflows keep each other in sync via
`roadmap.md`. See the `relationships` section of
`.ab-method/structure/index.yaml`.

## Key Principles

- **One decomposition grill** — the only grill in the main session;
  per-task grills happen in isolation
- **Coarse tasks, no missions** — the roadmap draws the graph; each
  task's missions come from its own `/create-task`
- **DAG, not a list** — dependencies are explicit `depends-on` edges;
  parallelism is implicit (anything unblocked can run)
- **Plan foundational-first** — a task is planned only after its deps, so
  its grill builds on real upstream plans
- **Producer only** — `/create-roadmap` never executes; `/start-roadmap`
  does, and only after verifying plans exist

## Remember

- Check `.ab-method/structure/index.yaml` for paths and the
  `relationships` map
- Tasks live in the normal `docs/tasks/<slug>/`; the roadmap references
  slugs so every task workflow still works on them
- `roadmap.md` is the single source of truth for the graph, plan state,
  and execution state
- Recommend a fresh session per task; warn loudly before planning inline
