Welcome to **Chapter 4 — Docker Images**.

> **A Docker Image is the blueprint. Every container is created from an image. Understanding images is the foundation of working with Docker.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you want to bake 100 cakes.

You don't create a new recipe every time.

```
📋 Recipe = Docker Image

🎂 Cake = Docker Container
```

One recipe → bake unlimited cakes.

All cakes from the same recipe look the same.

That's exactly how Docker Images work.

---

# What is a Docker Image?

A Docker **Image** is a read-only template containing:

```
✅ Operating System layer (e.g., Ubuntu)
✅ Runtime (e.g., Node.js 18, Python 3.11)
✅ Your application code
✅ Libraries & dependencies
✅ Environment variables
✅ Startup command
```

It is **read-only** — you cannot change it once built.

You create containers FROM images.

---

# Image Layers

A Docker image is made of **layers**.

Each instruction in a Dockerfile creates a layer.

```
Layer 5: ADD your app code         ←── topmost
Layer 4: RUN npm install
Layer 3: COPY package.json
Layer 2: RUN apt-get install node
Layer 1: FROM ubuntu:22.04         ←── base layer
```

Layers are **cached** and **shared**.

If Node.js layer is the same across two images → only stored once on disk.

---

# Image Naming

```
[registry]/[username]/[image-name]:[tag]

Examples:
  nginx:latest
  node:18
  ubuntu:22.04
  python:3.11-slim
  myusername/myapp:v1.0
  ghcr.io/company/api:production
```

---

# Common Base Images

```
ubuntu:22.04      → Full Ubuntu OS
alpine:3.18       → Tiny Linux (5 MB)
node:18           → Node.js runtime
python:3.11       → Python runtime
nginx:latest      → Nginx web server
openjdk:17        → Java runtime
postgres:15       → PostgreSQL DB
redis:7           → Redis cache
```

---

# Docker Image Commands

**Pull an image from Docker Hub:**

```bash
docker pull nginx
docker pull node:18
docker pull ubuntu:22.04
```

**List all local images:**

```bash
docker images
```

Output:

```
REPOSITORY   TAG       IMAGE ID       SIZE
nginx        latest    89da1fb6dcb9   187MB
node         18        a9c1445cbd4d   996MB
ubuntu       22.04     174c8c134b2a   77.8MB
```

**Remove an image:**

```bash
docker rmi nginx
docker rmi node:18
```

**Inspect image details:**

```bash
docker image inspect nginx
```

**Tag an image:**

```bash
docker tag myapp:latest myusername/myapp:v1.0
```

**Push to Docker Hub:**

```bash
docker login
docker push myusername/myapp:v1.0
```

---

# Build Your Own Image

**Step 1** — Create a Dockerfile:

```dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

**Step 2** — Build the image:

```bash
docker build -t myapp:v1 .
```

**Step 3** — Verify it was created:

```bash
docker images
```

**Step 4** — Run a container from it:

```bash
docker run -p 3000:3000 myapp:v1
```

---

# Image vs Container

```
Image                       Container
──────────────────────────────────────────
Read-only blueprint         Writable running instance
Stored on disk              Lives in memory
Like a class                Like an object
One image → many containers One container from one image
```

---

# Company Example — Flipkart

Flipkart has a Node.js API service.

```
Dev team builds the image:
  docker build -t flipkart-api:v2.3 .

Push to private registry:
  docker push registry.flipkart.com/api:v2.3

Production servers pull and run:
  docker pull registry.flipkart.com/api:v2.3
  docker run flipkart-api:v2.3
```

All 500 servers run **identical** containers.

No configuration drift.

No surprises.

---

# Interview Questions

## Q1. What is a Docker Image?

**Best Answer**

> A Docker image is a read-only, layered template that contains everything needed to run an application — the OS, runtime, application code, libraries, and configuration. Containers are created from images and can run anywhere the Docker engine is installed.

---

## Q2. What is the difference between an image and a container?

An image is static and read-only — a blueprint. A container is a live, running instance created from an image with a writable layer on top.

---

## Q3. What is image layering?

Docker images are built in layers. Each Dockerfile instruction (RUN, COPY, ADD) creates a new layer. Layers are cached — if a layer hasn't changed, Docker reuses the cached version, making builds faster.

---

## Q4. What is the base image?

The `FROM` instruction in a Dockerfile specifies the base image. It is the starting layer. All subsequent instructions build on top of it.

---

## Q5. What is Alpine Linux in Docker?

Alpine is a minimal Linux distribution (~5 MB). Used as a base image when you want very small Docker images. `FROM node:18-alpine` creates a much smaller image than `FROM node:18`.

---

# Professional Summary

```
Image = Read-only blueprint

Commands:
  docker pull [image]      → Download from registry
  docker images            → List images
  docker build -t name .   → Build from Dockerfile
  docker rmi [image]       → Remove image
  docker push [image]      → Push to registry

Image = layers → cached → fast builds
```
