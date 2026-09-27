# Order Flow

> **Course:** NSE/BSE Professional Investing — Price, Volume & Institutional Flow
> **Part:** XI — Order Flow
> **Topic:** Order Flow

---

## Chapter Overview

A price bar summarises an entire session into four numbers: Open, High, Low, Close. That summary destroys the vast majority of information that was generated during that session. Order flow analysis reads the raw, uncompressed data that the price bar discards — every individual transaction, its size, and crucially, **whether it was initiated by a buyer or a seller**.

The result is a completely different analytical layer: instead of asking "where did price close?", you ask "who was in control at each price level, and with how much urgency?"

This distinction — between initiated (aggressive) orders and passive (limit) orders — is the foundation of all professional intraday and short-term institutional flow reading on NSE.

**The Core Rule:**

> **Price tells you the result of the battle. Order flow tells you how the battle was fought — who was attacking (aggressive market orders), who was defending (passive limit orders), and who was winning moment by moment. Without order flow, you see only the scoreboard. With it, you see the game.**

---

## LEVEL 1 — BEGINNER

### What Is Order Flow?

```
ORDER FLOW = The stream of individual buy and sell transactions as they occur in real-time.

Every transaction on NSE has two participants:
→ The INITIATOR (aggressive side): Places a MARKET ORDER.
   Accepts whatever price is currently available. Does not wait.
→ The PASSIVE side: Has a LIMIT ORDER sitting in the order book.
   Waits for the market to come to their price.

Who initiates tells you who has URGENCY:
→ A buyer placing a market order (hitting the Ask) = "I need this stock NOW."
   They are willing to pay slightly above the midpoint to get immediate execution.
→ A seller placing a market order (hitting the Bid) = "I need to exit NOW."
   They accept slightly below the midpoint for immediate execution.

This urgency is the SIGNAL:
→ Many large buyers hitting the ask repeatedly = Strong bullish urgency.
→ Many large sellers hitting the bid = Strong bearish urgency.
→ Small, mixed orders in both directions = No institutional urgency. Phase B.
```

**Time and Sales — The Raw Order Flow Feed:**

```
THE TIME AND SALES (TAPE):
The time and sales is the chronological record of every executed trade on NSE.
Each line shows:
→ Time: Exact timestamp (hours:minutes:seconds)
→ Price: The price at which the trade executed
→ Size: How many shares / contracts traded
→ Side: Whether it executed at the Bid (seller-initiated) or Ask (buyer-initiated)

Sample NSE Time & Sales (HDFC Bank, 10:32 AM):
10:32:04  ₹1,726.00  (Ask)  850 shares   ← Buyer hit the ask (aggressive buy)
10:32:04  ₹1,725.95  (Bid)  200 shares   ← Seller hit the bid (aggressive sell)
10:32:05  ₹1,726.00  (Ask)  1,400 shares ← Large buyer hitting ask
10:32:05  ₹1,726.00  (Ask)  2,200 shares ← Even larger buyer — urgency building
10:32:06  ₹1,726.05  (Ask)  3,800 shares ← Ask lifted to ₹1,726.05 — supply exhausted at ₹1,726
10:32:06  ₹1,726.05  (Ask)  1,100 shares ← Continued buying at new ask level

Reading this tape:
→ Dominant side: BUYERS (most transactions at Ask, increasing size)
→ Urgency: RISING (size increasing: 850 → 1,400 → 2,200 → 3,800)
→ Direction: Bullish. Ask is being lifted. Price is moving up.
→ This sequence over 2 seconds represents aggressive institutional buying.
```

**Where to access Time & Sales on NSE:**

```
NSE LEVEL 2 + TIME & SALES:
→ NSE's official trading terminal (through registered NSE broker platforms)
→ Trading platforms: Zerodha Kite, AngelOne, Fyers, Upstox, Interactive Brokers India
→ Each shows real-time Time & Sales for the open positions / watchlist stocks

WHAT EACH PLATFORM SHOWS:
→ Zerodha Kite: Market Depth (5 levels bid/ask) + individual trade ticker
→ Professional platforms (Bloomberg, Reuters Eikon): Full T&S tape
→ NSE website: Delayed (15-minute) T&S data — useful for practice, not real-time trading

FOOTPRINT CHARTS (advanced — for visual order flow):
→ Ninja Trader, Sierra Chart, Bookmap: Show buy vs sell volume at EACH price level
→ These require separate data feed subscriptions
→ Not available natively in most retail Indian platforms yet
→ Can be simulated using NSE Bhavcopy + Options OI data for daily-level analysis
```

---

### Delta — The Battle Score

![Order Flow Fundamentals — Delta, Absorption & Aggression on NSE](/images/pi-order-flow-delta-concepts.jpg)

**Delta is the single most important order flow metric:**

```
DELTA FORMULA:
Delta = Volume executed at Ask (buyer-initiated) − Volume executed at Bid (seller-initiated)

POSITIVE DELTA (+):
→ More volume was buyer-initiated (buyers more aggressive)
→ Buyers are paying up to get shares immediately
→ Bullish pressure

NEGATIVE DELTA (−):
→ More volume was seller-initiated (sellers more aggressive)
→ Sellers are accepting less to get out immediately
→ Bearish pressure

ZERO DELTA (≈ 0):
→ Buyers and sellers equally matched
→ Neither side has urgency
→ Typically seen in Phase B range-bound conditions

PRACTICAL EXAMPLE — Nifty 5-minute bar:
Total contracts traded: 8,400
Bought at Ask (buyer-initiated): 5,200 contracts
Sold at Bid (seller-initiated): 3,200 contracts
Delta: +5,200 − 3,200 = +2,000

Reading: In this 5-minute window, buyers were 2,000 contracts more aggressive.
The candle closed UP +0.4%. Delta and price direction agree → Clean, healthy up-bar.
```

**Cumulative Delta (CD) — The Trend Indicator:**

