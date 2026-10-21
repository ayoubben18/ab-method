# Code

Rules for writing code inside any AB Method workflow. Applied while writing, not only at review.

## Placement before code

Before adding a capability, decide where it lives:

- **Reuse** — something in the codebase already does it. Call it.
- **Extend** — a module owns this concern. Add to it, behind its existing interface.
- **Extract** — the logic exists inline in one or more places, or the new code would be its second copy. Move it into one module first, point the existing callers at it, then build on it.

Never add a second inline copy of logic that already exists. When extraction is needed, it is its own step done first: make the change easy, then make the easy change.

## Write less

- **Deletion test.** If removing a line, parameter, wrapper or branch loses nothing, don't write it.
- **No speculative generality.** No options, generics, factories or extension points with a single caller.
- **No defensive checks for impossible states.** Validate at trust boundaries only.
- **Match the surrounding code.** Its naming, structure and idioms win over your preferences.

## Comments

- Comment only the non-obvious **why**: a constraint, a workaround, a gotcha.
- Never narrate **what** the code does, echo a signature, or add section banners.
- Default is no comment. A name that explains itself beats a comment that explains a name.

## Readability

- Names say what a thing is in the domain's words (`UBIQUITOUS_LANGUAGE.md`).
- Short functions with one job; early returns over nested branches.
- The vocabulary for module depth, seams and interfaces lives in the `codebase-design` skill.
