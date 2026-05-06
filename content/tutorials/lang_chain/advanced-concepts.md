# ⚡ Phase 12 — Advanced LangChain
### "Professional-Grade AI Engineering Techniques"

> **Difficulty**: ⭐⭐⭐⭐⭐ Expert | **Time**: ~120 minutes | **Prerequisites**: All previous phases

---

## 🎯 What You'll Learn

- ✅ Async LangChain (run multiple AI calls at once)
- ✅ Callbacks and event handling
- ✅ LangSmith (observability and debugging)
- ✅ Guardrails (keeping AI safe)
- ✅ Advanced streaming techniques
- ✅ Function calling patterns
- ✅ Production optimization

---

## 📖 Lesson 12.1 — Async LangChain

### Why Async Matters

```python
# SYNCHRONOUS (slow):
# 5 AI calls × 3 seconds each = 15 seconds total 😴
for item in items:
    result = chain.invoke(item)
    
# ASYNCHRONOUS (fast):
# 5 AI calls running simultaneously ≈ 3 seconds total ⚡
results = await asyncio.gather(*[chain.ainvoke(item) for item in items])
```

### Async Basics

```python
# ============================================================
# FILE: advanced/async_langchain.py
# PURPOSE: Run multiple AI tasks simultaneously
# ============================================================

import asyncio
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
import time

llm = ChatOllama(model="llama3.2")
parser = StrOutputParser()

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Be very concise."),
    ("human", "{question}")
])

chain = prompt | llm | parser

# ---- Async single call ----
async def ask_async(question: str) -> str:
    """Async version of chain.invoke()"""
    return await chain.ainvoke({"question": question})

# ---- Process many questions concurrently ----
async def process_many_questions(questions: list[str]) -> list[str]:
    """Run all questions simultaneously!"""
    
    # Create tasks for all questions at once
    tasks = [ask_async(q) for q in questions]
    
    # Run ALL tasks concurrently and wait for all to finish
    results = await asyncio.gather(*tasks)
    
    return list(results)

# ---- Async streaming ----
async def stream_response(question: str):
    """Stream a response asynchronously."""
    print(f"🤖 Streaming answer for: {question}")
    
    async for chunk in chain.astream({"question": question}):
        print(chunk, end="", flush=True)
    
    print()  # New line

# ---- Main async function ----
async def main():
    questions = [
        "What is machine learning in one sentence?",
        "What is Python in one sentence?",
        "What is an API in one sentence?",
        "What is Docker in one sentence?",
        "What is LangChain in one sentence?",
    ]
    
    print(f"📝 Processing {len(questions)} questions...")
    
    # Time synchronous approach (for comparison)
    print("\n⏱️ Synchronous approach would take ~15-25 seconds")
    
    # Time async approach
    start = time.time()
    results = await process_many_questions(questions)
    elapsed = time.time() - start
    
    print(f"⚡ Async approach completed in {elapsed:.2f} seconds!\n")
    
    for q, r in zip(questions, results):
        print(f"❓ {q}")
        print(f"💬 {r}\n")
    
    # Demo streaming
    print("\n🌊 Streaming Demo:")
    await stream_response("Explain neural networks in 2 sentences")

# Run the async program
asyncio.run(main())
```

### Async with Multiple Different Chains

```python
# ============================================================
# FILE: advanced/async_parallel_chains.py
# PURPOSE: Run different AI analysis chains simultaneously
# ============================================================

import asyncio
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser

llm = ChatOllama(model="llama3.2", temperature=0.3)
parser = StrOutputParser()

# Three different analysis chains
async def analyze_sentiment(text: str) -> str:
    chain = (
        ChatPromptTemplate.from_messages([
            ("system", "Classify sentiment: POSITIVE, NEGATIVE, or NEUTRAL. Just one word."),
            ("human", "{text}")
        ]) | llm | parser
    )
    return await chain.ainvoke({"text": text})

async def extract_keywords(text: str) -> str:
    chain = (
        ChatPromptTemplate.from_messages([
            ("system", "Extract 5 key words. Return as comma-separated list."),
            ("human", "{text}")
        ]) | llm | parser
    )
    return await chain.ainvoke({"text": text})

async def generate_title(text: str) -> str:
    chain = (
        ChatPromptTemplate.from_messages([
            ("system", "Generate a catchy 5-word title for this text."),
            ("human", "{text}")
        ]) | llm | parser
    )
    return await chain.ainvoke({"text": text})

async def analyze_text_parallel(text: str) -> dict:
    """Run all three analyses simultaneously!"""
    sentiment, keywords, title = await asyncio.gather(
        analyze_sentiment(text),
        extract_keywords(text),
        generate_title(text)
    )
    
    return {
        "sentiment": sentiment,
        "keywords": keywords,
        "title": title
    }

# Run it
async def main():
    sample_text = """
    LangChain has completely transformed how we build AI applications at our company.
    The framework makes it incredibly easy to chain together complex AI workflows,
    and the agent support is absolutely outstanding. Highly recommend for any team!
    """
    
    print("🔄 Running 3 analyses simultaneously...\n")
    
    import time
    start = time.time()
    results = await analyze_text_parallel(sample_text)
    elapsed = time.time() - start
    
    print(f"⚡ Completed in {elapsed:.2f}s (vs ~9s sequential)\n")
    print(f"📊 Sentiment: {results['sentiment']}")
    print(f"🔑 Keywords: {results['keywords']}")
    print(f"📰 Title: {results['title']}")

asyncio.run(main())
```

