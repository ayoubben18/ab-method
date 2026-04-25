# Update Architecture Workflow

## Purpose
After impactful changes have shipped, refresh architecture/domain docs **and** surface deepening opportunities by running `improve-codebase-architecture` scoped to what was just implemented.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find architecture file paths.

## Process

### 1. Identify What Changed
Pull the change set from one or more of:
- The most recent task's `progress-tracker.md` — the per-mission technical summaries already list **Files** and **Built**
- `git diff` / `git log` since the last architecture refresh
- An explicit description from the user if neither of the above is sufficient

Build a mental list of: **files touched · APIs/endpoints added or changed · new dependencies · new patterns · domain terms used.**

### 2. Update Docs (priority order — only touch what changed)

#### 2a. APIs / endpoints  →  `docs/architecture/tech-stack.md` (Entry Points section)
**Explicitly check this every time.** APIs are the most common stale-doc victim.
- New endpoints → add to Entry Points
- Renamed/moved endpoints → update path; mark old path `[DEPRECATED]` if still served
- Auth/middleware change on endpoints → note it
- New CLI commands, cron jobs, webhooks, queue consumers → also Entry Points

If endpoint conventions shifted (e.g. moved from REST to RPC, or added a new versioning scheme), reflect it in `backend-patterns.md` § API too — not just the Entry Points list.

#### 2b. Patterns  →  `frontend-patterns.md` / `backend-patterns.md`
- New component/service patterns → add a short section
- Pattern changes (state mgmt swapped, auth strategy changed, etc.) → update in place + mark prior as `[DEPRECATED]` with date

#### 2c. Stack / deps / external services  →  `tech-stack.md` (Stack, External Services, Constraints, Testing)
- New dependency added → Stack
- New third-party API or queue → External Services
- New limits/budgets → Constraints
- Test framework or coverage shifts → Testing

#### 2d. Domain  →  `UBIQUITOUS_LANGUAGE.md` + `CONTEXT.md`
- New domain term used in code → add to UBIQUITOUS_LANGUAGE.md
- A term's meaning shifted → update both files
- New bounded context emerged → suggest `/domain-model` instead of editing freehand

#### 2e. Hard-to-reverse decisions  →  `docs/adr/`
Only if the change carries a real trade-off, was surprising, and is hard to reverse (the bar from `.claude/skills/domain-model/ADR-FORMAT.md`). If the bar is met, suggest the user run `/domain-model` to capture the ADR properly rather than writing it inline here.

### 3. Update Strategy
- Add new content; don't delete existing prose
- Mark deprecated items with `[DEPRECATED <YYYY-MM-DD>]`
- Add a per-file `### Recent Updates (YYYY-MM-DD)` block for major shifts
- Maintain existing format and tone

### 4. Invoke `improve-codebase-architecture` — scoped to what was implemented

After the docs are refreshed, **invoke the `improve-codebase-architecture` skill** on the changed surface area. Frame the invocation tightly so the skill doesn't sweep the whole repo:

> "Run `improve-codebase-architecture` against the files touched in this change: [list from Step 1]. Scope the exploration to those modules and their immediate seams. Surface deepening opportunities — places that just became shallow, friction the new code introduced, or where the new domain language exposes a previously-misshapen module."

The skill will:
- Read `CONTEXT.md` and `docs/adr/`
- Walk the changed modules with the deletion test
- Present a numbered list of deepening candidates
- Drop into a grilling loop on whichever the user picks
- Update `CONTEXT.md` inline if a deepened module needs a new canonical term
- Offer an ADR only if the user rejects a candidate for a load-bearing reason

This step is the point of `/update-architecture` — docs catch the *what*; the skill catches *the architectural debt the change just created or revealed*.

### 5. Report Results
Provide a short summary:
- Files updated and what was added (one bullet per file)
- API/endpoint changes reflected (or "no API changes")
- Domain terms added or sharpened
- Deepening candidates surfaced by `improve-codebase-architecture` and which the user is exploring (if any)
- Any ADR captured

## Remember
- Check `.ab-method/structure/index.yaml` for paths
- Be incremental — add, don't rewrite
- **Always check Entry Points** for API drift, even if the user didn't mention APIs
- **Always run `improve-codebase-architecture`** scoped to the change — that's how this workflow earns its keep
- Defer hard-to-reverse / domain-reshape decisions to `/domain-model`
