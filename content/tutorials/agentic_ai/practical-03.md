
```python
"""
================================================================================
 PROFESSOR'S GUIDE: THE ULTIMATE PRODUCTION-READY MAGIC DICE AGENT
================================================================================
Hello, young inventor! Today we are upgrading our "Magic Dice Robot" into a
"Professional Robot Service." 

Imagine our robot isn't just a toy anymore—it's now a professional worker who 
needs to be super reliable, never crash, and remember everything you say!

We are adding 8 "Superpowers" to make it Production-Ready:
1. 🔧 CONFIG BOX -> Put all settings in one safe place.
2. 📝 MAGIC LOGBOOK -> Record everything that happens in a file.
3. 🏷️ NAME TAGS (Type Hints) -> Tell Python exactly what kind of data we use.
4. 🛑 SAFETY CHECK -> Make sure we don't do impossible things (like roll a 0-sided dice).
5. 🔄 TRY AGAIN (Retries) -> If the robot's brain gets a headache, try again!
6. 🗄️ TOOL BOX (Registry) -> Keep all our robot's hands organized.
7. 🧠 LONG-TERM MEMORY -> Remember the whole conversation, not just the last word.
8. 📦 NEAT PACKAGING (Structured Output) -> Give back answers in a neat box.

Let's build this professional robot together!
================================================================================
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------

import json                          # A translator to read robot messages
import logging                       # A diary to write down everything that happens
import time                          # A clock to help the robot wait or retry
import random                        # A machine that picks random numbers (the dice!)
from dataclasses import dataclass    # A tool to make neat "Config Boxes"
from typing import Any, Callable     # Name tags to label our data (like "this is a number")
from openai import OpenAI            # The telephone we use to talk to the AI brain
from openai import APIConnectionError, APITimeoutError # Special labels for when the phone line is busy


# ============================================================
# SECTION 2: THE MAGIC LOGBOOK (Logging) [UPGRADE 2]
# ============================================================
# Instead of just shouting (print), we write in a logbook.
# This way, if the robot breaks at 3 AM, we can read the book to see why!

logging.basicConfig(
    level=logging.INFO,                                  # Only write important things
    format="%(asctime)s | %(levelname)-8s | %(message)s", # Format: Time | Importance | Message
    datefmt="%Y-%m-%d %H:%M:%S",                         # How to write the time
    handlers=[
        logging.StreamHandler(),                         # Show on the screen
        logging.FileHandler("magic_dice_agent.log")      # Save in a file called magic_dice_agent.log
    ]
)
logger = logging.getLogger("DiceAgent")                  # Give our logbook a name


# ============================================================
# SECTION 3: THE CONFIG BOX (Configuration) [UPGRADE 1]
# ============================================================
# We put all our settings in one box. If we want a different robot,
# we just change the label on the box!

@dataclass
class DiceConfig:
    """A safe box to keep all our robot's settings."""
    model_name: str = "llama3.2"                         # The name of the robot brain
    api_base_url: str = "http://localhost:11434/v1"      # The robot's phone number
    api_key: str = "ollama"                              # The secret password for the phone

    max_retries: int = 3                                 # [UPGRADE 5] If phone fails, try 3 times
    retry_delay: float = 2.0                             # Wait 2 seconds between phone calls

    # Safety limits for our dice! [UPGRADE 4]
    max_dice_sides: int = 1000                           # No dice bigger than 1000 sides!
    min_dice_sides: int = 2                              # A dice must have at least 2 sides.


# We create one config box to use
config = DiceConfig()


# ============================================================
# SECTION 4: THE ROBOT'S HANDS (Tools) [UPGRADE 3 & 4]
# ============================================================

def roll_dice(sides: int) -> dict[str, Any]:
    """
    This is the robot's hand that rolls a dice.
    - We use name tags (: int) to say 'sides' must be a whole number.
    - We return a neat package (dict) with the result.
    """
    logger.info(f"Hand is reaching out to roll a {sides}-sided dice...")

    # --- SAFETY CHECK --- [UPGRADE 4]
    # We check if the number is silly before we roll!
    try:
        sides = int(sides)                               # Make sure it's a whole number
    except (ValueError, TypeError):
        return {"success": False, "error": "I need a whole number for the sides!"}

    if not (config.min_dice_sides <= sides <= config.max_dice_sides):
        err = f"A dice must have between {config.min_dice_sides} and {config.max_dice_sides} sides!"
        logger.warning(f"Safety check failed: {err}")
        return {"success": False, "error": err}

    # --- THE ROLL ---
    result = random.randint(1, sides)                    # Pick a random number!
    logger.info(f"The dice landed on: {result}")

    # Return the package
    return {
        "success": True,
        "sides": sides,
        "result": result,
        "message": f"I rolled a {sides}-sided dice and got a {result}!"
    }


# ============================================================
# SECTION 5: THE TOOL BOX (Registry) [UPGRADE 6]
# ============================================================
# We put our robot's hands in a labeled drawer so it can find them fast!

TOOL_REGISTRY: dict[str, Callable] = {
    "roll_dice": roll_dice                               # Map the name "roll_dice" to our function
}

# The instruction manual for the robot brain (in its secret language)
TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "roll_dice",
            "description": "Rolls a magical dice with a specific number of sides.",
            "parameters": {
                "type": "object",
                "properties": {
                    "sides": {
                        "type": "integer",
                        "description": "How many sides the dice has (like 6, 20, or 100)."
                    }
                },
                "required": ["sides"]
            }
        }
    }
]


# ============================================================
# SECTION 6: THE SMART ROBOT CLASS (The Brain)
# ============================================================

class MagicDiceAgent:
    """
    A professional robot that knows how to roll dice and talk.
    It remembers what you said and never gives up!
    """

    def __init__(self, config: DiceConfig = DiceConfig()):
        """Setting up the robot for the first time."""
        self.config = config                             # Give it the config box
        self.memory: list[dict] = []                     # [UPGRADE 7] The robot's diary (memory)
        self.client = OpenAI(                            # Pick up the magic telephone
            base_url=self.config.api_base_url,
            api_key=self.config.api_key
        )
        logger.info("Professional Magic Dice Agent is awake!")

    def _call_brain_with_retry(self, messages: list[dict]) -> Any:
        """
        Calls the robot brain over the phone.
        If the line is busy, it tries again! [UPGRADE 5]
        """
        for attempt in range(1, self.config.max_retries + 1):
            try:
                # Call the brain
                return self.client.chat.completions.create(
                    model=self.config.model_name,
                    messages=messages,
                    tools=TOOLS_SCHEMA
                )
            except (APIConnectionError, APITimeoutError) as e:
                # Phone line failed!
                logger.warning(f"Phone line busy (Attempt {attempt}). Waiting...")
                if attempt < self.config.max_retries:
                    time.sleep(self.config.retry_delay) # Wait before trying again
                else:
                    raise                                # Too many failures, give up!

    def chat(self, user_text: str) -> dict[str, Any]:
        """
        The main way to talk to the robot.
        1. Write your question in the diary.
        2. Ask the brain what to do.
        3. Use hands if the brain asks.
        4. Give back the final answer in a neat box. [UPGRADE 8]
        """
        logger.info(f"User asked: {user_text}")

        # Write the question in the diary [UPGRADE 7]
        self.memory.append({"role": "user", "content": user_text})

        try:
            # Let's talk to the brain!
            response = self._call_brain_with_retry(self.memory)
            ai_message = response.choices[0].message

            # Did the brain ask to use its hands?
            if ai_message.tool_calls:
                logger.info("Brain wants to use its dice-rolling hand!")

                # Add brain's request to diary
                self.memory.append(ai_message)

                # Use the hands!
                for tool_call in ai_message.tool_calls:
                    name = tool_call.function.name
                    args = json.loads(tool_call.function.arguments)

                    # [UPGRADE 6] Look in the drawer for the right tool
                    if name in TOOL_REGISTRY:
                        result = TOOL_REGISTRY[name](**args)
                    else:
                        result = {"success": False, "error": "I don't know that hand!"}

                    # Write the result in the diary
                    self.memory.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": json.dumps(result)
                    })

                # Talk to the brain AGAIN now that we have the dice number!
                final_response = self._call_brain_with_retry(self.memory)
                final_text = final_response.choices[0].message.content
            else:
                # Brain just talked back normally
                final_text = ai_message.content

            # Add final answer to diary so the robot remembers it
            self.memory.append({"role": "assistant", "content": final_text})

            # Return the final package [UPGRADE 8]
            return {
                "success": True,
                "answer": final_text,
                "error": None
            }

        except Exception as e:
            logger.error(f"Something went wrong: {e}")
            return {"success": False, "answer": "I'm sorry, I have a headache!", "error": str(e)}

    def clear_memory(self):
        """Erase the diary to start a fresh game!"""
        self.memory = []
        logger.info("Robot erased its diary!")


# ============================================================
# SECTION 7: RUN THE ROBOT!
# ============================================================

if __name__ == "__main__":
    print("✨ Welcome to the Professional Magic Dice Robot! ✨")
    print("(Type 'exit' to quit, 'reset' to clear memory)\n")

    # Create our robot brain
    agent = MagicDiceAgent()

    while True:
        user_input = input("You: ").strip()

        if user_input.lower() == "exit":
            print("Goodbye, inventor!")
            break
        elif user_input.lower() == "reset":
            agent.clear_memory()
            print("Memory cleared!")
            continue
        elif not user_input:
            continue

        # Talk to the robot
        response = agent.chat(user_input)

        if response["success"]:
            print(f"\nRobot: {response['answer']}\n")
        else:
            print(f"\nRobot Error: {response['error']}\n")
```