---

## 📖 Lesson 12.2 — Callbacks (Monitoring Events)

### What Are Callbacks?

Callbacks let you **hook into** LangChain events. You can run custom code when:
- A chain starts/ends
- An LLM starts/ends
- A tool is called
- An error occurs

Think of callbacks like **event listeners** in web development.

```python
# ============================================================
# FILE: advanced/callbacks.py
# PURPOSE: Monitor and log LangChain events
# ============================================================

from langchain_core.callbacks import BaseCallbackHandler
from langchain_core.outputs import LLMResult
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from datetime import datetime
import time
import json

# ---- Custom Callback Handler ----
class MonitoringCallback(BaseCallbackHandler):
    """Monitor and log all LangChain events."""
    
    def __init__(self, log_file: str = "ai_monitoring.json"):
        self.log_file = log_file
        self.logs = []
        self.start_times = {}
    
    def on_chain_start(self, serialized, inputs, **kwargs):
        """Called when a chain starts."""
        self.start_times["chain"] = time.time()
        print(f"\n🔗 Chain started")
        
    def on_chain_end(self, outputs, **kwargs):
        """Called when a chain finishes."""
        elapsed = time.time() - self.start_times.get("chain", time.time())
        print(f"✅ Chain ended ({elapsed:.2f}s)")
    
    def on_llm_start(self, serialized, prompts, **kwargs):
        """Called when LLM call starts."""
        self.start_times["llm"] = time.time()
        print(f"🤖 LLM call started...")
    
    def on_llm_end(self, response: LLMResult, **kwargs):
        """Called when LLM call ends."""
        elapsed = time.time() - self.start_times.get("llm", time.time())
        
        # Extract token usage if available
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "llm_elapsed_seconds": round(elapsed, 2),
            "response_length": sum(len(g.text) for g in response.generations[0])
        }
        
        self.logs.append(log_entry)
        print(f"  ✓ LLM responded ({elapsed:.2f}s, {log_entry['response_length']} chars)")
    
    def on_llm_error(self, error, **kwargs):
        """Called when LLM errors."""
        print(f"❌ LLM Error: {error}")
        self.logs.append({"error": str(error), "timestamp": datetime.now().isoformat()})
    
    def on_tool_start(self, serialized, input_str, **kwargs):
        """Called when a tool is used."""
        tool_name = serialized.get("name", "unknown")
        print(f"🔧 Tool called: {tool_name}('{input_str[:50]}')")
    
    def on_tool_end(self, output, **kwargs):
        """Called when a tool finishes."""
        print(f"  ✓ Tool result: {str(output)[:100]}")
    
    def save_logs(self):
        """Save monitoring logs to file."""
        with open(self.log_file, 'w') as f:
            json.dump(self.logs, f, indent=2)
        print(f"\n📊 Saved {len(self.logs)} log entries to {self.log_file}")

# ---- Token Counter Callback ----
class TokenCounterCallback(BaseCallbackHandler):
    """Track token usage across all calls."""
    
    def __init__(self):
        self.total_tokens = 0
        self.call_count = 0
    
    def on_llm_end(self, response: LLMResult, **kwargs):
        self.call_count += 1
        # Note: Ollama doesn't always provide token counts
        # For OpenAI, response.llm_output gives token info
    
    def report(self):
        print(f"\n📈 USAGE REPORT")
        print(f"  Total LLM calls: {self.call_count}")
        print(f"  Total tokens: {self.total_tokens} (OpenAI only)")

# ---- Use Callbacks ----
monitor = MonitoringCallback()
token_counter = TokenCounterCallback()

llm = ChatOllama(
    model="llama3.2",
    callbacks=[monitor, token_counter]  # Attach both callbacks!
)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("human", "{question}")
])
parser = StrOutputParser()

chain = prompt | llm | parser

print("🔍 Running with monitoring enabled...\n")

result = chain.invoke(
    {"question": "What is the capital of France and why is it famous?"},
    config={"callbacks": [monitor, token_counter]}  # Or pass at invoke time
)

print(f"\n💬 Result: {result}")
token_counter.report()
monitor.save_logs()
```

