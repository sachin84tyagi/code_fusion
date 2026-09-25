# Chapter 16 — VWAP

> **Course:** NSE/BSE Professional Volume + Price Action + VSA + Wyckoff + Market Microstructure
> **Part:** VIII — VWAP
> **Prerequisite:** Chapter 8 (Understanding Volume), Chapter 15 (Volume Profile), Chapter 5 (Market Microstructure)

---

## Chapter Overview

VWAP — Volume-Weighted Average Price — is the single most widely used intraday reference level by institutional traders globally. Every desk at every fund and every algorithmic execution system on NSE operates with VWAP awareness. Understanding VWAP is not optional for professional-level trading: it is the operating vocabulary of the institutional world.

Volume Profile (Chapter 15) answered: "Where did the most trading happen historically?" VWAP answers: "What is the current cumulative average price weighted by volume from this session's open?" Volume Profile is the historical map; VWAP is the live instrument panel.

The reason VWAP matters so profoundly is not the formula — it is the fact that institutions are **evaluated against it.** A fund manager's equity desk must justify every trade to their compliance team. "Did you execute above or below VWAP?" is the first question after every large trade. This creates a self-fulfilling VWAP gravity: institutional buyers cluster below VWAP (they must justify their execution); institutional sellers cluster above VWAP. Understanding this creates a structural edge for any trader who knows where VWAP is.

**The Chapter 16 Rule:**

> **VWAP is the institutional fairness benchmark. Large buyers execute below VWAP. Large sellers execute above VWAP. Price below VWAP in a bullish market = a gift. Price above VWAP in a bearish market = a trap. The Anchored VWAP is the most powerful longer-term application — anchoring to key Wyckoff events (SC, BC) reveals the average institutional cost of the entire trend.**

---

## LEVEL 1 — BEGINNER

### 16.1 What Is VWAP?

**The Formula:**

```
VWAP = Σ(Typical Price × Volume) / Σ(Volume)

Where:
Typical Price = (High + Low + Close) / 3  for each bar

Calculation (cumulative, updated every bar):
→ For each new bar: Add (Typical Price × Volume) to running sum
→ Add bar's Volume to running volume sum
→ VWAP = running price-volume sum / running volume sum

Example (5-minute bars):
Bar 1 (9:15–9:20): Typical = ₹1,200, Volume = 2 lakh
Bar 2 (9:20–9:25): Typical = ₹1,205, Volume = 1.5 lakh
Bar 3 (9:25–9:30): Typical = ₹1,198, Volume = 3.2 lakh

After Bar 3:
VWAP = (1200×2 + 1205×1.5 + 1198×3.2) / (2 + 1.5 + 3.2)
     = (2400 + 1807.5 + 3833.6) / 6.7
     = 8041.1 / 6.7
     = ₹1,200.16
```

**Key properties:**

```
1. VWAP is CUMULATIVE: It includes every bar from the session open.
   It cannot be recalculated backwards — only forward.

2. VWAP RESETS: Every session at 9:15 AM for NSE equity market.
   (Exception: Anchored VWAP does not reset — see Section 16.5)

3. VWAP is WEIGHTED: High-volume periods have more influence than
   low-volume periods. A huge volume spike at ₹1,250 will pull
   VWAP toward ₹1,250 even if price was at ₹1,200 for hours before.

4. VWAP LAGS: Because it is cumulative from the open, early
   morning high-volume activity has outsized influence on VWAP
   position for the rest of the day.

5. VWAP is NOT a moving average: It does not drop old data.
   It accumulates from the open, so it reflects the ENTIRE session's
   history of volume-weighted prices, not just the last N bars.
```

---

### 16.2 Why VWAP Matters — The Institutional Mechanics

![VWAP Anatomy — Price, VWAP Line, and Standard Deviation Bands](/images/pi-vwap-anatomy.jpg)

**The institutional VWAP benchmark:**

Large institutional orders (fund managers, mutual funds, insurance companies, FIIs) cannot be executed in a single block without massively moving the market against themselves. Instead, they execute over time using VWAP algorithms — which automatically spread a large order throughout the day, trying to achieve an execution price as close to VWAP as possible.

```
Institutional buy mandate example:
FII wants to buy ₹500 crore of Infosys
Market cap: ₹8 lakh crore, daily turnover: ₹800 crore

If bought in one block: Would move price up 5–10% against themselves
                         (₹500 crore into ₹800 crore daily flow)

Using VWAP algorithm: Spread over 6.25 hours (9:15 AM – 3:30 PM)
                       Buy ₹80 crore per hour = ₹1.3 crore per minute
                       Target: Execution below VWAP (benchmark)
                       Algorithm: Buys more when price is below VWAP,
                                  slows down when price is above VWAP

Result: The algorithm CREATES buying pressure below VWAP and
        reduces buying above VWAP → VWAP becomes a gravitational center
```

**The compliance requirement:**

Portfolio managers in India's mutual fund industry and FII desks are evaluated by compliance on:
- **Best Execution Policy**: Did the desk trade at a fair price?
- **VWAP benchmark**: Was execution price better or worse than VWAP?
- **Slippage**: How far did the desk deviate from VWAP?

This compliance pressure creates a mechanical force: **buyers must execute below VWAP, sellers must execute above VWAP.** The institutional world's self-imposed rule is your edge.

---

### 16.3 VWAP as Dynamic Support and Resistance

**In a bullish session:**

```
Price ABOVE VWAP:
→ All buyers who entered after the open are, on average, profitable
→ They hold their positions (not sellers at this point)
→ Sellers above VWAP face resistance: Only new sellers, not recycled longs
→ VWAP is SUPPORT: Every dip back to VWAP attracts institutional buyers
   (they need to execute below VWAP for their benchmark)

Price BELOW VWAP:
→ Average long holder is underwater (bought above VWAP on average)
→ They become SELLERS as soon as price returns to VWAP (exit at breakeven)
→ VWAP is RESISTANCE: Every rally to VWAP attracts sellers (those exiting)
```

**In a bearish session:**

