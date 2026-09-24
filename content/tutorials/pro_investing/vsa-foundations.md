# Chapter 10 — VSA Foundations

> **Course:** NSE/BSE Professional Volume + Price Action + VSA + Wyckoff + Market Microstructure
> **Part:** V — Volume Spread Analysis
> **Prerequisite:** Chapters 6–9 (Candlestick Mechanics, Market Structure, Understanding Volume, Price-Volume Relationship)

---

## Chapter Overview

Volume Spread Analysis (VSA) is the most systematic and mechanically grounded method of reading OHLCV data. It was developed by Tom Williams, a syndicate trader who worked with Richard Wyckoff's methods in the 1960s–1980s, and later formalised in his book *Master the Markets*.

VSA's core claim is bold but defensible: **You can identify the activity of professional participants (the "smart money") by reading the relationship between volume, spread (range), and close location — because professional accumulation and distribution leave unavoidable traces in the OHLCV record.**

This chapter builds the complete foundational framework — the three laws, the four variables, the five questions, the bar classification system, and the analytical mindset required to practise VSA at a professional level.

**The Chapter 10 Rule:**

> **VSA is not pattern recognition. It is mechanical reasoning about supply and demand. Before you name any pattern, you must first understand the mechanism that produces it. The mechanism is always: supply, demand, effort, result, and context.**

---

## LEVEL 1 — BEGINNER

### 10.1 Origins of VSA — The Foundation

**Richard Wyckoff (1873–1934):**
A New York stock trader and publisher who observed that large professional operators (he called them "composites" or "operators") systematically accumulated stocks at low prices and distributed them at high prices — and that their activity could be read from the tape (price and volume data).

Wyckoff developed three laws: Supply and Demand, Cause and Effect, and Effort vs Result — the same three laws that underpin VSA today.

**Tom Williams (1930s–2016):**
A syndicate trader who applied Wyckoff's principles in real trading for decades. He later computerised the analysis and named it "Volume Spread Analysis" to distinguish it from the broader Wyckoff method. His book *Master the Markets* (2000) is the primary text.

**Key claims of VSA:**

1. Professional participants (institutions, syndicates, operators) must accumulate LARGE positions before a bull move — they cannot buy everything at the top.
2. This accumulation takes TIME — hence the base/consolidation before trends.
3. The accumulation process leaves TRACES in the OHLCV data — traces that a trained analyst can read.
4. Similarly, distribution (selling at the top) leaves traces in the OHLCV data.
5. By reading these traces, a retail analyst can identify when professional money is active — and position accordingly.

**VSA vs Traditional Technical Analysis:**

| Feature | Traditional TA | VSA |
|---------|--------------|-----|
| Primary signal | Price patterns | Volume-price relationship |
| Pattern meaning | Fixed (Hammer = bullish) | Context-dependent |
| Trend confirmation | Moving averages | Volume expansion/contraction |
| Reversal signals | Candlestick patterns | Climax volume + spread + close |
| Core assumption | Price repeats patterns | Supply/demand leave volume traces |
| Evidence standard | Observation | Inference (explicitly acknowledged) |

---

### 10.2 The Three Laws of VSA

![The Three Laws of VSA — The Foundation of Volume Spread Analysis](/images/pi-vsa-three-laws.jpg)

**LAW 1: SUPPLY AND DEMAND**

> *Every price movement is caused by an imbalance between supply and demand.*

When demand exceeds supply → price rises.
When supply exceeds demand → price falls.
When supply equals demand → price moves sideways (range).

**VSA's unique application of Law 1:**

VSA does not simply observe "price went up = demand won." It asks: *What evidence in the bar's volume, spread, and close tells us about the balance of supply and demand at this specific price level?*

A wide up bar with a high close and high volume = demand was active and dominant. But a wide up bar with a high close on LOW volume = demand was barely needed (no supply), which is also bullish. Both are bullish, but for different supply/demand reasons. VSA differentiates them.

**LAW 2: CAUSE AND EFFECT**

> *For every effect in the market, there must be a proportional cause. The size of the effect is proportional to the time spent building the cause.*

In practice:
- **Cause** = the accumulation or distribution period (the base or top)
- **Effect** = the subsequent trend move (markup or markdown)

```
Small cause (3-week accumulation base):
→ Small effect (10–15% move)

Large cause (6-month accumulation base):
→ Large effect (50–100%+ move)
```

**Why this law matters practically:**

It explains why patience in waiting for a proper base to develop is rewarded. A stock that has been accumulating for 3 months has built 4× more cause than one that consolidated for 3 weeks — and should produce a proportionally larger move.

It also explains why "breakouts from small bases fail more often than breakouts from large bases" — the cause was insufficient for a sustained effect.

**LAW 3: EFFORT VS RESULT**

> *The effort (volume) expended must be proportionate to the result (price movement) achieved. When they are disproportionate, a significant market mechanic is operating.*

This is the law most unique to VSA. It tells you:

