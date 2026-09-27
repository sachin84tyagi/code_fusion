# Delivery Analysis

> **Course:** NSE/BSE Professional Investing — Price, Volume & Institutional Flow
> **Part:** X — Indian Institutional Data
> **Topic:** Delivery Analysis

---

## Chapter Overview

Every share traded on NSE falls into one of two categories: **delivered** (buyer takes ownership and seller surrenders shares) or **intraday** (position opened and closed within the same session, no ownership transfer). The ratio of delivered shares to total traded shares is the **Delivery Percentage** — and it is one of the most underused, most powerful indicators available for free on NSE.

A stock can rise 4% on explosive volume. Without delivery %, you assume institutions are buying. With delivery %, you discover only 18% of trades were delivered — meaning day traders and speculators drove the move, while institutions were actually selling into the excitement. That 4% rise is a distribution event, not an accumulation event. Delivery % is the X-ray that separates the two.

**The Core Rule:**

> **Price tells you WHAT happened. Volume tells you HOW MUCH happened. Delivery % tells you WHO was responsible and WHETHER they intend to hold their position. All three together reveal the true institutional intent behind every price bar.**

---

## LEVEL 1 — BEGINNER

### What Is Delivery Percentage?

```
DEFINITION:
Delivery % = (Shares Delivered / Total Shares Traded) × 100

SHARES DELIVERED:
→ Actual transfer of ownership from seller to buyer
→ Seller had the shares in demat account. Buyer now holds them in demat.
→ This represents GENUINE buying intent — someone wanted to OWN the stock.
→ T+1 settlement on NSE (since January 2023): Shares deliver the next business day.

INTRADAY SHARES (NOT delivered):
→ Bought and sold on the SAME DAY
→ No actual ownership transfer — just a speculative round-trip
→ Represents day traders, scalpers, short-term speculators
→ These participants have NO long-term view — just short-term price bets

EXAMPLE:
Stock traded: 50,00,000 shares today
Delivered:    32,00,000 shares (went into demat accounts overnight)
Intraday:     18,00,000 shares (bought and sold same day)

Delivery % = (32,00,000 / 50,00,000) × 100 = 64%

Reading: 64% of today's activity was genuine ownership transfer.
         36% was intraday speculation.
         This is a HIGH delivery session → Institutional involvement confirmed.
```

**Where to access NSE Delivery % data (completely free):**

```
METHOD 1 — NSE Website (Daily individual stock):
nseindia.com → Market Data → Securities Deliverable / Non-Deliverable
→ Select the security name and date
→ Shows: Quantity Traded, Deliverable Qty, Delivery %
→ Updated each evening after market close

METHOD 2 — NSE Bhavcopy (bulk download — recommended):
nseindia.com → Archives → Market Data → Equity → Bhavcopy
→ Download the daily Bhavcopy CSV (contains ALL stocks)
→ Columns include: SYMBOL, OPEN, HIGH, LOW, CLOSE, VOLUME, DELIVERY QTY, DELIVERY %
→ One Excel download = delivery % for all 2,000+ NSE stocks for that day

Bhavcopy is the professional tool:
→ Download takes 2 seconds
→ Sort by delivery % to find highest-delivery stocks each day
→ Cross-reference with your watchlist
→ NSE provides Bhavcopy for the last 3 years — historical data available

METHOD 3 — Screener tools:
Screener.in, Trendlyne, Chartink: Filter stocks by delivery % thresholds
→ "Delivery % > 60% AND Volume > 1.5× average today" = institutional surge screen
```

**NSE Delivery % Reference Benchmarks:**

```
SECTOR-WISE AVERAGE DELIVERY % (approximate NSE baselines):

Large-cap Nifty 50 stocks:      35–55% average delivery on normal days
Mid-cap Nifty 150 stocks:       40–60% average delivery on normal days
Small-cap stocks:                45–70% average (lower liquidity = fewer intraday)
F&O active stocks:               25–45% average (F&O allows intraday without delivery)
Non-F&O stocks:                  50–75% average (cannot sell short intraday easily)

IMPORTANT: Compare a stock's delivery % to ITS OWN RECENT AVERAGE.
           Not to a market-wide absolute number.
           A stock with average delivery of 35%:
           → Today's 65% = HIGH delivery (significant above average)
           → Today's 22% = LOW delivery (significant below average)
```

---

### The Delivery % Matrix — 4 Quadrants

![Delivery Percentage Matrix — 4 Quadrants of Institutional Intent](/images/pi-delivery-percentage-matrix.jpg)

**Quadrant 1 — High Delivery + High Volume (INSTITUTIONAL SURGE):**

