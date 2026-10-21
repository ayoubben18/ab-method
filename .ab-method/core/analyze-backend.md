# Analyze Backend Workflow

## Purpose
Document server-side architecture as small topic files: API, data, auth, services, background work, errors. Runtime, external services, testing and deployment live in `docs/architecture/tech-stack.md` — link, don't repeat.

## Configuration
**ALWAYS check `.ab-method/structure/index.yaml` first** for the output folder and `doc_budgets`. Follow `.ab-method/rules/communication.md` with the user and `.ab-method/rules/docs.md` for every file written.

## Process

### 1. Discovery
- Framework (Express, Fastify, Hono, Django, Rails, Spring, …) and entry point.
- Legacy `docs/architecture/backend-patterns.md` present → read it as input; carry over only what is still true in the code, then delete it. Mention `/ab-cleanup` for the rest of the repo.

### 2. Analyze each topic
- **api** — style (REST/GraphQL/RPC), endpoint organization, versioning, middleware chain, request/response conventions.
- **data** — databases, access pattern (ORM / query builder / SQL), schema highlights, migrations, caching.
- **auth** — strategy, roles/permissions, protected-route pattern (pattern, not the list).
- **services** — layering, business-logic patterns, internal communication, dependency wiring.
- **background** — queues, schedulers, workers, events.
- **errors** — error types and propagation, logging, observability.

Add a topic only when the codebase has a real pattern for it; skip topics with nothing to say.

## Output

Folder from `.ab-method/structure/index.yaml` → `workflow_outputs.analyze-backend` (default `docs/architecture/backend/`):

```
docs/architecture/backend/
  index.md        # one line per topic: `- [auth](auth.md) — session auth via middleware; API keys resolve to the same context`
  api.md
  data.md
  auth.md
  services.md
  background.md
  errors.md
```

Each topic file:

```markdown
# <Topic>

- **Rule** — one line. Example: `path/to/exemplar.ts`.
- **Rule** — one line. Example: `path/to/other.ts`.
```

Rules plus one exemplar each; no instance lists, no history, the why as an ADR link. Stay within budget (index 300 words, topic 600 by default).

### Gate
```bash
node .ab-method/scripts/check-docs.js   # plugin installs: npx ab-method check-docs
```
Compact any failing file before reporting.

## Key Files
Manifest (package.json / requirements.txt / go.mod / pom.xml) · entry point · routes/controllers · models/schema · DB config · middleware config
