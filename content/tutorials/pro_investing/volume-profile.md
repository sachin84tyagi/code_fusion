# Chapter 15 — Volume Profile

> **Course:** NSE/BSE Professional Volume + Price Action + VSA + Wyckoff + Market Microstructure
> **Part:** VII — Volume Profile
> **Prerequisite:** Chapters 8–9 (Understanding Volume, Price-Volume), Chapter 5 (Liquidity)

---

## Chapter Overview

Traditional volume analysis (Chapters 8–9) answers: **How much was traded in this session?** Volume Profile answers a fundamentally different question: **At which specific price did the most trading occur?**

This distinction is everything. Knowing that 10 crore shares traded today tells you about participation. Knowing that 6 crore of those 10 crore traded specifically at ₹480–₹482 tells you where the market's **centre of gravity** is. That ₹480–₹482 zone is where buyers and sellers found the most agreement — it is the most "fair" price in the sample period. Markets return to fair price. Markets reject unfair price. Volume Profile maps this landscape.

At the institutional level, Volume Profile is used alongside VSA and Wyckoff to answer three questions:
1. **Where is value?** (HVN — High Volume Nodes)
2. **Where will price transit quickly?** (LVN — Low Volume Nodes)
3. **Is the market in balance (range) or imbalance (trend)?** (Profile shape)

**The Chapter 15 Rule:**

> **Volume Profile is a map of ACCEPTANCE and REJECTION. High Volume Nodes (HVNs) are where the market accepted price and built positions. Low Volume Nodes (LVNs) are where the market rejected price and moved through rapidly. Entries near HVNs offer confluence with institutional positioning. Targets beyond LVNs move quickly.**

---

## LEVEL 1 — BEGINNER

### 15.1 What Is Volume Profile?

**Traditional volume** is displayed as vertical bars at the bottom of the chart — each bar shows the total volume for a given time period (session, hour, etc.). This tells you WHEN participants were active.

**Volume Profile** rotates this perspective 90 degrees — it displays volume horizontally, showing HOW MUCH volume traded at each specific PRICE LEVEL, regardless of time.

```
Traditional volume:   "On Monday, 12 crore shares traded"
Volume Profile:       "3 crore traded at ₹480, 4 crore at ₹481, 3 crore at ₹482,
                       1.5 crore at ₹483, 0.3 crore at ₹484, ..."

The profile reveals: The most activity was at ₹480–₹482. This is "fair value."
                     At ₹484, very little traded — the market rejected that price.
```

**The Market Auction Theory foundation:**

Volume Profile is grounded in Market Auction Theory:
- Markets are continuous auctions between buyers and sellers
- The purpose of the auction is to find "fair price" — where both buyers and sellers can transact
- When price is "fair," high volume trades — buyers and sellers agree
- When price is "unfair" (too high or too low), one side withdraws — low volume, price moves quickly
- **Volume is the measure of agreement. HVN = maximum agreement. LVN = maximum disagreement.**

---

### 15.2 The Five Core Volume Profile Components

![Volume Profile Anatomy — POC, Value Area, HVN and LVN](/images/pi-volume-profile-anatomy.jpg)

**Component 1: Point of Control (POC)**

```
Definition: The single price level with the HIGHEST volume traded in the
            measurement period.

Significance:
→ The "fairest" price in the period — maximum buyer-seller agreement
→ Strong support during uptrends (institutions position here)
→ Strong resistance during downtrends
→ "Magnet" effect: Price tends to return to the POC after deviating
→ If the market opens away from the POC, the first move is often BACK TO POC

NSE POC application:
→ If Nifty's session POC was ₹24,250 and next day opens at ₹24,450:
   First trade plan = short back to ₹24,250 (POC magnet, 200 points target)
   Or: long if price holds above POC (fair value accepted above prior POC)

Calculation: Sort all price levels by volume descending → highest = POC
```

**Component 2: Value Area (VA)**

```
Definition: The range of prices containing 70% of the total volume
            for the measurement period.

Boundaries:
→ Value Area High (VAH): Upper boundary — 70% of volume is BELOW this
→ Value Area Low (VAL): Lower boundary — 70% of volume is ABOVE this

The "70% rule" comes from normal distribution statistics — in a balanced
market, 70% of volume (approximately one standard deviation) clusters
around fair price.

Significance:
→ VA represents "accepted value" — where the majority of participants
   were comfortable transacting
→ Price inside the VA: Market is in BALANCE — no directional urgency
→ Price outside the VA: Market in IMBALANCE — price is "rejected" by
   one side, creating directional urgency to return to or escape the VA

NSE application — The Value Area Rule:
Rule 1: If price OPENS outside the previous session's VA and STAYS outside
        for the first 60 minutes → expect continuation AWAY from the VA
        (the market is rejecting the prior session's value)

Rule 2: If price OPENS outside the previous session's VA and returns INSIDE
        within the first 60 minutes → expect price to traverse to the opposite
        side of the VA (fade the opening gap, target the opposite VA boundary)
```

**Component 3: High Volume Node (HVN)**

```
Definition: A price zone with SIGNIFICANTLY more volume than surrounding
            levels — visible as a "bulge" or "thick" zone in the profile.

Significance:
→ Area of PRICE ACCEPTANCE — market spent extended time here
→ Institutional positions were built at HVNs
→ Strong support and resistance zones (institutional memory)
→ "Magnet" effect: Price is attracted to HVNs from both directions
→ When price approaches an HVN from either side, it tends to slow,
   consolidate, or reverse at the HVN

Why HVNs are strong support/resistance:
"The institutions who built positions at this price level have a rational
reason to defend that price: they are not underwater until price moves
through the HVN. So when price returns to the HVN, those holders BUY
MORE (if the HVN is support) or SELL (if the HVN is resistance)."

NSE HVN identification:
→ Use Visible Range Volume Profile or Fixed Range profile
→ HVN = any price zone with volume > 2× the average volume per price level
→ Multiple overlapping profiles (from different time periods) at the same
   price = STRUCTURAL HVN (very strong)
```

