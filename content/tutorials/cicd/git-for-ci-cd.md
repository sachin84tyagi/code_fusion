Welcome to **Chapter 3 — Git for CI/CD**.

> **Every CI/CD pipeline starts with Git. Understanding how branching strategies connect to your pipeline is non-negotiable.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a school project with 5 students.

Everyone works on the same notebook.

**Without rules (no Git strategy):**

```
Everyone writes on the same page
Pages get torn
No one knows who wrote what
Project is a mess
```

**With rules (Git branching strategy):**

```
Main notebook = main branch (production)
Rough draft  = develop branch (testing)
Your section = feature branch (your work)

You finish → teacher reviews → added to main notebook
Clean. Organized. Safe.
```

That's Git branching in CI/CD.

---

# Git Basics for CI/CD

CI/CD pipelines watch **specific branches** and trigger on **specific events**.

```
main branch push    → deploy to production
develop branch push → deploy to staging
feature/* push      → run tests only
tag creation        → release pipeline
```

---

# Branching Strategies

---

# Strategy 1 — GitHub Flow (Simplest)

Best for: Startups, small teams, continuous deployment.

```
main ──────────────────────────────────── (production)
       \                         /
        feature/login-page ─────
```

Rules:

```
1. main = always deployable
2. Create feature branch from main
3. Push changes to feature branch
4. Open Pull Request
5. CI runs tests
6. Code review
7. Merge to main
8. Auto-deploy to production
```

```bash
git checkout -b feature/user-login
# code...
git push origin feature/user-login
# Create PR on GitHub
# CI runs → tests pass → review → merge → deploy
```

---

# Strategy 2 — Git Flow (Most Popular)

Best for: Products with scheduled releases.

```
main ─────────────────────────── (production)
  \                             /
hotfix ───────────────────────
              \               /
   develop ────────────────── (integration)
     \          /      \     /
   feature/a   /    feature/b
```

Branches:

```
main      → Production code, tagged releases
develop   → Integration branch, staging
feature/* → New features (from develop)
release/* → Release preparation
hotfix/*  → Emergency fixes (from main)
```

CI/CD mapping:

```
feature/* push  → CI only (tests)
develop push    → CI + deploy to staging
main push       → CI + deploy to production
tag v*          → Release pipeline
```

---

# Strategy 3 — Trunk-Based Development

Best for: Large companies (Google, Netflix, Uber).

```
trunk (main) ───────────────────────── (production)
    |   |   |
  dev  dev  dev   (all push directly to main/trunk)
```

Rules:

```
1. No long-lived branches
2. Push small changes directly to main
3. Use feature flags for incomplete features
4. CI must pass before merge
5. Branches live < 1 day
```

Requires excellent test coverage.

---

# Git Events That Trigger CI/CD

```
push             → Code pushed to a branch
pull_request     → PR opened, updated, or merged
merge            → Branch merged into another
tag              → Git tag created (v1.0.0)
release          → GitHub release created
schedule         → Cron-based (daily builds, nightly tests)
workflow_dispatch → Manual trigger from UI
```

---

# Pull Request Workflow

```
Developer:
  git checkout -b feature/payment-gateway
  # code changes
  git commit -m "feat: add PayPal integration"
  git push origin feature/payment-gateway
  # Open Pull Request on GitHub

Automated on PR:
  ✅ CI pipeline runs
  ✅ Tests pass
  ✅ Code coverage checked
  ✅ Security scan runs
  ✅ Lint check passes

Human review:
  ✅ Code review approved

Merge → CI runs on main → Deploy to production
```

---

# Commit Message Convention

Good commit messages help CI/CD pipelines and changelogs.

**Conventional Commits:**

```
feat:     New feature
fix:      Bug fix
docs:     Documentation
test:     Tests
refactor: Code refactoring
chore:    Build tools, dependencies
ci:       CI/CD changes
perf:     Performance improvements
```

Examples:

```
feat: add user authentication
fix: resolve payment timeout bug
ci: add Docker image scanning step
test: add unit tests for cart service
```

CI/CD pipelines can use commit messages to:

```
feat: → minor version bump (1.0.0 → 1.1.0)
fix:  → patch version bump (1.0.0 → 1.0.1)
BREAKING CHANGE: → major version bump (1.0.0 → 2.0.0)
```

---

# Git Tags for Releases

Tags mark specific commits as releases.

```bash
# Create a tag
git tag v1.2.0
git tag -a v1.2.0 -m "Release 1.2.0"

# Push tag
git push origin v1.2.0

# Push all tags
git push --tags
```

CI/CD pipeline triggers on tag:

```
Tag v* pushed
       ↓
Build release image
       ↓
docker tag myapp:latest myapp:v1.2.0
       ↓
Push to registry
       ↓
Create GitHub Release
       ↓
Deploy to production
```

---

# Protected Branches

In GitHub, protect `main`:

```
Settings → Branches → Add Protection Rule

✅ Require pull request reviews (2 reviewers)
✅ Require status checks to pass (CI must pass)
✅ Require branches to be up to date
✅ Restrict who can push to main
```

This means:

```
No one can push directly to main
Every change goes through PR
CI must pass before merging
Senior developer must approve
```

---

# Company Example — Paytm

Paytm uses Git Flow:

```
feature/payment-upi  → Developer works here
         ↓
develop branch push  → CI runs, deploy to staging
         ↓
QA tests on staging  → Approve ✅
         ↓
release/v2.5.0 branch → Prepare release
         ↓
main branch merge    → CI + deploy to production
         ↓
git tag v2.5.0       → GitHub Release created
```

2 weeks sprint → 1 release cycle.

---

# Interview Questions

## Q1. What is a branching strategy?

**Best Answer**

> A branching strategy is a set of rules for how developers use branches in Git. Common strategies include GitHub Flow (simple, continuous delivery), Git Flow (scheduled releases, multiple long-lived branches), and Trunk-Based Development (everyone commits to main, used at Google/Netflix). The strategy determines how CI/CD pipelines are triggered.

---

## Q2. What is a Pull Request in CI/CD?

A PR is a request to merge a feature branch into a base branch. CI pipelines run automatically on every PR to test, lint, and scan the code before it is merged. Protected branches ensure PRs can only merge when CI passes and reviewers approve.

---

## Q3. What are protected branches?

Branch protection rules on GitHub that prevent direct pushes to important branches (like main). They require passing CI checks and code review approvals before merging. This ensures code quality and prevents accidental production deployments.

---

## Q4. What are Git tags used for in CI/CD?

Tags mark specific commits as releases (e.g., v1.0.0). CI/CD pipelines trigger release workflows when a tag matching `v*` is pushed. This builds the release artifact, pushes it to the registry, and creates a GitHub Release.

---

# Professional Summary

```
Git for CI/CD:

Branching Strategies:
  GitHub Flow → simple, continuous deploy, startups
  Git Flow    → scheduled releases, enterprise
  Trunk-Based → Google/Netflix scale

Trigger mapping:
  feature/* push → CI only
  develop push   → CI + staging deploy
  main push      → CI + production deploy
  tag v* push    → release pipeline

Best Practices:
  ✅ Protected main branch
  ✅ PR-based workflow
  ✅ Conventional commits
  ✅ CI must pass before merge
```
