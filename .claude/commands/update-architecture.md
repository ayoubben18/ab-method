# Update Architecture

## Description
Update and maintain architecture documentation to keep technical documentation current with project changes.

## Usage
```
/update-architecture
```

## Behavior
Loads and executes the update-architecture workflow from `.ab-method/core/update-architecture.md`

This workflow will:
1. Identify what shipped (from the latest `progress-tracker.md` summaries, `git diff`, or user description)
2. Refresh the architecture docs that the change touches:
   - **APIs/endpoints** in `tech-stack.md` (Entry Points) — checked every run, even if the user didn't mention APIs
   - Patterns in `frontend-patterns.md` / `backend-patterns.md`
   - Stack / external services / constraints / testing in `tech-stack.md`
   - Domain terms in `UBIQUITOUS_LANGUAGE.md` / `CONTEXT.md`
3. **Invoke the `improve-codebase-architecture` skill** scoped to the changed files — surfaces deepening opportunities the change just created or revealed, drops into a grilling loop on the candidate the user picks
4. Defer hard-to-reverse / domain-reshape decisions to `/domain-model` (which captures ADRs properly)

## Workflow Details
- **Always checks APIs** — Entry Points drift is the most common stale-doc issue
- **Always runs `improve-codebase-architecture`** scoped to the change — docs catch the *what*; the skill catches *the architectural debt the change just introduced*
- **Incremental** — adds new content; deprecates with `[DEPRECATED <date>]` instead of deleting

## Examples
```
/update-architecture
# Reviews and updates architecture documentation
# Ensures technical docs reflect current project state
# Maintains consistency for accurate task planning
```

## Alternative Usage
You can also use the traditional AB Method master controller:
```
/ab-master update-architecture
```