```
CUMULATIVE DELTA = Running sum of all individual bar deltas from a defined start point.

Example: Reset CD at the start of today's session (9:15 AM):
9:15–9:20 bar: Delta = +1,800. CD = +1,800
9:20–9:25 bar: Delta = +2,400. CD = +4,200
9:25–9:30 bar: Delta = −600.  CD = +3,600
9:30–9:35 bar: Delta = +3,200. CD = +6,800
...and so on through the day.

FOUR CUMULATIVE DELTA READINGS (most important):

Reading 1 — CD RISING + Price RISING: 
→ Buyers increasingly aggressive. Price following buying pressure.
→ HEALTHY TREND. Conviction long position.
→ Wyckoff: Phase D markup confirming each session.

Reading 2 — CD FALLING + Price FALLING:
→ Sellers increasingly aggressive. Price following selling pressure.
→ HEALTHY DOWNTREND. No longs.
→ Wyckoff: Phase E markdown or distribution confirmed.

Reading 3 — CD RISING + Price FALLING (BULLISH DIVERGENCE — most important):
→ Buyers ARE aggressive (CD rising) but price is still falling.
→ WHY: A large institution is absorbing all the aggressive buying.
   They have a massive LIMIT SELL order eating up every buy order.
→ BUT: As CD rises, the institutional supply is being depleted.
→ When the institutional supply is fully absorbed: Price will reverse UP sharply.
→ Wyckoff: This is the UTAD or test of supply at resistance. Bearish signal at resistance.

Reading 4 — CD FALLING + Price RISING (BEARISH DIVERGENCE — most important):
→ Sellers ARE aggressive (CD falling) but price is still rising.
→ WHY: A large institution is absorbing all the aggressive selling.
   They have a massive LIMIT BUY order eating up every sell order.
→ As CD falls, the institutional demand is absorbing supply.
→ When the selling exhausts: Price will surge UP with no resistance.
→ Wyckoff: This is the SELLING CLIMAX or SPRING. Bullish absorption. Critical signal.
→ Tape reading: "Sellers are active, but price won't fall." = BIG institution buying.
```

---

### Absorption and Aggression

**The two fundamental order flow events at key levels:**

**Absorption — Hidden Institutional Intent:**

```
ABSORPTION = A large PASSIVE limit order absorbing incoming ACTIVE market orders
             WITHOUT moving price.

BULLISH ABSORPTION (at support / SC zone):
Scenario: Sellers are hitting the bid aggressively. Delta is very negative.
Price: Barely moves down. Closes off the low.
Mechanism: A very large institutional LIMIT BUY order is sitting at the support level.
           Every sell order that comes in is immediately absorbed by this limit buy.
           The institutional buyer WANTS those shares — they are filling their order quietly.
Result: Price holds the support. When the selling exhausts (Delta normalises):
        Price will rally sharply because the institutional buyer has absorbed all supply.

HOW TO SPOT ON NSE:
→ High volume at a support level (NSE Level 2 shows large bid size at a key price)
→ Time & Sales: Large sell orders going through BUT price barely moves
→ Level 2: The large bid doesn't disappear despite being hit repeatedly
   (The institutional buyer is refreshing their limit order as it fills)
→ VSA equivalent: Selling Climax or No Supply bar with closing near high

BEARISH ABSORPTION (at resistance / BC zone):
Opposite: Buyers hitting the ask aggressively. Delta strongly positive.
Price: Barely moves up. Closes off the high.
Mechanism: Large institutional LIMIT SELL order at resistance — selling into all buyers.
Result: When buying exhausts, price falls sharply (all demand absorbed, supply released).
→ VSA equivalent: Buying Climax or No Demand bar with closing near low
```

**Aggression — Institutional Urgency:**

```
AGGRESSION = A sustained burst of MARKET ORDERS in ONE direction, driving price decisively.

BULLISH AGGRESSION (SOS / Markup initiation):
→ Large buy market orders hitting the ask repeatedly
→ Ask is lifted: Each buy order exhausts the offers at the current price,
  forcing the next buy to pay a higher ask
→ Price moves UP decisively. Delta explodes positive.
→ NSE example: Nifty futures. At 10:15 AM, a stream of large buy orders:
  +850 contracts, +1,200 contracts, +2,800 contracts, +4,200 contracts in 90 seconds
  Nifty jumps 48 points in 90 seconds.
→ Wyckoff: This IS the SOS bar. The CO has decided accumulation is complete.
  They are buying aggressively, clearing out all supply above.

BEARISH AGGRESSION (SOW / SC formation):
→ Large sell market orders hitting the bid
→ Bid is hit: Each sell order drops the bid to the next level down
→ Price falls decisively. Delta explodes negative.
→ Wyckoff: Selling Climax formation. FII forced liquidation.

AGGRESSION vs ABSORPTION — THE KEY DISTINCTION:
Aggression: High volume + Price MOVES (direction = aggressive side's direction)
Absorption: High volume + Price DOES NOT MOVE (opposite side is in control)

This is the most important distinction in all of order flow analysis.
A bar with high volume can be either — price movement is the separator.
```

---

## LEVEL 2 — INTERMEDIATE

### Order Flow + Wyckoff Integration

![Order Flow + Wyckoff Integration — What the Tape Says at Each Phase](/images/pi-order-flow-wyckoff-integration.jpg)

**The complete order flow profile across the Wyckoff accumulation cycle:**

**Selling Climax (SC) — Order Flow Fingerprint:**

```
EXPECTED ORDER FLOW:
→ Delta: Massively NEGATIVE (aggressive sellers dominating)
→ Time & Sales: Continuous stream of large market sell orders
→ Price: Wide spread down. Initially price is falling.

THE CRITICAL MOMENT (identifying the actual SC):
→ Delta REMAINS very negative BUT price STOPS FALLING and closes off the low.
→ This is BULLISH ABSORPTION in action.
→ The CO is placing massive limit buy orders at the SC level,
  absorbing every aggressive sell order.
→ Aggressive sellers cannot push price lower despite their volume.

Tape reading at the SC:
"Market sell orders pouring in → Price briefly spikes down → LARGE bid appears
→ All those sell orders get absorbed → Price closes off the low.
The sellers ran out of stock to sell. The buyer absorbed everything."

If you see: Delta = −80,000 on Nifty but price closes at the HIGH of the SC bar:
→ 80,000 contracts of aggressive selling absorbed at the lows.
→ This is the SC fingerprint. Phase A begins.
```

