# Create Mission Workflow

## Purpose
Execute one mission at a time, completing it entirely before moving to the next. Each mission uses specialized subagents for architecture and implementation.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find task and mission document locations.

## Process

### 1. Identify Task and Current Context (Interactive Gathering)
**CRITICAL: Keep asking questions until you have ALL necessary information for this specific mission**

#### Initial Questions:
Ask user: "Which task are we creating a mission for? Please provide the task name."

#### Context Loading:
Based on `.ab-method/structure/index.yaml`, read from task folder:
- `progress-tracker.md` - Current task status and mission progress
- Previous mission files (if any) - Knowledge from completed missions

#### Mission Clarification (Ask until clear):
From progress tracker, identify the next uncompleted mission, then **ASK CLARIFYING QUESTIONS**:

**If mission description is vague**, ask:
- "Can you describe exactly what needs to be built in this mission?"
- "What specific functionality should be working when this mission is complete?"
- "What should I be able to test or demo after this mission?"

**For Backend missions**, ask:
- "Which specific API endpoints need to be created/modified?"
- "What data models or database changes are required?"
- "Should this follow existing patterns in the codebase? Which ones?"
- "What authentication/validation rules apply?"
- "Are there specific error handling requirements?"

**For Frontend missions**, ask:
- "Which specific components need to be created/modified?"
- "Where exactly will this appear in the UI (which pages/routes)?"
- "What user interactions should be supported?"
- "Should this match existing component patterns? Which ones?"
- "What data does this component need from the backend?"
- "Are there specific styling/accessibility requirements?"

**For Full-stack missions**, ask:
- "What's the complete user flow from frontend action to backend response?"
- "Which APIs need to be created vs. which frontend components?"
- "How should errors be handled on both ends?"
- "What's the data flow and state management approach?"

**For Planning/Research missions**, ask:
- "What specific decision needs to be made?"
- "What are the key criteria for evaluation?"
- "Are there specific technologies/approaches to compare?"
- "What's the scope of research needed?"

#### Stop Conditions:
Only proceed to Step 3 when you have:
✓ Clear understanding of EXACTLY what this mission should accomplish
✓ Specific files/components that will be affected
✓ Clear acceptance criteria (what "done" looks like)
✓ Understanding of how this mission connects to previous/future missions
✓ Any constraints, patterns, or requirements identified

### 3. Determine Mission Type
Based on clarified requirements, determine mission type:
- **Backend Mission** → Will use `.ab-method/utils/backend-mission.md`
- **Frontend Mission** → Will use `.ab-method/utils/frontend-mission.md`
- **Planning Mission** → Will use `.ab-method/utils/planning-mission.md`

### 4. Load Utils File and Gather Context
**CRITICAL: Read the appropriate utils file FIRST to understand what context is needed:**

1. **Read the relevant utils file** (backend-mission.md, frontend-mission.md, or planning-mission.md)
2. **Check `.ab-method/structure/index.yaml`** to find where architecture docs are located
3. **Based on the utils file guidance**, read the architecture files that are relevant for this mission type:
   - The utils file will specify which architecture docs to load
   - Use paths from index.yaml, don't hardcode them
   - Gather patterns, tech stack, and existing implementations as specified by utils

### 5. Create Mission Document
Create `mission-N-[description].md` in task folder with **DETAILED REQUIREMENTS** from Step 1:
```markdown
# Mission N: [Description]

## Status
Current: Brainstormed

## Objective
[SPECIFIC objective from user clarification - not generic]

## Detailed Requirements
[ALL clarified requirements from interactive gathering]

### Acceptance Criteria
- [ ] [Specific testable outcome 1]
- [ ] [Specific testable outcome 2]
- [ ] [Specific testable outcome 3]

### Technical Specifications
- **Files to Create/Modify**: [Specific file paths from clarification]
- **Patterns to Follow**: [Existing patterns user specified]
- **Integration Points**: [How this connects to other parts]
- **Constraints**: [Any limitations or requirements]

## Dependencies
- Previous missions: [What we're building on]
- External: [APIs, packages, etc.]

## Architecture Plan
(To be filled by architect agent)

## Implementation
(To be filled by developer agent)

## Files Modified
(Updated during development)

## Testing
(Test results and validation)
```

