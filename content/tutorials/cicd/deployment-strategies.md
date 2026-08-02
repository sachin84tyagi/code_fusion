Welcome to **Chapter 13 — Deployment Strategies**.

> **How you deploy is as important as what you deploy. The right strategy means zero downtime, safe rollouts, and instant rollbacks when things go wrong.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine upgrading a restaurant's menu.

**Strategy 1 — Recreate (Close and Reopen):**

```
Close restaurant (10 min downtime)
Change the menu
Reopen

Customers can't eat during upgrade.
Simple but painful.
```

**Strategy 2 — Rolling (Table by Table):**

```
Keep 9 tables open with old menu
Switch 1 table to new menu
Monitor... looks good
Switch 2 more tables
... until all tables have new menu

No downtime. Gradual.
```

**Strategy 3 — Blue-Green (Two Restaurants):**

```
Restaurant A = live (old menu)
Restaurant B = ready (new menu)

Switch all customers from A to B instantly
If problems → switch back to A immediately

Zero downtime. Instant rollback.
```

**Strategy 4 — Canary (Test with a few customers):**

```
1% of customers → new menu (canary)
99% of customers → old menu

Watch for complaints...
No complaints → gradually move more customers
```

These are deployment strategies.

---

# Strategy 1 — Recreate

Stop old version. Start new version.

```
v1 running
    ↓
❌ Stop v1 (downtime begins)
    ↓
✅ Start v2
    ↓
v2 running
```

```yaml
# In pipeline
- run: |
    kubectl scale deployment myapp --replicas=0  # Stop
    kubectl set image deployment/myapp myapp=myapp:v2
    kubectl scale deployment myapp --replicas=3  # Start
```

**Pros/Cons:**

```
✅ Simple
✅ No complex infrastructure
❌ Downtime during deployment
❌ Risk: if v2 fails, users see errors
```

Use when: development environments, apps that can have downtime.

---

# Strategy 2 — Rolling Update

Replace old pods one by one. No downtime.

```
v1 v1 v1 v1
    ↓
v2 v1 v1 v1   (replace 1)
    ↓
v2 v2 v1 v1   (replace 2)
    ↓
v2 v2 v2 v1   (replace 3)
    ↓
v2 v2 v2 v2   (all updated)
```

Kubernetes default deployment strategy:

```yaml
# deployment.yaml
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1         # Max extra pods during update
      maxUnavailable: 0   # Never go below desired count
```

In pipeline:

```yaml
- run: kubectl set image deployment/myapp myapp=myapp:${{ github.sha }}
- run: kubectl rollout status deployment/myapp --timeout=10m
```

**Pros/Cons:**

```
✅ Zero downtime
✅ Gradual rollout
✅ Kubernetes built-in
❌ Both versions run simultaneously during update
❌ Database migrations must be backward-compatible
```

---

# Strategy 3 — Blue-Green Deployment

Run two identical environments. Switch traffic instantly.

```
Blue (current):  v1  ← 100% traffic
Green (new):     v2  ← 0% traffic (being deployed)

After deployment:
Blue:            v1  ← 0% traffic
Green:           v2  ← 100% traffic ✅

Rollback:
Blue:            v1  ← 100% traffic ✅ (instant rollback)
Green:           v2  ← 0% traffic
```

```yaml
# Pipeline: deploy to green
- run: kubectl apply -f k8s/green-deployment.yaml

# Run smoke tests on green
- run: curl -f http://green.internal.myapp.com/health

# Switch traffic (update service selector)
- run: |
    kubectl patch service myapp -p \
      '{"spec":{"selector":{"version":"green"}}}'
```

**Pros/Cons:**

```
✅ Zero downtime
✅ Instant rollback (just switch selector)
✅ Full testing before traffic switch
❌ Double the infrastructure cost
❌ Database compatibility required
```

---

# Strategy 4 — Canary Deployment

Send a small % of traffic to new version. Monitor. Gradually increase.

```
100% → v1

Step 1: 5% → v2,   95% → v1  (watch metrics)
Step 2: 20% → v2,  80% → v1  (all good!)
Step 3: 50% → v2,  50% → v1
Step 4: 100% → v2              (complete)
```

```yaml
# GitHub Actions with canary
- name: Deploy canary (5% traffic)
  run: |
    kubectl apply -f k8s/canary.yaml     # 1 pod = ~5% traffic
    kubectl wait --for=condition=ready pod -l version=canary

- name: Monitor canary (5 minutes)
  run: |
    sleep 300   # Wait 5 minutes
    ERROR_RATE=$(curl -s prometheus/query?metric=error_rate)
    if [ "$ERROR_RATE" -gt "1" ]; then
      echo "Error rate too high! Rolling back canary."
      kubectl delete -f k8s/canary.yaml
      exit 1
    fi

- name: Promote canary to full rollout
  run: kubectl apply -f k8s/full-deployment.yaml
```

