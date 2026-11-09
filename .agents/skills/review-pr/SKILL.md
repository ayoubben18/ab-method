---
name: review-pr
description: Final review on an open PR. Spins up two read-only reviewers in parallel, each with a fresh context — seams (does the diff go through every documented seam, do the seam docs still match the code) and rules (rules/code.md, the book's red flags, repo standards, a Fowler smell baseline). Reports the two axes side by side. Autonomous runs apply safe fixes, push them to the PR, and record the rest in review.md and one PR comment; interactive runs present findings to pick. Use at the end of start-task / start-roadmap once the draft PR is open, or standalone on any PR.
---

# Review PR (final review)

The last gate before a PR is marked ready. Two reviewers read the PR's diff on two separate axes:

- **Seams** — [SEAMS.md](SEAMS.md): does the change respect the app's documented seams, and do the seam docs still tell the truth?
- **Rules** — [RULES.md](RULES.md): does the code follow `.ab-method/rules/code.md`, the book's red flags, and the repo's own standards?

Each runs in its own subagent with a **fresh context**, so neither inherits the context that wrote the code and neither can mask the other. Their reports are shown side by side, never merged or reranked. See [CREDITS.md](CREDITS.md).

> **Silence is the default output.** A PR that follows its seams and rules produces no findings. A finding survives only if it names a concrete cost. Never invent churn to look thorough.

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** for paths (task location, `docs/seams/`, `review.md`). Look for it under the project root first; only if the project has none (plugin install), read the bundled default at `../../../.ab-method/structure/index.yaml` relative to this `SKILL.md`. Every path it names is relative to the project root. Talk to the user per `.ab-method/rules/communication.md`.

`start-task`'s `inline` mode does not change this skill: the reviewers are always subagents.

## Process

### 1. Pin the PR and the diff

- The PR: the number passed in, or the current branch's PR (`gh pr view --json number,baseRefName,url`).
- **No PR** (no remote, no `gh`, or a review before opening one): review the branch instead. The base is the one passed in, else the repo's default branch. Everything below runs the same; what would have been the PR comment goes only into `review.md`.
- The diff against the merge-base: `git diff <base>...HEAD`, and `git log <base>..HEAD --oneline`. Confirm both resolve and the diff is non-empty before spawning anything.

### 2. Gather context (read only what exists)

- The task's `progress-tracker.md` (Placement, missions and summaries, `## Protected`) and `unresolved-questions.md`.
- `docs/seams/index.md`, then only the seam docs the diff touches.
- `.ab-method/rules/code.md` and the `codebase-design` skill's `RED-FLAGS.md` and `SEAM-FORMAT.md`.
- Repo standards: `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `CODING_STANDARDS.md`.
- `docs/adr/` — nothing an ADR settled is a finding.

### 3. Spawn both reviewers in parallel

Issue both subagent calls in one message, each read-only, each with a fresh context. On **Codex** spawn them at the orchestrator's level; on **Claude** they may nest.

Each prompt carries: the diff command and commit list, its brief (`SEAMS.md` or `RULES.md`, pasted in full, or its path with the instruction to read it in full first), the context files from Step 2 that axis needs, and the output rule below. Each returns under 400 words.

Every finding has:
- **Where** — file and hunk.
- **What** — the violation, citing its source (seam doc line, rule, red flag, standard).
- **Cost** — the symptom it causes: change amplification, cognitive load, or unknown unknowns.
- **Fix** — plain English.
- **Class** — `safe-fix` (mechanical, tests stay green, no design decision) or `needs-judgment`.

Each reviewer also ends with its `Checked:` evidence line; a clean axis without one didn't run, so re-run it. Near-misses already listed under `## Checked, dropped` in `review.md` are not re-raised.

A recorded black box (a `TODO(UQ-n)` seam with an entry in `unresolved-questions.md`) is not a finding.

### 4. Report side by side

Present the two reports under `## Seams` and `## Rules`, lightly cleaned. End with one line: findings per axis and the worst issue within each axis. Don't pick a winner across axes.

### 5. Act — by mode

**Autonomous** (`start-task` / `start-roadmap`):
1. Apply each `safe-fix` one at a time, re-running the focused tests after each; a fix that goes red is reverted and becomes `needs-judgment`. Seam-doc edits must pass `node .ab-method/scripts/check-docs.js` (plugin installs: `npx ab-method check-docs`).
2. Commit what was kept as `refactor(<task>): PR review fixes` and push to the PR branch. Nothing kept → no commit.
3. Record every `needs-judgment` finding in the task's `review.md` under `## PR review` (create the file if absent), and post them as **one** PR comment (`gh pr comment <n> --body-file ...`). Clean on both axes → record `PR review: clean` in `review.md`, post nothing.
4. Never prompt.

**Interactive** (`create-task` / `resume-task`, or standalone): present the findings, apply what the user approves the same way (tests green, docs gated), commit, push, and record the rest in `review.md` under `## PR review`.

## Remember

- Index first; review only this PR's diff, never the whole repo.
- Two fresh-context reviewers, in parallel, reported separately.
- Safe fixes are pushed; judgment calls go to `review.md` and one PR comment.
- Silent by default.
