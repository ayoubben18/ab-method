# Create Task Workflow

## Purpose
Create a focused task following the AB Method principle: one task at a time to conserve context and avoid redundant implementations.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where task documents should be created.

## Process

### 1. Define Problem Statement (Interactive Gathering)
**CRITICAL: Keep asking questions until you have ALL necessary information**

#### Initial Questions:
- **Problem**: What needs to be solved?
- **Context**: What should we use, follow, or pay attention to?
- **End Result**: What should the final solution look like?

#### Follow-up Questions (Ask until clear):

**If the problem is vague**, ask:
- "Can you describe a specific user action or scenario?"
- "What's currently broken or missing?"
- "What triggered this need?"

**For file/code modifications**, ask:
- "Which specific files or components need to be modified?"
- "Can you point me to an example in the codebase?"
- "Should this follow a pattern from existing code?"

**For new features**, ask:
- "Where in the application will this appear?"
- "Which existing features will this interact with?"
- "Do you have a design or mockup?"

**For data/API changes**, ask:
- "What data fields are involved?"
- "Which endpoints need to be created/modified?"
- "What's the data flow (frontend → backend → database)?"

**For UI/UX tasks**, ask:
- "Can you describe the user interaction step-by-step?"
- "Which pages/screens are affected?"
- "Are there similar components I should match?"

#### Stop Conditions:
Only proceed to Step 2 when you have:
✓ Clear understanding of WHAT needs to be done
✓ Specific files/areas that will be affected
✓ Expected behavior/output defined
✓ Any constraints or requirements identified

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
   - `testing-strategy.md` - Test frameworks, patterns, and commands

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
- **No vague tasks** - Keep asking until you have specifics

## ❌ Never Accept These Vague Requests:
- "Make it better"
- "Fix the bug" (which bug? where?)
- "Add some tests" (for what? which files?)
- "Improve performance" (of what specifically?)
- "Make it look nice" (which component? what style?)
- "Add CRUD operations" (for what entity? which endpoints?)
- "Refactor the code" (which code? why? what's the goal?)

## ✅ Instead, Get Specifics:
- "Make the login form validation show inline errors"
- "Fix the 404 error when deleting users from admin panel"
- "Add unit tests for the payment service calculateTax function"
- "Improve query performance for /api/reports endpoint"
- "Update TodoCard component to match the new design system"
- "Add CRUD for products with images and categories"
- "Refactor auth middleware to use JWT instead of sessions"

## Example: Interactive Information Gathering

### Initial Request:
User: "I want to add a search feature"

### System Response (Too Vague):
"I need more details to create a proper task. Let me ask some questions:

1. **What type of search?** (users, products, content, etc.)
2. **Where will the search appear?** (header, specific page, modal?)
3. **What fields should be searchable?**"

User: "Search for products on the shop page"

### System Follow-up:
"Good! Let me understand better:

1. **Which fields?** (name, description, category, price range?)
2. **Real-time or on submit?**
3. **Any existing search components I should follow?**"

User: "Search by name and category, real-time like the user filter"

### System Final Clarification:
"Perfect! Let me confirm:
- Add product search to shop page
- Search by: name and category
- Real-time filtering (like existing user filter at /components/UserFilter.tsx)
- Should this also include the dropdown filter pattern?

One more thing: **Which API endpoint handles products?**"

User: "/api/products - it already has query params support"

### System Result:
"Great! Now I have everything needed. Analyzing project..."

*[Proceeds to Step 2 with clear context]*

With missions (after analyzing project):
- Mission 1: Backend - Extend /api/products query params for search
- Mission 2: Frontend - Create ProductSearch component using UserFilter pattern
- Mission 3: Frontend - Integrate search into shop page with real-time updates
- Mission 4: Full-stack - Add debouncing and loading states

## Remember
- **ALWAYS analyze project context first** - Never create generic missions
- Check `.ab-method/structure/index.yaml` for paths
- Read ALL architecture docs before defining missions
- Every mission must specify Frontend/Backend/Full-stack
- Define missions based on discovered patterns, not templates
- Default to backend-first for full-stack tasks
- Each mission incrementally builds on the previous
- Keep task document as working scratchpad