**Component 4: Low Volume Node (LVN)**

```
Definition: A price zone with SIGNIFICANTLY less volume than surrounding
            levels — visible as a "thin" or "narrow" zone between two HVNs.

Significance:
→ Area of PRICE REJECTION — the market transited through this zone rapidly
→ Weak support and resistance (no institutional positioning here)
→ "Vacuum" effect: Price moves RAPIDLY through LVNs (nothing to slow it)
→ LVNs between two HVNs = "air pockets" — if price enters the LVN, it
   will likely move quickly to the next HVN

NSE LVN application — Target identification:
"If Nifty is at an HVN and breaks below an LVN — the next target is
the HVN BELOW the LVN. The LVN is just transit, not a stopping point."

LVN trade rule:
→ Enter at HVN (where price slows — best entry precision)
→ Target the HVN on the other side of the LVN
→ The LVN transit will be FAST — don't set targets IN the LVN
```

**Component 5: Naked POC (nPOC)**

```
Definition: A POC from a prior session/period that has NOT been revisited
            by price in subsequent sessions.

Significance:
→ The "magnet" effect of the POC remains intact until price revisits it
→ Naked POCs act as strong targets and reversal levels
→ The older the nPOC, the stronger the magnet (more unfulfilled contracts
   from that session are still held by participants)

NSE nPOC tracking:
→ Mark all nPOCs from prior 5 sessions each morning
→ When price approaches an nPOC, REDUCE SPEED: expect either a bounce
   or a fill (price visits and moves on)
→ nPOC in an uptrend = support; nPOC in a downtrend = resistance
```

---

### 15.3 The Four Types of Volume Profile

**Type 1: Session Volume Profile**

```
Period: A single trading session (9:15 AM – 3:30 PM for NSE)
Use: Identifies the intraday fairest price and value zones
Shows: Today's POC, VAH, VAL vs yesterday's
Application: Intraday trading — fade opens outside VA, trade within VA,
             or trade breakouts from VA on high volume
```

**Type 2: Visible Range Volume Profile (VRVP)**

```
Period: The visible range of the chart on screen
Use: Shows the volume profile for the exact bars visible on the chart
Shows: Composite POC, VA, HVNs, LVNs for the visible period
Application: Swing trading — identify major HVNs and LVNs on the daily chart
             that will act as key levels for the next 5–20 sessions
```

**Type 3: Fixed Range Volume Profile**

```
Period: User-defined (e.g., last 50 sessions, last quarter, prior year)
Use: Shows the volume profile for a specific important time window
Shows: The most important POC and value levels for that window
Application: Institutional-level analysis — identify major annual/quarterly
             POC levels that represent multi-month fair value
```

**Type 4: Composite Volume Profile**

```
Period: Multiple overlapping time periods combined
Use: Builds a picture of "structural" HVNs that have been reinforced
     by volume from MULTIPLE time periods
Application: The strongest support and resistance levels in the market —
             where multiple profiles agree on high volume at the same price
```

---

### 15.4 Profile Shapes and Market Context

![Volume Profile Shapes — Reading Market Context from Profile Structure](/images/pi-volume-profile-shapes.jpg)

The SHAPE of the volume profile reveals the market's CHARACTER — whether it was balanced or directional, accepted or rejected.

**Shape 1 — D-Shape (Normal Distribution / Balanced)**

```
Appearance: Bell curve — wide in the middle, tapering at top and bottom
Character: BALANCED market — price found fair value and rotated around it
            Most volume at the center (where agreement was highest)
            Thin tails at the extremes (brief visits to unfair prices)
Context: Range day, consolidation, inside day
Trading implication:
→ POC in the center = fair value is the center of the range
→ Expect price to return to POC from extremes
→ Fade moves to the extremes (short VAH tests, long VAL tests)
→ The tails reveal: price briefly visited those extremes and REJECTED them
```

**Shape 2 — P-Shape (Long Tail Down / Short Covering)**

```
Appearance: Fat body at TOP, thin long tail extending DOWN
Character: Price opened low, found REJECTION there (thin tail = moved through fast),
            then rallied and ACCEPTED higher prices (fat body at top)
Context: Short covering day, demand overwhelmed early supply
Trading implication:
→ The thin tail below = area of rejection → DO NOT short back into the tail
→ The fat top = accepted value → expect consolidation here
→ Next session: If price holds above the tail/body junction = BULLISH
→ If price falls back into the thin tail = buyer conviction is weak
```

**Shape 3 — b-Shape (Long Tail Up / Long Liquidation)**

```
Appearance: Fat body at BOTTOM, thin long tail extending UP
Character: Price opened high, found REJECTION there (thin tail),
            then declined and ACCEPTED lower prices (fat body at bottom)
Context: Long liquidation, supply overwhelmed early demand
Trading implication:
→ The thin tail above = area of rejection → DO NOT buy into the tail
→ The fat bottom = accepted value → expect consolidation at bottom
→ Next session: If price holds below the tail/body junction = BEARISH
→ If price rallies back into the thin tail = seller conviction is weak
```

**Shape 4 — Double Distribution (Bimodal / Trend Day)**

```
Appearance: Two separate fat clusters separated by a thin LVN zone
Character: The market SHIFTED value — it accepted value at one level,
            then moved rapidly (through the LVN) and accepted value at
            a DIFFERENT (higher or lower) level
Context: Strong trend day with clear value area migration
Trading implication:
→ The LVN between the two distributions = the "boundary" of the shift
→ If price holds ABOVE the LVN (in the upper distribution) = BULLISH
   continuation expected
→ If price falls BACK BELOW the LVN into the lower distribution = the
   value shift has FAILED — reversal possible
→ The LVN becomes the key level for the subsequent session
```

