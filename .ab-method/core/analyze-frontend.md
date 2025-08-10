# Analyze Frontend Workflow

## Purpose
Deep analysis of frontend architecture, components, and patterns to document the client-side structure.

## Important Configuration
**ALWAYS check `.ab-method/structure/index.yaml` first** to determine where to save the output documentation. Do not assume paths - they are configurable by the user.

## Process

### 1. Initial Discovery
- Detect frontend framework (React, Vue, Angular, Svelte, etc.)
- Identify package.json/package-lock.json location
- Find main entry point (index.js, main.ts, app.tsx, etc.)
- Locate build configuration files

### 2. Component Analysis
- Map component hierarchy
- Identify reusable components vs page components
- Document component patterns (functional, class-based, etc.)
- Analyze prop drilling vs context/store usage

### 3. State Management
- Identify state management solution (Redux, MobX, Zustand, Context API, etc.)
- Document store structure
- Map data flow patterns
- Identify local vs global state usage

### 4. Routing Analysis
- Document routing library and configuration
- Map all routes and their components
- Identify protected routes
- Document navigation patterns

### 5. Styling Architecture
- CSS methodology (CSS Modules, Styled Components, Tailwind, etc.)
- Theme configuration
- Responsive design approach
- Component styling patterns

### 6. API Integration
- API client configuration
- Request/response handling
- Error handling patterns
- Data fetching strategies (REST, GraphQL, etc.)

### 7. Build & Bundle
- Build tool configuration (Webpack, Vite, Parcel, etc.)
- Code splitting strategy
- Asset optimization
- Environment configuration

### 8. Testing Setup
- Testing frameworks used
- Test file patterns
- Coverage configuration
- E2E testing setup

## Output

### Location
Check `.ab-method/structure/index.yaml` for the output path. The workflow_outputs section will specify where to save the frontend analysis results.

### frontend-patterns.md Structure:
```markdown
# Frontend Architecture

## Framework & Setup
- Main framework and version
- Key dependencies
- Development environment

## Component Architecture
- Component organization
- Naming conventions
- Composition patterns

## State Management
- Solution used
- Store structure
- Data flow diagram

## Routing
- Route definitions
- Navigation patterns
- Auth flow

## Styling System
- Methodology
- Theme structure
- Responsive approach

## API Layer
- Client setup
- Request patterns
- Error handling

## Build Configuration
- Tools used
- Optimization strategies
- Deployment setup

## Testing Strategy
- Unit testing approach
- Integration tests
- E2E coverage
```

## Key Files to Analyze
- package.json
- src/index.* or main entry
- src/App.* or root component
- Router configuration files
- Store/state configuration
- API client setup
- Build configuration files
