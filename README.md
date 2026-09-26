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
- Helper skills: `grill-with-docs`, `grill-me`, `tdd`, `domain-model`, `codebase-design`, `ubiquitous-language`, `critique-plan`, `reconcile-roadmap`, `review-implementation`, `sync-architecture`, `improve-codebase-architecture`, `request-refactor-plan`, `to-issues`, `to-prd`, `write-a-skill`
- Workflow skills: `ab-create-task`, `ab-create-goal`, `ab-analyze-project`, and one per workflow
- Slash commands (Claude only): `/ab-master` plus one per workflow
- `AGENTS.md` (Codex only): orients Codex and lists the workflow skills
- Optional built-in subagents (Claude only, prompted)

Skills are copied as real files, not symlinks — portable across OS and CI.

### As a plugin (Claude Code and Codex)

This repository is also a plugin marketplace for both harnesses. Nothing is copied into your project: the workflows and skills live in the plugin and update with it.

Claude Code:

```bash
/plugin marketplace add ayoubben18/ab-method
/plugin install ab-method@ab-method
```

Codex:

```bash
codex plugin marketplace add ayoubben18/ab-method
codex plugin add ab-method@ab-method
```

Every skill is namespaced the same way on both sides — `ab-method:<name>`. Run a workflow with `/ab-method:ab-create-task` (Claude Code) or `$ab-method:ab-create-task` (Codex), or describe what you want and the matching skill fires.

| | `npx ab-method` | Plugin |
|---|---|---|
| Where it lives | Copied into the project (`.ab-method/`, `.claude/`, `.agents/`) | In the harness's plugin cache, shared by every project |
| Updates | Re-run the installer | With the plugin |
| Trigger (Claude Code) | `/create-task`, `/ab-master`, ... | `/ab-method:ab-create-task`, ... |
| Trigger (Codex) | `$ab-create-task` | `$ab-method:ab-create-task` |
| Custom paths | Edit `.ab-method/structure/index.yaml` | Create that same file in the project — it overrides the bundled default |
| Built-in subagents | Optional, prompted | Not included |

The plugin ships the skills only. The slash commands under `.claude/commands/` are thin pointers at the same workflows the `ab-*` skills already run, so shipping both would list every workflow twice; the eight built-in subagents are stack-specific and stay an `npx` opt-in.

**How a plugin install finds `.ab-method/`.** Workflows and skills name `.ab-method/core/<workflow>.md` and `.ab-method/structure/index.yaml`. Each is looked up in the project first and, when the project has none, in the copy bundled with the plugin. So a project-level `index.yaml` always wins, and a project with no `.ab-method/` at all just works. Paths inside the index (`docs/...`, `CONTEXT.md`) are always relative to the project, never to the plugin.

To set it up for a whole team, commit this to the repo's `.claude/settings.json` — the marketplace registers when a teammate trusts the folder:

```json
{
  "extraKnownMarketplaces": {
    "ab-method": {
      "source": { "source": "github", "repo": "ayoubben18/ab-method" }
    }
  },
  "enabledPlugins": {
    "ab-method@ab-method": true
  }
}
```

Don't mix the two installs in one project on Claude Code — you would get each workflow twice (`ab-create-task` from `.claude/skills/` and `ab-method:ab-create-task` from the plugin).

## Claude Code vs Codex

The workflows are identical; only the trigger differs.

- **Claude Code** — run a workflow with its slash command: `/create-task`, `/create-goal`, `/analyze-project`, etc.
- **Codex** — Codex has no repo-shared slash commands, so each workflow ships as an `ab-*` skill. Invoke one explicitly with `/skills` or `$ab-create-task`, or just describe your intent and Codex matches the skill by its description. `AGENTS.md` tells Codex the rest.

Both read the same `.ab-method/core/*.md` definitions and the same `.ab-method/structure/index.yaml`.

### Subagent nesting — a real runtime difference

The two runtimes differ in one way that matters for roadmap execution, and it was verified empirically (a subagent asked to spawn its own subagent):

