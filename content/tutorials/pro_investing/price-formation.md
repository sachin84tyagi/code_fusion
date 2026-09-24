# Chapter 2 — Price Formation

> **Course:** NSE/BSE Professional Volume + Price Action + VSA + Wyckoff + Market Microstructure
> **Part:** I — Market Foundations
> **Prerequisite:** Chapter 1 — How Financial Markets Actually Work

---

## Chapter Overview

This chapter answers a question that almost every market participant gets wrong:

> **"Why does price actually move?"**

The common answer — "buyers are stronger than sellers" — is imprecise at best and misleading at worst. This chapter establishes the precise mechanical understanding of how price is formed on NSE/BSE, which underpins every analysis technique taught in this course.

---

## LEVEL 1 — BEGINNER

### 2.1 What is Price Discovery?

**Price discovery** is the process by which a market determines the price of an asset at any given moment.

On NSE/BSE, price is not set by any single entity. No regulator sets it. No exchange official sets it. No large participant sets it (beyond their participation in the auction). Price emerges from the interaction of all buy and sell orders in the market.

**A simple analogy:**

Imagine you want to sell your car. You list it at ₹8 lakh. If no buyer accepts, you reduce to ₹7.5 lakh. A buyer offers ₹7.2 lakh. You counter at ₹7.4 lakh. You agree at ₹7.3 lakh.

That ₹7.3 lakh is the **discovered price** — the point where a willing seller and a willing buyer agreed to transact.

The stock market does exactly this, but with thousands of buyers and sellers simultaneously, electronically, at extremely high speed.

---

### 2.2 Supply and Demand at the Order Level

Before understanding price formation, you must understand supply and demand precisely — not as abstract forces, but as actual orders in the system.

**Supply** = Sell orders (people willing to sell at a price)
**Demand** = Buy orders (people willing to buy at a price)

This is not metaphor. On NSE, right now, for any liquid stock:
- There are hundreds or thousands of limit buy orders sitting in the system at various prices below the current price
- There are hundreds or thousands of limit sell orders sitting at various prices above the current price
- The **visible** portion of these orders is shown in the Market Depth (Level 2) data

**Key principle:**
> Supply and demand are not balanced at a single price — they exist across a range of prices. Price moves to find the level where the next transaction can occur.

---

### 2.3 Bid / Ask / Spread Explained

![Bid, Ask, and the Spread — The NSE Order Book](/images/pi-bid-ask-spread.jpg)

Three terms you must understand precisely:

**BID (Demand side)**
- The highest price any buyer in the market is currently willing to pay
- This is the price at which you can SELL immediately (if you place a market sell order)
- Example: Best Bid = ₹500.00 means the best available buyer right now will pay ₹500.00

**ASK (Supply side)**
- The lowest price any seller in the market is currently willing to accept
- This is the price at which you can BUY immediately (if you place a market buy order)
- Example: Best Ask = ₹500.50 means the cheapest available seller right now will accept ₹500.50

**SPREAD**
- Spread = Best Ask − Best Bid
- Example: ₹500.50 − ₹500.00 = ₹0.50
- The spread is the **immediate transaction cost** of trading

**Practical consequences:**

| Action | Price You Pay/Receive | Why |
|--------|----------------------|-----|
| Market BUY | Best Ask (₹500.50) | You take the cheapest available seller's price |
| Market SELL | Best Bid (₹500.00) | You accept the highest available buyer's price |
| Round-trip cost | Spread (₹0.50) | You buy at Ask, sell at Bid — lose the spread |

**Last Traded Price (LTP):**
- The price of the most recently executed trade
- Often sits between Bid and Ask
- This is what you see as the "current price" on most platforms

**Important distinction:**
- LTP is a **historical** fact — the price of the last match
- Bid and Ask are the **current** state of the order book
- These three numbers can all be different simultaneously

---

### 2.4 Order Matching — How the NSE Matching Engine Works

The NSE uses an **order-driven, electronic continuous matching system** — called the NEAT (National Exchange for Automated Trading) system.

