
# ============================================================
# PYTHON CONCEPT PRACTICE
# Focus: Python ke unique syntax aur idiomatic features
# Assumption: Python 3.10+
# ============================================================


# 1. TUPLE + UNPACKING
# ------------------------------------------------------------
# Tuple multiple values ko ek sequence mein store karta hai.
# Tuple ki existing items ko directly change nahi kar sakte.
# JavaScript mein array mutable hota hai; Object.freeze()
# bhi Python tuple ka exact equivalent nahi hai.
#
# Unpacking se ek hi statement mein multiple variables
# ko tuple ki values assign kar sakte hain.
# ------------------------------------------------------------

student = ("Rahul", 25, 85)

name, age, marks = student

print(name, age, marks)

# Single-item tuple banane ke liye comma zaroori hai:
single_value = (10,)


# 2. DICTIONARY
# ------------------------------------------------------------
# Dictionary key-value pairs store karti hai.
# JavaScript object aur PHP associative array se milti-julti hai.
#
# Python mein keys ko access karne ke liye square brackets
# use hote hain. Missing key par KeyError aa sakta hai.
# Safe alternative: .get()
# ------------------------------------------------------------

profile = {
    "name": name,
    "age": age,
    "marks": marks
}

print(profile["name"])
print(profile.get("city", "Not provided"))

# Nayi key add ya existing value update:
profile["city"] = "Delhi"


# 3. SET
# ------------------------------------------------------------
# Set sirf unique elements rakhta hai.
# Duplicate values automatically remove ho jaati hain.
#
# Set ka order guaranteed nahi hota.
# Empty set ke liye set() likho, {} nahi,
# kyunki {} empty dictionary banata hai.
# ------------------------------------------------------------

skills = {"Python", "PHP", "Python", "SQL"}

skills.add("JavaScript")

print(skills)
print("Python" in skills)


# 4. LIST COMPREHENSION
# ------------------------------------------------------------
# List comprehension existing collection se new list banati hai.
# JavaScript ke map() aur filter() ka kaam compact syntax
# mein kar sakti hai.
#
# Syntax:
# [expression for item in collection if condition]
#
# Yeh simple example normal for-loop ka alternative hai.
# ------------------------------------------------------------

numbers = [1, 2, 3, 4, 5]

squares = [number * number for number in numbers]

even_numbers = [
    number for number in numbers
    if number % 2 == 0
]

print(squares)
print(even_numbers)


# 5. SLICING
# ------------------------------------------------------------
# Python mein sequence ka ek portion nikaalne ke liye slicing
# use hoti hai.
#
# Syntax: sequence[start:stop:step]
# start included hota hai, stop excluded hota hai.
# Negative index end se counting karta hai.
#
# JavaScript mein similar kaam slice() method se hota hai,
# lekin Python ka slicing syntax alag hai.
# ------------------------------------------------------------

items = ["A", "B", "C", "D", "E"]

print(items[1:4])   # B, C, D
print(items[:3])    # Pehle 3 items
print(items[-1])    # Last item
print(items[::-1])  # Reverse copy


# 6. ENUMERATE
# ------------------------------------------------------------
# enumerate() loop mein index aur value dono deta hai.
# JavaScript mein index ke liye entries() ya forEach()
# use kar sakte ho.
#
# start=1 dene se counting 1 se start hoti hai.
# ------------------------------------------------------------

for index, item in enumerate(items, start=1):
    print(index, item)


# 7. ZIP
# ------------------------------------------------------------
# zip() multiple collections ke matching elements ko
# ek saath iterate karne deta hai.
#
# Yeh default mein shortest collection ke end par rukta hai.
# JavaScript mein iska exact built-in equivalent nahi hai.
# ------------------------------------------------------------

subjects = ["Python", "SQL", "PHP"]
scores = [85, 90, 75]

for subject, score in zip(subjects, scores):
    print(f"{subject}: {score}")


# 8. F-STRINGS
# ------------------------------------------------------------
# f-string Python ka readable string interpolation syntax hai.
# JavaScript template literals (`${value}`) aur PHP ke
# interpolation syntax se milta-julta purpose hai.
#
# Curly braces ke andar variables ya expressions likh sakte ho.
# ------------------------------------------------------------

name = "Rahul"
marks = 85

print(f"{name} scored {marks} marks")
print(f"Next score: {marks + 5}")


# 9. *ARGS AND **KWARGS
# ------------------------------------------------------------
# *args extra positional arguments ko tuple mein collect karta hai.
# **kwargs extra named arguments ko dictionary mein collect karta hai.
#
# JavaScript mein rest parameters (...) milte hain,
# lekin Python ka **kwargs named arguments collect karta hai.
# ------------------------------------------------------------

def show_details(*args, **kwargs):
    print("Positional:", args)
    print("Named:", kwargs)


show_details("Developer", "Python", name="Rahul", level="Beginner")


# 10. KEYWORD-ONLY ARGUMENTS
# ------------------------------------------------------------
# * ke baad diye gaye parameters keyword se hi pass karne padte hain.
# Isse function calls zyada clear aur readable ho sakti hain.
# ------------------------------------------------------------

def create_student(name, *, age, marks):
    return {
        "name": name,
        "age": age,
        "marks": marks
    }


student = create_student("Rahul", age=25, marks=85)

print(student)


