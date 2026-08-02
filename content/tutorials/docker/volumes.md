Welcome to **Chapter 7 — Docker Volumes**.

> **Containers are stateless by default. When a container is removed, all its data is gone. Volumes are Docker's solution for persistent data storage.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine you are writing notes on a whiteboard.

When you erase the whiteboard — all notes are gone.

```
🗒️ Whiteboard (Container)
   → Erase = Remove container
   → All notes lost!
```

Now imagine writing in a notebook instead.

```
📓 Notebook (Volume)
   → Even if whiteboard erases
   → Notes in notebook survive
```

Docker **Volumes** are that notebook.

Data lives outside the container.

Container can be removed and recreated.

Data is still there.

---

# The Problem Without Volumes

```bash
docker run -d --name mydb postgres:15

# Insert some data...

docker rm -f mydb
# All database data is GONE forever ❌
```

This is catastrophic for a database.

---

# What is a Docker Volume?

A **Volume** is a directory managed by Docker that exists on the **host machine** outside the container filesystem.

```
Container (removed)     Volume (persists)
       ↑                      ↑
  Temporary data         Permanent data
  (writable layer)       (Docker managed)
```

---

# Types of Storage in Docker

```
1. Volumes         → Docker managed, best for production
2. Bind Mounts     → Host directory mapped to container
3. tmpfs Mounts    → In-memory, not persisted
```

---

# Creating and Using Volumes

**Create a volume:**

```bash
docker volume create mydata
```

**List volumes:**

```bash
docker volume ls
```

Output:

```
DRIVER    VOLUME NAME
local     mydata
local     postgres_data
```

**Use a volume with a container:**

```bash
docker run -d \
  --name mydb \
  -v mydata:/var/lib/postgresql/data \
  postgres:15
```

`mydata` = volume name
`/var/lib/postgresql/data` = path inside container

**Inspect a volume:**

```bash
docker volume inspect mydata
```

Output:

```json
{
  "Name": "mydata",
  "Mountpoint": "/var/lib/docker/volumes/mydata/_data",
  "Driver": "local"
}
```

**Remove a volume:**

```bash
docker volume rm mydata
```

**Remove all unused volumes:**

```bash
docker volume prune
```

---

# Volume in Action — Database

```bash
# Run PostgreSQL with persistent volume
docker run -d \
  --name postgres-db \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=myapp \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15
```

Now:

```bash
# Remove container
docker rm -f postgres-db

# Recreate it with same volume
docker run -d \
  --name postgres-db \
  -e POSTGRES_PASSWORD=secret \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15

# ✅ All data is still there!
```

---

# Volume in Dockerfile

```dockerfile
FROM postgres:15

VOLUME ["/var/lib/postgresql/data"]
```

This declares a volume mount point.

Docker automatically creates an anonymous volume when the container starts.

---

# Volume vs Bind Mount

| Feature | Volume | Bind Mount |
| --- | --- | --- |
| Managed by | Docker | Host OS |
| Location | `/var/lib/docker/volumes/` | Any path you specify |
| Portability | Excellent | Machine-dependent |
| Best for | Production databases | Development code sync |
| Backup | `docker volume` commands | Manual file copy |

---

# Bind Mount Example (Development)

```bash
docker run -d \
  --name dev-server \
  -v $(pwd):/app \
  -p 3000:3000 \
  node:18
```

`$(pwd)` = current directory on host

`/app` = path inside container

Changes to local files are **instantly reflected** inside the container.

Perfect for development.

---

# Read-Only Volume

```bash
docker run -d \
  -v myconfig:/etc/config:ro \
  myapp:v1
```

`:ro` = read-only inside container.

Container can read the config but cannot write.

---

# Backup a Volume

```bash
docker run --rm \
  -v mydata:/source \
  -v $(pwd):/backup \
  ubuntu \
  tar czf /backup/mydata-backup.tar.gz /source
```

Creates a compressed backup of the volume on your host.

---

# Company Example — MongoDB at ShareChat

ShareChat uses MongoDB in Docker.

```bash
docker run -d \
  --name mongodb \
  -v mongo_data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -p 27017:27017 \
  mongo:6
```

Even during deployments and container restarts —

`mongo_data` volume preserves all user posts and messages.

---

# Interview Questions

## Q1. Why do we need Docker Volumes?

**Best Answer**

> Containers are ephemeral — data written inside a container's filesystem is lost when the container is removed. Volumes provide a persistent storage mechanism managed by Docker that exists outside the container lifecycle. Critical for databases, file uploads, and any stateful data.

---

## Q2. What is the difference between a Volume and a Bind Mount?

A Volume is managed by Docker and stored in Docker's directory (`/var/lib/docker/volumes/`). A Bind Mount maps a specific host directory to the container. Volumes are portable and preferred for production; Bind Mounts are useful for development to sync code changes.

---

## Q3. How do you persist database data in Docker?

Use a named volume for the database's data directory. For PostgreSQL: `-v postgres_data:/var/lib/postgresql/data`. For MongoDB: `-v mongo_data:/data/db`. The volume persists even if the container is deleted.

---

## Q4. What is the Mountpoint of a Docker Volume?

The actual location on the host filesystem where the volume data is stored. Found using `docker volume inspect`. Usually `/var/lib/docker/volumes/[name]/_data`.

---

# Professional Summary

```
Volumes = Persistent data outside containers

Commands:
  docker volume create mydata           → Create volume
  docker volume ls                      → List volumes
  docker volume inspect mydata          → View details
  docker volume rm mydata               → Remove volume
  docker volume prune                   → Remove unused

Usage:
  docker run -v mydata:/container/path  → Mount volume
  docker run -v $(pwd):/app             → Bind mount (dev)
  docker run -v config:/etc:ro          → Read-only
```
