# Update Architecture Workflow

## Purpose
After impactful changes have shipped, bring the architecture, seam and domain docs back in line with the code. Deepening is not done here: it happens in the next task's planning scan (`create-task` § 3).

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** for doc paths and `doc_budgets`. Follow `.ab-method/rules/communication.md` with the user; every doc edit follows `.ab-method/rules/docs.md`.

## Process

### 1. Identify What Changed
Pull the change set from one or more of:
- The latest task's `progress-tracker.md` mission summaries (they list **Files** and **Built**)
- `git diff` / `git log` since the last refresh
- The user's description, if neither is enough

List: **files touched · APIs/endpoints added or changed · new dependencies · new patterns · seams added or changed · domain terms used.**

### 2. Update Docs (priority order — only touch what changed)

Patterns live split by topic: `docs/architecture/<layer>/index.md` (one line per topic) plus one file per topic. Read the index, then only the topics the change touches. Legacy single `frontend-patterns.md` / `backend-patterns.md` → edit them as they are and recommend `/ab-cleanup` to migrate.

#### 2a. APIs / endpoints → `tech-stack.md` Entry Points
**Check this every time** — APIs are the most common stale-doc victim.
- New endpoints, CLI commands, cron jobs, webhooks, queue consumers → add them.
- Renamed or moved → change the entry; removed → delete it.
- A shifted endpoint *convention* (REST → RPC, new versioning) → the backend `api` topic too.

#### 2b. Patterns → the closest topic file under `docs/architecture/<layer>/`
- New pattern → merge into the closest topic; a new topic file (plus its `index.md` line) only when none fits.
- Swapped pattern → replace the old entry. Don't keep the old one as deprecated.

#### 2c. Stack / deps / services → `tech-stack.md` (Stack, External Services, Constraints, Testing)

#### 2d. Domain → `UBIQUITOUS_LANGUAGE.md` + `CONTEXT.md`
- New term → add it (at most two sentences plus `_Avoid_`); shifted meaning → rewrite the entry in both files.
- A new bounded context → suggest `/domain-model` instead of editing freehand.

#### 2e. Hard-to-reverse decisions → `docs/adr/`
Only when the change carries a real trade-off, was surprising, and is hard to reverse (the bar in the `domain-model` skill's `ADR-FORMAT.md`). Suggest `/domain-model` to capture it; docs then link the ADR in one line.

#### 2f. Seams → `docs/seams/`
Format, bar and status lifecycle: the `codebase-design` skill's `SEAM-FORMAT.md`.
- New module that clears the bar → its `<slug>.md` plus one line in `index.md`.
- Changed interface, files or adapters → edit that seam doc in place.
- Status: set from the seam's **Check** using the lifecycle in `SEAM-FORMAT.md` (never moved without running it). A legitimate bypass goes under **Exceptions**.
- Seam removed → delete its doc and its index line.
- A pattern topic that restates a seam → replace the text with a one-line link to the seam doc.

### 3. Edit Strategy — `.ab-method/rules/docs.md`
- **Edit in place, never append.** Merge into or replace the closest entry.
- **Delete what is no longer true.** No `[DEPRECATED]` markers, no dated "Recent Updates" blocks — git keeps history.
- **Rule plus one exemplar path**; no instance lists, no task names, the why as an ADR link.
- **Net zero near budget** — within 10% of a file's budget, every addition removes at least as many words.

### 4. Gate
```bash
node .ab-method/scripts/check-docs.js   # plugin installs: npx ab-method check-docs
```
The doc update is not done until this passes. Compact failing files you touched; report pre-existing failures elsewhere and point at `/ab-cleanup`.

### 5. Deepening

Not run here. The next task touching these modules deepens them in its planning scan (`create-task` § 3). For a deliberate repo-wide review, `/improve-codebase-architecture` stays available.

### 6. Report
Short, per `.ab-method/rules/communication.md`:
- One bullet per file updated (what changed, word count vs budget)
- API/endpoint changes reflected, or "no API changes"
- Seam docs added, changed or moved in status
- Domain terms added or sharpened
- Any ADR captured

## Remember
- Index first; edit in place; `check-docs` must pass.
- **Always check Entry Points**, even if the user didn't mention APIs.
- **Seam docs follow the code**: new seam → doc, status moves with its Check.
- Defer hard-to-reverse / domain-reshape decisions to `/domain-model`.
