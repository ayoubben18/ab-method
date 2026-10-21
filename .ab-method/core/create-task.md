# Create Task Workflow

## Purpose

Turn a problem into one focused task: a grilled problem statement, a placement decision, a small test plan, and an ordered list of one-line missions, then run them.

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

Run the `grill-with-docs` skill on every invocation. When the user was already specific, it confirms and probes edges instead of re-asking, so it stays short. Before exiting it must cover: problem framing, scope (in/out), behavior (flow, data, validation, errors), constraints, and existing-code anchors.

- **Tangents** that deserve their own task: capture with the `handoff` skill under `docs/handoffs/`, tell the user `resume with /create-task-from-handoff <slug>`, return to the grill.
- **Questions the user genuinely can't answer yet** (rare): the skill parks them in `unresolved-questions.md` with an agreed placeholder behind a `TODO(UQ-n)` seam. Never park on the user's behalf; anything with a sane default is a default noted in Constraints. Parking is an open decision inside this task; a handoff is a separate task.

Proceed when every branch is resolved or explicitly parked and the user has confirmed the understanding, including any placeholders.

### 2. Project context

Read, using the paths from `index.yaml`:

- `UBIQUITOUS_LANGUAGE.md` and `CONTEXT.md` (or `CONTEXT-MAP.md` + the relevant per-context `CONTEXT.md`). Use their terms verbatim in missions.
- `docs/architecture/tech-stack.md`, including its Testing section.
- Patterns: `docs/architecture/<layer>/index.md`, then **only the topic files this task touches**. Legacy repos: if the folder is missing but `frontend-patterns.md` / `backend-patterns.md` exists, read that and suggest `/ab-cleanup` once.
- `docs/adr/` in the area you're touching. Don't contradict an ADR without flagging it.

Then search the code: similar implementations to mirror, modules that already own this concern, types and services to reuse, inline logic the task would duplicate.

### 3. Placement decision

For every capability the task adds, decide where it lives per `rules/code.md`:

- **reuse** an existing module or component,
- **extend** the module that owns the concern, behind its interface, or
- **extract** logic that exists inline (or would get a second copy) into one module, and point existing callers at it.

Record each decision in the tracker's `## Placement`. Every extraction becomes a **refactor mission placed first**, `verify: build`: existing tests stay green, no new tests. Be ambitious here. If the right move is to pull a concern into its own module before building on it, plan that, rather than adding the feature inline.

### 4. UI prototype gate

If the task adds **new UI** (a new page, component or flow), invoke the `prototype-ui` skill now, before writing missions. It builds disposable HTML variants in `docs/tasks/<task>/prototype/`, the user picks one, and the skill writes the tracker's `## UI Spec`. Missions implement that spec.

Skip it for tweaks to existing UI, backend-only tasks, or when the user supplied a design (Figma, screenshot, mockup).

### 5. Test plan

List in `## Test Plan` every use case worth a test, and nothing else:

- domain rules and calculations,
- critical user flows (for frontend work: one integration or E2E test for the main flow),
- reproduced bugs.

Each entry names its boundary and the mission that writes it. No test is written outside this list. Styling, wiring, config and refactors are verified by typecheck, lint, build and the existing tests. Keep the list short: a plain feature usually needs two or three entries.

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
- refund button → reuse `ui/ConfirmButton`

## Test Plan
- UC1 partial refund past the window is rejected → service boundary (mission 2)
- UC2 admin refunds an order end to end → e2e (mission 4)

## UI Spec
Picked "Dense": inline row action, no modal. Reference: docs/tasks/admin-partial-refunds/prototype/
(Only when prototype-ui ran.)

## Missions
- [ ] Mission 1: Backend — extract refund calc into billing module — verify: build
- [ ] Mission 2: Backend — enforce refund window ⚠️ UQ-1 — verify: test (UC1)
- [ ] Mission 3: Frontend — refund row action in orders table — verify: build
- [ ] Mission 4: Full-stack — wire admin refund flow — verify: test (UC2)

