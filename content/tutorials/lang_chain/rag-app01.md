# The Complete RAG System Tutorial
### A Line-by-Line Professor's Guide for High School Students

---

> **Professor's Note:**
> Welcome! Today we are going to take apart this entire production RAG (Retrieval-Augmented Generation) system together, file by file, line by line. By the end, you will not just understand what the code does — you will understand *why* every single decision was made.
>
> Think of me as your guide. You have already built a racing car. Now let's open the hood and understand every single part of the engine.

---

## What is RAG? (The Big Picture First)

Before we touch a single line of code, let me give you the complete mental model.

**Imagine you are a student who must answer questions about a 500-page employee handbook.**

- **Option A (Bad):** You memorize the entire book before the exam. But what if the book gets updated? What if a question is about something you forgot? This is how standard AI (like GPT) works — it memorizes everything during training, but that training data can be months or years old.

- **Option B (Smart - RAG):** You sit the exam with the book open on the table. When a question comes in, you quickly find the right pages, read them, and then write a clear answer based on what you just read.

**RAG = Option B.** It is a system that:
1. **Reads** your company documents (PDFs, emails, images)
2. **Stores** them in a searchable database
3. **Retrieves** the most relevant passages when a question is asked
4. **Sends** those passages to an AI model to write a final, grounded answer

Here is the complete data flow in our system:

```
YOUR FILES (PDFs, Emails, Images)
        │
        ▼
   [EXTRACTORS] — Convert files to raw text
        │
        ▼
   [CLEANER] — Remove HTML, fix broken words, normalize spaces
        │
        ▼
   [CHUNKER] — Cut text into overlapping 600-character index cards
        │
        ▼
   [EMBEDDER] — Turn each card into 384 numbers (coordinates in space)
        │
        ▼
   [CHROMADB] — Store cards + coordinates on disk (the library catalog)
        │
  ─────────────── (User asks a question) ────────────────
        │
        ▼
   [SEARCH] — Find the 3 index cards whose coordinates are closest to the question
        │
        ▼
   [LLM BACKEND] — Send question + the 3 cards to an AI model
        │
        ▼
   [FINAL ANSWER] — Cited, grounded, and accurate
```

Now let's walk through every single file in the order they execute.

---

---

## FILE 1: `requirements.txt` — The Shopping List

```
langchain>=0.1.0
langchain-community>=0.1.0
langchain-chroma>=0.1.0
chromadb>=0.4.0
sentence-transformers>=2.2.0
pdfplumber>=0.10.0
pypdf>=3.17.0
python-docx>=1.0.0
pillow>=10.0.0
beautifulsoup4>=4.12.0
```

### What is this file?

This is not Python code. This is a plain text shopping list for a tool called `pip`, which is Python's package manager (think of it like the App Store for Python).

When someone runs `pip install -r requirements.txt`, Python downloads and installs all of these libraries.

### Line-by-Line:

| Package | What it does | Real-world analogy |
|---|---|---|
| `langchain` | The main framework connecting all RAG pieces | The LEGO instruction manual |
| `langchain-community` | Extra LangChain tools (like HuggingFace embeddings) | Extra LEGO pieces from a community pack |
| `langchain-chroma` | LangChain's plugin to talk to ChromaDB | A special connector piece |
| `chromadb` | The actual vector database that stores embeddings | The library catalog on your hard drive |
| `sentence-transformers` | AI model that converts text to numbers | The translator who speaks "vector language" |
| `pdfplumber` | The best library for reading PDF text AND tables | A sophisticated PDF scanner |
| `pypdf` | A lighter PDF reader (used as fallback) | A simpler scanner as backup |
| `python-docx` | Read Microsoft Word `.docx` files | A Word document reader |
| `pillow` | Open and manipulate images (PNG, JPG) | Photoshop's simple cousin |
| `beautifulsoup4` | Strip HTML tags from email bodies | A text pressure-washer |

**The `>=` symbol** means "this version or any newer version." So `langchain>=0.1.0` means: install version 0.1.0 of LangChain, or anything newer.

---

---

## FILE 2: `config.json` — The Control Dashboard

```json
{
  "pipeline_name": "company_rag_kb",
  "llm_backend": "demo",
  "ollama_model": "llama3.2",
  "openai_model": "gpt-4o-mini",
  "gemini_model": "gemini-2.5-flash",
  "embedding_model": "all-MiniLM-L6-v2",
  "chunk_size": 600,
  "chunk_overlap": 120,
  "min_chunk_words": 10,
  "chroma_db_dir": "data/chromadb",
  "raw_data_dir": "data/raw",
  "processed_data_dir": "data/processed"
}
```

### What is this file?

JSON (JavaScript Object Notation) is a universal data format. It is just a list of `"key": value` pairs surrounded by curly braces `{}`. Think of it as a dictionary where the keys are the settings and the values are their values.

### Why not just write these values directly in the Python code?

Great question! Imagine you want to change the AI model from `gpt-4o-mini` to `gpt-4o`. If the model name were hardcoded inside 5 different Python files, you would need to search for and edit 5 files. With `config.json`, you just change one line in one file. This is called **configuration-driven design** and it is standard practice in the industry.

### Line-by-Line:

- **`"pipeline_name": "company_rag_kb"`** — A label for our collection in ChromaDB. Changing this would create a new empty collection.
- **`"llm_backend": "demo"`** — Which AI brain to use. Options are `"demo"` (offline, no API key needed), `"ollama"` (local model), `"openai"` (cloud, needs key), or `"gemini"` (cloud, needs key).
- **`"ollama_model": "llama3.2"`** — Which specific local Ollama model to use, if `llm_backend` is `"ollama"`.
- **`"embedding_model": "all-MiniLM-L6-v2"`** — The local AI model that converts text into coordinate vectors. This runs on your CPU, 100% free and offline.
- **`"chunk_size": 600`** — Maximum characters per index card. Like deciding the maximum size of a flashcard.
- **`"chunk_overlap": 120`** — How many characters to share between adjacent cards. If card 1 ends mid-sentence, 120 characters of card 1 are copied to the beginning of card 2 so the context is not lost.
- **`"chroma_db_dir"`, `"raw_data_dir"`, `"processed_data_dir"`** — Folder paths for the database, input files, and logs respectively.

---

---

## FILE 3: `src/config_loader.py` — Reading the Dashboard Safely

