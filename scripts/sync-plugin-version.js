#!/usr/bin/env node

// Runs as the npm `version` lifecycle script, which @semantic-release/npm
// triggers on every release. Codex uses the plugin version as its cache
// directory name, so a version that never moves means Codex users never
// receive an update. The Claude Code manifest deliberately has no version:
// there it acts as a pin, and omitting it makes the commit SHA the version.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const { version } = require(path.join(root, 'package.json'));
const manifestPath = path.join(root, '.codex-plugin', 'plugin.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.version = version;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

console.log(`.codex-plugin/plugin.json → ${version}`);
