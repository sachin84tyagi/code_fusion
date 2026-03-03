# Phase 6: LLM Engineering (Real Systems) - Step 6 (Final Project: AI SQL Query Generator)

Congratulations! You've reached the graduation project for Phase 6. 

In this project, you will build a **Text-to-SQL Engine**. This is a classic "AI Agent" task where the AI translates natural language ("Who are the top 5 customers?") into valid code (SQL) and then executes it against a database to give the user a real answer.

---

## 1. Project Requirements
Your generator must demonstrate "Real-World Engineering":
1.  **Schema Grounding:** Telling the AI exactly what columns and tables exist so it doesn't "guess."
2.  **Safety Checks:** Ensuring the AI doesn't generate `DELETE` or `DROP` commands.
3.  **Result Formatting:** Taking the raw data from the database and turning it into a human-friendly sentence.

---

## 2. The Coding Project (Hands-on)

#### Step 1: The SQL Generator script
Create a file named `sql_generator.py` inside your `Phase6` folder:

```python
import sqlite3

# 1. Setup a dummy database for testing
def setup_db():
    conn = sqlite3.connect(":memory:") # Temp database in RAM
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE Sales (id INT, product TEXT, price FLOAT, quantity INT)")
    cursor.execute("INSERT INTO Sales VALUES (1, 'Laptop', 1200, 5), (2, 'Mouse', 25, 50), (3, 'Monitor', 300, 10)")
    conn.commit()
    return conn

# 2. SCHEMA GROUNDING (The 'Instruction Manual' for the AI)
SCHEMA = """
Table: Sales
Columns: id, product (text), price (float), quantity (int)
"""

def generate_sql(user_query):
    # In a real app, this would be an OpenAI call.
    # We are simulating the 'Reasoning' here.
    print(f"\n[USER]: {user_query}")
    
    # AI logic (Simulation)
    if "total" in user_query.lower() and "sales" in user_query.lower():
        sql = "SELECT SUM(price * quantity) FROM Sales"
    elif "list" in user_query.lower():
        sql = "SELECT product FROM Sales"
    else:
        sql = "SELECT * FROM Sales LIMIT 5"

    # SAFETY CHECK
    if "DELETE" in sql.upper() or "DROP" in sql.upper():
        return None, "Blocked: Dangerous query detected!"

    return sql, None

def run_query(sql, conn):
    print(f"🤖 AI Generated SQL: {sql}")
    cursor = conn.cursor()
    cursor.execute(sql)
    results = cursor.fetchall()
    return results

# --- EXECUTION ---
db_connection = setup_db()

# Test Case 1
query = "What are the total sales across all products?"
sql, error = generate_sql(query)
if not error:
    results = run_query(sql, db_connection)
    print(f"✅ FINAL ANSWER: The total revenue is ${results[0][0]}.")

# Test Case 2
query = "List all products."
sql, error = generate_sql(query)
if not error:
    results = run_query(sql, db_connection)
    print(f"✅ FINAL ANSWER: Our products are: {', '.join([r[0] for r in results])}.")
```

---

## 3. Graduation Insight
You have built a bridge between **Natural Language** and a **Structured Database**. 
- You didn't just "chat" with the AI.
- You used the AI as a **Compiler** to write code.
- You added a **Safety Layer** to protect your data.

This is exactly how companies like **Tableau**, **Looker**, and **Notion** build their "Talk to your data" features.

**Phase 6 is now officially COMPLETE!** 🚀🎓

Next, we move to the final frontier: **Phase 7: Fine-tuning + LoRA**. We'll learn how to actually "train" a model to learn your specific tone of voice or complex logic! 🧠🔥
