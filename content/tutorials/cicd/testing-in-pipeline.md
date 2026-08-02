Welcome to **Chapter 12 — Testing in Pipeline**.

> **A CI/CD pipeline without tests is just automated deployment of broken code. Testing in the pipeline is what makes CI/CD safe. Learn to run every type of test automatically.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a car factory.

Before a car leaves the factory, it is tested:

```
✅ Engine test        (Unit test)
✅ Parts fit check    (Integration test)
✅ Full car test run  (End-to-end test)
✅ Safety check       (Security scan)
✅ Emissions test     (Performance test)

Car fails any test → goes back for repair
Car passes all → delivered to customer
```

CI/CD is the factory.

Tests are the quality checkpoints.

---

# The Testing Pyramid

```
              ┌──────┐
              │  E2E │  ← Few, slow, expensive
             ┌┴──────┴┐
             │ Integr.│  ← Some, medium speed
            ┌┴────────┴┐
            │  Unit    │  ← Many, fast, cheap
            └──────────┘
```

In CI/CD:

```
Unit tests        → Run on EVERY push (fast)
Integration tests → Run on every push (medium)
E2E tests         → Run on PR merge / staging deploy (slow)
```

---

# Unit Tests in Pipeline

Run on every single push.

Fast. Isolated.

**Node.js (Jest):**

```yaml
- name: Run unit tests
  run: npm test -- --coverage --ci
  env:
    CI: true
```

**Python (pytest):**

```yaml
- name: Run tests with pytest
  run: pytest tests/unit/ -v --cov=src --cov-report=xml

- name: Upload coverage
  uses: codecov/codecov-action@v4
```

**Java (JUnit with Maven):**

```yaml
- name: Run tests with Maven
  run: mvn test

- name: Publish test results
  uses: mikepenz/action-junit-report@v4
  with:
    report_paths: '**/target/surefire-reports/TEST-*.xml'
```

---

# Integration Tests in Pipeline

Test multiple components together.

Need services like databases.

Use service containers:

```yaml
jobs:
  integration-test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 5s
          --health-timeout 3s
          --health-retries 5

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - run: npm ci

      - name: Run integration tests
        run: npm run test:integration
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_NAME: testdb
          DB_PASS: testpass
          REDIS_URL: redis://localhost:6379
```

---

# End-to-End (E2E) Tests

Test the full application like a real user.

Tools: Playwright, Cypress, Selenium.

**Playwright in CI:**

```yaml
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Start app
        run: npm run start &     # Run app in background
        env:
          PORT: 3000

      - name: Wait for app to start
        run: npx wait-on http://localhost:3000

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

# Code Coverage

Measure what percentage of code is tested.

```yaml
- name: Run tests with coverage
  run: npm test -- --coverage

- name: Check coverage threshold
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "Coverage $COVERAGE% is below 80% threshold"
      exit 1
    fi

- name: Upload to Codecov
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    file: coverage/lcov.info
```

---

# Linting and Code Quality

```yaml
steps:
  # JavaScript/TypeScript
  - name: ESLint
    run: npx eslint . --ext .js,.ts,.tsx

  # Python
  - name: Flake8
    run: flake8 . --max-line-length 127

  # Java
  - name: Checkstyle
    run: mvn checkstyle:check

  # Go
  - name: golangci-lint
    uses: golangci/golangci-lint-action@v3
```

---

# Security Scanning

Find vulnerabilities before deploying.

**Dependency scanning (npm audit):**

```yaml
- name: Check for vulnerabilities
  run: npm audit --audit-level=high
```

**SAST — Static Application Security Testing (CodeQL):**

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v3
  with:
    languages: javascript, python

- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v3
```

**Container scanning:**

```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: myapp:${{ github.sha }}
    format: sarif
    exit-code: 1
    severity: CRITICAL,HIGH
```

**Secret scanning:**

```yaml
- name: Scan for hardcoded secrets
  uses: trufflesecurity/trufflehog@main
  with:
    path: ./
    base: ${{ github.event.repository.default_branch }}
```

---

# Complete Testing Pipeline

```yaml
name: Full Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18', cache: 'npm' }
      - run: npm ci
      - run: npm run lint

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18', cache: 'npm' }
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v4

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env: { POSTGRES_PASSWORD: test }
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18', cache: 'npm' }
      - run: npm ci
      - run: npm run test:integration
        env:
          DB_HOST: localhost
          DB_PASSWORD: test

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - uses: github/codeql-action/init@v3
        with: { languages: javascript }
      - uses: github/codeql-action/analyze@v3

  e2e-tests:
    needs: [lint, unit-tests, integration-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm start &
      - run: npx wait-on http://localhost:3000
      - run: npx playwright test

  all-tests-passed:
    needs: [lint, unit-tests, integration-tests, security-scan, e2e-tests]
    runs-on: ubuntu-latest
    steps:
      - run: echo "✅ All tests passed! Ready to deploy."
```

---

# Company Example — Meesho

Meesho's testing pipeline:

```
PR opened:
  → Lint check (30 sec)
  → Unit tests — 1500 tests (2 min)
  → Integration tests (3 min)
  → Security scan (1 min)
  → Coverage check (must be > 85%)

Total CI time: 7 minutes

PR merged to main:
  → All above +
  → E2E tests on staging (15 min)
  → Performance tests (5 min)
  → Deploy to production if all pass
```

Zero bugs reach production.

---

# Interview Questions

## Q1. What types of tests run in a CI/CD pipeline?

**Best Answer**

> Unit tests (fast, isolated, run on every push), integration tests (test components together, use service containers for databases), end-to-end tests (full user flow, Playwright/Cypress, run on PRs or staging), security scans (CodeQL, Trivy, npm audit), linting (code style), and code coverage checks.

---

## Q2. What is the testing pyramid and how does it apply to CI/CD?

The testing pyramid says: many unit tests (fast), some integration tests (medium), few E2E tests (slow). In CI/CD, unit tests run on every push, integration tests on every PR, and E2E tests only on staging deployments, to balance speed with coverage.

---

## Q3. How do you test against a database in GitHub Actions?

Use service containers. Define the database under `services:` in the job. GitHub starts the container before your steps run. Connect using `localhost` and the mapped port.

---

## Q4. What is SAST?

Static Application Security Testing — analyzing source code (without running it) for security vulnerabilities. GitHub's CodeQL is a popular SAST tool that integrates directly into GitHub Actions.

---

# Professional Summary

```
Testing in Pipeline:

Unit tests:           npm test / pytest / mvn test
Integration tests:    service containers for DB/Redis
E2E tests:            Playwright / Cypress
Linting:              eslint / flake8 / checkstyle
Security scan:        npm audit / CodeQL / Trivy
Coverage:             > 80% threshold enforced

Pipeline order:
  lint → unit → integration → security → E2E → deploy

Key principle:
  Fast tests first → catch failures quickly
  Expensive tests last → only when needed
```
