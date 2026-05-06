# 🦜 LangChain Mastery — Quick Reference Cheat Sheet
> *Print this and keep it beside you while coding!*

---

## ⚡ Installation

```bash
pip install langchain langchain-core langchain-community
pip install langchain-openai langchain-ollama
pip install langgraph chromadb faiss-cpu pypdf
pip install fastapi uvicorn streamlit python-dotenv
```

---

## 🤖 Models

```python
# OpenAI
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

# Ollama (Local - FREE)
from langchain_ollama import ChatOllama
llm = ChatOllama(model="llama3.2", temperature=0.7)

# Run: ollama pull llama3.2
```

---

## 📝 Prompts

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Basic
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a {role}. Style: {style}."),
    ("human", "{question}")
])

# With memory placeholder
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are helpful."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])
```

---

## ⛓️ LCEL Chain Pattern

```python
from langchain_core.output_parsers import StrOutputParser

chain = prompt | llm | StrOutputParser()

# Invoke
result = chain.invoke({"role": "teacher", "question": "..."})

# Stream
for chunk in chain.stream({"role": "teacher", "question": "..."}):
    print(chunk, end="", flush=True)

# Async
result = await chain.ainvoke({"role": "teacher", "question": "..."})
```

---

## 🧠 Memory

```python
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

store = {}

def get_history(session_id: str):
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

chain_with_memory = RunnableWithMessageHistory(
    chain,
    get_history,
    input_messages_key="input",
    history_messages_key="history"
)

# Use it
response = chain_with_memory.invoke(
    {"input": "Hello!"},
    config={"configurable": {"session_id": "user_123"}}
)
```

---

## 🛠️ Tools

```python
from langchain_core.tools import tool

@tool
def my_tool(param: str) -> str:
    """Description the AI reads. Be clear about when to use this."""
    result = do_something(param)
    return str(result)

# Bind to model
llm_with_tools = llm.bind_tools([my_tool])

# Use ToolMessage for results
from langchain_core.messages import ToolMessage
messages.append(ToolMessage(
    content=tool_result,
    tool_call_id=tool_call["id"]
))
```

---

## 🤖 Agent Loop

```python
messages = [SystemMessage(...), HumanMessage(content=task)]

for _ in range(max_steps):
    response = llm_with_tools.invoke(messages)
    messages.append(response)
    
    if not response.tool_calls:
        break  # Done!
    
    for tc in response.tool_calls:
        result = tool_map[tc["name"]].invoke(tc["args"])
        messages.append(ToolMessage(
            content=str(result),
            tool_call_id=tc["id"]
        ))
```

---

## 📚 RAG Pipeline

```python
# 1. Load
from langchain_community.document_loaders import PyPDFLoader
docs = PyPDFLoader("file.pdf").load()

# 2. Split
from langchain.text_splitter import RecursiveCharacterTextSplitter
chunks = RecursiveCharacterTextSplitter(
    chunk_size=500, chunk_overlap=100
).split_documents(docs)

# 3. Embed & Store
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
vectorstore = Chroma.from_documents(
    chunks, OllamaEmbeddings(model="nomic-embed-text"),
    persist_directory="./db"
)

# 4. Retrieve
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# 5. RAG Chain
from langchain_core.runnables import RunnablePassthrough
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | rag_prompt | llm | StrOutputParser()
)
answer = rag_chain.invoke("What is the return policy?")
```

---

## 🕸️ LangGraph

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List
import operator

class State(TypedDict):
    messages: Annotated[List, operator.add]

def my_node(state: State) -> dict:
    # Process state, return ONLY changed fields
    return {"messages": [new_message]}

def route(state: State) -> str:
    # Return the name of next node or END
    return "next_node" if condition else END

graph = StateGraph(State)
graph.add_node("my_node", my_node)
graph.set_entry_point("my_node")
graph.add_conditional_edges("my_node", route, {
    "next_node": "next_node",
    END: END
})

app = graph.compile()
result = app.invoke({"messages": [HumanMessage(content="Hello")]})
```

---

## 📊 Structured Output

```python
from pydantic import BaseModel, Field
from typing import List

class MySchema(BaseModel):
    name: str = Field(description="Person's name")
    score: int = Field(description="Score 0-100", ge=0, le=100)
    tags: List[str] = Field(description="List of tags")

structured_llm = llm.with_structured_output(MySchema)
result = structured_llm.invoke("Extract from: John scored 95 on the test")
print(result.name, result.score)  # "John", 95
```

---

## 🔑 Environment Setup

```python
# .env file
OPENAI_API_KEY=sk-...
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls-...

# In code
from dotenv import load_dotenv
load_dotenv()
```

---

## ⚡ Async

```python
import asyncio

# Single async call
result = await chain.ainvoke(inputs)

# Multiple concurrent calls
results = await asyncio.gather(*[
    chain.ainvoke(inp) for inp in inputs
])

# Async streaming
async for chunk in chain.astream(inputs):
    print(chunk, end="")
```

---

## 🐛 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `ConnectionRefusedError` | Run `ollama serve` |
| `ModuleNotFoundError` | Activate venv: `.venv\Scripts\activate` |
| `KeyError: variable` | Match variable names in template exactly |
| `model not found` | Run `ollama pull model-name` first |
| `Rate limit exceeded` | Add delays or use async with throttling |
| Missing `MessagesPlaceholder` | Add it to ChatPromptTemplate |
| `session_id` missing | Add to `config={"configurable": {"session_id": "id"}}` |

---

## 📁 Project Structure

```
my_ai_app/
├── .env              # API keys (NEVER commit!)
├── .gitignore        # Include .env
├── requirements.txt  # pip freeze > requirements.txt
├── main.py           # Entry point
├── agents/           # Agent code
├── chains/           # Chain code
├── tools/            # Custom tools
├── memory/           # Memory management
├── prompts/          # Prompt templates
├── data/             # Documents and data
└── tests/            # Test files
```

---

*Keep this handy and refer to it while building your AI apps! 🚀*
