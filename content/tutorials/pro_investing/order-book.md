# Chapter 4 — Order Book (Market Depth)

> **Course:** NSE/BSE Professional Volume + Price Action + VSA + Wyckoff + Market Microstructure
> **Part:** II — Order Types & Market Microstructure
> **Prerequisite:** Chapters 2 (Price Formation), 3 (Order Types)

---

## Chapter Overview

The order book is the real-time record of every unfilled limit order on an exchange — the complete queue of buyers waiting to buy and sellers waiting to sell. It is the most direct window into the **present supply and demand structure** of any instrument.

Most retail traders never look at it. Most who do, misread it.

This chapter teaches you to read the order book correctly — what it reveals, what it conceals, and how it connects to every candle on your chart.

---

## LEVEL 1 — BEGINNER

### 4.1 What the Order Book Contains

The order book is a live database maintained by the NSE matching engine. It contains every **resting limit order** that has been submitted but not yet executed.

**What is in the order book:**
- Every limit buy order (price + quantity + time submitted)
- Every limit sell order (price + quantity + time submitted)
- Organised by price level, with time priority within each level

**What is NOT in the order book:**
- Market orders (they execute immediately and never rest)
- IOC orders that didn't fill (cancelled instantly)
- Orders from previous days (all Day orders cancelled at end of session)
- GTT orders (broker-level, not yet submitted to exchange)
- Hidden/iceberg order quantities (only the displayed slice appears)

**The order book is constantly changing:**

At any moment:
- New limit orders are being added (placing orders)
- Existing orders are being removed (cancellations)
- Orders are being consumed (executions)

In a liquid stock like Reliance or Nifty futures, the order book changes thousands of times per second.

---

### 4.2 Level 1 Data — What Most Retail Traders See

**Level 1** is the minimum market data — showing only the best bid and best ask:

```
RELIANCE
Best Bid: ₹2,799.50 (2,300 shares)
Best Ask: ₹2,800.00 (1,800 shares)
Spread:   ₹0.50
LTP:      ₹2,799.75
```

**What Level 1 tells you:**
- The price at which you can buy RIGHT NOW (Best Ask)
- The price at which you can sell RIGHT NOW (Best Bid)
- The immediate cost of trading (Spread)
- The price of the most recent trade (LTP)

**What Level 1 does NOT tell you:**
- How much depth exists beyond the best bid/ask
- Whether there are large orders lurking below the surface
- Whether the displayed quantities are genuine or will be cancelled

Most retail charting platforms display only Level 1 (or nothing at all — just the candle data). This is why OHLCV-only analysis is necessarily incomplete.

---

### 4.3 Level 2 Data — Market Depth on NSE

![Anatomy of the NSE Order Book — Level 1 vs Level 2 Market Depth](/images/pi-order-book-anatomy.jpg)

**Level 2** shows multiple price levels on both sides of the book — giving a picture of depth beyond the best bid/ask.

**NSE Market Depth availability:**

| Data Level | Depth | Availability |
|-----------|-------|-------------|
| Level 1 | Best bid/ask only | All brokers, free |
| Level 2 (5 levels) | 5 bid + 5 ask price levels | Most brokers (Zerodha, Upstox etc.) — free |
| Level 2 (20 levels) | 20 bid + 20 ask price levels | NSE co-location or premium data feeds |
| Full book | All orders | Only exchange members with direct access |

**Reading the Level 2 screen (5-level example for RELIANCE):**

**ASK (SELL) SIDE — prices above market (red):**

| Price | Quantity | Orders |
|-------|---------|--------|
| ₹2,802.00 | 12,400 | 8 |
| ₹2,801.50 | 8,600 | 5 |
| ₹2,801.00 | 6,200 | 4 |
| ₹2,800.50 | 3,800 | 3 |
| **₹2,800.00** | **1,800** | **2** ← Best Ask |

*— SPREAD GAP (₹0.50) —*

**BID (BUY) SIDE — prices below market (green):**

| Price | Quantity | Orders |
|-------|---------|--------|
| **₹2,799.50** | **2,300** | **3** ← Best Bid |
| ₹2,799.00 | 5,100 | 6 |
| ₹2,798.50 | 9,700 | 9 |
| ₹2,798.00 | 14,500 | 12 |
| ₹2,797.50 | 21,000 | 18 |

**Reading the columns:**
- **Price:** The limit price at this level
- **Quantity:** Total shares offered/bid across ALL orders at this price
- **Orders:** Number of separate limit orders at this price (multiple participants)

