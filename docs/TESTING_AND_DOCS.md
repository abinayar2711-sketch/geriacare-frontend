# Testing & Documentation Guide

## Test Coverage

### Test Suites

Two comprehensive test suites cover core functionality:

#### 1. Crisis Detection Tests (`src/lib/__tests__/crisis.test.ts`)
- **24 test cases** covering all crisis language patterns
- **Categories**: Elder abuse, neglect, self-harm, edge cases
- **Coverage**: Helpline validation, pattern matching, false positives
- **Status**: ✅ All passing

**Run**:
```bash
npm test -- src/lib/__tests__/crisis.test.ts
```

**Key Tests**:
- Elder abuse indicators (hitting, hurting, beating, etc.)
- Neglect patterns (bedsores, not feeding, untreated wounds)
- Self-harm language (suicide, death wishes, self-harm)
- Edge cases (empty strings, punctuation, context)
- Integration scenarios (complex multi-indicator posts)

#### 2. Utility Functions Tests (`src/lib/__tests__/actions-utils.test.ts`)
- **21 test cases** for utility functions
- **Coverage**: `slugify()`, `nameFrom()`, `statusForNewPost()`
- **Status**: ✅ All passing

**Run**:
```bash
npm test -- src/lib/__tests__/actions-utils.test.ts
```

**Key Tests**:
- Slug generation (uniqueness, special chars, truncation)
- Name extraction (whitespace, length limits)
- Post status determination (crisis detection integration)

### Total Test Statistics

- **Total Tests**: 45
- **Total Suites**: 2
- **Pass Rate**: 100%
- **Coverage Areas**: Crisis detection, utility functions, helpers

### Running Tests

```bash
# Run all tests
npm test

# Run single suite
npm test -- src/lib/__tests__/crisis.test.ts

# Watch mode (auto-rerun on changes)
npm test:watch

# Coverage report
npm test:coverage
```

## Documentation Overview

Complete documentation for developers, moderators, and operations:

### 1. CRISIS_DETECTION.md
**For**: Moderators, developers, crisis response handlers

**Contents**:
- How crisis detection works
- All 3 crisis categories (abuse, neglect, self-harm)
- Example scenarios (flagged vs. not flagged)
- Known limitations and edge cases
- Moderator workflow for crisis posts
- Helpline resources
- Testing information
- Future improvements

**Read this to**:
- Understand what triggers crisis review
- Learn moderator crisis workflow
- Know the system's limitations
- Add new crisis patterns

### 2. MODERATION.md
**For**: Moderators, community managers, operations

**Contents**:
- User roles and post statuses
- Flagging system mechanics
- Step-by-step moderation workflow
- Content guidelines (what to publish/hide)
- Special workflows (new accounts, expert promotion, escalation)
- Moderator dashboard features
- Escalation decision tree
- Best practices and anti-patterns
- Common FAQs

**Read this to**:
- Learn how to moderate content
- Understand the review queue
- Know when to escalate
- Make consistent decisions
- Manage users and roles

### 3. SERVER_ACTIONS.md
**For**: Developers, API consumers

**Contents**:
- Overview of all server actions
- Public actions (questions, answers, voting, flagging)
- Expert-only actions (articles, endorsements)
- Moderator-only actions (moderation, user management)
- Parameter documentation
- Error handling patterns
- Return values and side effects
- Database interactions
- Cache invalidation
- Performance considerations
- Security practices

**Read this to**:
- Understand available server actions
- Know what parameters are required
- Learn error handling
- Integrate with forms
- Extend functionality

### 4. DATABASE_SCHEMA.md
**For**: Developers, database administrators, architects

**Contents**:
- All database enumerations
- Complete table descriptions
- Field-by-field documentation
- Relationships and cascade behavior
- Indexing strategy
- Query patterns and examples
- Backup & recovery
- Data integrity constraints
- Migration process

**Read this to**:
- Understand the data model
- Write efficient queries
- Add new fields
- Debug data issues
- Plan schema migrations

## Documentation Location

All documentation files are in the `/docs` directory:

```
docs/
├── CRISIS_DETECTION.md      (Crisis language, patterns, response)
├── MODERATION.md            (Moderation workflow, guidelines)
├── SERVER_ACTIONS.md        (API reference, action details)
└── DATABASE_SCHEMA.md       (Data model, tables, queries)
```