- **Proportionate**: Normal market mechanics — no anomaly.
- **High effort, no result**: Absorption — an opposing large order is preventing movement.
- **Low effort, large result**: Exhaustion of the opposing side — no one is resisting.

Both anomalies are analytically significant. The first reveals where a professional participant has a large order. The second reveals where the prior trend's force has run out.

---

### 10.3 The Four VSA Variables

![The Four VSA Variables — Reading Every Bar Systematically](/images/pi-vsa-four-variables.jpg)

Every bar is assessed using four variables. All four must be read together — no variable has standalone meaning.

**VARIABLE 1: SPREAD (Range)**

VSA uses "spread" to mean the bar's price range (High − Low). This is completely different from the bid-ask spread.

```
Spread = High − Low

Normalised Spread = Spread / ATR(14)
Wide:   > 1.5× ATR
Normal: 0.7–1.5× ATR
Narrow: < 0.5× ATR
```

Spread measures: How large was the price movement during the session?

- Wide spread = a significant move occurred (one side exerted large force)
- Narrow spread = minimal movement (forces balanced or neither side active)

**VARIABLE 2: VOLUME**

```
RelVol = Today's Volume / 20-period Average Volume

High:   RelVol > 2.0
Normal: RelVol 0.7–2.0
Low:    RelVol < 0.5
```

Volume measures: How broad was the participation?

- High volume = many participants active (or one very large participant)
- Low volume = few participants active

**VARIABLE 3: CLOSE LOCATION**

```
Close Location % = (Close − Low) / (High − Low) × 100

Top third (>66%):    Buyers held control at session end
Middle (33–66%):     Neither side dominated at close
Bottom third (<33%): Sellers held control at session end
```

Close location measures: Who had the last word in the session's supply-demand battle?

The close is the most important single price — it reflects the market's SESSION-END verdict on supply vs demand at these prices.

**VARIABLE 4: BACKGROUND**

Background is not a number — it is the analytical context provided by the prior 20–50 bars.

Questions to answer for the background:
1. What is the trend? (HH/HL uptrend, LH/LL downtrend, range)
2. What has volume been doing? (Expanding? Contracting? Climactic recently?)
3. Were there any prior VSA events? (SC, AR, ST, BC, Upthrust, Test, SOS, SOW?)
4. What structural levels are relevant? (Support, resistance, prior swing points)
5. Where is this bar within the Wyckoff phase? (Accumulation, Markup, Distribution, Markdown)

**The four-variable reading template:**

```
For every bar:
1. Spread: Wide / Normal / Narrow (Normalised: ___×ATR)
2. Volume: High / Normal / Low (RelVol: ___×)
3. Close Location: Top / Middle / Bottom (___%)
4. Background: [Describe prior trend, prior events, structural context]

Then: Combination → VSA Pattern → Evidence Class → Hypothesis
```

---

### 10.4 The Professional Money Concept in VSA

VSA is built on the assumption that **professional participants act in predictable ways** because:

1. They must accumulate large positions before a move — requiring time and a specific price range
2. They must distribute large positions at the top — requiring time and buyer demand
3. Their actions leave volume traces that cannot be hidden
4. Their behaviour follows the three laws mechanically

**Who is "professional money" in the NSE context?**

| Participant | Scale | VSA relevance |
|------------|-------|--------------|
| Domestic Mutual Funds (MF) | ₹50+ lakh crore AUM | Very high — large, slow-moving positions |
| Foreign Institutional Investors (FII/FPI) | ₹35+ lakh crore equity holdings | Very high — significant market movers |
| Insurance companies (LIC, etc.) | Large, systematic buyers | Moderate — steady, not tactical |
| Proprietary trading desks | Medium | Moderate — tactical, faster |
| High-frequency trading (HFT) | High volume, tiny positions | Low VSA relevance — bilateral, mean-reverting |
| Retail investors | Small individually, large collectively | Low — reactive, not directional leaders |

**NSE institutional flow data:**

NSE publishes daily FII/DII (Domestic Institutional Investor) buy-sell data. This is an additional layer of confirmation:
- FII net buying + bullish VSA signal = HIGH CONFIDENCE
- FII net selling + bearish VSA signal = HIGH CONFIDENCE
- Conflicting signals = Caution — investigate further

**CAUTION:** VSA does NOT claim to identify INDIVIDUAL participants. It identifies the NET effect of professional activity as visible in the OHLCV record. "Professional money active here" is always an INFERENCE — never a fact.

---

### 10.5 Reading Background — The 20-Bar Minimum

A single bar without context is meaningless. The Background (Variable 4) is established by reading the prior 20–50 bars before interpreting any current bar.

**The 20-bar background scan (systematic process):**

**Step 1 — Identify the trend:**
Using the HH/HL or LH/LL framework (Chapter 7), classify the prior 20 bars:
- Uptrend? Downtrend? Range? Transitioning?

**Step 2 — Identify volume trend:**
- Is volume generally rising, declining, or stable?
- Are up-bar volumes higher or lower than down-bar volumes?
- Were there any volume spikes (RelVol > 3×) in the past 20 bars?

