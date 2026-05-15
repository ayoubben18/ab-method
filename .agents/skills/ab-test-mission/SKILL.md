---
name: ab-test-mission
description: Add retroactive test coverage for code that was not written test-first. Use when the user wants to backfill tests.
---

This skill runs the AB Method **test-mission** workflow.

Follow the workflow defined in `.ab-method/core/test-mission.md` exactly — it contains the full process, output format, and rules.

Before doing anything, check `.ab-method/structure/index.yaml`. It defines where this workflow reads from and writes to. Paths are user-configurable; never hardcode them.
