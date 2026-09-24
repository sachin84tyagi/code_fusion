# Chapter 8 — Understanding Volume

> **Course:** NSE/BSE Professional Volume + Price Action + VSA + Wyckoff + Market Microstructure
> **Part:** IV — Volume
> **Prerequisite:** Chapters 2 (Price Formation), 5 (Liquidity), 6 (Candlestick Mechanics)

---

## Chapter Overview

Volume is the most misunderstood concept in retail trading. Most traders treat it as a binary signal: "high volume = important, low volume = ignore." Professional analysts treat volume as a **measure of effort** — and read it in precise relationship to price, not in isolation.

This chapter builds a foundational, mechanically grounded understanding of volume before applying it to VSA patterns. Every concept introduced here is used in Chapters 9–14.

**The Chapter 8 Rule:**

> **Volume in isolation means nothing. Volume only gains meaning when read in relationship to: (1) the price movement it produced, (2) the close location of that bar, and (3) the background context of the prior 10–20 bars.**

---

## LEVEL 1 — BEGINNER

### 8.1 What Volume Actually Is

![Understanding Volume — What It Measures and What It Doesn't](/images/pi-volume-anatomy.jpg)

**Volume** on NSE/BSE is the total number of shares that traded during a session (or any sub-session period).

**The bilateral nature of volume (Chapter 2 review):**

```
Every trade = one buyer + one seller

If 10 lakh shares traded today:
→ 10 lakh shares were BOUGHT
→ 10 lakh shares were SOLD

These are not two different numbers. They are the same 10 lakh shares
described from two perspectives.

"Strong buying volume" = 10 lakh shares
"Strong selling volume" = the same 10 lakh shares

The NET direction is determined by PRICE — not volume.
```

**What volume measures:**

**1. Participation (breadth of activity):**
High volume = many participants transacted. Low volume = few participants.

This is meaningful because:
- A price move with broad participation behind it has more "weight" than the same move on thin trading
- High participation = more participants "committed" to the new price level
- Low participation = the price move may not represent broad consensus

**2. Effort:**
Volume measures the effort expended to produce a price result. This is VSA's core concept:
- High volume that moves price significantly = effort is "efficient" — force is working
- High volume that moves price very little = effort is "inefficient" — opposing force is resisting

**3. Commitment (via delivery %):**
Delivery % = shares delivered (not reversed intraday) as a % of total volume.
- High delivery (> 50–60%) = participants are holding overnight = conviction
- Low delivery (< 30%) = mostly intraday activity = short-term noise

**What volume CANNOT measure (UNKNOWN):**

| Unknown | Why |
|---------|-----|
| Who is buying vs who is selling | All trades are anonymous on NSE |
| Whether buyers or sellers initiated | Both sides needed for every trade |
| Whether activity is institutional or retail | Order size ≠ participant type |
| Net directional flow | Price direction provides the clue, not volume alone |

This is the most important limitation to internalise. Volume is ALWAYS bilateral.

---

### 8.2 How NSE/BSE Volume is Reported

**Cash equity (stocks):**
- Volume = total shares traded
- Reported in shares (not lots)
- Available for every trading session going back years
- Separate "delivery volume" available (from NSE bhavcopy data)

**Futures & Options:**
- Volume = contracts traded (each contract = lot size)
- Open Interest (OI) is an additional metric unique to derivatives (covered in Chapter 20)
- For Nifty futures: 1 contract = 75 units
- Volume in contracts, OI in contracts

**Index volume:**
- NSE Nifty 50 does not have "volume" in the traditional sense (it's an index, not a tradable instrument directly)
- Nifty futures volume is used as the proxy
- ETF volumes (Nifty BeES, etc.) also relevant

**Intraday volume distribution:**
Volume is not evenly distributed across the trading session:

```
Typical NSE intraday volume distribution:
9:15–9:30 AM:  15–20% of daily volume (opening, HFT, pre-open carryover)
9:30–11:00 AM: 20–25% of daily volume (active trading)
11:00 AM–1:00 PM: 15–20% (lunch lull begins)
1:00–2:30 PM:  15–18% (midday lowest activity)
2:30–3:30 PM:  20–25% (closing activity, position squaring)

This U-shaped distribution is common across most equity markets.
```

**Why intraday distribution matters for analysis:**

A 5-minute bar with 2× normal volume at 9:20 AM is not equivalent to a 5-minute bar with 2× normal volume at 1:00 PM. The 9:20 AM bar's volume must be compared to the typical 9:20 AM volume, not the overall average. This is rarely done by retail traders and frequently exploited by more sophisticated participants.

---

### 8.3 Relative Volume (RelVol) — The Only Meaningful Volume Comparison

![Relative Volume (RelVol) — The Only Meaningful Volume Comparison](/images/pi-relative-volume.jpg)

Raw volume numbers are meaningless without context. Reliance may trade 80 lakh shares on a "quiet" day and 150 lakh shares on a "busy" day. A small-cap may trade 50,000 shares normally and 5 lakh on a spike. You cannot compare these.

**The solution: Relative Volume (RelVol)**

```
RelVol = Today's Volume / N-period Average Daily Volume

Where N = typically 10, 14, or 20 periods (most common: 20)
```

**RelVol classification:**

| RelVol | Classification | VSA Significance |
|--------|---------------|-----------------|
| < 0.4 | Ultra-low | Potentially "No Supply" or "No Demand" bar |
| 0.4–0.7 | Low | Below average — limited participation |
| 0.7–1.3 | Average | Normal activity — baseline |
| 1.3–2.0 | Elevated | Worth noting — more than usual activity |
| 2.0–3.5 | High | Significant — broad participation likely |
| 3.5–6.0 | Very high | Major event — institutional activity likely |
| > 6.0 | Climactic | Extreme — stopping volume / climax territory |

**Calculating RelVol in practice:**

```
Example: NSE mid-cap stock
20-day average daily volume: 8 lakh shares

Today's volume: 28 lakh shares
RelVol = 28 / 8 = 3.5× → "Very High" → Significant activity

Another day: 6 lakh shares
RelVol = 6 / 8 = 0.75× → "Below average" → Limited participation
```

**Two RelVol considerations:**

**1. The lookback period matters:**
Using a 20-day average is most common. But if the stock recently had a volume spike (event), the average itself is elevated — making subsequent bars look relatively lower. Use judgment: if the baseline has been distorted by a recent spike, extend the lookback to 40–60 days.

**2. Volume within a trend context:**
During an uptrend, DECLINING volume on pullbacks is the healthy pattern:
- Up days: Higher volume (demand active)
- Down days: Lower volume (supply limited)
The RelVol of the pullback bars should ideally be < 1.0 compared to the up bars.

---

### 8.4 Delivery Volume and Delivery Percentage

**Delivery volume** is the portion of total volume where shares were actually transferred (delivered) from seller to buyer — i.e., the position was NOT squared off intraday.

**Delivery %** = Delivery Volume / Total Volume × 100

**NSE data source:** Available in the NSE bhavcopy (end-of-day file) and on the NSE website. Zerodha, Sensibull, and most data providers display it.

**What delivery % tells you:**

```
High delivery % (> 55–65%):
→ Most participants who bought held overnight
→ Conviction — they believe in the position
→ INFERENCE: More likely to be positional/institutional activity

Low delivery % (< 25–30%):
→ Most activity was intraday (bought and sold same day)
→ Speculation, stop cascades, or intraday momentum
→ INFERENCE: Less committed capital — price move may not sustain

Very high delivery % (> 75%):
→ Strong conviction — institutional accumulation possible
→ Combined with high volume + close near high = strong bullish inference
```

**Delivery % benchmarks by stock type:**

| Stock Type | Normal Delivery % | Elevated Delivery % |
|-----------|-----------------|-------------------|
| Nifty 50 large-cap | 25–40% | > 55% |
| Mid-cap | 30–50% | > 65% |
| Small-cap | 35–55% | > 70% |
| F&O stocks | 15–30% (more intraday) | > 45% |

**Important caveat:**
Delivery % is a proxy, not a guarantee. A large mutual fund selling is high delivery. A large HFT buying and selling in microseconds is low delivery. Both are "institutional." Delivery % measures commitment duration, not participant type.

---

### 8.5 Volume and Price — The Core Relationship

The relationship between volume and the price result it produces is the foundation of all volume analysis.

**Four fundamental volume-price relationships:**

**Relationship 1: High volume + Price moves significantly in one direction**
```
Volume: High (RelVol > 2.0)
Price result: Large range, closes decisively in one direction (top or bottom of range)

Interpretation:
→ Effort is EFFICIENT — force is producing result
→ The dominant side had control throughout the session
→ Strong signal: direction of close indicates the winning side
→ Evidence: INFERENCE (both sides traded — one side dominated)
```

**Relationship 2: High volume + Price moves very little (narrow range, middle close)**
```
Volume: High (RelVol > 2.0)
Price result: Narrow range, close near middle

Interpretation:
→ Effort is INEFFICIENT — large force produced small result
→ Two interpretations possible:
   A) Heavy supply is absorbing demand (at resistance) = bearish
   B) Heavy demand is absorbing supply (at support) = bullish
→ CONTEXT determines which: at support = A; at resistance = B
→ This is the VSA "absorption" bar
→ Evidence: INFERENCE (requires location context)
```

**Relationship 3: Low volume + Price moves up**
```
Volume: Low (RelVol < 0.7)
Price result: Moderate up bar, close in upper half

Interpretation:
→ Price moved up with little selling resistance
→ "No supply" — sellers were not active at this level
→ Bullish background condition — not a signal by itself
→ BUT: Also possible = no buyers either, just thin market drift
→ Evidence: INFERENCE (context dependent)
```

**Relationship 4: Low volume + Price moves down**
```
Volume: Low (RelVol < 0.7)
Price result: Moderate down bar, close in lower half

Interpretation:
→ Price moved down with little buying support
→ "No demand" — buyers were not active at this level
→ Bearish background condition
→ OR: thin market drift with no conviction
→ Evidence: INFERENCE (context dependent)
```

**The Effort-Result Matrix (VSA foundation):**

| Volume | Price Result | Effort-Result | Interpretation |
|--------|-------------|--------------|---------------|
| High | Large move up, top close | Efficient | Demand dominant |
| High | Large move down, bottom close | Efficient | Supply dominant |
| High | Tiny move, middle close | Inefficient | Absorption |
| Low | Moderate move up, top close | Easy | No supply |
| Low | Moderate move down, bottom close | Easy | No demand |
| Low | Tiny move | Very easy | No participation |

---

## LEVEL 2 — INTERMEDIATE

### 8.6 Volume Trends — Rising and Falling Volume

Just as price forms trends, volume forms trends. Reading volume trends is as important as reading price trends.

**Healthy uptrend volume pattern:**
```
Up days: Volume expanding (RelVol > 1.0)
Down days: Volume contracting (RelVol < 1.0)

This shows:
→ Demand is active when price rises (buyers are aggressive)
→ Supply is limited when price falls (sellers are not pressing)
→ The uptrend has genuine backing
```

**Weakening uptrend signals (divergence):**
```
Signal 1: Volume declining on up days
→ Buyers becoming less enthusiastic
→ Each rally requires less volume = fewer new buyers entering
→ INFERENCE: Uptrend losing momentum

Signal 2: Volume expanding on down days
→ More sellers active during pullbacks
→ Supply is increasing
→ INFERENCE: Distribution beginning, downward pressure building

Signal 3: Both signals simultaneously
→ Strong warning of trend change
→ Confirm with price structure (CHoCH watch)
```

**Healthy downtrend volume pattern:**
```
Down days: Volume expanding
Up days: Volume contracting

Weakening downtrend signal:
→ Declining volume on down days = sellers exhausting
→ Increasing volume on up days = demand returning
→ INFERENCE: Downtrend losing momentum, accumulation possible
```

**Volume trend divergence — a powerful warning:**

When price makes a new high but volume is LOWER than the prior high's volume:
```
Example:
Rally 1 to HH1: 25 lakh shares (RelVol 2.5×)
Rally 2 to HH2: 18 lakh shares (RelVol 1.8×) — lower volume on new high

Interpretation:
→ Less participation required for a new high
→ Two possible readings:
   A) Supply is diminishing (fewer sellers needed to be overcome) = bullish
   B) Demand is diminishing (fewer buyers driving the rally) = bearish (divergence)
→ Context determines: If background is accumulation phase A = bullish; if extended uptrend A = bearish divergence
```

This is the famous "volume divergence" concept — and the error most analysts make is assuming it is ALWAYS bearish. It is only bearish in a specific context (extended trend, top formation). In a trending market with no supply, it is bullish.

---

### 8.7 Volume Climaxes — Extreme Volume Events

A **volume climax** is a session (or multiple sessions) where volume is extreme — typically 4–8× the 20-period average — often accompanied by a wide-range bar.

**Two types of climaxes:**

**Buying Climax (BC):**
```
Context: After extended uptrend
Pattern: Wide up bar on extreme volume, often close near high initially
Mechanics:
→ Retail FOMO buyers all rush in at the same time
→ Professional participants sell their accumulated position into this demand
→ Wide range: Market impact of massive volume sweeping thin ask side
→ Close near high (initially) — but often a Doji or hanging man follows
→ Volume may be 5–10× average
→ This is TOP territory in Wyckoff distribution

Subsequent sessions:
→ Price stalls or falls despite "great news"
→ Volume contracts (no new buyers at these levels)
→ Structure begins deteriorating (Upthrust, CHoCH follow)
```

**Selling Climax (SC):**
```
Context: After extended downtrend
Pattern: Wide down bar on extreme volume, close often near middle or upper portion of range
Mechanics:
→ Panic sellers all exit at the same time (retail capitulation)
→ Professional participants absorb all this selling
→ Wide range: Cascade of SL-M orders sweeping thin bid side
→ Close often recovers from extreme low (buyers absorbing at the low)
→ Volume 5–10× average
→ This is BOTTOM territory in Wyckoff accumulation

Subsequent sessions:
→ Automatic Rally follows (price bounces from SC on decreasing volume)
→ Secondary Test (ST) retests the SC area on LOWER volume
→ ST holding above SC low = bullish confirmation
```

**Climax identification criteria:**

| Criterion | Buying Climax | Selling Climax |
|-----------|-------------|---------------|
| Volume | ≥ 4× recent average | ≥ 4× recent average |
| Prior trend | Extended uptrend | Extended downtrend |
| Range | Very wide | Very wide |
| Close location | Near high initially | Often recovers — middle to high |
| Subsequent action | Price stalls/reverses | Price bounces (AR) |
| Delivery % | Often elevated | Often elevated |

**CRITICAL CAVEAT:**

Not every high-volume bar is a climax. Volume spikes occur for many reasons:
- Earnings releases (mechanical — not directional)
- Index rebalancing (forced — not directional)
- Dividend stripping (technical — not directional)
- Block trades (single transaction — not representative of broad activity)
- F&O expiry settlement (mechanical)

Always ask: **"What is the context of this high volume? Is it driven by genuine supply-demand dynamics, or by a mechanical/event-driven factor?"**

---

### 8.8 NSE-Specific Volume Considerations

**1. F&O Expiry Effect:**

NSE has monthly F&O expiry on the last Thursday of each month. Volume patterns around expiry:
- Week before expiry: Elevated volume in futures (rollover activity)
- Expiry day: Sometimes elevated, sometimes normal depending on market conditions
- Near-month OI unwinding creates directional flows not related to fundamental supply/demand

**VSA rule:** Apply extra caution to OHLCV readings on the 2–3 sessions before and on expiry day. Volume spikes may be expiry-driven, not supply/demand driven.

**2. Bulk Deal / Block Deal Days:**

When a large institutional trade (bulk deal > 0.5% of outstanding shares or block deal) occurs:
- Volume spikes significantly on that day
- The spike represents ONE large transaction, not broad market participation
- VSA assumptions (many participants = reliable signal) break down

**NSE data source:** BSE/NSE publish bulk deal and block deal data daily. Before reading a volume spike, check if a bulk/block deal occurred.

**3. Dividend Stripping:**

Around the dividend record date:
- Volume spikes as traders buy for dividend and sell ex-date
- This mechanical activity is not demand-driven
- Stock often drops by dividend amount on ex-date

**4. Rights Issue / Split / Bonus Adjustments:**

Historical volume data may show artificial spikes around corporate actions. Data providers typically adjust for splits and bonuses but not always for rights issues. Always verify the corporate action calendar before interpreting historical volume anomalies.

**5. Earnings Season:**

NSE companies report quarterly (Q1: July–August, Q2: Oct–Nov, Q3: Jan–Feb, Q4: Apr–May).
- Volume spikes on earnings days are expected and mechanically driven
- The price AND volume reaction to earnings should be read differently from normal sessions
- A post-earnings high-volume wide-range bar is more informative than the earnings day bar itself

---

### 8.9 Delivery Volume — Advanced Usage

**The delivery volume trend:**

Delivery % on a single day is informative but noisy. The TREND of delivery % over 5–10 sessions is more reliable.

```
Accumulation pattern in delivery %:
Day 1–3: Delivery 28%, 31%, 35% (rising quietly)
Day 4–6: Delivery 42%, 48%, 52% (continuing to rise)
Day 7–8: Delivery 61%, 67% (significant — institutional holding)

Combined with: Stable price + moderate-to-high total volume

Interpretation:
→ Rising delivery % with stable price and elevated volume = INFERENCE of accumulation
→ Someone is repeatedly buying and HOLDING (not selling intraday)
→ Hypothesis: Institutional positioning before a move

Confirmation needed: Price eventually breaks above structure (SOS / BOS)
```

**Delivery % and trend strength:**

| Scenario | Delivery % | Interpretation |
|----------|-----------|---------------|
| Uptrend + rising delivery | > 55% | INFERENCE: Institutional buying = trend healthy |
| Uptrend + falling delivery | < 30% | INFERENCE: Retail speculation = trend weakening |
| Support bounce + high delivery | > 60% | INFERENCE: Conviction buying = likely genuine |
| Support bounce + low delivery | < 25% | INFERENCE: Intraday bounce = may not hold |
| Breakdown + high delivery | > 60% | INFERENCE: Conviction selling = likely sustained |
| Breakdown + low delivery | < 25% | INFERENCE: Stop cascade = may be shakeout |

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### Volume as Information Theory — The Glosten-Milgrom Connection

From an academic market microstructure perspective, volume carries information content:

**The information interpretation:**

When a large transaction occurs at a price, the transacting party either:
1. **Has information** (informed trader) — knows something about future price
2. **Has liquidity needs** (noise trader) — no information, just needs to transact

The price impact of the trade depends on which type:
- Informed trader: Market maker adjusts quotes AWAY from the direction of the trade (adverse selection)
- Noise trader: Market maker absorbs and price reverts

**The professional volume reading:**

Large volume that MOVES price decisively + price HOLDS the new level (does not revert) → More consistent with INFORMED trading

Large volume that barely moves price + price reverts quickly → More consistent with NOISE trading (absorption/mechanical)

This is the academic basis for the VSA principle: "High volume + narrow range + middle close = absorption (not directional information)."

---

### Volume and Market Microstructure — What Volume Counts

**Not all volume is equal:**

From the order book perspective (Chapter 4), volume is generated by different participant types:

| Participant | Volume Type | Directional Info |
|------------|------------|-----------------|
| HFT market-making | Bilateral, very fast | Near zero — they hedge instantly |
| Retail market orders | Directional | Low (noise traders) |
| Institutional VWAP | Spread across session | Medium (slow accumulation) |
| Institutional block | Single large transaction | High (committed position) |
| Index rebalancing | Forced, time-bound | None (mechanical) |
| F&O delta hedging | Follows options, not stock | None (derivative-driven) |

**The implication:** OHLCV volume is the SUM of all these. Distinguishing them from volume alone is impossible. This is why:
- High delivery % helps identify non-HFT activity (HFT doesn't deliver)
- Block deal data helps identify single-transaction volume
- OI data (F&O) helps identify derivative-driven stock volume

---

### Constructing a Volume Analysis Framework

A professional volume analysis goes through these layers:

**Layer 1 — Baseline establishment:**
```
20-day average volume for this stock: _____ shares
20-day average delivery %: _____%
Current stock type: Large-cap / Mid-cap / Small-cap
Bid-ask spread: ₹_____ (____%)
Liquidity classification: Deep / Moderate / Thin
```

**Layer 2 — Event screening:**
```
Any bulk/block deals today? Yes/No → Source: NSE data
F&O expiry this week? Yes/No
Earnings in last 5 sessions? Yes/No
Dividend record date? Yes/No
Corporate action? Yes/No

If YES to any: Flag this session — apply extra caution to volume reading
```

**Layer 3 — RelVol calculation:**
```
Today's volume: _____ shares
RelVol = Today / 20-day avg = _____×
Classification: Ultra-low / Low / Average / Elevated / High / Very High / Climactic
```

**Layer 4 — Price-volume relationship:**
```
Bar range: ₹_____ (close location: ____%)
ATR (14): ₹_____
Normalised range (today / ATR): _____×

Volume-Price match:
High volume + wide range + decisive close = Efficient effort
High volume + narrow range + middle close = Inefficient effort (absorption)
Low volume + moderate move = No supply/No demand
```

**Layer 5 — Background:**
```
Prior 10-bar volume trend: Rising / Falling / Flat
Volume on last 3 up bars vs last 3 down bars: _____ vs _____
Prior VSA events: _____
Structural context (BOS/CHoCH/Range): _____
```

**Layer 6 — Synthesis:**
```
Combine all layers → Form hypothesis
Evidence classification: FACT / OBSERVATION / INFERENCE / HYPOTHESIS
Define: Confirmation criteria
Define: Invalidation criteria
```

---

## EXERCISES

### Beginner Exercises

**Exercise 8.1 — RelVol Calculation**

A stock has these daily volumes over 20 sessions (in lakh shares):
4.2, 3.8, 5.1, 4.6, 3.9, 4.8, 5.2, 4.1, 4.4, 3.7,
6.8, 4.3, 4.9, 5.0, 4.2, 3.8, 4.6, 4.1, **12.4**, **18.7**

a) Calculate the 18-session average (first 18 bars).
b) Calculate RelVol for session 19.
c) Calculate RelVol for session 20.
d) Classify both using the RelVol table.
e) If session 19 closed in the bottom 15% of its range, what is the preliminary VSA reading?
f) If session 20 closed in the top 80% of its range, what changes in the reading?

