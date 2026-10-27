---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.

## Brief before you ask

Assume I did not write the code under discussion — an agent did — so every module is new to me until you have explained it in this session. Before the **first question on a branch** that touches such an area, brief me, then ask. Build the picture in this order:

1. **The pieces** — the 2–4 concepts the decision rests on, each defined in one plain line. Name the domain thing ("a bot joins a workspace with a role"), not the code thing (`grant`, `#mutate`).
2. **How it works today** — walk one concrete case from the ticket through the system: who does what, what gets checked, what happens. A small table or step diagram beats prose.
3. **What's wrong** — the symptom I see first, then the cause. If it splits into several problems, number them and say which one is the decision and which get fixed whatever I pick.
4. **What we're deciding** — one sentence. Then the question and its options.

Rules:

- **Every word in the question must already be explained.** A function name, flag, error code or internal term that the briefing did not introduce gets translated or cut. File references (`path:line`) are pointers for later, never the explanation.
- **Size it to the gap.** A full briefing for a module not yet explained this session; one line when it was. Never re-explain what is already explained.
- **Lead with one line saying what we're about to decide**, then the briefing, then the question. This is the one place a grill message doesn't open with the question itself.

See Example 3 in [EXAMPLES.md](../grill-with-docs/EXAMPLES.md).

## Presenting choices

When a question has options to pick from, I should be able to choose without looking anything up. For **every** option:

1. **Say what changes** — one or two plain sentences on what happens differently for me and the system: who can now do what, what users see, what gets easier or harder, when you'd pick it.
2. **Then show it in code** — a short, simplified snippet that makes the difference visible. Use only names the briefing already introduced; otherwise a tiny made-up example. A few lines, not a full implementation. Skip it when the sentence already makes the difference obvious.

Keep the language simple:

- No vague or buzzword-only terms ("more scalable", "cleaner", "decoupled", "idiomatic"). Say what actually happens instead: "adding a new payment type means editing one file instead of three".
- If a technical term is unavoidable, explain it in the same sentence.
- Make the options differ visibly — the snippets side by side should make the trade-off obvious.

Then give your recommendation and the one-line reason. See [EXAMPLES.md](../grill-with-docs/EXAMPLES.md) for what this looks like.
