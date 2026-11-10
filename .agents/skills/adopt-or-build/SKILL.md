---
name: adopt-or-build
description: Before building a feature or fix, search for open-source libraries that already solve it and decide per piece whether to adopt one or build it. A library is adopted only when it is actively maintained, not outdated, and compatible with the project's exact stack (versions, runtime, module format, types). Use when scoping a large or already-solved capability, or when the user asks "is there a library for this", "should we build this ourselves", or wants to avoid reinventing something.
---

# Adopt or Build

Every piece of a feature gets one verdict: **adopt** a library or **build** it. Adopt only a **healthy** library that removes real work. Build when no healthy library exists, or when the piece is small enough that a dependency costs more than the code.

The repo's own rules win. Read `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, the tech-stack doc and the ADRs for banned or preferred dependencies, licence policy and supported runtimes. An ADR that decided to build something is not reopened unless the user asks. In an AB Method repo, read `.ab-method/structure/index.yaml` first: it says where those docs live.

## When it runs

For any capability, whatever placement you lean towards (reusing an installed library included), when either holds:

- **The scope is large**: more than a short module (an editor, a scheduler, a sync engine, an importer).
- **It is a known solved problem**: parsing a standard format (CSV, Markdown, dates, phone numbers), retries and backoff, rate limiting, drag-and-drop, rich text, charts, virtualised lists, auth flows, PDF, i18n, search, state machines, crypto.

Skip it for:

- **Domain logic.** The project's business rules (when an order is cancellable, how a refund is computed) belong to the codebase. A library may serve them, never own them.
- **Pieces a short function covers.** Ten lines of code beat a dependency. Parsing a standard format is never one: delimiters, encodings, quoting and byte-order marks are where hand-rolled parsers break.

## 1. Scope the feature

Break the feature or bug into **pieces**: the separate capabilities it needs (parsing, retries, rendering, scheduling). Mark each **hard** or **trivial**.

Then read the project's exact stack from the manifests and lockfile, never from memory:

- language and its version, framework and its version (React 19, Next 15, Django 5)
- runtime targets: every place the code runs (the production image, serverless functions, local dev), each with its Node version; browser, edge, React Server Components, mobile
- module format (ESM or CommonJS), TypeScript version
- the project's licence, and a bundle-size budget if one exists

Done when every piece has a one-line description and the stack is written down with versions.

## 2. Check what the repo already has

For each piece, look for existing code that already covers it:

