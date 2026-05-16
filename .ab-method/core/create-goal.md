# Create Goal Workflow

## Purpose

Produce a single, ready-to-run **goal prompt** for an autonomous `/goal`
loop (Claude Code or Codex). Same front-end work as `/create-task` —
grill, read the domain + architecture docs — but instead of a mission
list, the output is one `goal.md` you paste into `/goal`, plus a
`progress-tracker.md` the loop maintains while it runs.

`/create-goal` is a **producer** workflow. It stops once the files are
written. It does NOT execute the goal — `/goal` does that.

## When to use this instead of `/create-task`

- **`/create-goal`** — the work is one continuous objective with a
  verifiable stop condition, and you want to hand it to an autonomous
  loop and walk away (migrations, large refactors, "make all tests
  pass", build-and-verify-a-feature).
- **`/create-task`** — you want to stay in the loop, review each
  mission, and run red-green-refactor yourself.

A good goal is **bigger than one prompt but smaller than an open-ended
backlog**. If the request is genuinely several unrelated pieces of work,
recommend `/create-task` instead.

## Critical Step

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where
goal documents should be created. Paths are user-configurable.

## Process

### 1. Define the Goal — ALWAYS invoke the `grill-with-docs` skill

**Invoke the `grill-with-docs` skill on every `/create-goal` invocation.
No exceptions, no shortcut, no "the request looks clear so I'll skip it."**

A vague goal handed to an autonomous loop burns tokens going the wrong
direction for hours. The grill is the cheapest insurance there is.

The skill handles the questioning itself — do not duplicate its logic
here. It will walk the decision tree one question at a time, recommend
an answer for each, explore the codebase instead of asking when the
answer is in the code, and read `UBIQUITOUS_LANGUAGE.md` / `CONTEXT.md`
(updating them inline as terms resolve) so the goal speaks canonical
domain language.

It must pin down, before exiting, the four things every good goal
prompt needs:

- **Objective** — the work, in one line
- **Measurable end state** — what "done" looks like, *verifiably*
  (a test command exits 0, a build is clean, a route returns 200).
  If you cannot name a verifiable end state, the goal is not ready —
  keep grilling or recommend `/create-task`.
- **Feedback loops** — the verification signals the loop runs *every
  iteration* to steer itself, not just at the end: test command,
  type-check, build, lint, a screenshot/visual check, a smoke request.
  Ask the user which signals exist, which to trust, and what each one
  means. These are how the loop self-corrects mid-flight instead of
  drifting for hours. If the user is unsure, propose the obvious ones
  from `tech-stack.md` (test + type-check + build) and confirm.
- **Constraints** — rules the loop must not break (files/dirs not to
  touch, libraries to avoid, patterns to follow, perf budgets)

Plus: existing-code anchors (similar implementations to mirror, types/
services to reuse).

#### Proceed when:
- The grill has resolved every branch it walked down
- Objective, measurable end state, feedback loops, and constraints are
  all concrete
- The end state is verifiable by a command or observable check
- The user has confirmed the gathered understanding

### 2. Analyze Project Context

Before writing the goal file, ground it in the codebase:

1. **Check `.ab-method/structure/index.yaml`** for doc locations.
2. **Read architecture + domain docs** — `UBIQUITOUS_LANGUAGE.md`,
   `CONTEXT.md` (or `CONTEXT-MAP.md` + per-context files),
   `docs/architecture/tech-stack.md`, `frontend-patterns.md`,
   `backend-patterns.md`, `docs/adr/`.
3. **Analyze relevant code areas** — similar implementations, file
   organization, reusable services/types, the test command and
   framework (from `tech-stack.md` Testing section — the loop needs
   this to verify its own end state).

### 3. Create the Goal Folder

Based on `.ab-method/structure/index.yaml`, create:

```
docs/goals/[goal-name]/
  goal.md               ← paste this into /goal
  progress-tracker.md    ← the loop maintains this while it runs
```

`[goal-name]` is kebab-case, derived from the objective.

### 4. Write `goal.md`

This is the prompt the user pastes into `/goal`. Keep it tight — every
line should change what the loop does. Reference docs by path rather
than inlining them (the loop runs in the same repo and can read them);
inline only the sharp, non-obvious constraints the grill surfaced.

```markdown
# Goal: [Goal Name]

## Objective
[The work, in one line.]

## Measurable end state
[Verifiable "done" — e.g. `npm test` exits 0; `npm run build` is clean;
GET /api/orders/:id returns 200 with the new field. Name the exact
command or check.]

## Feedback loops
Run these after every meaningful change to steer yourself — not just at
the end. Each is a check, what a pass/fail signals, and what to do on
failure.
- [Command or check] — [what pass/fail means] — [action on failure]
- e.g. `npm test` — unit + integration green — fix before continuing
- e.g. `npm run typecheck` — no type errors — fix immediately
- e.g. visual check of /dashboard vs the design — layout matches — adjust styles
A red feedback loop takes priority: stop adding scope and fix it first.

## Constraints
- [Rules that must hold — dirs/files not to touch, libs to avoid,
  patterns to follow, perf budgets. Only real ones; skip filler.]

## Context
Read these before starting, and again whenever unsure. Paths come from
`.ab-method/structure/index.yaml`:
- `UBIQUITOUS_LANGUAGE.md`, `CONTEXT.md` — use canonical domain terms
- `docs/architecture/tech-stack.md` — stack, entry points, test command
- `docs/architecture/frontend-patterns.md` and/or `backend-patterns.md`
  — only the layer this goal touches
- `docs/adr/` — prior decisions; do not contradict without flagging
[Plus any existing-code anchors: "mirror src/auth/UserForm.tsx".]

## Progress tracking — DO THIS AS YOU LOOP
This goal has a notes log at `./progress-tracker.md`. The `/goal` loop
does not know about it unless told — so as you work, append to its
**Notes** section ONLY important, non-obvious things you discover:
a constraint you hit, a gotcha, an assumption you had to make, an
interface contract another part depends on. Short specific sentences.
NO generic narration ("working on X", "made progress"), NO restating
the objective, NO templated filler. If a step revealed nothing
important, write nothing. There is no checklist — the notes are a
record of what happened, not a plan.

## Keep going until
The measurable end state above holds — everything works correctly and
the verification command/check passes. Do not stop early: loop, fix,
and re-verify until it is genuinely satisfied.
```

### 5. Write `progress-tracker.md`

An empty notes log — no checklist, no tasks. The `/goal` loop fills the
**Notes** section as it runs. Write it exactly like this:

```markdown
# Goal Progress: [Goal Name]

**Status**: Not started
**Goal**: ./goal.md

## Notes
_Maintained by the /goal loop. Append important, non-obvious discovered
facts as you work — short specific sentences. No checklist, no generic
progress narration. Decision-grade facts only: a constraint hit, a
gotcha, an assumption made, an interface another part depends on._
```

### 6. Hand Off to the User

Show the goal and tell the user how to run it:

```
Goal ready: docs/goals/[goal-name]/goal.md

To run it autonomously, paste the contents of goal.md into:
  /goal <contents of goal.md>

The loop works toward the measurable end state, logging important notes
in progress-tracker.md as it goes, and keeps going until everything
works correctly. Use /goal clear to stop it.
```

## Key Principles

- **Always grill** — `grill-with-docs` runs on every invocation, no skip
- **Verifiable end state or it is not a goal** — if "done" cannot be
  checked by a command, keep grilling or fall back to `/create-task`
- **Feedback loops steer the loop** — the grill captures the checks the
  loop runs every iteration; they are how it self-corrects toward the
  goal instead of drifting
- **Producer only** — `/create-goal` writes the files and stops; the
  `/goal` loop does the work
- **The loop must be told about the tracker** — `goal.md` carries the
  explicit instruction to maintain `progress-tracker.md`
- **No checklist** — the tracker is a notes log, not a task list; the
  loop runs until the measurable end state holds
- **Notes are signal, not narration** — only important, non-obvious
  facts, as plain sentences
- **Reference docs, do not inline them** — the loop reads them in-repo

## Remember

- Check `.ab-method/structure/index.yaml` for paths
- Read UBIQ + CONTEXT + architecture docs before writing the goal file
- A goal is bigger than one prompt, smaller than a backlog
- Name the exact verification command in the measurable end state
