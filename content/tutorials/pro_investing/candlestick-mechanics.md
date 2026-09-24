# Chapter 6 — Candlestick Mechanics

> **Course:** NSE/BSE Professional Volume + Price Action + VSA + Wyckoff + Market Microstructure
> **Part:** III — Price Action
> **Prerequisite:** Chapter 2 (Price Formation), Chapter 5 (Liquidity)

---

## Chapter Overview

A candlestick is not a signal. It is a **compression of every order book interaction** that occurred during a session into four numbers: Open, High, Low, Close — plus a volume figure.

Most trading education treats candlestick patterns as signals with fixed meanings (e.g., "hammer = bullish"). This is one of the most dangerous misconceptions in retail trading. The same candle shape can be:
- Powerfully bullish in one context
- Meaningfully bearish in another
- Completely neutral noise in a third

This chapter builds precise mechanical understanding of what each candle element represents, what each pattern CAN and CANNOT tell you, and — most critically — the role of context in converting a raw pattern into actionable information.

**The Chapter 6 Rule (memorise before reading further):**

> **No candlestick pattern has a fixed directional meaning without context. Every pattern interpretation is conditional — it depends on location, background, volume, and subsequent price action.**

---

## LEVEL 1 — BEGINNER

### 6.1 Open, High, Low, Close — Defined Precisely

![Candlestick Anatomy — Every Element Precisely Defined](/images/pi-candle-anatomy.jpg)

These four prices are not arbitrary. Each has a specific mechanical origin in the trading session.

**OPEN**
- The price of the **first trade** in the continuous session (9:15 AM on NSE)
- For Nifty 50 stocks: determined by the pre-open call auction (9:00–9:15 AM)
- Important: The open is NOT necessarily near the previous close — gaps are common
- The open reflects the net effect of all overnight information, order flow, and pre-market positioning

**HIGH**
- The price of the **highest trade** that occurred during the session
- This is the level at which sellers were sufficient to stop price from going higher — at least temporarily
- The High is often set during a specific intraday period (opening surge, midday push, or closing rush)
- In VSA: The High represents the maximum extent of buyer aggression during the session

**LOW**
- The price of the **lowest trade** that occurred during the session
- This is the level at which buyers were sufficient to stop price from going lower — at least temporarily
- In VSA: The Low represents the maximum extent of seller aggression during the session

**CLOSE**
- The price of the **last trade** before the session ends
- For Nifty 50 index stocks: determined by the closing call auction (3:30–3:40 PM)
- The close is the **most important** of the four prices in VSA analysis
- Why: The close reflects where the market "settled" after all intraday activity — it is the market's verdict on the session's supply-demand balance
- A close near the High = buyers were in control at session end
- A close near the Low = sellers were in control at session end

**NSE-specific close note:**
On NSE, the official closing price for index constituents is determined by the Volume Weighted Average Price (VWAP) of the last 30 minutes of trading — not literally the last tick. This is important context when interpreting "close location" for these stocks, as the official close may differ slightly from the last traded price on your charting platform.

---

### 6.2 Body, Wick, Range — The Geometry of a Candle

**BODY**
- The filled rectangle between Open and Close
- **Bullish body (green/white):** Close > Open — price moved UP during the session
- **Bearish body (red/black):** Close < Open — price moved DOWN during the session
- Body size indicates the **conviction** of the move from open to close

```
Body size = |Close − Open|

Large body: Strong directional move from open to close
Small body: Open and close nearly equal — balanced or indecisive session
No body (Doji): Open = Close exactly or nearly so
```

**WICK / SHADOW**
- The thin lines extending above and below the body
- **Upper wick:** High − max(Open, Close)
  - Represents: Price went up to the High but was REJECTED back down before close
  - The upper wick = failed attempt by buyers to hold higher prices
- **Lower wick:** min(Open, Close) − Low
  - Represents: Price went down to the Low but was REJECTED back up before close
  - The lower wick = failed attempt by sellers to hold lower prices

**RANGE (Spread of the bar)**
- Range = High − Low
- This is the VSA concept of "spread" (not to be confused with bid-ask spread)
- Wide range: Large price movement — significant force applied by one or both sides
- Narrow range: Small price movement — balance, compression, or thin liquidity

```
Precise definitions:
Range = High − Low
Body = |Close − Open|
Upper wick = High − max(Open, Close)
Lower wick = min(Open, Close) − Low
Body % = Body / Range × 100
```

---

### 6.3 Close Location — The Most Important VSA Variable

Close location within the session's range is the single most informative element of a candle for VSA analysis.

**The formula:**
```
Close Location % = (Close − Low) / (High − Low) × 100

100% = Close at the exact High (strongest bullish close)
0%   = Close at the exact Low (strongest bearish close)
50%  = Close exactly in the middle
```