```
What it means:
→ Many shares trading AND most are being taken into delivery accounts.
→ This is the signature of GENUINE institutional buying.
→ Institutions cannot buy quietly when they are in urgency mode —
   they accept market impact and buy at volume.

When you see this:
→ On an up-bar: Institutions are buying aggressively. Wyckoff SOS context.
→ On a down-bar: Institutions are SELLING aggressively. Wyckoff SC or SOW context.
   (High delivery on a down-bar = genuine supply entering = important supply event)

NSE threshold: Volume > 1.5× 20-day average AND Delivery % > 60% of stock's average
               (or delivery % > 50% for F&O stocks, > 65% for non-F&O stocks)

Trading action: This is the highest-conviction institutional confirmation signal.
               Score it as +2 in the institutional scorecard.
```

**Quadrant 2 — High Delivery + Low Volume (QUIET ACCUMULATION):**

```
What it means:
→ Few shares trading, but those who ARE trading are taking delivery.
→ Smart money is accumulating QUIETLY — not in a hurry.
→ They are managing price impact by keeping activity low.
→ Classic stealth accumulation — the CO building a position without
   alerting the market to their buying.

When you see this:
→ During Phase B or early Phase C of Wyckoff accumulation.
→ Multiple sessions with high delivery but low volume = sustained stealth accumulation.
→ Particularly significant if the PRICE is also flat or slightly rising
   (supply is being absorbed without price disturbance).

Trading action: Not a trade trigger on its own. Add to watchlist.
               Watch for volume to EXPAND — that signals Phase D approaching.
               When the quiet accumulation is followed by an SOS (high delivery + high volume):
               The accumulation phase is confirmed.
```

**Quadrant 3 — Low Delivery + Low Volume (MARKET INACTIVITY):**

```
What it means:
→ Neither supply nor demand is present in size.
→ Day traders are keeping the stock alive but institutions have stepped away.
→ The stock is "abandoned" by smart money — waiting for a catalyst.

When you see this:
→ Mid-Phase B when no events are happening.
→ After a news catalyst has faded.
→ In holiday-shortened weeks or pre-event uncertainty.

Trading action: DO NOT enter. No institutional interest = unreliable technical patterns.
               A "breakout" on low delivery + low volume is a FALSE breakout.
               Wait for institutional re-entry (delivery % rising).
```

**Quadrant 4 — Low Delivery + High Volume (DISTRIBUTION / SPECULATION):**

```
What it means:
→ Many shares changing hands but almost none are going into demat accounts.
→ Day traders are churning the stock OR institutions are SELLING into retail excitement.
→ The high volume LOOKS bullish but the low delivery reveals the truth:
   No one is actually holding. It is speculation, not accumulation.

When you see this:
→ Near a Buying Climax (BC) — price at top, institutions selling into retail enthusiasm.
→ At a UTAD (Up Thrust After Distribution) — fake breakout on high speculative volume.
→ Any "blow-off top" where a stock gaps up on news and runs 5–8% intraday.

NSE-specific example:
Stock X announces a government contract. Opens up 6%, runs to +9% on 3.2× volume.
Delivery % = 14% (almost all intraday day-trading).
Reading: The move was driven entirely by retail speculation.
         Institutions are not buying — they may actually be selling into this.
         This is NOT an accumulation event. It is a distribution event disguised as a rally.

Trading action: BEARISH signal on a stock already in your long watchlist.
               If you hold the stock: Tighten stop immediately.
               Do not buy into this "excitement." The smart money is exiting.
```

---

## LEVEL 2 — INTERMEDIATE

### Delivery % Across the Wyckoff Cycle

![Delivery % Across the Wyckoff Cycle — What to Expect at Every Phase](/images/pi-delivery-wyckoff-map.jpg)

**The delivery % profile is predictable and consistent across every Wyckoff cycle:**

**Selling Climax (SC) — Delivery %: 70–90% (VERY HIGH):**

```
Why high: Genuine institutional selling (FII forced out by redemptions, global risk-off).
          Real shares moving from institutional demat to buyer demat = delivery.
          Stop-loss triggers at support levels: All genuine share sales = delivery.

How to use it:
→ SC bar should show HIGH delivery (confirms it is genuine supply, not intraday panic).
→ If the suspected SC bar shows LOW delivery (< 30%): It is NOT a SC.
   It is intraday panic selling with quick recovery — a false SC.
   The real SC is still ahead.

Threshold: SC delivery % should be the HIGHEST DELIVERY day in the last 20 sessions.
```

**Automatic Rally (AR) — Delivery %: 40–60% (MODERATE):**

```
Why moderate: Short-covering by those who shorted on the way down.
              Some genuine buying by value hunters.
              Mixed — not pure institutional buying yet.

If AR delivery is VERY HIGH (> 70%): Unusually strong buying at the lows.
This suggests institutions are already accumulating aggressively.
Wyckoff Phase A-B transition may be faster than usual.
```

**Secondary Tests (Phase B) — Delivery %: 30–50%, DECLINING across tests:**