```
Price BELOW VWAP:
→ Short sellers below VWAP are profitable
→ Sellers (bearish institutions) must execute ABOVE VWAP for their benchmark
→ Any rally toward VWAP is met with selling (institutional selling at benchmark)
→ VWAP is RESISTANCE

Price ABOVE VWAP in a bearish session:
→ Short sellers above VWAP are losing (covering pressure)
→ But if the session is genuinely bearish, rallies above VWAP are opportunities
   for fresh short entries at the institutional benchmark
```

**The practical VWAP support/resistance rule:**

```
In a BULLISH session (higher highs and higher lows above VWAP):
→ Buy pullbacks TO VWAP with tight stops below VWAP
→ Target: Prior session high, +1σ band, next structural resistance

In a BEARISH session (lower highs and lower lows below VWAP):
→ Short rallies TO VWAP with stops above VWAP
→ Target: Prior session low, -1σ band, next structural support

Determining session character (bullish or bearish):
→ First 60 minutes: Does price establish itself above or below VWAP?
→ Does the VWAP itself slope upward or downward?
→ Volume on up-bars vs down-bars in first 60 minutes (Chapter 9)
```

---

### 16.4 VWAP Standard Deviation Bands

Standard Deviation Bands around VWAP (also called VWAP Bands) are calculated similarly to Bollinger Bands, but using VWAP as the mean and volume-weighted standard deviations:

**Band levels and their interpretation:**

```
+2σ Band (Extremely overbought):
→ Price reaching this level is 2 standard deviations above VWAP
→ Statistically: ~5% of trading time occurs above +2σ in a normal session
→ Institutional significance: Any seller who has NOT sold yet will
   now sell aggressively — at this price they are far above their benchmark
→ Trade application: Fade +2σ touches on decreasing volume;
                      stop above +2σ; target VWAP pullback

+1σ Band (Moderately overbought):
→ First natural resistance zone above VWAP in a bullish session
→ On a trend day, price may consolidate at +1σ before the next leg
→ On a range day, fade the +1σ touch toward VWAP

VWAP Line (Neutral / Fair Value):
→ The intraday equilibrium
→ Every VWAP touch in a trending session = potential trade entry
   (long in bullish sessions, short in bearish sessions)
→ The most reliable intraday support or resistance level

-1σ Band (Moderately oversold):
→ First natural support zone below VWAP in a bearish session
→ In a bullish session: strong buy zone for institutional demand

-2σ Band (Extremely oversold):
→ Price is 2 standard deviations below VWAP
→ Statistically: ~5% of trading time in a normal session
→ Institutional significance: Any buyer who has NOT bought yet
   will now buy aggressively — at this price they are well below benchmark
→ Trade application: Fade -2σ touches on decreasing volume;
                      stop below -2σ; target VWAP recovery
```

**Band width interpretation:**

```
NARROW bands: Low volatility session — price is staying near VWAP
              → Range-bound day; fade extremes, small targets

WIDE bands: High volatility session — large moves away from VWAP
            → Trend day; do NOT fade band touches on a trending session;
              trade in the direction of the trend using VWAP as trailing support
```

---

## LEVEL 2 — INTERMEDIATE

### 16.5 Anchored VWAP (AVWAP) — The Most Powerful Application

![Anchored VWAP (AVWAP) — Institutional Reference Lines from Key Events](/images/pi-anchored-vwap.jpg)

The standard VWAP resets every session. The **Anchored VWAP (AVWAP)** does NOT reset — it is anchored to a user-defined starting point (a key event or date) and cumulates from that point forward across multiple sessions.

**The AVWAP formula:**

```
AVWAP from Event X =
Σ(Typical Price × Volume for all bars from Event X to current)
/ Σ(Volume for all bars from Event X to current)

This gives the AVERAGE PRICE of all trades since Event X, weighted by volume.
```

**What the AVWAP represents:**

> If you anchor the VWAP to the day of the Selling Climax (SC), the AVWAP from SC shows the **average cost of all market participants who transacted from that day forward.** If price is ABOVE this AVWAP, the average participant since the SC is profitable — they hold. If price FALLS BELOW this AVWAP, the average participant since the SC is underwater — they become sellers.

**The five most important AVWAP anchor points:**

**Anchor 1: The Selling Climax (SC) Low**

```
What it represents: Average cost of everyone who participated in the
                    accumulation and subsequent markup from the SC forward.

Interpretation:
→ Price ABOVE AVWAP from SC: Bull trend intact — average participant profitable
→ Price BELOW AVWAP from SC: Bull trend compromised — average participant losing money
→ The AVWAP from SC = the most important long-term support in an uptrend

NSE application:
→ After identifying a Wyckoff SC, anchor AVWAP to that date
→ Track the AVWAP line through the markup
→ Every LPS pullback in markup should ideally HOLD ABOVE the AVWAP from SC
→ If any LPS closes BELOW the AVWAP from SC: Strong warning — markup may be ending
```

**Anchor 2: The Buying Climax (BC) High**

```
What it represents: Average cost of everyone who participated in the
                    distribution and subsequent markdown from the BC forward.

Interpretation:
→ Price BELOW AVWAP from BC: Bear trend intact — average post-BC participant losing
→ Price ABOVE AVWAP from BC: Bear trend weakening — post-BC participant profitable
→ The AVWAP from BC = the most important long-term resistance in a downtrend

NSE application:
→ In a declining stock, anchor AVWAP to the BC date
→ The AVWAP from BC slopes downward as long as markdown continues
→ Any LPSY bounce should FAIL below the AVWAP from BC
→ If price closes ABOVE the AVWAP from BC for 2+ consecutive days:
   The markdown thesis is compromised — consider covering shorts
```

**Anchor 3: Major Gap Days (Earnings, Policy Announcements)**

```
What it represents: Average cost of participants since the major catalyst.

Interpretation:
→ Earnings gap up: AVWAP from earnings day = support for post-earnings holders
→ Budget/RBI announcement gap: AVWAP from that date = institutional benchmark
   for the policy-driven move

NSE use case: RBI rate cut → large gap up in bank stocks
→ Anchor AVWAP to the rate cut announcement date
→ Banks that hold ABOVE this AVWAP in the following weeks = institutionally supported
→ Banks that fall BELOW this AVWAP = the rate-cut thesis is being questioned by smart money
```

