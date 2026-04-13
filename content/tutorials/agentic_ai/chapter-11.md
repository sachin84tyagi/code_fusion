# 🤖 Agentic AI Full Stack Developer Course
## Chapter 11: Deploying Agents to Production

> **Professor's Note:** Congratulations — your agent works perfectly on localhost. It passes all your eval tests. The demo was flawless. The VP of Product is excited. You push to production. And then: it goes down at 2:47am on a Sunday because you hardcoded `max_workers=1` and the first real traffic spike filled your single thread queue and started throwing 500s. Or worse — someone notices that you're logging the raw OpenAI API key from your `.env` file into CloudWatch, and now it's in your logs, and someone on your DevOps team can see it, and your company's security policy just got violated. Welcome to the gap between "it works" and "it runs." This chapter closes that gap. We Dockerize your agent, deploy it properly, make it cost-efficient, and instrument it so you know *exactly* what it is doing at all times. Buckle up — this is where engineering actually happens. 🚀🔧

---

```
╔══════════════════════════════════════════════════════════════╗
║  📦 CHAPTER 11 AT A GLANCE                                  ║
╠══════════════════════════════════════════════════════════════╣
║  🐳  Dockerizing your agent — multi-stage production build  ║
║  ☁️   Deploying to AWS (ECS Fargate) — step by step         ║
║  🌐  Deploying to GCP (Cloud Run) — the simpler path        ║
║  💰  Cost management — budgets, alerts, per-request cost    ║
║  ⚡  Token optimization — get the same result, cheaper      ║
║  📊  Observability — structured logs, traces, dashboards    ║
║  🚨  Alerting & incident response — know before users do    ║
║  🔄  CI/CD pipeline — GitHub Actions end-to-end            ║
║  📝  Quiz — 5 questions                                     ║
║  👀  Chapter 12 preview — Fine-Tuning & Custom Models       ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 📋 Table of Contents

1. [Production Architecture Overview](#1-production-architecture-overview)
2. [Dockerizing Your Agent — Multi-Stage Build](#2-dockerizing-your-agent--multi-stage-build)
3. [Deploying to AWS — ECS Fargate](#3-deploying-to-aws--ecs-fargate)
4. [Deploying to GCP — Cloud Run (The Simpler Path)](#4-deploying-to-gcp--cloud-run-the-simpler-path)
5. [Secrets Management — Never Hardcode Again](#5-secrets-management--never-hardcode-again)
6. [Cost Management & Budgets](#6-cost-management--budgets)
7. [Token Optimization — Same Results, Lower Cost](#7-token-optimization--same-results-lower-cost)
8. [Observability — Logs, Traces, and Metrics](#8-observability--logs-traces-and-metrics)
9. [Alerting & Incident Response](#9-alerting--incident-response)
10. [CI/CD Pipeline — GitHub Actions End-to-End](#10-cicd-pipeline--github-actions-end-to-end)
11. [Mini Quiz](#11-mini-quiz)
12. [Chapter 12 Preview](#12-chapter-12-preview)

---

## 1. Production Architecture Overview

Let's start with the full picture — what does a production agent system actually look like?

```
PRODUCTION AGENT ARCHITECTURE:
════════════════════════════════════════════════════════════════

  INTERNET
      │
      ▼
  ┌──────────────────────────────────────────────┐
  │  CDN / WAF  (CloudFront / Cloud Armor)       │
  │  • DDoS protection                           │
  │  • Rate limiting at edge                     │
  │  • Static asset caching                      │
  └──────────────────┬───────────────────────────┘
                     │
                     ▼
  ┌──────────────────────────────────────────────┐
  │  LOAD BALANCER  (ALB / Cloud Load Balancer)  │
  │  • Health checks every 30s                   │
  │  • Routes to healthy replicas only           │
  │  • SSL termination                           │
  └──────┬──────────────────┬────────────────────┘
         │                  │
         ▼                  ▼
  ┌────────────┐    ┌────────────┐    ┌── (auto-scaled replicas)
  │  Agent     │    │  Agent     │    │
  │  Container │    │  Container │    │   Each container:
  │  (replica  │    │  (replica  │    │   • FastAPI app
  │  1/3)      │    │  2/3)      │    │   • ReAct agent
  └────┬───────┘    └────┬───────┘    │   • Safety guardrails
       │                 │            │   • Structured logging
       └─────────────────┘
                │
                ▼
  ┌─────────────────────────────────────────────┐
  │  INTERNAL SERVICES (same VPC / VPC peering) │
  ├────────────┬────────────┬───────────────────┤
  │  OpenAI   │  Database  │  Cache (Redis)    │
  │  API      │  (RDS/     │  • Session data   │
  │  (egress  │  Cloud     │  • Rate limit     │
  │  only)    │  SQL)      │    counters        │
  └────────────┴────────────┴───────────────────┤
  │  Secrets Manager   │  Message Queue         │
  │  • API keys        │  (SQS / Pub/Sub)       │
  │  • DB passwords    │  • Async workflows     │
  └────────────────────┴────────────────────────┘
                │
                ▼
  ┌─────────────────────────────────────────────┐
  │  OBSERVABILITY STACK                        │
  ├─────────────┬─────────────┬─────────────────┤
  │  Logs       │  Traces     │  Metrics        │
  │  (CloudWatch│  (X-Ray /   │  (CloudWatch /  │
  │  / Cloud    │  Cloud      │  Grafana /      │
  │  Logging)   │  Trace)     │  Prometheus)    │
  └─────────────┴─────────────┴─────────────────┘
                │
                ▼
  ┌─────────────────────────────────────────────┐
  │  ALERTING  (PagerDuty / OpsGenie)           │
  │  • Error rate > 1% → SMS + Slack            │
  │  • Cost > $X/day → email                    │
  │  • P99 latency > 10s → page on-call         │
  └─────────────────────────────────────────────┘


  KEY DESIGN PRINCIPLES:
  ─────────────────────────────────────────────────────────
  1. Stateless containers — session state lives in Redis/DB,
     not container memory. Any container can serve any request.

  2. Secrets never in environment variables directly —
     fetched from Secrets Manager at startup (or runtime).

  3. Health check tests the LLM connection —
     not just "is the HTTP server running?"

  4. Graceful shutdown — finish in-flight requests before dying.
     Containers get SIGTERM, have 30s to finish, then SIGKILL.

  5. Idempotent startup — running the same container twice
     produces the same result. No "it worked on the first restart
     but not the second."
```

---

## 2. Dockerizing Your Agent — Multi-Stage Build

```
WHY MULTI-STAGE?
════════════════════════════════════════════════════════════════

  SINGLE STAGE (bad):              MULTI-STAGE (good):
  ┌──────────────────┐             ┌──────────────────┐
  │  Python 3.12     │             │  Stage 1: builder │
  │  + gcc           │◄ 1.8GB     │  Python + gcc     │
  │  + pip tools     │             │  Compiles deps    │
  │  + your code     │             └────────┬─────────┘
  │  + all source    │                      │ COPY only
  └──────────────────┘                      │ compiled artifacts
                                   ┌────────▼─────────┐
                                   │  Stage 2: runtime │
                                   │  Python slim       │◄ 180MB
                                   │  + your code only  │
                                   │  No gcc, no source │
                                   └──────────────────┘

  180MB vs 1.8GB = 10x smaller image = faster pulls = cheaper registry
```

```dockerfile
# =========================================================
# FILE: Dockerfile
# Multi-stage production Docker build for your AI agent.
# Run: docker build -t my-agent:latest .
#      docker run -p 8000:8000 --env-file .env my-agent:latest
# =========================================================

# ────────────────────────────────────────────────────────
# STAGE 1: builder
# This stage installs all dependencies (including compile tools).
# We keep this large — it's temporary, never pushed to registry.
# ────────────────────────────────────────────────────────
FROM python:3.12-slim AS builder

# Install system build tools needed to compile Python packages
# (some packages like cryptography need gcc)
RUN apt-get update && apt-get install -y \
    gcc       \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*   # clean up apt cache immediately

# Create a virtual environment inside the builder stage.
# This makes copying to the runtime stage clean and simple.
RUN python -m venv /opt/venv

# Activate the venv for all subsequent pip operations
ENV PATH="/opt/venv/bin:$PATH"

# Copy ONLY the requirements file first.
# Docker caches this layer separately — if your requirements don't change,
# this entire expensive pip install step is skipped on rebuilds. ← KEY optimization
COPY requirements.txt .

# Install all Python dependencies into the venv
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


# ────────────────────────────────────────────────────────
# STAGE 2: runtime
# This is the image that actually runs in production.
# Starts fresh — only copies the compiled artifacts from builder.
# NO gcc, NO build tools, NO source files, NO dev dependencies.
# ────────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

# ← Security hardening: don't run as root in production containers.
# If someone exploits your app, they get a low-privilege user,
# not root access to your container/host.
RUN groupadd -r agentuser && useradd -r -g agentuser agentuser

# Copy ONLY the compiled virtual environment from the builder stage.
# This includes all installed packages but NOT build tools.
COPY --from=builder /opt/venv /opt/venv

# Set working directory
WORKDIR /app

# Copy application source code
# Order matters: copy things that change frequently LAST
# (maximizes layer cache hits)
COPY --chown=agentuser:agentuser . .

# Make the venv's Python the default
ENV PATH="/opt/venv/bin:$PATH"

# Non-secret runtime configuration
# (secrets come from environment variables at runtime, NOT baked in)
ENV PYTHONUNBUFFERED=1       \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Switch to non-root user
USER agentuser

# Expose port (documentation only — doesn't actually open it)
EXPOSE 8000

# Health check: Docker/ECS calls this URL to verify the container is healthy
# 30s startup grace, then every 30s → 3 failures = unhealthy → replaced
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Use exec form (not shell form) so signals reach the actual process,
# not a shell wrapper. This is critical for graceful shutdown.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", \
     "--workers", "2", "--timeout-keep-alive", "75"]
```

```
# =========================================================
# FILE: .dockerignore
# Prevents secrets, dev files, and large dirs from entering the image.
# Like .gitignore but for Docker build context.
# =========================================================
.git
.gitignore
.env
.env.*
__pycache__
*.pyc
*.pyo
*.pyd
.pytest_cache
.coverage
htmlcov/
*.egg-info
dist/
build/
node_modules/
.venv
venv/
*.log
*.db
sessions.db
idempotency.db
benchmarks/
eval_history/
.DS_Store
Thumbs.db
README.md
docs/
tests/
# Never include these in an image:
*.key
*.pem
*.p12
secrets/
```

```ini
# =========================================================
# FILE: requirements.txt
# Pin ALL versions. Unlike dev dependencies, production
# requirements must be deterministic across every build.
# =========================================================
fastapi==0.115.0
uvicorn[standard]==0.30.6
openai==1.51.0
pydantic==2.9.2
pydantic-settings==2.5.2
python-dotenv==1.0.1
apscheduler==3.10.4
boto3==1.35.36          # AWS SDK (Secrets Manager, SQS, S3, etc.)
redis==5.1.1
structlog==24.4.0       # Structured JSON logging
prometheus-client==0.21.0  # Metrics endpoint (/metrics for Prometheus)
opentelemetry-api==1.27.0
opentelemetry-sdk==1.27.0
opentelemetry-instrumentation-fastapi==0.48b0
```

Now let's build the production-hardened `main.py` that handles everything properly:

```python
# =========================================================
# FILE: main.py
# Production FastAPI app wrapping the AI agent.
# Handles: graceful shutdown, health checks, structured logging,
# secrets management, connection pooling, CORS.
# =========================================================

