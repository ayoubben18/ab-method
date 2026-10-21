# AB Cleanup Workflow

## Purpose

One-shot cleanup of a repo already using AB Method: shrink the domain and architecture docs to their budgets, split pattern docs by topic, remove disposable task leftovers, and migrate the structure index from 3.x to 4.0. It works on its own branch, commits each phase separately, and never pushes.

## Critical step

**ALWAYS read `.ab-method/structure/index.yaml` FIRST.** It names every doc path; the project may have customised them. Then read `.ab-method/rules/docs.md` (what a doc may hold) and `.ab-method/rules/communication.md` (how to report). If the project has no `.ab-method/`, use the bundled copies.

## Preconditions

- Clean working tree. If `git status --porcelain` is not empty, stop and ask the user to commit or stash.
- Create `chore/ab-cleanup` from the current branch. If it exists, ask whether to reuse it or pick a new name.

## Process

### 0. Inventory

1. Run `node .ab-method/scripts/check-docs.js` (fallback: `npx ab-method check-docs`).
2. List `docs/tasks/`, `docs/goals/`, `docs/roadmaps/`, `docs/handoffs/` with counts. A task is **completed** when its `progress-tracker.md` has no unchecked mission (`- [ ]`).
3. Show one table, failing docs only, worst first:

   | Doc | Words | Budget | Problems |
   | --- | --- | --- | --- |

   Then one line of totals: docs, words, failing, estimated tokens (words × 1.35).
4. Ask the user to confirm scope: all phases, or a subset. Proceed only on their answer.

### 1. Structure index → 4.0

Bring the project's `.ab-method/structure/index.yaml` up to the bundled 4.0 version:

- Add the `rules:` and `doc_budgets:` blocks if missing.
- Replace `frontend-patterns.md` / `backend-patterns.md` under `docs.architecture` with the `frontend/` and `backend/` folders.
- Add `prototype/` to the task folder entry.
- **Preserve every custom path or budget the user set.** The 3.x defaults are `UBIQUITOUS_LANGUAGE.md` / `CONTEXT.md` at the root and everything under `docs/architecture`, `docs/adr`, `docs/tasks`, `docs/goals`, `docs/roadmaps`, `docs/handoffs`; any other path is the user's and stays. Reinstalling with `npx ab-method` overwrites this file, so also check `git log -p -- .ab-method/structure/index.yaml` for customisations the reinstall dropped, and restore them.

If `.ab-method/rules/` or `.ab-method/scripts/check-docs.js` is missing, tell the user to run `npx ab-method` to install 4.0 first, then continue.

Commit: `chore(ab-cleanup): migrate structure index to 4.0`.

### 2. Split pattern docs by topic

For each legacy `docs/architecture/frontend-patterns.md` / `backend-patterns.md`:

1. Group its sections into topics (forms, data fetching, state, api, services, auth, testing…). One topic per concern, not per heading.
2. Write `docs/architecture/<layer>/index.md` (one line per topic: name, one-sentence scope, link) and one file per topic.
3. Delete the legacy file. Update any references to it (`CLAUDE.md`, `AGENTS.md`, other docs).

Other loose files in `docs/architecture/` (e.g. `feature-flags.md`) become a topic of the right layer if over budget; within budget, they stay. Non-markdown files there (images, html) are left alone and reported in phase 5.

This phase moves text; phase 3 shrinks it. Commit: `docs(ab-cleanup): split pattern docs by topic`.

### 3. Compact every failing doc

Re-run check-docs. For each failing file, apply `.ab-method/rules/docs.md`:

- Delete task names and history ("added in", "X added three more", dated update blocks).
- Collapse instance lists to one exemplar path.
- Delete `[DEPRECATED]` entries.
- Move rationale out: link an existing ADR in one line, or cut it. Create an ADR only when the decision clears the ADR bar and none covers it.
- Check every referenced path exists (`test -e`); delete references to paths that don't.
- Merge duplicate rules, including across topic files.
- Split lines over `max_line_words`.
- Glossary and `CONTEXT.md` files: **keep every term**; shorten definitions to at most two sentences plus `_Avoid_:`.

**Fan out:** run one subagent per file over ~1,500 words, in parallel. Each gets the file, `.ab-method/rules/docs.md`, the budget and the list of ADRs. Each returns the rewritten file **and a dropped list**: every *rule or fact* it removed (not every word), one line each, with the reason (history, duplicate of X, stale path, moved to ADR-n).

Before writing, show the user the combined dropped lists. Anything they flag as load-bearing goes back in. Then write the files.

Commit: `docs(ab-cleanup): compact docs to budget` (one commit per layer if the diff is large).

### 4. Task leftovers (approval required)

Build one list and show it before deleting anything:

- `sub-agents-outputs/` and `prototype/` folders in **completed** tasks.
- Handoffs in `docs/handoffs/` whose slug already exists as a task, or that a tracker references as resumed.

Delete only what the user approves. Commit: `chore(ab-cleanup): remove task leftovers`.

Report, without touching:

- Orphan `TODO(UQ-n)` markers in code with no matching entry in any `unresolved-questions.md` (`grep -rn 'TODO(UQ-'`, excluding `node_modules`).
- `unresolved-questions.md` files where every entry is `RESOLVED`.

Offer as an explicit opt-in, never by default: deleting `review.md` and `change-map.md` of completed tasks. Progress trackers are never deleted.

### 5. Clutter report

List files under `docs/` that no AB Method workflow owns (stray html, images, legacy folders, one-off reports), grouped by folder with sizes. List only; never move or delete them.

### 6. Verify and report

Re-run check-docs until green. If a file can't get under budget without a judgment call, stop and ask the user about that file only.

Final report:

| Doc | Words before | Words after |
| --- | --- | --- |

Then: total words before → after, estimated tokens saved per full context load, the commits on `chore/ab-cleanup`, and the phase 4/5 reports. Stop. The user reviews and merges the branch.

## Rules

- Never push and never merge.
- Never delete a domain term, a progress tracker, or an ADR.
- Never touch files outside AB Method's paths except the references updated in phase 2.
- One commit per phase, so any phase can be reverted alone.