**Anchor 4: IPO Listing Day**

```
What it represents: Average cost of all post-IPO participants.

→ If price is ABOVE the AVWAP from listing: Institutional and retail holders
  since listing are profitable → holding structure intact, demand present
→ If price is BELOW the AVWAP from listing: Average post-IPO investor is
  underwater → potential forced selling, lock-up expiry selling pressure

NSE IPO application:
→ For new listings (SME IPO, mainboard IPO):
   Anchor AVWAP to the listing date
   Track AVWAP through the first 3–6 months
   AVWAP from listing rising = acceptance at higher prices (positive)
   AVWAP from listing falling = rejection, weak demand (negative)
```

**Anchor 5: 52-Week High / All-Time High**

```
What it represents: Average cost since the major high — institutional
                    average cost for bearish participants.

→ In a markdown, AVWAP from 52-week high = falling resistance line
→ Each LPSY bounce should fail BELOW this AVWAP
→ Price holding ABOVE the AVWAP from 52-week high = potential accumulation
```

---

### 16.6 The Three Primary VWAP Trading Strategies

**Strategy 1 — VWAP Pullback (Mean Reversion)**

```
Setup: Price has moved significantly above VWAP (+1σ or more)
       in a BULLISH session (majority of time above VWAP, higher highs)

Entry trigger: Price pulls back to VWAP AND shows a low-volume
               consolidation at VWAP (VSA No Supply bar on VWAP)

Confirmation: The VWAP line is sloping UPWARD (bullish session confirmed)
              Volume on the pullback is LOWER than the prior rally
              (VSA: effort reduced = pullback not genuine selling)

Entry: At or just below VWAP (allow for minor undershoot)
Stop: Below the prior swing low (structural stop, not just below VWAP)
Target 1: +1σ band (first natural resistance above VWAP)
Target 2: Day's high or +2σ band (if session is trending strongly)

Risk note: If session character changes to bearish (price stays below VWAP
           after the entry), exit immediately — do not hold a VWAP long
           in a bearish session.

NSE application:
→ Most applicable in the 10:00 AM – 1:30 PM window (mid-session)
→ Avoid within 30 minutes of close (session VWAP distortion)
→ Works best on liquid Nifty 50 stocks and Nifty/Bank Nifty futures
```

**Strategy 2 — VWAP Breakout (Momentum)**

```
Setup: Price has been oscillating at or near VWAP for 30–60 minutes
       (consolidation at VWAP — narrow VWAP band)
       Then: A high-volume bar decisively breaks ABOVE or BELOW VWAP

Entry trigger: The BREAKOUT BAR — wide range, close at the top 80% (for long)
               or bottom 20% (for short), volume 2–3× recent average

Confirmation: VSA SOS characteristics on the breakout bar
              Next 1–2 bars continue in the direction (follow-through)
              VWAP line begins to slope in the direction of the breakout

Entry: At the close of the breakout bar or the open of the next bar
Stop: Below the VWAP line (for longs) or above (for shorts)
Target 1: +1σ band (for long breakout), -1σ (for short breakout)
Target 2: Prior structural high/low or next Volume Profile HVN

Risk note: VWAP breakouts fail frequently — the confirmation requirement
           (2–3× volume + continuation bars) is NON-NEGOTIABLE.
           Without volume, the breakout is a trap.
```

**Strategy 3 — VWAP Band Fade (Extreme Reversion)**

```
Setup: Price extends to the +2σ or -2σ band on DECLINING volume
       (an extreme move without fresh commitment)

Entry trigger:
→ +2σ touch: First bar to close BELOW its intrabar high after touching +2σ
             Volume on this bar: lower than the bar that reached +2σ
→ -2σ touch: First bar to close ABOVE its intrabar low after touching -2σ
             Volume: lower than the bar that reached -2σ

Entry: Short at +2σ touch / Long at -2σ touch
Stop: 0.3% above the +2σ level (long) or below -2σ (short)
Target: VWAP line (the mean reversion target)

Critical warning: NEVER fade the band in a STRONG TREND day.
On a genuine trend day (double distribution profile forming), price
can ride the +1σ or even +2σ band for the entire session.
The fade only works on RANGE days with D-shaped or narrow profiles.

NSE daily pattern — Band fade works best:
→ After the 11:00 AM–12:00 PM period (mid-day slowdown)
→ When the Volume Profile is showing a D-shape (balanced session)
→ When Nifty is in a range session (not a trend day)
```

---

### 16.7 Multi-Session VWAP — Weekly VWAP

Standard VWAP resets daily. But some platforms offer a **Weekly VWAP** (cumulating Monday–Friday) which has important institutional significance:

```
Weekly VWAP formula: Same as daily VWAP but cumulates from Monday 9:15 AM
                     through Friday 3:30 PM without resetting

Significance:
→ Mutual funds and FIIs often measure performance WEEKLY
→ End-of-week benchmarking against the weekly VWAP creates gravitational pull
→ Thursday/Friday: If price is significantly below weekly VWAP,
   institutional buyers who must close the week favorably increase buying

NSE application:
→ Add weekly VWAP to the daily chart (or intraday chart)
→ Treat weekly VWAP as a secondary reference: ABOVE it = weekly bullish
→ At the end of Thursday (before F&O expiry Friday):
   Weekly VWAP level is a key reference for expiry positioning
→ Stocks significantly below weekly VWAP entering Thursday close:
   May attract institutional short covering to improve weekly benchmark

Monthly VWAP: Similarly cumulates for the entire month.
              Used by longer-term portfolio managers.
              Price above monthly VWAP = strong institutional demand for the month.
```

---

### 16.8 VWAP + Wyckoff Integration — The Professional Framework

VWAP and Wyckoff are fundamentally complementary:

**Wyckoff provides the CONTEXT; VWAP provides the PRECISION LEVEL.**

