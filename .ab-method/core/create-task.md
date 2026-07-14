# Create Task Workflow

## Purpose

Create a focused task following the AB Method principle: one task at a time to conserve context and avoid redundant implementations.

## Core Behavior

**RESPECT USER INSTRUCTIONS AND KEEP IT SIMPLE:**

- If user provides clear requirements → Follow them exactly, don't ask unnecessary questions
- Only ask when something is genuinely unclear or ambiguous
- Don't overcomplicate simple requests
- Trust the user knows what they want

## Critical Step

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where task documents should be created.

## Process

### 0. Roadmap Awareness — standalone task or a roadmap task?

**Before grilling, figure out which kind of task this is.** Users phrase
the same request many ways ("create a task for the charge API", "plan the
next roadmap task", "let's build charges") — the workflow, not the
phrasing, decides. After reading `.ab-method/structure/index.yaml` (which
documents the task↔roadmap link in its `relationships` section), scan
`docs/roadmaps/*/roadmap.md`:

- **Roadmap task** — the requested task matches a `roadmap.md` entry
  marked `plan: ⬜ unplanned` (by slug, or clearly by scope). Then:
  1. Read that roadmap's **Objective** and the entry's `depends-on` list.
  2. Read the `progress-tracker.md` (Mission Summaries) of each **already
     planned** upstream dep — seed the grill with them so this task builds
     on what they established. If an upstream dep is still unplanned, note
     it: "‘charge-api’ depends on ‘stripe-schema’, which isn't planned
     yet — planning it first gives a better grill. Continue anyway?"
  3. Proceed through the normal steps below (grill → missions → tracker),
     writing the task under `docs/tasks/<slug>/` as usual.
  4. **On completion**, flip that task's line in `roadmap.md` from
     `plan: ⬜ unplanned` to `plan: ✅ planned`. If every task in the
     roadmap is now planned, set the roadmap **Status** to `Ready`. This
     keeps `create-roadmap` / `start-roadmap` in sync automatically — the
     user never hand-edits the roadmap.

- **Standalone task** — no roadmap matches, or the user is clearly
  starting fresh. Proceed exactly as before; ignore roadmaps entirely.

- **Ambiguous** — a partial/fuzzy match to a roadmap entry. Ask once:
  "‘payments’ roadmap has an unplanned task ‘charge-api’ — is this that
  task, or a standalone one?" Then proceed accordingly.

Everything below is identical for both kinds; only the seeding (from
upstream deps) and the completion write-back (to `roadmap.md`) differ.

### 1. Define Problem Statement — ALWAYS invoke the `grill-with-docs` skill

**Invoke the `grill-with-docs` skill on every `/create-task` invocation. No exceptions, no shortcut, no "the request looks clear so I'll skip it."**

Even when the user's request reads specific, the grill surfaces hidden assumptions, missing edge cases, terminology drift against `UBIQUITOUS_LANGUAGE.md`, and constraints the user forgot to mention. A clear-sounding prompt is not the same as a fully-specified task. The grill is cheap; an under-specified task that breeds wrong missions is not.

The skill handles the questioning itself — do not duplicate its logic here. It will:
- Walk the decision tree one question at a time
- Recommend an answer for each question
- Explore the codebase instead of asking when the answer is already in the code
- Read `UBIQUITOUS_LANGUAGE.md` / `CONTEXT.md` so the resulting task speaks the canonical domain language

It must cover, before exiting:
- Problem framing — what's broken or missing, who's affected, the trigger
- Scope — which files/components/routes/endpoints, what's in/out of scope
- Behavior — user flow, data fields, validation rules, error handling
- Constraints — patterns to follow, libraries to use/avoid, perf, testing requirements
- Existing-code anchors — similar implementations to mirror, types/services to reuse

#### How to keep the grill efficient when the user was already specific
If the user already named files, endpoints, or data shapes, treat those as given and let `grill-with-docs` *confirm* and *probe edges* rather than re-asking what was just said. The skill should still run — it just won't ask many questions.

#### Spinning off tangents during the grill
Grills wander. When a question opens a tangent that clearly deserves its **own** task — a separate concern, a different layer, work that would bloat this task's scope — do **not** chase it here and do **not** silently drop it. Capture it without derailing the current grill:

1. Invoke the `handoff` skill to write the tangent up as a handoff under `docs/handoffs/` (one file per tangent, kebab-case slug). It records the open question, the constraints already established, and why it was deferred.
2. Tell the user: "That's its own task — captured it as `<slug>`; resume it any time with `/create-task-from-handoff <slug>`."
3. Return to the branch you were grilling.

This keeps the current task tightly scoped while guaranteeing the tangent isn't lost. The handoff later becomes a task via the `create-task-from-handoff` workflow, which continues the grill exactly where the handoff left off.

#### Proceed when:
- The grill has resolved every branch it walked down
- Problem, scope, behavior, constraints, and existing-code anchors are all on the table
- The user has confirmed the gathered understanding

### 2. Analyze Project Context

**CRITICAL: Before creating any missions, understand the existing codebase:**

1. **Check `.ab-method/structure/index.yaml`** for architecture doc locations
2. **Read architecture + domain documentation** to understand:

   - `UBIQUITOUS_LANGUAGE.md` (root) - Domain glossary; use these terms verbatim in mission names and descriptions
   - `CONTEXT.md` (root) or `CONTEXT-MAP.md` + per-context `CONTEXT.md` - Bounded-context boundaries; pick the right context for the task
   - `docs/architecture/tech-stack.md` - Stack, entry points, external services, constraints, testing
   - `docs/architecture/frontend-patterns.md` - Component structure and state management
   - `docs/architecture/backend-patterns.md` - API patterns and database approach
   - `docs/adr/` (if present) - Prior decisions; do not contradict without flagging

3. **Analyze relevant code areas** based on the problem:

   - Search for similar existing implementations
   - Understand file organization patterns
   - Identify reusable components/services
   - Check for existing types/models related to the task

4. **Extract technical context for documentation**:
   - Code constraints: File naming conventions, coding standards, linting rules
   - Architecture hints: Patterns to follow, services to reuse, integration points
   - Tech stack requirements: Required libraries/frameworks, versions, dependencies
   - API constraints: Endpoint naming, authentication patterns, data validation
   - File organization: Directory structure, import/export patterns
   - Testing requirements: Coverage expectations, test frameworks, file patterns
   - Performance considerations: Caching strategies, optimization requirements

### 3. Identify Task Type

Based on problem AND project analysis:

- **Frontend**: Client-side only
- **Backend**: Server-side only
- **Full-stack**: Both frontend and backend

#### Task Complexity Assessment:

**Simple Tasks** (Single mission - combine all steps):

- Adding a single field to an existing form
- Creating a basic CRUD operation for an existing entity
- Simple component styling changes
- Adding validation to an existing field
- Creating a straightforward utility function
- Basic text/content updates
- Simple configuration changes
- Adding a single endpoint that follows existing patterns

**Complex Tasks** (Multiple missions - break down):

- New feature with multiple components and backend changes
- Implementing authentication/authorization
- Complex data relationships or new entities
- Multi-step user flows
- Integration with external services
- Major refactoring or architectural changes
- Features requiring multiple API endpoints
- Tasks involving file uploads, payments, or complex business logic

### 4. Create Task Document

Based on `.ab-method/structure/index.yaml`, create a task folder with:

```
tasks/[task-name]/
  progress-tracker.md
  sub-agents-outputs/
```

### 5. Initialize Progress Tracker with All Missions

Create `progress-tracker.md` — slim, no empty placeholder sections:

```markdown
# Task: [Task Name]

**Status**: Brainstormed
**Type**: [Frontend / Backend / Full-stack]
**Created**: YYYY-MM-DD

## Problem
[1–3 sentences from the grill-with-docs session.]

## Outcome
[1–2 sentences: what's true after this task that isn't now.]

## Constraints / Notes
[Only the non-obvious ones surfaced by grill-with-docs. Skip the section if there's nothing to say. Common contents: patterns to follow, libraries to use/avoid, perf budgets, files-to-touch hints.]

## Missions
- [ ] Mission 1: [Layer] — [one-line specific description]
- [ ] Mission 2: [Layer] — [one-line specific description]
- [ ] Mission 3: [Layer] — [one-line specific description]

## Mission Summaries
_Filled in as each mission completes. Future missions read these for context._
```

Mission lines may carry an optional `[pp-x]` parallel-group tag (see Step 7) — only when the user explicitly opted in.

**Status flow**: Brainstormed → Validated → In dev → Testing → Completed

**Do NOT include**: empty "Technical Context", "Code Guidance", "Agent Usage Tracking", "Sub-Agent Outputs", "Notes" sections with stub bullets. The grill-with-docs session already extracted what matters; everything else lives in the architecture docs (`tech-stack.md`, `frontend-patterns.md`, `backend-patterns.md`) which every mission reads.

### 6. Define All Missions Based on Task Type and Project Analysis

**IMPORTANT: Define missions based on actual project structure discovered in Step 2, not generic templates**

#### For Simple Tasks:

**Create a single compact mission that includes all necessary steps**

##### Simple Frontend Tasks:

- Mission 1: Frontend - [Complete implementation including component creation, styling, state management, and testing in one mission]

##### Simple Backend Tasks:

- Mission 1: Backend - [Complete implementation including database changes, API endpoint, validation, and testing in one mission]

##### Simple Full-stack Tasks:

- Mission 1: Full-stack - [Complete end-to-end implementation including backend API, frontend component, and integration in one mission]

#### For Complex Tasks:

**Break down into logical, sequential missions**

##### Complex Frontend Tasks:

- Mission 1: Frontend - [Core component structure based on frontend-patterns.md]
- Mission 2: Frontend - [State management and data flow]
- Mission 3: Frontend - [Advanced features and interactions]
- Mission N: Frontend - [Testing and polish]

##### Complex Backend Tasks:

- Mission 1: Backend - [Database schema and core models]
- Mission 2: Backend - [API endpoints and business logic]
- Mission 3: Backend - [Advanced features and integrations]
- Mission N: Backend - [Testing and optimization]

##### Complex Full-stack Tasks (Backend First - Default):

**Note: We start with backend to provide ready types and data for frontend (unless user prefers otherwise)**

- Mission 1: Backend - [Core data model and primary API]
- Mission 2: Backend - [Additional endpoints and business logic]
- Mission 3: Frontend - [Core UI components using backend types]
- Mission 4: Frontend - [Advanced features and user interactions]
- Mission N: Full-stack - [Integration testing and refinement]

##### Complex Full-stack Tasks (Frontend First - If User Requests):

- Mission 1: Frontend - [Core UI and user flow]
- Mission 2: Frontend - [Advanced interactions and state management]
- Mission 3: Backend - [API matching frontend requirements]
- Mission 4: Backend - [Additional backend features and validation]
- Mission N: Full-stack - [Integration and end-to-end testing]

### 7. Offer Parallel Mission Groups (`pp-x`) — OPTIONAL, strictly opt-in

After all missions are drafted, check whether some of them are **independent of each other**: they touch disjoint files, share no type/data dependencies, and none consumes another's output. Independent missions can be tagged into a parallel group and later executed concurrently in subagents instead of one at a time.

**Never tag missions on your own. ALWAYS ask the user first** — they might not want parallel execution at all. Present the proposed grouping and let them accept, adjust, or decline:

> "Missions 2 and 3 look independent (disjoint files, no shared types) — want me to mark them as a parallel group `[pp-1]` so they run concurrently in subagents? Missions 5–8 likewise as `[pp-2]`. Or keep everything sequential?"

If the user declines (or no candidates exist), all missions stay sequential — that is the default. Skip this step silently when no two missions are independent.

#### Notation

Append the tag to the mission line in `progress-tracker.md`:

```markdown
## Missions
- [ ] Mission 1: Backend — core data model and primary API
- [ ] Mission 2: Backend — notifications endpoint [pp-1]
- [ ] Mission 3: Backend — export endpoint [pp-1]
- [ ] Mission 4: Backend — shared auth middleware (dep for the rest)
- [ ] Mission 5: Frontend — settings page [pp-2]
- [ ] Mission 6: Frontend — profile page [pp-2]
- [ ] Mission 7: Frontend — billing page [pp-2]
- [ ] Mission 8: Frontend — admin page [pp-2]
```

#### Semantics

- Same tag = same group = those missions may run concurrently.
- **Untagged missions are sequential barriers**: every mission above a group must complete before the group starts, and the whole group must complete before the next mission below it starts. In the example: Mission 1 → (2 ∥ 3) → Mission 4 → (5 ∥ 6 ∥ 7 ∥ 8).
- Missions in the same group must touch **disjoint files** — no two subagents editing the same file. If you can't guarantee that, don't propose the group.
- A mission must never depend on a sibling in its own group. When in doubt, leave it sequential.
- Number groups in execution order: `pp-1`, `pp-2`, ...

### 7.5 Pre-implementation Critique — ALWAYS invoke the `critique-plan` skill

Before asking the user to validate, run the drafted mission list past the domain model. **Invoke the
`critique-plan` skill** on every `/create-task` invocation — it spins up a read-only domain critic that
challenges the missions against `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md`, ADRs, and the architecture docs.

It is **advisory and opt-in-silent**: it pushes back only on genuine conflicts (terminology drift, wrong
bounded context, an ADR contradiction, a mission that reinvents a named concept). A sound plan gets a
one-line "No objections" — that is the common outcome, so don't treat its silence as a failure to find
something. When it does push back, resolve each with the user (amend the mission, or dismiss with a
load-bearing reason the skill may capture as an ADR), then update the tracker to match before Step 8.

The skill owns the critique logic — do not duplicate it here. It reads
`.ab-method/structure/index.yaml` for where the domain model lives.

### 8. Confirm with User

Show the progress tracker with all missions defined (reflecting any changes from Step 7.5) and ask:
"Task created with status 'Brainstormed'. Missions: [list, one line each]. Ready to validate and start Mission 1?"

When the user confirms, update status to 'Validated' and proceed to Step 9.

### 9. Execute Missions — ALWAYS via the `tdd` skill

Walk through the missions list in `progress-tracker.md` from top to bottom. When the next uncompleted mission carries a `[pp-x]` tag, follow **Parallel group execution** below; otherwise run the mission sequentially as described here. For each uncompleted sequential mission:

**STEP ZERO — non-negotiable, before any Read / Edit / Write / Bash for the mission:**

> Invoke the `tdd` skill via the Skill tool: `Skill("tdd")`.

Do this **first**, every mission, no exceptions. The skill loads `SKILL.md` plus its companions (`tests.md`, `mocking.md`, `interface-design.md`, `refactoring.md`, `deep-modules.md`) which drive every subsequent decision in the mission. Writing the test first is not enough — the discipline lives in the companion files. Skipping the Skill call means writing tests from instinct instead of from the playbook; that is a workflow violation, not a shortcut. If you find yourself about to read a source file or write a test without having called `Skill("tdd")` for this mission, stop and call it.

After the skill is loaded:

1. **Load context** (every mission):
   - `UBIQUITOUS_LANGUAGE.md` and `CONTEXT.md` — use canonical terms in code, types, tests
   - `docs/architecture/tech-stack.md` (incl. Testing section)
   - `docs/architecture/frontend-patterns.md` and/or `backend-patterns.md` — only the ones the mission touches
   - `docs/adr/` — prior decisions, do not contradict without flagging
   - Mission summaries from `progress-tracker.md` for what previous missions left behind

2. **Grill if vague** — if the mission's one-line description is fuzzy, invoke the `grill-with-docs` skill before implementing.

3. **Run red-green-refactor under the loaded `tdd` skill:**
   - Write the failing test first (uses framework + patterns from `tech-stack.md` Testing section)
   - Make it pass with the smallest change
   - Refactor with tests green
   - The `tdd` skill's companion files drive the loop — consult them, don't improvise

4. **Optionally deploy a subagent** if the mission warrants it (large surface, specialized domain, infra). Pick by need — backend/UI/testing/quality/research — not by mission type. Default is direct implementation inside the `tdd` loop. A subagent does not exempt you from Step Zero — load `tdd` in the parent context first so the summary you receive can be evaluated against the playbook.

5. **No mission docs.** Missions live as one-line entries in `progress-tracker.md`, nothing more. The `tdd` skill drives the work; the test file *is* the spec.

6. **On completion**, append a tight technical summary to `progress-tracker.md`:
   ```markdown
   ### Mission N: [Description]
   **Status**: Completed
   - **Files**: [paths, only what changed]
   - **Built**: [what now exists]
   - **Tests**: [test files added; framework]
   - **Patterns**: [non-obvious patterns or libraries — skip if obvious]
   - **Integrates with**: [what next missions need to know]
   - **Gotchas**: [only real ones — skip the bullet otherwise]
   ```
   Skip any bullet with nothing real to say. A 4-line summary for trivial work is correct.

7. **Update CLAUDE.md** only if the mission introduced new features/pages, refactored structure, new patterns, new tech, build/deploy changes, or major API changes. Skip for minor fixes, styling, content updates, or trivial CRUD.

8. **Prompt the user** before moving to the next mission: "Mission N completed. Ready to start Mission N+1?"

When all missions are done, run the **post-implementation review** (below), then set task status to `Completed`.

#### Post-implementation review — invoke the `review-implementation` skill

Once the last mission is green, **invoke the `review-implementation` skill** on the task's diff (the
cohesive change across all missions). It spins up three read-only critics in parallel —
`cleaner-architecture`, `slop-defender`, `reusability-inspector` — that push back only on real issues
(shallow modules the change introduced, AI code-slop, reinvented logic). A clean diff produces no
findings; that's the normal case.

