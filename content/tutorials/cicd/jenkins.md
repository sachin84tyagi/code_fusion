Welcome to **Chapter 14 — Jenkins**.

> **Jenkins is the most widely used open-source CI/CD server in enterprise companies. If you work in a large company, you will almost certainly encounter Jenkins.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine GitHub Actions is a new, modern pizza delivery app.

Jenkins is the old-school, reliable pizza shop.

```
GitHub Actions (new delivery app):
  ✅ Easy to set up
  ✅ Free for public repos
  ✅ Built into GitHub
  ❌ Needs internet to GitHub
  ❌ Limited customization

Jenkins (old reliable shop):
  ✅ Run it on YOUR computer/server
  ✅ Total control
  ✅ Works with ANY system
  ✅ Thousands of plugins
  ❌ You have to set it up yourself
  ❌ You have to maintain it
```

Big companies like banks and telecom prefer Jenkins.

They want full control on their own servers.

---

# What is Jenkins?

**Jenkins** is an open-source automation server.

```
Free and open-source
Self-hosted (you run it on your server)
1800+ plugins
Works with any version control (Git, SVN, etc.)
Works with any language
Used by 50%+ of enterprises worldwide
```

---

# Jenkins vs GitHub Actions

| Feature | Jenkins | GitHub Actions |
| --- | --- | --- |
| Hosting | Self-hosted | Cloud (GitHub) |
| Cost | Free (your server cost) | Free tier + paid |
| Setup | Manual | Zero |
| Plugins | 1800+ | Marketplace actions |
| Integration | Any VCS | GitHub only |
| Maintenance | You | GitHub |
| Flexibility | Maximum | High |
| Popularity | Enterprise | Startups + Enterprise |

---

# Installing Jenkins

**Option 1 — Docker (Recommended):**

```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

Access: `http://localhost:8080`

**Option 2 — Native on Ubuntu:**

```bash
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key \
  | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ \
  | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt-get update
sudo apt-get install jenkins
```

---

# Jenkins Pipeline — Declarative Syntax

Jenkins pipelines are defined in a **Jenkinsfile**.

```groovy
// Jenkinsfile
pipeline {
    agent any    // Run on any available agent

    environment {
        APP_NAME = 'my-app'
        DOCKER_IMAGE = "myregistry/${APP_NAME}:${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/org/repo.git'
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit 'test-results/*.xml'    // Publish test results
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }

        stage('Push to Registry') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        docker login -u $DOCKER_USER -p $DOCKER_PASS
                        docker push ${DOCKER_IMAGE}
                    '''
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                sh "./deploy.sh staging ${DOCKER_IMAGE}"
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'    // Only deploy from main branch
            }
            input {
                message "Deploy to production?"
                ok "Yes, deploy!"
            }
            steps {
                sh "./deploy.sh production ${DOCKER_IMAGE}"
            }
        }
    }

    post {
        success {
            slackSend channel: '#deploys',
                      message: "✅ ${APP_NAME} deployed successfully!"
        }
        failure {
            slackSend channel: '#deploys',
                      message: "❌ ${APP_NAME} pipeline FAILED!"
            emailext subject: 'Build Failed',
                     body: 'Pipeline failed. Check Jenkins.',
                     to: 'team@company.com'
        }
        always {
            cleanWs()    // Clean workspace after build
        }
    }
}
```

---

# Jenkinsfile — Scripted Syntax

More flexible but more complex:

```groovy
node {
    def app
    
    stage('Clone repository') {
        checkout scm
    }

    stage('Build image') {
        app = docker.build("my-app:${env.BUILD_ID}")
    }

    stage('Test image') {
        app.inside {
            sh 'npm test'
        }
    }

    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
        }
    }
}
```

---

# Jenkins Credentials

Store secrets securely in Jenkins:

```
Jenkins Dashboard → Manage Jenkins → Credentials → Add Credentials

Types:
  Username/Password → for Docker Hub, AWS, etc.
  Secret Text      → for API keys, tokens
  SSH Username + Key → for server access
  Certificate      → for SSL certs
```

Use in Jenkinsfile:

```groovy
withCredentials([
    string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET')
]) {
    sh 'aws s3 sync dist/ s3://my-bucket/ --secret-key=$AWS_SECRET'
}
```

