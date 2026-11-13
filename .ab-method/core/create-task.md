# Create Task Workflow

## Purpose

Turn a problem into one holistic task: a grilled problem statement, a zoom-out that decides whether the feature fits the current architecture or needs a reshape, a deepening scan of the code it touches, a placement decision, and a short list of composed missions, then run them. Tests are decided after the code exists, by the protect step.

Tasks are run by agents, so size is not the constraint. A task refactors and deepens what it touches instead of leaving that for later, and when the feature doesn't fit the current design, it re-architects the area rather than bending the feature around it (`rules/code.md`, Strategic, not tactical, and Scope follows the problem).

**Read `.ab-method/structure/index.yaml` FIRST.** It says where every doc this workflow reads and writes lives, and how tasks link to roadmaps. Paths are user-configurable; never hardcode them.

Follow `.ab-method/rules/communication.md` when talking to the user and `.ab-method/rules/code.md` when writing code.

## Process

### 0. Roadmap awareness

Scan `docs/roadmaps/*/roadmap.md` before grilling.

- **Roadmap task**: the request matches an entry marked `plan: ⬜ unplanned` (by slug or clearly by scope).
  1. Read the roadmap's **Objective** and the entry's `depends-on` list.
  2. If an `## Open decisions` entry `blocks:` this task, say so and offer to resolve it first (`create-roadmap.md` § 2b). Planning anyway is the user's call, never a silent default.
  3. Read `## Not yet specified`. If a patch touches this task, the grill may sharpen it.
  4. Read the Mission Summaries of each already-planned upstream dep and seed the grill with them. If a dep is still unplanned, say so and ask whether to continue.
  5. Run the steps below as usual, writing to `docs/tasks/<slug>/`.
  6. On completion, flip the entry to `plan: ✅ planned`. If every task is planned and no open decision blocks one, set the roadmap **Status** to `Ready`.
  7. Graduate any fog the grill cleared: a patch now statable as a task goes to `## Tasks` (`plan: ⬜`, with edges); a patch that became a question goes to `## Open decisions`; one past the destination goes to `## Out of scope`. Tell the user what moved.
- **Standalone task**: no match. Ignore roadmaps.
- **Ambiguous**: ask once ("‘payments’ has an unplanned task ‘charge-api’ — is this that task, or a standalone one?").

### 1. Grill — invoke `grill-with-docs`

Before the first question, skim `CONTEXT.md`, `docs/seams/index.md` and the code area the request names, so the grill looks facts up instead of asking them. § 2 then reads the rest in depth.

Run the `grill-with-docs` skill on every invocation. When the user was already specific, it confirms and probes edges instead of re-asking, so it stays short. Before exiting it must cover: problem framing, scope (in/out), behavior (flow, data, validation, errors), constraints, and existing-code anchors.

**Scope follows the problem, not the code.** Settle scope from what the user needs, never from what the current code makes easy. Don't propose "a small version now, the rest later", and don't cut a capability because the current design can't hold it; that is what § 3a is for. Existing-code anchors tell you what's there, not what the feature is allowed to be.

**Solved problems.** When part of the request is a problem others have already solved (a standard file format, a well-known widget, an auth flow), name it in the grill: "reading .xlsx is a solved problem; § 3c checks libraries for it". Settle the behaviour, but leave choices a library would decide (where parsing runs, which formats and limits are supported) open until § 3c, or record them as constraints the library must meet.

- **Tangents** that deserve their own task: capture with the `handoff` skill under `docs/handoffs/`, tell the user `resume with /create-task-from-handoff <slug>`, return to the grill.
- **Questions the user genuinely can't answer yet** (rare): the skill parks them in `unresolved-questions.md` with an agreed placeholder behind a `TODO(UQ-n)` seam. Never park on the user's behalf; anything with a sane default is a default noted in Constraints. Parking is an open decision inside this task; a handoff is a separate task.

Proceed when every branch is resolved or explicitly parked and the user has confirmed the understanding, including any placeholders.

### 2. Project context

Read, using the paths from `index.yaml`:

- `UBIQUITOUS_LANGUAGE.md` and `CONTEXT.md` (or `CONTEXT-MAP.md` + the relevant per-context `CONTEXT.md`). Use their terms verbatim in missions.
- `docs/architecture/tech-stack.md`, including its Testing section.
- Patterns: `docs/architecture/<layer>/index.md`, then **only the topic files this task touches**. Legacy repos: if the folder is missing but `frontend-patterns.md` / `backend-patterns.md` exists, read that and suggest `/ab-cleanup` once.
- `docs/seams/index.md`, then the seam docs this task touches (format: `SEAM-FORMAT.md` in the `codebase-design` skill). A capability a seam owns goes through it.
- `docs/adr/` in the area you're touching. Don't contradict an ADR without flagging it.

Then search the code: similar implementations to mirror, modules that already own this concern, types and services to reuse, inline logic the task would duplicate.

### 3. Zoom out, deepening scan, placement, seam design

#### 3a. Zoom out: fit or reshape

Agents tend to fit a feature into the code that's there: the smallest diff, the existing pattern, "start with the simple version". For an agent, writing code is cheap. A design that fights the feature costs something on every change after it. So before judging single modules, judge the shape of the area.

Example: an assistant that answers questions in a chat is asked to orchestrate several agents.
- **Fit:** add a "create a task and assign it" tool and let a project board carry the plan. It ships a scripted path the user outgrows on the first goal that isn't a board.
- **Reshape:** the assistant becomes a stored run that sleeps between steps and is woken by events. Messaging an agent, waiting for its reply and asking the user become tools of that loop. That shape is what the feature actually is. It also makes background work and resuming after a restart possible, which nobody asked for yet.

1. **Sketch the target.** Describe the design you'd build if this area were written today with this feature, and the features it obviously leads to, as requirements. Name the modules, who owns what, and how data and control flow. Keep it to a short paragraph or a small diagram.
2. **Compare it with what's there.** For each difference, find why the current design is the way it is. A real constraint is an ADR, an external or public contract, the shape of persisted data, or a platform limit. Anything else is history, and history is not a reason to keep a design.
3. **Decide.**
   - **Fit**: the current shape serves the feature and the differences are cosmetic. Carry on to § 3b. This is a normal outcome; never invent a reshape.
   - **Reshape**: the feature would bend around the current design. Plan the target architecture and the migration to it as missions in this task.
4. **Signs it's a reshape:** the plan needs special cases, flags or adapters to get past the current design. A second path would do a job an existing path already does. The feature needs a concept the model has no place for. A capability the user asked for gets cut or staged because the design can't hold it. Several modules change in lockstep for one behaviour.
5. **Effort is not a cost.** Lines changed, files touched, number of missions and "it's a big refactor" never argue for fit. The costs that count are risk to persisted data, breaking an external contract, reversing an ADR and decisions that can't be undone. They shape the migration (a backfill, a compatibility window, an ADR). They don't decide against the reshape by themselves.
6. **Don't stage what can ship.** "Do layer 1 now and layer 2 later" is a split only when a real boundary forces it, such as a gated dependency or an open decision. Otherwise the whole capability is built in this task. If it is truly more than one task, propose `/create-roadmap` with the target architecture as its objective, not a cut-down task.
7. **Push for it.** On a reshape, lead with it as the recommendation. Show current and target side by side, what the reshape unlocks beyond the ask (one line each, as offers the user can fold in), and the migration. Fit is the alternative, not the default. If the user leans towards fit to save effort, name once the concrete workaround it will force (from point 4). Then the user decides, and you go with it.
8. **Record it** in the tracker's `## Architecture`: the verdict, the target sketch and the reason (example in § 6). On a reshape, the target sets the blast radius for § 3b, every new or changed seam goes through § 3d, and the migration missions come before the features that build on the target.

#### 3b. Deepening scan

Before deciding where new code goes, judge the code it will land in. Invoke the `codebase-design` skill for the vocabulary and read its `RED-FLAGS.md`.

