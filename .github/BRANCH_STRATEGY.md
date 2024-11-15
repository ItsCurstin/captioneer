# Branch Strategy Guide

This document provides detailed examples and workflows for contributing to Captioneer using our branching strategy.

## Branch Types

### Main Branches

#### main

- Production-ready code
- Tagged releases
- Direct commits not allowed

```bash
git checkout main
git pull origin main
```

### develop

- Integration branch
- Base for feature development

```bash
git checkout develop
git pull origin develop
```

## Feature Development

### Starting a New Feature

```bash
git checkout develop
git checkout -b feature/language-detection
```

### Working on the Feature

```bash
git add .
git commit -m "feat: implement language detection"
git push origin feature/language-detection
```

### Completing the Feature

```bash
# Update with latest develop changes
git checkout develop
git pull origin develop
git checkout feature/language-detection
git rebase develop

# Push feature
git push origin feature/language-detection
```

## Bug Fixes

### Creating a Bug Fix

```bash
git checkout develop
git checkout -b fix/parsing-error
```

### Implementing the Fix

```bash
git add .
git commit -m "fix: resolve caption parsing error"
git push origin fix/parsing-error
```

## Documentation

### Documentation Updates

```bash
git checkout develop
git checkout -b docs/api-examples
```

## Releases

### Preparing a Release

```bash
git checkout develop
git checkout -b release/1.1.0
```

### Finalizing a Release

```bash
# Merge to main
git checkout main
git merge release/1.1.0
git tag -a v1.1.0 -m "Release 1.1.0"
git push origin main --tags

# Back merge to develop
git checkout develop
git merge release/1.1.0
git push origin develop
```

## Hotfixes
### Creating a Hotfix

```bash
git checkout main
git checkout -b hotfix/1.0.1
```

### Applying a Hotfix

```bash
# Merge to main
git checkout main
git merge hotfix/1.0.1
git tag -a v1.0.1 -m "Hotfix 1.0.1"
git push origin main --tags

# Back merge to develop
git checkout develop
git merge hotfix/1.0.1
git push origin develop
```

## Pull Request Guidelines
1. Create PR from your feature branch to develop 
2. Ensure CI checks pass 
3. Request review from maintainers 
4. Address review feedback 
5. Squash and merge when approved

## Best Practices
1. Keep branches focused and short-lived 
2. Regularly sync with develop 
3. Write clear commit messages 
4. Delete branches after merging 
5. Never force push to main or develop

## Branch Protection Rules
- main: Requires PR and approvals 
- develop: Requires PR and approvals 
- All branches: Must pass CI checks