**Spring — Order Flow Fingerprint:**

```
EXPECTED ORDER FLOW:
→ When price dips BELOW the SC low: Brief negative delta (stop-loss triggers)
→ Time & Sales: Burst of small/medium sell orders (automatic, mechanical stops)
→ THEN: Delta reverses sharply to POSITIVE within minutes
   (institutional buyers triggered by the brief dip)
→ Price recovers rapidly above SC low. Closes near session high.

THE SPRING ORDER FLOW SEQUENCE (30 minutes):
9:15 AM: Price drifts to SC low (22,150). Delta near zero.
9:22 AM: Price breaches 22,150. Stop-loss cascade begins. Delta: −12,000.
          Time & Sales: Many sell orders at ₹22,148, ₹22,143, ₹22,139.
9:24 AM: Price reaches Spring low (22,092). Maximum negative delta.
9:24:30 AM: BIG limit buy triggers. 8,400 contracts absorbed instantly.
             Delta reverses: −12,000 → −8,000 → −3,000 → +4,000 in 2 minutes.
9:26 AM: Price back above 22,150 (SC low). Delta: +8,000 and rising.
9:30 AM: Price at 22,280. Delta strongly positive. Spring confirmed.

What to look for: The speed of the delta reversal.
Valid Spring: Delta reversal from peak negative to positive within 1–3 minutes.
False breakdown: Delta stays negative for 15+ minutes. Sellers are genuine.
```

**SOS (Sign of Strength) — Order Flow Fingerprint:**

```
EXPECTED ORDER FLOW:
→ Delta: Massively POSITIVE (aggressive buyers dominating)
→ Time & Sales: Large, continuous market buy orders lifting the ask
→ Price: Wide spread up, closes near high, breaks above AR

WHAT MAKES IT AN SOS (not just a momentum day):
→ Delta is not just positive — it is ACCELERATING as price rises.
→ Each successive 5-minute bar shows HIGHER delta than the previous.
   (Buyers getting more aggressive as supply clears)
→ When price breaks above the AR high: Delta explodes to daily maximum.
   (Short sellers forced to cover = mechanical buy orders adding fuel)
→ Time & Sales at the breakout: Sizes escalate rapidly
   200 contracts → 800 contracts → 2,400 contracts → 6,800 contracts

This is the characteristic "bid stack clearing" of an institutional SOS:
The CO is not buying slowly — they are urgently clearing all remaining supply.

Post-SOS delta signature:
After the SOS session: Next day's delta should be near zero (No Supply on pullback).
If next day's delta is strongly negative: The SOS was a false breakout. Supply present.
```

**LPS (Last Point of Support) — Order Flow Fingerprint:**

```
THE MOST OPERATIONALLY IMPORTANT ORDER FLOW SIGNAL FOR ENTRY:

EXPECTED ORDER FLOW ON LPS DAYS (2–5 days of pullback):
→ Delta: Near ZERO or slightly positive
→ Time & Sales: Small orders, slow pace, alternating buy/sell
→ Volume: Well below average (0.4–0.7× 20-day average)

WHY NEAR-ZERO DELTA ON A DOWN DAY IS BULLISH:
→ On a normal down day: Sellers hit the bid aggressively. Delta = strongly negative.
→ On an LPS day: Price edges lower BUT sellers are NOT aggressive.
   Delta near zero means: The price decline is happening passively —
   buyers are pulling their bids (reducing the bid), not sellers hitting bids urgently.
→ This is "seller's market" only in NAME — the sellers have no urgency.
→ The CO is not selling. The CO's limit buy orders are still there, just at a lower level.

ENTRY TRIGGER using order flow:
1. LPS zone identified from Wyckoff structure.
2. Price has declined for 2–4 sessions on declining volume and near-zero delta.
3. ENTRY TRIGGER: On the LPS entry day, watch for delta to shift from near-zero
   to POSITIVE (first aggressive buyers starting to accumulate for the next SOS).
   This delta shift — from flat to positive — within the LPS zone is the
   highest-precision entry signal in Wyckoff + Order Flow combined analysis.
4. Place the limit buy as the delta begins to shift positive.
```

---

### NSE-Specific Order Flow Tools and Limitations

```
WHAT IS AVAILABLE ON NSE FOR RETAIL/PROFESSIONAL TRADERS:

Level 2 Market Depth (5 levels):
→ Available on all NSE trading platforms (Zerodha, AngelOne, Upstox, etc.)
→ Shows: Best 5 bid prices + quantities, Best 5 ask prices + quantities
→ LIMITATION: Only shows VISIBLE orders. Institutional icebergs (hidden large orders)
  are NOT visible in Level 2. A ₹500 crore buy order at a bank may appear as a 
  tiny 100-share visible order with the rest "hidden" (not shown in Level 2).
→ USE: Watch for bid/ask SIZE CHANGES at key levels. A massive bid appearing at the
  SC support level = institutional absorption beginning.

Time & Sales:
→ Available on most platforms (may be delayed 15 minutes on free tiers)
→ Real-time T&S: Zerodha Kite (for subscribed users), professional broker platforms
→ USE: Watch T&S at key Wyckoff levels (Spring low, SOS breakout point, LPS zone).

NSE Options Chain OI Changes (daily):
→ Not real-time order flow but useful for direction bias
→ Call OI buildup at a strike = resistance level (supply expected there)
→ Put OI buildup at a strike = support level (demand expected there)
→ USE as a proxy for where large order flow is positioned (not real-time)

What is NOT available on standard NSE retail platforms:
→ Full depth (beyond 5 levels)
→ Footprint/Volume Profile real-time charts
→ Cumulative Delta charts (require specialized data providers)
→ Iceberg order detection

WORKAROUND FOR NSE PRACTITIONERS:
→ Use Delivery % (Chapter: Delivery Analysis) as a DAILY-level proxy for order flow aggression.
→ Use FII/DII data (Chapter: FII DII Analysis) as a DAILY-level proxy for institutional intent.
→ Use Block/Bulk Deals (Chapter: Block Bulk Deals) as transaction-level proof of large orders.
→ Combined: These three daily data points approximate the ORDER FLOW signal
  that professionals read in real-time from Level 2 + T&S.
```

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### The Order Flow Decision Framework

