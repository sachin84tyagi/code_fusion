# 🤖 Phase 3 — Working With Models
### "Talking to the AI Brain"

> **Difficulty**: ⭐⭐ Beginner-Intermediate | **Time**: ~60 minutes | **Prerequisites**: Phase 2 Complete

---

## 🎯 What You'll Learn In This Phase

- ✅ How to use OpenAI and Ollama models in LangChain
- ✅ The difference between Chat models and Completion models
- ✅ What Temperature means (and how to tune it)
- ✅ What Tokens are (AI's "words")
- ✅ How to stream responses
- ✅ How to get structured output from AI

---

## 📖 Lesson 3.1 — Two Types of AI Models

### Chat Models vs Completion Models

LangChain has two types of models. Understanding the difference is important:

```
┌─────────────────────────────────────────────────────────┐
│                  MODEL TYPES                             │
├─────────────────────────┬───────────────────────────────┤
│    CHAT MODELS          │    COMPLETION MODELS           │
├─────────────────────────┼───────────────────────────────┤
│  • Modern standard      │  • Older style                 │
│  • Uses messages        │  • Takes raw text              │
│  • System + Human roles │  • Completes what you started  │
│  • GPT-4o, Claude, etc  │  • GPT-3 style                 │
│  • Used 99% of the time │  • Rarely used now             │
│                         │                                │
│  "Have a conversation"  │  "Continue this text..."       │
└─────────────────────────┴───────────────────────────────┘
```

> 💡 **Always use Chat Models**. Completion models are legacy. All modern AI uses the chat format.

---

## 📖 Lesson 3.2 — OpenAI Models in LangChain

### Setup

```python
# ============================================================
# FILE: models/openai_models.py
# PURPOSE: Learning to use OpenAI models in LangChain
# ============================================================

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

# Always load env variables first
load_dotenv()
```

### Basic Usage

```python
# Create the model
# model: which GPT version to use
# temperature: how creative (0.0 = focused, 1.0 = creative)
llm = ChatOpenAI(
    model="gpt-4o-mini",    # Fast and cheap for learning
    temperature=0.7          # Balanced creativity
)

# Create messages
messages = [
    SystemMessage(content="You are a helpful coding teacher."),
    HumanMessage(content="What is a Python list? Explain simply.")
]

# Get response
response = llm.invoke(messages)
print(response.content)
```

### Available OpenAI Models

```python
# Different models for different needs:

# Budget-friendly (great for learning)
llm_mini = ChatOpenAI(model="gpt-4o-mini")

# Most capable (use for complex tasks)
llm_powerful = ChatOpenAI(model="gpt-4o")

# Reasoning model (for math, logic, coding)
llm_reasoning = ChatOpenAI(model="o1-mini")
```

---

## 📖 Lesson 3.3 — Ollama (Local) Models in LangChain

```python
# ============================================================
# FILE: models/ollama_models.py
# PURPOSE: Using local AI models with Ollama
# ============================================================

from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage

# Ollama - no API key needed!
# model: must match what you downloaded with "ollama pull"
llm = ChatOllama(
    model="llama3.2",    # Or gemma2:2b, mistral, phi3, etc.
    temperature=0.7
)

messages = [
    SystemMessage(content="You are a Python expert."),
    HumanMessage(content="How do I read a file in Python?")
]

response = llm.invoke(messages)
print(response.content)
```

### Available Ollama Models

```bash
# Download and use any of these models:
ollama pull llama3.2        # Meta's Llama (great all-rounder)
ollama pull llama3.2:1b     # Tiny Llama (very fast, less smart)
ollama pull gemma2:2b       # Google's Gemma (fast, good)
ollama pull mistral         # Mistral AI (excellent at coding)
ollama pull phi3:mini       # Microsoft Phi3 (tiny but smart)
ollama pull deepseek-r1:8b  # DeepSeek (great reasoning)
```

---

## 📖 Lesson 3.4 — Understanding Temperature 🌡️

### Simple Explanation

**Temperature** controls how "creative" or "random" the AI is.

```
Temperature = 0.0              Temperature = 0.5            Temperature = 1.0
     │                               │                           │
     ▼                               ▼                           ▼
Robotic, precise,            Balanced, natural,          Creative, random,
always same answer.          good for most tasks.        sometimes weird.

"The capital of France       "Paris is the capital        "Ah, Paris! The 
 is Paris."                   of France, known for         city of love, where
                              its art and culture."        baguettes dream!"
```

### Real-Life Analogy

Think of temperature like your morning self:

- **Temperature 0.0** = You before coffee. Robot mode. Just the facts.
- **Temperature 0.5** = Normal you. Friendly, clear, natural.
- **Temperature 1.0** = You after 5 coffees. Super creative, maybe a little crazy.

### When To Use What Temperature

```
┌──────────────────────────────────────────────────────┐
│               TEMPERATURE GUIDE                       │
├────────────────┬───────────────────────────────────── │
│ Temperature    │ Use For                              │
├────────────────┼──────────────────────────────────────┤
│ 0.0 - 0.2     │ Factual Q&A, data extraction,        │
│                │ classification, code generation      │
├────────────────┼──────────────────────────────────────┤
│ 0.3 - 0.7     │ Chatbots, customer support,          │
│                │ explanations, summaries              │
├────────────────┼──────────────────────────────────────┤
│ 0.8 - 1.0     │ Creative writing, brainstorming,     │
│                │ story generation, marketing copy     │
└────────────────┴──────────────────────────────────────┘
```

### Code Example: Temperature Demo

```python
# ============================================================
# FILE: models/temperature_demo.py
# PURPOSE: See how temperature affects responses
# ============================================================

from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage

question = [HumanMessage(content="Tell me a fun fact about penguins.")]

# Test different temperatures
for temp in [0.0, 0.5, 1.0]:
    llm = ChatOllama(model="llama3.2", temperature=temp)
    response = llm.invoke(question)
    print(f"\n🌡️ Temperature {temp}:")
    print(response.content)
    print("-" * 50)
```

---

## 📖 Lesson 3.5 — Understanding Tokens 🪙

### What Is A Token?

AI models don't think in words — they think in **tokens**. A token is roughly:
- ~4 characters of text
- Or about ¾ of a word

```
"Hello, how are you?" 
 ↓ Tokenized to:
["Hello", ",", " how", " are", " you", "?"]
 = 6 tokens
```

### Visual Breakdown

```
┌──────────────────────────────────────────────────────────┐
│                    TOKEN EXAMPLES                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  "I"          = 1 token                                  │
│  "love"       = 1 token                                  │
│  "LangChain"  = 2 tokens (Lang + Chain)                  │
│  "Python"     = 1 token                                  │
│  "extraordinary" = 3-4 tokens                            │
│                                                          │
│  Rough rule: 1 token ≈ 0.75 words                        │
│  1000 tokens ≈ 750 words ≈ 2 pages of text               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Why Tokens Matter

1. **Cost**: OpenAI charges per token. More tokens = more money.
2. **Context Window**: Every model has a max token limit. 
   - GPT-4o: 128,000 tokens (~96,000 words — that's a novel!)
   - Llama 3.2: 128,000 tokens
   - Once you hit the limit, the AI "forgets" older messages.

### Token Counting In Code

```python
# ============================================================
# FILE: models/token_counter.py
# PURPOSE: Understanding tokens in practice
# ============================================================

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini")

messages = [
    SystemMessage(content="You are a helpful assistant."),
    HumanMessage(content="Explain machine learning in 3 sentences.")
]

# Get response WITH usage metadata
response = llm.invoke(messages)

print("📝 Response:")
print(response.content)
print()

# Token usage info
print("📊 Token Usage:")
print(f"  Input tokens:  {response.usage_metadata['input_tokens']}")
print(f"  Output tokens: {response.usage_metadata['output_tokens']}")
print(f"  Total tokens:  {response.usage_metadata['total_tokens']}")

# Rough cost estimate (gpt-4o-mini prices)
input_cost  = response.usage_metadata['input_tokens'] * 0.00000015
output_cost = response.usage_metadata['output_tokens'] * 0.0000006
total_cost  = input_cost + output_cost
print(f"\n💰 Estimated Cost: ${total_cost:.6f}")
```

---

## 📖 Lesson 3.6 — Streaming Responses 🌊

### What Is Streaming?

Instead of waiting for the ENTIRE response and then showing it, streaming shows each word/chunk as it's generated. This is exactly how ChatGPT works!

```
Without Streaming:
  ⏳ Wait 5 seconds... then: "Here is a long explanation about..."

With Streaming:
  "Here" → "is" → "a" → "long" → "explanation" → "about" → ...
  (appears word by word, feels much faster!)
```

### Streaming Code

```python
# ============================================================
# FILE: models/streaming_demo.py
# PURPOSE: Stream AI responses in real-time
# ============================================================

from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage

llm = ChatOllama(model="llama3.2")

messages = [
    SystemMessage(content="You are an enthusiastic science teacher."),
    HumanMessage(content="Explain how black holes form. Make it exciting!")
]

print("🤖 AI (streaming):")
print("-" * 40)

# stream() instead of invoke()
# This gives us chunks one at a time
for chunk in llm.stream(messages):
    # chunk.content is a small piece of text (sometimes one word, 
    # sometimes a few words, sometimes punctuation)
    print(chunk.content, end="", flush=True)
    # end="" means don't add newline after each chunk
    # flush=True means print immediately (don't buffer)

print("\n" + "-" * 40)
print("✅ Stream complete!")
```

### Streaming With Callback (Advanced)

```python
# ============================================================
# FILE: models/streaming_advanced.py
# PURPOSE: Streaming with custom handling
# ============================================================

from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage
import time

llm = ChatOllama(model="llama3.2")

full_response = ""  # Collect the full text
start_time = time.time()

print("🤖 Streaming response:")
for chunk in llm.stream([HumanMessage(content="Write me a haiku about Python code.")]):
    print(chunk.content, end="", flush=True)
    full_response += chunk.content  # Build the complete response

end_time = time.time()

print(f"\n\n⏱️  Time taken: {end_time - start_time:.2f} seconds")
print(f"📝 Total characters: {len(full_response)}")
```

---

## 📖 Lesson 3.7 — Structured Output 📋

### What Is Structured Output?

Sometimes you don't want a free-form text response. You want the AI to return data in a specific format — like a Python dictionary or JSON.

**Use case example:**
```
You: "Extract the name, email, and phone from this text: 
      'Contact John Smith at john@email.com or 555-1234'"

Without structured output:
"The name is John Smith, the email is john@email.com, 
 and the phone number is 555-1234."

With structured output:
{
  "name": "John Smith",
  "email": "john@email.com", 
  "phone": "555-1234"
}
```

The second format is MUCH easier to use in your code!

### Structured Output With Pydantic

```python
# ============================================================
# FILE: models/structured_output.py
# PURPOSE: Get AI responses in structured format
# ============================================================

from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# ---- Step 1: Define your data structure ----
# Pydantic BaseModel = a blueprint for your data
class ContactInfo(BaseModel):
    """Information extracted from text."""
    # Field() adds descriptions that help the AI understand what to extract
    name: str = Field(description="Full name of the person")
    email: Optional[str] = Field(description="Email address, if present")
    phone: Optional[str] = Field(description="Phone number, if present")
    company: Optional[str] = Field(description="Company name, if mentioned")

# ---- Step 2: Create model and bind the structure ----
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# .with_structured_output() tells the AI to always return this format
structured_llm = llm.with_structured_output(ContactInfo)

# ---- Step 3: Use it! ----
text = """
Please reach out to Sarah Johnson from TechCorp Inc.
Her email is sarah.j@techcorp.com and you can call her at (415) 867-5309.
"""

result = structured_llm.invoke(
    f"Extract contact information from this text: {text}"
)

# Now result is a ContactInfo object, not just text!
print("📋 Extracted Information:")
print(f"  Name:    {result.name}")
print(f"  Email:   {result.email}")
print(f"  Phone:   {result.phone}")
print(f"  Company: {result.company}")

# You can also convert to dict
print("\n📦 As Dictionary:")
print(result.model_dump())
```

### More Complex Structured Output Example

```python
# ============================================================
# FILE: models/product_analyzer.py
# PURPOSE: Extract product info from reviews
# ============================================================

from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import List
from enum import Enum
from dotenv import load_dotenv

load_dotenv()

# Enum for sentiment (only allows these exact values)
class Sentiment(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"

class ProductReview(BaseModel):
    """Analyzed product review."""
    product_name: str = Field(description="Name of the product being reviewed")
    rating: int = Field(description="Rating out of 5 stars", ge=1, le=5)
    sentiment: Sentiment = Field(description="Overall sentiment of the review")
    pros: List[str] = Field(description="List of positive points mentioned")
    cons: List[str] = Field(description="List of negative points mentioned")
    summary: str = Field(description="One sentence summary of the review")

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
analyzer = llm.with_structured_output(ProductReview)

review_text = """
I bought the AirMax Pro headphones last week. The sound quality is absolutely 
amazing - deep bass and crystal clear highs. The battery lasts 30 hours which 
is incredible. However, the ear cups are a bit uncomfortable after 2 hours and 
the price at $350 feels a bit steep. Overall I'd give it 4 stars - great 
sound but comfort needs work.
"""

result = analyzer.invoke(f"Analyze this product review: {review_text}")

print(f"🎧 Product: {result.product_name}")
print(f"⭐ Rating: {result.rating}/5")
print(f"😊 Sentiment: {result.sentiment.value}")
print(f"\n✅ Pros:")
for pro in result.pros:
    print(f"  • {pro}")
print(f"\n❌ Cons:")
for con in result.cons:
    print(f"  • {con}")
print(f"\n📝 Summary: {result.summary}")
```

---

## 📖 Lesson 3.8 — Model Configuration Deep Dive

```python
# ============================================================
# FILE: models/model_config.py
# PURPOSE: All model configuration options explained
# ============================================================

from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama

# ---- OpenAI Full Configuration ----
openai_llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,          # Creativity (0.0 to 1.0)
    max_tokens=1000,          # Max response length
    timeout=30,               # Stop if no response in 30 seconds
    max_retries=3,            # Retry 3 times if it fails
    # api_key="..."           # Or use OPENAI_API_KEY env var
)

# ---- Ollama Full Configuration ----
ollama_llm = ChatOllama(
    model="llama3.2",
    temperature=0.7,
    num_predict=1000,         # Max tokens to generate
    # base_url="http://localhost:11434"  # Default Ollama URL
    format="json",            # Force JSON output (optional)
)

# ---- Invoke With Additional Options ----
from langchain_core.messages import HumanMessage

response = openai_llm.invoke(
    [HumanMessage(content="Hello!")],
    # You can override config per-call:
    config={"configurable": {"temperature": 0.9}}  
)
```

---

## 🏭 Real Industry Examples

### Example 1: Customer Support Classification System

```python
# A company uses this to automatically route support tickets
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from enum import Enum
from dotenv import load_dotenv

load_dotenv()

class TicketCategory(str, Enum):
    BILLING = "billing"
    TECHNICAL = "technical"
    SHIPPING = "shipping"
    RETURNS = "returns"
    GENERAL = "general"

class SupportTicket(BaseModel):
    category: TicketCategory = Field(description="Category of the support ticket")
    priority: int = Field(description="Priority 1-5, where 5 is most urgent", ge=1, le=5)
    summary: str = Field(description="Brief summary of the issue")
    needs_human: bool = Field(description="Whether this needs a human agent")

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
classifier = llm.with_structured_output(SupportTicket)

# This runs for EVERY incoming support email
def classify_ticket(ticket_text: str) -> SupportTicket:
    return classifier.invoke(
        f"Classify this customer support ticket: {ticket_text}"
    )

# Test it
ticket = "My order #12345 hasn't arrived in 3 weeks! I need it urgently!"
result = classify_ticket(ticket)
print(f"Category: {result.category.value}")
print(f"Priority: {result.priority}/5")
print(f"Summary: {result.summary}")
print(f"Needs Human: {result.needs_human}")
```

---

## ⚠️ Common Mistakes & Debugging

### Mistake 1: Using Too High Temperature for Factual Tasks

```python
# ❌ WRONG: High temperature for data extraction
llm = ChatOpenAI(temperature=0.9)  # Will give inconsistent results!

# ✅ CORRECT: Low temperature for factual/extraction tasks
llm = ChatOpenAI(temperature=0.0)
```

### Mistake 2: Ignoring Token Limits

```python
# ❌ PROBLEM: Sending huge text without thinking about tokens
huge_text = open("my_1000_page_book.txt").read()
response = llm.invoke([HumanMessage(content=huge_text)])
# This might exceed context window and fail!

# ✅ SOLUTION: Check token count first, or use chunking (covered in RAG phase)
```

### Mistake 3: Hardcoding API Keys

```python
# ❌ DANGEROUS: Never do this!
llm = ChatOpenAI(api_key="sk-abc123realkey...")

# ✅ SAFE: Always use environment variables
import os
from dotenv import load_dotenv
load_dotenv()
llm = ChatOpenAI()  # Automatically reads OPENAI_API_KEY from .env
```

---

## 🧠 Quick Quiz

1. What's the difference between Chat Models and Completion Models?
2. If you want the AI to write a creative poem, what temperature would you use: 0.0 or 0.9?
3. If you want to extract data from a document accurately, what temperature?
4. About how many tokens is 1000 words?
5. What does `.stream()` do differently from `.invoke()`?
6. What Python library helps us define structured output schemas?

---

## 🎯 Mini Challenges

**Challenge 1**: Write a program that asks the user for a celebrity name and uses the AI to return structured information: name, birth year, famous for, nationality.

**Challenge 2**: Build a "temperature comparison tool" — ask the AI the same creative question at temperatures 0.0, 0.5, and 1.0. Print all three responses and compare them.

**Challenge 3**: Create a "recipe extractor" using structured output. Give it a recipe blog post (you can paste text or use a sample), and extract: recipe name, ingredients (as a list), prep time, cook time, and difficulty level.

---

## ✅ Phase 3 Recap

| Concept | What It Is | When To Use |
|---------|------------|-------------|
| ChatOpenAI | Cloud AI (OpenAI) | Production, powerful tasks |
| ChatOllama | Local AI (Ollama) | Development, free testing |
| Temperature | Controls creativity | 0.0=facts, 1.0=creative |
| Tokens | AI's unit of text | Monitor costs and limits |
| .invoke() | Get full response | Most cases |
| .stream() | Real-time streaming | Chat UIs, long responses |
| Structured Output | JSON/typed responses | Data extraction, APIs |

---

## 📁 Files Created In This Phase

```
LangChain_Course/
└── langchain_projects/
    └── models/
        ├── openai_models.py       ← OpenAI usage
        ├── ollama_models.py       ← Ollama usage
        ├── temperature_demo.py    ← Temperature comparison
        ├── token_counter.py       ← Token tracking
        ├── streaming_demo.py      ← Streaming
        ├── streaming_advanced.py  ← Advanced streaming
        ├── structured_output.py   ← Pydantic structured output
        ├── product_analyzer.py    ← Complex structured output
        └── model_config.py        ← Full configuration
```

---

## 🚀 What's Next?

In **Phase 4**, we master Prompt Engineering:
- Create reusable prompt templates with variables
- Build system prompts that make AI behave exactly how you want
- Learn role-based prompting
- Chain prompts together

> **Go to**: `Phase04_Prompts/lesson.md` →

---

*Phase 3 Complete! 🤖 You know how to talk to any AI model with LangChain!*
