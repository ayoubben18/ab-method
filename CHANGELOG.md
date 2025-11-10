# [2.3.0](https://github.com/ayoubben18/ab-method/compare/v2.2.2...v2.3.0) (2025-11-10)


### Features

* add extend-task command to add missions to existing tasks ([1ae31e9](https://github.com/ayoubben18/ab-method/commit/1ae31e984e2cb7be0d0793b3dfebe5e9ae70fae2))

## [2.2.2](https://github.com/ayoubben18/ab-method/compare/v2.2.1...v2.2.2) (2025-09-27)


### Bug Fixes

* improve workflow simplicity and efficiency to prevent over-complication ([ffad449](https://github.com/ayoubben18/ab-method/commit/ffad44946f22c4456f8011ffb86de26086f2192c))

## [2.2.1](https://github.com/ayoubben18/ab-method/compare/v2.2.0...v2.2.1) (2025-09-10)


### Bug Fixes

* CLI installer now includes all individual slash commands and updated README ([aa23823](https://github.com/ayoubben18/ab-method/commit/aa23823f0c70c9cdfb059a2bea552a9a18dea92a))

# [2.2.0](https://github.com/ayoubben18/ab-method/compare/v2.1.3...v2.2.0) (2025-09-10)


### Features

* add individual slash commands for all AB Method workflows ([97ed95b](https://github.com/ayoubben18/ab-method/commit/97ed95b08c57ec25d7c290b7b2ec3b2f221e6970))

## [2.1.3](https://github.com/ayoubben18/ab-method/compare/v2.1.2...v2.1.3) (2025-08-17)


### Bug Fixes

* improve task creation workflow to prevent over-splitting of simple tasks ([c7e78a7](https://github.com/ayoubben18/ab-method/commit/c7e78a70e4177f8fa65e8d47bd81e43bfc2bad34))

## [2.1.2](https://github.com/ayoubben18/ab-method/compare/v2.1.1...v2.1.2) (2025-08-17)


### Bug Fixes

* properly copy agent files during CLI installation instead of running non-existent command ([c4acd43](https://github.com/ayoubben18/ab-method/commit/c4acd4324077bac3ebf75952e3b408bbf59c0b40))

## [2.1.1](https://github.com/ayoubben18/ab-method/compare/v2.1.0...v2.1.1) (2025-08-17)


### Bug Fixes

* add missing @semantic-release/npm plugin and sync version to 2.1.0 ([d49ed62](https://github.com/ayoubben18/ab-method/commit/d49ed62caa95cfd04cb7c6bca64e77748f49dbbc))
* add NPM_TOKEN to GitHub Actions workflow for npm publishing ([4af9d04](https://github.com/ayoubben18/ab-method/commit/4af9d04757e1274403c9106073333c7d794b0a10))

# [2.1.0](https://github.com/ayoubben18/ab-method/compare/v2.0.0...v2.1.0) (2025-08-17)


### Features

* add intelligent subagent integration and interactive mission clarification ([8817495](https://github.com/ayoubben18/ab-method/commit/88174952a4862d21303103616ad0d9f7f959af94))

# [2.0.0](https://github.com/ayoubben18/ab-method/compare/v1.1.3...v2.0.0) (2025-08-14)


### Features

* add dedicated test-mission workflow and testing-strategy documentation ([cc8df1c](https://github.com/ayoubben18/ab-method/commit/cc8df1cbc4795029864692bceca844cc7fc659a8))


### BREAKING CHANGES

* Testing is now a separate mission workflow instead of being part of implementation missions

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>

## [1.1.3](https://github.com/ayoubben18/ab-method/compare/v1.1.2...v1.1.3) (2025-08-11)


### Bug Fixes

* create-task now analyzes project context before creating missions ([0857b1a](https://github.com/ayoubben18/ab-method/commit/0857b1a5b49b7b36316b0b1b91d4f565ba4df295))

## [1.1.2](https://github.com/ayoubben18/ab-method/compare/v1.1.1...v1.1.2) (2025-08-10)


### Bug Fixes

* create-mission now properly loads utils files before creating missions ([6d84217](https://github.com/ayoubben18/ab-method/commit/6d8421775fb70d83d4c7411ca8896ad526b96083))

## [1.1.1](https://github.com/ayoubben18/ab-method/compare/v1.1.0...v1.1.1) (2025-08-10)


### Bug Fixes

* analyze-project now creates all 6 architecture files and tasks in docs/tasks ([cfbdd0d](https://github.com/ayoubben18/ab-method/commit/cfbdd0d6284a589a500aeb6e3fadb794d77cbde5))

# [1.1.0](https://github.com/ayoubben18/ab-method/compare/v1.0.0...v1.1.0) (2025-08-10)


### Features

* add npm package with CLI installer for easy setup ([838dbc1](https://github.com/ayoubben18/ab-method/commit/838dbc160d61f0e3ea009c125d0cf227b181085b))

# 1.0.0 (2025-08-10)


### Bug Fixes

* add package-lock.json for GitHub Actions ([5714b48](https://github.com/ayoubben18/ab-method/commit/5714b48b1397ae11e5a7df3fd21b108973b0b138))
* remove npm publishing configuration ([bc2d806](https://github.com/ayoubben18/ab-method/commit/bc2d806b1d58c646c2347bbe37fe59fec91909da))
* update repository URL in package.json ([45e40d8](https://github.com/ayoubben18/ab-method/commit/45e40d8ee1c07fb0a3bd2ccc00bc89478d4f9ecb))


### Features

* first boilerplate ([c733974](https://github.com/ayoubben18/ab-method/commit/c7339740d222751b8f7d3c8854dd608b92b3132e))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-10

### ✨ Features
- Initial release of the AB Method for Claude Code
- Core workflow system with 8 specialized workflows
- Task and mission management with incremental approach
- Architecture analysis and documentation generation
- Specialized subagent coordination for backend and frontend
- Progress tracking and resumption capabilities
- Configurable structure via index.yaml
- `/ab-master` slash command as single entry point

### 📚 Documentation
- Comprehensive README with usage examples
- Detailed workflow documentation for all core files
- Utility files documentation for mission coordination
- Architecture documentation templates

### 🏗️ Structure
- Core workflows: analyze-project, create-task, resume-task, create-mission, resume-mission
- Architecture workflows: analyze-frontend, analyze-backend, update-architecture
- Utils: backend-mission, frontend-mission, planning-mission
- Configuration: structure/index.yaml

### 🎯 Key Principles
- One task at a time for focused development
- Backend-first approach for full-stack projects
- Validation checkpoints before implementation
- Incremental mission building
- Continuous architecture documentation