**How matching works in the continuous session:**

```
Rule 1 — Price Priority:
A buy order at ₹501 executes before a buy order at ₹500
(higher bids get matched first)
A sell order at ₹500 executes before a sell order at ₹501
(lower asks get matched first)

Rule 2 — Time Priority (for same price):
Among all orders at the same price, the one submitted
EARLIER gets matched first (first come, first served)
```

**Step-by-step matching example:**

```
Order Book state:
Bids:  ₹500.00 (5,000 sh), ₹499.50 (8,000 sh)
Asks:  ₹500.50 (3,000 sh), ₹501.00 (6,000 sh)

Scenario: A new Market BUY order for 2,000 shares arrives.

Step 1: System finds the best (lowest) ask → ₹500.50
Step 2: 2,000 shares match against the 3,000 share ask at ₹500.50
Step 3: The ask at ₹500.50 is reduced to 1,000 shares remaining
Step 4: Trade is recorded: 2,000 shares @ ₹500.50
Step 5: This trade price becomes the new LTP: ₹500.50

Updated book:
Bids:  ₹500.00 (5,000 sh), ₹499.50 (8,000 sh)  [unchanged]
Asks:  ₹500.50 (1,000 sh remaining), ₹501.00 (6,000 sh)
```

---

### 2.5 Price-Time Priority — Why Order Sequence Matters

Price-time priority has two consequences that every serious trader must understand:

**Consequence 1 — Queue Position Matters**

If you place a limit buy at ₹500.00, you are queued behind every existing order at ₹500.00. If 50,000 shares are already queued at ₹500.00 before you, your 1,000-share order only fills after all 50,000 shares fill first.

This is why in thin markets, your limit orders may sit unfilled even as trades occur at your price — other participants ahead of you in the queue filled first.

**Consequence 2 — Order Cancellation is Common**

Large participants (especially algos and HFTs) frequently place and cancel orders. An order at ₹500.00 showing 50,000 shares may disappear before price reaches that level — it was cancelled. This is "displayed liquidity" that is not necessarily real.

---

### 2.6 The Critical Rule — Every Trade Has Both a Buyer and a Seller

![Price Discovery — The Continuous Auction Mechanism on NSE](/images/pi-price-discovery-auction.jpg)

This is the single most important mechanical fact in this course, and the one most commonly ignored.

**When an NSE trade executes:**
- There is exactly one buyer and one seller
- Both participants agreed on the price (the buyer accepted the ask, or the seller accepted the bid)
- The volume of that trade belongs to BOTH of them simultaneously

**What this means for analysis:**

```
Session summary: 10 lakh shares traded, price up 2%

Common (wrong) interpretation:
"Buyers purchased 10 lakh shares today — strong buying."

Correct interpretation:
"10 lakh shares CHANGED HANDS today. 10 lakh shares were
purchased AND 10 lakh shares were sold. The net result of
all these transactions produced a 2% price increase."
```

The price increased because the **buyers were more aggressive** — they were willing to pay higher and higher prices to acquire shares. But every share they bought, someone else sold.

**Rephrasing supply and demand correctly:**

> "Demand exceeded supply" means: buyers were willing to pay higher prices faster than sellers were willing to accept them, causing price to rise.

> NOT: "More buyers than sellers" — that is arithmetically impossible. Every buy matches a sell.

**Why this matters for VSA and Volume Analysis:**

When you see 5x average volume on an up day:
- 5x average shares were purchased AND 5x average shares were sold
- The question is NOT "who was buying more?"
- The correct question is: **"Which side was more aggressive? Who initiated the transaction by crossing the spread? And what did the price close at, relative to the session range?"**

These questions are what Volume Spread Analysis attempts to answer from OHLCV data — with the understanding that the answer is always an INFERENCE, not a FACT.

---

## LEVEL 2 — INTERMEDIATE

### 2.7 Market Impact — What Happens When Large Orders Execute

![Market Impact — How a Large Order Moves Price Through the Order Book](/images/pi-market-impact.jpg)

**Market impact** is the price change caused by the execution of an order.