```
PRE-MARKET PREPARATION (order flow plan):

Step 1 — Identify the key price levels for today:
→ Previous day's high and low
→ VWAP (Volume Weighted Average Price) from previous session
→ Volume Profile HVN (High Volume Node) — where most volume traded
→ Volume Profile LVN (Low Volume Node) — where price moves fast
→ Wyckoff structural levels (SC low, AR high, Spring low, SOS level, Creek)

Step 2 — Define the ORDER FLOW HYPOTHESIS for each level:
For each key level, define BEFORE the session:
"At this level, if I see [X order flow], I will [action]."

Example:
"Nifty at 24,150 (LPS zone). 
If Nifty approaches 24,150 AND Time & Sales shows near-zero delta 
(small orders, alternating buy/sell, no urgency):
→ BULLISH ABSORPTION hypothesis confirmed.
→ Place limit buy at 24,150 with stop at 23,890 (Spring low − 50 points).

If Nifty approaches 24,150 AND Time & Sales shows strongly NEGATIVE delta
(large sell orders, ask repeatedly hit, bid falling):
→ This is NOT absorption. This is genuine supply.
→ DO NOT BUY. Reduce position size. Watch for Spring at lower level."

Step 3 — Execute only when hypothesis is confirmed:
→ The order flow reading at the key level must match the hypothesis.
→ If order flow does not confirm: The Wyckoff structure may be wrong.
   Default: No trade. Observation only.
```

### Order Flow Divergence — The Most Powerful NSE Signal

```
ORDER FLOW DIVERGENCE = When delta and price move in OPPOSITE directions.

BULLISH DIVERGENCE (primary use case for this course):
→ Delta is FALLING (sellers aggressive) but Price is NOT falling or is rising.
→ This means: Institutional LIMIT BUYERS are absorbing all the aggressive selling.
→ The accumulation is HAPPENING RIGHT NOW at this price level.
→ When the sellers finally exhaust: Price will reverse upward sharply.

HOW TO USE IT IN REAL-TIME (NSE example):
10:15 AM: Nifty at 24,200 (LPS zone). Delta turning negative (selling begins).
10:20 AM: Delta = −8,000. Nifty only at 24,180 (barely moved despite selling).
10:25 AM: Delta = −14,000. Nifty at 24,165 (still holding).
10:28 AM: Delta = −18,000 (maximum). Nifty at 24,155. Price barely moved.
10:30 AM: Delta STOPS declining (sellers exhausted). Delta = −18,000 (unchanged).
10:31 AM: First positive prints. Delta: −17,500, −16,000, −12,000 (sellers withdrawing).
10:32 AM: Delta rapidly turning positive. Nifty begins rising from 24,155.

Interpretation: 18,000 contracts of aggressive selling was absorbed between 24,155–24,200.
               This is the LPS zone. The buying was hidden (institutional limit orders).
               When selling exhausted: The hidden limit buyers controlled the market.
               Entry on the delta reversal (10:31–10:32 AM): ₹24,155 entry with stop at Spring low.

BEARISH DIVERGENCE (for short trades):
→ Delta RISING (buyers aggressive) but Price NOT rising.
→ Institutional LIMIT SELLERS absorbing all buying.
→ When buying exhausts: Price falls sharply.
→ Wyckoff: UTAD or BC top. Institutional distribution disguised by retail enthusiasm.
```

### Combining All Institutional Layers — The Master Scorecard

```
THE COMPLETE INSTITUTIONAL CONVICTION SCORECARD:

Wyckoff Structure (max 6 points):
□ +2: Phase D confirmed (SOS + LPS visible)
□ +2: LPS is structurally valid (above Creek/Spring low)
□ +2: Volume Profile supports entry (LVN above, HVN below as support)

Delivery % Analysis (max 10 points — from Chapter: Delivery Analysis):
□ +3: SOS day delivery > 65% + volume > 2×
□ +2: LPS day delivery < 30%
□ +2: 5-day delivery trend RISING
□ +1: Spring delivery < 25%
□ +1: ST delivery < SC delivery
□ +1: Sector delivery 20%+ above average

FII/DII Analysis (max 9 points — from Chapter: FII DII Analysis):
□ +2: FII 20-day cumulative positive and rising
□ +2: FII cumulative rising (improving)
□ +1: FII net positive on SOS day
□ +1: FII near-zero on LPS days
□ +1: FII F&O net long
□ +1: Retail F&O net short
□ +1: DII consistent net positive

Block/Bulk Deal (max 12 points — from Chapter: Block Bulk Deals):
□ +3: FII/Sovereign block buy at LPS zone
□ +3: Promoter open market buy
□ +2: DII (LIC/MF) block deal buy
□ +2: FII absorbing VC/PE exit
□ +1: FII urgent bulk buy on SOS day
□ +1: Multiple FIIs buying in same sector

Order Flow (max 8 points — this chapter):
□ +3: SOS bar: Massively positive delta + accelerating + price breaking resistance
□ +2: LPS days: Near-zero delta on down-sessions
□ +2: Spring: Delta reversed from negative to positive rapidly (< 3 minutes)
□ +1: Cumulative delta bullish divergence at LPS (CD falling while price holds)

TOTAL MAXIMUM SCORE: 45 points

POSITION SIZING BY SCORE:
40–45 points (Very rare): 1.5× normal position (maximum conviction — only if risk rules allow)
30–39 points (Strong): 1.0× normal position (full conviction)
20–29 points (Moderate): 0.75× normal position
10–19 points (Weak): 0.5× normal position
< 10 points: No trade (insufficient institutional confirmation)
```

---

## EXERCISES

### Beginner Exercises

**Exercise 1 — Initiated vs Passive Classification**

Classify each transaction as BUYER-INITIATED (aggressive buy) or SELLER-INITIATED (aggressive sell):

