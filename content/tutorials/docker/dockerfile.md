Welcome to **Chapter 5 — Dockerfile**.

> **The Dockerfile is a recipe card for Docker. It tells Docker exactly how to build your image step by step.**

Every Docker image starts with a Dockerfile.

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine teaching your robot to make a sandwich.

```
📋 Instructions for Robot (Dockerfile):

  Step 1: Take two slices of bread
  Step 2: Apply butter
  Step 3: Add cheese
  Step 4: Add tomato
  Step 5: Close the sandwich
  Step 6: Serve
```

The robot follows these steps **exactly**.

Every time.

Any robot. Any kitchen.

Same sandwich.

That is the **Dockerfile**.

---

# What is a Dockerfile?

A **Dockerfile** is a plain text file named exactly:

```
Dockerfile
```

It contains step-by-step instructions to build a Docker image.

```dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

Run `docker build .` and Docker creates an image from it.

---

# Dockerfile Instructions

---

# FROM

Always the first instruction.

Sets the **base image**.

```dockerfile
FROM ubuntu:22.04
FROM node:18
FROM python:3.11-slim
FROM openjdk:17
FROM alpine:3.18
```

---

# WORKDIR

Sets the working directory inside the container.

```dockerfile
WORKDIR /app
```

All subsequent commands run from `/app`.

---

# COPY

Copies files from your local machine into the container.

```dockerfile
COPY package.json .
COPY . .
COPY src/ /app/src/
```

---

# ADD

Like COPY but also handles URLs and tar files.

```dockerfile
ADD https://example.com/file.tar.gz /app/
```

Use COPY for local files. Use ADD only when you need these extra features.

---

# RUN

Executes a command **at build time**.

Creates a new image layer.

```dockerfile
RUN npm install
RUN apt-get update && apt-get install -y curl
RUN pip install -r requirements.txt
```

---

# EXPOSE

Documents the port the container listens on.

```dockerfile
EXPOSE 3000
EXPOSE 8080
EXPOSE 5432
```

This is **documentation only** — it doesn't publish the port. Use `-p` when running.

---

# CMD

The default command to run when a container starts.

```dockerfile
CMD ["node", "index.js"]
CMD ["python", "app.py"]
CMD ["nginx", "-g", "daemon off;"]
```

There should be **only one CMD** per Dockerfile.

---

# ENTRYPOINT

Like CMD but cannot be overridden by command line arguments.

```dockerfile
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

# ENV

Sets environment variables inside the container.

```dockerfile
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_HOST=localhost
```

---

# ARG

Build-time variables (not available in running container).

```dockerfile
ARG VERSION=1.0
RUN echo "Building version $VERSION"
```

---

# VOLUME

Declares a mount point for persistent data.

```dockerfile
VOLUME ["/app/data"]
```

---

# Complete Node.js Dockerfile

```dockerfile
# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (layer caching optimization)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "src/index.js"]
```

---

# Complete Python Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

# Complete Java Dockerfile

```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/myapp.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

# Build the Image

```bash
# Build with tag
docker build -t myapp:v1 .

# Build from specific Dockerfile
docker build -f Dockerfile.prod -t myapp:prod .

# Build with build args
docker build --build-arg VERSION=2.0 -t myapp:v2 .
```

---

# Layer Caching — Best Practice

**Bad order (slow builds):**

```dockerfile
FROM node:18
COPY . .             ← copies everything (invalidates cache on every code change)
RUN npm install
```

**Good order (fast builds):**

```dockerfile
FROM node:18
COPY package.json .  ← only changes if package.json changes
RUN npm install      ← only runs when dependencies change
COPY . .             ← copies code last
```

Dependencies rarely change.

Code changes often.

Copy dependencies first → most cache hits.

---

# .dockerignore

Like `.gitignore` — tells Docker what NOT to copy.

```
# .dockerignore
node_modules
.git
*.log
.env
dist
coverage
```

This keeps the image small and prevents secrets from leaking.

---

# Company Example — Paytm

Paytm's Node.js payment API:

```dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

USER node

EXPOSE 3000
CMD ["node", "server.js"]
```

`USER node` — runs as non-root for security.

Deployed on AWS ECS.

---

# Interview Questions

## Q1. What is a Dockerfile?

**Best Answer**

> A Dockerfile is a plain text file containing a set of ordered instructions that Docker uses to build a Docker image. Each instruction creates a layer in the image. The result is a reproducible, portable image.

---

## Q2. What is the difference between CMD and ENTRYPOINT?

CMD provides the default command and can be overridden at runtime. ENTRYPOINT sets the main executable and cannot be overridden by arguments (only by `--entrypoint` flag). They can be combined: ENTRYPOINT sets the executable, CMD sets default arguments.

---

## Q3. What is the difference between COPY and ADD?

COPY simply copies files from host to container. ADD does the same but also supports URLs and automatically extracts tar archives. Best practice: use COPY for local files.

---

## Q4. What is layer caching in Docker?

Docker caches each instruction layer. If a layer hasn't changed, Docker reuses the cached version, skipping that build step. This makes subsequent builds faster. Copy dependencies before code to maximize cache hits.

---

## Q5. What is .dockerignore?

A file that tells Docker which files and directories to exclude when building an image. Similar to .gitignore. Prevents large/sensitive files (node_modules, .env, .git) from being copied into the image.

---

# Professional Summary

```
Dockerfile Instructions:
  FROM       → base image
  WORKDIR    → set working directory
  COPY       → copy files into image
  RUN        → execute commands at build time
  EXPOSE     → document port
  ENV        → set environment variables
  CMD        → default start command

Build:
  docker build -t myapp:v1 .
```