**Interpretation by zone:**

| Close Location | Zone | Interpretation |
|---------------|------|---------------|
| 80–100% | Top fifth | Buyers completely dominated — maximum strength |
| 67–80% | Upper third | Strong buyers — bullish close |
| 34–66% | Middle third | Neither side won — uncertainty |
| 20–33% | Lower third | Strong sellers — bearish close |
| 0–20% | Bottom fifth | Sellers completely dominated — maximum weakness |

**Why close location matters more than body colour:**

Consider a bar: Open ₹100, High ₹110, Low ₹85, Close ₹108.
- Body colour: GREEN (Close > Open) ✅
- But: The bar went down to ₹85 before closing at ₹108
- Close Location: (108−85)/(110−85) = 23/25 = 92% — extremely strong

Now consider: Open ₹100, High ₹115, Low ₹96, Close ₹101.
- Body colour: GREEN (barely)
- Close Location: (101−96)/(115−96) = 5/19 = 26% — actually weak

**The second bar is green but weak. The first bar shows buyers decisively regained control.**

This is why VSA uses close location, not body colour, as the primary strength indicator.

**NSE practical exercise (do this on any chart):**

Pick any 5 candles from a Nifty 50 stock. For each:
1. Calculate Close Location %
2. Classify: Top / Upper / Middle / Lower / Bottom zone
3. Note: Does the body colour match the close location zone?

You will find many cases where a green candle has a weak close location (< 40%) and a red candle has a strong close location (> 60%). These are the most analytically significant bars.

---

## LEVEL 2 — INTERMEDIATE

### 6.4 Single-Bar Patterns — With Precise Mechanical Definitions

![Single-Bar Candlestick Patterns — Complete Visual Reference](/images/pi-candle-patterns-grid.jpg)

Each pattern below is defined mechanically — what it tells you about the session's order flow — and contextually — what additional conditions are needed to interpret it.

---

#### DOJI

**Definition:** Open ≈ Close (body is zero or near-zero). Upper and lower wicks of varying length.

**Mechanical meaning:**
- The session opened and closed at nearly the same price
- Buyers and sellers were in exact balance at session end
- Neither side gained a sustained advantage

**What it tells you (OBSERVATION):** Indecision — price returned to where it opened.

**What it does NOT tell you:** The next direction. A Doji at support is NOT automatically bullish. A Doji at resistance is NOT automatically bearish.

**The three Doji types:**

| Type | Description | Additional info |
|------|------------|-----------------|
| Standard Doji | Equal small wicks, near-zero body | Classic indecision |
| Long-legged Doji | Very long wicks both sides | High-range indecision; volatile session |
| Gravestone Doji | Long upper wick, no lower wick | Price rose but fully rejected — potentially bearish IF context supports |
| Dragonfly Doji | Long lower wick, no upper wick | Price fell but fully recovered — potentially bullish IF context supports |

**Context requirement:** Doji by itself = OBSERVATION (indecision). Only becomes INFERENCE when combined with trend, volume, and location.

---

#### PIN BAR (Hammer / Inverted Hammer / Shooting Star / Hanging Man)

**Definition:** A candle with a small body AND a wick that is at least 2–3× the body length.

**Mechanical meaning of a long lower wick:**
- Price went down significantly during the session (sellers were aggressive)
- But buyers overcame all that selling and pushed price back up near the open
- The low of the wick = a level where demand WAS strong enough to absorb and reverse selling
- INFERENCE: There was buying activity at or near the wick's low

**Traditional naming (same shape, different context):**

| Name | Wick | Location | Traditional Interpretation |
|------|------|----------|--------------------------|
| Hammer | Long lower | After downtrend | Bullish reversal |
| Hanging Man | Long lower | After uptrend | Bearish reversal |
| Shooting Star | Long upper | After uptrend | Bearish reversal |
| Inverted Hammer | Long upper | After downtrend | Bullish reversal |

**The problem with this naming system:** It assigns directional meaning based solely on location in trend — ignoring volume, the size of the wick relative to range, the close location, and the background.

**VSA approach — no naming by location, only description:**
- Long lower wick: "Price rejected lower during this session. Close recovered. OBSERVATION."
- Long upper wick: "Price rejected higher during this session. Close fell back. OBSERVATION."
- Inference requires: volume context, background, prior levels

**Volume rule for pin bars:**
- High volume + long lower wick + close near high = STRONG inference of demand (absorption of selling)
- Low volume + long lower wick + close near middle = WEAK inference — may be thin-market bounce

---

#### WIDE-RANGE BAR (Marubozu / Expansion Bar)

**Definition:** A candle with a large body relative to recent average range. A true Marubozu has no wicks (open = low for bullish, open = high for bearish).

