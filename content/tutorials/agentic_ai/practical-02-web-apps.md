# Chapter 2: Agentic Web Apps (The Production Architecture)

Welcome to Chapter 2! 🎉

So far, we have built 18 incredible AI Agents. But they all share one problem: **They only run in the terminal.** If you want to share your Shopping Assistant with your grandma, you can't expect her to open a black terminal window and type Python commands!

To fix this, we need to move our agents into the **Browser**. We are going to build a **Web Application**.

---

## 🧠 The Architecture: Decoupling the Brain and the Face

In the real world of software engineering, we don't put everything into one big file. We split our app into two separate pieces:

1. **The Backend (The Brain):** This runs silently in the background on a server. It holds our `llama3.2` model, our tools (like the Discount Calculator), and all the logic. For this, we use a framework called **FastAPI**.
2. **The Frontend (The Face):** This is the beautiful website the user actually sees. It has chat bubbles, buttons, and animations. For this, we use a framework called **Streamlit**.

The Frontend doesn't do any thinking. When you type a message into Streamlit, it sends a secret "HTTP POST" message to FastAPI. FastAPI thinks about it, uses a tool if needed, and sends the final answer back to Streamlit to display to the user!

This is called a **Client-Server Architecture**.

---

## 🚀 Setting Up the Environment

Before we start, we need to install the tools required to build web apps. 

Open your terminal and run this command:
```bash
pip install fastapi uvicorn streamlit requests pydantic
```

---

## 📂 Step 1: Building the Brain (`agent_api.py`)

First, let's create our Backend server using **FastAPI**. We are going to port over our Shopping Assistant Agent from Chapter 1. 

Create a file named `agent_api.py`:

```python
"""
FASTAPI BACKEND: THE AGENT'S BRAIN
==================================================
This file is the "Brain" of our Web App architecture. 
It does NOT have a user interface. It runs as a server in the background.
It listens for incoming messages, runs the Llama 3.2 logic, 
uses tools if needed, and sends the final text back to the frontend.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from openai import OpenAI

# 1. Start the FastAPI Server (The Brain)
app = FastAPI(title="Shopping Assistant Agent API")

# 2. Connect to local Llama
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# 3. Define the Tool (Discount Calculator)
def calculate_sale_price(original_price: float, discount_percent: float) -> str:
    money_saved = original_price * (discount_percent / 100)
    final_price = original_price - money_saved
    return f"You save ${money_saved:.2f}! The final sale price is ${final_price:.2f}."

# Instruction Manual for the Tool
tools_manual = [{
    "type": "function", 
    "function": {
        "name": "calculate_sale_price", 
        "description": "Calculate a discount or sale price.",
        "parameters": { 
            "type": "object",
            "properties": {
                "original_price": { "type": "number" },
                "discount_percent": { "type": "number" }
            },
            "required": ["original_price", "discount_percent"]
        }
    }
}]

# 4. Define what an incoming message looks like
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    used_tool: bool
    tool_details: str = ""

# 5. Create the API Route (/chat)
@app.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    print(f"\n[API RECEIVED] {request.message}")
    
    messages = [{"role": "user", "content": request.message}]
    
    try:
        # Ask Llama
        response = client.chat.completions.create(
            model=MODEL_NAME, 
            messages=messages, 
            tools=tools_manual
        )
        ai_reply = response.choices[0].message
        
        # Did it use a tool?
        if ai_reply.tool_calls:
            print("[API] Agent decided to use the Discount Tool!")
            tool_request = ai_reply.tool_calls[0]
            arguments = json.loads(tool_request.function.arguments)
            
            # Run the tool
            price = arguments.get("original_price", 0)
            discount = arguments.get("discount_percent", 0)
            tool_result = calculate_sale_price(price, discount)
            
            # Send result back to Llama
            messages.append(ai_reply) 
            messages.append({
                "role": "tool", 
                "tool_call_id": tool_request.id, 
                "content": tool_result
            }) 
            
            # Get final answer
            final_response = client.chat.completions.create(
                model=MODEL_NAME, 
                messages=messages
            )
            
            final_text = final_response.choices[0].message.content
            print(f"[API SENDING] {final_text}")
            
            return ChatResponse(
                reply=final_text, 
                used_tool=True, 
                tool_details=f"Calculated {discount}% off ${price}."
            )
            
        else:
            # No tool used
            print("[API] Agent did not use a tool.")
            return ChatResponse(
                reply=ai_reply.content, 
                used_tool=False
            )
            
    except Exception as e:
        print(f"[API ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))
```

> [!TIP]
> Notice how we don't have an `input()` loop here? The API simply waits for a web browser to send it a `ChatRequest`, processes it, and returns a `ChatResponse`.

---

## 🖼️ Step 2: Building the Face (`agent_ui.py`)

Now let's build the beautiful website using **Streamlit**. This script will literally just draw the UI and talk to our FastAPI Brain.

Create a file named `agent_ui.py`:

```python
"""
STREAMLIT FRONTEND: THE AGENT'S FACE
==================================================
This file is the "Face" of our Web App. 
It does NOT do any AI thinking! It simply draws a beautiful 
chat interface on the screen, takes what the user types, 
sends it to the FastAPI Brain, and displays the answer!
"""

import streamlit as st
import requests

# The URL of our FastAPI Backend Brain
API_URL = "http://localhost:8000/chat"

# 1. Setup the Web Page
st.set_page_config(page_title="Shopping Agent", page_icon="🛍️")
st.title("🛍️ AI Shopping Assistant")
st.write("I can help you calculate discounts! Tell me the price and the percentage off.")

# 2. Setup Memory for the Chat History
if "messages" not in st.session_state:
    st.session_state.messages = []

# 3. Draw all previous messages on the screen
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# 4. Wait for the user to type something!
if user_input := st.chat_input("E.g., The shoes are $80 with 25% off..."):
    
    # Show the user's message on the screen immediately
    with st.chat_message("user"):
        st.markdown(user_input)
    
    # Save it to memory
    st.session_state.messages.append({"role": "user", "content": user_input})
    
    # 5. Show a spinning "thinking" icon while we talk to the backend
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            
            try:
                # Send the message to our FastAPI Brain!
                response = requests.post(
                    API_URL, 
                    json={"message": user_input}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Did the backend use a tool? Tell the user!
                    if data["used_tool"]:
                        st.info(f"🛠️ **Tool Used:** {data['tool_details']}")
                    
                    # Show the final answer
                    st.markdown(data["reply"])
                    
                    # Save the AI's answer to memory
                    st.session_state.messages.append({"role": "assistant", "content": data["reply"]})
                    
                else:
                    st.error("Error: Could not talk to the Brain. Is FastAPI running?")
                    
            except requests.exceptions.ConnectionError:
                st.error("🚨 Connection Error! Make sure you are running the FastAPI backend (uvicorn agent_api:app --port 8000) in another terminal!")
```

---

## 🏃 Step 3: How to Run Your Full Web Stack

Because we have decoupled our architecture into two files, we need **two terminals** running at the same time.

### 1. Start the Brain
Open your first terminal and run the FastAPI server:
```bash
uvicorn agent_api:app --reload --port 8000
```
*(Leave this terminal open and running!)*

### 2. Start the Face
Open a **second** new terminal window and run the Streamlit UI:
```bash
streamlit run agent_ui.py
```

A browser window will automatically pop up with your gorgeous new Agentic Web App! You can now type your questions into the UI, watch the spinner, see the "Tool Used" notification, and get the result!

> 🎉 **Congratulations!** You just built a production-grade, decoupled AI Web Architecture!