| Runtime | Subagent mechanism | Can a subagent spawn another? |
|---------|--------------------|-------------------------------|
| **Claude Code** | `Agent` / `Task` tool | ✅ **Yes** — nesting works (verified two levels deep) |
| **Codex** | `multi_agent_v1.spawn_agent` | ❌ **No** — one level only (`NESTING_UNAVAILABLE`) |

Because of this, `/start-roadmap` picks its execution shape by runtime:

- **On Claude Code it nests by default:** each task runs in its own task-subagent that spawns the task's mission-subagents inside it (`roadmap → task-agent → mission-agents`). The point is per-task context isolation — the parent orchestrator's context stays lean no matter how big the roadmap, because each task's mission churn lives in its own window.
- **On Codex it stays flat:** the parent run spawns each task's mission-subagents directly — one level, never a subagent-that-spawns-subagents. Task structure lives in `roadmap.md`, not in an extra agent layer.

If the runtime can't be determined it falls back to flat, which runs correctly on both. Everything else about a roadmap run (dependency gate, topological order, commit-per-mission, worktree isolation) is identical either way.

## Commands

| Command               | Purpose                                                                 |
|-----------------------|-------------------------------------------------------------------------|
| `/mastermind`         | Intelligent entry point — routes your intent to the right workflow, helps decide goal vs task vs roadmap, explains the method |
| `/create-roadmap`     | Turn a bigger idea into a dependency-ordered DAG of tasks; plan each via `/create-task` |
| `/start-roadmap`      | Execute a planned roadmap in dependency order; independent tasks optionally parallel  |
| `/create-task`        | Define a task; always grills, runs every mission through `tdd`. Roadmap-aware        |
| `/create-task-from-handoff` | Resume a handoff spun off mid-grill into a task; continues the grill, then runs `create-task` |
| `/create-goal`        | Produce a ready-to-run prompt for an autonomous `/goal` loop            |
| `/extend-goal`        | Extend an existing goal, building on what the `/goal` run implemented   |
| `/resume-task`        | Continue an existing task from its progress tracker                     |
| `/start-task`         | Run a task autonomously: each mission in a subagent, commit per mission |
| `/extend-task`        | Append new missions to an existing task                                 |
| `/test-mission`       | Retroactive test coverage for code not written test-first               |
| `/analyze-project`    | Full architecture sweep — domain + tech-stack + FE/BE patterns          |
| `/analyze-frontend`   | Frontend patterns only                                                  |
| `/analyze-backend`    | Backend patterns only                                                   |
| `/update-architecture`| Refresh architecture and domain docs after impactful changes            |
| `/ab-master [name]`   | Master controller — lists workflows, or runs the named one              |

## Core principles

1. Always grill — `/create-task` and `/create-goal` invoke `grill-with-docs` on every run, no skip.
2. Always TDD — every mission runs red → green through the `tdd` skill; the test is the spec. Refactoring is left to `review-implementation`, once the task's missions are green.
3. No mission docs — missions are one-line entries in `progress-tracker.md`; tight summaries on completion.
4. One task at a time — focus, conserve context.
5. Backend-first for full-stack tasks — types feed the frontend.
6. Never lose a tangent — when a grill surfaces a side-topic that deserves its own task, the `handoff` skill captures it under `docs/handoffs/` instead of derailing the current grill; `/create-task-from-handoff` resumes it later.
7. Parallel only by consent — independent missions can be tagged `[pp-1]`, `[pp-2]`, ... and run concurrently in subagents; untagged missions are sequential barriers. The workflow always asks before tagging — sequential is the default.
8. Map the blast radius twice — every task predicts which modules it will land in *before* implementation, and derives the same map from the real diff *after*. The drift between them is the method's only measurement of whether a plan understood its own reach (below).
9. Critique before, review after — `critique-plan` stress-tests the drafted plan against the domain model before coding, and `review-implementation` runs three critics on the diff after. Both push back **only on real issues** — a sound plan or a clean diff produces nothing. No suggestion-for-its-own-sake.
10. Park, never guess — the rare question you genuinely can't answer yet becomes a recorded black box, not a silent invented decision (below).

