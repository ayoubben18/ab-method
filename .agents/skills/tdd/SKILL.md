---
name: tdd
description: Testing playbook — test-first for bug fixes, test-after (with a forced red) for everything else, always through a seam's interface. Use when fixing a bug test-first, when the protect step writes a task's tests after the code exists, when the user mentions "red-green-refactor", or wants integration tests.
---

# Test-Driven Development

Every test must protect a real use case, be seen failing for the right reason, and pass because the production code does the right thing. Work through the steps below in order, once per use case.

Two modes, one standard:

- **Test-first** — bug fixes (`verify: repro` missions). The reproducing test fails before the fix, then the fix makes it green.
- **Test-after** — everything else, in the protect step ([PROTECT.md](PROTECT.md)) once the code exists. The design is settled first; the test then pins what must not break. The red is forced: break the behaviour, watch the test fail, restore it.

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** for where the domain docs live — paths are user-configurable. Look for it under the project root first; only if the project has none (AB Method installed as a plugin), read the bundled default at `../../../.ab-method/structure/index.yaml` relative to this `SKILL.md`. Every path the index names is relative to the project root. From there, read `CONTEXT.md` and `UBIQUITOUS_LANGUAGE.md` (if they exist) so test names match the project's domain language, the Testing section of `tech-stack.md` for the framework and conventions, and respect the ADRs in the area you're touching.

See [tests.md](tests.md) for worked examples of each step and [mocking.md](mocking.md) for where mocks belong.

## 0. Is this a test the task should write?

Inside an AB Method task, tests come from two places only: a `verify: repro` mission (the bug's reproducing test) and the protect step's list (`## Protected`). A feature or refactor mission writes no test: it verifies through typecheck/build and the existing tests. If a use case clearly deserves a test mid-mission, note it in the mission summary for the protect step instead of adding it silently. Legacy trackers with a `## Test Plan` keep their list. Standalone use is unaffected.

## 1. Define the use case before writing the test

State the starting condition, the action, and the observable result. Ground it in a requirement, actual usage, or a reproduced bug — never in what the code happens to do. The use case is not complete until you can say concretely what breaks for the user if this behavior regresses.

## 2. Check existing coverage first

Read the nearby tests and the relevant implementation. Extend an existing test when it already exercises the scenario. Add another only when it protects a distinct failure mode.

## 3. Choose the smallest realistic test boundary

Test calculations directly, component interactions through the component, and critical application wiring through integration or E2E tests. Mock external boundaries only where necessary. Exercise the production code responsible for the behavior — never a copy, a stub of it, or a private helper reached around the interface.

Inside an AB Method project, the boundary is a **seam's interface** (`docs/seams/`) or the module that owns the domain rule. A test that reaches past the interface into internals breaks on harmless refactors and is the wrong shape.

When the shape of that boundary is itself in question (how deep the module is, where the seam belongs, what the interface should expose), call the Skill tool with "codebase-design" for the vocabulary. It is a reference to consult, not a session to run.

## 4. Require meaningful red, then green

The test must fail **because the required behavior is missing or broken** — not because of a typo, a missing import, a bad fixture or a wrong path.

- **Test-first (bug fix):** run the reproducing test before the fix and confirm that red. Implement the smallest fix, rerun until green, then refactor the code you just touched with the test as the safety net.
- **Test-after:** the behaviour already works, so force the red. Break it temporarily (invert the rule, return the wrong value, revert the line), run the test, confirm it fails for the right reason, restore the code, confirm green. A test you never saw fail protects nothing.
- **Pinning before a refactor:** write the test-after tests on the current behaviour first, then change the implementation and keep them green.

## 5. Make assertions independent of the implementation

Derive expected results from the use case, not from the code. Assert the submitted value, the visible result, the persisted state, or a meaningful interaction. Exact values belong where exactness matters, such as preserving prompt text. Multiple assertions are appropriate when they jointly prove one use case.

## 6. Challenge each test's value

For every test, ask:

- What plausible broken implementation would still pass it?
- Does another test already catch the same failure?
- Would a harmless refactor break it?

Rewrite weak assertions and remove tests with no distinct protection. For substantial changes, use a second agent to challenge the grouped findings against source evidence.

## 7. Keep execution deterministic and verification bounded

Control external data and time when needed, wait for observable outcomes instead of sleeping, and account for platform differences. Run only the focused tests for what you changed, plus the relevant integration checks; the full suite runs once, at the end of the task, not after every change.

Finish with three things stated: the behavior now protected, the evidence of red and green (the failing output, then the passing run), and any verification limits — what you could not run or could not observe.

## Autonomous runs

When no user is there to confirm (`ab-start-task`, `ab-start-roadmap`, a mission subagent), the bug report or the diff plus the seam docs are the source of the use case and the boundary. If no seam fits, take the narrowest public interface that exposes the behavior and name it, so the review stage can challenge it. The red/green evidence and verification limits from step 7 go in the mission summary (bug fix) or `## Protected` (protect step).
