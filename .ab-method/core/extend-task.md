# Extend Task Workflow

## Purpose
Add missions to an existing task — when requirements change, scope grows, follow-up work surfaces, or a parked question finally gets answered.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find task and architecture doc locations.

Follow `.ab-method/rules/communication.md` for every message and `.ab-method/rules/code.md` for placement decisions.

## Process

### 1. Identify the Task
Ask which task to extend.

### 2. Read the Progress Tracker
Show the current missions (with `verify:` tags; untagged = legacy `verify: test`) and status. Note `## Placement`, `## Protected`, a legacy `## Test Plan`, and `## UI Spec` if present.

### 2.5 Resolving an Unresolved Question — swapping the black box

If `unresolved-questions.md` has `OPEN` entries, show them with their shipped placeholders:

```
Open questions:
  UQ-1 Which currencies at launch?  → shipped placeholder: USD only, src/billing/currency.ts:8
```

This is the main reason tasks get extended. When the user is resolving one:

1. **Grill the answer** with `grill-with-docs` — late answers bring their own branches.
2. **Size the swap** using the entry's *If the answer differs* line:
   - **Constant swap** — the seam takes the real value, any test that pinned the placeholder is updated to the real answer, the `TODO(UQ-n)` goes. One mission, or none if it's a one-liner done here.
   - **Real work** — the answer changes the shape. Draft proper missions; `grep -rn 'TODO(UQ-n)'` gives the blast radius.
3. **Close the entry**: `RESOLVED <date>`, the answer, and where it was applied. Keep the entry; drop the `⚠️ UQ-n` markers and its line in the tracker's Unresolved Questions section (remove the section when empty).
4. **Consider an ADR** when the answer is hard to reverse, surprising, and a real trade-off — `grill-with-docs` offers it.

Extending for other reasons never obliges the user to resolve anything. Never resolve one on their behalf.

### 3. Gather New Mission Requirements
Clear description → draft the missions. Vague → `grill-with-docs` first (it reads the domain docs and the code, so missions land in canonical terms).

### 3.5 Plan the New Missions — deepening, placement, seams, UI

Apply the same planning steps as `/create-task` § 3–5, scoped to the new work. Read `docs/seams/index.md` and the seams the new work touches first.

- **Zoom out** — fit or reshape, exactly as `create-task.md` § 3a: sketch the design the area would have if it were written today with the new work as a requirement, and compare it with what's there. When the new work would bend around the current design, plan the reshape as missions placed first and recommend it; effort is never a reason to fit. Record the verdict in `## Architecture` (append to it when it exists).
- **Deepening scan** — over the new work's blast radius (the modules it touches, their callers, the seams they cross), with the `codebase-design` red flags. Each finding becomes a refactor mission placed **before** the missions that build on it, `verify: build`.
- **Placement** — for each new capability, decide reuse / extend / extract / adopt / introduce (`.ab-method/rules/code.md`) and add a line to `## Placement`. Extractions are refactor missions placed first, like deepenings.
- **Adopt or build** — a new capability that is large or a known solved problem runs the `adopt-or-build` skill whatever its placement, exactly as `create-task.md` § 3c does; its table is appended to `## Adopt or Build`.
- **Seam design gate** — an **introduce**, or a change to a documented seam's interface, runs `create-task.md` § 3d before the missions are written.
- **Tests** — no test plan. New missions are `verify: build`; a bug fix is `verify: repro`. The protect step picks the tests once the new code exists.
- **Composed missions** — one headline per capability with its steps indented under it, split only at real boundaries (`create-task.md` § 6).
- **Prototype gate** — if the new missions add **new UI** (a new page, component or flow — not a tweak to existing UI, not a design the user supplied as Figma, not backend-only), run the `prototype-ui` skill before finalising the missions, exactly as `create-task.md`'s prototype gate does. The pick updates `## UI Spec`.

### 4. Append Missions to the Progress Tracker
Continue numbering; every new mission carries a `verify:` tag:
```markdown
## Missions
- [x] Mission 1: ... — verify: build
- [ ] Mission 2: Billing — deepen refund calc behind the billing seam — verify: build   ← NEW
  - extract the refund calc from checkout + admin
  - fold `OrderTotals` into it
- [ ] Mission 3: Refunds double-charge on retry — verify: repro                         ← NEW
```

No mission docs — missions live in the tracker. A completed task that gains new missions reruns the protect step for the new code when they finish.

#### Optional: parallel-group tags on new missions (`[pp-x]`)

Independent new missions (disjoint files, no shared types, no consumed output) can form a group, same notation as `create-task.md` § 7; they may also join a **pending** group they're independent of. **Never tag without asking the user.** Continue numbering from the highest tag; never retag completed or running groups.

### 5. Update Task Status
`Completed` → back to `Validated` (or `In dev` if work on the new missions started).

#### If the task belongs to a roadmap — reopen it there too
If the slug appears in `docs/roadmaps/*/roadmap.md` (see `relationships` in the index): flip its entry `status: done → pending` and uncheck its line (leave `plan: ✅`); a `Completed` roadmap goes back to `In dev`. Downstream tasks are not auto-reopened — extend them too if the change affects them.

### 5.5 Pre-implementation Critique — `critique-plan` on the NEW missions

Invoke `critique-plan` scoped to the new missions (existing ones as context). It pushes back only on genuine domain conflicts and is silent otherwise. Resolve any pushback (amend, or dismiss with a load-bearing reason that may become an ADR) before Step 6.

### 5.6 Extend the Planned Change Map — `change-map` (planned pass)

Invoke `change-map`'s planned pass for the new missions and append a dated block:

```markdown
## Planned (extension 1) — YYYY-MM-DD, missions 3–4
```

**Never edit the original `## Planned` or merge into it** — each block is the prediction made at that moment; drift is computed against their union. If the extension reaches a module the original never named, ask whether this is still one task (a `handoff` is often the honest answer). Skip the step when the task has no `change-map.md`; never back-fill one.

### 6. Confirm with User
"Added [N] missions. Start Mission X?"

- **Standalone task** → `/resume-task` (or continue inline): `verify: repro` missions run through `tdd`, `verify: build` missions add no test, and the protect step runs once the new missions are done.
- **Roadmap task** → `/resume-task` here, or re-run `/start-roadmap <name>` to execute every extended task in dependency order.

## Remember
- Missions go in `progress-tracker.md`, numbered sequentially, each with a `verify:` tag
- The zoom-out (fit or reshape), the deepening scan, placement (incl. adopt-or-build, introduce and the seam design gate), composed missions and (for new UI) the prototype gate apply to extensions too
- Extension change maps are dated blocks; the original `## Planned` is never edited
- `/extend-task` is where a parked `UQ-n` gets answered — never resolve one the user didn't answer
- `[pp-x]` only with the user's explicit yes
- Roadmap tasks: reopen the `roadmap.md` entry so `/start-roadmap` picks up the new work
