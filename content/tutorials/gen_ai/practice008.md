```python
import streamlit as st
import json
import os
from typing import List, Dict
from openai import OpenAI

# Page config must be the first Streamlit command
st.set_page_config(page_title="Pro AI Chatbot", page_icon="🤖", layout="centered")

# ⚙️ 1. Create Client
@st.cache_resource
def get_client():
    return OpenAI(
        base_url="http://localhost:11434/v1",
        api_key="ollama"
    )

client = get_client()

# 🧠 Memory / Context Settings
HISTORY_FILE = "chat_history_web.json"
MAX_CONTEXT_MESSAGES = 10  # Pro-level optimization: Only keep the last 10 messages for context

# 🎭 Personas
PERSONAS = {
    "Helpful Assistant": "You are a helpful, respectful, and honest assistant.",
    "Expert Software Engineer": "You are a senior principal software engineer. You provide elegant, production-ready code with excellent explanations.",
    "Sarcastic AI": "You are a highly intelligent but extremely sarcastic AI. You answer correctly but with a lot of sass."
}

def load_memory() -> List[Dict[str, str]]:
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list) and len(data) > 0:
                    return data
        except Exception:
            st.warning("Warning: chat_history_web.json could not be loaded. Starting fresh.")
    return []

def save_memory(msg_list: List[Dict[str, str]]):
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(msg_list, f, indent=4)

# UI: Sidebar
with st.sidebar:
    st.title("⚙️ Settings")
    selected_persona_name = st.selectbox("Choose AI Persona", list(PERSONAS.keys()))
    
    st.markdown("---")
    st.markdown("### Context Optimization")
    st.caption(f"We keep the last **{MAX_CONTEXT_MESSAGES}** messages to strictly manage token cost (Pro-Level Optimization).")
    
    st.markdown("---")
    if st.button("🗑️ Clear Chat History"):
        if os.path.exists(HISTORY_FILE):
            os.remove(HISTORY_FILE)
        st.session_state.messages = []
        st.success("History cleared!")
        st.rerun()

# State Management
if "messages" not in st.session_state:
    loaded_messages = load_memory()
    if len(loaded_messages) == 0:
        # Initialize
        sys_prompt = PERSONAS[selected_persona_name]
        st.session_state.messages = [{"role": "system", "content": sys_prompt}]
        save_memory(st.session_state.messages)
    else:
        st.session_state.messages = loaded_messages

st.title("💬 Pro AI Chatbot")
st.caption("🚀 A production-ready ChatGPT clone using Streamlit and Ollama")

# Display chat messages (skip system prompt from UI)
for msg in st.session_state.messages:
    if msg["role"] != "system":
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

# User Input
if user_input := st.chat_input("Type your message here..."):
    # 1. Add User Message
    st.session_state.messages.append({"role": "user", "content": user_input})
    save_memory(st.session_state.messages)
    
    with st.chat_message("user"):
        st.markdown(user_input)

    # 2. Context Optimization (Pro-level)
    # We always keep the SYSTEM prompt (index 0).
    # Then we keep up to the last MAX_CONTEXT_MESSAGES.
    system_msg = st.session_state.messages[0]
    chat_history = st.session_state.messages[1:]
    
    if len(chat_history) > MAX_CONTEXT_MESSAGES:
        chat_history = chat_history[-MAX_CONTEXT_MESSAGES:]
    
    optimized_messages = [system_msg] + chat_history

    # 3. Get AI Response with Real Streaming
    with st.chat_message("assistant"):
        stream = client.chat.completions.create(
            model="llama3.2:1b",
            messages=optimized_messages,
            stream=True
        )
        
        # st.write_stream handles the streaming and returns the full string
        def generate():
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        full_reply = st.write_stream(generate)

    # 4. Save AI Response
    st.session_state.messages.append({"role": "assistant", "content": full_reply})
    save_memory(st.session_state.messages)

```

# How to run this code
# 1. Open a terminal
# 2. Navigate to the directory where this file is saved
# 3. Run the command: python -m streamlit run chatbotv07.py


