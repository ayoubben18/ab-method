# Analyze Project

## Description
Complete project structure analysis to understand architecture, patterns, and technical stack for effective AB Method task planning.

## Usage
```
/analyze-project
```

## Behavior
Loads and executes the analyze-project workflow from `.ab-method/core/analyze-project.md`

This workflow deploys 4 specialized subagents in parallel to produce:
1. `UBIQUITOUS_LANGUAGE.md` (root) — flat domain glossary
2. `CONTEXT.md` (root) — bounded-context overview (or `CONTEXT-MAP.md` + per-context files for multi-context repos)
3. `docs/architecture/tech-stack.md` — stack, entry points, external services, constraints, testing (merged)
4. `docs/architecture/frontend/` — `index.md` + one small file per topic (components, state, routing, styling, data fetching)
5. `docs/architecture/backend/` — `index.md` + one small file per topic (API, data, auth, services, background work)

Every file stays within the word budgets in `.ab-method/structure/index.yaml`, checked by `check-docs` before the workflow reports.

These are **first drafts**. To sharpen the domain language and capture decisions as ADRs, run `/domain-model` afterwards (interactive grilling session).

## Workflow Details
- **Domain Extraction** - Inferred glossary + bounded-context skeleton from code
- **Tech Stack Map** - Single concise file covering stack, entry points, external services, constraints, testing
- **Frontend Patterns** - Client-side architecture
- **Backend Patterns** - Server-side architecture

## Examples
```
/analyze-project
# Performs complete project analysis
# Creates comprehensive architecture documentation
# Documents tech stack, patterns, and constraints for future tasks
```

## Alternative Usage
You can also use the traditional AB Method master controller:
```
/ab-master analyze-project
```