**Shape 5 — Thin Profile (Impulse / Single Print)**

```
Appearance: Very narrow profile with similar low volume across all prices
Character: Price moved rapidly in ONE direction — no time for volume to build
            anywhere. All prices were "in transit," none were "accepted"
Context: Impulse move, gap fill, news-driven move
Trading implication:
→ A thin profile REQUIRES resolution — price cannot stay at all levels equally
→ It will either: (a) EXTEND further in the same direction,
                  OR (b) REVERSE sharply back to the origin
→ A thin profile ABOVE prior value with no follow-through = likely reversal
→ A thin profile with strong FOLLOW-THROUGH next session = extension
→ NSE: Thin profiles on F&O expiry or news days may be unreliable
```

---

## LEVEL 2 — INTERMEDIATE

### 15.5 HVN and LVN as Dynamic Support and Resistance

Traditional support and resistance (Chapter 7) identifies price LEVELS based on prior swing highs and lows. Volume Profile provides a fundamentally different kind of support/resistance based on VOLUME CONCENTRATION:

**HVN as Support (in uptrend):**

```
Why HVNs become support:
1. Participants who bought at the HVN have a cost basis there
2. As long as price is above their cost, they hold (not a seller)
3. When price RETURNS to the HVN (their cost basis), they buy more
   (they know this was previously accepted as fair — they're comfortable adding)
4. New buyers who missed the initial move also see the HVN as an entry
5. The combined effect: buying pressure at the HVN = support

NSE HVN support example:
Stock had a major consolidation range at ₹500–₹550 (HVN built here)
Stock then runs to ₹650
First significant pullback: Likely to find support at ₹500–₹550 (the HVN)
Entry: Long near ₹510 (bottom of HVN)
Stop: Below ₹490 (below the HVN — if price exits the HVN, holders are underwater)
Target: Return to ₹650 (prior high) or next HVN above
```

**LVN as a Transit Zone (the vacuum effect):**

```
Why LVNs are "vacuums":
1. No institutional positions built here (low volume = nobody positioned)
2. No natural buyers or sellers defending a price in this zone
3. Price moves through rapidly — just as it did the first time it visited
4. NSE example: Stock at ₹550 HVN. Below is an LVN from ₹500–₹520.
   Below that LVN is another HVN at ₹450–₹480.
   
   If price breaks below ₹500 (exits the HVN), it will transit the
   LVN at ₹500–₹520 RAPIDLY and land at the ₹450–₹480 HVN.
   This transit happens FAST — it looks like a "free fall" period.
   
Trade application:
→ If you are LONG and price breaks below an HVN:
   Exit immediately — price will transit the LVN rapidly and find
   support only at the NEXT HVN. Staying in through the LVN means
   riding a fast, painful drop.
→ If you are SHORTING and price breaks below an HVN:
   Target the NEXT HVN — that's where the short trade ends, not the LVN.
```

**POC Migration — Tracking Value Migration:**

```
When the POC RISES over multiple sessions = value is being accepted at
higher prices = bullish (buyers are dominant even at increasingly higher "fair" prices)

When the POC FALLS over multiple sessions = value is being accepted at
lower prices = bearish (sellers pushing "fair" value progressively lower)

When the POC STAYS FLAT for multiple sessions = value is stable = range-bound

NSE POC migration tracking:
Week 1 POC: ₹1,200
Week 2 POC: ₹1,215
Week 3 POC: ₹1,228
Week 4 POC: ₹1,245

Rising POC = "fair value" rising = institutional buyers are active
= Wyckoff accumulation transitioning to markup

Falling POC = "fair value" falling = institutional sellers are active
= Wyckoff distribution transitioning to markdown
```

---

### 15.6 The Value Area Rule — NSE Opening Gap Trading

One of the most practical applications of Volume Profile is the Value Area Rule for opening gap analysis on NSE:

**Context:** NSE opens at 9:15 AM. Nifty's opening print immediately establishes where price is relative to the prior session's Value Area.

**Rule 1 — Gap Open INSIDE prior VA:**

```
Scenario: Prior day's VA = 24,100–24,400 (VAL to VAH)
Today's open: ₹24,250 (inside the VA)
Interpretation: Market opened at "fair value" — no strong directional urgency
Initial play: Range trade within the VA until volume pattern shows direction
Trade: No immediate directional bias. Wait for 60-minute volume accumulation
       to reveal which side is dominant.
```

**Rule 2 — Gap Open ABOVE prior VA (Gap Above VAH):**

```
Scenario: Prior day's VAH = 24,400
Today's open: ₹24,600 (above VAH = above prior accepted value)

Sub-rule 2A — STAYS ABOVE VAH for 60 minutes:
→ Buyers are ACCEPTING this new (higher) value
→ Continuation play: Long, targeting prior ATH / next HVN above
→ If price returns below VAH = the acceptance was false; exit

Sub-rule 2B — RETURNS BELOW VAH within 60 minutes:
→ The higher prices were REJECTED
→ Fade play: The gap fills — long from VAH as first support target
→ Price will likely traverse to the other side of the VA (toward VAL)
→ Ultimate target: VAL (prior day's low of the value area)
```

**Rule 3 — Gap Open BELOW prior VA (Gap Below VAL):**

```
Scenario: Prior day's VAL = 24,100
Today's open: ₹23,900 (below VAL = below prior accepted value)

Sub-rule 3A — STAYS BELOW VAL for 60 minutes:
→ Sellers are accepting this new (lower) value
→ Continuation play: Short, targeting next HVN below
→ If price returns above VAL = acceptance was false; cover shorts

Sub-rule 3B — RETURNS ABOVE VAL within 60 minutes:
→ The lower prices were REJECTED
→ Fade play: Short the gap fill — the price will traverse toward VAH
→ Target: VAH (prior day's high of the value area)
```

**NSE morning routine for Value Area Rule:**

