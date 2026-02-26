# Phase 3: Using LLM APIs - Step 3 (Structured Output / JSON Mode)

Until now, we've received AI responses as "Plain Text" (a string). This is great for humans to read, but **terrible for code to process**. 

If you want to build a feature (like a "Dashboard" or "Invoice Generator"), you need the AI to return data in a format like **JSON**.

---

## 1. The Problem: AI "Chatter"
If you ask an AI: *"Give me the price and name of 3 fruits in JSON"*, it might respond with:
> "Sure! Here is the JSON you asked for: { 'apple': 1.0, ... } Hope that helps!"

That extra text ("Sure! Here is...") will **break** your Python code. We need to force the AI to return **ONLY** the JSON.

## 2. The Solution: JSON Mode
Modern APIs have a special setting called `response_format: { "type": "json_object" }`. 
When this is "ON":
1. The AI is forbidden from adding "chatter."
2. The API guarantees that the output will be a valid, parsable JSON.

**CRITICAL RULE:** When using JSON Mode, you **MUST** include the word "JSON" in your System Prompt, or the API will throw an error.

---

## 3. The Coding Exercise (Hands-on)

We are going to ask the AI to analyze a product review and return a structured "Sentiment Report."

#### Step 1: The "JSON Parser" script
Create a file named `json_mode_basics.py` inside your `Phase3` folder:

```python
import json
from openai import OpenAI

# Standard Setup with Mock Mode
client = OpenAI(api_key="sk-DUMMY")
USE_MOCK = True

def get_sentiment_data(review_text):
    print(f"\nAnalyzing Review: '{review_text}'")
    
    system_instruction = "You are a data analyst. Return a JSON object with: 'sentiment' (string), 'score' (number 0-1), and 'keywords' (list)."

    if USE_MOCK:
        # Mimicking a structured JSON output
        raw_output = '{"sentiment": "positive", "score": 0.95, "keywords": ["fast", "easy", "reliable"]}'
    else:
        # REAL API CALL with JSON Mode enabled
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-1106", # Older models don't support JSON mode
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": review_text}
            ]
        )
        raw_output = response.choices[0].message.content

    # The Magic Step: Convert string to a Python Dictionary
    data = json.loads(raw_output)
    
    print(f"✅ Parsed Sentiment: {data['sentiment'].upper()}")
    print(f"✅ Key Keywords: {', '.join(data['keywords'])}")
    return data

# Test the function
get_sentiment_data("I absolute love this new AI tool. It's so fast!")
```

---

## 4. Why this matters (Production Insight)
This is the "Secret Sauce" of AI Apps.
- **Booking Apps:** Extract `date`, `time`, and `location` from a user's chat.
- **Summarizers:** Extract `Action Items` and `Due Dates`.
- **Dashboards:** Convert raw logs into `Graph Data`.

Once you master JSON Mode, you stop building "Chatbots" and start building **AI Systems**.

---
**Summary:**
- **JSON Mode:** Forces AI to return code-readable data.
- **json.loads():** The Python function that turns that text into a real object.

**Next Step:** It's Graduation time for Phase 3! We are going to build a [Final Project: AI Chatbot / Content Generator](file:///d:/myFirstAITest/Phase3/phase3_project.md). 🚀
