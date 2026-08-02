Welcome to **Chapter 10 — Docker Registry**.

> **A Docker Registry is where Docker images are stored and shared. Understanding registries is essential for shipping your application to the world.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine the App Store on your phone.

```
📱 App Store (Docker Registry)

  → Developers upload apps
  → Users download apps
  → All apps stored centrally
  → Available to everyone
```

Docker Hub is the **App Store for Docker Images**.

You upload (push) your image.

Your server downloads (pull) your image.

---

# What is a Docker Registry?

A **Registry** is a storage server for Docker images.

```
Push:  Your machine → Registry → (upload image)
Pull:  Registry → Your machine → (download image)
Run:   Image → Container      → (run the app)
```

---

# Docker Hub

The default public registry.

```
https://hub.docker.com
```

Free for public images.

Every official image is here:

```
nginx, node, python, postgres, redis, mongo,
ubuntu, alpine, mysql, elasticsearch...
```

---

# Pull from Docker Hub

```bash
# Pull latest
docker pull nginx

# Pull specific version (tag)
docker pull node:18
docker pull postgres:15
docker pull python:3.11-slim

# Pull from specific user/org
docker pull myusername/myapp:v1.0
```

---

# Push to Docker Hub

**Step 1** — Create account at hub.docker.com.

**Step 2** — Login from terminal:

```bash
docker login
# Enter username and password
```

**Step 3** — Tag your image properly:

```bash
docker tag myapp:v1 myusername/myapp:v1.0
docker tag myapp:v1 myusername/myapp:latest
```

**Step 4** — Push:

```bash
docker push myusername/myapp:v1.0
docker push myusername/myapp:latest
```

Now anyone can pull:

```bash
docker pull myusername/myapp:v1.0
```

---

# Image Tags

Tags identify versions of an image.

```
nginx:latest        → Always the most recent
nginx:1.25          → Specific version
nginx:1.25-alpine   → Specific version, Alpine base
node:18             → Node 18 LTS
node:18-alpine      → Node 18, Alpine base (smaller)
node:18-slim        → Node 18, Debian slim (smaller)
```

**Tagging strategy for production:**

```
myapp:latest           → Always the newest
myapp:v1.2.3           → Semantic version
myapp:v1.2.3-20260802  → Version + date
```

---

# Private Registries

For company/internal use — not publicly visible.

**AWS ECR (Elastic Container Registry):**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.us-east-1.amazonaws.com

# Tag
docker tag myapp:v1 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1

# Push
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1

# Pull
docker pull 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1
```

**Google Container Registry (GCR):**

```bash
docker tag myapp:v1 gcr.io/my-project/myapp:v1
docker push gcr.io/my-project/myapp:v1
```

**GitHub Container Registry (GHCR):**

```bash
docker tag myapp:v1 ghcr.io/myusername/myapp:v1
docker push ghcr.io/myusername/myapp:v1
```

---

# Run Your Own Registry

```bash
docker run -d \
  --name registry \
  -p 5000:5000 \
  -v registry_data:/var/lib/registry \
  registry:2
```

Push to local registry:

```bash
docker tag myapp:v1 localhost:5000/myapp:v1
docker push localhost:5000/myapp:v1
```

Pull from local registry:

```bash
docker pull localhost:5000/myapp:v1
```

---

# Popular Registries Comparison

| Registry | Provider | Free Tier |
| --- | --- | --- |
| Docker Hub | Docker | Unlimited public, 1 private |
| ECR | AWS | 500 MB free, then paid |
| GCR | Google | Pay per use |
| GHCR | GitHub | Free for public repos |
| ACR | Azure | Pay per use |
| Self-hosted | You | Your server cost |

---

# Company Example — Ola

Ola uses AWS ECR for all microservice images.

```bash
# CI/CD pipeline (GitHub Actions / Jenkins)

# 1. Build image
docker build -t ola-driver-api:${GIT_SHA} .

# 2. Tag for ECR
docker tag ola-driver-api:${GIT_SHA} \
  123456789.dkr.ecr.ap-south-1.amazonaws.com/ola-driver-api:${GIT_SHA}

# 3. Push to ECR
docker push \
  123456789.dkr.ecr.ap-south-1.amazonaws.com/ola-driver-api:${GIT_SHA}

# 4. Deploy on ECS
aws ecs update-service --service ola-driver-api --force-new-deployment
```

Every deployment is a new image with the Git commit SHA as the tag.

Full traceability.

---

# Interview Questions

## Q1. What is a Docker Registry?

**Best Answer**

> A Docker Registry is a server-side application that stores and distributes Docker images. Docker Hub is the default public registry. Organizations use private registries (AWS ECR, GCR, GHCR) to store internal images securely.

---

## Q2. What is the difference between a Registry and a Repository?

A Registry is the entire server (e.g., Docker Hub). A Repository is a specific collection of images within a registry (e.g., `myusername/myapp`). A repository contains multiple tagged versions of the same image.

---

## Q3. What happens when you run docker pull nginx?

Docker checks if the image exists locally. If not, it contacts the default registry (Docker Hub), authenticates if needed, pulls the image layers in parallel, and stores them locally.

---

## Q4. Why use a private registry?

For security — you don't want internal application code on a public registry. For performance — pull speeds are faster with a registry in the same cloud region as your servers. For compliance — some industries require private image storage.

---

# Professional Summary

```
Registry = Storage for Docker Images

Docker Hub:
  docker login
  docker tag myapp:v1 username/myapp:v1
  docker push username/myapp:v1
  docker pull username/myapp:v1

Private Registry (ECR/GCR/GHCR):
  Authenticate with cloud provider
  Tag with full registry URL
  Push/Pull same as Docker Hub

Image Tags:
  latest  → most recent
  v1.2.3  → semantic version (production best practice)
```