**Step 3 — Identify prior VSA events:**
- Was there a Selling Climax (SC) or Buying Climax (BC)?
- Was there an Automatic Rally (AR) or Automatic Reaction (AR)?
- Was there a Secondary Test (ST)?
- Was there a Spring or Upthrust?
- Was there a Sign of Strength (SOS) or Sign of Weakness (SOW)?

**Step 4 — Identify structural context:**
- What are the key support and resistance levels?
- Is today's bar at, near, or away from a significant structural level?
- Is price in the accumulation phase, markup phase, distribution phase, or markdown?

**Step 5 — Form the background hypothesis:**
Based on steps 1–4, write a one-sentence background: "The stock is in [trend], with [volume direction], having recently seen [VSA events], and is currently [structural context]."

Only AFTER completing this background scan should you interpret the current bar.

---

## LEVEL 2 — INTERMEDIATE

### 10.6 The VSA Bar Classification System

Every bar can be systematically classified into one of these categories. This is not a lookup table — it is a framework for systematic reasoning.

**Category A: Wide Spread Bars (Range > 1.5× ATR)**

| Volume | Close | VSA Classification | Direction |
|--------|-------|-------------------|-----------|
| High | Top third | Demand Bar / SOS candidate | Bullish |
| High | Bottom third | Supply Bar / SOW candidate | Bearish |
| High | Middle | Absorption / Climax (with wick) | Requires context |
| Low | Top third | No Supply bar (upward) | Bullish (after downtrend) |
| Low | Bottom third | No Demand bar (downward) | Bearish (after uptrend) |

**Category B: Narrow Spread Bars (Range < 0.5× ATR)**

| Volume | Close | VSA Classification | Direction |
|--------|-------|-------------------|-----------|
| High | Top or Bottom | Absorption bar | Requires context |
| High | Middle | Congestion / Indecision | Neutral |
| Low | Top third | No Supply | Bullish background |
| Low | Bottom third | No Demand | Bearish background |
| Low | Middle | No Interest | Neutral |

**Category C: Bars with Significant Wicks (Wick > 1.5× body)**

| Volume | Wick type | Close | VSA Classification |
|--------|-----------|-------|-------------------|
| High | Long lower wick | Top third | Stopping Volume / SC |
| High | Long upper wick | Bottom third | Upthrust / BC |
| Low | Long lower wick | Top third | Test (positive) |
| Low | Long upper wick | Bottom third | Test (negative / no demand) |
| Any | Both wicks equal | Middle | High-wave / Doji |

**Category D: Climactic Bars (Volume > 4× ATR)**

Any bar with extreme volume (RelVol > 4.0) gets automatic elevated scrutiny:
- Combined with wide spread + decisive close: Climactic signal (SC or BC)
- Combined with narrow spread: Climactic absorption
- Combined with wick recovery: Stopping Volume (bullish) or Climactic Supply (bearish)
- On news/event days: Flag for review before interpreting

---

### 10.7 The Five VSA Questions

For every bar, ask these five questions in order. They are the systematic reading protocol.

**Question 1: Is the spread wide, normal, or narrow relative to recent bars?**

Normalise against the 14-period ATR. Wide (> 1.5×), normal (0.7–1.5×), or narrow (< 0.5×)?

This tells you: How much force was applied in this session?

**Question 2: Is the volume high, normal, or low relative to recent bars?**

Calculate RelVol against the 20-period average. High (> 2.0×), normal (0.7–2.0×), or low (< 0.5×)?

This tells you: How broadly was this session's activity?

**Question 3: Where did the bar close within its range?**

Calculate Close Location % = (Close − Low)/(High − Low) × 100. Top third (> 66%), middle (33–66%), or bottom third (< 33%)?

This tells you: Who had the final say at session end?

**Question 4: What is the background?**

Complete the 20-bar background scan (Section 10.5). What VSA events preceded this bar? What is the structural context?

This tells you: What STORY is this bar a chapter of?

**Question 5: Is the volume-spread-close relationship proportionate or anomalous?**

Combine Variables 1, 2, 3:
- High volume + wide spread + decisive close = Proportionate (normal direction)
- High volume + narrow spread = Anomalous (absorption)
- Low volume + wide spread = Anomalous (no opposition)

This tells you: Is the effort-result relationship normal, or is something unusual happening?

**The five questions together produce a complete bar reading:**

```
Bar reading example:
Q1. Spread: Wide (2.1× ATR) → Large force applied
Q2. Volume: High (3.8× average) → Broad participation
Q3. Close: Top third (82%) → Buyers held control
Q4. Background: 6-week downtrend, SC 3 sessions ago on 8× volume, AR followed, now this bar
Q5. Relationship: Wide spread + high volume + top close = Proportionate (demand dominant)

Combined: This is a Sign of Strength (SOS) bar following an accumulation base.
Evidence class: STRONG INFERENCE
Hypothesis: Markup phase beginning. Uptrend likely resuming.
Confirmation needed: Price holds above this bar's midpoint; next 2–3 sessions close in upper halves.
```