## Mission Summaries
_Filled in as each mission completes._
```

Mission rules:
- One line each: layer, a concrete objective in domain terms, then `— verify: test (UCn)` or `— verify: build`. Styling, wiring, config and refactor missions are `verify: build`.
- Simple tasks get one mission. Complex ones are split into logical, sequential missions derived from the real code structure, not a template.
- Full-stack defaults to backend first so types and data exist for the frontend, unless the user prefers otherwise.
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

Show, briefly: the missions with their `verify:` tags, the placement, the test plan, the blast radius ("6 modules, 1 new"), and any placeholders with the missions that build on them. Ask to validate. On yes, set status `Validated`.

### 10. Execute missions

Walk the missions top to bottom; set status `In dev`. A `[pp-x]` mission starts a parallel group (below).

**`verify: test` missions** (and untagged missions from older trackers):
1. Invoke `Skill("tdd")` before anything else. The playbook drives the mission, not instinct.
2. Load the domain docs, tech-stack Testing, the pattern topics this mission touches, relevant ADRs, and prior Mission Summaries.
3. Write the test for the mission's Test Plan entry: meaningful red, smallest change to green, local refactor under `rules/code.md`.

**`verify: build` missions**:
1. Load the same context.
2. Implement under `rules/code.md`. No new test.
3. Run typecheck, lint, build and the existing tests closest to the change. A refactor mission must leave them green unchanged.

**Every mission:**
- If the description is fuzzy, run `grill-with-docs` first.
- `⚠️ UQ-n`: read the entry and ask once whether the answer has landed. If it has, mark it `RESOLVED` and build the real thing. If not, build the **recorded placeholder** exactly, behind one named seam marked `// TODO(UQ-n): <question> — docs/tasks/<task>/unresolved-questions.md`, and update the entry's **Marker** line with the path. Never fabricate data to route around it; if the mission can't proceed, say the question is blocking.
- If a UI Spec exists, implement it from the picked variant in `prototype/`, using the project's real components and tokens.
- Run focused tests only. The full suite runs once, after the last mission.
- Use a subagent only when the mission warrants it (large surface, specialised domain). Load `tdd` in the parent first for `verify: test`.
- Append the summary:
  ```markdown
  ### Mission N: [Description]
  - **Files**: changed paths
  - **Built**: what now exists
  - **Verified**: `test` — protected use case + red/green evidence | `build` — checks run
  - **Integrates with**: what later missions need
  - **Placeholders**: `UQ-n → <seam>` at `<path:line>` (only if any)
  - **Gotchas**: only real ones
  ```
  Skip bullets with nothing to say.
- Update `CLAUDE.md` only for new features or pages, structural changes, new tech or major API changes.
- Ask before the next mission: "Mission N done. Start Mission N+1?"

#### Parallel group execution

1. Load `tdd` in the parent if any sibling is `verify: test`. Confirm with the user: run in parallel now, or one at a time?
2. Load shared context once, then spawn **one subagent per mission in a single message**. Each prompt carries: the objective, its `verify:` tag and Test Plan entry, the relevant constraints and docs paths, `rules/code.md`, the rule to touch only its own files, and, for `⚠️ UQ-n`, the entry verbatim plus "build the recorded placeholder behind a `TODO(UQ-n)` seam, report its path, don't edit `unresolved-questions.md`". Detailed output goes to `sub-agents-outputs/mission-N-<slug>.md`; it returns a tight summary.
3. When they return, run the tests once in the parent and fix any cross-mission breakage.
4. Append every summary, tick the group, and write any reported seam paths into `unresolved-questions.md`. The parent is the only writer of the tracker and that file.
5. Prompt once per group.

### 11. Post-implementation

After the last mission:

1. **Full suite**, once. Fix anything red before reviewing. Set status `Testing`.
2. **`review-implementation`** (interactive): three critics on the task diff. Apply what the user approves, keeping tests green.
3. **`sync-architecture`** (interactive): finds what the diff introduced that the docs don't capture and proposes **in-place** edits that must pass `check-docs` (`rules/docs.md`). Apply the approved ones. Domain reshapes and ADRs go to `/update-architecture` / `/domain-model`.
4. **`change-map` actual pass**: appends `## Actual` + `## Drift` from the real commit range. Walk the drift with the user (unplanned modules, predicted-but-untouched ones, escalated verdicts) and route it. It never fixes anything itself. `## Actual` heads the PR body.
5. Delete `docs/tasks/<task>/prototype/` if it exists.
6. Set status `Completed`.

Open `UQ-n` entries don't block completion; they ship as recorded placeholders. List them in the closing message with their seams and point at `/extend-task` to swap answers in.

## Remember

- `index.yaml` first; rules files for talk and code.
- Placement before missions; extractions first.
- Tests only for Test Plan entries; full suite once at the end.
- New UI gets a disposable prototype before any mission; the codebase never holds prototype code.
- `[pp-x]` and parked questions exist only because the user said yes.
