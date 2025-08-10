# Analyze Backend Workflow

## Purpose
Deep analysis of backend architecture, services, and patterns to document the server-side structure.

## Important Configuration
**ALWAYS check `.ab-method/structure/index.yaml` first** to determine where to save the output documentation. Do not assume paths - they are configurable by the user.

## Process

### 1. Initial Discovery
- Detect backend framework (Express, Django, Rails, Spring, etc.)
- Identify main language and runtime version
- Find entry point (server.js, app.py, main.go, etc.)
- Locate configuration files

### 2. API Architecture
- Map all API endpoints
- Document HTTP methods and routes
- Identify API versioning strategy
- Document request/response formats
- Analyze middleware chain

### 3. Database Layer
- Identify database type(s) (SQL, NoSQL, etc.)
- Document schema/models
- Map relationships between entities
- Identify migration strategy
- Document query patterns (ORM, raw SQL, etc.)

### 4. Authentication & Authorization
- Identify auth strategy (JWT, sessions, OAuth, etc.)
- Document user roles and permissions
- Map protected endpoints
- Analyze security middleware

### 5. Service Architecture
- Document service layer organization
- Identify business logic patterns
- Map internal service communication
- Document dependency injection patterns

### 6. External Integrations
- Third-party API integrations
- Message queues/brokers
- Cache layers (Redis, Memcached, etc.)
- File storage solutions
- Email/notification services

### 7. Background Jobs
- Job queue implementation
- Scheduled tasks/cron jobs
- Worker processes
- Event-driven processing

### 8. Error Handling & Logging
- Error handling patterns
- Logging strategy and tools
- Monitoring integration
- Debug configuration

### 9. Testing Strategy
- Unit test patterns
- Integration test setup
- API testing approach
- Test database configuration

## Output

### Location
Check `.ab-method/structure/index.yaml` for the output path. The workflow_outputs section will specify where to save the backend analysis results.

### backend-patterns.md Structure:
```markdown
# Backend Architecture

## Framework & Runtime
- Main framework and version
- Language and runtime version
- Key dependencies

## API Design
- Architecture style (REST, GraphQL, gRPC)
- Endpoint organization
- Versioning strategy
- Documentation approach

## Data Layer
- Database systems used
- Schema design patterns
- Query optimization strategies
- Caching strategy

## Authentication & Security
- Auth implementation
- Security measures
- Rate limiting
- CORS configuration

## Service Architecture
- Service organization
- Business logic patterns
- Dependency management
- Error boundaries

## External Services
- Third-party integrations
- Message systems
- Storage solutions
- Communication protocols

## Background Processing
- Job queue system
- Scheduled tasks
- Event processing
- Worker configuration

## DevOps & Deployment
- Environment configuration
- Container setup
- CI/CD pipeline
- Monitoring setup

## Testing Infrastructure
- Test strategies
- Mock patterns
- Test data management
- Coverage goals
```

## Key Files to Analyze
- package.json, requirements.txt, go.mod, pom.xml, etc.
- Main application entry point
- Route/controller definitions
- Model/schema definitions
- Database configuration
- Middleware configuration
- Environment configuration files
- Docker/deployment files