a) A trader places a MARKET BUY order for 500 shares of Reliance. Executes at the Ask of ₹2,820.
b) A trader places a LIMIT SELL order at ₹1,726 for HDFC Bank. The order fills when a market buyer hits the ask.
c) A fund manager places a MARKET SELL order for 10,000 shares of TCS. Executes at the Bid of ₹3,618.
d) A retail investor places a LIMIT BUY order at ₹488 for a mid-cap stock. A market seller hits the bid.
e) An FII places a MARKET BUY order for 50,000 contracts of Nifty futures. Executes by lifting multiple ask levels.

For each: (a) Buyer-initiated or Seller-initiated? (b) Does this contribute to POSITIVE or NEGATIVE delta? (c) Is the initiator aggressive or passive?

**Exercise 2 — Delta Calculation**

Calculate delta and interpret each 5-minute bar:

| Bar | Buy at Ask (contracts) | Sell at Bid (contracts) | Delta | Price Change | Interpretation |
|-----|----------------------|------------------------|-------|-------------|----------------|
| A | 4,200 | 1,800 | ? | +0.6% | ? |
| B | 2,100 | 3,900 | ? | −0.8% | ? |
| C | 5,800 | 5,600 | ? | +0.1% | ? |
| D | 6,400 | 1,200 | ? | +0% | ? |
| E | 1,800 | 6,200 | ? | +0% | ? |

For each bar: (a) Calculate delta. (b) Does delta and price agree or diverge? (c) If divergence: What does it indicate? (d) Which Wyckoff event does Bar D suggest? Which does Bar E suggest?

**Exercise 3 — Cumulative Delta Sequence**

Track this 10-bar cumulative delta sequence (Nifty 50, daily bars):

| Day | Bar Delta | Cumulative Delta | Nifty Price Change | Reading |
|-----|-----------|-----------------|-------------------|---------|
| 1 | −18,000 | −18,000 | −2.8% | ? |
| 2 | −12,000 | −30,000 | −1.4% | ? |
| 3 | −4,000 | −34,000 | −0.3% | ? |
| 4 | +2,000 | −32,000 | +0.8% | ? |
| 5 | +8,000 | −24,000 | +1.2% | ? |
| 6 | +14,000 | −10,000 | +1.8% | ? |
| 7 | +22,000 | +12,000 | +2.4% | ? |
| 8 | +18,000 | +30,000 | +2.1% | ? |
| 9 | +6,000 | +36,000 | +0.8% | ? |
| 10 | +2,000 | +38,000 | +0.4% | ? |

a) What Wyckoff event does Day 1–2 represent?
b) What happens on Days 3–4 that is significant?
c) On which day does the cumulative delta cross zero? What does this signal?
d) What is the market bias at the end of Day 10?
e) If Day 11 shows delta = −8,000 but price only falls 0.2%: What does this indicate?

---

### Intermediate Exercises

**Exercise 4 — Absorption Identification**

For each scenario, identify whether it is BULLISH ABSORPTION, BEARISH ABSORPTION, or neither. Explain the mechanism and Wyckoff interpretation:

**Scenario A:**
Nifty is at 24,150 (LPS zone after SOS). Time & Sales shows: Many sell orders hitting the bid. Delta: −14,000 in the last 30 minutes. BUT: Nifty has only fallen 18 points from 24,168 to 24,150.

**Scenario B:**
HDFC Bank approaches ₹1,780 (previous SOS high — the Creek). Time & Sales: Heavy buying, ask being lifted repeatedly. Delta: +22,000 in 45 minutes. BUT: HDFC Bank is stuck at ₹1,778–₹1,782. Price barely moving despite massive buy volume.

**Scenario C:**
TCS at its Spring low zone. Sell orders hit the bid. Delta: −8,000 in 15 minutes. Price falls from 3,620 to 3,592 (−28 points). Then REVERSES to 3,648 (+56 points) in the next 20 minutes.

For each: (a) Type of absorption (bullish/bearish/neither)? (b) What is the large limit order doing? (c) What happens when the aggressive orders exhaust? (d) Trade action?

**Exercise 5 — LPS Entry Using Order Flow**

Bank Nifty has confirmed a Wyckoff SOS 2 weeks ago. It is now pulling back for the LPS. The SOS high was 53,400. The Spring low was 51,200.

Today's intraday data (Bank Nifty at 52,100 — in LPS zone):

Time | Delta (10-min bar) | Cumulative Delta | Price
9:15 | −4,200 | −4,200 | 52,380
9:25 | −3,800 | −8,000 | 52,210
9:35 | −2,100 | −10,100 | 52,150
9:45 | −800 | −10,900 | 52,090
9:55 | −200 | −11,100 | 52,070
10:05 | +400 | −10,700 | 52,080
10:15 | +1,800 | −8,900 | 52,140
10:25 | +4,200 | −4,700 | 52,280

a) At which time bar does the order flow signal the LPS entry?
b) What specific order flow evidence confirms the LPS at the 9:55 bar?
c) At the 10:05 bar, what is the delta shift telling you?
d) Where is the highest-precision entry point and why?
e) Design the trade: Entry, stop, T1 (SOS high), T2 (Volume Profile next HVN). Account ₹15L, risk 1%.

**Exercise 6 — Spring Confirmation via Order Flow**

You are watching Nifty futures. The SC low was 22,840. Today, Nifty approaches and briefly violates this level.

Time | Delta | Cumulative Delta | Nifty Level | Event
9:15 | −2,400 | −2,400 | 22,920 | Normal open
9:20 | −4,800 | −7,200 | 22,870 | Approaching SC low
9:25 | −9,200 | −16,400 | 22,815 | Below SC low — Spring begins
9:27 | −14,800 | −31,200 | 22,788 | Maximum negative delta (stop cascade)
9:28 | −8,400 | −39,600 | 22,804 | Delta decelerating
9:29 | −2,200 | −41,800 | 22,831 | Delta nearly zero
9:30 | +3,800 | −38,000 | 22,867 | Delta positive — absorption complete
9:35 | +12,400 | −25,600 | 22,964 | Strong reversal
9:40 | +18,200 | −7,400 | 23,078 | Approaching SOS territory
9:45 | +22,800 | +15,400 | 23,186 | SOS candidate

