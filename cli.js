#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  white: '\x1b[37m'
};

function log(message, color = '') {
  console.log(`${color}${message}${COLORS.reset}`);
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  // statSync (not lstatSync) follows symlinks — so symlinked source dirs
  // dereference into real copies at the destination.
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

async function detectTargets(targetDir) {
  const hasClaude = fs.existsSync(path.join(targetDir, '.claude'));
  const hasAgents = fs.existsSync(path.join(targetDir, '.agents'));

  log('🔍 Detecting environment...', COLORS.cyan);
  log(`   .claude/  → ${hasClaude ? 'found' : 'not found'}`, hasClaude ? COLORS.green : COLORS.yellow);
  log(`   .agents/  → ${hasAgents ? 'found' : 'not found'}`, hasAgents ? COLORS.green : COLORS.yellow);

  if (hasClaude && hasAgents) {
    log('✅ Installing for both Claude Code and Codex\n', COLORS.green);
    return { installClaude: true, installCodex: true };
  }
  if (hasClaude) {
    log('✅ Installing for Claude Code\n', COLORS.green);
    return { installClaude: true, installCodex: false };
  }
  if (hasAgents) {
    log('✅ Installing for Codex\n', COLORS.green);
    return { installClaude: false, installCodex: true };
  }

  // Neither detected — ask the user
  log('\nNo .claude/ or .agents/ directory detected in the project.', COLORS.yellow);
  log('Choose what to install:', COLORS.white);
  log('  1) Claude Code only (.claude/)', COLORS.white);
  log('  2) Codex only (.agents/)', COLORS.white);
  log('  3) Both (default)', COLORS.white);
  const answer = (await ask('\nChoice [3]: ')).trim();
  if (answer === '1') return { installClaude: true, installCodex: false };
  if (answer === '2') return { installClaude: false, installCodex: true };
  return { installClaude: true, installCodex: true };
}

async function install() {
  log('\n🚀 AB Method Installation', COLORS.bright + COLORS.cyan);
  log('============================\n', COLORS.cyan);

  const targetDir = process.cwd();
  const packageRoot = __dirname;

  const abMethodSource = path.join(packageRoot, '.ab-method');
  const commandsSource = path.join(packageRoot, '.claude', 'commands');
  const subagentsSource = path.join(packageRoot, '.claude', 'agents');
  const skillsSource = path.join(packageRoot, '.agents', 'skills');

  // Overwrite check
  if (fs.existsSync(path.join(targetDir, '.ab-method'))) {
    log('⚠️  AB Method is already installed in this project.', COLORS.yellow);
    const answer = await ask('Overwrite? (y/N): ');
    if (answer.toLowerCase() !== 'y') {
      log('Installation cancelled.', COLORS.yellow);
      process.exit(0);
    }
  }

  // Detect Claude vs Codex targets
  const { installClaude, installCodex } = await detectTargets(targetDir);

  // Built-in Claude subagents prompt — only if installing for Claude
  let installSubagents = false;
  if (installClaude) {
    log('🤖 Built-in Claude Subagents', COLORS.bright + COLORS.cyan);
    log('============================', COLORS.cyan);
    log('Optional specialized subagents that integrate with the AB Method:', COLORS.white);
    log('  • shadcn-ui-adapter         - UI components', COLORS.white);
    log('  • nextjs-backend-architect  - Next.js backend', COLORS.white);
    log('  • sst-cloud-architect       - Serverless infra', COLORS.white);
    log('  • vitest-component-tester   - Component tests', COLORS.white);
    log('  • playwright-e2e-tester     - E2E tests', COLORS.white);
    log('  • ascii-ui-mockup-generator - UI mockups', COLORS.white);
    log('  • mastra-ai-agent-builder   - AI agent dev', COLORS.white);
    log('  • qa-code-auditor           - Code quality', COLORS.white);
    const ans = await ask('\nInstall these built-in subagents? (Y/n): ');
    installSubagents = ans.toLowerCase() !== 'n';
    log(installSubagents ? '✅ Will install built-in subagents\n' : '⏭️  Skipping built-in subagents\n',
        installSubagents ? COLORS.green : COLORS.yellow);
  }

  try {
    log('📦 Installing AB Method files...', COLORS.blue);

    // 1. .ab-method/ — always installed
    if (fs.existsSync(abMethodSource)) {
      copyRecursiveSync(abMethodSource, path.join(targetDir, '.ab-method'));
      log('✅ .ab-method/ installed', COLORS.green);
    }

    // 2. docs scaffolding — always created
    ensureDir(path.join(targetDir, 'docs', 'architecture'));
    ensureDir(path.join(targetDir, 'docs', 'tasks'));
    log('✅ docs/architecture/ and docs/tasks/ ready', COLORS.green);

    // 3. Claude Code targets
    if (installClaude) {
      ensureDir(path.join(targetDir, '.claude'));

      // Slash commands
      if (fs.existsSync(commandsSource)) {
        copyRecursiveSync(commandsSource, path.join(targetDir, '.claude', 'commands'));
        log('✅ .claude/commands/ installed (slash commands)', COLORS.green);
      }

      // Skills (real copies — not symlinks — for portability)
      if (fs.existsSync(skillsSource)) {
        copyRecursiveSync(skillsSource, path.join(targetDir, '.claude', 'skills'));
        log('✅ .claude/skills/ installed (skills for Claude)', COLORS.green);
      }

      // Built-in subagents (optional)
      if (installSubagents && fs.existsSync(subagentsSource)) {
        copyRecursiveSync(subagentsSource, path.join(targetDir, '.claude', 'agents'));
        log('✅ .claude/agents/ installed (built-in subagents)', COLORS.green);
      }
    }

    // 4. Codex targets
    if (installCodex) {
      ensureDir(path.join(targetDir, '.agents'));
      if (fs.existsSync(skillsSource)) {
        copyRecursiveSync(skillsSource, path.join(targetDir, '.agents', 'skills'));
        log('✅ .agents/skills/ installed (helper + ab-* workflow skills for Codex)', COLORS.green);
      }

      // AGENTS.md — Codex reads this before any work. Codex has no repo-shared
      // slash commands, so this orients it and points at the ab-* workflow skills.
      const agentsPath = path.join(targetDir, 'AGENTS.md');
      const abSection = [
        '<!-- ab-method:start -->',
        '## AB Method',
        '',
        'This project uses the AB Method. Before running any AB Method workflow,',
        'check `.ab-method/structure/index.yaml` — it defines where each workflow',
        'reads from and writes to. Paths are user-configurable; never hardcode them.',
        '',
        'Workflows are available as skills (prefix `ab-`). Invoke one explicitly',
        'with `/skills` or `$ab-<name>`, or describe your intent and Codex will',
        'match it:',
        '',
        '- `ab-mastermind` — intelligent entry point: routes your intent to the right workflow, helps decide goal vs task, explains the method',
        '- `ab-analyze-project` — full architecture sweep',
        '- `ab-create-task` — define a task, break it into TDD missions',
        '- `ab-create-task-from-handoff` — resume a handoff spun off mid-grill into a task',
        '- `ab-create-goal` — produce a prompt for an autonomous /goal loop',
        '- `ab-extend-goal` — extend an existing goal',
        '- `ab-resume-task` — continue an existing task',
        '- `ab-extend-task` — append missions to a task',
        '- `ab-update-architecture` — refresh architecture docs',
        '',
        'Principles: always grill before defining work (`grill-with-docs`); every',
        'mission runs through `tdd` (red-green-refactor); `progress-tracker.md` is',
        'the single source of truth per task. When a tangent surfaces mid-grill that',
        'deserves its own task, capture it with the `handoff` skill under',
        '`docs/handoffs/` instead of derailing — resume it later with',
        '`ab-create-task-from-handoff`.',
        '<!-- ab-method:end -->',
        ''
      ].join('\n');

      if (fs.existsSync(agentsPath)) {
        const existing = fs.readFileSync(agentsPath, 'utf8');
        if (existing.includes('<!-- ab-method:start -->')) {
          log('ℹ️  AGENTS.md already has the AB Method section — skipped', COLORS.yellow);
        } else {
          fs.writeFileSync(agentsPath, existing.replace(/\s*$/, '') + '\n\n' + abSection);
          log('✅ AGENTS.md — AB Method section appended', COLORS.green);
        }
      } else {
        fs.writeFileSync(agentsPath, '# AGENTS.md\n\n' + abSection);
        log('✅ AGENTS.md created', COLORS.green);
      }
    }

    // Summary
    log('\n✨ AB Method installed successfully!', COLORS.bright + COLORS.green);
    log('\nWhat got installed:', COLORS.cyan);
    log('  • .ab-method/                        — workflow definitions', COLORS.white);
    log('  • docs/architecture/, docs/tasks/   — output scaffolding', COLORS.white);
    if (installClaude) {
      log('  • .claude/commands/                  — /create-task, /create-goal, /analyze-project, ...', COLORS.white);
      log('  • .claude/skills/                    — grill-with-docs, tdd, domain-model, ab-* workflows, ...', COLORS.white);
      if (installSubagents) {
        log('  • .claude/agents/                    — built-in subagents', COLORS.white);
      }
    }
    if (installCodex) {
      log('  • .agents/skills/                    — helper + ab-* workflow skills, exposed to Codex', COLORS.white);
      log('  • AGENTS.md                          — orients Codex; lists the ab-* workflow skills', COLORS.white);
    }

    log('\nNext steps:', COLORS.cyan);
    if (installClaude) {
      log('  • Open Claude Code in this project', COLORS.white);
      log('  • Run /analyze-project to generate UBIQ + CONTEXT + arch docs', COLORS.white);
      log('  • Run /domain-model to sharpen the domain language (optional)', COLORS.white);
      log('  • Run /create-task or /create-goal to start work', COLORS.white);
    }
    if (installCodex) {
      log('  • Open Codex in this project', COLORS.white);
      log('  • Run a workflow with /skills or $ab-analyze-project (Codex has no repo slash commands)', COLORS.white);
      log('  • Or just describe your intent — Codex matches the ab-* skill by its description', COLORS.white);
    }

    log('\nDocs: https://github.com/ayoubben18/ab-method', COLORS.blue);

  } catch (error) {
    log(`\n❌ Installation failed: ${error.message}`, COLORS.red);
    process.exit(1);
  }
}

// CLI entry
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'install') {
  install();
} else if (command === '--help' || command === '-h') {
  log('\n📚 AB Method CLI', COLORS.bright + COLORS.cyan);
  log('================\n', COLORS.cyan);
  log('Usage:', COLORS.yellow);
  log('  npx ab-method          Install AB Method in current project');
  log('  npx ab-method install  Install AB Method in current project');
  log('  npx ab-method --help   Show this help message');
  log('\nThe installer detects:');
  log('  • .claude/ → installs commands + skills for Claude Code');
  log('  • .agents/ → installs skills for Codex');
  log('  • neither → asks you which to install');
  log('  • both    → installs both');
  log('\nMore info: https://github.com/ayoubben18/ab-method', COLORS.blue);
} else if (command === '--version' || command === '-v') {
  const packageJson = require('./package.json');
  log(`ab-method v${packageJson.version}`, COLORS.cyan);
} else {
  log(`Unknown command: ${command}`, COLORS.red);
  log('Run "npx ab-method --help" for usage information', COLORS.yellow);
  process.exit(1);
}
