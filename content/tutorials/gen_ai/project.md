# Phase 3: Using LLM APIs - Step 4 (Final Project: AI Chatbot)

Congratulations! You've reached the final step of Phase 3. You've learned how to connect to APIs, control the model's personality, and handle structured data. 

Now, we combine all of that to build your first real-world application: **The Interactive AI Chatbot**.

## HINT - Try This Sequence

1. Tell it: **"My name is [Your Name]."**  
2. Ask it: **"What is my name?"**  
3. Observe how it uses its conversation history to answer!
---

## 1. What makes a "Chatbot" real?
Most scripts we've written so far are "one-hit wonders"—you ask a question, you get an answer, and the program ends.
A real chatbot has **Persistent Memory**. 
- It remembers that you said "Hi" 5 minutes ago.
- It remembers your name if you tell it.

In AI Engineering, "Memory" is just a Python **List** of previous `messages` that we send back to the API every time we ask a new question.

---

## 2. The Coding Project (Hands-on)

We are building a chatbot that runs in your terminal, has a custom personality, and supports "Mock Mode" for free testing.

#### Step 1: The Chatbot script
Create a file named `ai_chatbot.py` inside your `Phase3` folder:

```python
import sys
from openai import OpenAI

# Professional Setup
client = OpenAI(api_key="sk-DUMMY")
USE_MOCK = True

def start_chat():
    # 1. Initialize 'Memory' (Conversation History)
    # We start with the 'System' instruction.
    messages = [
        {"role": "system", "content": "You are a helpful, senior AI coding mentor. Be concise and encouraging."}
    ]

    print("--- 🤖 MISSION CONTROL: AI CHATBOT ACTIVE ---")
    print("(Type 'exit' or 'quit' to end the session)\n")

    while True:
        # 2. Get User Input
        user_input = input("[YOU]: ")
        
        if user_input.lower() in ['exit', 'quit']:
            print("\n[AI]: Goodbye! Happy coding!")
            break

        # 3. Add User message to Memory
        messages.append({"role": "user", "content": user_input})

        # 4. Generate AI Response
        if USE_MOCK:
            ai_reply = f"MOCK: As your mentor, I see you are asking about '{user_input}'. Keep going!"
        else:
            try:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages
                )
                ai_reply = response.choices[0].message.content
            except Exception as e:
                ai_reply = f"System Error: {e}"

        # 5. Add AI reply to Memory (so it stays in context)
        messages.append({"role": "assistant", "content": ai_reply})

        print(f"[AI]: {ai_reply}\n")

if __name__ == "__main__":
    start_chat()
```

---

## 3. Why this matters (Future Insight)
This project is the foundation for everything that comes next. 
- In **Phase 4**, we will learn how to make the **System Prompt** much smarter.
- In **Phase 5**, we will learn how to give this Chatbot a "Knowledge Base" (RAG) so it can answer questions about your specific documents.

---

## 4. Graduation Task
1. Run your chatbot: `python Phase3/ai_chatbot.py`
2. Chat with it for at least 3 turns.
3. Observe how your terminal input loops until you type 'exit'.

**Phase 3 is now officially COMPLETE!** You have moved from understanding math to building interactive software. 🚀🎓