```
In Wyckoff ACCUMULATION (Phases A–E):
→ The accumulation range price oscillates around the session VWAP
→ VWAP in Phase B: The VWAP should trend slightly upward
   (each session's VWAP settling slightly higher = quiet institutional buying)
→ Spring event: Price will touch or pierce the -2σ band of the session VWAP
   then recover back to VWAP area (VSA Spring + VWAP -2σ fade = highest confirmation)
→ SOS event: VWAP line breaks to the upside; session closes above prior VWAP resistance
→ LPS: Price pullback to VWAP in the context of the upside breakout = the entry
        Specifically: LPS + VWAP pullback (price returns to VWAP after SOS)
        = HIGHEST CONFIDENCE ENTRY COMBINATION

AVWAP and Wyckoff:
→ Anchor AVWAP to the SC date
→ AVWAP from SC rises during markup
→ Each LPS in markup should hold ABOVE the AVWAP from SC
→ If an LPS closes below the AVWAP from SC → accumulation is under threat
```

**In Wyckoff DISTRIBUTION:**

```
→ AVWAP anchored to BC High is the key resistance level during markdown
→ Each LPSY bounce should fail BELOW the AVWAP from BC
→ If a LPSY bounce closes ABOVE the AVWAP from BC: Cover shorts
  (the distribution is being contested — possible re-accumulation)
→ The AVWAP from BC declining + LPSY + -1σ touch = triple-confirmation short

Intraday VWAP + daily Wyckoff:
→ If the daily chart shows Wyckoff Phase D (SOS confirmed, LPS forming):
  → Look for intraday VWAP pullbacks on the LPS day to enter long
  → The intraday VWAP acts as the precision entry within the LPS zone
  → Stop: Below the intraday VWAP (tight) or below the LPS low (wider)
```

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### 16.9 VWAP + Volume Profile Integration

The most complete institutional analysis combines VWAP with Volume Profile:

```
Conceptual alignment:
→ Volume Profile POC = the price where the MOST volume traded (historical)
→ VWAP = the current average price weighted by volume (cumulative, live)
→ When VWAP and POC are at the SAME PRICE: This is the highest-confidence
   "fair value" level — both the historical and current measures agree

Convergence = strong support/resistance:
Example: Daily Volume Profile POC = ₹24,250
         Current session VWAP = ₹24,248

→ ₹24,248–₹24,250 zone: Both institutional measures agree this is fair value
→ In an uptrend: This zone is very strong support (buy here with tight stop)
→ In a downtrend: This zone is very strong resistance (short here with tight stop)
```

**VWAP vs Volume Profile — when they disagree:**

```
VWAP above Volume Profile POC:
→ Current session's average trade price > historical fair value
→ The session is ACCEPTING higher prices than prior sessions
→ Bullish signal: Institutional money executing above prior consensus
→ In Wyckoff: Consistent with SOS and early markup phase

VWAP below Volume Profile POC:
→ Current session's average trade price < historical fair value
→ The session is ACCEPTING lower prices than prior sessions
→ Bearish signal: Institutional money executing below prior consensus
→ In Wyckoff: Consistent with SOW and early markdown phase
```

---

### 16.10 NSE-Specific VWAP Considerations

**1. Pre-Open Session (9:00–9:15 AM) Impact:**

```
NSE conducts a call auction pre-open session (9:00–9:15 AM).
The equilibrium price from the pre-open determines the opening price.

Pre-open VWAP consideration:
→ The standard VWAP begins accumulating from 9:15 AM
→ The pre-open price (which may gap significantly from prior close)
   is the FIRST data point in the VWAP calculation
→ If pre-open equilibrium = ₹24,500 and prior close = ₹24,200:
   The VWAP starts at ₹24,500 → the gap UP is "baked into" VWAP from bar 1
→ This means early VWAP on gap-up days is anchored at the opening gap price
   and takes time to "settle" as more volume accumulates

Practical implication:
→ On large gap days, the first 15–30 minutes of VWAP are unreliable
→ Wait until 9:30–9:45 AM (3–6 bars) for VWAP to stabilize before trading
   VWAP-based strategies
```

**2. Nifty Futures VWAP — The Professional's VWAP:**

```
For index trading, use Nifty Futures VWAP (not Nifty spot VWAP):
→ Nifty spot is calculated from 50 constituent stock prices
→ Nifty futures have actual traded volume — the VWAP reflects real trades
→ Nifty futures VWAP = the actual average trade price of participants
   who traded the futures contract today

Key levels to track:
→ Nifty Futures session VWAP
→ Bank Nifty Futures session VWAP (more volatile, wider bands)
→ Weekly AVWAP for the current contract (reset each Monday)
→ AVWAP from the prior expiry date (institutional post-expiry reference)
```

**3. F&O Expiry and VWAP Distortion:**

```
Thursday (monthly) and every Thursday (weekly):
→ Options expiry creates massive delta-hedging volume
→ This volume clusters at specific strike prices (especially ATM strikes)
→ Result: VWAP is pulled toward the dominant strike price (pin risk)
→ VWAP near ₹24,500 on expiry day? The ₹24,500 CE/PE dynamic is influencing it

Trading adjustment for expiry:
→ Reduce VWAP fade strategies on expiry days (volume distorted)
→ The pin risk near ATM strikes makes -2σ and +2σ less predictive
→ Use VWAP only for direction bias (above/below), not for precise band entries
→ Best practice: Skip VWAP band fades entirely on expiry Thursday
```

**4. NSE Midday VWAP Lull:**

```
NSE trading pattern: Volume typically peaks in two windows:
Peak 1: 9:15–10:30 AM (opening drive)
Peak 2: 2:30–3:30 PM (closing drive)
Midday: 12:00 PM–2:00 PM has the lowest volume of the session

VWAP implication:
→ During the midday lull, price moves on LOWER volume
→ VWAP barely moves during the lull (low volume = minimal VWAP impact)
→ VWAP band trades from 12:00–2:00 PM have the LOWEST reliability
   (moves are easily reversed when volume picks up)
→ Best VWAP strategies: Opening drive (9:15–10:30 AM) and closing drive (2:30–3:30 PM)
```

