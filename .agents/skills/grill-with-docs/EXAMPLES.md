# Grilling — examples

How a grilling question should look: the area briefed first when it is new to
the user, every option said in plain words and then shown in code, then a
recommendation with a one-line reason.

## Example 1 — where a check lives

> **Where should we check that the user is logged in?**
>
> **A — In each route.** Every route checks for itself. Easy to read, but forget it once and that page is open to anyone.
> ```ts
> app.get("/orders", (req, res) => {
>   if (!req.user) return res.status(401).end();
>   // ...
> });
> ```
>
> **B — Once, for a whole group of routes.** One line protects everything under `/orders`. New routes there are safe by default.
> ```ts
> app.use("/orders", requireLogin);
> app.get("/orders", (req, res) => { /* user is guaranteed here */ });
> ```
>
> **Recommended: B** — you can't accidentally ship an unprotected page.

## Example 2 — what a domain term means

> **When an Order is cancelled, what happens to it?**
>
> **A — It's deleted.** The order is gone. Simple, but you can't show "cancelled orders" or tell why it was cancelled later.
> ```ts
> await db.order.delete({ where: { id } });
> ```
>
> **B — It stays, with a status.** The order is kept and marked. Every list of "active orders" now has to filter out cancelled ones.
> ```ts
> await db.order.update({
>   where: { id },
>   data: { status: "cancelled", cancelledAt: new Date() },
> });
> ```
>
> **Recommended: B** — refunds and support will need to look up cancelled orders.

## Example 3 — briefing an area the user hasn't seen

The ticket: "the bot says the document doesn't exist when I ask it to rename it."

**Bad** — straight to the decision, in the code's words. The user has never
seen `#mutate`, `grant` or `requiredLevel`, so they can't choose:

> **Q1. What level should `update` and `export` require?**
> A. Lower both to `use` — `#mutate(..., { requiredLevel: "use" })` …

**Good** — what we're deciding, then the pieces, today's behaviour, what's
wrong, and only then the question:

> We need to decide what a bot may do to a document. First, how it works today.
>
> **The pieces.** A *workspace* has members, people or bots. Each member has a *role*:
> ```
> view  → can read
> use   → can read + add (write into documents, comment, create new ones)
> edit  → can read + add + change (rename, export, move)
> ```
> Bots join with `use` unless someone picks another role.
>
> **Today, for the bot in the ticket (`use`):**
> ```
> read the document        needs view   ✔
> write into it            needs use    ✔
> rename it                needs edit   ✘
> ```
>
> **What's wrong — two problems.**
> 1. *The rule:* the bot can write into a document but not rename it.
> 2. *The message:* a refusal says "doesn't exist" instead of "not allowed", because the lookup is "find the document this member can edit", which comes back empty. This gets fixed whatever you pick.
>
> **Deciding:** should a `use` member be allowed to rename?
>
> **A — Yes.** Bots just work. Moving a document out of the workspace stays `edit`.
> **B — No, keep `edit`.** The bot says "not allowed", and a person raises it to `edit` when needed.
>
> **Recommended: A** — a `use` bot can already create and fill documents, so blocking the rename protects nothing.

## Bad vs. good wording

| Vague | Plain |
| --- | --- |
| "B is more scalable." | "With B, adding a new payment type means editing one file instead of three." |
| "A is more decoupled." | "With A, the email code doesn't need to know anything about orders." |
| "Use idempotent handlers." | "Make the handler safe to run twice — if the webhook is sent again, the user isn't charged again." |
| "The Pal is at `use`; reach is checked at `edit` in `#reachable`." | "The bot's role is `use`, and renaming needs `edit`." |
