# Contributing to Shoppy Sensay

Thank you for your interest in contributing to Shoppy Sensay! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature or bugfix
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sensay-shop.git
   cd sensay-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development servers**
   ```bash
   # Backend
   npm run dev
   
   # Frontend (in another terminal)
   cd frontend && npm run dev
   ```

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-new-feature`
- `bugfix/fix-issue-name`
- `hotfix/critical-fix`
- `docs/update-readme`

### Commit Messages

Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(chat): add message history persistence
fix(auth): resolve JWT token expiration issue
docs(api): update endpoint documentation
```

## Pull Request Process

### Before Submitting

1. **Test your changes**
   ```bash
   npm test
   cd frontend && npm test
   ```

2. **Check code quality**
   ```bash
   npm run lint
   cd frontend && npm run lint
   ```

3. **Build the project**
   ```bash
   npm run build
   cd frontend && npm run build
   ```

### PR Guidelines

1. **Title**: Use clear, descriptive title
2. **Description**: Explain what changes you made and why
3. **Screenshots**: Include screenshots for UI changes
4. **Testing**: Describe how you tested your changes
5. **Breaking Changes**: Note any breaking changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Issue Guidelines

### Bug Reports

When reporting bugs, include:
- **Environment**: OS, Node.js version, browser
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Error Messages**: Full error logs

### Feature Requests

When requesting features, include:
- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other solutions considered
- **Additional Context**: Any other relevant information

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper types for all functions and variables
- Use interfaces for object shapes
- Avoid `any` type

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement proper error boundaries

### Node.js/Express

- Use async/await for asynchronous operations
- Implement proper error handling
- Use middleware for cross-cutting concerns
- Follow RESTful API design

### Code Style

- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Write self-documenting code
- Add comments for complex logic

## Testing

### Unit Tests

Write unit tests for:
- Utility functions
- Service methods
- Component logic
- API endpoints

### Integration Tests

Write integration tests for:
- API workflows
- Database operations
- External service integrations

### Test Structure

```typescript
describe('Component/Function Name', () => {
  describe('when condition', () => {
    it('should expected behavior', () => {
      // Test implementation
    });
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex algorithms
- Explain business logic
- Update README for new features

### API Documentation

- Document new endpoints
- Include request/response examples
- Update API documentation
- Add error response codes

## Release Process

1. **Version Bumping**: Update version in package.json
2. **Changelog**: Update CHANGELOG.md
3. **Tagging**: Create git tag for release
4. **Deployment**: Deploy to production

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Discord**: For real-time chat (if available)
- **Email**: For private matters

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Shoppy Sensay! 🎉