```
The key pattern: Each successive test of the SC low should show LOWER delivery than the previous test.

Test 1 delivery: 45%
Test 2 delivery: 38%
Test 3 delivery: 26%

This declining delivery across tests = supply is exhausting.
Fewer and fewer sellers are willing to deliver shares at these prices.
The SC support is becoming more and more reliable.

ALERT: If a Secondary Test shows HIGHER delivery than the previous test:
Supply has NOT exhausted. The SC low may be violated. The test is suspect.
```

**Spring (Phase C) — Delivery %: 15–30% (VERY LOW — the most critical reading):**

```
The Spring's defining characteristic: Price dips BELOW the SC low but
very few shares are actually delivered.

Why this matters:
→ Low delivery on the Spring = Almost no genuine sellers delivering shares.
→ The dip below SC was caused by: Stop-loss triggers (mechanical, not intentional selling)
  + Short sellers testing the low.
→ These are intraday participants — not genuine sellers. They cover quickly.
→ The recovery after the Spring is fast because supply is absent.

THE MOST IMPORTANT DELIVERY % RULE:
Valid Spring: Delivery % on the breakdown day < 30% (ideally < 20%).
False breakdown (NOT a Spring): Delivery % on the breakdown day > 50%.
→ High delivery on the "Spring" = Real sellers are present = This is NOT a Spring.
   The stock will continue falling. The SC low will be violated properly.

This single rule has saved professional traders from entering false Springs more
than any other analytical tool.
```

**SOS (Sign of Strength) — Delivery %: 65–85% (VERY HIGH):**

```
The SOS is the institutional "reveal" — after accumulating quietly for weeks,
the CO now pushes price up forcefully, taking delivery in volume.

SOS day characteristics:
→ Volume: 2×–4× the 20-day average (urgency)
→ Delivery %: 65–85% (genuine buying at this explosive volume)
→ Price: Wide spread up, closes near high, breaks above the AR (Automatic Rally) high

Why delivery is so high: The CO is now accumulating aggressively.
They no longer care about price impact — they are buying everything available.
Sellers at this level are being absorbed completely.

If volume is high but delivery is LOW (< 40%) on the "SOS" bar:
→ This is NOT an SOS. It is a day-trader momentum move.
→ Wait for a genuine SOS with high delivery before treating it as Phase D.
```

**LPS (Last Point of Support) — Delivery %: 20–35% (LOW):**

```
The LPS is the Phase D pullback — the "last chance" entry.
Low delivery on LPS = No Supply (VSA) in delivery data.

Reading: After the SOS, price pulls back on declining volume AND low delivery.
The pullback is driven by normal profit-taking (some delivery) but NOT by institutional selling.

LPS delivery vs SOS delivery comparison:
SOS day: 72% delivery (buying)
LPS pullback: 22% delivery (no selling pressure)

This contrast — high SOS delivery followed by low LPS delivery — is the clearest
delivery-based confirmation of the accumulation thesis.
The CO bought the SOS. They are NOT selling on the LPS pullback.
The pullback is weak hands (retail profit-takers), not smart money distribution.
```

**Buying Climax (BC / Distribution Top) — Delivery %: 15–30% (LOW despite high price):**

```
The BC is the MIRROR of the SC:
At the TOP: High volume, price rising, retail is excited. But institutions are SELLING.
Low delivery = Sellers are not delivering (they bought earlier and now sell intraday to
institutions who are distributing to eager retail buyers).

The BC vs SOS distinction via delivery:
SOS: High volume + HIGH delivery (institutions buying = real demand)
BC:  High volume + LOW delivery (institutions selling = fake demand; retail speculating)

This delivery divergence is how you separate a genuine breakout (SOS) from a
distribution trap (BC). Same price pattern, opposite delivery readings.
```

---

### The 5-Day Delivery Trend

**Beyond single-day readings, track delivery % over 5 consecutive sessions:**

```
The 5-day delivery trend reveals the evolution of institutional intent:

BULLISH TREND (accumulation building):
Day 1: 28% delivery (Phase B, quiet)
Day 2: 34% delivery (slightly more interest)
Day 3: 42% delivery (institutions entering)
Day 4: 58% delivery (significant accumulation)
Day 5: 72% delivery (institutional surge — SOS forming)

Reading: Rising delivery trend over 5 days = Accumulation accelerating.
         The stock is transitioning from Phase B → Phase D.
         This 5-day rising delivery is a PRE-SOS signal.
         Load the stock on your Tier 1 watchlist immediately.

BEARISH TREND (distribution building):
Day 1: 68% delivery (healthy markup)
Day 2: 52% delivery (delivery declining on up-days — caution)
Day 3: 38% delivery (distribution accelerating)
Day 4: 22% delivery (institutions selling into retail)
Day 5: 14% delivery (full BC / UTAD delivery signature)

Reading: Declining delivery trend over 5 days on UP-days = Distribution.
         The stock is transitioning from Phase E (Markup) → Distribution.
         Tighten all stops on longs. Watch for LPSY formation.

FLAT/NEUTRAL TREND:
Day 1–5: 30–40% delivery (low, mostly flat)
Reading: Phase B — neither accumulation nor distribution dominant.
         No action. Monitor only.
```

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### Sector-Level Delivery Analysis

