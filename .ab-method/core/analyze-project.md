# Analyze Project Workflow

## Purpose
Entry point that deploys 5 subagents in parallel to produce a small architecture baseline: domain language, tech stack, frontend/backend patterns split by topic, and the app's seams.

## Important
**ALWAYS check `.ab-method/structure/index.yaml` first** for output paths and `doc_budgets` — both are user-configurable. Follow `.ab-method/rules/communication.md` with the user; every doc written here follows `.ab-method/rules/docs.md`.

## Process

### 1. User Confirmation
Prompt the user with:
```
Project Architecture Analysis
=============================
I will deploy 5 subagents in parallel:

1. Domain Extractor   → UBIQUITOUS_LANGUAGE.md + CONTEXT.md (root)
2. Tech Stack Mapper  → docs/architecture/tech-stack.md
3. Frontend Patterns  → docs/architecture/frontend/ (index.md + topic files)
4. Backend Patterns   → docs/architecture/backend/  (index.md + topic files)
5. Seam Mapper        → docs/seams/ (index.md + one doc per seam found)

Choose:
- [1] Full (all 5 in parallel)
- [2] Frontend only   (Frontend Patterns + Domain Extractor + Seam Mapper)
- [3] Backend only    (Backend Patterns + Domain Extractor + Seam Mapper)
- [4] Domain only     (Domain Extractor)
- [5] Seams only      (Seam Mapper — for a repo that already has its domain and architecture docs)
```

Run it on its own branch (or commit it separately before any feature work): a baseline is docs-only, and mixing it into a feature branch buries the feature in its PR.

If legacy `docs/architecture/frontend-patterns.md` / `backend-patterns.md` exist, say so: the pattern agents will migrate them into the split layout (keeping only what is still true), and `/ab-cleanup` is the fuller cleanup for an existing AB Method repo.

### 2. Deploy Agents (Parallel)

Use the `subagent_type` named below when the runtime has it; otherwise the closest available (a general-purpose agent always works).

Every brief includes: "Follow `.ab-method/rules/docs.md` and stay within the `doc_budgets` in `.ab-method/structure/index.yaml` — rule plus one exemplar path, no instance lists, nothing the code already says plainly."

#### Option 1: Full Analysis
Deploy 5 Task calls in a single message:

```
1. Task: "Extract Domain Model"
   - subagent_type: "general-purpose"
   - prompt: |
       Extract the project's domain language from the codebase.
       Produce TWO root-level files:
       - UBIQUITOUS_LANGUAGE.md (flat glossary — format from the
         `ubiquitous-language` skill's SKILL.md)
       - CONTEXT.md (bounded-context overview — CONTEXT-FORMAT.md
         in the `domain-model` skill's folder)
       Multiple bounded contexts (e.g. /src/ordering, /src/billing)
       → CONTEXT-MAP.md at root + a CONTEXT.md per context folder.
       Source nouns from schemas, route names, aggregate roots and
       recurring module names; skip generic programming concepts.
       Each term: at most two sentences plus its _Avoid_ line.
       Flag ambiguities (same word, different meanings).
       FIRST DRAFT — the user refines it via /domain-model.

2. Task: "Map Tech Stack"
   - subagent_type: "backend-architect"
   - prompt: |
       Create docs/architecture/tech-stack.md, bullet lists only,
       within its word budget (1500 by default):
       ## Stack — languages, frameworks, runtimes, DBs
       ## Entry Points — main files, route roots, CLI, start scripts
       ## External Services — third-party APIs, cloud, queues
       ## Constraints — limits, compliance, perf budgets, lock-in
       ## Testing — frameworks, file patterns, commands
       Source from manifests, config files, Dockerfile/CI.

3. Task: "Analyze Frontend Patterns"
   - subagent_type: "frontend-developer"
   - prompt: "Follow .ab-method/core/analyze-frontend.md. Skip what
     tech-stack.md covers (testing, build tooling) — link instead."

4. Task: "Analyze Backend Patterns"
   - subagent_type: "backend-architect"
   - prompt: "Follow .ab-method/core/analyze-backend.md. Skip what
     tech-stack.md covers (testing, external services, deploy) —
     link instead."

5. Task: "Map Seams"
   - subagent_type: "general-purpose"
   - prompt: |
       Find the app's seams and write docs/seams/ (path from
       index.yaml). Read the `codebase-design` skill's
       SEAM-CATALOG.md and SEAM-FORMAT.md first.
       Also read the repo's agent docs (AGENTS.md, CLAUDE.md,
       CONTRIBUTING.md): rules they call invariants are seams.
       Follow the catalog's "Applying the catalog" steps: for each
       entry, search with its "Find it" hints; present → write the
       doc with a Check command that excludes its Exceptions, run
       it, and set the status from the result exactly as
       SEAM-FORMAT.md defines it; absent → write nothing. Add every
       project seam outside the catalog that clears the bar.
       Write docs/seams/index.md (one line per seam) plus one
       <slug>.md per seam. Files list the seam's own files only,
       never its callers. Name seams with CONTEXT.md terms when
       they exist. No seam found → write nothing and say so.
       Scope to the chosen layers (Frontend only → frontend seams).
```

#### Options 2–4
- Frontend only: Domain Extractor + Frontend Patterns + Seam Mapper (frontend seams).
- Backend only: Domain Extractor + Backend Patterns + Seam Mapper (backend seams).
- Domain only: Domain Extractor.
- Seams only: Seam Mapper, all layers.

### 3. Gate
Run the budget check and compact any failing file **this run wrote** under `.ab-method/rules/docs.md` until it passes:

```bash
node .ab-method/scripts/check-docs.js   # plugin installs: npx ab-method check-docs
```

Failures in files this run didn't write are pre-existing: list them in the report and point at `/ab-cleanup`; don't fix them here.

### 4. Report
List the files produced with their word counts, then:
```
Architecture baseline ready. Next:
- /domain-model to grill UBIQUITOUS_LANGUAGE.md + CONTEXT.md into shape;
  ADRs are captured there as decisions surface.
- Review docs/seams/: every task routes code through them.
- /create-task when ready to start work.
```

## Notes
- Orchestrator only — agents run in parallel, each writing its own files.
- `UBIQUITOUS_LANGUAGE.md` and `CONTEXT.md` keep the formats their skills define (`ubiquitous-language`, `domain-model`'s `CONTEXT-FORMAT.md`).
- ADRs (`docs/adr/`) are not created here — `/domain-model` creates them lazily.
- `docs/seams/` keeps the format in the `codebase-design` skill's `SEAM-FORMAT.md`. A catalog seam absent from the code is not written; the seam design gate in `/create-task` introduces it when a task needs it.
