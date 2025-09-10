# Analyze Backend

## Description
Analyze backend services and APIs to understand server-side architecture, database patterns, and service structure.

## Usage
```
/analyze-backend
```

## Behavior
Loads and executes the analyze-backend workflow from `.ab-method/core/analyze-backend.md`

This workflow will:
1. Analyze backend API architecture and endpoint structure
2. Document database patterns and data models
3. Understand service layers and business logic organization
4. Identify authentication and authorization patterns
5. Document external service integrations

## Workflow Details
The analyze-backend workflow examines:
- **API Architecture** - Understanding endpoint structure and API patterns
- **Database Design** - Documenting data models and database patterns
- **Service Layers** - Understanding business logic and service organization
- **Authentication** - Documenting security and auth patterns
- **External Integrations** - Cataloging third-party service connections

## Examples
```
/analyze-backend
# Analyzes backend API architecture and service patterns
# Documents database models, authentication, and integrations
# Creates backend-specific technical documentation
```

## Alternative Usage
You can also use the traditional AB Method master controller:
```
/ab-master analyze-backend
```