```python
import os       # Line 1
import json     # Line 2
```

**Line 1–2:** We import two built-in Python modules.
- `os` is Python's interface to your operating system. It lets us check if files exist, get the directory of the current script, and build file paths.
- `json` allows Python to read and write JSON files.

---

```python
DEFAULT_CONFIG = {                              # Line 4
    "pipeline_name": "company_rag_kb",         # Line 5
    "llm_backend": "demo",                     # Line 6
    ...                                        # Lines 7-16
    "processed_data_dir": "data/processed"     # Line 16
}                                              # Line 17
```

**Lines 4–17:** This is a Python dictionary (not JSON — JSON is a file format, Python dictionary is a data structure in code). It stores all the same settings as `config.json`, but inside the Python script itself.

**Why do we have this?** This is our safety net. If `config.json` is accidentally deleted or corrupted, the program reads these default values instead of crashing. This is called a **fallback** pattern.

---

```python
def load_config() -> dict:    # Line 19
```

**Line 19:** We define a function. The `-> dict` part (called a type hint) tells other programmers that this function returns a Python dictionary. It is optional, but very good practice for making code readable and self-documenting.

---

```python
    current_dir = os.path.dirname(os.path.abspath(__file__))   # Line 22
    practice_root = os.path.dirname(current_dir)               # Line 23
    config_path = os.path.join(practice_root, "config.json")  # Line 24
```

This is one of the most important sections. Let's break it apart:

- **`__file__`** — Python's built-in magic variable. It automatically contains the full path of the current Python file. For example: `D:\mySecondAITest\practice\src\config_loader.py`.
- **`os.path.abspath(__file__)`** — Makes the path absolute (no `../` shortcuts).
- **`os.path.dirname(...)`** — Takes a full file path and returns just the folder part. So `dirname("D:/practice/src/config_loader.py")` returns `"D:/practice/src"`.
- **Line 22:** `current_dir` = the `src` folder.
- **Line 23:** `practice_root` = one level up from `src` = the `practice` folder.
- **Line 24:** `config_path` = `D:\practice\config.json`.

**The key insight:** This code finds `config.json` no matter where you run the Python script from. It navigates using relative positions to the script file itself, not to your terminal's current directory.

---

```python
    config = DEFAULT_CONFIG.copy()    # Line 26
```

**Line 26:** We make a copy of the defaults. We use `.copy()` (not just `config = DEFAULT_CONFIG`) because if we assigned directly, then modifying `config` would also modify `DEFAULT_CONFIG`. With `.copy()`, they are independent.

---

```python
    if os.path.exists(config_path):    # Line 28
        try:                           # Line 29
            with open(config_path, "r", encoding="utf-8") as f:   # Line 30
                loaded = json.load(f)      # Line 31
                config.update(loaded)      # Line 32
        except Exception as e:             # Line 33
            print(f"[Warning] ...")        # Line 34
```

**Line 28:** Before opening the file, we check if it actually exists. No file = no crash.

**Line 29:** `try` begins a block where we *attempt* something that might fail.

**Line 30:** `with open(...)` opens the file. The `with` keyword ensures the file is automatically closed when done, even if an error occurs. This prevents file corruption and memory leaks.

**Line 31:** `json.load(f)` reads the file handle `f` and converts the JSON text into a Python dictionary.

**Line 32:** `config.update(loaded)` — The `update()` method merges the loaded values into our defaults dictionary. If `config.json` has `"chunk_size": 800`, it overwrites the default `600`. If `config.json` doesn't mention `"ollama_model"`, the default value is preserved.

**Lines 33–34:** If anything goes wrong (file corrupted, invalid JSON), the `except` block catches the error, prints a warning, and continues using the defaults. The program **never crashes**.

---

```python
    for path_key in ["chroma_db_dir", "raw_data_dir", "processed_data_dir"]:   # Line 37
        path_val = config[path_key]                                             # Line 38
        if not os.path.isabs(path_val):                                         # Line 39
            config[path_key] = os.path.abspath(os.path.join(practice_root, path_val))  # Line 40
```

**Lines 37–40:** This loop converts relative folder paths to absolute ones.

