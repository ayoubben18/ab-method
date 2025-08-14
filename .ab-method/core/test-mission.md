# Test Mission Workflow

## Purpose
Create comprehensive tests for implemented features by analyzing the codebase and following the project's testing strategy. This workflow is typically run when implementation missions reach "Testing" status.

## Critical Step
**ALWAYS check `.ab-method/structure/index.yaml` FIRST** to find task and documentation locations.

## Process

### 1. Identify Task and Implementations
Ask user: "Which task are we creating tests for? Please provide the task name."

### 2. Load Task Context
Based on `.ab-method/structure/index.yaml`, read from task folder:
- `progress-tracker.md` - See what has been implemented
- All completed mission files - Understand what was built
- Identify files that were created/modified

### 3. Load Testing Strategy
**CRITICAL: Read testing-strategy.md to understand project's testing approach:**
1. **Check `.ab-method/structure/index.yaml`** for testing-strategy.md location
2. **Read `testing-strategy.md`** to understand:
   - Test frameworks (Jest, Vitest, Pytest, etc.)
   - Test file patterns (*.test.js, *.spec.ts, test_*.py)
   - Test commands (npm test, pytest, go test)
   - Coverage requirements
   - E2E testing setup
   - Existing test examples

### 4. Analyze Implementation
**Review what needs testing from completed missions:**
1. **Backend implementations**:
   - New API endpoints
   - Service functions
   - Database models
   - Validation logic
   
2. **Frontend implementations**:
   - New components
   - Custom hooks
   - State management
   - User interactions

3. **Integration points**:
   - API calls
   - Database operations
   - External service calls

### 5. Search for Existing Test Patterns
**Find and analyze existing tests in the codebase:**
- Search for test files matching the pattern from testing-strategy.md
- Understand test structure and conventions
- Identify reusable test utilities
- Find mock/stub patterns

### 6. Create Test Mission Document
Create `mission-N-test-[description].md` in task folder:
```markdown
# Mission N: Test - [Description]

## Status
Current: Brainstormed

## Test Scope
[What implementations are being tested]

## Testing Strategy
- Framework: [From testing-strategy.md]
- Test types: [Unit/Integration/E2E]
- Coverage target: [From requirements]

## Test Plan
(To be filled by test architect)

## Implementation
(To be filled during test creation)

## Files Created/Modified
(Updated during development)

## Test Results
(Test execution results)
```

### 7. Validate Before Proceeding
**CRITICAL: Always prompt user before implementation:**
```
Test Mission document created and status is 'Brainstormed'.
Testing scope includes: [list implementations to test]
Using [framework] with [test patterns].
Ready to proceed with test creation?
```

Wait for user confirmation before continuing.

### 8. Execute Test Mission

**Phase 1: Test Architecture (general-purpose agent)**
Deploy with gathered context:
```
Task: "Plan test coverage for [implementations]"
Context provided:
- Testing strategy from testing-strategy.md
- Implemented features from previous missions
- Existing test patterns from codebase
- Files that need testing

Agent should:
1. Identify all testable units
2. Plan test file structure
3. Define test scenarios
4. Determine mock requirements
5. Document test plan in mission file
```

**Phase 2: Test Implementation (general-purpose agent)**
Deploy with test plan:
```
Task: "Implement tests for [implementations]"
Context provided:
- Test plan from mission doc
- Testing framework and patterns
- Implementation details to test
- Existing test utilities

Agent should:
1. Create test files following patterns
2. Write comprehensive test cases
3. Implement mocks/stubs as needed
4. Run tests and ensure passing
5. Update coverage metrics
```

### 9. Update Progress Throughout

**Mission Status Flow:**
- Brainstormed → Created, awaiting validation
- Validated → Ready for test creation
- In dev → Actively writing tests
- Testing → Running test suite
- Completed → All tests passing

**Progress Tracker Updates:**
```markdown
## Task Status
Current: Testing

## Missions
- [x] Mission 1: Backend - API Implementation - COMPLETED
- [x] Mission 2: Frontend - UI Components - COMPLETED
- [ ] Mission 3: Test - Full Coverage - IN DEV
  - Unit tests: 15/20 written
  - Integration tests: 5/5 written
  - Coverage: 85%
```

### 10. Mission Completion
When all tests are complete:
1. Run full test suite
2. Verify coverage meets requirements
3. Update mission status to "Completed"
4. Update progress tracker
5. Document final coverage metrics
6. Update original implementation missions from "Testing" to "Completed"

## Key Principles
- **Always load testing-strategy.md first** - Understand project's approach
- **Test what was actually built** - Focus on new implementations
- **Follow existing patterns** - Match test style and structure
- **Comprehensive coverage** - Unit, integration, and E2E as needed
- **Fast feedback** - Tests should run quickly
- **Clear test names** - Describe what is being tested

## Test Types to Create

### Unit Tests
- Individual functions/methods
- Mock external dependencies
- Edge cases and error conditions
- Pure logic testing

### Integration Tests
- Component interactions
- API endpoint testing
- Database operations
- Service layer testing

### Component Tests (Frontend)
- Rendering and state
- User interactions
- Props and outputs
- Accessibility

### E2E Tests (If configured)
- User workflows
- Critical paths
- Cross-system integration

## Example Flow
1. User: "Create test mission"
2. System: "Which task are we creating tests for?"
3. User: "todo-table"
4. System: 
   - Reads progress-tracker.md to see completed missions
   - Reads testing-strategy.md for test framework and patterns
   - Analyzes implemented files from missions
   - Searches for existing test examples
5. System: Creates test mission doc with plan
6. System: "Ready to create tests for TodoTable component and /api/todos endpoints?"
7. User: "Yes"
8. System: Deploys agents to create comprehensive tests

## Remember
- Check `.ab-method/structure/index.yaml` for paths
- Load testing-strategy.md before creating any tests
- Analyze actual implementations from completed missions
- Follow project's existing test patterns
- Ensure tests actually run and pass
- Update coverage metrics