**Mechanical meaning:**
- One side was dominant throughout the ENTIRE session
- Price moved in one direction from open to close with no significant counter-move
- On a Marubozu: not even a single wick — the side that opened maintained control until close

**Key VSA insight on wide-range bars:**

The range of the bar must be evaluated in two ways:
1. **Absolute range:** How many ₹ did it move?
2. **Range relative to ATR:** Is this 1× normal range, 2×, or 5×?

A bar with 3× normal range = significant. A bar with 3× normal range in an illiquid stock = may just be the bid-ask spread × 2.

**Always normalise range using ATR (Average True Range):**
```
Normalised Range = Today's Range / 14-period ATR
>1.5: Wide-range bar
>2.0: Very wide-range bar (expansion)
>3.0: Climactic range
```

---

#### NARROW-RANGE BAR (NRB / Inside-Range)

**Definition:** A candle whose range is significantly smaller than recent average range. Often set as NR4 (narrower than prior 4 bars) or NR7 (narrower than prior 7 bars).

**Mechanical meaning:**
- Neither buyers nor sellers were willing to deviate significantly from the current price
- Represents equilibrium or compression
- Low volatility — the market is "coiling"

**Two different contexts for NRB:**

**Context A — NRB during accumulation/distribution:**
- NRBs after Stopping Volume = supply is drying up = bullish
- NRBs near resistance with declining volume = no demand = bearish
- Here, NRB confirms the VSA narrative

**Context B — NRB as volatility compression:**
- Multiple NRBs in sequence = range contracting = breakout is likely
- Direction is NOT indicated by the NRBs themselves — only the compression is
- Breakout direction determined by prior trend, volume, and context

---

#### INSIDE BAR

**Definition:** A bar whose High is lower than the prior bar's High AND whose Low is higher than the prior bar's Low. Entirely contained within the prior bar's range.

**Mechanical meaning:**
- Less range than prior bar = volatility contracted
- Both buyers and sellers "agreed" to trade within a tighter range
- Represents absorption, consolidation, or indecision

**Two common interpretations:**

1. **Inside bar as continuation:** After a strong trend bar, an inside bar = brief rest before continuation. (Only valid if volume is low on the inside bar = low participation = not a reversal)

2. **Inside bar as reversal signal:** After extended trend, an inside bar on declining volume = loss of momentum. Potential reversal IF the inside bar is broken in the opposite direction.

**Again — the pattern alone says nothing. Volume + context defines it.**

---

#### OUTSIDE BAR / ENGULFING

**Definition:** A bar that has a Higher High AND a Lower Low than the prior bar — engulfs the prior bar's entire range.

**Mechanical meaning:**
- More range than prior bar = volatility expanded
- One side extended both the top and the bottom, then settled

**Two interpretations based on CLOSE location:**

```
Outside bar with CLOSE in TOP THIRD:
→ Buyers ultimately won, despite reaching to new low
→ Potential: Bullish engulfing (demand overcoming supply)
→ INFERENCE: Buyers absorbed all selling and bid price higher

Outside bar with CLOSE in BOTTOM THIRD:
→ Sellers ultimately won, despite reaching to new high
→ Potential: Bearish engulfing (supply overcoming demand)
→ INFERENCE: Sellers absorbed all buying and pressed price lower
```

**Volume rule for outside bars:**
High volume on an outside bar = significant. Many participants transacted across the wide range.
Low volume on an outside bar = suspicious. Thin market, not a meaningful battle.

---

### 6.5 The Critical Rule — No Fixed Meaning Without Context

This is the intellectual core of Chapter 6 — and of all price action analysis.

**A demonstration — the exact same hammer in three contexts:**

**Context A: Hammer after 8-week downtrend, at major support, high volume**
```
Prior trend:    8 weeks of decline
Location:       Major support from prior consolidation (tested twice before)
Volume:         3.5× average (highest volume in 3 weeks)
Bar:            Long lower wick, close in top 20% of range
Background:     Declining volume throughout the downtrend

VSA analysis:
The selling that pushed price to the wick's low was absorbed by buyers.
High volume confirms broad participation in the buying.
Closing near the high shows buyers were in control by session end.
Background of declining downtrend volume shows supply exhausting.

Classification: STRONG BULLISH INFERENCE. High confidence.
```

**Context B: Same hammer shape, mid-uptrend, at no significant level, average volume**
```
Prior trend:    6 weeks of uptrend
Location:       Open air — no prior support or resistance nearby
Volume:         1.1× average (normal)
Bar:            Long lower wick, close in top 30% of range
Background:     Volume has been stable throughout uptrend

VSA analysis:
Price dipped during the session and recovered. Volume was normal.
No evidence of unusual participation. No significant level being defended.
This is routine intraday noise within the uptrend.

Classification: NOISE. No actionable inference.
```

