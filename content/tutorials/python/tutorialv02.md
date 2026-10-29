
# ============================================================
# PYTHON CONCEPTS MASTER PRACTICE
# Python 3.10+
#
# Goal:
# Python ke important concepts ko ek readable program mein
# samajhna, especially woh syntax jo JS/PHP se different hai.
#
# Tip:
# Har section ko independently run karke output observe karo.
# ============================================================

from __future__ import annotations

import asyncio
import copy
import json
import math
import tempfile

from collections import Counter, defaultdict, namedtuple
from contextlib import contextmanager
from dataclasses import dataclass, field
from functools import wraps, lru_cache, partial
from itertools import chain, islice, product
from pathlib import Path
from typing import (
    Any,
    Callable,
    Generic,
    Iterator,
    Protocol,
    TypeVar,
    TypedDict,
)


# ============================================================
# 1. TUPLE, UNPACKING AND STAR UNPACKING
# ============================================================

# Tuple ek ordered collection hai jiske existing elements
# ko directly replace nahi kar sakte.
# JS array mutable hota hai; Object.freeze() bhi tuple ka
# exact equivalent nahi hai.

student = ("Rahul", 25, 85)

# Unpacking: ek sequence ki values ko multiple variables mein
# ek hi statement mein assign karna.
name, age, marks = student

print(name, age, marks)

# *middle remaining values ko list mein collect karta hai.
first, *middle, last = [10, 20, 30, 40, 50]

print(first)   # 10
print(middle)  # [20, 30, 40]
print(last)    # 50

# Function call mein * aur ** collections ko arguments mein unpack
# karte hain. Yeh assignment wale unpacking se related feature hai.

def introduce(name, age, city):
    print(f"{name}, {age}, {city}")

details = ["Rahul", 25, "Delhi"]
introduce(*details)

details_by_name = {
    "name": "Neha",
    "age": 28,
    "city": "Noida",
}

introduce(**details_by_name)


# ============================================================
# 2. DICTIONARY, SET AND COLLECTION OPERATIONS
# ============================================================

# Dictionary key-value data rakhti hai.
# .get() missing key par KeyError ke badle default value deta hai.

profile = {"name": "Rahul", "marks": 85}

print(profile.get("city", "Unknown"))

# Dictionary comprehension: key-value pairs se nayi dictionary.
scores = {"Rahul": 85, "Neha": 92, "Aman": 70}

passed = {
    name: score
    for name, score in scores.items()
    if score >= 75
}

print(passed)

# Set unique elements rakhta hai.
# Set ka iteration order guaranteed nahi hai.

python_skills = {"Python", "SQL", "Git"}
backend_skills = {"Python", "Node.js", "SQL"}

print(python_skills | backend_skills)  # Union
print(python_skills & backend_skills)  # Intersection
print(python_skills - backend_skills)  # Difference

# Set membership checking ke liye useful hai.
print("Python" in python_skills)


# ============================================================
# 3. SLICING AND COMPREHENSIONS
# ============================================================

numbers = [10, 20, 30, 40, 50, 60]

# Syntax: sequence[start:stop:step]
# stop index include nahi hota.
# Python negative indexes aur negative steps support karta hai.

print(numbers[1:4])   # [20, 30, 40]
print(numbers[::2])  # Har doosra element
print(numbers[::-1]) # Reverse copy

# List comprehension ek concise list creation syntax hai.
# JS map/filter ki tarah kaam kar sakti hai, lekin Python
# mein condition aur transformation ek expression mein aa sakte hain.

squares = [n * n for n in numbers]
large_numbers = [n for n in numbers if n >= 40]

print(squares)
print(large_numbers)

# Nested comprehension: pehle row, phir column.
matrix = [[1, 2], [3, 4], [5, 6]]

flattened = [value for row in matrix for value in row]

print(flattened)

# Generator expression list comprehension jaisa hai,
# lekin poori list ek saath banane ke bajay values lazily deta hai.
# Large input par memory bachane mein useful ho sakta hai.

total = sum(n * n for n in range(1, 6))
print(total)


# ============================================================
# 4. ENUMERATE, ZIP, SORTED, ANY AND ALL
# ============================================================

