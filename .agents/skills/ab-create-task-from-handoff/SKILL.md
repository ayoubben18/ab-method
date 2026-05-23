---
name: ab-create-task-from-handoff
description: Resume a handoff (a side-topic spun off mid-grill) and turn it into a test-driven task. Use when the user wants to continue grilling on a deferred topic captured under docs/handoffs/.
---

This skill runs the AB Method **create-task-from-handoff** workflow.

Follow the workflow defined in `.ab-method/core/create-task-from-handoff.md` exactly — it loads the handoff, continues the grill where it left off, then hands off to the standard create-task flow (project analysis → missions → TDD).

Before doing anything, check `.ab-method/structure/index.yaml`. It defines where handoffs are read from (`docs/handoffs/`) and where task documents are written. Paths are user-configurable; never hardcode them.
