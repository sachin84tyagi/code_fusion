## RAG-Ollama 

```python
import os

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

def main():
    print("Starting Simple Local RAG Pipeline...")

    # 1. LOAD DATA
    print("\n[1/5] Loading Document...")
    #with open("company_policy.txt", "w", encoding="utf-8") as f:
        #f.write("The company dress code is casual on Fridays. Free pizza is provided on the last Friday of every month.")
    documents = TextLoader("company_policy.txt", encoding="utf-8").load()

    # 2. CHUNK DATA
    print("[2/5] Splitting text...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=50, chunk_overlap=10)
    chunks = text_splitter.split_documents(documents)

    # 3. EMBEDDINGS & VECTOR STORE
    print("[3/5] Setting up Vector Store (using nomic-embed-text)...")
    embeddings_model = OllamaEmbeddings(model="nomic-embed-text") 
    vector_store = Chroma.from_documents(chunks, embeddings_model, persist_directory="./chroma_db_simple")
    retriever = vector_store.as_retriever(search_kwargs={"k": 2})

    # 4. PROMPT & LLM
    print("[4/5] Setting up AI Model (using llama3.2)...")
    llm = ChatOllama(model="llama3.2", temperature=0)
    
    template = """Answer the question using ONLY the context below. If you don't know, say "I don't know".
    Context: {context}
    Question: {question}
    Answer:"""
    prompt = ChatPromptTemplate.from_template(template)

    # 5. RAG CHAIN
    print("[5/5] Building Pipeline and Asking Question...\n")
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser() 
    )

    #question = "What happens on the last Friday of the month?"
    #question = "When can I get free pizza?"
    question = "Can you give me free pizza?"
    print(f"QUESTION: {question}")
    
    try:
        answer = rag_chain.invoke(question)
        print(f"ANSWER: {answer}")
    except Exception as e:
        print(f"\nERROR: {e}")

if __name__ == "__main__":
    main()
```

Here is a step-by-step, line-by-line explanation of the code, written in simple language for beginners learning about AI and RAG (Retrieval-Augmented Generation).

Think of RAG like giving a smart but forgetful student (the AI) an open book before asking them a question. First, we need to load the book, chop it into manageable paragraphs, save it in a special searchable library, and then whenever we ask a question, we first find the right paragraph, hand it to the student, and say, "Answer the question using *only* this paragraph."

---

### Part 1: Bringing in the Tools (Imports)
At the very top of our script, we tell Python which external tools (libraries) we want to use. We use a popular framework called **LangChain** to help connect all the pieces.

```python
import os
```
* **Line 1:** Imports Python's built-in tool for interacting with the computer's operating system (like checking file paths or setting environment variables).

```python
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
```
* **Line 3:** Brings in a tool called `TextLoader`. Its only job is to open a simple text file and read its contents so the code can use it.
* **Line 4:** Brings in a tool called `RecursiveCharacterTextSplitter`. This tool acts like scissors. It takes a huge wall of text and chops it up into smaller, bite-sized paragraphs (or "chunks"). 

```python
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_community.vectorstores import Chroma
```
* **Line 5:** Brings in two tools from Ollama (which lets you run AI models locally on your own computer). `ChatOllama` is the chatbot brain that will talk to us, and `OllamaEmbeddings` translates our human text into numbers that a computer can understand.
* **Line 6:** Brings in `Chroma`. This is a special type of database (a Vector Store) that is designed to store the number-translated text so it can be searched incredibly fast.

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
```
* **Line 7:** Brings in `ChatPromptTemplate`. This lets us create a fill-in-the-blank template for the instructions we give to the AI.
* **Line 8:** Brings in `RunnablePassthrough`. This is a plumbing piece. It basically says, "Take the data you just received and pass it straight through to the next step without changing it."
* **Line 9:** Brings in `StrOutputParser`. A chatbot usually spits out a complex data object. This tool strips away all the messy computer data and gives us back just the plain, readable text string answer.

---

### Part 2: Starting Up & Step 1: Loading Data
```python
def main():
    print("Starting Simple Local RAG Pipeline...")
