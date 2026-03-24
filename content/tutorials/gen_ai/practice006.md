```python
import json
import os
import sys
from typing import List, Dict
from openai import OpenAI
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from rich.live import Live
from rich.prompt import Prompt

# Initialize Rich Console
console = Console()

# ⚙️ 1. Create Client
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

# 🧠 Memory Settings
HISTORY_FILE = "chat_history.json"

# 🎭 Personas
PERSONAS = {
    "1": {"name": "Helpful Assistant", "prompt": "You are a helpful and concise assistant."},
    "2": {"name": "Expert Software Engineer", "prompt": "You are a senior principal software engineer. You provide elegant, production-ready code with excellent explanations."},
    "3": {"name": "Sarcastic AI", "prompt": "You are a highly intelligent but extremely sarcastic AI. You answer correctly but with a lot of sass."}
}

def load_memory() -> List[Dict[str, str]]:
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list) and len(data) > 0:
                    return data
        except Exception:
            console.print("[yellow]Warning: chat_history.json could not be loaded. Starting fresh.[/yellow]")
    return []

def save_memory(msg_list: List[Dict[str, str]]):
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(msg_list, f, indent=4)

def select_persona() -> str:
    console.print(Panel.fit("[bold cyan]Select an AI Persona[/bold cyan]"))
    for key, val in PERSONAS.items():
        console.print(f"[{key}] {val['name']}")
    
    choice = Prompt.ask("Enter number", choices=list(PERSONAS.keys()) + ["skip"], default="1")
    if choice == "skip":
        return PERSONAS["1"]["prompt"]
    return PERSONAS[choice]["prompt"]

# Startup
console.print(Panel("[bold green]--- AI Chatbot V06 Started ---[/bold green]\nType [bold red]'quit'[/bold red] to exit. Use [bold yellow]'/clear'[/bold yellow] to wipe memory."))

messages: List[Dict[str, str]] = load_memory()

# Set up persona if memory is empty
if len(messages) == 0:
    sys_prompt = select_persona()
    messages.append({"role": "system", "content": sys_prompt})
    save_memory(messages)
    console.print(f"\n[dim]Persona set. Chat started![/dim]\n")
else:
    console.print(f"\n[dim]Loaded {len(messages)} messages from history.[/dim]\n")

while True:
    try:
        user_input = Prompt.ask("\n[bold blue]You[/bold blue]")
        user_input = user_input.strip()

        if user_input.lower() == "quit":
            console.print("[bold red]Goodbye![/bold red]")
            break
            
        if user_input.lower() == "/clear":
            messages = []
            sys_prompt = select_persona()
            messages.append({"role": "system", "content": sys_prompt})
            save_memory(messages)
            console.print("[bold green]Memory cleared![/bold green]")
            continue

        if not user_input:
            continue

        messages.append({"role": "user", "content": user_input})
        save_memory(messages)

        stream = client.chat.completions.create(
            model="llama3.2:1b",
            messages=messages,
            stream=True
        )

        full_reply: str = ""
        
        console.print("\n[bold magenta]AI:[/bold magenta]")
        with Live(Markdown(""), refresh_per_second=15) as live:
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    content: str = chunk.choices[0].delta.content
                    full_reply += content
                    # Render as Markdown in real-time
                    live.update(Markdown(full_reply))

        messages.append({"role": "assistant", "content": full_reply})
        save_memory(messages)

    except KeyboardInterrupt:
        console.print("\n[bold red]Goodbye![/bold red]")
        break
    except Exception as e:
        console.print(f"\n[bold red]Error:[/bold red] {e}")
        break
```