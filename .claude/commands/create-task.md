# Create Task

## Description
Create a new task from a problem definition using the AB Method's incremental tasking workflow system.

## Usage
```
/create-task
```

## Behavior
Loads and executes the create-task workflow from `.ab-method/core/create-task.md`

This workflow will:
1. Gather detailed problem requirements through interactive questioning
2. Analyze project context and extract technical constraints
3. Create a comprehensive task document with technical details
4. Define all missions upfront based on project analysis
5. Set up progress tracking for incremental development

## Workflow Details
The create-task workflow follows AB Method principles:
- **Problem Definition** - Interactive gathering of requirements and technical constraints
- **Context Analysis** - Understanding existing codebase architecture and patterns
- **Task Documentation** - Creating comprehensive task documents with code constraints and hints
- **Mission Planning** - Defining all missions upfront for complete roadmap
- **Technical Guidance** - Including coding standards, testing requirements, and performance considerations

## Examples
```
/create-task
# Starts interactive task creation workflow
# Will ask questions about the problem, technical requirements, and constraints
# Creates task document with technical context and mission roadmap
```

## Alternative Usage
You can also use the traditional AB Method master controller:
```
/ab-master create-task
```