# Analyze Project Workflow

## Purpose
Entry point orchestrator that deploys specialized subagents to analyze project architecture in parallel.

## Process

### 1. User Confirmation
Prompt the user with:
```
Project Architecture Analysis
=============================
I will deploy 2 specialized subagents to analyze your project in parallel:

1. Frontend Expert Agent - Will analyze client-side architecture, components, and patterns
2. Backend Architect Agent - Will analyze server-side architecture, APIs, and services

These agents will work simultaneously to create comprehensive architecture documentation.

Would you like to proceed with both analyses, or prefer to analyze only one part?
- [1] Full Analysis (both agents in parallel)
- [2] Frontend Only
- [3] Backend Only
```

### 2. Deploy Agents Based on Choice

#### Option 1: Full Analysis (Parallel Execution)
Deploy both agents simultaneously using Task tool:

```
Agents to deploy in parallel:
1. Task: "Analyze Frontend Architecture"
   - subagent_type: "frontend-developer"
   - prompt: "Analyze the frontend architecture following the workflow in .ab-method/core/analyze-frontend.md. Check .ab-method/structure/index.yaml for output paths and create comprehensive frontend-patterns.md documentation."

2. Task: "Analyze Backend Architecture"  
   - subagent_type: "backend-architect"
   - prompt: "Analyze the backend architecture following the workflow in .ab-method/core/analyze-backend.md. Check .ab-method/structure/index.yaml for output paths and create comprehensive backend-patterns.md documentation."
```

#### Option 2: Frontend Only
Deploy single agent:
- Task: "Analyze Frontend Architecture"
- subagent_type: "frontend-developer"
- Same prompt as above

#### Option 3: Backend Only
Deploy single agent:
- Task: "Analyze Backend Architecture"
- subagent_type: "backend-architect"
- Same prompt as above

### 3. Post-Analysis
After agents complete their work:
1. Inform user that analysis is complete
2. List the documentation files created
3. Suggest next steps (e.g., review documentation, create tasks based on findings)

## Important Notes
- This workflow is **only an entry point** - it doesn't perform analysis itself
- All actual analysis work is delegated to specialized agents
- Agents work in parallel for maximum efficiency
- Each agent follows its own workflow (.ab-method/core/analyze-frontend.md or analyze-backend.md)
- Output paths are determined by `.ab-method/structure/index.yaml`