```
Every morning before 9:15 AM:
1. Note prior session's VAH, VAL, and POC
2. Note any nPOCs from prior 3–5 sessions
3. Watch the opening 15 minutes for gap direction
4. At 9:30 AM: Is price inside, above, or below prior VA?
5. At 9:45 AM: Has price tested VAH/VAL and held/reversed?
6. Apply Rule 1, 2A, 2B, 3A, or 3B based on the evidence
7. Set initial target at POC, then opposite VA boundary
```

---

### 15.7 Volume Profile and Wyckoff Integration

Volume Profile and Wyckoff analysis are complementary at different scales:

**Wyckoff identifies the PHASE → Volume Profile identifies the KEY LEVELS within that phase:**

```
ACCUMULATION (Wyckoff Phase A-E):
→ Volume Profile shows: A major HVN forming at the SC low (maximum volume at the bottom)
→ The accumulation range itself = a growing HVN block
→ SC level: The VAL of the accumulation period's profile
→ AR high: The VAH of the accumulation period's profile
→ POC of the accumulation period: The "fair value" during accumulation
   (likely mid-range) — where the CO was most actively positioned

MARKUP (Wyckoff Phase E):
→ Volume Profile shows: POC migrating upward session by session
→ Each re-accumulation = new HVN forming at higher price level
→ LPS pullbacks: Price returning to HVN support before continuing up

DISTRIBUTION:
→ Volume Profile shows: A major HVN forming at the BC high (maximum volume at the top)
→ The distribution range = a growing HVN block at the top
→ BC high: The VAH of the distribution period's profile
→ AR low: The VAL of the distribution period's profile

MARKDOWN:
→ Volume Profile shows: POC migrating downward session by session
→ Each re-distribution = new HVN at lower level
→ LPSY bounces: Price returning to HVN resistance before continuing down
```

**The combined entry framework:**

```
Step 1 (Wyckoff): Identify the Phase and the key Wyckoff event
                  (e.g., LPS in accumulation Phase D)

Step 2 (Volume Profile): Confirm the LPS is occurring at an HVN
                          (the accumulation period's composite profile
                          should show an HVN exactly at the LPS level)

Step 3 (VSA): Confirm the LPS bar's four variables
              (low volume, narrow spread, upper close, holds above Creek)

Step 4 (Volume Profile): Identify the next LVN above the LPS
                          (the transit zone for the first markup leg)

Step 5 (Volume Profile): Identify the next HVN above the LVN
                          (the stopping point / first target)

Entry: At the LPS (HVN) → Stop: Below LPS (below HVN) → Target: Next HVN
The LVN between them is not a target — it's just transit.
```

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### 15.8 TPO (Time Price Opportunity) — Market Profile

The original "Volume Profile" was actually called **Market Profile**, developed by J. Peter Steidlmayer for the Chicago Board of Trade (CBOT) in the 1980s. It used **TPO (Time Price Opportunity) letters** rather than volume bars.

**TPO concept:**

```
The trading session is divided into 30-minute periods, labeled with letters:
A (9:15–9:45), B (9:45–10:15), C (10:15–10:45), etc.

For each 30-minute period, every price level that traded is marked with
the letter for that period.

The result: Each price level shows WHICH periods traded there (TPO count)
TPO count = number of periods that visited each price level

High TPO count = many periods visited this price = ACCEPTANCE
Low TPO count (single prints) = few periods visited = REJECTION / TRANSIT
```

**Market Profile vs Volume Profile:**

| Feature | Market Profile (TPO) | Volume Profile |
|---------|---------------------|----------------|
| Horizontal axis | TPO count (time periods) | Volume (contracts/shares) |
| What it measures | TIME spent at each price | VOLUME traded at each price |
| Better for | Intraday bracket structure | Institutional position levels |
| Complexity | Higher (requires understanding TPO letters) | Lower |
| Availability | Requires Market Profile software | Available in TradingView, Zerodha |
| NSE suitability | Excellent for Nifty futures intraday | Excellent for both intraday and positional |

**For NSE daily/swing traders:** Volume Profile is more accessible and equally powerful. TPO is favoured by intraday futures traders.

**Single Print Lines:**

```
In Market Profile, a "single print" = only ONE period visited a price level
(e.g., only the 10:15–10:45 period traded at ₹24,350 before price moved away)

Single prints = LVN equivalent — areas where price transited rapidly
Single print lines are strong "repair" targets — price often returns to
fill these single-print gaps in subsequent sessions

NSE: When Nifty's Market Profile shows single prints above or below the
     day's value area → these are the first targets for the NEXT session
     if price approaches from the opposite direction
```

---

### 15.9 Volume Profile at Multiple Timeframes — NSE Application

**The three-timeframe Volume Profile hierarchy:**

```
Monthly/Quarterly Volume Profile (Positional traders):
→ Use a Fixed Range profile for the past quarter (65 sessions)
→ Identifies MAJOR HVNs — multi-month support/resistance levels
→ These levels often coincide with Wyckoff accumulation/distribution zones
→ Application: Where to add size on LPS pullbacks;
               where major Wyckoff cause-effect targets land

Weekly Volume Profile (Swing traders — 3-20 day holds):
→ Visible Range profile for the past 4–8 weeks (20–40 sessions)
→ Identifies intermediate HVNs and LVNs
→ Application: Where to enter swing trades (HVN support in uptrend);
               where to target (next HVN above the LVN)

Daily/Intraday Volume Profile (Day traders — intraday):
→ Session profile for the current and prior 2–3 sessions
→ Identifies intraday POC, VA, profile shape
→ Application: Opening gap rules (Rule 1/2A/2B/3A/3B);
               POC magnet for intraday trades
```

**NSE-specific Volume Profile considerations:**