**Exercise 8.2 — Delivery % Interpretation**

A stock shows this data over 8 sessions around a prior support level:

| Session | Volume | RelVol | Delivery % | Close Location % |
|---------|--------|--------|-----------|-----------------|
| 1 | 4.8× | High | 28% | 18% |
| 2 | 2.1× | Elevated | 32% | 35% |
| 3 | 1.4× | Average | 45% | 55% |
| 4 | 0.8× | Below avg | 51% | 62% |
| 5 | 0.6× | Low | 58% | 70% |
| 6 | 0.5× | Low | 63% | 68% |
| 7 | 0.4× | Very low | 67% | 75% |
| 8 | 3.2× | Very high | 72% | 85% |

a) What is happening to volume over sessions 1–7?
b) What is happening to delivery % over sessions 1–7?
c) What is happening to close location over sessions 1–7?
d) What VSA/Wyckoff pattern is forming?
e) What does session 8 likely represent?
f) Classify each session's interpretation: OBSERVATION / INFERENCE / HYPOTHESIS.

**Exercise 8.3 — Bilateral Volume Understanding**

A headline reads: "Strong buying volume as stock rises 4% on 3× average volume."

a) How many shares were "bought" vs "sold" during this session?
b) Is it accurate to say "buyers dominated"? What is the precise correct statement?
c) What does the 3× volume actually confirm, vs what it infers?
d) What additional data would you check before acting on this headline?

