# Backend Mission Utils

## Purpose
Guide backend missions by loading architecture documentation and coordinating backend agents.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find architecture documentation paths.

## Architecture Loading

### 1. Read Structure Index
```yaml
Check .ab-method/structure/index.yaml for:
- docs.architecture location
- backend-patterns.md path
- tech-stack.md path
- external-services.md path
```

### 2. Load Relevant Architecture Docs
Based on index.yaml paths, read:
- **backend-patterns.md** - Current API architecture, database patterns, service layers
- **tech-stack.md** - Backend frameworks, libraries, tools in use
- **entry-points.md** - Existing API endpoints and routes
- **external-services.md** - Third-party APIs and integrations

### 3. Extract Key Patterns
From architecture docs, identify:
- API style (REST/GraphQL/gRPC)
- Database approach (ORM/raw SQL)
- Authentication method
- File organization pattern

## Agent Coordination

### Phase 1: Backend Architect Agent
Deploy with context from architecture docs:
```
Task: "Plan backend architecture for [mission]"
Context provided:
- Current patterns from backend-patterns.md
- Tech stack from tech-stack.md
- Existing endpoints from entry-points.md

Agent should:
1. Analyze current backend implementation
2. Define files to create/modify
3. Create DTOs using database types (e.g., TodosTable["status"])
4. Document in mission file
```

### Phase 2: Backend Developer Agent
Deploy with architecture plan:
```
Task: "Implement backend for [mission]"
Context provided:
- Architecture plan from mission doc
- Code style from existing files

Agent should:
1. Implement planned changes
2. Update mission doc with progress
3. Mark completed items
```

## Key Guidelines for Agents

### For Backend Architect:
- Use database column types directly for maintainability
- Follow existing routing patterns
- Maintain separation of concerns
- Plan for reusability
- Check existing packages before suggesting new ones

### For Backend Developer:
- Update mission status: In dev → Testing → Completed
- Mark each completed item in architecture plan
- Document all file changes
- Update progress tracker

## Mission Document Updates
Ensure agents update these sections:
```markdown
## Architecture Plan
✓ Models defined
✓ Routes planned
⏳ Services in progress

## Files Modified
- /api/todos/route.ts - Created
- /models/todo.ts - Created
- /services/todoService.ts - In progress
```

## Remember
- This utils file reads architecture docs
- Mission workflow delegates here
- Agents get context from this file
- Continuous updates to mission doc
- Check `.ab-method/structure/index.yaml` for all paths
