Welcome to **Chapter 14 — Docker Commands**.

> **This is your complete Docker command reference. Every command you'll use daily in development and production is covered here.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine Docker is your DVD player.

```
Remote Control (Docker CLI)
  ↓
Play   → docker run
Pause  → docker pause
Stop   → docker stop
Eject  → docker rm
```

You know the remote → You control Docker.

---

# Image Commands

```bash
# Pull an image from Docker Hub
docker pull nginx
docker pull node:18
docker pull postgres:15

# List all local images
docker images
docker image ls

# Remove an image
docker rmi nginx
docker image rm nginx

# Remove all unused images
docker image prune
docker image prune -a   # remove ALL unused images

# Build image from Dockerfile
docker build -t myapp:v1 .
docker build -t myapp:v1 -f Dockerfile.prod .
docker build --build-arg NODE_ENV=production -t myapp .

# Tag an image
docker tag myapp:v1 myusername/myapp:v1

# Inspect an image
docker image inspect nginx

# View image history (layers)
docker image history nginx
```

---

# Container Commands

```bash
# Run a container
docker run nginx
docker run -d nginx                          # detached
docker run -d -p 8080:80 nginx              # with port mapping
docker run -d --name my-nginx nginx         # with name
docker run -it ubuntu bash                  # interactive

# List containers
docker ps                                   # running only
docker ps -a                               # all including stopped

# Stop / Start / Restart
docker stop my-nginx
docker start my-nginx
docker restart my-nginx

# Remove container
docker rm my-nginx
docker rm -f my-nginx                      # force remove running

# Remove all stopped containers
docker container prune

# View container logs
docker logs my-nginx
docker logs -f my-nginx                    # follow (tail -f)
docker logs --tail 100 my-nginx           # last 100 lines

# Execute command in running container
docker exec -it my-nginx bash
docker exec my-nginx ls /etc/nginx

# View container resource usage
docker stats
docker stats my-nginx

# Inspect container (JSON detail)
docker inspect my-nginx

# Copy files between host and container
docker cp myfile.txt my-nginx:/etc/nginx/
docker cp my-nginx:/etc/nginx/nginx.conf ./

# View running processes inside container
docker top my-nginx

# Pause / Unpause
docker pause my-nginx
docker unpause my-nginx

# Rename a container
docker rename my-nginx new-nginx
```

---

# Volume Commands

```bash
# Create a volume
docker volume create mydata

# List volumes
docker volume ls

# Inspect a volume
docker volume inspect mydata

# Remove a volume
docker volume rm mydata

# Remove all unused volumes
docker volume prune

# Use volume with container
docker run -v mydata:/app/data myapp
docker run -v $(pwd):/app myapp              # bind mount
```

---

# Network Commands

```bash
# Create a network
docker network create myapp-net
docker network create --driver bridge myapp-net

# List networks
docker network ls

# Inspect a network
docker network inspect myapp-net

# Connect container to network
docker network connect myapp-net my-container

# Disconnect container from network
docker network disconnect myapp-net my-container

# Remove a network
docker network rm myapp-net

# Remove unused networks
docker network prune
```

---

# Registry Commands

```bash
# Login to Docker Hub
docker login
docker login -u myusername

# Login to private registry
docker login registry.company.com

# Logout
docker logout

# Push image
docker push myusername/myapp:v1

# Pull image
docker pull myusername/myapp:v1

# Search Docker Hub
docker search nginx
```

---

# System Commands

```bash
# Show Docker version
docker --version
docker version

# System info
docker info

# Show disk usage
docker system df

# Remove everything unused (images, containers, networks, volumes)
docker system prune
docker system prune -a            # also removes unused images
docker system prune --volumes     # also removes volumes

# Show all running processes
docker top my-container

# Display system events
docker events
docker events --since 1h
```

---

# Docker Compose Commands

```bash
# Start all services
docker compose up
docker compose up -d                         # detached
docker compose up --build                   # rebuild images first
docker compose up --build api               # rebuild only 'api' service

# Stop services
docker compose down
docker compose down -v                      # also remove volumes

# View services
docker compose ps

# View logs
docker compose logs
docker compose logs -f api                  # follow specific service

# Execute command in service
docker compose exec api bash
docker compose exec db psql -U admin mydb

# Scale a service
docker compose up --scale api=3

# Build images
docker compose build
docker compose build api

# Pull latest images
docker compose pull

# Restart specific service
docker compose restart api

# View config (resolved YAML)
docker compose config
```

---

# Useful Combos

**Stop and remove ALL containers:**

```bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
```

**Remove ALL images:**

```bash
docker rmi $(docker images -q)
```

**Clean everything:**

```bash
docker system prune -a --volumes
```

**Follow logs of all compose services:**

```bash
docker compose logs -f
```

**Get shell in any running container:**

```bash
docker exec -it $(docker ps -q -f name=api) bash
```

---

# Docker Commands Cheat Sheet

```
IMAGES:
  docker pull [image]            Download image
  docker images                  List images
  docker build -t name .         Build from Dockerfile
  docker rmi [image]             Remove image
  docker image prune             Remove unused

CONTAINERS:
  docker run -d -p host:cont img Run container
  docker ps                      List running
  docker ps -a                   List all
  docker stop [name]             Stop container
  docker rm [name]               Remove container
  docker logs -f [name]          Follow logs
  docker exec -it [name] bash    Enter container
  docker stats                   Resource usage

VOLUMES:
  docker volume create [name]    Create volume
  docker volume ls               List volumes
  docker volume rm [name]        Remove volume

NETWORKS:
  docker network create [name]   Create network
  docker network ls              List networks
  docker network rm [name]       Remove network

SYSTEM:
  docker system prune -a         Clean everything
  docker system df               Disk usage
```

---

# Interview Questions

## Q1. What is docker run vs docker start?

`docker run` creates a new container from an image and starts it. `docker start` starts an already-created (stopped) container.

---

## Q2. How do you enter a running container?

```bash
docker exec -it container_name bash
```

---

## Q3. How do you clean up Docker resources?

```bash
docker system prune -a --volumes
```

Removes all unused containers, images, networks, and volumes.

---

## Q4. How do you view the logs of a container?

```bash
docker logs container_name        # all logs
docker logs -f container_name     # follow (live tail)
docker logs --tail 50 container_name  # last 50 lines
```

---

# Professional Summary

```
Most used commands daily:

docker build -t app:v1 .
docker run -d -p 3000:3000 --name api app:v1
docker ps
docker logs -f api
docker exec -it api bash
docker stop api && docker rm api
docker system prune -a

With Compose:
docker compose up -d
docker compose logs -f
docker compose down
```
