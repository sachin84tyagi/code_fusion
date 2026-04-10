# 🤖 AI Agents Masterclass
## Chapter 3: Environments & Tools — How Agents Interact with the World

> *"An agent without tools is just a very expensive autocomplete."*
> — Prof. Mode, activated ☕

---

## 📋 Table of Contents

1. [Welcome Back, Builder](#welcome-back)
2. [The Big Picture: Agent + Environment](#big-picture)
3. [Concept 1: Function Calling (The Superpower)](#function-calling)
4. [Concept 2: Connecting External APIs](#connecting-apis)
5. [Concept 3: Databases as Agent Memory](#databases)
6. [Concept 4: Web Scraping as an Agent Tool](#web-scraping)
7. [Real Industry Use Case: AI Research Assistant](#industry-use-case)
8. [Putting It All Together](#putting-together)
9. [Chapter Quiz](#quiz)
10. [Chapter 4 Preview](#preview)

---

## 1. Welcome Back, Builder <a name="welcome-back"></a>

In Chapter 2, we covered how agents *think* — the reasoning loop, planning, and memory. Now we answer the more fun question:

> **How do agents actually *do things* in the world?**

Think of it this way. You're a brilliant person locked in a room with no phone, no computer, no books. You can think all day, but you can't accomplish much. Give you a laptop with internet? Now we're talking.

That laptop — with all its connectivity — is what **tools** are to an agent.

This chapter is **code-heavy** by design. By the end, you'll have working Python snippets for every major tool pattern an agent uses in production.

Let's go. 🚀

---

## 2. The Big Picture: Agent + Environment <a name="big-picture"></a>

Here's the mental model we're working with:

```
┌─────────────────────────────────────────────────────────────┐
│                        THE WORLD                            │
│                                                             │
│   ┌──────────┐    ┌──────────┐    ┌──────────────────────┐  │
│   │ REST APIs│    │Databases │    │   Web / HTML Pages   │  │
│   └────┬─────┘    └────┬─────┘    └──────────┬───────────┘  │
│        │               │                      │             │
└────────┼───────────────┼──────────────────────┼─────────────┘
         │               │                      │
         ▼               ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    TOOL LAYER                               │
│                                                             │
│   ┌──────────┐    ┌──────────┐    ┌──────────────────────┐  │
│   │ API Tool │    │  DB Tool │    │    Scraper Tool       │  │
│   └────┬─────┘    └────┬─────┘    └──────────┬───────────┘  │
│        │               │                      │             │
└────────┼───────────────┼──────────────────────┼─────────────┘
         │               │                      │
         └───────────────┼──────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │         AGENT CORE            │
         │                               │
         │  1. Perceive (read input)     │
         │  2. Reason  (LLM thinks)      │
         │  3. Act     (call a tool)     │
         │  4. Observe (get result)      │
         │  5. Repeat until done         │
         └───────────────────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │    USER     │
                  └─────────────┘
```

The agent sits in the **middle**. It never directly touches the internet or database — it calls **tools**, which are just Python functions that do the heavy lifting. This design is intentional:

- ✅ **Safe**: You control what the agent *can* do
- ✅ **Observable**: Every tool call is logged
- ✅ **Testable**: Tools are just functions — unit test them!
- ✅ **Composable**: Chain tools for complex workflows

---

## 3. Concept 1: Function Calling — The Superpower <a name="function-calling"></a>

### What Is Function Calling?

Function calling (also called "tool use") is the mechanism where an LLM outputs a **structured JSON object** instead of plain text — specifically, a request to call a function with given arguments.

The flow looks like this:

```
┌──────────────────────────────────────────────────────────┐
│                  FUNCTION CALLING LOOP                   │
│                                                          │
│  User: "What's the weather in Mumbai?"                   │
│                         │                                │
│                         ▼                                │
│              ┌──────────────────┐                        │
│              │   LLM (GPT/       │                        │
│              │   Claude/Gemini)  │                        │
│              └────────┬─────────┘                        │
│                       │                                  │
│           Decides it needs a tool                        │
│                       │                                  │
│                       ▼                                  │
│   Output: { "tool": "get_weather",                       │
│             "args": { "city": "Mumbai" } }               │
│                       │                                  │
│                       ▼                                  │
│         ┌─────────────────────────┐                      │
│         │  YOUR CODE runs the     │                      │
│         │  actual function        │                      │
│         └──────────┬──────────────┘                      │
│                    │                                      │
│         Result: {"temp": 34, "condition": "Humid"}       │
│                    │                                      │
│                    ▼                                      │
│         LLM gets result, generates final answer          │
│                    │                                      │
│                    ▼                                      │
│  "It's 34°C and humid in Mumbai today. Stay hydrated!"  │
└──────────────────────────────────────────────────────────┘
```

The key insight: **the LLM never calls the function itself.** It just *asks* for it. Your code does the calling. This is a critical safety boundary.

### Let's Build It — Line by Line

We'll use **OpenAI's API** since it has the most widely-adopted function-calling spec (most models use the same schema now).

#### Step 1: Install dependencies

```bash
pip install openai
```

#### Step 2: Define your tools as JSON schemas

```python
# tools.py

# Each tool is described to the LLM as a JSON schema.
# The LLM reads this schema to understand:
#   - What the tool does (description)
#   - What arguments it needs (parameters)
#   - Which arguments are required

tools = [
    {
        "type": "function",               # Always "function" for now
        "function": {
            "name": "get_weather",        # Python function name to call
            "description": (
                "Gets the current weather for a given city. "
                "Use this when the user asks about weather or temperature."
            ),
            "parameters": {
                "type": "object",         # Parameters are always an object
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "The city name, e.g. 'Mumbai' or 'New York'"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],  # Constrained choices!
                        "description": "Temperature unit. Defaults to celsius."
                    }
                },
                "required": ["city"]      # Only city is required; unit is optional
            }
        }
    }
]
```

#### Step 3: Implement the actual Python function

```python
# actual_functions.py

import requests  # For real API calls (we'll cover this in Section 4)

def get_weather(city: str, unit: str = "celsius") -> dict:
    """
    This is the REAL function that gets called when the LLM asks for it.
    For now, we'll use a mock response.
    In production, you'd call a weather API like OpenWeatherMap.
    """
    
    # --- MOCK RESPONSE (replace with real API call in production) ---
    mock_data = {
        "Mumbai":    {"temp_c": 34, "temp_f": 93,  "condition": "Humid and hazy"},
        "New York":  {"temp_c": 18, "temp_f": 64,  "condition": "Partly cloudy"},
        "London":    {"temp_c": 12, "temp_f": 54,  "condition": "Overcast (shocked, I know)"},
    }
    
    # Normalize the city name for lookup
    data = mock_data.get(city, {"temp_c": 25, "temp_f": 77, "condition": "Unknown"})
    
    # Return the right unit based on what the LLM requested
    if unit == "fahrenheit":
        return {
            "city": city,
            "temperature": data["temp_f"],
            "unit": "°F",
            "condition": data["condition"]
        }
    else:
        return {
            "city": city,
            "temperature": data["temp_c"],
            "unit": "°C",
            "condition": data["condition"]
        }
```

#### Step 4: Build the agent loop

```python
# agent.py

import json
import openai
from tools import tools
from actual_functions import get_weather

# Map tool names (strings) to actual Python functions
# This is your "function registry" — add every tool here
TOOL_REGISTRY = {
    "get_weather": get_weather,
    # "search_database": search_database,   # Add more tools here later
    # "scrape_website": scrape_website,
}

def run_agent(user_message: str) -> str:
    """
    Runs the agent loop for a single user message.
    Returns the final text response.
    """
    
    client = openai.OpenAI()  # Reads OPENAI_API_KEY from environment
    
    # Initialize conversation history
    # The LLM needs context — it's stateless on its own
    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful assistant with access to tools. "
                "Use tools when appropriate to answer user questions accurately."
            )
        },
        {
            "role": "user",
            "content": user_message
        }
    ]
    
    print(f"\n[Agent] User said: {user_message}")
    
    # === THE AGENT LOOP ===
    # We loop because the agent might need multiple tool calls
    # e.g., get weather → look up UV index → check air quality
    
    while True:
        
        # Step 1: Ask the LLM what to do next
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools,              # Hand the LLM the tool schemas
            tool_choice="auto"        # Let LLM decide: use a tool or answer directly
        )
        
        # Get the message from the LLM
        assistant_message = response.choices[0].message
        
        # Step 2: Check if the LLM wants to use a tool
        if assistant_message.tool_calls:
            
            # Add the LLM's "I want to call a tool" message to history
            messages.append(assistant_message)
            
            # Process each tool call (LLM can request multiple at once!)
            for tool_call in assistant_message.tool_calls:
                
                tool_name = tool_call.function.name
                # Parse the JSON arguments the LLM generated
                tool_args = json.loads(tool_call.function.arguments)
                
                print(f"[Agent] Calling tool: {tool_name}({tool_args})")
                
                # Step 3: Actually call the function
                if tool_name in TOOL_REGISTRY:
                    result = TOOL_REGISTRY[tool_name](**tool_args)
                else:
                    result = {"error": f"Unknown tool: {tool_name}"}
                
                print(f"[Agent] Tool result: {result}")
                
                # Step 4: Add the tool result back to the conversation
                # The LLM needs to see what the tool returned
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,   # Links result to the specific call
                    "content": json.dumps(result)    # Results must be JSON strings
                })
        
        else:
            # No tool calls — the LLM is giving us a final answer
            final_answer = assistant_message.content
            print(f"[Agent] Final answer: {final_answer}")
            return final_answer


# === RUN IT ===
if __name__ == "__main__":
    answer = run_agent("What's the weather like in Mumbai? I'm visiting next week.")
    print(f"\n✅ Response: {answer}")
```

#### Sample Output

```
[Agent] User said: What's the weather like in Mumbai? I'm visiting next week.
[Agent] Calling tool: get_weather({'city': 'Mumbai', 'unit': 'celsius'})
[Agent] Tool result: {'city': 'Mumbai', 'temperature': 34, 'unit': '°C', 'condition': 'Humid and hazy'}
[Agent] Final answer: Mumbai is currently 34°C and humid with hazy conditions.
For a visit, I'd recommend light, breathable clothing and staying hydrated!

✅ Response: Mumbai is currently 34°C and humid with hazy conditions...
```

> 🧠 **Professor's Note:** Notice that the agent *automatically* decided to use `get_weather`. You didn't hardcode that decision. That's the intelligence — the LLM reads the tool description and figures out when to use it. This is why **writing good tool descriptions matters enormously**. A vague description = a confused agent.

---

## 4. Concept 2: Connecting External APIs <a name="connecting-apis"></a>

APIs are the most common "sense organs" for agents. Let's build a proper, production-grade API tool that an agent can use.

### The Real Weather API Tool

```python
# tools/weather_api_tool.py

import os
import requests
from typing import Optional

# --- CONFIGURATION ---
# Always read secrets from environment variables, NEVER hardcode them
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

def get_weather_real(city: str, unit: str = "celsius") -> dict:
    """
    Fetches REAL weather data from OpenWeatherMap API.
    
    Args:
        city: City name (e.g., "Mumbai")
        unit: "celsius" or "fahrenheit"
    
    Returns:
        Dict with temperature, condition, humidity, wind_speed
    """
    
    # Map our unit names to API's unit parameter
    # OpenWeatherMap uses: "metric" (°C), "imperial" (°F), "standard" (Kelvin — nobody wants that)
    unit_map = {
        "celsius": "metric",
        "fahrenheit": "imperial"
    }
    api_units = unit_map.get(unit, "metric")  # Default to metric if unknown
    
    # Build the API request
    params = {
        "q": city,                      # City query parameter
        "appid": OPENWEATHER_API_KEY,   # Authentication
        "units": api_units              # Unit system
    }
    
    try:
        # Make the HTTP GET request
        # timeout=10 is CRITICAL in production — never let requests hang forever
        response = requests.get(
            OPENWEATHER_BASE_URL,
            params=params,
            timeout=10
        )
        
        # Raise an exception for 4xx/5xx HTTP errors
        response.raise_for_status()
        
        # Parse the JSON response
        data = response.json()
        
        # Extract what we need — be defensive, use .get() with defaults
        return {
            "city": data.get("name", city),
            "temperature": round(data["main"]["temp"]),    # Current temp
            "feels_like": round(data["main"]["feels_like"]),
            "humidity": data["main"]["humidity"],          # Humidity %
            "condition": data["weather"][0]["description"].capitalize(),
            "wind_speed": data.get("wind", {}).get("speed", 0),
            "unit": "°C" if unit == "celsius" else "°F"
        }
    
    except requests.exceptions.Timeout:
        # API took too long — don't crash the agent, return an error dict
        return {"error": "Weather API timed out. Please try again."}
    
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return {"error": f"City '{city}' not found. Check the spelling."}
        elif e.response.status_code == 401:
            return {"error": "Invalid API key. Check your OPENWEATHER_API_KEY."}
        else:
            return {"error": f"API error: {e.response.status_code}"}
    
    except Exception as e:
        # Catch-all: agents should never crash due to tool failures
        return {"error": f"Unexpected error: {str(e)}"}
```

### The REST API Pattern — Generalized

Here's a reusable pattern for any REST API tool:

```python
# tools/api_base.py

import requests
import time
from functools import wraps

def with_retry(max_retries: int = 3, delay: float = 1.0):
    """
    Decorator that retries a function on failure.
    Useful for flaky APIs (which is... most APIs in the real world).
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_error = None
            
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)         # Try the function
                except Exception as e:
                    last_error = e
                    wait = delay * (2 ** attempt)        # Exponential backoff: 1s, 2s, 4s
                    print(f"[Retry] Attempt {attempt + 1} failed. Waiting {wait}s...")
                    time.sleep(wait)
            
            # All retries exhausted
            return {"error": f"Failed after {max_retries} attempts: {str(last_error)}"}
        
        return wrapper
    return decorator


class APITool:
    """
    Base class for API-based agent tools.
    Handles auth, retries, and error formatting consistently.
    """
    
    def __init__(self, base_url: str, api_key: str, auth_header: str = "Authorization"):
        self.base_url = base_url.rstrip("/")   # Normalize URL (remove trailing slash)
        self.session = requests.Session()       # Reuse connections for performance
        
        # Set auth headers once on the session (applies to all requests)
        self.session.headers.update({
            auth_header: f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        })
    
    @with_retry(max_retries=3, delay=1.0)
    def get(self, endpoint: str, params: dict = None) -> dict:
        """Make a GET request to the API."""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = self.session.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    
    @with_retry(max_retries=3, delay=1.0)
    def post(self, endpoint: str, body: dict = None) -> dict:
        """Make a POST request to the API."""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = self.session.post(url, json=body, timeout=10)
        response.raise_for_status()
        return response.json()


# === USAGE EXAMPLE: GitHub API Tool ===

class GitHubTool(APITool):
    """Agent tool for interacting with GitHub's REST API."""
    
    def __init__(self, github_token: str):
        super().__init__(
            base_url="https://api.github.com",
            api_key=github_token,
            auth_header="Authorization"
        )
    
    def get_repo_info(self, owner: str, repo: str) -> dict:
        """
        Get information about a GitHub repository.
        The agent calls this when asked about a GitHub repo.
        """
        data = self.get(f"/repos/{owner}/{repo}")
        
        # Return only what the agent needs (not the full GitHub response)
        # Keep tool outputs lean — LLMs have context limits!
        return {
            "name": data.get("name"),
            "description": data.get("description"),
            "stars": data.get("stargazers_count"),
            "forks": data.get("forks_count"),
            "language": data.get("language"),
            "open_issues": data.get("open_issues_count"),
            "last_updated": data.get("updated_at"),
            "url": data.get("html_url")
        }
    
    def search_code(self, query: str, language: str = None) -> dict:
        """Search GitHub code across public repos."""
        search_query = query
        if language:
            search_query += f" language:{language}"   # GitHub search syntax
        
        data = self.get("/search/code", params={"q": search_query, "per_page": 5})
        
        # Summarize results — don't dump raw JSON into the LLM context
        items = data.get("items", [])
        return {
            "total_results": data.get("total_count", 0),
            "top_results": [
                {
                    "file": item["name"],
                    "repo": item["repository"]["full_name"],
                    "url": item["html_url"]
                }
                for item in items[:5]   # Limit to 5 results max
            ]
        }
```

> 🧠 **Professor's Note:** That `APITool` base class? That's the kind of thing that separates junior devs from senior devs. You will call 10+ APIs in a real agent. Having a consistent base class means you fix retry logic in one place, not ten.

---

## 5. Concept 3: Databases as Agent Memory <a name="databases"></a>

Agents need two types of memory:
- **Short-term**: The conversation history (the messages list)
- **Long-term**: A database (things that persist across sessions)

Here's how to give your agent database superpowers.

### Architecture: Agent + Database

```
┌────────────────────────────────────────────────┐
│                    AGENT                        │
│                                                 │
│  "Find all orders over $1000 from last month"  │
│                    │                            │
│                    ▼                            │
│         [calls db_query tool]                   │
│                    │                            │
└────────────────────┼────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────┐
│               DB TOOL LAYER                     │
│                                                 │
│  1. Validates the query (no DROP TABLE, please)│
│  2. Connects to the database                   │
│  3. Executes the query safely (parameterized!) │
│  4. Returns results as a list of dicts         │
└────────────────────┼────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────┐
│              DATABASE                           │
│   (PostgreSQL / SQLite / MongoDB / Redis)      │
└────────────────────────────────────────────────┘
```

### SQLite Agent Tool (Great for Development)

```python
# tools/database_tool.py

import sqlite3
import json
from typing import Any
from pathlib import Path

# ⚠️  CRITICAL SECURITY NOTE ⚠️
# NEVER let the LLM generate raw SQL that runs directly.
# The LLM could generate: "DROP TABLE users; --"
# Always use parameterized queries OR a whitelist of allowed operations.
# We'll use the "allowed_operations" pattern here.

class DatabaseTool:
    """
    Safe database tool for agents.
    Uses parameterized queries to prevent SQL injection.
    """
    
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._setup_demo_db()   # Create a demo database if it doesn't exist
    
    def _get_connection(self) -> sqlite3.Connection:
        """Create a database connection with row factory for dict-like rows."""
        conn = sqlite3.connect(self.db_path)
        # This makes rows behave like dicts: row["name"] instead of row[0]
        conn.row_factory = sqlite3.Row
        return conn
    
    def _setup_demo_db(self):
        """Create demo tables and data if the DB doesn't exist."""
        if Path(self.db_path).exists():
            return   # Don't overwrite existing database
        
        with self._get_connection() as conn:
            # Create a sample orders table
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS orders (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    customer    TEXT NOT NULL,
                    product     TEXT NOT NULL,
                    amount      REAL NOT NULL,
                    status      TEXT DEFAULT 'pending',
                    created_at  TEXT DEFAULT (datetime('now'))
                );
                
                INSERT INTO orders (customer, product, amount, status) VALUES
                    ('Alice Kumar',   'Cloud Server Plan',    2500.00, 'completed'),
                    ('Bob Sharma',    'Analytics Dashboard',   850.00, 'completed'),
                    ('Carol Singh',   'API Access Pro',       1200.00, 'pending'),
                    ('David Mehta',   'Cloud Server Plan',    2500.00, 'completed'),
                    ('Emma Verma',    'Basic Support',         150.00, 'refunded'),
                    ('Frank Joshi',   'Enterprise Suite',     8000.00, 'completed'),
                    ('Grace Pillai',  'Analytics Dashboard',   850.00, 'pending');
            """)
    
    def query_orders(
        self,
        min_amount: float = None,
        max_amount: float = None,
        status: str = None,
        customer: str = None,
        limit: int = 10
    ) -> dict:
        """
        Query orders from the database with flexible filters.
        All parameters are optional — the agent picks what to use.
        
        This is safer than raw SQL because:
        1. We define the allowed filters (not the LLM)
        2. All values are parameterized (no injection possible)
        3. Limit is enforced (no accidentally fetching 1M rows)
        """
        
        # Build query dynamically based on provided filters
        conditions = []   # Will be joined with AND
        params = []       # Parameterized values (? placeholders)
        
        if min_amount is not None:
            conditions.append("amount >= ?")
            params.append(min_amount)
        
        if max_amount is not None:
            conditions.append("amount <= ?")
            params.append(max_amount)
        
        if status:
            conditions.append("status = ?")
            params.append(status.lower())
        
        if customer:
            # LIKE query for partial name matching (still parameterized!)
            conditions.append("customer LIKE ?")
            params.append(f"%{customer}%")
        
        # Clamp limit to prevent abuse
        safe_limit = min(max(1, limit), 100)   # Between 1 and 100
        params.append(safe_limit)
        
        # Build final SQL query
        where_clause = ("WHERE " + " AND ".join(conditions)) if conditions else ""
        sql = f"SELECT * FROM orders {where_clause} ORDER BY created_at DESC LIMIT ?"
        
        try:
            with self._get_connection() as conn:
                cursor = conn.execute(sql, params)
                rows = cursor.fetchall()
                
                # Convert sqlite3.Row objects to plain dicts
                results = [dict(row) for row in rows]
                
                return {
                    "count": len(results),
                    "orders": results,
                    "query_info": {
                        "filters_applied": {k: v for k, v in {
                            "min_amount": min_amount,
                            "max_amount": max_amount,
                            "status": status,
                            "customer": customer
                        }.items() if v is not None}
                    }
                }
        
        except sqlite3.Error as e:
            return {"error": f"Database error: {str(e)}"}
    
    def get_summary_stats(self) -> dict:
        """
        Returns summary statistics — useful for the agent to give overviews.
        """
        sql = """
            SELECT
                COUNT(*)                        AS total_orders,
                SUM(amount)                     AS total_revenue,
                AVG(amount)                     AS avg_order_value,
                MAX(amount)                     AS largest_order,
                SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) AS completed,
                SUM(CASE WHEN status='pending'   THEN 1 ELSE 0 END) AS pending,
                SUM(CASE WHEN status='refunded'  THEN 1 ELSE 0 END) AS refunded
            FROM orders
        """
        
        with self._get_connection() as conn:
            row = conn.execute(sql).fetchone()
            return dict(row)


# === USAGE: Register with the agent ===

db_tool = DatabaseTool("agent_data.db")

# This function becomes a tool in the agent's registry
def query_orders(**kwargs) -> dict:
    return db_tool.query_orders(**kwargs)

def get_order_stats() -> dict:
    return db_tool.get_summary_stats()
```

### Tool Schema for Database

```python
# Add these to your tools list

db_tools = [
    {
        "type": "function",
        "function": {
            "name": "query_orders",
            "description": (
                "Query customer orders from the database. "
                "Use this to find orders by amount, status, or customer name. "
                "All filters are optional."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "min_amount": {
                        "type": "number",
                        "description": "Minimum order amount in dollars"
                    },
                    "max_amount": {
                        "type": "number",
                        "description": "Maximum order amount in dollars"
                    },
                    "status": {
                        "type": "string",
                        "enum": ["pending", "completed", "refunded"],
                        "description": "Filter by order status"
                    },
                    "customer": {
                        "type": "string",
                        "description": "Filter by customer name (partial match supported)"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Max number of results to return (default 10, max 100)"
                    }
                },
                "required": []   # All filters are optional!
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_order_stats",
            "description": "Get summary statistics for all orders: totals, averages, counts by status.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    }
]
```

> 🧠 **Professor's Note:** In production, you'd use **PostgreSQL** with `psycopg2` or **MongoDB** with `pymongo` instead of SQLite. The pattern is identical — just swap the connection layer. Also, consider giving the agent **read-only credentials** to the database. If the agent can't write, it can't accidentally destroy data.

---

## 6. Concept 4: Web Scraping as an Agent Tool <a name="web-scraping"></a>

Sometimes the data you need isn't in an API or database — it's sitting on a web page. Agents can scrape the web as a tool.

### Web Scraping Flow

```
┌──────────────────────────────────────────────────────────┐
│              WEB SCRAPING TOOL FLOW                      │
│                                                          │
│  Agent says: "Scrape the pricing page of Stripe"        │
│                         │                               │
│                         ▼                               │
│              ┌───────────────────┐                      │
│              │  requests.get()   │ ──→ HTML string      │
│              │  (fetch the page) │                      │
│              └───────────────────┘                      │
│                         │                               │
│                         ▼                               │
│              ┌───────────────────┐                      │
│              │  BeautifulSoup    │ ──→ parsed structure │
│              │  (parse HTML)     │                      │
│              └───────────────────┘                      │
│                         │                               │
│                         ▼                               │
│              ┌───────────────────┐                      │
│              │  Extract target   │ ──→ clean data dict  │
│              │  data (prices,    │                      │
│              │  text, links...)  │                      │
│              └───────────────────┘                      │
│                         │                               │
│                         ▼                               │
│              Return to agent: { "prices": [...] }       │
└──────────────────────────────────────────────────────────┘
```

### The Web Scraping Tool

```bash
pip install beautifulsoup4 requests lxml
```

```python
# tools/scraping_tool.py

import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
from typing import Optional
import time

# Respectful scraping constants
DEFAULT_TIMEOUT = 15         # Seconds before giving up
REQUEST_DELAY = 1.0          # Wait 1 second between requests (be polite!)

# Realistic browser headers — many sites block "python-requests/x.x" user agents
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

def scrape_page_text(url: str, max_chars: int = 3000) -> dict:
    """
    Fetches a web page and extracts clean text content.
    
    Args:
        url: The URL to scrape
        max_chars: Max characters to return (prevent overloading LLM context)
    
    Returns:
        Dict with title, text content, and metadata
    """
    
    # Validate URL before making any request
    parsed = urlparse(url)
    if not parsed.scheme in ("http", "https"):
        return {"error": "Invalid URL. Must start with http:// or https://"}
    
    try:
        # Add a small delay to be respectful
        time.sleep(REQUEST_DELAY)
        
        # Fetch the page
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=DEFAULT_TIMEOUT,
            allow_redirects=True      # Follow redirects automatically
        )
        response.raise_for_status()   # Raise on 4xx/5xx
        
        # Check we actually got HTML (not a PDF or image)
        content_type = response.headers.get("Content-Type", "")
        if "text/html" not in content_type:
            return {"error": f"URL returned non-HTML content: {content_type}"}
        
        # Parse with BeautifulSoup (lxml is faster than html.parser)
        soup = BeautifulSoup(response.text, "lxml")
        
        # === CLEAN UP THE HTML ===
        
        # Remove scripts and styles — we want text, not code
        for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
            tag.decompose()   # Completely removes the tag from the tree
        
        # Get the page title
        title = soup.title.string.strip() if soup.title else "No title"
        
        # Extract all text, joining with newlines, collapsing whitespace
        raw_text = soup.get_text(separator="\n", strip=True)
        
        # Clean up excessive blank lines
        lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
        clean_text = "\n".join(lines)
        
        # Truncate to max_chars to protect LLM context window
        if len(clean_text) > max_chars:
            clean_text = clean_text[:max_chars] + "\n\n[... content truncated ...]"
        
        return {
            "url": url,
            "title": title,
            "text": clean_text,
            "char_count": len(clean_text),
            "status_code": response.status_code
        }
    
    except requests.exceptions.Timeout:
        return {"error": f"Request timed out after {DEFAULT_TIMEOUT}s"}
    
    except requests.exceptions.ConnectionError:
        return {"error": "Could not connect. Check if the URL is correct."}
    
    except requests.exceptions.HTTPError as e:
        return {"error": f"HTTP {e.response.status_code}: {e.response.reason}"}
    
    except Exception as e:
        return {"error": f"Scraping failed: {str(e)}"}


def extract_links(url: str, filter_text: str = None) -> dict:
    """
    Extracts all hyperlinks from a page.
    Optionally filter links whose text contains filter_text.
    
    Useful for: navigation, finding documentation links, etc.
    """
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=DEFAULT_TIMEOUT)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "lxml")
        
        links = []
        for a_tag in soup.find_all("a", href=True):
            href = a_tag["href"]
            text = a_tag.get_text(strip=True)
            
            # Convert relative URLs to absolute (e.g., "/docs" → "https://site.com/docs")
            absolute_url = urljoin(url, href)
            
            # Skip anchor links, mailto, javascript
            if not absolute_url.startswith("http"):
                continue
            
            # Apply text filter if provided
            if filter_text and filter_text.lower() not in text.lower():
                continue
            
            links.append({"text": text, "url": absolute_url})
        
        # Deduplicate by URL
        seen_urls = set()
        unique_links = []
        for link in links:
            if link["url"] not in seen_urls:
                seen_urls.add(link["url"])
                unique_links.append(link)
        
        return {
            "source_url": url,
            "link_count": len(unique_links),
            "links": unique_links[:20]   # Limit to 20 links max
        }
    
    except Exception as e:
        return {"error": f"Link extraction failed: {str(e)}"}
```

> ⚠️ **Ethics Check from the Professor:** Always check a site's `robots.txt` before scraping (e.g., `https://example.com/robots.txt`). Many sites prohibit scraping in their Terms of Service. Use official APIs when available. Don't hammer servers — add delays. Be a good internet citizen. Your agent reflects on *you*.

---

## 7. Real Industry Use Case: AI Research Assistant <a name="industry-use-case"></a>

Let's build something that ties it all together. This is the kind of thing that gets funded and shipped.

### The Problem

A startup's product team gets 50+ competitor feature updates, industry articles, and pricing changes every week. It takes 3 hours every Monday morning for someone to compile a "competitive intelligence report."

**We're automating that with an agent.**

### System Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                 COMPETITIVE INTELLIGENCE AGENT                       │
│                                                                      │
│  Input: List of competitor URLs + topics to track                   │
│                                                                      │
│  Tools:                                                              │
│    1. scrape_page_text()      → get competitor page content         │
│    2. extract_links()         → find changelog/blog links           │
│    3. query_orders()          → pull our own sales data for context │
│    4. get_weather() (joke)    → kidding (but we could!)             │
│                                                                      │
│  Output: Structured markdown report saved to DB                     │
└─────────────────────────────────────────────────────────────────────┘

EXECUTION FLOW:

User
 │
 ▼
Agent receives task: "Research competitors: Stripe, Paddle"
 │
 ├──→ [Tool: scrape_page_text] https://stripe.com/pricing
 │         └──→ Extract pricing tiers, new features
 │
 ├──→ [Tool: scrape_page_text] https://paddle.com/pricing  
 │         └──→ Extract pricing, compare
 │
 ├──→ [Tool: extract_links] https://stripe.com/blog
 │         └──→ Find recent blog posts
 │
 ├──→ [Tool: scrape_page_text] https://stripe.com/blog/recent-post
 │         └──→ Summarize the post
 │
 ├──→ [Tool: get_order_stats]
 │         └──→ Our revenue context for the report
 │
 └──→ Generate final Markdown report
```

### The Full Agent

```python
# competitive_intelligence_agent.py

import json
import os
import openai
from datetime import datetime

# Import all our tools
from tools.scraping_tool import scrape_page_text, extract_links
from tools.database_tool import query_orders, get_order_stats

# =============================================
# TOOL DEFINITIONS (what the LLM sees)
# =============================================

ALL_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "scrape_page_text",
            "description": (
                "Fetch and extract readable text from a web page URL. "
                "Use for reading competitor pricing pages, blog posts, "
                "product announcements, or any public web content."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "Full URL to scrape (must start with https://)"
                    },
                    "max_chars": {
                        "type": "integer",
                        "description": "Max characters to extract. Default 3000."
                    }
                },
                "required": ["url"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "extract_links",
            "description": (
                "Extract all hyperlinks from a web page. "
                "Use to find blog post links, changelog entries, "
                "or navigation to explore further pages."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "url": {"type": "string", "description": "URL to extract links from"},
                    "filter_text": {
                        "type": "string",
                        "description": "Optional: only return links whose text contains this string"
                    }
                },
                "required": ["url"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_order_stats",
            "description": "Get our company's order summary statistics for context in the report.",
            "parameters": {"type": "object", "properties": {}, "required": []}
        }
    }
]

# =============================================
# TOOL REGISTRY
# =============================================

TOOL_REGISTRY = {
    "scrape_page_text": scrape_page_text,
    "extract_links": extract_links,
    "get_order_stats": get_order_stats,
}

# =============================================
# THE AGENT
# =============================================

def run_competitive_intelligence_agent(competitors: list[str]) -> str:
    """
    Run the competitive intelligence agent.
    
    Args:
        competitors: List of competitor names with their base URLs
                     e.g., [{"name": "Stripe", "url": "https://stripe.com"}]
    
    Returns:
        A formatted competitive intelligence report as markdown
    """
    
    client = openai.OpenAI()
    
    # Build the task prompt
    competitor_list = "\n".join([f"- {c['name']}: {c['url']}" for c in competitors])
    
    task_prompt = f"""
    You are a competitive intelligence analyst. Your task is to research the following competitors
    and compile a report:
    
    {competitor_list}
    
    For each competitor, please:
    1. Scrape their pricing page to understand their pricing model
    2. Find and read at least one recent blog post or announcement
    3. Note any interesting features, pricing changes, or positioning
    
    Also retrieve our own order statistics to contextualize the competitive landscape.
    
    Finally, compile everything into a well-structured Markdown report with:
    - Executive Summary
    - Competitor Profiles (pricing, features, recent news)
    - Our Position (based on order stats)
    - Recommendations
    
    Today's date: {datetime.now().strftime("%B %d, %Y")}
    """
    
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert competitive intelligence analyst. "
                "Be thorough but concise. Always cite sources (URLs) in your report. "
                "Use the tools available to gather real data before writing the report."
            )
        },
        {
            "role": "user",
            "content": task_prompt
        }
    ]
    
    step_count = 0
    max_steps = 15   # Safety limit — prevent runaway agents
    
    print("[Agent] Starting competitive intelligence research...")
    print("=" * 60)
    
    while step_count < max_steps:
        step_count += 1
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=ALL_TOOLS,
            tool_choice="auto",
            max_tokens=4096   # Allow longer outputs for report generation
        )
        
        assistant_message = response.choices[0].message
        finish_reason = response.choices[0].finish_reason
        
        if assistant_message.tool_calls:
            # Agent wants to use tools
            messages.append(assistant_message)
            
            for tool_call in assistant_message.tool_calls:
                tool_name = tool_call.function.name
                tool_args = json.loads(tool_call.function.arguments)
                
                print(f"\n[Step {step_count}] Tool: {tool_name}")
                print(f"          Args: {json.dumps(tool_args, indent=2)}")
                
                # Execute the tool
                if tool_name in TOOL_REGISTRY:
                    result = TOOL_REGISTRY[tool_name](**tool_args)
                else:
                    result = {"error": f"Unknown tool: {tool_name}"}
                
                # Log a preview of the result
                result_preview = str(result)[:200]
                print(f"          Result: {result_preview}...")
                
                # Add result to conversation
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(result)
                })
        
        elif finish_reason == "stop":
            # Agent is done — extract the final report
            final_report = assistant_message.content
            print("\n" + "=" * 60)
            print("[Agent] Research complete! Report generated.")
            return final_report
        
        else:
            # Unexpected finish reason
            print(f"[Agent] Unexpected finish reason: {finish_reason}")
            break
    
    return "Error: Agent exceeded maximum steps without completing the report."


# === RUN IT ===

if __name__ == "__main__":
    competitors_to_research = [
        {"name": "Stripe",  "url": "https://stripe.com"},
        {"name": "Paddle",  "url": "https://paddle.com"},
    ]
    
    report = run_competitive_intelligence_agent(competitors_to_research)
    
    # Save the report
    filename = f"competitive_report_{datetime.now().strftime('%Y%m%d')}.md"
    with open(filename, "w") as f:
        f.write(report)
    
    print(f"\n✅ Report saved to: {filename}")
    print("\n--- REPORT PREVIEW ---")
    print(report[:1000] + "...")
```

### Sample Output Structure

```markdown
# Competitive Intelligence Report
**Date:** January 15, 2025

## Executive Summary
Analysis of 2 competitors reveals Stripe maintains pricing dominance
while Paddle targets EU-compliant merchants with MoR model...

## Competitor Profiles

### Stripe
**Pricing (scraped from stripe.com/pricing):**
- Standard: 2.9% + 30¢ per transaction
- Custom enterprise pricing available
...

### Paddle
**Pricing (scraped from paddle.com/pricing):**
- Merchant of Record model: 5% + 50¢
- Handles tax compliance automatically
...

## Our Position
Based on current order data:
- Total Revenue: $16,050
- Average Order: $2,293
- 57% completion rate

## Recommendations
1. Position against Paddle's MoR model for EU customers
2. Highlight our lower transaction fees vs Stripe for high-volume merchants
```

> 🧠 **Professor's Note:** In a real company, this agent runs every Monday at 7 AM on a cron job. The report gets posted to Slack automatically. Three hours of manual work → zero hours. **That's the business value of agents.**

---

## 8. Putting It All Together <a name="putting-together"></a>

Here's the complete tool-augmented agent architecture we've built:

```
┌─────────────────────────────────────────────────────────────────┐
│                  COMPLETE AGENT STACK                            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   USER INTERFACE                         │    │
│  │     (CLI / Web App / Slack Bot / Cron Job)              │    │
│  └──────────────────────────┬──────────────────────────────┘    │
│                             │                                    │
│  ┌──────────────────────────▼──────────────────────────────┐    │
│  │                    AGENT CORE                            │    │
│  │                                                          │    │
│  │  • System Prompt (persona, constraints)                  │    │
│  │  • Conversation History (short-term memory)              │    │
│  │  • LLM (GPT-4o / Claude / Gemini)                       │    │
│  │  • Tool Selection Logic (auto / forced)                  │    │
│  │  • Safety Limits (max_steps, timeouts)                   │    │
│  └──────────────────────────┬──────────────────────────────┘    │
│                             │                                    │
│  ┌──────────────────────────▼──────────────────────────────┐    │
│  │                   TOOL REGISTRY                          │    │
│  │                                                          │    │
│  │   "get_weather"      → get_weather()                    │    │
│  │   "scrape_page_text" → scrape_page_text()               │    │
│  │   "extract_links"    → extract_links()                  │    │
│  │   "query_orders"     → query_orders()                   │    │
│  │   "get_order_stats"  → get_order_stats()                │    │
│  │   "get_repo_info"    → github_tool.get_repo_info()      │    │
│  └──────────┬──────────────┬───────────────┬──────────────┘    │
│             │              │               │                    │
│      ┌──────▼──┐    ┌──────▼──┐    ┌──────▼─────┐             │
│      │  APIs   │    │  SQLite │    │    Web      │             │
│      │ GitHub  │    │  /Postgres    │   Pages     │             │
│      │ Weather │    │  /MongoDB│    │ (scraped)   │             │
│      └─────────┘    └─────────┘    └────────────┘             │
└─────────────────────────────────────────────────────────────────┘

KEY PRINCIPLES:
  ✅ LLM decides WHAT to do (not hardcoded logic)
  ✅ Tools are pure Python functions (testable, replaceable)
  ✅ All external calls have timeouts and error handling
  ✅ Safety limits prevent runaway agents
  ✅ Results are structured dicts (not raw strings)
  ✅ Tool outputs are truncated to protect context window
```

### Project Structure (Production-Ready)

```
my_agent/
│
├── agent.py                    # Main agent loop
├── tools/
│   ├── __init__.py
│   ├── weather_tool.py         # Weather API
│   ├── database_tool.py        # DB queries
│   ├── scraping_tool.py        # Web scraping
│   └── github_tool.py          # GitHub API
│
├── tool_schemas/
│   ├── __init__.py
│   └── all_schemas.py          # All tool JSON schemas
│
├── config.py                   # API keys, settings (from env vars!)
├── requirements.txt
└── tests/
    ├── test_weather_tool.py
    ├── test_database_tool.py
    └── test_scraping_tool.py
```

> 🧠 **Professor's Note:** Keep tool implementations separate from schemas. Keep schemas separate from the agent loop. Future-you — or your teammates — will thank you when you need to swap GPT-4o for Claude 4 in `agent.py` without touching the tools.

---

## 9. Chapter Quiz 🧪 <a name="quiz"></a>

Time to earn your credits. No peeking at the code above. *(Or do — this isn't a real exam.)*

---

### 🟢 Easy (Conceptual)

**Q1.** In function calling, which entity *actually executes* the tool function?

- A) The LLM
- B) OpenAI's servers
- C) Your Python code
- D) The user's browser

> **Answer: C** — The LLM only *requests* a tool call. Your code dispatches it. The LLM is a planner, not an executor.

---

**Q2.** Why should you use parameterized queries instead of f-string SQL interpolation in your database tool?

> **Answer:** SQL injection. If the LLM generates `user_input = "'; DROP TABLE orders; --"` and you use an f-string, you've just wiped your database. Parameterized queries treat all values as data, never as SQL syntax.

---

**Q3.** What does `conn.row_factory = sqlite3.Row` do?

- A) Makes the DB read-only
- B) Allows accessing columns by name instead of index
- C) Speeds up queries by 10x
- D) Enables foreign key constraints

> **Answer: B** — Without it, `row[0]` instead of the nicer `row["customer_name"]`. Always set it.

---

### 🟡 Medium (Code)

**Q4.** What's wrong with this tool schema?

```python
{
    "type": "function",
    "function": {
        "name": "search_products",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string"}
            }
        }
    }
}
```

> **Answer:** Missing `"description"` field in the function object! The LLM reads the description to decide *when* to use the tool. Without it, the LLM won't know what this tool does and will likely never use it — or use it at the wrong time.

---

**Q5.** Your agent loop has been running for 45 iterations on a simple task. What likely went wrong, and how would you prevent it?

> **Answer:** The agent is stuck in a loop — likely because a tool keeps returning errors and the agent keeps retrying, or because the task is ambiguous and the agent can't decide it's done. Prevention: set a `max_steps` limit (e.g., 15-20), add exponential backoff on repeated tool failures, and ensure your system prompt tells the agent to give a "best effort" answer if it can't resolve something after a few tries.

---

**Q6.** Write the tool registry line that registers a function called `search_docs(query, max_results)` under the key `"search_documentation"`.

> **Answer:**
> ```python
> TOOL_REGISTRY = {
>     "search_documentation": search_docs,
>     # Note: the key matches the "name" in the tool schema
>     # Python maps name → function, args are passed with **kwargs
> }
> ```

---

### 🔴 Hard (System Design)

**Q7.** You're building a financial agent that can read stock prices (via API), query your internal portfolio database, and send trade orders to a broker API. Describe TWO specific safety measures you would implement at the tool layer (not the LLM layer).

> **Answer (sample):**
>
> **1. Read/Write Separation:** Split tools into read-only (get_stock_price, query_portfolio) and write tools (submit_order). Require a separate confirmation step (human-in-the-loop or a secondary validation function) before any write tool executes. The agent literally cannot call `submit_order` directly in the same loop without a confirmation token.
>
> **2. Rate Limiting + Dollar Limits:** Wrap the broker API tool with a rate limiter (max N calls/minute) and enforce max order size in the tool function itself — not relying on the LLM to self-limit. If `amount > MAX_TRADE_LIMIT`, return `{"error": "Order exceeds single-trade limit. Requires manual approval."}`. The safety guarantee comes from code, not from prompt instructions.

---

**Q8.** Your web scraping tool works great in development but starts failing in production because 60% of target sites now use JavaScript-rendered content (React/Vue SPAs). What's your solution?

> **Answer:** Switch from `requests + BeautifulSoup` to a **headless browser** like **Playwright** or **Selenium**. These tools spawn a real Chromium instance that runs JavaScript before extracting the HTML. Example with Playwright:
>
> ```python
> from playwright.async_api import async_playwright
>
> async def scrape_spa(url: str) -> dict:
>     async with async_playwright() as p:
>         browser = await p.chromium.launch()
>         page = await browser.new_page()
>         await page.goto(url, wait_until="networkidle")  # Wait for JS
>         content = await page.content()                   # Now has rendered HTML
>         await browser.close()
>         # Parse content with BeautifulSoup as before
>         ...
> ```
> Trade-off: much slower (2-5s vs 0.3s) and more resource-intensive. Use selectively.

---

**Scoring:**
- 7-8 correct → You're ready for Chapter 4 🏆
- 5-6 correct → Re-read the code sections, you're close! 💪
- < 5 correct → Go through the code examples hands-on. Reading isn't enough. 📚

---

## 10. Chapter 4 Preview 🔭 <a name="preview"></a>

---

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        COMING UP: CHAPTER 4                                 ║
║                                                              ║
║    "Memory Systems — How Agents Remember"                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

We've given agents **hands** (tools). Now we give them a **brain** that actually *remembers*.

In Chapter 4, we'll cover:

**📌 The Four Types of Agent Memory**
- In-context (conversation history) — what we've been using
- Episodic (event logs — "I did this last Tuesday")
- Semantic (facts and knowledge — vector embeddings!)
- Procedural (skill memory — how to do things)

**🔢 Vector Databases — The Secret Sauce**
You'll build a semantic memory system using **ChromaDB** or **Pinecone** that lets an agent recall relevant past experiences based on *meaning*, not keyword matching.

```python
# Sneak peek at what's coming...

memory.store("User prefers dark mode and Python code examples")
memory.store("User's company uses PostgreSQL, not MongoDB")

# Later, in a new session:
relevant_memories = memory.recall("How should I format this tutorial?")
# Returns: ["User prefers dark mode and Python code examples"]
# Magic? No — cosine similarity on embeddings. We'll build this!
```

**🔄 Memory in the Agent Loop**
How to inject the right memories at the right time without overloading the context window. (Hint: it's all about retrieval strategy.)

**📦 Practical: Build a Personal AI Assistant**
That actually remembers your preferences, past conversations, and working style. No more re-explaining yourself every session.

---

> *"Memory is what separates a clever chatbot from a true assistant."*
>
> See you in Chapter 4. Now go run some of this code. Seriously. The chapter will hit differently after you've seen a real agent loop in your terminal. 🖥️

---

*Chapter 3 Complete ✅ | Word count: ~4,800 | Code lines: ~400+ | Diagrams: 6*

---
*© AI Agents Masterclass — Professor Mode Edition*