### 6. Validate Before Proceeding
**CRITICAL: Always prompt user with SPECIFIC details before implementation:**
```
Mission N document created with the following plan:

## Summary:
- **Objective**: [Repeat the specific objective]
- **Key Files**: [List the files that will be created/modified]
- **Patterns**: [Existing patterns that will be followed]
- **Acceptance Criteria**: [List the specific outcomes]

## Next Steps:
I will deploy [specific agents] to:
1. [Phase 1 description with specific agent]
2. [Phase 2 description with specific agent]

Does this plan accurately capture what you want for this mission?
If anything is unclear or needs adjustment, please let me know now.

Ready to move from 'Brainstormed' to 'Validated' status and proceed with implementation?
```

**Do NOT proceed until user explicitly confirms the plan is correct.**

## ❌ Never Accept These Vague Mission Descriptions:
- "Build the backend API" (which endpoints? what data?)
- "Create the frontend component" (which component? where? what props?)
- "Add authentication" (what type? where? what flows?)
- "Make it responsive" (which components? what breakpoints?)
- "Fix the styling" (what's wrong? which styles? what's the goal?)
- "Add validation" (for what? what rules? where displayed?)

## ✅ Instead, Get Specifics:
- "Create POST /api/todos endpoint that accepts title/description, saves to database, returns todo with ID"
- "Build TodoCard component for /dashboard that displays title, status toggle, delete button using existing Card pattern"
- "Add JWT authentication to /api/todos endpoints with 401 responses for unauthorized users"
- "Make TodoCard responsive: stack vertically on mobile, grid on desktop, test at 768px breakpoint"
- "Fix TodoCard button alignment - center buttons, match existing ButtonGroup spacing from UserCard"
- "Add client-side validation to todo form: required title, max 100 chars, show errors below inputs"

## Example: Interactive Mission Clarification

### Initial Mission from Progress Tracker:
"Mission 2: Frontend - Create todo table component"

### System Response (Too Vague):
"I need more details about this todo table component. Let me ask some questions:

1. **Where exactly will this table appear?** (which page/route?)
2. **What data should it display?** (which todo fields?)
3. **What user interactions are needed?** (view only, edit, delete, sort?)
4. **Should this follow existing table patterns?** (can you point me to similar tables?)"

User: "It goes on /dashboard page, shows todos from the API with title, status, created date. Users can mark complete and delete."

### System Follow-up:
"Good! Let me understand the details:

1. **Which API endpoint provides the todos?** (GET /api/todos?)
2. **What does the status field look like?** (boolean, enum, string?)
3. **How should mark complete work?** (toggle button, checkbox, PATCH request?)
4. **Delete confirmation needed?** (modal, inline confirm?)
5. **Any existing table components to match?** (like UserTable, ProductTable?)"

User: "GET /api/todos returns array with id, title, status boolean, createdAt. Toggle with PATCH /api/todos/:id. Delete needs confirmation modal. Follow the UserTable pattern in components/tables/"

### System Result:
"Perfect! Now I have everything needed:

## Mission Plan:
- **Objective**: Create TodoTable component for /dashboard page
- **API Integration**: GET /api/todos, PATCH /api/todos/:id, DELETE /api/todos/:id  
- **Features**: Display title/status/date, toggle completion, delete with confirmation
- **Pattern**: Follow UserTable component structure in components/tables/
- **Acceptance Criteria**: 
  - [ ] TodoTable renders todo data from GET /api/todos
  - [ ] Status toggles update backend via PATCH
  - [ ] Delete shows confirmation modal before DELETE request
  - [ ] Matches UserTable styling and structure

Ready to proceed?"

### 7. Execute Mission Based on Type

**Use the context gathered in Step 4 to guide intelligent agent deployment:**

#### For Backend Mission:
**Phase 1: Architecture Planning**
Deploy available backend-focused agents (e.g., nextjs-backend-architect, sst-cloud-architect, backend-architect):
- Provide architecture patterns loaded in Step 4
- Include tech stack information
- Share existing endpoints and services
- Agent creates detailed architecture plan
- **Agent Output**: Creates `sub-agents-outputs/[agent-name]-architecture-[timestamp].md` documenting:
  - Architecture decisions made
  - Files that will be created/modified
  - Integration points identified
  - Dependencies and constraints

**Phase 2: Implementation**
Deploy specialized implementation agents based on mission needs:
- For API development: nextjs-backend-architect, backend-developer
- For serverless: sst-cloud-architect
- For specific frameworks: Use corresponding specialized agents
- **Agent Output**: Each agent creates `sub-agents-outputs/[agent-name]-implementation-[timestamp].md` documenting:
  - Specific files created/modified
  - Code patterns used
  - Configuration changes
  - Testing approach

