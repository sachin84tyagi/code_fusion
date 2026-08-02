Welcome to **Chapter 15 — Pipeline as Code**.

> **Pipeline as Code is the philosophy of defining your entire CI/CD pipeline in a file that lives in your Git repository alongside your application code. It is the foundation of modern DevOps.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine your pipeline is a recipe.

**Old way (GUI-based pipeline):**

```
Click buttons in a web interface
Set up steps manually
Someone deletes it by accident
Gone forever!
New developer has to click buttons again for hours.
```

**New way (Pipeline as Code):**

```
Write recipe in a file: ci.yml
Save it in Git (like all other code)
Anyone can see it
Anyone can run it
Delete a server? Just redeploy from the file.
New developer? Pipeline works in 5 minutes.
```

The recipe (pipeline) is **version-controlled**.

That is Pipeline as Code.

---

# What is Pipeline as Code?

**Pipeline as Code** means your CI/CD pipeline is defined in a file stored in your repository.

```
my-project/
├── src/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── .github/
│   └── workflows/
│       ├── ci.yml          ← Pipeline as Code (GitHub Actions)
│       └── release.yml
└── Jenkinsfile             ← Pipeline as Code (Jenkins)
```

---

# Benefits of Pipeline as Code

```
✅ Version controlled   → Changes tracked in Git
✅ Peer reviewed        → Pipeline changes go through PR
✅ Reproducible        → Same pipeline runs everywhere
✅ Self-documenting    → Pipeline = documentation
✅ Backup/restore      → Just re-commit the file
✅ Collaboration       → Team sees pipeline changes
✅ Auditable           → Who changed what and when?
✅ Reusable            → Copy pipeline to another repo
```

---

# Reusable Workflows (GitHub Actions)

Extract common pipeline logic into a reusable workflow.

**Create reusable workflow:**

```yaml
# .github/workflows/reusable-ci.yml
name: Reusable CI

on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: '18'
      run-e2e:
        required: false
        type: boolean
        default: false
    secrets:
      NPM_TOKEN:
        required: false

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: 'npm'

      - run: npm ci
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

      - run: npm run lint
      - run: npm test
      - run: npm run build

      - name: E2E Tests
        if: inputs.run-e2e
        run: npx playwright test
```

**Call from multiple repos/workflows:**

```yaml
# .github/workflows/ci.yml  (in each service repo)
name: CI

on: [push, pull_request]

jobs:
  run-ci:
    uses: org/shared-workflows/.github/workflows/reusable-ci.yml@main
    with:
      node-version: '20'
      run-e2e: true
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

One reusable workflow → used by 50 service repos.

Update once → all repos benefit.

---

# Composite Actions

Create a custom action from multiple steps:

```yaml
# .github/actions/setup-and-test/action.yml
name: 'Setup and Test'
description: 'Install dependencies and run tests'

inputs:
  node-version:
    description: 'Node.js version'
    default: '18'
  coverage-threshold:
    description: 'Minimum coverage %'
    default: '80'

outputs:
  coverage:
    description: 'Coverage percentage'
    value: ${{ steps.coverage.outputs.pct }}

runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}

    - name: Install
      shell: bash
      run: npm ci

    - name: Test with coverage
      shell: bash
      run: npm test -- --coverage

    - name: Check threshold
      id: coverage
      shell: bash
      run: |
        PCT=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
        echo "pct=$PCT" >> $GITHUB_OUTPUT
        if (( $(echo "$PCT < ${{ inputs.coverage-threshold }}" | bc -l) )); then
          echo "Coverage $PCT% below ${{ inputs.coverage-threshold }}% threshold"
          exit 1
        fi
```

Use in workflow:

```yaml
steps:
  - uses: ./.github/actions/setup-and-test
    with:
      node-version: '20'
      coverage-threshold: '85'
```

---

# GitOps — Pipeline as Code for Infrastructure

GitOps extends Pipeline as Code to infrastructure.

```
Principle:
  Git is the single source of truth
  for both application AND infrastructure.
```

```
Developer updates:
  kubernetes/deployment.yaml    ← in Git

GitOps tool (ArgoCD) sees the change:
  → Automatically syncs to cluster
  → Kubernetes matches Git state
