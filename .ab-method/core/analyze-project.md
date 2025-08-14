# Analyze Project Workflow

## Purpose
Entry point orchestrator that deploys specialized subagents to analyze project architecture in parallel.

## Process

### 1. User Confirmation
Prompt the user with:
```
Project Architecture Analysis
=============================
I will deploy 7 specialized subagents to analyze your project in parallel:

1. Frontend Expert Agent - Will analyze client-side architecture, components, and patterns
2. Backend Architect Agent - Will analyze server-side architecture, APIs, and services
3. Tech Stack Analyzer - Will document all technologies, frameworks, and tools
4. Entry Points Mapper - Will map application entry points and startup flow
5. External Services Analyzer - Will identify third-party integrations and APIs
6. Constraints Documenter - Will capture technical limitations and architectural decisions
7. Testing Strategy Analyzer - Will document testing frameworks, patterns, and coverage

These agents will work simultaneously to create comprehensive architecture documentation.

Would you like to proceed with the full analysis, or prefer to analyze only specific parts?
- [1] Full Analysis (all 7 agents in parallel)
- [2] Frontend Only
- [3] Backend Only
```

### 2. Deploy Agents Based on Choice

#### Option 1: Full Analysis (Parallel Execution)
Deploy all agents simultaneously using Task tool:

```
Agents to deploy in parallel:
1. Task: "Analyze Frontend Architecture"
   - subagent_type: "frontend-developer"
   - prompt: "Analyze the frontend architecture following the workflow in .ab-method/core/analyze-frontend.md. Check .ab-method/structure/index.yaml for output paths and create comprehensive frontend-patterns.md documentation."

2. Task: "Analyze Backend Architecture"  
   - subagent_type: "backend-architect"
   - prompt: "Analyze the backend architecture following the workflow in .ab-method/core/analyze-backend.md. Check .ab-method/structure/index.yaml for output paths and create comprehensive backend-patterns.md documentation."

3. Task: "Analyze Tech Stack"
   - subagent_type: "backend-architect"
   - prompt: "Analyze the project's technology stack and create docs/architecture/tech-stack.md. Document all languages, frameworks, databases, and tools used. Check package.json, requirements.txt, go.mod, etc."

4. Task: "Analyze Entry Points"
   - subagent_type: "backend-architect"  
   - prompt: "Map all application entry points and create docs/architecture/entry-points.md. Document main files, routes, CLI commands, and how the application starts."

5. Task: "Analyze External Services"
   - subagent_type: "backend-architect"
   - prompt: "Identify all external services/APIs and create docs/architecture/external-services.md. Document third-party integrations, APIs consumed, cloud services, and dependencies."

6. Task: "Analyze Project Constraints"
   - subagent_type: "backend-architect"
   - prompt: "Document project constraints and create docs/architecture/project-constraints.md. Include technical limitations, business rules, compliance requirements, and architectural decisions."

7. Task: "Analyze Testing Strategy"
   - subagent_type: "general-purpose"
   - prompt: "Analyze the project's testing strategy and create docs/architecture/testing-strategy.md. Document test frameworks (Jest, Vitest, Pytest, etc.), test file patterns, test commands, coverage requirements, E2E testing setup, and any testing conventions. Check package.json scripts, test config files, and example test files."
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