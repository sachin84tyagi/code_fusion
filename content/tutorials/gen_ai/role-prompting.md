# Phase 4: Prompt Engineering (PRO) - Step 2 (Role Prompting & Formatting)

Prompting is not just about *what* you ask, but *who* you ask and *how* you want the answer delivered. 

---
## Why This Is a "Power Move"

In the real world, AI can sometimes be **"chatty."**  
By using roles and tags, you treat the AI like a **Software Component** that returns predictable, JSON-wrapped data.

## 1. Role Prompting (The Persona)
By default, an AI is a generalist. To get expert-level results, you must tell the AI to adopt a specific **Role**.

- **Bad:** "What are the risks of this code?"
- **Pro:** "You are a **Senior Cybersecurity Auditor** with 20 years of experience in penetration testing. Analyze this code for SQL injection vulnerabilities."

**Why it works:** It forces the model to prioritize a specific subset of its training data (e.g., technical security docs over general blogs).

## 2. Output Formatting & Delimiters
In production, you often need to extract **part** of an AI response. To make this easy, we use **Delimiters** (like `###`, `---`, or XML-style tags `<data></data>`).

**The Goal:** Tell the AI exactly how to wrap the information so your Python code can "find" it easily.

---

## 3. The Coding Exercise (Hands-on)

We are going to build a script that uses a **Security Expert** role and **XML tags** to strictly separate the "Analysis" from the "Fix."

#### Step 1: The "Expert Prompt" script
Create a file named `role_prompting.py` inside your `Phase4` folder:

```python
from openai import OpenAI

# Standard Setup (Mock Mode)
client = OpenAI(api_key="sk-DUMMY")
USE_MOCK = True

def audit_code(code_snippet):
    # Professional System Prompt using Roles and Delimiters
    system_prompt = """
    You are a Senior Python Developer. 
    Analyze the code provided by the user. 
    
    Structure your response using these tags:
    <analysis>Describe the problem here</analysis>
    <fix>Provide the corrected code here</fix>
    """

    print(f"\nScanning Code:\n{code_snippet}")

    if USE_MOCK:
        reply = """
        <analysis>The code uses 'input()' directly in a string, leading to potential security risks.</analysis>
        <fix>use parameters instead of f-strings for queries.</fix>
        """
    else:
        # REAL API CALL
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": code_snippet}
            ]
        )
        reply = response.choices[0].message.content

    # The Professional Power Move: Extracting the XML parts
    # Even if the AI 'chats' before/after, we only want the Analysis.
    analysis = reply.split("<analysis>")[1].split("</analysis>")[0]
    print(f"\n--- SECURITY ANALYSIS ---\n{analysis.strip()}")

# Test it
audit_code("query = f'SELECT * FROM users WHERE name = {user_input}'")
```

---

## 4. Why this matters (Job Insight)
When building an **AI Agent**, you don't want the AI to just "talk." You want it to generate a command that your system can execute. By using **Roles** and **Strict Formats**, you ensure the AI behaves like a reliable software component, not just a chatbot.

---
**Summary:**
- **Roles:** Define the "Expertise" level.
- **Delimiters:** Define the "Structure" for easy parsing.

**Next Step:** Once you run this, we'll tackle the most important reliability topic: [Hallucination Control & Debugging](file:///d:/myFirstAITest/Phase4/phase4_debugging.md). 🚀
