Welcome to **Chapter 12 — Environment Variables in Docker**.

> **Environment variables are how you configure Docker containers without hardcoding secrets into images. They are a fundamental DevOps security practice.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine a TV remote.

Same TV.

Same remote buttons.

But different channels depending on where you press.

```
Button 1 → Channel 1 (Development)
Button 2 → Channel 2 (Testing)
Button 3 → Channel 3 (Production)
```

Environment variables are those buttons.

Same Docker image.

Different configuration for different environments.

---

# Why Environment Variables?

**The Wrong Way — Hardcoded:**

```dockerfile
ENV DB_PASSWORD=mypassword123
ENV API_KEY=secret_key_here
```

Problem:

```
❌ Password is in Dockerfile
❌ Password is in the image
❌ Anyone who pulls the image sees it
❌ Changing requires rebuilding image
```

**The Right Way — Environment Variables:**

```bash
docker run -e DB_PASSWORD=mypassword123 myapp
```

```
✅ Password not in image
✅ Different value per environment
✅ Changed without rebuilding
✅ Secure
```

---

# Setting Environment Variables

**Inline with -e:**

```bash
docker run -d \
  -e NODE_ENV=production \
  -e DB_HOST=postgres \
  -e DB_PORT=5432 \
  -e DB_NAME=myapp \
  -e DB_USER=admin \
  -e DB_PASS=secret \
  -e PORT=3000 \
  -p 3000:3000 \
  myapp:v1
```

**From .env file:**

```bash
docker run -d --env-file .env -p 3000:3000 myapp:v1
```

**.env file:**

```
NODE_ENV=production
DB_HOST=postgres
DB_PORT=5432
DB_NAME=myapp
DB_USER=admin
DB_PASS=secret
PORT=3000
```

---

# ENV in Dockerfile

Set defaults that can be overridden:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY . .
RUN npm ci --only=production

# Default values (can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info

EXPOSE $PORT
CMD ["node", "index.js"]
```

Override at runtime:

```bash
docker run -e PORT=8080 -e LOG_LEVEL=debug myapp:v1
```

---

# ARG vs ENV

```dockerfile
# ARG — available ONLY during build time
ARG BUILD_VERSION=1.0

# ENV — available during build AND runtime
ENV APP_VERSION=$BUILD_VERSION
```

```bash
# Pass ARG at build time
docker build --build-arg BUILD_VERSION=2.5 -t myapp .

# Pass ENV at run time
docker run -e APP_VERSION=2.5 myapp
```

| | ARG | ENV |
| --- | --- | --- |
| Build time | ✅ | ✅ |
| Runtime | ❌ | ✅ |
| Visible in image | ❌ | ✅ |
| Use for secrets | ⚠️ No | ⚠️ No |

---

# Accessing in Code

**Node.js:**

```javascript
const dbHost = process.env.DB_HOST || 'localhost';
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';

console.log(`Connecting to DB at ${dbHost}`);
console.log(`Server running on port ${port}`);
```

**Python:**

```python
import os

db_host = os.getenv('DB_HOST', 'localhost')
port = int(os.getenv('PORT', '8000'))
env = os.getenv('ENVIRONMENT', 'development')
```

**Java:**

```java
String dbHost = System.getenv("DB_HOST");
String port = System.getenv("PORT");
```

---

# Environment Variables in Docker Compose

```yaml
version: '3.9'

services:
  api:
    image: myapp:v1
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_HOST=postgres
    env_file:
      - .env.production
    ports:
      - "3000:3000"

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}   # from .env file
```

**.env** (in same directory as docker-compose.yml):

```
DB_PASSWORD=mysecretpassword
```

---

# Best Practices for Secrets

**Never put real secrets in:**

```
❌ Dockerfile (ENV instruction)
❌ docker-compose.yml
❌ Git repository
```

**Do put secrets in:**

```
✅ .env file (add to .gitignore!)
✅ Cloud secret managers (AWS Secrets Manager, GCP Secret Manager)
✅ Docker Secrets (Docker Swarm)
✅ Kubernetes Secrets (K8s)
✅ CI/CD environment variables (GitHub Secrets, Jenkins Credentials)
```

**.gitignore:**

```
.env
.env.local
.env.production
*.secret
```

---

# Company Example — PhonePe

PhonePe manages secrets using AWS Secrets Manager.

```bash
# CI/CD pipeline fetches secrets at deploy time
DB_PASSWORD=$(aws secretsmanager get-secret-value \
  --secret-id prod/phonepe/db-password \
  --query SecretString \
  --output text)

docker run -d \
  -e DB_PASSWORD=$DB_PASSWORD \
  -e PAYMENT_GATEWAY_KEY=$PAYMENT_KEY \
  -e NODE_ENV=production \
  phonepe-api:v4.2
```

Secrets never stored in code.

Rotated regularly.

Audit trail of access.

---

# Interview Questions

## Q1. How do you pass environment variables to a Docker container?

**Best Answer**

> Use `-e KEY=VALUE` for inline variables, or `--env-file .env` to load from a file. In docker-compose.yml, use the `environment:` key or `env_file:` key. Best practice is to use a `.env` file that is excluded from version control.

---

## Q2. What is the difference between ARG and ENV in Dockerfile?

ARG is a build-time variable — only available during `docker build`. ENV is a runtime variable — available during build and when the container runs. Neither should be used for sensitive secrets as both can be inspected.

---

## Q3. How do you keep secrets out of Docker images?

Never use ENV in Dockerfile for secrets. Use environment variables passed at runtime, cloud secret managers, or orchestrator-native secrets (Docker Secrets, Kubernetes Secrets). Add .env files to .gitignore.

---

## Q4. How do you view environment variables set in a running container?

```bash
docker exec container_name env
# or
docker inspect container_name | grep -A 20 "Env"
```

---

# Professional Summary

```
Environment Variables in Docker:

Inline:
  docker run -e KEY=VALUE image

From file:
  docker run --env-file .env image

In Dockerfile (defaults):
  ENV KEY=default_value

In docker-compose.yml:
  environment:
    - KEY=value
  env_file:
    - .env

Security:
  Never commit secrets to git
  Use secret managers in production
  Add .env to .gitignore
```
