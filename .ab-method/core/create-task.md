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

**For technical constraints and code guidance**, ask:
- "Are there specific coding standards or patterns I should follow?"
- "Which existing components or services should I reuse or avoid?"
- "Are there particular libraries, frameworks, or versions I must use?"
- "What are the testing requirements for this task?"
- "Are there performance considerations or constraints?"
- "Should this follow any specific file naming or organization patterns?"

#### Stop Conditions:
Only proceed to Step 2 when you have:
✓ Clear understanding of WHAT needs to be done
✓ Specific files/areas that will be affected
✓ Expected behavior/output defined
✓ Any constraints or requirements identified
✓ Technical constraints and coding patterns clarified
✓ Testing requirements and expectations defined
✓ Performance considerations identified (if applicable)

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

4. **Extract technical context for documentation**:
   - Code constraints: File naming conventions, coding standards, linting rules
   - Architecture hints: Patterns to follow, services to reuse, integration points
   - Tech stack requirements: Required libraries/frameworks, versions, dependencies
   - API constraints: Endpoint naming, authentication patterns, data validation
   - File organization: Directory structure, import/export patterns
   - Testing requirements: Coverage expectations, test frameworks, file patterns
   - Performance considerations: Caching strategies, optimization requirements

### 3. Identify Task Type
Based on problem AND project analysis:
- **Frontend**: Client-side only
- **Backend**: Server-side only
- **Full-stack**: Both frontend and backend

#### Task Complexity Assessment:
**Simple Tasks** (Single mission - combine all steps):
- Adding a single field to an existing form
- Creating a basic CRUD operation for an existing entity
- Simple component styling changes
- Adding validation to an existing field
- Creating a straightforward utility function
- Basic text/content updates
- Simple configuration changes
- Adding a single endpoint that follows existing patterns

**Complex Tasks** (Multiple missions - break down):
- New feature with multiple components and backend changes
- Implementing authentication/authorization
- Complex data relationships or new entities
- Multi-step user flows
- Integration with external services
- Major refactoring or architectural changes
- Features requiring multiple API endpoints
- Tasks involving file uploads, payments, or complex business logic

### 4. Create Task Document
Based on `.ab-method/structure/index.yaml`, create a task folder with:
```
tasks/[task-name]/
  progress-tracker.md
  sub-agents-outputs/
```

### 5. Initialize Progress Tracker with All Missions
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

## Technical Context
### Code Constraints
- [File naming conventions to follow]
- [Coding standards and linting rules]
- [Specific patterns from existing codebase]

### Architecture Hints
- [Existing services/components to reuse]
- [Patterns to follow from similar implementations]
- [Integration points with current architecture]

### Tech Stack Requirements
- [Required libraries/frameworks and versions]
- [Dependencies to avoid or prefer]
- [Environment-specific considerations]

### API Constraints
- [Endpoint naming conventions]
- [Authentication/authorization requirements]
- [Data validation patterns]

## Code Guidance
### File Organization
- [Where to place new files based on project structure]
- [Directory conventions to follow]
- [Import/export patterns]

### Testing Requirements
- [Test coverage expectations]
- [Test file naming and placement patterns]
- [Testing frameworks and utilities to use]

### Performance Considerations
- [Caching strategies to implement]
- [Optimization requirements]
- [Resource usage constraints]

## Missions
- [ ] Mission 1: [Frontend/Backend] - [Specific action based on project analysis]
- [ ] Mission 2: [Frontend/Backend] - [Build on Mission 1]
- [ ] Mission 3: [Frontend/Backend] - [Build on Mission 2]
- [ ] Mission N: [Frontend/Backend] - [Continue as needed]

## Agent Usage Tracking
*Agents used across all missions will be tracked here*

### Mission 1 Agents
- (To be updated during mission execution)

### Mission 2 Agents
- (To be updated during mission execution)

## Sub-Agent Outputs
*Links to detailed agent outputs stored in sub-agents-outputs/ folder*