a) At which exact minute bar is the Spring confirmed by order flow?
b) What specific order flow event occurs between 9:27 and 9:30 that confirms the Spring?
c) At 9:45 (CD turns positive to +15,400): What Wyckoff event is forming?
d) Is the cumulative delta positive turn at 9:45 a valid SOS signal? What additional evidence do you need?
e) What is the ideal entry price for the Spring trade using order flow precision?

---

### Advanced Exercise

**Exercise 7 — Full Order Flow Trade from Institutional Scorecard**

You are building the complete institutional case for a Nifty 50 long trade. It is 10:30 AM.

**Wyckoff structure:** Nifty in Phase D. SOS occurred 8 days ago at 24,800. LPS forming. Current Nifty: 24,350.

**Delivery % (last 8 sessions):**
SOS day delivery: 72%. Post-SOS days: 41%, 35%, 28%, 24%, 22%, 20%, 18%.

**FII/DII (last 20 sessions cumulative):** +₹22,400 Cr. Today's FII: +₹1,800 Cr.

**Block deal (today morning):** Norges Bank bought ₹1,480 Cr of Nifty ETF (proxy for index). Seller: VC fund (index ETF redemption).

**Order flow (today, 10:30 AM):**
Cumulative Delta since 9:15 AM: −12,400 (sellers have been active since open).
Nifty decline since 9:15 AM: 24,480 → 24,350 = −130 points.
Current bar (10:25–10:35): Delta = −800 (nearly zero despite being in an "off" day).
Time & Sales at 10:30 AM: Small sell orders (200–400 contracts), slow pace, bids being respected.

Required:
a) Calculate the complete institutional scorecard across all 5 layers.
b) Is there a bullish divergence in today's cumulative delta? Explain.
c) What does the near-zero delta at 10:25–10:35 bar specifically indicate?
d) At what intraday price and time would you place the LPS entry order?
e) Design the full trade: Entry, stop, T1, T2, position size (₹20L account, 1% risk).
f) What single order flow event would INVALIDATE this setup and force you to cancel the order?
g) After entry, what order flow reading over the NEXT 3 sessions confirms the LPS was valid?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** Define order flow. What is the difference between an INITIATOR (aggressive order) and a PASSIVE holder (limit order)? Why does this distinction matter?

**Q2.** What is Delta in order flow analysis? Write the formula. What does Positive, Negative, and Zero delta each indicate about market conditions?

**Q3.** Explain Cumulative Delta. Describe all four CD divergence scenarios (CD rising/falling × price rising/falling) and the Wyckoff interpretation of each.

**Q4.** What is Absorption in order flow? Describe both Bullish Absorption (at support) and Bearish Absorption (at resistance). How does each connect to a specific Wyckoff event?

**Q5.** What is Aggression? How does it differ from Absorption? State the key distinguishing rule (high volume + price movement vs high volume + no price movement).

**Q6.** Describe the expected order flow at the Selling Climax. What specific sequence of delta + price action reveals that the SC has occurred and that institutional absorption has begun?

**Q7.** Describe the order flow fingerprint of a valid Spring. What specifically happens to delta at the Spring low, and how fast must it reverse for the Spring to be valid?

**Q8.** What is the LPS order flow entry signal? What does near-zero delta on a down-session mean, and what specific delta event triggers the precise entry?

**Q9.** What order flow tools are available to NSE retail traders, and what are their key limitations? What daily data points can be used as order flow proxies?

**Q10.** Describe the Complete Institutional Scorecard (5 layers). What is the maximum possible score and what score threshold indicates a full-conviction position?

### Chart Questions (5)

**S1.** Time and Sales data for a Nifty 50 5-minute bar at 10:15 AM:

```
10:15:02  24,218  Ask  2,800 contracts
10:15:04  24,218  Ask  4,200 contracts
10:15:06  24,219  Ask  3,600 contracts (ask lifted)
10:15:09  24,217  Bid  400 contracts
10:15:11  24,219  Ask  5,800 contracts
10:15:14  24,220  Ask  6,400 contracts (ask lifted again)
10:15:17  24,222  Ask  8,200 contracts
10:15:20  24,222  Ask  4,600 contracts
```

a) What is the approximate delta for this 5-minute bar?
b) Which side is initiating (aggressive)?
c) What is happening to the Ask price across this 2-minute window?
d) What Wyckoff event does this order flow suggest?
e) What would you expect the price bar to look like (direction, spread, close)?

**S2.** Cumulative Delta for Bank Nifty today (session started at 52,800):

10:00 AM: CD = +28,000. Bank Nifty = 53,200. (+400 points)
12:00 PM: CD = +42,000. Bank Nifty = 53,400. (+600 points) — CD rising faster than price.
14:00 PM: CD = +38,000. Bank Nifty = 53,200. (Back to +400) — CD declining while price holds.
15:00 PM: CD = +22,000. Bank Nifty = 53,000. (+200 points) — CD declining faster than price.
15:25 PM: CD = +8,000. Bank Nifty = 52,900. — Close to reversal.

a) Describe the full CD trend of the day.
b) At 12:00 PM: CD rising faster than price. What is happening?
c) Between 12:00 PM and 15:00 PM: CD declining while price also falling. What type of signal?
d) At 15:25 PM: CD nearly flat at +8,000. Price fallen 500 points from high. What does this late-session pattern suggest about tomorrow?
e) Design a hypothesis for tomorrow's order flow and trade plan.

**S3.** You observe this 20-minute absorption sequence at the NSE Market Depth:

Time 10:00 AM: Best Bid = ₹1,724 (200,000 shares showing). Best Ask = ₹1,724.05.
Time 10:05 AM: 80,000 shares sell-initiated at ₹1,724. Bid remains at ₹1,724 (refreshed).
Time 10:10 AM: Another 120,000 shares sell-initiated at ₹1,724. Bid refreshes to ₹1,724 again.
Time 10:15 AM: 90,000 shares sell-initiated. Price barely moves below ₹1,724.
Time 10:20 AM: Sell flow dries up. Bid now = ₹1,724.10 (bid improved — sellers gone).
Time 10:21 AM: Price jumps to ₹1,726.80 (large ask sweep — buy aggression begins).

