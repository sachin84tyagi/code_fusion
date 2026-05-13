# 🎓 Gen AI Application Journey
## Level 0 — Data Access and Preparation
### Topic 1: What is Data in AI?

> **Taught by:** Your World-Class Gen AI Architect & Professor
> **Difficulty:** ⭐ Beginner
> **Estimated Time:** 45–60 minutes
> **Prerequisite:** Just curiosity and excitement! 🚀

---

## 🗺️ What You'll Learn Today

- What "data" actually means in the world of AI
- Why data is the **fuel** of every AI system
- Structured vs Unstructured data (with real examples)
- Why data quality is life-or-death for AI
- Industry use cases
- Mini project + Quiz + Interview questions

---

## 1. 🧠 Simple Explanation — What is Data in AI?

Imagine you want to teach a small child how to recognize a dog.

What do you do?

You show them **pictures** of dogs. Hundreds of them.
You say: "This is a dog. This is also a dog. That one too."

After seeing enough examples, the child **learns** what a dog looks like.

AI works **exactly the same way.**

You feed the AI **data** — examples, text, images, numbers, documents — and it learns patterns from that data.

**Data = The food that AI eats to become smart.**

No food → the AI stays dumb.
Bad food → the AI becomes sick (wrong answers).
Good food → the AI becomes brilliant.

> 💡 **Key Insight:** Every single AI system — from ChatGPT to Google's search engine to Netflix recommendations — is powered by DATA. Without data, there is no AI. Period.

---

## 2. 🎯 Real-Life Analogy — The Recipe Book

Imagine you want to become a master chef.

| What a Chef Needs | What an AI System Needs |
|---|---|
| Recipes to study | Training data |
| Good quality ingredients | Clean, accurate data |
| Practice cooking | Model training |
| Tasting and feedback | Model evaluation |
| A kitchen with tools | GPU servers + infrastructure |

A chef who studied 10,000 recipes knows how to cook almost anything.
An AI trained on 10,000 documents knows how to answer almost anything about those documents.

**The quality of the recipes = the quality of the chef.**
**The quality of the data = the quality of the AI.**

---

## 3. 🔥 Why It Matters — The Foundation of Everything

Here's a shocking truth that every AI engineer learns the hard way:

> **80% of real AI project time is spent on DATA, not on models.**

Why? Because:

- Raw data is **messy** (typos, missing values, duplicates)
- Data comes in **many formats** (PDFs, Excel, databases, websites)
- Data needs to be **prepared** before AI can understand it
- **Bad data = Bad AI** — no matter how powerful your model is

```
GARBAGE IN → GARBAGE OUT
    📥              📤
  Bad Data    →   Dumb AI
  Good Data   →   Smart AI
```

This is why **Level 0** of our entire journey is about DATA.
Master data → master AI.

---

## 4. 🏢 Industry Use Cases

Here's how real companies deal with data:

| Company | Their Data | What AI Does With It |
|---|---|---|
| **Netflix** | Watch history, ratings, clicks | Recommends next show |
| **Amazon** | Purchase history, browsing | Recommends products |
| **ChatGPT** | Entire internet text | Answers any question |
| **Your Bank** | Transaction history | Detects fraud |
| **A Hospital** | Patient records, lab results | Predicts diseases |
| **An HR Dept** | Resumes, policies, job descriptions | Screens candidates |

Every single one of these starts with **collecting and preparing data**.

---

## 5. 🏗️ Architecture Explanation — The Data Journey

Before data reaches an AI model, it goes through a journey:

```
RAW DATA WORLD                    AI MODEL WORLD
─────────────────────────────────────────────────────
                                                    
  📄 PDF Files   ─┐                                
  📊 Excel Files  ├──► [COLLECT] ──► [CLEAN] ──► [PREPARE] ──► 🤖 AI Model
  🌐 Websites     ├──►                                          
  🗄️ Databases   ─┘                                            
  📧 Emails                                                     
                                                    
─────────────────────────────────────────────────────
Step 1: Collect    Step 2: Clean    Step 3: Prepare
  (Find data)      (Fix mess)       (Format for AI)
```

Think of it like a water purification plant:
- **Dirty water** comes in (raw data)
- It gets **filtered and purified** (cleaned and prepared)
- **Clean water** comes out for people to drink (AI-ready data)

---

## 6. 📋 Step-by-Step Workflow — Data's Journey to AI

```
Step 1: IDENTIFY DATA SOURCES
   ↓  "Where does our data live?"
   ↓  PDFs? Databases? Websites? APIs?

Step 2: COLLECT THE DATA
   ↓  Download, extract, scrape, export

Step 3: INSPECT THE DATA
   ↓  "What does this data look like?"
   ↓  Are there errors? Missing pieces?

Step 4: CLEAN THE DATA
   ↓  Fix typos, remove duplicates,
   ↓  fill missing values, standardize formats

Step 5: TRANSFORM THE DATA
   ↓  Convert to the right format
   ↓  PDFs → Text, Tables → Rows, etc.

Step 6: VALIDATE THE DATA
   ↓  "Is this data good enough for AI?"

Step 7: STORE THE DATA
   ↓  Save in a database, file system, or vector store

Step 8: FEED TO AI MODEL ✅
```

---

## 7. 💻 Practical Coding Example

Let's write our very first piece of AI data code!
We'll **read a text file** and inspect it like a real AI engineer would.

First, let's set up our project folder:

```
GenAI_Journey/
└── Level_0/
    ├── data/
    │   └── sample_company_policy.txt
    ├── 01_What_Is_Data_In_AI.md       ← You are here
    └── 01_data_basics.py              ← We'll create this
```

### Create sample data first:

```python
# File: create_sample_data.py
# PURPOSE: Create a fake company policy document to practice with

sample_policy = """
ACME Corporation - Employee Leave Policy

1. Annual Leave
   All full-time employees are entitled to 20 days of annual leave per year.
   Part-time employees receive leave on a pro-rata basis.

2. Sick Leave
   Employees may take up to 10 days of sick leave per year.
   A medical certificate is required for absences exceeding 3 consecutive days.

3. Maternity/Paternity Leave
   Primary caregivers are entitled to 16 weeks of paid leave.
   Secondary caregivers are entitled to 4 weeks of paid leave.

4. Public Holidays
   Employees are entitled to all gazetted public holidays.
   Work on public holidays attracts double pay or a day off in lieu.
"""

# Save it to a file
with open("data/sample_company_policy.txt", "w") as f:
    f.write(sample_policy)

print("✅ Sample data file created!")
```

### Now let's read and inspect it like an AI engineer:

```python
# File: 01_data_basics.py
# PURPOSE: Learn to read, inspect, and understand raw data
# DIFFICULTY: Beginner ⭐

# ─────────────────────────────────────────────
# STEP 1: Import tools we need
# ─────────────────────────────────────────────
import os  # For working with files and folders

# ─────────────────────────────────────────────
# STEP 2: Define our data file path
# ─────────────────────────────────────────────
DATA_FILE = "data/sample_company_policy.txt"

# ─────────────────────────────────────────────
# STEP 3: Read the raw data
# ─────────────────────────────────────────────
print("=" * 50)
print("🔍 STEP 1: Reading Raw Data")
print("=" * 50)

with open(DATA_FILE, "r") as file:
    raw_text = file.read()  # Read entire file as a string

print(raw_text)

# ─────────────────────────────────────────────
# STEP 4: Inspect the data (like a detective!)
# ─────────────────────────────────────────────
print("\n" + "=" * 50)
print("🔍 STEP 2: Inspecting Data Stats")
print("=" * 50)

# Count basic statistics
total_characters = len(raw_text)
total_words      = len(raw_text.split())
total_lines      = len(raw_text.split("\n"))

print(f"📊 Total Characters : {total_characters}")
print(f"📊 Total Words      : {total_words}")
print(f"📊 Total Lines      : {total_lines}")

# ─────────────────────────────────────────────
# STEP 5: Check for data quality issues
# ─────────────────────────────────────────────
print("\n" + "=" * 50)
print("🔍 STEP 3: Checking Data Quality")
print("=" * 50)

# Check for empty lines
empty_lines = [i for i, line in enumerate(raw_text.split("\n")) if line.strip() == ""]
print(f"⚠️  Empty lines found: {len(empty_lines)}")

# Check for very short lines (might be noise)
short_lines = [line for line in raw_text.split("\n") if 0 < len(line.strip()) < 5]
print(f"⚠️  Very short lines : {short_lines}")

# ─────────────────────────────────────────────
# STEP 6: Clean the data
# ─────────────────────────────────────────────
print("\n" + "=" * 50)
print("🔍 STEP 4: Cleaning Data")
print("=" * 50)

# Remove extra whitespace
cleaned_text = " ".join(raw_text.split())
print(f"✅ Cleaned text length: {len(cleaned_text)} chars")
print(f"✅ Reduction: {total_characters - len(cleaned_text)} chars removed")

# ─────────────────────────────────────────────
# STEP 7: Split into sentences (basic chunking!)
# ─────────────────────────────────────────────
print("\n" + "=" * 50)
print("🔍 STEP 5: Basic Chunking (Splitting Data)")
print("=" * 50)

# Split into paragraphs
paragraphs = [p.strip() for p in raw_text.split("\n\n") if p.strip()]
print(f"📦 Total chunks (paragraphs): {len(paragraphs)}")

for i, chunk in enumerate(paragraphs):
    print(f"\n--- Chunk {i+1} ---")
    print(chunk[:100] + "..." if len(chunk) > 100 else chunk)

print("\n✅ Data inspection complete! Ready for AI processing.")
```

---

## 8. 📖 Line-by-Line Code Explanation

```python
import os
```
→ This imports Python's built-in "os" module. It lets us work with files and folders on our computer. Think of it as opening a file cabinet.

```python
with open(DATA_FILE, "r") as file:
    raw_text = file.read()
```
→ `open()` opens the file. `"r"` means "read mode" (not write).
→ `file.read()` reads everything inside as one big string.
→ `with` automatically closes the file when done (good habit!).

```python
total_characters = len(raw_text)
total_words      = len(raw_text.split())
```
→ `len()` counts how many items are in something.
→ `.split()` breaks the text into a list of words by spaces.
→ So `len(raw_text.split())` = number of words.

```python
empty_lines = [i for i, line in enumerate(raw_text.split("\n")) if line.strip() == ""]
```
→ This is a "list comprehension" — a fancy Python one-liner.
→ It goes through every line, and collects line numbers where the line is empty.
→ `.strip()` removes spaces from the start/end of a line.

```python
cleaned_text = " ".join(raw_text.split())
```
→ `.split()` breaks text into words (automatically removes extra spaces).
→ `" ".join(...)` puts them back together with single spaces.
→ Result: All extra whitespace is removed! ✅

---

## 9. ❌ Common Mistakes (Don't Make These!)

| Mistake | Why It's Wrong | What To Do Instead |
|---|---|---|
| Skipping data inspection | You won't know what's broken | Always inspect first |
| Using raw, uncleaned data | AI learns garbage patterns | Always clean before feeding |
| Ignoring empty/null values | Causes crashes or wrong answers | Handle missing data explicitly |
| Forgetting to close files | Memory leaks in production | Always use `with open(...)` |
| Assuming data is consistent | Real data is NEVER consistent | Validate every assumption |
| Using too little data | AI won't learn properly | More quality data = better AI |

---

## 10. ✅ Best Practices (Do These!)

```
✅ 1. ALWAYS inspect your data before using it
✅ 2. Document where your data came from (data lineage)
✅ 3. Keep raw data separate from processed data
✅ 4. Version control your data (like you do code)
✅ 5. Check for PII (personal info) before using data in AI
✅ 6. Test with a small sample first, then scale up
✅ 7. Log every data transformation step
✅ 8. Validate data quality at every stage
```

### Folder Structure Best Practice:

```
my_ai_project/
├── data/
│   ├── raw/          ← Original, untouched data
│   ├── processed/    ← Cleaned and prepared data
│   └── samples/      ← Small samples for testing
├── scripts/
│   ├── ingest.py     ← Data loading scripts
│   └── clean.py      ← Data cleaning scripts
├── notebooks/        ← Jupyter notebooks for exploration
└── README.md         ← Document everything!
```

---

## 11. 🛠️ Mini Project — Your First Data Inspector

**Mission:** Build a "Data Health Check" tool

**Task:** Write a Python script that:
1. Reads any `.txt` file
2. Reports: total words, total lines, empty lines, longest line
3. Detects potential issues: very short lines, very long lines
4. Gives a "Data Health Score" out of 10

**Starter code:**

```python
# mini_project_data_health_check.py

def check_data_health(filepath: str) -> dict:
    """
    Reads a text file and returns a health report.
    
    Args:
        filepath: Path to the text file
    
    Returns:
        A dictionary with health metrics
    """
    with open(filepath, "r") as f:
        text = f.read()
    
    lines = text.split("\n")
    words = text.split()
    
    report = {
        "total_characters": len(text),
        "total_words":      len(words),
        "total_lines":      len(lines),
        "empty_lines":      sum(1 for l in lines if l.strip() == ""),
        "longest_line_len": max(len(l) for l in lines),
        # TODO: Add more metrics!
        # TODO: Calculate a "health score" out of 10
    }
    
    return report

# Test it
report = check_data_health("data/sample_company_policy.txt")
for key, value in report.items():
    print(f"{key:25s}: {value}")
```

**Bonus Challenge:** Make it work for multiple files in a folder!

---

## 12. 🚀 Advanced Insights (For The Curious Mind)

### How Real Enterprise Companies Handle Data:

**At companies like Google, Amazon, and banks:**

```
ENTERPRISE DATA PIPELINE
─────────────────────────────────────────────
                                             
  Source Systems          Processing Layer        Storage
  ─────────────          ─────────────────       ─────────
  CRM Database    ─┐                           ┌─ Data Lake
  ERP System      ├──► Apache Kafka   ──────► ├─ Data Warehouse  
  Web Logs        ├──► (Real-time               ├─ Vector Database
  Email Systems   ├──►  streaming)              └─ Feature Store
  PDFs/Docs       ─┘                           
                         ↓                    
                   Data Quality               ↓
                   Checks (Great           AI Models
                   Expectations,           consume
                   dbt, etc.)             clean data
```

**Key enterprise tools you'll eventually learn:**
- **Apache Kafka** — Real-time data streaming
- **Apache Spark** — Processing massive datasets
- **dbt** — Data transformation
- **Great Expectations** — Data quality validation
- **Airflow** — Orchestrating data pipelines
- **Delta Lake / Iceberg** — Managing large-scale data

---

## 13. 💼 Interview Questions

These are **real questions** asked at AI Engineer interviews:

**Q1: What is the difference between data cleaning and data transformation?**
> 💡 Answer: Cleaning fixes errors (typos, nulls, duplicates). Transformation changes the format or structure (e.g., text → numbers, JSON → CSV).

**Q2: Why is data quality more important than model selection?**
> 💡 Answer: Even the best model cannot learn from bad data. A mediocre model with excellent data often beats a great model with poor data.

**Q3: What is "data lineage" and why does it matter?**
> 💡 Answer: Data lineage tracks where data came from, how it was transformed, and who touched it. It matters for debugging AI errors, compliance, and reproducing results.

**Q4: How would you handle missing values in an AI dataset?**
> 💡 Answer: Options include: remove rows with missing values, fill with mean/median/mode, use a placeholder like "unknown", or train a model to predict the missing values. Choice depends on the context.

**Q5: What is PII and why should you care about it in AI?**
> 💡 Answer: PII = Personally Identifiable Information (names, emails, SSNs). If an AI model is trained on PII without proper handling, it can leak private data in its outputs — a major legal and ethical risk.

---

## 14. 📝 Quiz — Test Your Knowledge!

**Question 1:** What does "GIGO" stand for in AI?
- A) Google Intelligence and General Operations
- B) Garbage In, Garbage Out ✅
- C) General Input, General Output
- D) GPU-based Intelligence Generation Output

**Question 2:** Which of these is an example of UNSTRUCTURED data?
- A) A database table with customer names and ages
- B) A PDF of a company policy document ✅
- C) An Excel spreadsheet with sales numbers
- D) A CSV file with product inventory

**Question 3:** What percentage of real AI project time is typically spent on data (not models)?
- A) 20%
- B) 40%
- C) 60%
- D) 80% ✅

**Question 4:** Why should you use `with open(file) as f:` instead of just `open(file)`?
- A) It's faster
- B) It automatically closes the file when done ✅
- C) It reads the file faster
- D) It's required by Python 3

**Question 5:** Which folder should store original, untouched data?
- A) data/processed/
- B) data/samples/
- C) data/raw/ ✅
- D) data/backup/

---

## 15. 🏠 Homework Challenge

### Challenge 1 (Easy ⭐)
Write a Python script that reads all `.txt` files from a folder and prints:
- File name
- Word count
- Line count

### Challenge 2 (Medium ⭐⭐)
Extend the script to detect and report:
- Files with less than 50 words (too small for AI?)
- Files with more than 10,000 words (might need chunking)
- Files with encoding errors

### Challenge 3 (Hard ⭐⭐⭐)
Build a "Data Quality Dashboard" that:
1. Reads multiple files from a folder
2. Generates a quality report for each
3. Saves the report as a JSON file
4. Prints a summary table to the terminal

**Expected output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         DATA QUALITY DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
File                  Words  Lines  Health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
policy.txt            342    45     ✅ Good
faq.txt               89     12     ⚠️  Short
manual.txt            5621   890    ✅ Good
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 What's Coming Next in Level 0

```
Topic 1: What is Data in AI?              ← YOU ARE HERE ✅
Topic 2: Structured vs Unstructured Data  ← NEXT UP! 
Topic 3: Data Sources (PDFs, APIs, DBs)
Topic 4: Data Cleaning and Preprocessing
Topic 5: Chunking and Splitting
Topic 6: Metadata
Topic 7: Embeddings Basics
Topic 8: Vector Databases Basics
Topic 9: ETL Pipelines for AI
Topic 10: Data Quality Issues
Topic 11: Enterprise Data Pipelines
```

---

## 🔐 Security Note (Applies to Every Level!)

> **⚠️ NEVER feed raw customer data into AI models without checking for PII first!**

Even in practice, develop the habit of:
- Anonymizing names, emails, phone numbers before using data
- Never hardcoding API keys or passwords in code
- Always using environment variables for secrets

```python
# ❌ WRONG (never do this)
api_key = "sk-abc123youractualkey"

# ✅ RIGHT (always do this)
import os
api_key = os.getenv("OPENAI_API_KEY")
```

---

*End of Topic 1 — What is Data in AI? 🎉*

**Next Topic:** Structured vs Unstructured Data →

---
> 📌 **Remember:** The greatest AI engineers in the world spend most of their time on data, not on fancy models. Master data, master AI!

# 🎓 Gen AI Application Journey
## Level 0 — Topic 2: Structured vs Unstructured Data

> **Difficulty:** ⭐ Beginner-Friendly  
> **Estimated Time:** 60–90 minutes  
> **Files:** `02_structured_vs_unstructured.py`

---

## 🗺️ What You'll Learn Today

- What "structured" data really means (with deep examples)
- What "unstructured" data really means (with deep examples)
- A third type that surprises most beginners: Semi-Structured data
- Why the difference matters enormously for AI systems
- How companies handle each type differently
- How to read and process all three types in Python
- Real industry stories and use cases
- Common beginner mistakes + best practices
- Mini project, quiz, interview questions, homework

---

## 1. 🧠 Simple Explanation

Let me tell you a story.

Imagine you are a librarian in a HUGE library.

**Library A** (Structured):
Every book is arranged perfectly. Every shelf has a label. Every book has a number. You can find ANY book in 10 seconds by going to: Shelf → Row → Slot. The system is rigid, organized, and predictable.

**Library B** (Unstructured):
Books are piled everywhere. On the floor, on chairs, stuffed into boxes. Some are written in English, some in French, some are handwritten diaries, some are photo albums. You need to READ each one to understand what's inside.

**Library C** (Semi-Structured):
Books are in labeled boxes, but inside each box, books are organized differently. Box 1 has alphabetical order. Box 2 is by date. Box 3 is random. There's SOME structure, but not completely rigid.

This is EXACTLY how data works in the real world.

---

## 2. 📚 Deep Dive — What is STRUCTURED Data?

### Definition
Structured data is data that lives in a **fixed format** with a **predefined schema** (a blueprint of what data exists and where).

Think of it as data in a perfectly organized **table** — rows and columns — where every piece of data has a specific, known location.

### Real-Life Example: A School Report Card

```
+------------+--------+---------+---------+--------+
| StudentID  | Name   | English | Science | Grade  |
+------------+--------+---------+---------+--------+
| STU001     | Alice  | 92      | 88      | A      |
| STU002     | Bob    | 75      | 91      | B+     |
| STU003     | Charlie| 85      | 79      | B      |
+------------+--------+---------+---------+--------+
```

See how:
- Every row = one student's record
- Every column = one specific piece of information
- Every cell = a specific, expected type of value
- You know EXACTLY where to find any information

This is structured data. A computer can answer "What is Alice's English score?" in milliseconds.

### Where Does Structured Data Live?

```
STRUCTURED DATA SOURCES
─────────────────────────────────────────────

📊 Spreadsheets (Excel, Google Sheets)
   └── Rows and columns, formulas, tables

🗄️ Relational Databases (MySQL, PostgreSQL)
   └── Tables with strict schemas
   └── Connected by relationships (foreign keys)
   └── Queried using SQL

📈 CSV Files (.csv)
   └── Comma-Separated Values
   └── Like a simple spreadsheet saved as text

📉 Sensor Data / IoT Data
   └── Temperature: 36.5°C at 09:00:00
   └── Speed: 60 km/h at 09:00:05
   └── Every reading has a timestamp + value

💳 Financial Transaction Logs
   └── Date | Amount | MerchantID | CardNumber | Status
   └── Banks process billions of these daily

📦 E-commerce Order Data
   └── OrderID | CustomerID | ProductID | Qty | Price
```

### Key Properties of Structured Data

| Property | Description |
|---|---|
| **Schema** | Has a fixed, predefined structure |
| **Format** | Rows and columns (tabular) |
| **Search** | Easy to query with SQL or filters |
| **Storage** | Databases, CSV, Excel |
| **AI Readiness** | Relatively easy to use directly |
| **Examples** | Databases, CSV, Excel, sensor data |

---

## 3. 📄 Deep Dive — What is UNSTRUCTURED Data?

### Definition
Unstructured data has **NO predefined format or schema**. It doesn't fit neatly into rows and columns. You cannot directly query it with SQL.

It's raw, free-form, and requires extra work to make it usable for AI.

### Real-Life Example: An Employee Complaint Letter

```
Hi HR Team,

My name is Ravi and I've been working here for 3 years.
I wanted to raise a concern about the recent policy change
regarding overtime compensation. Last Tuesday, I worked
4 extra hours but was told these won't be counted because
the new system wasn't set up yet. This is unfair and I 
hope you can look into this urgently.

Thanks,
Ravi Sharma
Employee ID: EMP-4521
```

See how:
- There is NO fixed structure
- Information is scattered throughout the text
- "3 years" is his tenure — but where exactly? Line 3!
- "EMP-4521" is his ID — but it's buried in a signature
- A computer cannot directly "query" this like a database

To extract useful information from this, you need **Natural Language Processing (NLP)** — which is what LLMs do!

### Where Does Unstructured Data Live?

```
UNSTRUCTURED DATA SOURCES
─────────────────────────────────────────────────

📄 PDF Documents
   └── Annual reports, legal contracts, manuals
   └── Text, tables, images all mixed together

📝 Word Documents (.docx)
   └── Policies, proposals, meeting notes
   └── Formatting, comments, tracked changes

📧 Emails
   └── Free-form text, attachments, threads
   └── Conversation history

💬 Chat Messages / WhatsApp / Slack
   └── Abbreviations, emojis, typos, slang

🌐 Web Pages (HTML)
   └── Mixed content: text, links, images, ads

🎥 Videos
   └── Visual content, speech, captions

🖼️ Images
   └── Photos, scanned documents, charts

🎙️ Audio Files
   └── Call recordings, podcasts, meetings

📰 News Articles / Blog Posts
   └── Long-form free text with opinions
```

### Key Properties of Unstructured Data

| Property | Description |
|---|---|
| **Schema** | No fixed structure |
| **Format** | Free-form (text, image, audio, video) |
| **Search** | Requires NLP or computer vision |
| **Storage** | File systems, blob storage, data lakes |
| **AI Readiness** | Needs significant preprocessing |
| **Examples** | PDFs, emails, images, videos, audio |

---

## 4. 🧩 Deep Dive — What is SEMI-STRUCTURED Data?

### Definition
Semi-structured data is the **middle ground**. It has SOME organizational structure (like tags or keys), but it's not as rigid as a database table. Different records can have different fields.

### Real-Life Example: JSON Data from a Website

```json
[
  {
    "name": "Alice",
    "age": 30,
    "skills": ["Python", "SQL", "Machine Learning"],
    "address": {
      "city": "Mumbai",
      "country": "India"
    }
  },
  {
    "name": "Bob",
    "age": 25,
    "skills": ["JavaScript"],
    "linkedin": "linkedin.com/in/bob"
  }
]
```

See how:
- Alice has `address` but Bob doesn't
- Bob has `linkedin` but Alice doesn't
- The structure VARIES between records
- BUT there are keys (labels) that give it SOME organization

This is semi-structured. More organized than a letter, less rigid than a database.

### Common Semi-Structured Formats

```
SEMI-STRUCTURED DATA TYPES
─────────────────────────────────────────

📋 JSON (JavaScript Object Notation)
   └── Key-value pairs
   └── Nested structures allowed
   └── Used heavily in APIs and web apps

📋 XML (eXtensible Markup Language)
   └── Tag-based format
   └── Used in enterprise systems, configs

📋 YAML (Yet Another Markup Language)
   └── Human-readable key-value format
   └── Used in configurations (Docker, Kubernetes)

📋 HTML (Web Pages)
   └── Has tags <h1>, <p>, <div> for structure
   └── But content is free-form text

📋 Emails with Metadata
   └── From:, To:, Date:, Subject: are structured
   └── But the email body is unstructured text

📋 Log Files
   └── [2024-01-15 09:23:11] ERROR: Connection timeout
   └── Timestamp is structured, message is free text

📋 NoSQL Database Records (MongoDB)
   └── Documents with flexible schemas
```