**Apply delivery % not just to individual stocks but to the sector basket:**

```
SECTOR DELIVERY SCREEN (using NSE Bhavcopy):

Step 1: Download daily Bhavcopy for today.
Step 2: Filter for all stocks in the target sector (e.g., Nifty Bank constituents:
        HDFC Bank, ICICI Bank, Kotak Bank, Axis Bank, SBI, Bank of Baroda, etc.)
Step 3: Calculate AVERAGE delivery % for all sector stocks combined.
Step 4: Compare to the sector's own 20-day average delivery.

Interpretation:
→ Sector-level delivery 20%+ above its average = Institutional buying at SECTOR level.
   This confirms the sector is in Wyckoff Phase D / accumulation at the macro level.
   Individual stocks within this sector: Highest priority for long entries.

→ Sector-level delivery 20%+ BELOW its average = Institutional SELLING at sector level.
   Distribution at sector level. Individual stocks: Avoid longs.

NSE BHAVCOPY SECTOR SCREEN (practical):
Sort by sector code → Filter Nifty Bank stocks → Calculate average delivery %.
Bank sector average delivery (normal): 38%.
Today: 62% average for all bank stocks.
Reading: 24% above normal. Institutional buying at SECTOR LEVEL confirmed.
This matches FII DII Scenario 1 or 2 (both or FII buying). Cross-verify with FII data.
```

### The Delivery Scoring System (Institutional Scorecard Integration)

```
Add delivery % evidence as scored points to your institutional confirmation scorecard:

BULLISH DELIVERY EVIDENCE:

□ +3 points: SOS day delivery % > 65% AND volume > 2× average
             (Single strongest delivery signal possible — institutional surge)

□ +2 points: LPS day delivery % < 30% AND volume < 0.8× average
             (No Supply confirmation via delivery — LPS validated)

□ +2 points: 5-day delivery trend RISING on UP-days
             (Accumulation accelerating)

□ +1 point:  Spring day delivery % < 25%
             (Low supply on dip = valid Spring confirmation)

□ +1 point:  Secondary Test delivery < SC day delivery
             (Supply exhausting across tests)

□ +1 point:  Sector-level delivery 20%+ above sector average
             (Institutional sector-wide accumulation)

Maximum delivery bullish score: 10 points

BEARISH DELIVERY EVIDENCE:

□ +3 points: BC/UTAD day delivery % < 25% despite high volume and rising price
             (Distribution into retail enthusiasm — top signal)

□ +2 points: LPSY day delivery % > 50% on a declining-price session
             (Supply present on the bounce — distribution confirmed)

□ +2 points: 5-day delivery trend DECLINING on UP-days
             (Distribution accelerating in markup)

□ +1 point:  Markup session with delivery % < 20% consistently
             (Retail-only markup — no institutional support)

□ +1 point:  Sector delivery 20%+ BELOW sector average
             (Institutional sector exit)

Maximum delivery bearish score: 9 points

Combined with the FII/DII scorecard (Chapter: FII DII Analysis):
Total institutional scorecard = Delivery score + FII/DII score + Order Flow score
→ Higher combined score = Higher conviction = Larger position size
```

---

## EXERCISES

### Beginner Exercises

**Exercise 1 — Delivery % Calculation**

Calculate delivery % and classify each scenario:

| Stock | Shares Traded | Shares Delivered | Delivery % | Quadrant |
|-------|--------------|-----------------|-----------|---------|
| A | 45,00,000 | 31,50,000 | ? | ? |
| B | 12,00,000 | 2,40,000 | ? | ? |
| C | 8,00,000 | 5,60,000 | ? | ? |
| D | 62,00,000 | 9,30,000 | ? | ? |
| E | 18,00,000 | 13,50,000 | ? | ? |

For each: Calculate delivery %. Identify the quadrant (Quiet Accumulation / Institutional Surge / Market Inactivity / Distribution). State what Wyckoff event this delivery profile is consistent with.

**Exercise 2 — Bhavcopy Reading**

You download NSE Bhavcopy for today. After filtering for your watchlist (6 stocks), you see:

| Stock | Volume vs 20d avg | Delivery % | 20d avg Delivery % |
|-------|------------------|-----------|-------------------|
| HDFC Bank | 2.4× | 74% | 42% |
| TCS | 0.6× | 68% | 55% |
| Infosys | 1.8× | 19% | 48% |
| Maruti | 0.5× | 28% | 44% |
| ONGC | 2.1× | 31% | 38% |
| SBI | 1.9× | 71% | 40% |

