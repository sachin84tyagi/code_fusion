# Phase 10 — RAG with LangChain: Chains, LCEL & Conversational RAG

> **Level:** Intermediate-Advanced | **Goal:** Use LangChain's powerful built-in RAG patterns including memory and multi-turn conversations

---

## 1. Why LangChain for RAG?

LangChain is the most popular framework for building RAG systems. It provides:

- **Document Loaders:** 100+ connectors (PDF, Web, SQL, Notion, S3...)
- **Text Splitters:** Smart chunking strategies
- **Embedding integrations:** OpenAI, HuggingFace, Ollama, Cohere...
- **Vector Store integrations:** Chroma, Pinecone, FAISS, Weaviate, pgvector...
- **Pre-built RAG Chains:** Ready to use in 5 lines of code
- **LCEL:** LangChain Expression Language — chain components with `|` pipes
- **Memory:** Track conversation history across multiple questions

---

## 2. LangChain RAG Architecture

```
┌─────────────────────────────────────────────────────────┐
│              LangChain RAG Architecture                  │
│                                                         │
│  [Document Loaders]  →  [Text Splitters]               │
│         ↓                                               │
│  [Embedding Models]  →  [Vector Stores]                 │
│         ↓                                               │
│  [Retrievers]  →  [Prompt Templates]  →  [LLMs]        │
│         ↓                                               │
│  [Output Parsers]  →  Final Answer                      │
│                                                         │
│  All connected with LCEL (|) pipes                      │
└─────────────────────────────────────────────────────────┘
```

---

## 3. LCEL — LangChain Expression Language

LCEL lets you build pipelines using the `|` (pipe) operator. It's like a data assembly line.

```python
# Without LCEL (traditional way):
context = retriever.get_relevant_documents(question)
prompt_text = prompt.format(context=context, question=question)
answer = llm.invoke(prompt_text)
parsed = output_parser.parse(answer)

# With LCEL (modern way):
chain = retriever | prompt | llm | output_parser
answer = chain.invoke({"question": "What is the refund policy?"})

# Same result — much cleaner!
```

The `|` pipe passes the output of one component as input to the next. Just like Unix pipes in the terminal!

---

## 4. Building a Basic LangChain RAG Chain

```python
# langchain_rag_basic.py

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.documents import Document

# ============================================================
# STEP 1: Set up vector store
# ============================================================
documents = [
    Document(page_content="Refunds are accepted within 30 days of purchase with receipt."),
    Document(page_content="Free shipping on all orders over $75 in the United States."),
    Document(page_content="Enterprise plans include dedicated account manager and SLA guarantee."),
    Document(page_content="Two-factor authentication can be enabled in Account > Security settings."),
    Document(page_content="Our API supports REST and GraphQL. Rate limit: 1000 requests per minute."),
]

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma.from_documents(documents=documents, embedding=embeddings)

# ============================================================
# STEP 2: Create retriever
# ============================================================
retriever = vector_store.as_retriever(search_kwargs={"k": 3})

# ============================================================
# STEP 3: Create prompt template
# ============================================================
prompt = ChatPromptTemplate.from_template("""
You are a helpful AI assistant. Answer ONLY based on the context provided.
If the context doesn't contain the answer, say "I don't have that information."

Context:
{context}

Question: {question}

Answer:""")

# ============================================================
# STEP 4: Set up LLM
# ============================================================
llm = OllamaLLM(model="llama3.2")

# ============================================================
# STEP 5: Build the LCEL chain
# ============================================================

def format_docs(docs):
    """Join retrieved documents into a single string."""
    return "\n\n".join([doc.page_content for doc in docs])

# The chain using LCEL pipe syntax
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# ============================================================
# STEP 6: Run it!
# ============================================================
questions = [
    "What is the refund policy?",
    "How do I enable 2FA?",
    "What is the API rate limit?",
]

for question in questions:
    print(f"\nQ: {question}")
    answer = rag_chain.invoke(question)
    print(f"A: {answer}")
    print("-" * 50)
```

### Understanding the LCEL Chain

```python
rag_chain = (
    {
        "context": retriever | format_docs,
        # ↑ Run retriever on the input question
        #   Then pipe results through format_docs to get a string
        
        "question": RunnablePassthrough()
        # ↑ Pass the original question through unchanged
    }
    | prompt
    # ↑ Use "context" and "question" to fill the prompt template
    
    | llm
    # ↑ Send the filled prompt to the LLM
    
    | StrOutputParser()
    # ↑ Convert LLM output to a clean string
)
```

