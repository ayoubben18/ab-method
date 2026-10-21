#!/usr/bin/env node
// Enforces the doc budgets in .ab-method/structure/index.yaml (rules: .ab-method/rules/docs.md).
// Exits 1 when any doc is over budget, has an overlong line, or leaks task history.

const fs = require('fs');
const path = require('path');

const DEFAULT_BUDGETS = {
  maxLineWords: 60,
  files: [
    ['UBIQUITOUS_LANGUAGE.md', 3000],
    ['**/CONTEXT.md', 2000],
    ['CONTEXT-MAP.md', 800],
    ['docs/architecture/tech-stack.md', 1500],
    ['docs/architecture/*/index.md', 300],
    ['docs/architecture/**/*.md', 600],
    ['docs/adr/*.md', 1000],
  ],
};
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.turbo', '.sst', '.ab-method']);
const HISTORY_DIRS = ['docs/tasks', 'docs/goals', 'docs/roadmaps'];

function parseBudgets(indexPath) {
  if (!indexPath || !fs.existsSync(indexPath)) return DEFAULT_BUDGETS;
  const lines = fs.readFileSync(indexPath, 'utf8').split('\n');
  const start = lines.findIndex(l => /^doc_budgets:/.test(l));
  if (start === -1) return DEFAULT_BUDGETS;

  const budgets = { maxLineWords: DEFAULT_BUDGETS.maxLineWords, files: [] };
  for (const line of lines.slice(start + 1)) {
    if (/^\S/.test(line)) break;
    const lineWords = line.match(/^\s+max_line_words:\s*(\d+)/);
    if (lineWords) budgets.maxLineWords = Number(lineWords[1]);
    const file = line.match(/^\s+"([^"]+)":\s*(\d+)/);
    if (file) budgets.files.push([file[1], Number(file[2])]);
  }
  if (budgets.files.length === 0) budgets.files = DEFAULT_BUDGETS.files;
  return budgets;
}

function globToRegex(glob) {
  const re = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*\//g, '\u0000')
    .replace(/\*/g, '[^/]*')
    .replace(/\u0000/g, '(?:.*/)?');
  return new RegExp(`^${re}$`);
}

function walk(dir, root, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const rel = path.relative(root, path.join(dir, entry.name));
      if (HISTORY_DIRS.includes(rel)) continue;
      walk(path.join(dir, entry.name), root, out);
    } else if (entry.name.endsWith('.md')) {
      out.push(path.relative(root, path.join(dir, entry.name)).split(path.sep).join('/'));
    }
  }
  return out;
}

function historySlugs(root) {
  const slugs = [];
  for (const dir of HISTORY_DIRS) {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) continue;
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name.includes('-')) slugs.push(entry.name);
    }
  }
  return slugs;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function checkFile(root, rel, budget, maxLineWords, slugPattern) {
  const lines = fs.readFileSync(path.join(root, rel), 'utf8').split('\n');
  const problems = [];
  let words = 0;
  let inFence = false;
  // ADRs are read on demand and record provenance by design: only their size is budgeted.
  const isAdr = rel.startsWith('docs/adr/');

  lines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return; }
    const count = line.split(/\s+/).filter(Boolean).length;
    words += count;
    if (isAdr || inFence || /^\s*\|/.test(line)) return;
    if (count > maxLineWords) problems.push(`line ${i + 1}: ${count} words (max ${maxLineWords}) — split or cut`);
    if (/\[DEPRECATED/i.test(line)) problems.push(`line ${i + 1}: [DEPRECATED] entry — delete it, git keeps history`);
    const leak = slugPattern && line.match(slugPattern);
    if (leak) problems.push(`line ${i + 1}: names task \`${leak[1]}\` — task history belongs in its tracker, not the docs`);
  });

  if (words > budget) problems.unshift(`${words} words, budget ${budget} — compact or split by topic`);
  return { rel, words, budget, problems };
}

function run(argv) {
  const rootArg = argv.indexOf('--root');
  const root = path.resolve(rootArg !== -1 ? argv[rootArg + 1] : process.cwd());
  const projectIndex = path.join(root, '.ab-method', 'structure', 'index.yaml');
  const bundledIndex = path.join(__dirname, '..', 'structure', 'index.yaml');
  const budgets = parseBudgets(fs.existsSync(projectIndex) ? projectIndex : bundledIndex);
  const rules = budgets.files.map(([glob, words]) => ({ glob, words, re: globToRegex(glob) }));

  const slugs = historySlugs(root);
  // A slug only counts as a leak when it stands alone — not inside a path, file name or identifier.
  const slugPattern = slugs.length
    ? new RegExp(`(?<![\\w/.-])(${slugs.map(escapeRegex).join('|')})(?![\\w/.-])`)
    : null;

  const results = walk(root, root, [])
    .map(rel => ({ rel, rule: rules.find(r => r.re.test(rel)) }))
    .filter(({ rule }) => rule)
    .map(({ rel, rule }) => checkFile(root, rel, rule.words, budgets.maxLineWords, slugPattern));

  const failing = results.filter(r => r.problems.length);
  const total = results.reduce((sum, r) => sum + r.words, 0);

  for (const r of failing) {
    console.log(`✗ ${r.rel}`);
    for (const p of r.problems.slice(0, 8)) console.log(`    ${p}`);
    if (r.problems.length > 8) console.log(`    … ${r.problems.length - 8} more`);
  }
  console.log(`\n${results.length} docs, ${total} words total, ${failing.length} failing`);
  return failing.length ? 1 : 0;
}

if (require.main === module) process.exit(run(process.argv.slice(2)));
module.exports = { run };