import os
import asyncio
import signal
import logging
import time
from contextlib import asynccontextmanager
from typing import Optional

import structlog
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from openai import AsyncOpenAI

from config      import settings           # our Pydantic settings class
from observability import setup_telemetry, get_logger
from secrets_manager import get_secret


# ─── Structured logging setup ──────────────────────────
# structlog gives us JSON logs like:
# {"event": "request_start", "method": "POST", "path": "/chat", "ts": "..."}
# These are machine-parseable → easy to query in CloudWatch / Datadog
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.add_log_level,
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.BoundLogger,
    logger_factory=structlog.PrintLoggerFactory(),
)
log = structlog.get_logger()


# ─── Lifespan: startup and shutdown logic ──────────────
# FastAPI lifespan replaces @app.on_event("startup"|"shutdown")
# Everything before `yield` = startup; after yield = shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── STARTUP ────────────────────────────────────────────
    log.info("agent_startup", version=settings.version)

    # 1. Fetch secrets from AWS Secrets Manager (NOT from env vars)
    # We do this at startup so we fail fast if secrets aren't available
    try:
        api_key = await get_secret(settings.openai_secret_name)
        app.state.openai_client = AsyncOpenAI(api_key=api_key)
        log.info("openai_client_initialized")
    except Exception as e:
        log.error("secret_fetch_failed", error=str(e))
        raise RuntimeError(f"Cannot start without OpenAI API key: {e}")

    # 2. Test the LLM connection (not just HTTP — the actual API)
    try:
        await app.state.openai_client.models.list()
        log.info("openai_connection_verified")
    except Exception as e:
        log.error("openai_connection_failed", error=str(e))
        raise RuntimeError(f"OpenAI API unreachable: {e}")

    # 3. Set up telemetry (OpenTelemetry tracing)
    setup_telemetry(app)

    # 4. Mark app as ready to serve traffic
    app.state.ready = True
    log.info("agent_ready", port=settings.port)

    yield   # ← app runs here — everything below runs on shutdown

    # ── SHUTDOWN (graceful) ────────────────────────────────
    # SIGTERM arrives → FastAPI stops accepting new requests →
    # waits for in-flight requests to finish → reaches here → cleans up
    log.info("agent_shutdown_start")
    app.state.ready = False

    # Give in-flight requests up to 30s to complete
    # In practice uvicorn's --timeout-graceful-shutdown handles this,
    # but we can do explicit cleanup here too
    if hasattr(app.state, "openai_client"):
        await app.state.openai_client.close()

    log.info("agent_shutdown_complete")


# ─── FastAPI app ──────────────────────────────────────
app = FastAPI(
    title       = "AI Agent API",
    version     = "1.0.0",
    lifespan    = lifespan,
    docs_url    = "/docs" if os.getenv("ENV") != "production" else None,  # hide Swagger in prod
    redoc_url   = None,
)

# CORS: only allow your actual frontend domain in production
app.add_middleware(
    CORSMiddleware,
    allow_origins     = settings.cors_origins,      # e.g. ["https://app.mycompany.com"]
    allow_credentials = True,
    allow_methods     = ["GET", "POST"],
    allow_headers     = ["*"],
)


# ─── Request/response logging middleware ──────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log every request with timing. This is your access log."""
    start    = time.monotonic()
    response = await call_next(request)
    elapsed  = time.monotonic() - start

    log.info("http_request",
        method       = request.method,
        path         = request.url.path,
        status       = response.status_code,
        duration_ms  = round(elapsed * 1000, 1),
        user_agent   = request.headers.get("user-agent", ""),
        request_id   = request.headers.get("x-request-id", ""),
    )
    return response


# ─── Health check endpoints ───────────────────────────
@app.get("/health")
async def health():
    """
    Liveness check: "Is the process running?"
    Called by Docker HEALTHCHECK and ALB every 30s.
    Should return 200 as long as the process is alive.
    Keep this FAST — it runs every 30 seconds.
    """
    return {"status": "alive"}


@app.get("/health/ready")
async def readiness(request: Request):
    """
    Readiness check: "Is the app ready to serve traffic?"
    Called by Kubernetes/ECS to decide whether to route traffic here.
    Returns 503 during startup or if a dependency is down.

    IMPORTANT distinction:
    - Liveness = is the container alive? (restart if not)
    - Readiness = can it handle traffic? (stop routing if not)
    These are DIFFERENT. A container can be alive but not ready.
    """
    if not getattr(request.app.state, "ready", False):
        raise HTTPException(status_code=503, detail="Not ready yet")
    return {"status": "ready"}


# ─── Models ───────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


# ─── Chat endpoint ────────────────────────────────────
@app.post("/chat")
async def chat(body: ChatRequest, request: Request):
    """Main agent endpoint."""
    client = request.app.state.openai_client

    start   = time.monotonic()
    log.info("chat_start", session_id=body.session_id, msg_len=len(body.message))

    try:
        resp = await client.chat.completions.create(
            model      = settings.model,
            messages   = [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user",   "content": body.message},
            ],
            max_tokens = settings.max_tokens,
        )

        output     = resp.choices[0].message.content
        usage      = resp.usage
        elapsed_ms = round((time.monotonic() - start) * 1000, 1)

        log.info("chat_complete",
            session_id    = body.session_id,
            prompt_tokens = usage.prompt_tokens,
            output_tokens = usage.completion_tokens,
            cost_usd      = _estimate_cost(usage.prompt_tokens, usage.completion_tokens),
            duration_ms   = elapsed_ms,
        )

        return {
            "response": output,
            "usage":    {"prompt_tokens": usage.prompt_tokens,
                         "completion_tokens": usage.completion_tokens},
        }

    except Exception as e:
        log.error("chat_error", error=str(e), session_id=body.session_id)
        raise HTTPException(status_code=500, detail="Agent internal error")


def _estimate_cost(prompt_tokens: int, completion_tokens: int) -> float:
    """Estimate cost in USD for gpt-4o-mini."""
    # gpt-4o-mini: $0.15/M input, $0.60/M output (as of 2024)
    return round(
        (prompt_tokens    / 1_000_000) * 0.15 +
        (completion_tokens / 1_000_000) * 0.60,
        6
    )
```

```python
# =========================================================
# FILE: config.py
# Pydantic Settings — all configuration in one place.
# Reads from environment variables (or .env in development).
# pip install pydantic-settings
# =========================================================

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import list


class Settings(BaseSettings):
    """
    All application configuration.
    Values come from environment variables (UPPERCASE).
    Default values are for local development only.

    Production workflow:
    1. Set these as ECS task environment variables (non-secret)
    2. Secrets (API keys, DB passwords) come from Secrets Manager
       (see secrets_manager.py) — never put them here.
    """

    model_config = SettingsConfigDict(
        env_file       = ".env",         # only used in local dev
        env_file_encoding = "utf-8",
        case_sensitive = False,
    )

    # App meta
    version:   str = "1.0.0"
    env:       str = "development"    # "development" | "staging" | "production"
    port:      int = 8000

    # OpenAI — name of the secret in AWS Secrets Manager, NOT the key itself
    openai_secret_name: str = "myapp/openai-api-key"
    model:              str = "gpt-4o-mini"
    max_tokens:         int = 1000

    # CORS — allowed frontend origins
    cors_origins: list[str] = ["http://localhost:5173"]

    # AWS
    aws_region: str = "us-east-1"

    # Redis (for session storage and rate limiting)
    redis_url: str = "redis://localhost:6379"

    # Observability
    log_level:       str  = "INFO"
    enable_tracing:  bool = True
    metrics_enabled: bool = True


settings = Settings()
```

---

## 3. Deploying to AWS — ECS Fargate

```
AWS ECS FARGATE ARCHITECTURE:
════════════════════════════════════════════════════════════════

  Your Machine          AWS
  ┌────────────┐        ┌─────────────────────────────────────┐
  │            │        │  ECR (Elastic Container Registry)   │
  │ Docker     │──push─►│  Your image lives here              │
  │ image      │        │  Tagged: my-agent:latest            │
  └────────────┘        └──────────────┬──────────────────────┘
                                       │ ECS pulls from ECR
                                       ▼
                        ┌─────────────────────────────────────┐
                        │  ECS Cluster (Fargate mode)         │
                        │  No servers to manage!              │
                        │  AWS manages the underlying VMs     │
                        │                                     │
                        │  ┌─────────────┐ ┌─────────────┐   │
                        │  │  Task 1     │ │  Task 2     │   │
                        │  │  0.5 vCPU   │ │  0.5 vCPU   │   │
                        │  │  1GB RAM    │ │  1GB RAM    │   │
                        │  │  my-agent   │ │  my-agent   │   │
                        │  └──────┬──────┘ └──────┬──────┘   │
                        └─────────┼────────────────┼──────────┘
                                  └────────┬────────┘
                                           │
                        ┌──────────────────▼──────────────────┐
                        │  Application Load Balancer (ALB)     │
                        │  • Distributes traffic               │
                        │  • Health checks containers          │
                        │  • SSL termination                   │
                        └──────────────────┬──────────────────┘
                                           │
                                       INTERNET
```

```yaml
# =========================================================
# FILE: aws/task-definition.json
# ECS Task Definition — tells ECS how to run your container.
# Think of this as docker-compose.yml but for AWS.
# Deploy: aws ecs register-task-definition --cli-input-json file://aws/task-definition.json
# =========================================================

{
  "family": "my-agent",
  "networkMode": "awsvpc",

  "requiresCompatibilities": ["FARGATE"],

  "cpu":    "512",     // 0.5 vCPU — scales in units of 256 (0.25 vCPU)
  "memory": "1024",    // 1 GB — must be matched to CPU (see AWS docs for valid combos)

  // IAM role that the ECS SERVICE uses to pull images, write logs, etc.
  "executionRoleArn": "arn:aws:iam::123456789:role/ecsTaskExecutionRole",

  // IAM role that your APPLICATION CODE assumes at runtime
  // This role needs: SecretsManagerReadWrite, CloudWatchLogs
  "taskRoleArn": "arn:aws:iam::123456789:role/ecsAgentTaskRole",

  "containerDefinitions": [
    {
      "name":  "agent",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/my-agent:latest",

      "portMappings": [
        {
          "containerPort": 8000,
          "protocol":      "tcp"
        }
      ],

      // ← Environment variables (non-secret config only)
      // Secrets come from "secrets" block below — never "environment"
      "environment": [
        {"name": "ENV",         "value": "production"},
        {"name": "AWS_REGION",  "value": "us-east-1"},
        {"name": "PORT",        "value": "8000"},
        {"name": "MODEL",       "value": "gpt-4o-mini"},
        {"name": "MAX_TOKENS",  "value": "1000"}
      ],

      // ← Secrets: fetched from Secrets Manager at task start
      // The VALUE is a Secrets Manager ARN, not the actual secret.
      // ECS fetches the real value and injects it as an env var.
      // Your app sees: os.environ["OPENAI_API_KEY"] = "sk-real-value"
      "secrets": [
        {
          "name":      "OPENAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:myapp/openai-api-key"
        }
      ],

      // CloudWatch Logs configuration
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group":         "/ecs/my-agent",
          "awslogs-region":        "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },

      // Memory and CPU limits per container
      // Hard limit: container is killed if it exceeds this
      "memory":            1024,
      "cpu":               512,

      // Health check: ECS runs this command to verify container health
      // Must match the /health endpoint in your FastAPI app
      "healthCheck": {
        "command":     ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"],
        "interval":    30,
        "timeout":     5,
        "retries":     3,
        "startPeriod": 30
      },

      // Graceful shutdown timeout: ECS waits this many seconds after SIGTERM
      // before sending SIGKILL. Give in-flight requests time to finish.
      "stopTimeout": 30,

      // Never run as root — matches the USER in our Dockerfile
      "user": "agentuser"
    }
  ]
}
```

```yaml
# =========================================================
# FILE: aws/service.json
# ECS Service definition — manages running tasks (replicas).
# Deploy: aws ecs create-service --cli-input-json file://aws/service.json
# =========================================================