- `config.json` stores paths like `"data/raw"` (relative).
- Relative paths work differently depending on where you run the script from.
- `os.path.isabs()` checks if a path is already absolute (starts with `D:\` or `/`).
- If not, `os.path.join(practice_root, path_val)` builds the full absolute path like `D:\practice\data\raw`.
- `os.path.abspath()` resolves any remaining `../` parts.

---

---

## FILE 4: `src/extractors/base.py` — The Contract Blueprint

```python
import os                          # Line 1
from abc import ABC, abstractmethod    # Line 2
from datetime import datetime          # Line 3
```

**Line 2:** We import `ABC` and `abstractmethod` from Python's `abc` module (abc = Abstract Base Class).

**What is an Abstract Base Class?**

In the real world, all cars must have a steering wheel, brakes, and an accelerator. You cannot build a car without them. An Abstract Base Class works the same way: it defines rules that all subclasses must follow.

In our system, every extractor (PDF, Email, Image) must have an `extract()` method. Instead of hoping developers remember to write it, we use an ABC to *enforce* it. If someone creates a new extractor and forgets to write `extract()`, Python throws an error immediately.

---

```python
class BaseExtractor(ABC):    # Line 5
```

**Line 5:** Declaring the class. By putting `ABC` inside the parentheses, we are saying: "This class is an Abstract Base Class."

---

```python
    @abstractmethod                      # Line 8
    def extract(self, file_path: str) -> dict:   # Line 9
        ...
        pass                             # Line 20
```

**Line 8:** `@abstractmethod` is a **decorator** — it modifies the function below it. It tells Python: "Any class that inherits from `BaseExtractor` MUST define its own version of `extract()`. If it doesn't, Python raises a `TypeError` when you try to create an object from that class."

**Line 9:** The `extract()` method takes `self` (the object itself) and `file_path` (a string path to the file). It returns a `dict`.

The docstring inside (lines 10-19) documents exactly what keys the returned dictionary must contain: `status`, `text`, `metadata`, and `error`. This is the **contract** that all extractors agree to.

---

```python
    def get_basic_metadata(self, file_path: str) -> dict:   # Line 22
        try:
            stat = os.stat(file_path)                       # Line 25
            return {
                "source_file": os.path.basename(file_path),   # Line 27
                "file_size_bytes": stat.st_size,               # Line 28
                "file_type": os.path.splitext(file_path)[1].lower().replace(".", ""),  # Line 29
                "last_modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),    # Line 30
                "extracted_at": datetime.now().isoformat()                              # Line 31
            }
```

**Line 22:** This is a *concrete* (non-abstract) method. All child classes can call this for free — they don't have to re-implement it.

**Line 25:** `os.stat()` is like asking the operating system for a file's ID card. It returns an object with file attributes.

**Line 27:** `os.path.basename()` extracts just the filename from a full path. `basename("D:/practice/data/raw/policy.pdf")` returns `"policy.pdf"`.

**Line 29:** `os.path.splitext()` splits a filename into the name and the extension. `splitext("policy.pdf")` returns `("policy", ".pdf")`. We take `[1]` (the extension), make it lowercase, and remove the dot — so `.pdf` becomes `pdf`.

**Line 30:** `stat.st_mtime` is the file's last modified timestamp (a Unix timestamp number). `datetime.fromtimestamp()` converts it to a human-readable date string like `"2026-05-21T10:00:00"`.

---

---

## FILE 5: `src/extractors/pdf.py` — Reading PDF Files

```python
class PDFExtractor(BaseExtractor):    # Line 4
```

**Line 4:** `PDFExtractor` **inherits** from `BaseExtractor`. This means it gets all the methods of `BaseExtractor` for free (like `get_basic_metadata()`), and it is forced to implement `extract()`.

---

```python
    def extract(self, file_path: str) -> dict:   # Line 7
        result = {                               # Line 8
            "status": "failed",                 # Line 9
            "text": "",                         # Line 10
            "metadata": self.get_basic_metadata(file_path),  # Line 11
            "error": None                       # Line 12
        }                                       # Line 13
```

**Lines 8–13:** We create the result dictionary **immediately** with a default `"status": "failed"`. This is defensive programming. If anything goes wrong later and we return early, the result will correctly report failure. We only change the status to `"success"` when everything works correctly.

---

```python
        try:                          # Line 20
            import pdfplumber         # Line 21
            return self._extract_with_pdfplumber(file_path, result)  # Line 22
        except ImportError:           # Line 23
            pass                      # Line 24

        try:                          # Line 27
            import pypdf              # Line 28
            return self._extract_with_pypdf(file_path, result)       # Line 29
        except ImportError:           # Line 30
            pass                      # Line 31

        try:                          # Line 34
            import PyPDF2             # Line 35
            return self._extract_with_pypdf2(file_path, result)      # Line 36
        except ImportError:           # Line 37
            pass                      # Line 38
```

**The Cascade of Fallbacks — Lines 20–38:**

This is brilliant defensive engineering. Notice the pattern:
1. Try to import `pdfplumber`. If it is installed, use it and return immediately.
2. If `pdfplumber` is not installed (`ImportError`), silently move on. Try `pypdf`.
3. If `pypdf` is not installed, try the older `PyPDF2`.
4. If nothing works, fall through to the error message.

We use `import` inside the function (not at the top of the file) specifically so that a missing library only triggers a problem when you actually try to process a PDF — not when the whole application starts up.

**Why does this matter?** If we had `import pdfplumber` at the top of the file and it wasn't installed, the application would crash instantly on startup before it could do anything. By catching `ImportError`, we let the program run and process emails/images even if pdfplumber is missing.

---

```python
    def _extract_with_pdfplumber(self, file_path: str, result: dict) -> dict:   # Line 43
        import pdfplumber             # Line 44
        try:
            pages_text = []          # Line 46 — stores text for each page
            total_pages = 0          # Line 47
            tables_extracted = 0     # Line 48

            with pdfplumber.open(file_path) as pdf:     # Line 50
                total_pages = len(pdf.pages)             # Line 51
                for idx, page in enumerate(pdf.pages, 1):  # Line 52
```

**Line 50:** `with pdfplumber.open()` opens the PDF and ensures it is properly closed afterward.

**Line 52:** `enumerate(pdf.pages, 1)` — `enumerate` gives us both the index number and the item as we loop. Starting from `1` (not 0) makes page numbers human-readable.

---

```python
                    text = page.extract_text()    # Line 56
                    if text:
                        page_content.append(text) # Line 58
```

**Line 56:** Extracts all text from the current page as a single string. May return `None` for image-only pages.

---

```python
                    tables = page.extract_tables()    # Line 61
                    if tables:
                        for table in tables:
                            table_lines = []
                            for row in table:          # Line 67
                                clean_row = [str(cell or "").strip().replace("\n", " ") for cell in row]  # Line 69
                                if any(clean_row):     # Line 70
                                    table_lines.append(" | ".join(clean_row))  # Line 71
                            if table_lines:
                                page_content.append("\n[Extracted Table]\n" + "\n".join(table_lines) + "\n")  # Line 73
```

**Lines 61–73 (Table Extraction):**

`page.extract_tables()` returns a list of tables. Each table is a list of rows. Each row is a list of cells.

**Example:** A 3-column table with 2 rows looks like:
```python
[
  ["Name", "Department", "Salary"],
  ["Alice", "Engineering", "$90,000"]
]
```

**Line 69:** `str(cell or "")` — `cell` might be `None` for empty cells. `or ""` replaces `None` with an empty string. Then `.strip()` removes whitespace and `.replace("\n", " ")` removes internal newlines.

**Line 70:** `any(clean_row)` — Skip completely empty rows.

**Line 71:** `" | ".join(clean_row)` — Joins the cells with pipe separators: `"Name | Department | Salary"`. This converts the table into a format the LLM can easily read.

---

```python
                    pages_text.append(f"--- PAGE {idx} ---\n{page_text}")  # Line 78
```

**Line 78:** We add a clear page boundary marker like `--- PAGE 1 ---` before each page's text. This is crucial for RAG because when we cite sources, we can say "Answer found on Page 1 of sample_policy.pdf."

---

---

## FILE 6: `src/extractors/email.py` — Reading Email Files

```python
import email              # Line 2
from email import policy  # Line 3
```

**Lines 2–3:** Python includes an `email` module in its standard library — no installation needed. The `policy` sub-module handles modern email format standards.

---

```python
            with open(file_path, "rb") as f:                              # Line 22
                msg = email.message_from_binary_file(f, policy=policy.default)  # Line 23
```

**Line 22:** We open the `.eml` file in binary mode (`"rb"`) because email files can contain binary attachments (images, PDFs, etc.) and must be read as raw bytes.

**Line 23:** `email.message_from_binary_file()` parses the raw email bytes into a structured Python object. `policy.default` enables modern parsing rules that handle things like encoded subject lines.

---

```python
            subject = str(msg.get("subject", "") or "No Subject")  # Line 26
            sender  = str(msg.get("from", "")   or "Unknown Sender")  # Line 27
            to      = str(msg.get("to", "")     or "Unknown Recipient")  # Line 28
            date_str= str(msg.get("date", "")   or "Unknown Date")  # Line 29
```

**Lines 26–29:** `msg.get("subject", "")` retrieves the email header named `"subject"`. The second argument `""` is a default value if the header doesn't exist. The `or "No Subject"` handles the case where `.get()` returns an empty string.

---

```python
            if msg.is_multipart():            # Line 35
                for part in msg.walk():       # Line 36
```

**Line 35:** Emails can be **multipart**, meaning they contain multiple sections: a plain text version, an HTML version, and maybe attachments — all packaged together in one file.

**Line 36:** `msg.walk()` is a generator that recursively walks through all parts and sub-parts of the email, like exploring folders inside folders.

---

```python
                    content_disposition = str(part.get_content_disposition())  # Line 38
                    if "attachment" in content_disposition:   # Line 41
                        continue                             # Line 42
```

**Lines 38–42:** `content_disposition` tells us the *role* of each part. An attachment has `"attachment"` in this field. We `continue` (skip to the next iteration of the loop) to ignore attachments and only process the email body.

---

```python
                        charset = part.get_content_charset() or "utf-8"  # Line 49
                        decoded_part = payload.decode(charset, errors="ignore")  # Line 50
```

**Line 49:** Emails can be encoded in many character sets (UTF-8, Latin-1, ISO-8859-1, etc.). `get_content_charset()` detects which one. We fall back to UTF-8 if it cannot be detected.

**Line 50:** `.decode(charset, errors="ignore")` converts the raw bytes into a Python string using the detected encoding. `errors="ignore"` means any byte that doesn't match the charset is simply dropped rather than causing a crash. Safety first!

---

```python
            headers_prefix = (                    # Line 73
                f"From: {sender}\n"               # Line 74
                f"To: {to}\n"                     # Line 75
                f"Date: {date_str}\n"             # Line 76
                f"Subject: {subject}\n"           # Line 77
                f"--...--\n"                      # Line 78
            )
            result["text"] = headers_prefix + final_body   # Line 81
```

**Lines 73–81:** We prepend the email metadata (From, To, Date, Subject) as a header block at the very top of the text content. This is a smart RAG design decision: when a chunk is retrieved from the email, the AI can read "Date: May 20, 2026" and "From: HR Department" directly in the context. It does not need to guess.

---

---

## FILE 7: `src/extractors/image.py` — Reading Images with OCR

OCR stands for **Optical Character Recognition** — the ability to read text from pictures.

```python
        # 1. Try EasyOCR
        try:
            import easyocr
            return self._extract_with_easyocr(file_path, result)
        except ImportError:
            pass

        # 2. Try PyTesseract
        try:
            import pytesseract
            return self._extract_with_tesseract(file_path, result)
        except ImportError:
            pass

        # 3. Try Gemini Multimodal API if API key is in environment
        gemini_api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")  # Line 35
        if gemini_api_key:
            try:
                import google.generativeai as genai
                return self._extract_with_gemini(file_path, gemini_api_key, result)
            except ImportError:
                pass
```

**Three-Layer Fallback System:**

1. **EasyOCR** (Lines 21–25): A modern deep-learning OCR that works offline and handles messy, rotated, or stylized text very well.
2. **PyTesseract** (Lines 28–32): A Python wrapper around Google's Tesseract OCR engine. Requires a system installation of Tesseract.
3. **Gemini Multimodal** (Lines 34–41): If no local OCR is available but a `GEMINI_API_KEY` is set in the environment, we send the image to Google's Gemini AI model over the internet. Gemini can "see" images and extract text.

**Line 35:** `os.environ.get("GEMINI_API_KEY")` reads an environment variable (a setting stored in your OS, not in any code file). This is the secure way to handle API keys — never hardcode them in source files.

---

```python
    def _extract_with_easyocr(self, file_path: str, result: dict) -> dict:
        reader = easyocr.Reader(['en'], gpu=False)   # Line 53
        ocr_results = reader.readtext(file_path)     # Line 54
        extracted_text = "\n".join([line[1] for line in ocr_results])  # Line 56
```

**Line 53:** `['en']` means we want to read English text. `gpu=False` forces CPU mode (slower but works without a GPU).

**Line 54:** `reader.readtext()` processes the image and returns a list of detections. Each detection is a tuple: `(bounding_box, text, confidence_score)`.

**Line 56:** `[line[1] for line in ocr_results]` — This is a **list comprehension** (a compact loop). It extracts index `[1]` (the text) from each detection tuple. `"\n".join(...)` combines all the text lines with newlines between them.

---

```python
    def _extract_with_gemini(self, file_path: str, api_key: str, result: dict) -> dict:
        ...
        img = Image.open(file_path)         # Line 90
        response = model.generate_content([  # Line 91
            "Perform OCR on this image. Extract all readable text and tables...",  # Line 92
            img                              # Line 93
        ])
```

**Line 91–93:** This is a **multimodal** API call. We pass a list containing both a text instruction AND the actual image object to the model. The Gemini model processes both together — it "reads" the image and responds to our instruction.

---

---

## FILE 8: `src/cleaner.py` — Washing the Extracted Text

After extraction, text can be very dirty. HTML tags, broken words, and double spaces cause poor retrieval results. The cleaner fixes all of this.

```python
import re            # Line 1
import unicodedata   # Line 2
```

**Line 1:** `re` is Python's Regular Expression module. Regular expressions are a mini-language for describing text patterns. For example, `r'<[^>]+>'` describes "any HTML tag."

**Line 2:** `unicodedata` handles the vast Unicode standard. There are many ways to write the same character (e.g., a "smart quote" `"` vs a regular `"`). `unicodedata.normalize()` converts them all to a standard form.

---

```python
def clean_html(text: str) -> str:
    if bool(re.search(r'<[a-z/][^>]*>', text, re.IGNORECASE)):   # Line 7
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(text, "html.parser")  # Line 10
            for br in soup.find_all(["br", "p", "div", "tr"]):  # Line 12
                br.append("\n")                                   # Line 13
            return soup.get_text()                                # Line 14
        except ImportError:
            return re.sub(r'<[^>]+>', '', text)   # Line 17
```

**Line 7:** The regex `r'<[a-z/][^>]*>'` matches HTML tags. Let's decode it:
- `<` — literal less-than sign
- `[a-z/]` — any letter a-z OR a forward slash (for closing tags like `</div>`)
- `[^>]*` — any characters that are not `>`
- `>` — literal greater-than sign

So it matches things like `<div>`, `</p>`, `<a href="...">` but NOT comparison operators like `a < b`.

**Lines 10–14:** If BeautifulSoup is installed, we use it for accurate HTML parsing. We first add newlines to block-level elements (`br`, `p`, `div`, `tr`) so that separate paragraphs become separate lines. Then `get_text()` returns just the visible text with all tags removed.

**Line 17:** If BeautifulSoup is not installed, we fall back to a simpler regex strip. Less accurate but still works.

---

```python
def resolve_hyphenations(text: str) -> str:
    return re.sub(r'(\w+)-\s*\n\s*(\w+)', r'\1\2', text)   # Line 22
```

**Line 22:** PDFs sometimes break words across lines with a hyphen. For example, `"possi-\nbility"` should be `"possibility"`.

The regex:
- `(\w+)` — Capture group 1: one or more word characters before the hyphen
- `-` — the literal hyphen
- `\s*\n\s*` — optional spaces, a newline, optional spaces
- `(\w+)` — Capture group 2: the continuation word

The replacement `r'\1\2'` just concatenates group 1 and group 2, dropping the hyphen and newline.

---

```python
def clean_text(text: str) -> str:
    if not text:        # Line 26
        return ""       # Line 27

    text = clean_html(text)             # Line 30
    text = resolve_hyphenations(text)   # Line 33
    text = unicodedata.normalize("NFKC", text)   # Line 36
    text = text.replace("\r\n", "\n").replace("\r", "\n")  # Line 39
    text = re.sub(r'\n{3,}', '\n\n', text)   # Line 41

    lines = []
    for line in text.split("\n"):               # Line 45
        cleaned_line = re.sub(r'[ \t]+', ' ', line).strip()   # Line 47
        lines.append(cleaned_line)              # Line 48

    return "\n".join(lines).strip()    # Line 51
```

This is the master pipeline function. Each step:

1. **Line 26–27:** Guard: return empty string if input is empty.
2. **Line 30:** Strip HTML.
3. **Line 33:** Resolve hyphenated line breaks.
4. **Line 36:** NFKC normalization — converts "fancy" characters to their standard equivalents.
5. **Line 39:** Standardize line endings. Windows uses `\r\n`, Unix uses `\n`, old Mac used `\r`. We convert everything to just `\n`.
6. **Line 41:** `re.sub(r'\n{3,}', '\n\n', text)` — If there are 3 or more empty lines in a row, collapse them to just 2. Keeps structure without wasted space.
7. **Lines 44–48:** Loop through each line. `re.sub(r'[ \t]+', ' ', line)` collapses multiple spaces and tabs into a single space.
8. **Line 51:** Rejoin all cleaned lines and strip leading/trailing whitespace.

---

---

## FILE 9: `src/chunker.py` — Cutting Text into Index Cards

```python
RecursiveCharacterTextSplitter = None    # Line 5
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter   # Line 7
except ImportError:
    try:
        from langchain.text_splitter import RecursiveCharacterTextSplitter   # Line 10
    except ImportError:
        pass    # Line 12
```

**Lines 5–12:** The class name `RecursiveCharacterTextSplitter` exists in two different import paths depending on which version of LangChain is installed. We try the modern path first, then the legacy path. If both fail, it stays as `None` and we use our own fallback.

---

### The Fallback Chunker

```python
def _fallback_split_text(text: str, chunk_size: int, chunk_overlap: int) -> List[str]:
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]   # Line 17
    chunks = []
    current_chunk = ""

    for para in paragraphs:
        if len(current_chunk) + len(para) + 2 <= chunk_size:    # Line 22
            current_chunk = (current_chunk + "\n\n" + para).strip()   # Line 23
        else:
            if current_chunk:
                chunks.append(current_chunk)    # Line 26
            current_chunk = para               # Line 27
