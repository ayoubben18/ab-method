---
name: ab-create-goal
description: Produce a ready-to-run prompt for an autonomous /goal loop. Use when the user wants to hand off one continuous objective with a verifiable stop condition to run autonomously.
---

This skill runs the AB Method **create-goal** workflow.

Follow the workflow defined in `.ab-method/core/create-goal.md` exactly — it contains the full process, output format, and rules.

Before doing anything, check `.ab-method/structure/index.yaml`. It defines where this workflow reads from and writes to. Paths are user-configurable; never hardcode them.