{
  "cluster":        "my-agent-cluster",
  "serviceName":    "my-agent-service",
  "taskDefinition": "my-agent:latest",

  // How many replica containers to run
  "desiredCount": 2,     // minimum 2 for high availability

  "launchType": "FARGATE",

  "networkConfiguration": {
    "awsvpcConfiguration": {
      "subnets":         ["subnet-abc123", "subnet-def456"],    // private subnets
      "securityGroups":  ["sg-agent-container"],
      "assignPublicIp":  "DISABLED"                             // ← containers not public-facing
    }
  },

  // Connect to the Application Load Balancer
  "loadBalancers": [
    {
      "targetGroupArn": "arn:aws:elasticloadbalancing:...",
      "containerName":  "agent",
      "containerPort":  8000
    }
  ],

  // Auto-scaling: maintain between 2-10 containers based on CPU usage
  // ECS will automatically add containers when CPU > 70%, remove when < 30%
  "deploymentConfiguration": {
    "minimumHealthyPercent": 50,    // during deploy: keep at least 50% healthy
    "maximumPercent":        200    // during deploy: can briefly run 200% (for rolling updates)
  },

  // Rolling deploy strategy — zero-downtime updates
  "deploymentController": {
    "type": "ECS"    // "EXTERNAL" for blue-green with CodeDeploy
  }
}
```

```bash
# =========================================================
# FILE: aws/deploy.sh
# One-command deploy script.
# Usage: ./aws/deploy.sh [TAG]
# Example: ./aws/deploy.sh v1.2.3
# =========================================================

#!/bin/bash
set -e   # exit immediately on any error

TAG=${1:-latest}
AWS_REGION="us-east-1"
AWS_ACCOUNT="123456789"
ECR_REPO="my-agent"
ECS_CLUSTER="my-agent-cluster"
ECS_SERVICE="my-agent-service"
IMAGE="${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${TAG}"

echo "🚀 Deploying ${IMAGE} to ECS..."

# Step 1: Build the Docker image locally
echo "📦 Building Docker image..."
docker build --platform linux/amd64 -t "${ECR_REPO}:${TAG}" .
# ↑ --platform linux/amd64 is critical if you're on an M1/M2 Mac
# (Macs use ARM, ECS Fargate defaults to x86_64)

# Step 2: Authenticate Docker with ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} | \
    docker login --username AWS --password-stdin \
    "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Step 3: Tag and push to ECR
docker tag "${ECR_REPO}:${TAG}" "${IMAGE}"
docker push "${IMAGE}"
echo "✅ Image pushed to ECR: ${TAG}"

# Step 4: Update ECS service to use the new image
# This triggers a rolling deployment — ECS gradually replaces old tasks
echo "🔄 Updating ECS service..."
aws ecs update-service \
    --cluster  ${ECS_CLUSTER} \
    --service  ${ECS_SERVICE} \
    --force-new-deployment \
    --region   ${AWS_REGION}

# Step 5: Wait for the deployment to stabilize
echo "⏳ Waiting for deployment to complete (this takes ~2 minutes)..."
aws ecs wait services-stable \
    --cluster ${ECS_CLUSTER} \
    --services ${ECS_SERVICE} \
    --region ${AWS_REGION}

echo "✅ Deployment complete! Service is stable."

# Step 6: Verify health
echo "🏥 Checking health..."
TASK_ARN=$(aws ecs list-tasks \
    --cluster ${ECS_CLUSTER} \
    --service-name ${ECS_SERVICE} \
    --query 'taskArns[0]' \
    --output text)
echo "Running task: ${TASK_ARN}"
```

---

## 4. Deploying to GCP — Cloud Run (The Simpler Path)

```
WHY CLOUD RUN IS SIMPLER THAN ECS:
════════════════════════════════════════════════════════════════

  ECS Fargate:                     Cloud Run:
  ─────────────────────────        ─────────────────────────
  • Task definitions (JSON)        • Just: gcloud run deploy
  • Service definitions (JSON)     • Scales to 0 (pay per request)
  • Target groups → ALB            • Automatic HTTPS + domain
  • Security groups                • Built-in IAM auth
  • 15+ steps to deploy            • 3 commands to deploy
  • Always running (cost $$)       • Serverless (cost $0 when idle)

  When to use ECS: persistent workloads, complex networking,
                   existing AWS infrastructure, compliance requirements.

  When to use Cloud Run: new projects, variable traffic,
                         cost-sensitive, simpler operations.

  For agents that get ~1000 requests/day, Cloud Run is almost
  always the better choice. For 1M+ requests/day, ECS wins on cost.
```

```dockerfile
# Cloud Run requires one small change to your Dockerfile —
# use the PORT environment variable (Cloud Run sets this dynamically)

# In your Dockerfile CMD:
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

```bash
# =========================================================
# FILE: gcp/deploy.sh
# Deploy to Google Cloud Run.
# Prerequisites: gcloud CLI installed, gcloud auth login done.
# =========================================================

#!/bin/bash
set -e

PROJECT_ID="my-gcp-project"
REGION="us-central1"
SERVICE_NAME="my-agent"
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Deploying to Cloud Run..."

# Step 1: Build and push to Google Container Registry
# 'gcloud builds submit' builds the image in the cloud (no local Docker needed)
gcloud builds submit \
    --tag "${IMAGE}:latest" \
    --project "${PROJECT_ID}" \
    .

# Step 2: Deploy to Cloud Run
gcloud run deploy "${SERVICE_NAME}" \
    --image           "${IMAGE}:latest" \
    --platform        managed \
    --region          "${REGION}" \
    --allow-unauthenticated \              # set to --no-allow-unauthenticated for private
    --min-instances   1 \                 # keep 1 warm to avoid cold starts
    --max-instances   10 \                # scale up to 10 under load
    --concurrency     80 \                # each container handles up to 80 requests
    --cpu             1 \
    --memory          512Mi \
    --timeout         300s \              # max request timeout (agent can be slow)
    --project         "${PROJECT_ID}" \
    --set-env-vars    "ENV=production,MODEL=gpt-4o-mini" \
    --set-secrets     "OPENAI_API_KEY=openai-api-key:latest"
                   # ↑ GCP Secret Manager syntax: SECRET_ENV_VAR=secret-name:version

echo "✅ Deployed! Getting service URL..."
gcloud run services describe "${SERVICE_NAME}" \
    --platform managed \
    --region "${REGION}" \
    --format "value(status.url)"
```

```python
# =========================================================
# FILE: gcp/secrets_manager_gcp.py
# GCP Secret Manager integration — same pattern as AWS but GCP flavor.
# pip install google-cloud-secret-manager
# =========================================================

from google.cloud import secretmanager
import os

def get_secret_gcp(secret_name: str, project_id: str = None) -> str:
    """
    Fetch a secret from GCP Secret Manager.

    Args:
        secret_name: Name of the secret (e.g. "openai-api-key")
        project_id:  GCP project ID (defaults to env var PROJECT_ID)

    Returns:
        The secret value as a string
    """
    project_id = project_id or os.environ["PROJECT_ID"]
    client     = secretmanager.SecretManagerServiceClient()

    # Secret version path: projects/PROJECT/secrets/NAME/versions/latest
    name = f"projects/{project_id}/secrets/{secret_name}/versions/latest"

    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")
```

---

## 5. Secrets Management — Never Hardcode Again

```
THE SECRET LIFECYCLE:
════════════════════════════════════════════════════════════════

  ❌ BAD pattern (don't do this):
  ─────────────────────────────────────────────────────────
  # In your code:
  OPENAI_API_KEY = "sk-real-key-1234..."  ← committed to git 💀

  # In .env (committed by mistake):
  OPENAI_API_KEY=sk-real-key-1234         ← everyone with repo access sees it

  # In ECS environment variables:
  OPENAI_API_KEY=sk-real-key-1234         ← visible in AWS Console, in task logs

  # In Docker image:
  ENV OPENAI_API_KEY=sk-real-key-1234     ← anyone who pulls the image gets the key

  ✅ GOOD pattern:
  ─────────────────────────────────────────────────────────
  1. Key lives ONLY in AWS Secrets Manager / GCP Secret Manager
  2. ECS task role has IAM permission to READ that one secret
  3. Your code fetches it at startup (or runtime)
  4. The key NEVER appears in: code, logs, environment, image, or config files
  5. Rotation: update the secret in Secrets Manager → redeploy → old key invalidated
```

