# 🛠️ Phase 7 — Tools
### "Giving Your AI Real-World Superpowers"

> **Difficulty**: ⭐⭐⭐ Intermediate | **Time**: ~90 minutes | **Prerequisites**: Phase 6 Complete

---

## 🎯 What You'll Learn

- ✅ What Tools are in LangChain
- ✅ Why tools make AI go from "chatbot" to "agent"
- ✅ Built-in tools (search, calculator, etc.)
- ✅ How to create custom tools
- ✅ Tool calling flow (how AI decides which tool to use)
- ✅ Build: Weather Bot, Research Assistant, File Reader

---

## 📖 Lesson 7.1 — What Are Tools?

### Simple Explanation

Without tools, AI can only **talk**. With tools, AI can **act**.

```
AI WITHOUT TOOLS:              AI WITH TOOLS:
─────────────────             ─────────────────────────
"What's the weather?"         "What's the weather?"
"I don't know current          → [Uses weather API tool]
 weather data."                → "It's 72°F and sunny
                                  in New York right now!"
```

### Real-Life Analogy

Think of tools like **apps on a smartphone**.

A person with no phone can only tell you what they know from memory.

A person with a smartphone can:
- 🔍 Search Google for current information
- 🧮 Use a calculator for exact math
- 🗺️ Open Maps for directions
- 📧 Send emails
- 📸 Take photos

AI tools are exactly like smartphone apps — they extend what AI can do!

### The Tool-Calling Flow

```
User: "What is 2847 * 9483?"

    AI THINKS: "I need to calculate this. 
                I should use the calculator tool."
         ↓
    AI CALLS: calculator_tool(expression="2847 * 9483")
         ↓
    TOOL RETURNS: 26,997,201
         ↓
    AI RESPONDS: "2847 × 9483 = 26,997,201"
```

The AI **decides** to use the tool, **calls** it, and **uses the result** in its response. This is what makes it an **agent** rather than just a chatbot.

---

## 📖 Lesson 7.2 — Creating Custom Tools

### The `@tool` Decorator (The Easy Way)

```python
# ============================================================
# FILE: tools/basic_tools.py
# PURPOSE: Creating your first LangChain tools
# ============================================================

from langchain_core.tools import tool
from typing import Optional

# ---- Tool 1: Simple Calculator ----
@tool
def calculator(expression: str) -> str:
    """
    Calculate a mathematical expression.
    Use this for any math calculations.
    Input should be a valid Python math expression like '2 + 2' or '100 * 0.15'.
    """
    try:
        # eval() is safe here because we control the context
        # In production, use a safer math parser
        result = eval(expression, {"__builtins__": {}}, {
            "abs": abs, "round": round, "min": min, "max": max
        })
        return f"The result of {expression} = {result}"
    except Exception as e:
        return f"Error calculating '{expression}': {str(e)}"

# ---- Tool 2: Word Counter ----
@tool
def word_counter(text: str) -> str:
    """
    Count the number of words, characters, and sentences in a text.
    Use when the user wants to know how long their text is.
    """
    words = len(text.split())
    chars = len(text)
    chars_no_spaces = len(text.replace(" ", ""))
    sentences = text.count('.') + text.count('!') + text.count('?')
    
    return f"""Text Analysis:
- Words: {words}
- Characters (with spaces): {chars}
- Characters (no spaces): {chars_no_spaces}
- Approximate sentences: {sentences}"""

# ---- Tool 3: Text Reverser ----
@tool
def text_reverser(text: str) -> str:
    """
    Reverse the given text string.
    Use when asked to reverse text or check palindromes.
    """
    reversed_text = text[::-1]
    is_palindrome = text.lower() == reversed_text.lower()
    return f"Reversed: '{reversed_text}' | Palindrome: {is_palindrome}"

# ---- Test the tools directly ----
if __name__ == "__main__":
    print("🧮 Calculator:", calculator.invoke("(100 + 200) * 3"))
    print("\n📊 Word Counter:", word_counter.invoke("Hello world, this is LangChain!"))
    print("\n🔄 Reverser:", text_reverser.invoke("racecar"))
```

### The Tool Anatomy Explained

```python
@tool                          # This decorator makes it a LangChain tool
def my_tool(param: str) -> str:  # Type hints are IMPORTANT - AI reads them!
    """
    DESCRIPTION: This is what the AI reads to decide WHETHER to use this tool.
    Be clear and specific about what the tool does and when to use it.
    Input: What format the input should be in.
    """
    # Your actual logic here
    result = do_something(param)
    return str(result)  # Always return a string!
```