subjects = ["Python", "SQL", "Git"]

# enumerate() index aur value dono deta hai.
for index, subject in enumerate(subjects, start=1):
    print(index, subject)

names = ["Rahul", "Neha", "Aman"]
marks_list = [85, 92, 70]

# zip() corresponding values ko combine karta hai.
# Default behaviour mein shortest input par rukta hai.

for student_name, score in zip(names, marks_list):
    print(f"{student_name}: {score}")

# sorted() nayi sorted list deta hai; original list ko nahi badalta.
# key= sorting ke liye use hone wali value define karta hai.

ranked = sorted(
    zip(names, marks_list),
    key=lambda item: item[1],
    reverse=True,
)

print(ranked)

# any(): kam se kam ek condition True?
# all(): har condition True?
print(any(score < 50 for score in marks_list))
print(all(score >= 50 for score in marks_list))


# ============================================================
# 5. STRINGS: F-STRINGS AND USEFUL METHODS
# ============================================================

name = "  Rahul Sharma  "

# Strings immutable hoti hain: methods aam taur par naya string
# return karte hain, existing string ko modify nahi karte.

clean_name = name.strip()

print(clean_name)
print(clean_name.lower())
print(clean_name.upper())
print(clean_name.replace("Sharma", "Kumar"))

marks = 85.456

# f-string interpolation aur formatting support karti hai.
print(f"{clean_name} scored {marks:.2f}")

# !r value ka representation dikhata hai, debugging mein useful.
print(f"Name representation: {clean_name!r}")


# ============================================================
# 6. *ARGS, **KWARGS AND KEYWORD-ONLY ARGUMENTS
# ============================================================

# *args extra positional arguments ko tuple mein collect karta hai.
# **kwargs extra named arguments ko dictionary mein collect karta hai.
# JavaScript rest parameters (...) se related concept hai.

def show_details(*args, **kwargs):
    print("Positional arguments:", args)
    print("Named arguments:", kwargs)

show_details("Developer", "Python", level="Beginner", active=True)

# * ke baad wale parameters keyword-only hote hain.
# Isse function call clear hoti hai aur galat positional arguments
# pass karne ka risk kam hota hai.

def create_student(name, *, age, marks=0):
    return {
        "name": name,
        "age": age,
        "marks": marks,
    }

print(create_student("Rahul", age=25, marks=85))

# / se pehle ke parameters positional-only ban sakte hain.
# Yeh advanced function signature feature hai.

def multiply(a, b, /):
    return a * b

print(multiply(4, 5))


# ============================================================
# 7. ARGUMENT DEFAULTS AND MUTABLE DEFAULT TRAP
# ============================================================

# IMPORTANT:
# Mutable list/dictionary ko default argument banana risky hai.
# Default object function definition ke waqt ek baar banta hai.

def add_bad(item, items=[]):
    items.append(item)
    return items

# Dono calls ek hi default list ko share karti hain.
print(add_bad("Python"))
print(add_bad("SQL"))  # Pehle wala Python bhi rahega!

# Correct pattern: None default do, call ke andar nayi list banao.

def add_good(item, items=None):
    if items is None:
        items = []

    items.append(item)
    return items

print(add_good("Python"))
print(add_good("SQL"))


# ============================================================
# 8. CLOSURES
# ============================================================

# Closure inner function ko outer function ke variables yaad
# rakhne deta hai, chahe outer function return kar chuka ho.
# JS closures ka similar concept hai.

def make_multiplier(factor):
    def multiply(value):
        return value * factor

    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(10))
print(triple(10))

# Inner function factor ko remember karta hai.
# Har call ke liye alag closure ban sakta hai.


# ============================================================
# 9. DECORATORS
# ============================================================

# Decorator ek function ya class ko wrap karke uska behaviour
# extend karta hai. Python mein @ syntax decorator apply karta hai.
# JS mein higher-order functions se similar patterns bana sakte ho.

