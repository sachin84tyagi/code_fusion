Welcome to **Chapter 2 — What is CI/CD**.

> **CI/CD is not just a tool — it is a software development philosophy. Understanding it deeply separates junior developers from senior engineers.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine building a LEGO castle.

**Old way (no CI/CD):**

```
Build 500 pieces
Try to connect everything at the end
❌ Pieces don't fit
Start over...
Takes a week
```

**New way (with CI/CD):**

```
Build 10 pieces
✅ Test: they connect
Build 10 more pieces
✅ Test: they connect
...
Castle built piece by piece
Each piece tested as you go
No surprises at the end
```

CI/CD is building software piece by piece.

Test as you go.

Never let problems pile up.

---

# The Full CI/CD Pipeline

```
Developer writes code
         ↓
Pushes to GitHub
         ↓
┌─────────────────────────────────────────────┐
│                 CI STAGE                     │
│  Checkout Code                               │
│       ↓                                      │
│  Install Dependencies                        │
│       ↓                                      │
│  Lint Code (ESLint, Pylint, Checkstyle)      │
│       ↓                                      │
│  Run Unit Tests                              │
│       ↓                                      │
│  Run Integration Tests                       │
│       ↓                                      │
│  Build Artifact (JAR / Docker image)         │
│       ↓                                      │
│  Scan for Security Vulnerabilities           │
│       ↓                                      │
│  Generate Coverage Report                    │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│                 CD STAGE                     │
│  Push Image to Registry                      │
│       ↓                                      │
│  Deploy to Staging                           │
│       ↓                                      │
│  Run Smoke Tests                             │
│       ↓                                      │
│  [Optional: Human Approval]                  │
│       ↓                                      │
│  Deploy to Production                        │
│       ↓                                      │
│  Monitor and Alert                           │
└─────────────────────────────────────────────┘
         ↓
Notification (Slack/Email): ✅ SUCCESS
```

---

# Key Concepts

---

# Pipeline

The automated workflow that runs when code is pushed.

```
Code Push → Pipeline runs → Result
```

A pipeline is made of:

```
Pipeline
  → Stages (CI, CD)
    → Jobs (test, build, deploy)
      → Steps (individual commands)
```

---

# Trigger

What starts the pipeline.

```
Push to main branch      → trigger
Pull Request created     → trigger
Pull Request merged      → trigger
Tag created (v1.0.0)     → trigger
Scheduled cron job       → trigger
Manual button click      → trigger
```

---

# Artifact

The output of the build stage.

```
Node.js  → Built dist/ folder
Java     → .jar or .war file
React    → .html + .js + .css bundle
Docker   → Docker image
```

Artifacts are passed between stages.

---

# Environment

Where the app runs.

```
Development → Dev server (local or cloud)
Staging     → Production-like (for testing)
Production  → Real users
```

CI/CD deploys progressively:

```
Test → Staging → Production
```

---

# The Three Phases Deep Dive

---

# Phase 1: Source Control

Code lives in Git.

```
main/master  → Production code
develop      → Integration branch
feature/*    → Developer feature branches
```

CI/CD watches specific branches.

Push to `main` → Deploy to production.

Push to `develop` → Deploy to staging.

---

# Phase 2: Build & Test

Runs every push:

```bash
# Install
npm install

# Lint
npm run lint

# Test
npm run test

# Build
npm run build
```

If any step fails → pipeline stops.

Developer gets notified immediately.

---

# Phase 3: Deploy

```bash
# Build Docker image
docker build -t myapp:$GIT_SHA .

# Push to registry
docker push ecr.amazonaws.com/myapp:$GIT_SHA

# Deploy to Kubernetes
kubectl set image deployment/myapp myapp=ecr.amazonaws.com/myapp:$GIT_SHA

# Verify rollout
kubectl rollout status deployment/myapp
```

---

# Shift Left Testing

Old way:

```
Dev → Dev → Dev → Dev → QA → QA → Deploy
                          ↑
                    Bugs found LATE
                    Expensive to fix
```

CI/CD way (shift left):

```
Dev+Test → Dev+Test → Dev+Test → Deploy
  ↑
Bugs found EARLY
Cheap to fix
```

"Shift left" = test earlier in the process.

---

# Feedback Loop

The most important concept in CI/CD.

```
Fast feedback = Happy developers

Slow feedback = Frustration + bugs pile up
```

Goal: Developer gets feedback in **under 10 minutes**.

```
Push code at 9:00 AM
Pipeline runs
Tests fail
Developer gets Slack message at 9:05 AM
Fix it while context is fresh
```

---

# CI/CD Metrics

Good CI/CD pipelines are measured by:

```
Deployment Frequency     → How often code ships (hourly? daily? weekly?)
Lead Time for Changes    → Code written → in production (hours? days?)
Mean Time to Recovery    → When prod breaks, how fast do you fix? (minutes? hours?)
Change Failure Rate      → % of deployments that cause incidents
```

Top companies:

```
Deployment frequency: Multiple times per day
Lead time:            < 1 hour
MTTR:                 < 1 hour
Change failure rate:  < 5%
```

---

# Company Example — Google

Google makes 5,000+ code changes to production per day.

```
50,000 engineers
5,000 daily deployments
0 manual deployment steps
Automated testing at massive scale
Failures caught in seconds
Self-healing pipelines
```

This is only possible with CI/CD.

---

# Interview Questions

## Q1. What is a CI/CD pipeline?

**Best Answer**

> A CI/CD pipeline is an automated series of steps that code goes through after a developer pushes it to version control. The CI stage automatically tests and builds the code. The CD stage automatically deploys it to staging or production. It provides fast feedback, reduces manual errors, and enables frequent, reliable releases.

---

## Q2. What is "shift left testing"?

Moving testing earlier in the development process. Instead of testing at the end (QA phase), you test continuously during development. Bugs caught earlier are cheaper and faster to fix.

---

## Q3. What are the key metrics for CI/CD?

The DORA metrics: Deployment Frequency, Lead Time for Changes, Mean Time to Recovery (MTTR), and Change Failure Rate. Elite teams deploy multiple times per day with MTTR under one hour.

---

## Q4. What is an artifact in CI/CD?

An artifact is the output of the build stage — the compiled or packaged version of the application ready for deployment. Examples: a Docker image, a .jar file, a .zip bundle, a dist folder.

---

## Q5. What is the difference between a pipeline, a job, and a step?

A pipeline is the overall workflow. A pipeline contains jobs. A job is a group of steps that run on the same runner/machine. A step is a single command or action inside a job.

---

# Professional Summary

```
CI/CD = Automated pipeline: code → test → build → deploy

Key Phases:
  1. Source Control (Git push triggers pipeline)
  2. CI: lint → test → build → security scan
  3. CD: push image → deploy staging → deploy prod

Key Metrics (DORA):
  Deployment Frequency
  Lead Time for Changes
  MTTR
  Change Failure Rate

Goal: Fast, safe, frequent releases
```
