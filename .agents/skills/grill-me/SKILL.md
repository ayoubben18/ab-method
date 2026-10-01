---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.

## Presenting choices

When a question has options to pick from, I should be able to choose without looking anything up. For **every** option:

1. **Show it in code first** — a short, simplified snippet of what that option looks like in practice. Use my project's real names (files, functions, tables) when you know them; otherwise a tiny made-up example. Keep it to a few lines: just enough to see the difference, not a full implementation.
2. **Explain it in plain words** — one or two short sentences on what it means for me: what gets easier, what gets harder, when you'd pick it.

Keep the language simple:

- No vague or buzzword-only terms ("more scalable", "cleaner", "decoupled", "idiomatic"). Say what actually happens instead: "adding a new payment type means editing one file instead of three".
- If a technical term is unavoidable, explain it in the same sentence.
- Make the options differ visibly — the snippets side by side should make the trade-off obvious.

Then give your recommendation and the one-line reason. See [EXAMPLES.md](../grill-with-docs/EXAMPLES.md) for what this looks like.
