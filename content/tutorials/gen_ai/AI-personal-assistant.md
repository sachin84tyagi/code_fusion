# Phase 4: Prompt Engineering (PRO) - Step 4 (Final Project: Smart AI Assistant)

You've learned the full toolkit of a Prompt Engineer: **Few-shot patterns**, **Chain of Thought logic**, **Role Personas**, and **Self-Reflection**.

Now, it's time to build a **Smart AI Personal Assistant** that doesn't just "chat," but actually analyzes, reflects, and provides expert-grade structured advice.

---

## 1. Project Requirements
Your assistant must demonstrate three professional qualities:
1.  **Strict Persona:** It must act as a "Chief of Staff" (an elite organizer).
2.  **Structural Integrity:** It must use XML tags to separate its "Step-by-Step Logic" from its "Final Advice."
3.  **Accuracy Guard:** It must use a Reflection step to ensure it isn't hallucinating.

---

## 2. The Coding Project (Hands-on)

#### Step 1: The Smart Assistant script
Create a file named `smart_assistant.py` inside your `Phase4` folder:

```python
from openai import OpenAI

client = OpenAI(api_key="sk-DUMMY")
USE_MOCK = True

def solve_task(task_description):
    print(f"\n[NEW TASK]: {task_description}")

    # ELITE PROMPT combining ALL Phase 4 techniques
    system_prompt = """
    You are an Elite Chief of Staff.
    Your goal is to help the user solve complex organizational tasks.
    
    RULES:
    1. First, reason through the task in <logic> tags.
    2. Then, provide the final plan in <action_plan> tags.
    3. Finally, double-check your work for realistic errors in <guard> tags.
    """

    if USE_MOCK:
        reply = """
        <logic>The user wants to plan a tech conference. Key steps: Venue, Speakers, Tickets.</logic>
        <action_plan>1. Secure a hall for 500 people. 2. Invite 5 keynote speakers.</action_plan>
        <guard>Note: Ensure the venue has high-speed Wi-Fi, which is often forgotten.</guard>
        """
    else:
        # REAL API CALL
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": task_description}
            ],
            temperature=0.0
        )
        reply = response.choices[0].message.content

    # Extracting the components for the UI
    try:
        logic = reply.split("<logic>")[1].split("</logic>")[0].strip()
        plan = reply.split("<action_plan>")[1].split("</action_plan>")[0].strip()
        guard = reply.split("<guard>")[1].split("</guard>")[0].strip()

        print(f"\n🧠 THINKING:\n{logic}")
        print(f"\n📋 ACTION PLAN:\n{plan}")
        print(f"\n🛡️ RELIABILITY CHECK:\n{guard}")
    except:
        print(f"\n[RAW AI OUTPUT]:\n{reply}")

# Test your Assistant
solve_task("I want to organize a 3-day AI workshop for 50 students.")
```

---

## 3. Graduation Insight
By using **XML tags**, you enable your software to "see" inside the AI's mind. You can show the `action_plan` to the user, but keep the `logic` hidden in your logs. This is how sophisticated AI software (like Auto-GPT or Devin) works under the hood.

**Phase 4 is now officially COMPLETE!** You have mastered the art of "Programming with Words." 🚀🎓

Next, we enter **Phase 5: Embeddings + Vector DB + RAG**. This is where we give the AI a **Long-Term Memory**! 🧠💾