**Pros/Cons:**

```
✅ Real production traffic testing
✅ Limits blast radius of bugs
✅ Data-driven decisions
❌ Complex to implement
❌ Longer deployment process
```

---

# Strategy 5 — Feature Flags

Deploy code but hide features behind a flag.

```
v2 deployed with new payment feature (hidden)
         ↓
Flag: payment_v2_enabled = false   (for all users)
         ↓
Enable for 1% of users:
  payment_v2_enabled = true (for user_id % 100 == 0)
         ↓
Enable for all:
  payment_v2_enabled = true
```

Tools: LaunchDarkly, Unleash, Flipt, AWS AppConfig.

```javascript
// Code
const isEnabled = featureFlags.isEnabled('payment_v2', userId);
if (isEnabled) {
  return processPaymentV2(order);
} else {
  return processPaymentV1(order);
}
```

---

# Rollback

When a deployment fails, roll back immediately.

**Kubernetes rollback:**

```bash
# View rollout history
kubectl rollout history deployment/myapp

# Rollback to previous version
kubectl rollout undo deployment/myapp

# Rollback to specific revision
kubectl rollout undo deployment/myapp --to-revision=2
```

**In GitHub Actions pipeline:**

```yaml
- name: Deploy
  id: deploy
  run: kubectl set image deployment/myapp myapp=myapp:${{ github.sha }}

- name: Wait for rollout
  run: kubectl rollout status deployment/myapp --timeout=5m
  
- name: Rollback on failure
  if: failure()
  run: |
    echo "Deploy failed! Rolling back..."
    kubectl rollout undo deployment/myapp
```

---

# Deployment with Approval Gate

Require human approval before production:

```yaml
jobs:
  deploy-staging:
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - run: kubectl apply -f k8s/staging/

  deploy-production:
    needs: deploy-staging
    environment: production    # Requires approval from reviewers
    runs-on: ubuntu-latest
    steps:
      - run: kubectl apply -f k8s/production/
```

GitHub pauses the pipeline at `deploy-production`.

Sends notification to reviewers.

Only runs after someone clicks "Approve".

---

# Company Example — Flipkart Big Billion Day

During Flipkart's Big Billion Days sale, traffic = 10x normal.

Deployment strategy:

```
1. Feature Flags:
   → New offers page behind flag
   → Enable for 1% users (test)
   → Enable for 10% users (canary)
   → Enable for all

2. Blue-Green for core services:
   → Deploy payment, cart to Green environment
   → Run load tests on Green
   → Switch traffic: Green becomes live

3. Zero-downtime rolling updates:
   → maxSurge: 50%
   → maxUnavailable: 0
   → Health checks before each pod switch

Rollback time: < 30 seconds
```

---

# Interview Questions

## Q1. What deployment strategies do you know?

**Best Answer**

> There are five main strategies: **Recreate** (stop old, start new — has downtime), **Rolling Update** (replace pods one by one — zero downtime, Kubernetes default), **Blue-Green** (two environments, instant traffic switch — zero downtime, instant rollback), **Canary** (route small traffic % to new version, monitor, then promote), and **Feature Flags** (deploy code but hide features, enable per user).

---

## Q2. What is Blue-Green deployment?

Running two identical environments simultaneously. Blue is live (current version). Green is deployed with the new version. After testing Green, traffic is switched from Blue to Green instantly. Rollback is just switching traffic back to Blue.

---

## Q3. What is a Canary deployment?

Routing a small percentage (5-10%) of real traffic to the new version while the rest goes to the old version. If metrics look good (no errors, normal latency), gradually increase traffic to the new version until it reaches 100%.

---

## Q4. How do you implement a rollback in Kubernetes?

```bash
kubectl rollout undo deployment/myapp
```

Kubernetes keeps rollout history. You can roll back to any previous revision with `--to-revision=N`.

---

# Professional Summary

```
Deployment Strategies:

Recreate:      Stop → Deploy → Start (has downtime)
Rolling:       Replace pods one by one (zero downtime)
Blue-Green:    Two envs, switch traffic (instant rollback)
Canary:        5% traffic → monitor → promote
Feature Flags: Deploy hidden, enable gradually

Kubernetes commands:
  kubectl set image deployment/app app=myapp:sha
  kubectl rollout status deployment/app
  kubectl rollout undo deployment/app
  kubectl rollout history deployment/app

Approval gate:
  environment: production
  → GitHub pauses, requires approval
```
