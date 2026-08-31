# Change map — rendering rules

The diagram is plain text inside a fenced block, so it survives in a markdown file, a terminal, a PR
body, and a model's context window equally well. No mermaid, no images, no tables inside the diagram.

## Anatomy of a row

```
<module>                 <verdict>   <missions | key files>
                         + <interfaces gained>
                         − <interfaces lost>
                         ▲ <called by>
                         └ <uses>
                         → <one sentence: what this module now does>
```

| Line | Planned pass | Actual pass |
|---|---|---|
| the row | module, predicted verdict, the missions that touch it (`M2 · M4`) | module, derived verdict, its key files |
| `+` | interfaces the plan **commits to** — omit if the plan names none | exported symbols at head but not base |
| `−` | interfaces the plan says go away | exported symbols at base but not head |
| `▲ will be called by` / `▲ called by` | modules a mission will make call this one | modules that newly import this one — **a seam** |
| `└ will use` / `└ now uses` | modules a mission will make this one depend on | modules this one newly imports |
| `→` | **you write it** — what this module will do that it doesn't today | **you write it** — what it now does, after reading it |

Rows are separated by a bare `│` on its own line, so the map reads as one system rather than a list.

Only `→` is written by hand. Everything else is evidence: derived on the actual pass, attributable to a
named mission on the planned pass. Never hand-write a verdict, a symbol, an arrow or a file list.

## Verdicts

| Tag | Planned (from the missions) | Actual (derived from the diff) |
|---|---|---|
| `[NEW]` | the module doesn't exist yet; a mission creates it | the module's directory did not exist at base |
| `[GONE]` | a mission deletes it | the directory is gone at head |
| `[rewritten]` | a mission replaces how it works, not what it offers | modifications only, deletions ≥ 40% of additions |
| `[extended]` | a mission adds a file or a capability to it | existed at base, ≥ 1 new file |
| `[touched]` | a mission makes a small additive edit | small additive edits only |

## The cap: 10 rows

A task's map is capped at **10 rows**. Two collapses do the reducing, and both are findings worth stating
in one sentence rather than mechanics to hide:

- **`4× notifications/* [extended]`** — siblings sharing a verdict *and* the same key file names share a
  cause. Four domains all gaining `store.ts` is one change, not four review items. Say the cause.
- **`▲ called by`** — a module several others now call is a **seam**, not a feature. Those callers get no
  rows of their own; the arrow is the fact.

A collapsed group costs **one** row against the cap, never one per member. Everything that didn't earn a
row goes on the tail line:

```
also touched: platform/config · web/i18n · 3 generated files
```

Never drop the tail line. The diagram shows the few areas that matter; the tail is what stops it reading
as "this is everything".

## Ranking

Rank rows by how much of the *task* they carry — new modules and seams first, incidental edits last. Rank
symbols on the `+` / `−` lines with functions before types, and shorter names before longer ones: the
short name is usually the headline API (`notify`) and the long one is plumbing around it
(`createNotificationEmailDispatcher`). Cap each line at ~5 symbols and close with `· …`.

Exclude from ranking (they still count on the tail line): lockfiles, migration snapshots, generated
route/query trees, i18n catalogs, build output, and test fixtures. A generated file is volume, not change.

## The file

`docs/tasks/<task>/change-map.md`. The planned pass writes the header and `## Planned`; the actual pass
appends `## Actual` and `## Drift` and touches nothing above them.

````markdown
# Change Map: Charge API

## Planned — 2026-08-31, at task creation
_Predicted from missions 1–4. Not edited afterwards; drift is measured against it._

```
billing/charge            [NEW]        M1 · M2
                          + createCharge · chargeStatus · ChargeRecord
                          └ will use   billing/customer · platform/db
                          → owns one charge end to end: create it, persist it, expose its status
        │
billing/customer          [extended]   M2
                          + customerPaymentProfile
                          ▲ will be called by  billing/charge
                          → gains the stored-payment-profile lookup a charge needs to run
        │
web/checkout              [extended]   M3 · M4
                          + CheckoutForm
                          └ will use   billing/charge
                          → collects card details and posts them at the charge seam

also planned: platform/db (migration only)
```

## Actual — 2026-09-02, after review + doc sync (a1b2c3d..e4f5g6h)

```
billing/charge            [NEW]        charge.ts · charge.store.ts · charge.test.ts
                          + createCharge · chargeStatus · refundCharge · ChargeRecord
                          ▲ called by  web/checkout · billing/invoice
                          └ now uses   billing/customer · platform/db · platform/audit
                          → owns a charge end to end, and is now the only writer of the charges
                            table — invoicing reads through it rather than the table
        │
billing/customer          [extended]   customer.ts · customer.test.ts
                          + customerPaymentProfile
                          ▲ called by  billing/charge
                          → gains the stored-payment-profile lookup a charge runs against
        │
platform/audit            [touched]    audit.ts
                          + auditCharge
                          ▲ called by  billing/charge
                          → every charge state change now writes an audit row (M2)
        │
web/checkout              [extended]   CheckoutForm.tsx · CheckoutForm.test.tsx
                          + CheckoutForm
                          └ now uses   billing/charge
                          → collects card details and posts them at the charge seam

also touched: platform/db · 2 migration snapshots
```

## Drift — planned vs actual

| Module | Planned | Actual | |
|---|---|---|---|
| billing/charge | `[NEW]` | `[NEW]` | as planned |
| billing/customer | `[extended]` | `[extended]` | as planned |
| web/checkout | `[extended]` | `[extended]` | as planned |
| platform/audit | — | `[touched]` | **unplanned** — M2 made every charge state change write an audit row; the grill never raised auditing |
| billing/invoice | — | (caller only) | **unplanned seam** — invoicing now reads charges through `billing/charge` instead of the table |

**Read**: the task landed where it was planned, and reached one module past it. Auditing wasn't in the
grill; it is a real requirement discovered mid-mission, worth a line in `CONTEXT.md`. The `billing/invoice`
seam is the more interesting one — the charge module became the single writer of the charges table, which
is a boundary decision nobody made deliberately. Worth `/domain-model`.
````

When the change landed exactly as planned, the whole `## Drift` body is one line:

```markdown
## Drift — planned vs actual

No drift — the change landed where the plan said it would.
```

When there was no planned map:

```markdown
## Drift — planned vs actual

No planned map — nothing to compare. (Never back-filled from the diff.)
```

## Extension blocks

`/extend-task` adds missions to a task that may already have been measured. Its planned rows go in a new
dated block, never into the original:

```markdown
## Planned (extension 1) — 2026-09-05, missions 5–6
_Predicted from the missions added by /extend-task. The original `## Planned` above is untouched._
```

The actual pass computes drift against the **union** of every `## Planned*` block, and says which block a
prediction came from when it matters (`predicted in extension 1, untouched`). Merging blocks would rewrite
a prediction the task has already been judged against — that is the one edit this file never permits.

## Two rules that keep the file honest

1. **Never publish a map with an unwritten `→`.** An unfilled slot is worse than no diagram: it advertises
   that nobody read the change.
2. **Never edit `## Planned` after the fact.** It records what was believed before the work; being wrong on
   the page is exactly what makes the drift measurable.