---

### Intermediate Exercises

**Exercise 8.4 — Volume Climax Identification**

Given this 15-session price-volume data for a Nifty 50 stock in a downtrend:

| Sessions 1–12 | Volume declining | Price declining | Close near lows |
| Session 13 | Volume 7.2× avg | Wide down bar | Close at 45% of range |
| Session 14 | Volume 1.8× avg | Moderate up bar | Close at 72% of range |
| Session 15 | Volume 0.6× avg | Narrow down bar | Close at 38% of range |

a) Which session is the Selling Climax (SC)? What evidence supports this?
b) What Wyckoff event does Session 14 represent?
c) What is Session 15 testing? Does the test pass or fail?
d) What is the criteria for a successful test?
e) What evidence would make this SC invalid (i.e., not a bottom)?

**Exercise 8.5 — Volume Trend Divergence**

An uptrend shows these statistics for each rally leg:

| Rally | Price gain | Volume (avg daily) | RelVol |
|-------|-----------|------------------|--------|
| Leg 1 (HL1→HH1) | +8.2% | 18 lakh/day | 2.8× |
| Leg 2 (HL2→HH2) | +7.1% | 14 lakh/day | 2.2× |
| Leg 3 (HL3→HH3) | +6.3% | 10 lakh/day | 1.6× |
| Leg 4 (HL4→HH4) | +5.1% | 7 lakh/day | 1.1× |

