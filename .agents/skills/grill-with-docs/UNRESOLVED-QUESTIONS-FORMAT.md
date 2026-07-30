# unresolved-questions.md Format

The parking lot for questions the grill raised and the user genuinely could not
answer yet. Each parked question ships as a **black box**: a named placeholder in
the code, marked `TODO(UQ-n)`, swappable once the answer arrives.

This file is rare. Most grills produce none. A grill that produces four is a grill
that gave up too early — see **When to park** in [SKILL.md](./SKILL.md).

## Where it lives

Next to the task's `progress-tracker.md` — in an AB Method project, that is
`docs/tasks/<task-name>/unresolved-questions.md` (confirm the path in
`.ab-method/structure/index.yaml`; it is user-configurable).

If the grill isn't attached to a task yet (standalone grill, or the task folder
doesn't exist), keep the parked questions in the conversation and write the file
the moment the task folder is created. Never scatter them elsewhere.

## Structure

```md
# Unresolved Questions: Charge API

Questions this task could not close. Each ships as a black box — a named
placeholder marked `TODO(UQ-n)` — until the answer arrives. Missions that
build on one carry the matching `⚠️ UQ-n` marker in `progress-tracker.md`.

## UQ-1 — Which currencies at launch? · OPEN

- **Parked**: 2026-07-30
- **Why it's open**: waiting on the finance team's provider contract.
- **Placeholder**: USD only; the currency is a single named constant, not
  inlined at call sites.
- **Marker**: `TODO(UQ-1)` — `src/billing/currency.ts:8`
- **Missions**: 2, 4
- **If the answer differs**: multi-currency needs a rate source and a decimal
  policy per currency — new work, not a constant swap. Flag for `/extend-task`.
- **Options raised**: (a) USD only, widen later (b) USD + EUR now
  (c) currency table from day one

## UQ-2 — Refund window: fixed 30d or per-merchant? · RESOLVED 2026-08-04

- **Answer**: per-merchant, defaulting to 30 days.
- **Applied**: Mission 6 — `src/billing/refund.ts`, `TODO(UQ-2)` removed,
  placeholder test replaced with the real rule.
```

## Rules

- **One heading per question**, numbered `UQ-1`, `UQ-2`, … in the order they were
  parked. Numbers are permanent — never reused, never renumbered, because they are
  referenced from code comments and mission lines.
- **Status lives in the heading**: `· OPEN` or `· RESOLVED YYYY-MM-DD`. Resolved
  entries stay in the file — the record of what was guessed and what it became is
  the point.
- **The question is a question.** One line, answerable. "How should refunds work?"
  is a grill that stopped too soon; "Is the refund window fixed or per-merchant?"
  is a parked question.
- **`Why it's open` names the blocker**, not the topic. "Waiting on legal" /
  "needs production data we don't have" / "product hasn't decided". If you cannot
  write this line, the question is not blocked — it is unasked. Go ask it.
- **`Placeholder` describes shipped behaviour**, in one line, in the user's terms.
  Someone reading only this file must know what the system currently does.
- **`Marker` lists every code site** carrying the `TODO(UQ-n)` comment, with paths.
  Keep it accurate — it is what makes `grep -rn 'TODO(UQ-'` trustworthy.
- **`If the answer differs`** is the honest blast radius: is this a constant swap,
  or does a different answer invalidate a mission? Say which. This is the line the
  user reads when deciding whether to unblock the question now or later.
- **`Options raised`** only when the grill actually surfaced alternatives. Skip it
  rather than inventing choices.
- **Never park a question that changes the domain language.** A term that must be
  named to write the code is not deferrable — settle it in `CONTEXT.md` and grill
  the behaviour behind it instead.

## Choosing the placeholder

The placeholder is a stand-in, not a guess dressed as a decision:

1. **Prefer inert over plausible.** Empty, disabled, no-op, or "smallest thing that
   keeps the flow whole" beats a confident-looking business rule the user never
   approved. A wrong rule that looks deliberate is the failure mode this whole
   mechanism exists to prevent.
2. **One seam, not many.** Put the black box behind a single named constant,
   function, or config value. If the placeholder shows up at five call sites, the
   design is wrong — extract the seam first.
3. **Mark it where it lives**, always in this shape, so one grep finds every site:
   ```ts
   // TODO(UQ-1): currencies undecided — docs/tasks/charge-api/unresolved-questions.md
   const SUPPORTED_CURRENCIES = ['USD'] as const; // placeholder
   ```
4. **Pin it with a test.** The placeholder behaviour gets a test like any other, and
   the test names the UQ (`describe('refund window (placeholder, UQ-2)')`). Swapping
   the answer in later should turn that test red on purpose — that is the signal the
   black box was actually load-bearing.
5. **Never fake data flow.** A placeholder returns a defined empty/default value; it
   does not fabricate records, invent IDs, or silently swallow the case. If a mission
   cannot proceed without inventing data, that mission is blocked — say so instead of
   parking it.