---

## 5. Conversational RAG — Adding Memory

This is the most important upgrade! Without memory, every question is treated independently. With memory, the AI remembers the conversation history.

```
Without Memory:
User: "What is the refund policy?"
AI: "Refunds accepted within 30 days."
User: "What if I paid with PayPal?"
AI: "What refund policy are you referring to?"  ← FORGOT!

With Memory:
User: "What is the refund policy?"
AI: "Refunds accepted within 30 days."
User: "What if I paid with PayPal?"
AI: "For PayPal payments, the same 30-day refund window applies,
     and the refund is credited back to your PayPal account."  ← REMEMBERED!
```

```python
# conversational_rag.py

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.documents import Document

# ============================================================
# STEP 1: Build knowledge base
# ============================================================
documents = [
    Document(page_content="Refunds accepted within 30 days. PayPal refunds credit back to the original PayPal account."),
    Document(page_content="Credit card refunds take 5-7 business days to appear on your statement."),
    Document(page_content="For digital products, we offer store credit instead of refunds after download."),
    Document(page_content="Enterprise customers have a 60-day refund window with dedicated support."),
]

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma.from_documents(documents=documents, embedding=embeddings)
retriever = vector_store.as_retriever(search_kwargs={"k": 3})

# ============================================================
# STEP 2: Create a "question rephrasing" chain
# (Rephrases user question considering chat history)
# ============================================================
llm = OllamaLLM(model="llama3.2")

contextualize_prompt = ChatPromptTemplate.from_messages([
    ("system", """Given a chat history and the user's latest question,
rephrase the question to be a standalone question that doesn't need the chat history.
Do NOT answer the question. Just rephrase it if needed, or return it unchanged."""),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
])

# This chain rephrases vague questions using chat history
contextualize_chain = contextualize_prompt | llm | StrOutputParser()

# ============================================================
# STEP 3: Create the main QA chain with history
# ============================================================
qa_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a helpful AI assistant. Answer using ONLY the context below.
If not in context, say "I don't have that information."

Context:
{context}"""),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
])

def format_docs(docs):
    return "\n\n".join([doc.page_content for doc in docs])

qa_chain = (
    RunnablePassthrough.assign(
        context=lambda x: format_docs(retriever.invoke(
            contextualize_chain.invoke({
                "input": x["input"],
                "chat_history": x["chat_history"]
            }) if x["chat_history"] else x["input"]
        ))
    )
    | qa_prompt
    | llm
    | StrOutputParser()
)

# ============================================================
# STEP 4: Run a multi-turn conversation
# ============================================================
chat_history = []  # This keeps track of the conversation

def chat(question: str) -> str:
    """Send a question and get an answer, maintaining conversation history."""
    answer = qa_chain.invoke({
        "input": question,
        "chat_history": chat_history
    })
    
    # Add this exchange to history
    chat_history.append(HumanMessage(content=question))
    chat_history.append(AIMessage(content=answer))
    
    return answer

# Simulate a conversation
print("=" * 60)
print("Conversational RAG Demo")
print("=" * 60)

q1 = "What is the refund policy?"
a1 = chat(q1)
print(f"\nUser: {q1}")
print(f"AI:   {a1}")

q2 = "What if I paid with PayPal?"  # Vague! Needs history to understand
a2 = chat(q2)
print(f"\nUser: {q2}")
print(f"AI:   {a2}")

q3 = "How long does that take?"  # Even vaguer — needs full history!
a3 = chat(q3)
print(f"\nUser: {q3}")
print(f"AI:   {a3}")
```

---

## 6. Complete Company Knowledge Assistant