```
* **Lines 11-12:** We create our main function where all the action happens, and print a message to the screen so we know it started.

```python
    # 1. LOAD DATA
    print("\n[1/5] Loading Document...")
    #with open("company_policy.txt", "w", encoding="utf-8") as f:
        #f.write("The company dress code is casual on Fridays. Free pizza is provided on the last Friday of every month.")
    documents = TextLoader("company_policy.txt", encoding="utf-8").load()
```
* **Lines 14-17:** Comments and a print statement. (The lines with `#` are commented out, meaning the computer ignores them. The programmer left them there to show how they created the text file initially).
* **Line 18:** We use our `TextLoader` to open a file named `company_policy.txt` and load all its text into a variable named `documents`. RAG Step 1 is complete!

---

### Part 3: Step 2: Splitting Text into Chunks
AI models get confused if you hand them a 500-page book all at once. We need to cut it into small paragraphs.

```python
    # 2. CHUNK DATA
    print("[2/5] Splitting text...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=50, chunk_overlap=10)
    chunks = text_splitter.split_documents(documents)
```
* **Line 22:** We set up our "scissors". `chunk_size=50` means we want chunks of roughly 50 characters at a time. `chunk_overlap=10` is a smart trick: we overlap the chunks slightly by 10 characters so a sentence doesn't get awkwardly cut directly in half, losing its context.
* **Line 23:** We actually use the scissors to cut the `documents` into `chunks`.

---

### Part 4: Step 3: Embeddings & Vector Store
Now we need to translate the chunks of text into numbers and store them in a database so they are easy to search.

```python
    # 3. EMBEDDINGS & VECTOR STORE
    print("[3/5] Setting up Vector Store (using nomic-embed-text)...")
    embeddings_model = OllamaEmbeddings(model="nomic-embed-text") 
    vector_store = Chroma.from_documents(chunks, embeddings_model, persist_directory="./chroma_db_simple")
    retriever = vector_store.as_retriever(search_kwargs={"k": 2})
```
* **Line 27:** We create the translator using a tiny local AI model named `nomic-embed-text`. Its only job is to turn text into lists of numbers (called vectors or embeddings).
* **Line 28:** We create our Chroma database. We hand it the chunks, hand it the translator (`embeddings_model`), and tell it to save a folder on our hard drive called `./chroma_db_simple`.
* **Line 29:** We turn our database into a "retriever"—a search engine. The `{"k": 2}` means "whenever I search, bring me back the top 2 most relevant chunks you can find."

---

### Part 5: Step 4: The Brain and the Instructions
Here we set up the actual AI that will talk to us, and the strict rules we want it to follow.

```python
    # 4. PROMPT & LLM
    print("[4/5] Setting up AI Model (using llama3.2)...")
    llm = ChatOllama(model="llama3.2", temperature=0)
```
* **Line 33:** We fire up our main AI brain, using the local `llama3.2` model. The `temperature=0` setting is important! A temperature of `1` makes the AI highly creative (good for writing stories). A temperature of `0` makes the AI very literal, robotic, and factual, which is exactly what we want when it's reading company policies.

```python
    template = """Answer the question using ONLY the context below. If you don't know, say "I don't know".
    Context: {context}
    Question: {question}
    Answer:"""
    prompt = ChatPromptTemplate.from_template(template)
```
* **Lines 35-38:** We define our strict instructions (the template). We tell the AI it is only allowed to answer using the provided `{context}`. If the answer isn't in there, it must admit defeat.
* **Line 39:** We lock this text string into an official LangChain prompt object.

---

### Part 6: Step 5: Connecting the Pipeline (The RAG Chain)
Now we hook up the plumbing to make everything flow automatically from the user's question to the final answer.