---

## 5. 📊 Side-by-Side Comparison

```
┌─────────────────┬──────────────────┬───────────────────┬──────────────────┐
│   Feature       │  STRUCTURED      │ SEMI-STRUCTURED   │  UNSTRUCTURED    │
├─────────────────┼──────────────────┼───────────────────┼──────────────────┤
│ Organization    │ Rows & Columns   │ Keys & Tags       │ None / Free-form │
│ Schema          │ Fixed, strict    │ Flexible          │ No schema        │
│ Query Language  │ SQL              │ JSON path/XPath   │ NLP required     │
│ Storage         │ RDBMS, CSV       │ NoSQL, JSON files │ Files, S3, Blobs │
│ AI Difficulty   │ ⭐ Easy          │ ⭐⭐ Medium        │ ⭐⭐⭐ Hard       │
│ % of World Data │ ~20%             │ ~10%              │ ~70%             │
│ Examples        │ Excel, MySQL     │ JSON, XML, Logs   │ PDFs, Emails     │
└─────────────────┴──────────────────┴───────────────────┴──────────────────┘
```

> 🔥 **Mind-blowing stat:** 80-90% of all data in the world is UNSTRUCTURED.
> This is WHY AI (especially LLMs) are so revolutionary — they can finally READ and UNDERSTAND unstructured data!

---

## 6. 🏢 Industry Use Cases — The Real World

### Use Case 1: HR Department (A Bank)

```
DATA TYPES AN HR DEPARTMENT DEALS WITH:

STRUCTURED:
├── Employee Database (MySQL)
│   ├── EmployeeID, Name, Department
│   ├── Salary, Join Date, Manager
│   └── Leave Balance, Performance Rating
│
SEMI-STRUCTURED:
├── Employee JSON Profiles (from HR app API)
│   ├── Skills list (varies per employee)
│   └── Project history (varies per project)
│
UNSTRUCTURED:
├── Resumes (PDFs, Word docs)
├── Performance review notes (free text)
├── HR policy documents (PDF)
├── Employee complaint emails
├── Interview feedback notes
└── Training materials (videos, PDFs)
```

**The AI Challenge:** An HR AI assistant needs to work with ALL three types together!

### Use Case 2: Legal Firm

```
STRUCTURED DATA:
├── Case database (case number, date, status, judge)
├── Client billing records
└── Court schedule calendar

SEMI-STRUCTURED DATA:
├── Case metadata in JSON (case type, parties involved)
└── Legal citations in XML format

UNSTRUCTURED DATA:
├── Actual legal documents (500-page PDFs)
├── Court transcripts (text files)
├── Witness statements (Word docs)
├── Emails between lawyers and clients
└── Scanned handwritten notes (images)
```

**A legal AI assistant** must read those 500-page PDFs and answer: "Has this client had any prior disputes related to intellectual property?" — That requires NLP on unstructured data!

### Use Case 3: Hospital / Healthcare

```
STRUCTURED:
├── Patient records DB (age, blood group, allergies)
├── Lab results (test name, value, reference range)
└── Appointment scheduling system

SEMI-STRUCTURED:
├── HL7/FHIR medical data formats (healthcare JSON/XML)
└── Medical device sensor data (JSON logs)

UNSTRUCTURED:
├── Doctor's handwritten notes (scanned images!)
├── Radiology reports (PDF + images)
├── Patient symptom descriptions (free text)
├── Medical research papers (PDFs)
└── Pathology reports (mixed text + tables + images)
```

---

## 7. 🔧 Why This Matters For AI — The Processing Pipeline

Each data type needs a DIFFERENT preprocessing pipeline:

```
STRUCTURED DATA PIPELINE:
─────────────────────────
CSV/Excel/DB
    ↓
Load with pandas / SQLAlchemy
    ↓
Handle missing values, normalize
    ↓
Feature engineering
    ↓
Feed to ML Model / LLM as context

SEMI-STRUCTURED DATA PIPELINE:
────────────────────────────────
JSON / XML / YAML
    ↓
Parse with json / xml libraries
    ↓
Flatten nested structures
    ↓
Extract relevant fields
    ↓
Convert to text or tabular format
    ↓
Feed to LLM

UNSTRUCTURED DATA PIPELINE:
─────────────────────────────
PDF / Word / Email / Image
    ↓
Extract text (PyPDF2, python-docx, OCR)
    ↓
Clean and normalize text
    ↓
Chunk into pieces
    ↓
Create embeddings (convert to numbers)
    ↓
Store in Vector Database
    ↓
Retrieve relevant chunks → Feed to LLM
```

This third pipeline (for unstructured data) is exactly what **RAG** (Level 2 of our course) is all about!

---

## 8. 💻 Practical Coding Example

### File Structure for This Topic

```
GenAI_Journey/
└── Level_0/
    ├── data/
    │   ├── structured/
    │   │   ├── employees.csv
    │   │   └── sales.csv
    │   ├── semi_structured/
    │   │   ├── products.json
    │   │   └── config.yaml
    │   └── unstructured/
    │       ├── company_policy.txt
    │       └── customer_complaint.txt
    ├── 02_Structured_vs_Unstructured_Data.md   ← You are here
    └── 02_structured_vs_unstructured.py        ← Code file
```

See the companion file: `02_structured_vs_unstructured.py`

---

## 9. ❌ Common Beginner Mistakes

### Mistake 1: Thinking All Data is Structured
```
❌ WRONG ASSUMPTION:
"I'll just put everything in a database!"

✅ REALITY:
PDFs, emails, and chat messages CANNOT go directly into
a relational database in their raw form. They need special
processing first.
```

### Mistake 2: Ignoring Semi-Structured Data
```
❌ WRONG:
"It's either a table or free text, nothing in between."

✅ REALITY:
Most modern applications produce JSON data from APIs.
Semi-structured data is extremely common in web development,
mobile apps, and microservices. Learn to handle it!
```

### Mistake 3: Treating All Unstructured Data the Same
```
❌ WRONG:
"It's all just text, handle it the same way."

✅ REALITY:
A scanned PDF (image) needs OCR first.
A Word doc needs python-docx to extract text.
An audio file needs speech-to-text.
A web page needs HTML parsing (BeautifulSoup).
Each unstructured type has its own extraction method!
```

### Mistake 4: Not Checking Encoding
```
❌ WRONG:
with open("file.txt") as f:
    text = f.read()  # Crashes on non-English text!

✅ RIGHT:
with open("file.txt", encoding="utf-8") as f:
    text = f.read()  # Always specify encoding!
```

### Mistake 5: Losing Data Structure Context
```
❌ WRONG:
Converting a table in a PDF to plain text loses the
column relationships. "Alice 92 88 A" means nothing
without knowing which column is which.

✅ RIGHT:
Preserve table structure when extracting from PDFs.
Use specialized libraries that understand table layout.
```

---

## 10. ✅ Best Practices

```
DATA HANDLING BEST PRACTICES
═══════════════════════════════════════════════════

STRUCTURED DATA:
✅ Always validate schema before loading
✅ Use typed columns (int, float, datetime)
✅ Index columns used for searching
✅ Handle NULL values explicitly

SEMI-STRUCTURED DATA:
✅ Validate JSON schema when possible
✅ Handle missing keys gracefully (use .get())
✅ Flatten deeply nested structures
✅ Document the expected structure

UNSTRUCTURED DATA:
✅ Always specify file encoding (utf-8)
✅ Use the right library for each file type
✅ Preserve metadata (file name, date, author)
✅ Log extraction errors (some files will fail)
✅ Test with a sample before processing thousands

ALL DATA TYPES:
✅ Never modify raw/original data
✅ Save intermediate processed versions
✅ Track data provenance (where it came from)
✅ Validate output after every transformation
```

---

## 11. 🛠️ Mini Project — Multi-Format Data Loader

**Mission:** Build a "Universal Data Loader" that auto-detects the data type and loads it correctly.

**Requirements:**
1. Accept any file path as input
2. Detect whether it's structured (CSV), semi-structured (JSON), or unstructured (TXT)
3. Load it using the right method
4. Print a summary report

**Starter Template:**

```python
def universal_data_loader(filepath: str) -> dict:
    """
    Detects data type and loads it correctly.
    Returns a standardized report dict.
    """
    extension = filepath.split(".")[-1].lower()
    
    if extension == "csv":
        return load_structured(filepath)
    elif extension == "json":
        return load_semi_structured(filepath)
    elif extension in ["txt", "md"]:
        return load_unstructured(filepath)
    else:
        return {"error": f"Unsupported format: {extension}"}

# TODO: Implement load_structured(), load_semi_structured(), load_unstructured()
# HINT: The answers are in 02_structured_vs_unstructured.py !
```

---

## 12. 🚀 Advanced Insights

### How Big Tech Companies Classify Their Data

**At Google:**
- Structured: Ad performance metrics (billions of rows/day)
- Semi-structured: User profile JSON objects
- Unstructured: YouTube videos, Gmail text, Search queries

**At a Hospital Network:**
- Structured: Patient vitals in EMR databases
- Semi-structured: HL7 FHIR medical records (healthcare JSON)
- Unstructured: Doctor notes, MRI scans, X-rays

### The Data Lakehouse Architecture (Modern Enterprise)

```
MODERN DATA ARCHITECTURE
══════════════════════════════════════════════════════

Raw Zone (Bronze Layer):
├── All data lands here as-is
├── Structured: CSV, DB dumps
├── Semi-structured: JSON, XML, Logs
└── Unstructured: PDFs, Images, Videos

Cleaned Zone (Silver Layer):
├── Validated and cleaned data
├── Semi-structured flattened to tables
└── Unstructured text extracted

Feature Zone (Gold Layer):
├── AI-ready features
├── Embeddings of text data
└── Aggregated metrics

AI Consumption Layer:
├── Vector databases (for unstructured)
├── Feature stores (for ML models)
└── Data warehouses (for analytics)
```

This is called a **Medallion Architecture** — used by companies like Databricks, Netflix, and Uber.

---

## 13. 💼 Interview Questions

**Q1: What is the difference between structured and unstructured data? Give 3 examples of each.**
> Structured: predefined schema, tabular. Examples: MySQL tables, CSV files, Excel sheets.
> Unstructured: no fixed format. Examples: PDFs, emails, audio recordings.

**Q2: Why is unstructured data harder to use in AI systems?**
> Because AI models need numerical inputs. Unstructured data (like text) must first be extracted, cleaned, chunked, and converted to embeddings (numbers) before it can be used. This requires multiple preprocessing steps.

**Q3: What is semi-structured data? Give an example.**
> Semi-structured data has some organizational markers (like keys in JSON) but doesn't have a rigid schema. Example: a JSON API response where different objects may have different fields.

**Q4: What percentage of enterprise data is unstructured, and why does this matter?**
> ~80-90% of enterprise data is unstructured. This matters because this huge reservoir of knowledge (in PDFs, emails, documents) was previously unusable by traditional systems. LLMs and RAG now make this data accessible.

**Q5: If a company wants to build an AI assistant for their HR policies (PDF documents), what type of data is involved and what approach would you use?**
> Unstructured data (PDFs). Approach: Extract text from PDFs → clean and chunk → create embeddings → store in vector DB → use RAG to retrieve relevant chunks → pass to LLM for answering.

**Q6: What Python library would you use to read each of these: CSV, JSON, PDF, Excel, XML?**
> CSV: `pandas` or `csv` | JSON: `json` | PDF: `PyPDF2` or `pdfplumber` | Excel: `openpyxl` or `pandas` | XML: `xml.etree.ElementTree`

---

## 14. 📝 Quiz

**Q1:** Which data type is typically stored in a relational database?
- A) Unstructured  
- B) Semi-structured  
- C) Structured ✅  
- D) All of the above

**Q2:** A WhatsApp message is which type of data?
- A) Structured  
- B) Semi-structured  
- C) Unstructured ✅  
- D) None of the above

**Q3:** JSON data is best described as:
- A) Structured  
- B) Semi-structured ✅  
- C) Unstructured  
- D) Binary

**Q4:** Approximately what percentage of world data is unstructured?
- A) 20%  
- B) 40%  
- C) 60%  
- D) 80% ✅

**Q5:** Which Python library is best for reading CSV files into a table (DataFrame)?
- A) json  
- B) pandas ✅  
- C) PyPDF2  
- D) requests

**Q6:** When extracting text from a scanned PDF (a photo of a document), you need:
- A) Just PyPDF2  
- B) OCR (Optical Character Recognition) ✅  
- C) xml.etree  
- D) pandas

---

## 15. 🏠 Homework Challenges

### Challenge 1 (Easy ⭐)
Create a CSV file with 10 employee records (name, department, salary, join_date).
Write Python code to:
- Read it using pandas
- Find the highest salary
- Count employees per department

### Challenge 2 (Medium ⭐⭐)
Create a JSON file with 5 product records where each product has DIFFERENT optional fields (some have `discount`, some have `rating`, some have neither).
Write Python code to:
- Read the JSON safely
- Handle missing keys using `.get()` with default values
- Print a summary of all products

### Challenge 3 (Hard ⭐⭐⭐)
Write a script that:
1. Reads a folder containing mixed file types (CSV, JSON, TXT)
2. Auto-detects the type of each file
3. Extracts basic info from each
4. Generates a unified summary report saved as JSON

**Expected output:**
```json
{
  "total_files": 5,
  "by_type": {
    "structured": 2,
    "semi_structured": 1,
    "unstructured": 2
  },
  "files": [
    {"name": "employees.csv", "type": "structured", "rows": 10},
    {"name": "products.json", "type": "semi_structured", "records": 5},
    {"name": "policy.txt", "type": "unstructured", "words": 342}
  ]
}
```

---

## 🎯 Topics Progress in Level 0

```
✅ Topic 1: What is Data in AI?
✅ Topic 2: Structured vs Unstructured Data   ← YOU ARE HERE
⬜ Topic 3: Data Sources (PDFs, APIs, DBs, Websites)
⬜ Topic 4: Data Cleaning and Preprocessing
⬜ Topic 5: Chunking and Splitting
⬜ Topic 6: Metadata
⬜ Topic 7: Embeddings Basics
⬜ Topic 8: Vector Databases Basics
⬜ Topic 9: ETL Pipelines for AI
⬜ Topic 10: Data Quality Issues
⬜ Topic 11: Enterprise Data Pipelines
```

---

## 🔐 Security Note

> **⚠️ Watch out for CSV Injection!**
> If your CSV data contains formulas like `=CMD|...`, they can execute when opened in Excel.
> Always sanitize user-provided CSV data before storing or displaying it.

> **⚠️ JSON from APIs can be malicious!**
> Never directly `eval()` a JSON string. Always use `json.loads()` which is safe.

```python
# ❌ DANGEROUS — Never do this!
data = eval(api_response_text)

# ✅ SAFE — Always use json.loads()
import json
data = json.loads(api_response_text)
```

---
*End of Topic 2 — Structured vs Unstructured Data 🎉*

**Next Topic:** Data Sources — PDFs, Word Docs, APIs, Databases, Websites →
# 🎓 Gen AI Application Journey
## Level 0 — Topic 3: Data Sources
### PDFs, Word Docs, APIs, Databases & Websites

> **Difficulty:** ⭐⭐ Beginner-Intermediate
> **Estimated Time:** 90–120 minutes
> **Code File:** `03_data_sources.py`
> **Extra Requirements:** `pip install PyPDF2 python-docx requests beautifulsoup4`

---

## 🗺️ What You'll Learn Today