`grill-with-docs` reads `UBIQUITOUS_LANGUAGE.md` and `CONTEXT.md`, challenges terminology against them, and updates `CONTEXT.md` and `docs/adr/` inline as decisions crystallise.

### One design vocabulary

`codebase-design` is the single source of the architecture language — **module, interface, implementation, depth, seam, adapter, leverage, locality** — plus the principles that go with it (the deletion test; "the interface is the test surface"; "one adapter = hypothetical seam, two = real"). Three skills consume it rather than restating it: `improve-codebase-architecture` when proposing deepenings, `review-implementation`'s **cleaner-architecture** lens when judging a diff, and `tdd` when agreeing which seams to test at. One glossary, so a "shallow module" means the same thing whether you're planning, testing, or reviewing.

`/improve-codebase-architecture` renders its candidates as a **self-contained HTML report** in the OS temp directory (never the repo) — before/after diagrams per candidate, `Strong` / `Worth exploring` / `Speculative` badges, and a top recommendation — then grills through whichever one you pick. It falls back to a markdown list when there's no network for the Tailwind/Mermaid CDNs.

### Unresolved questions — building around what you can't answer yet

A grill sometimes hits a question you can't close: the decision belongs to someone else, waits on data that doesn't exist, or is a product call that hasn't happened. The feature still has to get built. Rather than stalling the task or letting the agent quietly invent an answer, the grill **parks** the question:

- It goes in `docs/tasks/<task>/unresolved-questions.md` — the question, why it's blocked, the placeholder shipping in its place, and the honest blast radius if the real answer differs.
- The build proceeds on a **black box**: a generic or empty placeholder behind a *single named seam*, marked `// TODO(UQ-1): … — docs/tasks/<task>/unresolved-questions.md`, so `grep -rn 'TODO(UQ-'` finds every site. The placeholder gets a test like anything else.
- Missions that build on one are marked `⚠️ UQ-n` in the tracker. `/resume-task` asks once whether the answer arrived; `/start-task` and `/start-roadmap` build the placeholder without stopping and list every open question in the final report. None of them ever answer a parked question for you.
- When the answer lands, `/extend-task` grills it, swaps the seam (or plans real missions if it's more than a swap), and marks the entry `RESOLVED` — the entry stays, so the record of what was guessed and what it became survives.

**This is rare and meant to stay rare.** Anything with a sane default is a default, not a black box; a tangent that deserves its own task is a `handoff`; and a question that changes the domain language can't be parked at all — it gets settled in `CONTEXT.md`.

### Pre- and post-implementation analysis

Critic layers bracket every implementation, all anchored in the domain model and all **opt-in-silent** — they speak only when there is a genuine problem:

- **`critique-plan` (pre-implementation, advisory).** Before missions are validated (in `/create-task`) or the task graph is handed off (in `/create-roadmap`), a read-only domain critic challenges the plan against `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md`, and `docs/adr/`. It pushes back on genuine conflicts — terminology drift, wrong bounded context, an ADR contradiction, a reinvented concept, a bad seam in the DAG — and stays silent otherwise. You resolve each pushback (amend the plan, or dismiss with a load-bearing reason that may become an ADR).
- **`reconcile-roadmap` (pre-execution, roadmap-level, advisory).** Once a roadmap's tasks are all planned, this read-only critic reads *every* planned task's `progress-tracker.md` **together** and checks the finished plans cohere as a system — catching discrepancies only visible *between* plans that `critique-plan` structurally can't see (it judges one plan at a time). It fires on a consumer with no producer, a coverage gap, duplicated work, a reversed/missing edge, cross-task terminology drift, conflicting assumptions, a black box one task ships that another builds real logic on, or a map gone stale against its plans (fog a task already covers, an out-of-scope item a task implements, a `plan: ✅` task planned around a still-open decision). Standalone (`/reconcile-roadmap <name>`), run before `/start-roadmap`; silent when the plans line up.
- **`review-implementation` (post-implementation).** After a task's missions are done, three read-only critics run in parallel on the task's diff: **cleaner-architecture** (shallow modules the change introduced, via the deletion test), **slop-defender** (AI code-slop — speculative generality, pass-through wrappers, dead code, comments that restate code), and **reusability-inspector** (logic that duplicates an existing util/service/type). Each returns nothing when the diff is clean. In autonomous runs (`/start-task`, `/start-roadmap`) the orchestrator auto-applies only **safe** fixes (mechanical, test-covered, no behavior change — each gated on green tests) and writes **everything** to `docs/tasks/<task>/review.md` next to the tracker: safe fixes marked applied, riskier findings left open for you to read afk. Interactive runs present the findings for you to pick instead.
- **`sync-architecture` (post-implementation, docs).** Right after the review, a single read-only detector runs on the same diff — asking not "is this good code?" but "does this diff introduce anything the docs don't yet know about?" It finds new endpoints, patterns, dependencies, domain terms, and ADR-worthy decisions the change added, and routes each to the exact doc it belongs in (reusing `/update-architecture`'s routing). Autonomous runs apply only **append-only** safe additions (a new Entry Points line, a new dependency, a new pattern section — committed as `docs(<task>): sync architecture docs`) and defer anything that rewrites prose, reshapes the domain, or is ADR-worthy to `/update-architecture` / `/domain-model`. This is the automated detection half of `/update-architecture`, so the architecture docs stay live instead of drifting until someone refreshes them by hand. Silent when the task introduced nothing doc-worthy.

- **`change-map` (pre *and* post-implementation).** The only skill that runs on both sides of the work, because it is one artifact asked twice (below).

### Pre- and post-implementation change map

`docs/tasks/<task>/change-map.md` answers **"where in the codebase does this task live?"** — before and after:

- **`## Planned`** is drawn at plan time (`/create-task` § 7.6, after `critique-plan` and before you validate the missions), from the missions alone. One row per module the task expects to add, change, or brush against, with its predicted verdict (`[NEW]` / `[extended]` / `[rewritten]` / `[touched]`), the missions that reach it, the interfaces the plan commits to, the seams it crosses, and one sentence on what it will do that it doesn't today.
- **`## Actual`** is derived after the post-implementation reviewers have run — `review-implementation` and `sync-architecture` both commit changes of their own, so the diff isn't final until they're done — from the task's real commit range. Same shape, but every verdict, symbol and arrow is derived from `git diff` rather than predicted.
- **`## Drift`** is the difference, and the reason the other two exist. It names the modules the task **reached that nobody planned for** (usually a real requirement found mid-mission, occasionally a leak), the modules **the plan named and it never touched** (either the scope was over-drawn, or a mission claimed that module and didn't deliver), and the verdicts that came in **heavier than predicted**.

Rows are **modules, not directories** — the map partitions the codebase the way `CONTEXT.md` and the architecture docs already do, so it speaks the project's ubiquitous language and an unplanned row reads as *a bounded context being crossed*. Reduction is the point: 10 rows maximum, siblings sharing a cause collapsed to one, everything else on an `also touched:` tail. The `## Actual` block is what you paste at the top of the task's PR.

Three rules keep the file honest:

- **The planned map is never edited to match reality.** It records what was believed before anyone knew; being wrong on the page is exactly what makes drift measurable. `/extend-task` appends a dated `## Planned (extension N)` block rather than merging into it.
- **A planned map is never back-filled from a diff.** A task created before the map existed simply records `no planned map — nothing to compare`; a prediction reverse-engineered from the answer would poison every drift computation that reads the file afterwards.
- **The map reports; it never fixes.** Drift routes — a module several tasks keep leaking into is a locality problem for `/improve-codebase-architecture`, an unplanned row crossing a context boundary is one for `/domain-model`, and a claimed-but-untouched module means re-reading that mission before closing the task. Autonomous runs (`/start-task`, `/start-roadmap`) put every drift line in the final report so an afk user never discovers an unplanned module by accident; `/start-roadmap` also collects unplanned modules across the whole run, where the same one appearing in four tasks is a finding the task level structurally can't see.

Drawing the planned map is also a **second read on the missions from the codebase's side**: a module you can't attribute to any mission, or a mission whose row you can't place, is a planning gap `critique-plan` can't catch — it judges the plan against the domain model, not against the file system. A task that lands exactly where it was planned produces one line of drift, and that's the good, common outcome.

## Task vs Goal vs Roadmap

- `/create-task` breaks work into missions you review and run through `tdd` yourself, one at a time. Use when you want to stay in the loop.
- `/create-goal` does the same grilling and doc-grounding, but emits a single `goal.md` prompt for an autonomous `/goal` loop (Claude Code or Codex) plus a `progress-tracker.md` the loop maintains. Use for one continuous objective with a verifiable stop condition.
- `/create-roadmap` is the layer **above** tasks: it turns a bigger idea into a dependency-ordered DAG of tasks (a schema before the API before the UI), then hands you a `/create-task` prompt per task in dependency order. Use when the work is several distinct, ordered tasks.
- `/start-task` runs one existing task with the `/goal` philosophy — every remaining mission in a subagent (tdd, tracker updated per mission), tests verified and a commit made after each. It starts immediately on invocation (no "Proceed?" prompt) and runs with no prompts until done. You review commits instead of missions.
- `/start-roadmap` is the same idea one level up: it verifies every task's plan exists, then runs the whole graph in dependency order — each task by `/start-task` rules, independent tasks optionally parallelized in git worktrees. Its **execution shape is runtime-adaptive** (see below): nested subagents on Claude Code, flat one-level orchestration on Codex.

The method is **fractal**: `roadmap → tasks` mirrors `task → missions`. `depends-on` edges between tasks are the task-level counterpart of `[pp-x]` groups between missions — independent units run concurrently, dependent ones wait.

### A roadmap may be deliberately incomplete

Requiring the whole DAG upfront forces one session to resolve everything, which is how you get confident-looking tasks nobody can plan. `/create-roadmap` names the **destination** first, then charts only what it can actually see. Four optional sections carry the rest — all omitted when empty, which is the common case:

| Section | What lands here |
|---|---|
| `## Open decisions` | A question you can phrase sharply but haven't answered, whose answer shapes the graph. Typed `grilling` (default) / `research` (subagent, AFK) / `prototype` / `task` (manual work that makes a decision *possible*), with a `blocks:` list. |
| `## Decisions` | The index of resolved ones — one line pointing at where the answer actually lives (an ADR, a `CONTEXT.md` term, a task's scope). Never restated here. |
| `## Not yet specified` | The **fog**: in-scope areas you can tell are coming but can't phrase sharply yet. |
| `## Out of scope` | Work ruled beyond the destination. Never graduates — a redrawn destination is a fresh roadmap. |

The test between a decision and fog is whether you can state the question precisely **now** — not whether you can answer it. As answers land, fog **graduates** into tasks (or into new decisions, or out of scope).

Two rules keep it honest. **Graduation is a planning act**: `/create-roadmap` and `/create-task` reshape the map, `/start-roadmap` never does — it reports candidates. And **an open decision blocks its tasks while fog blocks nothing**: a decision gating a frontier task halts the run, because only a session with you can resolve it; uncharted fog just means the map isn't finished, and the planned prefix still runs.

*(Adapted from the map / fog-of-war / out-of-scope model in Matt Pocock's `wayfinder` skill, folded into `roadmap.md` rather than shipped as a second planning system.)*

`/start-roadmap` is **re-runnable and incremental**. After a long roadmap run (e.g. a PRD-sized build), use `/extend-task` to add missions to any task — it reopens that task in `roadmap.md`. Re-running `/start-roadmap` then executes only the tasks that have unfinished work, in dependency order, and skips everything already done. A task counts as "needs work" whenever its tracker has an unchecked mission, so tweaks flow through the same dependency discipline as the original build.

## Workflow phases

1. Baseline — `/analyze-project` produces `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md`, and three lean architecture docs.
2. Sharpen — the `domain-model` skill grills the domain language and captures ADRs.
3. Build — `/create-task` or `/create-goal` grills, `critique-plan` stress-tests the plan against the domain model, then either TDD-loops missions or hands off a goal prompt, and `review-implementation` critiques the resulting diff, `sync-architecture` catches what the docs missed, and `change-map` measures where the change actually landed against where the plan said it would. For multi-task efforts, `/create-roadmap` draws the task graph and `/start-roadmap` runs it in dependency order.
4. Maintain — `/update-architecture` keeps the baseline fresh.

## File layout

```
.claude/commands/        Slash commands (one per workflow)
.ab-method/
  core/                  Workflow definitions
  structure/index.yaml   Configurable paths and outputs
                         (plugin installs: bundled; add this file to override)

UBIQUITOUS_LANGUAGE.md   Domain glossary
CONTEXT.md               Bounded-context overview
                         (or CONTEXT-MAP.md + per-context files)

docs/
  architecture/          tech-stack.md, frontend-patterns.md, backend-patterns.md
  adr/                   Decision records, created lazily by /domain-model
  tasks/<task-name>/     progress-tracker.md (single source of truth)
                         review.md (post-implementation review; autonomous runs)
                         change-map.md (planned vs actual blast radius + drift)
                         unresolved-questions.md (black boxes; rare, absent by default)
  goals/<goal-name>/     goal.md + progress-tracker.md
  handoffs/<slug>.md     Tangents spun off mid-grill, awaiting their own task
```

## Configuration

All paths are configurable in `.ab-method/structure/index.yaml`. Every workflow checks this file first to know where to read from and write to. `workflow_outputs` maps each workflow to its output destinations.

## Developing the plugin

The repository root *is* the plugin — there is no second copy of the skills to keep in sync. Both manifests point at the tree the `npx` installer already ships:

```
.claude-plugin/marketplace.json     Claude Code marketplace manifest
.claude-plugin/plugin.json          Claude Code plugin manifest   (skills → ./.agents/skills/)
.agents/plugins/marketplace.json    Codex marketplace manifest
.codex-plugin/plugin.json           Codex plugin manifest         (skills → ./.agents/skills/)
.agents/skills/                     SHARED — read by both, and by the npx installer
.ab-method/                         Bundled workflows + default index.yaml
```

```bash
claude plugin validate .                          # marketplace + plugin manifests
claude --plugin-dir .                             # load without installing; /reload-plugins after edits

codex plugin marketplace add .                    # a local path works too
codex debug prompt-input | grep -o "ab-method:[a-z-]*" | sort -u   # confirm the model sees the skills
```

Two rules keep a plugin install working:

- A skill that names a `.ab-method/...` path must carry the lookup rule — project root first, then `../../../.ab-method/` relative to its `SKILL.md`. That relative path is the same in all three layouts (plugin, `.claude/skills/`, `.agents/skills/`), which is why it is written that way. Copy the paragraph from any `ab-*` skill.
- Never reference another skill's files by install path (`.claude/skills/...`). Name the skill instead — the path differs per install.
- Keep `package.json` free of `dependencies` and `devDependencies`. Claude Code runs `npm install` on a plugin whose root has any, and the root *is* the plugin — semantic-release alone put 226 packages (60 MB) into every user's plugin cache. The release workflow fetches its tooling with `npx -p` instead.

**Versioning is deliberately asymmetric.** `.codex-plugin/plugin.json` carries `version`, because Codex requires it and uses it as the cache directory name; `scripts/sync-plugin-version.js` sets it from `package.json` on every release (it runs as the npm `version` script, which semantic-release triggers). `.claude-plugin/plugin.json` omits `version`: Claude Code treats it as a pin, so leaving it out makes the commit SHA the version and every push reaches users. `claude plugin validate` warns about the missing field; the warning is expected.

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

/start-task <task-name>
# Runs the remaining missions autonomously — each in a subagent that
# updates the tracker, with a commit after every green mission.
```
