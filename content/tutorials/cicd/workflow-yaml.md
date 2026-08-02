Welcome to **Chapter 5 — Workflow YAML**.

> **The YAML file IS the pipeline. Every keyword, indentation, and value matters. Master the YAML syntax and you master GitHub Actions.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine writing instructions for a friend to cook pasta.

```
Instructions:

  name: Cook Pasta

  when: whenever I text you

  steps:
    - Boil water
    - Add pasta
    - Wait 10 minutes
    - Drain water
    - Add sauce
    - Serve
```

A GitHub Actions YAML file is exactly this.

Name your pipeline.

Say when to run it.

List the steps.

---

# Anatomy of a Workflow YAML

```yaml
name: My Pipeline               # (1) Name shown in GitHub UI

on:                             # (2) Triggers
  push:
    branches: [main]

env:                            # (3) Global environment variables
  NODE_VERSION: '18'
  APP_NAME: my-app

jobs:                           # (4) Jobs (run in parallel by default)

  test:                         # (5) Job ID
    name: Run Tests             # Display name
    runs-on: ubuntu-latest      # (6) Runner machine

    steps:                      # (7) Steps (run sequentially)

      - name: Checkout code     # Step name
        uses: actions/checkout@v4  # (8) Use a pre-built action

      - name: Install Node
        uses: actions/setup-node@v4
        with:                   # (9) Input parameters for the action
          node-version: ${{ env.NODE_VERSION }}

      - name: Install packages
        run: npm ci             # (10) Run a shell command

      - name: Run tests
        run: npm test
        env:                    # (11) Step-level env vars
          CI: true
```

---

# Top-Level Keys

```yaml
name:        # Workflow name displayed in GitHub UI
on:          # What triggers this workflow
env:         # Environment variables available to all jobs
jobs:        # Map of jobs to run
permissions: # GitHub token permissions
defaults:    # Default settings (e.g., working-directory)
```

---

# The `on:` Section — Triggers

```yaml
on:
  # Single event
  push:

  # Multiple events
  push:
    branches: [main, develop]
    paths:
      - 'src/**'          # Only trigger when src/ changes
      - '**.js'           # Only trigger on JS file changes

  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]

  schedule:
    - cron: '0 2 * * *'  # Every day at 2 AM

  workflow_dispatch:      # Manual trigger button in GitHub UI
    inputs:
      environment:
        description: 'Deploy environment'
        required: true
        default: 'staging'
        type: choice
        options: [staging, production]

  workflow_call:          # Triggered by another workflow
```

---

# The `jobs:` Section

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint             # Wait for lint job to finish first
    steps:
      - run: npm test

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]    # Wait for BOTH to finish
    steps:
      - run: npm run build

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'   # Only on main branch
    steps:
      - run: ./deploy.sh
```

---

# `runs-on:` Options

```yaml
runs-on: ubuntu-latest      # Ubuntu Linux (most common)
runs-on: ubuntu-22.04       # Specific Ubuntu version
runs-on: windows-latest     # Windows Server
runs-on: macos-latest       # macOS
runs-on: self-hosted        # Your own server
```

---

# `steps:` — uses vs run

**uses** — calls a pre-built action:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: '18'
```

**run** — runs shell commands:

```yaml
steps:
  - run: npm ci
  - run: npm test
  - run: |
      echo "Multiple"
      echo "commands"
      npm run build
```

---

# Context Variables

GitHub provides built-in variables accessible with `${{ }}`:

```yaml
${{ github.sha }}          # Git commit SHA (e.g., abc1234)
${{ github.ref }}          # Branch/tag ref (refs/heads/main)
${{ github.ref_name }}     # Branch name (main)
${{ github.actor }}        # User who triggered the run
${{ github.repository }}   # repo owner/name (org/myapp)
${{ github.event_name }}   # push, pull_request, etc.
${{ runner.os }}           # Linux, Windows, macOS
${{ env.MY_VAR }}          # Access env variable
${{ secrets.MY_SECRET }}   # Access secret
${{ job.status }}          # success, failure, cancelled
```

---

# `if:` Conditions

Control when steps/jobs run:

```yaml
# Only run deploy on main branch
- name: Deploy
  if: github.ref == 'refs/heads/main'
  run: ./deploy.sh

# Only run on push (not PR)
- name: Push image
  if: github.event_name == 'push'
  run: docker push myapp

# Only run if previous step passed
- name: Notify success
  if: success()
  run: echo "✅ Pipeline succeeded"

# Always run (even if previous steps failed)
- name: Cleanup
  if: always()
  run: ./cleanup.sh

# Run on failure
- name: Notify failure
  if: failure()
  run: curl -X POST $SLACK_WEBHOOK -d '{"text":"❌ Pipeline failed"}'
```

---

# Matrix Strategy — Test Multiple Versions

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
        os: [ubuntu-latest, windows-latest]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

This runs 6 parallel jobs:

```
Node 16 / Ubuntu
Node 16 / Windows
Node 18 / Ubuntu
Node 18 / Windows
Node 20 / Ubuntu
Node 20 / Windows
```

---

# Outputs Between Jobs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.tag.outputs.tag }}

    steps:
      - name: Generate tag
        id: tag
        run: echo "tag=${{ github.sha }}" >> $GITHUB_OUTPUT

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: |
          echo "Deploying image: ${{ needs.build.outputs.image-tag }}"
          kubectl set image deployment/app app=myimage:${{ needs.build.outputs.image-tag }}
```

---

# Interview Questions

## Q1. What is the structure of a GitHub Actions YAML file?

**Best Answer**

> A workflow YAML has four main sections: `name` (display name), `on` (trigger events), `env` (global variables), and `jobs` (the work to do). Each job has `runs-on` (the machine type), and a list of `steps`. Steps use either `uses` (to call a marketplace action) or `run` (to execute shell commands).

---

## Q2. What is a matrix strategy?

A matrix strategy lets you run the same job multiple times with different values (like different Node.js versions or operating systems). GitHub runs all combinations in parallel, giving you broad test coverage efficiently.

---

## Q3. What is `${{ github.sha }}` used for?

It provides the full Git commit SHA of the current commit. Commonly used as a unique Docker image tag — so each build has a unique, traceable identifier that links back to the exact commit.

---

## Q4. What does `needs:` do in a job?

`needs` creates a dependency between jobs. A job with `needs: [test, lint]` will only start after both `test` and `lint` jobs complete successfully. Without `needs`, all jobs run in parallel.

---

# Professional Summary

```
YAML Structure:
  name:    → display name
  on:      → triggers (push, PR, schedule, manual)
  env:     → global environment variables
  jobs:    → parallel or sequential jobs
    job-id:
      runs-on:  → ubuntu-latest / windows / macos
      needs:    → dependency on other jobs
      if:       → conditional execution
      steps:    → sequential steps
        - uses: → marketplace action
        - run:  → shell command

Key contexts:
  ${{ github.sha }}
  ${{ github.ref_name }}
  ${{ secrets.MY_SECRET }}
  ${{ env.MY_VAR }}
```
