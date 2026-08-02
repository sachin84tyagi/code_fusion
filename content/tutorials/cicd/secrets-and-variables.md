Welcome to **Chapter 9 — Secrets and Variables**.

> **Secrets and variables are how you pass sensitive data like passwords, API keys, and tokens into your pipeline safely. This is one of the most critical security topics in CI/CD.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine writing a password in a letter.

```
❌ Wrong way:
Letter says: "My ATM PIN is 1234"

✅ Right way:
Letter says: "My ATM PIN is [SECRET]"
And you keep the PIN in a safe separately.
Only the right person opens the safe.
```

In CI/CD:

```
❌ Wrong:
  DB_PASSWORD=mypassword123

✅ Right:
  DB_PASSWORD=${{ secrets.DB_PASSWORD }}
  (actual password stored safely in GitHub)
```

---

# The Problem — Hardcoded Secrets

```yaml
# ❌ NEVER DO THIS
steps:
  - run: |
      docker login -u admin -p MyPassword123
      kubectl --token=abc123xyz deploy
      aws --secret-key=ASIAIOSFODNN7EXAMPLE deploy
```

Problems:

```
❌ Password visible in workflow file (in Git!)
❌ Anyone with repo access sees it
❌ Logs might expose it
❌ Changing password requires editing code
```

---

# GitHub Secrets

Encrypted values stored in GitHub.

Never exposed in logs.

Never visible after setting.

---

# Setting Up Secrets

**Repository Secrets:**

```
GitHub repo → Settings → Secrets and variables → Actions
→ New repository secret
→ Name: DB_PASSWORD
→ Value: myActualPassword123
```

**Organization Secrets:**

```
GitHub organization → Settings → Secrets
→ Can be shared across multiple repos
```

**Environment Secrets:**

```
GitHub repo → Settings → Environments → Create Environment
→ Secrets for that environment only (staging, production)
```

---

# Using Secrets in Workflow

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Login to Docker Hub
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | \
            docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Deploy with API key
        run: ./deploy.sh
        env:
          API_KEY: ${{ secrets.PRODUCTION_API_KEY }}
          DB_URL: ${{ secrets.DATABASE_URL }}
```

Secrets are **masked in logs**:

```
# GitHub automatically replaces secret values in logs:
Run ./deploy.sh
  DB_URL: ***
  API_KEY: ***
```

---

# Variables (Non-Secret Configuration)

For non-sensitive values, use **Variables** instead of Secrets.

```
GitHub repo → Settings → Secrets and variables → Actions → Variables tab
→ New repository variable
→ Name: NODE_VERSION
→ Value: 18
```

Access in workflow:

```yaml
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ vars.NODE_VERSION }}
```

Difference from secrets:

```
Secrets   → Encrypted, never shown in logs
Variables → Plaintext, visible in logs (OK for non-sensitive)
```

---

# Environment Variables vs Secrets vs Variables

```
GitHub Secrets  → Sensitive: passwords, API keys, tokens
GitHub Variables → Non-sensitive: versions, feature flags, URLs
Workflow env:   → Simple values in the YAML itself
Runner env:     → Passed with -e flag or env: in step
```

---

# Common Secrets to Configure

```
DOCKER_USERNAME          → Docker Hub login
DOCKER_PASSWORD          → Docker Hub password
AWS_ACCESS_KEY_ID        → AWS access
AWS_SECRET_ACCESS_KEY    → AWS secret
GCP_SERVICE_ACCOUNT_KEY  → GCP JSON key
KUBECONFIG               → Kubernetes config
DATABASE_URL             → DB connection string
SLACK_WEBHOOK_URL        → Slack notifications
NPM_TOKEN                → Private npm registry
GITHUB_TOKEN             → Auto-provided by GitHub
```

---

# GITHUB_TOKEN — The Built-In Secret

GitHub automatically provides `GITHUB_TOKEN` in every workflow.

You don't need to create it.

```yaml
steps:
  - name: Create Release
    uses: actions/create-release@v1
    with:
      tag_name: ${{ github.ref }}
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Auto-provided!
```

Permissions by default:

```
read access to: code, issues, PRs, metadata
write access to: actions, checks, deployments, issues, PRs, releases
```

---

# Scoping Permissions

Limit `GITHUB_TOKEN` permissions for security:

```yaml
permissions:
  contents: read      # Can read repo
  packages: write     # Can push to GitHub Packages
  pull-requests: write  # Can comment on PRs