---

### 10.8 VSA and the Evidence Hierarchy

VSA inferences are NEVER facts. They are always probabilistic assessments based on incomplete information. The professional VSA practitioner maintains strict evidence discipline.

**The VSA evidence hierarchy:**

**Level 1 — OBSERVATION (Facts):**
The raw OHLCV data. These are facts.
- "Today's High was ₹520"
- "Volume was 28 lakh shares"
- "The close was at ₹512"
- "RelVol was 3.8×"
- "Close Location was 87%"

**Level 2 — INFERENCE (Probable interpretation):**
What the data most likely means, given the four variables and context.
- "Demand was likely dominant at session end" (from top-third close)
- "Broad participation occurred" (from high volume)
- "This combination is consistent with a Sign of Strength pattern" (from all four variables)

**Level 3 — HYPOTHESIS (Testable directional bet):**
What you expect will happen next, given the inference.
- "I hypothesise that the markup phase is beginning"
- "I expect price to hold above ₹500 on the next pullback"
- "I hypothesise that this is the beginning of a sustained uptrend"

**Level 4 — CONFIRMATION (Evidence supporting the hypothesis):**
What would need to happen to increase confidence in the hypothesis.
- "Price closes above ₹510 for the next 3 sessions"
- "Pullback to ₹500 on low volume (Test) holds"
- "A second SOS bar appears on the next up-leg"

**Level 5 — INVALIDATION (Evidence disproving the hypothesis):**
What would cause you to abandon the hypothesis.
- "Price closes below ₹490 (the prior HL) on any session"
- "Next pullback occurs on HIGHER volume than the SOS bar"
- "A wide down bar on high volume appears, closing in the bottom third"

**Every VSA trade must have all five levels defined before entry.**

---

### 10.9 Common VSA Misconceptions

**Misconception 1: "High volume is always bullish"**

FALSE. High volume on a down bar closing in the bottom third is bearish (supply dominant). High volume on an up bar near resistance may be a Buying Climax (bearish warning). Volume direction is determined by the close location and context, not the raw volume number.

**Misconception 2: "Low volume is always bearish"**

FALSE. Low volume on a narrow bar in the top half of its range after a downtrend = "No Supply" — a bullish background condition. Low volume can be the most bullish sign in an accumulation context.

**Misconception 3: "VSA can identify exactly who is buying"**

FALSE. VSA can only infer the NET effect of professional activity from the OHLCV record. You cannot identify individual participants, their size, their intentions, or their specific orders. "Smart money is buying" is always an inference, not a fact.

**Misconception 4: "VSA signals work without context"**

FALSE. The same bar shape means different things in different contexts. There are no standalone VSA signals. Background (Variable 4) is as important as the bar itself. Without the prior 20 bars, any VSA reading is incomplete and unreliable.

**Misconception 5: "VSA works on all stocks and timeframes equally"**

FALSE. VSA works best on: (1) Liquid stocks where volume reflects broad participation. (2) Daily/weekly timeframes where HFT noise is averaged out. (3) Stocks not dominated by mechanical flow (index ETFs, algorithmic rebalancing). On illiquid stocks (Chapter 5), VSA is unreliable. On 1-minute bars, HFT dominates the volume and VSA patterns are distorted.

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### 10.10 VSA as Bayesian Reasoning

At the professional level, VSA is best understood as **Bayesian reasoning** — updating probability estimates based on sequential evidence.

**The Bayesian framework applied to VSA:**

```
Prior probability: Where does price tend to go from this structural context?
Example: After a downtrend, price tends to eventually reverse (base rate: ~60-65% of extended downtrends form bases)

Evidence update 1 (SC bar):
The appearance of a Selling Climax on high volume at a significant support level
UPDATES our estimate: P(reversal) rises from 60% to ~70%

Evidence update 2 (successful ST):
The Secondary Test holds above the SC low on lower volume
UPDATES: P(reversal) rises to ~78%

Evidence update 3 (Spring + positive test):
Spring below the range, recovery on low volume
UPDATES: P(reversal) rises to ~84%

Evidence update 4 (SOS):
Wide up bar on high volume closes in top third, breaks above accumulation range
UPDATES: P(reversal) rises to ~88-90%

Evidence update 5 (LPS holds):
Pullback to the old range top holds on low volume (No Supply)
UPDATES: P(sustained uptrend) rises to ~92%
```

This is not a mechanical calculation — it is a conceptual framework. Each piece of VSA evidence updates your probability estimate in proportion to how strongly that evidence supports the hypothesis.

**The professional discipline:** Maintain probability estimates. Not "this is bullish." But "after this SC + ST + Spring sequence, I estimate the probability of a sustained rally as approximately 80%. My position size reflects this probability, not certainty."

---

### 10.11 VSA vs Market Profile vs Order Flow — The Relationship