---

## [5] Understanding the Output (The "Neat Package")

After the script runs, look at the bottom of your screen. You will see the robot's final answer:

```
You: I have a $120 bill and four friends. Let's tip 18%. What should each person pay?

Robot: I will calculate the tip and split the bill...

   [TOOL 1 RUNNING] Calculating 18% tip on $120 bill...

   [TOOL 2 RUNNING] Splitting $141.60 among 4 people...

Robot: Each person pays $35.40 when splitting $141.60 among 4 people.
```

### What Just Happened?
1. **Input:** You gave the robot a math problem: `$120 bill, 18% tip, 4 people`.
2. **Tool 1:** The robot used its `calculate_tip` tool. It calculated: **$21.60 tip** and **$141.60 total**.
3. **Tool 2:** The robot used its `split_bill` tool. It divided $141.60 by 4, which equals **$35.40 per person**.

### The "Neat Package" (Structured Output)

In the "Production-Grade" version, the robot doesn't just spit out a sentence. It returns a clean **Python dictionary** (a data structure).

Look at the `result` variable inside the `calculate_tip` function (Line 140 in the code):

```python
return {
    "success": True,
    "tip_amount": tip_amount,
    "total_amount": total_with_tip,
    "message": f"Tip amount: ${tip_amount:.2f}. Total bill including tip: ${total_with_tip:.2f}."
}
```