**Key observation from the example above:**
- Ask side is **thin near the top** (1,800 at best ask) and thickens above (12,400 further up)
- Bid side is **thick further below** (21,000 at ₹2,797.50) and thin near the top (2,300 at best bid)
- This is a typical "normal market" shape — increasing depth further from the current price

---

### 4.4 Bid Size, Ask Size, and Cumulative Depth

**Individual price level reading:**

```
At ₹2,799.00 (second bid level):
- 5,100 shares across 6 orders
- This means: Multiple participants have resting limit buys at ₹2,799
- Average order size: 5,100 ÷ 6 = 850 shares per order
```

**Cumulative depth (reading the "pressure"):**

```
Total bid depth from ₹2,797.50 to ₹2,799.50:
2,300 + 5,100 + 9,700 + 14,500 + 21,000 = 52,600 shares

Total ask depth from ₹2,800.00 to ₹2,802.00:
1,800 + 3,800 + 6,200 + 8,600 + 12,400 = 32,800 shares
```

**What this cumulative imbalance means:**
- 52,600 shares of visible bid depth vs 32,800 shares of ask depth
- More visible buying interest than selling interest in this range
- INFERENCE (not fact): Buying pressure may be greater — but ask side may have more hidden depth

**CRITICAL WARNING:** Cumulative depth can be misleading because:
1. Orders can be cancelled before price reaches them
2. Hidden orders may exist on the ask side
3. HFT orders create artificial depth that vanishes milliseconds before price touches them

---

## LEVEL 2 — INTERMEDIATE

### 4.5 Price-Time Queue — Who Gets Filled First

The matching within a price level follows strict **price-time priority**:

```
Price Level: ₹2,799.00 (6 orders, total 5,100 shares)

Queue (in time order):
Position 1: Order placed 09:18:42 — 500 shares
Position 2: Order placed 09:23:15 — 1,000 shares
Position 3: Order placed 09:31:07 — 800 shares
Position 4: Order placed 10:02:33 — 900 shares
Position 5: Order placed 10:45:19 — 1,200 shares
Position 6: Order placed 11:03:28 — 700 shares
                           Total: 5,100 shares

When price falls to ₹2,799.00 and 1,800 shares are sold:
Position 1 fills completely: 500 shares ✅
Position 2 fills completely: 1,000 shares ✅
Position 3 fills partially: 300 shares ✅ (300 of 800)
Position 4-6: Still waiting ⏳
```

**Implications for trading practice:**

**1. Round number clustering:**
Round numbers like ₹500, ₹1,000, ₹2,800 tend to have many limit orders. Being at position 30,000 in a queue means you likely won't fill unless price trades significantly through your level.

**2. The "market memory" effect:**
After price bounces from ₹2,799, the remaining unfilled orders at that level are still in the queue. If price returns, those same orders (now with even longer queue seniority) are first in line. This is one mechanical reason why "tested" support levels sometimes hold on the second approach — the surviving order queue is the same committed buyers from the first test.

**3. Partial fill management:**
When a limit order is only partially filled (like Position 3 above), the unfilled portion remains in the queue with its original time stamp. You are NOT re-queued. This is why partial fills preserve queue position for the remaining quantity.

---

### 4.6 Order Matching Mechanics — Step by Step

**Continuous session matching algorithm (NSE NEAT):**

```
STEP 1: Incoming order arrives at the exchange matching engine

STEP 2: System checks: Is this a Market Order or Limit Order?

STEP 3 (Market Order path):
→ System scans opposite side for best available price
→ Matches at best price, then next best, until order is fully filled
→ No resting order is created — order executes immediately

STEP 4 (Limit Order path):
→ System checks: Does an opposite resting order exist at this
  price or better?
→ YES: Execute immediately (partial or full)
→ NO: Add to order book at specified price, join the queue

STEP 5: Trade confirmation generated
→ Both counterparties receive execution report
→ Trade data (price, quantity, time) sent to market data feed
→ This data is aggregated into the OHLCV candle you see on your chart
```

**The OHLCV connection:**

Every single trade that occurs through the matching engine contributes to your candlestick data:
- The first trade of the session = Open price
- The highest trade price in the session = High
- The lowest trade price in the session = Low
- The last trade before session close = Close
- The sum of all trade quantities = Volume

Your candle is the **statistical summary** of potentially thousands of individual order book interactions.

---

### 4.7 Order Cancellation and Replenishment

**Cancellation rates on NSE:**

SEBI has observed that in some HFT-active stocks, the order-to-trade ratio (OTR) — the number of orders placed per trade executed — can exceed 50:1. This means for every trade that occurs, 50 orders are placed and cancelled.

**Types of cancellations:**

