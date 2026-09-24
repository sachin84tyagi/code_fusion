# Chapter 3 — Order Types

> **Course:** NSE/BSE Professional Volume + Price Action + VSA + Wyckoff + Market Microstructure
> **Part:** II — Order Types & Market Microstructure
> **Prerequisite:** Chapter 2 — Price Formation

---

## Chapter Overview

Order types are the tools through which every market participant interacts with the exchange. Understanding them precisely is not administrative knowledge — it is analytical knowledge. The type of order a participant uses, and when, leaves a footprint in the volume and price data that VSA and order flow analysis attempt to read.

**Core principle of this chapter:**

> Every order type is a trade-off between **execution certainty** and **price certainty**. You cannot maximise both simultaneously.

---

## LEVEL 1 — BEGINNER

### The Fundamental Trade-Off

![NSE/BSE Order Types — Complete Reference Guide](/images/pi-order-types-overview.jpg)

Before examining each order type, internalise this principle:

| Want guaranteed execution? | Use a Market Order — but accept any price |
|---------------------------|-------------------------------------------|
| Want a guaranteed price? | Use a Limit Order — but accept that it may not fill |

Every other order type is a variation or combination of these two.

---

### 3.1 Market Order

**Definition:**
A Market Order instructs the exchange to execute immediately at the best available price on the opposite side of the book.

- A Market BUY executes at the **Best Ask** (or sweeps through multiple ask levels if size is large)
- A Market SELL executes at the **Best Bid** (or sweeps through multiple bid levels)

**NSE/BSE mechanics:**

```
You want to BUY 500 shares of HDFC Bank immediately.
Current Best Ask: ₹1,650.00 (quantity: 800 shares)

You place: Market BUY 500 shares

Result: 500 shares filled @ ₹1,650.00
        Remaining 300 shares still at ₹1,650.00 ask (unfilled, by others)

Your fill: ₹1,650.00 × 500 = ₹8,25,000
```

**When a market order sweeps multiple levels:**

```
You place: Market BUY 2,500 shares

Best Ask:  ₹1,650.00 → 800 shares
Next Ask:  ₹1,650.50 → 600 shares
Next Ask:  ₹1,651.00 → 700 shares
Next Ask:  ₹1,651.50 → 400 shares (only 400 needed from here)

Fills:
800 @ ₹1,650.00 = ₹13,20,000
600 @ ₹1,650.50 = ₹9,90,300
700 @ ₹1,651.00 = ₹11,55,700
400 @ ₹1,651.50 = ₹6,60,600

Total: 2,500 shares for ₹41,26,600
Average price: ₹1,650.64
Slippage vs best ask: ₹0.64 per share
```

**Advantages:**
- Guaranteed execution (in liquid stocks)
- Speed — fills immediately
- Useful when certainty of execution is more important than price

**Risks:**
- No price guarantee — you accept whatever the market offers
- Slippage on large orders or thin stocks
- On illiquid stocks: catastrophic slippage possible

**When to use:**
- When you MUST exit a position (stop-loss execution in fast-moving market)
- When you need to enter before a catalyst event and speed matters
- When the stock is very liquid and the spread is tight (₹0.05–₹0.50)

**When NOT to use:**
- On illiquid small-cap stocks
- For large orders relative to average daily volume
- When the spread is wide

---

### 3.2 Limit Order

**Definition:**
A Limit Order executes only at your specified price or **better** (lower for a buy, higher for a sell). If the market never reaches your price, the order does not fill.

```
Limit BUY:  "Buy me X shares, but only if price comes to ₹Y or lower"
Limit SELL: "Sell my X shares, but only if price goes to ₹Y or higher"
```

**Example — Limit BUY:**

```
Stock currently trading at ₹1,660.
You want to buy at ₹1,645 (support level).

You place: Limit BUY 500 shares @ ₹1,645

Possible outcomes:
1. Price dips to ₹1,645 → Your order fills at ₹1,645 ✅
2. Price dips to ₹1,648 but not to ₹1,645 → Order does NOT fill
3. Price continues falling below ₹1,645 → Order fills at ₹1,645,
   but now the stock is at ₹1,620 → You caught a falling knife ⚠️
```

**Example — Limit SELL:**

```
You own shares bought at ₹1,600.
You want to take profit at ₹1,700.

You place: Limit SELL 500 shares @ ₹1,700

Possible outcomes:
1. Price rallies to ₹1,700 → Order fills at ₹1,700 ✅
2. Price rallies to ₹1,698 and reverses → Order does NOT fill ❌
3. Price rallies past ₹1,700 → Order fills at ₹1,700 (not at the higher price)
```