## Quick Start by Role

### I'm a Moderator
Start with: **MODERATION.md** → **CRISIS_DETECTION.md**

Key sections:
- Moderation workflow (step-by-step)
- Crisis escalation decision tree
- User management & role assignment

### I'm a Developer
Start with: **SERVER_ACTIONS.md** → **DATABASE_SCHEMA.md**

Key sections:
- Public actions reference
- Database schema & relationships
- Query patterns & examples

### I'm Updating Crisis Detection
Start with: **CRISIS_DETECTION.md**

Key sections:
- Crisis language categories
- Testing (24 test cases)
- Adding new patterns

### I'm Designing Features
Start with: **DATABASE_SCHEMA.md** → **SERVER_ACTIONS.md**

Key sections:
- Data relationships
- Action parameters & return values

## Test-Driven Updates

When making changes:

1. **Crisis Detection Changes**:
   ```bash
   npm test -- src/lib/__tests__/crisis.test.ts
   # Verify patterns still work
   # Add new test cases for new patterns
   ```

2. **Utility Function Changes**:
   ```bash
   npm test -- src/lib/__tests__/actions-utils.test.ts
   # Verify slugify, nameFrom still work
   # Add tests for new utilities
   ```

3. **Run Full Suite**:
   ```bash
   npm test
   # All 45 tests should pass
   ```

## Adding New Tests

### Test Structure

```typescript
describe('Feature Name', () => {
  describe('Sub-feature', () => {
    it('should do something', () => {
      expect(actual).toBe(expected);
    });
  });
});
```

### Crisis Pattern Test

```typescript
it('detects [pattern name]', () => {
  expect(detectCrisis('text with pattern')).toBe(true);
  expect(detectCrisis('text without pattern')).toBe(false);
});
```

### Utility Test

```typescript
it('handles [edge case]', () => {
  const input = '...';
  const result = functionName(input);
  expect(result).toMatch(/pattern/);
});
```

## CI/CD Integration

Tests should run:

1. **Before Commits**: `npm test` (pre-commit hook recommended)
2. **On PR**: Automated test suite in GitHub Actions
3. **Before Deploy**: Production deployment blocks on test failures

**Setup**:
```bash
# Install husky for pre-commit hooks
npm install husky
npx husky install
npx husky add .husky/pre-commit "npm test"
```

## Maintenance

### Monthly Checklist

- [ ] Review test coverage
- [ ] Update crisis patterns if needed
- [ ] Check for false positives (moderator feedback)
- [ ] Audit documentation accuracy
- [ ] Review and update examples

### Quarterly

- [ ] Security audit of crisis detection
- [ ] Performance analysis of queries
- [ ] Moderator workflow improvements
- [ ] Documentation improvements

## Common Issues

**Q: Test fails for crisis pattern**
A: Check that the exact text matches the regex pattern. Patterns require specific pronouns/context. See crisis.test.ts examples.

**Q: Status is 'live' but I expected 'needs_review'**
A: Check if crisis language was detected. Use `detectCrisis(text)` to verify.

**Q: Can't find a specific moderator action**
A: Check SERVER_ACTIONS.md "Moderator-Only Actions" section and DATABASE_SCHEMA.md for the data model.

**Q: Which action do I call for X?**
A: Search SERVER_ACTIONS.md for the action name or use Ctrl+F for keywords.

## Related Files

**Source Code**:
- `src/lib/crisis.ts` - Crisis detection logic
- `src/lib/utils.ts` - Utility functions (slugify, nameFrom, statusForNewPost)
- `src/lib/actions.ts` - All server actions
- `src/db/schema.ts` - Database schema

**Testing**:
- `jest.config.ts` - Jest configuration
- `jest.setup.ts` - Test environment setup
- `src/lib/__tests__/` - Test files

**Configuration**:
- `package.json` - Test scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Questions?

- **Testing Issues**: Check test files and Jest documentation
- **Moderation Questions**: See MODERATION.md or contact team
- **API Questions**: See SERVER_ACTIONS.md and source code comments
- **Data Model**: See DATABASE_SCHEMA.md

## Summary

✅ **45 tests** covering crisis detection and utilities
📚 **4 documentation files** covering all major systems
🎯 **100% pass rate** with clear examples and patterns
🚀 **Production-ready** with security and performance best practices