def log_call(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        print(f"Calling {function.__name__}")
        result = function(*args, **kwargs)
        print("Call finished")
        return result

    return wrapper

@log_call
def calculate_total(price, quantity):
    return price * quantity

print(calculate_total(100, 3))

# @wraps original function ka naam aur documentation metadata
# preserve karne mein help karta hai.
# Decorators logging, timing, permissions aur caching mein useful hain.


# ============================================================
# 10. LRU CACHE
# ============================================================

# @lru_cache repeated calls ke results cache karta hai.
# Same arguments dobara aane par function calculation repeat
# karne ke bajay cached result return kar sakta hai.
# Arguments hashable hone chahiye.

@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n

    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(15))
print(fibonacci.cache_info())


# ============================================================
# 11. LAMBDA AND PARTIAL
# ============================================================

# lambda chhota anonymous function banata hai.
# Complex logic ke liye normal def zyada readable hota hai.

double_value = lambda number: number * 2
print(double_value(5))

# partial() existing function ke kuch arguments pehle se set karta hai.
# Yeh configured function banane ka useful standard-library tool hai.

def calculate_price(price, tax_rate):
    return price + price * tax_rate

with_tax = partial(calculate_price, tax_rate=0.18)

print(with_tax(1000))


# ============================================================
# 12. ITERABLES AND ITERATORS
# ============================================================

# Iterable: jis par iterate kiya ja sake, jaise list ya string.
# Iterator: next() se ek-ek item deta hai aur apni progress yaad rakhta hai.
#
# iter() iterable se iterator banata hai.
# next() agla item deta hai.
# Items khatam hone par StopIteration aata hai.

skills = ["Python", "SQL", "Git"]

skill_iterator = iter(skills)

print(next(skill_iterator))
print(next(skill_iterator))
print(next(skill_iterator))

# next(iterator, default) se exhaustion par default mil sakta hai.
print(next(skill_iterator, "No more skills"))

# Iterator ek hi baar consume hota hai; reuse ke liye naya iterator
# banana pad sakta hai.


# ============================================================
# 13. GENERATORS AND YIELD FROM
# ============================================================

# yield function ko generator function bana deta hai.
# Har next() par execution agle yield tak chalta hai.
# Values ek-ek karke milti hain; poori list pehle banana zaroori nahi.

def count_up_to(limit):
    number = 1

    while number <= limit:
        yield number
        number += 1

print(list(count_up_to(5)))

# yield from kisi doosre iterable/generator ki values delegate karta hai.
# Nested sequences ko simple tareeke se produce kar sakte hain.

def all_skills():
    yield "Python"
    yield from ["SQL", "Git", "Docker"]

print(list(all_skills()))

# Generator expressions bhi lazy hote hain.
squares_generator = (n * n for n in range(1, 6))
print(next(squares_generator))
print(next(squares_generator))


# ============================================================
# 14. SHALLOW COPY VS DEEP COPY
# ============================================================

# Assignment se list copy nahi hoti; sirf same object ka reference milta hai.
# Shallow copy outer collection copy karti hai, nested objects shared rehte hain.
# Deep copy nested objects ko bhi recursively copy karti hai.

original = {
    "name": "Rahul",
    "skills": ["Python", "SQL"],
}

reference_copy = original
shallow_copy = copy.copy(original)
deep_copy = copy.deepcopy(original)

reference_copy["name"] = "Aman"
print(original["name"])  # Aman: same dictionary

shallow_copy["skills"].append("Docker")
print(original["skills"])  # Docker bhi dikhega: nested list shared hai

deep_copy["skills"].append("AWS")
print(original["skills"])  # AWS original mein add nahi hoga


# ============================================================
# 15. CUSTOM EXCEPTIONS AND EXCEPTION CHAINING
# ============================================================

# Apni domain-specific error class bana sakte ho.
# Python mein aam taur par Exception se inherit karte hain.

class InvalidMarksError(Exception):
    """Marks valid range mein na hon to yeh error raise hota hai."""


def validate_marks(marks):
    if not 0 <= marks <= 100:
        raise InvalidMarksError("Marks must be between 0 and 100")

    return marks

try:
    validate_marks(120)
except InvalidMarksError as error:
    print("Validation error:", error)

# "raise NewError(...) from original_error" exception chaining hai.
# Isse original error ka cause preserve hota hai.

