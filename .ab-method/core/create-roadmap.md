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
at the internals of any single task. Grill **breadth-first**: fan out
across the whole space rather than going deep on any one thread. Depth
belongs to each task's own `/create-task` grill later.

Start by naming the **destination** — what reaching the end of this
roadmap looks like. It goes in `## Objective`, and it does real work: the
destination fixes the scope, which is what makes "out of scope" decidable
later. Settle it before drawing any edges.

The goal of this grill is to answer:

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

#### Chart what you can see — the rest is fog

**A roadmap does not have to be complete to be correct.** Some of the work
is visible now; some of it hangs on answers you don't have yet. Charting
the invisible part produces confident-looking tasks nobody can plan, which
is worse than admitting the fog. Four things can come out of a
decomposition grill, and each has its own home:

| What you've got | Where it goes |
|---|---|
| A task you can scope in one line | `## Tasks` — a normal roadmap entry |
| A question you can phrase sharply, whose answer shapes the graph | `## Open decisions` — a decision that must resolve before the tasks it blocks can be planned |
| A patch you can tell is coming but **can't phrase sharply yet** | `## Not yet specified` — the fog |
| Work you've consciously ruled beyond the destination | `## Out of scope` — closed, never graduates |

**The test between a decision and fog is whether you can state the
question precisely *now* — not whether you can answer it.** A sharp
question you can't answer is a decision; a vague sense that "something
about refunds needs figuring out" is fog. Don't pre-slice fog into
ticket-sized pieces: one patch may later graduate into several tasks, or
none.

Fog only gathers *toward* the destination. Work past the destination isn't
fog — it's out of scope, and it never graduates.

**A roadmap where nothing is fogged is the normal case.** All four sections
except `## Tasks` are omitted when empty. Don't invent fog to fill them.

#### Unresolved questions belong to tasks, not to the roadmap