> 🔑 **The docstring is critical!** The AI reads it to understand what the tool does and when to use it. Write it clearly!

---

## 📖 Lesson 7.3 — Tool Binding and Tool Calling

### Bind Tools to a Model

```python
# ============================================================
# FILE: tools/tool_binding.py
# PURPOSE: Binding tools to models so AI can use them
# ============================================================

from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, ToolMessage
import json

# ---- Define tools ----
@tool
def get_current_time() -> str:
    """Get the current date and time. Use when asked about current time or date."""
    from datetime import datetime
    now = datetime.now()
    return f"Current date and time: {now.strftime('%Y-%m-%d %H:%M:%S')}"

@tool
def get_weather(city: str) -> str:
    """
    Get weather information for a city.
    Use when asked about weather or temperature.
    Input: city name as a string (e.g., 'New York', 'London')
    """
    # In real app: call weather API
    # For demo, return mock data
    weather_data = {
        "new york": {"temp": 72, "condition": "Partly Cloudy", "humidity": 65},
        "london": {"temp": 58, "condition": "Rainy", "humidity": 80},
        "tokyo": {"temp": 68, "condition": "Sunny", "humidity": 55},
        "cairo": {"temp": 95, "condition": "Hot and Sunny", "humidity": 20},
    }
    
    city_lower = city.lower()
    if city_lower in weather_data:
        data = weather_data[city_lower]
        return f"Weather in {city}: {data['temp']}°F, {data['condition']}, Humidity: {data['humidity']}%"
    else:
        return f"Weather data not available for {city}. Try: New York, London, Tokyo, Cairo"

@tool
def calculate(expression: str) -> str:
    """
    Evaluate a mathematical expression.
    Input: A valid math expression like '25 * 4' or '100 / 5 + 3'
    """
    try:
        result = eval(expression, {"__builtins__": {}}, {})
        return f"{expression} = {result}"
    except:
        return f"Could not calculate: {expression}"

# ---- Bind tools to the model ----
llm = ChatOllama(model="llama3.2")
tools = [get_current_time, get_weather, calculate]

# .bind_tools() tells the model what tools are available
llm_with_tools = llm.bind_tools(tools)

# ---- The Tool Calling Loop ----
def run_with_tools(user_question: str):
    """Run the model and handle any tool calls."""
    
    messages = [HumanMessage(content=user_question)]
    print(f"\n❓ Question: {user_question}")
    
    # First call: AI may decide to use tools
    response = llm_with_tools.invoke(messages)
    
    # Check if AI wants to use tools
    if response.tool_calls:
        print(f"🔧 AI wants to use {len(response.tool_calls)} tool(s):")
        
        # Add AI's response to messages
        messages.append(response)
        
        # Execute each tool the AI requested
        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]
            tool_id = tool_call["id"]
            
            print(f"   → Calling: {tool_name}({tool_args})")
            
            # Find and run the right tool
            tool_map = {t.name: t for t in tools}
            if tool_name in tool_map:
                tool_result = tool_map[tool_name].invoke(tool_args)
                print(f"   ← Result: {tool_result}")
                
                # Add tool result to messages
                messages.append(ToolMessage(
                    content=tool_result,
                    tool_call_id=tool_id
                ))
        
        # Second call: AI processes tool results and gives final answer
        final_response = llm_with_tools.invoke(messages)
        print(f"\n🤖 Final Answer: {final_response.content}")
    else:
        # AI didn't need tools, just responded directly
        print(f"🤖 Answer: {response.content}")

# ---- Test it! ----
run_with_tools("What's the weather like in Tokyo right now?")
run_with_tools("If I have 347 items at $24.99 each, what's my total revenue?")
run_with_tools("What's today's date and time?")
run_with_tools("Explain what Python decorators are")  # No tool needed
```

---

## 📖 Lesson 7.4 — Built-in and Common Tools

### Search Tool (DuckDuckGo — Free!)

```python
# ============================================================
# FILE: tools/search_tool.py
# PURPOSE: Real web search using DuckDuckGo
# ============================================================

# Install: pip install duckduckgo-search langchain-community

from langchain_community.tools import DuckDuckGoSearchRun, DuckDuckGoSearchResults
from langchain_core.tools import tool

# Simple search (returns string)
search = DuckDuckGoSearchRun()

# Test directly
result = search.invoke("Latest developments in LangChain 2024")
print("Search Result:", result[:500])

# Advanced search (returns structured results)
search_advanced = DuckDuckGoSearchResults(num_results=3)

results = search_advanced.invoke("LangChain latest version")
print("\nAdvanced Results:", results[:500])
```

