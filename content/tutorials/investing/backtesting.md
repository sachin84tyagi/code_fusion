# ⑱ Backtesting — Proof Karo Ki System Kaam Karta Hai

> **"Chart pe accha dikh raha hai" — yeh kaafi nahi. Backtesting ek trading system ka scientific proof hai.**

---

# Backtesting Kya Hota Hai?

## Simple Definition

> **Backtesting = Apne trading rules ko historical data pe apply karna aur results record karna.**

```
"Agar main yeh rules pichle 2 saalon mein use karta,
toh kitna profit/loss hota?"
```

Yeh aapko bataata hai:
- Kya system actually profitable hai?
- Kitni baar setup kaam kiya vs kaam nahi kiya?
- Risk kitna tha?
- Expected returns kya hain?

---

# Backtesting Kyun Zaroori Hai?

## Problem Without Backtesting

```
Trader dekhta hai: "VSA Spring + Test setup → Great! Buy karo."
Result: 5 trades mein 3 loss.
Reaction: "VSA kaam nahi karta."

Reality: Ya toh setup galat identify kiya,
         ya risk management galat tha,
         ya system fundamentally weak hai.
Without backtesting — pata hi nahi chalta.
```

## With Backtesting

```
100 historical Spring+Test setups dekhe.
62 jite (win rate: 62%)
Average win: 3R (3x risk taken)
Average loss: 1R
Expectancy: Positive

Confidence level HIGH.
"Main jaanta hoon yeh system profitable hai over time."
```

---

# Backtesting Process — Step By Step

## Step 1: Define Your Setup Rules Exactly

```
Vague rules = Vague results.

BAD: "Spring dikhe toh buy karo."

GOOD:
Entry Condition 1: Accumulation range minimum 4 weeks
Entry Condition 2: Support level clearly defined (3+ touches)
Entry Condition 3: Spring bar goes below support and closes back above
Entry Condition 4: Spring volume = Less than SC volume OR very low
Entry Condition 5: Successful test within 5 bars (low volume, close near top)
Entry Condition 6: SOS within 10 bars after test
Entry: Next bar after SOS, above SOS high
Stop: Below Spring low (lowest point)
Target 1: Previous range high (AR level)
Target 2: 2x range height projected from range top
```

---

## Step 2: Set Timeframe and Universe

```
Timeframe: Daily charts
Universe: Nifty 500 stocks
Period: Last 3 years (Jan 2022 - Dec 2024)
```

---

## Step 3: Go Through Charts Bar by Bar

**Important: Use "scroll left" method.**
```
1. Chart ko right side pe cover karo
2. Dheere dheere right side kholo (1 bar at a time)
3. Setup identify karo BEFORE seeing what happened next
4. Trade enter karo (rules ke hisaab se)
5. Record karo
```

**Why cover the right side?**
Agar future dekh lete ho toh bias aa jaata hai ("hindsight bias").

---

## Step 4: Record Every Trade

| # | Stock | Date | Setup | Entry | Stop | Target | Exit | R | Win/Loss |
|---|---|---|---|---|---|---|---|---|---|
| 1 | RELIANCE | Mar 23 | Spring+Test | 2350 | 2290 | 2530 | 2520 | +2.8R | Win |
| 2 | HDFC | May 23 | Spring+Test | 1580 | 1540 | 1720 | 1545 | -1R | Loss |
| 3 | TCS | Jun 23 | Spring+Test | 3200 | 3120 | 3440 | 3430 | +2.9R | Win |

---

## Step 5: Calculate Key Metrics

### Win Rate
```
Win Rate = (Number of Wins / Total Trades) × 100

Example: 62 wins / 100 trades = 62%
```

### Average Win (in R)
```
R = Risk on trade (Entry - Stop = 1R)

Example: 3 winning trades of 2R, 3R, 2.5R
Average Win = (2 + 3 + 2.5) / 3 = 2.5R
```

### Average Loss (in R)
```
Almost always = 1R (if stop-loss is respected)
```

### Expectancy
```
Expectancy = (Win Rate × Avg Win) - (Loss Rate × Avg Loss)

Example:
= (0.62 × 2.5R) - (0.38 × 1R)
= 1.55R - 0.38R
= 1.17R per trade

Positive Expectancy = Profitable system over time ✅
```

### Maximum Losing Streak
```
What is the longest sequence of consecutive losses?
Example: 7 losses in a row

This tells you: Can you emotionally and financially handle this?
```

### Maximum Drawdown
```
What is the largest peak-to-valley loss in account equity?
Example: Account went from ₹1,00,000 to ₹85,000 at worst point
Drawdown = 15%

This tells you: What's the worst case scenario?
```

---

# Interpreting Results

## Good System (Minimum Thresholds)

```
Win Rate:    > 40% (even 40% can be profitable with good R:R)
Avg Win:     > 2R
Avg Loss:    ≤ 1R
Expectancy:  > 0 (positive)
Max Drawdown: Manageable (< 25% of account)
```

## Example — Calculating System Viability

```
Win Rate: 55%
Avg Win: 2.2R
Avg Loss: 1R

Expectancy = (0.55 × 2.2) - (0.45 × 1)
           = 1.21 - 0.45
           = 0.76R per trade

100 trades with ₹1000 risk per trade:
Expected profit = 100 × 0.76 × ₹1000 = ₹76,000

Not guaranteed — but statistically expected over large sample.
```

---

# Backtesting Pitfalls

## Pitfall 1: Hindsight Bias

```
❌ "Obviously yeh Spring tha, toh main buy karta"
   (Sirf isliye obvious laga kyunki outcome already pata tha)

✅ Use scroll method — cover future bars
```

## Pitfall 2: Curve Fitting

```
❌ Setup rules itne specific banao ki past mein perfectly work kare
   (Too many conditions added to match historical data)

✅ Simple, logical rules rakho. Less conditions = More robust.
```

## Pitfall 3: Small Sample Size

```
❌ "10 trades test kiye — 7 jite! Great system!"
✅ Minimum 50-100 trades. More = Better confidence.
```

## Pitfall 4: Ignoring Losing Streaks

```
❌ "Average 60% win rate hai — fine hai"
✅ Maximum losing streak check karo:
   If 10-loss streak possible — can you mentally handle it?
```

---

# Backtesting Log Template

```
Date: ____________
Stock/Index: ____________
Setup Type: ____________
Background: ____________
Entry Price: ____________
Stop Price: ____________  Risk: ₹____
Target Price: ____________  R:R = ____
Exit Price: ____________
Exit Date: ____________
Result: Win / Loss
P&L in R: ____R
Notes: ____________
```

---

# After Backtesting — What Next?

```
If Expectancy > 0:
→ System is profitable
→ Paper trade for 2-3 months (live market, fake money)
→ If results match backtest → Start small real money trading

If Expectancy < 0 or close to 0:
→ Review setup rules
→ Are you identifying setups correctly?
→ Is stop placement logical?
→ Adjust and re-backtest
```

---

# Summary

| Metric | What It Tells You |
|---|---|
| Win Rate | How often you're right |
| Average Win | How much you make when right |
| Average Loss | How much you lose when wrong |
| Expectancy | Expected profit per trade |
| Max Drawdown | Worst case scenario |
| Losing Streak | Emotional and financial stress test |

---

> **Key Rule: Backtesting nahi kiya toh trading = gambling. Backtesting kiya toh trading = calculated probability. Proof maango apne system se.**

---

👉 Agla chapter: **Strategy →** — complete trading setup banana.
