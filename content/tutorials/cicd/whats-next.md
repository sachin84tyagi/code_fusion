Welcome to **Chapter 17 — What's Next After CI/CD**.

> **You have mastered CI/CD. You now think like a DevOps engineer. Here is your complete roadmap to becoming a world-class DevOps and platform engineer.**

---

# 🎉 What You've Learned

```
✅ What CI/CD is and why it matters
✅ Git branching strategies for CI/CD
✅ GitHub Actions fundamentals
✅ Workflow YAML — triggers, jobs, steps
✅ Triggers and events (push, PR, schedule, manual)
✅ Jobs and steps — parallel and sequential
✅ Runners — hosted and self-hosted
✅ Secrets and variables — secure configuration
✅ Artifacts and caching — speed and sharing
✅ Docker in CI/CD — build, push, deploy
✅ Testing in pipeline — unit, integration, E2E, security
✅ Deployment strategies — rolling, blue-green, canary
✅ Jenkins — enterprise CI/CD
✅ Pipeline as Code — reusable, version-controlled pipelines
✅ Monitoring pipelines — alerts, rollbacks, DORA metrics
```

You are now a **CI/CD engineer**.

---

# Your Complete CI/CD Pipeline

Here is a production-grade pipeline combining everything you learned:

```yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ─── Stage 1: Code Quality ─────────────────────
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18', cache: 'npm' }
      - run: npm ci
      - run: npm run lint

  # ─── Stage 2: Tests (all in parallel) ──────────
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
        env: { DB_HOST: localhost, DB_PASS: test }

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - uses: github/codeql-action/init@v3
        with: { languages: javascript }
      - uses: github/codeql-action/analyze@v3

  # ─── Stage 3: Build Docker Image ───────────────
  build-and-push:
    needs: [lint, unit-tests, integration-tests, security-scan]
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}

    steps:
      - uses: actions/checkout@v4

      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: docker/metadata-action@v5
        id: meta
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: type=sha,prefix=

      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ─── Stage 4: Deploy to Staging ────────────────
  deploy-staging:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - uses: actions/checkout@v4
      - run: kubectl set image deployment/app app=${{ needs.build-and-push.outputs.image-tag }}
      - run: kubectl rollout status deployment/app

      - name: Smoke test
        run: curl -f https://staging.myapp.com/health

  # ─── Stage 5: Deploy to Production ─────────────
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production   # Requires manual approval

    steps:
      - uses: actions/checkout@v4
      - run: kubectl set image deployment/app app=${{ needs.build-and-push.outputs.image-tag }}
      - run: kubectl rollout status deployment/app

      - name: Health check
        run: curl -f https://myapp.com/health

      - name: Notify success
        if: success()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text":"✅ Production deployed: ${{ github.sha }}"}'

      - name: Rollback and notify on failure
        if: failure()
        run: |
          kubectl rollout undo deployment/app
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text":"🚨 ROLLBACK triggered @oncall"}'
```

---

# What's Next — Learning Path

```
CI/CD (Done ✅)
    ↓
Kubernetes (K8s) - Container Orchestration
    ↓
Cloud (AWS/GCP/Azure) - Infrastructure
    ↓
Terraform - Infrastructure as Code
    ↓
Monitoring (Prometheus + Grafana)
    ↓
Service Mesh (Istio)
    ↓
Platform / Site Reliability Engineer (SRE)
```

---

# Step 1 — Kubernetes (K8s)

CI/CD deploys to Kubernetes.

Learn:

```
Pod / Deployment / Service / Ingress
ConfigMap / Secret
Namespace
HPA (Horizontal Pod Autoscaler)
kubectl commands
Helm charts
```

---

# Step 2 — Terraform (IaC)

Define cloud infrastructure as code.

```hcl
resource "aws_ecs_service" "api" {
  name            = "my-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 3
}
```

CI/CD pipeline can even run `terraform apply`.

---

# Step 3 — Cloud Platforms

Deploy your pipelines to:

```
AWS  → ECS, EKS, CodePipeline, CodeBuild
GCP  → GKE, Cloud Build, Cloud Run
Azure → AKS, Azure DevOps
```

---

# Step 4 — Observability

Know what's happening in production:

```
Prometheus → Collect metrics
Grafana    → Visualize metrics
Loki       → Log aggregation
Jaeger     → Distributed tracing
AlertManager → PagerDuty / Slack alerts
```

---

# DORA Metrics — Your CI/CD Report Card

Measure your CI/CD maturity:

| Metric | Low (Manual) | Medium | High (Elite) |
| --- | --- | --- | --- |
| Deployment Frequency | Weekly | Daily | Multiple per day |
| Lead Time | Weeks | Days | Hours |
| MTTR | Days | Hours | Minutes |
| Change Failure Rate | > 15% | 10-15% | < 5% |

---

# Company Hiring Criteria

**Fresher / Junior:**

```
✅ Explain what CI/CD is
✅ Know GitHub Actions basics
✅ Write a simple workflow YAML
✅ Understand triggers (push, PR)
✅ Know what Secrets are
```

**Senior / DevOps Engineer:**

```
✅ Design full CI/CD pipeline
✅ Docker build and push in pipeline
✅ Multi-environment deployments
✅ Deployment strategies (Blue-Green, Canary)
✅ Pipeline as Code and reusable workflows
✅ Monitoring and rollback automation
✅ DORA metrics awareness
✅ Jenkins and GitHub Actions
✅ Kubernetes deployment integration
✅ Security scanning in pipeline
```

---

# Interview Preparation Checklist

```
□ What is CI/CD and why is it important?
□ Explain the stages of a CI/CD pipeline
□ What is GitHub Actions?
□ How do you structure a workflow YAML?
□ What events can trigger a pipeline?
□ Difference between jobs and steps?
□ What are runners?
□ How do you handle secrets securely?
□ What is caching and why does it matter?
□ How does Docker fit into CI/CD?
□ What types of tests run in a pipeline?
□ Explain Blue-Green vs Canary deployment
□ What is Jenkins? When would you use it?
□ What is Pipeline as Code?
□ How do you monitor a pipeline?
□ What are DORA metrics?
□ How do you implement automatic rollback?
```

---

# 🏆 Final Professional Summary

```
CI/CD in one diagram:

Code Push
    ↓
Lint + Tests (parallel, fast)
    ↓
Security Scan
    ↓
Docker Build + Push to Registry
    ↓
Deploy to Staging
    ↓
Smoke Tests
    ↓
Human Approval (optional)
    ↓
Deploy to Production
    ↓
Health Check + Monitoring
    ↓
✅ Success Notification OR
❌ Auto-Rollback + Alert
```

---

# 🧠 Final Memory Trick

```
CI/CD = Factory Assembly Line

Raw Materials (code)
     ↓
Quality Control (lint + tests)
     ↓
Assembly (docker build)
     ↓
Warehouse (push to registry)
     ↓
Packaging & QA (staging deploy + smoke test)
     ↓
Shipping (production deploy)
     ↓
Customer Feedback (monitoring)

Automated. Every time. Without fail.
```

**You are now a CI/CD Engineer.**

Build robust pipelines.

Ship code with confidence.

Never fear deployments again. 🚀
