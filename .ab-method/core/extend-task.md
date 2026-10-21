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
Show the current missions (with `verify:` tags; untagged = `verify: test`) and status. Note `## Placement`, `## Test Plan` and `## UI Spec` if present.

### 2.5 Resolving an Unresolved Question — swapping the black box

If `unresolved-questions.md` has `OPEN` entries, show them with their shipped placeholders:

```
Open questions:
  UQ-1 Which currencies at launch?  → shipped placeholder: USD only, src/billing/currency.ts:8
```

This is the main reason tasks get extended. When the user is resolving one:

1. **Grill the answer** with `grill-with-docs` — late answers bring their own branches.
2. **Size the swap** using the entry's *If the answer differs* line:
   - **Constant swap** — the seam takes the real value, its placeholder test becomes the real test, the `TODO(UQ-n)` goes. One mission, or none if it's a one-liner done here.
   - **Real work** — the answer changes the shape. Draft proper missions; `grep -rn 'TODO(UQ-n)'` gives the blast radius.
3. **Close the entry**: `RESOLVED <date>`, the answer, and where it was applied. Keep the entry; drop the `⚠️ UQ-n` markers and its line in the tracker's Unresolved Questions section (remove the section when empty).
4. **Consider an ADR** when the answer is hard to reverse, surprising, and a real trade-off — `grill-with-docs` offers it.

Extending for other reasons never obliges the user to resolve anything. Never resolve one on their behalf.

### 3. Gather New Mission Requirements
Clear description → draft the missions. Vague → `grill-with-docs` first (it reads the domain docs and the code, so missions land in canonical terms).

### 3.5 Plan the New Missions — placement, tests, UI

Apply the same planning steps as `/create-task`, scoped to the new work:

- **Placement** — for each new capability, decide reuse / extend / extract (`.ab-method/rules/code.md`) and add a line to `## Placement`. An extraction becomes a refactor mission placed **before** the missions that build on it, tagged `verify: build`.
- **Test Plan** — append any new use case worth protecting to `## Test Plan` (`UCn` numbering continues). Everything else is `verify: build`.
- **Prototype gate** — if the new missions add **new UI** (a new page, component or flow — not a tweak to existing UI, not a design the user supplied as Figma, not backend-only), run the `prototype-ui` skill before finalising the missions, exactly as `create-task.md`'s prototype gate does. The pick updates `## UI Spec`.

### 4. Append Missions to the Progress Tracker
Continue numbering; every new mission carries a `verify:` tag:
```markdown
## Missions
- [x] Mission 1: ... — verify: test (UC1)
- [ ] Mission 2: ... — verify: build
- [ ] Mission 3: Extract refund calc into billing module — verify: build   ← NEW
- [ ] Mission 4: Enforce refund window — verify: test (UC3)                ← NEW
```

No mission docs — missions are one-line entries in the tracker.

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

- **Standalone task** → `/resume-task` (or continue inline): `verify: test` missions run through `tdd`, `verify: build` missions add no test.
- **Roadmap task** → `/resume-task` here, or re-run `/start-roadmap <name>` to execute every extended task in dependency order.

## Remember
- Missions go in `progress-tracker.md`, numbered sequentially, each with a `verify:` tag
- New placement decisions, Test Plan entries and (for new UI) the prototype gate apply to extensions too
- Extension change maps are dated blocks; the original `## Planned` is never edited
- `/extend-task` is where a parked `UQ-n` gets answered — never resolve one the user didn't answer
- `[pp-x]` only with the user's explicit yes
- Roadmap tasks: reopen the `roadmap.md` entry so `/start-roadmap` picks up the new work