For a retail trader buying 100 shares of a Nifty 50 stock, market impact is essentially zero — the order is absorbed into the existing liquidity without measurable price change.

For an institution buying 5,00,000 shares, market impact is significant — the order consumes multiple levels of the order book, and price moves against the buyer as they execute.

**Numerical example:**

```
Order book (ask side):
₹500.50 → 2,000 shares
₹501.00 → 4,000 shares  
₹501.50 → 6,000 shares
₹502.00 → 4,000 shares
₹502.50 → 8,000 shares

Institution places: Market BUY for 15,000 shares

Execution sequence:
2,000 @ ₹500.50  →  ₹10,01,000
4,000 @ ₹501.00  →  ₹20,04,000
6,000 @ ₹501.50  →  ₹30,09,000
3,000 @ ₹502.00  →  ₹15,06,000

Total: 15,000 shares for ₹75,20,000

Average execution price: ₹75,20,000 ÷ 15,000 = ₹501.33

Slippage: ₹501.33 − ₹500.50 = ₹0.83 per share
(vs if the entire order had filled at the best ask)

Price impact: ₹500.50 → ₹502.00 (+₹1.50, or 0.3%)
```

**The VSA connection:**

This market impact mechanism is precisely why a wide-spread bar on high volume at a support level can indicate institutional buying — a large buyer consuming multiple levels of the offer side creates:
1. High volume (many shares traded)
2. Wide spread (price moved through several levels)
3. Close near high (the aggressive buyer drove price up and held it there)

However — the same pattern could be produced by multiple retail buyers collectively, a short squeeze, a news event, or mechanical index flows. The OHLCV output is identical. Context, background, and additional data distinguish them.

---

### 2.8 Why Price Moves — The Auction Framework

**Price moves for ONE reason only:**

> One side of the market (buyers or sellers) becomes willing to transact at a different price than the current one.

**Mechanism of price increase:**
```
Current state: Best Bid ₹500, Best Ask ₹501
→ An aggressive buyer places a market order (takes the ask)
→ Fills at ₹501. New LTP = ₹501
→ Next seller now asks ₹501.50
→ Another buyer accepts ₹501.50
→ LTP = ₹501.50

Price has risen because BUYERS were willing to pay
increasingly higher prices to acquire shares.
```

**Mechanism of price decrease:**
```
Current state: Best Bid ₹500, Best Ask ₹501
→ An aggressive seller places a market order (hits the bid)
→ Fills at ₹500. New LTP = ₹500
→ Next buyer now bids ₹499.50
→ Another seller hits ₹499.50
→ LTP = ₹499.50

Price has fallen because SELLERS were willing to accept
increasingly lower prices to exit their position.
```

**Mechanism of ranging / sideways price:**
```
Neither buyers nor sellers are willing to deviate from the
current price range. Buyers at ₹498-500, sellers at ₹501-503.
Price bounces within this range until one side capitulates
or a new participant enters with larger size.
```

---

### The NSE Pre-Open Session — A Call Auction

NSE operates two distinct price formation mechanisms each trading day:

**Pre-Open Session (9:00 AM – 9:15 AM):**
- A **call auction** — all orders are collected but not immediately matched
- 9:00–9:08 AM: Order entry, modification, cancellation
- 9:08–9:12 AM: Order matching — system calculates the price at which **maximum quantity** can be traded
- 9:12–9:15 AM: Buffer / transition period
- The resulting price is the **Opening Price** — often the most informative price of the day

**Opening Price significance for VSA:**
- If opening price gaps significantly above/below previous close → strong overnight sentiment shift
- The opening volume in first 15 minutes often reflects institutional repositioning
- Pre-open auction also sets the opening of Nifty 50 and other major indices

**Continuous Session (9:15 AM – 3:30 PM):**
- Bilateral continuous matching
- Every incoming order is immediately matched against resting orders if possible
- This is where all standard candlestick data is generated