def parse_age(text):
    try:
        return int(text)
    except ValueError as error:
        raise ValueError("Age must be a whole number") from error

try:
    parse_age("twenty")
except ValueError as error:
    print("Could not parse age:", error)


# ============================================================
# 16. CONTEXT MANAGERS
# ============================================================

# with ka use resources ko reliably manage karne ke liye hota hai.
# Files ek common example hain; context managers locks ya temporary
# settings jaise resources ko bhi manage kar sakte hain.

@contextmanager
def simple_timer(label):
    # Real timer add karne ke liye time.perf_counter() use hota hai.
    print(f"Starting: {label}")

    try:
        yield
    finally:
        print(f"Finished: {label}")

with simple_timer("Student report"):
    print("Generating report...")

# finally block normal completion ya error ke baad bhi execute hota hai.
# Production timing ke liye actual start/end timestamps measure karna hoga.


# ============================================================
# 17. DATACLASSES
# ============================================================

# @dataclass data-holder classes ka boilerplate kam karta hai.
# Python automatically __init__, repr aur equality methods generate
# kar sakta hai.
# JS/PHP mein iske liye aam taur par class/constructor code likhte hain.

@dataclass
class StudentRecord:
    name: str
    marks: float
    skills: list[str] = field(default_factory=list)

    def passed(self) -> bool:
        return self.marks >= 50

record = StudentRecord("Rahul", 85, ["Python", "SQL"])

print(record)
print(record.passed())

# default_factory har instance ke liye nayi list banata hai.
# Mutable default list ko directly field ka default banana avoid karo.


# ============================================================
# 18. PROPERTY AND SPECIAL METHODS
# ============================================================

# @property method ko attribute ki tarah expose karta hai.
# Isse validation ya calculated values ko property ke peeche rakh sakte hain.

class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive")

        self._balance += amount

    def __repr__(self):
        # __repr__ object ka developer-friendly representation deta hai.
        return f"BankAccount(owner={self.owner!r}, balance={self.balance})"

account = BankAccount("Rahul", 1000)
account.deposit(500)

print(account.balance)
print(account)

# Python mein underscore _balance conventionally internal attribute
# batata hai; yeh hard privacy barrier nahi hai.


# ============================================================
# 19. TYPE HINTS
# ============================================================

# Type hints expected types document karte hain aur tools ko code
# check karne mein help karte hain.
# Python by default runtime par har hint enforce nahi karta.
# JS mein TypeScript ke annotations se yeh concept familiar hoga.

def average(values: list[float]) -> float:
    if not values:
        return 0.0

    return sum(values) / len(values)

print(average([80.0, 90.0, 70.0]))

# Union type: value string bhi ho sakti hai ya None.
def find_student(student_id: int) -> str | None:
    if student_id == 1:
        return "Rahul"

    return None

print(find_student(1))
print(find_student(99))


# ============================================================
# 20. TYPEDDICT AND PROTOCOL
# ============================================================

# TypedDict dictionary ke expected keys aur value types document karta hai.
# Yeh normal runtime dictionary hi rehti hai; automatic validation nahi hoti.

class StudentData(TypedDict):
    name: str
    marks: float

def print_student(student: StudentData) -> None:
    print(student["name"], student["marks"])

student_data: StudentData = {
    "name": "Neha",
    "marks": 92.0,
}

print_student(student_data)

# Protocol structural typing ke liye hai:
# object ko required method provide karna hota hai; exact base class
# inherit karna zaroori nahi.
# Type checkers is contract ko verify kar sakte hain.

class HasName(Protocol):
    name: str

def print_name(item: HasName) -> None:
    print(item.name)

print_name(record)


# ============================================================
# 21. GENERICS
# ============================================================

# Generic class ko alag-alag data types ke saath reuse kar sakte hain.
# TypeVar type relationship ko describe karta hai.
# Yeh TypeScript generics jaisa concept hai.

T = TypeVar("T")

class Box(Generic[T]):
    def __init__(self, value: T):
        self.value = value

    def get(self) -> T:
        return self.value

number_box = Box[int](100)
text_box = Box[str]("Python")

print(number_box.get())
print(text_box.get())

