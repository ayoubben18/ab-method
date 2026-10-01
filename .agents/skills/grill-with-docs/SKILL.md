---
name: grill-with-docs
description: Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates documentation (CONTEXT.md, ADRs) inline as decisions crystallise. Parks the rare question you genuinely can't answer yet as an unresolved question with a placeholder, so the build proceeds instead of stalling. Use when user wants to stress-test a plan against their project's language and documented decisions.
---

<what-to-do>

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing. Asking multiple questions at once is bewildering.

If a *fact* can be found by exploring the environment (filesystem, tools, codebase), look it up rather than asking me. The *decisions*, though, are mine — put each one to me and wait for my answer.

Do not act on the plan until I confirm we have reached a shared understanding.

A branch is closed when it is answered — or, rarely, when it is **parked** as an unresolved question (see below). Parking is the only sanctioned way to leave a branch open; never leave one silently unresolved.

When a question has options, explain every option so I can choose without looking anything up — see **Presenting choices** below.

</what-to-do>

<supporting-info>

## Domain awareness

During codebase exploration, also look for existing documentation:

### File structure

Most repos have a single context:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

If a `CONTEXT-MAP.md` exists at the root, the repo has multiple contexts. The map points to where each one lives:

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

Create files lazily — only when you have something to write. If no `CONTEXT.md` exists, create one when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

## During the session

### Presenting choices

When a question has options to pick from, do this for **every** option:

1. **Show it in code first** — a short, simplified snippet of what that option looks like in practice. Use the project's real names (files, functions, tables, domain terms) when you know them; otherwise a tiny made-up example. A few lines: just enough to see the difference, not a full implementation.
2. **Explain it in plain words** — one or two short sentences on what it means for the user: what gets easier, what gets harder, when you'd pick it.

Keep the language simple:

- No vague or buzzword-only terms ("more scalable", "cleaner", "decoupled", "idiomatic"). Say what actually happens instead.
- If a technical term is unavoidable, explain it in the same sentence.
- Make the options differ visibly — side by side, the snippets should make the trade-off obvious.

Then give your recommendation and the one-line reason. See [EXAMPLES.md](./EXAMPLES.md) for what this looks like.

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `CONTEXT.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"

### Update CONTEXT.md inline

When a term is resolved, update `CONTEXT.md` right there. Don't batch these up — capture them as they happen. Use the format in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

`CONTEXT.md` should be totally devoid of implementation details. Do not treat `CONTEXT.md` as a spec, a scratch pad, or a repository for implementation decisions. It is a glossary and nothing else.

### Park what the user genuinely cannot answer yet

Occasionally the grill hits a question the user simply cannot close right now — the
decision belongs to someone else, depends on data that doesn't exist yet, or is waiting
on something outside the codebase. The feature still has to get built. Rather than
stalling the grill or letting the agent quietly guess, **park the question and build a
black box**: a named placeholder, generic or empty, that can be swapped when the answer
arrives.

**This is rare.** Expect zero parked questions in most sessions. It is not a valve for
"the user hesitated" or "this is getting long".

#### When to park

All four must hold:

1. **You asked and recommended.** The grill's default is a recommended answer; parking
   only happens *after* the user has heard yours and still can't decide.
2. **The blocker is real and external.** They're waiting on a person, a contract, a
   measurement, a product call — not on thinking about it for another minute. You must
   be able to name the blocker in one line.
3. **A wrong guess would be costly or invisible.** If any sane default works and nobody
   would be misled, don't park — take the default, note it in the tracker's
   Constraints/Notes, and move on. Parking is for when a silently-guessed answer would
   look deliberate and be wrong.
4. **The rest of the work survives without it.** There is a coherent placeholder that
   keeps the flow whole. If the mission cannot proceed without inventing data or
   behaviour, it isn't parkable — say the task is blocked and stop.

#### Park vs. handoff vs. ADR

- **Park (unresolved question)** — an open decision *inside* this task's scope that the
  build must route around now. Stays with the task.
- **Handoff** — a tangent that deserves its *own* task. Different scope, not a black
  box. Use the `handoff` skill; the current task doesn't wait on it.
- **ADR** — a decision that *was* made, is hard to reverse, and needs its rationale
  recorded. The opposite of a parked question. When a parked question is later resolved
  and meets the ADR bar, write the ADR then.

Never park something that changes the **domain language**. A term you need to name the
code cannot be deferred — settle it in `CONTEXT.md` and grill the behaviour behind it.

#### How to park

1. Say it plainly: *"Parking that as UQ-2 — we'll ship a fixed 30-day window as a
   placeholder and swap it when product decides."* Get the user's nod on the
   **placeholder**, not on the answer.
2. Record it in `unresolved-questions.md` next to the task's `progress-tracker.md`
   (path from `.ab-method/structure/index.yaml`), using the format in
   [UNRESOLVED-QUESTIONS-FORMAT.md](./UNRESOLVED-QUESTIONS-FORMAT.md). If no task folder
   exists yet, hold the parked questions in the session and write the file the moment it
   does.
3. Mark every mission that builds on the black box with `⚠️ UQ-n` in the tracker, so
   whoever runs it knows a placeholder is in play.
4. Return to the branch you were grilling. Parking one question does not end the grill.

Then keep going as normal — the black box is a placeholder in the plan, not a hole in it.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md).

</supporting-info>
