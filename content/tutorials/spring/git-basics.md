Welcome to **Chapter 8 — Git Basics**.

> **Git is how professional developers track code changes, collaborate with teams, and never lose their work. Every company uses it. Learn it once, use it forever.**

---

# Learning Roadmap

* 👶 Level 1 – Child
* 🧒 Level 2 – Beginner
* 👨‍💻 Level 3 – Practical
* 🏢 Level 4 – Real Company Example
* 🎯 Level 5 – Interview Questions

---

# 👶 Level 1 — Child Explanation

Imagine writing a book.

```
Without Git:
  book_v1.docx
  book_v2.docx
  book_v2_final.docx
  book_v2_final_REAL.docx
  book_FINAL_USE_THIS.docx
  😵 Which one is the real final?
```

```
With Git:
  book.docx (one file)
  Git tracks every change:
    "Chapter 1 added" (yesterday)
    "Fixed typo in Chapter 2" (today)
    "Added Chapter 3" (just now)

  Go back to ANY version anytime!
```

**Git = Time machine for your code.**

---

# What is Git?

**Git** is a **distributed version control system** that:
- Tracks every change you make to files
- Lets you go back to any previous state
- Lets multiple developers work on the same code simultaneously
- Keeps a complete history of who changed what and when

**GitHub/GitLab** = Online hosting for Git repositories (team collaboration)

---

# Installation & Setup

```bash
# Download Git from git-scm.com
# Then configure identity

git config --global user.name "Sachin Tyagi"
git config --global user.email "sachin@example.com"

# Verify
git config --list

# Check version
git --version
```

---

# Core Concepts

```
Working Directory → Staging Area → Repository (Local) → Remote (GitHub)

Working Dir:    Files you're editing right now
Staging Area:   Files ready to be committed (add with git add)
Local Repo:     Your committed history on your machine
Remote Repo:    GitHub/GitLab — shared with team
```

---

# Starting a Repository

```bash
# Option 1: Start fresh in existing folder
cd d:/code_fusion/my-spring-project
git init
# Creates .git hidden folder — repository created!

# Option 2: Clone existing project from GitHub
git clone https://github.com/username/spring-project.git
cd spring-project
```

---

# The Daily Workflow

```bash
# Check what changed
git status

# See exact changes (line by line)
git diff

# Stage specific file
git add src/main/java/UserService.java

# Stage all changes
git add .

# Commit staged changes with message
git commit -m "Add user registration endpoint"

# See commit history
git log
git log --oneline   # Compact view

# Push to remote (GitHub)
git push origin main
```

---

# git status — Your Best Friend

```bash
git status

# Output:
On branch main
Changes not staged for commit:
  modified:   src/main/java/UserService.java

Untracked files:
  src/main/java/ProductController.java

# Meaning:
# UserService.java → modified, not staged
# ProductController.java → new file, Git doesn't know about it yet
```

---

# The 3 States of a File

```
Untracked → git add → Staged → git commit → Committed

Untracked:  Git doesn't know this file exists
Staged:     Ready to be committed (in "staging area")
Committed:  Saved in Git history permanently
Modified:   Tracked file changed but not staged
```

---

# Writing Good Commit Messages

```bash
# ❌ Bad commit messages
git commit -m "fix"
git commit -m "changes"
git commit -m "asdfgh"

# ✅ Good commit messages (imperative mood)
git commit -m "Add JWT authentication to UserController"
git commit -m "Fix NullPointerException in OrderService"
git commit -m "Update pom.xml: add spring-boot-starter-security"
git commit -m "Refactor: extract UserMapper to separate class"

# Format convention (professional):
# Type: short description
# Types: feat, fix, refactor, docs, test, chore, style

git commit -m "feat: add forgot password endpoint"
git commit -m "fix: correct email validation regex"
git commit -m "refactor: move DTO classes to dto package"
```

---

# Branching — Parallel Development

Branches let you work on features without affecting the main code.

