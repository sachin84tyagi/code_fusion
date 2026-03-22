# Practice 002: Build a Simple AI Chatbot

```python
from openai import OpenAI

# Initialize the library with your local Ollama server
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama" 
)

print("--- AI Chatbot Started (Type 'quit' to exit) ---")

while True:
    user_input = input("\nYou: ")
    
    if user_input.lower() == "quit":
        print("Goodbye!")
        break

    # Call the local LLM
    response = client.chat.completions.create(
        model="llama3.2:1b",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_input}
        ]
    )

    print(f"AI: {response.choices[0].message.content}")

```

Alright — let’s break this down **like you're learning for the first time** 👶💡
I’ll explain **every line in the simplest possible way**.

---

# 🧠 What this code does (Simple Idea)

👉 This code creates a **chatbot** that:

* Takes your input
* Sends it to a **local AI model (Ollama)**
* Gets a reply
* Prints the answer

---

# 🧩 Step-by-Step Code Explanation

---

## 🔹 1. Import Library

```python
from openai import OpenAI
```

👉 Meaning:

* We are importing a tool called **OpenAI**
* This tool helps us **talk to AI models**

💡 Think:

> "I am bringing a remote control to talk to AI"

---

## 🔹 2. Create Client (Connection Setup)

```python
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)
```

👉 Meaning:

* We are creating a **connection** to AI

### 🧠 Simple Explanation:

* `base_url` → Where AI is running
  👉 `"localhost"` = your own computer
  👉 `11434` = Ollama server port

* `api_key="ollama"`
  👉 Just a **dummy key** (Ollama doesn't need real key)

💡 Think:

> "Hey AI, I know you're running on my computer — let's connect!"

---

## 🔹 3. Start Message

```python
print("--- AI Chatbot Started (Type 'quit' to exit) ---")
```

👉 Meaning:

* Shows a message when program starts

💡 Output:

```
--- AI Chatbot Started (Type 'quit' to exit) ---
```

---

## 🔹 4. Infinite Loop (Keeps Chat Running)

```python
while True:
```

👉 Meaning:

* Run forever until we stop it

💡 Think:

> "Keep chatting again and again and again..."

---

## 🔹 5. Take User Input

```python
user_input = input("\nYou: ")
```

👉 Meaning:

* Ask user to type something

💡 Example:

```
You: Hello AI
```

---

## 🔹 6. Exit Condition

```python
if user_input.lower() == "quit":
```

👉 Meaning:

* If user types `"quit"` → stop program

👉 `.lower()` converts text to lowercase
So:

* `QUIT`, `Quit`, `quit` → all same

---

```python
print("Goodbye!")
break
```

👉 Meaning:

* Print goodbye
* `break` stops the loop

---

## 🔹 7. Send Message to AI

```python
response = client.chat.completions.create(
```

👉 Meaning:

* Send request to AI model

💡 Think:

> "Hey AI, please answer this question"

---

### 📦 Inside this:

---

### 🔸 Model Selection

```python
model="llama3.2:1b",
```

👉 Meaning:

* Choose which AI model to use

💡 Here:

* `llama3.2:1b` = small local AI model (fast & light)

---

### 🔸 Messages (Conversation)

```python
messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": user_input}
]
```

👉 This is VERY IMPORTANT 👇

#### 🧠 Roles:

| Role      | Meaning        |
| --------- | -------------- |
| system    | Rules for AI   |
| user      | What you asked |
| assistant | AI reply       |

---

### 🔹 Line-by-line:

```python
{"role": "system", "content": "You are a helpful assistant."}
```

👉 Tells AI:

> "Be helpful"

---

```python
{"role": "user", "content": user_input}
```

👉 Sends your message to AI

---

## 🔹 8. Print AI Response

```python
print(f"AI: {response.choices[0].message.content}")
```

👉 Meaning:

* Get AI's reply and print it

---

### 🧠 Break it down:

* `response` → full answer from AI
* `choices[0]` → first answer
* `message.content` → actual text

💡 Think:

> "Take AI's reply and show it on screen"

---

# 🔁 Full Flow (Super Simple)

```
You type → "Hello"
        ↓
Code sends to AI
        ↓
AI thinks 🤖
        ↓
AI replies → "Hi! How can I help?"
        ↓
Printed on screen
```

---

# 🧪 Example Run

```
--- AI Chatbot Started (Type 'quit' to exit) ---

You: What is AI?
AI: AI stands for Artificial Intelligence...

You: quit
Goodbye!
```

---

# 🚀 Key Concepts You Learned

* ✅ How to connect to local AI (Ollama)
* ✅ Infinite loop (`while True`)
* ✅ Taking input
* ✅ Sending messages to AI
* ✅ Reading response

---

# 🎯 Bonus (Pro Tip)

👉 You can make it smarter by adding memory:

Instead of:

```python
messages=[...]
```

You can store chat history and send full conversation 🔥

---

If you want next level 👇
I can teach you:

* ✅ Add memory (ChatGPT-like)
* ✅ Voice assistant 🎤
* ✅ Web UI (like ChatGPT)
* ✅ Turn this into product 🚀

Just tell me 👍