```python
# company_assistant.py
# Full-featured company knowledge chatbot with memory

import os
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_ollama import OllamaLLM
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.messages import HumanMessage, AIMessage

class CompanyAssistant:
    """A complete conversational company knowledge assistant."""
    
    def __init__(self, docs_folder: str, vector_db_path: str = "./company_db"):
        self.docs_folder = docs_folder
        self.vector_db_path = vector_db_path
        self.chat_history = []
        self._setup()
    
    def _setup(self):
        """Initialize all components."""
        print("[Setup] Initializing Company Assistant...")
        
        # Embeddings
        self.embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
        
        # Load or build vector store
        if os.path.exists(self.vector_db_path):
            print("[Setup] Loading existing knowledge base...")
            self.vector_store = Chroma(
                persist_directory=self.vector_db_path,
                embedding_function=self.embeddings
            )
        else:
            print("[Setup] Building new knowledge base from documents...")
            self._build_knowledge_base()
        
        # Retriever
        self.retriever = self.vector_store.as_retriever(search_kwargs={"k": 4})
        
        # LLM
        self.llm = OllamaLLM(model="llama3.2", temperature=0)
        
        # Build chain
        self._build_chain()
        
        print("[Setup] Ready!\n")
    
    def _build_knowledge_base(self):
        """Load documents, chunk, embed, and store."""
        loader = DirectoryLoader(self.docs_folder, glob="**/*.txt", loader_cls=TextLoader)
        documents = loader.load()
        
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = splitter.split_documents(documents)
        
        self.vector_store = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=self.vector_db_path
        )
    
    def _build_chain(self):
        """Build the conversational RAG chain."""
        
        prompt = ChatPromptTemplate.from_template("""
You are the company's AI assistant. You are professional, helpful, and accurate.
ONLY answer based on the context provided below.
If you don't have the information, say: "I don't have that information in our knowledge base."

Company Knowledge Base:
{context}

Conversation History:
{history}

Current Question: {question}

Your Answer:""")
        
        def format_docs(docs):
            return "\n\n".join([
                f"[Source: {doc.metadata.get('source', 'company docs')}]\n{doc.page_content}"
                for doc in docs
            ])
        
        def format_history(history):
            if not history:
                return "No previous conversation."
            lines = []
            for msg in history[-6:]:  # Last 3 exchanges
                role = "User" if isinstance(msg, HumanMessage) else "Assistant"
                lines.append(f"{role}: {msg.content}")
            return "\n".join(lines)
        
        self.chain = (
            {
                "context": lambda x: format_docs(self.retriever.invoke(x["question"])),
                "history": lambda x: format_history(x["history"]),
                "question": lambda x: x["question"]
            }
            | prompt
            | self.llm
            | StrOutputParser()
        )
    
    def ask(self, question: str) -> str:
        """Ask a question and get a grounded answer."""
        answer = self.chain.invoke({
            "question": question,
            "history": self.chat_history
        })
        
        self.chat_history.append(HumanMessage(content=question))
        self.chat_history.append(AIMessage(content=answer))
        
        return answer
    
    def reset_conversation(self):
        """Start a fresh conversation."""
        self.chat_history = []
        print("[Chat] Conversation reset.")
    
    def run_interactive(self):
        """Run an interactive terminal chat."""
        print("Company AI Assistant — Type 'quit' to exit, 'reset' to clear history")
        print("=" * 60)
        
        while True:
            user_input = input("\nYou: ").strip()
            
            if not user_input:
                continue
            elif user_input.lower() == "quit":
                print("Goodbye!")
                break
            elif user_input.lower() == "reset":
                self.reset_conversation()
            else:
                answer = self.ask(user_input)
                print(f"\nAssistant: {answer}")
```

---

## 7. Common LangChain RAG Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Not using `RunnablePassthrough()` | Input question lost in chain | Pass it through explicitly |
| Forgetting to format_docs | Retriever returns Documents, not strings | Always join with `\n\n` |
| Not limiting history length | Context window overflow | Keep last 3-5 exchanges only |
| Using wrong prompt format | LLM misunderstands the task | Test prompts separately |
| Not initializing chat_history as [] | TypeError on first message | Always initialize `chat_history = []` |

---

## 8. Mini Challenge

1. Run `langchain_rag_basic.py`
2. Ask 3 different questions and see the answers
3. Now run `conversational_rag.py`
4. Have a 4-turn conversation where each question builds on the previous one
5. Notice how the AI maintains context! Describe what's different.

---

## Quick Recap

| Concept | Explanation |
|---------|-------------|
| LCEL | Pipe operator (`\|`) for chaining components elegantly |
| `RunnablePassthrough` | Passes input unchanged to the next step |
| `format_docs` | Helper that joins retrieved Document objects into a string |
| Chat History | List of `HumanMessage` + `AIMessage` objects |
| Contextualize Chain | Rephrases vague questions using chat history |
| `MessagesPlaceholder` | A prompt variable that accepts a list of messages |

---

> **Up Next: Phase 11 — RAG with LangGraph**
> Build stateful, workflow-based RAG systems with branching logic and reflection loops.