**Closing Price Formation (3:30 PM – 3:40 PM):**
- A closing call auction runs for the final 10 minutes of the Nifty 50 stocks and other major index constituents
- The closing price is calculated at the volume-maximising price
- **Critical:** The closing price is NOT simply the last trade of the continuous session
- This affects how "close on highs/lows" should be interpreted for index constituents

---

### 2.9 The Bid-Ask Spread as a Market Quality Indicator

Spread size varies significantly across different types of stocks on NSE:

| Stock Type | Typical Spread | Implication |
|------------|---------------|-------------|
| Nifty 50 large-cap (e.g., Reliance) | ₹0.05–₹0.50 | Very liquid — tight spread |
| Mid-cap (e.g., IRCTC) | ₹0.50–₹2.00 | Moderate liquidity |
| Small-cap | ₹1–₹10+ | Thin liquidity — wide spread |
| Illiquid small-cap | ₹5–₹50+ | Dangerous for analysis |

**Why spread matters for VSA analysis:**

When you see a "wide spread bar" (large range bar) in VSA:
- On a large-cap stock: The spread is tight — the bar's range reflects genuine price discovery
- On a small-cap stock: The bar's range may partly reflect the wide bid-ask spread, not genuine price movement
- **Rule:** VSA patterns are significantly more reliable on liquid stocks where bid-ask spread is tight

**Spread expansion during volatility:**
- During news events, earnings releases, or sharp market moves, the bid-ask spread widens
- Market makers pull quotes (withdraw limit orders) — reducing displayed liquidity
- This causes apparent volume spikes as the price sweeps through thinner liquidity
- INFERENCE risk: A volume spike during an earnings announcement may be spread-widening driven, not accumulation-driven

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### Price Formation from the Microstructure Perspective

*This section connects price formation to the concepts in Chapter 22 (Advanced Microstructure). Read this section now for conceptual grounding — the full treatment is in Chapter 22.*

**The Adverse Selection Problem:**

When you place a limit order at ₹500 to buy, you are providing liquidity. Someone will hit your bid when they want to sell immediately. The question is: **why are they selling to you?**

- Possibility A: They need cash urgently (liquidity-motivated seller) → They had no private information → Your trade was fine
- Possibility B: They have negative information about the stock → They are selling to you because you are the unaware party → You will likely lose

This is **adverse selection** — the risk that the counterparty transacting with you is informationally superior.

**Implications for market-making:**
- Professionals who provide continuous bid-ask liquidity must price in adverse selection risk
- This is why spreads are wider in less liquid stocks — the probability of adverse selection is higher
- This is why spreads widen before major news announcements — everyone knows informed traders are more likely to be active

**Implications for your analysis:**

When a large buyer appears willing to absorb heavy selling (as in a Selling Climax), there are two possible explanations:
- They have superior information and believe the stock is undervalued → Accumulation (HYPOTHESIS)
- They are wrong and are catching a falling knife → They will eventually be forced to sell → No bottom yet (ALTERNATIVE HYPOTHESIS)

OHLCV cannot distinguish these cases at the time of the event. Only subsequent price action can confirm.

---

### Price Discovery as Information Aggregation

From an academic market microstructure perspective, price serves an information aggregation function:

- Participants with private information trade based on it (e.g., an insider legally or illegally)
- Their trading activity moves price toward the "true" value
- Other participants observe the price movement and infer that information exists
- They adjust their orders, further incorporating the information into price

This process — **Glosten-Milgrom model** (academic reference) — explains why:
- Price moves before obvious news announcements (smart money already positioned)
- Volume often increases before major moves (informed participants trading)
- Wide-spread bars on high volume at turning points may reflect informed participation

**However — critical discipline:**

The fact that this mechanism exists does not mean every volume spike is informed trading. The majority of volume in liquid stocks is:
- Liquidity trading (institutions meeting redemptions, ETF rebalancing)
- Algo execution (VWAP/TWAP slicing)
- HFT market-making (not directional)
- Retail noise

The professional analyst distinguishes these possibilities through weight of evidence, context, and confirmation — not through a single bar pattern.

---

### The Price Impact Function — A Quantitative View

