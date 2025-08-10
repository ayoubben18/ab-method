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