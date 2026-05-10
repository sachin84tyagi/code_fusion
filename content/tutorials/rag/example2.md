```python
import os

# We import the necessary tools from LangChain
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# ⚠️ SET YOUR API KEY HERE
# Uncomment the line below and add your actual OpenAI API Key for this script to work!
# os.environ["OPENAI_API_KEY"] = "sk-your-api-key-here"

def main():
    print("🚀 Starting Complete RAG Pipeline...")

    # ==========================================
    # STEP 1: LOAD DOCUMENTS (The "Knowledge")
    # ==========================================
    print("\n[Step 1] Creating and Loading Document...")
    with open("company_policy.txt", "w") as f:
        f.write("The company dress code is casual on Fridays. Free pizza is provided on the last Friday of every month.")
    
    # 'TextLoader' is a tool that reads our file and brings the text into Python.
    loader = TextLoader("company_policy.txt")
    documents = loader.load()
    print("✅ Document Loaded.")

    # ==========================================
    # STEP 2: CHUNKING (Slicing the Cake)
    # ==========================================
    print("\n[Step 2] Chunking Document...")
    # AI models can't read a 1,000-page book all at once. We have to cut it into smaller slices (chunks).
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=50,       # Maximum characters per chunk
        chunk_overlap=10     # Leave 10 characters overlapping between chunks so we don't cut a sentence in half
    )
    chunks = text_splitter.split_documents(documents)
    print(f"✅ Document split into {len(chunks)} chunks.")

    # ==========================================
    # STEP 3: EMBEDDINGS & VECTOR STORE (The "Brain Library")
    # ==========================================
    print("\n[Step 3] Creating Embeddings & Vector Database...")
    embeddings_model = OpenAIEmbeddings() 
    
    # "Chroma" is a Vector Database. It acts like a highly organized library.
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings_model,
        persist_directory="./chroma_db" # This saves the database to a folder on your computer.
    )
    print("✅ Database created and saved to './chroma_db'.")

    # ==========================================
    # STEP 4: THE RETRIEVER (The "Librarian")
    # ==========================================
    print("\n[Step 4] Setting up the Retriever...")
    retriever = vector_store.as_retriever(
        search_type="similarity", # Search by finding text with a similar "meaning" to the question.
        search_kwargs={"k": 2}    # Bring back the top 2 best matches.
    )
    print("✅ Retriever ready.")

    # ==========================================
    # STEP 5: PROMPT & LLM (The "Instructions" & "AI Brain")
    # ==========================================
    print("\n[Step 5] Initializing Prompt & LLM...")
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
    
    template = """You are a helpful assistant. Answer the question using ONLY the following context.
    If you don't know the answer based on the context, say "I don't know".
    
    Context: {context}
    
    Question: {question}
    
    Answer:"""
    prompt = ChatPromptTemplate.from_template(template)
    print("✅ AI Brain and Instructions ready.")

    # ==========================================
    # STEP 6: THE RAG CHAIN (Connecting the pipes)
    # ==========================================
    print("\n[Step 6] Building the RAG Chain...")
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser() # Cleans up the AI's final answer to be pure text.
    )
    print("✅ RAG Chain assembled.")

    # ==========================================
    # STEP 7: ASK A QUESTION!
    # ==========================================
    print("\n==========================================================")
    question = "What happens on the last Friday of the month?"
    print(f"❓ QUESTION: {question}")
    print("🤖 AI is thinking...")
    
    try:
        # 'invoke' pulls the trigger and runs the entire chain we just built.
        answer = rag_chain.invoke(question)
        print(f"\n✨ ANSWER: {answer}")
    except Exception as e:
        print(f"\n❌ ERROR: Could not get an answer.")
        print(f"Make sure you have set your OPENAI_API_KEY environment variable or uncommented the os.environ line!")
        print(f"Details: {e}")
    print("==========================================================")

if __name__ == "__main__":
    main()
```

#### How to Run This Code

1.  **Save the file:** Save the code above as `rag_pipeline.py`.
2.  **Set your API Key:** Open the file and replace `"sk-your-api-key-here"` with your actual OpenAI API key.
3.  **Run from Terminal:**
    ```bash
    cd d:\code_fusion\content\tutorials\rag
    python rag_pipeline.py
    ```

### Output Explained

When you run the script, you will see output similar to this:

```text
🚀 Starting Complete RAG Pipeline...

[Step 1] Creating and Loading Document...
✅ Document Loaded.

[Step 2] Chunking Document...
✅ Document split into 2 chunks.

[Step 3] Creating Embeddings & Vector Database...
✅ Database created and saved to './chroma_db'.

[Step 4] Setting up the Retriever...
✅ Retriever ready.

[Step 5] Initializing Prompt & LLM...
✅ AI Brain and Instructions ready.

[Step 6] Building the RAG Chain...
✅ RAG Chain assembled.

==========================================================
❓ QUESTION: What happens on the last Friday of the month?
🤖 AI is thinking...

✨ ANSWER: On the last Friday of every month, free pizza is provided.
==========================================================
```

### Why Did the AI Answer Correctly This Time?

Let's compare this with the simple RAG example:

*   **Simple RAG (Previous Step):**
    *   **Context:** "Our refund policy allows returns within 14 days of purchase."
    *   **Question:** "What happens on the last Friday of the month?"
    *   **Result:** "I don't know" (Because the text never mentioned Fridays or pizza).

*   **Complete RAG (This Step):**
    *   **Context:** "The company dress code is casual on Fridays. Free pizza is provided on the last Friday of every month."
    *   **Question:** "What happens on the last Friday of the month?"
    *   **Result:** "On the last Friday of every month, free pizza is provided."

