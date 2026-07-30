# Create Roadmap

## Description
Turn a larger idea into a dependency-ordered roadmap of tasks — the layer
above `/create-task`. Grills the idea once to draw the task graph, writes
`roadmap.md`, and hands you the per-task planning prompts. Producer only;
`/start-roadmap` executes it.

## Usage
```
/create-roadmap [idea]
```

## Behavior
Loads and executes the create-roadmap workflow from `.ab-method/core/create-roadmap.md`.

It will:
1. **Always check `.ab-method/structure/index.yaml` first** for paths and the `relationships` map.
2. **Grill the idea once** (`grill-with-docs`, aimed at decomposition, breadth-first) — first naming the **destination**, then identifying discrete tasks and their `depends-on` edges.
3. Write `docs/roadmaps/<name>/roadmap.md` — the DAG of tasks (coarse scope each, no missions), plus per-task `plan:` / `status:` fields. This is the roadmap-level source of truth.
3b. **Chart only what you can see.** A roadmap may be deliberately incomplete rather than complete-looking and guessed. Four optional sections, all omitted when empty (most roadmaps have none):
   - `## Open decisions` — sharp questions that must be answered before the tasks they `blocks:` can be planned, typed `grilling` / `research` / `prototype` / `task`. One grilling-or-prototype decision per session; research runs in parallel subagents.
   - `## Decisions` — the index of resolved ones, pointing at where the answer lives (an ADR, a `CONTEXT.md` term, a task's scope).
   - `## Not yet specified` — the **fog**: in-scope areas you can tell are coming but can't phrase sharply yet. Graduates into tasks as answers land.
   - `## Out of scope` — work ruled beyond the destination. Never graduates.
4. **Run `critique-plan`** on the task graph — a read-only domain critic that pushes back only on genuine decomposition conflicts (wrong seams, mis-scoped tasks, boundary violations) against the domain model. Advisory; silent when the graph is sound.
5. Emit a ready-to-paste `/create-task` prompt per task, **in dependency order** (foundational first), each seeded with the roadmap objective + upstream deps.
   - **Recommended:** run each in a fresh session (isolated, deep grilling).
   - **Discouraged:** plan inline in this session — it warns you about context bloat first.

## Relationship to other workflows
- `/create-task` is roadmap-aware: planning a task that appears in a `roadmap.md` flips its `plan:` to ✅ automatically — no hand-editing.
- `/reconcile-roadmap` (optional, recommended once all tasks are planned): a read-only cross-plan coherence critic that reads every planned task's `progress-tracker.md` together and pushes back only on discrepancies *between* the finished plans (a consumer with no producer, a coverage gap, a reversed edge, terminology drift). Standalone; run it before `/start-roadmap`.
- `/start-roadmap` executes the roadmap once tasks are planned (it verifies plans exist first). An **open decision blocks its tasks** and halts the run — only a session with you can resolve one. **Fog blocks nothing**: the planned prefix still runs, and the run reports graduation candidates without ever reshaping the map itself.
- `/create-task` alone for a single task; `/create-goal` for one continuous autonomous objective.

## Examples
```
/create-roadmap add a payments module: schema, charge API, webhooks, checkout UI
# Grills the decomposition, writes roadmap.md, hands back planning prompts in dep order
```