# 🤖 Pro AI Chatbot — Step-by-Step Explanation (Beginner Friendly)

---

## 🧠 Big Picture (Before Code)

This project builds a **ChatGPT-like chatbot UI** using:

* **Streamlit** → UI (buttons, chat interface)
* **Ollama (Local LLM)** → AI brain
* **JSON File** → Memory storage
* **Streaming** → Real-time typing effect

👉 Think of it like:

```
User → Streamlit UI → AI Model → Response → UI → Save Memory
```

---

# 📦 1. Importing Libraries

```python
import streamlit as st
import json
import os
from typing import List, Dict
from openai import OpenAI
```

### 🔍 Explanation

| Line        | Meaning                             |
| ----------- | ----------------------------------- |
| `streamlit` | Builds UI (chat, buttons, sidebar)  |
| `json`      | Save/load chat history              |
| `os`        | File operations (check/delete file) |
| `typing`    | Better type hints for clean code    |
| `OpenAI`    | Used to talk to Ollama API          |

👉 Simple: We import tools we need.

---

# 🎨 2. Page Configuration

```python
st.set_page_config(
    page_title="Pro AI Chatbot",
    page_icon="🤖",
    layout="centered"
)
```

### 🔍 Explanation

* Must be **FIRST Streamlit command**
* Sets:

  * Title of tab
  * Icon
  * Layout

👉 Like setting up your app's identity.

---

# ⚙️ 3. Create AI Client (Connection)

```python
@st.cache_resource
def get_client():
    return OpenAI(
        base_url="http://localhost:11434/v1",
        api_key="ollama"
    )

client = get_client()
```

### 🔍 Explanation (VERY IMPORTANT)

### 1. `@st.cache_resource`

* Prevents recreating client again and again
* Makes app **faster ⚡**

### 2. `OpenAI(...)`

* We connect to **Ollama running locally**