a) What type of order flow event occurred from 10:00–10:20?
b) How do you know the institutional limit buyer is there?
c) At 10:21 AM: What Wyckoff event is beginning?
d) What was absorbed between 10:00–10:20 AM? (Calculate total sell-initiated volume)
e) What is the entry point, stop, and minimum target for this trade?

**S4.** Spring confirmation test. The SC low for a stock is ₹842. Today:

9:15 AM: Price at ₹848. Delta near zero.
9:22 AM: Price drops to ₹841 (below SC low). Delta = −18,000.
9:24 AM: Price at ₹836 (further below SC low). Delta = −28,000 (maximum negative).
9:24:30 AM: Price at ₹838. Delta stops increasing.
9:25 AM: Delta starts declining: −28,000 → −22,000 → −14,000.
9:27 AM: Delta = +2,000 (first positive print). Price = ₹845 (back above SC low).
9:30 AM: Delta = +12,000. Price = ₹858.

a) Is this a valid Spring? Apply the order flow Spring rules.
b) At what time was the Spring low confirmed by order flow?
c) At what time is the aggressive entry available?
d) What specific order flow event (9:24:30) told you the Spring was forming?
e) Set up: Entry, stop, T1 (AR high = ₹892), T2 (Volume Profile next level).

**S5.** Complete the order flow scorecard for this trade:

Context: Nifty in Phase D LPS zone. Current: 24,320.

Order flow data collected:
→ SOS (8 days ago): Delta = +84,000. Price closed at the high. Wide spread.
→ LPS sessions (days 1–5): Average delta = −2,400 per session (near zero).
→ Today (entry session): CD falling from 9:15–10:00 AM (−22,000). Price fell from 24,380 to 24,320 (−60 points). At 10:00 AM: Delta reverses from −1,800 to +4,200 in one bar.
→ FII data: 20-day cumulative = +₹18,600 Cr.
→ Delivery %: SOS day = 74%. LPS average = 22%.
→ Block deal: GIC Singapore bought at 8:55 AM. Value ₹1,100 Cr. Seller: FII rebalancing.

Calculate the institutional scorecard across all 5 layers and determine:
a) Total score.
b) Conviction level (Very Rare / Strong / Moderate / Weak).
c) Appropriate position sizing multiplier.
d) Precise entry at the delta reversal. Stop and T1/T2 targets.

---

## QUIZ ANSWERS

**A1.** Order flow: The stream of individual buy and sell transactions as they occur in real-time on NSE. Initiator (aggressive): Places a MARKET ORDER. Accepts the current best available price. Does not wait. Pays a small premium (hits the Ask to buy, or accepts the Bid to sell). Passive holder: Places a LIMIT ORDER. Waits for the market to come to their price. Provides liquidity to the initiator. Why it matters: The INITIATOR reveals URGENCY and DIRECTION preference. An institution placing a large market buy order is urgently accumulating — they are willing to pay the ask because they cannot wait for lower prices. This urgency is the signal that distinguishes informed, directional trading from passive order management. A price bar shows the result of all transactions combined — it cannot reveal which side was urgent and which was passive. Order flow reveals this.

**A2.** Delta = Volume executed at Ask (buyer-initiated) − Volume executed at Bid (seller-initiated). Positive delta (+): More volume was initiated by buyers (hitting the ask). Buyers are more aggressive and have more urgency. Net bullish pressure. Negative delta (−): More volume was seller-initiated (hitting the bid). Sellers are more aggressive. Net bearish pressure. Delta ≈ Zero: Buyers and sellers equally matched in aggression. Neither side has directional urgency. This is the characteristic state of Phase B: Neither institutional buyers nor sellers are aggressive — both are waiting (CO is managing the range).

**A3.** Cumulative Delta: Running sum of all bar deltas from a defined starting point. Four scenarios: (1) CD RISING + Price RISING: Buyers consistently aggressive, price following. Clean, healthy uptrend. Wyckoff Phase D Markup. (2) CD FALLING + Price FALLING: Sellers consistently aggressive, price following. Healthy downtrend. Wyckoff Phase E Markdown. (3) CD RISING + Price FALLING (Bullish divergence): Aggressive buyers active, but a large institutional SELL limit order absorbs every buyer. BEARISH ABSORPTION at resistance. Wyckoff: UTAD or test of supply. When buyers finally exhaust: Price falls sharply. (4) CD FALLING + Price RISING (Bearish divergence): Sellers active, but large institutional BUY limit order absorbs every seller. BULLISH ABSORPTION at support. Wyckoff: SC or Spring. Most important signal in this course. When sellers exhaust: Price surges. This is how the CO buys at the SC without price rising.

**A4.** Absorption: A large passive LIMIT ORDER absorbing incoming market orders without significant price movement. Bullish Absorption (at support): Heavy sell market orders hitting the bid. Delta strongly negative. BUT price barely falls — an institutional LIMIT BUY order absorbs every sell. Wyckoff events: Selling Climax (Phase A) and Spring (Phase C). The CO is quietly buying all available supply. When selling exhausts: Price reverses up sharply because the CO has accumulated a full position and removed all supply. Bearish Absorption (at resistance): Heavy buy market orders hitting the ask. Delta strongly positive. BUT price barely rises — institutional LIMIT SELL order absorbs every buy. Wyckoff events: Buying Climax (BC), UTAD (Phase C Distribution). The CO is distributing to eager retail buyers. When buying exhausts: Price falls sharply (all supply absorbed, demand spent).

**A5.** Aggression: A sustained burst of market orders in one direction that DRIVES price decisively in that direction. High volume + price MOVES → Aggression. High volume + price DOES NOT MOVE → Absorption. Key distinguishing rule: Price movement is the separator. If buying is aggressive AND price rises = bullish aggression (SOS). If buying is aggressive AND price does NOT rise = bearish absorption (BC). If selling is aggressive AND price falls = bearish aggression (SOW/SC). If selling is aggressive AND price does NOT fall = bullish absorption (SC/Spring). The failure of price to follow the aggressive side reveals a hidden, larger counterparty (the CO) absorbing that aggression.