#### For Frontend Mission:
**Phase 1: UI/UX Planning**
Deploy available frontend-focused agents (e.g., ascii-ui-mockup-generator, shadcn-ui-adapter):
- Provide component patterns loaded in Step 4
- Include design system/styling approach
- Share backend types if available
- **Agent Output**: Creates `sub-agents-outputs/[agent-name]-design-[timestamp].md` documenting:
  - UI mockups and layouts
  - Component hierarchy
  - Styling approach
  - User interaction flows

**Phase 2: Implementation**
Deploy specialized frontend agents based on mission requirements:
- For component creation: shadcn-ui-adapter, frontend-developer
- For testing: vitest-component-tester, playwright-e2e-tester
- For specific UI libraries: Use corresponding specialized agents
- **Agent Output**: Each agent creates `sub-agents-outputs/[agent-name]-implementation-[timestamp].md` documenting:
  - Components created/modified
  - Styling and theming applied
  - State management implementation
  - Accessibility features added

#### For Planning Mission:
Deploy research and analysis agents (e.g., general-purpose, qa-code-auditor):
- **Agent Output**: Creates `sub-agents-outputs/[agent-name]-analysis-[timestamp].md` documenting:
  - Research findings
  - Recommendations
  - Trade-offs analyzed
  - Decision rationale

### 6.1 Agent Output Management
**After each agent completes its work:**

1. **Create Agent Output Document** in `sub-agents-outputs/[agent-name]-[action]-[timestamp].md`
2. **Update Mission Document** with agent summary:
   ```markdown
   ## Agent Activities
   - **[Agent Name]** ([timestamp]) - [Brief description]
     - Output: `sub-agents-outputs/[agent-name]-[action]-[timestamp].md`
     - Summary: [Key accomplishments]
     - Files: [List of files created/modified]
   ```
3. **Update Progress Tracker** with agent usage:
   - Link to agent output files
   - Track which agents were used for which tasks
   - Maintain agent usage history for learning

### 7. Update Progress Throughout

**Mission Status Flow:**
- Brainstormed → Created, awaiting validation
- Validated → Ready for implementation
- In dev → Actively developing
- Testing → Running tests
- Completed → Mission done

**Progress Tracker Updates:**
```markdown
## Task Status
Current: In dev

## Missions
- [x] Mission 1: Backend API - COMPLETED
  - Created: /api/todos endpoints
  - Status: Tested and working
- [ ] Mission 2: Frontend Table - IN DEV
  - Phase: Implementation
  - Next: Connect to API
```

### 8. Mission Completion
When mission is fully complete:
1. Update mission status to "Completed"
2. Update progress tracker
3. Update task status if all missions done
4. Prompt user: "Mission N completed. Ready to start Mission N+1?"

## Key Principles
- **Interactive clarification** - NEVER assume, always ask until crystal clear
- **Specific requirements** - Get exact files, endpoints, patterns, behaviors
- **Detailed acceptance criteria** - Define testable outcomes upfront
- **Validation checkpoint** - User must validate complete plan before implementation
- **Utils delegation** - Mission reads utils, utils read architecture docs
- **One mission at a time** - Complete entirely before moving on
- **No vague missions** - Reject generic descriptions, demand specifics

## Important Notes
- Mission workflow is independent - doesn't read architecture docs directly
- Utils files (backend/frontend/planning) handle architecture doc reading
- Always check `.ab-method/structure/index.yaml` for paths
- User validation is mandatory before moving from brainstormed to validated

## Example Flow
1. User: "Create next mission"
2. System: "Which task are we creating a mission for?"
3. User: "todo-table"
4. System: 
   - Reads progress-tracker.md to identify next mission (e.g., "Backend API")
   - Reads `.ab-method/utils/backend-mission.md` to understand what context is needed
   - Checks `.ab-method/structure/index.yaml` for architecture doc paths
   - Reads relevant architecture docs as specified by utils file
   - Gathers patterns, tech stack, existing code structure
5. System: Creates mission doc with all gathered context and brainstormed status
6. System: "Please validate to proceed"
7. User: "Validated"
8. System: Deploys agents with the pre-gathered context

## Remember
- Always ask for task name if not provided
- Check `.ab-method/structure/index.yaml` for paths
- Delegate architecture reading to utils files
- Require validation before implementation
- Update status at each phase