**Queue position — critical nuance:**

When multiple limit orders exist at the same price, they are matched in **time order** (first placed = first filled). If 80,000 shares are queued at ₹1,645 ahead of you, your 500-share order only fills after those 80,000 shares fill.

**Advantages:**
- Price certainty — you will not pay more than your limit
- Can be used to add liquidity (and receive tighter spreads)
- Suitable for large orders (placed without creating market impact)

**Risks:**
- No fill guarantee — opportunity may pass
- Queue risk — even at the right price, you may not get filled
- Adverse selection — a fill at your limit price may indicate the stock is weakening (someone is selling to your limit buy)

**When to use:**
- When you have a specific price target for entry/exit
- For large orders to avoid market impact
- When the stock is range-bound and you can wait for your level

---

### 3.3 Stop-Loss Order (SL — Trigger + Limit)

**Definition:**
An SL order has **two prices**:
1. **Trigger Price** — the price that activates the order
2. **Limit Price** — the price at which the order is actually placed (after triggering)

```
For a SELL SL order (protecting a long position):
Trigger: ₹485 — when price TOUCHES ₹485, order activates
Limit:   ₹484 — once activated, a limit sell at ₹484 is placed

This order "sleeps" until ₹485 is touched.
Then it becomes a limit sell at ₹484.
```

**The gap risk — SL's critical vulnerability:**

```
You are long a stock at ₹500.
SL placed: Trigger ₹485, Limit ₹484.

Overnight news → Stock opens at ₹462.

Result:
- Trigger ₹485 is "hit" during gap (price moved through it)
- Limit order at ₹484 is activated
- But current price is ₹462 — your limit of ₹484 is ABOVE market
- The limit order will NOT fill at this price
- You are still holding the position at ₹462 — a ₹38 gap below your intended stop
```

**This is one of the most dangerous misunderstandings in retail trading.**

---

### 3.4 Stop-Loss Market Order (SL-M — Trigger only)

![SL vs SL-M — Understanding the Critical Difference for NSE/BSE Traders](/images/pi-sl-slm-comparison.jpg)

**Definition:**
An SL-M order has only **one price** — the trigger. Once the trigger is touched, a **Market Order** is placed immediately.

```
SL-M SELL order:
Trigger: ₹485

When price touches ₹485:
→ System immediately places a Market SELL
→ Executes at best available bid (whatever it is)
```

**Gap scenario with SL-M:**

```
Overnight gap to ₹462.

- Trigger ₹485 is "hit" during the gap
- SL-M activates → Market SELL placed
- Executes at best available bid: ₹462 (or close to it)

You get ₹462 — worse than intended ₹485.
BUT you are OUT of the position.
```

**SL vs SL-M — the decision framework:**

| Scenario | Use SL | Use SL-M |
|----------|--------|----------|
| Liquid large-cap, normal market hours | ✅ (minimal gap risk) | ✅ |
| Illiquid/mid-cap, holding overnight | ❌ (gap risk = stuck) | ✅ (exit guaranteed) |
| Near earnings/results | ❌ | ✅ |
| High volatility market condition | ❌ | ✅ |
| Intraday position, continuous monitoring | ✅ | ✅ |
| Positional trade with gap risk | ❌ | ✅ |

**NSE-specific rule:**

On NSE, SL-M orders are accepted for equity cash segment. For F&O, SL-M is widely used by traders managing futures/options positions. The exchange requires the trigger price for SL-M to be below the last traded price (for sell SL-M) or above it (for buy SL-M).

---

### 3.5 IOC — Immediate or Cancel

**Definition:**
An IOC (Immediate or Cancel) order instructs the exchange: "Fill as many shares as you can right now at my specified price. Cancel anything unfilled immediately."

```
You place: IOC Limit BUY 1,000 shares @ ₹1,650

At that moment, only 600 shares are available at ₹1,650 or below.

Result:
600 shares filled @ ₹1,650 ✅
400 shares cancelled ✅ (not waiting in queue)
```

**Unlike a regular Limit Order:**
- Regular limit: Stays in the queue until filled or manually cancelled
- IOC: Any unfilled portion is cancelled in the same second

**When IOC is used:**

