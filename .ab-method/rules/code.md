# Code

Rules for writing code inside any AB Method workflow. Applied while writing, not only at review. They follow John Ousterhout's *A Philosophy of Software Design*; the vocabulary (module, interface, depth, seam) and the red flags live in the `codebase-design` skill.

## Strategic, not tactical

Working code isn't enough. Each change leaves the design a little better than it found it: deepen the module you touch, fix the leak you route around. A shortcut taken on purpose is named in the mission summary, never left silent.

## Seams first

Read `docs/seams/index.md` (path from `.ab-method/structure/index.yaml`) before placing code. A capability a seam owns goes **through** that seam, never around it: no `fetch` beside the data-fetching seam, no `process.env` beside the configuration seam. If the seam's interface can't express what you need, change the interface (that is a seam change: it goes through the seam design gate), don't bypass it.

## Placement before code

Before adding a capability, decide where it lives:

- **Reuse** — something in the codebase already does it. Call it.
- **Extend** — a module owns this concern. Add to it, behind its existing interface.
- **Extract** — the logic exists inline in one or more places, or the new code would be its second copy. Move it into one module first, point the existing callers at it, then build on it.
- **Introduce** — no module owns the concern and the task brings a new one (a library, a cross-cutting layer, a new seam). Design its interface before writing it; the seam design gate in `create-task` does this.

Never add a second inline copy of logic that already exists. Extraction, deepening and introduction are their own steps done first: make the change easy, then make the easy change.

## Write less

- **Deletion test.** If removing a line, parameter, wrapper or branch loses nothing, don't write it.
- **No speculative generality.** No options, generics, factories or extension points with a single caller.
- **Pull complexity down.** Compute a sensible default inside the module rather than adding a parameter every caller must set.
- **No defensive checks for impossible states.** Validate at trust boundaries only.
- **Match the surrounding code.** Its naming, structure and idioms win over your preferences. Consistency is what lets a reader guess right.

## Comments

- **Interface comments on seams and deep modules.** Say what a caller needs that the signature doesn't: invariants, error modes, units, ordering. Never explain the internals there.
- **Implementation comments: only the non-obvious why** — a constraint, a workaround, a gotcha. Never narrate what the code does, echo a signature, or add section banners.
- Default is no comment. A name that explains itself beats a comment that explains a name.

## Readability

- Names say what a thing is in the domain's words (`UBIQUITOUS_LANGUAGE.md`). Precise beats short; `data`, `info`, `manager` say nothing.
- **A name that is hard to pick is a design flag.** The thing probably does more than one job; split it before naming it.
- **Obvious code.** A reader's first guess should be right: named types over generic containers (`Pair`, tuples passed between modules), no getter that writes, no event flow nobody can trace.
- Short functions with one job; early returns over nested branches.

## Performance

Measure before optimising. A change made for performance cites the measurement behind it. Keep the critical path simple.
