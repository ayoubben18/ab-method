---
name: ab-update-architecture
description: Refresh architecture and domain documentation after impactful changes. Use when code has drifted from the documented architecture.
---

This skill runs the AB Method **update-architecture** workflow.

Follow the workflow defined in `.ab-method/core/update-architecture.md` exactly — it contains the full process, output format, and rules.

Before doing anything, check `.ab-method/structure/index.yaml`. It defines where this workflow reads from and writes to. Paths are user-configurable; never hardcode them.
