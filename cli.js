#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
// const { execSync } = require('child_process'); // Removed - not needed anymore

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

  // Ask about builtin agents
  log('🤖 Agent Configuration', COLORS.bright + COLORS.cyan);
  log('=====================\n', COLORS.cyan);
  log('The AB Method works with specialized Claude Code agents to improve development workflow.');
  log('We have several builtin agents that integrate seamlessly with the AB Method:\n');
  
  log('Available builtin agents:', COLORS.yellow);
  log('• shadcn-ui-adapter     - UI component creation and styling');
  log('• nextjs-backend-architect - Next.js backend development');
  log('• sst-cloud-architect   - Serverless infrastructure');
  log('• vitest-component-tester - Component testing');
  log('• playwright-e2e-tester - End-to-end testing');
  log('• ascii-ui-mockup-generator - UI mockups and wireframes');
  log('• mastra-ai-agent-builder - AI agent development');
  log('• qa-code-auditor       - Code quality analysis');
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  log('\nThese agents help minimize context window usage and provide specialized expertise.');
  const agentChoice = await new Promise(resolve => {
    readline.question('\nDo you want to install these builtin agents? (Y/n): ', resolve);
  });
  readline.close();
  
  const installAgents = agentChoice.toLowerCase() !== 'n';
  
  if (installAgents) {
    log('✅ Will install builtin agents', COLORS.green);
  } else {
    log('⏭️  Skipping builtin agents installation', COLORS.yellow);
    log('   You can always install agents later or use your own custom agents', COLORS.white);
  }

  try {
    log('\n📦 Installing AB Method files...', COLORS.blue);
    
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

    // Copy all commands
    const commandsDir = path.join(claudeDir, 'commands');
    if (!fs.existsSync(commandsDir)) {
      fs.mkdirSync(commandsDir, { recursive: true });
    }

    // Copy all command files from the package
    const commandsSource = path.join(__dirname, '.claude', 'commands');
    if (fs.existsSync(commandsSource)) {
      copyRecursiveSync(commandsSource, commandsDir);
      log('✅ Installed all AB Method commands', COLORS.green);
      log('   • /ab-master (traditional workflow controller)', COLORS.white);
      log('   • Individual workflow commands: /create-task, /create-mission, etc.', COLORS.white);
    }


    // Create docs/architecture directory
    const docsDir = path.join(targetDir, 'docs', 'architecture');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
      log('✅ Created docs/architecture directory', COLORS.green);
    }

    // Create docs/tasks directory
    const tasksDir = path.join(targetDir, 'docs', 'tasks');
    if (!fs.existsSync(tasksDir)) {
      fs.mkdirSync(tasksDir, { recursive: true });
      log('✅ Created docs/tasks directory', COLORS.green);
    }

    // Install builtin agents if requested
    if (installAgents) {
      log('\n🤖 Installing builtin agents...', COLORS.blue);
      
      try {
        // Copy agents directory
        const agentsSource = path.join(__dirname, '.claude', 'agents');
        const agentsTarget = path.join(claudeDir, 'agents');
        
        if (fs.existsSync(agentsSource)) {
          copyRecursiveSync(agentsSource, agentsTarget);
          log('✅ Builtin agents installed successfully', COLORS.green);
        } else {
          log('⚠️  Agent files not found in package', COLORS.yellow);
          log('   You can install them later by running: /agents', COLORS.white);
        }
      } catch (error) {
        log('⚠️  Could not install builtin agents automatically', COLORS.yellow);
        log('   Error:', error.message, COLORS.red);
        log('   You can install them manually by running: /agents', COLORS.white);
      }
    }

    log('\n✨ AB Method installed successfully!', COLORS.bright + COLORS.green);
    
    if (installAgents) {
      log('\n🎉 Installation complete with builtin agents!', COLORS.green);
    } else {
      log('\n🎉 Installation complete!', COLORS.green);
    }
    
    log('\nNext steps:', COLORS.cyan);
    log('1. Open Claude Code in this project', COLORS.white);
    log('2. Choose your preferred way to start:', COLORS.white);
    log('   • Quick: /create-task, /analyze-project, etc.', COLORS.white);
    log('   • Traditional: /ab-master', COLORS.white);
    log('3. Follow the workflow to create your first task', COLORS.white);
    
    if (installAgents) {
      log('\n🤖 Builtin agents ready to use:', COLORS.cyan);
      log('• Use specialized agents automatically in missions', COLORS.white);
      log('• Check sub-agents-outputs/ folder for detailed agent work', COLORS.white);
    } else {
      log('\n💡 To install builtin agents later:', COLORS.cyan);
      log('• Run: /agents', COLORS.white);
      log('• Or use your own custom agents', COLORS.white);
    }
    
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