- **Institutional block execution:** A fund wants 5 lakh shares at ₹500 but only if 5 lakh are available at once. They use an IOC limit — if not fully filled immediately, the order is cancelled and they try again later.
- **HFT and algo strategies:** IOC is the default for many algo strategies that do not want orders sitting in the book.
- **NSE F&O:** Commonly used in options to avoid partial fills at stale prices.

**VSA implication:**
High volumes created by IOC orders are real trades — they contribute to OHLCV data normally. The fact that they were IOC vs regular limit is not visible in OHLCV.

---

### 3.6 GTT — Good Till Triggered

**Definition:**
A GTT (Good Till Triggered) order is a conditional order that sits on the broker's server (not the exchange) and becomes a live order only when a specified trigger condition is met. It can remain active for up to 1 year (Zerodha's implementation) or until triggered/cancelled.

**Important distinction:**
- GTT is a **broker-level** product — it exists on Zerodha's (or other broker's) servers
- It is NOT a native NSE/BSE order type — it is the broker monitoring the market and placing a live order when conditions are met
- Therefore: execution is subject to the broker's system performance and internet connectivity

**Two GTT types on Zerodha:**
1. **Single trigger:** One condition (e.g., "Buy when price falls to ₹450")
2. **Two-leg (OCO):** One trigger for buy + one for stop-loss (used for positional entry + protection)

**When GTT is appropriate:**
- Long-term investor wanting to accumulate at specific levels without monitoring daily
- Setting entry orders for breakouts expected in weeks/months
- Not suitable for active intraday or swing trading

**When GTT is NOT appropriate:**
- High-volatility stocks (gap risk between trigger and execution)
- Illiquid stocks (slippage on trigger execution)
- Around major events (earnings, budget, etc.)

---

## LEVEL 2 — INTERMEDIATE

### 3.7 Order Modification and Cancellation

Understanding modification and cancellation is important for both trading practice and analysis.

**Modifying a Limit Order:**

On NSE, you can modify:
- Price of a resting limit order
- Quantity (reduce, but not increase beyond original)

**Important:** Modifying the price of a limit order typically **loses queue position** — the order is effectively cancelled and re-entered at the new price. This means your time priority resets.

```
Example:
You placed a Limit BUY at ₹500 at 10:15 AM.
By 11:30 AM, 30,000 shares are ahead of you in queue.
You modify price to ₹500.05 to get "better" queue position.

Result: Your old order (at position 30,001 in queue) is cancelled.
        New order placed at ₹500.05 — at the BACK of the new queue
        for that price level. If 500.05 has 5,000 shares ahead,
        you are now at position 5,001 in the new queue.
```

**Cancellation mechanics:**

Cancellations happen in two contexts:
1. **Manual cancellation** — you cancel your own resting order
2. **System cancellation** — exchange cancels unexecuted Day orders at end of session

**End-of-day cancellation (important for VSA context):**
- All Day orders that did not execute are cancelled at market close
- This includes resting limit orders, pending SL orders, etc.
- GTT orders (broker-level) persist beyond market hours

**Order book "flicker" from cancellations:**

Large volumes of order placements and cancellations by algos and HFTs are visible in the Level 2 order book as rapidly changing quantities. What appears as 1,00,000 shares at a bid level may vanish in milliseconds if an HFT cancels. This is **displayed liquidity** that is not necessarily real.

**VSA implication:** When analysing price interaction with a support or resistance level, the depth at that level in the order book is a useful reference but must be treated with caution — it can be cancelled before price reaches it.

---

### 3.8 Slippage — Calculation for Each Order Type

Slippage is the difference between the expected price and the actual execution price.

**Slippage by order type:**

| Order Type | Slippage | Source |
|-----------|---------|--------|
| Market Order | Variable — depends on book depth | Sweeping multiple price levels |
| Limit Order | Zero (if fills at limit) | By definition: fills at limit or better |
| SL (Limit) | Zero if triggered in normal market | Gap risk creates non-execution, not slippage |
| SL-M | Variable — market order after trigger | Gap + thin liquidity at trigger |
| IOC | Zero on filled portion | Cancelled portion: zero slippage (no fill) |
| GTT | Variable — market/limit at trigger | Depends on underlying order type |

**Calculating slippage precisely:**

```
Slippage per share = Actual average fill price − Expected price

Slippage % = (Slippage per share / Expected price) × 100

Round-trip slippage = Entry slippage + Exit slippage
```

**Real-world slippage benchmarks on NSE:**

