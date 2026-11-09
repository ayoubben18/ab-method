# Red Flags

The red flags from John Ousterhout's *A Philosophy of Software Design*, used by the in-plan deepening scan in `create-task` / `extend-task` and by the rules reviewer in `review-pr`. Each one is a **signal to look closer**, not a verdict: name it, show the code, say what it costs.

## Name the cost: the three symptoms (Ch. 2)

Every finding says which of these it causes. "This feels messy" is not a finding.

- **Change amplification** — a simple change needs edits in many places.
- **Cognitive load** — a developer must hold too much in their head to make a change safely.
- **Unknown unknowns** — it isn't obvious which code must change, or what a change will break. The worst of the three.

Their two causes are **dependencies** (code that can't be understood or changed alone) and **obscurity** (important information that isn't obvious).

## Structure

| Flag | What it looks like | Usual fix |
|---|---|---|
| **Shallow module** (Ch. 4) | the interface is nearly as complex as the implementation | merge it into its caller or into a deeper neighbour |
| **Information leakage** (Ch. 5) | one design decision (a format, a protocol, an order) is known by several modules | give the decision one owner behind an interface |
| **Temporal decomposition** (Ch. 5) | modules split by the order things happen (read → parse → save) rather than by what knowledge they hide | regroup by knowledge |
| **Overexposure** (Ch. 5) | callers must learn rarely-used options to use the common case | default the common case; hide the rest |
| **Pass-through method** (Ch. 7) | a method that only forwards to another with the same signature | inline it, or make the layer add a real abstraction |
| **Decorator / thin wrapper** (Ch. 7) | a wrapper class that adds one small feature over a large interface | fold the feature into the wrapped module or its caller |
| **Pass-through variable** (Ch. 7) | a value threaded through methods that don't use it | a context object (see the Request context seam) |
| **Repetition** (Ch. 9) | the same non-trivial code in several places | one module for it |
| **Special-general mixture** (Ch. 6, 9) | special-purpose code tangled into a general-purpose module | push the special case up to the caller or down to an adapter |
| **Conjoined methods** (Ch. 9) | two methods that can't be understood without reading each other | merge them, or redraw the split |
| **Configuration leak** (Ch. 8) | a parameter that exports a decision the module could make itself | compute a sensible default inside |
| **Scattered error handling** (Ch. 10) | many handlers catching, formatting and logging the same errors | define the error out of existence, mask it low, or aggregate it at one boundary |

## Names and comments

| Flag | What it looks like |
|---|---|
| **Vague name** (Ch. 14) | `data`, `info`, `handle`, `manager`, `result` — a name that could mean many things |
| **Hard to pick a name** (Ch. 14) | no precise name fits. This is a design flag: the thing probably does more than one job |
| **Hard to describe** (Ch. 15) | the interface comment needs many caveats to be complete. The interface is the wrong shape |
| **Comment repeats code** (Ch. 13) | a comment says what the next line plainly says |
| **Implementation leaks into the interface comment** (Ch. 13) | a caller-facing comment explains internals the caller doesn't need |

## Obviousness (Ch. 18)

Code is obvious when a reader's first guess about it is right. Flag:

- **Generic containers** standing in for a named type (`Pair`, `[string, number]`, `Map<string, any>` passed between modules).
- **Event-driven flow nobody can trace** — handlers registered in one place and fired from another, with no way to find who reacts to what.
- **Code that breaks the reader's expectation** — a getter that writes, a `validate` that mutates, a declared type that differs from the allocated one.

## Performance (Ch. 20)

- **Optimising without a measurement.** A change made "for performance" cites the measurement that justified it, or it is speculative.
- Design the **critical path** to be simple; the fastest code is the code that doesn't run.
