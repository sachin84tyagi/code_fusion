Welcome to **Chapter 16 — Monitoring Pipelines**.

> **A pipeline that no one monitors is a pipeline that fails silently in production. Monitoring gives you visibility, alerts, and the confidence that your deployments are healthy.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you send a package to a friend.

**Without tracking:**

```
You send it.
You don't know if it arrived.
You don't know if it's lost.
Your friend calls 3 days later: "I didn't get it!"
```

**With tracking:**

```
You send it.
App notifies: "Package picked up" ✅
App notifies: "In transit" ✅
App notifies: "Out for delivery" ✅
App notifies: "Delivered" ✅

Problem happens? You know in minutes.
```

Pipeline monitoring is that tracking system.

---

# What to Monitor in CI/CD

```
Pipeline metrics:
  ✅ Build success rate
  ✅ Build duration
  ✅ Test pass rate
  ✅ Deployment frequency
  ✅ Failed deployment rate

Application metrics (post-deploy):
  ✅ Error rate
  ✅ Response time
  ✅ Request per second
  ✅ CPU / Memory usage
  ✅ Crash rate
```

---

# Pipeline Status Notifications

---

# Slack Notifications

Most companies use Slack for pipeline alerts.

```yaml
- name: Notify Slack — Success
  if: success()
  uses: slackapi/slack-github-action@v1.26.0
  with:
    channel-id: '#deployments'
    slack-message: |
      ✅ *${{ github.repository }}* deployed successfully!
      Branch: `${{ github.ref_name }}`
      Commit: `${{ github.sha }}`
      Author: ${{ github.actor }}
      <${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Pipeline>
  env:
    SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}

- name: Notify Slack — Failure
  if: failure()
  uses: slackapi/slack-github-action@v1.26.0
  with:
    channel-id: '#deployments'
    slack-message: |
      ❌ *${{ github.repository }}* FAILED!
      Branch: `${{ github.ref_name }}`
      Commit: `${{ github.sha }}`
      <${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Failure Details>
  env:
    SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

---

# Email Notifications (Jenkins)

```groovy
post {
    failure {
        emailext(
            subject: "❌ Build FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: """
                Pipeline: ${env.JOB_NAME}
                Build: #${env.BUILD_NUMBER}
                Status: FAILED
                
                Console Output: ${env.BUILD_URL}console
                
                Please investigate immediately.
            """,
            to: 'team-lead@company.com,devops@company.com'
        )
    }
    success {
        emailext(
            subject: "✅ Deployed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: "Build ${env.BUILD_NUMBER} deployed successfully.",
            to: 'team@company.com'
        )
    }
}
```

---

# GitHub Actions Status Badges

Show pipeline status directly in your README:

```markdown
# My App

![CI](https://github.com/username/repo/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/username/repo/actions/workflows/deploy.yml/badge.svg)
```

Badge shows:

```
✅ passing  → green badge
❌ failing  → red badge
⚪ pending  → yellow badge
```

---

# Pipeline Analytics — GitHub Actions

View in GitHub UI:

```
Repository → Actions → (select workflow) → (select run)

View:
  Total duration
  Step-by-step timing
  Failure details
  Logs
```

GitHub also shows:

```
Actions → Insights
  → Total run duration
  → Failure rate by workflow
  → Billable minutes used
```

---

# Prometheus + Grafana for CI/CD Metrics

Export pipeline metrics to Prometheus:

```yaml
- name: Record pipeline metrics
  if: always()
  run: |
    STATUS="${{ job.status }}"
    DURATION=$((SECONDS - ${START_TIME}))
    
    curl -X POST http://pushgateway:9091/metrics/job/cicd \
      -d "pipeline_duration_seconds{repo=\"${REPO}\",status=\"${STATUS}\"} ${DURATION}"
```

Grafana dashboard panels:

```
Panel 1: Pipeline success rate (%)
  → Alert if < 95% over last 24h

Panel 2: Average build time (minutes)
  → Alert if > 15 minutes

Panel 3: Deployment frequency (per day)
  → DORA metric

Panel 4: Failed deploys per week
  → Alert if > 3 per week
```

---

# Monitoring Deployed Application

After deploying, watch what happens:

```yaml
- name: Deploy
  run: kubectl apply -f k8s/

- name: Wait for rollout
  run: kubectl rollout status deployment/myapp --timeout=5m

- name: Smoke test
  run: |
    sleep 30   # Wait for pods to start
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.myapp.com/health)
    if [ "$HTTP_STATUS" != "200" ]; then
      echo "Health check failed with status $HTTP_STATUS"
      exit 1
    fi
    echo "✅ Health check passed"

- name: Monitor error rate for 5 minutes
  run: |
    for i in {1..10}; do
      ERROR_RATE=$(curl -s "http://prometheus/api/v1/query?query=rate(errors_total[1m])" | jq '.data.result[0].value[1]')
      if (( $(echo "$ERROR_RATE > 0.01" | bc -l) )); then
        echo "Error rate ${ERROR_RATE} > 1%! Triggering rollback..."
        kubectl rollout undo deployment/myapp
        exit 1
      fi
      sleep 30
    done
    echo "✅ Error rate stable for 5 minutes"
```

---

# Test Reports in GitHub Actions

Publish test results directly in GitHub PR:

```yaml
- name: Run tests
  run: npm test -- --reporter=junit

- name: Publish test results
  uses: mikepenz/action-junit-report@v4
  if: always()
  with:
    report_paths: 'test-results/**/*.xml'
    check_name: 'Test Results'
    fail_on_failure: true
```

Results show inline in the PR:

```
✅ 150 tests passed
❌  2 tests failed
   - UserService.test.js: should validate email
   - PaymentService.test.js: should process refund
```

---

# Rollback Monitoring

Alert when a rollback happens:

```yaml
- name: Rollback
  if: failure()
  run: |
    kubectl rollout undo deployment/myapp
    
    # Alert team
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -H 'Content-type: application/json' \
      -d '{
        "text": "⚠️ ROLLBACK triggered for myapp!\nCommit: ${{ github.sha }}\nAuthor: ${{ github.actor }}"
      }'
    
    # Create GitHub issue
    gh issue create \
      --title "Production rollback: ${{ github.sha }}" \
      --body "Automatic rollback triggered. Investigate immediately." \
      --label "production,incident"
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

# Company Example — BookMyShow

BookMyShow's deployment monitoring:

```yaml
post-deploy:
  runs-on: ubuntu-latest
  needs: deploy
  steps:
    - name: Health check
      run: |
        for i in {1..5}; do
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.bookmyshow.com/health)
          [ "$STATUS" == "200" ] && break
          sleep 10
        done
        [ "$STATUS" != "200" ] && exit 1

    - name: Smoke test booking flow
      run: |
        # Synthetic transaction test
        RESULT=$(curl -s -X POST https://api.bookmyshow.com/booking/test)
        echo $RESULT | jq -e '.status == "ok"'

    - name: Alert on success
      run: |
        curl -X POST $SLACK_WEBHOOK \
          -d '{"text": "🎬 BookMyShow v${{ github.sha }} live in production!"}'

    - name: Auto rollback and alert on failure
      if: failure()
      run: |
        kubectl rollout undo deployment/bms-api
        curl -X POST $SLACK_WEBHOOK \
          -d '{"text": "🚨 ROLLBACK: BookMyShow booking API! @oncall"}'
```

---

# Interview Questions

## Q1. What should you monitor in a CI/CD pipeline?

**Best Answer**

> Monitor pipeline metrics (build success rate, build duration, deployment frequency, failure rate) and post-deployment application metrics (HTTP error rate, response latency, CPU/memory). Set up Slack/email notifications for failures and automatic rollbacks when health checks fail. Track DORA metrics: Deployment Frequency, Lead Time, MTTR, Change Failure Rate.

---

## Q2. What is a smoke test in CI/CD?

A quick sanity check run immediately after deployment to verify the application is alive and basic functionality works. It's a "does the engine start?" test — not comprehensive, but fast enough to catch catastrophic failures in seconds.

---

## Q3. How do you implement automatic rollback?

In the pipeline, after deployment, run health checks and smoke tests. If they fail (using `if: failure()`), trigger `kubectl rollout undo deployment/myapp`. Simultaneously notify the team via Slack with the specific commit and author information.

---

## Q4. What are DORA metrics?

DevOps Research and Assessment (DORA) metrics: Deployment Frequency (how often you deploy), Lead Time for Changes (code commit → production), Mean Time to Recovery (incident → resolved), and Change Failure Rate (% of deploys causing incidents). Elite teams score high on all four.

---

# Professional Summary

```
Pipeline Monitoring:

Notifications:
  Slack: slackapi/slack-github-action
  Email: emailext in Jenkins
  Badges: GitHub workflow badge in README

Post-deploy health checks:
  curl /health → expect 200
  smoke tests → critical paths working
  error rate check → < 1%

Auto-rollback:
  if: failure()
  kubectl rollout undo deployment/app

DORA Metrics to track:
  Deployment Frequency
  Lead Time for Changes
  MTTR (Mean Time to Recovery)
  Change Failure Rate

Tools:
  Prometheus + Grafana → metrics dashboards
  GitHub Insights → pipeline analytics
  JUnit reports → test visibility in PRs
```