jobs:
  build:
    permissions:
      contents: read   # Override at job level
```

---

# Secrets in Environment Scopes

Different secrets for staging vs production:

**GitHub Environments:**

```
Settings → Environments

Environment: staging
  Secrets:
    DB_URL = postgresql://staging-db:5432/app

Environment: production
  Secrets:
    DB_URL = postgresql://prod-db:5432/app
  Protection rules:
    Required reviewers: [senior-dev, tech-lead]
```

**In workflow:**

```yaml
jobs:
  deploy-staging:
    environment: staging    # Uses staging secrets
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
        env:
          DB_URL: ${{ secrets.DB_URL }}   # Gets staging DB_URL

  deploy-production:
    environment: production  # Uses production secrets + requires approval
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
        env:
          DB_URL: ${{ secrets.DB_URL }}   # Gets production DB_URL
```

Reviewer must approve before production job runs.

---

# Passing Secrets Between Steps

Secrets in `env:` are available as environment variables:

```yaml
steps:
  - name: Build
    run: |
      export DATABASE_URL=${{ secrets.DATABASE_URL }}
      npm run build

  - name: Test
    run: npm test
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      REDIS_URL: ${{ secrets.REDIS_URL }}
```

---

# Never Print Secrets

```yaml
# ❌ NEVER DO THIS
- run: echo "DB password is ${{ secrets.DB_PASSWORD }}"

# ❌ NEVER DO THIS
- run: env | grep DB

# ✅ Secrets are auto-masked in logs anyway
# But still — don't print them intentionally
```

---

# Company Example — PhonePe

PhonePe uses GitHub Environments with approval gates:

```yaml
jobs:
  deploy-prod:
    environment: production     # Requires 2 senior engineers to approve
    runs-on: ubuntu-latest
    steps:
      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.PROD_AWS_ACCESS_KEY }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.PROD_AWS_SECRET_KEY }}

      - name: Deploy payment service
        run: |
          kubectl set image deployment/payment \
            payment=${{ secrets.ECR_REGISTRY }}/payment:${{ github.sha }}
        env:
          KUBECONFIG_DATA: ${{ secrets.PROD_KUBECONFIG }}
```

Payment service requires 2 senior engineers to approve before production deploy.

---

# Interview Questions

## Q1. How do you handle secrets in GitHub Actions?

**Best Answer**

> Store sensitive values (passwords, API keys, tokens) as GitHub Secrets in repository settings. Access them in workflows with `${{ secrets.SECRET_NAME }}`. GitHub automatically masks secret values in logs. Never hardcode secrets in workflow files. For environment-specific secrets, use GitHub Environments which also support required reviewer approvals.

---

## Q2. What is the difference between GitHub Secrets and Variables?

Secrets are encrypted and never shown in logs — for passwords, API keys, tokens. Variables are plaintext configuration values shown in logs — for non-sensitive values like version numbers, feature flags, or configuration URLs.

---

## Q3. What is `GITHUB_TOKEN`?

An automatically provided secret in every GitHub Actions run. It authenticates the workflow with GitHub APIs. Used for creating releases, commenting on PRs, pushing to GitHub Packages. Permissions can be scoped in the workflow file.

---

## Q4. What are GitHub Environments?

Named deployment environments (staging, production) with their own secrets, variables, and protection rules. Protection rules can require specific reviewers to approve before a job using that environment runs — critical for production deployments.

---

# Professional Summary

```
Secrets → GitHub Settings → Secrets and variables

Access: ${{ secrets.MY_SECRET }}
Auto-masked in logs ✅

Variables (non-sensitive):
  ${{ vars.MY_VAR }}

Built-in:
  ${{ secrets.GITHUB_TOKEN }}  → auto-provided

Environments:
  environment: production
  → Uses production secrets
  → Can require approval before running

Best practices:
  ❌ Never hardcode in YAML
  ❌ Never echo secrets
  ✅ Use GitHub Secrets
  ✅ Use Environments for staging/prod split
  ✅ Minimal permissions (principle of least privilege)
```
