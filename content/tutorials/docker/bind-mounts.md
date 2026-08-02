Welcome to **Chapter 13 — Bind Mounts**.

> **Bind Mounts map a directory from your host machine directly into a container. They are the developer's best friend for instant code hot-reloading without rebuilding images.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine your laptop is a desk.

Your container is in another room.

Without Bind Mount:

```
Change file on desk
→ Pack it in a box
→ Send box to other room
→ Open box
→ Replace old file

Very slow!
```

With Bind Mount:

```
Your desk IS the other room's desk.

You write something
→ Instantly visible in the other room

Like a shared desk with a window!
```

That's a Bind Mount.

---

# What is a Bind Mount?

A **Bind Mount** maps a specific path on your **host machine** to a specific path inside the **container**.

```
Host Path: /home/user/myproject
               ↕ (two-way sync)
Container Path: /app
```

Any change on the host is **immediately** visible inside the container.

Any change inside the container is **immediately** visible on the host.

---

# Bind Mount vs Volume

| | Bind Mount | Volume |
| --- | --- | --- |
| Managed by | You (host filesystem) | Docker |
| Location | Any host path | Docker's internal area |
| Best for | Development | Production databases |
| Portability | Host-dependent | Portable |
| Performance | Fast on Linux | Fast everywhere |
| Use case | Code hot-reloading | Persistent DB data |

---

# Using Bind Mounts

**Syntax:**

```bash
docker run -v /host/path:/container/path
# or
docker run --mount type=bind,source=/host/path,target=/container/path
```

**Shorthand with current directory:**

```bash
# Linux / Mac
docker run -v $(pwd):/app myapp

# Windows PowerShell
docker run -v ${PWD}:/app myapp

# Windows CMD
docker run -v %cd%:/app myapp
```

---

# Development Setup — Node.js

Without Bind Mount (slow workflow):

```
Edit code
→ docker build -t myapp .
→ docker run myapp
→ Test
→ Edit code
→ docker build again...
```

With Bind Mount (instant workflow):

```bash
docker run -d \
  --name dev-server \
  -v $(pwd):/app \
  -v /app/node_modules \
  -p 3000:3000 \
  -e NODE_ENV=development \
  node:18-alpine \
  sh -c "npm install && npm run dev"
```

Edit code → Instantly reflected inside container → Server auto-reloads.

Note: `-v /app/node_modules` prevents the host's node_modules from overwriting the container's.

---

# Development Setup — Python (FastAPI)

```bash
docker run -d \
  --name fastapi-dev \
  -v $(pwd):/app \
  -p 8000:8000 \
  python:3.11-slim \
  sh -c "pip install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --reload"
```

`--reload` restarts the server on code changes.

Every file change is instant.

No rebuild needed.

---

# Bind Mount in Docker Compose (Development)

```yaml
version: '3.9'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app                # Bind mount code
      - /app/node_modules     # Anonymous volume for node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev       # With hot-reload

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Named volume for data

volumes:
  postgres_data:
```

---

# Read-Only Bind Mount

Prevent container from modifying host files:

```bash
docker run -v $(pwd)/config:/app/config:ro myapp
```

`:ro` = read-only

Container can read config files.

Container cannot write or modify them.

---

# Bind Mount for Configuration Files

```bash
docker run -d \
  --name nginx \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  -p 80:80 \
  nginx
```

Your custom `nginx.conf` overrides the default inside the container.

Change it on host → Reload nginx → New config applied.

---

# Debugging with Bind Mount

Mount a log directory to access logs from host:

```bash
docker run -d \
  --name myapp \
  -v $(pwd)/logs:/app/logs \
  myapp:v1
```

```bash
# View logs from host
tail -f logs/app.log
```

---

# Company Example — Startups & Dev Environments

Every startup's development setup uses Bind Mounts:

```yaml
# docker-compose.dev.yml
version: '3.9'

services:
  backend:
    image: node:18
    working_dir: /app
    volumes:
      - ./backend:/app      # Backend code bind mounted
    command: npm run dev
    ports: ["3001:3001"]

  frontend:
    image: node:18
    working_dir: /app
    volumes:
      - ./frontend:/app     # Frontend code bind mounted
    command: npm run dev
    ports: ["3000:3000"]

  db:
    image: postgres:15
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
```

```bash
docker compose -f docker-compose.dev.yml up
# Full stack running in minutes
# Edit any file → instant hot-reload
```

---

# Interview Questions

## Q1. What is a Bind Mount in Docker?

**Best Answer**

> A Bind Mount mounts a host machine directory or file into a container. It creates a real-time, two-way sync between the host path and the container path. Changes on either side are immediately visible on the other. Primarily used in development for instant code hot-reloading without rebuilding images.

---

## Q2. What is the difference between a Bind Mount and a Volume?

A Bind Mount maps an existing host path to a container. You specify the exact host path. A Volume is managed by Docker at a Docker-controlled location. Volumes are preferred for production data; Bind Mounts for development.

---

## Q3. Why do you use -v /app/node_modules when mounting code?

When you mount `.:/app`, the host's directory (possibly without node_modules) overwrites the container's /app. Adding `-v /app/node_modules` creates an anonymous volume specifically for node_modules, preventing the host from overwriting the container's installed packages.

---

## Q4. What is a read-only Bind Mount?

Appending `:ro` to the volume flag (`-v /host/path:/container/path:ro`) makes the mount read-only inside the container. The container can read the files but cannot modify them. Used for config files and secrets.

---

# Professional Summary

```
Bind Mount = Real-time host ↔ container sync

Usage:
  docker run -v $(pwd):/app image          → Sync code
  docker run -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro nginx → Read-only config

Docker Compose:
  volumes:
    - .:/app           → Bind mount (code)
    - /app/node_modules → Anonymous volume (prevent overwrite)

Use for:
  ✅ Development hot-reloading
  ✅ Config file injection
  ✅ Log collection
  ❌ Production databases (use named volumes instead)
```