**1. Manual cancellation:**
- Participant changes their mind, removes order
- Common in fast-moving markets where limit orders placed at "good prices" are cancelled as the price moves away

**2. System cancellation (end of day):**
- All unfilled Day orders are automatically cancelled at market close
- This creates a "clean slate" for the order book each morning

**3. Algo/HFT cancellation:**
- The dominant form of cancellation in liquid stocks
- Orders placed and cancelled within milliseconds as market conditions change

**4. Price modification = cancel + re-enter:**
- As discussed in Chapter 3, modifying a limit order's price is mechanically a cancellation + new order
- Queue position resets

**Replenishment — the other side:**

When orders are consumed, new orders must replenish the book for trading to continue. In a liquid stock:
- Market makers continuously post new limit orders after theirs are executed
- Other participants see price at a certain level and place new limit orders

In a thin stock with limited participation, the book may not replenish quickly after large orders consume it — creating rapid price moves on relatively small volume.

---

### 4.8 Displayed Liquidity vs Hidden Liquidity (Iceberg Orders)

![Displayed vs Hidden Liquidity — What the Order Book Cannot Show You](/images/pi-displayed-vs-hidden-liquidity.jpg)

This is one of the most important — and least understood — aspects of the order book.

**Types of liquidity:**

**1. Displayed Liquidity:**
- Fully visible in the order book
- Any participant can see it in Level 2 data
- Examples: Normal limit orders

**2. Hidden (Dark) Liquidity — Iceberg Orders:**
- The participant specifies a total quantity but only displays a small "tip"
- Once the visible tip is consumed, the next slice automatically appears
- Used by large participants who do not want to reveal their full order size

```
Example:
Institution wants to buy 1,00,000 shares at ₹500.
They do NOT want the market to see 1,00,000 shares in the bid.
(Why? Because others would see it and move price up before they fill)

They place an Iceberg order: 1,00,000 total, show only 2,000 at a time

What you see in Level 2: ₹500.00 — 2,000 shares (2 orders)
Reality: 1,00,000 shares is the actual order size

Sequence:
2,000 shares sell → 2,000 fill → Next 2,000 slice appears
2,000 more sell → fills → Next 2,000 appears
...this continues 50 times until 1,00,000 are filled.
```

**What iceberg orders look like on a chart:**

When a large iceberg bid is absorbing selling at a support level:
- Volume is elevated (constant selling being absorbed)
- Price barely moves despite continued selling (supply being soaked up)
- The order book shows a deceptively small bid size — but it keeps refreshing

This is the precise mechanical description of what VSA calls **Stopping Volume** and what Wyckoff calls **Preliminary Support (PS) or Selling Climax (SC)** — a large buyer absorbing all selling at a level using hidden orders.

**3. Phantom Liquidity (HFT-created):**
- Orders placed for milliseconds then cancelled
- Visible on Level 2 momentarily before disappearing
- Creates illusion of depth that does not exist when price reaches it
- Cannot be detected in standard retail Level 2 feeds (data latency masks it)

---

### 4.9 Liquidity Withdrawal — What It Looks Like

Liquidity withdrawal is when market makers or large limit order participants pull their quotes from the order book.

**When does it happen?**

1. **Before major news events** (RBI policy, earnings, Union Budget):
   - Market makers don't know which direction price will move
   - They don't want to be on the wrong side of a large move
   - They pull their limit orders → spread widens → book thins dramatically

2. **During fast market conditions:**
   - Sharp intraday moves where market makers can't update quotes fast enough
   - Book becomes one-sided → price gaps to find the next available level

3. **Circuit breaker or halt situations:**
   - NSE applies upper/lower circuits (5%, 10%, 20% for individual stocks)
   - At circuit limit, the book freezes — no orders can be placed on the triggered side

**What liquidity withdrawal looks like on your chart:**

```
Normal session:
Bar range ₹2-3, volume average → Bid-ask tight, normal book

Liquidity withdrawal event:
Bar range ₹25-30, volume 8x average → Book thin, wide bid-ask
Each market order sweeps multiple levels because
no new limit orders are replacing the consumed ones
```

This is why high-volume wide-range bars appear around major events — they are NOT necessarily institutional accumulation/distribution. They may simply be market impact from thin-book conditions.

**VSA rule:** Wide-spread bars on high volume during or immediately after news events require a different interpretation standard than the same pattern in normal market conditions.

---

### 4.10 What OHLCV Can and Cannot Reveal About the Order Book

This is the synthesis of Chapters 1–4, crystallised into a precise reference.

