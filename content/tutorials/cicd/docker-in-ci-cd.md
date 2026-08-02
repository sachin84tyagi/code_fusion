Welcome to **Chapter 11 — Docker in CI/CD**.

> **Docker and CI/CD are inseparable in modern DevOps. Every professional pipeline builds a Docker image, pushes it to a registry, and deploys it. This is the most important practical skill.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a factory.

```
Factory Worker (Developer)
→ Makes a product (writes code)

Quality Control (CI)
→ Checks the product (runs tests)

Packaging (Docker build)
→ Puts product in a standard box

Warehouse (Registry)
→ Stores the box (Docker Hub / ECR)

Delivery (CD)
→ Ships the box to the customer (deploy)
```

That box is the Docker image.

The factory line is the CI/CD pipeline.

---

# The Docker CI/CD Flow

```
Code Push to GitHub
         ↓
CI Pipeline Runs
         ↓
Run Tests  ✅
         ↓
docker build -t myapp:$GIT_SHA .   ← Build image
         ↓
docker push registry/myapp:$GIT_SHA ← Push to registry
         ↓
kubectl set image ... myapp:$GIT_SHA ← Deploy
         ↓
✅ New version live in production
```

---

# Complete Node.js CI/CD with Docker

```yaml
name: Node.js Docker CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ─── CI: Test ──────────────────────────────────
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm test

  # ─── CD: Build & Push Docker Image ────────────
  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'    # Only on push, not PR

    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=,format=short    # git SHA tag
            type=raw,value=latest            # latest tag

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha      # GitHub Actions cache
          cache-to: type=gha,mode=max

  # ─── CD: Deploy ──────────────────────────────
  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Deploy to server
        run: |
          echo "Deploying ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}"
```

---

# Push to AWS ECR

```yaml
jobs:
  push-to-ecr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: my-app
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT
```

---

# Push to Docker Hub

```yaml
jobs:
  push-to-dockerhub:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            myusername/myapp:latest
            myusername/myapp:${{ github.sha }}
```

---

# Docker Build Caching in CI

Without cache → full build every time (slow).

With cache → only changed layers rebuilt (fast).

```yaml
- name: Build and push
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myapp:latest
    cache-from: type=gha           # Use GitHub Actions cache
    cache-to: type=gha,mode=max    # Save to GitHub Actions cache
```

Result: First build = 5 minutes. Subsequent builds = 45 seconds.

---

# Multi-Platform Builds

Build for multiple CPU architectures (AMD64 + ARM):

```yaml
- name: Set up QEMU
  uses: docker/setup-qemu-action@v3

- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build and push
  uses: docker/build-push-action@v5
  with:
    context: .
    platforms: linux/amd64,linux/arm64    # Both architectures
    push: true
    tags: myapp:latest
```

---

# Docker Scout — Security Scanning

```yaml
- name: Scan image for vulnerabilities
  uses: docker/scout-action@v1
  with:
    command: cves
    image: myapp:${{ github.sha }}
    exit-code: true         # Fail pipeline if critical CVEs found
    only-severities: critical,high
```

---

# Deploy to AWS ECS

```yaml
- name: Download ECS task definition
  run: |
    aws ecs describe-task-definition \
      --task-definition my-app \
      --query taskDefinition > task-def.json

- name: Update ECS task definition with new image
  id: task-def
  uses: aws-actions/amazon-ecs-render-task-definition@v1
  with:
    task-definition: task-def.json
    container-name: my-app
    image: ${{ env.ECR_REGISTRY }}/my-app:${{ github.sha }}

- name: Deploy to ECS
  uses: aws-actions/amazon-ecs-deploy-task-definition@v1
  with:
    task-definition: ${{ steps.task-def.outputs.task-definition }}
    service: my-app-service
    cluster: production-cluster
    wait-for-service-stability: true
```

---

# Deploy to Kubernetes

```yaml
- name: Configure kubectl
  uses: azure/k8s-set-context@v3
  with:
    kubeconfig: ${{ secrets.KUBECONFIG }}

- name: Update deployment image
  run: |
    kubectl set image deployment/my-app \
      my-app=${{ env.ECR_REGISTRY }}/my-app:${{ github.sha }}

- name: Wait for rollout
  run: kubectl rollout status deployment/my-app --timeout=5m
```

---

# Company Example — Ola

Ola's driver-app backend pipeline:

```yaml
name: Ola Driver API Pipeline

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: mvn test

  build-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build & Push
        run: |
          docker build -t $ECR/driver-api:${{ github.sha }} .
          docker push $ECR/driver-api:${{ github.sha }}

  deploy:
    needs: build-push
    environment: production
    runs-on: ubuntu-latest
    steps:
      - name: Deploy EKS
        run: |
          kubectl set image deployment/driver-api \
            driver-api=$ECR/driver-api:${{ github.sha }}
          kubectl rollout status deployment/driver-api
```

---

# Interview Questions

## Q1. How does Docker fit into a CI/CD pipeline?

**Best Answer**

> In a CI/CD pipeline, after tests pass, Docker builds an immutable image containing the application and all its dependencies. The image is tagged with the Git commit SHA and pushed to a container registry (ECR, GCR, Docker Hub). The deployment step pulls this specific image and deploys it to servers or Kubernetes. This ensures the same artifact tested in CI runs in production.

---

## Q2. Why tag Docker images with the Git SHA?

The Git SHA uniquely identifies the exact commit that produced the image. This provides traceability — you can always know which code version is running in production. It also prevents overwriting previous images, enabling easy rollbacks.

---

## Q3. What is docker/build-push-action?

An official GitHub Action by Docker that builds a Docker image from a Dockerfile and optionally pushes it to a registry. Supports BuildKit, multi-platform builds, and GitHub Actions cache integration for fast builds.

---

## Q4. How do you roll back a failed deployment?

Since each deployment uses a specific image tag (the git SHA), rolling back means deploying the previous image tag:

```bash
kubectl set image deployment/my-app my-app=registry/my-app:PREVIOUS_SHA
```

---

# Professional Summary

```
Docker CI/CD Pipeline:

1. Test stage: npm test / mvn test
2. Build: docker build -t myapp:${{ github.sha }} .
3. Login: docker/login-action (Hub/ECR/GCR)
4. Push:  docker/build-push-action
5. Deploy: kubectl / ECS / Cloud Run

Key actions:
  docker/login-action@v3
  docker/build-push-action@v5
  docker/metadata-action@v5
  aws-actions/amazon-ecr-login@v2
  aws-actions/amazon-ecs-deploy-task-definition@v1

Image tagging: always use git SHA for traceability
```
