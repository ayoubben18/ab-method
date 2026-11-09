# Seam Catalog

Seven seams most apps have, each drawn from an example in John Ousterhout's *A Philosophy of Software Design*. AB Method ships them as defaults: `analyze-project` matches each entry against the real code and writes a seam doc (format: [SEAM-FORMAT.md](SEAM-FORMAT.md)) only for the ones the project has. A missing seam is not a finding by itself; it becomes one when the code shows the bypass the seam would prevent.

For each entry: what it hides, what callers must never do, how to find it in a codebase, and the book's reasoning. The catalog is a starting point, not a checklist: a project's own seams (a payments gateway, a feature-flag client, a tenancy scope) usually matter as much.

## Storage

- **Hides:** how data is stored and fetched: queries, the ORM, caching, file formats, transactions.
- **Callers never:** write raw SQL, call the ORM, or touch the cache from feature code.
- **Find it:** a repository / data-access layer, ORM models, `db/` or `persistence/` folders, query builders.
- **Book (Ch. 4):** the Unix file interface. Five calls (`open`, `read`, `write`, `lseek`, `close`) hide disk layout, caching and scheduling. A deep interface over storage is what lets everything above it stay simple.

## Transport

- **Hides:** the wire format of requests coming in and calls going out: parsing, headers, serialization, retries, auth tokens.
- **Callers never:** parse a raw request or build an HTTP call inline.
- **Find it:** an API client, `fetch` wrappers, request parsers / validators, route handler middleware, SDK wrappers for third-party services.
- **Book (Ch. 5):** the HTTP server example. When the request format is known by several modules, a change to it ripples through all of them: information leakage. One module should own the format.

## Client data cache

- **Hides:** how the client fetches, caches and invalidates server data: cache keys, stale times, refetch and invalidation rules.
- **Callers never:** build a cache key inline, or fetch server data outside the cache layer.
- **Find it:** a query-key factory, data-fetching hooks (React Query, SWR, Apollo, RTK Query), a client store that mirrors server state.
- **Book (Ch. 5):** information leakage again. When every component knows the key format and when to invalidate, one change to either touches all of them.
- **Frontend only.** Skip it for apps with no client-side server state.

## Configuration

- **Hides:** environment variables and settings, with defaults computed inside.
- **Callers never:** read `process.env` (or its equivalent) directly, or push a setting onto every caller as a parameter.
- **Find it:** a `config` module, env schema validation, settings files.
- **Book (Ch. 8):** pull complexity downwards. A configuration parameter exports a decision the module could make itself; each one pushes work onto every caller. Compute sensible defaults inside and expose as few knobs as possible.

## Error boundary

- **Hides:** where errors are caught, translated into responses or UI states, and logged.
- **Callers never:** wrap each handler in its own try/catch that formats and logs the error.
- **Find it:** error middleware, a top-level exception handler, React error boundaries, a `Result` / error type shared across handlers.
- **Book (Ch. 10):** define errors out of existence, and aggregate the rest. Most errors can be masked at a low level or handled in one place at the top; scattered handlers multiply the code that can go wrong.

## Request context

- **Hides:** per-request data: the current user, tenant, locale, trace id.
- **Callers never:** pass the same value down through layers that don't use it.
- **Find it:** context objects, `AsyncLocalStorage`, request-scoped DI containers, React context providers.
- **Book (Ch. 7):** pass-through variables. A variable threaded through methods that ignore it adds interface to all of them; a context object holds it in one place.
- **Not universal.** Many frontend apps and simple backends don't need one. Only record it when the code already has one, or shows the pass-through it would remove.

## Domain core

- **Hides:** the business rules, as general-purpose operations independent of any one screen or endpoint.
- **Callers never:** put a business rule in a component, route handler or job.
- **Find it:** `domain/`, `services/`, `core/`, modules named after `CONTEXT.md` concepts.
- **Book (Ch. 6):** general-purpose modules are deeper. The text-editor example keeps a general text class (insert and delete a range) under special-purpose UI code; the general core stays simple and the special cases stay at the edges.
- **One per bounded context.** When the repo has several contexts (a `CONTEXT-MAP.md`, or per-context `CONTEXT.md` files), each context's core is its own seam doc, named after the context.
- **Usually no mechanical Check.** A business rule in the wrong place rarely has a greppable shape. Write the doc when the core is recognisable (a folder or module family named after domain concepts), leave **Check** out, and let reviewers check by reading. No recognisable core → write nothing; the deepening scan will find the scattered rules.

## Applying the catalog

1. For each entry, search the code with its **Find it** hints. Read the repo's own agent docs (`AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`) too: rules they call invariants are seams.
2. **Present** → write the seam doc with a **Check** that excludes legitimate **Exceptions**, run it, and set the status from the result using the definitions in `SEAM-FORMAT.md` (empty → `settled`; a few bypasses → `migrating`; most callers bypass it → `introducing`).
3. **Absent** → write nothing. When a task later needs it, the seam design gate introduces it.
4. A project seam that matches no entry gets a seam doc too, if it clears the bar in `SEAM-FORMAT.md`. Most repos have some.
5. Overlaps: one owner per rule (`SEAM-FORMAT.md`).