```

**Line 17:** `text.split("\n\n")` splits by double newlines (paragraph breaks). The list comprehension filters out empty strings with `if p.strip()`.

**Line 22:** If the current paragraph fits in the current chunk (with room for the `\n\n` separator of 2 characters), add it. Otherwise, save the current chunk and start a new one with this paragraph.

---

```python
    if chunk_overlap > 0 and len(chunks) > 1:    # Line 33
        overlapped_chunks = []
        for i, chunk in enumerate(chunks):
            if i > 0 and len(chunks[i-1]) > chunk_overlap:   # Line 36
                overlap_text = chunks[i-1][-chunk_overlap:]  # Line 37
                overlapped_chunks.append((overlap_text + " " + chunk).strip())   # Line 38
```

**Lines 33–38 (The Overlap Logic):**

The overlap ensures context continuity. Imagine chunk 1 ends with "...the employee must provide" and chunk 2 starts with "a medical certificate." Without overlap, those two phrases are disconnected.

**Line 37:** `chunks[i-1][-chunk_overlap:]` — Python's slice notation. `[-120:]` means "take the last 120 characters." So `overlap_text` is the end of the previous chunk.

**Line 38:** We prepend `overlap_text` to the current chunk. Now chunk 2 contains the last 120 characters of chunk 1 plus all of chunk 2.

---

```python
def chunk_document(doc_text, base_metadata, chunk_size=600, chunk_overlap=120) -> List[Document]:

    if RecursiveCharacterTextSplitter is not None:    # Line 68
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ". ", "? ", "! ", " ", ""]   # Line 73
        )
        raw_chunks = splitter.split_text(doc_text)    # Line 75