**What OHLCV DIRECTLY reveals (FACTS):**
- Price range of the session (High − Low = Range)
- Direction of net price movement (Close vs Open)
- Total shares traded (Volume)
- Close location relative to range
- Whether today's volume was above/below average (with RelVol calculation)

**What OHLCV allows you to INFER (must be labelled as INFERENCE):**
- Approximate degree of buying/selling aggression (inferred from spread + volume + close)
- Whether large participation occurred (inferred from volume vs average)
- Whether supply or demand was more aggressive (inferred from close location + volume)
- Whether a level was defended or abandoned (inferred from price reaction at level)

**What OHLCV CANNOT reveal (UNKNOWN from OHLCV alone):**

| Unknown | Why It's Unknown |
|---------|-----------------|
| Order book shape during session | Not recorded in OHLCV |
| Iceberg orders present | Hidden by design |
| Cancelled orders (HFT) | Never executed — not in trade data |
| Who placed orders | Anonymous execution |
| Market maker activity levels | Not in OHLCV |
| Number of distinct participants | Not in OHLCV |
| Limit order queue depth at any level | Not in OHLCV |

**The professional implication:**

When a VSA analyst says "the closing near the high on high volume shows demand," they are making an INFERENCE from OHLCV. That inference is based on the understanding that:
- High volume + close near high = buyers were aggressively taking liquidity upward
- The order book was absorbing supply as price moved up
- The selling (which always exists — Chapter 1) was not sufficient to hold price down

This is a useful, logical inference. It is not a certainty. Subsequent price action must confirm it.

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### Reading Order Book Dynamics — The Professional Layer

At the professional level, the order book is not read as a static snapshot but as a **dynamic, evolving flow of information**.

**Key dynamics to observe:**

**1. Book imbalance ratio:**

```
Imbalance = (Bid Depth − Ask Depth) / (Bid Depth + Ask Depth)

Example:
Bid depth (5 levels): 52,600 shares
Ask depth (5 levels): 32,800 shares

Imbalance = (52,600 − 32,800) / (52,600 + 32,800)
           = 19,800 / 85,400
           = +0.232 (positive = bid-heavy)

Range: +1.0 (all bids, no asks) to -1.0 (all asks, no bids)
Neutral: 0.0
```

A sustained positive imbalance suggests more visible buying interest. However:
- Ask-side iceberg orders are not visible → imbalance may be understated
- HFT can flip imbalance instantly by cancellation

**2. Bid/Ask wall detection:**

Large quantities at specific price levels relative to surrounding levels create "walls":

```
Ask side:
₹500.50 → 800 shares   (normal)
₹501.00 → 1,200 shares  (normal)
₹501.50 → 48,000 shares ← WALL (40x normal depth)
₹502.00 → 900 shares   (normal)

Interpretation:
A large seller has placed a significant limit sell at ₹501.50.
This wall will likely slow or stop price at that level.
```

**BUT — the critical caveat:**
- This wall can be cancelled before price reaches it → price would continue upward unimpeded
- If the wall is real, price absorbs it slowly on high volume → the wall is being "consumed"
- If price reaches ₹501.50 and the wall disappears (cancelled) → price gaps up → this is consistent with a "fake wall" used to mislead participants

**3. Order book "spoofing" — the illegal manipulation:**

SEBI explicitly prohibits market manipulation including spoofing (placing orders with intent to cancel before execution to mislead participants). FACT: SEBI has taken enforcement action against entities for spoofing on NSE/BSE.

From an analytical perspective:
- If a large wall consistently appears and disappears without being consumed → INFERENCE: it may be non-genuine liquidity
- If a large wall is progressively consumed by trades → INFERENCE: it is genuine and price will struggle to break through it

**4. Reading order book changes dynamically:**

Professional traders (and some algos) monitor:
- **Speed of book change:** How fast are orders being added/cancelled?
- **Which side is accelerating:** Is the bid side growing faster or the ask side?
- **Depth migration:** Is depth shifting from lower bid levels to the top bid level? (Suggests buyers becoming more aggressive)

This analysis requires real-time Level 2 data and cannot be done from standard retail platforms with delayed data.

---

### The Order Book and VSA — The Complete Connection

| VSA Pattern | Order Book Mechanism | How Book Confirms It |
|------------|--------------------|--------------------|
| Stopping Volume / SC | Large iceberg bid absorbing selling at a level | Ask side consumed repeatedly; bid wall holds |
| No Supply | Ask side thin, few sellers at current level | Very thin ask depth, small quantities |
| No Demand | Bid side thin, few buyers at current level | Very thin bid depth, small quantities |
| Spring / Shakeout | SL-M cascade + iceberg bid absorbing at new low | Sudden volume spike; book stabilises below prior support |
| Upthrust | Supply (ask wall) absorbs rally | Large ask wall consumed; price fails to sustain above |
| Test (of supply) | Volume probe of ask side on reduced volume | Low volume at ask; few sellers; price holds |
| SOS / Markup | Ask side swept repeatedly; no replenishment | Price moves through multiple ask levels with minimal resistance |
| SOW / Breakdown | Bid side swept repeatedly; no replenishment | Price moves through multiple bid levels; sellers aggressive |

