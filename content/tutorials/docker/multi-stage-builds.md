Welcome to **Chapter 11 — Multi-Stage Builds**.

> **Multi-stage builds are the professional technique for creating tiny, production-ready Docker images by separating the build environment from the runtime environment.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine building a wooden chair.

**Without Multi-Stage:**

```
You ship to the customer:
  ✅ The finished chair
  ❌ The entire carpenter workshop
  ❌ All the tools (saw, hammer, drill)
  ❌ All the sawdust
  ❌ Raw wood pieces

Package size: Enormous!
```

**With Multi-Stage:**

```
Build stage:
  → Use workshop and tools to build chair

Ship stage:
  → Only send the finished chair

Package size: Just the chair!
```

That's exactly what Multi-Stage builds do for Docker.

---

# The Problem — Fat Images

A Node.js image without multi-stage:

```dockerfile
FROM node:18

WORKDIR /app
COPY package.json .
RUN npm install          # Includes devDependencies!
COPY . .
RUN npm run build        # TypeScript → JavaScript

CMD ["node", "dist/index.js"]
```

Final image size:

```
node:18 base       → 996 MB
+ node_modules     → 400 MB (includes dev tools!)
+ source code      → 10 MB
= ~1.4 GB          ❌ Way too big!
```

---

# The Solution — Multi-Stage Build

```dockerfile
# ─── Stage 1: Build ───────────────────────────────────
FROM node:18 AS builder

WORKDIR /app

# Install ALL dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci

# Copy source and compile TypeScript
COPY . .
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────
FROM node:18-alpine AS production

WORKDIR /app

# Install ONLY production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

Final image size:

```
node:18-alpine    → 70 MB
+ prod deps only  → 150 MB
+ compiled code   → 5 MB
= ~225 MB         ✅ 83% smaller!
```

---

# How Multi-Stage Works

```
Stage 1 (builder):
  → Starts with full Node.js image
  → Installs all deps
  → Compiles TypeScript to JavaScript
  → Result: heavy image with source + tools

Stage 2 (production):
  → Starts fresh with small Alpine image
  → Installs only production deps
  → COPIES compiled output from Stage 1
  → Does NOT copy dev tools, source code, devDeps

Result:
  → Small, clean, production-ready image
  → Stage 1 is discarded (never shipped)
```

---

# Java Multi-Stage Build

```dockerfile
# Stage 1: Build with Maven
FROM maven:3.9-openjdk-17 AS builder

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run with minimal JRE
FROM openjdk:17-jre-slim

WORKDIR /app

COPY --from=builder /app/target/myapp.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Size comparison:

```
With Maven (build stage only):  → 700 MB
With JRE (multi-stage):         → 200 MB
```

---

# Python Multi-Stage Build

```dockerfile
# Stage 1: Build stage
FROM python:3.11 AS builder

WORKDIR /app
COPY requirements.txt .

RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

# React/Next.js Multi-Stage Build

```dockerfile
# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

---

# Build Specific Stage

```bash
# Build only up to the 'builder' stage (for debugging)
docker build --target builder -t myapp:debug .

# Build the full production image
docker build -t myapp:prod .
```

---

# Size Comparison Table

| Application | Without Multi-Stage | With Multi-Stage |
| --- | --- | --- |
| Node.js (TypeScript) | 1.4 GB | 225 MB |
| Java (Spring Boot) | 700 MB | 200 MB |
| Python (FastAPI) | 1.0 GB | 200 MB |
| React (Next.js) | 1.2 GB | 150 MB |

---

# Company Example — CRED

CRED's Go microservices use multi-stage builds:

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Production stage
FROM scratch       # Empty image! Literally nothing.

COPY --from=builder /app/main .
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

EXPOSE 8080
CMD ["/main"]
```

Final image size:

```
FROM scratch → 0 MB base
+ compiled binary → 15 MB
= 15 MB total 🔥
```

---

# Interview Questions

## Q1. What is a multi-stage Docker build?

**Best Answer**

> A multi-stage build uses multiple FROM instructions in a single Dockerfile. Each FROM starts a new stage. You can copy specific artifacts (compiled binaries, built assets) from one stage to another, discarding build tools and intermediate files. The result is a lean production image.

---

## Q2. Why use multi-stage builds?

To keep production images small. Build stages contain compilers, test frameworks, and dev dependencies that are not needed at runtime. Multi-stage builds let you discard everything except the final artifact.

---

## Q3. How do you copy files between stages?

```dockerfile
COPY --from=stageName /source/path /destination/path
```

`--from` specifies the source stage by name or index (0, 1, 2...).

---

## Q4. What is `FROM scratch`?

`scratch` is an empty base image with nothing in it. Used for Go binaries and other statically compiled programs. The resulting image contains only your binary and any files you explicitly copy.

---

# Professional Summary

```
Multi-Stage Build Pattern:
  Stage 1 (builder) → Heavy image with all tools
    RUN compile / build / test

  Stage 2 (production) → Minimal image
    COPY --from=builder /app/dist ./dist

Build:
  docker build -t myapp:prod .
  docker build --target builder -t debug .

Result: 80-90% smaller production images
```