For professional analysis, the relationship between order size and price impact can be approximated:

**Square-root model (widely used in institutional trading):**

```
Price Impact (%) ≈ σ × √(Q / ADV)

Where:
σ  = daily volatility of the stock (e.g., 1.5%)
Q  = order size in shares
ADV = average daily volume in shares
```

**Example:**

```
Stock:  Infosys
σ:      1.5% daily volatility
ADV:    50 lakh shares
Order:  5 lakh shares (10% of ADV)

Impact ≈ 1.5% × √(5,00,000 / 50,00,000)
        = 1.5% × √0.10
        = 1.5% × 0.316
        = 0.47%

So a 5 lakh share order in Infosys is estimated to
move price approximately 0.47%.
```

**What this tells you about institutional execution:**

A large fund buying 50 lakh shares of Infosys would face approximately:
- 1.5% × √(50,00,000 / 50,00,000) = 1.5% × 1.0 = 1.5% impact

At ₹1,500 per share, that's ₹22.50 per share in execution cost from market impact alone — before brokerage.

This is why institutions:
1. Spread orders across multiple sessions (reducing Q/ADV in any single session)
2. Use VWAP/TWAP algorithms to minimise market impact
3. Use dark pools (off-exchange venues) where available (limited in India currently)
4. Use futures first, then roll to cash (faster, less impact in derivatives)

**VSA implication:**

When you observe a large-cap stock's volume 3–4x average over 10–15 sessions in a sideways range with limited price movement — this is consistent with institutional execution across multiple sessions to minimise impact. This is the Wyckoff accumulation pattern viewed through the lens of microstructure theory.

---

## EXERCISES

### Beginner Exercises

**Exercise 2.1 — Bid/Ask/Spread Calculations**

Given this order book snapshot for a stock:

| Side | Price | Quantity |
|------|-------|----------|
| Ask | ₹245.30 | 1,200 |
| Ask | ₹245.20 | 3,400 |
| Ask | ₹245.10 | 800 |
| **← Best Ask** | | |
| **→ Best Bid** | | |
| Bid | ₹245.00 | 2,100 |
| Bid | ₹244.90 | 5,600 |
| Bid | ₹244.80 | 9,000 |

a) What is the Best Bid price?
b) What is the Best Ask price?
c) What is the Spread?
d) If you place a Market BUY for 500 shares, at what price do you execute?
e) If you place a Market SELL for 500 shares, at what price do you execute?
f) If you placed a Market BUY for 1,500 shares, what would happen?

**Exercise 2.2 — Trade Matching**

Given the order book above, a new Limit BUY order arrives for 2,000 shares at ₹245.10:
- Does this order match immediately? Why or why not?
- At what price does it execute (if it does)?
- How many shares execute immediately?
- What happens to the remaining shares?

**Exercise 2.3 — The Buyer-Seller Identity**

A stock trades 80 lakh shares on a particular session. Price closes up 3.5%.
a) How many shares were bought during this session?
b) How many shares were sold during this session?
c) Were there "more buyers than sellers" or "more sellers than buyers"?
d) Explain in precise terms why the price rose 3.5%.

---

### Intermediate Exercises

**Exercise 2.4 — Market Impact Calculation**

Order book (ask side only):

| Price | Quantity |
|-------|---------|
| ₹1,000.00 | 500 |
| ₹1,000.50 | 1,200 |
| ₹1,001.00 | 2,000 |
| ₹1,001.50 | 3,500 |
| ₹1,002.00 | 5,000 |

A market BUY order for 7,000 shares arrives.

a) At which prices does the order execute, and how many shares at each price?
b) What is the average execution price?
c) What is the slippage vs the initial best ask?
d) After execution, what is the new Best Ask?
e) What does this price movement look like on a candlestick chart?

**Exercise 2.5 — Opening Price Analysis**

NSE's pre-open session for a Nifty 50 stock shows:
- Previous close: ₹2,340
- Pre-open volume: 4.8 lakh shares (3x normal pre-open)
- Opening price: ₹2,365 (+1.07% gap up)
- Opening bar (first 15 minutes): Volume 8.5 lakh shares, High ₹2,370, Low ₹2,352, Close ₹2,355