**The most powerful insight:**

> VSA reads the OUTPUT of order book interactions from OHLCV. The order book reads the current STATE. Together, they give a more complete picture. Neither alone is sufficient for professional analysis.

---

### NSE's Unique Order Book Characteristics

**Tick size:**
- NSE equity cash segment: Minimum price movement = ₹0.05 for stocks above ₹20
- This means the spread minimum is ₹0.05 — creating very precise price levels

**Lot size in F&O:**
- F&O instruments have minimum lot sizes (e.g., Nifty = 75 units)
- Order book quantities in F&O are expressed in lots, not individual units
- This affects how "size" is interpreted at different price levels

**Circuit breaker interaction with order book:**

When a stock hits its daily circuit limit (e.g., 10% upper circuit):
- Order book on the buy side: May still have bids
- Order book on the sell side: No asks can be placed below the circuit price
- This creates a "one-sided book" situation
- Volume and price cannot be normally analysed in circuit-bound stocks

**Index constituent rebalancing:**

When Nifty/Sensex rebalances (additions/deletions, quarterly):
- Passive ETFs and index funds must buy the added stock and sell the deleted one
- This creates predictable, large order flow that is:
  - Forced (not directional)
  - Time-bound (executed near the effective date)
  - Visible in elevated delivery volume
- OHLCV on rebalancing days for affected stocks reflects this mechanical flow — VSA patterns on these days have reduced analytical value

---

## EXERCISES

### Beginner Exercises

**Exercise 4.1 — Reading Level 2 Data**

Given this market depth snapshot for a mid-cap stock:

**ASK SIDE (Red):**

| Price | Qty | Orders |
|-------|-----|--------|
| ₹342.50 | 8,600 | 6 |
| ₹342.00 | 5,200 | 4 |
| ₹341.50 | 3,100 | 3 |
| ₹341.00 | 1,400 | 2 |
| ₹340.50 | 600 | 1 |

**BID SIDE (Green):**

| Price | Qty | Orders |
|-------|-----|--------|
| ₹340.00 | 900 | 2 |
| ₹339.50 | 2,800 | 4 |
| ₹339.00 | 5,500 | 7 |
| ₹338.50 | 9,200 | 10 |
| ₹338.00 | 15,000 | 16 |

Answer:
a) What is the best bid price and quantity?
b) What is the best ask price and quantity?
c) What is the spread?
d) If you place a Market BUY for 2,500 shares, at which price levels do you execute and how many shares at each?
e) Calculate cumulative bid depth and cumulative ask depth across all 5 levels.
f) Calculate the book imbalance ratio.
g) Which side appears stronger based on visible depth? Is this conclusive? Why or why not?

**Exercise 4.2 — Queue Position Scenario**

At 11:30 AM, the following orders are queued at ₹339.50:
- Order A (09:15:22): 800 shares
- Order B (09:43:11): 1,200 shares
- Order C (10:15:09): 400 shares
- Order D (11:28:54): 400 shares (your order)

Price falls to ₹339.50. Exactly 2,400 shares are sold at this level before price recovers.

a) In what order do the queue positions fill?
b) How many shares of your order (D) fill?
c) What happens to the unfilled portion?
d) If you had placed your order at 9:14 AM (before the market opened), how would your queue position change?

**Exercise 4.3 — Iceberg Detection**

A stock has been bouncing repeatedly off the ₹200 support level. You observe the following over 5 sessions:

| Session | Volume at ₹200 level | Bid qty shown at ₹200 | Bounce? |
|---------|--------------------|--------------------|---------|
| Day 1 | 1.2 lakh shares | 5,000 | Yes |
| Day 2 | 1.8 lakh shares | 4,200 | Yes |
| Day 3 | 2.1 lakh shares | 6,100 | Yes |
| Day 4 | 1.5 lakh shares | 5,800 | Yes |
| Day 5 | 0.8 lakh shares | 3,200 | No — breaks ₹200 |

a) Over Days 1–4, what is the discrepancy between the visible bid quantity and the volume that traded at ₹200?
b) What does this discrepancy suggest?
c) On Day 5, volume is lower AND the level breaks. What might this indicate about the iceberg order?
d) Classify each of the following: the observation, the inference, the hypothesis, the unknown.

