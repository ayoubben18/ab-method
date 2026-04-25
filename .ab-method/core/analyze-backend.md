# Analyze Backend Workflow

## Purpose
Document server-side architecture: API design, data layer, auth, services, background work. External services, testing, deployment, and language/runtime details are out of scope here — they live in `docs/architecture/tech-stack.md`.

## Configuration
**ALWAYS check `.ab-method/structure/index.yaml` first** for the output path.

## Process

### 1. Discovery
- Detect framework (Express, Fastify, Hono, Django, Rails, Spring, etc.)
- Find entry point (server.js, app.py, main.go, etc.)

### 2. API Design
- Style (REST, GraphQL, gRPC, RPC)
- Endpoint organization and versioning
- Middleware chain
- Request/response conventions

### 3. Data Layer
- Database(s) and access pattern (ORM, query builder, raw SQL)
- Schema/models and relationships
- Migration strategy
- Caching layer if any

### 4. Auth
- Strategy (JWT, sessions, OAuth, API keys)
- Roles/permissions model
- Protected endpoints — pattern, not full list

### 5. Service Architecture
- Layering (controllers / services / repos, hexagonal, vertical slices, etc.)
- Business logic patterns
- Internal communication (function calls, events, queues)
- Dependency wiring (DI container, factories, manual)

### 6. Background Work
- Queue/scheduler implementation
- Worker processes
- Event-driven patterns

### 7. Error Handling
- Error types and propagation
- Logging patterns
- Observability hooks

## Output

### Location
Path defined in `.ab-method/structure/index.yaml` → `workflow_outputs.analyze-backend`.

### `backend-patterns.md` Structure
```markdown
# Backend Patterns

## Framework
- Framework + version
- Entry point

## API
- Style and conventions
- Endpoint organization
- Middleware chain

## Data
- Database(s)
- Access pattern (ORM/raw)
- Schema highlights
- Caching

## Auth
- Strategy
- Roles/permissions
- Protected-route pattern

## Services
- Layering
- Business-logic patterns
- Internal communication
- DI/wiring

## Background Work
- Queues/schedulers
- Workers
- Events

## Error Handling
- Error types
- Logging
- Observability

## Cross-references
- Runtime, external services, testing, deployment → docs/architecture/tech-stack.md
```

## Key Files
- package.json / requirements.txt / go.mod / pom.xml
- Main entry point
- Route/controller definitions
- Model/schema definitions
- Database config
- Middleware config