If the grill hits something the user genuinely **can't answer yet**
(blocked on a person, a contract, data that doesn't exist), that is an
unresolved question — note it in the affected task's one-line scope and
let *that* task's `/create-task` grill park it properly, with a placeholder
and a `TODO(UQ-n)` seam in `docs/tasks/<slug>/unresolved-questions.md`.

The distinction that matters here:

- **Unresolved question** — nobody can answer it yet; the build routes
  around it behind a placeholder. Lives with the task.
- **Open decision** — answerable *now*, by grilling, research, or a
  prototype; it just hasn't been answered, and the graph can't be drawn
  until it is. Lives on the roadmap.

A question that changes the **shape of the graph** — whether a task exists
at all, or which task depends on which — can never be parked as an
unresolved question. Either resolve it (an open decision) or stop.

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
[The destination, in 1–3 sentences: what reaching the end of this roadmap
looks like. Every later session orients to this before choosing what to
do, and it's what makes "out of scope" decidable.]

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

## Open decisions
[OMIT when empty — the common case. Sharp questions that must be answered
before the tasks they block can be planned. One line each, typed.]
- [ ] **D1** (grilling) — fixed refund window, or per-merchant?
      blocks: [refund-api]
- [ ] **D2** (research) — does Stripe's API expose partial captures per line item?
      blocks: [charge-api, refund-api]

## Decisions
[OMIT when empty. The index of what's been resolved — one line each,
pointing at where the answer actually lives. Never restate the answer here.]
- **D3** — settled on event-sourced charges → `docs/adr/0007-event-sourced-charges.md`

## Not yet specified
[OMIT when empty. The fog: in-scope areas you can tell are coming but
can't phrase sharply yet. Write as loosely as the view allows.]
- Refund flow — its shape depends on how `charge-api` ends up modelling
  partial captures. Revisit once that task is planned.

## Out of scope
[OMIT when empty. Work consciously ruled beyond the destination. Never
graduates — if the destination is redrawn, that's a fresh roadmap.]
- Multi-currency support — past this destination; USD-only is the goal here.
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
It becomes `Ready` once every task is `✅ planned` **and no open decision
blocks a task** — fog alone doesn't hold a roadmap back, an unanswered
blocking decision does.

### 2b. Open decisions — resolve them, one per session

An open decision is a question you *can* answer, whose answer shapes the
graph. Each carries a type, borrowed from the four kinds of work that
actually resolve one:

| Type | How it resolves | With the user? |
|---|---|---|
| `grilling` | A `grill-with-docs` session on that one question. **The default.** | Yes — the decision is theirs |
| `research` | Reading docs, a third-party API, the codebase. Hand it to a subagent. | No — run it and report |
| `prototype` | Build something cheap and concrete to react to — a stub, a sketch, a throwaway script. Link it from the decision. | Yes — they react to it |
| `task` | Manual work that must happen before the decision is *possible*: signing up for the service so its API can be judged, provisioning access, moving data so its shape is visible. | Either — do it if you can, otherwise hand over a precise checklist |

**Resolve at most one `grilling` or `prototype` decision per session**
(`research` is exempt — those are cheap and parallel). One decision per
session is what keeps each grill sharp; it's the same reason
`/create-roadmap` recommends a fresh session per task.

When a decision resolves:
1. Put the answer where it belongs — an **ADR** if it clears the bar
   (hard to reverse, surprising, a real trade-off), a **term** in
   `CONTEXT.md`, or the affected task's **scope line**. The roadmap is an
   index, not a store.
2. Move its line from `## Open decisions` to `## Decisions`, gisted in one
   line and **pointing** at where the answer lives.
3. **Graduate the fog it cleared.** An answer usually sharpens something
   in `## Not yet specified` — turn each now-specifiable patch into a task
   (or a new open decision) and delete it from the fog. A patch may
   graduate into several tasks, one, or none.
4. If the answer reveals that a task or decision sits **past the
   destination**, don't resolve it on the route — move it to
   `## Out of scope` with one line of why.

**Graduation is a planning act.** `/create-roadmap` and `/create-task` may
graduate fog and add tasks; `/start-roadmap` never does — an autonomous run
that invents tasks mid-flight is a run nobody approved. It reports
graduation candidates instead.

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

Open decisions: 2 — D1 (grilling) blocks refund-api, D2 (research) blocks charge-api
Fog: 1 area not yet specified (refund flow)

Plan the remaining tasks with the prompts above (fresh session each),
then run /start-roadmap <name> to execute in dependency order.
```

Drop the "Open decisions" and "Fog" lines when there are none. When there
*are*, say which tasks they block — a blocked task can't be planned, so
the user needs to know the decision comes first.

**Optional (recommended once all tasks are planned):** run
`/reconcile-roadmap <name>` before `/start-roadmap`. It's a read-only,
cross-plan coherence critic that reads every planned task's
`progress-tracker.md` together and pushes back only on genuine
discrepancies *between* the finished plans — a consumer with no producer,
a coverage gap, duplicated work, a reversed edge, terminology drift. It's
standalone and silent when the plans cohere; where `critique-plan` judged
the coarse DAG here, `reconcile-roadmap` checks the actual missions line up.

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
  per-task grills happen in isolation. Breadth-first: fan out, don't dive
- **Name the destination first** — it fixes the scope, which is what makes
  "out of scope" a decision instead of an opinion
- **Chart only what you can see** — a sharp unanswered question is an
  **open decision**; a patch you can't phrase yet is **fog**. Neither is a
  task. An incomplete roadmap that says so beats a complete-looking one
  built on guesses
- **Fog graduates, out-of-scope doesn't** — answers sharpen fog into tasks;
  work past the destination only returns as a fresh roadmap
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
- `## Open decisions`, `## Decisions`, `## Not yet specified` and
  `## Out of scope` are **omitted when empty** — most roadmaps have none.
  Never invent fog to fill a section
- One `grilling`/`prototype` decision per session; `research` decisions can
  run in parallel subagents