- Where real enterprise data actually lives (the 5 big sources)
- How to extract text from PDF files (the #1 source in enterprise AI)
- How to read Word documents (.docx files)
- How to call REST APIs and get data programmatically
- How to query SQL databases using Python
- How to scrape and parse web pages
- How each source connects to an AI pipeline
- Security considerations for each source
- Real industry pipelines with code

---

## 1. 🧠 The Big Picture — Where Does Enterprise Data Live?

Let me paint you a picture of a real company.

Imagine you join **ACME Bank** as an AI Engineer on Day 1.
Your manager says: *"We need an AI assistant that can answer questions about our bank's policies, products, customer data, and market trends."*

You ask: *"Where is all this information?"*

Your manager smiles and says: *"Everywhere."*

```
WHERE ACME BANK'S DATA LIVES:
══════════════════════════════════════════════════════════

  📄 PDF Files           → 12,000 policy documents, loan agreements,
  (File Servers)           audit reports, compliance manuals

  📝 Word Documents      → 3,000 HR policies, meeting notes,
  (SharePoint)             product specifications, training materials

  🌐 REST APIs           → Real-time stock prices, exchange rates,
  (External Services)      credit scores, customer KYC data

  🗄️ SQL Databases       → 50 million customer records, transaction
  (Oracle, PostgreSQL)     history, account balances, loan records

  🌍 Web Pages           → Competitor product pages, regulatory
  (Internet)               announcements, market news

══════════════════════════════════════════════════════════
```

**Your job as an AI engineer:** Pull data from ALL these sources,
clean and prepare it, and feed it to the AI system.

This is called building a **Data Ingestion Pipeline** — and it's
one of the most important skills in enterprise AI engineering.

---

## 2. 📄 Data Source #1 — PDF Files

### Why PDFs Are #1 in Enterprise AI

PDFs are the most common document format in business. Every company has thousands of them:

- Legal contracts and agreements
- Annual reports and financial statements
- Policy and compliance documents
- Product manuals and technical specifications
- Research reports and whitepapers
- Medical records and insurance claims
- Government forms and regulatory filings

> 🔥 **Industry Fact:** When companies build AI assistants (like "Ask our policy bot"), they are almost always working with PDF files. This is why **PDF parsing is skill #1** for enterprise AI engineers.

### The PDF Challenge

PDFs are tricky because:

```
THE PDF CHALLENGE
═════════════════════════════════════════════════════

Type 1: TEXT-BASED PDF
├── Created from Word/Google Docs → "Save as PDF"
├── Text is extractable digitally
└── Tools: PyPDF2, pdfplumber ← EASY ✅

Type 2: SCANNED PDF (Image-based)
├── Printed paper → Scanned to PDF
├── Text is actually a PHOTOGRAPH
├── Cannot extract text directly!
└── Tools: OCR (Tesseract, AWS Textract) ← HARDER ⚠️

Type 3: HYBRID PDF
├── Mix of text layers and scanned images
├── Tables embedded as images
└── Tools: pdfplumber + OCR ← COMPLEX ⚠️⚠️
```

### How PDF Extraction Works

```
PDF FILE
   │
   ▼
[PDF PARSER]  ← PyPDF2 / pdfplumber
   │
   ├──► Extracts text layer (if text-based)
   ├──► Extracts metadata (author, date, pages)
   ├──► Identifies tables (if supported)
   └──► Returns: plain text string
          │
          ▼
     [TEXT CLEANER]
          │
          ▼
     [CHUNKER]  ← Split into pieces for AI
          │
          ▼
     [EMBEDDER]  ← Convert to numbers
          │
          ▼
     [VECTOR DB]  ← Store for retrieval
```

### Key Python Libraries for PDFs

| Library | Best For | Strengths | Weaknesses |
|---|---|---|---|
| **PyPDF2** | Simple text extraction | Fast, lightweight, no install issues | Poor table support |
| **pdfplumber** | Tables + text | Great table extraction | Slower on large files |
| **PyMuPDF (fitz)** | Complex PDFs | Fast, good layout detection | Larger dependency |
| **pdfminer.six** | Deep text mining | Most accurate text positioning | Complex API |
| **AWS Textract** | Enterprise OCR | Handles scanned docs | Costs money, requires AWS |

---

## 3. 📝 Data Source #2 — Word Documents (.docx)

### Why Word Docs Matter

Microsoft Word is the #1 document tool in business. HR policies,
meeting minutes, project proposals, and internal reports all live in `.docx` files.

### The DOCX Structure (How Word Files Work)

```
A .DOCX FILE IS ACTUALLY A ZIP ARCHIVE!
═══════════════════════════════════════════

myDocument.docx (ZIP file)
├── word/
│   ├── document.xml    ← The actual text content (XML format!)
│   ├── styles.xml      ← Formatting rules
│   ├── header1.xml     ← Page headers
│   └── footer1.xml     ← Page footers
├── media/
│   ├── image1.png      ← Embedded images
│   └── image2.jpg
└── [Content_Types].xml ← Describes all file types

The python-docx library reads document.xml and gives
you the text without you needing to understand XML!
```

### Components of a Word Document

```python
# A Word document has these main parts:

doc.paragraphs   # List of all paragraphs (most content is here)
doc.tables       # All tables in the document
doc.sections     # Page sections (for headers/footers)

# Each paragraph has:
para.text        # The actual text
para.style.name  # "Heading 1", "Normal", "List Bullet", etc.
para.runs        # Individual formatted text segments

# Example: Detect headings vs body text
for para in doc.paragraphs:
    if para.style.name.startswith("Heading"):
        print(f"HEADING: {para.text}")
    else:
        print(f"TEXT: {para.text}")
```

---

## 4. 🌐 Data Source #3 — REST APIs

### What is an API?

API = Application Programming Interface

Think of an API like a **waiter at a restaurant**:

```
YOU (Your Code)         WAITER (API)         KITCHEN (Remote Server)
═══════════════         ═══════════          ══════════════════════
                                             
"Give me today's   →   Delivers your    →   Looks up price
 Bitcoin price"         request              in database
                                             
Receives price     ←   Brings back      ←   Returns: $67,432.50
$67,432.50              the result
```

You send a **request** (HTTP GET/POST), you receive a **response** (usually JSON).

### How APIs Work Step-by-Step

```
STEP 1: You write a URL (the API endpoint)
  https://api.coindesk.com/v1/bpi/currentprice.json

STEP 2: You send an HTTP request
  requests.get(url)

STEP 3: The API server processes it and sends back JSON
  {
    "bpi": {
      "USD": {
        "rate": "67,432.50",
        "description": "US Dollar"
      }
    }
  }

STEP 4: You parse the JSON and use the data
  price = data["bpi"]["USD"]["rate"]
```

### Types of APIs You'll Use in AI Projects

| API Type | Example | What Data You Get |
|---|---|---|
| **Public APIs** | OpenWeatherMap, CoinGecko | Free data, no auth needed |
| **Authenticated APIs** | OpenAI, Google, Twitter | API key required |
| **Internal Company APIs** | Your company's ERP system | Business data, behind firewall |
| **Webhook APIs** | Stripe, GitHub | They PUSH data to YOU |
| **GraphQL APIs** | GitHub v4, Shopify | You request exactly what you need |

### Authentication Methods

```python
# Method 1: API Key in Header (most common)
headers = {"Authorization": "Bearer YOUR_API_KEY"}
response = requests.get(url, headers=headers)

# Method 2: API Key as Query Parameter
response = requests.get(url, params={"api_key": "YOUR_KEY"})

# Method 3: Basic Auth (username + password)
response = requests.get(url, auth=("username", "password"))

# Method 4: OAuth (for Google, Twitter, etc.)
# More complex — uses token exchange system
```

---

## 5. 🗄️ Data Source #4 — SQL Databases

### What is a SQL Database?

SQL (Structured Query Language) databases store data in **tables** (like Excel sheets) that are connected to each other.

```
EXAMPLE: A Bank's Database Structure
══════════════════════════════════════════════════

TABLE: customers               TABLE: accounts
┌──────────┬──────────────┐   ┌──────────┬──────────────┬─────────┐
│ cust_id  │ name         │   │ acc_id   │ cust_id      │ balance │
├──────────┼──────────────┤   ├──────────┼──────────────┼─────────┤
│ C001     │ Alice        │   │ A001     │ C001         │ 50,000  │
│ C002     │ Bob          │   │ A002     │ C001         │ 15,000  │
│ C003     │ Charlie      │   │ A003     │ C002         │ 8,500   │
└──────────┴──────────────┘   └──────────┴──────────────┴─────────┘
                                    ↑
                              Links to customers
                              via cust_id (foreign key)

SQL QUERY: "Show me Alice's total balance across all accounts"
SELECT SUM(balance) FROM accounts WHERE cust_id = 'C001'
RESULT: 65,000
```

### Python's sqlite3 — Your First Database

SQLite is a lightweight database that lives in a single file.
Perfect for learning and small projects. No server needed!

```
Popular Databases in Enterprise:
┌─────────────────┬──────────────┬────────────────────────┐
│ Database        │ Used By      │ Python Library         │
├─────────────────┼──────────────┼────────────────────────┤
│ SQLite          │ Dev/Testing  │ sqlite3 (built-in!)    │
│ PostgreSQL      │ Startups     │ psycopg2               │
│ MySQL           │ Web apps     │ mysql-connector-python │
│ Oracle DB       │ Banks, telco │ cx_Oracle              │
│ SQL Server      │ Microsoft    │ pyodbc                 │
│ BigQuery        │ Google/data  │ google-cloud-bigquery  │
└─────────────────┴──────────────┴────────────────────────┘
```

---

## 6. 🌍 Data Source #5 — Web Pages (Web Scraping)

### What is Web Scraping?

Web scraping = Automatically reading and extracting data from websites.

```
NORMAL WEB BROWSING:            WEB SCRAPING:
══════════════════════          ══════════════════════
You → Open browser              Your code → requests.get(url)
You → Visit page                Code → downloads raw HTML
You → Read content              Code → beautifulsoup parses HTML
You → Copy useful info          Code → extracts specific data
                                Code → saves it automatically
MANUAL: 1 page per minute       AUTO: 1000+ pages per minute
```

### How a Web Page is Structured (HTML Basics)

```html
<!-- This is what a web page looks like in code (HTML) -->

<html>
  <head>
    <title>Product Catalog</title>   ← Page title
  </head>
  <body>
    <h1>Our Products</h1>            ← Main heading (h1)
    
    <div class="product-card">       ← A container div
      <h2>Laptop Pro X1</h2>         ← Sub heading (h2)
      <p class="price">$1,200</p>    ← Paragraph with class="price"
      <p class="description">        ← Description paragraph
        High-performance laptop...
      </p>
    </div>
    
  </body>
</html>
```

### BeautifulSoup — Your Web Scraping Tool

```python
from bs4 import BeautifulSoup

html = "<h1>Hello World</h1><p class='info'>Some text</p>"
soup = BeautifulSoup(html, "html.parser")

# Find elements:
soup.find("h1")              # First <h1> tag
soup.find("p", class_="info") # <p> with class="info"
soup.find_all("p")           # ALL <p> tags as a list
soup.get_text()              # All text, no HTML tags
```

### Legal & Ethical Web Scraping

> ⚠️ **IMPORTANT:** Web scraping has legal and ethical rules!

```
BEFORE YOU SCRAPE A WEBSITE — CHECK:

✅ robots.txt: Visit https://website.com/robots.txt
   This file tells you what the site ALLOWS you to scrape.

✅ Terms of Service: Read the website's ToS
   Many sites explicitly forbid automated scraping.

✅ Rate Limiting: Don't bombard the server
   Add delays: time.sleep(1) between requests.

✅ Copyright: The data you scrape may be copyrighted.
   Don't republish it without permission.

❌ NEVER scrape:
   - Personal information without consent
   - Sites that explicitly say "no scraping" in ToS
   - At speeds that could harm the server (DDoS)
```

---

## 7. 🏗️ Architecture — The Complete Data Source Pipeline

Here's how all 5 sources feed into one AI system:

```
ENTERPRISE AI DATA INGESTION PIPELINE
════════════════════════════════════════════════════════════════

  SOURCE LAYER              EXTRACTION LAYER        PROCESSING LAYER
  ═══════════               ════════════════        ════════════════

  📄 PDF Files    ────►  PyPDF2/pdfplumber  ─┐
  📝 Word Docs    ────►  python-docx        ─┤
  🌐 REST APIs    ────►  requests           ─┼──► TEXT CLEANER
  🗄️ Databases   ────►  sqlite3/SQLAlchemy ─┤       │
  🌍 Web Pages    ────►  BeautifulSoup      ─┘       │
                                                     ▼
                                               CHUNKER
                                               (split into pieces)
                                                     │
                                                     ▼
                                               EMBEDDER
                                               (text → numbers)
                                                     │
                                                     ▼
                                            ┌── VECTOR DATABASE ──┐
                                            │   ChromaDB/Pinecone │
                                            └─────────────────────┘
                                                     │
                                            USER ASKS QUESTION
                                                     │
                                                     ▼
                                            RETRIEVE relevant chunks
                                                     │
                                                     ▼
                                              LLM GENERATES ANSWER
```

---

## 8. 💻 Code — See `03_data_sources.py`

The companion Python file demonstrates all 5 data sources with:
- Real PDF creation and extraction
- Real Word document creation and reading
- Real API calls (using a free public API)
- Real SQLite database operations
- Real web page parsing
- A unified data loader that combines all sources

---

## 9. ❌ Common Beginner Mistakes

### Mistake 1: Ignoring Encoding When Reading Files
```python
# ❌ WRONG — Crashes on non-English documents
with open("document.txt") as f:
    text = f.read()

# ✅ RIGHT — Always specify encoding
with open("document.txt", encoding="utf-8") as f:
    text = f.read()
```

### Mistake 2: Not Handling API Failures
```python
# ❌ WRONG — Crashes if API is down
response = requests.get(url)
data = response.json()

# ✅ RIGHT — Always check status code
response = requests.get(url, timeout=10)
if response.status_code == 200:
    data = response.json()
else:
    print(f"API Error: {response.status_code}")
    data = {}
```

### Mistake 3: Forgetting to Close Database Connections
```python
# ❌ WRONG — Connection leak
conn = sqlite3.connect("mydb.db")
cursor = conn.cursor()
cursor.execute("SELECT * FROM users")

# ✅ RIGHT — Use context manager
with sqlite3.connect("mydb.db") as conn:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
# Connection auto-closes here
```

### Mistake 4: Scraping Without Rate Limiting
```python
# ❌ WRONG — Hammers the server, can get you banned!
for url in urls:
    response = requests.get(url)

# ✅ RIGHT — Add delay between requests
import time
for url in urls:
    response = requests.get(url)
    time.sleep(1)  # Wait 1 second between requests
```

### Mistake 5: Assuming PDF Text is Clean
```python
# ❌ WRONG ASSUMPTION:
# "PyPDF2 will give me clean, perfect text"

# ✅ REALITY:
# PDF extraction often produces:
# - Extra whitespace between characters: "H e l l o"
# - Broken words across lines: "docu-\nment"
# - Garbled special characters: â€™ instead of '
# ALWAYS clean and validate PDF output!
```

---

## 10. ✅ Best Practices

```
PDF BEST PRACTICES:
✅ Try pdfplumber for tables, PyPDF2 for simple text
✅ Always check page count before processing
✅ Handle password-protected PDFs gracefully
✅ For scanned PDFs, plan for OCR from the start
✅ Log extraction failures — some PDFs will always fail

WORD DOC BEST PRACTICES:
✅ Check paragraph.style to identify headings
✅ Extract table data separately from paragraphs
✅ Handle embedded images by logging them as "[IMAGE]"
✅ Process headers and footers separately if needed

API BEST PRACTICES:
✅ Always set a timeout (timeout=10)
✅ Implement retry logic for transient failures
✅ Cache API responses to avoid redundant calls
✅ Store API keys in environment variables, never in code!
✅ Respect rate limits — check API docs for limits
✅ Log all API calls for debugging and auditing

DATABASE BEST PRACTICES:
✅ Use parameterized queries to prevent SQL injection
✅ Use connection pooling in production
✅ Index columns you frequently search/filter on
✅ Never SELECT * in production — specify columns
✅ Use transactions for multi-step operations

WEB SCRAPING BEST PRACTICES:
✅ Check robots.txt before scraping
✅ Use a realistic User-Agent header
✅ Add delays between requests (1-3 seconds)
✅ Handle HTTP errors (403, 429, 503) gracefully
✅ Use CSS selectors or XPath for precise extraction
✅ Cache responses to avoid re-scraping
```

---

## 11. 🔐 Security — Critical for All Data Sources

### SQL Injection (The #1 Database Attack)
```python
# ❌ DANGEROUS — User input directly in SQL query!
user_input = "'; DROP TABLE users; --"  # Malicious input
query = f"SELECT * FROM users WHERE name = '{user_input}'"
# This would DELETE your entire users table!

# ✅ SAFE — Always use parameterized queries
cursor.execute("SELECT * FROM users WHERE name = ?", (user_input,))
# The ? placeholder safely escapes the input
```

### API Key Security
```python
# ❌ NEVER do this — your key gets exposed in git history!
API_KEY = "sk-abc123yoursecretkey"

# ✅ Store in environment variable or .env file
import os
API_KEY = os.getenv("MY_API_KEY")

# .env file (never commit to git!):
# MY_API_KEY=sk-abc123yoursecretkey

# Add to .gitignore:
# .env
```

### PII in Data Sources
```
WATCH OUT FOR PII (Personally Identifiable Information):

📄 PDFs: Customer names, ID numbers, signatures
📝 Word Docs: Employee personal details, salary info
🌐 APIs: Customer contact info, behavioral data
🗄️ Databases: Social Security Numbers, credit cards
🌍 Web Pages: Public profiles with personal info

RULE: Never feed raw PII into AI models without
masking or anonymizing it first!
```

---

## 12. 🚀 Advanced Insights — Enterprise Data Ingestion

### How Companies Like ACME Bank Do This at Scale

```
ENTERPRISE-GRADE DATA INGESTION (What you'll build at Level 5)
══════════════════════════════════════════════════════════════

TRIGGER LAYER:
├── Scheduled (Apache Airflow runs at midnight)
├── Event-driven (new file uploaded → trigger pipeline)
└── Real-time (Kafka stream → process immediately)

EXTRACTION LAYER:
├── PDF Cluster: 10 worker nodes extract PDFs in parallel
├── API Gateway: Manages rate limits across 20+ APIs
├── DB Connector Pool: 50 database connections managed
└── Web Crawler: Distributed Scrapy cluster

PROCESSING LAYER:
├── Apache Spark: Processes millions of records
├── Data Quality: Great Expectations validates every batch
└── PII Detector: Identifies and masks personal info

STORAGE LAYER:
├── Raw Zone (S3/Azure Blob): Original files, never modified
├── Processed Zone (Delta Lake): Cleaned text
└── Vector Store (Pinecone): Embeddings ready for AI

MONITORING:
├── Airflow Dashboard: Track pipeline runs
├── Alerts: PagerDuty notification if pipeline fails
└── Cost Tracking: Monitor cloud spend per pipeline
```

### LangChain Document Loaders (What You'll Use in Level 2)

At Level 2 (RAG), you'll use LangChain's built-in loaders:

```python
# LangChain makes data loading MUCH easier!
from langchain_community.document_loaders import (
    PyPDFLoader,         # PDFs
    Docx2txtLoader,      # Word documents
    WebBaseLoader,       # Web pages
    CSVLoader,           # CSV files
    SQLDatabaseLoader,   # SQL databases
)

# All loaders have the same interface:
loader = PyPDFLoader("my_document.pdf")
docs   = loader.load()  # Returns list of Document objects

# Each Document has:
# doc.page_content  → The text
# doc.metadata      → Source, page number, etc.
```

---

## 13. 💼 Real Industry Use Cases

### Use Case 1: Legal AI Assistant (Law Firm)
```
DATA SOURCES:
├── PDF: 50,000 case documents, contracts, precedents
├── Database: Case management system (case ID, status, parties)
├── API: Legal research API (LexisNexis, Westlaw)
└── Web: Court websites for new judgments

AI CAN ANSWER:
"Find all cases where our client won intellectual
 property disputes involving software patents in 2022"
```

### Use Case 2: HR Policy Bot (Enterprise)
```
DATA SOURCES:
├── Word Docs: 200 HR policy documents from SharePoint
├── PDF: Employee handbook (150 pages)
├── Database: Employee database (for personalization)
└── API: Internal HR system API

AI CAN ANSWER:
"How many days of paternity leave am I entitled to
 as a senior engineer with 3 years experience?"
```

### Use Case 3: Market Intelligence Bot (Investment Bank)
```
DATA SOURCES:
├── APIs: Bloomberg, Reuters, Yahoo Finance (real-time prices)
├── Web: Financial news, company press releases
├── PDF: Annual reports, earnings call transcripts
└── Database: Internal portfolio management system

AI CAN ANSWER:
"Summarize the Q4 earnings highlights from our top
 10 portfolio companies and flag any risk signals"
```

---

## 14. 💼 Interview Questions

**Q1: What is the difference between PyPDF2 and pdfplumber? When would you use each?**
> PyPDF2: Lightweight, fast, good for simple text extraction. pdfplumber: Better for structured content extraction (tables, precise text positioning). Use pdfplumber when you need tables or need accurate text layout preservation.

**Q2: What is SQL injection and how do you prevent it?**
> SQL injection is when malicious SQL code is inserted into an input field that gets executed by the database. Prevent it by always using parameterized queries (`?` placeholders) instead of string formatting.

**Q3: What is a REST API and what are HTTP methods?**
> A REST API is a standardized way to communicate with web services using HTTP. Common methods: GET (retrieve data), POST (send/create data), PUT (update data), DELETE (remove data).

**Q4: Why is it bad to put API keys in your Python source code?**
> Because code gets committed to version control (Git), shared with team members, and potentially exposed publicly. API keys in code can be harvested by attackers. Always use environment variables or secret managers.

**Q5: A client gives you 10,000 scanned PDF documents. What is your approach?**
> Step 1: Verify a sample manually to understand quality. Step 2: Use OCR (AWS Textract or Tesseract) to extract text since scanned PDFs are images. Step 3: Validate OCR quality (spot-check output). Step 4: Clean the extracted text (fix OCR errors). Step 5: Process through the AI pipeline.

**Q6: What is robots.txt and why must you check it before scraping?**
> robots.txt is a file at `website.com/robots.txt` that specifies which parts of a website can be crawled by bots. Ignoring it is unethical and may violate terms of service, potentially leading to IP bans or legal issues.

---

## 15. 📝 Quiz

**Q1:** Which Python library is best for extracting tables from PDFs?
- A) PyPDF2
- B) pdfplumber ✅
- C) python-docx
- D) requests

**Q2:** What does `response.status_code == 200` mean for an API call?
- A) Error occurred
- B) Server is busy
- C) Request was successful ✅
- D) Authentication failed

**Q3:** How do you prevent SQL injection attacks?
- A) Use f-strings in SQL queries
- B) Use parameterized queries with `?` placeholders ✅
- C) Capitalize all SQL keywords
- D) Use a faster database

**Q4:** What is `robots.txt`?
- A) A Python library for web scraping
- B) A file that tells crawlers which pages they can access ✅
- C) A database connection configuration file
- D) An API authentication method

**Q5:** A `.docx` file is actually a:
- A) Binary file
- B) Plain text file
- C) ZIP archive containing XML files ✅
- D) Database file

**Q6:** Where should API keys be stored in a Python project?
- A) Directly in the Python source code
- B) In a README file
- C) In environment variables or a `.env` file ✅
- D) In a public GitHub repository

---

## 16. 🏠 Homework Challenges

### Challenge 1 (Easy ⭐)
Create a Python script that calls a FREE public API (e.g., https://api.coindesk.com/v1/bpi/currentprice.json) and:
- Extracts the Bitcoin price in USD
- Displays it with proper formatting
- Saves the result to a JSON file with a timestamp

### Challenge 2 (Medium ⭐⭐)
Build a "Document Inventory Scanner":
- Read a folder containing `.txt` and `.json` files
- For each file, record: filename, size in KB, word count, creation date
- Save inventory to a SQLite database
- Print a formatted summary table

### Challenge 3 (Hard ⭐⭐⭐)
Build a "Multi-Source Knowledge Aggregator":
1. Read 2 text files (policy documents)
2. Call 1 public API (weather or finance)
3. Query a SQLite database (employee records)
4. Combine all data into a single unified "knowledge base" JSON
5. Print a summary: how many words/records came from each source

---

## 🎯 Topics Progress in Level 0

```
✅ Topic 1: What is Data in AI?
✅ Topic 2: Structured vs Unstructured Data
✅ Topic 3: Data Sources (PDFs, APIs, DBs, Web)  ← YOU ARE HERE
⬜ Topic 4: Data Cleaning and Preprocessing
⬜ Topic 5: Chunking and Splitting
⬜ Topic 6: Metadata
⬜ Topic 7: Embeddings Basics
⬜ Topic 8: Vector Databases Basics
⬜ Topic 9: ETL Pipelines for AI
⬜ Topic 10: Data Quality Issues
⬜ Topic 11: Enterprise Data Pipelines
```

---
*End of Topic 3 — Data Sources 🎉*
**Next:** Topic 4 — Data Cleaning and Preprocessing →
# 🎓 Gen AI Application Journey
## Level 0 — Topic 4: Data Cleaning & Preprocessing

> **Difficulty:** ⭐⭐ Beginner-Intermediate
> **Time:** 90 minutes | **Code:** `04_data_cleaning.py`

---

## 🗺️ What You'll Learn

- Why raw data is ALWAYS dirty and what "dirty" means
- 10 types of data quality problems (with real examples)
- Text cleaning techniques (normalization, noise removal)
- Handling missing values — 4 different strategies
- Deduplication — finding and removing duplicate records
- Data validation — checking if data makes sense
- Preprocessing pipelines — chaining steps together
- How enterprise AI teams clean data at scale

---

## 1. 🧠 Simple Explanation — Why Data is Never Clean

Imagine you just bought 1,000 used books from different sellers.

- Some have **torn pages** (missing data)
- Some have **coffee stains** over text (noise/corruption)
- Some are **duplicate copies** of the same book (duplicates)
- Some are in **French** even though you wanted English (wrong format)
- Some have the **wrong title** on the cover (incorrect data)
- Some have **handwritten notes** all over the margins (extra noise)

Before you can read and use these books, you need to **sort, clean, and organize** them.

**Data cleaning = doing exactly this for your AI's data.**

> 🔥 **Industry Reality:** A senior AI engineer at Google once said:
> *"We spend 60–80% of our time cleaning data. The model training takes just 10%."*
> This is NOT an exaggeration.

---

## 2. 🩺 The 10 Types of Dirty Data (With Real Examples)

```
TYPE 1: MISSING VALUES
───────────────────────────────────────────────────────
Raw:     Name: Alice | Age: 30  | Email: None
Problem: Email is missing — AI can't use this record properly
Fix:     Fill with "unknown@company.com" or remove the record

TYPE 2: DUPLICATE RECORDS
───────────────────────────────────────────────────────
Raw:     Row 1: Alice Johnson | eng@co.com | $95,000
         Row 2: Alice Johnson | eng@co.com | $95,000  ← SAME!
Problem: AI learns the same thing twice (inflates importance)
Fix:     Remove exact duplicates; merge near-duplicates

TYPE 3: INCONSISTENT FORMATTING
───────────────────────────────────────────────────────
Raw:     "2024-01-15"  vs  "Jan 15, 2024"  vs  "15/01/2024"
Problem: Three ways to say the same date — AI gets confused
Fix:     Standardize all to one format: "2024-01-15"

TYPE 4: WRONG DATA TYPES
───────────────────────────────────────────────────────
Raw:     Salary column: "95000", "₹88,000", "eighty-eight thousand"
Problem: Mix of numbers, strings, words — can't do math
Fix:     Convert all to integer: 95000, 88000, 88000

TYPE 5: EXTRA WHITESPACE & SPECIAL CHARACTERS
───────────────────────────────────────────────────────
Raw:     "  Hello   World!!  \n\t"
Problem: Extra spaces, newlines, tabs, special chars confuse AI
Fix:     Strip and normalize: "Hello World"

TYPE 6: WRONG ENCODING / GARBLED TEXT
───────────────────────────────────────────────────────
Raw:     "Iâ€™m happy" (should be "I'm happy")
Problem: Encoding mismatch turns apostrophes into garbage
Fix:     Detect encoding, fix with ftfy library

TYPE 7: INCONSISTENT CAPITALIZATION
───────────────────────────────────────────────────────
Raw:     "Machine Learning", "machine learning", "MACHINE LEARNING"
Problem: AI may treat these as 3 different concepts
Fix:     Normalize to lowercase for comparison

TYPE 8: IRRELEVANT CONTENT (NOISE)
───────────────────────────────────────────────────────
Raw PDF: "Page 1 of 45 | CONFIDENTIAL | Do Not Distribute"
Problem: Headers, footers, page numbers are noise for AI
Fix:     Detect and remove boilerplate text patterns

TYPE 9: OUTLIERS / IMPOSSIBLE VALUES
───────────────────────────────────────────────────────
Raw:     Age column: 25, 30, 28, 999, -5, 150
Problem: 999, -5, 150 are impossible ages — data entry errors
Fix:     Define valid range (0-120), flag/remove outliers

TYPE 10: NEAR-DUPLICATES (FUZZY DUPLICATES)
───────────────────────────────────────────────────────
Raw:     "Alice Johnson" vs "Alice Jonson" vs "A. Johnson"
Problem: Same person, slight spelling variations
Fix:     Fuzzy string matching (Levenshtein distance)
```

---

## 3. 🔧 Text Cleaning Techniques (Most Important for AI!)

Since most AI systems work with TEXT data, text cleaning is the most critical skill.

### The Text Cleaning Pipeline

```
RAW TEXT INPUT
     │
     ▼
┌─────────────────────────────┐
│ Step 1: Decode & Normalize  │  Fix encoding, handle Unicode
└─────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│ Step 2: Remove Boilerplate  │  Headers, footers, page numbers
└─────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│ Step 3: Fix Whitespace      │  Strip, normalize spaces
└─────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│ Step 4: Remove Noise        │  URLs, emails, special chars
└─────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│ Step 5: Normalize Case      │  lowercase (if needed)
└─────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│ Step 6: Fix Broken Words    │  "docu-\nment" → "document"
└─────────────────────────────┘
     │
     ▼
CLEAN TEXT  ✅  Ready for AI
```

### Key Regex Patterns for Text Cleaning

```python
import re

text = "  Hello!!! Visit https://example.com for more...  "

# Remove URLs
re.sub(r'https?://\S+|www\.\S+', '', text)
# → "  Hello!!! Visit  for more...  "

# Remove extra whitespace
re.sub(r'\s+', ' ', text).strip()
# → "Hello!!! Visit https://example.com for more..."

# Remove special characters (keep letters, numbers, basic punctuation)
re.sub(r'[^a-zA-Z0-9\s.,!?;:\'-]', '', text)

# Fix broken hyphenated words from PDFs
re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)
# "docu-\nment" → "document"

# Remove repeated punctuation
re.sub(r'([!?.]){2,}', r'\1', text)
# "Hello!!!" → "Hello!"
```

---

## 4. 🩹 Handling Missing Values — 4 Strategies

```
STRATEGY 1: DROP (Remove the row/column)
─────────────────────────────────────────
When: Missing value is critical AND cannot be guessed
Risk: You lose data
Example: Employee record with no Employee ID → drop it

STRATEGY 2: FILL WITH DEFAULT
─────────────────────────────────────────
When: A sensible default exists
Example: Missing "discount" field → fill with 0
         Missing "department" → fill with "Unknown"

STRATEGY 3: FILL WITH STATISTICS
─────────────────────────────────────────
When: Numeric fields with many values
Mean:   Fill with average → good for normally distributed data
Median: Fill with middle value → better when outliers exist
Mode:   Fill with most common value → good for categories

STRATEGY 4: PREDICT THE MISSING VALUE
─────────────────────────────────────────
When: You have related data to learn from
Example: Missing salary → predict based on department + experience
Tool: Use a simple ML model to predict missing values
Note: This is advanced — used in production AI systems
```

---

## 5. 🔄 Deduplication — Finding Duplicates

### Exact Duplicates (Easy)
```python
# Two records are identical in every field
seen = set()
unique_records = []
for record in records:
    key = (record["name"], record["email"])
    if key not in seen:
        seen.add(key)
        unique_records.append(record)
```

### Near-Duplicates (Harder — but very common in real data!)
```
"Alice Johnson"   vs   "Alice Jonson"    ← Typo
"ACME Corp"       vs   "Acme Corporation" ← Abbreviation
"John Smith"      vs   "J. Smith"         ← Initial vs full name

Tool: Levenshtein distance (edit distance)
  → Counts how many single-character changes are needed
  → "Alice Johnson" vs "Alice Jonson" = distance of 1 (one 'h' missing)
  → If distance < threshold (e.g., 3), treat as duplicate
```

---

## 6. ✅ Data Validation — Does This Data Make Sense?

```python
# Validation rules for employee data:

def validate_employee(record: dict) -> list:
    errors = []

    # Rule 1: Required fields must exist
    for field in ["emp_id", "name", "salary"]:
        if not record.get(field):
            errors.append(f"Missing required field: {field}")

    # Rule 2: Salary must be a positive number
    salary = record.get("salary", 0)
    if not isinstance(salary, (int, float)) or salary <= 0:
        errors.append(f"Invalid salary: {salary}")

    # Rule 3: Email must look like an email
    email = record.get("email", "")
    if email and "@" not in email:
        errors.append(f"Invalid email format: {email}")

    # Rule 4: Join date must be in the past
    # (would use datetime comparison in real code)

    return errors  # Empty list = valid record!
```

---

## 7. 🏗️ The Preprocessing Pipeline (Putting It All Together)

```
ENTERPRISE DATA PREPROCESSING PIPELINE
══════════════════════════════════════════════════════════

RAW DATA (from any source: PDF, DB, API, Web)
     │
     ▼
[STEP 1] INGESTION
  └── Load data from source
  └── Record: source, timestamp, file size

[STEP 2] INSPECTION
  └── Count rows, columns, null values
  └── Detect data types
  └── Generate quality report

[STEP 3] CLEANING
  └── Fix encoding issues
  └── Remove duplicates
  └── Handle missing values
  └── Fix formatting inconsistencies
  └── Remove noise (boilerplate, HTML tags, etc.)

[STEP 4] VALIDATION
  └── Check business rules (salary > 0, valid dates, etc.)
  └── Flag records that fail validation
  └── Log all flagged records for human review

[STEP 5] TRANSFORMATION
  └── Standardize formats (dates, numbers, text)
  └── Normalize text (lowercase, strip, fix broken words)
  └── Extract metadata (author, date, source)

[STEP 6] QUALITY REPORT
  └── Before/after comparison
  └── % records cleaned, % dropped, % flagged
  └── Save report for audit trail

[STEP 7] STORE CLEAN DATA
  └── Save to processed/ folder
  └── Save to database or vector store

CLEAN DATA ✅ → Ready for Chunking → Embeddings → AI
```

---

## 8. ❌ Common Beginner Mistakes

| Mistake | Why It's Bad | Fix |
|---|---|---|
| Cleaning the original file | You lose raw data forever | Always work on a COPY |
| Using `.strip()` only | Misses internal extra spaces | Use `re.sub(r'\s+', ' ', text).strip()` |
| Dropping ALL rows with any null | Lose too much data | Choose strategy per column |
| Forgetting to log what you cleaned | Can't audit or debug | Always save a cleaning report |
| Cleaning before inspecting | Don't know what to fix | ALWAYS inspect first |
| One-size-fits-all cleaning | PDF cleaning ≠ CSV cleaning | Customize per data source |

---

## 9. ✅ Best Practices

```
✅ NEVER modify raw/original data — always work on a copy
✅ Log every transformation (what changed, why, how many records)
✅ Validate BEFORE and AFTER cleaning
✅ Build cleaning as reusable functions, not one-off scripts
✅ Test your cleaning pipeline on a small sample first
✅ Keep a cleaning audit trail for compliance/debugging
✅ Handle errors gracefully — one bad record shouldn't crash pipeline
✅ Set quality thresholds: "If >10% records fail, halt and alert"
```

---

## 10. 🚀 Advanced Insights — Enterprise Scale

### How Netflix Cleans Data at Scale
```
Netflix processes 500 billion+ events per day.
They use Apache Spark for distributed cleaning:
├── Null checks run across 1000 worker nodes in parallel
├── Deduplication uses probabilistic data structures (Bloom filters)
├── Quality gates: if error rate > 0.1%, pipeline auto-pauses
└── Every cleaning step is logged to an audit database

You'll reach this level at Level 5 of our course!
```

### Great Expectations — Enterprise Data Validation Tool
```python
# Real enterprise teams use "Great Expectations" library
# It lets you write data quality rules like unit tests:

expect_column_values_to_not_be_null("email")
expect_column_values_to_be_between("salary", 10000, 500000)
expect_column_values_to_match_regex("emp_id", r"^EMP\d{3}$")
expect_column_to_exist("department")

# If any expectation fails → pipeline stops + team gets alert
# This is called a "Data Quality Gate"
```

---

## 11. 💼 Interview Questions

**Q1: What is data cleaning and why is it the most time-consuming part of AI projects?**
> Data cleaning is the process of identifying and fixing errors, inconsistencies, and noise in raw data. It's time-consuming because real-world data comes from many sources with different formats, errors, and missing values that must be handled case-by-case.

**Q2: What are the 4 strategies for handling missing values?**
> Drop the record, fill with a default value, fill with a statistical measure (mean/median/mode), or predict the missing value using a model.

**Q3: What is the difference between exact deduplication and fuzzy deduplication?**
> Exact deduplication removes records that are 100% identical. Fuzzy deduplication removes records that are SIMILAR but not identical (e.g., typos, abbreviations) using string distance algorithms like Levenshtein distance.

**Q4: Why should you never clean the original raw data file?**
> Because cleaning is lossy and sometimes wrong. You need the original to re-process if you discover a cleaning error. Raw data is your "source of truth" and must be preserved unchanged.

**Q5: What is a data quality gate?**
> A threshold-based check in a data pipeline. If data quality drops below a threshold (e.g., >5% null values), the pipeline stops and alerts the team instead of propagating bad data downstream.

---

## 12. 📝 Quiz

**Q1:** What is the FIRST step before cleaning any data?
- A) Remove duplicates  
- B) Fill missing values  
- C) Inspect/profile the data ✅  
- D) Normalize text