# 11. NONE, TRUTHINESS, IS VS ==
# ------------------------------------------------------------
# None ka matlab hai: abhi koi value nahi hai.
# JavaScript ke null ke kareeb hai.
#
# == values ki equality check karta hai.
# is check karta hai ki dono references same object ko
# refer karte hain ya nahi.
#
# None check karne ke liye Python mein "is None" preferred hai.
#
# Empty list, empty dict, empty string, 0 aur None
# conditional context mein False behave karte hain.
# ------------------------------------------------------------

result = None

if result is None:
    print("No result available")

empty_list = []

if not empty_list:
    print("List is empty")


# 12. EXCEPTION HANDLING
# ------------------------------------------------------------
# Python mein exceptions handle karne ke liye try/except hota hai.
# JavaScript/PHP ke try/catch jaisa purpose hai.
#
# Python mein specific exception catch karna better hai.
# Yahan invalid text ko int mein convert karne par ValueError aata hai.
# ------------------------------------------------------------

try:
    number = int("hello")
except ValueError:
    print("Invalid number")
else:
    print("Conversion successful")
finally:
    print("Conversion attempt finished")


# 13. WITH STATEMENT + FILE HANDLING
# ------------------------------------------------------------
# with context manager ke through resource ko safely manage karta hai.
# File ka kaam complete hone par file automatically close ho jaati hai.
#
# "w" mode file ko write karta hai aur existing content overwrite
# kar sakta hai. "r" read ke liye aur "a" append ke liye hai.
#
# JavaScript mein file handling runtime/API par depend karti hai;
# Python mein with open(...) ek common idiom hai.
# ------------------------------------------------------------

with open("student.txt", "w", encoding="utf-8") as file:
    file.write("Rahul, 85")

with open("student.txt", "r", encoding="utf-8") as file:
    content = file.read()

print(content)


# 14. GENERATOR + YIELD
# ------------------------------------------------------------
# yield function ko generator banata hai.
# Generator values ek-ek karke produce karta hai.
#
# Normal return function se value return karke function call
# finish kar deta hai; yield execution ko pause karke baad mein
# wahi se continue karne deta hai.
#
# JavaScript mein generators ke liye function* aur yield hain.
# Concept dono languages mein available hai, syntax alag hai.
# ------------------------------------------------------------

def get_numbers():
    yield 10
    yield 20
    yield 30


for number in get_numbers():
    print(number)


# 15. CLASS + SELF + __INIT__
# ------------------------------------------------------------
# class apna custom type define karti hai.
# __init__ object create hone par uski initial state set karta hai.
# self current object ka reference hai.
#
# JavaScript mein this ka similar role hai, lekin Python mein
# self ko instance methods mein explicitly parameter banana hota hai.
# ------------------------------------------------------------

class Student:
    def __init__(self, name, marks):
        self.name = name
        self.marks = marks


student_obj = Student("Rahul", 85)

print(student_obj.name)


# 16. PROPERTY DECORATOR
# ------------------------------------------------------------
# @property method ko attribute ki tarah access karne deta hai.
# Isse calculation ya controlled access ko property ke peeche
# hide kar sakte hain.
#
# JavaScript mein getter (get propertyName()) similar purpose
# serve karta hai.
# ------------------------------------------------------------

class StudentProfile:
    def __init__(self, name):
        self.name = name

    @property
    def display_name(self):
        return self.name.upper()


profile = StudentProfile("Rahul")

print(profile.display_name)  # Method call ke parentheses nahi


# 17. MATCH / CASE
# ------------------------------------------------------------
# Python 3.10+ mein structural pattern matching available hai.
# Simple values ke liye switch/case jaisa lag sakta hai,
# lekin complex data structures ke patterns bhi match kar sakta hai.
#
# case _ default-like fallback hai.
# ------------------------------------------------------------

grade = "A"

match grade:
    case "A":
        print("Excellent")
    case "B":
        print("Good")
    case _:
        print("Keep practicing")


# 18. DICTIONARY COMPREHENSION
# ------------------------------------------------------------
# List comprehension ki tarah dictionary comprehension bhi hoti hai.
# Expression key:value pairs generate karta hai.
# ------------------------------------------------------------

names = ["Rahul", "Aman", "Neha"]

name_lengths = {
    name: len(name)
    for name in names
}

print(name_lengths)


# 19. ANY AND ALL
# ------------------------------------------------------------
# any() True deta hai agar kam se kam ek item truthy ho.
# all() True deta hai agar sabhi items truthy hon.
#
# Yeh conditions check karne ka concise Pythonic tareeka hai.
# Empty collection ke liye any([]) False aur all([]) True hota hai.
# ------------------------------------------------------------

scores = [80, 65, 90]

print(any(score < 50 for score in scores))
print(all(score >= 50 for score in scores))


# 20. SORTED WITH KEY
# ------------------------------------------------------------
# sorted() collection ke elements ko sort karke new list deta hai.
# key= batata hai ki sorting kis value ke basis par karni hai.
#
# Original list ko sorted() modify nahi karta.
# list.sort() original list ko modify karta hai.
# ------------------------------------------------------------

students = [
    {"name": "Rahul", "marks": 85},
    {"name": "Aman", "marks": 92},
    {"name": "Neha", "marks": 78}
]

ranked_students = sorted(
    students,
    key=lambda student: student["marks"],
    reverse=True
)

print(ranked_students)