Classify each of the following as FACT / OBSERVATION / INFERENCE / HYPOTHESIS:

a) The stock gapped up 1.07% from previous close.
b) The opening bar closed below the opening price.
c) Institutional buying drove the gap up.
d) The high pre-open volume suggests significant overnight order accumulation.
e) The closing below the opening price in the first 15 minutes indicates selling pressure after the gap.
f) The stock will close positive today.

**Exercise 2.6 — Spread and Liquidity Context**

You observe the following for two stocks on the same day:

**Stock A (Nifty 50 constituent):**
- Volume: 3x average
- Wide spread bar: Range ₹8, Close near high
- Bid-Ask spread: ₹0.10

**Stock B (Small-cap, BSE SME listed):**
- Volume: 5x average
- Wide spread bar: Range ₹12, Close near high
- Bid-Ask spread: ₹3.50

Which stock's VSA pattern is more reliable? Explain precisely why, using the concept of bid-ask spread's relationship to the bar range.

---

### Advanced Exercises

**Exercise 2.7 — Institutional Execution Modelling**

A large fund needs to buy 25 lakh shares of a mid-cap stock with:
- Current price: ₹800
- Average daily volume: 10 lakh shares
- Daily volatility: 2.0%

a) Using the square-root model, estimate the price impact of executing the entire order in one session.
b) If the fund spreads the order across 5 sessions (5 lakh shares/day), re-estimate the daily impact.
c) What would the volume signature look like on a daily chart over these 5 sessions?
d) How would a VSA analyst likely interpret this volume pattern?
e) What additional data would help confirm or reject the institutional accumulation hypothesis?

**Exercise 2.8 — Adverse Selection**

You are analysis a stock where the bid-ask spread has widened from ₹0.30 to ₹1.80 in the hour before an earnings announcement.

a) Why has the spread widened?
b) Who is withdrawing liquidity, and why?
c) If a large buyer executes a market order during this period, what is different about the cost of their trade vs a normal session?
d) After the earnings announcement (positive surprise), volume is 10x average and price jumps 5%. Is this VSA-readable as normal institutional accumulation? Why or why not?
e) Classify this volume spike: FACT / OBSERVATION / INFERENCE / HYPOTHESIS — for the claim "this was institutional accumulation."

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** Define price discovery in precisely one sentence. Who or what sets the price on NSE?

**Q2.** What is the difference between the Best Bid, Best Ask, and Last Traded Price? Can all three be different simultaneously?

**Q3.** Explain price-time priority. If two buyers both place limit orders at ₹500.00, which one gets filled first?

**Q4.** Why is the statement "there were more buyers than sellers today" arithmetically incorrect?

**Q5.** What is the spread, and why does it represent a cost for traders?

**Q6.** How does the NSE pre-open call auction differ from the continuous matching session? Why does the opening price matter for analysis?

**Q7.** What is market impact? Why does it scale with order size in a non-linear way?

**Q8.** Explain the adverse selection problem faced by a market maker. How does this relate to spread widening before news events?

**Q9.** A stock's Ask side shows 50,000 shares at ₹500. Price is currently ₹499.50. What does this 50,000 share ask represent, and why might it disappear before price reaches ₹500?

**Q10.** In VSA, a wide-spread up bar on high volume is often called a "Sign of Strength." Using your understanding of market impact and order book mechanics, explain the precise mechanism that creates this pattern.

---

### Chart Scenario Questions (5)

**S1.** You observe a daily candlestick: Open ₹480, High ₹496, Low ₹478, Close ₹494. Volume is 4.2x the 20-day average.
- Calculate the spread (range) of this bar.
- Where did the close occur relative to the bar's range? (Express as a percentage from bottom)
- Using ONLY this data, write one OBSERVATION, one INFERENCE, and one thing that is UNKNOWN.