a) Which stocks show a bullish institutional signal today?
b) Which show a bearish signal?
c) Which show market inactivity?
d) For HDFC Bank and SBI (both institutional surge): Which Wyckoff event is this consistent with?
e) For Infosys (high volume, low delivery): What is the market doing in Infosys today?

**Exercise 3 — Delivery % Sequence Reading**

You have 5 days of delivery data for a stock you are tracking for a Wyckoff LPS setup:

| Day | Price Change | Volume vs avg | Delivery % | Reading |
|-----|-------------|--------------|-----------|---------|
| Mon | +2.8% | 3.1× | 76% | SOS? |
| Tue | −0.8% | 0.9× | 24% | LPS test? |
| Wed | −0.6% | 0.7× | 19% | LPS test? |
| Thu | +0.3% | 0.5× | 22% | Consolidation? |
| Fri | −0.4% | 0.6× | 21% | LPS entry? |

a) Confirm the Monday SOS using delivery data.
b) Confirm the LPS formation using delivery data across Tue–Fri.
c) What is the delivery-based signal that the LPS is valid and the stock is ready for markup?
d) What would invalidate the LPS setup from a delivery perspective?
e) Which day has the ideal LPS entry and why?

---

### Intermediate Exercises

**Exercise 4 — Spring Validation Using Delivery %**

You are watching a stock in Wyckoff Phase B. The SC low is ₹342. Today, price dips to ₹338 (below SC low) and recovers to close at ₹347.

**Scenario A:** Today's delivery % = 72%. Volume = 2.4× average.
**Scenario B:** Today's delivery % = 16%. Volume = 1.2× average.
**Scenario C:** Today's delivery % = 43%. Volume = 0.9× average.

For each scenario:
a) Is this a valid Spring? Explain using the delivery % rule.
b) What is the Wyckoff and delivery-based interpretation?
c) What action does each scenario require?
d) If Scenario B: The stock rises 5% the next day on 2.8× volume and 71% delivery. What event is this and how does the sequence (low delivery Spring → high delivery SOS) confirm the setup?

**Exercise 5 — 5-Day Delivery Trend Analysis**

Track these two stocks over 5 days of their markup phase:

**Stock A (Suspicious Markup):**
Day 1: +1.8%, Volume 1.2×, Delivery 58%
Day 2: +2.1%, Volume 1.6×, Delivery 44%
Day 3: +1.4%, Volume 1.8×, Delivery 31%
Day 4: +0.9%, Volume 2.1×, Delivery 22%
Day 5: +1.2%, Volume 2.4×, Delivery 17%

**Stock B (Healthy Markup):**
Day 1: +1.8%, Volume 1.3×, Delivery 51%
Day 2: +2.0%, Volume 1.5×, Delivery 58%
Day 3: +1.6%, Volume 1.2×, Delivery 62%
Day 4: +0.8%, Volume 0.9×, Delivery 48%  (LPS day)
Day 5: +2.2%, Volume 1.8×, Delivery 69%

a) Describe the delivery trend for Stock A. What does it signal?
b) Describe the delivery trend for Stock B. What does it signal?
c) For Stock A: Which Wyckoff event might Day 5 be the beginning of?
d) For Stock B: Which day is the LPS and which is the continuation SOS?
e) If you hold both stocks: What action does Stock A's delivery trend require vs Stock B?

**Exercise 6 — Sector Delivery Screen**

You download Bhavcopy and calculate average delivery % for Nifty Bank stocks:

| Bank Stock | Today's Delivery % | 20d avg Delivery % | Deviation |
|-----------|-------------------|--------------------|-----------|
| HDFC Bank | 71% | 43% | +28% |
| ICICI Bank | 68% | 40% | +28% |
| Kotak Bank | 74% | 45% | +29% |
| Axis Bank | 65% | 38% | +27% |
| SBI | 63% | 42% | +21% |
| Bank of Baroda | 72% | 44% | +28% |

Sector average today: 69%. Sector 20d average: 42%. Deviation: +27%.

Simultaneously: Nifty Bank daily chart shows an SOS bar today (wide spread, high volume, closes above 3-week high). FII 20-day cumulative: +₹18,400 Crore (strongly positive). RBI cut rates 2 weeks ago.

a) What does the sector-level delivery analysis (+27% above average across ALL bank stocks) confirm?
b) How does this sector delivery data align with the FII flow data and RBI catalyst?
c) Which individual bank stock is the strongest entry candidate? (Apply the institutional surge criteria)
d) Calculate an illustrative institutional delivery scorecard for the strongest candidate.
e) What is the trade action? Entry, stop, T1 rationale.

---

### Advanced Exercise

**Exercise 7 — Full Delivery-Based Trade Validation**

You are analyzing a mid-cap NSE stock (not Nifty 50) over 4 weeks. Here is the complete delivery % history:

**Week 1 (SC forming):**
Mon: −3.2%, Vol 4.1×, Delivery 82% → Big sell day
Tue: −1.8%, Vol 2.2×, Delivery 68%
Wed: −0.4%, Vol 1.1×, Delivery 41% (AR begins)
Thu: +2.1%, Vol 1.6×, Delivery 52% (AR)
Fri: +1.8%, Vol 1.2×, Delivery 48% (AR continues)

**Week 2 (Secondary Testing — Phase B):**
Mon: −1.2%, Vol 0.8×, Delivery 38%
Wed: −0.8%, Vol 0.7×, Delivery 31%
Fri: −0.6%, Vol 0.6×, Delivery 24%

**Week 3 (Spring + SOS):**
Mon: −0.9%, Vol 0.8×, Delivery 17% ← Brief dip toward SC low
Tue: +3.4%, Vol 3.2×, Delivery 76% ← Surge
Wed: +1.8%, Vol 1.4×, Delivery 38%
Thu: −0.6%, Vol 0.7×, Delivery 22% (LPS beginning)
Fri: −0.4%, Vol 0.6×, Delivery 18%

**Week 4 (LPS + Entry):**
Mon: −0.3%, Vol 0.5×, Delivery 16%
Tue: +0.2%, Vol 0.4×, Delivery 21%
Wed: −0.2%, Vol 0.4×, Delivery 19%
Thu: +0.8%, Vol 0.8×, Delivery 28%

For each question, use ONLY the delivery % data (no price chart reference needed):

a) Identify the SC, AR, Secondary Test sequence, Spring, SOS, and LPS from the delivery data alone.
b) Confirm the Spring using the delivery rule. What made Week 3 Monday a valid Spring?
c) Confirm the SOS using the delivery rule. What made Week 3 Tuesday a valid SOS?
d) Assess the LPS quality across Week 3 Thursday → Week 4 Wednesday. Is supply absent?
e) Which day in Week 4 is the ideal entry day? Justify using delivery data only.
f) Calculate the delivery bullish scorecard (out of 10 points) for this trade at entry.
g) What delivery % signal would tell you the trade thesis is FAILING after entry?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** Define Delivery Percentage. What is the formula? What is the difference between delivered shares and intraday shares on NSE?

**Q2.** Name three ways to access Delivery % data on NSE. Which is the professional tool for analysing multiple stocks simultaneously, and why?

**Q3.** Describe all four quadrants of the Delivery % Matrix. For each, state the Wyckoff phase it is most consistent with and the appropriate trading action.

**Q4.** What is the expected Delivery % on a valid Spring day? What does HIGH delivery (> 50%) on a "Spring" bar tell you, and what does it change about your analysis?

**Q5.** How does the Delivery % on a Selling Climax (SC) day differ from the Delivery % on the Secondary Test (ST) day? What does this difference reveal about supply dynamics?

**Q6.** What is the difference between a SOS (Sign of Strength) and a Buying Climax (BC) using Delivery % as the distinguishing tool?

**Q7.** Describe the "5-day delivery trend" analysis. What does a DECLINING delivery % trend on consecutive UP-days signal in a markup phase?

**Q8.** Why is it important to compare a stock's delivery % to its OWN recent average rather than to a market-wide absolute number? Give an example showing why this matters.

**Q9.** How does sector-level delivery % analysis (averaging delivery across all stocks in a sector) add information beyond individual stock delivery?

**Q10.** Describe the delivery % scoring system. What delivery event scores the maximum 3 points (bullish), and why?

### Chart Questions (5)

**S1.** A stock closes down 4.8% on 3.6× average volume. Delivery % = 79%.
a) Which quadrant does this fall in?
b) Is this a bearish signal or a bullish signal — and why does it seem paradoxical?
c) In Wyckoff terms: What event does this profile suggest?
d) What do you watch for in the NEXT session to confirm?

**S2.** You see three "spring-like" dips below SC low over 6 weeks:

Spring 1: Delivery % = 64%. Volume = 1.1×.
Spring 2: Delivery % = 28%. Volume = 0.9×.
Spring 3: Delivery % = 17%. Volume = 0.7×.

a) Which Spring is valid?
b) What likely happened after Spring 1?
c) What does the progression (64% → 28% → 17%) tell you about the stock's supply over these 6 weeks?
d) After Spring 3: What delivery % would you expect on the subsequent SOS day?

**S3.** A stock has risen 18% over 3 weeks (markup). Daily delivery % for the last 5 days:

Day 1 up: Delivery 62%. Day 2 up: 54%. Day 3 up: 43%. Day 4 up: 31%. Day 5 up: 18%.

a) Describe the delivery trend.
b) What does declining delivery on consecutive up-days signal?
c) Which Wyckoff event is forming?
d) What action does this require for an existing long position?

**S4.** You screen NSE Bhavcopy today and find:
- 8 stocks show Delivery > 65% AND Volume > 2× average (Institutional Surge quadrant)
- All 8 are in the Nifty Bank and Nifty Auto sectors
- Nifty 50 daily chart: LPS forming after SOS last week

