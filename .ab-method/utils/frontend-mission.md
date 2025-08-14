# Frontend Mission Utils

## Purpose
Guide frontend missions by loading architecture documentation and coordinating frontend agents.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find architecture documentation paths.

## Architecture Loading

### 1. Read Structure Index
```yaml
Check .ab-method/structure/index.yaml for:
- docs.architecture location
- frontend-patterns.md path
- tech-stack.md path
- backend-patterns.md path (for API types)
```

### 2. Load Relevant Architecture Docs
Based on index.yaml paths, read:
- **frontend-patterns.md** - Component architecture, state management, routing
- **tech-stack.md** - Frontend frameworks, UI libraries, build tools
- **backend-patterns.md** - API types and DTOs to use in frontend
- **entry-points.md** - Frontend routes and entry points

### 3. Extract Key Patterns
From architecture docs, identify:
- Component structure (atomic/feature-based)
- State management approach
- Styling methodology (CSS Modules/Tailwind/styled)
- Data fetching patterns

### 4. Check Previous Missions
If backend missions completed, extract:
- API endpoints created
- Data types/DTOs defined
- Use backend types for TypeScript interfaces

## Agent Coordination

### Phase 1: UX Expert Agent
Deploy with context from architecture docs:
```
Task: "Plan frontend architecture for [mission]"
Context provided:
- Current patterns from frontend-patterns.md
- Design system/colors if defined
- Backend types from previous missions
- Component architecture patterns

Agent should:
1. Analyze current component structure
2. Check design requirements (screenshots/Figma)
3. Define components to create/modify
4. Use backend types for props/state
5. Plan component hierarchy
6. Document in mission file
```

### Phase 2: Frontend Developer Agent
Deploy with architecture plan:
```
Task: "Implement frontend for [mission]"
Context provided:
- Architecture plan from mission doc
- Component patterns from docs
- Backend API endpoints available

Agent should:
1. Implement planned components
2. Connect to backend APIs
3. Add styling following patterns
4. Update mission doc with progress
```

## Key Guidelines for Agents

### For UX Expert:
- Reuse existing design tokens/colors
- Follow component naming conventions
- Plan for responsive design
- Use backend types (e.g., Todo[] from backend)
- Consider accessibility requirements
- Check existing UI libraries before adding new

### For Frontend Developer:
- Update mission status: In dev → Testing → Completed
- Use TypeScript types from backend
- Follow existing state management patterns
- Implement proper error handling
- Update progress tracker continuously

## Mission Document Updates
Ensure agents update these sections:
```markdown
## Architecture Plan
✓ Component hierarchy defined
✓ State management planned
⏳ Components in progress
○ API integration pending

## Files Modified
- /components/TodoTable.tsx - Created
- /hooks/useTodos.ts - Created
- /styles/TodoTable.module.css - In progress
```

## Backend Integration
When backend missions exist:
```typescript
// Use types from backend
import type { Todo } from '@/api/types'

// Use endpoints created in backend missions
const API_ENDPOINTS = {
  todos: '/api/todos' // From mission-1-backend
}
```

## Remember
- This utils file reads architecture docs
- Load backend types when available
- Mission workflow delegates here
- Agents get context from this file
- Check `.ab-method/structure/index.yaml` for all paths
