# Analyze Project Workflow

## Purpose
Entry point that deploys 4 specialized subagents in parallel to produce a concise architecture baseline: domain language, tech stack, and frontend/backend patterns.

## Important
**ALWAYS check `.ab-method/structure/index.yaml` first** to determine output paths. They are user-configurable.

## Process

### 1. User Confirmation
Prompt the user with:
```
Project Architecture Analysis
=============================
I will deploy 4 specialized subagents in parallel:

1. Domain Extractor       → UBIQUITOUS_LANGUAGE.md + CONTEXT.md (root)
2. Tech Stack Mapper      → docs/architecture/tech-stack.md
                            (stack, entry points, external services,
                             constraints, testing — merged)
3. Frontend Patterns      → docs/architecture/frontend-patterns.md
4. Backend Patterns       → docs/architecture/backend-patterns.md

Choose:
- [1] Full (all 4 in parallel)
- [2] Frontend only        (Frontend Patterns + Domain Extractor)
- [3] Backend only         (Backend Patterns + Domain Extractor)
- [4] Domain only          (Domain Extractor)
```

### 2. Deploy Agents (Parallel)

#### Option 1: Full Analysis
Deploy 4 Task calls in a single message:

```
1. Task: "Extract Domain Model"
   - subagent_type: "general-purpose"
   - prompt: |
       Extract the project's domain language from the codebase.
       Produce TWO root-level files:
       - UBIQUITOUS_LANGUAGE.md  (flat glossary — follow the format
         in .claude/skills/ubiquitous-language/SKILL.md, keep as-is)
       - CONTEXT.md              (bounded-context overview — follow
         .claude/skills/domain-model/CONTEXT-FORMAT.md)
       If you detect multiple bounded contexts (e.g. /src/ordering,
       /src/billing as distinct domains), produce CONTEXT-MAP.md at
       root + a CONTEXT.md inside each context folder instead.
       Source domain nouns from: model/schema definitions, route
       names, aggregate roots, recurring nouns in module/file names.
       Skip generic programming concepts. Flag ambiguities found
       (same word, different meanings).
       This is a FIRST DRAFT — the user will refine it via
       /domain-model later.

2. Task: "Map Tech Stack"
   - subagent_type: "backend-architect"
   - prompt: |
       Create docs/architecture/tech-stack.md with these sections,
       each kept short (use bullet lists, not prose):
       ## Stack            — languages, frameworks, runtimes, DBs
       ## Entry Points     — main files, routes, CLI commands, start scripts
       ## External Services — third-party APIs, cloud services, queues
       ## Constraints      — limits, compliance, perf budgets, lock-in
       ## Testing          — frameworks, file patterns, commands, coverage
       Source from package.json/requirements.txt/go.mod/pom.xml,
       config files, and Dockerfile/CI configs. One file. Concise.

3. Task: "Analyze Frontend Patterns"
   - subagent_type: "frontend-developer"
   - prompt: "Follow .ab-method/core/analyze-frontend.md. Output
     to the path in .ab-method/structure/index.yaml. Skip sections
     covered by tech-stack.md (testing, build tooling) — link to
     them instead."

4. Task: "Analyze Backend Patterns"
   - subagent_type: "backend-architect"
   - prompt: "Follow .ab-method/core/analyze-backend.md. Output
     to the path in .ab-method/structure/index.yaml. Skip sections
     covered by tech-stack.md (testing, external services, deploy)
     — link to them instead."
```

#### Option 2: Frontend Only
Deploy: Domain Extractor + Frontend Patterns.

#### Option 3: Backend Only
Deploy: Domain Extractor + Backend Patterns.

#### Option 4: Domain Only
Deploy: Domain Extractor.

### 3. Post-Analysis
1. List the files produced.
2. Recommend the next phase:
   ```
   Architecture baseline ready. Next:
   - Run /domain-model to grill UBIQUITOUS_LANGUAGE.md + CONTEXT.md
     into shape (interactive). ADRs are captured there as decisions
     surface.
   - Run /create-task when ready to start work — tasks/missions
     will read CONTEXT.md so they speak the right language.
   ```

## Notes
- This workflow is an **orchestrator** — all real work is delegated.
- Agents run in parallel; each writes to its own file (no contention).
- `UBIQUITOUS_LANGUAGE.md` follows the format defined by the
  `ubiquitous-language` skill — do not modify that format here.
- `CONTEXT.md` follows the format in
  `.claude/skills/domain-model/CONTEXT-FORMAT.md`.
- ADRs (`docs/adr/`) are NOT created here — they're created lazily
  by `/domain-model` when a real trade-off is recorded.