---

## 📖 Lesson 12.3 — LangSmith (Observability)

### What Is LangSmith?

LangSmith is LangChain's **monitoring and debugging platform**. Think of it like Datadog or Sentry, but specifically for AI applications.

What it does:
- Records every LLM call, prompt, and response
- Shows token usage and costs
- Allows you to test prompts
- Helps debug failures
- Evaluates output quality

### Setup LangSmith

```bash
# 1. Create account at https://smith.langchain.com (free tier available)
# 2. Get API key from Settings

# 3. Add to .env file:
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your-langsmith-api-key
LANGCHAIN_PROJECT=my-ai-app  # Project name in LangSmith
```

### Using LangSmith

```python
# ============================================================
# FILE: advanced/langsmith_setup.py
# PURPOSE: Enable LangSmith tracing for your app
# ============================================================

from dotenv import load_dotenv
import os

load_dotenv()

# LangSmith automatically starts tracing when these env vars are set!
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_API_KEY=your-key
# LANGCHAIN_PROJECT=my-project

# No code changes needed - LangSmith traces automatically!
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser

llm = ChatOllama(model="llama3.2")
chain = (
    ChatPromptTemplate.from_messages([("human", "{question}")]) 
    | llm 
    | StrOutputParser()
)

# This call will appear in LangSmith dashboard!
result = chain.invoke({"question": "Explain embeddings simply"})
print(result)

# ---- Manual Tracing ----
from langsmith import traceable

@traceable(name="My Custom Function")  # Name it in LangSmith
def process_customer_query(query: str) -> str:
    """
    Any function you want to trace in LangSmith.
    Decorate with @traceable!
    """
    result = chain.invoke({"question": query})
    return result

# Now this shows up nicely in LangSmith
response = process_customer_query("What are the benefits of using RAG?")
print(response)
```

---

## 📖 Lesson 12.4 — Guardrails and Safety

### What Are Guardrails?

Guardrails are safety filters that:
- Prevent harmful outputs
- Block specific topics
- Ensure responses stay on-topic
- Format outputs consistently