```bash
# View all branches
git branch

# Create new branch
git branch feature/user-authentication

# Switch to branch
git checkout feature/user-authentication

# Create AND switch (shortcut)
git checkout -b feature/product-search

# List remote branches
git branch -r

# Delete branch (after merging)
git branch -d feature/user-authentication

# Force delete (unmerged branch)
git branch -D feature/user-authentication
```

---

# Branch Strategy (Professional)

```
main          → Production-ready code only
develop       → Integration branch
feature/*     → New features (created from develop)
fix/*         → Bug fixes
hotfix/*      → Urgent production fixes

Flow:
  feature/user-auth → develop → main
```

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/order-tracking

# ... make changes, commit ...

# Merge back to develop
git checkout develop
git merge feature/order-tracking
git push origin develop
```

---

# Merging

```bash
# Switch to target branch
git checkout main

# Merge source branch into current branch
git merge feature/user-auth

# If merge conflict — edit the conflict markers in files:
# <<<<<<< HEAD
# Your change
# =======
# Their change
# >>>>>>> feature/user-auth

# After resolving conflicts:
git add .
git commit -m "Merge: resolve conflict in UserService"
```

---

# Remote Repository (GitHub)

```bash
# Add remote
git remote add origin https://github.com/sachin/my-spring-app.git

# View remotes
git remote -v

# Push branch to remote
git push origin main
git push origin feature/user-auth

# Push and set upstream (first push)
git push -u origin main

# Pull latest from remote
git pull origin main

# Fetch without merging
git fetch origin
```

---

# Undoing Changes

```bash
# Undo changes in working directory (before staging)
git restore UserService.java         # Discard file changes
git restore .                        # Discard ALL changes

# Unstage a file (after git add, before commit)
git restore --staged UserService.java

# Undo last commit (keep changes in working dir)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a commit (create new commit that undoes it — safe for shared branches)
git revert abc123

# View a specific old commit
git show abc123

# Go back to specific commit temporarily
git checkout abc123
```

---

# .gitignore — Files to Never Commit

Create `.gitignore` at project root:

```gitignore
# Spring Boot .gitignore

# Build output
target/
*.class
*.jar
*.war

# IDE files
.idea/
*.iml
.vscode/
.eclipse/
*.project
*.classpath

# Maven wrapper
!.mvn/wrapper/maven-wrapper.jar

# Environment / Secrets — NEVER COMMIT!
.env
*.env
application-prod.properties
application-local.properties

# Logs
*.log
logs/

# OS files
.DS_Store
Thumbs.db

# Uploaded files
uploads/
```

---

# Viewing History

```bash
# Full history
git log

# Compact one-line
git log --oneline

# With graph (branches)
git log --oneline --graph --all

# Changes in each commit
git log -p

# Last 5 commits
git log -5

# By author
git log --author="Sachin"

# By date
git log --after="2024-01-01"

# Search commit messages
git log --grep="authentication"

# Who changed which line (blame)
git blame UserService.java
```

---

# Tagging Releases

```bash
# Create tag (release marker)
git tag v1.0.0
git tag v1.0.0 -m "First production release"

# List tags
git tag

# Push tags to remote
git push origin v1.0.0
git push origin --tags  # Push all tags
```

---

# Pull Request Workflow (Team Collaboration)

```
1. Create feature branch
   git checkout -b feature/payment-gateway

2. Make commits
   git add . && git commit -m "feat: add Razorpay integration"

3. Push branch to GitHub
   git push origin feature/payment-gateway

4. Open Pull Request (PR) on GitHub
   → Compare: feature/payment-gateway → main
   → Add description, screenshots, test results
   → Assign reviewers

5. Code Review
   → Teammates review your code
   → Leave comments, suggest changes
   → You update with new commits

6. Merge PR (after approval)
   → Squash and merge (recommended)
   → Branch is deleted

7. Pull main locally
   git checkout main
   git pull origin main
```

---

# Git Commands Cheat Sheet

```bash
Setup
  git config --global user.name "Name"
  git config --global user.email "email"

