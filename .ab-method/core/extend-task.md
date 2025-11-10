# Extend Task Workflow

## Purpose
Add new missions to an existing task after initial missions have been completed. This is useful when:
- Requirements change during development
- New features need to be added to an ongoing task
- Additional functionality is discovered after initial planning
- User wants to expand the scope of a task

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where task documents are stored.

## Process

### 1. Identify Task to Extend
Ask user: "Which task would you like to extend? Please provide the task name."

### 2. Locate and Review Task Progress
Based on `.ab-method/structure/index.yaml`, find and read:
```
tasks/[task-name]/
  progress-tracker.md
  mission-*.md (all existing missions)
```

### 3. Display Current Task State
Show user the current task status:
```
Extending Task: [Task Name]
========================
Task Status: [Current Status]

Current Missions:
✓ Mission 1: [Name] - COMPLETED
✓ Mission 2: [Name] - COMPLETED
⏳ Mission 3: [Name] - [Status]
○ Mission 4: [Name] - [Status]

[Show mission summaries from progress tracker if available]
```

### 4. Gather New Mission Requirements
Ask user: "What new missions would you like to add to this task? Please describe what needs to be accomplished."

**If user provides clear instructions:**
- ✅ Follow them exactly
- ✅ Create missions based on their description
- ✅ Don't ask unnecessary clarifying questions

**If user's description is vague:**
- Ask clarifying questions similar to create-mission workflow:
  - "What specific functionality should be working when this mission is complete?"
  - "What should I be able to test or demo after this mission?"
  - For backend: "Which specific API endpoints need to be created/modified?"
  - For frontend: "Which specific components need to be created/modified?"

### 5. Determine Mission Numbers
Check existing missions in progress tracker to determine the next mission number:
- If Mission 5 is the last → New missions start at Mission 6
- Ensure sequential numbering

### 6. Create New Mission Documents
For each new mission, create `mission-N-[description].md` in the task folder following the same format as create-mission workflow:

```markdown
# Mission N: [Description]

## Status
Current: Brainstormed

## Objective
[SPECIFIC objective from user requirements]

## Detailed Requirements
[ALL requirements from user]

### Acceptance Criteria
- [ ] [Specific testable outcome 1]
- [ ] [Specific testable outcome 2]
- [ ] [Specific testable outcome 3]

### Technical Specifications
- **Files to Create/Modify**: [Specific file paths]
- **Patterns to Follow**: [Existing patterns]
- **Integration Points**: [How this connects to other parts]
- **Constraints**: [Any limitations or requirements]

## Dependencies
- Previous missions: [What we're building on]
- External: [APIs, packages, etc.]

## Architecture Plan
(To be filled by architect agent if needed)

## Implementation
(To be filled by developer agent)

## Files Modified
(Updated during development)

## Testing
(Test results and validation)
```

### 7. Update Progress Tracker
Add new missions to the progress tracker:

```markdown
## Missions
- [x] Mission 1: [Name] - COMPLETED
- [x] Mission 2: [Name] - COMPLETED
- [ ] Mission 3: [Name] - [Status]
- [ ] Mission 4: [Name] - [Status]
- [ ] Mission 5: [New Mission Name] - Brainstormed  ← NEW
- [ ] Mission 6: [New Mission Name] - Brainstormed  ← NEW
```

### 8. Update Task Status
If task was marked as "Completed", change status to "In dev" or "Validated" (depending on whether missions are validated).

### 9. Validate Before Proceeding
Show user summary of new missions:
```
Task extended with the following new missions:

## New Missions Added:
- **Mission N**: [Description]
  - Objective: [Objective]
  - Key Files: [Files that will be created/modified]
  - Acceptance Criteria: [List outcomes]

- **Mission N+1**: [Description]
  - [Same details]

## Updated Task Status:
- Previous status: [Old Status]
- New status: [New Status]
- Total missions: [Count]

Ready to proceed with Mission N?
```

### 10. Load Context for New Missions
**CRITICAL: Read mission summaries from progress tracker** to understand what was built in previous missions:
- Use completed mission summaries for context
- Only read full mission docs if summaries insufficient
- Gather architecture context similar to create-mission workflow

### 11. Determine Mission Types
Based on requirements, determine mission types:
- **Backend Mission** → Will use `.ab-method/utils/backend-mission.md`
- **Frontend Mission** → Will use `.ab-method/utils/frontend-mission.md`
- **Planning Mission** → Will use `.ab-method/utils/planning-mission.md`

### 12. Load Utils Files and Architecture Context
For each new mission:
1. Read the relevant utils file (backend-mission.md, frontend-mission.md, or planning-mission.md)
2. Check `.ab-method/structure/index.yaml` for architecture doc paths
3. Load relevant architecture documentation as specified by utils file
4. Use context from previous missions (from summaries)

### 13. Enhance Mission Documents with Context
Update mission documents with:
- Dependencies from previous missions
- Integration points with existing code
- Patterns to follow from architecture docs
- Technical constraints from previous work

## Key Principles
- **Respect user instructions** - If user is clear, follow exactly what they said
- **Maintain context** - Use previous mission summaries to understand what exists
- **Sequential numbering** - Ensure missions are numbered correctly
- **Update status** - Change task status appropriately when extending
- **Validation checkpoint** - User should validate new missions before implementation
- **Read summaries first** - Check progress tracker mission summaries before reading full docs
- **One mission at a time** - Complete missions sequentially, even when extending

## Important Notes
- Always check `.ab-method/structure/index.yaml` for paths
- Use mission summaries from progress tracker for context
- Only read full mission docs if summaries insufficient
- Maintain sequential mission numbering
- Update task status when extending completed tasks
- Follow same mission creation pattern as create-mission workflow

## Example Flow
1. User: "/extend-task"
2. System: "Which task would you like to extend?"
3. User: "todo-management"
4. System:
   - Reads progress-tracker.md
   - Shows current missions (1-4 completed)
   - "What new missions would you like to add?"
5. User: "Add Mission 5: Add filtering and sorting to the todo table, Mission 6: Add bulk actions"
6. System:
   - Creates mission-5-filtering-sorting.md
   - Creates mission-6-bulk-actions.md
   - Updates progress tracker
   - Shows summary: "Added 2 new missions. Ready to start Mission 5?"
7. User: "Yes"
8. System: Proceeds with Mission 5 using create-mission workflow logic

## Remember
- Always ask for task name if not provided
- Show current mission progress before extending
- Use mission summaries for context, not full docs
- Maintain sequential mission numbering
- Update task status appropriately
- Follow create-mission pattern for mission creation
- Validate new missions before implementation

