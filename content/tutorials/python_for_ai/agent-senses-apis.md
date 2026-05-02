# Module 5: The Agent's Senses (APIs & Network Requests)

Welcome to Module 5! 🌍

Up until now, our agents have been living in a dark box. They know what we tell them, and they can calculate numbers, but they have no idea what is happening in the real world *right now*. 

To give our agents "Senses," we need to teach them how to talk to the internet. We do this using **APIs** (Application Programming Interfaces) and the Python **`requests`** library.

---

## 🌐 1. What is an API? (The Internet's Doorway)
Think of an API as a specialized doorway to another company's computer. 
*   If you want the weather, you go through the **Weather API** doorway.
*   If you want to send a tweet, you go through the **Twitter API** doorway.
*   If you want to buy a stock, you go through the **Stock Market API** doorway.

The AI doesn't "surf the web" like a human. It makes a request to a specific doorway and gets back a clean set of data (usually in **JSON** format, which we learned in Module 4!).

## 📞 2. The `requests` Library (The AI's Phone)
To make a call to an API, we use a Python library called `requests`. It's like giving the AI a phone.

```python
import requests

# Making a 'GET' request (Asking for info)
response = requests.get("https://wttr.in/London?format=j1")

# Converting the response to a Python Dictionary
data = response.json()

# Finding the temperature
temp = data['current_condition'][0]['temp_C']
print(f"It is {temp}°C in London!")
```

---

## 🚀 Let's Build a Real-World Senses Agent!

We are going to build an agent that can tell you the **real, live weather** for any city in the world. This time, it's not a simulation—it's real data from the internet!

Create a file named `05_api_agent.py` in your `Python_For_AI_Course` folder.

```python
"""
==================================================
 MODULE 5: THE AGENT'S SENSES (APIs)
==================================================
In this script, we use the 'requests' library to 
give our AI the ability to see live data from the internet.
"""

from openai import OpenAI
import requests
import json

# ---------------------------------------------------------
# 1. TOOL: Fetch LIVE weather from the internet
# ---------------------------------------------------------
def get_live_weather(city: str) -> str:
    print(f"\n   [🌍 SENSES] Connecting to the internet for: {city}...")
    
    try:
        # We use wttr.in, a free weather API that doesn't need a key!
        # format=j1 gives us the data in the JSON format we love.
        url = f"https://wttr.in/{city}?format=j1"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            temp = data['current_condition'][0]['temp_C']
            desc = data['current_condition'][0]['weatherDesc'][0]['value']
            return f"The current weather in {city} is {temp}°C and {desc}."
        else:
            return f"Could not find weather for {city}. (Error {response.status_code})"
            
    except Exception as e:
        return f"Internet connection failed: {e}"

# ---------------------------------------------------------
# 2. AI CONFIGURATION (The Instruction Manual)
# ---------------------------------------------------------
tools_manual = [
    {
        "type": "function",
        "function": {
            "name": "get_live_weather",
            "description": "Get the current real-time weather for any city.",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "The name of the city (e.g., 'London' or 'Tokyo')"}
                },
                "required": ["city"]
            }
        }
    }
]

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# ---------------------------------------------------------
# 3. THE PRACTICAL TEST
# ---------------------------------------------------------
user_query = "What is the weather like in Paris right now?"
print(f"🤖 User asks: '{user_query}'")

messages = [{"role": "user", "content": user_query}]

# Step 1: AI decides to use its "Senses"
response = client.chat.completions.create(
    model="llama3.2",
    messages=messages,
    tools=tools_manual
)

# Step 2: Handle the tool call
if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    
    # Run the real API request!
    weather_info = get_live_weather(args.get("city", "London"))
    print(f"✅ Internet Output: {weather_info}")
    
    # Step 3: Give the real data back to the AI for a final answer
    messages.append(response.choices[0].message)
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": weather_info
    })
    
    final_response = client.chat.completions.create(
        model="llama3.2",
        messages=messages
    )
    
    print("\n🤖 FINAL AI ANSWER:")
    print(final_response.choices[0].message.content)
else:
    print("\n🤖 AI Answer (No Tool Used):")
    print(response.choices[0].message.content)
```
