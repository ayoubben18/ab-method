# Credits

The two-axis shape — separate reviewers in parallel subagents with fresh context, reported side by side and never reranked — and the smell baseline with its two binding rules come from Matt Pocock's [`code-review`](https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review) skill in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT license). The smells themselves are from Martin Fowler's *Refactoring*, chapter 3.

AB Method changes: the axes are **seams** (against `docs/seams/`) and **rules** (`.ab-method/rules/code.md`, the red flags from *A Philosophy of Software Design*, repo standards, the smell baseline) instead of Standards and Spec, and findings are acted on: safe fixes pushed to the PR, judgment calls recorded in `review.md` and one PR comment.