**S2.** A stock trades 8 lakh shares in the first 15 minutes after open, then only 60,000 shares for the remainder of the 6-hour session. Total daily volume is 8.6 lakh shares.
- What is unusual about this distribution of volume?
- List three possible explanations for the high opening volume.
- Can you determine which explanation is correct from this data alone?

**S3.** During a sharp intraday decline in a Nifty 50 stock, you observe the bid-ask spread widen from ₹0.20 to ₹2.50 over 5 minutes. Volume in this 5-minute period is 12x the usual 5-minute average volume.
- What is happening to market liquidity?
- Why is volume 12x higher when participants are clearly uncertain?
- Is this volume signature comparable to a normal high-volume bar? Why not?

**S4.** A stock closes at ₹300. The pre-open session the next day shows a massive imbalance: 45 lakh shares of buy orders at ₹315, only 8 lakh shares of sell orders below ₹320. The stock opens at ₹318.
- Walk through the call auction mechanism that produced the ₹318 opening price.
- What does the order imbalance tell you about overnight sentiment?
- Classify the statement: "Institutions bought heavily overnight causing the gap up."

**S5.** An institutional fund places a VWAP order to buy 10 lakh shares of a Nifty 50 stock over the full 6-hour session. Average daily volume is 50 lakh shares.
- How many shares approximately per hour would the algo execute?
- What would this look like on a daily OHLCV chart?
- Would a VSA analyst be able to distinguish this from "no special activity" on a daily chart? What about on an hourly chart?

---

### Numerical Exercises (5)

**N1.** Calculate the average execution price and slippage for a market BUY of 8,000 shares given:
- ₹100.00 → 1,000 available
- ₹100.50 → 2,500 available
- ₹101.00 → 3,000 available
- ₹101.50 → 4,000 available

**N2.** Using the square-root model, calculate the estimated market impact for:
- Stock with σ = 1.8%, ADV = 20 lakh shares
- Order size = 2 lakh shares

**N3.** A stock's bid-ask spread is ₹0.80. A trader buys 1,000 shares and immediately sells them (round trip).
- What is the total cost from spread alone?
- If the stock price is ₹400, what is this as a percentage of trade value?

**N4.** Over 10 consecutive sessions, a stock shows the following delivery %:
22%, 24%, 26%, 28%, 31%, 63%, 71%, 68%, 72%, 70%

At which session did a significant change occur? What are the possible interpretations?

**N5.** A stock's pre-open order book at 9:08 AM:
- Buy orders: 1,00,000 @ ₹500, 80,000 @ ₹499, 60,000 @ ₹498
- Sell orders: 40,000 @ ₹498, 70,000 @ ₹499, 1,20,000 @ ₹500

At which price would the call auction maximise traded volume? Calculate the volume at each possible clearing price.

---

## QUIZ ANSWERS

### Conceptual Answers

**A1.** Price discovery is the process by which the interaction of all buy and sell orders in a market determines the current price of an asset. No single entity sets the price — it emerges from the matching of willing buyers and sellers.

**A2.** Yes, all three can be different simultaneously. Best Bid = highest current buy order. Best Ask = lowest current sell order. LTP = price of the last executed trade. A trade may have occurred in between the current bid and ask, and the bid/ask may have moved since that trade.

**A3.** Price-time priority: among orders at the same price level, the order submitted earlier is matched first. If Buyer A placed a ₹500 bid at 10:05:23 and Buyer B placed a ₹500 bid at 10:05:24, Buyer A's order is matched first.

**A4.** Every executed trade has exactly one buyer and one seller. The number of buyers always equals the number of sellers for any given trade and for the session total. "More buyers" is therefore arithmetically impossible — it is a colloquial way of saying buyers were more aggressive (willing to pay higher prices).

**A5.** Spread = Best Ask − Best Bid. It represents the cost of immediacy — if you want to transact right now, you buy at the Ask and sell at the Bid. A round-trip trade (buy then sell immediately) loses the full spread.

**A6.** Pre-open is a call auction: orders are collected for 8 minutes, then matched simultaneously at the price maximising traded volume. Continuous session is bilateral matching — each incoming order matches immediately if possible. The opening price matters because it reflects the net effect of all overnight information and pre-market order flow.