- dependencies in the manifest (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`), including what they offer beyond what the repo uses today
- internal helpers, shared packages and documented seams

Mark each piece:

- **covered by code**: an internal module does it with no third-party library underneath (`file:line`). Reuse it; no health check. An internal wrapper around a library is **covered by a dependency**: check the library.
- **covered by a dependency**: a direct dependency does it. It still goes through step 4, as the first candidate. An installed library is not healthy just because it is installed.
- **open**: nothing covers it. A package that is only in the lockfile (pulled in by another dependency) counts as a candidate here; adopting it means adding it as a direct dependency, pinned.

Done when every piece is marked. Adding a second library for a job a healthy installed one already does is the redundancy this skill exists to prevent.

## 3. Find candidates

For each open or dependency-covered hard piece, search the package registry, GitHub and the framework's own docs and ecosystem lists. Collect up to three candidates per piece, starting with the ones the ecosystem treats as the default.

Done when every open piece has its candidates listed, or a note that the search found none.

## 4. Check health

A library is **healthy** only when it passes every check below. Gather the numbers with the commands; never estimate them or recall them from training data, which is out of date by definition.

| Check | Bar | How |
| --- | --- | --- |
| Maintained | a release in the last 6 months, or human commits in the last 3 months on a mature library (bot and Dependabot pushes don't count); not archived; not deprecated | `npm view <pkg> time deprecated`, `gh repo view <owner/repo> --json pushedAt,isArchived`, the recent commit list |
| Current | its latest major supports the project's current framework majors; adopting it needs no downgrade | changelog, `npm view <pkg> peerDependencies engines` |
| Responsive | a maintainer replied to issues or merged PRs in the last 6 months. A single maintainer passes, but write "single maintainer" in the Why column as a risk | the latest issues and PRs, `gh api repos/<owner/repo>/contributors` |
| Used | widely depended on for its ecosystem (for npm, roughly 10k+ weekly downloads); a niche library below that needs a reason | registry download stats, GitHub "Used by" |
| Safe | no open high or critical advisories on the version you would install | osv.dev (`https://api.osv.dev/v1/query`), GitHub advisories; `npm audit` only after install |
| Licence | compatible with the project's licence | `npm view <pkg> license` (`gh repo view --json licenseInfo` often returns null) |
| Fits exactly | see below | its docs, its manifest, a spike |

**Fits exactly** means each of these holds against the versions from step 1:

- its `peerDependencies` and `engines` accept the installed versions, not just a nearby range, in every runtime from step 1. Check the version you would install, not only the latest: a newer release may narrow `engines`
- it runs in every runtime target (a Node-only library fails on edge; a client-only component fails in a Server Component)
- it ships the project's module format and its own types
- its current API does what the piece needs. Read the docs for the exact version you would install (context7, or the README at that version's tag), not an old blog post

When fit is still uncertain, run a **spike**: install the exact version in a scratch directory outside the repo, with the project's TypeScript and Node versions, write the smallest call the piece needs, and typecheck or run it. Throw it away after. Never install into the repo while deciding.

**Published outside the registry.** Some libraries ship current releases only from their own server or CDN (SheetJS does), so the registry shows a stale version. Check the project's README for where it publishes. Judge the registry version as what `npm install <pkg>` gives you; the off-registry build passes only if the project accepts that install source.

Done when every candidate has a pass or fail on each check, with the number or link behind it. A candidate that fails any check is out, unless the user overrides it: an override is written as the verdict `adopt (override: <failed check>, <reason>)`, never silently. An installed dependency that fails stays in the report as **covered, unhealthy**, with the failing checks, next to the healthy alternative.

## 5. Weigh the abstraction

For each healthy candidate, compare the work it removes against what it costs:

- **Coverage:** which parts of the piece it handles, and what glue code remains.
- **Friction:** where its design fights the requirements or the codebase's patterns.
- **Weight:** install and bundle size, and the dependencies it pulls in.
- **Lock-in:** how much code would import it directly, and how hard it is to swap out. Keep it behind one module or seam so a swap touches one place.

Adopt when the library handles the hard part and the glue is smaller than the code it replaces. Build when the piece takes a short function to write, or when the glue would match the library's size. A healthy installed dependency wins a tie; when a new candidate removes clearly more glue, or the installed one is unhealthy, say so and let the user choose. When a choice between candidates also decides architecture (where code runs: browser or server; sync or background), put that to the user as its own question instead of letting the tie-break settle it.

Done when every piece has a verdict with a one-sentence reason.

## 6. Report

Send one table, then stop:

```
| Piece | Verdict | Library | Why |
| --- | --- | --- | --- |
| retries | adopt | p-retry@6.2.1 | handles backoff and abort; last release 3 weeks ago, 4 active contributors, ESM + types, Node 20 ✓ |
| CSV export | build | none | 15 lines with the built-in stream API; candidates unreleased since 2023 |
| date parsing | covered | date-fns (already installed) | `parseISO` covers the formats; released 2 months ago, healthy |
```

Under the table, list what adopting changes: the packages and exact versions to install, the module the library sits behind, and the files the glue code goes in. Keep the losing candidates in the table with the check they failed, and write down the date the checks ran, so a later reader knows why and how fresh the evidence is. Install packages only after the user agrees, pinned to the exact version that was checked, with no `^` or `~` range. When a reused dependency's manifest range would let a lockfile refresh pull a version that fails a check (a narrower `engines`, a new advisory), pin it too. A package already in the lockfile through another dependency keeps the locked version unless a check fails on it.

Done when every piece from step 1 appears in the table.
