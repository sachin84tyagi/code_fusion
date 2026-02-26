# Phase 2: Python for AI - Step 3 (Professional Setup)

You have the skills (NumPy, Pandas, JSON/CSV). Now you need the **Professional Environment**. In AI Engineering, we don't just "install things globally." We use isolation.

---

## 1. Virtual Environments (The Playground)
Imagine you are a Chef (Engineer). You have two different restaurants. 
- Restaurant A needs **Python 3.10** and **Old NumPy**.
- Restaurant B needs **Python 3.12** and **New NumPy**.

If you install them normally, they will fight! A **Virtual Environment (venv)** gives you a private, isolated "mini-Python" for every project.

**The Workflow:**
1. **Create:** `python -m venv venv`
2. **Activate:** `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
3. **Install:** `pip install transformers` (Only happens inside this folder!)

## 2. Jupyter Notebooks (The Lab)
If `.py` scripts are for production, **Jupyter Notebooks** are for experimentation.
- They allow you to run code one "cell" at a time.
- You can see charts, images, and AI outputs immediately without re-running everything.
- **AI Fact:** 99% of AI research and data cleaning happens in Jupyter.

---

## 3. The Coding Exercise (Verify Setup)

We will write a script that checks if you are in a virtual environment and if Jupyter is ready to go.

#### Step 1: Install Jupyter
Run this in your terminal:
```bash
pip install jupyter
```

#### Step 2: The "Setup Checker" script
Create a file named `check_setup.py` inside your `Phase2` folder:

```python
import sys
import os

def check_env():
    print("--- AI Environment Report ---")
    
    # 1. Check for Virtual Environment
    # If sys.prefix == sys.base_prefix, you are and NOT in a venv.
    in_venv = sys.prefix != sys.base_prefix
    
    if in_venv:
        print("✅ Status: PROTECTED (Inside Virtual Environment)")
        print(f"   Path: {sys.prefix}")
    else:
        print("⚠️  Status: GLOBAL (No Venv detected. This is risky for AI!)")

    # 2. Check for installed tools
    try:
        import numpy as np
        print(f"✅ NumPy: Found (v{np.__version__})")
    except ImportError:
        print("❌ NumPy: NOT FOUND")

    try:
        import pandas as pd
        print(f"✅ Pandas: Found (v{pd.__version__})")
    except ImportError:
        print("❌ Pandas: NOT FOUND")

    print("\nNext Action: To start your 'Lab', type 'jupyter notebook' in terminal.")

if __name__ == "__main__":
    check_env()
```

---

## 4. Why this matters (Job Insight)
When you join a team, the first thing they will give you is a `requirements.txt` file. You will create a **Venv**, install those requirements, and use **Jupyter** to explore the dataset before writing any production code. This is the mark of a Senior AI Engineer.

---
**Summary:**
- **Venv:** Protects your computer from library conflicts.
- **Jupyter:** The standard tool for AI research and data exploration.

**Phase 2 is now COMPLETE!** Next, we move to **Phase 3: Using LLM APIs**. This is where we start building real apps! 🚀