**Context C: Same hammer shape, at top of extended uptrend, after buying climax, on declining volume**
```
Prior trend:    12 weeks of uptrend, recently accelerated
Location:       Near prior high resistance from 2 years ago
Volume:         0.6× average (declining on the dip = no supply? Or exhaustion?)
Bar:            Long lower wick, but body is small, close in middle of range
Background:     Volume has been declining for 4 sessions

VSA analysis:
The hammer's lower wick shows a probe lower that was recovered.
BUT: Volume is LOW — inconsistent with strong demand appearing.
The long upper wick that preceded this session (if any) may be an upthrust.
At the top of an extended trend near resistance: this may be a final shakeout before the real top, OR a legitimate test before one more push up.

Classification: AMBIGUOUS. Requires additional confirmation before acting.
Alternative hypothesis: Top formation — the wick could be the last "spring" of buyers before distribution begins.
```

**The lesson:** The hammer shape is identical in all three contexts. The interpretation is completely different.

---

### 6.6 What Context Means — The Four Pillars

For every candlestick pattern, context is defined by four pillars:

**Pillar 1: LOCATION**

Where is the pattern relative to significant price levels?
- At support: Bullish patterns have higher inference value
- At resistance: Bearish patterns have higher inference value
- In open air: Most patterns are noise
- At a multi-year high/low: Patterns carry maximum weight

**Pillar 2: BACKGROUND (Prior 20–50 bars)**

What is the recent price history?
- Volume trend: Expanding or contracting?
- Price trend: Uptrend, downtrend, or sideways?
- Prior VSA signals: Was there a Selling Climax 10 bars ago? A Test?
- Delivery trend: Rising or falling?

A single bar cannot be read without understanding the story told by the 20–50 preceding bars.

**Pillar 3: VOLUME**

What volume accompanied the pattern?
- High volume + bullish pattern at support: Strong inference of demand
- Low volume + bullish pattern at support: Weak inference — few participants
- High volume + bearish pattern (wide spread down, close on low): Strong supply present
- Low volume + narrow range at support: "No supply" — no one selling at this level

**Pillar 4: SUBSEQUENT PRICE ACTION (Confirmation)**

No single-bar analysis is complete until the next 2–3 bars confirm or invalidate:
- Bullish bar at support → does price hold the support the next session?
- Bearish bar at resistance → does price fail to reclaim the level?
- High-volume absorption bar → does price begin moving away from the absorption zone?

```
The complete analysis process:
1. Identify the pattern (OBSERVATION)
2. Check location (Pillar 1)
3. Read the background (Pillar 2)
4. Assess volume (Pillar 3)
5. Form a hypothesis (INFERENCE / HYPOTHESIS)
6. Define confirmation criteria
7. Define invalidation criteria
8. Wait for confirmation (Pillar 4)
9. Act only after confirmation
```

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### Candle Mechanics and VSA — The Direct Connection

VSA was developed by Tom Williams based on the work of Richard Wyckoff and is fundamentally a method for reading supply and demand from candlestick OHLCV data. The connection between candle elements and VSA logic is direct:

**VSA "Spread" = Range (High − Low)**
In VSA, "spread" = the bar's range, not the bid-ask spread. Always check which meaning is intended in context.

**The four VSA variables:**
1. **Spread (Range):** Wide = significant force. Narrow = compression or no interest.
2. **Volume:** High = many participants. Low = few participants.
3. **Close Location:** Top = buyers won. Bottom = sellers won. Middle = balance.
4. **Background:** Prior trend, volume trend, significant levels.

**The 16-cell VSA matrix (simplified):**

| Spread | Volume | Close | Interpretation |
|--------|--------|-------|---------------|
| Wide up | High | Top | Demand present (SOS candidate) |
| Wide up | High | Bottom | Supply overcame demand (bearish) |
| Wide up | Low | Top | Suspicious — range without volume = ? |
| Wide up | Low | Bottom | No demand / end of rally |
| Narrow | High | Top | Absorption — supply being soaked up |
| Narrow | High | Bottom | Absorption — demand being soaked up |
| Narrow | Low | Top | No supply — bullish background condition |
| Narrow | Low | Bottom | No demand — bearish background condition |
| Wide down | High | Bottom | Supply dominant (SOW candidate) |
| Wide down | High | Top | Demand absorbed selling (Stopping Volume) |
| Wide down | Low | Bottom | No demand |
| Wide down | Low | Top | Test of supply — positive background |

*(Full VSA Pattern analysis in Chapters 10–11)*

---

### Wick Mechanics — Advanced Reading

**The upper wick tells you:**
The session high was set but REJECTED. Some entity or collective of entities was willing to SELL at the high — either:
- A large limit sell wall was there (absorbed the buying)
- Short sellers entered at the high
- Buyers simply ran out of willing participants above that level
- The market "tested" supply above and found it present