---

### 16.11 VWAP in the Institutional Execution Context

The deepest understanding of VWAP comes from knowing HOW institutions actually use it:

**Type A — VWAP Participation Rate Algorithm:**

```
Used by: Large mutual funds (NAM India, HDFC MF, SBI MF)
Logic: Algorithm places buy/sell orders proportional to real-time market volume
       If market is trading 10% of daily volume in the 9:15–9:30 window,
       the algorithm executes 10% of its total order in that window
Goal: Match VWAP exactly (market-like execution)
Effect on price: This algorithm adds volume that mirrors the market's own volume
                 It does NOT create price impact — it is "passive"
```

**Type B — VWAP Improvement Algorithm (Smart Order Routing):**

```
Used by: FIIs, proprietary desks, hedge funds
Logic: Algorithm LOOKS for prices below VWAP (for buys) and executes
       MORE aggressively when price is below VWAP, less when above
Goal: Execute BELOW VWAP (outperform the benchmark)
Effect on price: This algorithm CREATES buying pressure below VWAP
                 (it is THE force that makes VWAP act as support)
                 And REDUCES buying above VWAP (contributing to VWAP resistance)
```

**Type C — TWAP (Time-Weighted Average Price):**

```
Used by: When the client wants even spreading regardless of volume
Logic: Execute equal amounts in each time interval (not volume-weighted)
Goal: Spread market impact evenly across time
Effect on price: More predictable execution schedule; less responsive
                 to volume patterns; less VWAP adherence
NSE note: TWAP creates support and resistance that is TIME-based,
          not volume-based — useful to know when a large TWAP order
          is suspected (equal-size prints across time intervals)
```

**The retail edge:**

The Type B algorithm specifically creates VWAP support (by buying more aggressively when price is below VWAP). Retail traders who know this can piggyback:
- When price dips to VWAP in a bullish session: Buy WITH the institution (they are buying more aggressively here)
- When price rallies to VWAP in a bearish session: Short WITH the institution (they are selling more aggressively here)
- The entry levels, stops, and targets used in Section 16.6 are specifically designed to exploit this mechanism

---

## EXERCISES

### Beginner Exercises

**Exercise 16.1 — VWAP Calculation**

Calculate VWAP after the first four 15-minute bars of an NSE session:

| Bar | High | Low | Close | Volume (lakh shares) |
|-----|------|-----|-------|---------------------|
| 9:15–9:30 | ₹485 | ₹476 | ₹482 | 8.2 |
| 9:30–9:45 | ₹488 | ₹481 | ₹486 | 5.6 |
| 9:45–10:00 | ₹492 | ₹484 | ₹488 | 7.1 |
| 10:00–10:15 | ₹490 | ₹485 | ₹487 | 4.3 |

a) Calculate Typical Price for each bar
b) Calculate the cumulative (Price × Volume) sum after each bar
c) Calculate VWAP after each bar
d) Is price trending above or below VWAP after Bar 4?
e) If you wanted to buy in a bullish session — at what VWAP level would you look for entry?

**Exercise 16.2 — Session Character Classification**

For each scenario, classify the session character and identify the appropriate VWAP strategy:

| Session | VWAP direction | Price location | Volume pattern | First 60 min |
|---------|---------------|----------------|----------------|-------------|
| A | Rising | Mostly above VWAP | Expanding on up-bars | HH/HL above VWAP |
| B | Flat | Oscillating above and below | Equal up/down volume | Choppy at VWAP |
| C | Declining | Mostly below VWAP | Expanding on down-bars | LH/LL below VWAP |
| D | Rising steeply | Riding +1σ band | Volume spiking on up-bars | Gap up + sustained |

For each: (a) Bullish, Bearish, Range, or Trend day? (b) Applicable VWAP strategy? (c) What NOT to do?

**Exercise 16.3 — VWAP Band Interpretation**

A Nifty 50 stock at 1:45 PM shows the following VWAP data:

VWAP = ₹2,240, +1σ = ₹2,268, +2σ = ₹2,296, -1σ = ₹2,212, -2σ = ₹2,184

Current price: ₹2,292 (near +2σ). Volume on the last 3 bars: 2.1 lakh, 1.4 lakh, 0.8 lakh (declining).

Session so far: D-shaped profile forming, mostly in the ₹2,210–₹2,270 range until this push.

a) Is a +2σ band fade appropriate right now? Justify using the Band Fade criteria.
b) Entry price, stop, and target for the fade trade.
c) What would change this from a fade to a "trend continuation" scenario?

---

### Intermediate Exercises

**Exercise 16.4 — Anchored VWAP Analysis**

An NSE mid-cap stock had a Wyckoff SC on August 15 at ₹380. It has since run to ₹560 (current price, 80 sessions later). The AVWAP from August 15 now sits at ₹468.

a) What does the AVWAP from the SC represent in plain language?
b) Price is at ₹560 — what does this say about the average participant since the SC?
c) If price pulls back from ₹560 to ₹472, what is the significance of this level?
d) If price closes BELOW ₹468 (the AVWAP from SC): What does this signal?
e) The stock had a BC on the prior peak at ₹620 (3 months before the SC). The AVWAP from that BC now sits at ₹510. What does it mean that current price (₹560) is ABOVE the AVWAP from BC?
f) Design the AVWAP-based trade plan for adding to the long position on a pullback.

**Exercise 16.5 — VWAP + Wyckoff LPS Entry**

The daily chart shows a Wyckoff accumulation (SC, AR, ST, Spring, Test, SOS all confirmed). The SOS occurred yesterday, taking price from ₹480 (Creek) to close at ₹498.

Today's intraday chart shows:
- Open: ₹496 (gap barely above yesterday's close)
- 9:30 AM: Price at ₹492 (pullback)
- 10:00 AM: VWAP = ₹493.5
- 10:15 AM: Price at ₹491 — touching VWAP for the first time
- Volume on the 10:00–10:15 AM bar: 0.4× average (No Supply bar)
- VWAP is sloping gently upward

a) Is this an LPS or a VWAP pullback — or both? Explain.
b) Is this the ideal entry? What confirms it?
c) Entry price, stop, T1, T2.
d) What would the AVWAP from SC add to this analysis?
e) What VSA + VWAP combination makes this highest confidence?