```

```yaml
# ArgoCD Application (infrastructure as code)
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  source:
    repoURL: https://github.com/org/my-app
    path: k8s/
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

Every change to `k8s/` folder → ArgoCD deploys automatically.

---

# DRY Pipelines — Don't Repeat Yourself

**Bad — Duplicated logic in every repo:**

```yaml
# Service A, B, C, D all have this same YAML:
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: '18'
  - run: npm ci
  - run: npm test
  - run: npm run build
  - uses: docker/build-push-action@v5
  - run: kubectl apply
```

**Good — One reusable workflow called by all:**

```yaml
# Service A:
jobs:
  deploy:
    uses: org/shared/.github/workflows/node-cicd.yml@main

# Service B:
jobs:
  deploy:
    uses: org/shared/.github/workflows/node-cicd.yml@main

# Service C:
jobs:
  deploy:
    uses: org/shared/.github/workflows/node-cicd.yml@main
```

Fix the shared workflow once → all services benefit.

---

# Versioning Your Pipeline

Tag your pipeline releases just like application releases:

```yaml
# Use pinned versions for security
uses: actions/checkout@v4          # ✅ Pinned to major version
uses: actions/checkout@abc1234     # ✅ Pinned to exact commit SHA

# ❌ Never use latest or no version
uses: actions/checkout             # ❌ Can break anytime
uses: actions/checkout@latest      # ❌ Unknown changes
```

---

# Pipeline Branching Strategies

```yaml
# ci.yml — Run on every branch push
on:
  push:
    branches: ['**']

# cd-staging.yml — Only on develop
on:
  push:
    branches: [develop]

# cd-production.yml — Only on main
on:
  push:
    branches: [main]

# release.yml — Only on tags
on:
  push:
    tags: ['v*']
```

---

# Company Example — Hotstar

Hotstar has 100+ microservices.

Without Pipeline as Code:

```
100 services × manual Jenkins setup = weeks of work
New microservice? Set up pipeline manually: 2 days
Pipeline broken? Debug UI config: hours
```

With Pipeline as Code:

```
Shared workflow repo: github.com/hotstar/shared-workflows

New microservice created:
  Copy 5 lines of YAML:
    uses: hotstar/shared-workflows/.github/workflows/node-deploy.yml@v2
    with: { service-name: 'video-api' }

  New service has full CI/CD in 5 minutes.

Pipeline update needed? Update shared workflow → all 100 services updated.
```

---

# Interview Questions

## Q1. What is Pipeline as Code?

**Best Answer**

> Pipeline as Code is the practice of defining CI/CD pipelines in version-controlled files (like `.github/workflows/ci.yml` or `Jenkinsfile`) stored alongside application code. This makes pipelines reproducible, auditable, peer-reviewable, and consistent across environments. Changes to the pipeline go through the same code review process as application code.

---

## Q2. What are the benefits of Pipeline as Code?

Version control (track changes over time), peer review (pipeline changes reviewed like code), reproducibility (same pipeline everywhere), collaboration (team visibility), self-documentation, and easy disaster recovery (just recommit the file).

---

## Q3. What is a reusable workflow in GitHub Actions?

A workflow that can be called by other workflows using `uses:` with `workflow_call:` trigger. Enables DRY pipelines across multiple repositories — define once, use everywhere. Reduces duplication and ensures consistent CI/CD standards across services.

---

## Q4. What is GitOps?

GitOps extends Pipeline as Code to infrastructure. Git is the single source of truth for both application code AND infrastructure configuration. Tools like ArgoCD automatically sync the cluster state to match what's in Git. Any change in Git → automatically applied to infrastructure.

---

# Professional Summary

```
Pipeline as Code:
  GitHub Actions → .github/workflows/ci.yml
  Jenkins        → Jenkinsfile (Groovy)

Principles:
  ✅ Version controlled
  ✅ Peer reviewed via PR
  ✅ DRY → reusable workflows

GitHub Actions Reusable Workflows:
  on:
    workflow_call:
  
  Called by:
    uses: org/repo/.github/workflows/file.yml@main

GitOps (next level):
  Git = source of truth for infrastructure
  ArgoCD/Flux → auto-sync cluster to Git state

Best Practice:
  Pin action versions: @v4 or @sha
  One shared workflow library → used by all services
```