a) What does the sector concentration of the institutional surge tell you?
b) How does this align with the Nifty LPS formation?
c) Which two stocks from the 8 would you prioritise for the LPS entry? What additional data would you check?
d) Construct the institutional scorecard (delivery portion only) for your chosen stock.

**S5.** Complete delivery analysis for a Nifty 50 stock showing these sessions:

| Session | Price | Volume vs avg | Delivery % | Event |
|---------|-------|--------------|-----------|-------|
| T-20 | −3.8% | 4.2× | 84% | ? |
| T-15 | +2.1% | 1.8× | 55% | ? |
| T-10 | −0.9% | 0.7× | 34% | ? |
| T-8 | −0.7% | 0.6× | 27% | ? |
| T-6 | −0.5% | 0.5× | 21% | ? |
| T-4 | −1.2% | 0.8× | 18% | Spring? |
| T-3 | +3.6% | 3.4× | 78% | ? |
| T-2 | −0.8% | 0.7× | 24% | ? |
| T-1 | −0.4% | 0.5× | 20% | LPS? |
| T | +0.3% | 0.4× | 19% | Entry? |

a) Identify each event using ONLY the Delivery % and Volume data.
b) Confirm the Spring at T-4 using the delivery rule.
c) Confirm the SOS at T-3.
d) Confirm the LPS at T-1 and T (entry day).
e) What is the delivery bullish scorecard (out of 10) for this trade?

---

## QUIZ ANSWERS

**A1.** Delivery % = (Shares Delivered / Total Shares Traded) × 100. Delivered shares: Shares where ownership actually transferred from seller's demat to buyer's demat. Represent genuine buying intent — someone wanted to hold the stock. These are settled shares. T+1 settlement on NSE. Intraday shares: Bought and sold on the same day. No ownership transfer. Represent speculation — day traders, scalpers making price bets with no intent to hold. When intraday traders close their position, shares return to the seller's account with no net delivery. Delivery % is the proportion that was genuinely transferred — the institutional participation indicator.

**A2.** Three access methods: (1) NSE website daily: nseindia.com → Market Data → Securities Deliverable. For individual stocks. Updated after close. (2) NSE Bhavcopy (PROFESSIONAL TOOL): nseindia.com → Archives → Market Data → Equity → Bhavcopy. CSV file covering ALL NSE stocks in one download. Contains symbol, OHLCV, delivery qty, delivery %. Sort and filter across entire market in seconds. Historical data available for 3 years. (3) Screening tools: Screener.in, Trendlyne, Chartink — filter by delivery % thresholds in real-time. The Bhavcopy is the professional tool because: One download covers all 2,000+ stocks. Can be sorted/filtered in Excel by delivery %. Can be cross-referenced with watchlist in seconds. Saves 30 minutes of individual stock lookups daily.

**A3.** Four quadrants: (1) High Delivery + High Volume (INSTITUTIONAL SURGE): Large genuine institutional buying/selling. Wyckoff: SOS (if up-bar), SC or SOW (if down-bar). Action: Highest conviction signal (+2 scorecard). (2) High Delivery + Low Volume (QUIET ACCUMULATION): Stealth institutional accumulation. Wyckoff: Phase B or early Phase C. Action: Add to watchlist. Not tradeable yet. (3) Low Delivery + Low Volume (MARKET INACTIVITY): Neither supply nor demand present. Wyckoff: Mid-Phase B. Action: No trade. Wait for institutional re-entry. (4) Low Delivery + High Volume (DISTRIBUTION/SPECULATION): Intraday churning or institutional selling into retail. Wyckoff: BC, UTAD, SOW. Action: Bearish signal. Tighten stops on longs.

**A4.** Valid Spring delivery %: < 30% (ideally < 20%). Mechanism: The Spring is a brief dip below the SC low caused by stop-loss triggers and intraday shorts — NOT genuine supply. Most participants buying the dip are intraday — they don't deliver shares. Hence very low delivery. HIGH delivery (> 50%) on a "Spring": Means GENUINE sellers are present at these prices. Real supply is entering. This is NOT a Spring — it is a genuine breakdown. The SC low will be violated. More selling is coming. The high delivery invalidates the Spring thesis. You should NOT enter long and should wait for the real SC to form at a lower price level.

**A5.** SC delivery vs ST delivery: SC day: Should be at or near the MAXIMUM delivery % of the current episode (70–90%). High delivery = genuine institutional selling. Real supply entering the market in force. ST day: Should be LOWER than SC delivery (30–50%). The declining delivery from SC to ST demonstrates: Fewer sellers are willing to deliver shares at the SC price level. Supply is EXHAUSTING. Each test has less and less supply at the lows. This supply exhaustion across SC → ST is the delivery-based confirmation of Wyckoff accumulation. If ST delivery is EQUAL to or HIGHER than SC delivery: Supply has not exhausted. This is not a valid ST — more selling waves are likely. The SC low will probably be violated.