---

### Intermediate Exercises

**Exercise 4.4 — Order Book Dynamics**

A stock is trading at ₹500. The Level 2 shows a large ask wall of 80,000 shares at ₹503. Over the next 30 minutes:

**Scenario A:** Price gradually rises from ₹500 to ₹503. At ₹503, volume is 6x average for 3 consecutive 5-minute bars. The price then falls back to ₹500.

**Scenario B:** Price rises from ₹500 toward ₹503. At ₹502.50, the 80,000-share ask wall disappears. Price immediately jumps to ₹506 on high volume.

For each scenario:
a) What happened to the ask wall?
b) What does this tell you about the nature of the wall?
c) What VSA pattern has occurred in each scenario?
d) What is the trading implication?

**Exercise 4.5 — Liquidity Withdrawal Analysis**

A Nifty 50 stock's Level 2 depth 1 hour before RBI policy announcement vs 1 hour after:

| Metric | 1 hour BEFORE RBI | 1 hour AFTER RBI |
|--------|------------------|-----------------|
| Best Bid | ₹1,800.00 (5,000 sh) | ₹1,820.00 (8,500 sh) |
| Best Ask | ₹1,800.50 (4,500 sh) | ₹1,820.50 (7,200 sh) |
| Spread | ₹0.50 | ₹0.50 |
| 5-level bid depth | 3,500 | 42,000 |
| 5-level ask depth | 3,200 | 38,000 |
| Average bar range | ₹12/bar | ₹4/bar |

a) What happened to book depth around the RBI announcement?
b) Price moved from ₹1,800 to ₹1,820 during the announcement. Was this 1.1% move on thin or normal liquidity?
c) How should a VSA analyst treat the volume and range of bars DURING the RBI announcement vs bars 1 hour after?
d) The volume during the announcement was 8x average. Is this VSA-comparable to a normal 8x volume day? Why not?

**Exercise 4.6 — Cumulative Depth Interpretation**

Calculate and analyse:

Level 2 snapshot for HDFC Bank:
- Ask side: 800, 1,600, 3,400, 5,800, 9,500 shares at 5 levels
- Bid side: 500, 900, 2,100, 4,200, 7,800 shares at 5 levels

a) Total cumulative ask depth (5 levels)?
b) Total cumulative bid depth (5 levels)?
c) Book imbalance ratio?
d) The bid side has a large iceberg order at the best bid that is NOT visible. The actual hidden quantity is 25,000 shares. Recalculate the true imbalance.
e) What does this exercise teach you about relying on visible depth alone?

---

### Advanced Exercises

**Exercise 4.7 — Spoofing Detection Logic**

You are monitoring the Level 2 screen for a mid-cap stock. Over 20 minutes you observe:

```
10:15:00 — Large ask wall of 50,000 shares appears at ₹285
10:15:30 — Price approaches ₹283 (below the wall, but fear visible)
10:16:00 — Wall disappears
10:16:02 — Price jumps to ₹288 immediately
10:17:00 — New large ask wall of 50,000 shares appears at ₹292
10:18:00 — Price approaches ₹289
10:18:30 — Wall disappears again
10:18:32 — Price jumps to ₹294

Pattern repeats 4 more times over 20 minutes.
```

a) What pattern is emerging?
b) What might be the intent of the entity placing and cancelling these walls?
c) SEBI specifically prohibits this type of activity. What is the regulatory term for it?
d) What is the effect on other market participants who see these walls?
e) How should you adapt your analysis when you suspect this type of activity?

**Exercise 4.8 — The Complete Order Book → OHLCV Translation**

Walk through exactly how the following sequence of order book interactions creates the OHLCV data:

```
9:15:00 — Opening price set at ₹500 by pre-open call auction
9:15:01 — Market BUY 2,000 shares sweeps to ₹501.50 [first trade of continuous]
9:15:05 — Limit SELL 5,000 shares placed at ₹503 (wall)
9:16:12 — Market SELL 1,000 shares hits bid at ₹500.50
9:16:45 — Market BUY 3,000 shares sweeps to ₹502.50
9:17:22 — Limit BUY 10,000 shares placed at ₹498 (large bid wall below)
... [many more orders through the session] ...
3:29:45 — Last trade: 500 shares at ₹504.80
3:30:00 — Session closes
```

After a full session, assuming:
- Highest trade: ₹507.30
- Lowest trade: ₹497.80
- Opening trade (continuous): ₹501.50
- Last trade (closing call): ₹504.80
- Total volume: 25 lakh shares