| Method | Primary Data | Core Question | Timeframe |
|--------|------------|--------------|----------|
| VSA | OHLCV (End of day) | Who controlled each session? | Daily/Weekly |
| Market Profile / Volume Profile | Intraday price-volume distribution | Where is fair value? | Intraday/Daily |
| Order Flow (Footprint) | Bid-ask trade data | Who was aggressive at each price? | Intraday (sub-minute) |

**How they complement each other:**

- **VSA** establishes the macro context: accumulation/distribution phase, background condition, significant volume events
- **Volume Profile** identifies the key price levels (HVN/LVN) where the most trading occurred — the "value areas"
- **Order Flow** provides the precise entry signal by showing exactly which side was more aggressive at a specific price level in real time

Professional traders use VSA for daily context → Volume Profile for level selection → Order Flow for intraday entry. This is the multi-method hierarchy used at institutional desks.

For NSE retail traders: VSA + Market Structure (Chapter 7) provides sufficient context for swing trading setups without needing intraday order flow tools.

---

### 10.12 Building a VSA Reading Practice

**Daily routine (30 minutes):**

```
1. Market scan (5 min):
   - What did Nifty 50 / Sensex do today?
   - Was today's market volume high, normal, or low vs recent?
   - What was the close location on the index?

2. Watchlist scan (15 min):
   - For each stock on the watchlist:
     a. Apply the 5 VSA questions
     b. Compare to prior session
     c. Note any change in background
     d. Flag any high-probability setups

3. Open trade management (5 min):
   - For each open trade:
     a. Is the VSA narrative still intact?
     b. Did today's bar confirm or question the thesis?
     c. Any invalidation criteria approaching?

4. Journal entry (5 min):
   - Document the key market theme for today
   - Note any new VSA events observed
   - Update probability estimates for active hypotheses
```

**The VSA journal entry format:**

```
Date: ___________
Stock: ___________
4 Variables:
  Spread: ____× ATR → [Wide/Normal/Narrow]
  Volume: ____× avg → [High/Normal/Low]
  Close Location: ___% → [Top/Middle/Bottom]
  Background: [1-sentence summary]
VSA Pattern: ___________
Evidence Class: [OBSERVATION / INFERENCE / HYPOTHESIS]
Hypothesis: ___________
Confirmation criteria: ___________
Invalidation criteria: ___________
Action: [Watch / Enter / Hold / Exit / No action]
```

---

## EXERCISES

### Beginner Exercises

**Exercise 10.1 — The Three Laws Application**

For each market scenario, identify which VSA Law is primarily at work:

a) A stock rises 4% on volume 3× average: buyers swept through all available supply.
b) A stock has been consolidating for 6 months; when it breaks out, it moves 40%.
c) A stock falls sharply on high volume but immediately recovers — price ends flat.
d) A stock rises 2% on volume 0.3× average — almost no sellers.
e) A stock rises on 8× volume for 3 days in a row, then reverses sharply.
f) A stock that consolidated for 3 weeks breaks out and moves 8%; another that consolidated for 6 months breaks out and moves 45%.

For each: (a) Identify the law, (b) Explain which specific aspect of the law applies, (c) State the evidence classification.

**Exercise 10.2 — Four Variables Calculation**

Calculate all four variables for each bar:

| Bar | Open | High | Low | Close | Volume | ATR(14) | 20-day avg vol | Prior context |
|-----|------|------|-----|-------|--------|---------|----------------|--------------|
| A | ₹480 | ₹518 | ₹472 | ₹512 | 28 lakh | ₹15 | 8 lakh | 6-wk downtrend, at support |
| B | ₹800 | ₹812 | ₹798 | ₹800 | 45 lakh | ₹12 | 10 lakh | At resistance, 3-month uptrend |
| C | ₹300 | ₹306 | ₹298 | ₹304 | 1.2 lakh | ₹8 | 3 lakh | After SC 5 sessions ago |
| D | ₹650 | ₹655 | ₹618 | ₹649 | 32 lakh | ₹18 | 9 lakh | Mid-downtrend, open air |

For each: Spread (₹ and ×ATR), Volume (RelVol), Close Location %, VSA classification, evidence class.

**Exercise 10.3 — Five Questions Protocol**

Apply the five VSA questions systematically to this bar:

Stock data: O=₹1,190, H=₹1,248, L=₹1,182, C=₹1,239
Volume: 85 lakh shares, 20-day avg: 28 lakh shares, ATR(14): ₹32

Background: 8-week downtrend prior. 4 sessions ago: wide down bar, volume 7.2×, close at 52% (possible SC). 3 sessions ago: moderate up bar on 2.1× volume (AR). Sessions 2 and 3 back: narrow bars, volume 0.6–0.7×, close in upper halves. Today is this bar.

Apply all five questions in sequence. End with: Pattern, Evidence Class, Hypothesis, Confirmation criteria, Invalidation criteria.

---

### Intermediate Exercises

**Exercise 10.4 — VSA Bar Classification**

Classify each bar using the Category A/B/C/D system:

| Bar | Spread vs ATR | RelVol | Close % | Significant wick? |
|-----|--------------|--------|---------|-----------------|
| 1 | 2.1× (Wide) | 4.2× (High) | 88% | No wicks |
| 2 | 0.4× (Narrow) | 3.8× (High) | 45% | No wicks |
| 3 | 1.8× (Wide) | 0.4× (Low) | 82% | No wicks |
| 4 | 1.2× (Normal) | 5.6× (Very high) | 55% | Long lower wick (2× body) |
| 5 | 0.3× (Narrow) | 0.3× (Ultra-low) | 71% | No wicks |
| 6 | 1.9× (Wide) | 4.8× (Very high) | 18% | Long upper wick (3× body) |

For each: (a) Category, (b) VSA pattern name, (c) Bullish/Bearish/Neutral, (d) What background context would most change the interpretation?

**Exercise 10.5 — Evidence Hierarchy Application**

A stock shows this sequence:

Session 1: Wide down bar, 8.5× volume, close 38% (SC candidate)
Session 2: Moderate up bar, 2.3× volume, close 72% (AR candidate)
Session 3: Narrow bar, 0.6× volume, close 58% (consolidation)
Session 4: Narrow bar, 0.3× volume, low touches Session 1's low, close 78% (Test candidate)
Session 5: Wide up bar, 3.8× volume, close 85% (SOS candidate?)

For EACH event, create a full evidence hierarchy entry:
- OBSERVATION (raw facts)
- INFERENCE (what the data likely means)
- HYPOTHESIS (what you expect next)
- CONFIRMATION criteria
- INVALIDATION criteria

**Exercise 10.6 — VSA Journal Entry**

Using the bar data from Exercise 10.3, write a complete VSA journal entry using the professional format from Section 10.12.

---

### Advanced Exercises

**Exercise 10.7 — Bayesian Update Sequence**

Starting probability of a sustained bullish reversal: 50% (no information, coin flip).

Apply sequential evidence updates for this scenario:

Evidence 1: Stock is at a 6-month support level, tested and held twice before.
Evidence 2: Today's bar: SC characteristics (8.2× volume, wide down, close 48% with lower wick recovery).
Evidence 3: Next session: Automatic Rally (2.1× volume, close 74%), up 5%.
Evidence 4: Following session: Secondary Test at SC level, volume 0.5×, close 71%, holds above SC low.
Evidence 5: Two sessions later: Spring (dips 1% below support, recovers, close 78%, volume 0.3×).
Evidence 6: Next session: Wide up bar, 4.2× volume, close 88%, breaks above AR high.
Evidence 7: Pullback session: Narrow bar, 0.6× volume, holds above breakout level, close 62%.

For each evidence update:
a) Estimate the probability change (increase by how much?)
b) Justify the magnitude of the change (strong evidence = large update; weak = small)
c) State which of the Three Laws this evidence demonstrates
d) At which evidence piece does probability cross 80%?

**Exercise 10.8 — VSA Misconception Diagnosis**

A trader shows you their analysis: "I see high volume today, so I'm buying. Volume confirms the move." The stock has the following characteristics:
- Bar: Wide up bar, RelVol 3.8×, close location 22%, upper wick is 4× the body length
- Context: 10-week uptrend, stock is at a 2-year high resistance level
- Delivery: 18%

Identify: Which of the five VSA misconceptions (Section 10.9) is this trader committing? How many signals actually point AGAINST the bullish thesis? Write a corrected analysis using proper VSA framework.

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** State the Three Laws of VSA. For each, give a specific example from an NSE stock context.

**Q2.** What is VSA's "Spread" variable? Why might it be confused with another type of spread, and why is the distinction critical?

**Q3.** Explain the VSA Close Location variable. Why is it more important than the candle's body colour (bullish/bearish)?

**Q4.** What is the "Background" in VSA, and why is a minimum of 20 prior bars needed before any current bar can be read reliably?

**Q5.** Tom Williams claimed that professional participants leave "unavoidable traces" in the OHLCV record. Explain the mechanism — why can't professional accumulation be hidden?

**Q6.** Explain the Law of Cause and Effect in practical terms. Why does a 6-month accumulation base produce a larger move than a 3-week base?

**Q7.** What is the five-question VSA protocol? Why must the questions be answered in that specific order?

**Q8.** Distinguish between OBSERVATION, INFERENCE, and HYPOTHESIS in the VSA evidence hierarchy. Why is maintaining this distinction critical for trading discipline?

**Q9.** Under what conditions does VSA work best and work worst? Name two stock types and two timeframes where VSA is less reliable, and explain the mechanism.

**Q10.** How does VSA relate to Order Flow analysis and Volume Profile? Are they competing or complementary? How would you combine them in a trading workflow?

---

### Chart Scenario Questions (5)

**S1.** Apply the complete VSA framework (3 Laws + 4 Variables + 5 Questions) to this scenario:

Background (20 bars): Stock in a downtrend for 10 weeks. Volume has been declining on each successive down-wave. No prior VSA events in the 20-bar window.

Today's bar: O=₹340, H=₹362, L=₹322, C=₹357. Volume: 48 lakh (20-day avg: 11 lakh). ATR(14): ₹14.

a) Which of the Three Laws is most prominently at work?
b) Calculate all four VSA variables.
c) Apply the five questions.
d) What VSA pattern is this?
e) Evidence class?
f) Hypothesis, confirmation, invalidation.

**S2.** An analyst says: "After studying VSA for 3 months, I have a rule: Any narrow-range, low-volume bar after a downtrend is a 'No Supply' signal and I buy it immediately."

Critique this approach thoroughly using the Four Variables framework. What is missing? Design a more complete and rigorous rule.

**S3.** A stock shows this 5-day sequence. Apply the 5-question protocol to each bar:

| Day | O | H | L | C | Vol (lakh) | ATR | 20-avg |
|-----|---|---|---|---|-----------|-----|--------|
| 1 | ₹500 | ₹538 | ₹492 | ₹530 | 52 | ₹18 | 12 |
| 2 | ₹532 | ₹545 | ₹520 | ₹523 | 28 | ₹18 | 12 |
| 3 | ₹520 | ₹528 | ₹508 | ₹514 | 8 | ₹18 | 12 |
| 4 | ₹512 | ₹518 | ₹503 | ₹516 | 5 | ₹18 | 12 |
| 5 | ₹516 | ₹562 | ₹512 | ₹555 | 38 | ₹18 | 12 |

Context: Prior to Day 1, the stock was in a 6-week downtrend. Day 1 makes a new 3-month low. Write the complete 5-day VSA narrative.

**S4.** Demonstrate the Bayesian updating process for this bear case:

Starting probability of sustained decline: 50%.

Sequence:
1. Stock has been in uptrend for 12 weeks.
2. Today: Extreme volume (9.2×), wide up bar, but close only 38% (upper wick takes most of the range).
3. Tomorrow: Volume 0.8×, narrow bar, close 45%.
4. Day 3: Volume 1.4×, moderate down bar, close 22%, breaks below prior Higher Low.
5. Day 4: Volume 0.6×, narrow up bar, close 52% — bounces back toward the broken HL.
6. Day 5: Volume 2.8×, wide down bar, close 15%, breaks through Day 4's attempted recovery.

Update probability at each step. Identify which step crosses 70% probability of a sustained decline.

**S5.** NSE-specific VSA challenge: Identify the non-VSA distortions in this scenario and explain how to account for them:

Stock: Nifty 50 constituent
Session data: Volume 12× average, wide up bar, close 82% of range, delivery 14%
Date: Last Thursday of the month (F&O expiry), earnings announced 2 hours before close
FII data that evening: FII net SOLD ₹2,800 crore in this stock today (bulk deal)

How many VSA signals are unreliable? What is the actual net VSA reading after adjusting for all distortions? What session(s) should you wait for before forming a VSA hypothesis?

---

## QUIZ ANSWERS

### Conceptual Answers

**A1.** Three Laws: (1) Supply and Demand: Every price move is caused by supply-demand imbalance. NSE example: HDFC Bank rises 3% on heavy volume after strong earnings — demand exceeded supply at all price levels up to the new high. (2) Cause and Effect: The size of the move is proportional to the time spent building it. NSE example: Nifty 50 consolidates for 6 months in a range, then breaks out for a 25% rally — the large cause (6-month range) produces a proportional large effect. (3) Effort vs Result: Disproportionate effort-result indicates a significant market mechanic. NSE example: Stock trades 8× average volume but price barely moves → absorption at that level.

**A2.** VSA "Spread" = bar's price range = High − Low. This is NOT the bid-ask spread (the difference between best ask and best bid in the order book). The confusion is dangerous: A "narrow spread" in VSA means a small price range for the session — which can actually occur while the bid-ask spread is wide (in illiquid stocks). A "wide spread" in VSA means a large range — which is independent of the bid-ask spread. Always clarify which "spread" is being discussed when reading VSA literature.

**A3.** Close Location = (Close − Low)/(High − Low) × 100. It is more important than body colour because: body colour only tells you whether Close > Open (bullish) or Close < Open (bearish). But the Open can be anywhere in the range. A green candle with Close at 15% of range is WEAK despite being technically "bullish." A red candle with Close at 80% of range is STRONG despite being technically "bearish." Close Location captures who held control at session END — the most recent and definitive verdict of the supply-demand battle — while body colour is distorted by where price happened to open.

**A4.** Background = the analytical context from the prior 20–50 bars. A minimum of 20 bars is needed because: (1) You need enough data to identify the trend (at least 2 complete swing cycles). (2) You need to see the volume trend (rising/falling). (3) You need to identify prior VSA events that define the phase (SC, AR, Test, etc.). (4) The current bar's meaning depends on what came before — a wide up bar after a SC is a Sign of Strength; the same bar in mid-range is just a normal up bar. Without the 20-bar minimum, any VSA reading is structurally incomplete.