And pullbacks:

| Pullback | Price drop | Volume (avg daily) | RelVol |
|---------|-----------|------------------|--------|
| PB 1 (HH1→HL2) | -3.1% | 5 lakh/day | 0.8× |
| PB 2 (HH2→HL3) | -4.2% | 8 lakh/day | 1.3× |
| PB 3 (HH3→HL4) | -5.8% | 11 lakh/day | 1.7× |

a) What is the trend in rally volume? What does this suggest?
b) What is the trend in pullback volume? What does this suggest?
c) What does the combined pattern indicate about the uptrend's health?
d) At what point should you become concerned about an uptrend reversal based on this data?
e) What structural event would confirm the reversal?

**Exercise 8.6 — NSE Event Screening**

You observe a stock with the following data:
- Volume: 9.5× average daily volume
- Wide up bar, close in top 10% of range
- Delivery %: 18% (very low)
- Date: Last Thursday of the month (F&O expiry)
- Checked NSE data: A bulk deal of 3.2% of outstanding shares was transacted

a) How many of the 5 "standard" VSA signals are distorted by known events?
b) What is the adjusted reliability of the volume signal today?
c) What session data would you look at INSTEAD for a cleaner reading?
d) Would you trade off today's candle? Justify.

---

### Advanced Exercises

