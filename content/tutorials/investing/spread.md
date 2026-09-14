# ② Spread — Price Bar Ki Range

> **Spread ek bar ki "energy" batata hai. Kitna effort laga, kitna result nikla — yeh sab spread mein chhupta hai.**

![Spread Types Comparison — Narrow vs Wide](/image/spread_comparison_chart_1789314524305.jpg)

---

# Spread kya hota hai?

**Simple definition:**

> **Spread = High - Low**

Yeh ek bar ki **total range** hai — sabse upar se sabse neeche tak.

```
High  = 110
Low   = 100
Spread = 110 - 100 = 10 points
```

---

# Visual Samajhna

```
        |  ← High (110)
        |
     ┌──┐
     │  │  ← Spread = 10 points (100 se 110 tak)
     │  │
     └──┘
        |  ← Low (100)
```

---

# Spread Ke Types

## 1. Narrow Spread (Chhota)

```
High  = 102
Low   = 100
Spread = 2 points  → NARROW
```

```
    | ← High (102)
   ┌┐
   └┘  ← Chhota body
    | ← Low (100)
```

Matlab: Is bar mein price zyada nahi hili. Kam movement.

---

## 2. Medium (Average) Spread

```
High  = 106
Low   = 100
Spread = 6 points  → MEDIUM
```

Normal activity — na bahut zyada, na bilkul kam.

---

## 3. Wide Spread (Bada)

```
High  = 115
Low   = 100
Spread = 15 points  → WIDE
```

```
        | ← High (115)
        |
     ┌──┐
     │  │  ← Bada body
     │  │
     └──┘
        | ← Low (100)
```

Matlab: Is bar mein price bahut hili. Zyada energy/movement.

---

# Spread Kyun Important Hai?

Spread batata hai ki **kitna effort** tha us time period mein.

Lekin effort akela kuch nahi batata. Hum isko **volume** ke saath compare karte hain.

---

# 4 Classic Combinations — Spread + Volume

## Case 1: Wide Spread + High Volume

```
High Volume + Wide Spread

→ Bahut effort laga, bahut result nikla.
→ Normal — effort aur result match kar rahe hain.
```

## Case 2: Wide Spread + Low Volume

```
Low Volume + Wide Spread

→ Kam effort laga, lekin zyada result nikla?
→ Suspicious — kuch to chal raha hai.
→ VSA mein: Could indicate professional activity or trap.
```

## Case 3: Narrow Spread + High Volume

```
High Volume + Narrow Spread

→ Bahut effort laga, lekin result nahi nikla!
→ Yeh VSA ka sabse important signal hai.
→ Matlab: Koi badi force (supply ya demand) price ko rok rahi hai.
```

## Case 4: Narrow Spread + Low Volume

```
Low Volume + Narrow Spread

→ Kam effort, kam result.
→ Market mein koi interest nahi (dono sides se).
→ "Dead market" — wait karo.
```

---

# Real Example — Nifty Daily Chart Scenario

```
Day 1: Spread = 80 points, Volume = 100M  → Normal
Day 2: Spread = 120 points, Volume = 250M → Strong move (effort = result)
Day 3: Spread = 15 points, Volume = 180M  → WARNING! High volume, narrow spread
                                           → Supply price ko rok rahi hai
Day 4: Spread = 10 points, Volume = 30M   → Dead zone — koi interest nahi
```

Day 3 pe agar market up trend mein tha — yeh selling pressure ka signal hai.

---

# Spread Aur Close Ki Relationship

Spread batata hai *kitni range thi*.
Close batata hai *woh range mein final result kya raha*.

```
High = 110, Low = 100, Close = 109

Spread = 10 points
Close = 109 (near top — strong close)

Matlab: Spread wide tha AUR buyers ne close zyada upar karaya.
→ Strong bullish bar.
```

vs.

```
High = 110, Low = 100, Close = 101

Spread = 10 points
Close = 101 (near bottom — weak close)

Matlab: Spread wide tha LEKIN buyers close nahi kar paaye upar.
→ Sellers ne wapas push kiya. Weakness.
```

---

# Close Position Formula

Close ko spread mein position dekhne ke liye:

```
Close Position % = (Close - Low) / (High - Low) × 100

Agar result:
80-100% = Close NEAR TOP (strong)
40-60%  = Close NEAR MIDDLE (neutral)
0-20%   = Close NEAR BOTTOM (weak)
```

Example:
```
High=110, Low=100, Close=108

= (108-100)/(110-100) × 100
= 8/10 × 100
= 80% → Close NEAR TOP ✅
```

---

# Summary Table

| Spread Type | Range | Matlab |
|---|---|---|
| Narrow | Chhota | Kam movement/energy |
| Medium | Average | Normal activity |
| Wide | Bada | High energy/movement |

| Combination | Matlab |
|---|---|
| Wide Spread + High Volume | Normal strong move |
| Wide Spread + Low Volume | Suspicious — investigate |
| Narrow Spread + High Volume | **Red flag! Koi force rok rahi hai** |
| Narrow Spread + Low Volume | No interest — dead market |

---

# Key Rule — Yaad Raho

> **Spread + Volume + Close — yeh teen milkar ek bar ki poori kahani batate hain.**
> **Sirf ek dekhne se galat conclusions nikalte hain.**

---

👉 Agla chapter: **Volume →** — volume kya batata hai aur ise kaise padhein.
