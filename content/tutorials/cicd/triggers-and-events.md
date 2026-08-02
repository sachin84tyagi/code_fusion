Welcome to **Chapter 6 — Triggers and Events**.

> **Triggers decide WHEN your pipeline runs. Mastering triggers means your pipeline runs at exactly the right time — no more, no less.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a smoke alarm.

```
🚨 Smoke Alarm (Pipeline Trigger)

When smoke detected → alarm rings
When no smoke       → alarm silent

That's a trigger.
```

A CI/CD trigger says:

```
When code is pushed to main → run pipeline
When PR is opened           → run tests
When clock hits 2 AM        → run nightly build
When I click a button       → deploy manually
```

---

# The `on:` Keyword

```yaml
on:
  push:
    branches: [main]
```

`on:` defines what **events** trigger the workflow.

---

# Event 1 — push

Triggers when code is pushed to a branch.

```yaml
on:
  push:
    branches:
      - main
      - develop
      - 'release/**'   # Any branch starting with release/
      - '!feature/**'  # NOT feature branches
```

**Filter by file path:**

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'src/**'          # Only when src/ changes
      - 'package.json'    # Or package.json
    paths-ignore:
      - 'docs/**'         # Ignore docs changes
      - '**.md'           # Ignore markdown files
```

---

# Event 2 — pull_request

Triggers when a PR is opened, updated, or merged.

```yaml
on:
  pull_request:
    branches: [main, develop]   # PR targeting these branches
    types:
      - opened        # PR created
      - synchronize   # New commit pushed to PR branch
      - reopened      # Reopened PR
      - closed        # PR closed (merged or declined)
```

**Typical use:**

```
PR opened or updated → run CI tests
PR merged            → trigger CD pipeline
```

---

# Event 3 — schedule

Cron-based triggers. Run on a schedule.

```yaml
on:
  schedule:
    - cron: '0 2 * * *'      # Every day at 2:00 AM UTC
    - cron: '0 0 * * 1'      # Every Monday at midnight
    - cron: '*/30 * * * *'   # Every 30 minutes
```

**Cron syntax:**

```
┌──── minute (0-59)
│ ┌──── hour (0-23)
│ │ ┌──── day of month (1-31)
│ │ │ ┌──── month (1-12)
│ │ │ │ ┌──── day of week (0-7, 0=Sunday)
│ │ │ │ │
* * * * *
```

**Examples:**

```
0 0 * * *     → daily at midnight
0 9 * * 1-5   → weekdays at 9 AM
0 */6 * * *   → every 6 hours
0 0 1 * *     → first day of every month
```

**Use cases:**

```
Nightly builds
Security scans
Database backups
Dependency update checks
Performance testing (off-hours)
```

---

# Event 4 — workflow_dispatch

Manual trigger from GitHub UI or API.

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deploy environment'
        required: true
        type: choice
        options:
          - staging
          - production
        default: 'staging'

      version:
        description: 'Version tag'
        required: false
        type: string

      run-tests:
        description: 'Run tests before deploy?'
        required: false
        type: boolean
        default: true
```

Access inputs:

```yaml
steps:
  - name: Deploy to ${{ inputs.environment }}
    run: |
      echo "Deploying to: ${{ inputs.environment }}"
      echo "Version: ${{ inputs.version }}"
      if [ "${{ inputs.run-tests }}" == "true" ]; then
        npm test
      fi
```

---

# Event 5 — release

Triggers on GitHub Release events.

```yaml
on:
  release:
    types:
      - published    # New release created
      - created
      - released
```

**Use case:**

```
Create release on GitHub → pipeline builds and publishes the artifact
```

---

# Event 6 — create / delete

Triggers when a branch or tag is created or deleted.

```yaml
on:
  create:  # Branch or tag created
  delete:  # Branch or tag deleted
```

---

# Event 7 — workflow_call

Make a workflow reusable — called by other workflows.

```yaml
# .github/workflows/reusable-test.yml
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
    secrets:
      NPM_TOKEN:
        required: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

Call it from another workflow:

```yaml
# .github/workflows/ci.yml
jobs:
  call-test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '18'
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

# Multiple Triggers

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:
```

All four trigger types on one workflow.

---

# Trigger Strategy by Branch

```yaml
# Run tests on every PR
on:
  pull_request:
    branches: ['**']    # Any branch PR

---

# Deploy to staging on develop push
on:
  push:
    branches: [develop]

---

# Deploy to production on main push
on:
  push:
    branches: [main]

---

# Release pipeline on tag
on:
  push:
    tags: ['v*']        # v1.0.0, v2.3.1, etc.
```

---

# Company Example — Swiggy

Swiggy's trigger strategy:

```yaml
# CI — runs on every PR
on:
  pull_request:
    types: [opened, synchronize]

# Staging — runs on develop merge
on:
  push:
    branches: [develop]

# Production — runs on main merge
on:
  push:
    branches: [main]

# Nightly security scan
on:
  schedule:
    - cron: '0 1 * * *'   # 1 AM daily

# Emergency deploy
on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Hotfix version'
        required: true
```

---

# Interview Questions

## Q1. What events can trigger a GitHub Actions workflow?

**Best Answer**

> GitHub Actions can be triggered by: `push` (code pushed to a branch), `pull_request` (PR events), `schedule` (cron expressions), `workflow_dispatch` (manual trigger), `release` (GitHub release events), `workflow_call` (reusable workflows), `create`/`delete` (branch/tag lifecycle), and many more. Multiple triggers can be combined in one `on:` block.

---

## Q2. How do you trigger a pipeline only when specific files change?

Use the `paths` filter in the `push` trigger:

```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
```

---

## Q3. What is workflow_dispatch used for?

It creates a manual trigger button in the GitHub Actions UI. You can also define inputs (text, choices, booleans) so operators can parameterize the run. Useful for one-off deploys, hotfixes, and environment-specific operations.

---

## Q4. How do you run a pipeline only on tag pushes?

```yaml
on:
  push:
    tags:
      - 'v*'
```

This triggers only when a tag matching `v*` (like `v1.0.0`) is pushed.

---

# Professional Summary

```
Triggers (on:):

push          → code pushed to branch
pull_request  → PR created/updated
schedule      → cron expression
workflow_dispatch → manual + inputs
release       → GitHub release
workflow_call → reusable workflow

Filters:
  branches: [main, develop]
  tags: ['v*']
  paths: ['src/**']
  paths-ignore: ['docs/**']
  types: [opened, synchronize]

Strategy:
  PR push    → run CI (tests)
  main push  → run CD (deploy)
  v* tag     → release pipeline
  schedule   → nightly scans
```