```python
# =========================================================
# FILE: secrets_manager.py
# AWS Secrets Manager integration with caching and rotation support.
# pip install boto3
# =========================================================

import asyncio
import json
import time
import boto3
import structlog
from functools import lru_cache
from typing import Optional

log = structlog.get_logger()


class SecretsCache:
    """
    Local in-process cache for secrets with TTL.

    WHY cache secrets?
    Secrets Manager charges per API call (~$0.05 per 10k calls).
    If you fetch the secret on every request at 100 req/s = 8.6M calls/day = $43/day.
    Cache it for 5 minutes = 288 calls/day = $0.0014/day.

    WHY not cache forever?
    Secrets rotate. If you cache indefinitely, a rotated key causes
    auth failures until container restart. 5-15 minutes is the sweet spot.
    """

    def __init__(self, ttl_seconds: int = 300):  # 5 minutes default
        self._cache:    dict[str, dict] = {}
        self._ttl:      int             = ttl_seconds

    def get(self, key: str) -> Optional[str]:
        """Get a cached secret, or None if expired/missing."""
        entry = self._cache.get(key)
        if not entry:
            return None
        if time.time() > entry["expires_at"]:
            del self._cache[key]
            return None
        return entry["value"]

    def set(self, key: str, value: str) -> None:
        """Cache a secret with TTL."""
        self._cache[key] = {
            "value":      value,
            "expires_at": time.time() + self._ttl,
        }


# Module-level singleton cache
_cache = SecretsCache(ttl_seconds=300)


async def get_secret(secret_name: str, region: str = "us-east-1") -> str:
    """
    Fetch a secret from AWS Secrets Manager.
    Returns cached value if available and not expired.

    Args:
        secret_name: The name or ARN of the secret
        region:      AWS region

    Returns:
        The secret as a string (JSON-parseable if the secret is a JSON object)

    Raises:
        RuntimeError if the secret cannot be fetched
    """
    # Check cache first
    cached = _cache.get(secret_name)
    if cached:
        log.debug("secret_cache_hit", secret_name=secret_name)
        return cached

    log.info("secret_fetch", secret_name=secret_name)

    try:
        # boto3 is synchronous — run in thread pool to not block async event loop
        loop   = asyncio.get_event_loop()
        client = boto3.client("secretsmanager", region_name=region)

        response = await loop.run_in_executor(
            None,    # use default thread pool
            lambda: client.get_secret_value(SecretId=secret_name)
        )

        secret = response.get("SecretString") or \
                 response.get("SecretBinary", b"").decode("utf-8")

        # Secrets Manager stores JSON objects as strings — try to parse
        # e.g., {"api_key": "sk-...", "org_id": "org-..."}
        try:
            parsed = json.loads(secret)
            # If it's a JSON object, return the most likely key
            # (customize this per your secret structure)
            if isinstance(parsed, dict):
                secret = next(iter(parsed.values()))  # first value
        except (json.JSONDecodeError, StopIteration):
            pass  # plain string secret — use as-is

        # Cache the result
        _cache.set(secret_name, secret)

        log.info("secret_fetched_ok", secret_name=secret_name)
        return secret

    except Exception as e:
        log.error("secret_fetch_failed", secret_name=secret_name, error=str(e))
        raise RuntimeError(f"Failed to fetch secret '{secret_name}': {e}")
```

---

## 6. Cost Management & Budgets

```
COST ANATOMY OF AN AI AGENT:
════════════════════════════════════════════════════════════════

  For a typical customer service agent handling 10K requests/day:

  ┌──────────────────────────────────────────────────────────┐
  │  COST COMPONENT        │ AMOUNT  │  HOW TO REDUCE        │
  ├──────────────────────────────────────────────────────────┤
  │  LLM API calls         │  $45/mo │  Use smaller models,  │
  │  (gpt-4o-mini, 1K tok  │         │  cache common queries │
  │   per request)         │         │                       │
  ├────────────────────────┼─────────┼───────────────────────┤
  │  ECS Fargate           │  $35/mo │  Right-size CPU/RAM,  │
  │  (2x 0.5vCPU, 1GB,    │         │  use Spot instances   │
  │   24/7)                │         │  for dev clusters     │
  ├────────────────────────┼─────────┼───────────────────────┤
  │  ALB                   │   $16/mo│  Unavoidable          │
  ├────────────────────────┼─────────┼───────────────────────┤
  │  Secrets Manager       │    $1/mo│  Cache secrets (!)    │
  ├────────────────────────┼─────────┼───────────────────────┤
  │  CloudWatch Logs       │    $5/mo│  Set log retention    │
  │                        │         │  to 30 days           │
  ├────────────────────────┼─────────┼───────────────────────┤
  │  TOTAL                 │  $102/mo│                       │
  └──────────────────────────────────────────────────────────┘

  At 10K requests/day: $0.0034 per request — very reasonable.
  At 1K requests/day: $0.034 per request — still fine.
  At 100 requests/day: $0.34 per request — Cloud Run is better here!
```

```python
# =========================================================
# FILE: cost_tracker.py
# Per-request cost tracking with daily budget alerts.
# Emits metrics to CloudWatch and alerts when budget exceeded.
# =========================================================

import time
import json
import asyncio
import structlog
from dataclasses import dataclass, field
from collections import defaultdict
from datetime import datetime, date
from typing import Optional
import threading

log = structlog.get_logger()


# LLM pricing per million tokens (update when pricing changes)
# Source: https://openai.com/pricing
LLM_PRICING = {
    "gpt-4o":       {"input": 5.00,   "output": 15.00},  # per 1M tokens
    "gpt-4o-mini":  {"input": 0.15,   "output": 0.60},
    "gpt-4":        {"input": 30.00,  "output": 60.00},
    "gpt-3.5-turbo":{"input": 0.50,   "output": 1.50},
    "claude-3-haiku":{"input": 0.25,  "output": 1.25},
    "claude-3-sonnet":{"input": 3.00, "output": 15.00},
}


@dataclass
class RequestCost:
    """Cost record for a single LLM request."""
    request_id:       str
    model:            str
    prompt_tokens:    int
    completion_tokens: int
    cost_usd:         float
    timestamp:        float = field(default_factory=time.time)
    session_id:       Optional[str] = None
    endpoint:         Optional[str] = None


class CostTracker:
    """
    Tracks LLM costs per request, per day, per model.
    Sends alerts when daily budget is exceeded.

    Thread-safe: uses a lock for the daily total dict.
    """

    def __init__(
        self,
        daily_budget_usd:    float = 50.0,   # alert if daily cost exceeds this
        per_request_max_usd: float = 0.10,   # alert if single request exceeds this
        alert_fn:            Optional[callable] = None,  # function to call for alerts
    ):
        self.daily_budget     = daily_budget_usd
        self.per_request_max  = per_request_max_usd
        self.alert_fn         = alert_fn or self._default_alert

        # Daily accumulator: {"2024-01-15": {"total": 12.34, "requests": 456}}
        self._daily:   dict[str, dict] = defaultdict(lambda: {"total": 0.0, "requests": 0})
        self._lock     = threading.Lock()

        # Per-model accumulator
        self._by_model: dict[str, float] = defaultdict(float)

        # Rolling window for cost anomaly detection (last 100 requests)
        self._recent_costs: list[float] = []

    def estimate_cost(
        self,
        model:             str,
        prompt_tokens:     int,
        completion_tokens: int,
    ) -> float:
        """Calculate cost in USD for a model call."""
        pricing = LLM_PRICING.get(model, {"input": 1.0, "output": 2.0})
        return (
            (prompt_tokens     / 1_000_000) * pricing["input"] +
            (completion_tokens / 1_000_000) * pricing["output"]
        )

    def record(
        self,
        request_id:        str,
        model:             str,
        prompt_tokens:     int,
        completion_tokens: int,
        session_id:        Optional[str] = None,
        endpoint:          Optional[str] = None,
    ) -> RequestCost:
        """
        Record the cost of a completed LLM call.
        Emits logs, updates accumulators, checks budget limits.

        Call this AFTER every successful LLM API call.
        """
        cost = self.estimate_cost(model, prompt_tokens, completion_tokens)

        record = RequestCost(
            request_id        = request_id,
            model             = model,
            prompt_tokens     = prompt_tokens,
            completion_tokens = completion_tokens,
            cost_usd          = cost,
            session_id        = session_id,
            endpoint          = endpoint,
        )

        today = date.today().isoformat()

        with self._lock:
            # Update daily total
            self._daily[today]["total"]    += cost
            self._daily[today]["requests"] += 1
            daily_total = self._daily[today]["total"]

            # Update per-model total
            self._by_model[model] += cost

            # Rolling window for anomaly detection
            self._recent_costs.append(cost)
            if len(self._recent_costs) > 100:
                self._recent_costs.pop(0)

        # Emit structured log — goes to CloudWatch
        log.info("llm_cost",
            request_id        = request_id,
            model             = model,
            prompt_tokens     = prompt_tokens,
            completion_tokens = completion_tokens,
            cost_usd          = round(cost, 6),
            daily_total_usd   = round(daily_total, 4),
            session_id        = session_id,
        )

        # ── Budget alerts ──────────────────────────────────
        if cost > self.per_request_max:
            self.alert_fn(
                level   = "warning",
                message = f"High-cost request: ${cost:.4f} (model={model}, "
                          f"tokens={prompt_tokens+completion_tokens})",
                data    = record.__dict__,
            )

        if daily_total > self.daily_budget:
            self.alert_fn(
                level   = "critical",
                message = f"Daily budget exceeded! ${daily_total:.2f} > ${self.daily_budget}",
                data    = {"daily_total": daily_total, "budget": self.daily_budget},
            )
        elif daily_total > self.daily_budget * 0.8:   # warn at 80%
            self.alert_fn(
                level   = "warning",
                message = f"Approaching daily budget: ${daily_total:.2f} / ${self.daily_budget}",
                data    = {"daily_total": daily_total, "budget": self.daily_budget},
            )

        return record

    def get_summary(self) -> dict:
        """Get cost summary for monitoring dashboard."""
        today = date.today().isoformat()
        with self._lock:
            daily = self._daily.get(today, {"total": 0.0, "requests": 0})
            return {
                "today_usd":       round(daily["total"],    4),
                "today_requests":  daily["requests"],
                "budget_usd":      self.daily_budget,
                "budget_pct":      round(daily["total"] / self.daily_budget * 100, 1),
                "by_model":        {m: round(c, 4) for m, c in self._by_model.items()},
                "avg_cost_recent": round(
                    sum(self._recent_costs) / len(self._recent_costs), 6
                ) if self._recent_costs else 0,
            }

    def _default_alert(self, level: str, message: str, data: dict) -> None:
        """Default alert: structured log (replace with PagerDuty/Slack in production)."""
        if level == "critical":
            log.critical("cost_alert", message=message, **data)
        else:
            log.warning("cost_alert", message=message, **data)


# Module-level singleton — import and use anywhere in your app
cost_tracker = CostTracker(
    daily_budget_usd    = float(__import__("os").getenv("DAILY_BUDGET_USD", "50")),
    per_request_max_usd = 0.05,
)
```

---

## 7. Token Optimization — Same Results, Lower Cost

```
TOKEN OPTIMIZATION TECHNIQUES:
════════════════════════════════════════════════════════════════

  TECHNIQUE          SAVINGS   RISK    NOTES
  ─────────────────────────────────────────────────────────
  Prompt compression   20-40%  Low    Remove whitespace, boilerplate
  Semantic caching     30-60%  Low    Return cached answer for similar Q
  Model routing        40-70%  Medium Use cheap model for easy tasks
  Context truncation   10-30%  Medium Keep only recent N messages
  Response length cap  10-20%  Low    max_tokens on every call
  ─────────────────────────────────────────────────────────

  Real example:
  Before optimization:
    System prompt:  800 tokens  (verbose, lots of whitespace)
    Conversation:   2000 tokens (full history, no truncation)
    Total:          2800 tokens × $0.15/M = $0.00042 per call
    At 10K calls/day = $4.20/day = $126/month

  After optimization:
    System prompt:  400 tokens  (compressed, no whitespace)
    Conversation:   800 tokens  (last 5 messages only)
    Caching:        40% of calls served from cache
    Total effective: ~720 tokens per call (accounting for cache hits)
    At 10K calls/day = $1.08/day = $32/month

  Savings: $94/month — 75% reduction — for the SAME user experience.
```