**The lower wick tells you:**
The session low was set but REJECTED. Some entity or collective was willing to BUY at the low — either:
- A large limit buy order (iceberg) was present
- Covering buyers (shorts) were present at the low
- The market "tested" demand below and found it present

**Wick-to-body ratio as a signal filter:**

```
Minimum meaningful wick: Wick > 1× body length

Below this threshold: The wick is just normal intraday noise.
Above this threshold: The wick represents a meaningful probe and rejection.

Strong wick signal: Wick > 2× body length
Extreme wick signal: Wick > 3× body length (pin bar territory)
```

**The "test" concept in wick analysis:**

A low-volume narrow-range bar with a prominent lower wick = a "Test" in VSA terminology:
- Price probed lower (lower wick) with LOW volume
- Low volume means: Few sellers were present at or near the low
- The bar closed near its high
- Interpretation: Supply is absent. The market tested for sellers and found very few.
- This is a bullish background condition — NOT a signal to buy immediately.

---

### Candle Clusters — Reading Multiple Bars Together

Individual candles are the vocabulary. Multiple bars together form sentences.

**Three-bar sequences to understand:**

**1. The Climax + Reaction + Test sequence:**
```
Bar 1: Wide spread, high volume, bearish close (Selling Climax)
Bar 2: Narrow range, lower volume, recovers some (Automatic Rally)
Bar 3: Low volume, narrow range, probes the SC low but recovers (Test)

Combined reading:
SC: Climactic selling exhausted — sellers gave all they had
AR: First sign of demand returning
Test: Supply absent on retest = bullish

This is Wyckoff Phases A-C in three bars.
```

**2. The Upthrust + Absorption + Breakdown sequence:**
```
Bar 1: Wide spread up, breaks resistance, high volume, close middle/lower
Bar 2: Narrow range near resistance, elevated volume, close middle
Bar 3: Wide spread down, high volume, close near low

Combined reading:
Bar 1: Upthrust — fake breakout, supply was met at resistance
Bar 2: Absorption of residual demand
Bar 3: Supply takes control — SOW

This is a classic distribution topping pattern.
```

**3. The Compression + Expansion sequence:**
```
Bars 1–5: Progressively narrowing range (NRB sequence), declining volume
Bar 6: Wide-range bar, volume spike, breaks out of compression

Combined reading:
Bars 1–5: Market coiling — neither buyers nor sellers active
Bar 6: One side wins the compression battle — direction confirmed

Direction of Bar 6 break = likely direction of next leg.
Volume on Bar 6 must be high to confirm genuine expansion.
```

---

### Candle Timeframe Considerations

The same candlestick pattern carries different analytical weight depending on the timeframe:

| Timeframe | Signal Weight | Use Case |
|-----------|-------------|---------|
| Monthly | Very high | Major market structure, macro bias |
| Weekly | High | Trend direction, major turning points |
| Daily | Standard | Primary trading timeframe for most VSA |
| 4H / 1H | Moderate | Entry timing, intermediate structure |
| 15min / 5min | Lower | Intraday execution only |

**The hierarchy rule:**

A bullish daily candle within a bearish weekly structure = conflicting signals. The higher timeframe context (weekly) dominates for the primary bias. The daily signal is for execution timing only — not for adding to a directional bet.

**NSE-specific timeframe notes:**

- Weekly candles on NSE run Monday–Friday
- Monthly candles run calendar month
- The first 15 minutes (9:15–9:30) and last 15 minutes (3:15–3:30) candlestick bars on NSE often have elevated volume distorted by opening/closing auction and HFT activity — read with caution

---

## EXERCISES

### Beginner Exercises

**Exercise 6.1 — Candle Anatomy Calculations**

Calculate all elements for each candle:

| # | Open | High | Low | Close |
|---|------|------|-----|-------|
| A | ₹480 | ₹520 | ₹472 | ₹515 |
| B | ₹315 | ₹322 | ₹298 | ₹303 |
| C | ₹1,200 | ₹1,248 | ₹1,195 | ₹1,220 |
| D | ₹750 | ₹751 | ₹718 | ₹749 |

For each: Calculate (a) Range, (b) Body size, (c) Upper wick, (d) Lower wick, (e) Close Location %, (f) Close zone (top/middle/bottom third), (g) Bullish or bearish candle.

**Exercise 6.2 — Pattern Identification**

Identify the candlestick pattern for each description:

a) Open ₹500, High ₹502, Low ₹499.50, Close ₹500.25 (all values nearly equal)
b) Open ₹300, High ₹302, Low ₹268, Close ₹298 (long lower wick, small body near top)
c) Open ₹800, High ₹838, Low ₹799, Close ₹800.50 (long upper wick, body near bottom)
d) Open ₹420, High ₹452, Low ₹419, Close ₹450 (large body, small wicks)
e) Open ₹600, High ₹615, Low ₹598, Close ₹602 (small body, moderate equal wicks)
f) Prior bar: High ₹540, Low ₹510. Current bar: High ₹535, Low ₹515 (fits inside prior)

**Exercise 6.3 — Close Location Classification**

For each candle, calculate Close Location % and state the VSA implication:

| Session | High | Low | Close |
|---------|------|-----|-------|
| NSE stock A | ₹240 | ₹218 | ₹237 |
| NSE stock B | ₹1,180 | ₹1,095 | ₹1,103 |
| NSE stock C | ₹88 | ₹72 | ₹80 |
| NSE stock D | ₹456 | ₹421 | ₹452 |

---

### Intermediate Exercises

**Exercise 6.4 — The Same Pattern, Three Contexts**

A pin bar (long lower wick, close in top 25% of range, volume 2.8× average) appears in three different stocks:

**Stock A:** After a 6-week downtrend, at a support level that held twice in the prior year.
**Stock B:** Mid-uptrend, no significant level nearby, in open price territory.
**Stock C:** After a 10-week uptrend near all-time highs, with a buying climax 3 sessions ago.

For each:
a) Apply the four context pillars (Location, Background, Volume, Confirmation needed).
b) State the inference level: STRONG / MODERATE / WEAK / AMBIGUOUS.
c) What confirmation would you require before acting?
d) What would invalidate your interpretation?

**Exercise 6.5 — The VSA Matrix Application**

Apply the VSA 4-variable framework to each bar:

| Bar | Spread | Volume | Close Location | Context |
|-----|--------|--------|---------------|---------|
| 1 | Wide up | 4.2× avg | 88% | Bottom of downtrend, at major support |
| 2 | Wide down | 3.8× avg | 91% | Middle of uptrend, no significant level |
| 3 | Narrow | 0.4× avg | 72% | Near resistance, after 3 tests of resistance |
| 4 | Wide down | 5.1× avg | 15% | At support after 8-session downtrend |
| 5 | Narrow | 0.3× avg | 68% | Just above support, after prior Selling Climax |

For each: (a) VSA pattern name (approximate), (b) Supply/Demand inference, (c) Evidence classification (FACT/INFERENCE/HYPOTHESIS), (d) What background information would most change your reading?

**Exercise 6.6 — Three-Bar Sequence Reading**

Analyse each three-bar sequence as a unit:

**Sequence 1:**
- Bar A: Wide down, high volume, close at bottom (35%)
- Bar B: Narrow, lower volume, close at middle (52%)
- Bar C: Narrow, very low volume, tests Bar A's low, closes at top (78%)

**Sequence 2:**
- Bar A: Wide up, very high volume, breaks 3-month resistance, close at middle (52%)
- Bar B: Narrow, elevated volume, at resistance level, close at middle (48%)
- Bar C: Wide down, high volume, back below resistance, close at bottom (18%)

For each sequence:
a) Name the three bars individually.
b) Read the combined sequence as one VSA narrative.
c) What Wyckoff event does each sequence most resemble?
d) What is the trading implication?

---

### Advanced Exercises

**Exercise 6.7 — Timeframe Conflict Resolution**

A daily chart shows a strong bullish pin bar (long lower wick, 82% close location, 3.5× volume) at a key support level. But the weekly chart shows a bearish engulfing candle from 2 weeks ago with the stock trading in the lower half of that weekly engulfing bar.

a) Which timeframe signal takes precedence for directional bias?
b) What does the daily pin bar tell you in the context of the weekly bearish engulfing?
c) Is this a buying opportunity? Under what conditions?
d) What specific confirmation on both the weekly and daily would change the bias to bullish?

**Exercise 6.8 — Pattern vs Reality**

A popular trading educator says: "Any hammer at support is a buy signal." You observe 20 consecutive hammer patterns at the same support level in a mid-cap stock over 3 months.

- 14 of the 20 resulted in brief bounces of 2–4%
- 6 of the 20 failed — stock broke below support

a) What is the raw success rate of the "hammer at support = buy" rule?
b) What additional variables (from the four context pillars) would most likely explain the 6 failures?
c) Design a more precise entry rule that incorporates volume and close location filters. What minimum criteria would you add?
d) Why is the 14/20 historical success rate NOT a reliable predictor of future performance for this rule?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** What does the Open of a session represent mechanically? Why does the daily Open of a Nifty 50 stock sometimes differ significantly from the previous Close?

**Q2.** What does a long lower wick tell you about the SESSION's order flow? What does it NOT tell you?

**Q3.** Explain why Close Location is more analytically important than body colour in VSA.

