Welcome to **Chapter 8 — Runners**.

> **Runners are the machines that execute your pipeline jobs. Choosing the right runner — GitHub-hosted vs self-hosted — is a critical DevOps decision.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you need someone to bake your cake recipe.

**Option 1 — Hire from an agency (GitHub-hosted):**

```
✅ Ready immediately
✅ They bring their own kitchen
✅ You just pay per hour
✅ No maintenance
❌ Shared kitchen (strangers might use it too)
❌ Can't customize the kitchen
```

**Option 2 — Use your own kitchen (self-hosted):**

```
✅ Your private kitchen
✅ Fully customized equipment
✅ No hourly cost (you own it)
❌ You maintain the kitchen
❌ You pay for electricity/rent
```

GitHub-hosted = rented kitchen.

Self-hosted = your own kitchen.

---

# What is a Runner?

A **runner** is a server (virtual machine) that executes your pipeline jobs.

```
Your code → GitHub Actions → sends job to Runner
                                     ↓
                              Runner runs steps
                                     ↓
                              Reports results back
```

---

# GitHub-Hosted Runners

Virtual machines provided and managed by GitHub.

**Available machines:**

```yaml
runs-on: ubuntu-latest     # Ubuntu 22.04 (most popular)
runs-on: ubuntu-22.04      # Specific version
runs-on: ubuntu-20.04
runs-on: windows-latest    # Windows Server 2022
runs-on: windows-2022
runs-on: windows-2019
runs-on: macos-latest      # macOS 14 (Sonoma)
runs-on: macos-14
runs-on: macos-13
runs-on: macos-12
```

**Specs (ubuntu-latest):**

```
CPU:     2-core CPU
RAM:     7 GB
Storage: 14 GB SSD
```

**Pre-installed tools:**

```
Node.js, Python, Java, Go, Ruby
Docker, kubectl, Helm
git, curl, wget, zip
AWS CLI, Azure CLI, GCP SDK
Maven, Gradle, npm, pip
```

---

# GitHub-Hosted Pricing

```
Free tier:
  Public repos:  Unlimited
  Private repos: 2,000 minutes/month

Paid:
  Linux:   $0.008 / minute
  Windows: $0.016 / minute  (2× Linux)
  macOS:   $0.08 / minute   (10× Linux)
```

---

# Self-Hosted Runners

Your own server registered with GitHub.

**Why use self-hosted:**

```
✅ Access to private network/databases
✅ More CPU/RAM than GitHub-hosted
✅ Specific hardware (GPU for ML)
✅ Cheaper for heavy usage
✅ Custom software pre-installed
✅ No minute limits
✅ Data stays on your infrastructure
```

---

# Setting Up a Self-Hosted Runner

**Step 1** — Go to your repo:

```
Settings → Actions → Runners → New self-hosted runner
```

**Step 2** — Choose OS (Linux):

**Step 3** — GitHub shows you commands to run:

```bash
# Download
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure (connects to your GitHub repo)
./config.sh --url https://github.com/org/repo --token YOUR_TOKEN

# Run as a service
sudo ./svc.sh install
sudo ./svc.sh start
```

**Step 4** — Use in workflow:

```yaml
jobs:
  build:
    runs-on: self-hosted    # Uses your server
```

---

# Runner Labels

Add custom labels to runners:

```bash
./config.sh --labels production,gpu,high-memory
```

Use in workflow:

```yaml
runs-on: [self-hosted, production]
runs-on: [self-hosted, gpu]
runs-on: [self-hosted, linux, high-memory]
```

---

# Runner Groups

Organize runners for different teams:

```
Organization Settings → Actions → Runner Groups

  group: frontend-team  → runners for frontend
  group: backend-team   → runners for backend
  group: production     → runners for prod deploys
```

---

# Larger GitHub-Hosted Runners (Paid)

GitHub also offers larger machines:

```yaml
runs-on: ubuntu-latest-4-cores    # 4 cores, 16 GB RAM
runs-on: ubuntu-latest-8-cores    # 8 cores, 32 GB RAM
runs-on: ubuntu-latest-16-cores   # 16 cores, 64 GB RAM
```

More expensive but faster for big builds.

---

# Runner Environment Comparison

| Feature | GitHub-Hosted | Self-Hosted |
| --- | --- | --- |
| Setup | Zero setup | Manual setup |
| Maintenance | GitHub manages | You manage |
| Cost | Free tier + pay per min | Your server cost |
| Network access | Public internet | Private network |
| Performance | Fixed (2-core) | Custom (as powerful as you want) |
| Security | Shared infrastructure | Your infrastructure |
| Minutes | Limited (free tier) | Unlimited |
| Custom software | Use `run: apt-get install` | Pre-install on runner |

---

# Container Jobs

Run the job inside a Docker container instead of the raw VM:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: node:18-alpine        # Job runs inside this container
      options: --user node

    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

Benefits:

```
✅ Exact environment control
✅ No version conflicts with pre-installed tools
✅ Reproducible environment
```

---

# Service Containers

Spin up services (databases, caches) alongside your job:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: secret
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s

      redis:
        image: redis:7
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4
      - run: npm test
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          REDIS_URL: redis://localhost:6379
```

Tests run against real PostgreSQL and Redis.

---

# Company Example — Meesho

Meesho runs integration tests against real databases:

```yaml
jobs:
  integration-test:
    runs-on: self-hosted    # Their own server in AWS VPC
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: ${{ secrets.TEST_DB_PASSWORD }}
      redis:
        image: redis:7

    steps:
      - uses: actions/checkout@v4
      - run: npm run test:integration
        env:
          DB_URL: postgresql://postgres:${{ secrets.TEST_DB_PASSWORD }}@localhost:5432/test
          REDIS_URL: redis://localhost:6379
```

Self-hosted runner has access to Meesho's VPC.

Can connect to internal databases.

GitHub-hosted runners cannot.

---

# Interview Questions

## Q1. What is a GitHub Actions runner?

**Best Answer**

> A runner is a server that executes workflow jobs. GitHub-hosted runners are VMs provided by GitHub (Ubuntu, Windows, macOS) with pre-installed tools — zero setup, pay per minute. Self-hosted runners are your own servers registered with GitHub — more powerful, no minute limits, access to private networks, but you manage them.

---

## Q2. When should you use a self-hosted runner?

When you need access to private networks or databases, need more CPU/RAM than GitHub provides, have heavy usage that would be expensive with per-minute billing, need specific hardware (like GPUs for ML), or have security/compliance requirements to keep code on your own infrastructure.

---

## Q3. What is a service container in GitHub Actions?

A service container is a Docker container that runs alongside the job container to provide services like databases or message queues. Used for integration testing against real databases without mocking.

---

## Q4. What is a container job?

Using `container:` in a job definition runs all steps inside a specified Docker container instead of directly on the runner VM. This gives precise control over the runtime environment.

---

# Professional Summary

```
Runners:

GitHub-Hosted:
  runs-on: ubuntu-latest      ← most used
  runs-on: windows-latest
  runs-on: macos-latest
  Free: 2000 min/month (private)
  Unlimited: public repos

Self-Hosted:
  runs-on: self-hosted
  runs-on: [self-hosted, production]
  Your machine → more power, private network, no limits

Container Jobs:
  container:
    image: node:18

Service Containers:
  services:
    postgres:
      image: postgres:15
    redis:
      image: redis:7
```