**Exercise 8.7 — Full Volume Framework Application**

Apply the 6-layer professional volume framework to this scenario:

Stock: Infosys (INFY) — Nifty 50 constituent, liquid
20-day avg volume: 42 lakh shares
20-day avg delivery: 38%
ATR (14): ₹28
Today's data: Volume 118 lakh shares, Open ₹1,420, High ₹1,458, Low ₹1,392, Close ₹1,449
Date: Normal trading day, no earnings, no bulk deal, no F&O expiry

Complete all 6 layers of the framework:
a) Layer 1 (Baseline)
b) Layer 2 (Event screening)
c) Layer 3 (RelVol)
d) Layer 4 (Price-volume relationship with ATR)
e) Layer 5 (Background context required — state what you'd want to know)
f) Layer 6 (Synthesis — OBSERVATION / INFERENCE / HYPOTHESIS classification)

**Exercise 8.8 — Distinguishing Volume Types**

On a particular session, a mid-cap stock shows:
- Volume: 15× average
- Wide up bar, close at 88% of range
- But: NSE data shows this coincides with a block deal (bulk purchase by a mutual fund acquiring 5% of outstanding shares)

a) How much of the 15× volume is likely attributable to the block deal alone?
b) What is the "organic" (non-block-deal) volume approximately?
c) Should this session's volume be used for VSA analysis? Why or why not?
d) The next session shows volume 2.8× average with a moderate up bar (close 71%). Is this a more reliable signal? Why?
e) What does the next session tell you about the market's reaction to the block deal?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** A session shows 20 lakh shares traded, with price rising 3%. How many shares were "bought" and how many were "sold"? Why is the phrase "20 lakh shares of buying" misleading?

