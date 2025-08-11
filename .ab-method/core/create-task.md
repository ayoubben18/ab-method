# Create Task Workflow

## Purpose
Create a focused task following the AB Method principle: one task at a time to conserve context and avoid redundant implementations.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where task documents should be created.

## Process

### 1. Define Problem Statement
Gather from user:
- **Problem**: What needs to be solved?
- **Context**: What should we use, follow, or pay attention to?
- **End Result**: What should the final solution look like?

### 2. Analyze Project Context
**CRITICAL: Before creating any missions, understand the existing codebase:**

1. **Check `.ab-method/structure/index.yaml`** for architecture doc locations
2. **Read architecture documentation** to understand:
   - `tech-stack.md` - What technologies are in use
   - `entry-points.md` - Existing routes and entry points
   - `frontend-patterns.md` - Component structure and state management
   - `backend-patterns.md` - API patterns and database approach
   - `external-services.md` - Third-party integrations
   - `project-constraints.md` - Limitations and requirements

3. **Analyze relevant code areas** based on the problem:
   - Search for similar existing implementations
   - Understand file organization patterns
   - Identify reusable components/services
   - Check for existing types/models related to the task

### 3. Identify Task Type
Based on problem AND project analysis:
- **Frontend**: Client-side only
- **Backend**: Server-side only  
- **Full-stack**: Both frontend and backend

### 4. Create Task Document
Based on `.ab-method/structure/index.yaml`, create a task folder with:
```
tasks/[task-name]/
  progress-tracker.md
```

### 4. Initialize Progress Tracker with All Missions
Create `progress-tracker.md` with:
```markdown
# Task: [Task Name]

## Task Status
Current: Brainstormed

## Problem Statement
[User's problem description]

## Context & Constraints
- [What to use/follow]
- [Any limitations]
- [User requirements]

## Expected Outcome
[Description of end result]

## Task Type
[Frontend/Backend/Full-stack]

## Missions
- [ ] Mission 1: [Frontend/Backend] - [Specific action based on project analysis]
- [ ] Mission 2: [Frontend/Backend] - [Build on Mission 1]
- [ ] Mission 3: [Frontend/Backend] - [Build on Mission 2]
- [ ] Mission N: [Frontend/Backend] - [Continue as needed]

## Notes
- Task created: YYYY-MM-DD
- Status: Brainstormed → Validated → In dev → Testing → Completed
- All missions defined upfront based on problem analysis
- Each mission builds incrementally on previous ones
```

### 5. Define All Missions Based on Task Type and Project Analysis

**IMPORTANT: Define missions based on actual project structure discovered in Step 2, not generic templates**

#### For Frontend Tasks:
- Mission 1: Frontend - [Based on component patterns found in frontend-patterns.md]
- Mission 2: Frontend - [Based on state management approach in use]
- Mission 3: Frontend - [Based on styling methodology discovered]
- Mission N: Frontend - [Testing using project's test framework]

#### For Backend Tasks:
- Mission 1: Backend - [Based on database patterns in backend-patterns.md]
- Mission 2: Backend - [Following API style from entry-points.md]
- Mission 3: Backend - [Using services pattern from existing code]
- Mission N: Backend - [Testing with project's test setup]

#### For Full-stack Tasks (Backend First - Default):
**Note: We start with backend to provide ready types and data for frontend (unless user prefers otherwise)**
- Mission 1: Backend - [Specific action based on backend-patterns.md]
- Mission 2: Backend - [API following existing patterns]
- Mission 3: Frontend - [Components using backend types]
- Mission 4: Frontend - [Integration with created APIs]
- Mission N: Full-stack - [End-to-end testing]

#### For Full-stack Tasks (Frontend First - If User Requests):
- Mission 1: Frontend - [UI based on existing component patterns]
- Mission 2: Frontend - [State management following project approach]
- Mission 3: Backend - [API matching frontend requirements]
- Mission 4: Full-stack - [Integration and refinement]
- Mission N: Full-stack - [Testing and optimization]

### 6. Confirm with User
Show the task document with all missions and ask:
"I've created the task with all missions defined. Task status is set to 'Brainstormed'. For full-stack tasks, I've started with backend missions to provide ready types and data for the frontend. Ready to validate and start Mission 1?"

When user confirms, update status to 'Validated' and begin implementation.

## Key Principles
- **One task at a time** - Maintain focus, conserve context
- **All missions upfront** - Define complete roadmap when creating task
- **Backend first for full-stack** - Easier types and ready data for frontend
- **Incremental building** - Each mission expands on previous work
- **Avoid duplication** - Check if similar work was done in previous tasks

## Example
User: "Create a todos table that fetches from API and displays in frontend"

Result (Backend First):
```
tasks/todo-table/
  progress-tracker.md
```

With missions (after analyzing project):
- Mission 1: Backend - Create todo model using Prisma schema (found in project)
- Mission 2: Backend - Build REST API endpoints following /api pattern
- Mission 3: Frontend - Create table component using existing DataTable pattern
- Mission 4: Frontend - Connect using project's API client service
- Mission 5: Full-stack - Add filtering using existing query patterns

## Remember
- **ALWAYS analyze project context first** - Never create generic missions
- Check `.ab-method/structure/index.yaml` for paths
- Read ALL architecture docs before defining missions
- Every mission must specify Frontend/Backend/Full-stack
- Define missions based on discovered patterns, not templates
- Default to backend-first for full-stack tasks
- Each mission incrementally builds on the previous
- Keep task document as working scratchpad
