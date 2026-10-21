---
name: prototype-ui
description: Build several genuinely different versions of one piece of UI as a single disposable, self-contained HTML file with a live picker, so the user chooses a direction before any code is written. Never touches the codebase. Use from create-task / extend-task when a task adds new UI, or standalone when the user wants to explore UI options, prototype, or compare variants.
---

# Prototype UI

A divergence skill. It takes one described piece of UI ("the refund row action", "a hold-to-delete button"), builds several genuinely different versions of it in **one disposable HTML file**, and puts them behind a picker so the user can flip through them and choose. The picked variant becomes the spec the task's missions implement. This skill never writes production code.

**ALWAYS check `.ab-method/structure/index.yaml` FIRST** for where task folders and domain docs live — paths are user-configurable. Look for it under the project root first; only if the project has none (AB Method installed as a plugin), read the bundled default at `../../../.ab-method/structure/index.yaml` relative to this `SKILL.md`. Every path the index names is relative to the project root. Read `UBIQUITOUS_LANGUAGE.md` (if it exists) so variant copy uses the product's real terms.

Talk to the user per `.ab-method/rules/communication.md`.

## Operating posture

You are a senior design engineer running a design exploration. The value is **divergence**: three tints of one idea teach the user nothing. Each variant is a direction you could defend shipping on its own.

Divergence never lowers the craft bar. Every variant meets it: `ease-out` on entrances (never `ease-in`), UI motion under 300ms, correct `transform-origin`, animate `transform`/`opacity` only, `prefers-reduced-motion` handled.

## Hard rules

1. **HTML only, never the codebase.** Output is one self-contained HTML file: inline CSS and JS, no imports from the project, no dev-server routes, no edits to production files. The only repo write besides the HTML is the `.gitignore` line and the tracker's `## UI Spec`.
2. **Native look by copying, not importing.** Read the project's tokens and copy their *values* into the file's inline CSS.
3. **Variants diverge on a named axis**: layout, density, personality, motion or interaction model. You can state each variant's axis in a phrase before building.
4. **Every variant fully works.** Real interactions, real motion, realistic product copy, plausible names and numbers. No lorem ipsum, no dead buttons.
5. **The picker is chrome.** Its markup, styles and wiring come from [PICKER.md](PICKER.md), verbatim. It never adapts to the project.
6. **Integration is the missions' job.** When the user picks, this skill records the spec and stops.

## Where the file goes

| Context | Path |
| --- | --- |
| Run for a task (from `create-task` / `extend-task`) | `docs/tasks/<task>/prototype/index.html` (task folder per the index) |
| Standalone | `$TMPDIR/prototype-<slug>-<timestamp>.html` |

For a task run: if the project `.gitignore` lacks `docs/tasks/*/prototype/`, append it and tell the user in one line. The folder is disposable; the task workflows delete it when the task completes.

## Workflow

### 1. Scope

One piece of UI per run. If the brief spans several ("the dashboard"), pick the highest-leverage piece, say which and why, and offer the rest as follow-up runs. Restate the brief in one sentence: what it is, where it lives, what it must do.

### 2. Recon

Read, don't import:

- **Tokens**: colors, radii, spacing, fonts, shadows, easing and duration values, from the Tailwind config, CSS variables or theme files. Copy the values.
- **Personality**: playful consumer app or crisp dashboard. This bounds how far the boldest variant goes.
- **Context**: where the piece renders, against what background, beside what neighbours, at what sizes. Rebuild a plausible slice of that surrounding page in the HTML.
- **Existing components** the piece should feel consistent with (buttons, inputs, cards). Mimic their look in CSS.

No project (or no tokens): neutral grays, one accent, system font stack.

### 3. Choose directions

Default **3 variants**, up to 5 when asked or the space is genuinely wide. Before writing code, list each variant's name and axis. Names describe the direction ("Quiet", "Dense", "Editorial"), never "Option A". If two directions differ only in color or copy, they are one; replace one with a real alternative.

**Done when** every variant has a name and an axis, and no two share an axis position.

### 4. Build the file

One HTML file containing: the copied tokens as CSS variables, the surrounding page context, one render function per variant, and the picker from [PICKER.md](PICKER.md). Render **one variant at a time, full size, in context**; never side-by-side thumbnails. Switching is instant.

### 5. Verify and hand off

Open the file. With a browser tool available, flip through every variant, check interactions respond and the console is clean, and screenshot each. Without one, at least confirm the file parses and every variant's render function returns markup.

Present the set and **stop; the choice belongs to the user**:

| # | Variant | Axis | When it's the right choice | Its cost |
| --- | --- | --- | --- | --- |
| 1 | Quiet | Minimal motion, borders over shadows | Daily-use tool | Least memorable |

Close with the file path and the keys to flip (`1–N`, `←`/`→`, `R`).

### 6. Record the pick

When the user picks:

1. Write `## UI Spec` into the task's `progress-tracker.md` (create the section if missing, replace it if present): winner name and axis, then the concrete decisions the missions must implement: layout, states (empty / loading / error / success), interactions, motion (property, duration, easing), and key copy. Close with `Reference: docs/tasks/<task>/prototype/index.html`. Keep it under ~15 lines.
2. Strip the losing variants and their picker items from the HTML, so the file keeps only the winner as the visual reference.
3. Stop. The missions build it in the codebase, following the project's conventions.

Standalone runs skip step 1 and report the spec in chat instead.

## Invocations

| Invocation | Behavior |
| --- | --- |
| `<description>` | Scope → recon → 3 variants → picker → wait for the pick |
| `<description> xN` | Same with N variants (max 5) |
| `riff <variant>` | New round in the same file, diverging around that variant's direction |
| `keep <variant>` | Record the pick: write `## UI Spec`, strip the losers |

## Tone

One line on when each variant wins, one on what it costs. Never pre-pick in the table. If asked for your choice, answer from the product's personality and frequency of use, not aesthetics alone. If two variants converged while building, cut one and say so.