### File Reading Tool

```python
# ============================================================
# FILE: tools/file_tools.py
# PURPOSE: Tools that work with files
# ============================================================

from langchain_core.tools import tool
import os
import json

@tool
def read_text_file(file_path: str) -> str:
    """
    Read the content of a text file.
    Use when asked to read, analyze, or summarize a file.
    Input: The full file path (e.g., 'data/report.txt')
    """
    try:
        if not os.path.exists(file_path):
            return f"Error: File '{file_path}' not found."
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        word_count = len(content.split())
        return f"File: {file_path}\nWords: {word_count}\n\nContent:\n{content[:2000]}"
        
    except Exception as e:
        return f"Error reading file: {str(e)}"

@tool
def write_text_file(file_path: str, content: str) -> str:
    """
    Write content to a text file. Creates the file if it doesn't exist.
    Use when asked to save, create, or write to a file.
    Input: file_path - where to save, content - what to write
    """
    try:
        # Create directory if needed
        os.makedirs(os.path.dirname(file_path) if os.path.dirname(file_path) else '.', 
                    exist_ok=True)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return f"✅ Successfully wrote {len(content)} characters to '{file_path}'"
    except Exception as e:
        return f"Error writing file: {str(e)}"

@tool
def list_directory(directory: str = ".") -> str:
    """
    List files and folders in a directory.
    Use when asked to see what files exist or explore a folder.
    Input: Directory path (default is current directory '.')
    """
    try:
        items = os.listdir(directory)
        files = [f for f in items if os.path.isfile(os.path.join(directory, f))]
        folders = [f for f in items if os.path.isdir(os.path.join(directory, f))]
        
        result = f"Directory: {directory}\n"
        result += f"📁 Folders ({len(folders)}): {', '.join(folders) or 'None'}\n"
        result += f"📄 Files ({len(files)}): {', '.join(files) or 'None'}"
        
        return result
    except Exception as e:
        return f"Error listing directory: {str(e)}"
```

---

## 📖 Lesson 7.5 — Building A Complete Tool-Powered Agent