**The magic happens in Step 2 and Step 3:**
1.  **Chunking:** We split the document into small, manageable pieces.
2.  **Vector Store:** We converted these pieces into vectors and stored them in ChromaDB.
3.  **Retrieval:** When you asked the question, the retriever searched the vector database and **found** the specific chunk that contained the answer.
4.  **Generation:** The LLM then read that chunk and used it to generate the correct answer.

This demonstrates the true power of RAG — **Retrieval Augmented Generation** — combining the vast knowledge of LLMs with your own private, up-to-date information!


# 🚀 Complete RAG Pipeline Explained (Step-by-Step)

Retrieval-Augmented Generation (RAG) might sound complicated, but it's just a way to give an AI an "open book test." Instead of relying on what the AI memorized during training, we give it a textbook (our documents) and tell it to look up the answer.

Here is the entire process in one single Python script, using **LangChain**. Every core concept is explained in simple English!

## The Complete Code Example

Save this code in a file called `full_rag_example.py` and run it!

```python
import os

# We import the necessary tools from LangChain
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# Set your API Key (You need an OpenAI key for this to work)
# os.environ["OPENAI_API_KEY"] = "sk-your-api-key-here"

def main():
    # ==========================================
    # STEP 1: LOAD DOCUMENTS (The "Knowledge")
    # ==========================================
    # First, let's create a dummy text file to act as our private data.
    with open("company_policy.txt", "w") as f:
        f.write("The company dress code is casual on Fridays. Free pizza is provided on the last Friday of every month.")
    
    # 'TextLoader' is a tool that reads our file and brings the text into Python.
    loader = TextLoader("company_policy.txt")
    documents = loader.load() # Now our text is loaded into memory as a "Document" object.

    # ==========================================
    # STEP 2: CHUNKING (Slicing the Cake)
    # ==========================================
    # AI models can't read a 1,000-page book all at once. We have to cut it into smaller slices (chunks).
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=50,       # Maximum characters per chunk
        chunk_overlap=10     # Leave 10 characters overlapping between chunks so we don't cut a sentence in half and lose meaning.
    )
    # We slice our loaded document into these smaller chunks.
    chunks = text_splitter.split_documents(documents)

    # ==========================================
    # STEP 3: EMBEDDINGS & VECTOR STORE (The "Brain Library")
    # ==========================================
    # "Embeddings" turn human words into a long list of numbers. AI understands numbers better than words.
    embeddings_model = OpenAIEmbeddings() 
    
    # "Chroma" is a Vector Database. It acts like a highly organized library.
    # We give it our text chunks and the embedding tool, and it stores everything so we can search it later.
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings_model,
        persist_directory="./chroma_db" # This saves the database to a folder on your computer.
    )

    # ==========================================
    # STEP 4: THE RETRIEVER (The "Librarian")
    # ==========================================
    # A Retriever's only job is to search the Vector Database.
    # When a user asks a question, the retriever finds the most relevant text chunks.
    retriever = vector_store.as_retriever(
        search_type="similarity", # Search by finding text with a similar "meaning" to the question.
        search_kwargs={"k": 2}    # 'k' means how many chunks to bring back. We bring back the top 2 best matches.
    )

    # ==========================================
    # STEP 5: PROMPT & LLM (The "Instructions" & "AI Brain")
    # ==========================================
    # We define the AI model we want to use (ChatGPT). 'Temperature=0' makes it factual, not creative.
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
    
    # We write strict instructions for the AI. We force it to ONLY use our provided context.
    template = """You are a helpful assistant. Answer the question using ONLY the following context.
    If you don't know the answer based on the context, say "I don't know".
    
    Context: {context}
    
    Question: {question}
    
    Answer:"""
    # Convert our text instructions into an official LangChain Prompt object.
    prompt = ChatPromptTemplate.from_template(template)

    # ==========================================
    # STEP 6: THE RAG CHAIN (Connecting the pipes)
    # ==========================================
    # This helper function takes the multiple chunks the Retriever found and glues them into one big paragraph.
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    # A "Chain" connects everything in a sequence (using the '|' pipe symbol):
    # 1. Get the Question -> 2. Retrieve Context -> 3. Fill the Prompt -> 4. Send to LLM -> 5. Get Text Output.
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser() # Cleans up the AI's final answer to be pure text.
    )

    # ==========================================
    # STEP 7: ASK A QUESTION!
    # ==========================================
    question = "What happens on the last Friday of the month?"
    print(f"Question: {question}")
    
    # 'invoke' pulls the trigger and runs the entire chain we just built.
    answer = rag_chain.invoke(question)
    
    print(f"\nAnswer: {answer}")

if __name__ == "__main__":
    main()
```

---

## 🧠 The 7 Steps Summarized in Plain English

1. **Loading Documents:** Imagine pulling a physical file folder out of a cabinet and putting the paper on your desk. This gets the text ready for Python to touch.
2. **Chunking (Splitting):** Taking scissors and cutting that long document into small, easily readable paragraphs so the AI doesn't get overwhelmed with too much text at once.
3. **Embeddings & Database:** Translating those English paragraphs into Math (vectors)—which is the AI's native language. Then, we store those mathematical paragraphs into a filing cabinet (Chroma DB) that is incredibly fast at finding similarities.
4. **The Retriever:** Hiring a librarian whose *only* job is to take your question, translate it to math, and fetch the closest matching paragraphs from the filing cabinet.
5. **Prompt & LLM:** Handing those retrieved paragraphs to the AI (like ChatGPT) with strict instructions: *"Here is what the librarian found. Answer the question using ONLY this info."*
6. **The Chain:** Setting up an automated assembly line so data flows perfectly from the Librarian ➡️ to the Instructions ➡️ to the AI.
7. **Invoke:** Pressing the "GO" button! The question is asked, the context is fetched, and the AI answers based purely on your data.