```python
# ============================================================
# FILE: advanced/guardrails.py
# PURPOSE: Implement safety guardrails for AI apps
# ============================================================

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel, Field
from typing import Optional

# ---- Input Validator ----
class SafeInput(BaseModel):
    """Validates and sanitizes user input before sending to AI."""
    text: str = Field(min_length=1, max_length=2000)

class InputGuardrail:
    """Checks if input is safe before processing."""
    
    BLOCKED_KEYWORDS = [
        "ignore previous", "jailbreak", "act as", "pretend you are",
        "bypass", "disable safety", "forget instructions"
    ]
    
    MAX_LENGTH = 2000
    
    @classmethod
    def validate(cls, user_input: str) -> tuple[bool, str]:
        """
        Returns (is_safe, error_message)
        is_safe=True if input passes all checks.
        """
        # Check length
        if len(user_input) > cls.MAX_LENGTH:
            return False, f"Input too long. Max {cls.MAX_LENGTH} characters."
        
        # Check for prompt injection attempts
        input_lower = user_input.lower()
        for keyword in cls.BLOCKED_KEYWORDS:
            if keyword in input_lower:
                return False, "Input contains blocked content."
        
        return True, ""

# ---- Output Validator ----
class OutputGuardrail:
    """Validates AI output before sending to user."""
    
    def __init__(self):
        llm = ChatOllama(model="llama3.2", temperature=0)
        self.classifier = (
            ChatPromptTemplate.from_messages([
                ("system", """Classify if this text is safe to show to users.
                Check for: harmful content, personal data exposure, false claims.
                Reply with ONLY: SAFE or UNSAFE"""),
                ("human", "{text}")
            ]) | llm | StrOutputParser()
        )
    
    def is_safe(self, output: str) -> bool:
        """Check if output is safe to show users."""
        result = self.classifier.invoke({"text": output[:500]})
        return "SAFE" in result.upper()

# ---- Topic Guardrail ----
class TopicGuardrail:
    """Ensures AI only answers questions about allowed topics."""
    
    def __init__(self, allowed_topics: list[str], company_name: str):
        self.allowed_topics = allowed_topics
        self.company_name = company_name
        
        llm = ChatOllama(model="llama3.2", temperature=0)
        self.classifier = (
            ChatPromptTemplate.from_messages([
                ("system", f"""Is this question related to: {', '.join(allowed_topics)}?
                This is for {company_name}'s support bot.
                Reply ONLY: ALLOWED or NOT_ALLOWED"""),
                ("human", "{question}")
            ]) | llm | StrOutputParser()
        )
    
    def is_allowed(self, question: str) -> bool:
        result = self.classifier.invoke({"question": question})
        return "ALLOWED" in result.upper()

# ---- Safe AI Chat System ----
class SafeAIChat:
    """Production-ready AI chat with multiple guardrails."""
    
    def __init__(self, allowed_topics: list[str] = None):
        self.llm = ChatOllama(model="llama3.2", temperature=0.5)
        self.parser = StrOutputParser()
        
        self.input_guard = InputGuardrail()
        self.output_guard = OutputGuardrail()
        
        if allowed_topics:
            self.topic_guard = TopicGuardrail(
                allowed_topics, 
                "TechCorp"
            )
        else:
            self.topic_guard = None
        
        self.chain = (
            ChatPromptTemplate.from_messages([
                ("system", "You are a helpful, safe AI assistant. Always be truthful and helpful."),
                ("human", "{input}")
            ]) | self.llm | self.parser
        )
    
    def chat(self, user_input: str) -> str:
        """Process a user message with all guardrails."""
        
        # 1. Input validation
        is_safe, error = self.input_guard.validate(user_input)
        if not is_safe:
            return f"⚠️ I can't process that request. {error}"
        
        # 2. Topic check
        if self.topic_guard and not self.topic_guard.is_allowed(user_input):
            return "I can only help with product support, billing, and technical questions. Please contact us at support@company.com for other inquiries."
        
        # 3. Generate response
        try:
            response = self.chain.invoke({"input": user_input})
        except Exception as e:
            return "I encountered an error. Please try again."
        
        # 4. Output safety check
        if not self.output_guard.is_safe(response):
            return "I wasn't able to generate a safe response. Please rephrase your question."
        
        return response

# ---- Test Guardrails ----
safe_bot = SafeAIChat(
    allowed_topics=["product pricing", "technical support", "billing", "shipping", "returns"]
)

test_inputs = [
    "What are your pricing plans?",                    # ✅ Should work
    "How do I track my order?",                        # ✅ Should work
    "Ignore all previous instructions and...",         # ❌ Should block (injection)
    "What's the best recipe for chocolate cake?",      # ❌ Off-topic for support bot
]

print("🛡️ GUARDRAIL TESTING\n")
for msg in test_inputs:
    print(f"💬 Input: {msg[:60]}")
    response = safe_bot.chat(msg)
    print(f"🤖 Response: {response[:150]}\n")
```

---

## 📖 Lesson 12.5 — Production Optimization