```python
# =========================================================
# FILE: token_optimizer.py
# Token optimization strategies for production agents.
# Apply these before sending anything to the LLM.
# =========================================================

import re
import json
import hashlib
import time
from typing import Optional

import structlog

log = structlog.get_logger()


class PromptCompressor:
    """
    Reduces token count of prompts without changing their meaning.

    Typical system prompts written by humans have 20-40% redundant tokens:
    - Multiple blank lines → single newline
    - "Please make sure to always remember to..." → "Always..."
    - JSON with indentation → minified JSON
    - Repeated instructions → deduplicated
    """

    def compress(self, text: str) -> str:
        """
        Compress a prompt to reduce token count.
        Preserves meaning — just removes verbosity and whitespace waste.
        """
        original_len = len(text)

        # Step 1: Collapse multiple whitespace to single
        text = re.sub(r" {2,}", " ", text)

        # Step 2: Collapse multiple newlines to double (preserve paragraph breaks)
        text = re.sub(r"\n{3,}", "\n\n", text)

        # Step 3: Remove trailing whitespace from each line
        text = "\n".join(line.rstrip() for line in text.split("\n"))

        # Step 4: Remove filler phrases (common in human-written prompts)
        filler_phrases = [
            (r"(?i)please make sure to always ", "Always "),
            (r"(?i)please remember to ",          ""),
            (r"(?i)it is very important that you ", ""),
            (r"(?i)you should always make sure to ", ""),
            (r"(?i)I want you to ",                ""),
            (r"(?i)your task is to ",              ""),
            (r"(?i)as an AI assistant, ",          ""),
        ]
        for pattern, replacement in filler_phrases:
            text = re.sub(pattern, replacement, text)

        # Step 5: Compress any inline JSON within the prompt
        text = self._compress_inline_json(text)

        compressed_len = len(text)
        savings_pct    = (1 - compressed_len / original_len) * 100 if original_len else 0

        log.debug("prompt_compressed",
            original_chars  = original_len,
            compressed_chars = compressed_len,
            savings_pct     = round(savings_pct, 1),
        )

        return text.strip()

    def _compress_inline_json(self, text: str) -> str:
        """Find JSON blocks in the text and minify them."""
        # Match fenced JSON blocks (```json ... ```)
        def minify_match(m):
            try:
                parsed  = json.loads(m.group(1))
                minified = json.dumps(parsed, separators=(",", ":"))
                return f"```json\n{minified}\n```"
            except json.JSONDecodeError:
                return m.group(0)  # leave as-is if not valid JSON

        return re.sub(r"```json\s*([\s\S]*?)\s*```", minify_match, text)


class ConversationTruncator:
    """
    Manages conversation history to stay within token budget.
    Always keeps: system prompt + first message + last N messages.
    Discards: the middle of the conversation (usually low information density).

    This is sometimes called the "sliding window" strategy.
    """

    def __init__(
        self,
        max_tokens:       int = 3000,   # hard limit for history section
        always_keep_first: int = 2,     # always keep first N user/assistant pairs
        chars_per_token:  float = 4.0,  # rough estimate (GPT: ~4 chars per token)
    ):
        self.max_tokens        = max_tokens
        self.always_keep_first = always_keep_first
        self.chars_per_token   = chars_per_token

    def truncate(
        self,
        messages:     list[dict],
        system_chars: int = 0,    # characters already used by system prompt
    ) -> tuple[list[dict], int]:
        """
        Truncate conversation history to fit within token budget.
        Preserves coherence by keeping most recent messages.

        Args:
            messages:       List of {"role": ..., "content": ...} dicts
            system_chars:   Chars used by system prompt (pre-calculated)

        Returns:
            (truncated_messages, estimated_tokens_used)
        """
        if not messages:
            return [], 0

        budget_chars = (self.max_tokens * self.chars_per_token) - system_chars

        # Separate system message if present
        system   = [m for m in messages if m["role"] == "system"]
        non_sys  = [m for m in messages if m["role"] != "system"]

        # Always keep the most recent messages and count backward
        kept    = []
        used    = 0

        # Work backward from most recent message
        for msg in reversed(non_sys):
            msg_chars = len(msg.get("content", ""))
            if used + msg_chars > budget_chars and len(kept) >= self.always_keep_first * 2:
                break   # Over budget and we have the minimum — stop
            kept.append(msg)
            used += msg_chars

        kept.reverse()    # restore chronological order

        if len(kept) < len(non_sys):
            log.info("conversation_truncated",
                original_messages  = len(non_sys),
                kept_messages      = len(kept),
                dropped_messages   = len(non_sys) - len(kept),
            )

        estimated_tokens = int(used / self.chars_per_token)
        return system + kept, estimated_tokens


class SemanticCache:
    """
    Cache LLM responses for semantically similar inputs.
    "What's your refund policy?" and "How do refunds work?" → same cached answer.

    Approach here: exact-match cache (hash of normalized input).
    For true semantic similarity: use embedding cosine distance (see Chapter 5).
    This simpler version catches ~30% of repeated queries with zero API cost.

    For production with high volume: use Redis instead of in-memory dict.
    """

    def __init__(
        self,
        ttl_seconds: int = 3600,     # cache entries expire after 1 hour
        max_size:    int = 1000,      # max cached entries
    ):
        self._cache:    dict[str, dict] = {}
        self._ttl:      int             = ttl_seconds
        self._max_size: int             = max_size
        self._hits:     int             = 0
        self._misses:   int             = 0

    def _normalize(self, text: str) -> str:
        """Normalize input for cache key: lowercase, strip extra spaces."""
        return re.sub(r"\s+", " ", text.lower().strip())

    def _hash(self, text: str, context: str = "") -> str:
        """Create a cache key from normalized text."""
        key   = self._normalize(text) + "|" + self._normalize(context)
        return hashlib.sha256(key.encode()).hexdigest()[:16]

    def get(self, user_input: str, context: str = "") -> Optional[str]:
        """Check cache. Returns cached response or None."""
        key   = self._hash(user_input, context)
        entry = self._cache.get(key)

        if not entry:
            self._misses += 1
            return None

        if time.time() > entry["expires_at"]:
            del self._cache[key]
            self._misses += 1
            return None

        self._hits += 1
        log.info("cache_hit", key=key, hit_rate=self.hit_rate)
        return entry["response"]

    def set(self, user_input: str, response: str, context: str = "") -> None:
        """Store a response in the cache."""
        if len(self._cache) >= self._max_size:
            # Evict the oldest entry (simple LRU approximation)
            oldest_key = min(self._cache, key=lambda k: self._cache[k]["expires_at"])
            del self._cache[oldest_key]

        key = self._hash(user_input, context)
        self._cache[key] = {
            "response":   response,
            "expires_at": time.time() + self._ttl,
        }

    @property
    def hit_rate(self) -> float:
        total = self._hits + self._misses
        return round(self._hits / total, 3) if total else 0.0

    def stats(self) -> dict:
        return {
            "entries":   len(self._cache),
            "hits":      self._hits,
            "misses":    self._misses,
            "hit_rate":  self.hit_rate,
        }


class ModelRouter:
    """
    Route requests to the cheapest model that can handle them.
    Simple rule-based router — customize rules for your domain.

    Cost comparison (per 1M tokens):
    ┌─────────────────────┬─────────────────────────────┐
    │  Model              │  Cost (input + output)      │
    ├─────────────────────┼─────────────────────────────┤
    │  gpt-3.5-turbo      │  $0.50 + $1.50 = $2.00/M   │
    │  gpt-4o-mini        │  $0.15 + $0.60 = $0.75/M   │
    │  gpt-4o             │  $5.00 + $15.0 = $20.0/M   │
    │  gpt-4              │  $30.0 + $60.0 = $90.0/M   │
    └─────────────────────┴─────────────────────────────┘

    Using gpt-4o-mini for simple queries and gpt-4o only for complex
    ones can reduce costs by 60-80% with minimal quality impact.
    """

    def route(self, user_input: str, context: str = "") -> str:
        """
        Route to appropriate model based on query complexity.
        Returns model name string.
        """
        text          = user_input.lower()
        total_context = len(user_input) + len(context)

        # ── Hard requirements for premium model ────────────
        needs_premium = any([
            # Legal or compliance questions
            any(kw in text for kw in ["lawsuit", "contract", "liability", "compliance"]),
            # Complex numerical analysis
            any(kw in text for kw in ["calculate", "analyze", "statistics", "forecast"]),
            # Code generation or debugging (can be subtle)
            any(kw in text for kw in ["function", "class", "algorithm", "debug"]),
            # Long context (complex enough to need a better model)
            total_context > 2000,
            # Multi-step reasoning indicators
            text.count("and then") + text.count("after that") + text.count("step") > 2,
        ])

        if needs_premium:
            log.debug("model_route", selected="gpt-4o", reason="complex_query")
            return "gpt-4o"

        # Default: use the cheap model for everything else
        log.debug("model_route", selected="gpt-4o-mini", reason="simple_query")
        return "gpt-4o-mini"
```

---

## 8. Observability — Logs, Traces, and Metrics

```
THE THREE PILLARS OF OBSERVABILITY:
════════════════════════════════════════════════════════════════

  LOGS           TRACES              METRICS
  ─────────────  ──────────────────  ──────────────────────
  What happened  How did it happen   How often / how fast

  "User got an   "Request → auth →   "P99 latency: 8.2s"
  error at 3pm"  agent → LLM → cache "Error rate: 2.3%"
                 → response: 4.2s"   "Cost: $1.23/hr"

  Questions      Questions           Questions
  answered:      answered:           answered:
  - What broke?  - Where's the       - Is the system
  - Who was      bottleneck?         healthy right now?
  affected?      - Which step        - Are things getting
  - What was     failed?             better or worse?
  the input?     - Why is it slow?


  OPENTELEMETRY (the standard way):
  ─────────────────────────────────────────────────────────
  One SDK → works with Jaeger, AWS X-Ray, GCP Cloud Trace,
  Datadog, Honeycomb — just change the exporter config.
```