```python
    # 5. RAG CHAIN
    print("[5/5] Building Pipeline and Asking Question...\n")
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)
```
* **Lines 43-44:** A tiny helper function. The search engine returns a messy list of Document objects. This function just pulls out the raw readable text from them and joins them together with double-line breaks.

```python
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser() 
    )
```
* **Lines 46-51:** This is LangChain Expression Language (LCEL) and it's the heart of the code. The `|` symbol means "take the result of the left side, and pipe it into the right side." 
    * First line: The user asks a question. That question goes into `retriever` (to search the database for chunks). Those chunks go into `format_docs` to be cleaned up into plain text. This plain text becomes our `context`. At the same time, the original user question is passed straight through (`RunnablePassthrough`) to become our `question`.
    * `| prompt`: The context and the question are injected into the fill-in-the-blank `{context}` and `{question}` spots in our template.
    * `| llm`: This fully filled-out instruction sheet is handed to the Llama 3.2 AI to read and think about.
    * `| StrOutputParser()`: The AI spits out its final answer, we strip away all the messy computer code, leaving just the beautiful, plain-text response.

---

### Part 7: Asking the Question

```python
    #question = "What happens on the last Friday of the month?"
    #question = "When can I get free pizza?"
    question = "Can you give me free pizza?"
    print(f"QUESTION: {question}")
```
* **Lines 53-56:** We finally define the question we want to ask the system. 

```python
    try:
        answer = rag_chain.invoke(question)
        print(f"ANSWER: {answer}")
    except Exception as e:
        print(f"\nERROR: {e}")
```
* **Lines 58-62:** The `try / except` block is a safety net. It says "Try to run the chain (`rag_chain.invoke(question)`), and print the answer. If something breaks or crashes, don't just abruptly close the program—catch the error (`except`), and print it out nicely so I know what went wrong."

```python
if __name__ == "__main__":
    main()
```
* **Lines 64-65:** This is standard Python boilerplate. It just means: "If this script is being run directly from the command line, please go ahead and run that `main()` function we just built up above."


### **Output:**
```
Starting Simple Local RAG Pipeline...

[1/5] Loading Document...
[2/5] Splitting text...
[3/5] Setting up Vector Store (using nomic-embed-text)...
[4/5] Setting up AI Model (using llama3.2)...
[5/5] Building Pipeline and Asking Question...

QUESTION: Can you give me free pizza?
ANSWER: I don't know.
```

### Output Analysis:
The output `ANSWER: I don't know.` is technically correct based on the code's logic, but it's not what we, as humans, would expect.

The RAG system retrieved the `company_policy.txt` file, but the instructions (`template`) strictly limited the AI to the text **"The company dress code is casual on Fridays. Free pizza is provided on the last Friday of every month."**
The question, "Can you give me free pizza?", is phrased as a request to the AI itself. The AI is programmed to answer *based on the context*, not to act as an employee who can give away pizza.

Because the text doesn't say "The AI can give you pizza," but rather "Free pizza is provided," the strictly logical AI defaults to "I don't know."

To make the RAG system answer this question correctly, we would need to rephrase the prompt (Step 5) to ask **about** the company policy, rather than asking the AI to perform an action.


### To fix this, you could modify the **Prompt Template (Step 5)** like this:

Change the **Line 35** from:
```python
    template = """Answer the question using ONLY the context below. If you don't know, say "I don't know".
    Context: {context}
    Question: {question}
    Answer:"""
```
To this:
```python
    template = """You are a helpful assistant. Use the context below to answer the question.
    Context: {context}
    Question: {question}
    Answer:"""
```

**Why this works:**
*   We removed "ONLY" and "If you don't know".
*   We changed the persona from a strict rule-follower to a general "helpful assistant".
*   Now, when the AI sees "Free pizza is provided" in the context, it will simply state that fact as a helpful answer, rather than treating it as a command it cannot fulfill.
