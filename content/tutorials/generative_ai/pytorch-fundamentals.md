# PyTorch Fundamentals – Complete Practical Guide

## 1. What is PyTorch? (Absolute Basics)

PyTorch is a **Deep Learning framework** used to build and train AI models (like Neural Networks).

Think of PyTorch as:

* A **powerful math engine** for tensors (multi‑dimensional arrays)
* A **toolkit to build neural networks easily**
* A **system that automatically computes gradients** (Autograd)

Why PyTorch is used in AI:

* Very easy and Pythonic
* Dynamic (runs step‑by‑step, easy to debug)
* Strong GPU support (fast training)
* Industry + research standard

In simple words:
**PyTorch = Tensors + Automatic Gradients + Neural Network Tools**

---

## 2. Tensor in PyTorch (Core Concept)

A Tensor is just a **multi‑dimensional number container**.

Examples:

* 0D → Single number (scalar)
* 1D → List (vector)
* 2D → Table (matrix)
* 3D+ → Image / Video / Batch of data

### Create Tensor

```python
import torch

# scalar (0D)
a = torch.tensor(5)

# vector (1D)
b = torch.tensor([1, 2, 3])

# matrix (2D)
c = torch.tensor([[1, 2], [3, 4]])
```

### Shape, dtype, device

```python
x = torch.tensor([[1,2,3],[4,5,6]], dtype=torch.float32)

print(x.shape)     # (2, 3)
print(x.dtype)     # float32
print(x.device)    # cpu
```

### Move Tensor to GPU

```python
device = "cuda" if torch.cuda.is_available() else "cpu"
x = x.to(device)
print(x.device)
```

---

## 3. Basic Tensor Operations (Tiny Practical)

```python
a = torch.tensor([1,2,3], dtype=torch.float32)
b = torch.tensor([4,5,6], dtype=torch.float32)

print(a + b)        # addition
print(a * b)        # elementwise multiply
print(a.mean())     # average
print(a @ b)        # dot product
```

PyTorch uses **vectorized math** → very fast, especially on GPU.

---

## 4. Autograd (Automatic Differentiation)

Autograd = PyTorch automatically computes **gradients (derivatives)**.

Why gradients?
Because Neural Networks learn by **reducing error using gradients**.

### Simple Example

```python
x = torch.tensor(2.0, requires_grad=True)

y = x**2 + 3*x + 1   # y = f(x)

y.backward()         # compute dy/dx automatically

print(x.grad)        # derivative = 2x + 3 → 7
```

You do NOT manually compute gradients → PyTorch does it for you.

---

## 5. Simple Training Flow (Intuition)

Training always follows this loop:

1. Define Model
2. Forward Pass (prediction)
3. Compute Loss (error)
4. Backward Pass (gradients)
5. Optimizer Step (update weights)

Core idea:
**Prediction → Error → Gradient → Improve model**

---

## 6. Key PyTorch Building Blocks

### torch.Tensor

Data container for all numbers in Deep Learning.

### torch.nn

Used to build neural networks.
Example layers:

* Linear (Dense)
* ReLU
* Conv2D
* Dropout

### torch.optim

Updates model weights using gradients.
Common optimizers:

* SGD
* Adam (most used)

### Dataset & DataLoader

Used to load data in batches efficiently.

---

## 7. Tiny Practical Example – Linear Regression

Goal: Fit line y = wx + b

```python
import torch
import torch.nn as nn

# data
x = torch.tensor([[1.0],[2.0],[3.0],[4.0]])
y = torch.tensor([[2.0],[4.0],[6.0],[8.0]])

# model
model = nn.Linear(1,1)

# loss and optimizer
loss_fn = nn.MSELoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

# training loop
for epoch in range(100):
    pred = model(x)              # forward
    loss = loss_fn(pred, y)      # compute loss

    optimizer.zero_grad()
    loss.backward()              # backward
    optimizer.step()             # update

print(model.weight, model.bias)
```

Model automatically learns weight ≈ 2 and bias ≈ 0.

---

## 8. Tiny Neural Network Training Step

```python
model = nn.Sequential(
    nn.Linear(10, 5),
    nn.ReLU(),
    nn.Linear(5, 1)
)

x = torch.randn(4, 10)
y = torch.randn(4, 1)

loss_fn = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

pred = model(x)
loss = loss_fn(pred, y)

optimizer.zero_grad()
loss.backward()
optimizer.step()
```

This is the **core training pattern for ALL deep learning models**.

---

## 9. CPU vs GPU Training (Intuition)

CPU:

* Few powerful cores
* Good for general tasks
* Slow for large tensor math

GPU:

* Thousands of small cores
* Designed for matrix/tensor operations
* Massive parallel computation
* Much faster for deep learning

Why GPU is fast?
Neural networks = heavy matrix multiplication → GPU excels at parallel math.

---

## 10. One‑Page Mental Model (Cheat Sheet)

### PyTorch Workflow

Data → Tensor → Model → Loss → Backward → Optimizer → Repeat

### Core Objects

* Tensor → Data container
* nn.Module → Model
* Loss → Measures error
* Optimizer → Updates weights

### Training Loop

1. pred = model(x)
2. loss = loss_fn(pred, y)
3. optimizer.zero_grad()
4. loss.backward()
5. optimizer.step()

### Autograd

Set requires_grad=True → call backward() → gradients computed automatically.

### GPU

model.to("cuda")
data.to("cuda") → Faster training

### Key Idea

Deep Learning = Adjust weights using gradients to reduce loss.

---

End of Guide – You now understand complete PyTorch fundamentals with practical intuition.
