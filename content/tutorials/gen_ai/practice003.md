# Practice 003: Build a Simple AI Chatbot

```python
from openai import OpenAI

# Initialize client
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

print("--- AI Chatbot Started (Type 'quit' to exit) ---")

# 🧠 Memory storage
messages = [
    {"role": "system", "content": "You are a helpful assistant."}
]

while True:
    user_input = input("\nYou: ")

    if user_input.lower() == "quit":
        print("Goodbye!")
        break

    # ✅ Add user message to memory
    messages.append({"role": "user", "content": user_input})

    # Call AI with full memory
    response = client.chat.completions.create(
        model="llama3.2:1b",
        messages=messages
    )

    ai_reply = response.choices[0].message.content

    print(f"AI: {ai_reply}")

    # ✅ Add AI response to memory
    messages.append({"role": "assistant", "content": ai_reply})
```

# 🤖 AI Chatbot Code Explanation (Super Simple)

I will explain this code **line by line** like you are a beginner or a child 👶

---

## 🧩 1. Import Library

```python
from openai import OpenAI
```

👉 This line means:

* We are bringing a tool called **OpenAI** into our program
* Think of it like installing a brain 🧠 for your chatbot

---

## ⚙️ 2. Create Client (Connection)

```python
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)
```

👉 This means:

* We are connecting our code to an AI server
* `base_url` → Where AI is running (your local machine)
* `api_key` → Like a password (here it's just "ollama")

💡 Simple idea:

* This is like dialing a phone number 📞 to talk to AI

---

## 🚀 3. Start Message

```python
print("--- AI Chatbot Started (Type 'quit' to exit) ---")
```

👉 This prints a message on screen

* Tells user chatbot has started
* Gives instruction to exit

---

## 🧠 4. Memory (Very Important)

```python
messages = [
    {"role": "system", "content": "You are a helpful assistant."}
]
```

👉 This is the **memory of chatbot**

* `messages` = list (like a chat history 📜)
* First message is **system role**

💡 System role means:

* Setting behavior of AI
* Like telling: "Be helpful"

---

## 🔁 5. Infinite Loop (Chat Forever)

```python
while True:
```

👉 This means:

* Keep running forever
* Chat continues until user stops it

---

## 💬 6. Take User Input

```python
user_input = input("\nYou: ")
```

👉 This waits for user to type something

Example:

```
You: Hello
```

---

## ❌ 7. Exit Condition

```python
if user_input.lower() == "quit":
```

👉 If user types "quit"

* Convert input to lowercase (safe check)

```python
    print("Goodbye!")
    break
```

👉 Then:

* Print goodbye message
* `break` stops the loop

---

## ➕ 8. Save User Message (Memory)

```python
messages.append({"role": "user", "content": user_input})
```

👉 This stores what user said

💡 Now chatbot remembers conversation

---

## 🤖 9. Call AI (Send Memory)

```python
response = client.chat.completions.create(
    model="llama3.2:1b",
    messages=messages
)
```

👉 This is the **most important part**

* Sends full conversation to AI
* AI reads everything (memory)
* AI generates reply

💡 Think like:

* You give whole chat history to AI
* AI responds intelligently

---

## 📥 10. Get AI Reply

```python
ai_reply = response.choices[0].message.content
```

👉 This extracts the answer from AI

* `choices[0]` → first result
* `.message.content` → actual text

---

## 🖨️ 11. Print AI Response

```python
print(f"AI: {ai_reply}")
```

👉 Show AI reply on screen

Example:

```
AI: Hello! How can I help you?
```

---

## ➕ 12. Save AI Response (Memory)

```python
messages.append({"role": "assistant", "content": ai_reply})
```

👉 This stores AI reply

💡 Now BOTH sides are remembered:

* User message
* AI response

---

# 🧠 Final Understanding (Very Important)

This chatbot works like this:

1. User types message
2. Message is saved in memory
3. Full memory is sent to AI
4. AI replies
5. Reply is saved again
6. Loop continues

---

# 🎯 Simple Analogy

👉 Think like WhatsApp chat:

* You send message
* AI replies
* Chat history is always remembered

---

# 🚀 What You Built

You created a:

✅ Chatbot with memory
✅ Continuous conversation system
✅ Local AI integration (Ollama)

---

# 🔥 Next Step (Recommended)

If you want to improve this chatbot:

* Add streaming (real-time typing)
* Save memory to file (permanent memory)
* Add voice input/output
* Build UI (web app using Next.js)

---

If you want, I can help you turn this into:

👉 ChatGPT-like UI
👉 Smart AI Assistant (Jarvis level)
👉 Website chatbot for your project

Just tell me 🚀