| Instrument | Typical one-way slippage |
|-----------|------------------------|
| Nifty 50 large-cap (100 shares) | ₹0.00–₹0.10 (negligible) |
| Nifty 50 large-cap (10,000 shares) | ₹0.10–₹0.50 |
| Mid-cap stock (1,000 shares) | ₹0.50–₹2.00 |
| Small-cap stock (1,000 shares) | ₹2–₹20+ |
| Nifty 50 futures (1 lot = 75 units) | ₹0.05–₹0.50 |
| Nifty options at-the-money | ₹0.50–₹2.00 (in premium terms) |

**Why slippage matters for strategy validation:**

A trading strategy that earns ₹5 per share on average but has ₹3 per share in round-trip slippage (entry + exit) has a real net gain of ₹2 per share — a 40% reduction in profitability.

Backtesting without accounting for slippage produces consistently overstated results.

---

### 3.9 Which Order Type to Use — Decision Framework

**Scenario 1: Entering a breakout in real time**

```
Situation: Nifty 50 stock just broke above a 3-month resistance on high volume.
You want to enter NOW.

Recommended: Market Order
Why: Speed matters. The breakout may gap up further. A limit order
     may not fill if price runs. Slippage on a liquid large-cap is
     small enough that it doesn't materially affect the trade.

Alternative: Aggressive Limit at Ask + ₹1.00 buffer
```

**Scenario 2: Entering at a planned support level**

```
Situation: You've identified ₹2,400 as a key support for a Nifty 50 stock.
Price is currently ₹2,450. You want to buy if it dips.

Recommended: Limit BUY at ₹2,402–2,405
Why: You want price certainty. No urgency — you can wait.
     Queue position is manageable at a round number.

Risk: If price dips briefly to ₹2,403 and bounces, you may fill
      and then watch price continue down through your support.
      Always have an SL-M ready.
```

**Scenario 3: Protecting a swing trade held overnight**

```
Situation: You hold 500 shares of a mid-cap from ₹680.
           You want to protect at ₹655 (key structure).

Recommended: SL-M at ₹655 trigger
Why: Mid-cap stocks can gap significantly on news/results.
     SL (limit) risks non-execution if the stock opens at ₹640.
     SL-M guarantees exit, even if at a worse price.

NOT recommended: SL (limit) ₹655 trigger / ₹654 limit
Why: ₹1 limit gap provides almost no protection against a gap.
```

**Scenario 4: Institutional-style accumulation over multiple sessions**

```
Situation: A fund wants to buy 10 lakh shares without moving price.

Recommended: 
- Primary: Limit orders placed below current price at multiple levels
- Execution algo: VWAP order (if broker provides) spread across full session
- IOC used for opportunistic fills at specific intraday levels

NOT used: Single market order (would cause massive market impact)
```

**Scenario 5: Exiting a losing intraday F&O trade at market**

```
Situation: Options position going against you. You want out NOW.

Recommended: Market Order (or IOC at market)
Why: In fast-moving options market, a limit may not fill.
     The cost of non-execution (position moving further against you)
     exceeds the cost of slippage.
```

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### Order Types and the VSA Footprint

The order types participants use directly create the price and volume patterns that VSA reads. Understanding this connection is critical.

**Market Orders → Create bar range and direction:**

When aggressive market orders arrive on the buy side faster than the ask side replenishes:
- Each market buy order sweeps the next ask level up
- Price "expands" upward → wide spread bar
- High volume (many market orders executing)
- Close near high (buyers were aggressive to the end of the session)

This is precisely what VSA calls an "up bar on high volume closing near the highs" = demand present.

But the same pattern is produced by:
- Short covering (shorts buying to close, not accumulation)
- Stop-loss triggered buying (cascading stops being hit)
- IOC institution fills at multiple levels
- News-driven retail panic buying

OHLCV cannot distinguish. Context + background + subsequent sessions separate these hypotheses.

**Limit Orders → Create support and resistance in the order book:**

Large resting limit orders create "walls" in the order book at specific price levels. If a large buyer places 5,00,000 shares as a limit bid at ₹500:
- Price may repeatedly bounce off ₹500 as sellers hit the bid and the wall absorbs them
- This creates what appears on the chart as "support" with repeated tests
- Volume at each test may be elevated (the wall absorbing selling)

This is the mechanical origin of what Wyckoff calls "supporting action" and VSA calls "no supply at support."

However: That 5,00,000 share wall can be cancelled instantly. If it disappears before being fully filled, what looked like strong support evaporates.

**SL-M orders → Create stop cascades:**

