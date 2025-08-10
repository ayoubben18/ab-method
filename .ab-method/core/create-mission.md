# Create Mission Workflow

## Purpose
Execute one mission at a time, completing it entirely before moving to the next. Each mission uses specialized subagents for architecture and implementation.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find task and mission document locations.

## Process

### 1. Identify Task
Ask user: "Which task are we creating a mission for? Please provide the task name."

### 2. Load Context
Based on `.ab-method/structure/index.yaml`, read from task folder:
- `progress-tracker.md` - Current task status and mission progress
- Previous mission files (if any) - Knowledge from completed missions

### 3. Identify Current Mission
From progress tracker, find the next uncompleted mission and determine its type:
- **Backend Mission** → Will use `.ab-method/utils/backend-mission.md`
- **Frontend Mission** → Will use `.ab-method/utils/frontend-mission.md`
- **Planning Mission** → Will use `.ab-method/utils/planning-mission.md`

### 4. Create Mission Document
Create `mission-N-[description].md` in task folder with initial structure:
```markdown
# Mission N: [Description]

## Status
Current: Brainstormed

## Objective
[What this mission needs to achieve]

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

### 5. Validate Before Proceeding
**CRITICAL: Always prompt user before implementation:**
```
Mission N document created and status is 'Brainstormed'.
Please review the mission plan and confirm to move to 'Validated' status.
Ready to proceed with implementation?
```

Wait for user confirmation before continuing.

### 6. Execute Mission Based on Type

#### For Backend Mission:
Load `.ab-method/utils/backend-mission.md` which will:
- Guide architecture analysis
- Read from architecture docs (delegated to utils)
- Coordinate backend-architect and backend-developer agents

**Phase 1: Architecture (backend-architect agent)**
- Utils file handles reading architecture docs
- Agent creates architecture plan
- Updates mission document

**Phase 2: Implementation (backend-developer agent)**
- Reads architecture plan from mission doc
- Implements changes
- Updates progress continuously

#### For Frontend Mission:
Load `.ab-method/utils/frontend-mission.md` which will:
- Guide UX/component analysis
- Read from architecture docs (delegated to utils)
- Coordinate UX expert and frontend-developer agents

**Phase 1: Architecture (UX expert agent)**
- Utils file handles reading architecture docs
- Agent creates frontend plan
- Updates mission document

**Phase 2: Implementation (frontend-developer agent)**
- Reads architecture plan from mission doc
- Implements components
- Updates progress continuously

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
- **Ask for task name** - Must know which task we're working on
- **Validation checkpoint** - User must validate before implementation
- **Utils delegation** - Mission reads utils, utils read architecture docs
- **One mission at a time** - Complete entirely before moving on
- **Status tracking** - Clear status flow from brainstormed to completed

## Important Notes
- Mission workflow is independent - doesn't read architecture docs directly
- Utils files (backend/frontend/planning) handle architecture doc reading
- Always check `.ab-method/structure/index.yaml` for paths
- User validation is mandatory before moving from brainstormed to validated

## Example Flow
1. User: "Create next mission"
2. System: "Which task are we creating a mission for?"
3. User: "todo-table"
4. System: Creates mission doc with brainstormed status
5. System: "Please validate to proceed"
6. User: "Validated"
7. System: Executes mission using appropriate utils file

## Remember
- Always ask for task name if not provided
- Check `.ab-method/structure/index.yaml` for paths
- Delegate architecture reading to utils files
- Require validation before implementation
- Update status at each phase