```

**Line 73:** The `separators` list tells the splitter where it is *allowed* to cut text. It tries them in order of preference:
1. `"\n\n"` — Best: split at paragraph breaks
2. `"\n"` — Good: split at line breaks
3. `". "`, `"? "`, `"! "` — Okay: split at sentence endings
4. `" "` — Acceptable: split at word boundaries
5. `""` — Last resort: split mid-character (almost never used)

This ensures chunks always end at natural language boundaries.

---

```python
    for idx, text in enumerate(raw_chunks):
        meta = base_metadata.copy()    # Line 86
        meta.update({
            "chunk_index": idx,         # Line 88
            "total_chunks": total_chunks,  # Line 89
            "word_count": len(text.split()),   # Line 90
            "char_count": len(text)        # Line 91
        })
        documents.append(Document(page_content=text, metadata=meta))   # Line 93
```

**Line 86:** `base_metadata.copy()` — Critical! We create an independent copy for each chunk. If we used the same dictionary object for all chunks, changing one chunk's metadata would change all of them.

**Lines 88–91:** We stamp each chunk with its index, total sibling count, word count, and character count. This lets us later say "Chunk 2 of 5 from sample_policy.pdf."

**Line 93:** `Document(page_content=text, metadata=meta)` — A LangChain `Document` object. It is a simple container that holds text and a metadata dictionary together. ChromaDB knows how to store and retrieve these.

---

---

## FILE 10: `src/database.py` — The Library Catalog

### Understanding Embeddings

Before reading this code, let me explain the central magic of RAG.

**How does a computer know that "vacation days" and "annual leave" mean the same thing?**

The answer is: **embedding models**. These are AI models trained on billions of sentences to understand that words with similar meanings appear in similar contexts. They convert any text into a list of numbers called a **vector**.

```
"annual leave"  → [0.12, -0.45, 0.89, 0.03, ..., 0.67]  (384 numbers)
"vacation days" → [0.14, -0.43, 0.91, 0.01, ..., 0.65]  (384 numbers)
"stock price"   → [-0.78, 0.22, -0.34, 0.88, ..., -0.12] (very different)
```

The vectors for "annual leave" and "vacation days" are very *close* to each other in this 384-dimensional space. The vector for "stock price" is far away. ChromaDB uses this distance to find relevant chunks.

---

```python
def get_embedding_model(model_name: str = "all-MiniLM-L6-v2") -> HuggingFaceEmbeddings:
    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,          # Line 12
        model_kwargs={"device": "cpu"}, # Line 13
        encode_kwargs={"normalize_embeddings": True}   # Line 14
    )
