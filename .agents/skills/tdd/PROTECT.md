# The Protect Step

Decide what must not break, **after the code exists**, and protect only that. Design comes first; tests follow the design instead of steering it.

Every task runs it once, after its last mission and the full suite: `create-task` § 11, `resume-task` § 8, `start-task` § 5a, and per task in `start-roadmap`. Interactive runs confirm the list with the user; autonomous runs don't stop.

Bug fixes don't come here: they are `verify: repro` missions, test first ([SKILL.md](SKILL.md)). The test-after rules in SKILL.md (forced red, the seam as the boundary) drive the steps below.

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** for task, seam and doc locations (project root first; plugin installs read the bundled copy at `../../../.ab-method/` relative to this file). Follow `.ab-method/rules/communication.md` for every message and `.ab-method/rules/code.md` for test code.

## 1. Target

The task's commit range and its `progress-tracker.md` mission summaries (Files / Built).

## 2. Context

- `docs/seams/index.md` and the seam docs the diff touches — their **Interface** is where tests go
- The Testing section of `docs/architecture/tech-stack.md` — framework, file patterns, commands
- Nearby existing tests and test utilities — extend before adding
- `UBIQUITOUS_LANGUAGE.md` / `CONTEXT.md` so test names use domain terms

## 3. Choose — the fewest tests that protect the most

List what the change made true that a user would notice if it broke, then keep only:

- **seam behaviour** — what a seam's interface promises its callers (the seam docs the diff touched or introduced),
- **domain rules** — calculations, permissions, money and data-loss paths, behind the module that owns them,
- **one critical flow** end to end, when the task changed one.

Drop anything that only proves the framework works, duplicates an existing test, reaches past an interface into internals, or would break on a harmless refactor. Styling and wiring are never on the list. No coverage targets.

```
Protect for <task>:
  UC1 Partial refund past the window is rejected → billing seam (refund.test.ts)
  UC2 Admin refunds an order end to end          → e2e
Skipped: RefundBadge rendering, Zod schema shape (no user-visible failure)
```

**Interactive:** show the list and wait for confirmation. **Autonomous:** proceed; the list goes in the tracker for the review stage to challenge.

## 4. Write the tests

For each use case:

- Write the test through the seam's interface (or the owning module's), asserting what the caller observes.
- **Prove it can fail.** There is no natural red after the fact: break the behaviour temporarily (invert the rule, return the wrong value, revert the line), run the test, confirm it fails **for the right reason**, restore the code, confirm green. A test you never saw fail protects nothing.
- Run the focused tests; the full suite runs once at the end.

**A test that stays red against the real code has found a defect.** That's the step working. Small and inside the task's scope → fix it forward: the fix goes in its own `fix(<task>): <what>` commit (separate from the tests), and `## Protected` notes it next to the use case. Too large, or outside the task → stop and report it; interactive runs ask the user.

Use a subagent only for a large surface; give it the chosen list, not a mandate for "comprehensive" coverage.

## 5. Record it

In the task's `progress-tracker.md`, fill `## Protected` (create it if the tracker predates it):

```markdown
## Protected
- UC1 Partial refund past the window is rejected → billing seam · `src/billing/refund.test.ts`
  red: broke the window check → "expected RefundWindowClosed, got Refund" · green after restore
- UC2 Admin refunds an order end to end → e2e · `e2e/refund.spec.ts`
  red: removed the row action handler → "button 'Refund' not found" · green after restore
```

Continue `UCn` numbering from a legacy `## Test Plan` if the tracker has one. Note anything you could not verify, and any defect found and fixed (`fixed: <what> — <commit>`). The red/green lines are the PR's Evidence (`pr` skill).

**Autonomous runs** commit the tests and the tracker update as `test(<task>): protect <scope>`; a defect fix is its own `fix(<task>)` commit, made first.

## Remember

- Tests go through seam interfaces and domain rules, after the code exists
- Fewest valuable tests; justify every one by what breaks for the user
- Prove each test can fail before trusting it
- Bug fixes are `verify: repro` missions, not this step