**A6.** SC order flow: Phase 1 (before SC): Sellers aggressive. Delta strongly negative. Price declining. Phase 2 (the SC moment): Massive sell aggression continues — delta at its most negative point. BUT price SLOWS its decline and then HOLDS at a support level. Phase 3 (the SC confirmation): Delta is STILL very negative but price closes OFF the session low (recovery from the low within the SC bar). This closing off the low WITH still-negative delta = The CO is absorbing the selling. The SC bar volume is maximum because: Delta is at its most negative (sellers still active) + CO is buying everything (adding to buy volume) = total traded volume at maximum. The bar closes off the low because CO absorption prevented price from falling further. Tape reading: "Sellers active everywhere, but price can't go lower" = large institutional buyer at these prices.

**A7.** Spring order flow: Phase 1 (approaching SC low): Delta near zero (no sellers). Phase 2 (Spring trigger — breaking below SC low): Stop-loss cascade triggers. Delta goes NEGATIVE rapidly (mechanical sell orders). Time & Sales: Burst of sell orders below SC low. Phase 3 (Spring low): Delta reaches maximum negative. Phase 4 (CRITICAL — Spring confirmation): Delta DECELERATES rapidly. Then REVERSES from maximum negative to near-zero to POSITIVE. This reversal must occur within 1–3 MINUTES of the maximum negative delta for the Spring to be valid. Mechanism: The Spring low is where the CO has massive limit buys set. As soon as the stop-cascade sells them all the shares they wanted: Sellers are GONE. The remaining market is CO-controlled. Price recovers instantly. Invalid breakdown (not a Spring): Delta stays negative for 15+ minutes = Real sellers present, not just mechanical stops. More decline ahead.

**A8.** LPS entry signal: LPS = Last Point of Support. The pullback after SOS confirmation. Expected order flow: Near-zero delta on DOWN sessions. Down sessions in the LPS zone: Sellers are NOT aggressive. Delta near zero means: Price is declining passively (buyers pulling bids = passive) not from seller aggression (sellers hitting bids = active). This absence of seller aggression = the CO is NOT selling. Their limit buy orders are still below, just at lower levels. Near-zero delta on a down day = No Supply VSA confirmed by order flow. Precise entry trigger: When delta shifts from near-zero (flat) to POSITIVE — the first aggressive buyers appear at the LPS zone. This delta shift from flat to positive signals: The CO (or first-wave smart money) is beginning the next accumulation sequence. Entry at the first positive delta bar in the LPS zone, with stop below the Spring low.

**A9.** Available NSE tools: (1) Level 2 Market Depth (5 levels): Shows visible bid/ask quantities at 5 price levels. Limitation: Institutional icebergs (hidden large orders) NOT visible. Large orders may show as tiny 100-share visible bids to avoid revealing size. Use: Watch for bid size expansion at key Wyckoff levels (SC support, LPS zone). (2) Time & Sales: Chronological executed trade record. Available on most platforms (may be delayed). Use: Watch T&S at key levels for sell-order streams with price holding = absorption. (3) Options Chain OI changes: Daily (not real-time). Call OI at strike = resistance/supply. Put OI = support/demand. Proxy for order flow positioning. Daily proxies for order flow: Delivery % (Chapter: Delivery Analysis) = daily aggression proxy. FII/DII data (Chapter: FII DII Analysis) = institutional direction. Block/Bulk deals (Chapter: Block Bulk Deals) = large single transaction evidence. Combined: These three approximate real-time order flow signals using freely available NSE daily data.

**A10.** Complete Institutional Scorecard: 5 layers: (1) Wyckoff Structure: max 6 points. (2) Delivery %: max 10 points. (3) FII/DII Analysis: max 9 points. (4) Block/Bulk Deals: max 12 points. (5) Order Flow: max 8 points. Total maximum: 45 points. Score thresholds: 40–45 = Very Rare — 1.5× position. 30–39 = Strong — full position. 20–29 = Moderate — 0.75× position. 10–19 = Weak — 0.5× position. <10 = No trade. Practical reality: Scoring 35+ is achievable on the best NSE setups. Scoring 45 might occur once per month in the right conditions. The scorecard's value is not the absolute number but the DISCIPLINE it enforces: requiring multiple independent institutional confirmation signals before allocating capital. This prevents single-signal trades (which have lower probability) and forces you to wait for the true high-conviction setups.

---

## KEY TAKEAWAYS

> **1. Order flow = who is initiating (aggressive market orders) vs who is passive (limit orders). Initiators reveal urgency and direction. Absorbers reveal the turning points. Price bars show the scoreboard; order flow shows the game.**

> **2. Delta = Buy volume at Ask minus Sell volume at Bid. Positive = buyers aggressive. Negative = sellers aggressive. Near-zero = Phase B balance. Cumulative delta divergence (CD falling while price holds) = the most powerful bullish absorption signal.**

> **3. Absorption vs Aggression: High volume + price moves = AGGRESSION (aggressive side winning). High volume + price doesn't move = ABSORPTION (opposite side in hidden control). The entire Wyckoff SC, Spring, SOS, and BC are identifiable through this single rule.**

> **4. The LPS order flow entry trigger: Near-zero delta on pullback sessions (no supply) followed by the FIRST positive delta bar in the LPS zone. This is the highest-precision entry signal in the combined Wyckoff + order flow system.**

> **5. The complete 5-layer institutional scorecard (Wyckoff + Delivery + FII/DII + Block/Bulk + Order Flow, max 45 points) forces systematic, multi-evidence decision-making. Only trade at 20+ points. Best trades score 35+.**

---

*Order Flow — Complete. Part XI — Order Flow is complete.*

*Next topic in the plan: **Advanced Microstructure** (Part XII).*

*Ready? Say: **"NEXT CHAPTER"***
