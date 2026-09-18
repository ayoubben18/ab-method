---
name: ab-create-task-from-handoff
description: Resume a handoff (a side-topic spun off mid-grill) and turn it into a test-driven task. Use when the user wants to continue grilling on a deferred topic captured under docs/handoffs/.
---

This skill runs the AB Method **create-task-from-handoff** workflow.

Follow the workflow defined in `.ab-method/core/create-task-from-handoff.md` exactly — it loads the handoff, continues the grill where it left off, then hands off to the standard create-task flow (project analysis → missions → TDD).

Before doing anything, check `.ab-method/structure/index.yaml`. It defines where handoffs are read from (`docs/handoffs/`) and where task documents are written. Paths are user-configurable; never hardcode them.

**Locating `.ab-method/`.** Every `.ab-method/...` path — here and inside the workflow files — is resolved in this order:

1. **The project root (the current working directory) first.** If `<project>/.ab-method/...` exists, use it. A project's own `.ab-method/structure/index.yaml` is how it customises its paths, so it always wins — check for it even when the bundled copy is right there.
2. **Only if the project has no such file** (AB Method installed as a plugin rather than with `npx ab-method`), read the bundled copy: `../../../.ab-method/` relative to this `SKILL.md`.

The bundled copy is read-only reference material. Every path the index or a workflow names (`docs/...`, `CONTEXT.md`, `UBIQUITOUS_LANGUAGE.md`, ...) is relative to the **project root** — never to the folder the bundled files live in. Never write inside that folder.
