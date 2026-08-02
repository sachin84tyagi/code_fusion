Welcome to **Chapter 6 — Containers**.

> **Containers are the running instances of Docker images. Everything in Docker ultimately comes down to running containers.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Remember our cake recipe and cake example.

```
📋 Recipe = Docker Image  (inactive, on paper)

🎂 Cake   = Docker Container (alive, ready to eat)
```

You bake 10 cakes from one recipe.

You can eat a cake, put it in the fridge, throw it away.

The recipe stays untouched.

That's exactly how Docker containers work.

---

# What is a Container?

A **container** is a running instance of a Docker image.

```
Image        → static blueprint (read-only)
Container    → live running process (read + write layer)
```

When you run a container, Docker:

```
1. Takes the image (read-only layers)
2. Adds a writable layer on top
3. Starts the process
```

---

# Container Lifecycle

```
Created → Running → Paused → Stopped → Removed

docker create    → Creates but doesn't start
docker start     → Starts a created container
docker run       → Creates + starts in one step
docker pause     → Freezes the container
docker unpause   → Resumes a paused container
docker stop      → Graceful shutdown (SIGTERM → SIGKILL)
docker kill      → Immediate shutdown (SIGKILL)
docker rm        → Removes stopped container
```

---

# Core Container Commands

**Run a container:**

```bash
docker run nginx
```

**Run in detached mode (background):**

```bash
docker run -d nginx
```

**Run with port mapping:**

```bash
docker run -d -p 8080:80 nginx
```

`8080` = host port → `80` = container port

**Run with a name:**

```bash
docker run -d --name my-nginx -p 8080:80 nginx
```

**Run interactively:**

```bash
docker run -it ubuntu bash
```

`-it` = interactive terminal

---

# List Containers

**Running containers:**

```bash
docker ps
```

Output:

```
CONTAINER ID   IMAGE    COMMAND     STATUS         PORTS
a3d5f82b1c2e   nginx    "/..."      Up 5 minutes   0.0.0.0:8080->80/tcp
```

**All containers (including stopped):**

```bash
docker ps -a
```

---

# Manage Containers

**Stop a container:**

```bash
docker stop my-nginx
docker stop a3d5f82b1c2e
```

**Start a stopped container:**

```bash
docker start my-nginx
```

**Restart:**

```bash
docker restart my-nginx
```

**Remove a container:**

```bash
docker rm my-nginx
```

**Remove running container forcefully:**

```bash
docker rm -f my-nginx
```

---

# Container Logs

**View logs:**

```bash
docker logs my-nginx
```

**Follow logs in real time:**

```bash
docker logs -f my-nginx
```

**Last 50 lines:**

```bash
docker logs --tail 50 my-nginx
```

---

# Execute Commands Inside Running Container

```bash
docker exec -it my-nginx bash
```

You are now **inside** the container.

```bash
# Inside the container
ls /etc/nginx
cat /etc/nginx/nginx.conf
exit
```

---

# Container Stats

**Resource usage:**

```bash
docker stats
```

Output:

```
CONTAINER ID   CPU %    MEM USAGE   MEM LIMIT   NET I/O
a3d5f82b1c2e   0.0%     2.5 MiB     8 GiB       1.2kB/512B
```

---

# Inspect a Container

```bash
docker inspect my-nginx
```

Shows detailed JSON output:

```json
{
  "Id": "a3d5f82b1c2e...",
  "State": { "Status": "running" },
  "NetworkSettings": { "IPAddress": "172.17.0.2" },
  "Mounts": []
}
```

---

# Container vs Host Port

```
-p 8080:80
     │     │
     │     └── Container Port (app listens here)
     └──────── Host Port (your laptop/server port)
```

Visit `http://localhost:8080` → Traffic goes to container port 80.

---

# Auto-Remove Container After Exit

```bash
docker run --rm ubuntu echo "Hello"
```

Container runs, prints "Hello", then automatically removed.

---

# Resource Limits

```bash
# Limit to 512 MB RAM and 1 CPU
docker run -d \
  --memory="512m" \
  --cpus="1.0" \
  -p 3000:3000 \
  myapp:v1
```

---

# Company Example — Razorpay

Razorpay runs containers for each payment gateway:

```
docker run -d \
  --name razorpay-api \
  --memory="1g" \
  --cpus="2.0" \
  -p 8080:8080 \
  --env NODE_ENV=production \
  --env DB_URL=postgresql://db:5432/payments \
  razorpay-api:v3.2
```

Monitoring with `docker stats` in real time.

Logs aggregated with `docker logs -f razorpay-api`.

---

# Interview Questions

## Q1. What is a Docker container?

**Best Answer**

> A container is a runnable instance of a Docker image. It is isolated from the host and other containers, has its own filesystem (built from the image layers plus a writable layer), its own network interface, and its own process space. Containers are lightweight, portable, and start in seconds.

---

## Q2. What is the difference between docker run and docker start?

`docker run` creates a new container from an image and starts it. `docker start` restarts an already-existing (stopped) container without creating a new one.

---

## Q3. What does the -d flag mean in docker run?

`-d` stands for detached mode. The container runs in the background and you get the terminal prompt back immediately.

---

## Q4. How do you access a running container's shell?

```bash
docker exec -it container_name bash
# or for alpine-based containers:
docker exec -it container_name sh
```

---

## Q5. What happens to container data when it stops?

The container's writable layer is preserved when a container stops. Data is only lost when the container is **removed** (`docker rm`). For persistent data across container removal, use **Volumes**.

---

# Professional Summary

```
Container Commands:
  docker run -d -p 8080:80 --name app nginx  → Run container
  docker ps                                   → List running
  docker ps -a                                → List all
  docker stop app                             → Stop container
  docker rm app                               → Remove container
  docker logs -f app                          → Follow logs
  docker exec -it app bash                    → Enter container
  docker stats                                → Resource usage
```
