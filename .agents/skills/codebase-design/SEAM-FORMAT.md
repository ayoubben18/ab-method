# Seam Doc Format

A seam doc records **where one of the app's seams lives and how callers must use it**. Future agents read it before placing code, so a capability the seam owns goes through it instead of around it.

Seam docs live in `docs/seams/` (path from `.ab-method/structure/index.yaml`): one file per seam, named by slug (`docs/seams/data-fetching.md`), plus `docs/seams/index.md` with one line per seam. Create the folder lazily, when the first seam doc is written.

## Seam doc vs ADR vs pattern topic

| Doc | Holds | Changes |
|---|---|---|
| ADR (`docs/adr/`) | **why** a decision was made | frozen; superseded, never edited |
| Seam doc (`docs/seams/`) | **where** the seam is, its interface, its files, its status | living; edited in place as the code moves |
| Pattern topic (`docs/architecture/<layer>/`) | **how** code of a kind is written | living |

A seam doc links its ADR in one line (`see ADR-0004`). A pattern topic that touches a seam links the seam doc in one line instead of restating it.

## The bar

Write a seam doc only when all three hold:

1. **Several callers cross it.** One caller is a function call, not a seam.
2. **Going around it is a bug.** Calling `fetch` directly when a data-fetching seam exists, reading `process.env` outside the configuration seam.
3. **Reading the caller doesn't tell you.** A developer writing a new caller wouldn't know to go through it. A lint rule or CI guard that enforces it doesn't remove the need: record the guard in **Check**.

Most modules never get one; an app usually has a handful to a dozen or so. `SEAM-CATALOG.md` lists the seams most apps have.

**One owner per rule.** When two seams seem to claim the same callers, the narrower one owns the **Callers never** line and the wider one links it. A file may appear in two seam docs only when it is part of both interfaces.

## Template

```md
# Data fetching

**Interface:** one hook per resource (`useOrders()`, `useOrderMutation()`); errors arrive as `QueryError`.
**Files:**
- `src/lib/query/client.ts` — QueryClient and its defaults
- `src/lib/query/keys.ts` — query-key factory
**Adapters:** HTTP through `apiClient` in production; `createTestQueryClient()` in tests.
**Callers never:** call `fetch` or `apiClient` directly from a component.
**Check:** `grep -rln "fetch(" src/components src/app`
**Exceptions:** `src/app/api/health/route.ts` — liveness probe, must not depend on the client
**Status:** settled
**Decision:** see ADR-0004
```

- **Interface** — what a caller must know: entry points, invariants, error modes, units. Not every export.
- **Files** — the seam's own files, one line each. Never its callers; `grep` finds those.
- **Adapters** — only when more than one exists (production + test counts).
- **Callers never** — the bypass that would be a bug. This is the line reviewers check.
- **Check** — the command that lists bypasses: a grep, a lint rule, a CI script. It must exclude the Exceptions, so an empty result means no bypass. Omit it only when no mechanical check is possible (say so; reviewers check by reading).
- **Exceptions** — callers allowed to go around the seam, each with its reason. Only when there are any.
- **Status** — see below.
- **Decision** — only when an ADR exists.

## Status lifecycle

One definition, used by every workflow that writes or checks a status:

- **`introducing`** — the target interface is designed (by the seam design gate, before any code) or exists in only a few places, and most callers don't use it yet.
- **`migrating`** — the seam is the norm, but some callers still bypass it. **Check** lists them. Name the old path or pattern they use:
  `**Status:** migrating — old pattern: direct fetch() in components`
- **`settled`** — **Check** comes back empty (Exceptions excluded), or nothing can bypass the seam by construction.

`sync-architecture` moves the status from the diff by running **Check**: `introducing` → `migrating` once most callers go through the seam, → `settled` once Check is empty. A status is never moved without running Check.

## Index

`docs/seams/index.md`, one line per seam:

```md
- [Data fetching](data-fetching.md) — server state through per-resource hooks · settled
- [Configuration](configuration.md) — typed settings with defaults computed inside · migrating
```

## Rules

Seam docs follow `.ab-method/rules/docs.md`: current state only, no task names, no history, deleted when untrue. Budgets: index 300 words, each seam doc 400 (`doc_budgets` in `index.yaml`). Run `check-docs` after every write.
