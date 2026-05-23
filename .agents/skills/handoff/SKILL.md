---
name: handoff
description: Compact the current conversation (or a side-topic that surfaced mid-grill) into a handoff document another agent can pick up. Use when a tangent deserves its own task, or to summarize a session for a fresh agent.
argument-hint: "What will the next session be used for?"
---

Write a handoff document summarising the current conversation (or a specific side-topic that surfaced) so a fresh agent can continue the work without re-deriving context.

## Where to save it

**Check `.ab-method/structure/index.yaml` first.** In an AB Method project, handoffs are a tracked artifact, not throwaway scratch — save to `docs/handoffs/[slug].md` (the location the index defines). The slug is a short kebab-case summary of the topic, e.g. `rate-limit-redis-vs-token-bucket.md`.

If the project is **not** an AB Method project (no `.ab-method/`), fall back to the temporary directory of the user's OS — do not pollute the workspace.

## The spin-off-mid-grill case

The most common trigger here: you are in the middle of a `grill-with-docs` / `grill-me` session and a tangent emerges that clearly deserves its own task. **Do not derail the current grill.** Instead:

1. Write the tangent up as a handoff under `docs/handoffs/`.
2. Capture only the tangent — the question that opened it, the constraints already established, the decisions still open, and why it was deferred.
3. Tell the user: "Captured `<slug>` as a handoff — resume it any time with `/create-task-from-handoff <slug>`." Then continue grilling the original topic.

## What the document must contain

- **Goal** — what the next session is meant to accomplish (use the passed argument verbatim if given).
- **Context** — the minimum a fresh agent needs: what's been decided, what's still open, what was explicitly ruled out and why.
- **Suggested skills** — which skills the next agent should invoke (e.g. `grill-with-docs`, `tdd`). For a deferred-task spin-off, the suggested next step is `/create-task-from-handoff`.
- **References** — link to existing artifacts (PRDs, plans, ADRs, issues, commits, diffs, the parent task's `progress-tracker.md`) by path or URL. Do **not** duplicate their content.

## Rules

- Do not duplicate content already captured elsewhere — reference it by path or URL instead.
- Redact any sensitive information (API keys, passwords, PII).
- If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
