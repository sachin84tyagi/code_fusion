Welcome to **Chapter 4 — GitHub Actions**.

> **GitHub Actions is the most popular CI/CD platform today. It is built directly into GitHub, free for public repos, and used by millions of developers worldwide.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you have a robot assistant at home.

You leave instructions for the robot:

```
📋 Robot Instructions

When I leave for work:
  Step 1: Lock the door
  Step 2: Water the plants
  Step 3: Turn off the lights

When I come home:
  Step 1: Turn on AC
  Step 2: Play music
```

GitHub Actions is that robot.

You leave instructions in a YAML file.

The robot (GitHub's servers) runs them automatically.

When you push code → robot runs your instructions.

---

# What is GitHub Actions?

**GitHub Actions** is a CI/CD platform built directly into GitHub.

```
✅ No separate tool needed
✅ Free for public repos
✅ 2,000 free minutes/month for private repos
✅ Runs in the cloud (GitHub's servers)
✅ Massive marketplace of pre-built actions
✅ Runs on Linux, Windows, Mac
```

You define workflows in YAML files.

GitHub runs them automatically.

---

# Where Do Workflow Files Live?

```
your-repo/
├── .github/
│   └── workflows/
│       ├── ci.yml          ← CI pipeline
│       ├── cd.yml          ← CD pipeline
│       └── release.yml     ← Release pipeline
├── src/
├── package.json
└── ...
```

Every `.yml` file in `.github/workflows/` is a separate workflow.

---

# Your First GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml

name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build
```

Push this file to GitHub.

Every push to `main` or `develop` → this pipeline runs automatically.

---

# GitHub Actions Marketplace

Thousands of pre-built actions available.

```
actions/checkout@v4      → Clone your repo
actions/setup-node@v4    → Install Node.js
actions/setup-java@v4    → Install Java
actions/setup-python@v4  → Install Python
actions/cache@v4         → Cache dependencies
actions/upload-artifact  → Save build output
docker/build-push-action → Build & push Docker image
aws-actions/amazon-ecr-login → Login to ECR
```

Use them with `uses:`:

```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: '18'
```

---

# Complete Node.js CI Pipeline

```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js 18
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Build for production
        run: npm run build

      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
```

---

# Complete Java CI Pipeline

```yaml
name: Java CI

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Cache Maven packages
        uses: actions/cache@v4
        with:
          path: ~/.m2
          key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}

      - name: Build with Maven
        run: mvn clean install

      - name: Run tests
        run: mvn test

      - name: Upload JAR artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-jar
          path: target/*.jar
```

---

# Complete Python CI Pipeline

```yaml
name: Python CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest pytest-cov flake8

      - name: Lint with flake8
        run: flake8 . --count --max-line-length=127

      - name: Run tests with coverage
        run: pytest --cov=./ --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          file: coverage.xml
```

---

# Viewing Pipeline Results

Go to your GitHub repository.

Click **Actions** tab.

```
✅ Green checkmark  → Pipeline passed
❌ Red X            → Pipeline failed
🟡 Yellow circle    → Pipeline running
```

Click on a run to see:

```
Each job → Each step → Logs
```

Failed step shows the exact error.

---

# Company Example — CRED

CRED uses GitHub Actions for all microservices:

```yaml
name: CRED API CI/CD

on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run tests
        run: npm test

      - name: Build Docker image
        run: docker build -t cred-api:${{ github.sha }} .

      - name: Deploy to production
        run: |
          aws ecs update-service \
            --cluster production \
            --service cred-api \
            --force-new-deployment
```

Every PR is tested.

Every merge to main deploys to production automatically.

---

# Interview Questions

## Q1. What is GitHub Actions?

**Best Answer**

> GitHub Actions is a CI/CD platform built directly into GitHub. It lets you automate workflows using YAML files stored in `.github/workflows/`. Workflows trigger on events like pushes, pull requests, or schedules, and run on GitHub-hosted or self-hosted runners. It's free for public repos and has a massive marketplace of reusable actions.

---

## Q2. Where do GitHub Actions workflow files live?

In the `.github/workflows/` directory at the root of the repository. Each `.yml` file is a separate workflow.

---

## Q3. What is a GitHub Action vs a workflow?

A workflow is the entire YAML file that defines the automation. An "Action" is a reusable unit of work (like `actions/checkout@v4`) from the GitHub Marketplace that can be used as a step inside a workflow.

---

## Q4. What is `actions/checkout@v4`?

An official GitHub Action that clones your repository's code onto the runner machine. It is almost always the first step in any workflow — without it, the runner has no code to work with.

---

# Professional Summary

```
GitHub Actions Setup:

1. Create .github/workflows/ci.yml

2. Define trigger:
   on:
     push:
       branches: [main]

3. Define job:
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - run: npm ci
         - run: npm test

4. Push to GitHub → watch it run under Actions tab

Free for public repos
Marketplace: thousands of ready actions
```