This is a "neat package" because it contains:
- **success**: `True` (Did it work? Yes!)
- **tip_amount**: `21.60` (The exact number for the tip)
- **total_amount**: `141.60` (The exact number for the total)
- **message**: A nice sentence to show the user

**Why is this important?**
If you were building a real app (like a website or a phone app), you wouldn't want to read a messy sentence. You would want to grab those exact numbers (`21.60` and `141.60`) and display them nicely on your screen.

That's what "production-grade" means: **Neat, organized, and ready for other software to use!**

---





```python
"""
================================================================================
 PRODUCTION-GRADE SMART RESTAURANT AGENT
================================================================================
 WHAT MAKES THIS PRODUCTION READY?
 ----------------------------------
 A "script" runs once and dies. A "production agent" is a reliable service
 that can run 24/7 and handle real users. Here are the 8 upgrades we made:

 [1] CONFIGURATION   -> Settings in one place (no more "magic numbers" in code)
 [2] LOGGING         -> Professional logs instead of print() (searchable, saveable)
 [3] TYPE HINTS      -> Every function declares what type of data it expects
 [4] INPUT VALIDATION -> Reject bad/dangerous inputs BEFORE they reach the AI
 [5] RETRY LOGIC     -> If the API fails, automatically try again (3 times)
 [6] TOOL REGISTRY   -> A "dictionary" of tools instead of a messy if/elif chain
 [7] SESSION MEMORY  -> Multi-turn chat (remembers the whole conversation)
 [8] STRUCTURED OUTPUT -> Returns a clean Python dict, not just a string

 REAL-WORLD CONNECTION:
 This is the pattern used by ChatGPT plugins, Slack bots, and enterprise 
 AI assistants. You can deploy this as a REST API with 10 more lines of code.
================================================================================
"""

# ============================================================
# SECTION 1: IMPORTS
# ============================================================
# These are the "toolboxes" we're bringing in.

import json                          # Parse JSON from the AI's tool calls
import logging                       # [UPGRADE 2] Professional logging system
import time                          # For retry delays and timing
from dataclasses import dataclass, field  # [UPGRADE 1] For the Config class
from typing import Any, Callable         # [UPGRADE 3] Type hints
from openai import OpenAI                # The AI connector
from openai import APIConnectionError, APITimeoutError  # [UPGRADE 5] Error types


# ============================================================
# SECTION 2: LOGGING SETUP  [UPGRADE 2 - LOGGING]
# ============================================================
# WHY: print() disappears when the program closes. A logger saves every
# event to a file AND the screen — with timestamps and severity levels.
# Production systems live or die by their logs.

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.StreamHandler(),                    # Prints to screen
        logging.FileHandler("restaurant_agent.log") # Saves to a file!
    ]
)
logger = logging.getLogger("RestaurantAgent")


# ============================================================
# SECTION 3: CONFIGURATION  [UPGRADE 1 - CONFIGURATION]
# ============================================================
# WHY: Hard-coding values like "llama3.2" or "http://localhost:11434"
# directly in the code is dangerous. When you need to change them,
# you have to hunt through hundreds of lines. A Config class puts
# ALL settings in ONE place.

@dataclass
class AgentConfig:
    """
    All configuration for the agent lives here.
    In production, these would be loaded from environment variables or
    a config file (.env, config.yaml) so secrets never touch the code.
    """
    # AI Model Settings
    model_name: str = "llama3.2"
    api_base_url: str = "http://localhost:11434/v1"
    api_key: str = "ollama"

    # Behavior Settings
    max_tool_iterations: int = 5       # Stop infinite loops! Max tool calls per request
    max_retries: int = 3               # [UPGRADE 5] How many times to retry on API failure
    retry_delay_seconds: float = 2.0   # How long to wait between retries

    # Validation Limits (SECURITY!)
    max_bill_amount: float = 100_000.0   # Max bill: $100,000
    min_bill_amount: float = 0.01        # Min bill: 1 cent
    max_tip_percentage: float = 100.0    # No tip > 100%
    min_tip_percentage: float = 0.0      # No negative tips
    max_people: int = 1000               # Max group size: 1,000
    min_people: int = 1                  # At least 1 person


# Create a single config instance used throughout the app
config = AgentConfig()


# ============================================================
# SECTION 4: TOOL FUNCTIONS  [UPGRADE 3 - TYPE HINTS]
# ============================================================
# UPGRADE FROM BEGINNER VERSION:
# - Added type hints (the `: float` and `-> dict` annotations)
# - Tools now return STRUCTURED DICTS, not just strings
# - Each tool validates its own inputs

def calculate_tip(bill_amount: float, tip_percentage: float) -> dict[str, Any]:
    """
    Calculates the tip amount and the total bill.

    PRODUCTION CHANGES FROM BEGINNER VERSION:
    - Returns a DICT (structured data) instead of a raw string.
      This lets other systems read specific values like result["tip_amount"].
    - Validates that inputs are within reasonable real-world limits.

    Args:
        bill_amount:    The restaurant bill in dollars before tip.
        tip_percentage: The tip percentage (e.g., 18.0 for 18%).

    Returns:
        A dict with keys: success, tip_amount, total_amount, message, error
    """
    logger.info(f"[TOOL: calculate_tip] Inputs -> bill=${bill_amount}, tip={tip_percentage}%")

    # --- INPUT VALIDATION ---  [UPGRADE 4]
    # Validate BEFORE doing any math. Reject impossible values immediately.
    try:
        bill_amount = float(bill_amount)
        tip_percentage = float(tip_percentage)
    except (ValueError, TypeError) as e:
        logger.warning(f"[TOOL: calculate_tip] Invalid input types: {e}")
        return {"success": False, "error": "Bill amount and tip must be numbers.", "tip_amount": 0, "total_amount": 0}

    if not (config.min_bill_amount <= bill_amount <= config.max_bill_amount):
        err = f"Bill must be between ${config.min_bill_amount} and ${config.max_bill_amount:,}."
        logger.warning(f"[TOOL: calculate_tip] Validation failed: {err}")
        return {"success": False, "error": err, "tip_amount": 0, "total_amount": 0}

    if not (config.min_tip_percentage <= tip_percentage <= config.max_tip_percentage):
        err = f"Tip must be between {config.min_tip_percentage}% and {config.max_tip_percentage}%."
        logger.warning(f"[TOOL: calculate_tip] Validation failed: {err}")
        return {"success": False, "error": err, "tip_amount": 0, "total_amount": 0}

    # --- CALCULATION ---
    tip_amount = round(bill_amount * (tip_percentage / 100), 2)
    total_with_tip = round(bill_amount + tip_amount, 2)

    logger.info(f"[TOOL: calculate_tip] Result -> tip=${tip_amount}, total=${total_with_tip}")

    # Return STRUCTURED data — any system can read specific fields
    return {
        "success": True,
        "bill_amount": bill_amount,
        "tip_percentage": tip_percentage,
        "tip_amount": tip_amount,
        "total_amount": total_with_tip,
        "message": f"Tip is ${tip_amount:.2f}. Total with tip: ${total_with_tip:.2f}."
    }


def split_bill(total_amount: float, number_of_people: int) -> dict[str, Any]:
    """
    Splits a total bill equally among a group of people.

    Args:
        total_amount:     The final total to be split.
        number_of_people: The number of people sharing the bill.

    Returns:
        A dict with keys: success, amount_per_person, message, error
    """
    logger.info(f"[TOOL: split_bill] Inputs -> total=${total_amount}, people={number_of_people}")

    # --- INPUT VALIDATION ---  [UPGRADE 4]
    try:
        total_amount = float(total_amount)
        number_of_people = int(number_of_people)
    except (ValueError, TypeError) as e:
        logger.warning(f"[TOOL: split_bill] Invalid input types: {e}")
        return {"success": False, "error": "Total and number of people must be numbers.", "amount_per_person": 0}

    if total_amount <= 0:
        return {"success": False, "error": "Total amount must be positive.", "amount_per_person": 0}

    if not (config.min_people <= number_of_people <= config.max_people):
        err = f"Number of people must be between {config.min_people} and {config.max_people}."
        logger.warning(f"[TOOL: split_bill] Validation failed: {err}")
        return {"success": False, "error": err, "amount_per_person": 0}

    # --- CALCULATION ---
    each_person_pays = round(total_amount / number_of_people, 2)

    logger.info(f"[TOOL: split_bill] Result -> each person pays ${each_person_pays}")

    return {
        "success": True,
        "total_amount": total_amount,
        "number_of_people": number_of_people,
        "amount_per_person": each_person_pays,
        "message": f"Each of {number_of_people} people pays ${each_person_pays:.2f}."
    }


# ============================================================
# SECTION 5: TOOL REGISTRY  [UPGRADE 6 - TOOL REGISTRY]
# ============================================================
# WHY: In the beginner version, we used `if/elif` to match tool names.
# When you have 50+ tools, that becomes unmanageable.
#
# A TOOL REGISTRY is a dictionary that maps names to functions.
# To add a new tool, just add ONE line here. That's it.
#
# PATTERN: { "tool_name": callable_function }

TOOL_REGISTRY: dict[str, Callable] = {
    "calculate_tip": calculate_tip,
    "split_bill": split_bill,
}

# The JSON "manual" the AI reads to know about its tools
TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "calculate_tip",
            "description": "Calculates the tip amount and new total for a restaurant bill.",
            "parameters": {
                "type": "object",
                "properties": {
                    "bill_amount": {
                        "type": "number",
                        "description": "The restaurant bill in dollars before tip (e.g., 120.00)."
                    },
                    "tip_percentage": {
                        "type": "number",
                        "description": "The tip percentage to apply (e.g., 18 for 18%)."
                    }
                },
                "required": ["bill_amount", "tip_percentage"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "split_bill",
            "description": "Splits a total bill evenly among a group of people.",
            "parameters": {
                "type": "object",
                "properties": {
                    "total_amount": {
                        "type": "number",
                        "description": "The final total amount to be split among the group."
                    },
                    "number_of_people": {
                        "type": "integer",
                        "description": "The number of people sharing the bill."
                    }
                },
                "required": ["total_amount", "number_of_people"]
            }
        }
    }
]


# ============================================================
# SECTION 6: THE CORE AGENT CLASS  [ALL UPGRADES COMBINED]
# ============================================================
# WHY A CLASS? In production, you run ONE agent and make MANY requests.
# A class stores the AI client, config, and conversation history
# so they persist across multiple calls without being re-created.

class RestaurantAgent:
    """
    A production-grade restaurant billing AI agent.

    CAPABILITIES:
    - Calculates tips and splits bills using AI-selected tools
    - Maintains conversation memory across multiple turns  [UPGRADE 7]
    - Retries automatically on API failures                [UPGRADE 5]
    - Returns structured responses for easy integration    [UPGRADE 8]
    - Logs every event for debugging and auditing          [UPGRADE 2]
    """

    def __init__(self, config: AgentConfig = AgentConfig()):
        """Initialize the agent with a config and establish AI connection."""
        self.config = config
        self.conversation_history: list[dict] = []   # [UPGRADE 7] Session memory
        self.session_stats = {                        # [UPGRADE 8] Metrics tracking
            "total_requests": 0,
            "total_tool_calls": 0,
            "successful_requests": 0,
            "failed_requests": 0,
        }

        # Initialize the AI client
        self.client = OpenAI(
            base_url=self.config.api_base_url,
            api_key=self.config.api_key
        )
        logger.info(f"RestaurantAgent initialized | model={self.config.model_name}")
        self._verify_connection()

    def _verify_connection(self) -> None:
        """
        Verify the AI server is reachable at startup.
        WHY: Fail FAST. Know immediately if Ollama isn't running
        instead of crashing mid-conversation with a user.
        """
        try:
            self.client.models.list()
            logger.info("AI server connection verified OK")
        except Exception as e:
            logger.error(f"Cannot connect to AI server at {self.config.api_base_url}: {e}")
            logger.error("Is Ollama running? Try: ollama serve")
            raise ConnectionError(f"AI server unreachable: {e}")

    def _call_ai_with_retry(self, messages: list[dict], tools: list | None = None) -> Any:
        """
        Calls the AI API with automatic retry on failure.   [UPGRADE 5]

        WHY: Networks fail. APIs time out. Rate limits hit.
        In production, a single failure cannot crash the service.
        We try up to max_retries times with a delay between each.
        """
        last_error = None
        for attempt in range(1, self.config.max_retries + 1):
            try:
                kwargs = {"model": self.config.model_name, "messages": messages}
                if tools:
                    kwargs["tools"] = tools

                response = self.client.chat.completions.create(**kwargs)
                return response

            except (APIConnectionError, APITimeoutError) as e:
                last_error = e
                logger.warning(f"API call failed (attempt {attempt}/{self.config.max_retries}): {e}")
                if attempt < self.config.max_retries:
                    time.sleep(self.config.retry_delay_seconds)

            except Exception as e:
                # Non-recoverable error — don't retry
                logger.error(f"Unexpected API error: {e}")
                raise

        raise ConnectionError(f"API failed after {self.config.max_retries} attempts: {last_error}")

    def _execute_tool(self, tool_name: str, arguments: dict) -> str:
        """
        Executes a tool from the registry and returns the result as a string.
        Uses the TOOL REGISTRY instead of if/elif.  [UPGRADE 6]
        """
        self.session_stats["total_tool_calls"] += 1

        if tool_name not in TOOL_REGISTRY:
            logger.error(f"Tool '{tool_name}' not found in registry. Available: {list(TOOL_REGISTRY.keys())}")
            return json.dumps({"success": False, "error": f"Unknown tool: {tool_name}"})

        tool_function = TOOL_REGISTRY[tool_name]

        try:
            result = tool_function(**arguments)
            # Always return JSON strings — standardized format for the AI to read
            return json.dumps(result)
        except Exception as e:
            logger.error(f"Tool '{tool_name}' crashed with error: {e}")
            return json.dumps({"success": False, "error": f"Tool execution error: {str(e)}"})

    def chat(self, user_message: str) -> dict[str, Any]:
        """
        The main public method to chat with the agent.

        This is the SINGLE entry point. Give it a message, get a response.
        The agent handles tools, memory, and retries internally.

        Args:
            user_message: The user's text question.

        Returns:
            A structured dict with:
            - "answer"      : The AI's final text response
            - "tools_used"  : List of tools the AI called
            - "success"     : True/False
            - "error"       : Error message if success is False
        """
        # --- Input Validation ---  [UPGRADE 4]
        if not user_message or not user_message.strip():
            return {"success": False, "answer": "", "tools_used": [], "error": "Empty message received."}

        if len(user_message) > 2000:
            return {"success": False, "answer": "", "tools_used": [], "error": "Message too long (max 2000 chars)."}

        self.session_stats["total_requests"] += 1
        logger.info(f"--- New Request #{self.session_stats['total_requests']} ---")
        logger.info(f"User: {user_message}")

        # --- Add user message to session memory ---  [UPGRADE 7]
        self.conversation_history.append({"role": "user", "content": user_message})

        tools_called_this_turn = []
        start_time = time.time()

        try:
            # --- Agentic Loop ---
            # Keep looping until the AI gives a final answer (not a tool call).
            # We cap at max_tool_iterations to prevent infinite loops.
            for iteration in range(self.config.max_tool_iterations):

                logger.info(f"Agent loop iteration {iteration + 1}/{self.config.max_tool_iterations}")

                # Call the AI with the full conversation history + tools
                response = self._call_ai_with_retry(
                    messages=self.conversation_history,
                    tools=TOOLS_SCHEMA
                )

                ai_message = response.choices[0].message

                # --- Did the AI want to use a tool? ---
                if ai_message.tool_calls:
                    logger.info(f"AI requested {len(ai_message.tool_calls)} tool(s)")

                    # Add AI's tool-call request to history
                    self.conversation_history.append(ai_message)

                    # Execute each requested tool
                    for tool_call in ai_message.tool_calls:
                        tool_name = tool_call.function.name
                        arguments = json.loads(tool_call.function.arguments)

                        logger.info(f"Executing tool: '{tool_name}' | args: {arguments}")
                        tool_result_str = self._execute_tool(tool_name, arguments)
                        tools_called_this_turn.append(tool_name)

                        # Return tool result to AI's message history
                        self.conversation_history.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "content": tool_result_str
                        })

                else:
                    # --- AI is done! Extract final answer ---
                    final_answer = ai_message.content or "I processed your request but have no text response."

                    # Add the AI's final answer to memory for next turn [UPGRADE 7]
                    self.conversation_history.append({"role": "assistant", "content": final_answer})

                    elapsed_ms = round((time.time() - start_time) * 1000)
                    logger.info(f"Request complete | tools={tools_called_this_turn} | {elapsed_ms}ms")
                    self.session_stats["successful_requests"] += 1

                    # [UPGRADE 8] Return structured output, not just a string
                    return {
                        "success": True,
                        "answer": final_answer,
                        "tools_used": tools_called_this_turn,
                        "elapsed_ms": elapsed_ms,
                        "error": None
                    }

            # If we exit the loop without an answer, the agent got stuck
            logger.error("Agent exceeded max tool iterations without giving a final answer.")
            self.session_stats["failed_requests"] += 1
            return {"success": False, "answer": "", "tools_used": tools_called_this_turn, "error": "Agent loop limit reached."}

        except Exception as e:
            logger.error(f"Unhandled error in chat(): {e}", exc_info=True)
            self.session_stats["failed_requests"] += 1
            return {"success": False, "answer": "", "tools_used": [], "error": str(e)}

    def get_stats(self) -> dict:
        """Return session statistics. Useful for monitoring/dashboards."""
        return self.session_stats

    def reset_memory(self) -> None:
        """Clear conversation history. Call this to start a new session."""
        self.conversation_history = []
        logger.info("Conversation memory cleared — new session started.")


# ============================================================
# SECTION 7: INTERACTIVE MAIN LOOP  [UPGRADE 7 - SESSION MEMORY]
# ============================================================
# This runs when you execute the file directly: python smart_restaurant_agent.py
# In production, this would be replaced by a FastAPI route or a Slack handler.

if __name__ == "__main__":

    print("=" * 65)
    print("  PRODUCTION RESTAURANT AGENT")
    print("  Powered by Ollama | Multi-turn | Logged | Retry-enabled")
    print("=" * 65)
    print("  Commands: 'exit' to quit, 'stats' to see metrics, 'reset' for new session")
    print("=" * 65)

    # Create ONE agent instance — it persists across the whole session
    try:
        agent = RestaurantAgent(config=config)
    except ConnectionError as e:
        print(f"\n ERROR: {e}")
        print(" Make sure Ollama is running: ollama serve")
        exit(1)

    print("\n Agent is ready! Ask anything about restaurant bills.\n")

    # --- Multi-turn conversation loop ---  [UPGRADE 7]
    # The agent REMEMBERS previous messages in this session.
    while True:
        user_input = input("You: ").strip()

        if not user_input:
            continue

        # --- Special commands ---
        if user_input.lower() in ("exit", "quit", "bye"):
            print("\n Session stats:", agent.get_stats())
            print(" Goodbye! Check 'restaurant_agent.log' for full logs.")
            break

        if user_input.lower() == "stats":
            print("\n Session Stats:", json.dumps(agent.get_stats(), indent=2))
            continue

        if user_input.lower() == "reset":
            agent.reset_memory()
            print(" Memory cleared! Starting fresh conversation.\n")
            continue

        # --- Send message to agent ---
        result = agent.chat(user_input)

        if result["success"]:
            print(f"\n Agent: {result['answer']}")
            if result["tools_used"]:
                print(f"  [Used tools: {', '.join(result['tools_used'])}]\n")
        else:
            print(f"\n Agent Error: {result['error']}\n")
```