**Q2:** Which regex removes extra whitespace from text?
- A) `re.sub(r'\w+', ' ', text)`  
- B) `re.sub(r'\s+', ' ', text).strip()` ✅  
- C) `re.sub(r'[a-z]', '', text)`  
- D) `text.lower().strip()`

**Q3:** "Alice Johnson" vs "Alice Jonson" is an example of:
- A) Exact duplicate  
- B) Near-duplicate / fuzzy duplicate ✅  
- C) Missing value  
- D) Wrong data type

**Q4:** In enterprise AI, what percentage of time is typically spent on data vs model training?
- A) 20% data, 80% models  
- B) 50% each  
- C) 60-80% data, 10% models ✅  
- D) 90% models, 10% data

**Q5:** What tool do enterprise teams use to write data quality rules like unit tests?
- A) pandas  
- B) Great Expectations ✅  
- C) BeautifulSoup  
- D) SQLAlchemy

---

## 13. 🏠 Homework Challenges

### Challenge 1 (Easy ⭐)
Take the `employees.csv` from Topic 2. Introduce 5 intentional data problems (extra spaces, missing values, duplicates). Write a cleaning script that fixes all of them automatically.

### Challenge 2 (Medium ⭐⭐)
Build a `TextCleaner` class with methods:
- `remove_urls(text)` 
- `fix_whitespace(text)`
- `remove_boilerplate(text, patterns)`
- `clean(text)` — runs all steps in order

### Challenge 3 (Hard ⭐⭐⭐)
Build a full "Data Quality Dashboard":
1. Load a CSV with intentional errors
2. Run inspection → generate a quality report (before cleaning)
3. Run all cleaning steps
4. Run inspection again → generate report (after cleaning)
5. Print a before/after comparison showing improvement %

---

## 🎯 Progress

```
✅ Topic 1: What is Data in AI?
✅ Topic 2: Structured vs Unstructured Data
✅ Topic 3: Data Sources (PDFs, APIs, DBs, Web)
✅ Topic 4: Data Cleaning & Preprocessing        ← YOU ARE HERE
⬜ Topic 5: Chunking and Splitting
⬜ Topic 6: Metadata
⬜ Topic 7: Embeddings Basics
⬜ Topic 8: Vector Databases Basics
⬜ Topic 9: ETL Pipelines for AI
⬜ Topic 10: Data Quality Issues
⬜ Topic 11: Enterprise Data Pipelines
```

---
*End of Topic 4 — Data Cleaning & Preprocessing 🎉*
**Next:** Topic 5 — Chunking and Splitting →
# 🎓 Gen AI Application Journey
## Level 0 — Topic 5: Chunking and Splitting

> **Difficulty:** ⭐⭐ | **Time:** 90 min | **Code:** `05_chunking.py`
> **Why This Matters:** Chunking is THE most critical step before RAG!

---

## 🗺️ What You'll Learn

- Why we can't feed entire documents to AI at once
- What a "chunk" is and why it matters
- 6 chunking strategies (from simple to advanced)
- How chunk size and overlap affect AI quality
- How to choose the right chunking strategy
- Code for every chunking method

---

## 1. 🧠 Simple Explanation — Why Chunking Exists

Imagine you need to ask your friend a question about a 500-page legal contract.

You can't hand them the entire 500 pages and say "read all this, then answer."

Instead you'd say: "Look at pages 47–49 — the section about payment terms. What does it say?"

You gave them a **small, relevant piece** — not the whole document.

**Chunking = cutting documents into small pieces so the AI can work with them.**

### The Token Limit Problem

Every AI model has a **context window** — a maximum amount of text it can read at once.

```
MODEL CONTEXT WINDOWS (as of 2024):
─────────────────────────────────────────────
GPT-3.5       :   4,096  tokens  ≈   3,000 words
GPT-4         : 128,000  tokens  ≈  96,000 words
Claude 3      : 200,000  tokens  ≈ 150,000 words
Gemini 1.5 Pro: 1,000,000 tokens ≈ 750,000 words
─────────────────────────────────────────────
1 token ≈ 0.75 words (roughly 4 characters)
"Hello World" = 2 tokens
"The quick brown fox" = 4 tokens
```

Even with large context windows, feeding entire documents causes problems:
- **Cost**: More tokens = more money per API call
- **Speed**: Larger context = slower response
- **Quality**: AI gets "lost" in too much text (needle-in-haystack problem)
- **Relevance**: Only 2 pages matter, but you're paying for 500

> 🔥 **The Golden Rule:** Feed the AI only the text it actually NEEDS to answer the question. Chunking + retrieval makes this possible.

---

## 2. 🍕 Real-Life Analogy — The Pizza Slice Analogy

Imagine you ordered a giant family pizza (your document).

You can't eat the whole pizza in one bite (context window limit).

You cut it into slices (chunks). Each slice is manageable.

When someone asks "Give me a slice with extra cheese" — you pick the right slice (retrieval), not the whole pizza.

```
WHOLE DOCUMENT (The Pizza)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[  Introduction  ][  Chapter 1  ][  Chapter 2  ][  Chapter 3  ]

                        ↓  CHUNKING
                   (Cut into slices)

   [Chunk 1]   [Chunk 2]   [Chunk 3]   [Chunk 4]   [Chunk 5]
  "Intro..."  "Policy..."  "Rules..."  "Benefits"  "Contact..."

                        ↓  USER ASKS QUESTION
              "What are the leave benefits?"

                        ↓  RETRIEVAL
                  Find most relevant chunk

                      [Chunk 4]
                     "Benefits..."
                          ↓
                    Feed to LLM  ✅
                    Small, focused, relevant!
```

---

## 3. 📏 The Two Key Chunking Parameters

Before learning strategies, understand these two settings:

### Chunk Size
How many characters/tokens in each chunk.

```
CHUNK SIZE TRADEOFFS:
────────────────────────────────────────────────────────

SMALL chunks (200–500 chars):
  ✅ Very precise retrieval
  ✅ Cheaper (fewer tokens per call)
  ❌ May lose context (sentence cut in half)
  ❌ Need more chunks to cover document
  Best for: FAQs, short answer tasks

MEDIUM chunks (500–1500 chars):
  ✅ Good balance of precision and context
  ✅ Most common choice in production
  Best for: General RAG systems

LARGE chunks (1500–3000 chars):
  ✅ Rich context preserved
  ❌ More expensive per query
  ❌ Less precise retrieval
  Best for: Complex reasoning, legal docs
```

### Chunk Overlap
How many characters repeat between adjacent chunks.

```
WHY OVERLAP MATTERS:
────────────────────────────────────────────────────────

WITHOUT OVERLAP (overlap=0):
  Chunk 1: "...The employee is entitled to 20 days"
  Chunk 2: "of annual leave per year. Applications..."

  Problem: The sentence is CUT. If user asks about
  "20 days", Chunk 2 won't have that number!

WITH OVERLAP (overlap=100 chars):
  Chunk 1: "...The employee is entitled to 20 days"
  Chunk 2: "entitled to 20 days of annual leave per year. Applications..."

  Now Chunk 2 has the FULL context of the sentence!
  Overlap = safety net for boundary sentences.

Typical overlap: 10–20% of chunk size
If chunk_size=1000, overlap=100–200
```

---

## 4. 🔪 The 6 Chunking Strategies

### Strategy 1: Fixed-Size Chunking (Simplest)
```
Split by fixed character count. No regard for sentences or paragraphs.

"The quick brown fox jumps over the lazy dog. The dog barked."
With chunk_size=30, overlap=5:

Chunk 1: "The quick brown fox jumps ove"
Chunk 2: " ove the lazy dog. The dog b"
Chunk 3: " dog b arked."

❌ PROBLEM: Cuts words and sentences mid-way!
✅ USE WHEN: Quick prototyping, testing, token counting
```

### Strategy 2: Sentence-Based Chunking
```
Split at sentence boundaries (., !, ?)

"AI is amazing. It can write code. It can answer questions. Amazing!"

Chunks:
  [0] "AI is amazing."
  [1] "It can write code."
  [2] "It can answer questions."
  [3] "Amazing!"

✅ PRESERVES sentence meaning completely
❌ Chunks may be too short (single sentences)
✅ USE WHEN: Q&A systems, FAQ bots
```

### Strategy 3: Paragraph-Based Chunking
```
Split by double newlines (paragraph breaks)

"Policy Introduction\n\nAll employees are entitled to leave.\n\nSection 2: Types"

Chunks:
  [0] "Policy Introduction"
  [1] "All employees are entitled to leave."
  [2] "Section 2: Types"

✅ Preserves natural document structure
❌ Paragraph sizes vary wildly (1 line to 20 lines)
✅ USE WHEN: Policy docs, articles, reports
```

### Strategy 4: Recursive Character Chunking (Most Popular!)
```
LangChain's RecursiveCharacterTextSplitter
Tries to split by: \n\n → \n → . → space → character

Algorithm:
1. Try to split by paragraph (\n\n) → if chunks still too big:
2. Try to split by newline (\n) → if still too big:
3. Try to split by sentence (.) → if still too big:
4. Split by space → last resort:
5. Split by character

✅ Respects natural language boundaries
✅ Handles documents of any structure
✅ Most robust for real-world data
✅ DEFAULT CHOICE for 90% of RAG systems
```

### Strategy 5: Semantic Chunking (Advanced!)
```
Groups sentences by MEANING, not just position.

Regular chunking: [Para1][Para2][Para3]
Semantic chunking: Groups sentences that discuss the SAME TOPIC

How it works:
1. Split into sentences
2. Create embeddings (vectors) for each sentence
3. Compare sentence embeddings
4. If next sentence is semantically DIFFERENT → start new chunk
5. If similar → add to current chunk

✅ Semantically coherent chunks (best quality!)
❌ Slow (requires embedding every sentence)
❌ Complex to implement
✅ USE WHEN: High-quality RAG, research assistants
```

### Strategy 6: Document-Structure Chunking (Smart!)
```
Uses the document's OWN structure as boundaries.

For Word docs: Split at Heading 1, Heading 2
For HTML:      Split at <h1>, <h2>, <section>
For Markdown:  Split at # headings
For PDFs:      Split at detected section headers
For Code:      Split at function/class boundaries

Example (Markdown):
# Chapter 1           ← Chunk boundary
Content of chapter 1...

## Section 1.1        ← Chunk boundary
Details here...

✅ Chunks are logically complete sections
✅ Natural for structured documents
❌ Requires knowing document format
✅ USE WHEN: Manuals, handbooks, documentation
```

---

## 5. 🏗️ Architecture — Where Chunking Fits

```
COMPLETE RAG PIPELINE (You'll build this fully at Level 2!)
══════════════════════════════════════════════════════════

DOCUMENT → CLEAN TEXT → [CHUNKER] → EMBEDDER → VECTOR DB
                              ↑
                        THIS IS WHERE
                        WE ARE NOW ← Topic 5

DETAILED CHUNKING STEP:
─────────────────────────────────────────────────────

Input:  One large cleaned text document (10,000 words)

        ┌─────────────────────────────────────┐
        │  CHUNKER                            │
        │  chunk_size    = 1000 chars         │
        │  chunk_overlap = 200  chars         │
        │  strategy      = recursive          │
        └─────────────────────────────────────┘

Output: List of chunks, each with metadata:
  [
    {
      "chunk_id"   : 0,
      "text"       : "ACME Leave Policy - Section 1...",
      "char_count" : 987,
      "source"     : "leave_policy.pdf",
      "page"       : 1,
      "chunk_index": "0/12"
    },
    {
      "chunk_id"   : 1,
      "text"       : "Section 1 (continued)... Section 2...",
      "char_count" : 1023,
      "source"     : "leave_policy.pdf",
      "page"       : 2,
      "chunk_index": "1/12"
    },
    ... 12 chunks total
  ]
```

---

## 6. 📊 Choosing the Right Strategy — Decision Tree

```
START: What type of document is it?
         │
         ├─► Code/Programming files?
         │       └─► Strategy 6 (Function/Class boundaries)
         │
         ├─► Has clear headings (Word, Markdown, HTML)?
         │       └─► Strategy 6 (Document-structure)
         │
         ├─► Short Q&A or FAQ content?
         │       └─► Strategy 2 (Sentence-based)
         │
         ├─► Articles, blog posts, reports?
         │       └─► Strategy 3 or 4 (Paragraph or Recursive)
         │
         ├─► General documents, unknown structure?
         │       └─► Strategy 4 (Recursive — BEST DEFAULT)
         │
         └─► Have budget for embeddings + need best quality?
                 └─► Strategy 5 (Semantic chunking)

WHEN IN DOUBT: Use Recursive Chunking (Strategy 4)
with chunk_size=1000, overlap=200
```

---

## 7. ❌ Common Beginner Mistakes

| Mistake | Problem | Fix |
|---|---|---|
| Chunk size too small (<100 chars) | Loses all context | Use 500–1500 chars |
| No overlap | Loses boundary sentences | Set overlap = 10-20% of size |
| Fixed-size on real documents | Cuts sentences mid-word | Use recursive or sentence splitter |
| Same strategy for all doc types | Poor chunk quality | Match strategy to document type |
| Not storing metadata with chunks | Can't trace answers to source | Always attach source + page number |
| Ignoring chunk count | 50,000 chunks = slow search | Balance size vs retrieval speed |

---

## 8. ✅ Best Practices

```
✅ Always test your chunks visually before building the full pipeline
✅ Store metadata (source, page, timestamp) with every chunk
✅ Aim for chunks that are "one complete idea"
✅ Validate: no chunk should be < 50 chars or > 3000 chars
✅ Use overlap of 10-20% to prevent boundary loss
✅ Log chunk count and size distribution
✅ For production: use LangChain's text splitters (battle-tested)
✅ Run a small retrieval test before scaling to full dataset
```

---

## 9. 🚀 Advanced — LangChain Text Splitters (Preview of Level 2)

```python
# These are the tools you'll use in production (Level 2 onwards)!

from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,  # Best general purpose
    CharacterTextSplitter,           # Simple fixed-size
    SentenceTransformersTokenTextSplitter,  # Token-aware
    MarkdownHeaderTextSplitter,      # For Markdown docs
    HTMLHeaderTextSplitter,          # For HTML pages
    PythonCodeTextSplitter,          # For Python code
)

# Most common usage:
splitter = RecursiveCharacterTextSplitter(
    chunk_size    = 1000,
    chunk_overlap = 200,
    length_function = len,
    separators    = ["\n\n", "\n", ".", " ", ""]
)
chunks = splitter.split_text(your_text)
```

---

## 10. 💼 Interview Questions

**Q1: What is chunking and why is it necessary in RAG systems?**
> Chunking is splitting large documents into smaller pieces. It's necessary because AI models have token limits, and we want to retrieve only the RELEVANT portion of a document to answer a specific question, not feed the entire document every time.

**Q2: What is chunk overlap and why is it important?**
> Chunk overlap means repeating some text between adjacent chunks. It prevents important sentences from being split across chunk boundaries, ensuring that context at the edges of chunks is preserved in at least one chunk.

**Q3: When would you choose semantic chunking over recursive chunking?**
> Semantic chunking gives highest quality because it groups semantically related sentences, but it's expensive (requires embedding every sentence). Use it when accuracy is critical and cost is not a concern. Use recursive chunking for general-purpose, cost-effective RAG.

**Q4: What metadata should you store alongside each chunk?**
> Source file name, page number, section heading, chunk index, character count, creation timestamp, and document ID. This metadata enables traceability — you can show users which document an answer came from.

**Q5: A 100-page legal PDF is being chunked. What strategy and settings would you recommend?**
> Recursive character splitting with chunk_size=1200, overlap=200. This preserves legal sentence structure, provides enough context per chunk, and the overlap ensures clauses aren't split between chunks. Also store page number in metadata for citation.

---

## 11. 📝 Quiz

**Q1:** What is a "token" in the context of LLMs?
- A) A password for the API
- B) A roughly 4-character unit that models process ✅
- C) A type of database
- D) A chunk of 1000 words

**Q2:** Why do we use chunk overlap?
- A) To make files larger
- B) To preserve context at chunk boundaries ✅
- C) To reduce token count
- D) To sort chunks alphabetically

**Q3:** Which chunking strategy is best for MOST general use cases?
- A) Fixed-size chunking
- B) Sentence-based chunking
- C) Recursive character chunking ✅
- D) Semantic chunking

**Q4:** What is the recommended overlap percentage relative to chunk size?
- A) 1-2%
- B) 10-20% ✅
- C) 50%
- D) 80%

**Q5:** Which metadata is MOST important to store with each chunk?
- A) The chunk's color theme
- B) Source file, page number, chunk index ✅
- C) The date the chunk was read
- D) The operating system used

---

## 12. 🏠 Homework

### Challenge 1 (Easy ⭐)
Take a text of 2000+ words. Chunk it 3 ways (fixed, sentence, paragraph). Count chunks produced by each. Which gave the most? Fewest?

### Challenge 2 (Medium ⭐⭐)
Build a `ChunkValidator` that reads a list of chunks and flags: chunks under 50 chars, over 2000 chars, and chunks that seem to be cut mid-sentence (don't end with `.!?`).

### Challenge 3 (Hard ⭐⭐⭐)
Build a "Chunk Quality Scorer" that evaluates chunks on: completeness (ends at sentence), size (within ideal range), overlap correctness (expected overlap between consecutive chunks). Print a score out of 10 per chunk.

---

## 🎯 Progress

```
✅ Topic 1: What is Data in AI?
✅ Topic 2: Structured vs Unstructured Data
✅ Topic 3: Data Sources (PDFs, APIs, DBs, Web)
✅ Topic 4: Data Cleaning & Preprocessing
✅ Topic 5: Chunking and Splitting             ← YOU ARE HERE
⬜ Topic 6: Metadata
⬜ Topic 7: Embeddings Basics
⬜ Topic 8: Vector Databases Basics
⬜ Topic 9: ETL Pipelines for AI
```
---
*End of Topic 5 🎉 | Next: Topic 6 — Metadata →*
# 🎓 Gen AI Application Journey
## Level 0 — Topic 6: Metadata

> **Difficulty:** ⭐⭐ | **Time:** 60 min | **Code:** `06_metadata.py`
> **Why This Matters:** Metadata is what makes AI answers TRUSTWORTHY and TRACEABLE!

---

## 🗺️ What You'll Learn

- What metadata is (and why it's the "label on the box")
- Types of metadata in AI systems
- Why metadata makes RAG answers trustworthy
- How to extract, attach, and use metadata
- Metadata schemas for enterprise AI
- Filtering search results using metadata

---

## 1. 🧠 Simple Explanation — What is Metadata?

**"Data about data."**

Imagine you have 10,000 books in a library with NO labels, NO titles on the spine, NO author names. Just plain books.

How do you find "the Harry Potter book published in 1997"?

You'd have to open every single book and read it!

Now imagine every book has a label on the spine:
```
Title:  Harry Potter and the Philosopher's Stone
Author: J.K. Rowling
Year:   1997
Genre:  Fantasy
Pages:  223
```

**That label = Metadata.**

It describes the content without being the content itself. It helps you FIND, FILTER, and ORGANIZE data without reading everything.

---

## 2. 📦 The Box Label Analogy

Think of a shipping box:

```
WITHOUT METADATA                 WITH METADATA
────────────────────             ────────────────────────────────
  ┌──────────────┐               ┌──────────────────────────────┐
  │              │               │ FROM: HR Department          │
  │   (A Box)    │               │ TO:   All Employees          │
  │              │               │ DATE: 2024-01-15             │
  │              │               │ CONTENTS: Leave Policy v2.1  │
  └──────────────┘               │ SIZE: 2.3 MB | PAGES: 45     │
                                 │ CONFIDENTIAL: No             │
You have NO idea what's inside   └──────────────────────────────┘
without opening it.              You know EXACTLY what's inside!
```

In AI systems, every document chunk needs its own "box label" — its metadata.

---

## 3. 📋 Types of Metadata in AI Systems

### 3.1 Document-Level Metadata
Describes the whole document:

```python
document_metadata = {
    # IDENTIFICATION
    "doc_id"        : "DOC-2024-HR-001",
    "title"         : "Remote Work Policy",
    "filename"      : "remote_work_policy_v3.pdf",

    # ORIGIN
    "source"        : "SharePoint/HR/Policies",
    "department"    : "Human Resources",
    "author"        : "Sarah Chen",

    # TIME
    "created_date"  : "2024-01-10",
    "modified_date" : "2024-03-22",
    "ingested_at"   : "2024-06-01T09:15:00Z",

    # CLASSIFICATION
    "doc_type"      : "policy",
    "category"      : "employment",
    "tags"          : ["remote-work", "HR", "policy", "2024"],
    "language"      : "en",
    "version"       : "3.0",

    # ACCESS CONTROL
    "confidentiality": "internal",
    "access_roles"  : ["all-employees"],

    # QUALITY
    "page_count"    : 12,
    "word_count"    : 3420,
    "is_verified"   : True,
}
```

### 3.2 Chunk-Level Metadata
Added when a document is split into chunks:

```python
chunk_metadata = {
    # INHERITED FROM DOCUMENT
    "doc_id"        : "DOC-2024-HR-001",
    "source"        : "remote_work_policy_v3.pdf",
    "department"    : "Human Resources",

    # CHUNK-SPECIFIC
    "chunk_id"      : "DOC-2024-HR-001-C007",
    "chunk_index"   : 7,
    "total_chunks"  : 24,
    "page_number"   : 4,
    "section"       : "2.2 Core Hours",

    # CONTENT STATS
    "char_count"    : 847,
    "word_count"    : 134,
    "chunk_strategy": "recursive",

    # EMBEDDING INFO (added later)
    "embedding_model": "text-embedding-3-small",
    "embedded_at"   : "2024-06-01T09:20:00Z",
}
```

### 3.3 Query-Level Metadata
Logged when a user searches:

```python
query_metadata = {
    "query_id"      : "QRY-20240601-001",
    "user_id"       : "USR-4521",
    "query_text"    : "How many days of sick leave am I entitled to?",
    "timestamp"     : "2024-06-01T14:30:00Z",
    "session_id"    : "SESS-abc123",
    "retrieved_docs": ["DOC-2024-HR-001-C007", "DOC-2024-HR-001-C008"],
    "response_time_ms": 342,
    "user_rating"   : 5,
}
```

---

## 4. 🔥 Why Metadata Makes AI Systems POWERFUL

### Power 1: Citation and Traceability

```
USER QUESTION: "What is the remote work policy?"

WITHOUT METADATA:
  AI: "Employees must be available 10 AM to 3 PM."
  USER: "Where did this come from? Is it still current?"
  AI: "I don't know." ← TERRIBLE for enterprise!

WITH METADATA:
  AI: "Employees must be available 10 AM to 3 PM.

       📄 Source: Remote Work Policy v3.0
          Author: Sarah Chen | HR Department
          Last Updated: March 22, 2024
          Page: 4 of 12
          [View full document]"

  USER: "Great, I can verify this and trust the answer!" ✅
```

### Power 2: Metadata Filtering (Pre-filtering Search)

```
Without metadata filtering:
  Search "leave policy" → Returns 847 chunks from ALL documents
  Slow, noisy, irrelevant results from old versions

With metadata filtering:
  Search "leave policy" WHERE department="HR"
                          AND doc_type="policy"
                          AND version="latest"
                          AND language="en"
  → Returns 23 highly relevant chunks ✅
  Fast, precise, reliable!
```

### Power 3: Access Control

```python
# Enterprise AI must respect permissions!
def search_with_access_control(query: str, user_role: str):
    results = vector_db.search(
        query    = query,
        filters  = {
            "access_roles": {"$in": [user_role, "all-employees"]}
        }
    )
    # Interns won't see executive compensation data
    # Managers see more than individual contributors
    return results
```

### Power 4: Versioning and Freshness

```
Old policy (2022): "Employees get 15 days annual leave"
New policy (2024): "Employees get 20 days annual leave"

Without metadata: AI might give the OLD answer!

With metadata + filtering:
  modified_date > "2023-01-01"  → Only returns the 2024 policy ✅
```

---

## 5. 🏗️ Metadata in the RAG Pipeline

```
DOCUMENT                INGESTION PIPELINE               VECTOR DB
═══════════             ══════════════════               ═════════════

PDF File      ──►  [1. Extract Text]
                         │
                   [2. Extract Metadata]  ◄── filename, dates, author
                         │
                   [3. Chunk Text]
                         │
                   [4. Add Chunk Metadata] ◄── page, section, chunk_id
                         │
                   [5. Create Embeddings]
                         │
                   [6. Store in Vector DB]  ──► {
                                                  "vector": [0.1, 0.2...],
                                                  "text"  : "chunk text",
                                                  "metadata": {
                                                    "source": "policy.pdf",
                                                    "page"  : 4,
                                                    "dept"  : "HR"
                                                  }
                                                }

QUERY TIME:
User asks question  ──►  Filter by metadata first  ──►  Search vectors
                         (department=HR, type=policy)    in filtered subset
```

---

## 6. 📐 Metadata Schema Design — Best Practices

A **schema** is the template that defines what metadata every document MUST have.

```python
# REQUIRED fields — every document must have these
REQUIRED_FIELDS = [
    "doc_id",        # Unique identifier
    "source",        # Where it came from
    "ingested_at",   # When we processed it
    "doc_type",      # policy / manual / report / faq / email
]

# RECOMMENDED fields — include when available
RECOMMENDED_FIELDS = [
    "title",
    "author",
    "department",
    "created_date",
    "modified_date",
    "version",
    "language",
    "tags",
]

# OPTIONAL fields — domain-specific
OPTIONAL_FIELDS = [
    "confidentiality",   # public / internal / confidential
    "access_roles",      # who can see this
    "expiry_date",       # when does this expire (for legal docs)
    "related_docs",      # linked documents
    "compliance_tags",   # GDPR, HIPAA, SOX, etc.
]
```

---

## 7. ❌ Common Beginner Mistakes

| Mistake | Problem | Fix |
|---|---|---|
| No metadata at all | Can't trace where answers came from | Always attach at least source + date |
| Inconsistent field names | `"author"` vs `"Author"` vs `"doc_author"` | Define and enforce a schema |
| No version tracking | Stale data returns old answers | Add `version` and `modified_date` |
| Missing page numbers | User can't verify the answer | Always store `page_number` per chunk |
| Storing PII in metadata | Privacy violation | Anonymize author names if needed |
| Too much metadata | Bloats storage and slows queries | Only store what you'll actually filter or display |

---

## 8. ✅ Best Practices

```
✅ Define a metadata schema BEFORE building the pipeline
✅ Make doc_id globally unique (use UUID or hash of content)
✅ Always store source filename and ingestion timestamp
✅ Keep metadata lightweight — don't duplicate the content
✅ Use consistent naming: snake_case for all field names
✅ Include version info for documents that change over time
✅ Test metadata filtering BEFORE embedding (much cheaper)
✅ Log every metadata extraction failure for debugging
✅ Validate metadata completeness as a quality gate
```

---

## 9. 🚀 Advanced — Metadata in Production Vector DBs

```python
# ChromaDB (Level 2 of our course):
collection.add(
    ids       = ["chunk_001"],
    documents = ["Full-time employees get 20 days leave."],
    embeddings= [[0.1, 0.2, 0.3, ...]],
    metadatas = [{"source": "hr_policy.pdf", "page": 4, "dept": "HR"}]
)

# Filter by metadata at search time:
results = collection.query(
    query_texts = ["How many days leave do I get?"],
    where       = {"dept": {"$eq": "HR"}},
    n_results   = 5
)

# Pinecone (enterprise scale):
index.upsert(vectors=[
    ("chunk_001", [0.1, 0.2, ...], {"source": "hr_policy.pdf", "dept": "HR"})
])
results = index.query(
    vector  = query_embedding,
    filter  = {"dept": {"$eq": "HR"}, "version": {"$gte": "2.0"}},
    top_k   = 5
)
```

---

## 10. 💼 Interview Questions

**Q1: What is metadata and why is it critical in RAG systems?**
> Metadata is data that describes other data (source, date, author, etc.). In RAG, it enables citation (showing WHERE an answer came from), filtering (searching only relevant documents), access control, and version management.

**Q2: What is the difference between document-level and chunk-level metadata?**
> Document-level metadata describes the whole file (title, author, date). Chunk-level metadata describes a specific piece of the document (page number, section heading, chunk index) and inherits document-level fields.

**Q3: How does metadata filtering improve RAG performance?**
> Instead of searching ALL chunks in the vector database, metadata filters narrow the search to only relevant chunks first (e.g., only HR policies, only recent documents). This makes retrieval faster, cheaper, and more precise.

**Q4: What would happen in an enterprise RAG system without access control metadata?**
> A junior employee could ask a question and accidentally receive confidential executive salary data or restricted legal information. Access control metadata ensures each user only sees content they're authorized to view.

**Q5: What fields would you include in a minimum viable metadata schema?**
> Minimum: doc_id (unique), source (filename/URL), ingested_at (timestamp), doc_type (category). Recommended additions: title, department, modified_date, page_number (for chunks), version.

---

## 11. 📝 Quiz

**Q1:** What does "metadata" mean?
- A) Big data files
- B) Data about data ✅
- C) Machine learning data
- D) Encrypted data

