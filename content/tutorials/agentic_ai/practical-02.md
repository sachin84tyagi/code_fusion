```python
"""
 PROFESSOR'S GUIDE: YOUR SMART RESTAURANT AGENT (2 TOOLS!)
==================================================
Welcome back, future AI engineer!

For this agent, we are going to build a "Smart Restaurant Agent"!

 WHAT DOES IT DO?
Imagine you just finished eating at a restaurant with your friends.
Two things happen at the END of every restaurant meal:
  1. You need to calculate the TIP for the waiter.
  2. You need to SPLIT the total bill equally among friends.

Instead of doing painful math at the table, you just ask your AI robot:
"Our bill was $120. We want to tip 18%. And there are 4 of us. 
 What does each person pay?"

The robot will:
  TOOL 1 -> Use "calculate_tip" to figure out the tip amount + total
  TOOL 2 -> Use "split_bill" to divide the total among all friends

This is a REAL skill: Teaching an AI to choose from MULTIPLE TOOLS!

 WHY 2 TOOLS?
Real AI agents (like Siri, ChatGPT) have HUNDREDS of tools.
The AI brain reads your question and DECIDES which tool to use.
This is the superpower we are building today!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
# 'json'   -> Helps us read the arguments the AI sends to our tools
# 'OpenAI' -> The connector that lets us talk to the AI brain
import json
from openai import OpenAI

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
# We connect to our LOCAL AI (Ollama) running on this computer.
# Think of this as "turning on" the AI assistant.
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tools)
# ---------------------------------------------------------
# NEW CONCEPT: We are building TWO tools now!
# Each tool is just a normal Python function.
# The AI will CHOOSE which one to call based on your question.

# ---------- TOOL 1: The Tip Calculator ----------
def calculate_tip(bill_amount, tip_percentage):
    """
    WHAT THIS TOOL DOES:
    Takes a restaurant bill and a tip percentage,
    then calculates how much the tip is AND the new total.
    
    Example: bill=$100, tip=20% -> tip=$20.00, total=$120.00
    """
    print(f"\n   [TOOL 1 RUNNING] Calculating {tip_percentage}% tip on ${bill_amount} bill...")
    
    # Convert percentage to a decimal: 18% becomes 0.18
    tip_decimal = tip_percentage / 100
    
    # Calculate the tip amount
    tip_amount = bill_amount * tip_decimal
    
    # Add tip to the original bill for the grand total
    total_with_tip = bill_amount + tip_amount
    
    # Return a clear, readable result string
    return (f"Tip amount: ${tip_amount:.2f}. "
            f"Total bill including tip: ${total_with_tip:.2f}.")


# ---------- TOOL 2: The Bill Splitter ----------
def split_bill(total_amount, number_of_people):
    """
    WHAT THIS TOOL DOES:
    Takes a total bill amount and divides it equally
    among all the people at the table.
    
    Example: total=$120, people=4 -> each person pays $30.00
    """
    print(f"\n   [TOOL 2 RUNNING] Splitting ${total_amount:.2f} among {number_of_people} people...")
    
    # Simple division: total divided by number of people
    each_person_pays = total_amount / number_of_people
    
    return (f"Each person pays ${each_person_pays:.2f} "
            f"when splitting ${total_amount:.2f} among {number_of_people} people.")


# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL (The Tools List)
# ---------------------------------------------------------
# This is the KEY STEP that makes the AI aware of its tools.
# We write a "menu" of tools so the AI knows:
#   - What is the tool's NAME? (so it can call it)
#   - WHEN should it use it? (the description)
#   - What INPUTS does it need? (the parameters)
#
# IMPORTANT: This is JSON format - the "language" AI speaks!

tools_manual = [
    # ---- TOOL 1 DESCRIPTION ----
    {
        "type": "function",
        "function": {
            "name": "calculate_tip",           # Must EXACTLY match the function name above!
            "description": "Use this tool to calculate the tip amount and new total when the user mentions a restaurant bill and a tip percentage.",
            "parameters": {
                "type": "object",
                "properties": {
                    "bill_amount": {
                        "type": "number",
                        "description": "The original restaurant bill in dollars, before the tip (e.g., 120 or 45.50)."
                    },
                    "tip_percentage": {
                        "type": "number",
                        "description": "The tip percentage the user wants to leave (e.g., 15 for 15%, 20 for 20%)."
                    }
                },
                "required": ["bill_amount", "tip_percentage"]  # Both are needed — the AI won't call this tool without them
            }
        }
    },
    # ---- TOOL 2 DESCRIPTION ----
    {
        "type": "function",
        "function": {
            "name": "split_bill",              # Must EXACTLY match the function name above!
            "description": "Use this tool to split a total bill evenly among a group of people. Use this AFTER calculating the tip.",
            "parameters": {
                "type": "object",
                "properties": {
                    "total_amount": {
                        "type": "number",
                        "description": "The total bill amount to be split (e.g., 141.60)."
                    },
                    "number_of_people": {
                        "type": "integer",
                        "description": "The number of people sharing the bill (e.g., 4)."
                    }
                },
                "required": ["total_amount", "number_of_people"]
            }
        }
    }
]


# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# This is our REAL-LIFE scenario question.
# The AI needs to figure out: "Do I use Tool 1? Tool 2? Both?"
user_question = (
    "We just had dinner. The bill is $120. "
    "We want to tip 18%. There are 4 of us splitting the bill. "
    "What does each person need to pay?"
)

print("=" * 55)
print(" SMART RESTAURANT AGENT (2 Tools)")
print("=" * 55)
print(f"\n YOU ASKED: '{user_question}'\n")

# Build the message history (the AI needs this format)
messages = [{"role": "user", "content": user_question}]
print(" AI is thinking about which tool(s) to use...")

# Send the question AND the tools manual to the AI
first_response = client.chat.completions.create(
    model=MODEL_NAME,
    messages=messages,
    tools=tools_manual      # <-- This is how the AI knows about its tools!
)

ai_reply = first_response.choices[0].message


# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
# The AI will look at the question and choose:
# -> SCENARIO A: Use a tool (tool_calls will have content)
# -> SCENARIO B: Answer directly without a tool

if ai_reply.tool_calls:

    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT CHOSE A TOOL!
    # ---------------------------------------------------------
    # In this scenario, the AI may call ONE or MORE tools.
    # We loop through ALL tool calls the AI wants to make.

    print(f" AI DECISION: 'I need to use {len(ai_reply.tool_calls)} tool(s)!'\n")

    # Add the AI's "I want to use a tool" message to history
    # (This is required so the AI remembers what it decided to do)
    messages.append(ai_reply)

    # ---------------------------------------------------------
    # STEP 7: EXECUTE EVERY TOOL THE AI REQUESTED
    # ---------------------------------------------------------
    # The AI might call Tool 1, then Tool 2 (in sequence).
    # We loop through each tool call and run the right Python function.

    for tool_call in ai_reply.tool_calls:

        tool_name = tool_call.function.name
        # The AI sends arguments as a JSON string — we convert to a Python dict
        arguments = json.loads(tool_call.function.arguments)

        print(f" AI wants to use: '{tool_name}' with args: {arguments}")

        # ----- Run the correct tool based on its name -----
        if tool_name == "calculate_tip":
            tool_result = calculate_tip(
                bill_amount=arguments["bill_amount"],
                tip_percentage=arguments["tip_percentage"]
            )

        elif tool_name == "split_bill":
            tool_result = split_bill(
                total_amount=arguments["total_amount"],
                number_of_people=arguments["number_of_people"]
            )

        else:
            # Safety net: if the AI calls a tool we don't have
            tool_result = f"Error: Tool '{tool_name}' not found."

        print(f"\n   Tool returned: '{tool_result}'\n")

        # ---------------------------------------------------------
        # STEP 8: GIVE EACH TOOL RESULT BACK TO THE AI
        # ---------------------------------------------------------
        # We must tell the AI what the tool found.
        # Each result is linked to a specific tool call using 'tool_call_id'.
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,   # Links result to the right tool call
            "content": tool_result
        })

    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    # Now the AI has ALL tool results. It uses them to give a
    # clear, human-friendly answer to the original question.
    print(" AI is writing the final receipt summary...")

    final_response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages   # Now includes: question + tool calls + tool results
    )

    print("\n" + "=" * 55)
    print(" FINAL ANSWER FROM AI:")
    print("=" * 55)
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT ANSWERED WITHOUT TOOLS
    # ---------------------------------------------------------
    # Sometimes the question doesn't need a tool.
    # e.g., "What is your name?" — no calculation needed!
    print(" AI DECISION: 'I can answer this without using any tools.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)

print("\n" + "=" * 55)

```


