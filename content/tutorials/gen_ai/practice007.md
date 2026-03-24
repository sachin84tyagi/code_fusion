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
