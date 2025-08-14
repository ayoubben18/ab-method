# AB Method Master

## Description
Master controller for the AB Method - an incremental tasking workflow system that transforms problems into tasks, then into focused missions.

## Usage
```
/ab-master [workflow-name]
```

## Behavior

### When called without a workflow name:
Greets the user with:
```
Welcome to the AB Method Master Controller!

The AB Method transforms problems into tasks, then into focused missions for incremental progress.

Choose a workflow to get started:
```
Then lists all available workflows below.

### When called with a workflow name:
Loads and executes the specified workflow from `.ab-method/core/[workflow-name].md`

## Available Workflows

### Task Management
- **resume-task** - Resume an existing task from where it was paused
- **create-task** - Create a new task from a problem definition

### Mission Management  
- **create-mission** - Transform a task into specific, focused missions
- **resume-mission** - Resume an incomplete mission
- **test-mission** - Create comprehensive tests for implemented features

### Analysis Workflows
- **analyze-frontend** - Analyze frontend architecture and components
- **analyze-backend** - Analyze backend services and APIs
- **analyze-project** - Complete project structure analysis

### Architecture
- **update-architecture** - Update and maintain architecture documentation

## Workflow Details

Each workflow follows the AB Method principles:
1. **Problem Definition** - Clear articulation of what needs to be solved
2. **Task Transformation** - Converting the problem into actionable tasks
3. **Mission Creation** - Breaking tasks into specific, focused missions
4. **Incremental Progress** - Each mission builds on previous knowledge

## Examples

```
/ab-master create-task
# Starts a new task creation workflow

/ab-master analyze-project  
# Begins comprehensive project analysis

/ab-master resume-mission
# Continues from the last incomplete mission
```

## Workflow Files Location
All workflow definitions are stored in `.ab-method/core/`