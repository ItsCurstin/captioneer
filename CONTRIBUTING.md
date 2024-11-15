# Contributing to Captioneer

We love your input! We want to make contributing to Captioneer as easy and transparent as possible.

## Development Process

1. Fork the repo and create your branch from `develop`
2. Install dependencies with `pnpm install`
3. Make your changes
4. Add tests for any new functionality
5. Ensure the test suite passes with `pnpm test`
6. Run type checking with `pnpm typecheck`
7. Run linting with `pnpm check`
8. Submit your pull request

## Branching Strategy

Our repository follows this branching model:

### Main Branches

- `main` - Production-ready code
- `develop` - Integration branch for features

### Development Branches

- `feature/*` - New features (e.g., feature/add-language-detection)
- `fix/*` - Bug fixes (e.g., fix/parsing-error)
- `docs/*` - Documentation updates (e.g., docs/api-examples)

### Release Branches

- `release/*` - Version preparation (e.g., release/1.1.0)
- `hotfix/*` - Urgent production fixes (e.g., hotfix/1.0.1)

### Workflow

1. Create feature branches from `develop`
2. Submit pull requests to merge into `develop`
3. Create release branches for version preparation
4. Merge releases into both `main` and `develop`
5. Tag releases on `main` for semantic versioning

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md with your changes
3. Follow the conventional commits specification for commit messages
4. Include relevant test cases
5. The PR will be merged once you have the sign-off of a maintainer

## Code Style

- Use TypeScript
- Follow the existing code style enforced by Biome
- Write meaningful commit messages following conventional commits
- Add tests for new features
- Keep code coverage high

## Running Tests

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## Commit Messages

Follow the conventional commits' specification:

```textmate
# Feature
feat: add new language detection

# Bug fix
fix: resolve parsing error

# Documentation
docs: update API examples
```

## Development Scripts

```bash
# Build the project
pnpm build

# Development mode
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm check
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