- **Scope: the blast radius.** The modules the task touches, their callers, and the seams they cross, measured against the target from § 3a when it reshapes. Not the rest of the repo.
- **Read the drift.** `docs/tasks/*/change-map.md` rows marked unplanned across several tasks point at a module changes keep leaking into.
- **Judge each module** with the deletion test and the red flags. A finding names the module, the flag, and the symptom it causes (change amplification, cognitive load, unknown unknowns).
- **Every finding in the blast radius becomes a refactor mission**, placed before the missions that build on it, `verify: build`. Don't defer it: the task is about to change this code, so this is when deepening pays.
- **Outside the blast radius:** list it in one line under `## Constraints / Notes` for a later task. Don't act on it.

No findings is a normal outcome. Never invent work to fill the scan.

#### 3c. Placement

For every capability the task adds, decide where it lives per `rules/code.md`:

- **reuse** an existing module or component,
- **extend** the module that owns the concern, behind its interface,
- **extract** logic that exists inline (or would get a second copy) into one module, and point existing callers at it, or
- **adopt** a healthy open-source library when nothing in the repo owns the concern and one already solves it, or
- **introduce** a new module when nothing owns the concern (a cross-cutting layer, a new seam).

**Adopt or build.** Invoke the `adopt-or-build` skill for every capability that is large or a known solved problem (its § When it runs), **whatever placement you are leaning towards**. Reusing a library the repo already has counts: the skill health-checks installed libraries too. Every package the plan installs or newly imports must come out of this skill. Skip it only for domain logic and for what a short function covers; parsing a standard format is never "a short function" (delimiters, encodings, quoting). The skill checks every candidate with real numbers, including that each is actively maintained and fits the project's exact versions and runtime, and returns a verdict per piece. The user picks.

- Paste its table into the tracker under `## Adopt or Build`, losing candidates included, so the evidence outlives the session.
- Each verdict's `## Placement` line carries the pinned version, the seam and the check date (example in § 6).
- It goes behind a seam: the existing seam that owns the concern (**extend**), or a new one through the gate below. Callers use the seam, never the library.
- Offer an ADR when it carries lock-in.
- Installing it is a step of the first mission that needs it, pinned to the checked version. Nothing is installed during planning. If that mission runs more than 30 days after the check date, re-run the skill's health check on the package before installing.

Record each decision, and each deepening from 3b, in the tracker's `## Placement`. Extractions and deepenings become refactor missions placed first, `verify: build`: behaviour is preserved, so the existing tests stay green (see **Existing tests** in § 10). Be ambitious. If the right move is to pull a concern into its own module before building on it, plan that rather than adding the feature inline.

#### 3d. Seam design gate

Runs when a placement is **introduce**, or when the task changes a documented seam's interface. Skip it otherwise.

**What counts as an interface change:** anything that would change the seam doc's **Interface** or **Callers never** line: a new kind of entry point, a changed signature, error mode or invariant, a new rule for callers. Adding one more member of a shape the doc already describes (another resource hook, another scoped read) is **extend**, not a change. When unsure, run the gate; it is cheap next to a seam redesigned by accident.