```python
# ============================================================
# FILE: tools/projects/research_assistant.py
# PURPOSE: AI Research Assistant with multiple tools
# ============================================================

from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, ToolMessage, SystemMessage
from datetime import datetime
import json

# ---- Define Research Tools ----

@tool
def web_search(query: str) -> str:
    """
    Search the web for current information.
    Use for: latest news, current events, recent data, facts you're unsure about.
    Input: Search query string
    """
    # In production, use real search API (Tavily, DuckDuckGo, etc.)
    # Mock data for demonstration:
    mock_results = {
        "langchain": "LangChain is a framework for building LLM applications. Latest version 0.3.x released...",
        "python": "Python 3.12 released with significant performance improvements. 3.13 in development...",
        "ai agents": "AI agents are autonomous systems that can plan and execute multi-step tasks...",
        "openai": "OpenAI released GPT-4o with multimodal capabilities including vision and voice...",
    }
    
    query_lower = query.lower()
    for keyword, result in mock_results.items():
        if keyword in query_lower:
            return f"Search results for '{query}':\n{result}"
    
    return f"Search results for '{query}': Found information about {query}. [Mock result - integrate real API]"

@tool
def save_research_note(title: str, content: str) -> str:
    """
    Save a research note to a file for later reference.
    Use when you want to save important findings.
    Input: title (note title) and content (the note content)
    """
    filename = f"research_notes_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    note = f"# {title}\nDate: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n{content}"
    
    with open(filename, 'w') as f:
        f.write(note)
    
    return f"✅ Note saved: {filename}"

@tool
def calculate(expression: str) -> str:
    """
    Calculate mathematical expressions.
    Input: Valid math expression like '1500 * 12' or '(100 + 50) / 3'
    """
    try:
        result = eval(expression, {"__builtins__": {}}, {})
        return f"{expression} = {result}"
    except Exception as e:
        return f"Error: {e}"

@tool
def get_date_info(date_type: str = "today") -> str:
    """
    Get date and time information.
    Options: 'today' for current date, 'year' for current year.
    Input: 'today' or 'year'
    """
    now = datetime.now()
    if date_type == "today":
        return f"Today is {now.strftime('%A, %B %d, %Y')} at {now.strftime('%H:%M')}"
    elif date_type == "year":
        return f"Current year: {now.year}"
    return f"Current date: {now.strftime('%Y-%m-%d')}"

# ---- Build the Agent ----
tools = [web_search, save_research_note, calculate, get_date_info]
tool_map = {t.name: t for t in tools}

llm = ChatOllama(model="llama3.2")
llm_with_tools = llm.bind_tools(tools)

SYSTEM_PROMPT = """You are an expert research assistant with access to powerful tools.

You can:
- Search the web for current information
- Save important findings as notes
- Perform calculations
- Get current date/time information

APPROACH:
1. Understand what the user needs
2. Use the most appropriate tool(s) to gather information
3. Synthesize the information into a helpful response
4. Save important findings when relevant

Always use tools when you need current information or calculations."""

def research_agent(query: str, max_steps: int = 5):
    """Run the research agent."""
    print(f"\n🔬 Research Query: {query}")
    print("=" * 60)
    
    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=query)
    ]
    
    step = 0
    while step < max_steps:
        step += 1
        print(f"\n📍 Step {step}:")
        
        response = llm_with_tools.invoke(messages)
        
        if not response.tool_calls:
            # No more tool calls, we have the final answer
            print(f"\n✅ Final Answer:")
            print(response.content)
            return response.content
        
        # Process tool calls
        messages.append(response)
        
        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]
            
            print(f"  🔧 Using tool: {tool_name}")
            print(f"     Args: {tool_args}")
            
            if tool_name in tool_map:
                result = tool_map[tool_name].invoke(tool_args)
                print(f"  📥 Result: {result[:200]}")
                
                messages.append(ToolMessage(
                    content=result,
                    tool_call_id=tool_call["id"]
                ))
    
    print("⚠️ Max steps reached")

# ---- Test the Research Assistant ----
research_agent("What is LangChain and when was it created?")
research_agent("If I invest $10,000 at 7% annual return for 10 years, how much will I have? (use compound interest: P*(1+r)^n)")
research_agent("What are the latest developments in AI agents?")
```

---

## 📖 Lesson 7.6 — Building a Weather Bot

```python
# ============================================================
# FILE: tools/projects/weather_bot.py
# PURPOSE: Interactive weather assistant with tools
# ============================================================

import requests
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, ToolMessage, SystemMessage

@tool
def get_weather(city: str) -> str:
    """
    Get real-time weather for any city.
    Use whenever user asks about weather, temperature, forecast.
    Input: city name (e.g., 'Paris', 'New York', 'Tokyo')
    """
    # Real implementation using OpenWeatherMap (free tier available)
    # API_KEY = os.getenv("OPENWEATHER_API_KEY")
    # url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=imperial"
    # response = requests.get(url).json()
    
    # Mock for demo
    mock_weather = {
        "paris": "Paris: 65°F (18°C), Light rain, Humidity: 78%, Wind: 12 mph NW",
        "new york": "New York: 72°F (22°C), Partly cloudy, Humidity: 65%, Wind: 8 mph SW",  
        "tokyo": "Tokyo: 68°F (20°C), Sunny, Humidity: 55%, Wind: 5 mph E",
        "london": "London: 58°F (14°C), Overcast, Humidity: 82%, Wind: 15 mph W",
        "dubai": "Dubai: 104°F (40°C), Clear and hot, Humidity: 30%, Wind: 10 mph SE",
    }
    
    city_key = city.lower()
    if city_key in mock_weather:
        return mock_weather[city_key]
    return f"Could not find weather for {city}. Try: Paris, New York, Tokyo, London, Dubai"

@tool
def get_forecast(city: str, days: int = 3) -> str:
    """
    Get weather forecast for upcoming days.
    Use when user asks about future weather or planning trips.
    Input: city name and number of days (1-7)
    """
    forecasts = {
        "new york": [
            "Monday: 74°F, Sunny",
            "Tuesday: 68°F, Cloudy", 
            "Wednesday: 71°F, Partly Cloudy",
        ],
        "london": [
            "Monday: 60°F, Rainy",
            "Tuesday: 62°F, Cloudy",
            "Wednesday: 58°F, Heavy Rain",
        ]
    }
    
    city_key = city.lower()
    if city_key in forecasts:
        forecast = forecasts[city_key][:days]
        return f"{days}-day forecast for {city}:\n" + "\n".join(forecast)
    return f"Forecast not available for {city}"

@tool  
def clothing_recommendation(temperature: int, conditions: str) -> str:
    """
    Recommend what to wear based on weather conditions.
    Use when user wants clothing advice.
    Input: temperature in Fahrenheit, weather conditions string
    """
    if temperature < 40:
        base = "Heavy winter coat, gloves, and warm layers"
    elif temperature < 55:
        base = "Light jacket or sweater"
    elif temperature < 70:
        base = "Long sleeves or light jacket"
    elif temperature < 85:
        base = "T-shirt and comfortable pants"
    else:
        base = "Light, breathable clothing"
    
    extras = ""
    if "rain" in conditions.lower():
        extras += ", umbrella or rain jacket"
    if "sunny" in conditions.lower() and temperature > 70:
        extras += ", sunglasses and sunscreen"
    
    return f"👕 Clothing recommendation: {base}{extras}"

# Simple weather bot
tools = [get_weather, get_forecast, clothing_recommendation]
tool_map = {t.name: t for t in tools}

llm = ChatOllama(model="llama3.2")
llm_with_tools = llm.bind_tools(tools)

def weather_chat(query: str):
    """Handle weather-related queries."""
    messages = [
        SystemMessage(content="You are WeatherBot, a helpful weather assistant. Use your tools to get accurate weather data. Always be helpful and friendly."),
        HumanMessage(content=query)
    ]
    
    response = llm_with_tools.invoke(messages)
    messages.append(response)
    
    while response.tool_calls:
        for tc in response.tool_calls:
            result = tool_map[tc["name"]].invoke(tc["args"]) if tc["name"] in tool_map else "Tool not found"
            messages.append(ToolMessage(content=result, tool_call_id=tc["id"]))
        
        response = llm_with_tools.invoke(messages)
        messages.append(response)
    
    return response.content

# Test
print("🌤️ Weather Bot Ready!\n")
print(weather_chat("What's the weather in Tokyo and should I bring an umbrella?"))
print()
print(weather_chat("I'm planning a trip to London next week. What's the forecast and what should I pack?"))
```

