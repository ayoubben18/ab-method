# Worked Examples

## Use case first

```text
Starting condition: a cart holding one item priced 10 and one priced 5
Action:             the user checks out with a valid card
Observable result:  the order is confirmed with total 15
What breaks if it regresses: the user is charged the wrong amount, or can't buy at all
```

The test is written from that statement, not from the code:

```typescript
test("user can check out a valid cart and is charged its total", async () => {
  const cart = createCart();
  cart.add({ price: 10 });
  cart.add({ price: 5 });

  const order = await checkout(cart, validCard);

  expect(order.status).toBe("confirmed");
  expect(order.total).toBe(15);
});
```

Two assertions, one use case: together they prove "confirmed **and** charged correctly".

## Meaningful red

```text
✗ user can check out a valid cart and is charged its total
  Expected: 15
  Received: 10          ← the behavior is broken: only the first item is summed. Good red.

✗ user can check out a valid cart and is charged its total
  TypeError: checkout is not a function   ← wrong import. Not red yet — fix the test and rerun.
```

## Assertions independent of the implementation

```typescript
// WEAK: expected value recomputed the way the code computes it — passes by construction
const expected = items.reduce((sum, i) => sum + i.price, 0);
expect(calculateTotal(items)).toBe(expected);

// STRONG: expected value comes from the use case
expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
```

```typescript
// WEAK: asserts an internal call — survives a wrong total, breaks on a harmless refactor
expect(mockPayment.process).toHaveBeenCalledWith(cart.total);

// STRONG: asserts the persisted, observable state through the interface
const saved = await getOrder(order.id);
expect(saved.total).toBe(15);
```

```typescript
// Exactness where it matters: prompt text must be preserved verbatim
expect(buildPrompt(input)).toBe("Summarize the following ticket in one sentence:\n\nPrinter jams");
```

## Challenging a test's value

```typescript
test("formatPrice returns a string", () => {
  expect(typeof formatPrice(1999)).toBe("string");
});
```

- Plausible broken implementation that still passes: `() => ""`. → Weak.
- Rewrite it against the use case: `expect(formatPrice(1999)).toBe("$19.99")`.
- If another test already asserts `"$19.99"`, delete this one — it adds no distinct protection.

## Deterministic execution

```typescript
// FLAKY: depends on the wall clock and an arbitrary sleep
await new Promise((r) => setTimeout(r, 500));
expect(screen.getByText("Expired")).toBeVisible();

// DETERMINISTIC: control time, wait for the observable outcome
vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
expect(await screen.findByText("Expired")).toBeVisible();
```