---

# Jenkins Agents

Jenkins uses a master-agent architecture.

```
Jenkins Master (Controller)
  → Orchestrates pipelines
  → Stores configuration
  → Manages agents

Jenkins Agents (Workers)
  → Actually run the pipeline jobs
  → Can be VMs, containers, physical servers
```

```groovy
pipeline {
    agent {
        docker {
            image 'node:18-alpine'    // Run job in Docker container
            args '-v /tmp:/tmp'
        }
    }
    stages {
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
```

---

# Jenkins Parallel Stages

```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps { sh 'npm run test:unit' }
                }
                stage('Integration Tests') {
                    steps { sh 'npm run test:integration' }
                }
                stage('Lint') {
                    steps { sh 'npm run lint' }
                }
            }
        }
        stage('Build') {
            steps { sh 'npm run build' }
        }
    }
}
```

All three run in parallel. Build starts when all complete.

---

# Jenkins Plugins

Essential plugins for modern pipelines:

```
Pipeline             → Core pipeline support
Git                  → GitHub/GitLab integration
Docker Pipeline      → Docker build/push
Credentials Binding  → Secure secrets injection
Blue Ocean           → Modern pipeline UI
Slack Notification   → Slack alerts
JUnit                → Test result reports
HTML Publisher       → Coverage reports
OWASP Dependency Check → Security scanning
Kubernetes           → Deploy to K8s
AWS Steps            → AWS integration
```

---

# Company Example — HDFC Bank

HDFC Bank uses Jenkins for core banking:

```groovy
pipeline {
    agent { label 'banking-agents' }    // Specific secure agents

    environment {
        REGISTRY = 'internal.registry.hdfc.com'
        DB_CREDS = credentials('oracle-prod-credentials')
    }

    stages {
        stage('Security Scan') {
            steps {
                sh 'sonarqube-scanner -Dsonar.projectKey=core-banking'
                sh 'dependency-check --project core-banking'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'mvn test -Dtest=unit/**'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
                docker.build("${REGISTRY}/core-banking:${BUILD_NUMBER}")
            }
        }

        stage('Deploy UAT') {
            steps {
                sh './deploy.sh uat'
            }
        }

        stage('Deploy Production') {
            input { message "RBI compliance check completed?" }
            steps {
                sh './deploy.sh production'
            }
        }
    }
}
```

Bank regulators require full audit trail.

Jenkins provides complete build history on their own servers.

No code leaves their data center.

---

# Interview Questions

## Q1. What is Jenkins?

**Best Answer**

> Jenkins is an open-source, self-hosted automation server used for CI/CD. It runs on your own infrastructure, has 1800+ plugins for integration with any tool, and supports complex pipelines through Jenkinsfiles written in Groovy. It's widely used in enterprises that need full control over their CI/CD infrastructure.

---

## Q2. What is a Jenkinsfile?

A text file stored in the root of the repository that defines the Jenkins pipeline as code. Supports two syntaxes: Declarative (structured, recommended for most cases) and Scripted (more flexible, uses full Groovy).

---

## Q3. What is the difference between Jenkins master and agent?

The Jenkins master (controller) manages the UI, configuration, and pipeline orchestration. Agents (workers) are separate machines that actually execute the pipeline steps. This allows parallel execution across multiple machines.

---

## Q4. Why do enterprises prefer Jenkins over GitHub Actions?

Jenkins runs on their own infrastructure — data never leaves their servers. This is critical for banks, government, healthcare, and defense. Jenkins also integrates with any VCS (not just GitHub), has more mature plugin ecosystem for enterprise tools, and offers more complex pipeline orchestration.

---

# Professional Summary

```
Jenkins = Self-hosted CI/CD server

Setup:
  docker run jenkins/jenkins:lts

Pipeline defined in: Jenkinsfile (Groovy)

Stages:
  stage('Name') { steps { sh 'command' } }

Parallel:
  parallel { stage('A') {...} stage('B') {...} }

Secrets:
  withCredentials([...]) { sh 'command' }

Post actions:
  post { success { ... } failure { ... } always { ... } }

Use Jenkins when:
  Enterprise security requirements
  Self-hosted required
  Non-GitHub VCS
  Complex custom integrations
```