**A7.** Market impact is the price change caused by executing an order. It scales non-linearly (approximately with the square root of order size relative to average volume) because larger orders consume progressively more distant and thinner liquidity levels.

**A8.** A market maker placing limit orders risks being hit by a counterparty with superior information. Before news, the probability of this adverse selection increases — so market makers widen spreads (or withdraw quotes) to compensate for the higher risk of transacting with an informed party.

**A9.** The 50,000 shares at ₹500 represents displayed sell-side liquidity — orders placed by participants willing to sell at ₹500. However, this liquidity may not be genuine: it can be cancelled before price reaches ₹500 (common with algo/HFT activity). Only liquidity that actually executes is real.

**A10.** A wide-spread up bar on high volume is mechanically produced when aggressive buyers submit market orders (or aggressive limit orders above the ask) that sweep through multiple levels of the offer side. This requires: (1) sufficient buying demand to absorb all available sell orders at each price level, (2) no new sellers willing to add supply fast enough to prevent price rising, and (3) the sustained buying pressure keeping the close near the high. The mechanism is: buyer aggression + insufficient supply replenishment = wide range, high volume, close near top.

---

### Numerical Answers

**N1:**
```
1,000 @ ₹100.00 = ₹1,00,000
2,500 @ ₹100.50 = ₹2,51,250
3,000 @ ₹101.00 = ₹3,03,000
1,500 @ ₹101.50 = ₹1,52,250 (only 1,500 needed from this level)

Total: 8,000 shares for ₹8,06,500
Average price: ₹100.81
Slippage vs best ask (₹100.00): ₹0.81 per share
```

**N2:**
```
Impact ≈ 1.8% × √(2,00,000 / 20,00,000)
        = 1.8% × √0.10
        = 1.8% × 0.316
        = 0.57%
```

**N3:**
```
Round-trip spread cost = ₹0.80 × 1,000 = ₹800
As % of trade value: ₹800 / (₹400 × 1,000) = 0.20%
```

**N5 (Call Auction):**
```
At ₹498: Buyers ≥ ₹498 = 2,40,000. Sellers ≤ ₹498 = 40,000. Matches = 40,000.
At ₹499: Buyers ≥ ₹499 = 1,80,000. Sellers ≤ ₹499 = 1,10,000. Matches = 1,10,000.
At ₹500: Buyers ≥ ₹500 = 1,00,000. Sellers ≤ ₹500 = 2,30,000. Matches = 1,00,000.

Maximum matched quantity is at ₹499 → Opening price = ₹499.
```

---

## KEY TAKEAWAYS — CHAPTER 2

> **1. Price is not set by any single entity — it emerges from the continuous matching of buy and sell orders by the NSE/BSE matching engine.**

> **2. Best Bid = highest current buyer price. Best Ask = lowest current seller price. Spread = the cost of immediacy. LTP = price of the last trade.**

> **3. Every trade has exactly one buyer and one seller. Price rises when buyers are willing to PAY MORE — not because there are "more buyers."**

> **4. Market impact is real and scales non-linearly. Large institutional orders move price as they execute — this is the mechanical origin of VSA patterns like wide-spread bars on high volume.**

> **5. The NSE pre-open call auction sets the opening price at maximum traded quantity — it is informationally significant, not random.**

> **6. Spread width is a liquidity indicator. VSA patterns are more reliable on liquid stocks (tight spread). Wide-spread bars on thin-spread stocks reflect genuine price movement; the same range on a wide-spread stock may partially reflect the bid-ask gap.**

> **7. Adverse selection — the risk of trading against a better-informed counterparty — explains spread widening before news events and is part of why market impact is higher in volatile conditions.**

---

*Chapter 2 Complete.*

---

**Previous:** [← Chapter 1 — How Markets Work](./how-markets-work.md)
**Next:** [Chapter 3 — Order Types →](./order-types.md)

*When ready, say: **"NEXT CHAPTER"***
