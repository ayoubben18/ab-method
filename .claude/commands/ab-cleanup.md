# AB Cleanup

## Description
Clean up a repo already using AB Method: compact the domain and architecture docs to their word budgets, split pattern docs by topic, remove disposable task leftovers, and migrate the structure index to 4.0.

## Usage
```
/ab-cleanup
```

## Behavior
Loads and executes the ab-cleanup workflow from `.ab-method/core/ab-cleanup.md`

This workflow will:
1. Run `check-docs` and show which docs are over budget, then confirm scope with you
2. Migrate `.ab-method/structure/index.yaml` to 4.0, keeping your custom paths
3. Split `frontend-patterns.md` / `backend-patterns.md` into `docs/architecture/<layer>/` topic files
4. Compact every failing doc (no task history, one exemplar per pattern, every glossary term kept), showing you what each rewrite dropped before writing
5. Remove leftovers of completed tasks (`sub-agents-outputs/`, `prototype/`, resumed handoffs), only from a list you approve
6. Re-run `check-docs` until green and report words before → after

## Workflow Details
- **Own branch** — works on `chore/ab-cleanup`, one commit per phase, never pushes
- **Requires a clean working tree**
- **Never deletes** domain terms, progress trackers or ADRs; clutter outside AB Method's paths is only reported

## Examples
```
/ab-cleanup
# Shrinks bloated docs back under budget and migrates to AB Method 4.0
```