**Q2:** Which metadata field enables showing users WHERE an answer came from?
- A) word_count
- B) chunk_id
- C) source + page_number ✅
- D) embedding_model

**Q3:** Why is `modified_date` important in an enterprise RAG system?
- A) To sort documents alphabetically
- B) To prevent returning outdated policy answers ✅
- C) To count total documents
- D) To measure file size

**Q4:** What is a metadata schema?
- A) A database table
- B) A template defining required metadata fields for all documents ✅
- C) A type of embedding model
- D) A chunking strategy

**Q5:** Metadata filtering happens at which stage of a RAG query?
- A) After generating the answer
- B) During embedding creation
- C) Before or during vector similarity search ✅
- D) During document ingestion only

---

## 12. 🏠 Homework

### Challenge 1 (Easy ⭐)
Define a metadata schema (as a Python dict) for a **legal firm's** document system. What fields are essential? What makes legal metadata different from HR metadata?

### Challenge 2 (Medium ⭐⭐)
Write a `MetadataExtractor` class that takes a filename and automatically extracts: file extension, file size in KB, word count of content, creation date (from OS), and generates a unique `doc_id` using Python's `uuid` library.

### Challenge 3 (Hard ⭐⭐⭐)
Build a metadata-aware document store:
1. Store 5 chunks with metadata in a Python dictionary
2. Implement `search(query, filters)` that filters by metadata fields before "searching" (just print matching chunks for now)
3. Test: `search("leave policy", {"department": "HR", "doc_type": "policy"})`

---

## 🎯 Progress

```
✅ Topic 1: What is Data in AI?
✅ Topic 2: Structured vs Unstructured Data
✅ Topic 3: Data Sources (PDFs, APIs, DBs, Web)
✅ Topic 4: Data Cleaning & Preprocessing
✅ Topic 5: Chunking and Splitting
✅ Topic 6: Metadata                           ← YOU ARE HERE
⬜ Topic 7: Embeddings Basics
⬜ Topic 8: Vector Databases Basics
⬜ Topic 9: ETL Pipelines for AI
⬜ Topic 10: Data Quality Issues
⬜ Topic 11: Enterprise Data Pipelines
```

---
*End of Topic 6 — Metadata 🎉 | Next: Topic 7 — Embeddings Basics →*
*(This is where data transforms into numbers AI can truly understand!)*
# 🎓 Gen AI Application Journey
## Level 0 — Topic 7: Embeddings Basics

> **Difficulty:** ⭐⭐⭐ | **Time:** 90 min | **Code:** `07_embeddings.py`
> **Why This Matters:** Embeddings are the CORE technology behind all modern AI search, RAG, and recommendations!

---

## 🗺️ What You'll Learn

- What embeddings are (explained like you're 10 years old)
- How text becomes numbers (the magic behind AI)
- What "semantic similarity" means and why it's revolutionary
- How embedding models work (conceptually)
- How to create embeddings using sentence-transformers (free, local!)
- Cosine similarity — the math that finds related content
- How embeddings power RAG, recommendations, and search
- Visualising what embeddings look like

---

## 1. 🧠 Simple Explanation — What is an Embedding?

Here's the brutal truth: **Computers cannot understand words.**

Computers only understand numbers.

So when we feed text to an AI, it gets secretly converted into a long list of numbers — called an **embedding** (or a **vector**).

```
"Hello World"  →  [0.12, -0.45, 0.87, 0.33, -0.91, ...]
                   ↑ a list of 384 (or 768 or 1536) numbers
                   ↑ This IS the word/sentence to the computer
```

But here's the magical part:

**The numbers are NOT random.** They are carefully chosen so that words or sentences with SIMILAR MEANINGS get SIMILAR numbers!

```
"I love cats"  →  [0.82, 0.31, -0.14, ...]
"I adore cats" →  [0.81, 0.33, -0.12, ...]  ← Almost identical!
"I hate dogs"  →  [-0.45, -0.21, 0.78, ...] ← Very different!
"The car is red" → [0.10, -0.62, 0.45, ...]  ← Completely different!
```

This is the revolutionary insight: **Meaning becomes measurable distance!**

---

## 2. 🗺️ Real-Life Analogy — GPS Coordinates

Imagine every person in the world has GPS coordinates (latitude, longitude).

- Alice lives at: `(40.71°N, 74.00°W)` — New York
- Bob lives at:   `(40.73°N, 74.01°W)` — Also New York (close to Alice!)
- Carol lives at: `(51.50°N, 0.12°W)`  — London (very far from Alice)

You can **measure** how close or far people live using math.

**Embeddings work the same way — but in 384 or 1536 dimensions instead of 2!**

```
GEOGRAPHIC COORDINATES        EMBEDDING COORDINATES
────────────────────────      ─────────────────────────────────
New York  [40.71, -74.00]     "annual leave"  [0.82, 0.31, -0.14, ...]
London    [51.50,  -0.12]     "vacation days" [0.81, 0.33, -0.12, ...]  ← CLOSE!
Tokyo     [35.68, 139.69]     "car engine"    [-0.45, -0.21, 0.78, ...] ← FAR!

Distance between NY and London = 5,570 km (far)
Distance between "annual leave" and "vacation days" = 0.02 (very close!)
```

**The embedding model "places" semantically similar text near each other in this high-dimensional space.**

---

## 3. 🧩 Why Embeddings Are Revolutionary

### The Old Way (Keyword Search)

```
Document: "Employees are entitled to annual leave of 20 days."
User asks: "How much vacation time do I get?"

KEYWORD SEARCH looks for: "vacation", "time", "get"
RESULT: Document NOT found! ← "vacation" ≠ "annual leave"

Old search engines FAILED at this constantly.
This is why old HR bots were terrible!
```

### The New Way (Embedding/Semantic Search)

```
Document: "Employees are entitled to annual leave of 20 days."
User asks: "How much vacation time do I get?"

EMBEDDING SEARCH:
  "annual leave" embedding:  [0.82, 0.31, -0.14, 0.55, ...]
  "vacation time" embedding: [0.80, 0.33, -0.12, 0.57, ...]

  Distance between them: 0.03 (VERY CLOSE!)
  
RESULT: Document IS found! ✅

The AI understands that "annual leave" and "vacation time"
mean the SAME THING even though they use different words!
```

---

## 4. 🔢 How Embeddings Are Created (The Concept)

An embedding model is a neural network trained on billions of text examples.

```
EMBEDDING MODEL TRAINING (simplified):
──────────────────────────────────────────────────────

Training data (millions of pairs):
  "I love cats"       ~ "I adore felines"        → SIMILAR
  "The sky is blue"   ~ "Clear blue skies today"  → SIMILAR
  "Python code"       ~ "Chocolate cake recipe"   → DIFFERENT

The model learns to produce SIMILAR numbers for SIMILAR meanings.
After training, it can embed ANY new text correctly!

INFERENCE (using the trained model):
  Input: "How do I get annual leave?"
  ↓
  [Embedding Model] (just a neural network doing matrix math)
  ↓
  Output: [0.12, -0.45, 0.87, 0.33, -0.91, 0.22, ...]
  (384 or 768 or 1536 numbers — depends on model)
```

---

## 5. 📐 Cosine Similarity — Measuring How Close Two Embeddings Are

Once we have embeddings (lists of numbers), how do we compare them?

We use **Cosine Similarity** — a number between -1 and 1:

```
cosine_similarity = 1.0   → Identical meaning
cosine_similarity = 0.9   → Very similar
cosine_similarity = 0.7   → Somewhat related
cosine_similarity = 0.5   → Loosely related
cosine_similarity = 0.0   → Completely unrelated
cosine_similarity = -1.0  → Opposite meanings

EXAMPLES:
"annual leave"  vs "vacation days"   → 0.94 (very similar!)
"cat"           vs "kitten"          → 0.89
"Python code"   vs "snake reptile"   → 0.42 (same word, different meaning)
"happy"         vs "sad"             → 0.12 (opposites!)
"car"           vs "photosynthesis"  → -0.05 (completely unrelated)
```

### The Formula (Don't Memorize — Just Understand It)

```
        A · B          ← "dot product" of the two vectors
sim = ──────────
       |A| × |B|       ← lengths of each vector

This measures the ANGLE between two vectors.
Small angle = similar direction = similar meaning!

Think of it like: Two arrows pointing in the same direction = similar!
```

---

## 6. 🏗️ Embeddings in the RAG Pipeline

```
FULL RAG PIPELINE WITH EMBEDDINGS:
════════════════════════════════════════════════════════════

INGESTION TIME (done once):
  Document
     ↓
  [Clean + Chunk]  → 24 chunks
     ↓
  [Embedding Model]  (converts each chunk to a vector)
     ↓
  chunk1_text → [0.12, -0.45, 0.87, ...]   ─┐
  chunk2_text → [0.33,  0.21, -0.55, ...]  ─┤─► VECTOR DATABASE
  chunk3_text → [-0.45, 0.82,  0.11, ...]  ─┘   (stores text + vector)
  ...

QUERY TIME (done for every user question):
  User: "How many sick days do I get?"
     ↓
  [Embedding Model]  (embeds the QUESTION too!)
     ↓
  question_vector = [0.15, -0.42, 0.85, ...]
     ↓
  [Vector DB] finds chunks with CLOSEST vectors (cosine similarity)
     ↓
  Top 3 matches:
    chunk7:  "Sick leave: 10 days per year..." (sim=0.94)
    chunk8:  "Medical certificate required..." (sim=0.81)
    chunk12: "Leave entitlements overview..."  (sim=0.75)
     ↓
  Feed question + top chunks to LLM
     ↓
  LLM Answer: "You are entitled to 10 days of sick leave per year..."
```

---

## 7. 🤖 Popular Embedding Models

| Model | Dimensions | Speed | Cost | Best For |
|---|---|---|---|---|
| **text-embedding-3-small** (OpenAI) | 1536 | Fast | $0.02/1M tokens | Production RAG |
| **text-embedding-3-large** (OpenAI) | 3072 | Medium | $0.13/1M tokens | High quality RAG |
| **all-MiniLM-L6-v2** (HuggingFace) | 384 | Very Fast | FREE (local) | Learning, prototyping |
| **all-mpnet-base-v2** (HuggingFace) | 768 | Medium | FREE (local) | Better quality, local |
| **text-embedding-004** (Google) | 768 | Fast | Low cost | Gemini-based RAG |
| **nomic-embed-text** (Ollama) | 768 | Fast | FREE (local) | Privacy-first RAG |

> 🔥 **For learning:** Use `all-MiniLM-L6-v2` — it's FREE, runs locally, and is fast!
> **For production:** Use OpenAI `text-embedding-3-small` — best quality/cost ratio.

---

## 8. 💡 What Embeddings Look Like (Visualization)

If we could reduce 384 dimensions down to 2 (using t-SNE or UMAP), this is what we'd see:

```
HIGH-DIMENSIONAL EMBEDDING SPACE (simplified to 2D):
══════════════════════════════════════════════════════

        "puppy"    "dog"
            ●     ●
          ●         "kitten"
         "cat"      ●

   ANIMALS CLUSTER ─────────────────────────────────
                              EMOTIONS CLUSTER
                          ●  "happy"    "joyful" ●
                            ●  "excited"
                          ●  "sad"     "gloomy"●

   TECH CLUSTER ──────────────────────────────────
     "Python" ●    ● "JavaScript"
       ● "machine learning"
          ● "neural network"    "AI" ●

══════════════════════════════════════════════════════
Similar concepts cluster TOGETHER in embedding space!
This is why semantic search works so beautifully.
```

---

## 9. ❌ Common Beginner Mistakes

| Mistake | Problem | Fix |
|---|---|---|
| Embedding queries and docs with different models | Similarity scores are meaningless | Always use the SAME model for both |
| Not normalizing vectors before cosine similarity | Slightly inaccurate results | Many libraries do this automatically |
| Using embeddings for exact keyword search | Wrong tool for the job | Use keyword search (BM25) for exact matches |
| Embedding entire long documents at once | Models have token limits (256-512 tokens) | Always chunk FIRST, then embed chunks |
| Storing only vectors without the original text | Can't show the user the source text | Always store vector + original text together |
| Using small dim models for long docs | Poor quality similarity | Use models designed for your content type |

---

## 10. ✅ Best Practices

```
✅ Always chunk text BEFORE embedding (respect token limits)
✅ Use the SAME embedding model for documents and queries
✅ Store original text alongside vectors in the DB
✅ For English text: all-MiniLM-L6-v2 is great for prototyping
✅ Batch embed documents (not one-by-one) for efficiency
✅ Cache embeddings — re-embedding the same text wastes money
✅ Monitor embedding model version — upgrading breaks similarity
✅ For multilingual content: use multilingual embedding models
✅ Test similarity scores on sample questions before production
```

---

## 11. 🚀 Advanced — Different Types of Embeddings

```
WORD EMBEDDINGS (old — Word2Vec, GloVe):
  Single words only. "bank" has ONE vector even though
  it means both "river bank" and "money bank". ❌

SENTENCE EMBEDDINGS (modern — Sentence-BERT, OpenAI):
  Entire sentences/paragraphs. Context-aware!
  "I went to the bank to deposit money" → captures financial meaning
  "I sat by the river bank" → captures nature meaning ✅

DOCUMENT EMBEDDINGS (ColBERT, late interaction):
  Special models for comparing entire documents.
  Used in enterprise search at Google scale.

MULTIMODAL EMBEDDINGS (CLIP, GPT-4V):
  Images AND text in the SAME embedding space!
  "a photo of a cat" (text) ≈ 🐱 (image) in embedding space ✅
  Powers: Google Image Search, Pinterest recommendations
```

---

## 12. 💼 Interview Questions

**Q1: What is a vector embedding and why is it needed?**
> An embedding is a numerical representation (list of floats) of text that captures its semantic meaning. It's needed because AI models and databases work with numbers, not words. The key property is that similar meanings produce similar numbers.

**Q2: Why is cosine similarity preferred over Euclidean distance for text embeddings?**
> Cosine similarity measures the angle between vectors, not their magnitude. Two texts can have the same meaning but different lengths (more tokens = larger magnitude). Cosine similarity is unaffected by magnitude, making it robust for variable-length texts.

**Q3: What happens if you use different embedding models for documents and queries?**
> The similarity scores become meaningless. Each model creates its own coordinate system. Comparing vectors from different models is like comparing GPS coordinates from two different planets — the numbers don't relate to each other.

**Q4: A user asks "How much vacation time do I get?" but the document says "annual leave entitlement is 20 days." How does embedding search handle this?**
> Both phrases are embedded into vectors. The embedding model (trained on billions of texts) has learned that "vacation time" and "annual leave" are semantically equivalent concepts. Their vectors will have high cosine similarity (e.g., 0.91), so the document will be retrieved correctly — even though no keywords match.

**Q5: What is the typical token limit for embedding models and how does it affect chunking?**
> Most embedding models have a 256–512 token limit (roughly 200–380 words). Text longer than this gets truncated, losing important information. This is why we chunk documents BEFORE embedding — each chunk must fit within the model's token limit.

---

## 13. 📝 Quiz

**Q1:** What is a vector embedding?
- A) A type of database
- B) A list of numbers that represents the meaning of text ✅
- C) A Python library
- D) A type of neural network

**Q2:** What does cosine similarity of 0.95 between two embeddings mean?
- A) The texts are very different
- B) The texts are somewhat related
- C) The texts are very similar in meaning ✅
- D) The texts are identical characters

**Q3:** Why must you chunk text BEFORE embedding?
- A) To save disk space
- B) Because embedding models have token limits ✅
- C) To make documents easier to read
- D) Because vectors need to be the same size

**Q4:** Which embedding model is FREE and runs locally — great for learning?
- A) text-embedding-3-large (OpenAI)
- B) all-MiniLM-L6-v2 (HuggingFace) ✅
- C) text-embedding-004 (Google)
- D) ada-002 (OpenAI)

**Q5:** If you embed "happy" and "sad", what cosine similarity would you expect?
- A) ~0.95 (very similar)
- B) ~0.80 (similar)
- C) ~0.10 (low — they're opposite emotions) ✅
- D) -1.0 (perfectly opposite)

---

## 14. 🏠 Homework

### Challenge 1 (Easy ⭐)
Run the code file. Change the `test_sentences` list to include your own pairs. What pairs did you expect to be similar? Were you surprised by any results?

### Challenge 2 (Medium ⭐⭐)
Create a tiny "semantic search" system:
1. Create 10 sentences about different topics (food, tech, sports)
2. Embed all of them
3. Take a query sentence, embed it
4. Find the top 3 most similar sentences using cosine similarity
5. Print them with their scores

### Challenge 3 (Hard ⭐⭐⭐)
Build a "Semantic FAQ Bot" (no LLM needed!):
1. Create 15 FAQ pairs (question + answer)
2. Embed all QUESTIONS
3. When user types a new question, find the closest FAQ question
4. Return the pre-written answer for that FAQ
5. This is exactly how old chatbots worked before LLMs!

---

## 🎯 Progress

```
✅ Topic 1: What is Data in AI?
✅ Topic 2: Structured vs Unstructured Data
✅ Topic 3: Data Sources
✅ Topic 4: Data Cleaning & Preprocessing
✅ Topic 5: Chunking and Splitting
✅ Topic 6: Metadata
✅ Topic 7: Embeddings Basics              ← YOU ARE HERE
⬜ Topic 8: Vector Databases Basics
⬜ Topic 9: ETL Pipelines for AI
⬜ Topic 10: Data Quality Issues
⬜ Topic 11: Enterprise Data Pipelines
```

---
*End of Topic 7 🎉 | Next: Topic 8 — Vector Databases Basics →*
*(Where embeddings finally have a HOME!)*
# 🎓 Gen AI Application Journey
## Level 0 — Topic 8: Vector Databases Basics

> **Difficulty:** ⭐⭐⭐ | **Time:** 90 min | **Code:** `08_vector_databases.py`
> **Why This Matters:** Vector DBs are the ENGINE of every RAG system!

---

## 🗺️ What You'll Learn

- What a vector database is and why regular databases can't do its job
- How vector search (ANN) works under the hood
- ChromaDB — the easiest vector DB to get started with
- CRUD operations on a vector database
- Similarity search with metadata filtering
- How vector DBs fit into the RAG pipeline
- Comparison of popular vector databases

---

## 1. 🧠 Simple Explanation — What is a Vector Database?

You now know that text gets converted to **embeddings** (lists of numbers).

But where do you STORE millions of those number-lists?
And how do you SEARCH through them in milliseconds?

**A regular database (SQL) cannot do this.** Here's why:

```
REGULAR SQL DATABASE:
─────────────────────────────────────────────────────
"Find all employees WHERE salary > 50000"
→ Database scans salary column, compares numbers
→ Works GREAT for exact matches and ranges ✅

"Find all documents SIMILAR TO this embedding vector"
→ Would need to compare ALL 1 million vectors one by one
→ At 1000 comparisons/sec → 1000 seconds = 16 minutes ❌
→ SQL has NO concept of "vector similarity"

VECTOR DATABASE:
─────────────────────────────────────────────────────
Specially built to:
1. Store millions of high-dimensional vectors efficiently
2. Find the TOP-K most similar vectors in milliseconds
3. Filter by metadata AT THE SAME TIME as vector search
4. Scale to billions of vectors in production
```

### The Library Analogy

- **SQL Database** = A library where books are sorted by ISBN number.
  Perfect for finding "Book #978-0-06-112008-4". Useless for "find books similar to Harry Potter."

- **Vector Database** = A library organized by TOPIC and THEME.
  You say "I liked Harry Potter" → it instantly finds "The Chronicles of Narnia," "Percy Jackson," etc.
  The "similarity" is captured in the vector coordinates!

---

## 2. 🔍 How Vector Search Works — ANN (Approximate Nearest Neighbor)

Searching for similar vectors is called **nearest neighbor search**.

### Brute Force (Exact but Slow)
```
Compare query vector to EVERY vector in the database.
10M documents × 384 dimensions × comparison = very slow ❌
Used only for tiny datasets (< 10,000 vectors)
```

### ANN — Approximate Nearest Neighbor (Fast!)
```
Smart indexing algorithms that trade a tiny bit of accuracy
for MASSIVE speed improvements:

HNSW (Hierarchical Navigable Small World) ← Most popular!
─────────────────────────────────────────────────────────
Think of it like a multi-floor office building:
  Floor 3 (top):    Very few "super-connectors" — jump to right area
  Floor 2 (middle): More nodes — narrow down the neighborhood
  Floor 1 (bottom): All vectors — find the exact nearest neighbors

Search: Start top → narrow down → reach result
Speed: 10M vectors searched in < 10ms! ✅

IVF (Inverted File Index):
  Groups vectors into clusters.
  Search only the closest clusters, not everything.

PQ (Product Quantization):
  Compresses vectors to save memory and speed up comparison.
```