```

**Line 12:** `model_name` specifies which embedding model to use. `all-MiniLM-L6-v2` is popular because it is small (22MB), fast on CPU, and produces high-quality 384-dimensional vectors.

**Line 13:** `"device": "cpu"` — Run on the CPU (not a GPU). Slower but works on any laptop.

**Line 14:** `"normalize_embeddings": True` — Makes all vectors the same length (magnitude = 1). This converts distance calculations to cosine similarity, which is more stable.

---

```python
class VectorDatabaseManager:
    def __init__(self, config: dict):
        ...
        self.db = Chroma(
            collection_name=self.collection_name,   # Line 33
            embedding_function=self.embeddings,     # Line 34
            persist_directory=self.db_dir           # Line 35
        )
```

**Line 33:** A ChromaDB *collection* is like a table in a relational database, or a folder in a filing cabinet. We name it by our `pipeline_name` from config.

**Line 34:** We pass our embedding model so ChromaDB knows how to convert new queries into vectors when searching.

**Line 35:** `persist_directory` means ChromaDB saves everything to disk in this folder. If you close and reopen the program, all previously indexed chunks are still there.

---

```python
    def upsert_documents(self, docs: List[Document]) -> int:
        ids = []
        for doc in docs:
            source = doc.metadata.get("source_file", "unknown_source")   # Line 52
            idx = doc.metadata.get("chunk_index", 0)                     # Line 53
            chunk_id = f"{source}_chunk_{idx:04d}"                        # Line 55
            ids.append(chunk_id)
        
        self.db.add_documents(documents=docs, ids=ids)   # Line 60
```

**Line 55:** `f"{source}_chunk_{idx:04d}"` — The `:04d` format specifier means "format as an integer with at least 4 digits, zero-padded." So chunk index 2 becomes `0002`. This makes the ID `sample_policy.pdf_chunk_0002`.

**Why deterministic IDs?** If we run the ingestion pipeline twice on the same file, the same IDs are generated. ChromaDB's `add_documents` with matching IDs performs an **upsert** (update if exists, insert if not). This prevents duplicate chunks from polluting the database.

---

```python
    def search(self, query: str, k: int = 3, filter_dict: dict = None):
        results = self.db.similarity_search_with_score(
            query=query,          # Line 81
            k=k,                  # Line 82
            filter=filter_dict    # Line 83
        )
```

**Line 81:** ChromaDB converts `query` to a vector using our embedding model, then finds the `k` vectors in the database that are closest to it.

**Line 83:** `filter_dict` is optional metadata filtering. `{"file_type": "pdf"}` would only search within PDF chunks and ignore emails. This is how our `--type` command-line flag works.

The function returns a list of `(Document, distance_score)` tuples. A lower score means closer (more similar).

---

---

## FILE 11: `src/model_backend.py` — The AI Answer Generator

```python
class LLMBackend:
    def __init__(self, config: dict):
        self.backend = config.get("llm_backend", "demo").lower()   # Line 12
        self.system_prompt = (                                       # Line 13
            "You are a helpful company assistant.\n"
            "Answer the user's question using ONLY the context provided below.\n"
            "If the answer is not contained in the context, respond exactly with: "
            "\"I don't have that information in my knowledge base. Please contact HR directly.\"\n"
            "Do NOT make up facts. Be concise, objective, and cite sources...\n"
        )