When many traders place SL-M orders at similar levels (e.g., just below a well-known support), they cluster. When price touches that level:
1. Multiple SL-M triggers activate simultaneously
2. A cascade of market sell orders hits the bid side
3. Price gaps down rapidly through that level
4. The high volume on the down move + rapid recovery is what VSA calls a "Shakeout" or "Spring"

The professional recognises this pattern and buys into the panic — knowing it is SL-triggered selling, not genuine supply.

**IOC Orders and HFT → Create volume noise:**

HFT firms use IOC orders extensively:
- Place IOC at best bid/ask
- If filled: short-term position taken
- If not filled: cancelled immediately

This creates high order cancellation ratios but low trade volume. The trades that DO execute from HFT market-making contribute to the volume that shows up in OHLCV — but they are short-term and direction-neutral (HFT closes positions quickly).

**VSA implication:** In highly liquid stocks, a portion of the daily volume is "noise" from HFT market-making activity. This volume does not represent directional conviction. When analysing volume signals in VSA, this noise is particularly relevant in the 9:15–9:30 AM opening and 3:15–3:30 PM closing windows where HFT activity is highest.

---

### The Order Type Intelligence Layer

At the professional level, the specific order types being used by participants provide additional inference beyond OHLCV.

**What you can sometimes infer from Level 2 data (market depth):**

| Observation | Possible Inference | Evidence Classification |
|------------|-------------------|------------------------|
| Large resting limit bid suddenly appears at key support | Large participant placing limit buy, or an algo testing | INFERENCE |
| Same large bid disappears before price reaches it | HFT/algo cancel; not genuine demand | INFERENCE |
| Sudden large ask wall appears at resistance | Institutional limit sell, or stop-loss for shorts | INFERENCE |
| Price repeatedly tests a bid wall and bounces | The wall is genuine, being absorbed gradually | INFERENCE |
| Price breaks through a wall (it gets consumed) | Aggressive buying overwhelmed the wall | OBSERVATION |

**What you CANNOT infer from Level 2:**
- Who placed the order (institutional vs retail vs algo)
- Whether the wall represents accumulation or defensive positioning
- Whether cancellation was planned or reactive

This is why professional analysis never stops at the order book — it combines Level 2 observations with OHLCV, delivery data, OI, and institutional disclosures.

---

## EXERCISES

### Beginner Exercises

**Exercise 3.1 — Order Type Classification**

Classify each of the following as the most appropriate order type (Market / Limit / SL / SL-M / IOC / GTT):

a) You want to buy 100 shares of TCS at exactly ₹3,400 — you will wait as long as needed.
b) You hold Nifty futures long from 19,500. You want to exit automatically if Nifty hits 19,300, but you must exit regardless of price.
c) You want to enter a Reliance breakout right now — the stock just crossed resistance.
d) You want to buy 5,00,000 shares of a stock but only if the full quantity is available at ₹150 at this moment — cancel if not.
e) You want to buy Infosys if it ever drops to ₹1,400 over the next 6 months, without monitoring daily.
f) You hold a mid-cap stock for a week and want to exit if it falls to ₹240, but worried about overnight gaps.

**Exercise 3.2 — Slippage Calculation**

You place a Market BUY for 3,000 shares. The ask side shows:
- ₹200.00 → 500 shares
- ₹200.50 → 800 shares
- ₹201.00 → 1,200 shares
- ₹201.50 → 900 shares

a) How many shares execute at each price level?
b) What is the total cost of execution?
c) What is the average execution price?
d) What is the slippage vs the initial best ask?
e) Express slippage as a percentage of the expected price.

**Exercise 3.3 — SL vs SL-M Gap Risk**

You are long 200 shares of a mid-cap stock bought at ₹680.
You place SL Trigger: ₹650, Limit: ₹648.

The next morning, the company announces disappointing quarterly results after market hours. The stock opens at ₹601.

a) Does your SL order trigger? Why?
b) Does your limit order at ₹648 fill? Why?
c) What is your actual position status?
d) If you had used SL-M at ₹650 trigger instead, what would have happened?
e) At what approximate price would an SL-M likely have filled at open?

---

### Intermediate Exercises

**Exercise 3.4 — Queue Position Analysis**

A stock has 80,000 shares of limit buy orders at ₹500.00 at 10:30 AM.
You place a Limit BUY for 2,000 shares at ₹500.00 at 10:31 AM.

a) What is your queue position approximately?
b) Price dips to exactly ₹500.00 and 70,000 shares fill. Are you filled? Why?
c) Price then bounces to ₹502. Your order is still open at ₹500. What has happened to your queue position relative to remaining orders at ₹500?
d) You decide to modify your order from ₹500.00 to ₹500.10. What happens to your queue position?
e) What is the strategic implication of this for limit order placement near round numbers?