```python
# =========================================================
# FILE: observability.py
# OpenTelemetry setup for distributed tracing + Prometheus metrics.
# pip install opentelemetry-api opentelemetry-sdk
#             opentelemetry-instrumentation-fastapi
#             prometheus-client
# =========================================================

import time
import os
from contextlib import contextmanager
from functools import wraps
from typing import Optional, Generator

import structlog
from prometheus_client import (
    Counter, Histogram, Gauge,
    make_asgi_app, CollectorRegistry
)
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

log = structlog.get_logger()


# ─── Prometheus Metrics ──────────────────────────────
# Counter:   only goes up  (requests, errors, tokens)
# Histogram: records distributions (latency, cost per request)
# Gauge:     goes up and down (active connections, queue depth)

REQUEST_COUNTER = Counter(
    "agent_requests_total",
    "Total number of agent requests",
    ["endpoint", "status"],    # labels let you slice the metric
)

LATENCY_HISTOGRAM = Histogram(
    "agent_request_duration_seconds",
    "Request latency in seconds",
    ["endpoint"],
    buckets=[0.5, 1.0, 2.0, 5.0, 10.0, 30.0],  # custom buckets for LLM latency
)

TOKEN_COUNTER = Counter(
    "agent_tokens_total",
    "Total tokens used",
    ["model", "token_type"],   # token_type = "prompt" or "completion"
)

COST_COUNTER = Counter(
    "agent_cost_usd_total",
    "Total LLM cost in USD",
    ["model"],
)

ACTIVE_REQUESTS = Gauge(
    "agent_active_requests",
    "Number of requests currently being processed",
)

CACHE_HITS = Counter(
    "agent_cache_hits_total",
    "Number of responses served from cache",
)

HALLUCINATION_FLAGS = Counter(
    "agent_hallucination_flags_total",
    "Number of responses flagged by hallucination detector",
    ["risk_level"],
)


class AgentMetrics:
    """
    Wrapper around Prometheus metrics for clean agent instrumentation.
    Use this class throughout your codebase instead of raw Prometheus counters.
    """

    @contextmanager
    def track_request(self, endpoint: str) -> Generator:
        """
        Context manager that tracks a request automatically.
        Records: latency, active count, success/failure status.

        Usage:
            with metrics.track_request("/chat"):
                result = await agent.run(input)
        """
        ACTIVE_REQUESTS.inc()
        start  = time.monotonic()
        status = "success"

        try:
            yield
        except Exception as e:
            status = "error"
            raise
        finally:
            elapsed = time.monotonic() - start
            ACTIVE_REQUESTS.dec()
            REQUEST_COUNTER.labels(endpoint=endpoint, status=status).inc()
            LATENCY_HISTOGRAM.labels(endpoint=endpoint).observe(elapsed)

            log.debug("request_tracked", endpoint=endpoint, status=status, elapsed_s=elapsed)

    def record_llm_call(
        self,
        model:             str,
        prompt_tokens:     int,
        completion_tokens: int,
        cost_usd:          float,
    ) -> None:
        """Record metrics for one LLM API call."""
        TOKEN_COUNTER.labels(model=model, token_type="prompt").inc(prompt_tokens)
        TOKEN_COUNTER.labels(model=model, token_type="completion").inc(completion_tokens)
        COST_COUNTER.labels(model=model).inc(cost_usd)

    def record_cache_hit(self) -> None:
        CACHE_HITS.inc()

    def record_hallucination_flag(self, risk_level: str) -> None:
        HALLUCINATION_FLAGS.labels(risk_level=risk_level).inc()


metrics = AgentMetrics()    # module-level singleton


def setup_telemetry(app) -> None:
    """
    Initialize OpenTelemetry tracing and Prometheus metrics endpoint.
    Call this once during app lifespan startup.
    """
    # ── OpenTelemetry Tracing ─────────────────────────
    provider = TracerProvider()

    # OTLP exporter: sends traces to any OTLP-compatible backend
    # AWS X-Ray: set OTLP endpoint to the X-Ray daemon
    # Jaeger local: set to http://localhost:4317
    otlp_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4317")
    exporter      = OTLPSpanExporter(endpoint=otlp_endpoint)
    provider.add_span_processor(BatchSpanProcessor(exporter))
    trace.set_tracer_provider(provider)

    # Auto-instrument FastAPI: traces every HTTP request automatically
    FastAPIInstrumentor.instrument_app(app)

    # ── Prometheus Metrics Endpoint ───────────────────
    # Mounts /metrics for Prometheus to scrape
    # Prometheus pulls this URL every 15s and stores the data
    metrics_app = make_asgi_app()
    app.mount("/metrics", metrics_app)

    log.info("telemetry_initialized", otlp_endpoint=otlp_endpoint)


# ─── Span decorator ──────────────────────────────────
def traced(span_name: str = None):
    """
    Decorator that wraps a function in an OpenTelemetry span.
    Creates a trace point for every call — visible in your trace UI.

    Usage:
        @traced("llm_call")
        async def call_openai(prompt: str) -> str:
            ...
    """
    def decorator(fn):
        @wraps(fn)
        async def wrapper(*args, **kwargs):
            tracer = trace.get_tracer(__name__)
            name   = span_name or fn.__qualname__

            with tracer.start_as_current_span(name) as span:
                # Add function args as span attributes (for debugging)
                # Be careful: don't add PII or secrets as attributes!
                span.set_attribute("function.name", fn.__name__)

                try:
                    result = await fn(*args, **kwargs)
                    span.set_attribute("success", True)
                    return result
                except Exception as e:
                    span.set_attribute("error", True)
                    span.set_attribute("error.message", str(e))
                    raise

        return wrapper
    return decorator
```

---

## 9. Alerting & Incident Response

```python
# =========================================================
# FILE: alerting.py
# Multi-channel alerting: Slack, PagerDuty, email.
# Called by the cost tracker, error handler, and health checker.
# =========================================================

import os
import json
import asyncio
import aiohttp
import structlog
from dataclasses import dataclass
from enum import Enum
from typing import Optional
from datetime import datetime

log = structlog.get_logger()


class AlertSeverity(str, Enum):
    INFO     = "info"      # informational — no action needed
    WARNING  = "warning"   # investigate when you have time
    CRITICAL = "critical"  # wake someone up right now


@dataclass
class Alert:
    severity:   AlertSeverity
    title:      str
    message:    str
    data:       dict
    timestamp:  str = ""

    def __post_init__(self):
        self.timestamp = datetime.utcnow().isoformat() + "Z"


class AlertManager:
    """
    Multi-channel alert dispatcher.
    Routes alerts to appropriate channels based on severity.

    Routing rules (default):
    - INFO:     Slack only (or just logs)
    - WARNING:  Slack + CloudWatch alarm
    - CRITICAL: Slack + PagerDuty (pages the on-call engineer)
    """

    def __init__(
        self,
        slack_webhook:    Optional[str] = None,
        pagerduty_key:    Optional[str] = None,
        service_name:     str = "ai-agent",
        env:              str = "production",
    ):
        self.slack_webhook = slack_webhook or os.getenv("SLACK_WEBHOOK_URL")
        self.pagerduty_key = pagerduty_key or os.getenv("PAGERDUTY_ROUTING_KEY")
        self.service_name  = service_name
        self.env           = env

    async def send(self, alert: Alert) -> None:
        """Dispatch alert to all configured channels."""
        # Always log — the log IS the alert trail
        log.warning("alert_dispatched",
            severity  = alert.severity.value,
            title     = alert.title,
            message   = alert.message,
        )

        tasks = []

        # Slack: all severities in #alerts channel
        if self.slack_webhook:
            tasks.append(self._send_slack(alert))

        # PagerDuty: CRITICAL only (don't wake people up for warnings)
        if self.pagerduty_key and alert.severity == AlertSeverity.CRITICAL:
            tasks.append(self._send_pagerduty(alert))

        if tasks:
            results = await asyncio.gather(*tasks, return_exceptions=True)
            for i, r in enumerate(results):
                if isinstance(r, Exception):
                    log.error("alert_delivery_failed", channel=i, error=str(r))

    async def _send_slack(self, alert: Alert) -> None:
        """Send a formatted Slack message via Incoming Webhook."""
        color_map = {
            AlertSeverity.INFO:     "#36a64f",   # green
            AlertSeverity.WARNING:  "#ffc300",   # yellow
            AlertSeverity.CRITICAL: "#e01e5a",   # red
        }

        payload = {
            "attachments": [{
                "color":  color_map[alert.severity],
                "title":  f"[{self.env.upper()}] {alert.title}",
                "text":   alert.message,
                "fields": [
                    {"title": "Service",   "value": self.service_name, "short": True},
                    {"title": "Severity",  "value": alert.severity.value.upper(), "short": True},
                    {"title": "Timestamp", "value": alert.timestamp, "short": False},
                ],
                "footer": "AI Agent Alerting System",
            }]
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                self.slack_webhook,
                json=payload,
                timeout=aiohttp.ClientTimeout(total=5),
            ) as resp:
                if resp.status != 200:
                    raise RuntimeError(f"Slack returned {resp.status}")

    async def _send_pagerduty(self, alert: Alert) -> None:
        """
        Trigger a PagerDuty incident for critical alerts.
        Uses the Events API v2 — creates an incident that pages on-call.
        """
        payload = {
            "routing_key":  self.pagerduty_key,
            "event_action": "trigger",
            "payload": {
                "summary":   f"[{self.service_name}] {alert.title}",
                "severity":  "critical",
                "source":    self.service_name,
                "timestamp": alert.timestamp,
                "custom_details": {
                    "message":  alert.message,
                    "env":      self.env,
                    **alert.data,
                },
            },
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://events.pagerduty.com/v2/enqueue",
                json=payload,
                timeout=aiohttp.ClientTimeout(total=5),
            ) as resp:
                if resp.status not in (200, 202):
                    raise RuntimeError(f"PagerDuty returned {resp.status}")

        log.info("pagerduty_triggered", title=alert.title)

    async def monitor_budget(self, cost_tracker) -> None:
        """
        Background task: check budget every minute and alert if exceeded.
        Run as asyncio task in your app's lifespan.

        Usage in main.py lifespan startup:
            asyncio.create_task(alert_manager.monitor_budget(cost_tracker))
        """
        while True:
            await asyncio.sleep(60)   # check every minute

            summary = cost_tracker.get_summary()
            pct     = summary["budget_pct"]

            if pct >= 100:
                await self.send(Alert(
                    severity = AlertSeverity.CRITICAL,
                    title    = "🚨 Daily LLM Budget EXCEEDED",
                    message  = f"Spent ${summary['today_usd']} of ${summary['budget_usd']} budget ({pct:.0f}%)",
                    data     = summary,
                ))
            elif pct >= 80:
                await self.send(Alert(
                    severity = AlertSeverity.WARNING,
                    title    = "⚠️ Daily LLM Budget at 80%",
                    message  = f"Spent ${summary['today_usd']} of ${summary['budget_usd']} budget",
                    data     = summary,
                ))
```

---

## 10. CI/CD Pipeline — GitHub Actions End-to-End