```
1. Pre-open session (9:00–9:15 AM):
   NSE's pre-open order matching affects the opening price significantly.
   The pre-open call auction volume does NOT appear in the continuous session
   profile. Be aware the 9:15 opening price may gap significantly from the
   pre-open equilibrium.

2. F&O expiry sessions:
   Volume is heavily distorted by rollover/expiry activity.
   Volume Profile on F&O expiry days shows artificially large HVNs at
   strike prices (especially round numbers like 24,000, 24,500, 25,000)
   due to options delta hedging and pin risk. Reduce weight of these HVNs.

3. Delivery vs Total volume:
   For positional Volume Profile (weekly, monthly):
   Use delivery volume (or assume ~45-50% of NSE volume is delivery).
   Pure Volume Profile includes all volume including intraday — slightly
   overstates the HVN strength for positional analysis.

4. Circuit breakers and bulk deals:
   Large bulk deals (> 0.5% of outstanding shares) create artificial HVNs
   at specific prices. Mark these separately — they may not repeat.
   (A promoter selling 2% of a company in a block deal creates an HVN
   that reflects one transaction, not institutional consensus pricing)
```

---

### 15.10 The Balance/Imbalance Cycle

Markets alternate between **balance** (D-shaped profiles, price accepted) and **imbalance** (thin profiles, directional moves). Understanding this cycle is the deepest application of Volume Profile.

```
BALANCE → IMBALANCE → BALANCE (cycle):

Phase 1 — BALANCE (Value Area established):
→ D-shaped profiles over multiple sessions
→ POC stable (flat migration)
→ Price oscillating within the Value Area
→ This is the Wyckoff Range phase (Accumulation or Distribution)

Phase 2 — IMBALANCE TRIGGER (Value Area broken):
→ Price exits the Value Area on high volume (SOS or SOW)
→ Thin profile forms — price transiting rapidly
→ The Value Area's VAH becomes new support (SOS) or VAL becomes resistance (SOW)
→ This is the Wyckoff Phase D event

Phase 3 — NEW BALANCE (New Value Area):
→ D-shaped profile forms at the new price level (higher or lower)
→ New HVN builds at the new accepted price level
→ POC migrates to the new fair value
→ This is Wyckoff's Re-Accumulation (higher) or Re-Distribution (lower)

Phase 4 — REPEAT:
→ New balance area builds → another imbalance trigger → new balance at next level

Reading this cycle:
→ WITHIN balance: Fade moves to VA extremes (range trading)
→ ON imbalance: Trade in the direction of the break (trend trading)
→ AT new balance: Wait for profile to build before re-entering
→ The LVN between the old and new VA = the "no-man's land" that should not be traded
```

---

## EXERCISES

### Beginner Exercises

**Exercise 15.1 — Component Identification**

For each scenario, identify which Volume Profile component is being described:

a) "The price level where the most trades occurred in yesterday's session — 4.2 crore shares out of 11 crore total."
b) "A zone between ₹480–₹495 where only 0.3 crore total traded — price moved through in 12 minutes."
c) "The top boundary of the zone containing 70% of the session's volume."
d) "A prior week's highest-volume price level that has not been revisited in 8 sessions."
e) "A zone between ₹520–₹545 with 5.8 crore out of 11 crore — the widest part of the profile."
f) "A price cluster with volume consistently 3–4× the average per price level."

**Exercise 15.2 — Profile Shape Classification**

Classify each session's profile shape and state the trading implication:

| Session | Open | High | Low | Close | Volume distribution |
|---------|------|------|-----|-------|---------------------|
| A | ₹500 | ₹510 | ₹490 | ₹501 | 85% of volume between ₹497–₹503 |
| B | ₹480 | ₹520 | ₹478 | ₹518 | 30% at ₹478–₹485, 65% at ₹510–₹520 |
| C | ₹550 | ₹552 | ₹498 | ₹500 | 70% of volume between ₹498–₹508 |
| D | ₹300 | ₹350 | ₹298 | ₹348 | Volume evenly distributed across entire range |
| E | ₹620 | ₹625 | ₹585 | ₹590 | 15% at ₹618–₹625, 75% at ₹585–₹598 |

**Exercise 15.3 — Value Area Rule Application**

Prior session data: VAL = ₹24,100, VAH = ₹24,400, POC = ₹24,250

State the trading implication for each opening scenario:

a) Nifty opens at ₹24,200, stays between ₹24,150–₹24,280 for first 45 minutes
b) Nifty opens at ₹24,600, stays above ₹24,450 for first 60 minutes
c) Nifty opens at ₹24,600, falls to ₹24,380 within 30 minutes
d) Nifty opens at ₹23,900, stays below ₹24,050 for first 60 minutes
e) Nifty opens at ₹23,900, rises to ₹24,120 within 40 minutes

For each: Rule number, trade direction, entry, target (first and second), stop.

---

### Intermediate Exercises

**Exercise 15.4 — HVN/LVN Support and Resistance**

A Nifty 50 stock's Visible Range Volume Profile (past 60 sessions) shows:

| Price Zone | Volume (crore shares) | Classification |
|-----------|----------------------|----------------|
| ₹800–₹820 | 18.2 | ? |
| ₹820–₹840 | 3.1 | ? |
| ₹840–₹860 | 4.8 | ? |
| ₹860–₹920 | 32.4 | ? |
| ₹920–₹940 | 1.9 | ? |
| ₹940–₹980 | 28.6 | ? |
| ₹980–₹1000 | 2.3 | ? |
| ₹1000–₹1040 | 22.1 | ? |

Average volume per ₹20 zone: ~9.2 crore shares (based on range average)

a) Classify each zone (HVN, LVN, or Neutral — use 2× and 0.5× thresholds)
b) Current price: ₹935. What is the most likely SHORT-TERM target if price falls?
c) If price falls to ₹862 and holds: What VSA confirmation would you need to enter long?
d) If price is at ₹940 and breaks below: What will the price action look like through the LVN?
e) What are the two strongest support levels and two strongest resistance levels?

**Exercise 15.5 — Volume Profile + Wyckoff Integration**

