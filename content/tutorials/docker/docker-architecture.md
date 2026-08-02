Welcome to **Chapter 3 — Docker Architecture**.

> **Understanding Docker's internal architecture is essential to truly master Docker and ace every DevOps interview.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a restaurant with three parts.

```
🗣️ Waiter (Docker Client)
   → Takes your order

👨‍🍳 Kitchen Manager (Docker Daemon)
   → Actually cooks the food

📚 Recipe Book (Docker Registry)
   → Stores all the recipes (images)
```

You (the user) talk to the **Waiter**.

The **Kitchen Manager** does all the real work.

He checks the **Recipe Book** if the recipe is not available locally.

That is exactly how Docker works.

---

# Docker Architecture — Overview

```
┌──────────────────────────────────────────────────┐
│                  Docker Client                    │
│   (docker build, docker run, docker pull...)      │
└──────────────────────┬───────────────────────────┘
                       │  REST API
                       ▼
┌──────────────────────────────────────────────────┐
│              Docker Daemon (dockerd)              │
│   - Builds images                                 │
│   - Manages containers                            │
│   - Manages networks                              │
│   - Manages volumes                               │
└──────────┬────────────────────────┬──────────────┘
           │                        │
           ▼                        ▼
   ┌──────────────┐       ┌──────────────────┐
   │  Docker Hub  │       │  Local Images    │
   │  (Registry)  │       │  & Containers    │
   └──────────────┘       └──────────────────┘
```

---

# The Three Core Components

---

# 1. Docker Client

The command-line interface you use.

```bash
docker build .
docker run nginx
docker pull ubuntu
docker push myimage
```

Every command you type goes to the **Docker Daemon** via a REST API.

The client and daemon can be on **different machines**.

```
Your Laptop (Client)  →  Remote Server (Daemon)
```

---

# 2. Docker Daemon (dockerd)

The heart of Docker.

It runs in the background as a system service.

```
Responsibilities:
  ✅ Build images from Dockerfile
  ✅ Pull images from Registry
  ✅ Create and manage containers
  ✅ Manage networks
  ✅ Manage volumes
  ✅ Monitor running containers
```

You never talk to it directly.

The Docker Client does.

---

# 3. Docker Registry

A storage system for Docker images.

**Docker Hub** is the default public registry.

```
https://hub.docker.com
```

You can also use:

```
AWS ECR    → Amazon Elastic Container Registry
GCR        → Google Container Registry
Azure ACR  → Azure Container Registry
Private    → Self-hosted registry
```

---

# How docker run Works Step by Step

```bash
docker run nginx
```

Step 1: Client sends command to Daemon.

Step 2: Daemon checks if `nginx` image exists locally.

Step 3: If not found → Daemon pulls from Docker Hub.

Step 4: Daemon creates a container from the image.

Step 5: Daemon starts the container.

Step 6: Output shown in terminal.

```
1. docker run nginx
       ↓
2. Docker Client
       ↓ REST API
3. Docker Daemon
       ↓ Image not found locally
4. Docker Hub
       ↓ Pull nginx image
5. Docker Daemon
       ↓ Create container
6. Container Running
```

---

# containerd and runc

Under the daemon, Docker uses:

```
dockerd (Docker Daemon)
    ↓
containerd (Container Runtime)
    ↓
runc (Low-level container runner)
    ↓
Linux kernel (namespaces + cgroups)
```

**containerd** — manages container lifecycle.

**runc** — actually creates the container using Linux primitives.

---

# Linux Kernel Features Used

Docker containers are powered by:

**Namespaces** — isolation

```
pid    → Process isolation
net    → Network isolation
mnt    → Filesystem isolation
uts    → Hostname isolation
ipc    → Memory isolation
```

**cgroups** — resource limits

```
Limit CPU usage
Limit RAM usage
Limit disk I/O
```

---

# Docker Objects

```
Images      → Read-only templates
Containers  → Running instances of images
Volumes     → Persistent data storage
Networks    → Communication between containers
```

---

# Company Example — Zomato

Zomato engineers use Docker daily.

```
Developer types:
  docker run -p 3000:3000 zomato-api

Docker Client → sends to Docker Daemon
Docker Daemon → pulls zomato-api image from ECR
Docker Daemon → creates container
Container runs on port 3000
Developer tests the API
```

Same flow in production on AWS ECS.

---

# Interview Questions

## Q1. What are the main components of Docker architecture?

**Best Answer**

> Docker architecture has three main components: the Docker Client (CLI that sends commands), the Docker Daemon (dockerd — the engine that executes commands, builds images, manages containers), and the Docker Registry (stores images; Docker Hub is the default public registry).

---

## Q2. What is dockerd?

The Docker Daemon — a background service that manages all Docker objects: images, containers, volumes, and networks. It listens for Docker API requests from the Docker Client.

---

## Q3. What are Linux namespaces in Docker context?

Namespaces provide isolation between containers. Each container gets its own process space (pid namespace), network stack (net namespace), and filesystem (mnt namespace), making containers appear as separate systems.

---

## Q4. What is containerd?

containerd is an industry-standard container runtime that manages the complete container lifecycle — image transfer, container execution, snapshot storage, and network attachments. Docker uses it internally.

---

## Q5. Can the Docker Client and Daemon be on different machines?

Yes. The Docker Client communicates with the Daemon via a REST API over UNIX socket or TCP. You can configure your local Docker client to connect to a remote Docker daemon.

---

# Professional Summary

```
Docker Architecture:
  Client → CLI commands
  Daemon → Does all real work
  Registry → Stores images

Flow:
  docker run nginx
    → Client sends to Daemon
    → Daemon pulls from Registry
    → Daemon creates Container
    → Container starts
```