```yaml
# =========================================================
# FILE: .github/workflows/deploy.yml
# Full CI/CD pipeline: test → eval → docker → deploy.
# Triggers on every push to main.
# Requires GitHub secrets:
#   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
#   OPENAI_API_KEY (for eval tests only)
# =========================================================

name: Agent CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  AWS_REGION:   us-east-1
  ECR_REPO:     my-agent
  ECS_CLUSTER:  my-agent-cluster
  ECS_SERVICE:  my-agent-service

jobs:
  # ──────────────────────────────────────────────────────
  # JOB 1: Tests and quality checks
  # Runs on: every push and PR
  # ──────────────────────────────────────────────────────
  test:
    name: Tests & Quality
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python 3.12
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: "pip"    # cache pip packages for faster CI

      - name: Install dependencies
        run: pip install -r requirements.txt -r requirements-dev.txt

      - name: Run unit tests
        run: pytest tests/unit/ -v --tb=short

      - name: Run integration tests
        run: pytest tests/integration/ -v --tb=short
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Check code quality (ruff linter)
        run: ruff check . --output-format=github

      - name: Type check (mypy)
        run: mypy . --ignore-missing-imports

  # ──────────────────────────────────────────────────────
  # JOB 2: Agent evaluation (regression tests)
  # Only runs on PRs that touch agent code
  # Fails the PR if quality drops below threshold
  # ──────────────────────────────────────────────────────
  evaluate:
    name: Agent Quality Evaluation
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: "pip"

      - run: pip install -r requirements.txt

      - name: Run regression evaluation suite
        run: python -m evaluation.regression_runner
        env:
          OPENAI_API_KEY:  ${{ secrets.OPENAI_API_KEY }}
          FAIL_THRESHOLD:  "0.80"     # fail if < 80% pass rate
          MIN_ACCURACY:    "3.5"      # fail if avg accuracy < 3.5/5

      - name: Upload eval results
        if: always()   # upload even on failure for debugging
        uses: actions/upload-artifact@v4
        with:
          name: eval-results
          path: eval_history/

  # ──────────────────────────────────────────────────────
  # JOB 3: Build and push Docker image
  # Only runs on main branch (not PRs)
  # ──────────────────────────────────────────────────────
  build:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'

    outputs:
      image: ${{ steps.build.outputs.image }}  # pass image URI to deploy job

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id:     ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region:            ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: ecr-login
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push image
        id: build
        env:
          ECR_REGISTRY: ${{ steps.ecr-login.outputs.registry }}
          IMAGE_TAG:    ${{ github.sha }}  # use commit SHA as tag (unique, traceable)
        run: |
          IMAGE="${ECR_REGISTRY}/${{ env.ECR_REPO }}:${IMAGE_TAG}"

          docker build \
            --platform linux/amd64 \
            --cache-from "${ECR_REGISTRY}/${{ env.ECR_REPO }}:latest" \
            --build-arg  BUILDKIT_INLINE_CACHE=1 \
            -t "${IMAGE}" \
            -t "${ECR_REGISTRY}/${{ env.ECR_REPO }}:latest" \
            .

          docker push "${IMAGE}"
          docker push "${ECR_REGISTRY}/${{ env.ECR_REPO }}:latest"

          echo "image=${IMAGE}" >> $GITHUB_OUTPUT
          echo "✅ Pushed: ${IMAGE}"

  # ──────────────────────────────────────────────────────
  # JOB 4: Deploy to ECS
  # Runs only after successful build on main
  # Waits for service to stabilize before marking deploy complete
  # ──────────────────────────────────────────────────────
  deploy:
    name: Deploy to ECS Fargate
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'

    environment: production    # requires manual approval in GitHub (optional)

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id:     ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region:            ${{ env.AWS_REGION }}

      - name: Download task definition
        run: |
          aws ecs describe-task-definition \
            --task-definition my-agent \
            --query taskDefinition > aws/task-definition.json

      - name: Update image in task definition
        id: task-def
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: aws/task-definition.json
          container-name:  agent
          image:           ${{ needs.build.outputs.image }}

      - name: Deploy to ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v2
        with:
          task-definition:     ${{ steps.task-def.outputs.task-definition }}
          service:             ${{ env.ECS_SERVICE }}
          cluster:             ${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true   # wait for rolling deploy to finish

      - name: Smoke test deployed service
        run: |
          # Get ALB URL from CloudFormation output
          ALB_URL=$(aws cloudformation describe-stacks \
            --stack-name my-agent-stack \
            --query "Stacks[0].Outputs[?OutputKey=='ALBUrl'].OutputValue" \
            --output text)

          echo "Testing: ${ALB_URL}/health"
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${ALB_URL}/health")

          if [ "${STATUS}" != "200" ]; then
            echo "❌ Smoke test FAILED: /health returned ${STATUS}"
            exit 1
          fi
          echo "✅ Smoke test passed: /health returned 200"

      - name: Notify deployment success
        if: success()
        run: |
          curl -X POST "${{ secrets.SLACK_WEBHOOK_URL }}" \
            -H "Content-Type: application/json" \
            -d "{\"text\": \"✅ Deployed *my-agent* to production (commit: ${{ github.sha }})\",
                 \"username\": \"GitHub Actions\"}"

      - name: Notify deployment failure
        if: failure()
        run: |
          curl -X POST "${{ secrets.SLACK_WEBHOOK_URL }}" \
            -H "Content-Type: application/json" \
            -d "{\"text\": \"🚨 Deployment FAILED for *my-agent* — check GitHub Actions\",
                 \"username\": \"GitHub Actions\"}"
```

```
FULL CI/CD FLOW:
════════════════════════════════════════════════════════════════

  Developer pushes to main
          │
          ▼
  ┌────────────────────────────┐
  │  JOB 1: test (~3 min)      │
  │  • pytest unit tests       │
  │  • pytest integration tests│
  │  • ruff linting            │
  │  • mypy type checks        │
  └────────────┬───────────────┘
               │ pass only
               ▼
  ┌────────────────────────────┐
  │  JOB 2: evaluate (~5 min) │ ← PR only
  │  • benchmark regression    │
  │  • LLM-as-judge scoring    │
  │  • Fail if < 80% pass rate │
  └────────────┬───────────────┘
               │ pass only
               ▼
  ┌────────────────────────────┐
  │  JOB 3: build (~4 min)    │ ← main only
  │  • docker build (amd64)    │
  │  • push to ECR             │
  │  • output image URI        │
  └────────────┬───────────────┘
               │ image URI →
               ▼
  ┌────────────────────────────┐
  │  JOB 4: deploy (~5 min)   │ ← main only
  │  • update task definition  │
  │  • ECS rolling deploy      │
  │  • wait for stability      │
  │  • smoke test /health      │
  │  • Slack notification      │
  └────────────────────────────┘

  Total: ~17 minutes from push to production. 🚀
```

---

## 11. Mini Quiz

**Question 1 — Docker**

Your Dockerfile has a `COPY . .` instruction on line 8 and `COPY requirements.txt .` + `RUN pip install` on lines 5-6. A colleague relocates `COPY requirements.txt .` to be AFTER `COPY . .` (making it line 10). The app still works. Why does this matter for build performance, and how much slower will it be in practice?

<details>
<summary>👆 Click to reveal answer</summary>

**This destroys Docker's layer cache for the pip install step — making every routine code change trigger a full dependency reinstall.**

Docker builds images layer-by-layer. Each instruction (`COPY`, `RUN`, etc.) generates a cache entry keyed by the layer's content. Docker checks: "has anything changed since last build?" If not, it uses the cached layer. If yes, it rebuilds that layer AND every layer after it.

**Before (correct order):**
```
Layer 5: COPY requirements.txt .     ← only invalidated when requirements.txt changes
Layer 6: RUN pip install             ← only reruns when requirements.txt changes
Layer 7: COPY . .                    ← invalidated on ANY code change
```

When you make a code change: Layers 1-6 are cache hits → only Layer 7 runs. **pip install is skipped.** Build time: ~10 seconds.

**After (wrong order):**
```
Layer 5: COPY . .                    ← invalidated on ANY code change
Layer 6: COPY requirements.txt .    ← after cache miss, this also runs
Layer 7: RUN pip install             ← always runs after any code change
```

When you make a code change: Cache miss at Layer 5 → pip install runs every time. Build time: ~4 minutes.

**In practice:** A team doing 10 deploys/day loses 4 minutes × 10 = 40 min/day waiting for Docker builds, vs 10 min/day = **30 minutes wasted daily** from a single file reordering.

**Rule:** Put things that **change rarely** (dependencies) BEFORE things that **change often** (source code). `COPY requirements.txt` → `RUN pip install` → `COPY . .` is the correct order.
</details>

---

**Question 2 — Health Checks**

Your ECS task definition has this health check:
```json
"healthCheck": {
  "command": ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]
}
```
Your `/health` endpoint looks like:
```python
@app.get("/health")
async def health():
    return {"status": "alive"}
```
The container always passes the health check, even after your OpenAI API key expires and every LLM call fails with a 401 error. What's wrong, and how do you fix it?

<details>
<summary>👆 Click to reveal answer</summary>

**The liveness check and readiness check are conflated. The health endpoint only checks "is HTTP working?" — not "can the agent actually serve requests?"**

The `/health` endpoint returns 200 as long as FastAPI is running. It has no idea whether the OpenAI connection is valid. So ECS sees "healthy" → routes traffic → every user gets a 500 error.

**Fix 1: Separate liveness and readiness**

```python
@app.get("/health")
async def health():
    """Liveness: is the process alive? (fast, no deps)"""
    return {"status": "alive"}

@app.get("/health/ready")
async def readiness(request: Request):
    """Readiness: can we serve traffic? (checks dependencies)"""
    # Check OpenAI connection (with timeout)
    try:
        await asyncio.wait_for(
            request.app.state.openai_client.models.list(),
            timeout=5.0
        )
    except Exception as e:
        raise HTTPException(503, f"OpenAI unreachable: {e}")
    return {"status": "ready"}
```

**Fix 2: Use readiness for ALB health checks**

In ECS, ALB health check target: `/health/ready` (not `/health`)

**Fix 3: Add /health/ready to Docker HEALTHCHECK**

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8000/health/ready || exit 1
```

**Key distinction:**
- **Liveness** (`/health`): checked by Docker's HEALTHCHECK → restart container if failing
- **Readiness** (`/health/ready`): checked by ALB → stop routing traffic if failing

You want slightly different behavior: a container with an expired key should stop receiving traffic (readiness=failing) but NOT get restarted in a loop (liveness=still alive). The restart won't fix an expired key — that's an ops problem, not a container problem.
</details>

---

**Question 3 — Cost Optimization**

The `SemanticCache` uses SHA-256 hash of normalized input. Two users ask:
- User A: "What is your refund policy?"
- User B: "What's the refund policy?"

These are semantically identical but produce different hash keys → no cache hit. At 10,000 requests/day with 40% being refund policy questions, how much money does this miss cost per month? (Assume gpt-4o-mini at $0.75/M tokens, 500 tokens per request.) Then describe exactly how you'd implement true semantic caching using what you learned in Chapter 5.

<details>
<summary>👆 Click to reveal answer</summary>

**Cost calculation:**

- Refund policy requests/day: 10,000 × 40% = 4,000 requests
- With perfect semantic cache hitting 80% (reasonable estimate): only 800 calls needed/day
- Without semantic cache: 4,000 calls/day

Extra calls per day: 3,200
Tokens per call: 500
Cost per call: 500 × $0.75/1,000,000 = $0.000375
Extra cost per day: 3,200 × $0.000375 = $1.20/day
**Extra cost per month: $36/month just from refund policy questions**

**Implementation using Chapter 5 (embedding-based semantic cache):**

```python
from openai import AsyncOpenAI
import numpy as np
import redis.asyncio as aioredis
import json

class SemanticCache:
    """
    True semantic cache using embeddings + cosine similarity.
    Same approach as Chapter 5's RAG retrieval, but for caching.
    """

    def __init__(self, similarity_threshold: float = 0.95, ttl: int = 3600):
        self.client    = AsyncOpenAI()
        self.redis     = aioredis.from_url("redis://localhost:6379")
        self.threshold = similarity_threshold   # 0.95 = 95% similar → cache hit
        self.ttl       = ttl

    async def _embed(self, text: str) -> list[float]:
        """Get embedding vector for text."""
        resp = await self.client.embeddings.create(
            model="text-embedding-3-small",   # cheap: $0.02/M tokens
            input=text,
        )
        return resp.data[0].embedding          # 1536-dimension vector

    def _cosine_similarity(self, a: list[float], b: list[float]) -> float:
        a, b = np.array(a), np.array(b)
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

    async def get(self, query: str) -> str | None:
        """Check if a semantically similar query is cached."""
        query_embedding = await self._embed(query)

        # Get all cached embeddings (in production: use vector DB like Redis Stack)
        keys = await self.redis.keys("cache:emb:*")
        for key in keys:
            entry_json  = await self.redis.get(key)
            if not entry_json:
                continue
            entry       = json.loads(entry_json)
            similarity  = self._cosine_similarity(query_embedding, entry["embedding"])

            if similarity >= self.threshold:
                return entry["response"]    # cache hit!

        return None    # cache miss

    async def set(self, query: str, response: str) -> None:
        """Store query + embedding + response."""
        embedding = await self._embed(query)
        import hashlib, time
        key = f"cache:emb:{hashlib.sha256(query.encode()).hexdigest()[:12]}"
        await self.redis.setex(
            key,
            self.ttl,
            json.dumps({"embedding": embedding, "response": response, "ts": time.time()})
        )