A stock has completed a Wyckoff accumulation. The Fixed Range Volume Profile for the 14-week accumulation period shows:

- SC zone (₹280–₹295): Volume 45 crore — MAJOR HVN
- AR zone (₹340–₹360): Volume 32 crore — Large HVN
- Mid-range (₹310–₹330): Volume 28 crore — HVN (the accumulation POC)
- Above AR (₹360–₹380): Volume 3.2 crore — LVN
- Above LVN (₹380–₹420): Volume 18 crore — HVN (prior distribution from 3 months ago)

SOS has occurred. Price is at ₹358 (at the AR zone HVN).

a) Where is the LPS most likely to form? (Use Volume Profile logic)
b) What will the transit through the LVN look like? (Speed, volume expected)
c) What is the first target after the LVN? (Use Volume Profile)
d) Where will price likely slow/consolidate before the final markup to the Cause-Effect target?
e) Design the complete trade with entry, stop, T1, T2 using BOTH Wyckoff AND Volume Profile logic.

**Exercise 15.6 — POC Migration Analysis**

Track the POC migration for this 10-session sequence and interpret:

| Session | POC | VAH | VAL | Session profile shape |
|---------|-----|-----|-----|----------------------|
| 1 | ₹1,200 | ₹1,240 | ₹1,165 | D-shape |
| 2 | ₹1,215 | ₹1,255 | ₹1,180 | D-shape |
| 3 | ₹1,228 | ₹1,268 | ₹1,192 | D-shape |
| 4 | ₹1,218 | ₹1,265 | ₹1,185 | D-shape |
| 5 | ₹1,245 | ₹1,280 | ₹1,210 | P-shape |
| 6 | ₹1,262 | ₹1,295 | ₹1,230 | D-shape |
| 7 | ₹1,275 | ₹1,320 | ₹1,245 | Double Distribution |
| 8 | ₹1,242 | ₹1,285 | ₹1,215 | D-shape |
| 9 | ₹1,260 | ₹1,298 | ₹1,228 | D-shape |
| 10 | ₹1,278 | ₹1,318 | ₹1,248 | D-shape |

a) What is the POC migration telling you about the trend?
b) What did the Session 4 pullback in POC indicate?
c) What did the P-shape on Session 5 indicate?
d) What did the Double Distribution on Session 7 indicate?
e) Where would you expect price to find support on the next pullback?

---

### Advanced Exercises

**Exercise 15.7 — Complete Trade Design Using Volume Profile**

Using this Volume Profile structure for Nifty:

Quarterly profile (past 65 sessions):
- Major HVN: 23,800–24,200 (largest — 38% of quarter's volume)
- LVN: 24,200–24,400 (thin — 4% of quarter's volume)
- HVN: 24,400–24,800 (second — 28% of quarter's volume)
- LVN: 24,800–25,000 (thin)
- HVN: 25,000–25,400 (emerging — 18% of quarter's volume)

Current price: 24,380 (inside the LVN between major HVNs)
Session profile: Thin, price drifting with equal low volume at all levels

a) Where is the "correct" place for Nifty to be? (Balance zone)
b) What are the two "resolution" scenarios for the thin LVN profile?
c) Design the long trade (assuming resolution upward): entry, stop, T1, T2
d) Design the short trade (assuming resolution downward): entry, stop, T1, T2
e) What Volume Profile confirmation would you require before taking EITHER trade?

**Exercise 15.8 — NSE Opening Gap with Volume Profile**

Nifty futures data:

Prior session: VAL = 24,050, POC = 24,220, VAH = 24,380, Session shape = D-shape

Today at 9:15 AM: Nifty opens at 24,520 (140 points above VAH).

At 9:30 AM: Nifty is trading at 24,490. Session is showing a thin profile above VAH.

At 9:45 AM: Nifty begins to show ROTATION — prices between 24,400–24,520 start accumulating volume. Profile shape beginning to develop into a small D-shape cluster.

At 10:15 AM: Nifty at 24,455. Session POC has developed at 24,470. Session VAL has formed at 24,410.

a) At 9:15 AM: Apply Value Area Rule. Which rule? Initial bias?
b) At 9:30 AM: What does the thin profile above VAH tell you?
c) At 9:45 AM: What does the D-shape cluster forming above VAH tell you?
d) At 10:15 AM: Apply the combined analysis. Is the gap "accepting" or "rejecting"?
e) Design the intraday trade based on the 10:15 AM reading.
f) If Nifty drops below 24,380 (prior VAH) at 11:00 AM: How does the analysis change?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** What is the fundamental difference between traditional (vertical) volume and Volume Profile? What specific question does each answer?

**Q2.** Define the Point of Control (POC). Why does the POC have a "magnet" effect on price, and how does this magnet effect differ in uptrends vs downtrends?

**Q3.** Define the Value Area. What is the "70% rule" and where does this statistical basis come from?

**Q4.** Explain why High Volume Nodes (HVNs) act as strong support and resistance. What is the ECONOMIC reason (not just the statistical one) that participants defend HVN prices?

**Q5.** Explain the Low Volume Node "vacuum effect." Why does price transit through LVNs rapidly, and how should this inform both entry and target selection?

**Q6.** Describe the five Volume Profile shapes (D, P, b, Double Distribution, Thin) and the market condition each reveals.

**Q7.** Explain the Value Area Rule for opening gaps on NSE. What are the two possible outcomes when price opens ABOVE the prior VAH, and what are the trading implications of each?

**Q8.** What is a Naked POC (nPOC)? Why does its "magnet" effect persist until price visits it, and how does age (older vs newer) affect the strength of the magnet?

**Q9.** How do Volume Profile and Wyckoff analysis complement each other? Give a specific example of how the LPS in Wyckoff should be confirmed by Volume Profile.

**Q10.** Describe the balance-imbalance cycle in Volume Profile terms. How does this cycle align with the Wyckoff four-phase market cycle?

---

