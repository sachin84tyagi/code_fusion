```js
// 🌐 WEBSITE AI CHATBOT (BEGINNER FRIENDLY)
// Built using React + Simple Backend API (Python)

// ================= FRONTEND (React) =================
// This is what users will see in browser

import { useState } from "react";

export default function ChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply }
      ]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">AI Chatbot</h1>

      <div className="h-96 overflow-y-auto border p-2 mb-4 rounded">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}
          </div>
        ))}

        {loading && <div>AI is typing...</div>}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}


// ================= BACKEND (Python - Flask) =================
# Save as server.py

from flask import Flask, request, jsonify
from openai import OpenAI
import json, os

app = Flask(__name__)

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

HISTORY_FILE = "chat_history.json"


def load_memory():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    return [{"role": "system", "content": "You are a helpful assistant."}]


def save_memory(messages):
    with open(HISTORY_FILE, "w") as f:
        json.dump(messages, f)


messages = load_memory()


@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")

    messages.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model="llama3.2:1b",
        messages=messages
    )

    reply = response.choices[0].message.content

    messages.append({"role": "assistant", "content": reply})
    save_memory(messages)

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(port=5000)


// ================= HOW IT WORKS (SUPER SIMPLE) =================

/*
1. User types message in browser
2. React sends message → Python server
3. Python sends message → AI model (Ollama)
4. AI generates response
5. Python sends response → React
6. React displays it

FLOW:
User → Frontend → Backend → AI → Backend → Frontend
*/


// ================= BONUS (NEXT STEPS) =================

/*
✔ Add streaming (typing effect)
✔ Add login system
✔ Store chats in database (MongoDB)
✔ Deploy on cloud (Render / Vercel)
✔ Add voice input
*/
```

# 🌐 Website AI Chatbot — Beginner to Pro (Step-by-Step Explanation)

---

## 🧠 Big Picture (Understand First)

You started with a **terminal chatbot**. Now we convert it into a **website chatbot** with a UI.

```
User (Browser)
      ↓
React Frontend (UI)
      ↓
Python Backend (Flask API)
      ↓
AI Model (Ollama / LLM)
      ↓
Response back to UI
```

👉 Think of it as **pipes connecting components**.

---

## 🔹 Step 1: What Changed from Your Original Code?

### Before (Terminal App)
- `input()` → user types in terminal
- `print()` → output shown in terminal

### Now (Website App)
- Browser input box replaces `input()`
- API replaces direct function call
- React + Flask split responsibilities

---

## 🔹 Step 2: Frontend (React) — UI Layer

### 🧩 Core Idea
React = what user sees (chat screen)

### 🔑 Key Concepts

#### 1. State = Memory in UI
```js
const [messages, setMessages] = useState([]);
```

Stores chat like:
```js
[
  { role: "user", content: "Hi" },
  { role: "assistant", content: "Hello!" }
]
```

---

#### 2. Sending Message to Backend
```js
fetch("http://localhost:5000/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: input })
});
```

👉 This replaces `input()` from Python

---

#### 3. Updating UI with AI Response
```js
setMessages([
  ...newMessages,
  { role: "assistant", content: data.reply }
]);
```

👉 Same as `print("AI:", reply)` but in UI

---

## 🔹 Step 3: Backend (Flask) — Brain Connector

This is your **original Python logic**, slightly modified.

---

### 🔁 Input Difference

#### Old:
```python
user_input = input()
```

#### New:
```python
user_input = request.json.get("message")
```

👉 Input now comes from browser

---

### 🤖 AI Call (Same as Your Code)
```python
response = client.chat.completions.create(
    model="llama3.2:1b",
    messages=messages
)
```

✔ Same model  
✔ Same memory  
✔ Same logic

---

### 💾 Memory Handling
```python
messages.append({"role": "user", "content": user_input})
```

👉 Exactly same concept as your script

---

## 🔹 Step 4: Full Flow (VERY IMPORTANT)

```
1. User types "Hello"
2. React sends request → /chat
3. Flask receives it
4. Flask sends to AI
5. AI generates reply
6. Flask returns JSON
7. React displays response
```

👉 This loop repeats forever

---

## 🔹 Step 5: How to Run the Project

### 🧪 Backend
```bash
pip install flask openai
python server.py
```

---

### 🌐 Frontend
```bash
npm create vite@latest
npm install
npm run dev
```

Paste React code and run

---

## 🔥 Step 6: Upgrade Your Chatbot (Next Level)

### ⚡ 1. Streaming (Typing Effect)
Instead of waiting full response → stream tokens

---

### 🧠 2. Better Memory
Replace JSON file with:
- MongoDB
- Redis
- SQLite

---

### 🎤 3. Voice Input
Use browser Web Speech API

---

### 🔐 4. Authentication
Add login system using JWT

---

## 🎯 Final Understanding

| Layer | Responsibility |
|------|---------------|
| React | UI (chat screen) |
| Flask | API bridge |
| AI Model | Response generation |
| JSON/DB | Memory |

---

## 💡 Most Important Insight

👉 AI apps are NOT just AI

```
UI + API + Model + Memory = Real AI Product
```

---

## 🚀 What You Built

✔ Website chatbot  
✔ Persistent memory  
✔ API-based architecture  
✔ Real-world AI system design

---

If you want next step, we can upgrade this into:
- ChatGPT-style UI (bubbles + animations)
- Real-time streaming (like your terminal version)
- Production deployment (cloud)

Just say: **Make it production level** 🚀