| Parameter  | Meaning                                     |
| ---------- | ------------------------------------------- |
| `base_url` | Local AI server                             |
| `api_key`  | Dummy key (Ollama doesn't require real one) |

👉 Simple:

> This creates a **bridge between your app and AI model**

---

# 🧠 4. Memory Settings

```python
HISTORY_FILE = "chat_history_web.json"
MAX_CONTEXT_MESSAGES = 10
```

### 🔍 Explanation

* `HISTORY_FILE` → where chat is saved
* `MAX_CONTEXT_MESSAGES` → limit memory sent to AI

👉 Why limit?

* Saves **tokens 💰**
* Improves **speed ⚡**

👉 Pro Concept:

> AI does NOT remember everything → we manually control memory

---

# 🎭 5. Personas (AI Behavior Control)

```python
PERSONAS = {
    "Helpful Assistant": "You are a helpful, respectful, and honest assistant.",
    "Expert Software Engineer": "You are a senior principal software engineer...",
    "Sarcastic AI": "You are a highly intelligent but extremely sarcastic AI..."
}
```

### 🔍 Explanation

👉 This changes **AI personality**

| Persona   | Behavior            |
| --------- | ------------------- |
| Helpful   | Normal ChatGPT      |
| Engineer  | Professional coding |
| Sarcastic | Funny + rude 😄     |

👉 This is called **Prompt Engineering**

---

# 💾 6. Load Memory Function

```python
def load_memory() -> List[Dict[str, str]]:
```

### Step-by-step

```python
if os.path.exists(HISTORY_FILE):
```

✔ Check if file exists

```python
with open(HISTORY_FILE, "r") as f:
    data = json.load(f)
```

✔ Read file

```python
if isinstance(data, list):
```

✔ Validate data

```python
return data
```

✔ Return chat history

```python
return []
```

✔ If error → start fresh

👉 Simple:

> "Load old chat if available, else start new"

---

# 💾 7. Save Memory Function

```python
def save_memory(msg_list):
    with open(HISTORY_FILE, "w") as f:
        json.dump(msg_list, f, indent=4)
```

### 🔍 Explanation

* Saves chat to file
* `indent=4` → pretty formatting

👉 Simple:

> "Store conversation permanently"

---

# 🎛️ 8. Sidebar UI (Settings)

```python
with st.sidebar:
```

### Inside Sidebar:

### 1. Title

```python
st.title("⚙️ Settings")
```

### 2. Persona Selection

```python
selected_persona_name = st.selectbox(...)
```

👉 Dropdown to choose AI behavior

### 3. Info Section

```python
st.caption(...)
```

👉 Shows optimization info

### 4. Clear History Button

```python
if st.button("🗑️ Clear Chat History"):
```

Steps:

1. Delete file
2. Reset memory
3. Show success
4. Reload app

```python
st.rerun()
```

👉 Important:

> Forces UI refresh

---

# 🧠 9. Session State (Memory in App)

```python
if "messages" not in st.session_state:
```

👉 First time app loads

### Case 1: No history

```python
sys_prompt = PERSONAS[selected_persona_name]
```

✔ Set system role

```python
{"role": "system", "content": sys_prompt}
```

✔ AI instruction

### Case 2: Load history

```python
st.session_state.messages = loaded_messages
```

👉 Session State = temporary memory in app

---

# 🖥️ 10. Main UI

```python
st.title("💬 Pro AI Chatbot")
st.caption("🚀 A production-ready ChatGPT clone...")
```

👉 Just UI text

---

# 💬 11. Display Messages

```python
for msg in st.session_state.messages:
```

### Important:

```python
if msg["role"] != "system":
```

👉 Hide system message from UI

```python
with st.chat_message(msg["role"]):
```

👉 Creates chat bubble

---

# ⌨️ 12. User Input

```python
if user_input := st.chat_input("Type your message..."):
```

👉 Waits for user input

---

# ➕ Step 1: Save User Message

```python
st.session_state.messages.append({"role": "user", "content": user_input})
```

👉 Add to memory

```python
save_memory(...)
```

👉 Save to file

---

# 🧠 Step 2: Context Optimization (VERY IMPORTANT)

```python
system_msg = st.session_state.messages[0]
chat_history = st.session_state.messages[1:]
```

👉 Separate system + history

```python
if len(chat_history) > MAX_CONTEXT_MESSAGES:
    chat_history = chat_history[-MAX_CONTEXT_MESSAGES:]
```

👉 Keep only last 10 messages

```python
optimized_messages = [system_msg] + chat_history
```

👉 Final input to AI

---

# 🤖 Step 3: AI Response (Streaming)

```python
stream = client.chat.completions.create(
    model="llama3.2:1b",
    messages=optimized_messages,
    stream=True
)
```

### 🔍 Explanation

| Parameter   | Meaning            |
| ----------- | ------------------ |
| model       | Local LLM          |
| messages    | Chat history       |
| stream=True | Real-time response |

---

### 🔄 Streaming Generator

```python
def generate():
    for chunk in stream:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content
```

👉 This creates typing effect like ChatGPT

---

### 🖨️ Display Stream

```python
full_reply = st.write_stream(generate)
```

👉 Shows response LIVE
👉 Also returns full text

---

# 💾 Step 4: Save AI Response

```python
st.session_state.messages.append({"role": "assistant", "content": full_reply})
```

👉 Save AI reply

```python
save_memory(...)
```

👉 Store permanently

---

# 🚀 FINAL FLOW (MASTER UNDERSTANDING)

```
1. Load memory
2. Show old chat
3. User types message
4. Save message
5. Optimize context
6. Send to AI
7. Stream response
8. Save response
```

---

# 🧠 PRO CONCEPTS YOU JUST LEARNED

* ✅ Session State
* ✅ File-based Memory
* ✅ Prompt Engineering (Personas)
* ✅ Context Window Optimization
* ✅ Streaming (Real-time AI)
* ✅ Local LLM (Ollama)

---

# 🏁 Conclusion

👉 You just built a **production-level chatbot** 🚀

This is NOT beginner code anymore — this is **industry-level architecture**.

---

If you want next level upgrades:

* 🔥 Add vector database (RAG)
* 🔥 Add login system
* 🔥 Add multi-user chat
* 🔥 Add voice input

Just tell me 👍
