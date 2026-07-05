# Mastermind

## Description
The intelligent entry point to the AB Method. Figures out what you want to
do and routes you to the right workflow — or explains how the method fits
together end to end. Where `/ab-master` is a static menu, `/mastermind`
reasons about your intent and hands off.

## Usage
```
/mastermind [what you want to do]
```

## Behavior
Loads and executes the mastermind workflow from `.ab-method/core/mastermind.md`.

It will:
1. **Always check `.ab-method/structure/index.yaml` first** for the file layout.
2. Discover available workflows at runtime from `.ab-method/core/` — it does not carry a hardcoded catalogue.
3. Match your intent and **delegate to the matching workflow** (e.g. `/create-task`, `/create-goal`, `/resume-task`) without reimplementing it.
4. Help you decide **goal vs task** when that's the fork.
5. Explain the AB Method end to end, grounded in the actual files, when asked.

## Examples
```
/mastermind
# Asks what you're trying to accomplish, then routes you

/mastermind I want to add rate limiting to the API
# Recommends create-task (stay in the loop) and hands off

/mastermind explain how the ab method works
# Concise end-to-end tour: baseline → sharpen → build → maintain
```

## Notes
- Multi-task orchestration (idea → dependency-ordered roadmap → subagent
  execution with `[pp-x]` parallel groups) is **not** part of mastermind
  yet — it's being designed separately. Mastermind currently routes and
  advises.
- For the plain workflow menu, use `/ab-master`.