**Exercise 16.6 — Multi-Session VWAP Analysis**

Track the following week of daily VWAP data and interpret:

| Day | VWAP | Session close vs VWAP | Session profile shape | Volume |
|-----|------|----------------------|----------------------|--------|
| Mon | ₹1,480 | Close above VWAP (+₹22) | P-shape | 1.8× average |
| Tue | ₹1,492 | Close above VWAP (+₹18) | D-shape | 0.9× average |
| Wed | ₹1,505 | Close below VWAP (−₹8) | b-shape | 1.4× average |
| Thu | ₹1,498 | Close above VWAP (+₹6) | D-shape | 0.7× average (expiry) |
| Fri | ₹1,510 | Close above VWAP (+₹14) | P-shape | 1.6× average |

a) What is the weekly trend (using daily VWAP migration)?
b) What did Wednesday's b-shape and close below VWAP signal?
c) Was Thursday's data reliable given it was expiry? What adjustment do you make?
d) How does Friday's P-shape confirm the week's trend?
e) Going into next Monday — what is your VWAP-based bias and first trade plan?

---

### Advanced Exercises

**Exercise 16.7 — Institutional VWAP Algorithm Simulation**

An FII has a mandate to buy ₹300 crore of Reliance Industries over one session.
Reliance's average daily turnover: ₹800 crore.
Current VWAP at 11:30 AM: ₹2,850. Reliance is trading at ₹2,842 (below VWAP).

The FII uses a VWAP Improvement Algorithm:
- Participation rate when price < VWAP: 40% of market volume
- Participation rate when price > VWAP: 10% of market volume

Assume market volume from 11:30 AM to 3:30 PM = 40 crore shares (₹400 crore worth at ₹850/share... adjust to Reliance's price: ₹2,850/share × remaining shares).

a) If Reliance remains below VWAP for the rest of the session, how does the FII's algorithm behave?
b) What price pressure does this create on Reliance?
c) At ₹2,842 (below VWAP), design the retail VWAP pullback long trade.
d) What is the TARGET (using VWAP and Volume Profile)?
e) At what price should a retail trader EXIT, knowing the FII algorithm slows down ABOVE VWAP?

**Exercise 16.8 — Complete VWAP + Wyckoff + Volume Profile Trade**

You are analysing a potential Wyckoff LPS on the daily chart of a Nifty 50 bank stock:

**Daily chart (Wyckoff context):**
- SC: 8 weeks ago at ₹1,480
- AR: ₹1,620
- Phase B: 6 weeks, delivery % rising 28% → 55%
- Spring: 2 weeks ago at ₹1,468 (Type 1, vol 0.3×)
- Test: 1 week ago at ₹1,478 (vol 0.22×)
- SOS: Yesterday at ₹1,632 (vol 3.8×, close ₹1,628)

**Volume Profile (Visible Range — 8 weeks):**
- SC zone HVN: ₹1,470–₹1,510 (32 crore shares)
- Mid-range HVN: ₹1,550–₹1,580 (22 crore)
- AR zone HVN: ₹1,610–₹1,640 (18 crore) ← Current SOS level
- LVN: ₹1,640–₹1,680 (2.4 crore)
- Prior HVN: ₹1,680–₹1,720 (15 crore — from 3 months ago)

**Intraday chart (today's LPS session):**
- Open: ₹1,618 (gap slightly below yesterday's SOS close)
- 9:30 AM VWAP: ₹1,621
- 10:00 AM: Price at ₹1,614, VWAP at ₹1,619
- Volume on pullback bars: 0.5×, 0.4×, 0.3× (declining)
- VWAP is flat-to-slightly-upward sloping

**AVWAP:**
- AVWAP from SC (₹1,480) = ₹1,548 (price is well above)
- AVWAP from prior BC = ₹1,592 (price has broken above this!)

Design the complete trade:
a) Wyckoff event confirmation: What are you seeing?
b) Volume Profile level: Where is the LPS relative to the AR HVN?
c) VWAP confirmation: Is the intraday pullback to VWAP in a bullish session?
d) AVWAP signal: What does the break above AVWAP from BC tell you?
e) Combined entry: Exact price, using all three frameworks
f) Stop-loss: Using all three frameworks (Wyckoff, Volume Profile, VWAP)
g) Target 1: Using Volume Profile (first HVN above the LVN)
h) Target 2: Using Wyckoff Cause-Effect (1× range from ₹1,480–₹1,640)
i) Position size: Based on Nine Tests score (assume 7/9)
j) What single event would INVALIDATE this trade?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** Write the VWAP formula and explain every component. Why does VWAP use "Typical Price" rather than the closing price?

**Q2.** Explain the institutional compliance mechanism that makes VWAP act as dynamic support and resistance. How does the VWAP Improvement Algorithm specifically create buying pressure below VWAP?

**Q3.** What is the difference between VWAP and a Simple Moving Average? In what way is VWAP superior to SMA for intraday institutional analysis?

**Q4.** Explain VWAP Standard Deviation bands. What does price reaching the +2σ band specifically tell you about institutional activity at that level?

**Q5.** What is the Anchored VWAP (AVWAP)? What does the AVWAP anchored to a Wyckoff SC specifically represent, and how does it function as support during the subsequent markup?

**Q6.** Describe the three primary VWAP trading strategies (VWAP Pullback, VWAP Breakout, VWAP Band Fade). What market condition does each require, and what is the critical non-negotiable confirmation for each?

**Q7.** Why is VWAP more powerful on high-volume (trending) sessions than low-volume (range) sessions? Relate this to the volume weighting in the VWAP formula.

**Q8.** How should a trader adjust their VWAP analysis on NSE F&O expiry days? What specific distortion occurs and which strategies should be avoided?

**Q9.** Describe the integration between Volume Profile and VWAP. What does it mean when the session VWAP is exactly at the historical Volume Profile POC?