a) What are the O, H, L, C, V values for this session's candle?
b) What does the candle look like visually (describe shape and position of close)?
c) What order book dynamics does the candle reflect?
d) Can you determine from the candle alone: whether the 10,000-share bid wall held, whether the 5,000-share ask wall at ₹503 was consumed, or what the book looked like at any point intraday?
e) Classify what you CAN know from the candle vs what requires the order book data.

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** What exactly does the order book contain? Name two types of orders that are NOT in the order book and explain why.

**Q2.** What is the difference between Level 1 and Level 2 market data? What additional insight does Level 2 provide?

**Q3.** How are the "Qty" and "Orders" columns in a Level 2 screen different? If a level shows 5,000 shares across 20 orders, what is the average order size, and what does that suggest about participation?

**Q4.** Explain the price-time priority rule within a price level. Give a specific example of how queue position affects fill probability.

**Q5.** What is an iceberg order? Why do large participants use them, and how does their presence distort the apparent order book depth?

**Q6.** What is phantom liquidity, and how does HFT create it? Why can't retail participants with standard Level 2 data screens detect it?

**Q7.** Explain what "liquidity withdrawal" means and when it typically occurs on NSE. What does it look like on a candlestick chart?

**Q8.** A large ask wall of 1,00,000 shares appears at ₹500. Price rallies to ₹500 and then immediately falls back. Subsequently, the same wall disappears and price jumps to ₹510. What are the two different interpretations of what happened to the wall?

**Q9.** What is the "book imbalance ratio" and how is it calculated? What are its limitations as an analytical tool?

**Q10.** Complete this statement precisely: "OHLCV tells you the [_] of order book interactions during a session. It does NOT tell you the [_] at any specific moment, the [_] of any participant, or whether [_] were genuine."

---

### Chart Scenario Questions (5)

**S1.** A Nifty 50 stock shows 15 consecutive sessions of high-volume (2–3x average) trading in a tight ₹10 price range between ₹800 and ₹810. The close each day is near the middle of the range. Delivery percentage is 68% (average: 30%).

Using order book reasoning:
- What type of order book interaction could sustain this pattern for 15 sessions?
- What type of hidden liquidity might be involved?
- What VSA/Wyckoff pattern does this resemble?
- What would confirm or invalidate your hypothesis?

**S2.** During an intraday session, a mid-cap stock's Level 2 shows a progressively thinning bid side over 2 hours, while the ask side remains stable. Price is trading sideways but the bid depth goes from 50,000 total to 8,000 total shares across 5 levels.

- What does bid-side thinning indicate?
- Is this visible on the daily OHLCV chart?
- What might be happening to participant behaviour?
- If price then falls sharply on a volume spike, is this expected given the order book context?

**S3.** You observe a stock at NSE with a daily OHLCV:
- Open ₹250, High ₹268, Low ₹242, Close ₹264
- Volume: 4.8x average, Delivery: 71%

List FOUR different order book scenarios that could have produced this exact OHLCV reading. For each scenario, classify the VSA interpretation and state whether the interpretation is bullish, bearish, or neutral.

**S4.** A Nifty 50 stock gaps up 3% at open. The Level 2 screen immediately after open shows:
- Ask depth: 850 shares across 5 levels (extremely thin)
- Bid depth: 48,000 shares across 5 levels (very deep)

By 9:45 AM the Level 2 shows:
- Ask depth: 32,000 shares (normal)
- Bid depth: 28,000 shares (normal)

- What happened between open and 9:45 AM to normalise the book?
- Why was the ask side thin immediately after open?
- Is the 9:15–9:30 AM volume on the gap day comparable in VSA terms to volume during the rest of the session?

**S5.** An analyst uses Level 2 data to predict support: "80,000 shares at ₹480 on the bid — this is strong support, I'll buy here." The stock falls to ₹481, the 80,000-share bid disappears, and price drops to ₹465.

- What happened?
- What was wrong with the analyst's reasoning?
- How should order book data be incorporated into analysis without making this error?
- What additional evidence should have been required before acting on the visible depth?

---

## QUIZ ANSWERS

### Conceptual Answers

**A1.** The order book contains all resting limit orders — limit buys (bids) and limit sells (asks) that have been submitted but not yet executed, organised by price level with time priority within each level. NOT in the order book: (1) Market orders — they execute immediately on arrival and never rest in the book. (2) Hidden portions of iceberg orders — only the displayed slice appears; the full quantity is concealed by design.

