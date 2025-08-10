# Update Architecture Workflow

## Purpose
Update architecture documentation after implementing features that impact system architecture.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find where architecture files are located.

## Process

### 1. Assess Impact
Ask user: "What feature/change did you implement and which parts of the system were affected?"

### 2. Identify Files to Update
Based on `.ab-method/structure/index.yaml` paths, check which files need updates:
- **Frontend changes** → frontend-patterns.md, tech-stack.md, entry-points.md
- **Backend changes** → backend-patterns.md, tech-stack.md, entry-points.md  
- **Dependencies** → tech-stack.md, external-services.md
- **Constraints** → project-constraints.md

### 3. Update Strategy
- Add new content, don't delete existing
- Mark deprecated items with [DEPRECATED]
- Add timestamp comments: `<!-- Updated: YYYY-MM-DD - Feature name -->`
- Maintain existing format and style

### 4. Apply Updates
For each file, add a "Recent Updates" section:
```markdown
### Recent Updates (YYYY-MM-DD)
- Added: [what was added]
- Modified: [what changed]
- Impact: [architectural impact]
```

### 5. Report Results
Provide summary:
- Files modified and what was added
- Key architectural changes
- Any concerns or technical debt introduced

## Remember
- Never assume paths - check `.ab-method/structure/index.yaml`
- Be incremental - add don't rewrite
- Document the why, not just what