## Notes
- Task created: YYYY-MM-DD
- Status: Brainstormed → Validated → In dev → Testing → Completed
- All missions defined upfront based on problem analysis
- Each mission builds incrementally on previous ones
- Agent outputs tracked for context window optimization
```

### 6. Define All Missions Based on Task Type and Project Analysis

**IMPORTANT: Define missions based on actual project structure discovered in Step 2, not generic templates**

#### For Simple Tasks:
**Create a single compact mission that includes all necessary steps**

##### Simple Frontend Tasks:
- Mission 1: Frontend - [Complete implementation including component creation, styling, state management, and testing in one mission]

##### Simple Backend Tasks:
- Mission 1: Backend - [Complete implementation including database changes, API endpoint, validation, and testing in one mission]

##### Simple Full-stack Tasks:
- Mission 1: Full-stack - [Complete end-to-end implementation including backend API, frontend component, and integration in one mission]

#### For Complex Tasks:
**Break down into logical, sequential missions**

##### Complex Frontend Tasks:
- Mission 1: Frontend - [Core component structure based on frontend-patterns.md]
- Mission 2: Frontend - [State management and data flow]
- Mission 3: Frontend - [Advanced features and interactions]
- Mission N: Frontend - [Testing and polish]

##### Complex Backend Tasks:
- Mission 1: Backend - [Database schema and core models]
- Mission 2: Backend - [API endpoints and business logic]
- Mission 3: Backend - [Advanced features and integrations]
- Mission N: Backend - [Testing and optimization]

##### Complex Full-stack Tasks (Backend First - Default):
**Note: We start with backend to provide ready types and data for frontend (unless user prefers otherwise)**
- Mission 1: Backend - [Core data model and primary API]
- Mission 2: Backend - [Additional endpoints and business logic]
- Mission 3: Frontend - [Core UI components using backend types]
- Mission 4: Frontend - [Advanced features and user interactions]
- Mission N: Full-stack - [Integration testing and refinement]

##### Complex Full-stack Tasks (Frontend First - If User Requests):
- Mission 1: Frontend - [Core UI and user flow]
- Mission 2: Frontend - [Advanced interactions and state management]
- Mission 3: Backend - [API matching frontend requirements]
- Mission 4: Backend - [Additional backend features and validation]
- Mission N: Full-stack - [Integration and end-to-end testing]

### 7. Confirm with User
Show the task document with all missions and ask:
"I've created the task with all missions defined. Task status is set to 'Brainstormed'. For full-stack tasks, I've started with backend missions to provide ready types and data for the frontend. Ready to validate and start Mission 1?"

When user confirms, update status to 'Validated' and begin implementation.

## Key Principles
- **One task at a time** - Maintain focus, conserve context
- **Complexity-driven mission planning** - Single missions for simple tasks, multiple missions only when genuinely complex
- **All missions upfront** - Define complete roadmap when creating task
- **Backend first for complex full-stack** - Easier types and ready data for frontend
- **Incremental building** - Each mission expands on previous work (for complex tasks)
- **Avoid duplication** - Check if similar work was done in previous tasks
- **No vague tasks** - Keep asking until you have specifics
- **Compact simplicity** - Don't over-engineer simple operations

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

**Complexity Assessment:** This is a complex task (new feature with multiple components)

With missions (after analyzing project):
- Mission 1: Backend - Extend /api/products query params for search
- Mission 2: Frontend - Create ProductSearch component using UserFilter pattern
- Mission 3: Frontend - Integrate search into shop page with real-time updates
- Mission 4: Full-stack - Add debouncing and loading states

## Simple Task Example

### Initial Request:
User: "Add an email field to the user registration form"

### System Response:
"I need to understand the scope:
1. **Which registration form?** (path/component name)
2. **Any specific validation rules?**
3. **Should this be optional or required?**"

User: "The /register page form, required field with email validation"

### System Analysis:
*[Analyzes project and finds existing form validation patterns]*

**Complexity Assessment:** This is a simple task (single field addition with existing patterns)

**Task Created with Single Mission:**
- Mission 1: Full-stack - Add required email field to registration form with validation, following existing form patterns and validation rules in UserForm component

## Remember
- **ALWAYS analyze project context first** - Never create generic missions
- Check `.ab-method/structure/index.yaml` for paths
- Read ALL architecture docs before defining missions
- Every mission must specify Frontend/Backend/Full-stack
- Define missions based on discovered patterns, not templates
- Default to backend-first for full-stack tasks
- Each mission incrementally builds on the previous
- Keep task document as working scratchpad
