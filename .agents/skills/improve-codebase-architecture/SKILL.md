---
name: improve-codebase-architecture
description: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick. Informed by the domain language in CONTEXT.md and the decisions in docs/adr/. Use when the user wants to improve architecture, find refactoring opportunities, consolidate tightly-coupled modules, or make a codebase more testable and AI-navigable.
---

# Improve Codebase Architecture

Surface architectural friction and propose **deepening opportunities** — refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability.

This skill is built on a shared design vocabulary and _informed_ by the project's domain model:

- **Architecture vocabulary** — run the `codebase-design` skill for the terms (**module**, **interface**, **depth**, **seam**, **adapter**, **leverage**, **locality**) and the principles (the deletion test, "the interface is the test surface", "one adapter = hypothetical seam, two = real"). Use those terms exactly in every suggestion — don't drift into "component," "service," "API," or "boundary." It is the single source; this skill doesn't restate it.
- **Domain language** — `CONTEXT.md` gives names to good seams; ADRs in `docs/adr/` record decisions this skill should not re-litigate. See [CONTEXT-FORMAT.md](../domain-model/CONTEXT-FORMAT.md) and [ADR-FORMAT.md](../domain-model/ADR-FORMAT.md).

## Process

### 1. Explore

**Scope before you scan — YAGNI.** Deepening a module pays off by making *future* changes to it easier, so weight the parts of the codebase that keep changing. Decide *where* to look before looking:

- If the user named a direction — a module, a subsystem, a pain point — take it and skip the inference below.
- Otherwise walk back a good stretch of history (`git log --oneline`) to find the hot spots — the files and areas that keep coming up — and let those paths pull your attention first. If the changes are scattered with no clear hot spot, widen the net.
- **Read the accumulated drift first if the project has it.** Every task's `docs/tasks/*/change-map.md` records the modules that task *planned* to touch and the ones it *actually* touched. A module that shows up as **unplanned** across several tasks is a sharper hot-spot signal than raw commit frequency: it isn't just where changes land, it's where changes land that nobody expected them to. That is a locality problem by definition, and it's the highest-value place to start. (`change-map` only reports it — acting on it is this skill's job.)

Read the existing documentation first:

- `CONTEXT.md` (or `CONTEXT-MAP.md` + each `CONTEXT.md` in a multi-context repo)
- Relevant ADRs in `docs/adr/` (and any context-scoped `docs/adr/` directories)

If any of these files don't exist, proceed silently — don't flag their absence or suggest creating them upfront.

Then use the Agent tool with `subagent_type=Explore` to walk the codebase. Don't follow rigid heuristics — explore organically and note where you experience friction:

- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow** — interface nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they're called (no **locality**)?
- Where do tightly-coupled modules leak across their seams?
- Which parts of the codebase are untested, or hard to test through their current interface?

Apply the **deletion test** to anything you suspect is shallow: would deleting it concentrate complexity, or just move it? A "yes, concentrates" is the signal you want.

### 2. Present candidates as an HTML report

Write a self-contained HTML file to the **OS temp directory** so nothing lands in the repo. Resolve the temp dir from `$TMPDIR`, falling back to `/tmp` (or `%TEMP%` on Windows), and write to `<tmpdir>/architecture-review-<timestamp>.html` so each run gets a fresh file. Open it — `open` on macOS, `xdg-open` on Linux, `start` on Windows — and tell the user the absolute path.

The report uses **Tailwind via CDN** for layout and **Mermaid via CDN** for graph-shaped diagrams. Each candidate gets a **before/after visualisation**. Be visual — the diagrams carry the weight, the prose is sparse.

For each candidate, render a card with:

- **Files** — which files/modules are involved
- **Problem** — why the current architecture is causing friction
- **Solution** — plain English description of what would change
- **Benefits** — in terms of locality and leverage, and how tests would improve
- **Before / After diagram** — side by side, illustrating the shallowness and the deepening
- **Recommendation strength** — `Strong`, `Worth exploring`, or `Speculative`, rendered as a badge

End with a **Top recommendation** section: which candidate you'd tackle first, and why.

See [HTML-REPORT.md](HTML-REPORT.md) for the scaffold, diagram patterns, and styling guidance.

**No network? Fall back to markdown.** The Tailwind and Mermaid CDNs are the only external dependency; if the environment is offline or the user asks for it, present the same candidate cards as a numbered markdown list in the conversation — same fields, same badges, same Top recommendation. The report format is a presentation choice, not the substance.

**Use `CONTEXT.md` vocabulary for the domain and `codebase-design` vocabulary for the architecture.** If `CONTEXT.md` defines "Order," talk about "the Order intake module" — not "the FooBarHandler," and not "the Order service."

**ADR conflicts**: if a candidate contradicts an existing ADR, only surface it when the friction is real enough to warrant revisiting the ADR. Mark it clearly in the card (e.g. an amber callout: _"contradicts ADR-0007 — but worth reopening because…"_). Don't list every theoretical refactor an ADR forbids.

Do NOT propose interfaces yet. After the file is written, ask: "Which of these would you like to explore?"

### 3. Grilling loop

Once the user picks a candidate, invoke the `grill-with-docs` skill to walk the decision tree with them — constraints, dependencies, the shape of the deepened module, what sits behind the seam, what tests survive.

Side effects happen inline as decisions crystallize — the grill maintains the domain model as it goes:

- **Naming a deepened module after a concept not in `CONTEXT.md`?** Add the term to `CONTEXT.md` — same discipline as `/domain-model` (see [CONTEXT-FORMAT.md](../domain-model/CONTEXT-FORMAT.md)). Create the file lazily if it doesn't exist.
- **Sharpening a fuzzy term during the conversation?** Update `CONTEXT.md` right there.
- **User rejects the candidate with a load-bearing reason?** Offer an ADR, framed as: _"Want me to record this as an ADR so future architecture reviews don't re-suggest it?"_ Only offer when the reason would actually be needed by a future explorer to avoid re-suggesting the same thing — skip ephemeral reasons ("not worth it right now") and self-evident ones. See [ADR-FORMAT.md](../domain-model/ADR-FORMAT.md).
- **Want to explore alternative interfaces for the deepened module?** Run the `codebase-design` skill and use its [DESIGN-IT-TWICE.md](../codebase-design/DESIGN-IT-TWICE.md) parallel sub-agent pattern.
- **Deepening a cluster with awkward dependencies?** [DEEPENING.md](../codebase-design/DEEPENING.md) has the four dependency categories and the seam discipline for each.

This skill **proposes and designs; it does not implement.** Once the shape is agreed, the work becomes a task — `/create-task` grills it into missions and `tdd` builds it. Don't start editing source here.