**Q2.** What does RelVol measure, and why is it superior to absolute volume for analysis? Calculate RelVol for a session with 35 lakh shares on a stock with a 20-day average of 12 lakh shares.

**Q3.** Explain the "effort vs result" framework. What does it mean when high volume produces a narrow-range bar with a middle close?

**Q4.** What is delivery %? Why does low delivery % on a strong up day reduce the confidence of a bullish volume interpretation?

**Q5.** Describe the volume signature of a healthy uptrend. What two divergence signals indicate the uptrend is weakening?

**Q6.** What is a Selling Climax (SC) in volume terms? List four criteria that identify it. What must happen in the NEXT 2–3 sessions for the SC to be a credible bottom?

**Q7.** Name four NSE-specific factors that can cause volume spikes unrelated to genuine supply/demand dynamics. For each, state how you would detect it.

**Q8.** Why should a 5-minute volume bar at 9:20 AM NOT be compared to the overall session average volume? What should it be compared to instead?

**Q9.** Rising delivery % over 5–10 sessions alongside stable or rising price — what does this combination suggest? Is this a FACT, INFERENCE, or HYPOTHESIS?

**Q10.** A stock shows declining volume on up days and rising volume on down days for 4 consecutive weeks, while price continues to make higher highs. What is the VSA interpretation, and what structural event would confirm it?

