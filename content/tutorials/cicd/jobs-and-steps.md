Welcome to **Chapter 7 — Jobs and Steps**.

> **Jobs and Steps are the building blocks of every pipeline. Everything your pipeline does is a job containing steps. Master this and you can build any workflow.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine building a house.

```
🏗️ Building a House (Pipeline)

  Job 1: Foundation
    Step 1: Dig ground
    Step 2: Pour concrete
    Step 3: Wait to dry

  Job 2: Walls (starts after Foundation)
    Step 1: Lay bricks
    Step 2: Install windows
    Step 3: Seal gaps

  Job 3: Roof (starts after Walls)
    Step 1: Install beams
    Step 2: Lay tiles
```

Each job is a stage.

Each step is a task within that stage.

Steps in a job must go in order.

Jobs can run in parallel or in sequence.

---

# Jobs

A **job** is a group of steps that run on the same machine.

```yaml
jobs:
  lint:               # Job 1
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  test:               # Job 2
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  build:              # Job 3
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
```

By default, all three jobs **run in parallel**.

---

# Sequential Jobs with `needs:`

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  test:
    needs: lint       # Wait for lint to finish
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  build:
    needs: test       # Wait for test to finish
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

  deploy:
    needs: [lint, test, build]   # Wait for ALL three
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

Flow:

```
lint → test → build → deploy
```

---

# Parallel Jobs with Dependencies

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]

  unit-tests:
    runs-on: ubuntu-latest
    steps: [...]

  integration-tests:
    runs-on: ubuntu-latest
    steps: [...]

  build:
    needs: [lint, unit-tests, integration-tests]
    runs-on: ubuntu-latest
    steps: [...]
```

Flow:

```
lint  ┐
      ├──→ build → deploy
unit  │
      │
integ ┘
```

`lint`, `unit-tests`, and `integration-tests` all run at the same time.

`build` starts only when ALL three finish.

---

# Steps

A **step** is a single task inside a job.

Steps run **sequentially** top to bottom.

If one step fails → remaining steps skip (unless `if: always()`).

```yaml
steps:
  - name: Step 1
    run: echo "First"

  - name: Step 2
    run: echo "Second"   # Runs after Step 1

  - name: Step 3
    run: echo "Third"    # Runs after Step 2
```

---

# Step Types

**Type 1 — uses (Marketplace Action):**

```yaml
- uses: actions/checkout@v4

- uses: actions/setup-node@v4
  with:
    node-version: '18'

- uses: docker/build-push-action@v5
  with:
    push: true
    tags: myapp:latest
```

**Type 2 — run (Shell command):**

```yaml
- run: npm ci

- run: npm test

- run: |
    echo "Multiple lines"
    docker build -t myapp .
    docker push myapp
```

---

# Step Properties

```yaml
steps:
  - name: My Step            # Display name in GitHub UI
    id: my-step              # Reference this step later
    uses: actions/checkout@v4
    with:                    # Inputs for the action
      ref: main
    env:                     # Step-level env variables
      NODE_ENV: production
    if: success()            # Condition to run this step
    continue-on-error: true  # Don't fail job if this step fails
    timeout-minutes: 10      # Fail if step takes > 10 minutes
```

---

# Step ID and Outputs

```yaml
steps:
  - name: Get timestamp
    id: timestamp
    run: echo "time=$(date +%Y%m%d%H%M%S)" >> $GITHUB_OUTPUT

  - name: Use timestamp
    run: echo "Build time: ${{ steps.timestamp.outputs.time }}"
```

---

# Environment Variables in Steps

**Global (available to all steps):**

```yaml
env:
  DB_HOST: localhost
  NODE_ENV: production

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo $DB_HOST      # works here
```

**Job-level:**

```yaml
jobs:
  test:
    env:
      NODE_ENV: test
    runs-on: ubuntu-latest
    steps:
      - run: echo $NODE_ENV
```

**Step-level:**

```yaml
steps:
  - name: Deploy
    run: ./deploy.sh
    env:
      DEPLOY_ENV: production    # Only for this step
```

---

# continue-on-error

Allow a step to fail without failing the whole job:

```yaml
steps:
  - name: Generate coverage
    run: npm run coverage
    continue-on-error: true     # Coverage failure is OK

  - name: Run tests
    run: npm test               # This MUST pass
```

---

# timeout-minutes

Fail a step or job if it takes too long:

```yaml
jobs:
  test:
    timeout-minutes: 30         # Entire job must finish in 30 min
    steps:
      - name: Long test
        timeout-minutes: 10     # This step must finish in 10 min
        run: npm run test:e2e
```

---

# Job Conditions

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - run: ./deploy.sh staging

  deploy-prod:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - run: ./deploy.sh production
```

---

# Sharing Data Between Jobs — Artifacts

Jobs run on separate machines.

To pass files between jobs → upload artifact from one job, download in another.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

      - name: Upload dist
        uses: actions/upload-artifact@v4
        with:
          name: dist-folder
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download dist
        uses: actions/download-artifact@v4
        with:
          name: dist-folder

      - run: ls dist/    # dist is now available here
```

---

# Company Example — Razorpay

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint

  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run test:unit

  integration-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run test:integration

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=critical

  build-and-push:
    needs: [lint, unit-test, integration-test, security-scan]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t razorpay-api:${{ github.sha }} .
      - run: docker push ecr.amazonaws.com/razorpay-api:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - run: kubectl set image deployment/api api=razorpay-api:${{ github.sha }}
```

All quality checks run in parallel.

Only if all pass → build and deploy.

---

# Interview Questions

## Q1. What is the difference between a job and a step?

**Best Answer**

> A job is a group of steps that run sequentially on the same runner (virtual machine). Multiple jobs in a workflow run in parallel by default. A step is a single action or command within a job. Jobs can depend on each other using `needs:`, while steps in a job always run in order.

---

## Q2. How do you make jobs run sequentially?

Use `needs:`. A job with `needs: [lint, test]` will only start after both `lint` and `test` complete successfully.

---

## Q3. How do you pass data between jobs?

Since jobs run on different machines, use `actions/upload-artifact@v4` to save files from one job and `actions/download-artifact@v4` to retrieve them in another job. For simple values, use job outputs: write to `$GITHUB_OUTPUT` and read with `${{ needs.job-id.outputs.key }}`.

---

## Q4. What is `continue-on-error`?

A step property that allows the step to fail without causing the entire job to fail. Useful for optional checks like test coverage reporting that shouldn't block the pipeline.

---

# Professional Summary

```
Jobs vs Steps:
  Job  = group of steps, on one machine
  Step = single command/action in a job

Jobs: parallel by default, sequential with needs:
Steps: always sequential, top to bottom

Key step properties:
  name:              display name
  uses:              marketplace action
  run:               shell command
  with:              action inputs
  env:               step-level env vars
  if:                condition
  continue-on-error: don't fail job
  timeout-minutes:   max time limit
  id:                reference step output

Share data across jobs: upload-artifact / download-artifact
```