Start
  git init               Create new repo
  git clone <url>        Copy remote repo

Track
  git status             Show changes
  git add .              Stage all
  git add <file>         Stage specific file
  git diff               Show unstaged changes

Save
  git commit -m "msg"    Save snapshot
  git log --oneline      View history

Branches
  git branch             List branches
  git checkout -b <name> Create & switch
  git merge <branch>     Merge branch
  git branch -d <name>   Delete branch

Remote
  git remote add origin <url>  Add remote
  git push origin main         Push
  git pull origin main         Pull
  git fetch origin             Fetch only

Undo
  git restore <file>     Discard changes
  git reset --soft HEAD~1  Undo last commit
  git revert <hash>        Safe undo (team)
```

---

# Company Example — Infosys Team Workflow

```bash
# Monday: Start new feature (user management)
git checkout develop
git pull origin develop                     # Get latest
git checkout -b feature/user-management     # Create branch

# Code all day...
git add .
git commit -m "feat: add UserController with CRUD endpoints"
git commit -m "feat: add UserService with business logic"
git commit -m "feat: add UserRepository with custom queries"
git commit -m "test: add unit tests for UserService"

# End of day: Push to remote (backup + team visibility)
git push origin feature/user-management

# Tuesday: Continue work
git pull origin feature/user-management     # Get my latest from remote
# ... more coding and commits ...

# Feature complete: Open PR
git push origin feature/user-management
# → Go to GitHub → New Pull Request → Request review

# After PR approval:
# Merge via GitHub UI
# Then locally:
git checkout develop
git pull origin develop                     # Get merged code
git branch -d feature/user-management      # Delete local branch
```

---

# Interview Questions

## Q1. What is Git?

**Best Answer**
> Git is a distributed version control system that tracks changes in source code. It allows multiple developers to collaborate, maintains a complete history of all changes, enables branching for parallel development, and allows reverting to any previous state.

---

## Q2. What is the difference between `git fetch` and `git pull`?

`git fetch` downloads changes from remote but doesn't merge them into your local branch — it updates remote tracking branches only. `git pull` = `git fetch` + `git merge` — downloads and immediately integrates into current branch.

---

## Q3. What is the difference between `git reset` and `git revert`?

`git reset` rewrites commit history — not safe for shared branches as it changes history others have. `git revert` creates a NEW commit that undoes the specified commit — safe for shared branches because history is preserved.

---

## Q4. What is a merge conflict and how do you resolve it?

A conflict occurs when two branches modify the same lines of a file. Git marks the conflict with `<<<<<<<`, `=======`, `>>>>>>>` markers. You manually edit the file to keep the correct version, then `git add` and `git commit`.

---

## Q5. What is a Pull Request?

A PR is a request to merge code from one branch into another, done on GitHub/GitLab. It enables code review — teammates review your changes, leave comments, and approve before merging. It's the standard collaborative workflow in professional teams.

---

# Professional Summary

```
Core workflow:
  git add . → git commit -m "msg" → git push origin branch

Daily commands:
  git status           What changed?
  git pull origin main Get latest
  git log --oneline    What was committed?

Branching:
  git checkout -b feature/name  Create branch
  git merge feature/name        Merge branch
  git branch -d feature/name    Delete branch

Remote:
  git push origin branch  Share your work
  git pull origin main    Get team's work

.gitignore:
  target/, *.class, .env, application-prod.properties

Rule: Never commit secrets to Git!
```

---

# 🧠 Memory Trick

```
Git = Photographer for your code

git add .       → "Pose for photo" (stage)
git commit      → "Click!" (take snapshot)
git push        → "Upload to cloud" (share)
git pull        → "Download team's photos" (sync)
git branch      → "New photo album" (feature branch)
git merge       → "Combine albums" (merge branches)
git log         → "Browse photo history"
git revert      → "Untake a photo" (safe undo)
```

---

# 🚀 Next Chapter

We've completed all prerequisites! Now let's dive into **Java Basics for Spring** — the specific Java patterns Spring Boot uses every day.
