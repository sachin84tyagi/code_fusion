# Practice 001: Build a Simple AI Chatbot

```python
from openai import OpenAI

# Initialize the library with your local Ollama server
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama" 
)

# Hardcoded version for reference
response = client.chat.completions.create(
    model="llama3.2:1b",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who is the best cricket player in the world?"}
    ]
)

print(response.choices[0].message.content)

```

# 🤖 AI Chatbot Code — Super Simple Explanation (Step-by-Step)

Let’s understand this code like a story 👶

---

## 🧩 Step 1: Import the OpenAI Library

```python
from openai import OpenAI
```

👉 This line means:

* "Bring the OpenAI tool into our program"
* So we can talk to an AI model

Think like:
📦 You are opening a toolbox so you can use tools inside it

---

## 🧩 Step 2: Connect to Ollama (Local AI)

```python
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)
```

👉 This is VERY IMPORTANT

We are telling Python:

* "Hey, don’t go to OpenAI servers on the internet"
* "Instead, use my LOCAL AI running on my computer"

### 🔍 Line by line:

* `client = OpenAI(...)`
  👉 We create a "client" (a helper object)
  👉 This client will talk to the AI

* `base_url="http://localhost:11434/v1"`
  👉 "localhost" means your own computer
  👉 Port `11434` is where Ollama runs

* `api_key="ollama"`
  👉 Just a dummy key (Ollama doesn’t need real API key)

Think like:
📞 You are calling a friend who lives in your house instead of calling someone on the internet

---

## 🧩 Step 3: Send a Message to AI

```python
response = client.chat.completions.create(
```

👉 This means:

* "Hey AI, I want to chat with you"
* And store the answer in `response`

---

## 🧩 Step 4: Choose the Model

```python
model="llama3.2:1b",
```

👉 This tells:

* Which brain (AI model) to use

* `llama3.2:1b`
  👉 A small and fast AI model

Think like:
🧠 Choosing which brain to ask a question to

---

## 🧩 Step 5: Send Messages (Conversation)

```python
messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who is the best cricket player in the world?"}
]
```

👉 This is the MOST IMPORTANT part

We are giving instructions + question

### 🔍 Line by line:

1. **System message**

   ```python
   {"role": "system", "content": "You are a helpful assistant."}
   ```

   👉 This sets behavior of AI
   👉 Like telling AI: "Be polite and helpful"

2. **User message**

   ```python
   {"role": "user", "content": "Who is the best cricket player in the world?"}
   ```

   👉 This is the actual question

Think like:
🎭 System = Teacher instructions
👦 User = Student question

---

## 🧩 Step 6: AI Generates Response

```python
)
```

👉 This closes the function
👉 AI processes everything and creates an answer

---

## 🧩 Step 7: Print the Answer

```python
print(response.choices[0].message.content)
```

👉 This line shows the AI answer on screen

### 🔍 Breaking it down:

* `response`
  👉 Full result from AI

* `choices[0]`
  👉 First answer (AI can generate multiple)

* `message.content`
  👉 Actual text reply

Think like:
📦 Response box → open → take first answer → read message

---

## 🎯 Final Flow (Super Simple)

1. Import AI tool
2. Connect to local AI (Ollama)
3. Send question
4. AI thinks 🤔
5. AI gives answer
6. Print answer 🖥️

---

## 🚀 Real-Life Analogy

Imagine:

* Ollama = Your smart friend at home 🏠
* Client = Your phone 📱
* Messages = What you say
* Response = What your friend replies

---

## 💡 One-Line Summary

👉 This code asks a local AI model a question and prints the answer.

---

If you want next step, I can help you:

* Turn this into a chatbot loop 🔁
* Add memory 🧠
* Build UI (like ChatGPT) 💻