**Q4.** A bar has Open ₹500, High ₹540, Low ₹498, Close ₹502. Calculate: (a) Range, (b) Body, (c) Upper wick, (d) Lower wick, (e) Close Location %, (f) What does this bar suggest?

**Q5.** What is the single most dangerous misconception that traditional candlestick education promotes? How does VSA correct this?

**Q6.** Define the four context pillars required to interpret any candlestick pattern. Why is each pillar necessary?

**Q7.** What is a Narrow-Range Bar (NRB)? Give two entirely different contexts in which an NRB appears, and explain why the interpretation differs in each.

**Q8.** An outside bar closes in the top 15% of its range on 4× average volume, after a 6-week downtrend at a tested support level. Classify this bar: Pattern name? Evidence classification? Confirmation needed?

**Q9.** Why do VSA analysts use ATR-normalised range rather than absolute price range when assessing bar width? Give a specific example illustrating why absolute range misleads.

**Q10.** "A Doji means reversal." Evaluate this statement. Under what specific conditions, if any, does a Doji have reversal implications? Under what conditions is it meaningless?

---

### Chart Scenario Questions (5)

**S1.** You observe the following 5-session sequence in a Nifty 50 stock:
- Sessions 1–3: Three consecutive narrow-range bars (NR4), volume declining each session
- Session 4: NR7 — the narrowest bar in 7 sessions, volume at 3-year low
- Session 5: Wide-range up bar, volume 4.8× average, closes in top 5% of range

Walk through each session using the candlestick framework. What is the combined VSA reading? What does this look like on the chart? What is the probability-weighted next move and what evidence supports it?

**S2.** A stock shows a "bearish engulfing" pattern (large red body engulfing prior green body) at a 6-month resistance level. Volume on the engulfing day: 1.1× average.

a) Does low volume on a bearish pattern strengthen or weaken the bearish inference? Why?
b) What does low volume at resistance actually suggest about supply?
c) Reinterpret this bar using VSA logic — is this bearish or actually a potential bullish signal?
d) What would confirm the bullish interpretation?

**S3.** Over a 15-session Wyckoff accumulation base, you observe the following candle types:
- Sessions 1–2: Wide down bars, high volume (SC)
- Sessions 3–4: Narrow bars, moderate volume (AR phase)
- Sessions 5–8: Inside bars, declining volume
- Session 9: Pin bar with long lower wick, touches Session 1's low, very low volume, closes high
- Sessions 10–15: Narrow bars, very low volume, stable above Session 9's close

Map each candle type to its Wyckoff event. Which session is the Spring? What is the VSA confirmation sequence?

**S4.** An analyst claims: "The stock formed a hammer at support, which is a confirmed buy signal." You check the data:
- Yes, there is a hammer shape (long lower wick)
- But: Volume was 0.3× average (well below normal)
- The stock is a small-cap with bid-ask spread of ₹4 on a ₹180 stock

Evaluate the claim. What is the correct VSA reading of this specific pattern? Is this a buy signal?

**S5.** Daily chart: A Nifty 50 stock forms a Doji (Open ≈ Close ≈ ₹2,400) with a ₹55 range (High ₹2,427.50, Low ₹2,372.50). Volume: 2.6× average. The stock is at the midpoint of a 3-month consolidation range (₹2,200–₹2,600).

a) Calculate Close Location % for this Doji.
b) What is the VSA significance of a high-volume Doji at the midpoint of a range?
c) What does the large wick-to-body ratio tell you about the session's order flow?
d) What are the two competing hypotheses for what happens next?
e) What would confirm each hypothesis?

---

## QUIZ ANSWERS

### Conceptual Answers

**A1.** The Open is the price of the first trade in the continuous session (9:15 AM). For Nifty 50 stocks, it is determined by the pre-open call auction (9:00–9:15 AM). The gap from prior Close occurs because: (1) new information arrived overnight (earnings, global news, macro data); (2) pre-open orders accumulated at prices far from the prior close; (3) the call auction found maximum traded volume at the new price level.

**A2.** A long lower wick tells you: During the session, price fell significantly below the open/close level AND recovered before the session ended. Buyers overcame all the selling that pushed price to the wick's low. It does NOT tell you: WHO was buying (retail/FII/MF/algo); whether this demand will persist; whether the wick's low is a reliable support; or what happens tomorrow. It is an OBSERVATION — price was rejected lower.

**A3.** Close location indicates who was in control at session END — the most recent and definitive verdict of the supply-demand battle for that session. Body colour only tells you whether the close was above/below the open — but the open itself can be anywhere in the range. A green (bullish) body with close in the bottom 30% of the range means sellers gained control after the open, even though it closed above open. The close location captures this nuance; body colour does not.