```

**Line 12:** `.lower()` converts to lowercase so `"Demo"`, `"DEMO"`, and `"demo"` all work the same way.

**Lines 13–19 (The System Prompt):** This is the instruction we give the AI model before it sees any user question. It establishes the rules:
- Only use the provided context (no making things up from training data)
- If the answer isn't in the context, say so explicitly rather than guessing
- Cite sources in the answer

This is **Prompt Engineering** — carefully wording instructions to control AI behavior. It is one of the most important skills in modern AI development.

---

```python
    def generate_answer(self, question: str, retrieved_docs: List[Document]) -> str:
        context_parts = []
        for doc in retrieved_docs:
            source = doc.metadata.get("source_file", "unknown")
            page = doc.metadata.get("page_number", None)
            
            citation = f"Source: {source}"
            if page:
                citation += f" (Page {page})"
            
            context_parts.append(f"[{citation}]\n{doc.page_content}")   # Line 39

        context_str = "\n\n---\n\n".join(context_parts)   # Line 41
```

**Line 39:** We wrap each retrieved chunk with its citation header. The AI model will see something like:
```
[Source: sample_policy.pdf (Page 1)]
ACME Corporation - Official Leave Policy v2.1
1. Annual Leave: Full-time employees are entitled to 20 days...
```

**Line 41:** The three chunks are joined with `\n\n---\n\n` separators to visually distinguish them for the model.

---

```python
        prompt = (
            f"{self.system_prompt}\n"
            f"CONTEXT:\n"
            f"{context_str}\n\n"
            f"QUESTION: {question}\n\n"
            f"ANSWER:"
        )
```

**The Complete Prompt Structure:** The final prompt that gets sent to the LLM looks like:

```
You are a helpful company assistant.
Answer the user's question using ONLY the context provided below.
...

CONTEXT:
[Source: sample_policy.pdf (Page 1)]
ACME Corporation - Official Leave Policy...

---

[Source: sample_email.eml]
From: HR Department...

QUESTION: How many vacation days do I get?

ANSWER:
```

The model reads all of this and generates the text that follows `ANSWER:`.

---

### The Ollama Direct HTTP Fallback

```python
    def _call_ollama(self, prompt: str, question: str, context_str: str) -> str:
        # Method A: Try LangChain ChatOllama wrapper
        try:
            from langchain_ollama import ChatOllama
            llm = ChatOllama(model=model, temperature=0.0)
            response = llm.invoke(prompt)
            return response.content.strip()
        except Exception:
            pass

        # Method B: Direct HTTP REST fallback
        url = "http://localhost:11434/api/chat"   # Line 92
        payload = {
            "model": model,
            "messages": [...],
            "stream": False,                     # Line 99
            "options": {"temperature": 0.0}      # Line 100
        }
        res = requests.post(url, json=payload, timeout=30)   # Line 102
```

**Line 92:** Ollama (when running locally) exposes a REST API at port `11434`. We can talk to it with raw HTTP requests, just like visiting a website.

**Line 99:** `"stream": False` — Ollama can stream tokens one by one (like ChatGPT typing character by character). We disable streaming to get the complete response in one go.

**Line 100:** `"temperature": 0.0` — Temperature controls randomness. `0.0` means completely deterministic (no creativity) — we want factual, consistent answers for corporate data.

**Line 102:** `requests.post()` sends the HTTP POST request. `timeout=30` means if Ollama doesn't respond within 30 seconds, give up (don't hang forever).

---

---

## FILE 12: `ingest.py` — The Factory Assembly Line

This is the orchestrator script that ties everything together. When you run `python practice/ingest.py`, this is what executes.

```python
EXTRACTOR_MAP = {     # Line 15
    ".pdf": PDFExtractor,
    ".eml": EmailExtractor,
    ".png": ImageExtractor,
    ".jpg": ImageExtractor,
    ".jpeg": ImageExtractor,
}
```

**Lines 15–21:** A Python dictionary mapping file extensions to extractor classes. When we encounter a `.pdf` file, we look up `EXTRACTOR_MAP[".pdf"]` and get back `PDFExtractor`. This is called the **Strategy Pattern** — selecting an algorithm at runtime based on context.

---

```python
def get_file_hash(file_path: str) -> str:
    hasher = hashlib.md5()   # Line 25
    with open(file_path, "rb") as f:
        buf = f.read(65536)   # Line 28 — read 64KB at a time
        while len(buf) > 0:
            hasher.update(buf)   # Line 30
            buf = f.read(65536)
    return hasher.hexdigest()   # Line 32
```

**Line 25:** MD5 is a hashing algorithm. It produces a 32-character "fingerprint" of any file. If a single byte in the file changes, the fingerprint changes completely.

**Line 28:** We read the file in 64KB chunks (`65536` bytes) instead of all at once. This allows us to hash very large files (like 500MB PDFs) without loading the entire file into RAM.

**Line 32:** `hexdigest()` returns the fingerprint as a hex string like `"a3f8b2c1d4e5f6a7..."`.

---

```python
def main():
    files = [f for f in os.listdir(raw_dir) if os.path.isfile(os.path.join(raw_dir, f))]  # Line 78
```

**Line 78:** A list comprehension that scans the raw directory. `os.listdir()` returns all names in the folder. We filter to only files (not sub-folders) using `os.path.isfile()`.

---

```python
        if filename in registry and registry[filename].get("hash") == file_hash:  # Line 109
            print(f"[SKIP] Already ingested & unchanged: {filename}")
            stats["skipped"] += 1
            continue   # Line 112
```

**Line 109:** The **change detection check**. We look up the file in our registry (a JSON file remembering what we processed before). If the file is in the registry AND its stored hash matches the current hash, the file has not changed. We skip it.

**Line 112:** `continue` jumps to the next iteration of the loop, skipping all the expensive extraction/embedding steps.

---

```python
        ExtractorClass = EXTRACTOR_MAP[ext]   # Line 117
        extractor = ExtractorClass()          # Line 118
        extraction_result = extractor.extract(file_path)  # Line 121
```

**Lines 117–121:** Dynamic extraction. We look up the extractor class for this file type, create an instance with `()`, then call `.extract()`. Because all extractors share the same interface (thanks to `BaseExtractor`), the rest of the code does not need to know which specific extractor was used.

---

```python
        if filename in registry:                       # Line 146
            db_manager.delete_by_source(filename)     # Line 148
```

**Lines 146–148:** If the file existed before (in the registry) but its content changed (hash mismatch), we delete all old chunks from the database BEFORE inserting new ones. Without this, you would have both the old and new versions of the document in your database — corrupting your search results.

---

```python
        registry[filename] = {                        # Line 158
            "hash": file_hash,                        # Line 159
            "last_ingested": datetime.now().isoformat(), # Line 160
            "chunks_count": upserted                  # Line 161
        }
