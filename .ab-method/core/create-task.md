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

### 2. Identify Task Type
Determine the scope:
- **Frontend**: Client-side only
- **Backend**: Server-side only  
- **Full-stack**: Both frontend and backend

### 3. Create Task Document
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
- [ ] Mission 1: [Define based on task type and problem]
- [ ] Mission 2: [Build on Mission 1]
- [ ] Mission 3: [Build on Mission 2]
- [ ] Mission N: [Continue as needed]

## Notes
- Task created: YYYY-MM-DD
- Status: Brainstormed → Validated → In dev → Testing → Completed
- All missions defined upfront based on problem analysis
- Each mission builds incrementally on previous ones
```

### 5. Define All Missions Based on Task Type

#### For Frontend Tasks:
- Mission 1: Set up component structure
- Mission 2: Implement data fetching/state
- Mission 3: Add styling and interactions
- Mission N: Testing and refinements

#### For Backend Tasks:
- Mission 1: Define data models/schema
- Mission 2: Create API endpoints
- Mission 3: Add business logic
- Mission N: Testing and optimization

#### For Full-stack Tasks (Backend First - Default):
**Note: We start with backend to provide ready types and data for frontend (unless user prefers otherwise)**
- Mission 1: Backend - Define models and database schema
- Mission 2: Backend - Create API endpoints
- Mission 3: Frontend - Build components with types from backend
- Mission 4: Frontend - Connect to backend APIs
- Mission N: Integration testing and polish

#### For Full-stack Tasks (Frontend First - If User Requests):
- Mission 1: Frontend - Create UI components with mock data
- Mission 2: Frontend - Define expected data structures
- Mission 3: Backend - Build API to match frontend needs
- Mission 4: Integration - Connect and refine
- Mission N: Testing and optimization

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

With missions:
- Mission 1: Backend - Create todo model and database schema
- Mission 2: Backend - Build CRUD API endpoints for todos
- Mission 3: Frontend - Create table component with TypeScript types from backend
- Mission 4: Frontend - Connect table to API endpoints
- Mission 5: Add filtering and sorting features

## Remember
- Check `.ab-method/structure/index.yaml` for paths
- Define all missions when creating the task
- Default to backend-first for full-stack tasks
- Each mission incrementally builds on the previous
- Keep task document as working scratchpad