`/create-task` is interactive, so run the skill in **interactive mode**: it presents findings grouped by
lens (each marked `safe-fix` / `needs-judgment`) and you apply what the user approves, keeping tests
green. (Autonomous runs via `/start-task` instead auto-apply safe fixes and write a `review.md` — that's
the skill's other mode.) The skill owns the review logic; don't duplicate it here.

#### Documentation sync — invoke the `sync-architecture` skill

After the review, **invoke the `sync-architecture` skill** on the same task diff. It spins up one
read-only detector that finds what the change introduced that the architecture/domain docs don't yet
capture — new endpoints, patterns, dependencies, domain terms, ADR-worthy decisions — each routed to the
exact doc it belongs in. A task that introduced nothing doc-worthy produces no deltas; that's the normal
case. Run it in **interactive mode**: it presents the proposed doc additions (marked `safe-add` /
`needs-judgment`) and you apply the `safe-add`s the user approves, while `needs-judgment` items (prose
deprecation, domain reshapes, ADRs) are pointed at `/update-architecture` / `/domain-model` rather than
applied. This replaces the ad-hoc "remember to update the docs" step — the skill owns the detection and
routing logic. (Autonomous runs via `/start-task` apply append-only safe-adds and defer the rest.)

#### Parallel group execution (`pp-x` missions)

When the next uncompleted mission is tagged `[pp-x]`, collect **all uncompleted missions sharing that tag** and run them as one concurrent batch:

1. **STEP ZERO still applies** — invoke `Skill("tdd")` in the parent context first. Subagents don't exempt you; you need the playbook loaded to evaluate the summaries they return.
2. **Confirm with the user** before launching: "Missions N–M are grouped `[pp-x]` — run them in parallel now, or one at a time?" The tag records *permission*, not *obligation*; the user may still choose sequential.
3. **Load shared context once** (UBIQ, CONTEXT, tech-stack, relevant patterns, ADRs, prior mission summaries), then **spawn one subagent per mission in a single message** so they actually run concurrently. Each subagent prompt must include:
   - The mission's one-line objective plus the relevant constraints/notes from the tracker
   - The instruction to follow the `tdd` red-green-refactor discipline: failing test first, smallest change to green, refactor
   - Which architecture/domain docs to read (paths from `.ab-method/structure/index.yaml`)
   - The hard boundary: touch **only this mission's files** — its group siblings are running concurrently
   - Where to write its detailed output: `docs/tasks/[task-name]/sub-agents-outputs/mission-N-[slug].md`, returning only a tight technical summary
4. **Verify the merge** when all subagents return: run the test suite once at the parent level to catch cross-mission breakage. If anything conflicts, fix it in the parent context before proceeding.
5. **Append each mission's technical summary** to the tracker (same format as § 9.6, one block per mission) and mark every mission in the group complete.
6. **Prompt the user once per group**, not per mission: "Missions N–M (`[pp-x]`) completed in parallel. Ready to continue with Mission M+1?"

## Key Principles

- **Always grill** — `/create-task` invokes `grill-with-docs` on every invocation, no skip
- **Always TDD, skill loaded first** — every mission begins with `Skill("tdd")` before any other tool call; the playbook in the companion files is what makes it TDD, not the act of writing a test first
- **No mission docs** — missions live as one-line entries in `progress-tracker.md`, completion summaries are tight bullets
- **One task at a time** — focus, conserve context
- **All missions defined upfront** — full roadmap at task creation
- **Backend first for full-stack** — types and data ready for the frontend
- **Subagents only when warranted** — direct implementation is the default; pick agents by need, not by mission type
- **Parallel groups are opt-in** — never tag missions `[pp-x]` without asking the user; sequential is the default, untagged missions are barriers, group siblings must touch disjoint files

## Vague vs. specific

Vague requests trigger `grill-with-docs`. Examples:
- "Make it better" / "Fix the bug" / "Add some tests" / "Improve performance" / "Refactor the code"

Specific requests skip `grill-with-docs` and go straight to Step 2:
- "Add inline validation errors to the login form"
- "Fix the 404 when deleting users from /admin/users"
- "Add unit tests for `paymentService.calculateTax`"
- "Add a required email field to the /register form, validate format, follow UserForm pattern"

## Remember

- Always grill, always TDD, never write a mission doc
- Check `.ab-method/structure/index.yaml` for paths
- Read UBIQ + CONTEXT + architecture docs before defining missions, and again before each mission's TDD loop
- Every mission must specify a layer (Frontend/Backend/Full-stack) and a concrete one-line objective
- Backend-first for full-stack tasks (types feed the frontend)
- `[pp-x]` tags only exist because the user said yes in Step 7 — and even then, confirm again before launching a group in parallel
- Each mission's tests + technical summary together carry the context forward — no other artifacts