```

**Lines 158–162:** After successful ingestion, we save the file's fingerprint, timestamp, and chunk count to the registry. This is what the next run will compare against.

---

```python
if __name__ == "__main__":   # Line 208
    main()                   # Line 209
```

**Lines 208–209:** This is Python's standard entry point guard. `__name__` is a special variable. When you run `python ingest.py` directly, `__name__` equals `"__main__"`. When another file imports `ingest.py`, `__name__` equals `"ingest"` and `main()` is NOT called automatically. This prevents the entire factory from running when you just want to import a function from it.

---

---

## FILE 13: `query.py` — Asking Questions

```python
def parse_args():
    parser = argparse.ArgumentParser(...)   # Line 8
    parser.add_argument("query", nargs="?", default=None, ...)   # Lines 9-15
    parser.add_argument("-k", type=int, default=3, ...)           # Lines 16-20
    parser.add_argument("--type", ...)                            # Lines 22-27
    parser.add_argument("--source", ...)                          # Lines 28-33
    return parser.parse_args()
```

**`argparse`** is Python's built-in command-line argument parser. It turns command-line text like:

```
python query.py "How many leave days?" -k 5 --type pdf
```

Into a Python object where:
- `args.query` = `"How many leave days?"`
- `args.k` = `5`
- `args.type` = `"pdf"`

`nargs="?"` makes the `query` argument optional. If omitted, `args.query` is `None` and we enter interactive mode.

---

```python
def execute_query(query_text, db_manager, llm, k, filter_dict):
    results = db_manager.search(query=query_text, k=k, filter_dict=filter_dict)  # Line 40
    
    retrieved_docs = [doc for doc, score in results]  # Line 48
    answer = llm.generate_answer(query_text, retrieved_docs)  # Line 52
```

**Line 40:** Sends the question to the vector database. Gets back `k` most relevant chunks.

**Line 48:** A list comprehension that unpacks each `(doc, score)` tuple, keeping only the `doc`. The scores are kept separately for the citation display.

**Line 52:** Sends the question and retrieved documents to the LLM backend to generate a grounded answer.

---

```python
    for idx, (doc, score) in enumerate(results, 1):   # Line 63
        ...
        print(f"  [{idx}] {ref} [{file_type}] (Distance: {score:.4f})")   # Line 79
```

**Line 63:** `enumerate(results, 1)` — Iterates through the results with a human-readable counter starting at 1. The `(doc, score)` syntax is called **tuple unpacking** — it splits each element of the list into its two components in one go.

**Line 79:** `{score:.4f}` formats the score to 4 decimal places. Scores are L2 distances — lower is better. A score of `0.77` means the chunk is very close to your question. A score of `1.42` means it is less similar.

---

```python
    while True:                         # Line 119
        query_text = input("Question: ").strip()   # Line 121
        if not query_text:
            continue                    # Line 123 — skip blank inputs
        if query_text.lower() in ["exit", "quit"]:
            break                       # Line 126
        execute_query(query_text, ...)  # Line 128
```

**Line 119:** `while True` creates an infinite loop. The only way out is the `break` on line 126.

**Line 121:** `input()` pauses the program and waits for the user to type something and press Enter. `.strip()` removes any leading/trailing whitespace.

**Line 123:** If the user pressed Enter without typing anything, `query_text` is `""`. `if not query_text` is `True` for empty strings. `continue` restarts the loop without executing `execute_query`.

---

---

## Putting It All Together: The Full Execution Flow

When you run `python practice/ingest.py`, here is exactly what happens:

```
1. main() is called
2. load_config() reads config.json and resolves paths
3. VectorDatabaseManager() loads the embedding model and opens ChromaDB
4. os.listdir() scans data/raw/ for files
5. For each file:
   a. Compute MD5 hash → compare with registry
   b. If unchanged: skip
   c. If new or changed:
      → Choose extractor from EXTRACTOR_MAP
      → extractor.extract() reads the file → raw text + metadata
      → clean_text() scrubs the text
      → chunk_document() cuts into overlapping Document objects
      → db_manager.delete_by_source() removes any old chunks
      → db_manager.upsert_documents() embeds and stores new chunks
      → registry is updated with new hash
6. Final report is printed and run_logs.json is saved
```

When you run `python practice/query.py "How many leave days?"`:

```
1. parse_args() reads the command-line arguments
2. load_config() and VectorDatabaseManager() are initialized
3. execute_query() is called:
   a. db_manager.search() embeds the question and finds top 3 chunks
   b. llm.generate_answer() formats the prompt and calls the LLM
   c. Answer and citations are printed to the terminal
```

---

---

## Key Concepts Summary

| Concept | Where it appears | Why it matters |
|---|---|---|
| Abstract Base Class | `base.py` | Enforces all extractors have the same interface |
| Fallback Imports | `pdf.py`, `image.py`, `chunker.py` | System works even with missing libraries |
| Config-Driven Design | `config.json`, `config_loader.py` | Change settings without touching code |
| Defensive Programming | Every file | Never crash — always handle errors gracefully |
| MD5 Change Detection | `ingest.py` | Skip re-processing unchanged files |
| Idempotency | `database.py` | Re-running produces the same result, not duplicates |
| Deterministic IDs | `database.py` | Chunk IDs based on filename + index = no duplicates |
| Semantic Embeddings | `database.py` | Search by meaning, not exact keyword matching |
| System Prompts | `model_backend.py` | Control AI behaviour and prevent hallucination |
| REST API Fallbacks | `model_backend.py` | Works even if LangChain packages break |
| Strategy Pattern | `ingest.py` (EXTRACTOR_MAP) | Select the right parser at runtime |

---

> **Professor's Final Words:**
>
> You now understand every single line of a production-grade AI system. This is the kind of code that runs inside real companies to handle real corporate knowledge.
>
> The most important lesson is not any specific line of code — it is the mindset:
>
> **Production code doesn't just work. It fails gracefully, recovers silently, and tells you exactly why.**
>
> Every `try/except`, every fallback, every hash check, every default value — these are not just safety nets. They are acts of respect for your future self and your teammates who will use this system at 2am when something unexpected happens.
>
> Welcome to the world of real AI engineering. Now go build something amazing!