**Q10.** What is the "NSE midday VWAP lull" and how does it affect the reliability of VWAP band fade strategies? In which two time windows are VWAP strategies most reliable?

---

### Chart Scenario Questions (5)

**S1.** Nifty Futures at 11:15 AM:

Session so far: Opened at 24,380 (above prior day's VWAP of 24,200).
Prior day's VA: VAL 24,050, VAH 24,350.

Current readings:
- Session VWAP: 24,290 (below opening price)
- Price: 24,310 (above VWAP)
- Volume Profile shape: Building a D-shape in the 24,250–24,350 zone
- AVWAP from 3 weeks ago SC: 23,940 (price well above)

a) Prior day's Value Area Rule: Which rule applies? What was the initial bias?
b) VWAP analysis at 11:15 AM: Is the session bullish or bearish? Evidence?
c) Volume Profile: What is the current session's "fair value" zone?
d) AVWAP context: What does price being above 23,940 tell you?
e) Design the trade based on all four inputs.

**S2.** A mid-cap stock shows:

AVWAP from its SC (6 months ago, SC at ₹200): Currently at ₹310
AVWAP from its prior BC (18 months ago, BC at ₹580): Currently at ₹340
Current price: ₹325 (between the two AVWAPs)

a) What "zone" is the stock in relative to both AVWAPs?
b) What is the institutional significance of the ₹310–₹340 zone?
c) If price breaks ABOVE ₹340 (AVWAP from BC): What is the signal?
d) If price breaks BELOW ₹310 (AVWAP from SC): What is the signal?
e) Design both the long and short trade plans with clear trigger and stop.

**S3.** Intraday analysis of a Nifty 50 constituent at 2:15 PM:

VWAP = ₹3,480, -1σ = ₹3,452, -2σ = ₹3,424
Price has been oscillating below VWAP since 12:00 PM (bearish session).
At 2:15 PM: Price touches -2σ at ₹3,425.
Volume on the -2σ touch bar: 4.2× average (expanding, not declining).

Should you fade this -2σ touch? Apply all criteria from the Band Fade strategy. What specifically makes this different from a valid fade setup? What does the high volume at -2σ actually tell you in this session's context?

**S4.** Weekly AVWAP analysis for a Nifty 50 sector:

You anchor AVWAP to the start of each month for the Nifty Bank Index:

- June AVWAP: 52,400 (settled at month end)
- July AVWAP: 53,800 (settled at month end)
- August AVWAP: 55,200 (settled at month end)
- September AVWAP (in progress): Currently at 54,100
- Current Nifty Bank price: 54,800

a) What is the monthly AVWAP migration telling you about the 3-month trend?
b) September's AVWAP at 54,100 is below August's settled AVWAP. What does this mean?
c) Current price (54,800) is above September's AVWAP (54,100): Bullish or bearish?
d) How would you use this monthly AVWAP framework to design a swing trade?
e) At what price would you become concerned the bank sector is weakening?

**S5.** You have been long a position entered at the Wyckoff LPS of a pharma stock at ₹680. Current price: ₹790 (16.2% gain in 3 weeks).

The AVWAP from the SC (₹580, anchored 10 weeks ago) now sits at ₹648.
Today's session VWAP at 1:00 PM: ₹788
+1σ band: ₹802; +2σ band: ₹816

Today's session profile: Building toward a D-shape near ₹780–₹800.
Yesterday's session was a b-shape (fat body at bottom, thin tail above ₹800).

a) Does the AVWAP from SC support your open long position? Where is the next AVWAP-based support?
b) What is yesterday's b-shape telling you?
c) Today's session VWAP at ₹788 — should you add or trim?
d) The +2σ at ₹816 — is this a reason to be cautious or a target?
e) Design the complete trade management plan: where to trim, where to exit, what event forces full exit.

---

## QUIZ ANSWERS

### Conceptual Answers

**A1.** VWAP = Σ(Typical Price × Volume) / Σ(Volume). Components: Typical Price = (High + Low + Close) / 3 — captures the full price range of the bar rather than just the closing point. Volume = shares traded in each bar (the weighting factor). The cumulative sum means each bar's contribution to VWAP is proportional to its volume. Typical Price is used rather than Close because: the close alone ignores the high and low of the bar — a bar that traded from ₹100 to ₹150 and closed at ₹148 had the majority of activity between ₹100 and ₹150, not just at ₹148. Typical Price (₹132.67 in this example) better represents where most of the bar's trading occurred.

**A2.** Institutional compliance mechanism: Fund managers and FII desks are evaluated by compliance on "Best Execution" — specifically, did they execute at prices competitive with VWAP? A VWAP Improvement Algorithm (Type B) is programmed to increase participation rate (buy MORE aggressively) when price is BELOW VWAP and reduce participation (buy LESS) when price is ABOVE VWAP. This creates a direct mechanical force: when price dips below VWAP, the algorithm's higher participation rate generates more buy orders → buy orders absorb supply and push price back toward VWAP → VWAP becomes support. The institutional compliance requirement thus creates the gravitational pull that retail traders exploit.

**A3.** VWAP vs SMA: (1) VWAP is volume-weighted (high-volume bars have more influence); SMA treats all bars equally. This makes VWAP more representative of actual trading costs — high-volume sessions matter more because more money traded there. (2) VWAP is cumulative from the session open (no "forgetting" old data); SMA has a rolling window that forgets old data. (3) VWAP resets each session (or at anchor point) — it represents the current session's fair price. SMA spans multiple sessions. For intraday institutional analysis: VWAP is superior because it shows whether the current session's average trade is above or below fair value — the exact question institutions ask. SMA would not tell you whether today's trades are expensive or cheap relative to today's activity.

**A4.** +2σ band: Price is two standard deviations above the session VWAP — approximately 5% of session time statistically. Institutional significance: Any institutional seller who has NOT yet executed their mandate is now able to do so at a price FAR above their VWAP benchmark. They will sell aggressively at +2σ (their benchmark performance improves dramatically here). Additionally, any late institutional buyer who was supposed to buy below VWAP has now missed the entire optimal zone — they stop buying entirely above +2σ (execution would be a large benchmark miss). Combined: Sellers extremely active at +2σ + Buyers withdrawn from +2σ = powerful mean reversion force back toward VWAP.