### Chart Scenario Questions (5)

**S1.** The prior session's Volume Profile for Nifty shows:
- VAH: 24,600, POC: 24,350, VAL: 24,100
- Profile shape: P-shape (fat body in upper half, thin tail from 24,000–24,100)

Today's opening: Nifty opens at 24,050 (below the thin tail area).

a) What does the P-shape from yesterday tell you?
b) What does today's open below the thin tail mean?
c) Which Value Area Rule applies?
d) What are the two trade scenarios and their respective triggers?
e) Design the trade for the higher-probability scenario.

**S2.** A Nifty 50 stock has these key Volume Profile levels from its past year:

HVN zones: ₹800–₹850 (major, 45 crore), ₹950–₹1,000 (secondary, 28 crore)
LVN zones: ₹850–₹950 (thin, 4.2 crore)
nPOC: ₹920 (from 3 sessions ago — not yet revisited)

Current price: ₹870 (inside the LVN). Today's session is a thin profile (10:00 AM).

a) Is ₹870 a "fair" or "unfair" price for this stock?
b) What are the two resolution scenarios from the LVN?
c) Where is the nPOC and what role will it play?
d) Which scenario has higher probability, given it's currently a thin profile?
e) Design both the long and short resolution trades.

**S3.** Using POC migration analysis, interpret this 5-week sequence for a Nifty 500 mid-cap:

Week 1: POC ₹500, Profile D-shape
Week 2: POC ₹498, Profile b-shape
Week 3: POC ₹492, Profile D-shape
Week 4: POC ₹488, Profile b-shape
Week 5: POC ₹475, Profile Thin (downward)

a) What is the POC migration telling you?
b) What did the b-shapes in Weeks 2 and 4 indicate?
c) What does the thin profile in Week 5 mean?
d) What trade does this create? Entry, stop, target.
e) What volume profile event would signal the decline is ending?

**S4.** You are using Volume Profile + Wyckoff to analyse a potential LPS entry:

Wyckoff: Stock completed SC, AR, ST, Spring, Test, SOS. Now in LPS pullback.
Volume Profile: Accumulation period's composite profile shows:
- SC zone (₹380–₹400): HVN — 28 crore
- Mid-range (₹430–₹450): HVN (POC) — 22 crore
- AR High zone (₹480–₹500): HVN — 18 crore
- Above AR High (₹500–₹530): LVN — 2.1 crore
- Prior HVN (₹530–₹560): HVN — 15 crore (from 6 months ago)

LPS is forming at ₹485 (inside the AR High HVN).

Using BOTH frameworks:
a) Why is ₹485 (inside the AR High HVN) the ideal entry?
b) Where is the stop? (Use both Wyckoff and Volume Profile logic)
c) What will price action look like through the LVN at ₹500–₹530?
d) Where is T1 and T2? (Use Volume Profile)
e) At T1 (₹530 HVN), what Volume Profile event would confirm the move to T2?

**S5.** NSE scenario — F&O expiry distortion:

It's the last Thursday of the month. Nifty's Volume Profile shows:
- Enormous HVN at exactly ₹24,500 (options strike) — 4× normal volume
- Normal HVN at ₹24,200–₹24,300 from the past 3 weeks

Session profile is currently a thin profile between ₹24,400–₹24,600.

a) Is the HVN at ₹24,500 a reliable Volume Profile level? Why or why not?
b) What is "pin risk" and how does it affect price action near ₹24,500 on expiry day?
c) Which Volume Profile level is more reliable for NEXT week's analysis?
d) How do you adjust your approach on F&O expiry days?
e) What is your opening gap plan for the FOLLOWING Monday (the day after expiry)?

---

## QUIZ ANSWERS

### Conceptual Answers

**A1.** Traditional volume: Answers "HOW MUCH traded in this TIME PERIOD?" — a vertical bar at each session showing total participation. Tells you when participants were active and at what intensity (used in VSA for supply-demand identification). Volume Profile: Answers "HOW MUCH traded at each specific PRICE?" — a horizontal display showing volume distribution across price levels. Tells you WHERE the market found agreement (HVN) and WHERE it rejected price (LVN). The key distinction: Traditional volume aggregates all prices in a period; Volume Profile disaggregates by price level. The same total volume can create a D-shape (balanced) or a thin profile (imbalanced) — traditional volume cannot reveal this.

**A2.** POC = the price level with the highest volume in the measurement period. The "fairest" price — where maximum buyer-seller agreement occurred. Magnet effect mechanism: Participants who transacted at the POC have that as their cost basis. When price deviates AWAY from the POC, those participants are sitting on open profits (if price moved in their favour) and may want to take profit AT the POC area. New participants see the POC as "fair" and initiate trades there. Combined effect: Both groups create activity (either profit-taking or new entries) when price returns to the POC. In uptrends: POC is BELOW current price → acts as support (participants defending their cost basis). In downtrends: POC is ABOVE current price → acts as resistance (participants wanting to exit at cost basis).

**A3.** Value Area: The range of prices containing exactly 70% of the total volume for the measurement period, bounded by VAH (Value Area High) and VAL (Value Area Low). The 70% rule comes from normal distribution statistics: In a perfectly normal distribution, approximately 68.2% of data falls within one standard deviation of the mean — rounded to 70% for practical use. The implication: When volume is normally distributed around the POC, the VA contains one standard deviation of that distribution — the "typical" range. Price inside the VA = typical, accepted, balanced. Price outside the VA = atypical, rejected, imbalanced — the market is trying to return to its normal distribution.

**A4.** Economic reason HVNs are strong S/R: Participants who transacted within the HVN have a COST BASIS at those prices. They are NOT sellers (in an uptrend) until price is BELOW their cost. When price RETURNS to the HVN: (1) Existing holders add to positions (they know this price was previously accepted as "fair" — comfortable adding at fair value). (2) New participants see the HVN as a historically validated "fair" zone — they're comfortable initiating positions. (3) Participants who missed the original move see the return as a second chance at the same "fair" price. All three groups create buying pressure at the HVN simultaneously, making it a strong support. The statistical reason: High volume = high information density at this price = both sides were comfortable. Returning to a price where "information" was confirmed = natural behavior.