---

## 3. 🗄️ Popular Vector Databases Compared

| Database | Type | Best For | Key Feature |
|---|---|---|---|
| **ChromaDB** | Open source, local | Learning, prototyping | Zero config, Python-native |
| **FAISS** | Library (Meta/Facebook) | Research, offline | Blazing fast, in-memory |
| **Pinecone** | Managed cloud | Production at scale | Fully managed, simple API |
| **Weaviate** | Open source / cloud | Enterprise | GraphQL + vector hybrid |
| **Qdrant** | Open source / cloud | Production | Rust-based, very fast |
| **Milvus** | Open source | Large scale | Billions of vectors |
| **pgvector** | PostgreSQL extension | Already using Postgres | SQL + vectors together |

> **For this course:** ChromaDB (Topics 7-9 this level, all of Level 2)
> **For production:** Pinecone or Qdrant

---

## 4. 🧱 ChromaDB — Your First Vector Database

ChromaDB is perfect for learning because:
- ✅ Runs **locally** on your machine (no cloud account needed)
- ✅ Zero configuration
- ✅ Stores data persistently to disk
- ✅ Has a clean Python API
- ✅ Supports both local embeddings AND OpenAI embeddings
- ✅ Used widely in RAG prototyping

### ChromaDB Core Concepts

```
CHROMADB CONCEPTS
═════════════════════════════════════════════════════════

CLIENT
  └── The connection to ChromaDB
  └── PersistentClient: saves to disk (survives restarts)
  └── EphemeralClient: in-memory only (lost on restart)

COLLECTION
  └── Like a "table" in SQL, or an "index" in Elasticsearch
  └── Stores: documents (text), embeddings (vectors), metadata, IDs
  └── One collection per "topic" or "document type" typically
  └── Example: hr_policies_collection, engineering_docs_collection

DOCUMENT
  └── The original text of a chunk
  └── Stored alongside its vector for retrieval

EMBEDDING
  └── The vector representation of the document
  └── Auto-generated by ChromaDB OR provided by you

METADATA
  └── Filter-able fields (source, department, date, etc.)
  └── Dictionary of key-value pairs per document

ID
  └── Unique identifier for each chunk/document
  └── Must be a string
```

### ChromaDB Operations (CRUD)

```python
import chromadb

# 1. CREATE client and collection
client     = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("my_collection")

# 2. ADD documents (with embeddings auto-generated or manual)
collection.add(
    ids        = ["doc1", "doc2"],
    documents  = ["Annual leave is 20 days.", "Sick leave is 10 days."],
    metadatas  = [{"source": "hr.pdf", "dept": "HR"},
                  {"source": "hr.pdf", "dept": "HR"}],
)

# 3. QUERY (semantic search!)
results = collection.query(
    query_texts = ["How much vacation time do I get?"],
    n_results   = 3,
    where       = {"dept": "HR"},   # Metadata filter
)

# 4. GET (retrieve by ID)
result = collection.get(ids=["doc1"])

# 5. UPDATE
collection.update(ids=["doc1"], documents=["Annual leave is 22 days."])

# 6. DELETE
collection.delete(ids=["doc2"])

# 7. COUNT
print(collection.count())
```

---

## 5. 🏗️ Vector DB in the Full RAG Pipeline

```
COMPLETE RAG PIPELINE — Vector DB's Role
════════════════════════════════════════════════════════════

INGESTION (runs once / periodically):
  Document → Clean → Chunk → Embed → STORE IN VECTOR DB
                                           ↑
                                    ┌──────────────┐
                                    │  VECTOR DB   │
                                    │  ──────────  │
                                    │  ID: chunk_1 │
                                    │  vec: [...]  │
                                    │  text: "..."  │
                                    │  meta: {...}  │
                                    │              │
                                    │  ID: chunk_2 │
                                    │  vec: [...]  │
                                    │  ...         │
                                    └──────────────┘
                                           ↓
RETRIEVAL (runs for every user query):
  User question → Embed question → SEARCH VECTOR DB
                                           ↓
                               Top-K most similar chunks
                                           ↓
                               Inject into LLM prompt
                                           ↓
                               LLM generates answer ✅
```

---

## 6. 🔍 Metadata Filtering in ChromaDB

```python
# ChromaDB's where clause supports these operators:

# Equal
where = {"department": {"$eq": "HR"}}

# Not equal
where = {"department": {"$ne": "Finance"}}

# Greater than / Less than (for numbers)
where = {"page_number": {"$gt": 5}}
where = {"year": {"$gte": 2023}}

# In a list
where = {"department": {"$in": ["HR", "Legal"]}}

# Not in a list
where = {"department": {"$nin": ["Engineering"]}}

# AND condition (both must be true)
where = {
    "$and": [
        {"department": {"$eq": "HR"}},
        {"doc_type": {"$eq": "policy"}}
    ]
}

# OR condition (at least one true)
where = {
    "$or": [
        {"department": {"$eq": "HR"}},
        {"department": {"$eq": "Legal"}}
    ]
}
```

---

## 7. ❌ Common Beginner Mistakes

| Mistake | Problem | Fix |
|---|---|---|
| Adding duplicate IDs | ChromaDB will error or overwrite | Use `get_or_create` + check before add |
| Not persisting the client | Data lost on restart | Always use `PersistentClient` with a path |
| Using the same collection for all docs | Pollutes search results | One collection per domain/doc-type |
| Not storing metadata | Can't filter, can't cite sources | Always add source + department metadata |
| Querying with wrong embedding model | Meaningless results | Same model used for indexing AND querying |
| Deleting a collection by mistake | All data lost! | Back up embeddings before deleting |

---

## 8. ✅ Best Practices

```
✅ Use PersistentClient — always save to disk
✅ Name collections descriptively: "hr_policies_v2" not "col1"
✅ Include source + date + department in metadata for every chunk
✅ Use get_or_create_collection to safely restart pipelines
✅ Keep chunk count per collection < 500K for ChromaDB locally
✅ For production (millions of docs): migrate to Pinecone/Qdrant
✅ Monitor collection.count() after ingestion to verify success
✅ Use upsert() instead of add() for idempotent pipelines
✅ Always test retrieval quality on sample questions after loading
```

---

## 9. 🚀 Advanced — Production Vector DB Features

```
FEATURES YOU'LL USE IN PRODUCTION (Level 2+):

Hybrid Search (vector + keyword):
  Combines dense embeddings + sparse BM25 keyword search.
  Best of both worlds — handles both semantic AND exact queries.
  Weaviate, Qdrant, and Pinecone all support this.

Namespaces / Tenants:
  Isolate data per customer in multi-tenant apps.
  Customer A's documents never appear in Customer B's results.

Reranking:
  After initial vector retrieval, a more powerful model re-ranks
  the results for higher precision. (Covered in Level 2 RAG!)

Scalar Quantization:
  Compress 32-bit floats to 8-bit integers.
  Reduces memory by 4x with minimal quality loss.

Vector DB as Cache:
  Store LLM responses alongside their query vectors.
  When a similar question comes in → return cached answer!
  Saves API costs dramatically in production.
```

---

## 10. 💼 Interview Questions

**Q1: Why can't we use a regular SQL database to store and search embeddings?**
> SQL databases are optimized for exact matches and range queries on structured data. They have no concept of vector similarity and would require O(n) brute-force comparison for every query — prohibitively slow at scale. Vector databases use specialized ANN indexes (HNSW, IVF) that find similar vectors in O(log n) time.

**Q2: What is HNSW and why is it important for vector search?**
> HNSW (Hierarchical Navigable Small World) is an approximate nearest neighbor algorithm. It organizes vectors in a hierarchical graph structure that allows jumping quickly to the right neighborhood, then refining to find the nearest vectors. It achieves near-exact results with query times under 10ms even for millions of vectors.

**Q3: What is the difference between ChromaDB and Pinecone?**
> ChromaDB is open-source, runs locally, free, great for prototyping and learning. Pinecone is a managed cloud service, scales to billions of vectors, has enterprise SLAs and security, but costs money. ChromaDB → learning/prototyping. Pinecone → production at scale.

**Q4: What does `n_results=5` mean in a ChromaDB query?**
> It returns the top 5 most similar chunks to the query (ranked by cosine similarity or other distance metric). This is the "k" in "top-k retrieval" — the number of chunks passed to the LLM as context.

**Q5: What is hybrid search and when would you use it?**
> Hybrid search combines vector (semantic) search with keyword (BM25) search. Use it when users might search using exact product names, codes, or technical terms that semantic search might miss (e.g., "API error code 403" vs "authorization failed").

---

## 11. 📝 Quiz

**Q1:** What is a Vector Database primarily optimized for?
- A) Storing and querying tabular data with SQL
- B) Finding the most similar vectors to a query vector ✅
- C) Storing images and videos
- D) Running machine learning training jobs

**Q2:** What algorithm does ChromaDB (and most vector DBs) use for fast search?
- A) Binary search
- B) Hash tables
- C) HNSW (Hierarchical Navigable Small World) ✅
- D) B-Tree indexing

**Q3:** What is the purpose of `n_results=5` in a ChromaDB query?
- A) Limit the database size
- B) Return the top 5 most similar chunks ✅
- C) Split the document into 5 chunks
- D) Set the embedding dimensions

**Q4:** When should you use `PersistentClient` vs `EphemeralClient` in ChromaDB?
- A) EphemeralClient for production, PersistentClient for testing
- B) PersistentClient when you want data saved to disk ✅
- C) EphemeralClient is faster for all use cases
- D) They are identical in behavior

**Q5:** What is the best vector database for learning and prototyping?
- A) Pinecone
- B) Milvus
- C) ChromaDB ✅
- D) pgvector

---

## 12. 🏠 Homework

### Challenge 1 (Easy ⭐)
Load the company policy text from Topic 4's cleaned data. Add it to ChromaDB as chunks. Query "what is the sick leave policy?" and print the top result.

### Challenge 2 (Medium ⭐⭐)
Build a multi-collection ChromaDB system:
- `hr_policies` collection — HR documents
- `engineering_docs` collection — Engineering documents
- Add 5 chunks to each
- Query each collection separately and compare results

### Challenge 3 (Hard ⭐⭐⭐)
Build a "Persistent Knowledge Base" script that:
1. On first run: ingests all `.txt` files from a folder into ChromaDB
2. On subsequent runs: detects already-ingested files (by ID) and skips them
3. Allows querying via command line: `python kb.py "your question here"`
4. Prints: answer source, similarity score, and page metadata

---

## 🎯 Progress

```
✅ Topic 1: What is Data in AI?
✅ Topic 2: Structured vs Unstructured Data
✅ Topic 3: Data Sources
✅ Topic 4: Data Cleaning & Preprocessing
✅ Topic 5: Chunking and Splitting
✅ Topic 6: Metadata
✅ Topic 7: Embeddings Basics
✅ Topic 8: Vector Databases Basics          ← YOU ARE HERE
⬜ Topic 9: ETL Pipelines for AI
⬜ Topic 10: Data Quality Issues
⬜ Topic 11: Enterprise Data Pipelines
```

---
*End of Topic 8 🎉 | Next: Topic 9 — ETL Pipelines for AI →*
# 🎓 Gen AI Application Journey
## Level 0 — Topic 9: ETL Pipelines for AI

> **Difficulty:** ⭐⭐⭐ | **Time:** 90 min | **Code:** `09_etl_pipeline.py`
> **Why This Matters:** ETL is the BACKBONE of every production AI system!

---

## 🗺️ What You'll Learn

- What ETL means and why every AI system needs it
- The 3 phases: Extract, Transform, Load — deeply explained
- How to design a modular, reusable AI data pipeline
- Error handling, logging, and retry logic in pipelines
- Pipeline monitoring and quality gates
- Scheduling and automation concepts
- How enterprise companies run ETL at scale

---

## 1. 🧠 Simple Explanation — What is ETL?

**ETL = Extract → Transform → Load**

It's a pipeline — like an assembly line in a factory.

```
THE FACTORY ANALOGY:
══════════════════════════════════════════════════════

RAW MATERIALS        FACTORY              FINISHED PRODUCT
(Raw Data)           (Pipeline)           (AI-Ready Data)

  📄 PDFs     ──►  [EXTRACT]  ──►  Raw text
  🌐 Websites ──►  [TRANSFORM]──►  Cleaned, chunked, embedded
  🗄️ DBs      ──►  [LOAD]     ──►  Stored in Vector DB ✅

Think of it like a car factory:
  Iron ore comes in → gets shaped, painted, assembled → car drives out
  Raw docs come in → get cleaned, embedded → AI answers come out
```

### The 3 Phases in Detail

```
EXTRACT:
  "Get the raw data from wherever it lives"
  ├── Read PDFs from file system
  ├── Call REST APIs for live data
  ├── Query SQL databases
  ├── Scrape web pages
  └── Read from cloud storage (S3, Azure Blob)

TRANSFORM:
  "Convert raw data into AI-ready format"
  ├── Extract text from PDFs/Word
  ├── Clean noise, fix encoding
  ├── Split into chunks
  ├── Attach metadata
  └── Create embeddings (text → vectors)

LOAD:
  "Store processed data where AI can find it"
  ├── Write to Vector Database (ChromaDB, Pinecone)
  ├── Save to SQL database (metadata/audit trail)
  ├── Write processed chunks to file system
  └── Update search indexes
```

---

## 2. 🏗️ ETL Pipeline Architecture

```
COMPLETE AI ETL PIPELINE
════════════════════════════════════════════════════════════

TRIGGER LAYER:
  ┌─────────────────────────────────────────────────────┐
  │  Scheduled (cron: midnight daily)                   │
  │  Event-driven (new file uploaded → trigger)         │
  │  Manual (developer runs: python etl_pipeline.py)    │
  └─────────────────────────────────────────────────────┘
                          │
                          ▼
EXTRACT PHASE:
  ┌─────────────────────────────────────────────────────┐
  │  Source Connectors                                  │
  │  ├── PDFConnector    → reads PDF files              │
  │  ├── APIConnector    → calls REST APIs              │
  │  ├── DBConnector     → queries SQL database         │
  │  └── WebConnector    → scrapes web pages            │
  │                                                     │
  │  Output: RawDocument objects                        │
  └─────────────────────────────────────────────────────┘
                          │
                          ▼
TRANSFORM PHASE:
  ┌─────────────────────────────────────────────────────┐
  │  Processing Steps (in order)                        │
  │  ├── TextExtractor   → PDF/docx/html → plain text   │
  │  ├── TextCleaner     → remove noise, fix encoding   │
  │  ├── MetadataBuilder → attach source, date, dept    │
  │  ├── Chunker         → split into pieces            │
  │  └── Embedder        → text → vectors               │
  │                                                     │
  │  Output: List of ProcessedChunk objects             │
  └─────────────────────────────────────────────────────┘
                          │
                    Quality Gate ←── FAIL → Stop + Alert
                          │ PASS
                          ▼
LOAD PHASE:
  ┌─────────────────────────────────────────────────────┐
  │  Destinations                                       │
  │  ├── VectorDB    → ChromaDB / Pinecone              │
  │  ├── MetadataDB  → SQLite / PostgreSQL              │
  │  └── AuditLog    → JSON file / logging service      │
  │                                                     │
  │  Output: Success/Failure report                     │
  └─────────────────────────────────────────────────────┘
                          │
                          ▼
MONITORING:
  ┌─────────────────────────────────────────────────────┐
  │  Pipeline Run Report                                │
  │  ├── docs_processed: 47                             │
  │  ├── chunks_created: 384                            │
  │  ├── embeddings_made: 384                           │
  │  ├── errors: 2 (logged for review)                  │
  │  ├── duration: 4m 32s                               │
  │  └── quality_score: 9.4/10                          │
  └─────────────────────────────────────────────────────┘
```

---

## 3. 🧩 Pipeline Design Principles

### Principle 1: Idempotency (Run-it-again safety)
```
An idempotent pipeline produces the SAME result
whether you run it once or a hundred times.

BAD (NOT idempotent):
  Run 1 → Adds 100 chunks to DB
  Run 2 → Adds ANOTHER 100 chunks = 200 duplicates! ❌

GOOD (Idempotent):
  Run 1 → Adds 100 chunks to DB
  Run 2 → Detects chunks exist by ID → skips them ✅
  OR:    → Upserts (add if new, update if exists) ✅
```

### Principle 2: Modularity (Plug-and-play steps)
```python
# GOOD design — each step is independent:
raw_docs  = extractor.extract(sources)      # Step 1
clean     = cleaner.transform(raw_docs)     # Step 2
chunks    = chunker.transform(clean)        # Step 3
embedded  = embedder.transform(chunks)      # Step 4
loader.load(embedded)                       # Step 5

# You can swap any step without affecting others:
# → Change PDF library? Only fix Step 1
# → Change embedding model? Only fix Step 4
# → Change vector DB? Only fix Step 5
```

### Principle 3: Error Isolation
```python
# GOOD — one bad document doesn't kill the whole pipeline
errors = []
for doc in documents:
    try:
        result = process(doc)
    except Exception as e:
        errors.append({"doc": doc.name, "error": str(e)})
        continue   # Skip this doc, keep going!

# Report errors at the end
print(f"Processed {len(documents) - len(errors)}/{len(documents)} docs")
print(f"Errors: {errors}")
```

### Principle 4: Quality Gates
```python
# GOOD — Stop if data quality is too poor
def quality_gate(chunks: list) -> bool:
    empty_chunks   = sum(1 for c in chunks if len(c.text) < 50)
    error_rate     = empty_chunks / max(len(chunks), 1)

    if error_rate > 0.1:    # > 10% bad chunks
        raise QualityError(f"Too many bad chunks: {error_rate:.0%}")
    return True
```

### Principle 5: Logging Everything
```python
# GOOD — Full audit trail for every pipeline run
pipeline_log = {
    "run_id"         : "RUN-20240601-001",
    "started_at"     : "2024-06-01T00:00:05Z",
    "completed_at"   : "2024-06-01T00:04:37Z",
    "duration_secs"  : 272,
    "docs_attempted" : 50,
    "docs_succeeded" : 48,
    "docs_failed"    : 2,
    "chunks_created" : 384,
    "errors"         : [{"doc": "broken.pdf", "error": "encrypted PDF"}],
    "triggered_by"   : "scheduler",
}
```

---

## 4. ⏱️ Scheduling and Triggering

```
HOW PIPELINES GET TRIGGERED IN PRODUCTION:
══════════════════════════════════════════════════════

1. SCHEDULED (Time-based):
   ├── "Run every night at midnight"
   ├── Tools: cron (Linux), Task Scheduler (Windows)
   ├── Enterprise: Apache Airflow, Prefect, Dagster
   └── Example: Re-index all documents weekly

2. EVENT-DRIVEN (Trigger-based):
   ├── "Run when a new file is uploaded"
   ├── Tools: AWS Lambda, Azure Functions, webhooks
   └── Example: New PDF added to SharePoint → auto-ingest

3. ON-DEMAND (Manual):
   ├── "Run when I tell it to"
   ├── Developer runs: python etl_pipeline.py
   └── Example: Initial data load, emergency re-index

4. STREAMING (Real-time):
   ├── "Process data as it arrives"
   ├── Tools: Apache Kafka, AWS Kinesis
   └── Example: New customer emails → process immediately
```

---

## 5. 📊 Enterprise ETL Tools (What Big Companies Use)

```
ENTERPRISE ETL ORCHESTRATION:
──────────────────────────────────────────────────────

Apache Airflow:
  ├── Industry standard for workflow scheduling
  ├── Python-based DAG (Directed Acyclic Graph) pipelines
  ├── Visual UI to monitor pipeline runs
  └── Used by: Airbnb, Twitter, NASA

Prefect / Dagster:
  ├── Modern alternatives to Airflow
  ├── Better Python integration
  └── Used by: startups and mid-size companies

AWS Glue / Azure Data Factory:
  ├── Fully managed cloud ETL
  ├── No server management needed
  └── Used by: enterprises on cloud

For AI specifically:
  ├── LangChain's document loaders = Extract step
  ├── LangChain's text splitters   = Transform step
  └── LangChain's vector stores    = Load step
  (You'll use these in Level 2!)
```

---

## 6. ❌ Common Beginner Mistakes

| Mistake | Problem | Fix |
|---|---|---|
| No error handling | One bad file crashes everything | Try/except per document |
| Not logging runs | Can't debug failures later | Always write a run log |
| Blocking the main thread | Large pipelines freeze UI | Run pipelines asynchronously |
| Re-processing all docs every run | Slow and wasteful | Track already-processed docs by ID |
| No quality gate | Bad data silently enters vector DB | Check quality BEFORE loading |
| Hard-coded file paths | Breaks when deployed elsewhere | Use config files or env variables |

---

## 7. ✅ Best Practices

```
✅ Design for idempotency — safe to re-run
✅ Process documents one at a time in a try/except
✅ Write a structured run log (JSON) after every run
✅ Add quality gates between Transform and Load phases
✅ Use config files for chunk_size, overlap, batch_size
✅ Track document IDs to avoid re-processing
✅ Test pipeline on 5 documents before running on 5000
✅ Add retry logic (3 attempts) for transient failures
✅ Monitor pipeline duration — sudden slowdowns = problem
✅ Alert on failure: send email/Slack when pipeline errors
```

---

## 8. 🚀 Advanced — LangChain's Pipeline Components

```python
# At Level 2, you'll use LangChain's built-in pipeline pieces:

from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

# This IS an ETL pipeline in ~10 lines!
loader    = DirectoryLoader("./docs", glob="**/*.pdf")  # EXTRACT
docs      = loader.load()

splitter  = RecursiveCharacterTextSplitter(             # TRANSFORM (chunk)
                chunk_size=1000, chunk_overlap=200)
chunks    = splitter.split_documents(docs)

embedder  = OpenAIEmbeddings()                          # TRANSFORM (embed)

vectordb  = Chroma.from_documents(                      # LOAD
                chunks, embedder, persist_directory="./chroma")

print(f"Pipeline complete: {len(chunks)} chunks loaded!")
```

---

## 9. 💼 Interview Questions

**Q1: What does ETL stand for and how does it apply to AI systems?**
> Extract (get raw data from sources like PDFs, DBs, APIs), Transform (clean, chunk, embed), Load (store in vector DB). In AI, ETL is the data pipeline that converts raw enterprise documents into AI-queryable embeddings.

**Q2: What is idempotency and why is it critical for data pipelines?**
> Idempotency means running a pipeline multiple times produces the same result as running it once. It prevents duplicate data from accumulating in the vector DB. Achieved by tracking document IDs and using upsert operations.

**Q3: What is a quality gate in an ETL pipeline?**
> A quality gate is a checkpoint between pipeline stages that validates data meets a minimum quality threshold before proceeding. For example: "if >10% of chunks are empty, stop the pipeline and alert the team" instead of loading bad data silently.

**Q4: How would you handle a pipeline that processes 10,000 PDF documents overnight?**
> Batch them (e.g., 100 at a time), use try/except per document so failures don't stop the whole run, track processed IDs to enable resuming after failure, log every batch result, add a quality gate after each batch, and monitor total duration with alerts if it exceeds expected time.

**Q5: What is the difference between scheduled and event-driven pipeline triggers?**
> Scheduled: runs at fixed times (midnight daily) — predictable but may process stale data. Event-driven: triggered by an event (new file upload) — more real-time but requires infrastructure like webhooks or message queues. Most enterprise systems use both.

---

## 10. 📝 Quiz

**Q1:** What does ETL stand for?
- A) Encode, Train, Learn
- B) Extract, Transform, Load ✅
- C) Execute, Test, Launch
- D) Embed, Tokenize, Link

**Q2:** What does "idempotent pipeline" mean?
- A) A pipeline that runs very fast
- B) A pipeline that produces the same result regardless of how many times it runs ✅
- C) A pipeline with no errors
- D) A pipeline that uses AI

**Q3:** Where in the ETL pipeline do embeddings get created?
- A) Extract phase
- B) Load phase
- C) Transform phase ✅
- D) Monitoring phase

**Q4:** What is the purpose of a Quality Gate?
- A) To speed up the pipeline
- B) To stop bad data from entering the vector database ✅
- C) To schedule pipeline runs
- D) To create embeddings faster

**Q5:** Which tool is the industry standard for scheduling ETL pipelines?
- A) ChromaDB
- B) pandas
- C) Apache Airflow ✅
- D) sentence-transformers

---

## 11. 🏠 Homework

### Challenge 1 (Easy ⭐)
Write a pipeline that reads all `.txt` files from a folder, counts words in each, and saves a summary JSON. Add try/except so one bad file doesn't crash everything.

### Challenge 2 (Medium ⭐⭐)
Extend the pipeline with an idempotency check: save processed file names to `processed_log.json`. On re-run, skip already-processed files and only process new ones.

### Challenge 3 (Hard ⭐⭐⭐)
Build a full mini ETL pipeline:
1. **Extract**: Read 3 `.txt` files from a folder
2. **Transform**: Clean text → chunk by paragraphs → add metadata
3. **Quality Gate**: Reject chunks < 30 words
4. **Load**: Store in a SimpleVectorStore (from Topic 8)
5. **Report**: Save a run log JSON with timing and stats

---

## 🎯 Progress

```
✅ Topic 1: What is Data in AI?
✅ Topic 2: Structured vs Unstructured Data
✅ Topic 3: Data Sources
✅ Topic 4: Data Cleaning & Preprocessing
✅ Topic 5: Chunking and Splitting
✅ Topic 6: Metadata
✅ Topic 7: Embeddings Basics
✅ Topic 8: Vector Databases Basics
✅ Topic 9: ETL Pipelines for AI            ← YOU ARE HERE
⬜ Topic 10: Data Quality Issues
⬜ Topic 11: Enterprise Data Pipelines
```

---
*End of Topic 9 🎉 | Next: Topic 10 — Data Quality Issues →*
# 🎓 Gen AI Application Journey
## Level 0 — Topic 10: Data Quality Issues

> **Difficulty:** ⭐⭐⭐ | **Time:** 75 min | **Code:** `10_data_quality.py`
> **Why This Matters:** Poor data quality = hallucinating, unreliable AI. Quality = Trust!

