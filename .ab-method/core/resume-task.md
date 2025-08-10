# Resume Task Workflow

## Purpose
Resume an existing task from the exact breakpoint where we left off, maintaining context and progress.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where task documents are stored.

## Process

### 1. Identify Task to Resume
Ask user: "Which task would you like to resume? Please provide the task name or let me list available tasks."

### 2. Locate Task Progress
Based on `.ab-method/structure/index.yaml`, find and read:
```
tasks/[task-name]/
  progress-tracker.md
  mission-*.md (if any exist)
```

### 3. Analyze Current State
From `progress-tracker.md`, identify:
- Task status (Brainstormed/Validated/In dev/Testing/Completed)
- Which missions are completed ✓
- Which mission is currently in progress
- What was the last action taken
- Any notes or blockers from last session

### 4. Display Resume Context
Show user:
```
Resuming Task: [Task Name]
========================
Task Status: [In dev]

Mission Progress:
✓ Mission 1: [Name] - COMPLETED
✓ Mission 2: [Name] - COMPLETED
⏳ Mission 3: [Name] - IN PROGRESS
  Last action: [What was done]
  Next step: [What needs to be done]
○ Mission 4: [Name] - PENDING

Ready to continue from Mission 3?
```

### 5. Check for Dependencies
Before resuming:
- Review completed missions for outputs/artifacts
- Check if any files were modified since last session
- Verify external dependencies are still available
- Look for any mission-specific documentation

### 6. Resume Strategy

#### If Mission is Partially Complete:
1. Read the mission file (if exists)
2. Review any code/files created in that mission
3. Continue from the exact breakpoint
4. Update progress tracker as you go

#### If Starting a New Mission:
1. Review outputs from previous mission
2. Use knowledge gained from completed missions
3. Create mission file: `mission-N-[description].md`
4. Begin implementation

### 7. Update Progress Tracker
As you work, update `progress-tracker.md`:
```markdown
## Task Status
Current: In dev

## Missions
- [x] Mission 1: Backend - Models created
- [x] Mission 2: Backend - API endpoints done
- [ ] Mission 3: Frontend - Components (IN PROGRESS)
  - Last: Created base component structure
  - Next: Add state management
- [ ] Mission 4: Frontend - API integration
```

Update task status as appropriate:
- **Brainstormed** → When task is defined but not started
- **Validated** → When approach is confirmed and ready to start
- **In dev** → Active development in progress
- **Testing** → Implementation complete, testing phase
- **Completed** → All missions done and tested

## Breakpoint Recovery

### What to Save at Each Breakpoint:
- Current mission status
- Files created/modified
- Decisions made
- Blockers encountered
- Next immediate step

### Example Breakpoint Note:
```markdown
## Session Notes (YYYY-MM-DD HH:MM)
- Stopped at: Mission 3, step 2
- Created: TodoList.tsx, TodoItem.tsx
- Issue: Need to clarify sorting requirements
- Resume: Implement state management in TodoList
```

## Remember
- Check `.ab-method/structure/index.yaml` for task location
- Read all existing progress before resuming
- Maintain continuity from previous sessions
- Update progress tracker frequently
- Each mission builds on previous knowledge
