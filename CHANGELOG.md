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