**Exercise 3.5 — Institutional Execution Strategy**

A mutual fund needs to buy 50 lakh shares of a mid-cap stock. The stock's ADV is 15 lakh shares.

a) Why would a single market order for 50 lakh shares be catastrophic for the fund?
b) Estimate market impact using: σ = 2%, ADV = 15 lakh shares, Order = 50 lakh shares.
c) If the fund splits into 10 sessions of 5 lakh shares each, re-estimate the per-session impact.
d) What combination of order types would a professional execution algo use?
e) What would this multi-session execution look like on a daily OHLCV chart? Would a VSA analyst be able to detect it?

**Exercise 3.6 — Order Type in Context**

You are a swing trader analysing Nifty 50 stock Hindustan Unilever (HUVR). You have identified:
- Key support: ₹2,380 (strong prior base)
- Stop level: ₹2,350 (below support, below which structure breaks)
- Target: ₹2,500 (prior swing high)
- Current price: ₹2,420

Design the complete order sequence using appropriate order types for:
a) Entry order
b) Stop-loss order
c) Target/profit order

Justify each choice. Calculate the risk-reward ratio.

---

### Advanced Exercises

**Exercise 3.7 — The SL Cascade Mechanism**

A large-cap stock has been consolidating between ₹800–₹850 for 3 weeks. The support at ₹800 is widely known. Most retail traders who bought in this range have placed their SL orders at ₹795–₹798.

a) What type of orders are these retail stop-losses likely to be: Market or Limit?
b) When price briefly dips to ₹793, what cascade of events occurs?
c) What does this look like on the OHLCV chart (volume, spread, close location)?
d) If the stock then recovers to ₹815 within 2 sessions, what VSA pattern has occurred?
e) What was the professional participant doing during the dip to ₹793?
f) How should you modify your stop-loss placement strategy based on this understanding?

**Exercise 3.8 — IOC and HFT Volume**

During the first 15 minutes of trading (9:15–9:30 AM), a Nifty 50 stock trades 8 lakh shares. The average first-15-minute volume is 2 lakh shares.

a) What participant types are most active in the opening 15 minutes on NSE?
b) What proportion of this volume might be HFT market-making (IOC-based)?
c) If you apply VSA to the 9:15–9:30 AM bar, what caveat must you apply to the volume reading?
d) When would this opening bar's volume be genuinely informative about directional intent?
e) What additional data would you check before interpreting the opening bar's volume?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** What is the fundamental trade-off that applies to all order types?

**Q2.** A Market Order guarantees execution but not price. Explain precisely why the execution price of a large market order differs from the best ask at the time of placement.

**Q3.** Explain the difference between an SL (Stop-Loss Limit) and an SL-M (Stop-Loss Market) order. Under what condition does SL fail to protect a trader?

**Q4.** What is queue position, and why does it matter for limit order execution?

**Q5.** What happens to a Limit Order's queue position when you modify its price on NSE?

**Q6.** An IOC order for 5,000 shares is placed at ₹500 when only 2,000 shares are available at ₹500 or below. What executes? What happens to the remaining 3,000 shares?

**Q7.** A GTT order is described as a "broker-level" order, not a "native exchange order." What is the practical risk this introduces compared to a live exchange order?

**Q8.** Why do HFT firms predominantly use IOC orders rather than regular limit orders? What does this mean for the stability of displayed liquidity in the order book?

**Q9.** Explain why retail stop-losses clustered at obvious levels (round numbers, prior lows) represent a vulnerability that professional traders can exploit — and describe the mechanism through which this exploitation creates a specific VSA pattern.

**Q10.** A trader says: "I always use limit orders because I don't want to pay extra." Identify two specific scenarios where this strategy is dangerous and a market order would be the professionally correct choice.

---

### Chart Scenario Questions (5)

**S1.** You observe that a mid-cap stock dropped from ₹380 to ₹340 in a single session on volume 8x the average, then recovered to ₹370 the next session on volume 4x average. Given your understanding of SL-M order cascades:
- What might have caused the sharp drop?
- Why did volume remain elevated on the recovery day?
- What VSA pattern has formed?
- What is the trading implication?

