# Analyze Frontend Workflow

## Purpose
Document client-side architecture as small topic files: components, state, routing, styling, API integration. Build tooling, testing and external services live in `docs/architecture/tech-stack.md` — link, don't repeat.

## Configuration
**ALWAYS check `.ab-method/structure/index.yaml` first** for the output folder and `doc_budgets`. Follow `.ab-method/rules/communication.md` with the user and `.ab-method/rules/docs.md` for every file written.

## Process

### 1. Discovery
- Framework (React, Vue, Angular, Svelte, …) and main entry point.
- Legacy `docs/architecture/frontend-patterns.md` present → read it as input; carry over only what is still true in the code, then delete it. Mention `/ab-cleanup` for the rest of the repo.

### 2. Analyze each topic
- **components** — hierarchy, reusable vs page components, composition.
- **state** — solution, store shape, data flow, local vs global.
- **routing** — library, route map (high level), auth-gated routes.
- **styling** — methodology, theme/tokens, responsive approach.
- **data-fetching** — client setup, request/response, errors, caching layer.

Add a topic only when the codebase has a real pattern for it (forms, tables, i18n, …); skip topics with nothing to say.

## Output

Folder from `.ab-method/structure/index.yaml` → `workflow_outputs.analyze-frontend` (default `docs/architecture/frontend/`):

```
docs/architecture/frontend/
  index.md          # one line per topic: `- [state](state.md) — Zustand stores per feature, server state in React Query`
  components.md
  state.md
  routing.md
  styling.md
  data-fetching.md
```

Each topic file:

```markdown
# <Topic>

- **Rule** — one line. Example: `path/to/exemplar.tsx`.
- **Rule** — one line. Example: `path/to/other.tsx`.
```

Rules plus one exemplar each; no instance lists, no history, nothing the code says plainly. Stay within budget (index 300 words, topic 600 by default).

### Gate
```bash
node .ab-method/scripts/check-docs.js   # plugin installs: npx ab-method check-docs
```
Compact any failing file before reporting.

## Key Files
package.json · main entry · root component · router config · store config · API client