---

## ⚠️ Common Tool Mistakes

### Mistake 1: Vague Tool Descriptions

```python
# ❌ AI won't know WHEN to use this
@tool
def my_tool(input: str) -> str:
    """Does something with input."""
    ...

# ✅ Clear, specific docstring
@tool  
def currency_converter(amount_and_currencies: str) -> str:
    """
    Convert currency amounts. Use when user asks about money conversion.
    Input format: '100 USD to EUR' or '50 GBP in JPY'
    Returns: converted amount with exchange rate.
    """
    ...
```

### Mistake 2: Tools That Don't Return Strings

```python
# ❌ Returns a number (will cause errors)
@tool
def add_numbers(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b

# ✅ Always return strings
@tool
def add_numbers(a: int, b: int) -> str:
    """Add two numbers together."""
    return f"{a} + {b} = {a + b}"
```

---

## 🧠 Quick Quiz

1. What's the difference between AI with tools vs without tools?
2. Why is the tool docstring so important?
3. What does `.bind_tools()` do?
4. What is a `ToolMessage` used for?
5. What happens in the "tool calling loop"?

---

## 🎯 Mini Challenges

**Challenge 1**: Create a "Study Helper" tool kit: a tool that creates flashcards from text, a quiz generator, and a progress tracker.

**Challenge 2**: Build a "Personal Finance Assistant" with tools: expense calculator, budget checker, and savings goal tracker.

**Challenge 3**: Create a "Code Helper" tool kit with tools: syntax checker, code formatter, and documentation generator.

---

## ✅ Phase 7 Recap

| Concept | What It Does |
|---------|-------------|
| `@tool` decorator | Turns a Python function into an AI-usable tool |
| Docstring | Tells AI WHAT the tool does and WHEN to use it |
| `.bind_tools()` | Makes tools available to an LLM |
| Tool calling loop | AI → calls tool → gets result → uses result |
| `ToolMessage` | Contains results from tool execution |

---

## 🚀 What's Next?

**Phase 8 — AI Agents** — The most important phase! We'll combine everything (memory + tools + chains) into fully autonomous AI agents that can plan and execute complex multi-step tasks.

> **Go to**: `Phase08_Agents/lesson.md` →

---

*Phase 7 Complete! 🛠️ Your AI now has real superpowers. Time to make it autonomous!*
