Welcome to **Chapter 8 — Docker Networking**.

> **Networking is how containers communicate with each other and the outside world. Every production Docker setup requires understanding networking.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a gated apartment complex.

```
🏘️ Apartment Complex (Docker Network)

  🏠 House 1 (Container: API)
  🏠 House 2 (Container: Database)
  🏠 House 3 (Container: Redis)
```

All houses inside the complex can talk to each other using **house numbers** (container names).

The **security guard at gate** decides who from outside can enter.

That's exactly how Docker networking works.

---

# Docker Network Types

```
bridge       → Default. Containers talk via IP. Custom bridges use DNS.
host         → Container uses host machine's network directly.
none         → No network. Completely isolated.
overlay      → Multi-host networking (Docker Swarm / Kubernetes).
macvlan      → Container gets its own MAC address on network.
```

---

# Default Bridge Network

When you run a container without specifying a network, it joins the **default bridge** network.

```bash
docker run -d --name app1 nginx
docker run -d --name app2 nginx
```

Both are on `bridge` network.

They can communicate **by IP**, but NOT by name.

```bash
docker network inspect bridge
```

---

# Custom Bridge Network (Best Practice)

Create your own network:

```bash
docker network create myapp-network
```

Run containers on it:

```bash
docker run -d --name api --network myapp-network myapi:v1
docker run -d --name db  --network myapp-network postgres:15
```

Now `api` can reach `db` by name:

```
API container pings: db:5432
→ Docker DNS resolves "db" to the container's IP
→ Connection established ✅
```

---

# Network Commands

**List networks:**

```bash
docker network ls
```

Output:

```
NETWORK ID     NAME              DRIVER    SCOPE
1c2d3e4f5a6b   bridge            bridge    local
7g8h9i0j1k2l   host              host      local
3m4n5o6p7q8r   none              null      local
9s0t1u2v3w4x   myapp-network     bridge    local
```

**Create a network:**

```bash
docker network create myapp-network
docker network create --driver bridge myapp-network
```

**Connect a container to a network:**

```bash
docker network connect myapp-network my-container
```

**Disconnect:**

```bash
docker network disconnect myapp-network my-container
```

**Inspect a network:**

```bash
docker network inspect myapp-network
```

**Remove a network:**

```bash
docker network rm myapp-network
```

**Remove unused networks:**

```bash
docker network prune
```

---

# Port Mapping

Expose container ports to the host:

```bash
docker run -p 8080:3000 myapp
```

```
Host Port 8080 → Container Port 3000

Browser: http://localhost:8080
→ Traffic goes to port 3000 inside container
```

Multiple ports:

```bash
docker run -p 8080:80 -p 443:443 nginx
```

Random host port:

```bash
docker run -p 3000 myapp
# Docker assigns a random host port
```

---

# Host Network

Container uses the host's network directly.

```bash
docker run --network host nginx
```

Port 80 inside container = Port 80 on your machine.

No port mapping needed.

Fast (no NAT overhead).

Less isolation.

Linux only (not supported on Docker Desktop Mac/Windows).

---

# Container Communication Example

Three containers need to talk:

```
node-api → postgres (database)
node-api → redis    (cache)
```

Setup:

```bash
docker network create backend-net

docker run -d \
  --name postgres \
  --network backend-net \
  -e POSTGRES_PASSWORD=secret \
  postgres:15

docker run -d \
  --name redis \
  --network backend-net \
  redis:7

docker run -d \
  --name node-api \
  --network backend-net \
  -p 3000:3000 \
  -e DB_HOST=postgres \
  -e CACHE_HOST=redis \
  myapi:v1
```

`node-api` connects to `postgres:5432` and `redis:6379` by container name.

---

# DNS in Custom Networks

Docker has a built-in DNS server.

In custom bridge networks:

```
Container name = DNS hostname

api → resolves to → api container's IP
db  → resolves to → db container's IP
```

This is why custom bridge networks are preferred over the default bridge.

---

# Company Example — Swiggy Microservices

```
docker network create swiggy-net

docker run -d --name order-svc   --network swiggy-net order-service:v2
docker run -d --name payment-svc --network swiggy-net payment-service:v2
docker run -d --name notify-svc  --network swiggy-net notification-service:v2
docker run -d --name redis       --network swiggy-net redis:7
docker run -d --name postgres    --network swiggy-net postgres:15
```

All services communicate by name.

Only the API Gateway port is exposed to the internet.

---

# Interview Questions

## Q1. What are Docker network types?

**Best Answer**

> Docker has five network drivers: **bridge** (default, containers on same host communicate), **host** (container shares host network stack), **none** (no networking), **overlay** (multi-host, for Docker Swarm), and **macvlan** (container gets its own MAC address). Custom bridge networks provide automatic DNS resolution between containers.

---

## Q2. What is the difference between bridge and host network?

Bridge creates an isolated network — containers get their own IP and must use port mapping to expose ports. Host makes the container use the host machine's network stack directly — no isolation, no port mapping needed.

---

## Q3. How do containers communicate with each other?

On a custom bridge network, containers communicate by name. Docker's internal DNS resolves container names to IPs. On the default bridge network, containers must use IP addresses.

---

## Q4. What is port mapping in Docker?

Port mapping (`-p hostPort:containerPort`) publishes a container's port to the host. External traffic to the host port is forwarded to the container port. Required to access containerized services from outside Docker.

---

# Professional Summary

```
Network Commands:
  docker network create mynet            → Create network
  docker network ls                      → List networks
  docker network inspect mynet           → View details
  docker network connect mynet container → Connect
  docker network rm mynet                → Remove

Best Practices:
  → Use custom bridge networks (not default bridge)
  → Custom networks = automatic DNS by container name
  → Only expose necessary ports with -p
  → Isolate services in their own networks
```
