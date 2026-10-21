# Test Mission

## Description
Backfill the few tests worth having for code that wasn't written test-first, or a regression test for a bug that escaped.

## Usage
```
/test-mission
```

## Behavior
Loads and executes the test-mission workflow from `.ab-method/core/test-mission.md`:
1. Read the task's tracker (or the target code) and the Testing section of `tech-stack.md`
2. Propose the fewest use cases that protect the most — and what was skipped as low value — for your approval
3. Write each test under `tdd`, proving it can fail before trusting it
4. Record the use cases in the tracker's `## Test Plan` and a checked mission with its summary

No coverage targets; every test is justified by what breaks for the user.

## Alternative Usage
```
/ab-master test-mission
```