**S2.** In the NSE market depth for a stock trading at ₹200, you see a bid wall of 5,00,000 shares at ₹195. Price is declining slowly. As price approaches ₹196, the 5,00,000 share bid wall disappears from the book.
- What happened?
- What does this tell you about the "support" at ₹195?
- How should you revise your analysis?
- What happens to price likely next?

**S3.** An FII needs to sell 20 lakh shares of a Nifty 50 stock. The ADV is 40 lakh shares.
- Describe the execution strategy they would likely use.
- Over what time period?
- What would the OHLCV chart signature look like?
- At what point would a VSA analyst begin to suspect distribution?

**S4.** During a sharp market decline, you hold a 5-lot Nifty futures position from 19,500. Current Nifty: 19,100 and falling fast. You have an SL set at 19,000 (Trigger 19,000, Limit 18,990).
- Nifty touches 18,980 briefly and then bounces to 19,050. Did your SL trigger? Did it fill?
- Re-evaluate your order setup. What would have been better?
- What should you do now?

**S5.** At a key resistance level of ₹500, you observe via Level 2 data a large ask wall of 10,00,000 shares. Price tries to break above ₹500 three times but fails. On the fourth attempt, the price sweeps through ₹500 on 3x average volume.
- What happened to the ask wall?
- Classify: Was this a genuine breakout or potentially an upthrust?
- What additional data from OHLCV would help classify it?
- What order types were likely involved in the breakout move?

---

### Numerical Exercises (5)

**N1.** Calculate slippage for a market SELL of 4,000 shares given bid side:
- ₹150.00 → 500 sh
- ₹149.50 → 1,000 sh
- ₹149.00 → 1,500 sh
- ₹148.50 → 2,000 sh
Find: (a) Average fill price, (b) Slippage vs best bid, (c) Total slippage cost in ₹.

**N2.** A trader buys 1,000 shares at a Market Order average fill of ₹252.30. They later sell at a Market Order average fill of ₹264.80. Bid-ask spread at time of exit was ₹0.40.
Calculate: (a) Gross profit per share, (b) Net profit after round-trip spread cost.

**N3.** An SL order is set: Trigger ₹480, Limit ₹478. The stock gaps from ₹495 to ₹462 on results.
(a) Does the trigger activate? (b) Does the limit fill? (c) What is the additional unprotected loss vs the intended SL?

**N4.** A fund applies the square-root model: σ = 1.5%, ADV = 25 lakh shares.
(a) Impact for a 2.5 lakh share order (in one session).
(b) Impact for the same 2.5 lakh shares split across 5 sessions (0.5 lakh/session).
(c) What is the saving in impact cost per share if the price is ₹1,200?

**N5.** You place a Limit BUY at ₹300.00 when 60,000 shares are already queued at ₹300.00. Price falls to ₹300.00 and the following executes at that level: 55,000 shares over 3 minutes, then price bounces.
(a) How many shares of your order filled?
(b) If you had placed at ₹300.10 instead (assuming 5,000 shares were queued there), would you have filled?

---

## QUIZ ANSWERS

### Conceptual Answers

**A1.** Execution certainty vs price certainty. A Market Order guarantees execution but not price. A Limit Order guarantees price (or better) but not execution.

**A2.** A large market order consumes available liquidity level by level — after the best ask is exhausted, the order continues filling at progressively higher price levels. The average execution price is therefore a volume-weighted average across all consumed levels, which is higher than the initial best ask.

**A3.** SL (Limit): Trigger activates a limit order at a specified price. The limit may not fill if price gaps through the limit. SL-M: Trigger activates a market order, guaranteeing execution at whatever price is available. SL fails when price gaps below the limit price — the order is live but the limit is above current market price, so no fill occurs.

**A4.** Queue position is your rank in the line of orders at the same price level. Price-time priority means orders placed earlier get filled first. If many shares are ahead of yours in the queue, you may not be filled even if price trades at your level.

**A5.** Modifying a limit order's price typically results in the original order being cancelled and a new order entered at the new price. This resets your time priority — you move to the back of the queue at the new price level.

**A6.** 2,000 shares execute at ₹500 or below. The remaining 3,000 shares are immediately cancelled. No unfilled portion waits in the queue.

**A7.** GTT orders sit on the broker's servers, not the exchange. Risks include: broker system downtime causing missed triggers; internet connectivity issues; broker insolvency; delays between trigger and order placement (during which price may move). A live exchange order is directly on the exchange matching engine with no intermediary delay.