---

## 🗺️ What You'll Learn

- The 6 dimensions of data quality (the industry standard framework)
- Real data quality issues in AI systems and their AI impact
- How to measure data quality programmatically
- Data quality profiling — generating a full quality report
- How quality issues manifest as AI failures
- Remediation strategies for each issue type
- Great Expectations — enterprise data quality tooling

---

## 1. 🧠 Simple Explanation — Why Data Quality Matters for AI

Here's a story. Two engineers at ACME Bank build an AI policy assistant.

**Engineer A** doesn't care about data quality. She just dumps all PDFs into the vector DB and ships it.

**Engineer B** obsesses over data quality. He profiles, validates, and monitors every document before ingestion.

```
3 MONTHS LATER:

Engineer A's AI:              Engineer B's AI:
─────────────────────         ─────────────────────
User: "How many sick          User: "How many sick
days do I get?"               days do I get?"

AI: "You get 10 days."  ✅    AI: "You get 10 days."  ✅
                              Source: HR Policy v2.1
                              Last updated: March 2024

User: "What's our            User: "What's our
parental leave policy?"      parental leave policy?"

AI: "6 weeks paid."   ❌      AI: "16 weeks for primary
(Wrong! From an old,          caregivers, 4 weeks for
 outdated version!)           secondary caregivers."  ✅

User: "When does the          User: "I couldn't find
office close?"               specific office hours in
                              my knowledge base. Please
AI: "At 5 PM."  ❌            check with HR directly." ✅
(Hallucinated!)
```

**The difference? Data Quality.** Old, missing, and corrupted data causes AI to give wrong answers — or make things up (hallucinate).

---

## 2. 📐 The 6 Dimensions of Data Quality (Industry Standard)

These are the internationally recognised dimensions used by data teams worldwide:

```
DIMENSION 1: COMPLETENESS
──────────────────────────────────────────────────────
Definition: All required data fields exist and are populated.
AI Impact:  Missing sections → AI can't answer questions about them.

Example Problem: A policy document has Section 1 and Section 3,
                 but Section 2 (benefits) was accidentally deleted.
Example Fix:     Flag documents with obvious section gaps.
Measurement:     % of required fields that are populated.

─────────────────────────────────────────────────────

DIMENSION 2: ACCURACY
──────────────────────────────────────────────────────
Definition: Data correctly represents real-world facts.
AI Impact:  Wrong facts → AI confidently gives wrong answers.

Example Problem: "Annual leave: 15 days" (but actual policy is 20 days)
Example Fix:     Version control + human sign-off on policy changes.
Measurement:     % records verified against ground truth source.

─────────────────────────────────────────────────────

DIMENSION 3: CONSISTENCY
──────────────────────────────────────────────────────
Definition: Same data says the same thing across all sources.
AI Impact:  Contradictory chunks → AI gives different answers
            depending on which chunk it retrieves.

Example Problem:
  leave_policy_2022.pdf: "Annual leave: 15 days"
  leave_policy_2024.pdf: "Annual leave: 20 days"
  Both in the vector DB → AI alternates between 15 and 20!

Example Fix:     Tag with version, filter to latest only.
Measurement:     % of duplicate facts that agree with each other.

─────────────────────────────────────────────────────

DIMENSION 4: TIMELINESS (FRESHNESS)
──────────────────────────────────────────────────────
Definition: Data is up-to-date and reflects current reality.
AI Impact:  Stale data → AI answers based on old/obsolete policies.

Example Problem: AI still knows the 2020 expense policy
                 even though it was updated in 2024.
Example Fix:     Track modified_date, expire stale docs automatically.
Measurement:     % of docs updated within the last N months.

─────────────────────────────────────────────────────

DIMENSION 5: VALIDITY
──────────────────────────────────────────────────────
Definition: Data conforms to expected formats and business rules.
AI Impact:  Malformed data → corrupted chunks → poor retrieval.

Example Problem:
  email field: "john-at-company.com" (missing @)
  date field:  "yesterday" (not a real date)
  salary:      -5000 (impossible value)

Example Fix:     Schema validation before ingestion.
Measurement:     % of records passing all validation rules.

─────────────────────────────────────────────────────

DIMENSION 6: UNIQUENESS
──────────────────────────────────────────────────────
Definition: Each real-world entity appears only once.
AI Impact:  Duplicates → AI over-weights duplicated content,
            answers seem more confident than they should be.

Example Problem: Same HR policy ingested 3 times because it was
                 saved in 3 different folders on SharePoint.
Example Fix:     Content-hash deduplication before ingestion.
Measurement:     % of records with unique IDs / no duplicates.
```

---

## 3. 📊 Data Quality Scorecard

Enterprise teams use a **scorecard** to track all 6 dimensions:

```
DATA QUALITY SCORECARD — ACME Corp Knowledge Base
══════════════════════════════════════════════════════
Dimension       Score    Status    Issues Found
────────────────────────────────────────────────────
Completeness    8.5/10   🟡        142 docs missing metadata
Accuracy        9.2/10   🟢        23 docs need human review
Consistency     6.8/10   🔴        47 docs have conflicting data
Timeliness      7.1/10   🟡        89 docs not updated >12 months
Validity        9.5/10   🟢        12 invalid field values
Uniqueness      8.9/10   🟢        31 near-duplicate documents
────────────────────────────────────────────────────
OVERALL SCORE:  8.3/10   Status: ⚠️ Needs Attention
Action: Fix consistency issues before next deployment.
══════════════════════════════════════════════════════
```

---

## 4. 🤖 How Quality Issues Cause AI Failures

```
QUALITY ISSUE          WHAT AI DOES              REAL-WORLD IMPACT
──────────────────────────────────────────────────────────────────────
Stale policy docs   →  Gives outdated answer  →  Employee follows wrong policy
Duplicate chunks    →  Over-retrieves old doc →  Reinforces wrong information
Incomplete docs     →  "I don't know"          →  User loses trust in AI
Inconsistent data   →  Contradicts itself      →  User confused, escalates to HR
Invalid formatting  →  Garbled text retrieved  →  Nonsensical answer
No metadata         →  Can't cite source       →  User can't verify answer

THE HALLUCINATION CONNECTION:
When the AI can't find a good answer in the knowledge base
(because data is missing, stale, or low quality), it may
"fill the gap" by generating a plausible-sounding answer
from its training data. This is hallucination.

Quality data → AI finds real answers → No hallucination ✅
Poor data   → AI can't find answers → Hallucination risk ❌
```

---

## 5. 🔧 Remediation Strategies

```
FOR COMPLETENESS ISSUES:
  • Audit source systems for missing documents
  • Set up alerts when expected documents don't arrive
  • Use "Unknown" / "Not Available" placeholders, never nulls

FOR ACCURACY ISSUES:
  • Implement human-in-the-loop review for critical documents
  • Cross-validate facts against authoritative source systems
  • Track data lineage (where did this number come from?)

FOR CONSISTENCY ISSUES:
  • Implement version management — keep only the latest version
  • Use modified_date filter at query time
  • Deduplicate by content hash before ingestion

FOR TIMELINESS ISSUES:
  • Add expiry_date to document metadata
  • Auto-archive documents older than N months
  • Daily freshness check: alert if key docs not updated in 30 days

FOR VALIDITY ISSUES:
  • Schema validation before ingestion (JSON Schema / Pydantic)
  • Data type enforcement (salary must be positive number)
  • Regex validation for structured fields (email, phone, date)

FOR UNIQUENESS ISSUES:
  • Content-hash deduplication (MD5/SHA-256 of cleaned text)
  • Fuzzy deduplication for near-duplicates (Levenshtein distance)
  • Upsert operations in vector DB (never plain add)
```

---

## 6. 🏭 Great Expectations — Enterprise Quality Tool

```python
# Great Expectations lets you write quality rules like unit tests
# and validate data before it enters your pipeline.

import great_expectations as ge

df = ge.read_csv("hr_data.csv")

# Write expectations (rules):
df.expect_column_to_exist("emp_id")
df.expect_column_values_to_not_be_null("emp_id")
df.expect_column_values_to_be_between("salary", 10000, 500000)
df.expect_column_values_to_match_regex("email", r"^[\w.]+@[\w.]+\.[a-z]{2,}$")
df.expect_column_values_to_be_in_set("department",
    ["HR", "Engineering", "Finance", "Legal", "Marketing"])

# Run validation:
results = df.validate()
print(f"Success: {results['success']}")
# If any expectation fails → pipeline stops + team gets alert!
```

---

## 7. ❌ Common Beginner Mistakes

| Mistake | Problem | Fix |
|---|---|---|
| "Good enough" thinking | Small errors compound across thousands of docs | Measure quality metrics before deployment |
| No version tracking | Old and new policies coexist in vector DB | Tag every doc with version + modified_date |
| Treating all docs equally | A 5-year-old policy has same weight as today's | Weight or expire documents by freshness |
| Only checking quality once | New data brings new issues | Run quality checks on EVERY pipeline run |
| Ignoring near-duplicates | Hard to find but very harmful | Use content hashing and fuzzy matching |

---

## 8. ✅ Best Practices

```
✅ Measure all 6 quality dimensions before every deployment
✅ Set minimum acceptable scores per dimension (e.g., >8.0)
✅ Block deployment if any dimension score drops below threshold
✅ Track quality scores over time — trends matter more than single values
✅ Log every quality issue found (not just the summary score)
✅ Fix consistency first — it causes the most AI failures
✅ Automate freshness checks — stale data is the most common issue
✅ Use content hashing for deduplication (not just filename)
✅ Build a quality dashboard visible to the whole AI team
```

---

## 9. 💼 Interview Questions

**Q1: What are the 6 dimensions of data quality?**
> Completeness (all data present), Accuracy (data is correct), Consistency (same data agrees across sources), Timeliness (data is fresh), Validity (data conforms to format/rules), Uniqueness (no duplicates).

**Q2: How does data quality directly cause AI hallucination?**
> When the knowledge base has missing, stale, or conflicting data, the AI retrieves poor-quality context. When no good context is found, the AI falls back to its training data and generates a plausible-sounding answer — this is hallucination. High-quality data gives the AI the correct answer to retrieve, preventing hallucination.

**Q3: How would you handle conflicting information across document versions?**
> Track `modified_date` and `version` in metadata for every document. At query time, filter to only retrieve documents newer than a threshold date. Archive or remove old versions from the vector DB rather than keeping all versions simultaneously.

**Q4: What is content-hash deduplication and why is it better than filename-based deduplication?**
> Content-hash deduplication generates a hash (e.g., MD5) of the document's cleaned text. Two documents with identical content get the same hash, regardless of filename. This catches duplicates saved with different names or in different folders — much more robust than comparing filenames.

**Q5: What is Great Expectations and how does it fit into an ETL pipeline?**
> Great Expectations is a Python library for data validation. You define "expectations" (rules like "salary must be > 0") and validate data against them. In an ETL pipeline, it acts as a quality gate between Transform and Load — if expectations fail, the pipeline stops and alerts the team.

---

## 10. 📝 Quiz

**Q1:** Which data quality dimension addresses "the data is correct and reflects real facts"?
- A) Completeness
- B) Uniqueness
- C) Accuracy ✅
- D) Timeliness

**Q2:** Two policy documents with different annual leave values (15 days vs 20 days) in the same vector DB violates which dimension?
- A) Validity
- B) Completeness
- C) Uniqueness
- D) Consistency ✅

**Q3:** What is the most common cause of AI hallucination related to data quality?
- A) Too many chunks in the vector DB
- B) Stale, missing, or conflicting data in the knowledge base ✅
- C) Slow embedding models
- D) Too many metadata fields

**Q4:** What technique prevents the same document from being stored twice?
- A) Schema validation
- B) Timeliness checks
- C) Content-hash deduplication ✅
- D) Regex validation

**Q5:** What tool lets enterprise teams write data quality rules like unit tests?
- A) ChromaDB
- B) LangChain
- C) Great Expectations ✅
- D) Apache Spark

---

## 🎯 Progress

```
✅ Topic 1–9:  Complete!
✅ Topic 10:   Data Quality Issues          ← YOU ARE HERE
⬜ Topic 11:   Enterprise Data Pipelines
               (Final Capstone of Level 0!)
```

---
*End of Topic 10 🎉 | Next: Topic 11 — Enterprise Data Pipelines (Level 0 Capstone!) →*
# 🎓 Gen AI Application Journey
## Level 0 — Topic 11: Enterprise Data Pipelines (Grand Finale!)

> **Difficulty:** ⭐⭐⭐⭐ | **Time:** 120 min | **Code:** `11_enterprise_pipeline.py`
> **This is the CAPSTONE of Level 0 — everything comes together here!**

---

## 🗺️ What You'll Learn

- How ALL Level 0 topics combine into one production pipeline
- Enterprise pipeline architecture patterns
- Configuration-driven pipeline design
- Full observability: logging, metrics, and alerting
- Pipeline versioning and deployment strategies
- How real companies like Google, Netflix, and Uber do this
- The bridge from Level 0 → Level 1 (RAG systems)

---

## 1. 🧠 The Grand Picture — Everything You've Learned, Connected

Take a breath and look at what you've built over the last 10 topics:

```
LEVEL 0 COMPLETE KNOWLEDGE MAP
══════════════════════════════════════════════════════════════

  Topic 1: DATA IS FUEL → AI needs data to work
  Topic 2: DATA TYPES → Structured / Semi / Unstructured
  Topic 3: DATA SOURCES → PDFs, APIs, Databases, Web
  Topic 4: DATA CLEANING → Remove noise, fix errors
  Topic 5: CHUNKING → Split into AI-digestible pieces
  Topic 6: METADATA → Label every piece for traceability
  Topic 7: EMBEDDINGS → Text → Numbers that capture meaning
  Topic 8: VECTOR DB → Store and search embeddings at scale
  Topic 9: ETL PIPELINE → Automate the whole process
  Topic 10: DATA QUALITY → Measure and ensure correctness

NOW: Topic 11 combines ALL of these into ONE enterprise pipeline!

ENTERPRISE DATA PIPELINE = Topics 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10
                           running together, automatically,
                           reliably, at scale.
```

---

## 2. 🏭 What Makes a Pipeline "Enterprise-Grade"?

```
STUDENT-GRADE PIPELINE:          ENTERPRISE-GRADE PIPELINE:
──────────────────────────        ──────────────────────────────────────
python load_docs.py               Runs automatically on schedule
Runs manually                     Handles 100,000+ documents/day
Crashes on bad input              Isolates and logs errors gracefully
No logs                           Full audit trail (who, what, when)
No quality checks                 Quality gates at every stage
Fixed chunk size                  Config-driven (easy to tune)
Loses data on restart             Idempotent (safe to re-run)
One source type                   Multi-source (PDF + API + DB + Web)
                                  Monitored with alerts
                                  Version controlled
                                  Tested with unit tests
```

### The 5 Pillars of an Enterprise Pipeline

```
PILLAR 1: RELIABILITY
  → Handles failures gracefully, retries automatically
  → Never loses data, never creates duplicates

PILLAR 2: OBSERVABILITY
  → Every run produces a detailed log
  → Metrics tracked over time (speed, quality, volume)
  → Alerts when something goes wrong

PILLAR 3: SCALABILITY
  → Works on 10 documents AND 10 million documents
  → Can be parallelised across multiple workers

PILLAR 4: MAINTAINABILITY
  → Configuration-driven (no code changes for tuning)
  → Modular (swap any component independently)
  → Well-documented and tested

PILLAR 5: SECURITY
  → No secrets in code (environment variables)
  → PII detection and masking
  → Access controls on document collections
```

---

## 3. 🗺️ Enterprise Pipeline Architecture

```
ENTERPRISE AI DATA PIPELINE — FULL ARCHITECTURE
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│  CONFIG LAYER (pipeline.yaml / pipeline_config.json)        │
│  chunk_size=1000, overlap=200, quality_threshold=0.85, ...  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR (PipelineRunner)                              │
│  • Reads config                                             │
│  • Coordinates all phases                                   │
│  • Manages run lifecycle (start → monitor → complete)       │
└─────────────────────────────────────────────────────────────┘
          │              │              │              │
          ▼              ▼              ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ EXTRACT  │  │TRANSFORM │  │  LOAD    │  │ MONITOR  │
    │ Phase    │  │ Phase    │  │  Phase   │  │  Phase   │
    │          │  │          │  │          │  │          │
    │ PDF      │  │ Clean    │  │ ChromaDB │  │ Metrics  │
    │ Word     │  │ Chunk    │  │ SQLite   │  │ Alerts   │
    │ API      │  │ Metadata │  │ JSON log │  │ Dashboard│
    │ Database │  │ Embed    │  │          │  │          │
    │ Web      │  │ Validate │  │          │  │          │
    └──────────┘  └──────────┘  └──────────┘  └──────────┘
          │              │              │              │
          └──────────────┴──────────────┴──────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  QUALITY GATE   │
                    │  Score ≥ 8.0?   │
                    │  YES → Deploy   │
                    │  NO  → Alert    │
                    └─────────────────┘
```

---

## 4. ⚙️ Configuration-Driven Design

Enterprise pipelines are never hard-coded. Everything is in a config file:

```json
{
  "pipeline": {
    "name"             : "acme_knowledge_base_v2",
    "version"          : "2.1.0",
    "schedule"         : "0 0 * * *"
  },
  "sources": [
    {"type": "folder",   "path": "./docs/hr",        "department": "HR"},
    {"type": "folder",   "path": "./docs/finance",   "department": "Finance"},
    {"type": "api",      "url" : "https://api.example.com/policies"}
  ],
  "transform": {
    "chunk_size"        : 1000,
    "chunk_overlap"     : 200,
    "min_chunk_words"   : 10,
    "embedding_model"   : "all-MiniLM-L6-v2"
  },
  "quality": {
    "min_score"         : 8.0,
    "stale_months"      : 18,
    "halt_on_failure"   : true
  },
  "load": {
    "vector_db_path"    : "./chroma_db",
    "collection"        : "enterprise_kb_v2",
    "metadata_db_path"  : "./metadata.db"
  },
  "monitoring": {
    "log_path"          : "./logs/",
    "alert_email"       : "ai-team@acmecorp.com",
    "slack_webhook"     : "https://hooks.slack.com/..."
  }
}
```

**Why this matters:** Changing chunk size, switching embedding models, or adding a new data source = just edit the config, no code changes!

---

## 5. 📈 Observability — What You Must Track

```
PIPELINE METRICS TO MONITOR:
──────────────────────────────────────────────────────────────

VOLUME METRICS:
  docs_discovered       ← How many source docs found
  docs_processed        ← How many successfully ingested
  docs_skipped          ← Already processed (idempotency)
  docs_failed           ← Errors during processing
  chunks_created        ← Total chunks in vector DB
  chunks_rejected       ← Failed quality gate

QUALITY METRICS:
  quality_score_overall ← 0-10 scale
  quality_score_*       ← Per dimension (completeness, etc.)
  stale_doc_count       ← Docs older than threshold
  duplicate_count       ← Duplicates detected

PERFORMANCE METRICS:
  pipeline_duration_sec ← Total run time
  docs_per_second       ← Throughput
  avg_chunk_size        ← Chunk quality indicator
  embedding_time_sec    ← Model inference time

COST METRICS (for cloud deployments):
  api_tokens_used       ← If using OpenAI embeddings
  api_cost_usd          ← Dollar cost per run
  storage_size_mb       ← Vector DB size growth
```

---

## 6. 🔔 Alerting Patterns

```python
# Enterprise teams get notified when things go wrong

def check_and_alert(run_log: dict):
    alerts = []

    # Alert: Too many failures
    failure_rate = run_log["docs_failed"] / run_log["docs_attempted"]
    if failure_rate > 0.05:    # > 5% failure rate
        alerts.append(f"🔴 HIGH failure rate: {failure_rate:.0%}")

    # Alert: Quality dropped
    if run_log["quality_score"] < 7.0:
        alerts.append(f"🔴 Quality score dropped: {run_log['quality_score']}/10")

    # Alert: Pipeline was unusually slow
    if run_log["duration_secs"] > 3600:   # > 1 hour
        alerts.append(f"⚠️ Pipeline slow: {run_log['duration_secs']/60:.0f} mins")

    # Alert: No new documents (could mean source system is down)
    if run_log["docs_processed"] == 0 and run_log["docs_skipped"] == 0:
        alerts.append("🔴 Zero documents processed — source may be offline!")

    for alert in alerts:
        print(f"ALERT: {alert}")
        # send_slack_message(alert)   # Real code would call Slack/Teams
        # send_email(alert)
```

---

## 7. 🌊 How Real Companies Do This at Scale

### Netflix's Document Pipeline
```
Scale: 100M+ documents, 24/7 real-time
Stack:
  Extract:   Apache Kafka streams (real-time events)
  Transform: Apache Flink (distributed stream processing)
  Embed:     Distributed GPU cluster (1000s of embeddings/sec)
  Load:      Vespa (their custom vector search engine)
  Monitor:   Atlas (internal observability platform)
Result:      Movie recommendations update in < 1 second after
             a user watches something!
```

### Google's Knowledge Base Pipeline
```
Scale: Billions of web pages + internal docs
Stack:
  Extract:   Googlebot (distributed web crawler)
  Transform: Vertex AI pipelines
  Embed:     Gemini embedding models (PaLM API)
  Load:      ScaNN (Google's billion-scale vector search)
  Monitor:   Google Cloud Monitoring
Result:      Google Search + NotebookLM + Bard all powered
             by variants of this pipeline!
```

### Your Pipeline After Level 0
```
Scale: 100s to 10,000s of documents (great start!)
Stack:
  Extract:   Custom connectors (Topic 3)
  Transform: Clean + Chunk + Embed (Topics 4-7)
  Load:      ChromaDB (Topic 8)
  Monitor:   JSON run logs (Topic 9)
  Quality:   6-dimension profiler (Topic 10)
Result:      A working RAG knowledge base ready for Level 1!
```

---

## 8. 🚀 Bridge to Level 1 — What Comes Next

After completing Level 0, you have everything you need for Level 1 (RAG):

```
LEVEL 0 OUTPUT → LEVEL 1 INPUT

Your Vector DB (ChromaDB with chunks + embeddings)
              ↓
LEVEL 1: RAG System

User asks: "How many days of sick leave do I get?"
              ↓
[Embed the question]
              ↓
[Search ChromaDB] ← YOUR Level 0 vector DB!
              ↓
[Retrieve top-3 chunks] ← YOUR Level 0 chunks!
              ↓
[Feed to LLM prompt]  ← NEW in Level 1
              ↓
LLM generates answer: "You are entitled to 10 days
of sick leave per year. Source: HR Policy v1.3, Page 1"
              ↓
USER GETS A TRUSTED, CITED, ACCURATE ANSWER ✅
```

**Level 1 Topics Preview:**
1. What is RAG and how does it work?
2. Building RAG with LangChain
3. Connecting to LLMs (OpenAI / Ollama / Gemini)
4. Prompt engineering for RAG
5. Evaluating RAG quality (RAGAS framework)
6. Advanced retrieval strategies
7. Conversational RAG with memory
8. Production RAG deployment

---

## 9. 💼 Interview Questions

**Q1: How would you design an enterprise data pipeline for 50,000 PDF documents?**
> Configuration-driven design with separate Extract, Transform, and Load phases. Use idempotency (content-hash tracking) to safely re-run. Process in batches of 100-500 documents. Add quality gates between phases. Log every run with full metrics. Use a managed vector DB (Pinecone/Qdrant) for scale. Schedule nightly via Apache Airflow with failure alerts to Slack.

**Q2: What are the 5 pillars of an enterprise-grade pipeline?**
> Reliability (handles failures gracefully, no data loss), Observability (full logging and alerting), Scalability (works from 10 to 10M documents), Maintainability (config-driven, modular, tested), Security (no secrets in code, PII masking, access control).

**Q3: A pipeline runs nightly and processes 1000 documents. How do you prevent re-processing documents that haven't changed?**
> Content-hash deduplication: compute MD5 of cleaned document text, store processed hashes in a registry file or database. On each run, skip any document whose hash already exists. This is the idempotency pattern — safe to run the same pipeline any number of times.

**Q4: What is "configuration-driven design" and why is it important?**
> All tunable parameters (chunk size, model name, thresholds, source paths) live in a config file, not in code. This means the same codebase can serve different projects, environments (dev/staging/prod), and configurations without any code changes — just swap the config file.

**Q5: How would you alert a team when a pipeline run fails?**
> Check key metrics after each run: failure rate > 5%, quality score < 7, duration > expected threshold, or zero documents processed. If any threshold breached, send alerts via Slack webhook, email, or PagerDuty. Log the full error details to a file for debugging.

---

## 10. 📝 Final Level 0 Quiz

**Q1:** Which combination of topics makes a complete enterprise AI data pipeline?
- A) Topics 1-3 only
- B) Topics 3, 4, 5, 6, 7, 8, 9, and 10 combined ✅
- C) Topics 7 and 8 only
- D) Topic 11 alone

**Q2:** What makes a pipeline "idempotent"?
- A) It runs very fast
- B) Running it multiple times produces the same result, no duplicates ✅
- C) It handles all file types
- D) It uses GPU acceleration

**Q3:** In a configuration-driven pipeline, where should chunk_size be defined?
- A) Hard-coded in the Python script
- B) In the vector database
- C) In a config file (JSON/YAML) ✅
- D) In the embedding model

**Q4:** What should trigger a pipeline alert?
- A) Every single pipeline run
- B) When failure rate > 5%, quality drops, or pipeline is unusually slow ✅
- C) Only when the database is full
- D) Never — pipelines should be silent

**Q5:** After Level 0, what major component is added in Level 1 to complete a RAG system?
- A) A better chunking algorithm
- B) An LLM that generates answers from retrieved chunks ✅
- C) A faster vector database
- D) A web scraper

---

## 🎯 LEVEL 0 — COMPLETE! 🎉