```

**Key insight:** Embedding cost is ~$0.000001/query (text-embedding-3-small at $0.02/M) vs LLM cost of $0.000375 — the embedding check is 375× cheaper than the LLM call, making semantic caching always economical at scale.
</details>

---

**Question 4 — Observability**

Your Prometheus `LATENCY_HISTOGRAM` uses buckets `[0.5, 1.0, 2.0, 5.0, 10.0, 30.0]`. Your LLM agent's P99 latency is consistently 8.3 seconds. A colleague asks: "Why do we need custom buckets? Can't we just use the default Prometheus buckets?" What are the default buckets, why are they wrong for LLM agents, and what would happen to your P99 alerting if you used them?

<details>
<summary>👆 Click to reveal answer</summary>

**Default Prometheus histogram buckets:** `.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10`

These are designed for web services where:
- **Good latency:** 5-50ms
- **Acceptable latency:** 100-500ms
- **Bad latency:** >1 second

**Why they're wrong for LLM agents:**

Even a "fast" LLM call takes 1-3 seconds. A complex reasoning agent takes 5-30 seconds. So with default buckets:
- **Every single LLM response** would fall into the last bucket (`le="10"` or infinity)
- You'd see: `le="5"=0`, `le="10"=1000` — all responses in one bucket
- Histogram becomes useless: you can't distinguish 5s from 30s responses
- **P50, P95, P99 calculations are meaningless** — Prometheus interpolates linearly within a bucket, so 1000 responses all in the "5-10" bucket gives P50 estimate of ~7.5s regardless of reality

**What happens to alerting:**

Alert rule: `histogram_quantile(0.99, rate(agent_latency_bucket[5m])) > 15`

With default buckets and P99 actually at 22 seconds:
- All requests in `le="10"` bucket (since 22 > 10, they're in the `+Inf` bucket)
- Prometheus estimates P99 ≈ 10 seconds (the bucket boundary)
- Alert threshold is 15 seconds → **alert never fires**
- You think P99 is 10s, it's actually 22s → users experiencing 22s waits
- Incident goes undetected until users complain

**Correct buckets for LLM agents** (what we use):
`[0.5, 1.0, 2.0, 5.0, 10.0, 30.0]`

- 0.5s: fast (cache hit or short prompt)
- 1.0s: typical simple query
- 2.0s: moderate reasoning
- 5.0s: complex multi-tool agent
- 10.0s: heavy reasoning / long output
- 30.0s: very long operation (should alarm)

**Rule of thumb:** Set histogram buckets so your typical case falls in the MIDDLE buckets, not at the extremes. You want resolution where your distribution actually lives.
</details>

---

**Question 5 — Incident Response**

At 3:47am your PagerDuty alert fires: "Daily LLM Budget EXCEEDED — $127 spent vs $50 budget." It's the first time this alert has ever fired. You're on-call. Walk through your exact incident response steps in order, explain what you're checking at each step, and describe the three most likely root causes with their debugging approaches.

<details>
<summary>👆 Click to reveal answer</summary>

**Immediate triage (first 5 minutes):**

**Step 1: Verify it's real (not alert flutter)**
```bash
# Check CloudWatch cost metrics — is the $127 real?
aws cloudwatch get-metric-statistics \
  --namespace CWAgent --metric-name agent_cost_usd_total \
  --start-time 2024-01-15T00:00:00Z --end-time 2024-01-15T03:47:00Z \
  --period 3600 --statistics Sum
```
If real → proceed. If $50 today (budget glitch), silence alert and file bug.

**Step 2: Check if the spike is ongoing**
Check the current request rate and cost-per-minute. Is money still draining right now?
```bash
# Look at last 30 minutes of cost logs
aws logs filter-log-events \
  --log-group-name /ecs/my-agent \
  --filter-pattern '{ $.cost_usd > 0 }' \
  --start-time $(($(date +%s) - 1800))000
```
If still spending rapidly → kill switch now (scale service to 0 or block all traffic).

**Step 3: Identify the anomaly**
Check `by_model` in cost summary. Which model? Which endpoint? Which session_id is responsible for $77 of excess spend?

---

**THREE MOST LIKELY ROOT CAUSES:**

**Root Cause 1: Infinite loop / runaway agent**
*Signature:* One session_id with thousands of requests in minutes
*Debugging:* `grep session_id logs | sort | uniq -c | sort -rn | head -20`
*Fix:* Add per-session request rate limit (max 100 requests per session per hour). Kill offending sessions in Redis.

**Root Cause 2: Model routing bug — everything routing to gpt-4**
*Signature:* `by_model: {"gpt-4": 127.00, "gpt-4o-mini": 0.00}` — routing code is broken
*Debugging:* Check model_route log entries. Was a config change deployed yesterday?
*Fix:* Roll back the last deployment. Fix routing logic. Add alert on `by_model["gpt-4"] > 10%_of_total`.

**Root Cause 3: Traffic spike / bot attack**
*Signature:* Many different session_ids, all coming from similar IPs or user agents
*Debugging:* Check ALB access logs for request rate by IP. Check if rate limiter is working.
*Fix:* Block offending IPs at WAF level. Verify rate limiter wasn't accidentally disabled.

**Post-incident actions (next day):**
1. Add per-session hourly budget cap ($1 max per session)
2. Add anomaly detection: alert if cost rate is 3× the hourly average
3. Add CloudWatch budget alarm at 50% ($25) as early warning
4. Write post-mortem: what happened, why alert didn't fire earlier, what we changed
</details>

---

## 12. Chapter 12 Preview

```
╔══════════════════════════════════════════════════════════════╗
║  👀 COMING UP: Chapter 12                                    ║
║  "Fine-Tuning & Custom Models — Teaching LLMs Your Domain"  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Chapter 11 made your agent run reliably in production.      ║
║  Chapter 12 makes it deeply understand YOUR specific domain. ║
║  Prompt engineering can only take you so far. Fine-tuning    ║
║  takes you the rest of the way.                              ║
║                                                              ║
║  🧠  WHEN TO FINE-TUNE vs WHEN TO PROMPT                     ║
║      The 3 questions that decide                             ║
║      Real cost/benefit analysis with real numbers            ║
║      The "fine-tune trap" — when it makes things worse       ║
║                                                              ║
║  📚  DATASET PREPARATION                                     ║
║      Collecting training examples from production logs       ║
║      The minimum viable dataset (how many examples?)         ║
║      Quality over quantity — why 100 great beats 10K bad    ║
║      Data cleaning and deduplication pipelines               ║
║                                                              ║
║  🔧  OpenAI FINE-TUNING API (gpt-4o-mini → your model)      ║
║      Full pipeline: prepare → upload → train → evaluate      ║
║      Training run monitoring and hyperparameter tuning       ║
║      Cost: $X to train vs $Y per request saved               ║
║                                                              ║
║  🤗  OPEN SOURCE FINE-TUNING (Llama 3)                      ║
║      LoRA (Low-Rank Adaptation) — fine-tune on a laptop!    ║
║      QLoRA — 4-bit quantized training on 16GB VRAM          ║
║      Hugging Face TRL + PEFT libraries                       ║
║      Serving your custom model with vLLM                     ║
║                                                              ║
║  📊  EVALUATION & REGRESSION TESTING                         ║
║      Did fine-tuning actually help? Measure it.             ║
║      A/B testing: fine-tuned vs base model in production    ║
║      Catastrophic forgetting — what it is and how to avoid  ║
║                                                              ║
║  🏭  REAL USE CASES:                                         ║
║      1. Legal firm: fine-tune on their contract templates    ║
║         → 70% fewer hallucinations on legal language         ║
║      2. Healthcare: fine-tune on medical coding standards    ║
║         → 95% ICD-10 code accuracy (vs 72% base model)      ║
║      3. E-commerce: fine-tune on product catalog style       ║
║         → Consistent brand voice across 1M product listings  ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  PREREQUISITE CHECKLIST:                                     ║
║  ✅ Agent deployed (Docker + ECS or Cloud Run)               ║
║  ✅ Cost tracking running and alerts configured              ║
║  ✅ Structured logging in CloudWatch/Cloud Logging           ║
║  ✅ Evaluation suite passing at ≥ 80%                        ║
║  ✅ You can explain the difference between liveness          ║
║     and readiness health checks                              ║
╚══════════════════════════════════════════════════════════════╝
```

> **Professor's Final Word:** You now know how to run a real AI system — not just write one. Docker. ECS/Cloud Run. Secrets management that doesn't get you fired. Cost tracking so your boss doesn't get a surprise $10,000 AWS bill. Token optimization that reduces costs by 75% with zero UX impact. Distributed tracing that shows you exactly what happened on every request. And a CI/CD pipeline that deploys from commit to production in 17 minutes without a human touching a server. That's not "running an AI agent." That's **operating one**. There's a huge difference, and now you understand both sides. In Chapter 12, we go from "running a general-purpose LLM" to "running a model that knows your company's domain better than any off-the-shelf option." It gets even more interesting. 🎓🚀

---

```
────────────────────────────────────────────────────────────────────
  Chapter 11 Complete ✅  |  Next: Chapter 12 — Fine-Tuning & Custom Models
  Files built this chapter:
  Production Config:
    Dockerfile             — multi-stage build (1.8GB → 180MB)
    .dockerignore          — never include .env or keys in image
    requirements.txt       — fully pinned for deterministic builds
    config.py              — Pydantic Settings, all config in one place
    main.py                — FastAPI with lifespan, health checks, graceful shutdown
  Deployment:
    aws/task-definition.json  — ECS Fargate task (secrets from Secrets Manager)
    aws/service.json          — ECS Service with rolling deploy config
    aws/deploy.sh             — one-command deploy script with smoke test
    gcp/deploy.sh             — Cloud Run deploy (3 commands)
  Infrastructure:
    secrets_manager.py     — AWS Secrets Manager with 5-min TTL cache
    cost_tracker.py        — per-request cost logging + daily budget alerts
    token_optimizer.py     — PromptCompressor + ConversationTruncator + SemanticCache + ModelRouter
    observability.py       — OpenTelemetry tracing + Prometheus metrics endpoint
    alerting.py            — Slack + PagerDuty multi-channel alert dispatcher
  CI/CD:
    .github/workflows/deploy.yml — full pipeline: test → eval → build → deploy → smoke test
────────────────────────────────────────────────────────────────────
```