**A4.**
- Range: ₹540 − ₹498 = ₹42
- Body: |₹502 − ₹500| = ₹2 (very small)
- Upper wick: ₹540 − max(500,502) = ₹540 − ₹502 = ₹38 (enormous)
- Lower wick: min(500,502) − ₹498 = ₹500 − ₹498 = ₹2 (tiny)
- Close Location: (₹502 − ₹498)/(₹540 − ₹498) = 4/42 = 9.5% — BOTTOM zone
- What this suggests: A Shooting Star / Gravestone-type pattern. Price rose dramatically (₹40 upper wick) but was completely rejected — closed near the low of the entire range. INFERENCE: Strong supply at the high; buyers failed to hold the gains. Bearish signal IF at resistance with volume confirmation.

**A5.** Most dangerous misconception: Candlestick patterns have fixed directional meanings (Hammer = bullish, Shooting Star = bearish). This is false — the same pattern means different things in different contexts. VSA corrects this by requiring all four context pillars (Location, Background, Volume, Confirmation) before assigning any directional interpretation to a pattern.

**A6.** (1) Location — without knowing where the pattern appears (support, resistance, open air), no directional inference is valid. (2) Background — without the prior 20–50 bars, you cannot know if the pattern follows supply exhaustion, demand exhaustion, or is mid-trend noise. (3) Volume — without volume, you cannot judge whether the pattern reflects broad participation (significant) or thin-market noise (insignificant). (4) Confirmation — without subsequent bars confirming the direction, the single bar is merely a hypothesis.

**A7.** NRB = bar with range significantly smaller than recent average (typically less than prior 4 or 7 bars). Two contexts: (1) During accumulation after Stopping Volume — NRB with low volume = supply drying up = bullish background condition (no one selling at this level). (2) As volatility compression in open air — NRB sequence = market coiling before a breakout — direction unknown from the NRBs alone, requires context and confirmation.

**A8.** Pattern: Bullish Outside Bar (or Bullish Engulfing — close at 85–100% of its own range). Evidence classification: OBSERVATION (the bar exists). INFERENCE: Demand overwhelmed supply — buyers swept the entire prior bar's range and closed near the top. High volume confirms broad buying participation at the support. Confirmation needed: Next session should open above the prior close and hold; a retest of the outside bar's low on very low volume would further confirm. Pattern classification: Potential SOS (Sign of Strength) or Phase D of Wyckoff Accumulation.

**A9.** ATR normalisation accounts for different volatility regimes. A ₹20 range on a ₹2,000 stock = 1% range. The same ₹20 range on a ₹400 stock = 5% range — very different significance. Nor can you compare across instruments: a ₹100 range on Reliance (₹2,800) is 3.6%; a ₹100 range on a ₹200 small-cap is 50%. ATR normalisation: Range / 14-period ATR. If today's range = 2× ATR, it is a significant bar regardless of the stock's price level or volatility.

**A10.** "Doji = reversal" is at best a conditional inference, frequently wrong. A Doji has reversal implications only when: (1) it appears after an extended trend, (2) at a significant support or resistance level, (3) accompanied by high volume (indicating a true battle between buyers and sellers ending in balance), (4) confirmed by subsequent sessions reversing direction. In the middle of a range, on average volume, or without confirmation: A Doji is NOISE — it represents one balanced session in an ongoing story with no directional implication.

---

## KEY TAKEAWAYS — CHAPTER 6

> **1. A candle is a summary of all order book interactions during a session. OHLC = Open (first trade), High (highest trade), Low (lowest trade), Close (last/auction trade).**

> **2. Close Location % = (Close − Low) / (High − Low) × 100. This is MORE important than body colour. A green candle with 20% close location is WEAK. A red candle with 80% close location is STRONG.**

> **3. Upper wick = price rejected higher. Lower wick = price rejected lower. Wick size relative to body tells the story of intraday supply/demand battles.**

> **4. NO candlestick pattern has a fixed directional meaning. The same hammer can be strongly bullish, noise, or even bearish depending on the four context pillars: Location, Background, Volume, and Confirmation.**

> **5. VSA uses four variables for every bar: Spread (range), Volume, Close Location, and Background. The interaction of these four determines the inference — not the pattern name alone.**

> **6. ATR-normalise your range assessment. A wide bar must be wide relative to the stock's own recent volatility, not in absolute ₹ terms.**

> **7. Always wait for confirmation. A single bar is a hypothesis. The next 2–3 bars either confirm or invalidate it.**

---

*Chapter 6 Complete. Part III — Price Action continues.*

---

**Previous:** [← Chapter 5 — Liquidity & Market Impact](./liquidity-and-market-impact.md)
**Next:** [Chapter 7 — Market Structure →](./market-structure.md)

*When ready, say: **"NEXT CHAPTER"***
