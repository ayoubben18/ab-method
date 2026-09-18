---
name: ab-create-roadmap
description: Turn a larger idea into a dependency-ordered roadmap of tasks — the layer above create-task. Use when the work is several distinct tasks with real ordering between them (schema before API before UI), and you want the whole task graph drawn before implementing. Producer only; ab-start-roadmap executes it.
---

This skill runs the AB Method **create-roadmap** workflow.

Follow the workflow defined in `.ab-method/core/create-roadmap.md` exactly — it contains the decomposition grill, the `roadmap.md` format, the dependency-graph rules, and the per-task planning-prompt process.

Before doing anything, check `.ab-method/structure/index.yaml`. It defines where roadmaps and tasks are stored and how they reference each other (the `relationships` section). Paths are user-configurable; never hardcode them.

**Locating `.ab-method/`.** Every `.ab-method/...` path — here and inside the workflow files — is resolved in this order:

1. **The project root (the current working directory) first.** If `<project>/.ab-method/...` exists, use it. A project's own `.ab-method/structure/index.yaml` is how it customises its paths, so it always wins — check for it even when the bundled copy is right there.
2. **Only if the project has no such file** (AB Method installed as a plugin rather than with `npx ab-method`), read the bundled copy: `../../../.ab-method/` relative to this `SKILL.md`.

The bundled copy is read-only reference material. Every path the index or a workflow names (`docs/...`, `CONTEXT.md`, `UBIQUITOUS_LANGUAGE.md`, ...) is relative to the **project root** — never to the folder the bundled files live in. Never write inside that folder.

Key points: grill the idea **once** to draw the task DAG (coarse tasks, no missions); write `docs/roadmaps/<name>/roadmap.md` as the roadmap-level source of truth; hand back a `/create-task` prompt per task in dependency order (foundational first), recommending a fresh session each and warning about context bloat if planning inline. Do not execute — `ab-start-roadmap` does that. `ab-create-task` is roadmap-aware and keeps `roadmap.md` in sync automatically.