**A8.** IOC orders are cancelled immediately if not filled, so they leave no residual order in the book. This allows HFT to participate without accumulating risk from unfilled orders. The implication for displayed liquidity: large quantities visible in the order book can vanish in milliseconds if HFT cancels, meaning the book's "depth" is often overstated and unreliable as a support/resistance indicator.

**A9.** When price approaches a level where many SL-M orders cluster (below a well-known support), they all trigger simultaneously, creating a cascade of market sell orders. These sweep the bid side, causing a rapid price drop below support. This is visible as a high-volume down bar that breaks support and then recovers quickly. The recovery occurs because professional participants absorb the panic selling. VSA calls this a Shakeout or Spring — a deliberate or opportunistic flush of weak holders.

**A10.** (1) Fast-moving breakout: A limit order may not fill if price runs away from your level; the cost of missing the trade exceeds the cost of market order slippage. (2) Exiting a losing position in a volatile/thin market: A limit order may not fill when price is moving sharply against you, extending your loss beyond the intended stop.

---

### Numerical Answers

**N1.**
```
500 @ ₹150.00 = ₹75,000
1,000 @ ₹149.50 = ₹1,49,500
1,500 @ ₹149.00 = ₹2,23,500
1,000 @ ₹148.50 = ₹1,48,500
Total: 4,000 shares for ₹5,96,500

Average fill: ₹5,96,500 / 4,000 = ₹149.125
Slippage vs best bid (₹150.00): ₹0.875 per share
Total slippage cost: ₹0.875 × 4,000 = ₹3,500
```

**N2.**
```
Gross profit per share: ₹264.80 − ₹252.30 = ₹12.50
Round-trip spread cost: ₹0.40 (exit spread)
Entry spread (market order): assume similar ₹0.40
Total round-trip spread: ~₹0.80
Net profit after spread: ₹12.50 − ₹0.80 = ₹11.70 per share
```

**N3.**
```
(a) Yes — trigger of ₹480 is "hit" as price moved through it during the gap
(b) No — limit of ₹478 is above current market price of ₹462
(c) Additional unprotected loss = ₹478 (intended fill) − ₹462 (current price) = ₹16/share
    On 1,000 shares: ₹16,000 of unprotected loss beyond intended SL
```

**N4.**
```
(a) One session: 1.5% × √(2,50,000/25,00,000) = 1.5% × √0.10 = 1.5% × 0.316 = 0.47%
(b) Per session (0.5 lakh): 1.5% × √(50,000/25,00,000) = 1.5% × √0.02 = 1.5% × 0.141 = 0.21%
    Total impact across 5 sessions is still 0.21% per session (each session independently)
(c) Saving = (0.47% − 0.21%) × ₹1,200 = 0.26% × ₹1,200 = ₹3.12/share
    For 2.5 lakh shares: ₹3.12 × 2,50,000 = ₹7,80,000 saved by splitting across sessions
```

**N5.**
```
(a) 55,000 shares filled before price bounced. You were at position 60,001 in queue.
    55,000 < 60,000 (ahead of you) → Zero shares of your order filled.
(b) At ₹300.10 with 5,000 shares ahead: if 5,000+ shares traded at ₹300.10,
    you would have partially or fully filled. Yes — more likely to have filled.
```

---

## KEY TAKEAWAYS — CHAPTER 3

> **1. Every order type trades off execution certainty for price certainty. Market Order = guaranteed fill, uncertain price. Limit Order = certain price, no fill guarantee.**

> **2. SL (Limit) orders can fail to protect in gap scenarios. SL-M guarantees exit but not exit price. For overnight/positional trades in volatile stocks: SL-M is safer.**

> **3. Modifying a Limit Order's price resets queue position. Never modify a limit at the last moment hoping to jump the queue — you move to the back.**

> **4. Clustered retail SL-M orders at obvious levels create stop cascades — the mechanical origin of Shakeout/Spring patterns in VSA and Wyckoff.**

> **5. HFT uses IOC orders extensively, creating high cancellation ratios and unstable displayed liquidity. The order book depth is guidance, not a guarantee.**

> **6. Institutional execution is deliberately slow and spread across multiple sessions to minimise market impact — this is the mechanical explanation for multi-session Wyckoff accumulation patterns.**

> **7. Slippage is a real cost. Backtesting without accounting for slippage produces overstated results. Always model slippage realistically for your position sizes and target instruments.**

---

*Chapter 3 Complete.*

---

**Previous:** [← Chapter 2 — Price Formation](./price-formation.md)
**Next:** [Chapter 4 — Order Book →](./order-book.md)

*When ready, say: **"NEXT CHAPTER"***