```
✅ Topic 1:  What is Data in AI?
✅ Topic 2:  Structured vs Unstructured Data
✅ Topic 3:  Data Sources (PDF, API, DB, Web)
✅ Topic 4:  Data Cleaning & Preprocessing
✅ Topic 5:  Chunking and Splitting
✅ Topic 6:  Metadata
✅ Topic 7:  Embeddings Basics
✅ Topic 8:  Vector Databases Basics
✅ Topic 9:  ETL Pipelines for AI
✅ Topic 10: Data Quality Issues
✅ Topic 11: Enterprise Data Pipelines   ← CAPSTONE COMPLETE!

██████████████████████████████████████████ 100%

🏆 LEVEL 0: DATA ACCESS AND PREPARATION — COMPLETE!
```

---

**NEXT → Level 1: RAG Basics**
*Where your data finally meets the AI!*
# 🎓 Gen AI Application Journey
## Level 1 — Topic 1: What is RAG?

> **Level:** 1 — RAG Basics | **Difficulty:** ⭐⭐ | **Code:** `01_what_is_rag.py`
> **Why This Matters:** RAG is the #1 technique used in production AI systems today!

---

## 🗺️ What You'll Learn

- What RAG is and why it was invented
- The problem RAG solves (LLM limitations)
- How RAG works step by step
- RAG vs Fine-tuning — when to use which
- The 7-step RAG lifecycle
- Real-world companies using RAG
- How your Level 0 work connects here

---

## 1. 🧠 The Problem — What LLMs Can't Do Alone

An LLM (like ChatGPT, Gemini, or Claude) is incredibly smart. It was trained on trillions of words from the internet.

**But it has 3 massive problems:**

```
PROBLEM 1: KNOWLEDGE CUTOFF
─────────────────────────────────────────────────────
LLM was trained on data up to October 2023.
User asks: "What is the new HR policy from March 2024?"
LLM:       "I don't have information about that." ❌
           (Or worse: it makes something up!)

PROBLEM 2: NO PRIVATE KNOWLEDGE
─────────────────────────────────────────────────────
LLM was trained on public internet data.
User asks: "What is ACME Corp's leave policy?"
LLM:       "I don't know ACME Corp's specific policies." ❌
           (It never saw your company's internal documents!)

PROBLEM 3: HALLUCINATION
─────────────────────────────────────────────────────
When the LLM doesn't know the answer, it sometimes
confidently invents a plausible-sounding one.
User asks: "What is our parental leave policy?"
LLM:       "Your company offers 12 weeks of leave." ← MADE UP! ❌
```

---

## 2. 💡 The Solution — RAG!

**RAG = Retrieval Augmented Generation**

Break the name down:
- **Retrieval** → Find relevant information from your own documents
- **Augmented** → Add that information to the AI's context
- **Generation** → Let the AI generate an answer using that context

```
RAG IN ONE SENTENCE:
"Instead of asking the AI to remember everything,
 give it the right documents JUST before it answers."

Think of it like an OPEN-BOOK EXAM:
  ┌──────────────────────────────────────────────────┐
  │  CLOSED BOOK (Regular LLM):                      │
  │  Student must memorise ALL facts.               │
  │  If they forgot → they make something up! ❌    │
  │                                                  │
  │  OPEN BOOK (RAG):                               │
  │  Student can look at the textbook while          │
  │  answering. They find the right page, read it,  │
  │  and give an accurate, cited answer. ✅          │
  └──────────────────────────────────────────────────┘
```

---

## 3. 🔄 The 7-Step RAG Lifecycle

```
RAG PIPELINE — COMPLETE FLOW
══════════════════════════════════════════════════════════

OFFLINE PHASE (runs once / periodically):
────────────────────────────────────────────────────────
STEP 1: LOAD
  Your company documents (PDFs, Word, DB, web)
  → All your Level 0 Topic 3 work!

STEP 2: SPLIT
  Break documents into chunks (300-1000 tokens each)
  → Your Level 0 Topic 5 chunking strategies!

STEP 3: EMBED
  Convert each chunk into a vector using embedding model
  → Your Level 0 Topic 7 embeddings work!

STEP 4: STORE
  Save vectors + text + metadata into Vector DB
  → Your Level 0 Topic 8 ChromaDB work!

═══════════════════════════════════════════════════════

ONLINE PHASE (runs for every user question):
────────────────────────────────────────────────────────
STEP 5: RETRIEVE
  User asks a question → embed the question →
  find top-K most similar chunks in Vector DB
  → Semantic search you built in Topic 8!

STEP 6: AUGMENT
  Build a prompt: "Use ONLY this context to answer:
  [chunk1] [chunk2] [chunk3]
  Question: [user's question]"

STEP 7: GENERATE
  Send the augmented prompt to the LLM →
  LLM reads the context and generates a grounded answer
  → NEW in Level 1!

══════════════════════════════════════════════════════
```

---

## 4. 🆚 RAG vs Fine-Tuning

This is one of the most common interview questions!

```
RAG vs FINE-TUNING — DECISION GUIDE
══════════════════════════════════════════════════════════

FINE-TUNING:
  What: Retrain the LLM on your specific data
  Cost: Very high ($100s to $1000s per training run)
  Time: Days to weeks
  Updates: Need to retrain every time data changes
  Best for: Teaching the model a NEW SKILL or STYLE
  Example: Teaching GPT to write in your company's tone

RAG:
  What: Give relevant docs to LLM at query time
  Cost: Cheap (just embedding + vector DB storage)
  Time: Hours to set up
  Updates: Just add new docs to the vector DB
  Best for: Keeping AI updated with CURRENT KNOWLEDGE
  Example: Answering questions from your HR policy docs

DECISION RULE:
  "Does the knowledge change frequently?" → RAG ✅
  "Do you need a new capability/skill?"  → Fine-tune ✅
  "Both?"                               → RAG + Fine-tune ✅

REAL EXAMPLES:
  ChatGPT plugins        → RAG (fetches live web data)
  GitHub Copilot         → Fine-tuned + RAG
  Enterprise HR bots     → RAG (company policy docs)
  Medical diagnosis AI   → Fine-tuned on medical literature
  Customer support bots  → RAG (product knowledge base)
```

---

## 5. 🏭 Real Companies Using RAG

```
COMPANY          PRODUCT                  RAG USE CASE
─────────────────────────────────────────────────────────────
Microsoft     Azure AI Search          Enterprise document Q&A
Google        NotebookLM               Upload your docs, ask questions
Salesforce    Einstein Copilot         CRM data + LLM answers
ServiceNow    Virtual Agent            IT helpdesk automation
Goldman Sachs Internal AI assistant    Financial policy Q&A
Klarna        Customer support bot     Product & policy retrieval
Notion        Notion AI                Q&A over your workspace
GitHub        Copilot Chat             Code + docs retrieval
```

---

## 6. 🧩 RAG System Components (What You'll Build)

```
COMPONENTS OF A RAG SYSTEM
═════════════════════════════════════════════════════════

1. DOCUMENT LOADER         (LangChain: DirectoryLoader, PyPDFLoader)
   └─ Reads files from disk / URL / S3

2. TEXT SPLITTER           (LangChain: RecursiveCharacterTextSplitter)
   └─ Chunks documents into sized pieces

3. EMBEDDING MODEL         (OpenAI / HuggingFace / Ollama)
   └─ Converts text to vectors

4. VECTOR STORE            (ChromaDB / Pinecone / Qdrant)
   └─ Stores and searches vectors

5. RETRIEVER               (LangChain: VectorStoreRetriever)
   └─ Searches vector store and returns top-K chunks

6. PROMPT TEMPLATE         (LangChain: ChatPromptTemplate)
   └─ Formats: "Context: {context}\nQuestion: {question}"

7. LLM                     (ChatOpenAI / Ollama / ChatGoogleGenerativeAI)
   └─ Reads context + question → generates answer

8. OUTPUT PARSER           (LangChain: StrOutputParser)
   └─ Extracts clean text from LLM response

PIPELINE (LCEL — LangChain Expression Language):
  retriever | prompt | llm | output_parser
  ← This single line powers the whole RAG system!
```

---

## 7. 📝 The RAG Prompt — The Secret Sauce

```
A RAG PROMPT LOOKS LIKE THIS:

┌──────────────────────────────────────────────────────────┐
│ SYSTEM:                                                  │
│ You are a helpful assistant. Answer ONLY using the       │
│ provided context. If the answer is not in the context,  │
│ say "I don't know — please check with HR directly."     │
│ Do NOT make up information.                             │
│                                                          │
│ CONTEXT (retrieved from vector DB):                      │
│ ---                                                      │
│ [Chunk 1]: Full-time employees are entitled to 20 days  │
│ of annual leave per year...                             │
│ ---                                                      │
│ [Chunk 2]: Sick leave: 10 days per year. Medical cert   │
│ required after 3 consecutive days...                    │
│ ---                                                      │
│                                                          │
│ USER QUESTION: How many sick days do I get?             │
└──────────────────────────────────────────────────────────┘

LLM ANSWER:
"You are entitled to 10 days of sick leave per year.
 A medical certificate is required if you are absent
 for more than 3 consecutive working days."

WHY THIS WORKS:
→ The LLM has the EXACT answer in its context
→ The instruction "ONLY use context" prevents hallucination
→ The fallback "I don't know" prevents made-up answers
```

---

## 8. ❌ Common Beginner Mistakes

| Mistake | Problem | Fix |
|---|---|---|
| No system prompt instruction | LLM ignores context and uses training data | Always add "Answer ONLY using the context" |
| Retrieving too few chunks (k=1) | Answer may miss important details | Use k=3 to k=5 as default |
| Retrieving too many chunks (k=20) | Context too large, LLM loses focus | Keep context under 3000 tokens |
| No fallback instruction | LLM hallucinations when context is poor | Add "If not in context, say I don't know" |
| Not storing metadata | Can't cite sources in answers | Always include source + page in metadata |
| Same embedding model bug | Using different models for index vs query | Always use identical model for both |

---

## 9. ✅ Best Practices

```
✅ Always use a system prompt that constrains the LLM to the context
✅ Retrieve k=3 to k=5 chunks as your default
✅ Include source citation in every answer (build trust)
✅ Test with adversarial questions (questions NOT in your docs)
✅ Monitor hallucination rate using an evaluation framework
✅ Use metadata filtering to narrow retrieval scope
✅ Chunk with overlap so context isn't lost at boundaries
✅ Log every query + answer + retrieved chunks for debugging
```

---

## 10. 💼 Interview Questions

**Q1: What does RAG stand for and what problem does it solve?**
> Retrieval Augmented Generation. It solves 3 LLM limitations: knowledge cutoff (LLMs don't know recent events), no private knowledge (LLMs weren't trained on company documents), and hallucination (LLMs make up answers when they don't know).

**Q2: Explain the RAG pipeline in simple terms.**
> Offline: Load documents → Split into chunks → Create embeddings → Store in vector DB. Online: User asks question → Embed question → Find similar chunks → Build prompt with chunks as context → LLM generates answer from context.

**Q3: When would you choose RAG over fine-tuning?**
> RAG when: knowledge changes frequently (policies, prices, docs), you need source citations, you have a large and changing knowledge base, or budget is limited. Fine-tune when: you need the model to learn a new skill, style, or reasoning pattern that isn't just about knowledge.

**Q4: What instruction must you include in the RAG system prompt to prevent hallucination?**
> "Answer ONLY using the provided context. If the answer is not found in the context, say 'I don't know' or direct the user to the appropriate team. Do NOT make up information."

**Q5: What is the "augmented" part of RAG?**
> Augmentation is the process of building the prompt that combines the retrieved context chunks with the user's question before sending it to the LLM. The LLM's input is "augmented" with real, relevant information from your knowledge base.

---

## 11. 📝 Quiz

**Q1:** What does RAG stand for?
- A) Random Access Generation
- B) Retrieval Augmented Generation ✅
- C) Recursive AI Generation
- D) Reliable Answer Generation

**Q2:** Which LLM problem does RAG primarily solve?
- A) Slow inference speed
- B) High API cost
- C) Knowledge cutoff and lack of private knowledge ✅
- D) Poor grammar

**Q3:** In the RAG pipeline, what happens IMMEDIATELY before the LLM generates an answer?
- A) Document loading
- B) Chunking
- C) Augmenting the prompt with retrieved context ✅
- D) Storing in vector DB

**Q4:** What should the RAG system prompt say to prevent hallucination?
- A) "Be creative and helpful"
- B) "Answer ONLY using the provided context" ✅
- C) "Use your training data to answer"
- D) "Search the internet for information"

**Q5:** You need to build an HR policy Q&A bot that must reflect real-time policy updates. Should you use RAG or Fine-tuning?
- A) Fine-tuning — for better accuracy
- B) RAG — because policies change frequently ✅
- C) Neither — use keyword search
- D) Both equally apply

---

## 🎯 Level 1 Progress

```
Level 1 — RAG Basics
══════════════════════════════════════════
✅ Topic 1: What is RAG?            ← YOU ARE HERE
⬜ Topic 2: Building RAG with LangChain
⬜ Topic 3: Connecting to LLMs
⬜ Topic 4: Prompt Engineering for RAG
⬜ Topic 5: Evaluating RAG Quality
⬜ Topic 6: Advanced Retrieval
⬜ Topic 7: Conversational RAG
⬜ Topic 8: Production RAG Deployment
```

---
*End of Level 1 Topic 1 🎉 | Next: Topic 2 — Building RAG with LangChain →*
# 🎓 Gen AI Application Journey
## Level 1 — Topic 2: Building RAG with LangChain

> **Level:** 1 — RAG Basics | **Difficulty:** ⭐⭐⭐ | **Code:** `02_rag_with_langchain.py`
> **Why This Matters:** LangChain is the #1 framework used to build RAG in production!

---

## 🗺️ What You'll Learn

- What LangChain is and why it exists
- LangChain's core building blocks (the LCEL pipeline)
- Building a complete RAG system step by step
- Connecting to Ollama (free, local LLM — no API key!)
- Connecting to OpenAI (cloud LLM — optional)
- Document loaders, text splitters, vector stores in LangChain
- The | pipe operator — LangChain's secret weapon

---

## 1. 🧠 What is LangChain?

LangChain is a Python framework that makes building LLM applications fast and modular.

**Without LangChain:** You write 200+ lines of custom code to connect loaders → splitters → embeddings → vector DBs → LLMs → output parsers.

**With LangChain:** You write one pipeline in ~20 lines:

```python
chain = retriever | prompt | llm | output_parser
answer = chain.invoke("How many sick days do I get?")
```

That single line above IS a complete RAG system!

---

## 2. 🧩 LangChain Core Building Blocks

```
LANGCHAIN COMPONENTS — THE LEGO PIECES OF RAG
══════════════════════════════════════════════════════

📄 DOCUMENT LOADERS
   Read raw files from any source
   ├── PyPDFLoader        → PDF files
   ├── DirectoryLoader    → All files in a folder
   ├── WebBaseLoader      → Web pages
   ├── CSVLoader          → CSV files
   └── TextLoader         → Plain text files

✂️  TEXT SPLITTERS
   Break documents into chunks
   ├── RecursiveCharacterTextSplitter  ← Most common!
   ├── CharacterTextSplitter
   ├── TokenTextSplitter
   └── MarkdownHeaderTextSplitter

🔢 EMBEDDING MODELS
   Convert text to vectors
   ├── OpenAIEmbeddings          → Best quality (paid)
   ├── OllamaEmbeddings          → Free, local
   └── HuggingFaceEmbeddings     → Free, local

🗄️  VECTOR STORES
   Store and search vectors
   ├── Chroma    → Local, easy (what we use!)
   ├── FAISS     → Fast, in-memory
   ├── Pinecone  → Cloud, enterprise
   └── Qdrant    → Open source, production

🔍 RETRIEVERS
   Fetch relevant chunks for a query
   └── VectorStoreRetriever (built into vector stores)

💬 LLMs / CHAT MODELS
   Generate answers
   ├── ChatOllama    → Free, runs locally (Llama, Mistral)
   ├── ChatOpenAI    → GPT-3.5 / GPT-4
   └── ChatGoogleGenerativeAI → Gemini

📝 PROMPT TEMPLATES
   Format the prompt sent to the LLM
   └── ChatPromptTemplate

📤 OUTPUT PARSERS
   Extract clean text from LLM response
   └── StrOutputParser
```

---

## 3. 🔗 LCEL — LangChain Expression Language

The `|` pipe operator chains components together like a Unix pipeline:

```python
# UNIX pipeline:
cat file.txt | grep "error" | sort | uniq

# LangChain pipeline (LCEL):
chain = retriever | prompt_builder | llm | output_parser

# Each component:
#   retriever     → takes a string query, returns list of Documents
#   prompt_builder→ takes {context, question}, returns prompt
#   llm           → takes prompt, returns AI message
#   output_parser → takes AI message, returns clean string
```

### How Data Flows Through the Chain

```
USER QUESTION: "How many sick days do I get?"
      │
      ▼
 [RETRIEVER]
  query → vector DB search → top-3 chunks returned
      │
      ▼
 [PROMPT BUILDER]
  {context: chunk1+chunk2+chunk3, question: "..."} → formatted prompt
      │
      ▼
 [LLM]
  prompt → "You are entitled to 10 days of sick leave..."
      │
      ▼
 [OUTPUT PARSER]
  AIMessage → "You are entitled to 10 days of sick leave..."
      │
      ▼
 FINAL ANSWER (clean string, ready to show user)
```

---

## 4. 🦙 Ollama — Free Local LLMs (No API Key Needed!)

Ollama lets you run powerful LLMs on your own computer for FREE.

### Install Ollama
```bash
# Download from: https://ollama.com/download
# Then pull a model:
ollama pull llama3.2        # 2GB — fast, great for RAG
ollama pull mistral         # 4GB — very capable
ollama pull phi3            # 2GB — Microsoft's small model
ollama pull gemma2          # 5GB — Google's model

# Test it works:
ollama run llama3.2 "What is RAG in AI?"
```

### Use Ollama in LangChain
```python
from langchain_ollama import ChatOllama, OllamaEmbeddings

llm       = ChatOllama(model="llama3.2", temperature=0)
embedder  = OllamaEmbeddings(model="nomic-embed-text")
```

### Why temperature=0?
```
temperature=0.0  → Deterministic. Always picks most likely token.
                   Best for: factual Q&A, RAG (we want accuracy!)

temperature=0.7  → Creative. Adds randomness.
                   Best for: writing, brainstorming

temperature=1.0  → Very creative / unpredictable.
                   Best for: story generation

RULE FOR RAG: Always use temperature=0 or 0.1
              You want accurate facts, not creative fiction!
```

---

## 5. 🏗️ Complete RAG System — Step by Step

### Step 1: Install Dependencies
```bash
pip install langchain langchain-community langchain-chroma
pip install langchain-ollama           # For Ollama (free local)
pip install langchain-openai           # For OpenAI (optional)
pip install pypdf sentence-transformers chromadb
```

### Step 2: Load Documents
```python
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader

# Load a single PDF
loader = PyPDFLoader("hr_policy.pdf")
docs   = loader.load()

# Load all PDFs from a folder
loader = DirectoryLoader("./docs/", glob="**/*.pdf",
                          loader_cls=PyPDFLoader)
docs   = loader.load()

print(f"Loaded {len(docs)} pages")
# Each doc has: doc.page_content (text) + doc.metadata (source, page)
```

### Step 3: Split into Chunks
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size    = 1000,   # characters per chunk
    chunk_overlap = 200,    # overlap between chunks
    separators    = ["\n\n", "\n", ". ", " ", ""],
)
chunks = splitter.split_documents(docs)
print(f"Split into {len(chunks)} chunks")
```

### Step 4: Create Embeddings + Vector Store
```python
from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

embedder = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Create vector store and index all chunks
vectordb = Chroma.from_documents(
    documents         = chunks,
    embedding         = embedder,
    persist_directory = "./chroma_db",
    collection_name   = "hr_policies",
)
print(f"Indexed {vectordb._collection.count()} chunks")
```

### Step 5: Create Retriever
```python
retriever = vectordb.as_retriever(
    search_type = "similarity",
    search_kwargs = {"k": 3}   # Return top-3 most similar chunks
)
```

### Step 6: Build the Prompt Template
```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("""
You are a helpful HR policy assistant for ACME Corporation.
Answer the question using ONLY the context provided below.
If the answer is not in the context, say:
"I don't have that information. Please contact HR directly."
Do NOT make up information. Always be concise and accurate.

CONTEXT:
{context}

QUESTION: {question}

ANSWER:""")
```

### Step 7: Assemble the RAG Chain
```python
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

llm    = ChatOllama(model="llama3.2", temperature=0)
parser = StrOutputParser()

def format_docs(docs):
    return "\n\n---\n\n".join(
        f"[{d.metadata.get('source','?')} p.{d.metadata.get('page','?')}]\n{d.page_content}"
        for d in docs
    )

chain = (
    {"context": retriever | format_docs,
     "question": RunnablePassthrough()}
    | prompt
    | llm
    | parser
)

# Use it!
answer = chain.invoke("How many sick days do I get?")
print(answer)
```

---

## 6. 🌊 The Full RAG Chain Explained

```python
chain = (
    {
        "context" : retriever | format_docs,  # ← Retrieves + formats chunks
        "question": RunnablePassthrough()      # ← Passes question through unchanged
    }
    | prompt    # ← Combines context + question into a formatted prompt
    | llm       # ← LLM reads prompt and generates answer
    | parser    # ← Extracts clean string from LLM response
)
```

**Data flow when you call `chain.invoke("How many sick days?")`:**

```
"How many sick days?"
    │
    ├─► retriever    → [chunk1, chunk2, chunk3]
    │   format_docs  → "chunk1 text\n---\nchunk2 text\n---\nchunk3 text"
    │
    │   RunnablePassthrough → "How many sick days?"
    │
    ▼
    prompt → "You are an HR assistant. Context: chunk1... Question: How many sick days?"
    │
    ▼
    llm → AIMessage(content="Sick leave is capped at 10 days per year...")
    │
    ▼
    parser → "Sick leave is capped at 10 days per year..."
```

---

## 7. ❌ Common Beginner Mistakes

| Mistake | Problem | Fix |
|---|---|---|
| `temperature=1` in RAG | LLM gets creative and invents facts | Use `temperature=0` |
| Forgetting `persist_directory` | Vector DB lost on restart | Always pass `persist_directory` |
| `chunk_size` too small (< 200) | Context is too fragmented | Use 500-1000 for most cases |
| `chunk_size` too large (> 2000) | Exceeds embedding model limit | Keep under 512 tokens (~380 words) |
| No `chunk_overlap` | Context cut off at chunk boundaries | Use 10-20% of chunk_size as overlap |
| Not calling `format_docs` | LLM receives Python object, not string | Always format docs to readable string |

---

## 8. ✅ Best Practices

```
✅ Use temperature=0 for factual RAG
✅ Use RecursiveCharacterTextSplitter as your default splitter
✅ Set chunk_overlap to ~20% of chunk_size
✅ Always persist your vector store (PersistentClient / persist_directory)
✅ Use get_or_create to safely restart without re-indexing
✅ Format retrieved docs clearly with source citations
✅ Test with questions NOT in your docs (expect "I don't know")
✅ Log every query + retrieved chunks for debugging
✅ Start with k=3. Increase if answers feel incomplete.
```

---

## 9. 💼 Interview Questions

**Q1: What is LangChain and why is it used for RAG?**
> LangChain is a Python framework for building LLM applications. It provides pre-built, composable components (loaders, splitters, embedders, vector stores, LLMs, parsers) that connect together using the `|` pipe operator (LCEL). It eliminates hundreds of lines of boilerplate code needed to build RAG from scratch.

**Q2: What does `RunnablePassthrough()` do in a LangChain chain?**
> It passes its input through unchanged to the next component. In a RAG chain, it ensures the user's question reaches the prompt template unchanged, while the retriever processes the same question in parallel to fetch context.

**Q3: Why use `temperature=0` for RAG?**
> Temperature controls how creative/random the LLM's output is. In RAG, we want accurate, factual answers grounded in the retrieved context — not creative variations. `temperature=0` makes the LLM always pick the most probable (most factual) next token.

**Q4: What is `chunk_overlap` and why is it important?**
> Chunk overlap means consecutive chunks share some text (e.g., last 200 characters of chunk 1 appear at the start of chunk 2). This prevents important information from being cut off exactly at a chunk boundary and lost from the LLM's context.

**Q5: How does `Chroma.from_documents()` differ from `Chroma()`?**
> `from_documents()` creates a NEW collection, embeds all provided documents, and stores them. `Chroma()` connects to an EXISTING collection (no re-embedding). Use `from_documents()` for initial indexing; use `Chroma()` (with persist_directory) for subsequent queries.

---

## 10. 📝 Quiz

**Q1:** What does the `|` operator do in LangChain (LCEL)?
- A) Bitwise OR operation
- B) Chains components so output of one becomes input of next ✅
- C) Runs components in parallel
- D) Creates a new collection

**Q2:** Which LangChain component converts the LLM's AIMessage into a plain string?
- A) ChatPromptTemplate
- B) RunnablePassthrough
- C) StrOutputParser ✅
- D) VectorStoreRetriever

**Q3:** What `temperature` value should you use for factual RAG?
- A) 1.0
- B) 0.7
- C) 0.0 ✅
- D) 2.0

**Q4:** Which text splitter is recommended as the default for most documents?
- A) CharacterTextSplitter
- B) TokenTextSplitter
- C) RecursiveCharacterTextSplitter ✅
- D) MarkdownHeaderTextSplitter

**Q5:** Ollama is used for:
- A) Storing vectors locally
- B) Running LLMs locally for free ✅
- C) Web scraping
- D) PDF parsing

---

## 🎯 Level 1 Progress

```
Level 1 — RAG Basics
══════════════════════════════════════════
✅ Topic 1: What is RAG?
✅ Topic 2: Building RAG with LangChain  ← YOU ARE HERE
⬜ Topic 3: Connecting to LLMs
⬜ Topic 4: Prompt Engineering for RAG
⬜ Topic 5: Evaluating RAG Quality
```

---
*End of Topic 2 🎉 | Next: Topic 3 — Connecting to LLMs →*