**A5.** AVWAP: Anchored VWAP that does not reset — cumulates from a user-defined starting point. AVWAP from SC represents: The average price (weighted by volume) of ALL trades that occurred from the SC date forward. In plain terms: The average cost of every participant who entered the market after the SC (during the accumulation range, the markup, and current day). Support mechanism during markup: If price is ABOVE the AVWAP from SC, every participant since the SC is, on average, profitable. They hold their positions (not sellers). This concentration of profitable holders below current price creates a support floor — when price approaches the AVWAP from SC, those profitable holders add more positions at their "average cost" level, reinforcing support.

**A6.** Three strategies: (1) VWAP Pullback: Market condition = bullish session (price mostly above rising VWAP). Confirmation non-negotiable = low volume on the pullback to VWAP (VSA No Supply characteristics). (2) VWAP Breakout: Market condition = range session consolidating at VWAP. Confirmation non-negotiable = 2–3× volume on the breakout bar + follow-through in the next 1–2 bars. Without this volume, the breakout is a trap. (3) VWAP Band Fade: Market condition = range/D-shape session (NOT a trend day). Confirmation non-negotiable = DECLINING volume on the band touch (the extreme was reached on diminishing commitment). Never fade on a strong trend day — price can ride the +1σ or +2σ band for hours.

**A7.** VWAP is more powerful on high-volume sessions because: High-volume bars have greater influence on VWAP (they are weighted proportionally). On a trending session, large institutional orders (high volume) drive VWAP in the trend direction — the VWAP itself becomes a meaningful measure of institutional average cost. Retail buyers below VWAP and institutional buyers below VWAP are ALIGNED. On a low-volume range session, VWAP barely moves (low volume = small weight = small VWAP shift) — it becomes an average of many similar-sized, low-volume bars. The resulting VWAP level has less "institutional weight" behind it. The gravitational pull is weaker because fewer institutional orders are contributing.

**A8.** F&O expiry adjustments: Distortion = Options delta hedging volume clusters at specific strike prices (especially ATM strikes like 24,000, 24,500, 25,000). This creates artificial HVNs at strike prices in Volume Profile AND pulls VWAP toward the pin risk level (market makers delta hedge at the dominant strike). Strategies to avoid: (1) VWAP Band Fades (bands are distorted by pin-risk volume, not genuine directional activity). (2) Volume Profile entry precision near strike prices (artificial HVN from hedging, not institutional position building). Adjusted approach: Use VWAP only for directional bias (above = bullish, below = bearish), not for precise band entries. Accept wider stops. Skip tight VWAP fade trades entirely on expiry Thursday.

**A9.** VWAP at the Volume Profile POC: VWAP = current session's average trade price (live). Volume Profile POC = historical price with maximum volume (prior sessions). When VWAP = Volume Profile POC: Both the "current fair value" and the "historical fair value" agree on the same price. This is the strongest possible confluence — both real-time participants and historical market memory agree this price is "fair." In an uptrend: This level is the strongest possible support (long here with tight stop). In a downtrend: Strongest resistance (short here with tight stop). The two tools rarely disagree wildly — when they do, it signals a value shift (VWAP significantly above POC = market accepting higher value = SOS-like event in VSA terms).

**A10.** NSE midday VWAP lull (12:00–2:00 PM): Volume drops to its daily minimum during this period. Low volume means each bar contributes minimally to VWAP movement — VWAP barely shifts. Price moves in this window on thin volume = easily reversed when volume returns at 2:30 PM. Band fade unreliability: A +1σ or +2σ touch on low midday volume can extend further (nobody to sell against it) OR reverse instantly when 2:30 PM volume returns. Both false positives and false negatives are amplified. Two reliable windows: (1) Opening drive 9:15–10:30 AM — institutional algorithms most active, volume highest, VWAP movement most meaningful. (2) Closing drive 2:30–3:30 PM — institutional mandate completion, VWAP benchmark pressure maximized.

---

## KEY TAKEAWAYS — CHAPTER 16

> **1. VWAP = Σ(Typical Price × Volume) / Σ(Volume). It resets each session and is the single most important intraday reference level for institutional traders on NSE.**

> **2. Institutions are evaluated against VWAP. Type B "VWAP Improvement" algorithms buy MORE aggressively BELOW VWAP — this creates the mechanical support that retail traders can exploit by trading WITH institutional flow.**

> **3. Three VWAP strategies: Pullback (mean reversion to VWAP on low volume — bullish sessions), Breakout (high volume break from VWAP consolidation with follow-through), Band Fade (reversion from ±2σ on declining volume — range days only).**

> **4. Anchored VWAP (AVWAP) is the most powerful application: Anchor to the Wyckoff SC (average cost of all accumulation participants = long-term support) or BC (average cost of all post-peak participants = long-term resistance). Price above SC-AVWAP = bull trend intact.**

> **5. VWAP + Wyckoff integration: The LPS pullback to VWAP in a bullish session after SOS = the highest confidence entry in the course. Wyckoff event + VWAP pullback + Volume Profile HVN + low volume = four-factor confluence.**

> **6. NSE-specific: Avoid VWAP band fades on F&O expiry days (pin risk distortion). Avoid midday (12–2 PM) band fades (low volume = unreliable). Best windows: 9:15–10:30 AM and 2:30–3:30 PM.**

> **7. Weekly VWAP adds a second reference level beyond daily — useful for Thursday expiry positioning and identifying whether the week's average trade price is bullish (above weekly VWAP) or bearish (below weekly VWAP).**

---

*Chapter 16 Complete. Part VIII — VWAP is complete.*

---

**Previous:** [← Chapter 15 — Volume Profile](./volume-profile.md)
**Next:** [Chapter 17 — Institutional Footprints →](./institutional-footprints.md)

*Part IX — Institutional Footprints begins next.*

*When ready, say: **"NEXT CHAPTER"***