**A6.** SOS vs BC via delivery: SOS (Sign of Strength): High volume (2×+) AND HIGH delivery (65–85%). Institutions are BUYING — they want ownership. Volume is genuine demand converting to delivered shares. BC (Buying Climax): High volume (2×+) AND LOW delivery (15–30%) despite a rising price bar. Institutions are SELLING into retail enthusiasm. The high volume is retail speculation buying. The low delivery reveals: Almost no one is taking actual delivery — it's all intraday day trading. The sellers (institutions) are delivering shares OUT of their demat into short-term speculative buyers who will sell the next day. The key identifier: On an SOS, ask "Who is buying?" — Institutions (high delivery). On a BC, ask "Who is buying?" — Day traders and FOMO retail (low delivery). Same price pattern, opposite institutional footprint.

**A7.** 5-day delivery trend: Track delivery % on each trading day for 5 consecutive sessions. Declining delivery trend on consecutive UP-days (e.g., 62% → 54% → 43% → 31% → 18% on five consecutive up-sessions): Price is rising but FEWER people are taking delivery each day. Those pushing price up are increasingly short-term (intraday) — institutions are EXITING into the retail enthusiasm. This is the delivery fingerprint of DISTRIBUTION in the markup phase. The institution bought at low prices (high delivery in accumulation). Now as price rises and retail buys, the institution SELLS — reducing their delivery each session as they exit more. When delivery drops to 15–20% on up-days: Distribution is nearly complete. A Buying Climax / UTAD is imminent.

**A8.** Own-average comparison: A non-F&O small-cap stock may have average delivery of 68% on a normal day (because no way to short intraday without F&O). Today's delivery = 72%. This is NOT a significant signal — only 4% above average. An F&O large-cap (HDFC Bank) may have average delivery of 38%. Today's delivery = 72%. This IS a massive signal — 34% above average. Using absolute numbers: Would misidentify the small-cap as significant (72% looks high) and potentially miss the HDFC Bank signal if comparing to wrong baseline. Own-average approach: Correctly identifies HDFC Bank at +34% above its normal as the institutional surge, while noting the small-cap at +4% is unremarkable. The deviation from OWN average is the signal, not the absolute number.

**A9.** Sector-level delivery analysis: Individual stock: A single stock showing high delivery could be company-specific (merger rumour, index inclusion). Sector-level: If ALL 12 bank stocks simultaneously show delivery 25%+ above their respective averages: This cannot be a stock-specific event. It is a SECTOR-WIDE institutional decision — FII is allocating to banking specifically. This identifies Sector RS turning (from Chapter: Sector Analysis) before the RS ratio itself visually turns. It also confirms that individual stock LPS setups within this sector are backed by sector-level institutional flows — dramatically higher conviction than isolated stock setups.

**A10.** Maximum 3-point delivery event (bullish): "SOS day delivery % > 65% AND volume > 2× average" (Institutional Surge). Reason for maximum score: This is the strongest possible confirmation of institutional buying intent. The combination of (1) very high volume (many shares changing hands — urgency and scale) + (2) very high delivery (almost all of those shares going into demat accounts — genuine ownership intent) at (3) the Wyckoff SOS bar (breakout above AR, wide spread, closes near high) leaves no analytical ambiguity. Institutions are buying aggressively with the intent to hold. This is the fingerprint of the CO completing accumulation and triggering Phase D markup. No other single data point provides as much conviction about institutional bullish intent.

---

## KEY TAKEAWAYS

> **1. Delivery % = (Shares Delivered / Total Traded) × 100. High delivery = genuine ownership transfer (institutional intent). Low delivery = intraday speculation (no ownership intent). The same price bar means completely different things depending on delivery %.**

> **2. The 4-quadrant matrix: Institutional Surge (high delivery + high volume) = strongest signal. Quiet Accumulation (high delivery + low volume) = stealth buying. Market Inactivity (low + low) = no trade. Distribution (low delivery + high volume) = bearish despite rising price.**

> **3. The most critical delivery rule: Spring delivery % must be < 30%. High delivery on a "spring" dip = real selling = NOT a spring. This single rule prevents the most common and most costly Wyckoff entry error.**

> **4. SOS vs BC distinction via delivery: SOS = high volume + HIGH delivery (institutions buying). BC = high volume + LOW delivery (institutions selling into retail). Same chart pattern, opposite institutional reality. Delivery is the only way to tell them apart.**

> **5. Use NSE Bhavcopy daily. One download, 30 seconds, covers all 2,000+ stocks. Sort by delivery % to find the institutional activity in the market every day — this is one of the highest-value 5-minute habits in professional NSE trading.**

---

*Delivery Analysis — Complete.*

*Next topic in the plan: **Block Bulk Deals** (Part X, Topic 3).*

*Ready? Say: **"NEXT CHAPTER"***