**A5.** Professional accumulation cannot be fully hidden because: To accumulate millions of shares, a large buyer must accept increasingly adverse prices as they buy. Each purchase shifts the bid-ask upward slightly. The accumulated volume must appear in the exchange data. Large orders leave footprints: unusual volume at price levels where price should logically fall (in a downtrend), narrow ranges despite high volume (absorption), and increasing delivery percentages as positions are built. The only way to hide this would be to buy so slowly that volume never spikes — but then accumulation would take years, which is impractical. Tom Williams' contribution: these traces are systematic enough to be read if you know what to look for.

**A6.** Cause and Effect (practical): A 6-month accumulation means: A large buyer was active for 6 months absorbing every sale, building a very large position. To sell this position at a profit (markup), they need price to rise a very large amount — they must attract sufficient demand to absorb their supply as they distribute. Therefore: large position built (large cause) → requires large price appreciation to distribute profitably (large effect). A 3-week base: the buyer accumulated a much smaller position and needs price to rise only modestly before distributing.

**A7.** Five-question order: Q1 (Spread) first because it establishes the magnitude of the event. Q2 (Volume) second because it establishes the participation. Q3 (Close) third because it reveals the winner. Q4 (Background) fourth because it provides the story frame that gives the first three variables their meaning. Q5 (Relationship) last because it synthesises the first three against each other to identify anomalies. The order matters because Q5's answer is meaningless without Q1–Q3 being answered, and Q4 gives Q5's anomaly its directional interpretation.

**A8.** OBSERVATION: The raw data — what actually happened (price, volume, OHLC). These are facts. INFERENCE: What the observation most likely means — a probability-weighted interpretation. INFERENCE is never certain — it could be wrong. HYPOTHESIS: A testable, directional prediction about what will happen next, based on the inference. Why the distinction matters: Many traders act on INFERENCE as if it were FACT. They "know" the market is going up because of a "bullish VSA signal." In reality, they have an INFERENCE with maybe 65-75% probability. Treating inference as fact leads to oversized positions, no stop-losses, and inability to adapt when the hypothesis is invalidated.

**A9.** VSA works best: (1) Liquid large-cap stocks (volume reflects broad participation, not individual actors). (2) Daily timeframe (HFT noise averages out, one session = one coherent supply-demand episode). VSA works worst: (1) Illiquid small-caps — volume spikes may reflect one participant, not broad dynamics. (2) 1-minute charts — HFT activity dominates volume, creating patterns that look like VSA signals but have no supply-demand meaning. (3) ETFs subject to mechanical rebalancing — volume is forced, not directional. (4) F&O expiry sessions — volume is settlement-driven, not supply-demand-driven.

**A10.** VSA, Volume Profile, and Order Flow are complementary at different scales: VSA (daily OHLCV) establishes the macro context: Is this stock accumulating or distributing? What is the background? This is the WHAT and WHY. Volume Profile (intraday price-volume distribution) identifies WHERE fair value is and where significant supply/demand exists as horizontal levels. Order Flow (bid-ask data, sub-minute) provides the WHEN — the precise moment aggression from one side appears. In practice: VSA identifies the trade setup (accumulation base complete, Spring occurred) → Volume Profile confirms the key entry level → Order Flow triggers the exact entry when aggressive buyers appear at the LPS level.

---

## KEY TAKEAWAYS — CHAPTER 10

> **1. VSA's three laws are the operating framework: (1) Supply and Demand — price moves because of imbalance. (2) Cause and Effect — larger base = larger move. (3) Effort vs Result — disproportionate effort-result reveals a significant mechanic.**

> **2. The four variables (Spread, Volume, Close, Background) must ALL be read for every bar. No single variable has standalone meaning. The combination defines the interpretation.**

> **3. The five questions (Spread? Volume? Close? Background? Proportionate?) form the systematic reading protocol. Always in this order, always all five.**

> **4. VSA evidence is always classified: OBSERVATION → INFERENCE → HYPOTHESIS → CONFIRMATION/INVALIDATION. Never treat an inference as a fact. Position sizing should reflect the probability level of the inference.**

> **5. Professional money leaves traces because large accumulation requires large volume at specific price levels — these traces appear in the OHLCV record as absorption bars, low-volume No Supply conditions, and climactic reversals.**

> **6. VSA is most reliable on liquid stocks, daily/weekly timeframes, and with a clean background free of mechanical distortions (F&O expiry, bulk deals, earnings days).**

> **7. The 20-bar background scan is mandatory. Trend, volume trend, prior VSA events, and structural context — all must be established before any current bar can be interpreted.**

---

*Chapter 10 Complete. Part V — VSA continues.*

---

**Previous:** [← Chapter 9 — Price-Volume Relationship](./price-volume-relationship.md)
**Next:** [Chapter 11 — VSA Patterns →](./vsa-patterns.md)

*When ready, say: **"NEXT CHAPTER"***
