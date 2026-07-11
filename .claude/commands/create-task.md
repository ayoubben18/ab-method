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
1. **Always invoke `grill-with-docs`** to interview the user (no skip — even when the request looks clear)
2. Read UBIQ + CONTEXT + tech-stack + patterns + ADRs to ground the task in canonical terms
3. Write a slim `progress-tracker.md` with all missions defined as one-line entries
4. **Run `critique-plan`** on the drafted missions — a read-only domain critic that pushes back only on genuine conflicts with the domain model (advisory; silent when the plan is sound)
5. **Run every mission through the `tdd` skill** (red-green-refactor) — no separate mission docs are created
6. **Run `review-implementation`** after the last mission — three critics (cleaner-architecture, slop-defender, reusability-inspector) on the task diff; interactive here, so findings are presented for you to apply

## Workflow Details
- **Always grill** — `grill-with-docs` runs on every invocation
- **Always TDD** — every mission goes through the `tdd` skill; the test is the spec
- **No mission docs** — missions live as one-line entries in `progress-tracker.md`; tight technical summaries are appended on completion
- **Subagents only when warranted** — direct implementation by default; pick agents by need (backend / UI / testing / quality / research), not by mission type
- **Optional parallel groups** — independent missions can be tagged `[pp-1]`, `[pp-2]`, ... and run concurrently in subagents; untagged missions stay sequential and act as barriers. Strictly opt-in: the workflow always asks before tagging anything

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