# Generic hints primarily static type checking ke liye hain;
# normal Python execution mein yeh automatically type enforce nahi karte.


# ============================================================
# 22. PATHLIB AND JSON
# ============================================================

# pathlib filesystem paths ko objects ke roop mein handle karta hai.
# String paths ko manually jodne ke bajay Path / operator use kar sakte hain.
# JSON data ko text format mein serialize/deserialize karta hai.

student_data = {
    "name": "Rahul",
    "marks": 85,
    "skills": ["Python", "SQL"],
}

# Temporary directory use kar rahe hain taaki practice files
# kisi existing personal folder mein na ban jaayen.
with tempfile.TemporaryDirectory() as temp_dir:
    file_path = Path(temp_dir) / "student.json"

    # json.dumps Python object ko JSON string mein convert karta hai.
    json_text = json.dumps(student_data, indent=2)

    file_path.write_text(json_text, encoding="utf-8")

    # json.loads JSON string ko Python object mein convert karta hai.
    loaded_text = file_path.read_text(encoding="utf-8")
    loaded_data = json.loads(loaded_text)

    print(loaded_data["name"])
    print(file_path.suffix)


# ============================================================
# 23. USEFUL STANDARD LIBRARY TOOLS
# ============================================================

# Counter items ki frequency count karta hai.
languages = ["Python", "JS", "Python", "PHP", "JS", "Python"]

print(Counter(languages))

# defaultdict missing key ke liye automatic default value bana sakta hai.
marks_by_subject = defaultdict(list)

marks_by_subject["Python"].append(85)
marks_by_subject["Python"].append(90)
marks_by_subject["SQL"].append(80)

print(dict(marks_by_subject))

# namedtuple simple named fields wali tuple-like structure deta hai.
Point = namedtuple("Point", ["x", "y"])

point = Point(10, 20)

print(point.x, point.y)

# itertools.chain multiple iterables ko ek stream ki tarah combine karta hai.
print(list(chain([1, 2], [3, 4])))

# islice iterator se limited number of values nikaalta hai.
print(list(islice(range(100), 5)))

# product Cartesian product banata hai.
print(list(product(["S", "M"], ["Red", "Blue"])))


# ============================================================
# 24. STRUCTURAL PATTERN MATCHING
# ============================================================

# match/case Python 3.10+ ka feature hai.
# Simple values ke alawa tuple/list/dictionary patterns ko bhi match
# kar sakta hai. Isliye yeh sirf switch statement ka duplicate nahi hai.

command = ("add", "Rahul", 85)

match command:
    case ("add", name, marks):
        print(f"Adding student: {name}, marks={marks}")

    case ("delete", name):
        print(f"Deleting student: {name}")

    case _:
        print("Unknown command")

# Dictionary patterns mein required keys check ki ja sakti hain.
student_info = {"name": "Neha", "marks": 92}

match student_info:
    case {"name": name, "marks": marks} if marks >= 50:
        print(f"{name} passed")

    case _:
        print("Student did not match the pattern")


# ============================================================
# 25. ASYNC / AWAIT
# ============================================================

# async def coroutine function banata hai.
# await kisi awaitable operation ke complete hone ka wait karta hai,
# aur is dauran event loop doosre tasks chala sakta hai.
#
# Real use cases: network requests, async database clients, I/O.
# CPU-heavy calculations automatically faster nahi hoti.
#
# Yeh example sirf syntax dikhata hai; ismein actual network request nahi hai.

async def fetch_student_name():
    await asyncio.sleep(0.1)
    return "Rahul"

async def main():
    name = await fetch_student_name()
    print("Fetched student:", name)

# Normal Python script mein asyncio.run() top-level entry point hai.
asyncio.run(main())


# ============================================================
# 26. MATH AND NUMERIC HELPERS
# ============================================================

# Python standard library mein common mathematical helpers bhi hain.
# math.floor() neeche ke integer ki taraf round karta hai.
# math.ceil() upar ke integer ki taraf round karta hai.

print(math.floor(4.8))
print(math.ceil(4.2))


# ============================================================
# END OF PYTHON CONCEPTS MASTER PRACTICE
# ============================================================

print("Python concepts practice completed!")
