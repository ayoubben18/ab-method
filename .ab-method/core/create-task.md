# Create Task Workflow

## Purpose

Turn a problem into one holistic task: a grilled problem statement, a deepening scan of the code it touches, a placement decision, and a short list of composed missions, then run them. Tests are decided after the code exists, by the protect step.

Tasks are run by agents, so size is not the constraint: a task refactors and deepens what it touches instead of leaving that for later (`rules/code.md`, Strategic, not tactical).

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

### 3. Deepening scan, placement, seam design

#### 3a. Deepening scan

Before deciding where new code goes, judge the code it will land in. Invoke the `codebase-design` skill for the vocabulary and read its `RED-FLAGS.md`.

- **Scope: the blast radius.** The modules the task touches, their callers, and the seams they cross. Not the rest of the repo.
- **Read the drift.** `docs/tasks/*/change-map.md` rows marked unplanned across several tasks point at a module changes keep leaking into.
- **Judge each module** with the deletion test and the red flags. A finding names the module, the flag, and the symptom it causes (change amplification, cognitive load, unknown unknowns).
- **Every finding in the blast radius becomes a refactor mission**, placed before the missions that build on it, `verify: build`. Don't defer it: the task is about to change this code, so this is when deepening pays.
- **Outside the blast radius:** list it in one line under `## Constraints / Notes` for a later task. Don't act on it.

No findings is a normal outcome. Never invent work to fill the scan.

#### 3b. Placement

For every capability the task adds, decide where it lives per `rules/code.md`:

- **reuse** an existing module or component,
- **extend** the module that owns the concern, behind its interface,
- **extract** logic that exists inline (or would get a second copy) into one module, and point existing callers at it, or
- **introduce** a new module when nothing owns the concern (a library, a cross-cutting layer, a new seam).

Record each decision, and each deepening from 3a, in the tracker's `## Placement`. Extractions and deepenings become refactor missions placed first, `verify: build`: behaviour is preserved, so the existing tests stay green (see **Existing tests** in § 10). Be ambitious. If the right move is to pull a concern into its own module before building on it, plan that rather than adding the feature inline.

#### 3c. Seam design gate

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

## Placement
- refund calc → extract `src/billing/refund.ts` from checkout + admin (mission 1)
- deepen: `OrderTotals` is a pass-through over `billing` → merge into the billing seam (mission 1)
- refund button → reuse `ui/ConfirmButton`

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
- **Split only at a real boundary**: a deepening or new seam that must land first, a dependency the next part needs to exist, or a bug fix (its own `verify: repro` mission). Most tasks have one to three missions. Never split by layer alone.
- Order: deepenings and extractions first, then the seam work (pin → build → migrate → delete), then the features that build on them.
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

Show, briefly: the missions with their `verify:` tags and steps, the placement (deepenings included), any seam doc the gate wrote, the blast radius ("6 modules, 1 new"), and any placeholders with the missions that build on them. Ask to validate. On yes, set status `Validated` and commit the plan (tracker, `change-map.md`, any seam doc or ADR the gate wrote) as `docs(<task>): plan`. The task's commit range starts after it, so the actual change map and the reviews see only the work.

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
- Deepening scan over the blast radius; every finding in it is a refactor mission placed first.
- Introduce or change a seam → design gate before missions; the seam doc is written before the code.
- Missions are composed slices, split only at real boundaries.
- Tests come after the code (protect step), except bug fixes (`verify: repro`); full suite once at the end.
- New UI gets a disposable prototype before any mission; the codebase never holds prototype code.
- `[pp-x]` and parked questions exist only because the user said yes.
