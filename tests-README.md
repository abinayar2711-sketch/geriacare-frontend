# Testing Guide

## Quick Start

```bash
# Install dependencies (if not already installed)
npm install

# Run all tests
npm test

# Watch mode (auto-run on file changes)
npm test:watch

# Generate coverage report
npm test:coverage
```

## Test Results

**Current Status**: ✅ All passing (45 tests)

```
PASS src/lib/__tests__/actions-utils.test.ts
PASS src/lib/__tests__/crisis.test.ts

Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
```

## What's Tested

### Crisis Detection (24 tests)

The most critical system for safety. Every type of crisis language is tested:

**Elder Abuse** (violence patterns)
- Hitting, hurting, abusing, beating, slapping, pushing
- Different pronouns: my, the, her, his, him, them

**Neglect** (withholding care)
- Neglect terminology
- Bedsores/pressure sores (severe neglect indicator)
- Not feeding, not giving medicine
- Untreated wounds/infections

**Self-Harm** (suicidal ideation)
- Suicide/suicidal terminology
- Death wishes
- Wanting to end life
- Self-harm language

**Edge Cases**
- Empty strings, whitespace
- Case insensitivity
- Context sensitivity (false positives)
- Punctuation handling

**Integration**
- Complex multi-indicator posts
- Real-world scenarios

### Utilities (21 tests)

Helper functions used throughout the app:

**Slug Generation**
- Lowercase conversion
- Special character removal
- Space to hyphen
- Random suffix for uniqueness
- Length truncation

**Name Extraction**
- FormData parsing
- Whitespace trimming
- Length limits
- Null handling

**Status Determination**
- Crisis → `needs_review`
- Normal → `live`
- Empty posts → `live`
- Case insensitivity

## Test Structure

Tests are organized by feature:

```
src/lib/__tests__/
├── crisis.test.ts          # Crisis detection patterns
└── actions-utils.test.ts   # Utility functions (slugify, nameFrom, statusForNewPost)
```

Each test file has multiple `describe()` blocks organizing tests by category.

## Running Specific Tests

```bash
# All tests in a file
npm test -- src/lib/__tests__/crisis.test.ts

# Specific describe block
npm test -- --testNamePattern="Elder abuse"

# Specific test
npm test -- --testNamePattern="detects direct violence"

# Watch mode for specific file
npm test:watch -- src/lib/__tests__/crisis.test.ts
```

## Understanding Test Output

### Passing Test

```
✓ detects direct violence patterns (2 ms)
```

### Failing Test

```
✕ should do something (5 ms)

Expected: true
Received: false

at Object.<anonymous> (src/lib/__tests__/example.test.ts:42:15)
```

Shows:
- What failed
- Expected vs received value
- File and line number

## Test Configuration

### Jest Setup

**File**: `jest.config.ts`

Configures:
- TypeScript support (ts-jest)
- Path aliases (`@/` → `src/`)
- jsdom test environment (for DOM APIs)
- Coverage configuration

**File**: `jest.setup.ts`

Imports:
- Testing library matchers
- Custom test setup

### Running Tests

Added to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Adding New Tests

### Example: Test a crisis pattern

```typescript
describe('Crisis Detection', () => {
  describe('New Pattern Category', () => {
    it('detects pattern text', () => {
      expect(detectCrisis('text with pattern')).toBe(true);
    });
    
    it('does not flag safe text', () => {
      expect(detectCrisis('safe text')).toBe(false);
    });
  });
});
```

### Example: Test a utility function

```typescript
describe('Utility Functions', () => {
  describe('slugify', () => {
    it('handles hyphens', () => {
      const result = slugify('multi-word-title');
      expect(result).toMatch(/^multi-word-title-/);
    });
  });
});
```

### Running New Tests

```bash
# Jest auto-discovers files matching:
# - *.test.ts
# - *.spec.ts
# - __tests__/ directory

npm test  # Automatically runs your new test
```

## Coverage

Generate a coverage report:

```bash
npm test:coverage
```

Creates `coverage/` directory with HTML report.

## Continuous Integration

### Pre-Commit Hook (Optional)

Install husky to run tests before commits:

```bash
npm install husky
npx husky install
npx husky add .husky/pre-commit "npm test"
```

Now tests must pass before you can commit.

### GitHub Actions (Optional)

Add `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
```

## Debugging Tests

### Print debugging

```typescript
it('should do something', () => {
  const result = functionToTest('input');
  console.log('Result:', result);
  expect(result).toBe('expected');
});
```

Run with output:
```bash
npm test -- --no-coverage --verbose
```

### Watch mode debugging

```bash
npm test:watch -- --testNamePattern="should do something"
```

Press `p` to filter by filename
Press `t` to filter by test name

### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

Press F5 to debug.

## Common Issues

### Module not found error

```
Error: Cannot find module '@/lib/crisis'
```

**Solution**: Check path aliases in `jest.config.ts` and `tsconfig.json` match

### Test times out

```
Jest did not exit one second after the test run has completed.
```

**Solution**: Mock async operations, close database connections, clear intervals

### Unexpected token error

```
SyntaxError: Unexpected token 'x'
```

**Solution**: Check ts-jest configuration in jest.config.ts

## Performance

### Test Speed

- Small test suite: ~0.5 seconds
- 45 tests run in: ~0.7 seconds

### Optimization Tips

1. Use `beforeEach()`/`afterEach()` for setup/teardown
2. Mock expensive operations
3. Use focused tests (`describe.only()`, `it.only()`)
4. Run watch mode while developing

## Best Practices

### ✅ Do

- Test happy path and error cases
- Use descriptive test names
- Keep tests focused (one assertion concept)
- Mock external dependencies
- Use `beforeEach()` for common setup

### ❌ Don't

- Test implementation details
- Have flaky tests (random failures)
- Make tests depend on each other
- Over-mock (defeats testing value)
- Skip error case testing

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Jest Cheatsheet](https://jestjs.io/docs/getting-started)
- [Expect Matchers](https://jestjs.io/docs/expect)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## Next Steps

### Current Coverage

✅ Crisis detection (24 tests)
✅ Utility functions (21 tests)
⏳ Authentication flow (planned)
⏳ Moderation system (planned)

### Recommended Additions

1. **Authentication Tests**: nextAuth flow, role checking
2. **Moderation Tests**: flag system, auto-hide logic
3. **Integration Tests**: form submission → database
4. **E2E Tests**: user workflows from UI perspective

## Questions?

See TESTING_AND_DOCS.md for complete guide, or check test files for examples.
