---
name: ab-start-task
description: Run an existing task autonomously to completion — each remaining mission in a subagent with tdd, tracker updated per mission, a commit after every green mission. Use when the user wants to hand off a well-defined task and review commits instead of missions.
---

This skill runs the AB Method **start-task** workflow.

Follow the workflow defined in `.ab-method/core/start-task.md` exactly — it contains the full process, output format, and rules.

Before doing anything, check `.ab-method/structure/index.yaml`. It defines where this workflow reads from and writes to. Paths are user-configurable; never hardcode them.
