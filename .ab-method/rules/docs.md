# Docs

Rules for every write to the domain and architecture docs (`CONTEXT.md`, `UBIQUITOUS_LANGUAGE.md`, `docs/architecture/**`, `docs/adr/**`). They keep docs small enough to read in full.

## What a doc may hold

- **A rule and one example.** A pattern is the rule plus one exemplar path. Never list every place it is used; `grep` finds those.
- **The current state only.** No task names, no "added in", no "X added three more", no dated update blocks. History lives in git and in the task's `progress-tracker.md`.
- **No `[DEPRECATED]` entries.** When something stops being true, delete it. Git keeps the old version.
- **The why goes in an ADR.** A doc links it in one line (`see ADR-0007`). Write an ADR only when the decision clears the ADR bar; otherwise cut the rationale.
- **Nothing the code already says.** If reading the file is quicker than reading the doc entry, cut the entry.
- **Glossary terms are short.** Definition in at most two sentences, plus the `_Avoid_:` line.

## How to edit

- **Edit in place, never append.** Find the closest existing entry and merge into it or replace it. A new section is the last resort.
- **Net zero near budget.** When a file is within 10% of its budget, every addition removes at least as many words.
- **Split by topic.** Patterns live as `docs/architecture/<layer>/index.md` (one line per topic) plus one small file per topic. Read the index, then only the topics you need.

## The gate

Budgets live under `doc_budgets` in `.ab-method/structure/index.yaml`. After any doc write, run:

```bash
node .ab-method/scripts/check-docs.js
```

(Plugin installs without a project `.ab-method/`: `npx ab-method check-docs`.)

A doc write is not done until the check passes. If it fails, compact the failing file under these rules. An autonomous run that cannot get under budget without a judgment call reverts its doc change and records the proposed delta in `review.md` instead.