---

### Chart Scenario Questions (5)

**S1.** A Nifty 50 stock's volume over 20 sessions:
Sessions 1–16: Average 30 lakh/day, delivery 35%, price stable at support
Sessions 17–18: Volume 60–70 lakh, delivery 62–68%, price still at support (narrow range)
Session 19: Volume 18 lakh, narrow down bar, price dips slightly below support then recovers, close at 71%
Session 20: Volume 95 lakh, wide up bar, close at 88%, breaks above resistance

Map each group of sessions through the VSA/Wyckoff lens. What happened in sessions 17–18? What was session 19? What was session 20?

**S2.** You are tracking a small-cap stock (ADV: 1.5 lakh shares) over 5 sessions:

| Session | Volume | RelVol | Close % |
|---------|--------|--------|---------|
| 1 | 80,000 | 0.5× | 55% |
| 2 | 1.2 lakh | 0.8× | 60% |
| 3 | 8.5 lakh | 5.7× | 85% |
| 4 | 45,000 | 0.3× | 40% |
| 5 | 30,000 | 0.2× | 35% |

Session 3 looks like a major bullish signal. Evaluate: Is it reliable? What additional checks are needed? What do sessions 4–5 tell you about session 3's significance?

**S3.** Quarterly earnings season: A stock reports strong results after market close. The next day opens 5% higher on 8× average volume.

a) Is this volume reading VSA-reliable for determining directional sentiment?
b) What participant types are likely driving the high volume?
c) Which session(s) after the gap should you focus on for cleaner VSA readings?
d) What would a bullish vs bearish post-earnings volume signature look like over the next 3–5 sessions?

**S4.** During an accumulation phase (range between ₹200–₹240), you observe:
- 8 sessions of high volume (2–3×) with narrow range at the ₹200 support
- Delivery % rising from 30% → 58% over these 8 sessions
- Price never closing below ₹198

Then on session 9: Volume 0.4× average, narrow range, low ₹197 (briefly below ₹200), close ₹204 (back above ₹200).

What is the precise VSA reading of session 9? How does the contrast with sessions 1–8 confirm or deny the accumulation thesis?

**S5.** An analyst says: "Volume is the most important indicator — when volume expands, follow the direction." Critique this statement using: (1) the bilateral nature of volume, (2) the effort-result framework, (3) the NSE event-specific distortions, and (4) delivery % as a missing context. Provide a corrected, precise version of the statement.

---

## QUIZ ANSWERS

### Conceptual Answers

**A1.** 20 lakh shares were bought AND 20 lakh shares were sold — both simultaneously, in the same trades. "20 lakh shares of buying" implies a one-sided transaction, which is mechanically impossible. Every share bought was sold by someone. The correct statement: "20 lakh shares changed hands, and the price direction suggests buyers were more aggressive — they were willing to pay progressively higher prices, causing price to rise 3%."

**A2.** RelVol = Today's Volume / N-period average. It is superior because absolute volume varies enormously across stocks — 35 lakh shares on Reliance is below average, while 35 lakh on a small-cap is extraordinary. RelVol normalises for each stock's own baseline. Calculation: 35 / 12 = 2.92× → "High" (2.5–4.0 range) → Significant activity.

