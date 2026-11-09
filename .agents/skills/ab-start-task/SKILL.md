---
name: ab-start-task
description: Run an existing task autonomously to a reviewed pull request — each remaining mission in a subagent (or in the conversation with the `inline` argument), a commit after every green mission, then the protect step, reviews, a draft PR and a final review against the seams and coding rules. Use when the user wants to hand off a well-defined task and review a PR instead of missions. Pass `inline` to run the missions without subagents.
---

This skill runs the AB Method **start-task** workflow.

Follow the workflow defined in `.ab-method/core/start-task.md` exactly — it contains the full process, output format, and rules.

Before doing anything, check `.ab-method/structure/index.yaml`. It defines where this workflow reads from and writes to. Paths are user-configurable; never hardcode them.

**Locating `.ab-method/`.** Every `.ab-method/...` path — here and inside the workflow files — is resolved in this order:

1. **The project root (the current working directory) first.** If `<project>/.ab-method/...` exists, use it. A project's own `.ab-method/structure/index.yaml` is how it customises its paths, so it always wins — check for it even when the bundled copy is right there.
2. **Only if the project has no such file** (AB Method installed as a plugin rather than with `npx ab-method`), read the bundled copy: `../../../.ab-method/` relative to this `SKILL.md`.

The bundled copy is read-only reference material. Every path the index or a workflow names (`docs/...`, `CONTEXT.md`, `UBIQUITOUS_LANGUAGE.md`, ...) is relative to the **project root** — never to the folder the bundled files live in. Never write inside that folder.
