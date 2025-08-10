#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message, color = '') {
  console.log(`${color}${message}${COLORS.reset}`);
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

async function install() {
  log('\n🚀 AB Method Installation', COLORS.bright + COLORS.cyan);
  log('============================\n', COLORS.cyan);

  const targetDir = process.cwd();
  
  // Check if .ab-method already exists
  if (fs.existsSync(path.join(targetDir, '.ab-method'))) {
    log('⚠️  AB Method is already installed in this project!', COLORS.yellow);
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      readline.question('Do you want to overwrite? (y/N): ', resolve);
    });
    readline.close();
    
    if (answer.toLowerCase() !== 'y') {
      log('Installation cancelled.', COLORS.yellow);
      process.exit(0);
    }
  }

  try {
    log('📦 Installing AB Method files...', COLORS.blue);
    
    // Create .ab-method directory structure
    const abMethodSource = path.join(__dirname, '.ab-method');
    const abMethodTarget = path.join(targetDir, '.ab-method');
    
    if (fs.existsSync(abMethodSource)) {
      copyRecursiveSync(abMethodSource, abMethodTarget);
      log('✅ Created .ab-method directory', COLORS.green);
    }

    // Create .claude directory if it doesn't exist
    const claudeDir = path.join(targetDir, '.claude');
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, { recursive: true });
    }

    // Copy ab-master command
    const commandsDir = path.join(claudeDir, 'commands');
    if (!fs.existsSync(commandsDir)) {
      fs.mkdirSync(commandsDir, { recursive: true });
    }

    const commandSource = path.join(__dirname, '.claude', 'commands', 'ab-master.md');
    const commandTarget = path.join(commandsDir, 'ab-master.md');
    
    if (fs.existsSync(commandSource)) {
      fs.copyFileSync(commandSource, commandTarget);
      log('✅ Installed /ab-master command', COLORS.green);
    }

    // Update or create CLAUDE.md
    const claudeMdPath = path.join(targetDir, 'CLAUDE.md');
    const claudeMdContent = `# Claude Code Instructions

## AB Method
The AB Method is installed in this project. Use the following command to get started:

\`\`\`
/ab-master
\`\`\`

This will show you all available workflows for incremental task management.

### Key Workflows:
- \`analyze-project\` - Analyze project architecture
- \`create-task\` - Create a new development task
- \`create-mission\` - Create a mission for current task
- \`resume-task\` - Resume an existing task
- \`resume-mission\` - Resume an in-progress mission

### Important Files:
- \`.ab-method/structure/index.yaml\` - Configuration for paths and structure
- \`docs/architecture/\` - Generated architecture documentation
- \`tasks/\` - Task and mission tracking

Remember: Always check \`.ab-method/structure/index.yaml\` first to see where files should be created or read from.
`;

    if (fs.existsSync(claudeMdPath)) {
      const existingContent = fs.readFileSync(claudeMdPath, 'utf8');
      if (!existingContent.includes('AB Method')) {
        fs.appendFileSync(claudeMdPath, '\n\n' + claudeMdContent);
        log('✅ Updated CLAUDE.md with AB Method instructions', COLORS.green);
      }
    } else {
      fs.writeFileSync(claudeMdPath, claudeMdContent);
      log('✅ Created CLAUDE.md with AB Method instructions', COLORS.green);
    }

    // Create docs/architecture directory
    const docsDir = path.join(targetDir, 'docs', 'architecture');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
      log('✅ Created docs/architecture directory', COLORS.green);
    }

    // Create tasks directory
    const tasksDir = path.join(targetDir, 'tasks');
    if (!fs.existsSync(tasksDir)) {
      fs.mkdirSync(tasksDir, { recursive: true });
      log('✅ Created tasks directory', COLORS.green);
    }

    log('\n✨ AB Method installed successfully!', COLORS.bright + COLORS.green);
    log('\nNext steps:', COLORS.cyan);
    log('1. Open Claude Code in this project', COLORS.white);
    log('2. Run: /ab-master', COLORS.white);
    log('3. Choose a workflow to get started', COLORS.white);
    
    log('\nFor more information, visit:', COLORS.blue);
    log('https://github.com/ayoubben18/ab-method', COLORS.white);

  } catch (error) {
    log(`\n❌ Installation failed: ${error.message}`, COLORS.red);
    process.exit(1);
  }
}

// Parse command line arguments
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
  log('\nMore info: https://github.com/ayoubben18/ab-method', COLORS.blue);
} else if (command === '--version' || command === '-v') {
  const packageJson = require('./package.json');
  log(`ab-method v${packageJson.version}`, COLORS.cyan);
} else {
  log(`Unknown command: ${command}`, COLORS.red);
  log('Run "npx ab-method --help" for usage information', COLORS.yellow);
  process.exit(1);
}