**A2.** Level 1 shows only the best bid and best ask (top of book). Level 2 shows multiple price levels on both sides — typically 5 or 20 levels on NSE. Level 2 provides: depth of supply and demand beyond the current price, the number of orders at each level, and a view of how much liquidity exists within a price range, enabling better assessment of support/resistance strength and potential slippage.

**A3.** "Qty" = total shares from ALL orders combined at that price level. "Orders" = number of individual limit orders. Average order size = 5,000 ÷ 20 = 250 shares. Twenty orders averaging 250 shares suggests predominantly retail/small participation at this level — no single large institutional order appears to dominate.

**A4.** Within a price level, earlier-placed orders fill before later ones. Example: If 50,000 shares are queued at ₹300 and 40,000 are ahead of your 5,000-share order, only 10,000 shares remain to fill when price hits ₹300. Your order gets partial fill (5,000 of 5,000 only if 45,000+ total fill). If price bounces before 45,000 shares fill at ₹300, your order doesn't fill at all.

**A5.** An iceberg order shows only a small "tip" in the order book while hiding the full quantity. Example: 1,00,000 total shares, showing 2,000 at a time. When 2,000 fill, another 2,000 appear — until the total is consumed. Participants use them to avoid revealing large orders that would move price against them. Their presence means visible depth understates true liquidity — the book appears thinner than it really is, while actual buying/selling support at a level is much larger.

**A6.** Phantom liquidity is created when HFT firms place limit orders that are cancelled before any other participant can trade against them. At co-location speeds (sub-millisecond), HFT can place and cancel orders faster than any retail participant's Level 2 screen can update. By the time the screen shows the order, it is already cancelled. Retail Level 2 data has latency of tens to hundreds of milliseconds — far too slow to see true HFT order flow.

**A7.** Liquidity withdrawal is when market makers and large limit order providers cancel their resting orders, leaving the book thin. Occurs typically before major news events (RBI, earnings, Budget) when uncertainty is high and being on the wrong side of an informed trade is costly. On a candlestick chart: wide-range bars (price sweeps through multiple thin levels), high volume (each trade has large market impact on thin book), spread expansion.

**A8.** Interpretation 1 — The wall was genuine: 1,00,000 shares of real sellers existed at ₹500. Price rallied into this supply, which absorbed the rally and pushed price back down. The supply was eventually moved to a higher level. Interpretation 2 — The wall was fake (cancelled): The wall was placed to create a false impression of supply resistance. Once price was pushed away from ₹500 by other sellers, the wall was cancelled as it had served its purpose (or the entity simply repositioned). The jump to ₹510 after wall disappearance is consistent with interpretation 2.

**A9.** Book imbalance = (Bid depth − Ask depth) / (Bid depth + Ask depth). Range: −1 to +1. Limitations: (1) Iceberg orders distort true depth — ask side may have hidden orders not shown. (2) HFT orders can flip imbalance in milliseconds. (3) Imbalance at Level 2 (5 levels) covers only a small price range — deeper orders at wider price ranges are not included. (4) Cancellations make point-in-time imbalance readings unreliable.

**A10.** "OHLCV tells you the **statistical summary** of order book interactions during a session. It does NOT tell you the **state of the book** at any specific moment, the **identity or intent** of any participant, or whether **large visible orders (walls)** were genuine."

---

## KEY TAKEAWAYS — CHAPTER 4

> **1. The order book is a live queue of unfilled limit orders — constantly changing as orders are added, cancelled, and consumed.**

> **2. Level 1 shows best bid/ask only. Level 2 (5 levels on NSE) provides depth — but still only a partial view. The true book is hidden.**

> **3. Iceberg orders hide the true size of large participant orders. When a price level appears to hold repeatedly despite high volume, a hidden iceberg bid may be the mechanism — this is the order book origin of Stopping Volume and Wyckoff Accumulation patterns.**

> **4. Phantom liquidity from HFT cancellations makes displayed depth unreliable as a guaranteed support/resistance indicator. An 80,000-share bid wall can vanish in milliseconds.**

> **5. Liquidity withdrawal (market makers pulling quotes) around major events creates artificially wide-range, high-volume bars that must not be read with standard VSA rules.**

> **6. OHLCV is the output of the order book's activity — it records what happened but not the book's state at any point. The book is the mechanism; the candle is the result.**

> **7. Never act on visible order book depth alone. Treat it as one input in an evidence-weighted analysis — always asking: "Is this depth genuine, or is it cancellable?"**

---

*Chapter 4 Complete.*

---

**Previous:** [← Chapter 3 — Order Types](./order-types.md)
**Next:** [Chapter 5 — Liquidity & Market Impact →](./liquidity-and-market-impact.md)

*When ready, say: **"NEXT CHAPTER"***