1. Frame the seam: what it hides, its callers today, the dependency category (`DEEPENING.md` in `codebase-design`), and the matching `SEAM-CATALOG.md` entry if there is one.
2. Run `DESIGN-IT-TWICE.md` from the `codebase-design` skill: several radically different interfaces, compared on depth, locality and seam placement.
3. The user picks one. Write `docs/seams/<slug>.md` now, status `introducing`, plus its line in `docs/seams/index.md` (format: `SEAM-FORMAT.md`). Run `check-docs`. It is the target the missions build toward and the reviewers check against.
4. Offer an ADR when the choice clears the bar (`ADR-FORMAT.md` in the `domain-model` skill). A new library that carries lock-in usually does.
5. Shape the missions around the seam:
   - **pin** the current behaviour with tests first, only when the code that moves has thin coverage (`verify: build`; the tests come from the `tdd` skill's test-after rules),
   - **build** the module behind the picked interface,
   - **migrate** the callers, in as few missions as the code allows,
   - **delete** the old path.

   A migration that can't finish in this task leaves the seam `migrating`, its **Check** listing what's left. A later task finishes it.

### 4. UI prototype gate

If the task adds **new UI** (a new page, component or flow), invoke the `prototype-ui` skill now, before writing missions. It builds disposable HTML variants in `docs/tasks/<task>/prototype/`, the user picks one, and the skill writes the tracker's `## UI Spec`. Missions implement that spec.

Skip it for tweaks to existing UI, backend-only tasks, or when the user supplied a design (Figma, screenshot, mockup).

### 5. What gets tested

No test plan up front. The design is settled first; tests are chosen once the code exists, by the **protect step** (§ 11), which reads the diff and the seam docs and protects only what must not break.

- **Feature and refactor missions** are `verify: build`: typecheck, lint, build and the existing tests.
- **Bug fixes** are `verify: repro`: a failing test that reproduces the bug comes first, then the fix (the `tdd` skill). A failing test before the fix is the only proof it's fixed.

### 6. Write the task

Create `docs/tasks/<task-name>/progress-tracker.md`. Write `unresolved-questions.md` too if the grill parked anything (format: `UNRESOLVED-QUESTIONS-FORMAT.md` in the grill skill); never create it empty.

```markdown
# Task: Admin partial refunds

**Status**: Brainstormed
**Type**: Full-stack
**Created**: YYYY-MM-DD

## Problem
Admins can only refund whole orders; support issues partial refunds by hand in Stripe.

## Outcome
An admin refunds part of an order from the orders table, inside the refund window.

## Constraints / Notes
Only the non-obvious ones from the grill. Omit when empty.

## Unresolved Questions
⚠️ UQ-1 — refund window fixed or per-merchant? Placeholder: fixed 30 days. See unresolved-questions.md
(Omit the section when nothing was parked — the common case.)

## Architecture
Fit: refunds are one more operation on the billing module; the current shape holds them.
(Or, on a reshape: `Reshape:` the target sketch, what it replaces and why, what it unlocks beyond the ask, and the migration. One short paragraph or diagram.)

## Placement
- refund calc → extract `src/billing/refund.ts` from checkout + admin (mission 1)
- deepen: `OrderTotals` is a pass-through over `billing` → merge into the billing seam (mission 1)
- refund button → reuse `ui/ConfirmButton`
- <piece> → adopt <package>@<exact version> behind the <seam> seam (checked YYYY-MM-DD, see ## Adopt or Build)

## Adopt or Build
(The adopt-or-build table, checked YYYY-MM-DD, losing candidates included. Omit when the skill did not run.)

## UI Spec
Picked "Dense": inline row action, no modal. Reference: docs/tasks/admin-partial-refunds/prototype/
(When prototype-ui ran, or a short hand-written spec when it was skipped: what appears where, which existing components it reuses.)

## Missions
- [ ] Mission 1: Billing — deepen refund calc behind the billing seam — verify: build
  - extract the refund calc from checkout + admin into `src/billing/refund.ts`
  - fold `OrderTotals` into it; point both callers at the seam
- [ ] Mission 2: Partial refunds end to end ⚠️ UQ-1 — verify: build
  - enforce the refund window in the billing module
  - refund row action in the orders table
  - wire the admin refund flow

## Mission Summaries
_Filled in as each mission completes._

## Protected
_Filled in by the protect step after the last mission._
```

Mission rules:
- **A mission is a composed slice**: one headline that delivers a whole capability, in domain terms, then `— verify: build` or `— verify: repro`, and its steps as indented sub-bullets. Steps span layers freely (backend, frontend, wiring) when they deliver one capability.
- **Split only at a real boundary**: a reshape or deepening, or a new seam, that must land first, a dependency the next part needs to exist, or a bug fix (its own `verify: repro` mission). Most fit tasks have one to three missions; a reshape adds its migration. Never split by layer alone, and never to defer part of the capability.
- Order: the reshape's migration, deepenings and extractions first, then the seam work (pin → build → migrate → delete), then the features that build on them.
- Missions building on a parked question carry `⚠️ UQ-n`.
- No mission docs and no empty placeholder sections.

Status flow: Brainstormed → Validated → In dev → Testing → Completed.

### 7. Parallel groups (`[pp-x]`, opt-in only)

If some missions are independent (disjoint files, no shared types, none consumes another's output), **ask** whether to tag them as a parallel group. Never tag without a yes.

- Same tag = may run concurrently. Untagged missions are barriers: `1 → (2 ∥ 3) → 4`.
- Siblings must touch disjoint files and never depend on each other. When in doubt, keep it sequential.
- Number groups in execution order: `pp-1`, `pp-2`, …. Markers combine: `... [pp-1] ⚠️ UQ-2 — verify: build`.

### 8. Critique and planned change map

1. Invoke `critique-plan` on the missions. It is silent when the plan is sound. Resolve each pushback with the user (amend, or dismiss with a reason it may record as an ADR) and update the tracker.
2. Invoke `change-map` in its **planned** pass. It writes `## Planned` in `change-map.md` from the plan alone. If it exposes a module no mission accounts for, or a mission it can't place, fix the missions now. `## Planned` is never edited afterwards.

### 9. Confirm

Show, briefly: the architecture verdict (on a reshape, current and target side by side), the missions with their `verify:` tags and steps, the placement (deepenings included), any seam doc the gate wrote, the blast radius ("6 modules, 1 new"), and any placeholders with the missions that build on them. Ask to validate. On yes, set status `Validated` and commit the plan (tracker, `change-map.md`, any seam doc or ADR the gate wrote) as `docs(<task>): plan`. The task's commit range starts after it, so the actual change map and the reviews see only the work.

### 10. Execute missions

Walk the missions top to bottom; set status `In dev`. A `[pp-x]` mission starts a parallel group (below).

**`verify: build` missions**:
1. Load the domain docs, tech-stack (typecheck/lint/build commands), the pattern topics and seam docs this mission touches, relevant ADRs, and prior Mission Summaries.
2. Implement every step under `rules/code.md`. No new test (the protect step decides those).
3. Run typecheck, lint, build and the existing tests closest to the change.

**`verify: repro` missions** (bug fixes):
1. Invoke `Skill("tdd")` before anything else.
2. Load the same context.
3. Write a test that reproduces the bug and fails for the right reason, then the smallest fix to green.

**Legacy trackers**: `verify: test (UCn)` and untagged missions run as before, through `tdd` for their `## Test Plan` entry.

**Every mission:**
- **Existing tests.** A refactor keeps behaviour, so it keeps existing tests green. Edit an existing test only when it pins an internal the refactor removes (exact SQL, a private helper, a leaked error message) or behaviour the mission changes on purpose, and list every such edit under **Tests changed** in the summary. Never edit a test just to get green.
- **Checks against the base.** A check that is already red on the base branch is not this mission's failure: compare, and only new failures count. A check that can't run locally (a build needing cloud resources, e2e needing services) goes under **Not verified** in the summary; never claim it.
- **Commits** (when the run commits per mission) take the mission's kind: `refactor(<task>)` for deepenings and extractions, `fix(<task>)` for `verify: repro`, `feat(<task>)` for features.
- If the description is fuzzy, run `grill-with-docs` first.
- `⚠️ UQ-n`: read the entry and ask once whether the answer has landed. If it has, mark it `RESOLVED` and build the real thing. If not, build the **recorded placeholder** exactly, behind one named seam marked `// TODO(UQ-n): <question> — docs/tasks/<task>/unresolved-questions.md`, and update the entry's **Marker** line with the path. Never fabricate data to route around it; if the mission can't proceed, say the question is blocking.
- If a UI Spec exists, implement it from the picked variant in `prototype/`, using the project's real components and tokens.
- Run focused tests only. The full suite runs once, after the last mission.
- Use a subagent only when the mission warrants it (large surface, specialised domain). Load `tdd` in the parent first for `verify: repro`.
- Append the summary:
  ```markdown
  ### Mission N: [Description]
  - **Files**: changed paths
  - **Built**: what now exists
  - **Verified**: `build` — checks run | `repro` — the reproducing test, red then green
  - **Tests changed**: existing assertions edited, and why (only if any)
  - **Not verified**: checks that couldn't run here (only if any)
  - **Integrates with**: what later missions need
  - **Placeholders**: `UQ-n → <seam>` at `<path:line>` (only if any)
  - **Shortcuts**: any deliberate tactical choice, and why (only if any)
  - **Gotchas**: only real ones
  ```
  Skip bullets with nothing to say.
- Update `CLAUDE.md` only for new features or pages, structural changes, new tech or major API changes.
- Ask before the next mission: "Mission N done. Start Mission N+1?"

#### Parallel group execution

1. Load `tdd` in the parent if any sibling is `verify: repro`. Confirm with the user: run in parallel now, or one at a time?
2. Load shared context once, then spawn **one subagent per mission in a single message**. Each prompt carries: the objective and its steps, its `verify:` tag, the relevant constraints and docs paths, `rules/code.md`, the rule to touch only its own files, and, for `⚠️ UQ-n`, the entry verbatim plus "build the recorded placeholder behind a `TODO(UQ-n)` seam, report its path, don't edit `unresolved-questions.md`". Detailed output goes to `sub-agents-outputs/mission-N-<slug>.md`; it returns a tight summary.
3. When they return, run the tests once in the parent and fix any cross-mission breakage.
4. Append every summary, tick the group, and write any reported seam paths into `unresolved-questions.md`. The parent is the only writer of the tracker and that file.
5. Prompt once per group.

### 11. Post-implementation

After the last mission:

1. **Full suite**, once. Fix anything red before reviewing. Set status `Testing`.
2. **Protect** (the `tdd` skill's `PROTECT.md`): reads the diff and the seam docs, proposes what must not break, and writes those tests through seam interfaces and domain rules, each proven red by breaking the behaviour. The user confirms the list. Results go in `## Protected`.
3. **`review-implementation`** (interactive): three critics on the task diff. Apply what the user approves, keeping tests green.
4. **`sync-architecture`** (interactive): finds what the diff introduced that the docs don't capture, seam docs included, and proposes **in-place** edits that must pass `check-docs` (`rules/docs.md`). Apply the approved ones. Domain reshapes and ADRs go to `/update-architecture` / `/domain-model`.
5. **`change-map` actual pass**: appends `## Actual` + `## Drift` from the real commit range. Walk the drift with the user (unplanned modules, predicted-but-untouched ones, escalated verdicts) and route it: a module changes keep leaking into is a deepening for the next task's scan. It never fixes anything itself.
6. **Pull request** — ask whether to open one. On yes, follow `start-task.md` § 6 (draft PR with the `pr` skill body, `review-pr` in interactive mode, then mark it ready).
7. Delete `docs/tasks/<task>/prototype/` if it exists.
8. Set status `Completed`.

Open `UQ-n` entries don't block completion; they ship as recorded placeholders. List them in the closing message with their seams and point at `/extend-task` to swap answers in.

## Remember

- `index.yaml` first; rules files for talk and code; seam docs before placement.
- Zoom out before placing anything: fit or reshape. Effort never argues for fit; a feature bending around the design does argue for a reshape. When it's a reshape, recommend it; the user decides.
- Deepening scan over the blast radius; every finding in it is a refactor mission placed first.
- Large or already-solved capability → `adopt-or-build`, whatever the placement (installed libraries included); adopt only a maintained library that fits the exact stack, behind a seam. No package enters the plan without it.
- Introduce or change a seam → design gate before missions; the seam doc is written before the code.
- Missions are composed slices, split only at real boundaries.
- Tests come after the code (protect step), except bug fixes (`verify: repro`); full suite once at the end.
- New UI gets a disposable prototype before any mission; the codebase never holds prototype code.
- `[pp-x]` and parked questions exist only because the user said yes.
