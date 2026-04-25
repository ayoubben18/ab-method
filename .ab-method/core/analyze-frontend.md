# Analyze Frontend Workflow

## Purpose
Document client-side architecture: components, state, routing, styling, API integration. Build tooling, testing, and external services are out of scope here — they live in `docs/architecture/tech-stack.md`.

## Configuration
**ALWAYS check `.ab-method/structure/index.yaml` first** for the output path.

## Process

### 1. Discovery
- Detect framework (React, Vue, Angular, Svelte, etc.)
- Find main entry point (index.tsx, main.ts, App.tsx, etc.)

### 2. Component Architecture
- Component hierarchy and organization
- Reusable vs page components
- Composition patterns (functional, hooks, HOCs, slots)

### 3. State Management
- Solution (Redux, Zustand, MobX, Context, signals, etc.)
- Store shape and data flow
- Local vs global state

### 4. Routing
- Routing library and config
- Route map (high-level, not exhaustive)
- Protected/auth-gated routes

### 5. Styling
- Methodology (CSS Modules, Tailwind, styled-components, etc.)
- Theme/token system
- Responsive approach

### 6. API Integration
- Client setup (fetch wrapper, axios, tRPC, GraphQL client, etc.)
- Request/response patterns
- Error handling and retries
- Caching/data-fetching layer (React Query, SWR, RTK Query, etc.)

## Output

### Location
Path defined in `.ab-method/structure/index.yaml` → `workflow_outputs.analyze-frontend`.

### `frontend-patterns.md` Structure
```markdown
# Frontend Patterns

## Framework
- Framework + version
- Entry point

## Components
- Organization
- Naming + composition conventions

## State
- Solution and store shape
- Data flow

## Routing
- Library
- Route map
- Auth-gated routes

## Styling
- Methodology
- Theme/tokens
- Responsive approach

## API Layer
- Client and patterns
- Error handling
- Caching/data-fetching

## Cross-references
- Build tooling, testing, external services → docs/architecture/tech-stack.md
```

## Key Files
- package.json
- src/index.* / main entry
- src/App.* / root component
- Router config
- Store/state config
- API client