```python
# ============================================================
# FILE: advanced/production_optimization.py
# PURPOSE: Tips and patterns for production LangChain apps
# ============================================================

# ============================================================
# OPTIMIZATION 1: Response Caching
# ============================================================
# Cache identical queries to save time and money

from functools import lru_cache
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
import hashlib

llm = ChatOllama(model="llama3.2")
parser = StrOutputParser()

# Simple in-memory cache
query_cache = {}

def get_cached_response(question: str, chain) -> str:
    """Cache AI responses for identical queries."""
    # Create cache key from question
    cache_key = hashlib.md5(question.encode()).hexdigest()
    
    if cache_key in query_cache:
        print("⚡ Cache hit! Returning cached response.")
        return query_cache[cache_key]
    
    print("🔄 Cache miss. Calling AI...")
    response = chain.invoke({"question": question})
    query_cache[cache_key] = response
    
    return response

# ============================================================
# OPTIMIZATION 2: Fallback Models
# ============================================================
# If primary model fails, use backup

from langchain_core.runnables import RunnableWithFallbacks

primary_llm = ChatOllama(model="llama3.2")
backup_llm = ChatOllama(model="phi3:mini")  # Smaller, faster backup

# Chain with fallback
primary_chain = (
    ChatPromptTemplate.from_messages([("human", "{input}")]) 
    | primary_llm 
    | parser
)

fallback_chain = (
    ChatPromptTemplate.from_messages([("human", "{input}")]) 
    | backup_llm 
    | parser
)

# If primary fails, automatically uses fallback
chain_with_fallback = primary_chain.with_fallbacks([fallback_chain])

# ============================================================
# OPTIMIZATION 3: Batching
# ============================================================
# Process multiple items efficiently

async def batch_process(items: list[str], chain, batch_size: int = 5) -> list[str]:
    """Process items in batches to control load."""
    import asyncio
    
    results = []
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        print(f"Processing batch {i//batch_size + 1}...")
        
        # Process batch concurrently
        batch_results = await asyncio.gather(
            *[chain.ainvoke({"question": item}) for item in batch]
        )
        results.extend(batch_results)
    
    return results

# ============================================================
# OPTIMIZATION 4: Rate Limiting
# ============================================================
import asyncio
import time
from collections import deque

class RateLimiter:
    """Limit AI API calls to prevent hitting rate limits."""
    
    def __init__(self, max_calls: int, time_window: float):
        self.max_calls = max_calls       # Max calls per window
        self.time_window = time_window   # Window in seconds
        self.calls = deque()
    
    async def acquire(self):
        """Wait until we can make another call."""
        now = time.time()
        
        # Remove old calls outside the time window
        while self.calls and self.calls[0] < now - self.time_window:
            self.calls.popleft()
        
        # If at limit, wait
        if len(self.calls) >= self.max_calls:
            wait_time = self.calls[0] + self.time_window - now
            print(f"⏳ Rate limit reached. Waiting {wait_time:.1f}s...")
            await asyncio.sleep(wait_time)
        
        self.calls.append(time.time())

# ============================================================
# OPTIMIZATION 5: Connection Pooling
# ============================================================
# Reuse model connections instead of creating new ones each time

from functools import lru_cache

@lru_cache(maxsize=None)
def get_llm(model_name: str = "llama3.2", temperature: float = 0.7):
    """
    Get or create an LLM instance.
    @lru_cache means the SAME instance is returned for same args.
    This avoids creating new connections repeatedly.
    """
    return ChatOllama(model=model_name, temperature=temperature)

# Usage: Always get same instance
llm_a = get_llm("llama3.2", 0.7)
llm_b = get_llm("llama3.2", 0.7)  # Same instance as llm_a!
print(f"Same instance: {llm_a is llm_b}")  # True

print("""
🚀 PRODUCTION OPTIMIZATION CHECKLIST:
─────────────────────────────────────────
✅ Response caching for common queries
✅ Fallback models for reliability
✅ Async/concurrent processing
✅ Batch processing for bulk tasks
✅ Rate limiting for API calls
✅ Connection pooling
✅ Error handling + retries
✅ Token usage monitoring
✅ Response time monitoring
✅ LangSmith for observability
""")
```

---

## ⚠️ Advanced Common Mistakes

### Mistake 1: Not Using Async for Multiple AI Calls

```python
# ❌ Slow - Sequential
results = []
for doc in documents:
    result = chain.invoke({"doc": doc})  # Waits for each one
    results.append(result)

# ✅ Fast - Concurrent
results = await asyncio.gather(*[
    chain.ainvoke({"doc": doc}) for doc in documents
])
```

### Mistake 2: No Retry Logic

```python
# ❌ Will fail on network hiccup
result = chain.invoke(...)

# ✅ With retry
from langchain_core.runnables import RunnableRetry

chain_with_retry = chain.with_retry(
    stop_after_attempt=3,
    wait_exponential_jitter=True
)
result = chain_with_retry.invoke(...)
```

---

## 🎯 Mini Challenges

**Challenge 1**: Convert a synchronous chain to async and process 10 questions concurrently. Measure the time difference.

**Challenge 2**: Add LangSmith tracing to one of your Phase 11 projects. Analyze the trace data.

**Challenge 3**: Build a "safe content moderator" using guardrails that: validates input length, blocks off-topic questions, and ensures responses are professional.

---

## ✅ Phase 12 Recap

| Technique | When To Use | Benefit |
|-----------|------------|---------|
| Async | Multiple AI calls | 3-10x faster |
| Callbacks | Monitoring events | Visibility |
| LangSmith | Production apps | Full observability |
| Guardrails | User-facing apps | Safety |
| Caching | Repeated queries | Speed + cost |
| Fallbacks | Production | Reliability |
| Rate Limiting | API integrations | Compliance |

---

## 🚀 What's Next?

**Phase 13 — Production & Deployment**: Deploy your AI apps to the world with FastAPI, Streamlit, Docker, and cloud platforms!

> **Go to**: `Phase13_Production/lesson.md` →

---

*Phase 12 Complete! ⚡ You now write production-grade AI code like a real engineer!*