**A3.** Effort = volume expended. Result = price movement produced. A high-volume bar with narrow range + middle close means: massive effort (many transactions) produced minimal price result. This implies two opposing forces are in balance — a large buyer (demand) is absorbing a large seller (supply) at the current level. Neither side wins decisively. The context (at support = demand absorbing supply; at resistance = supply absorbing demand) determines the interpretation.

**A4.** Delivery % = shares delivered (held overnight) / total volume. Low delivery on a strong up day means: most participants who bought also sold the same day. The price rise was driven by intraday momentum traders, not committed positional buyers. Their buying does not represent sustained demand — they will sell the next session or soon after. High delivery indicates the buyers actually held their positions, reflecting conviction and sustained demand.

**A5.** Healthy uptrend: Up days have higher volume than down days (RelVol > 1.0 on up days, < 1.0 on down days). Two divergence signals: (1) Volume declining on successive up-day rallies — each new high requires fewer buyers = demand fading. (2) Volume expanding on pullbacks — each correction attracts more selling = supply increasing. Together: demand fading + supply increasing = uptrend weakening.

**A6.** SC criteria: (1) Volume ≥ 4× recent average (climactic). (2) Context = extended downtrend. (3) Wide range, often with intrabar recovery (wick). (4) Close recovers from the session's extreme low — often middle to upper portion of range. Next 2–3 sessions for credible bottom: (a) Automatic Rally (AR) with reduced volume. (b) Secondary Test (ST) that retests SC area on LOWER volume and holds ABOVE the SC low. Without ST at lower volume, the SC may not be the final low.

**A7.** Four NSE-specific distortions: (1) F&O expiry (last Thursday monthly) — check NSE calendar. (2) Bulk/Block deals — check NSE's daily bulk deal publication. (3) Dividend stripping — check corporate action calendar. (4) Index rebalancing — check Nifty/Sensex quarterly rebalancing schedule. For each: check the relevant NSE/BSE data before attributing volume to supply/demand dynamics.

**A8.** Intraday volume follows a U-shape: opening and closing 15 minutes have disproportionately high volume. Comparing a 9:20 AM bar's volume to the overall session average will almost always show it as "elevated" — but it's elevated relative to midday bars, not relative to its own time-of-day average. The correct benchmark is the average volume for that specific time slot (e.g., compare 9:20 AM bars to prior 9:20 AM volumes).

**A9.** Rising delivery % + stable/rising price = INFERENCE. The observation (FACT) is: Delivery % is rising. The inference: participants are increasingly holding overnight rather than squaring intraday. The hypothesis: institutional accumulation is occurring. It is INFERENCE because delivery % could also reflect dividend stripping, rights issue participation, or other mechanical holding — not necessarily accumulation.

**A10.** Volume divergence from the uptrend: declining volume on up days (fading demand) + rising volume on down days (growing supply) = classic distribution signal. VSA interpretation: Smart money is selling into the retail-driven price rise. The higher highs are being made with less genuine conviction. Structural confirmation: A CHoCH (price breaks below a prior Higher Low) would be the first structural confirmation that the uptrend is ending.

---

## KEY TAKEAWAYS — CHAPTER 8

> **1. Volume is ALWAYS bilateral — every trade has a buyer AND a seller. "High buying volume" is imprecise. The correct frame: "High volume accompanied by a rising close suggests buyers were more aggressive."**

> **2. Absolute volume is meaningless. Always use RelVol = Today's Volume / N-period Average. Only call a bar "high volume" when RelVol > 1.5–2.0 vs the stock's OWN baseline.**

> **3. Volume measures EFFORT. Price measures RESULT. VSA reads the RELATIONSHIP. High volume + narrow range = inefficient effort = absorption. High volume + wide range + decisive close = efficient effort = directional dominance.**

> **4. Delivery % adds conviction context. High delivery (> 55–65%) = committed capital, positional intent. Low delivery (< 30%) = intraday noise, no conviction. Always read delivery % alongside volume.**

> **5. Volume climaxes (SC and BC) are identified by: extreme RelVol (≥ 4×), prior trend context, wide range, and intrabar recovery. The NEXT 2–3 sessions (AR, ST) confirm or deny the climax read.**

> **6. NSE-specific distortions: F&O expiry, bulk/block deals, earnings days, dividend stripping, index rebalancing. Screen for these BEFORE interpreting any volume spike.**

> **7. Volume trends diverging from price trends are early warnings: declining volume on rallies = fading demand; rising volume on pullbacks = growing supply. Together = distribution in progress.**

---

*Chapter 8 Complete. Part IV — Volume continues.*

---

**Previous:** [← Chapter 7 — Market Structure](./market-structure.md)
**Next:** [Chapter 9 — Price-Volume Relationship →](./price-volume-relationship.md)

*When ready, say: **"NEXT CHAPTER"***