---


```python
"""
 PROFESSOR'S GUIDE: YOUR HEALTH & FITNESS AGENT (2 TOOLS!)
==================================================
Welcome back, future AI engineer!

For this agent, we are going to build a "Health & Fitness Agent"!

 WHAT DOES IT DO?
Imagine you just downloaded a fitness app and you want to know:
  1. How many CALORIES you burned during your morning walk.
  2. How much WATER you should drink based on your body weight.

You just ask your AI:
"I walked 5 km today and I weigh 70 kg. 
 How many calories did I burn? And how much water should I drink?"

The robot will:
  TOOL 1 -> Use "calculate_calories_burned" to estimate calories
  TOOL 2 -> Use "calculate_water_intake" to recommend daily water

 THE REAL-WORLD CONNECTION:
This is EXACTLY how fitness apps like MyFitnessPal, Google Fit,
and Apple Health work on the inside — AI picking the right
calculation for your question!
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json
from openai import OpenAI

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tools)
# ---------------------------------------------------------

# ---------- TOOL 1: Calories Burned Calculator ----------
def calculate_calories_burned(distance_km, weight_kg):
    """
    WHAT THIS TOOL DOES:
    Estimates how many calories you burn during a walk or run.

    The formula: Calories = distance (km) x weight (kg) x 0.9
    This is the standard MET formula used by fitness scientists!

    Example: 5 km walk at 70 kg -> 5 x 70 x 0.9 = 315 calories
    """
    print(f"\n   [TOOL 1 RUNNING] Calculating calories for {distance_km}km walk at {weight_kg}kg...")

    # MET (Metabolic Equivalent of Task) formula for walking
    # 0.9 is the calorie coefficient for moderate-pace walking
    calories = distance_km * weight_kg * 0.9

    return (f"You burned approximately {calories:.0f} calories "
            f"walking {distance_km} km at a body weight of {weight_kg} kg. Great job!")


# ---------- TOOL 2: Daily Water Intake Calculator ----------
def calculate_water_intake(weight_kg):
    """
    WHAT THIS TOOL DOES:
    Calculates how much water you should drink every day
    based on your body weight.

    The formula: Water (liters) = weight (kg) x 0.033
    This follows the standard WHO (World Health Organization) guideline.

    Example: 70 kg -> 70 x 0.033 = 2.31 liters per day
    """
    print(f"\n   [TOOL 2 RUNNING] Calculating daily water intake for {weight_kg}kg person...")

    # WHO recommended formula
    water_liters = weight_kg * 0.033

    # Also convert to glasses (1 glass = 250ml = 0.25 liters)
    water_glasses = water_liters / 0.25

    return (f"You should drink {water_liters:.1f} liters "
            f"(about {water_glasses:.0f} glasses of water) per day "
            f"for a body weight of {weight_kg} kg.")


# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL (The Tools List)
# ---------------------------------------------------------
# We describe BOTH tools so the AI knows exactly when and
# how to use each one. The AI reads these descriptions
# before deciding which tool to call.

tools_manual = [
    # ---- TOOL 1 DESCRIPTION ----
    {
        "type": "function",
        "function": {
            "name": "calculate_calories_burned",
            "description": "Use this tool when the user asks about calories burned during walking, running, or exercise. Requires the distance walked and the person's weight.",
            "parameters": {
                "type": "object",
                "properties": {
                    "distance_km": {
                        "type": "number",
                        "description": "The distance walked or run in kilometers (e.g., 5 for 5 km)."
                    },
                    "weight_kg": {
                        "type": "number",
                        "description": "The person's body weight in kilograms (e.g., 70 for 70 kg)."
                    }
                },
                "required": ["distance_km", "weight_kg"]
            }
        }
    },
    # ---- TOOL 2 DESCRIPTION ----
    {
        "type": "function",
        "function": {
            "name": "calculate_water_intake",
            "description": "Use this tool when the user asks how much water they should drink daily. Only requires the person's weight.",
            "parameters": {
                "type": "object",
                "properties": {
                    "weight_kg": {
                        "type": "number",
                        "description": "The person's body weight in kilograms (e.g., 70 for 70 kg)."
                    }
                },
                "required": ["weight_kg"]
            }
        }
    }
]


# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# A real fitness question that requires BOTH tools!
user_question = (
    "I went for a 5 km walk this morning and I weigh 70 kg. "
    "How many calories did I burn? "
    "Also, how much water should I be drinking every day?"
)

print("=" * 55)
print(" HEALTH & FITNESS AGENT (2 Tools)")
print("=" * 55)
print(f"\n YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is deciding which health tools to use...")

# Send everything to the AI — question + tools manual
first_response = client.chat.completions.create(
    model=MODEL_NAME,
    messages=messages,
    tools=tools_manual
)

ai_reply = first_response.choices[0].message


# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:

    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT CHOSE TOOL(S)!
    # ---------------------------------------------------------
    print(f" AI DECISION: 'I need {len(ai_reply.tool_calls)} tool(s) to answer this!'\n")

    # Save the AI's tool-calling decision to message history
    messages.append(ai_reply)

    # ---------------------------------------------------------
    # STEP 7: RUN EACH TOOL THE AI REQUESTED
    # ---------------------------------------------------------
    for tool_call in ai_reply.tool_calls:

        tool_name = tool_call.function.name
        arguments = json.loads(tool_call.function.arguments)

        print(f" Running tool: '{tool_name}' with inputs: {arguments}")

        # Match the tool name and run the right Python function
        if tool_name == "calculate_calories_burned":
            tool_result = calculate_calories_burned(
                distance_km=arguments["distance_km"],
                weight_kg=arguments["weight_kg"]
            )

        elif tool_name == "calculate_water_intake":
            tool_result = calculate_water_intake(
                weight_kg=arguments["weight_kg"]
            )

        else:
            tool_result = f"Error: Unknown tool '{tool_name}'."

        print(f"\n   Tool returned: '{tool_result}'\n")

        # ---------------------------------------------------------
        # STEP 8: SEND EACH TOOL RESULT BACK TO THE AI
        # ---------------------------------------------------------
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": tool_result
        })

    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    # The AI combines both tool results into one helpful fitness report!
    print(" AI is writing your personal fitness report...")

    final_response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages
    )

    print("\n" + "=" * 55)
    print(" YOUR PERSONAL FITNESS REPORT:")
    print("=" * 55)
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT ANSWERED WITHOUT TOOLS
    # ---------------------------------------------------------
    print(" AI DECISION: 'I can answer this without any tools.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)

print("\n" + "=" * 55)

```

