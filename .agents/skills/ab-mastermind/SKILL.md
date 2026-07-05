---
name: ab-mastermind
description: The intelligent entry point to the AB Method. Use when the user isn't sure which workflow they need, asks whether to create a goal or a task, or wants to understand how the AB Method works end to end. Routes intent to the right workflow instead of reimplementing it.
---

This skill runs the AB Method **mastermind** workflow.

Follow the workflow defined in `.ab-method/core/mastermind.md` exactly — it contains the full routing logic, the goal-vs-task decision guide, and the end-to-end explanation.

Before doing anything, check `.ab-method/structure/index.yaml`. It defines where every workflow reads from and writes to. Paths are user-configurable; never hardcode them.

Mastermind is deliberately thin: it discovers the available `ab-*` workflow skills at runtime, matches the user's intent, and delegates to the matching skill. It never reproduces another workflow's process.