**A5.** LVN vacuum effect: Low volume = few participants built positions here. When price re-enters an LVN: (a) No natural BUYERS (nobody is defending a position built here because nobody built one). (b) No natural SELLERS (nobody is taking profit on a position built here). (c) The only participants in the LVN are directional traders passing through it. Result: Price moves RAPIDLY through the LVN — nothing slows it. Entry implication: Do NOT enter positions IN an LVN — the rapid transit means poor precision (price may be 1–2% away within seconds). Target implication: Do NOT set targets IN an LVN — price will pass through without pausing. Set targets at the NEXT HVN, where the transit stops.

**A6.** Five shapes: (1) D-shape: Bell curve, balanced market, maximum volume at center. No directional bias — range trade. (2) P-shape: Fat body at top, thin tail below. Bullish — lower prices rejected, accepted value is higher. Fade moves below the fat body. (3) b-shape: Fat body at bottom, thin tail above. Bearish — higher prices rejected, accepted value is lower. Fade moves above the fat body. (4) Double Distribution: Two fat clusters separated by thin LVN. Trend day — value migrated (shifted) from one level to another. The LVN between them is the key level: if it holds as support/resistance, the value shift is confirmed. (5) Thin Profile: Narrow, low volume everywhere. Impulse move — price transited without being accepted. Will resolve: either extend in the same direction OR reverse sharply.

**A7.** Value Area Rule for opens above prior VAH: (1) If price STAYS above VAH for first 60 minutes: Buyers are accepting new (higher) value. Continuation long. Target: Prior ATH or next HVN above. Stop: If price falls below VAH. (2) If price RETURNS BELOW VAH within 60 minutes: Higher prices were rejected. Fade the gap: price will traverse toward the OPPOSITE side of the VA. First target = prior session's POC. Second target = prior session's VAL. Trade: The opening gap fill is the trade — from the return to VAH level, short toward the VAL.

**A8.** Naked POC (nPOC): A POC from a prior session that has NOT been revisited (price has moved away and not returned). Its "magnet" effect persists because: The participants who transacted at that POC STILL HOLD their positions (they haven't had the opportunity to exit at their cost basis since price hasn't returned). Until those participants exit (which they do when price returns to the POC), their orders remain as psychological anchors. Older nPOC is STRONGER because: More participants from that session are still holding unresolved positions. More time has passed = more "psychological debt" accumulated. The magnet strengthens with age until the nPOC is finally visited (the "debt is paid").

**A9.** Volume Profile complements Wyckoff by providing the exact price level (not just the event) where institutional activity concentrated. LPS example: Wyckoff identifies that the LPS is a pullback to the old resistance (Creek / AR High) on low volume. Volume Profile confirms: The AR High zone should be an HVN in the accumulation period's composite profile. If the LPS is forming exactly AT the HVN: (1) Wyckoff says: "Low volume pullback to Creek — LPS forming." (2) Volume Profile says: "This is the HVN — institutional participants built positions here and will defend this level." (3) Together: Maximum confidence that this level will hold. If the LPS is forming in an LVN instead of an HVN: The Wyckoff event is weaker — the pullback may continue to the actual HVN before stabilizing.

**A10.** Balance-Imbalance cycle in Volume Profile and Wyckoff: BALANCE (Volume Profile D-shape, multiple sessions) = Wyckoff Accumulation or Distribution range. Price accepted at multiple levels within the range. POC stable. Value Area defining the range boundaries. IMBALANCE (Volume Profile thin profile, single session) = Wyckoff SOS or SOW event. Price transiting rapidly through an LVN between two HVNs. Directional urgency. NEW BALANCE (New D-shape at new level) = Wyckoff Re-Accumulation or Re-Distribution. New HVN being built at the new accepted price level. POC migration stopping as new value is established. The cycle: Balance (range) → Imbalance (SOS/SOW breakout through LVN) → Balance (new range at HVN above/below the LVN) → Repeat.

---

## KEY TAKEAWAYS — CHAPTER 15

> **1. Volume Profile answers WHERE, not WHEN. The horizontal distribution of volume across price levels reveals HVNs (accepted value = strong S/R) and LVNs (rejected value = transit zones / vacuums).**

> **2. POC is the "fairest" price — the market magnet. Price deviating from POC tends to return. POC migration direction = the direction of value migration = the market's trend as voted by volume.**

> **3. The Value Area (70% of volume) defines "fair value." Price inside the VA = balanced market, range trade. Price outside the VA = imbalanced market, directional urgency.**

> **4. Profile shapes reveal market character: D = balance; P = bullish rejection; b = bearish rejection; Double Distribution = value migration (trend day); Thin = impulse requiring resolution.**

> **5. HVNs are economic barriers: participants who positioned there defend that price. Enter at HVNs (precision, institutional backing). Target HVNs on the other side of LVNs (stopping point, not the LVN itself).**

> **6. The Value Area Rule for NSE opening gaps: Open above VAH and stays → continuation long. Open above VAH and returns inside → gap fill to opposite VA boundary. Mirror applies below VAL.**

> **7. Volume Profile + Wyckoff integration: Wyckoff identifies the event (LPS, Spring, SOS); Volume Profile confirms the exact price level (HVN) where the event should occur. Confluence of both = highest confidence entries.**

---

*Chapter 15 Complete. Part VII — Volume Profile is complete.*

---

**Previous:** [← Chapter 14 — Distribution Schematic](./distribution-schematic.md)
**Next:** [Chapter 16 — VWAP →](./vwap.md)

*Part VIII — VWAP begins next.*

*When ready, say: **"NEXT CHAPTER"***