---

```python
"""
 PROFESSOR'S GUIDE: YOUR EMI LOAN ASSISTANT AGENT (2 TOOLS!)
==================================================
Welcome back, future AI engineer!

For this agent, we are going to build an "EMI Loan Assistant Agent"!

 WHAT DOES IT DO?
Imagine you want to buy a new phone or laptop on EMI (monthly installments).
You need to figure out TWO things:
  1. What is my MONTHLY EMI payment?
  2. What is the TOTAL INTEREST I will pay over the full loan?

You just ask your AI:
"I want to take a loan of Rs 50,000 for 12 months at 12% interest per year.
 What is my EMI? And how much total interest will I pay?"

The robot will:
  TOOL 1 -> Use "calculate_emi" to find the monthly installment
  TOOL 2 -> Use "calculate_total_interest" to find the interest paid

 THE REAL-WORLD CONNECTION:
This is how banking apps like Paytm, Google Pay, and HDFC Bank's
loan calculators work! Millions of people use this every single day.
Now YOU know how to build one with AI!

 KEY WORD: EMI = Equated Monthly Installment
This is a fixed payment made to a bank every month to repay a loan.
"""

# ---------------------------------------------------------
# STEP 1: BRING IN OUR MAGIC TOOLBOXES (Libraries)
# ---------------------------------------------------------
import json
import math   # 'math' gives us the power function for the EMI formula!
from openai import OpenAI

# ---------------------------------------------------------
# STEP 2: WAKE UP THE ROBOT BRAIN
# ---------------------------------------------------------
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "llama3.2"

# ---------------------------------------------------------
# STEP 3: BUILD THE ROBOT'S HANDS (The Tools)
# ---------------------------------------------------------

# ---------- TOOL 1: EMI Calculator ----------
def calculate_emi(principal, annual_rate, months):
    """
    WHAT THIS TOOL DOES:
    Calculates the monthly EMI (Equated Monthly Installment) for a loan.

    THE FORMULA (used by every bank in the world):
    EMI = P × r × (1+r)^n / ((1+r)^n - 1)

    Where:
      P = Principal (the loan amount, e.g., Rs 50,000)
      r = Monthly interest rate (annual rate divided by 12 months, divided by 100)
      n = Number of monthly installments (loan duration in months)

    Example: Rs 50,000 loan, 12% per year, 12 months
      -> EMI = Rs 4,442.44 per month
    """
    print(f"\n   [TOOL 1 RUNNING] Calculating EMI for Rs{principal} loan at {annual_rate}% for {months} months...")

    # Convert annual interest rate to monthly decimal
    # e.g., 12% per year -> 1% per month -> 0.01 as a decimal
    monthly_rate = annual_rate / (12 * 100)

    # Apply the standard EMI formula
    # math.pow(base, exponent) calculates the power (e.g., 1.01 ^ 12)
    power_factor = math.pow(1 + monthly_rate, months)
    emi = (principal * monthly_rate * power_factor) / (power_factor - 1)

    return (f"Your monthly EMI is Rs {emi:.2f} "
            f"for a loan of Rs {principal} at {annual_rate}% annual interest "
            f"over {months} months.")


# ---------- TOOL 2: Total Interest Calculator ----------
def calculate_total_interest(principal, monthly_emi, months):
    """
    WHAT THIS TOOL DOES:
    Calculates the total interest you pay over the full life of the loan.

    THE FORMULA (very simple!):
    Total Paid      = monthly_emi × number of months
    Total Interest  = Total Paid - Original Principal (loan amount)

    Example: EMI=Rs 4,442 x 12 months = Rs 53,307 total paid
             Interest paid = Rs 53,307 - Rs 50,000 = Rs 3,307
    """
    print(f"\n   [TOOL 2 RUNNING] Calculating total interest for Rs{monthly_emi:.2f} EMI over {months} months...")

    # Total amount paid back to the bank
    total_paid = monthly_emi * months

    # The bank's profit = Total paid MINUS what we originally borrowed
    total_interest = total_paid - principal

    return (f"Total amount you will pay back: Rs {total_paid:.2f}. "
            f"Total interest charged by the bank: Rs {total_interest:.2f}. "
            f"You're paying Rs {total_interest:.2f} extra for borrowing Rs {principal}.")


# ---------------------------------------------------------
# STEP 4: WRITE THE INSTRUCTION MANUAL (The Tools List)
# ---------------------------------------------------------
# NOTICE: For Tool 2, we include "monthly_emi" as a parameter.
# This is because in real use, the AI will call Tool 1 first,
# get the EMI value, then use it as input for Tool 2.

tools_manual = [
    # ---- TOOL 1 DESCRIPTION ----
    {
        "type": "function",
        "function": {
            "name": "calculate_emi",
            "description": "Use this tool to calculate the monthly EMI (Equated Monthly Installment) for any type of loan — personal loan, car loan, home loan, or phone EMI.",
            "parameters": {
                "type": "object",
                "properties": {
                    "principal": {
                        "type": "number",
                        "description": "The loan amount in rupees or dollars (e.g., 50000 for Rs 50,000)."
                    },
                    "annual_rate": {
                        "type": "number",
                        "description": "The annual interest rate as a percentage (e.g., 12 for 12% per year)."
                    },
                    "months": {
                        "type": "integer",
                        "description": "The loan repayment duration in months (e.g., 12 for 1 year, 24 for 2 years)."
                    }
                },
                "required": ["principal", "annual_rate", "months"]
            }
        }
    },
    # ---- TOOL 2 DESCRIPTION ----
    {
        "type": "function",
        "function": {
            "name": "calculate_total_interest",
            "description": "Use this tool to calculate the total interest paid over the full loan period. Use after calculating the EMI to give a complete financial picture.",
            "parameters": {
                "type": "object",
                "properties": {
                    "principal": {
                        "type": "number",
                        "description": "The original loan amount (e.g., 50000 for Rs 50,000)."
                    },
                    "monthly_emi": {
                        "type": "number",
                        "description": "The calculated monthly EMI amount (e.g., 4442.44)."
                    },
                    "months": {
                        "type": "integer",
                        "description": "The total number of monthly payments (e.g., 12)."
                    }
                },
                "required": ["principal", "monthly_emi", "months"]
            }
        }
    }
]


# ---------------------------------------------------------
# STEP 5: START THE CONVERSATION!
# ---------------------------------------------------------
# A real-life scenario: Getting a loan for a new phone!
user_question = (
    "I want to buy a phone on loan. The price is Rs 50,000. "
    "The bank is offering 12% annual interest and I want to pay it off in 12 months. "
    "What will be my monthly EMI? And how much total interest will I end up paying the bank?"
)

print("=" * 60)
print(" EMI LOAN ASSISTANT AGENT (2 Tools)")
print("=" * 60)
print(f"\n YOU ASKED: '{user_question}'\n")

messages = [{"role": "user", "content": user_question}]
print(" AI is analyzing your loan request...")

# Send question + tools menu to the AI brain
first_response = client.chat.completions.create(
    model=MODEL_NAME,
    messages=messages,
    tools=tools_manual
)

ai_reply = first_response.choices[0].message


# ---------------------------------------------------------
# STEP 6: THE ROBOT MAKES A DECISION
# ---------------------------------------------------------
if ai_reply.tool_calls:

    # ---------------------------------------------------------
    # SCENARIO A: THE ROBOT CHOSE TOOL(S)!
    # ---------------------------------------------------------
    print(f" AI DECISION: 'I need {len(ai_reply.tool_calls)} financial tool(s)!'\n")

    # Save the AI's tool choice to message history
    messages.append(ai_reply)

    # We'll track the EMI result here so Tool 2 can use it
    # (This shows how tools can pass data to each other!)
    calculated_emi = None

    # ---------------------------------------------------------
    # STEP 7: RUN EACH TOOL THE AI REQUESTED
    # ---------------------------------------------------------
    for tool_call in ai_reply.tool_calls:

        tool_name = tool_call.function.name
        arguments = json.loads(tool_call.function.arguments)

        print(f" Running tool: '{tool_name}' with inputs: {arguments}")

        if tool_name == "calculate_emi":
            tool_result = calculate_emi(
                principal=arguments["principal"],
                annual_rate=arguments["annual_rate"],
                months=arguments["months"]
            )
            # Save the EMI so Tool 2 can use it
            calculated_emi = (arguments["principal"] * (arguments["annual_rate"] / 1200) *
                              math.pow(1 + arguments["annual_rate"]/1200, arguments["months"])) / \
                             (math.pow(1 + arguments["annual_rate"]/1200, arguments["months"]) - 1)

        elif tool_name == "calculate_total_interest":
            # If the AI already knows the EMI from a previous step, great!
            # If not, we use the one we calculated above.
            emi_val = arguments.get("monthly_emi", calculated_emi or 0)
            tool_result = calculate_total_interest(
                principal=arguments["principal"],
                monthly_emi=emi_val,
                months=arguments["months"]
            )

        else:
            tool_result = f"Error: Unknown tool '{tool_name}'."

        print(f"\n   Tool returned: '{tool_result}'\n")

        # ---------------------------------------------------------
        # STEP 8: SEND EACH TOOL RESULT BACK TO THE AI
        # ---------------------------------------------------------
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": tool_result
        })

    # ---------------------------------------------------------
    # STEP 9: THE ROBOT GIVES THE FINAL ANSWER
    # ---------------------------------------------------------
    # The AI now has both: the EMI amount AND the total interest.
    # It will write a clear, friendly loan summary for the user.
    print(" AI is writing your complete loan summary...")

    final_response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages
    )

    print("\n" + "=" * 60)
    print(" YOUR COMPLETE LOAN SUMMARY:")
    print("=" * 60)
    print(final_response.choices[0].message.content)

else:
    # ---------------------------------------------------------
    # SCENARIO B: THE ROBOT ANSWERED WITHOUT TOOLS
    # ---------------------------------------------------------
    print(" AI DECISION: 'I can answer this without any financial tools.'")
    print("\n FINAL ANSWER FROM AI:")
    print(ai_reply.content)

print("\n" + "=" * 60)

```
