Welcome to **Chapter 9 — Docker Compose**.

> **Docker Compose lets you define and run multi-container applications with a single YAML file and one command. It is the backbone of every modern local development setup.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine opening a restaurant from scratch.

Without Compose:

```
Step 1: Start the oven manually
Step 2: Start the fridge manually
Step 3: Start the dishwasher manually
Step 4: Start the cashier system manually
Step 5: Open the doors manually
(5 separate steps every single day)
```

With Compose:

```
One button → Everything starts together
One button → Everything stops together
```

That's **Docker Compose**.

One file defines everything.

One command starts everything.

---

# The Problem Without Compose

Running a Node.js app with MongoDB and Redis:

```bash
# Step 1 - Create network
docker network create myapp

# Step 2 - Start MongoDB
docker run -d --name mongo --network myapp -v mongo_data:/data/db mongo:6

# Step 3 - Start Redis
docker run -d --name redis --network myapp redis:7

# Step 4 - Start Node.js API
docker run -d --name api --network myapp -p 3000:3000 \
  -e MONGO_URL=mongodb://mongo:27017/mydb \
  -e REDIS_URL=redis://redis:6379 \
  myapi:v1
```

4 long commands.

Easy to forget one.

Hard to share with teammates.

---

# The Solution — docker-compose.yml

```yaml
version: '3.9'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGO_URL=mongodb://mongo:27017/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    networks:
      - myapp

  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    networks:
      - myapp

  redis:
    image: redis:7
    networks:
      - myapp

volumes:
  mongo_data:

networks:
  myapp:
    driver: bridge
```

Now start everything with:

```bash
docker compose up -d
```

Stop everything with:

```bash
docker compose down
```

---

# Docker Compose Commands

**Start all services:**

```bash
docker compose up
docker compose up -d          # detached (background)
docker compose up --build     # rebuild images before starting
```

**Stop all services:**

```bash
docker compose down
docker compose down -v        # also remove volumes
```

**View running services:**

```bash
docker compose ps
```

**View logs:**

```bash
docker compose logs
docker compose logs -f api    # follow specific service logs
```

**Execute command in service:**

```bash
docker compose exec api bash
docker compose exec mongo mongosh
```

**Scale a service:**

```bash
docker compose up --scale api=3
```

**Rebuild and restart a single service:**

```bash
docker compose up -d --build api
```

---

# Full Node.js + PostgreSQL + Redis Stack

**docker-compose.yml:**

```yaml
version: '3.9'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: api
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=myapp
      - DB_USER=admin
      - DB_PASS=secret
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - backend

  postgres:
    image: postgres:15
    container_name: postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - backend

  redis:
    image: redis:7-alpine
    container_name: redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    networks:
      - backend

volumes:
  postgres_data:

networks:
  backend:
    driver: bridge
```

---

# restart Policy

```yaml
restart: "no"           # Never restart (default)
restart: always          # Always restart
restart: on-failure      # Restart only on failure
restart: unless-stopped  # Restart unless manually stopped (recommended)
```

---

# Environment Variables from .env File

**.env:**

```
NODE_ENV=development
DB_PASSWORD=mysecretpassword
API_KEY=abc123
```

**docker-compose.yml:**

```yaml
services:
  api:
    env_file:
      - .env
```

Or reference specific variables:

```yaml
environment:
  - DB_PASSWORD=${DB_PASSWORD}
```

---

# Health Checks

```yaml
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

---

# depends_on with Condition

```yaml
services:
  api:
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
```

---

# Company Example — MakeMyTrip

MakeMyTrip dev environment:

```yaml
version: '3.9'

services:
  booking-api:
    build: ./booking-service
    ports: ["3001:3001"]
    depends_on: [postgres, redis, kafka]

  search-api:
    build: ./search-service
    ports: ["3002:3002"]
    depends_on: [elasticsearch]

  postgres:
    image: postgres:15
    volumes: [pg_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine

  elasticsearch:
    image: elasticsearch:8.8.0
    environment:
      - discovery.type=single-node

volumes:
  pg_data:
```

One `docker compose up -d` starts the entire microservices stack for local development.

---

# Interview Questions

## Q1. What is Docker Compose?

**Best Answer**

> Docker Compose is a tool for defining and running multi-container Docker applications using a YAML configuration file (docker-compose.yml). You define all services, networks, and volumes in one file and manage the entire application lifecycle with a single command.

---

## Q2. What is the difference between docker run and docker compose?

`docker run` starts a single container. Docker Compose starts multiple containers together, sets up networks and volumes, and manages dependencies between services — all from a single YAML file.

---

## Q3. What does depends_on do in Docker Compose?

It controls the startup order of services. A service with `depends_on: [postgres]` will only start after the `postgres` service starts. Note: it waits for the container to start, not for the application inside to be ready.

---

## Q4. What is the difference between docker compose down and docker compose stop?

`docker compose stop` stops the running containers but preserves them and their volumes. `docker compose down` stops and removes the containers and networks. Adding `-v` also removes volumes.

---

# Professional Summary

```
docker-compose.yml defines:
  - services (containers)
  - networks
  - volumes
  - environment variables

Commands:
  docker compose up -d      → Start everything
  docker compose down       → Stop & remove
  docker compose ps         → List services
  docker compose logs -f    → Follow logs
  docker compose exec svc bash → Enter service
  docker compose up --build → Rebuild and start
```
