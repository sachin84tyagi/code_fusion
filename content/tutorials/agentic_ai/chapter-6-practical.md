# 🧩 Chapter 6: Planning & Reasoning — The Agent's Strategy

> **Professor's Note:** Your agent can now remember everything. But intelligence isn't just about memory; it's about **strategy**. If you ask an agent to "Plan a 7-day trip to Japan," a basic agent will just start typing. A *reasoning* agent will stop, think, and say: "First, I need to check flight prices. Second, I need to look up popular cities. Third, I need to check the weather." This chapter is about giving your agent a **Pre-Frontal Cortex**. We're going to implement the **Plan-and-Execute** pattern, where the agent maps out its entire journey before taking the first step. 🗺️🧠

---

## 🏗️ The Problem: "Shotgun" Execution
Most basic agents use the "Shotgun" approach:
1. Receive task.
2. Immediately call the first tool they see.
3. Hope for the best.

This leads to loops, hallucinations, and wasted tokens.

---

## 🛠️ The Solution: The Plan-and-Execute Pattern

In this pattern, we split the agent's brain into two modes:
1. **The Planner:** Takes the big goal and breaks it into 3-5 logical sub-tasks.
2. **The Executor:** Takes one sub-task at a time, solves it, and reports back.

### The Reasoning Loop:
1. **PLAN:** "To solve X, I must do A, then B, then C."
2. **EXECUTE:** "Doing A now..."
3. **REFLECT:** "Did A work? If yes, move to B. If no, update the plan."

---

## 🚀 Let's Build: The Deep Research Strategist
We're building an agent that doesn't just search the web; it **plans its research**.
- **Task:** Research a complex topic (e.g., "The future of fusion energy").
- **Strategy:** It will create a 3-step research plan, execute each step, and then synthesize the final report.

---

## 🎓 Summary & Homework
### What we learned:
1. **Task Decomposition:** Breaking "Impossible" tasks into "Doable" steps.
2. **State Management:** Keeping track of where the agent is in its plan.
3. **Flexibility:** Allowing the agent to change its plan if it hits a roadblock.

### 📝 Exercise:
Add a "Self-Correction" step to the agent. After it finishes the research, have it ask itself: "Did I miss anything important?" If yes, add a new step to the plan!

---
**Next Module: Chapter 7 — Multi-Agent Systems (The Dream Team)** 👥
