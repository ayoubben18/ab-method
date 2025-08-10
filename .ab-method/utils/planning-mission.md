# Planning Mission Utils

## Purpose
Guide planning missions that involve research, architecture decisions, or system design before implementation.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find architecture documentation paths.

## Architecture Loading

### 1. Read Structure Index
```yaml
Check .ab-method/structure/index.yaml for:
- docs.architecture location
- All architecture files for comprehensive view
- project-constraints.md path
- external-services.md path
```

### 2. Load Comprehensive Architecture
Based on index.yaml paths, read ALL:
- **tech-stack.md** - Current technology choices
- **frontend-patterns.md** - Frontend architecture
- **backend-patterns.md** - Backend architecture
- **project-constraints.md** - Limitations and requirements
- **external-services.md** - Third-party integrations
- **entry-points.md** - System boundaries

### 3. Identify Planning Needs
Determine planning type:
- **Technical Research** - New technology evaluation
- **Architecture Design** - System structure planning
- **Integration Planning** - Third-party service integration
- **Migration Planning** - Refactoring or upgrades
- **Performance Planning** - Optimization strategies

## Agent Coordination

### For Technical Research:
Deploy research-focused agent:
```
Task: "Research [technology/approach] for [mission]"
Context provided:
- Current tech stack
- Project constraints
- Existing patterns

Agent should:
1. Evaluate options
2. Compare with existing stack
3. Check compatibility
4. Document findings
5. Recommend approach
```

### For Architecture Design:
Deploy architecture-focused agent:
```
Task: "Design architecture for [feature/system]"
Context provided:
- All architecture docs
- System constraints
- Existing patterns

Agent should:
1. Analyze requirements
2. Design system structure
3. Define component boundaries
4. Plan data flow
5. Document decisions
```

### For Integration Planning:
Deploy integration specialist:
```
Task: "Plan integration with [service]"
Context provided:
- External services doc
- Current integrations
- API patterns

Agent should:
1. Research service capabilities
2. Plan integration points
3. Define data mapping
4. Security considerations
5. Document approach
```

## Mission Document Structure
For planning missions:
```markdown
# Mission N: Planning - [Description]

## Status
Current: Planning

## Research/Analysis
- Key findings
- Options evaluated
- Pros and cons

## Recommendations
- Proposed approach
- Architecture decisions
- Technology choices

## Implementation Plan
- High-level steps
- Estimated complexity
- Dependencies

## Risks & Mitigations
- Identified risks
- Mitigation strategies

## Next Steps
- Follow-up missions needed
- Implementation approach
```

## Key Guidelines

### For All Planning Missions:
- Consider existing architecture
- Respect project constraints
- Evaluate impact on current system
- Plan for maintainability
- Document decision rationale

### Documentation Focus:
- WHY decisions were made
- Trade-offs considered
- Alternative approaches
- Future implications

## Output Examples

### Technical Research Output:
```markdown
## Research: State Management Solutions

### Options Evaluated:
1. Redux - Heavy but battle-tested
2. Zustand - Lightweight, good DX
3. Context API - Built-in, simple

### Recommendation: Zustand
- Fits current lightweight approach
- Easy integration with existing code
- Minimal boilerplate
```

### Architecture Design Output:
```markdown
## Architecture: Real-time Chat Feature

### Components:
- WebSocket service layer
- Message queue (Redis)
- Chat UI components
- Database schema changes

### Data Flow:
Client → WebSocket → Queue → Database
```

## Remember
- Planning missions inform future implementation
- Load ALL architecture docs for context
- Document decisions thoroughly
- Consider long-term implications
- Check `.ab-method/structure/index.yaml` for paths
