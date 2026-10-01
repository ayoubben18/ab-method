# Presenting choices — examples

How a grilling question with options should look: every option shown in code
first, then explained in plain words, then a recommendation with a one-line reason.

## Example 1 — where a check lives

> **Where should we check that the user is logged in?**
>
> **A — In each route**
> ```ts
> app.get("/orders", (req, res) => {
>   if (!req.user) return res.status(401).end();
>   // ...
> });
> ```
> Every route checks for itself. Easy to read, but forget it once and that page is open to anyone.
>
> **B — Once, for a whole group of routes**
> ```ts
> app.use("/orders", requireLogin);
> app.get("/orders", (req, res) => { /* user is guaranteed here */ });
> ```
> One line protects everything under `/orders`. New routes there are safe by default.
>
> **Recommended: B** — you can't accidentally ship an unprotected page.

## Example 2 — what a domain term means

> **When an Order is cancelled, what happens to it?**
>
> **A — It's deleted**
> ```ts
> await db.order.delete({ where: { id } });
> ```
> The order is gone. Simple, but you can't show "cancelled orders" or tell why it was cancelled later.
>
> **B — It stays, with a status**
> ```ts
> await db.order.update({
>   where: { id },
>   data: { status: "cancelled", cancelledAt: new Date() },
> });
> ```
> The order is kept and marked. Every list of "active orders" now has to filter out cancelled ones.
>
> **Recommended: B** — refunds and support will need to look up cancelled orders.

## Bad vs. good wording

| Vague | Plain |
| --- | --- |
| "B is more scalable." | "With B, adding a new payment type means editing one file instead of three." |
| "A is more decoupled." | "With A, the email code doesn't need to know anything about orders." |
| "Use idempotent handlers." | "Make the handler safe to run twice — if the webhook is sent again, the user isn't charged again." |
