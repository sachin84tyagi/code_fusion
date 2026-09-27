# Essential Indicators

> **Course:** NSE/BSE Professional Investing — Price, Volume & Institutional Flow
> **Part:** XVI — Essential Indicators
> **Topic:** Essential Indicators

---

## Chapter Overview

Indicators are the most over-used, over-trusted, and most misunderstood category of tools in retail trading. The average retail trader uses RSI and MACD as PRIMARY SIGNALS — they buy because RSI crossed 30, they sell because MACD crossed bearishly. This approach loses money systematically because indicators are LAGGING by design (they are calculated from historical price data).

The professional approach is opposite: Indicators are the LAST layer of confirmation, not the first. You identify the Wyckoff structure first. You read volume and order flow second. You check institutional data third. Only then do you look at indicators — to confirm or deny what the institutional data is already telling you.

**The Core Rule:**

> **Indicators do not generate trades. Indicators FILTER trades. If the Wyckoff structure, volume, and institutional data say "buy" and the RSI is at 72 — you do not buy (overbought filter applies). If the structure says "buy" and RSI shows bullish divergence at 28 — your conviction doubles. Indicators score points. They do not make decisions.**

---

## LEVEL 1 — BEGINNER

### The Indicator Hierarchy

```
PROFESSIONAL USE OF INDICATORS:

PRIMARY LAYER (non-negotiable):
1. Wyckoff Phase identification (SC / AR / Phase B / Spring / SOS / LPS / Markup)
2. Volume analysis (VSA: effort vs result, relative volume)
3. Order flow (cumulative delta, footprint)

SECONDARY LAYER (institutional intelligence):
4. Delivery %
5. FII/DII data
6. Futures OI + Basis
7. Options PCR + Participant OI

TERTIARY LAYER (indicator confirmation):
8. Moving averages (200 EMA trend filter, 20/50 dynamic support)
9. RSI (divergence detector, momentum filter)
10. MACD (momentum confirmation, zero-line cross)
11. ATR (volatility — stop placement)

RULE: A signal from Layer 8-11 ALONE = No trade.
      A signal from Layer 8-11 CONFIRMING Layers 1-7 = Higher conviction.
      A signal from Layer 8-11 CONTRADICTING Layers 1-7 = Use as filter (reduce or skip trade).

THE INDICATOR MISUSE EPIDEMIC:
→ 90%+ of retail traders use indicators as primary signals.
→ This generates systematic losses because:
   (a) All standard indicators are lagging (calculated from past prices).
   (b) Institutional traders know where retail stop indicators are placed.
       They hunt these levels specifically. SL-M orders at RSI 30 crossings are targets.
   (c) Indicators in ranging markets generate constant false signals (whipsaws).
→ The cure: Wyckoff structure first. Indicators last.
```

**Why Indicators Lag and What That Means:**

```
HOW INDICATORS ARE CALCULATED:
→ RSI (14): Uses last 14 bars of closing prices. At 3:30 PM: Today's close now included.
   But the REASON for today's close is known ONLY from order flow, delivery, FII data.
   RSI cannot tell you WHY the price moved. Only THAT it moved.
   
→ MACD (12,26,9): Difference between 12-day and 26-day EMAs, smoothed.
   Uses 26+ days of historical closes. Maximum lag of 26 bars.
   
→ 200 EMA: Average of last 200 days of closes. Maximum lag: 200 bars.

THE LAG CONSEQUENCE:
→ By the time RSI crosses 30 (oversold): The SC low is often ALREADY FORMED.
   Smart money already bought at the SC low 2–3 sessions ago.
   You are buying at the AR (bounce) level using an oversold RSI signal.
   
→ By the time MACD crosses above zero: The SOS has already occurred.
   Smart money bought at the Spring/LPS. You are entering mid-SOS.
   
→ Solution: Use leading indicators (order flow, delivery, OI) for TIMING.
   Use lagging indicators (RSI, MACD, EMA) for CONFIRMATION and FILTERING.
```

---

### Moving Averages — The Trend Architecture

![Moving Average System — 20/50/200 EMA as Institutional Trend Architecture](/images/pi-moving-averages-ema-system.jpg)

**The three EMAs and their institutional interpretation:**

```
THE THREE KEY EMAs:
20 EMA (Short-term — Cyan):
→ Most sensitive. Hugs price closely.
→ On daily charts: 20 EMA ≈ 1-month trend direction.
→ In markup: Price should stay ABOVE 20 EMA. Dips to 20 EMA = LPS entry zone.
→ Break below 20 EMA: Minor weakness (unless confirmed by volume + OI).

50 EMA (Medium-term — Gold):
→ Swing trader's structural line.
→ On daily charts: 50 EMA ≈ 2.5-month trend direction.
→ During Wyckoff accumulation: 50 EMA is declining (below 200 EMA zone).
→ When SOS occurs: 20 EMA often crosses above 50 EMA (Bull Cross — medium-term).
→ LPS pullback to 50 EMA: Conservative entry (safer than 20 EMA).

200 EMA (Long-term — Red):
→ The institutional baseline. The "fair value" from a trend perspective.
→ On daily charts: 200 EMA represents approximately 10-month trend.
→ Institutional funds target: "Buy below 200 EMA." Fund managers tasked with
   accumulating positions at discount to 200 EMA = fundamental institutional buying mandate.

THE KEY 200 EMA READINGS:
Price vs 200 EMA distance formula:
% Distance = (Price − 200 EMA) / 200 EMA × 100

NSE Nifty historical 200 EMA distance readings:
−38%: COVID March 2020 (maximum fear in modern NSE history)
−18%: October 2022 correction (strong institutional buy zone)
−12%: Typical medium correction SC zone (2–3 per year in normal markets)
−5%: Mild correction (Phase B lower boundary in sideways markets)
 0%: At fair value (transitional zone)
+8%: Normal markup (Phase D momentum)
+15%: Extended markup (approaching distribution warning)
+18%+: Historical distribution peaks (major tops)
```

**The Death Cross and Golden Cross:**

```
DEATH CROSS = 50 EMA crosses BELOW 200 EMA:
→ A LAGGING signal (occurs AFTER price has already fallen significantly).
→ NSE reality: Death cross often occurs DURING Phase B (accumulation range),
  sometimes even AFTER the SC low. It is a confirmation of what already happened.
→ Do NOT short on a Death Cross. Most death crosses in NSE's 20-year history
  occurred within 3–6 months of a MAJOR BOTTOM (not a further decline).
→ Professional use: Death Cross = Confirmed BEAR MARKET has existed.
  Now wait for SC + Spring + SOS before buying. Do not rush. Phase B takes time.

GOLDEN CROSS = 50 EMA crosses ABOVE 200 EMA:
→ Also lagging (occurs AFTER SOS, during early LPS or markup).
→ NSE historical Golden Cross track record: Highly reliable longer-term.
  Every major Nifty Golden Cross (2003, 2009, 2014, 2017, 2020) preceded
  significant multi-year bull markets.
→ Professional use: Golden Cross CONFIRMS the SOS was genuine (not a false breakout).
  Trade: Buy the next LPS after the Golden Cross. Not at the Golden Cross itself.
  The Golden Cross is often 5–15% above the Spring low.

EMA ALIGNMENT (Bullish):
Price > 20 EMA > 50 EMA > 200 EMA (all three in correct alignment).
→ This is the "fully bullish" configuration.
→ Every LPS in this configuration is buyable.
→ The 200 EMA slope is the REGIME INDICATOR:
   Declining 200 EMA = Bear market regime (even if short-term rallies occur).
   Flat 200 EMA = Transition (Phase B = Wyckoff accumulation).
   Rising 200 EMA = Bull market regime (all LPS dips are opportunities).
```

---

## LEVEL 2 — INTERMEDIATE

### RSI — The Divergence Engine

![Essential Indicators — Wyckoff Confluence Map](/images/pi-indicators-wyckoff-confluence.jpg)

**RSI fundamentals and professional use:**

```
RSI (RELATIVE STRENGTH INDEX) — J. Welles Wilder (1978):
Formula: RSI = 100 − 100/(1 + RS) where RS = Average Up / Average Down (over N periods)
Standard settings: 14-period RSI on daily charts.

STANDARD READINGS:
RSI > 70: Overbought (but can remain overbought for weeks in a strong trend).
RSI < 30: Oversold (but can remain oversold for weeks in a strong downtrend).
RSI = 50: Neutral level. The "line of control" between bulls and bears.

WHY STANDARD LEVELS FAIL AS STANDALONE SIGNALS:
→ RSI < 30 = Buy: In a strong downtrend, RSI stays below 30 for months.
   Buying every RSI < 30 reading during Phase E (markdown) = Catastrophic losses.
→ RSI > 70 = Sell: In a strong markup, RSI stays above 70 for weeks.
   Selling every RSI > 70 reading during Phase D/E = Missing 30%+ moves.

THE CORRECT RSI READINGS (in Wyckoff context):

At SC (RSI < 30 — typically 18–28):
→ Not a buy signal. The SC RSI low sets the BASELINE for the divergence check.
→ Record this RSI level: SC RSI = 22 (example).

At Phase B (RSI 35–55):
→ RSI oscillating in neutral zone. Confirms range. No extreme signal. Correct.

At Spring (RSI brief dip — typically 28–38):
→ KEY READING: Spring RSI should be HIGHER than SC RSI.
   Spring RSI = 31. SC RSI = 22. 31 > 22 = HIGHER LOW.
   Even though price made a new low (Spring below SC low): RSI is HIGHER.
   This is BULLISH DIVERGENCE = Hidden institutional buying.
   The selling pressure that brought price to the SC is WEAKER at the Spring.
   Less volume, less momentum, higher RSI = CO absorbed the supply.

At SOS (RSI breaks above 55):
→ The RSI crossing 55 UPWARD is the momentum confirmation.
→ After weeks of RSI below 55 (Phase B): RSI > 55 = Trend shift.
→ RSI > 60 on SOS = Strong momentum. Phase D confirmed.

At LPS (RSI pulls back to 45–52):
→ LPS RSI should HOLD ABOVE 50.
→ RSI 47–52 on LPS = Healthy pullback. Bulls in control. LPS valid.
→ RSI drops BELOW 45 on LPS: Weakness. May not be a true LPS.
   Reduce position size or wait for RSI to recover above 50.

At Markup (RSI 55–75):
→ RSI can reach 80+ in strong Phase D/E markup. Do not exit just for RSI > 70.
→ Exit when: Wyckoff distribution signals appear (UTAD + Effort/Result divergence).
   NOT because RSI hit 70.
```

**RSI Divergence — The Most Reliable Indicator Signal:**

```
BULLISH DIVERGENCE (The Spring Confirmer):
Condition: Price makes a LOWER LOW while RSI makes a HIGHER LOW.
Reading: Selling pressure is DECREASING even as price falls to a new low.
         Fewer sellers are participating despite the new low price.
         This is VSA's "Effort vs Result" (Chapter: VSA) in indicator form.

EXAMPLE (NSE Nifty 50):
March 10: Nifty SC low = 23,040. RSI = 21.
April 2: Nifty Spring low = 22,980 (slightly below SC). RSI = 29.
→ Price: 22,980 < 23,040 (lower low).
→ RSI: 29 > 21 (higher low).
→ BULLISH DIVERGENCE CONFIRMED.
→ This single indicator reading, combined with:
   (a) Spring VSA: Narrow range, low volume at new low (effort/result failure).
   (b) Order flow: Near-zero cumulative delta at Spring low.
   (c) FII delivery: FII was net buyer on Spring day.
   (d) Options: VIX spiked then fell rapidly.
   = MAXIMUM confidence Spring is valid. SOS imminent.

BEARISH DIVERGENCE (The UTAD Confirmer):
Condition: Price makes a HIGHER HIGH while RSI makes a LOWER HIGH.
Reading: Buying momentum is DECREASING even as price reaches new high.
         Fewer buyers are participating despite the new high price.
         Institutional supply is absorbing the rally.

EXAMPLE (Distribution):
September 15: Nifty reaches 25,400 (new high). RSI = 74.
October 8: Nifty UTAD at 25,620 (new high). RSI = 68.
→ Price: 25,620 > 25,400 (higher high).
→ RSI: 68 < 74 (lower high).
→ BEARISH DIVERGENCE CONFIRMED.
→ This + FII participant OI (long puts) + Steepening skew + VIX rising
  = Maximum distribution confirmation. Phase E (markdown) imminent.
```

---

### MACD — Momentum and Zero-Line

```
MACD (MOVING AVERAGE CONVERGENCE DIVERGENCE) — Gerald Appel (1979):
Formula: MACD Line = 12-day EMA − 26-day EMA.
Signal Line = 9-day EMA of MACD Line.
Histogram = MACD Line − Signal Line (above zero = bullish momentum, below = bearish).

STANDARD SETTINGS: (12, 26, 9) — Default on all platforms.

THE FOUR KEY MACD READINGS (in Wyckoff priority):

1. ZERO LINE CROSS (Most Reliable Signal):
→ MACD crosses ABOVE zero line: 12-day EMA > 26-day EMA.
   Price is now ABOVE the 26-day average measured against the 12-day.
   Longs are NOW winning on a 2–3 week basis.
→ Wyckoff: Zero-line cross typically occurs AT or just AFTER the SOS.
   Professional rule: Zero-line cross confirms the SOS was genuine.
   Trade: Enter on the next LPS (after the zero-line cross), not at the cross itself.
→ MACD crosses BELOW zero line: Bearish momentum confirmed. Avoid new longs.

2. SIGNAL LINE CROSS (Second Priority):
→ MACD crosses ABOVE Signal line (histogram turns green): Short-term buy.
   Wyckoff context: Often occurs at the Spring (MACD bottoms and crosses Signal).
   More sensitive than zero-line cross. More false signals.
→ Use as an ENTRY TRIGGER after Wyckoff structure is confirmed.
   Not as a standalone trade generator.

3. HISTOGRAM DIVERGENCE:
→ Histogram makes LOWER HIGHS while price makes HIGHER HIGHS: Bearish divergence.
   Wyckoff: UTAD confirmation. Momentum failing at distribution top.
→ Histogram makes HIGHER LOWS while price makes LOWER LOWS: Bullish divergence.
   Wyckoff: SC or Spring confirmation. Buying pressure increasing covertly.

4. ZERO LINE AS SUPPORT/RESISTANCE:
→ During Phase D markup: MACD pulling back TO (but not crossing below) zero line.
   This is the MACD version of the LPS: Momentum pulling back but long bias intact.
→ MACD bouncing off zero line = Confirmed LPS in momentum terms.
→ MACD crossing BELOW zero on LPS = LPS may be failing. Reduce position size.

MACD IN NSE CONTEXT:
→ During RBI events: MACD can generate false signal crosses (IV spikes and reversals).
→ Weekly MACD (weekly chart): Much more reliable than daily. Fewer false signals.
   Weekly MACD zero-line cross = Major trend change. High conviction.
→ Nifty 50 weekly MACD: Every cross above zero in 2003, 2009, 2014, 2020 preceded
   multi-year bull markets. Never generated a false bull signal on weekly timeframe.
```

---

### ATR — The Stop Placement Tool

```
ATR (AVERAGE TRUE RANGE) — Welles Wilder (1978):
Measures the average daily price range (including gap-ups/gap-downs) over N periods.
Formula: True Range = max(High−Low, |High−Prev Close|, |Low−Prev Close|).
         ATR = 14-day average of True Range.

WHAT ATR TELLS YOU:
→ ATR is NOT directional. It measures VOLATILITY only.
→ High ATR: Large daily swings. Market in panic or explosive move.
→ Low ATR: Small daily swings. Market in compression. Building for a breakout.
→ ATR = the "noise level" of the instrument.

THE PROFESSIONAL USE OF ATR: STOP PLACEMENT

Rule: Stop = Entry − (ATR × Multiplier)
Multiplier depends on Wyckoff phase:

AT SPRING ENTRY (most critical stop):
→ Stop = Spring low − 0.5× ATR
→ Example: Spring low = 23,980. ATR = 180 points. Stop = 23,980 − 90 = 23,890.
→ Why − 0.5× ATR: Give a small buffer below the Spring low for noise.
   If stop = exactly the Spring low: Normal daily noise (±30–60 points) triggers it.

AT LPS ENTRY:
→ Stop = Spring low − 0.5× ATR (same Spring low reference).
   LPS stop uses the Spring low as the structural reference, not the LPS low.
→ Or: Stop = LPS low − 1.0× ATR (if Spring low is very far away).

IN MARKUP (TRAILING STOP):
→ Trailing stop = Recent swing low − 1.5× ATR.
→ Move the stop up each time a new swing high is established.
→ Never move the stop DOWN (only upward in a long trade).

ATR CONTRACTION (Phase B signal):
→ ATR declining over multiple sessions = Range compressing.
→ Phase B with declining ATR = Energy building for the Spring.
→ The lower the ATR gets in Phase B: The more explosive the eventual SOS tends to be.
→ ATR expands sharply on SOS = Confirms the move is genuine (real volatility entering).

ATR EXPANSION (SOS confirmation):
→ SOS bar ATR contribution should be > 1.5× the Phase B ATR average.
→ Example: Phase B ATR average = 120 points. SOS bar range = 210 points (1.75×).
→ This expanded range = VSA's "effort" showing up properly on the SOS.

NSE ATR REFERENCE VALUES (Nifty 50, approximate):
Normal market (Phase B): ATR ≈ 80–140 points/day.
SC / SC recovery: ATR ≈ 180–280 points/day.
Panic (extreme events): ATR ≈ 300–600 points/day (COVID was 800+ points/day).
Markup (steady trend): ATR ≈ 100–160 points/day.
```

---

### Bollinger Bands — Squeeze and Expansion

```
BOLLINGER BANDS — John Bollinger (1983):
Upper Band = 20-day SMA + (2 × 20-day Standard Deviation)
Middle Band = 20-day SMA
Lower Band = 20-day SMA − (2 × 20-day Standard Deviation)

KEY CONCEPTS:

BOLLINGER BAND SQUEEZE (Phase B signal):
→ Bands NARROW: Both upper and lower bands converge toward the middle.
→ Narrowing bands = Volatility CONTRACTING = Compression building.
→ This is the indicator version of Phase B: Low ATR, tight range, energy building.
→ Historical reliability: Bollinger Band Squeeze in Phase B = VERY RELIABLE
   signal that a large directional move is imminent.
→ Caveat: Bands don't tell you DIRECTION. They tell you a big move is coming.
   The direction determination is STILL from Wyckoff structure (Spring = up, UTAD = down).

%B INDICATOR (Position within the Bands):
%B = (Close − Lower Band) / (Upper Band − Lower Band) × 100
→ %B = 0: Price at the lower band.
→ %B = 100: Price at the upper band.
→ %B = 50: Price at the middle band (20 SMA).

SC reading: %B often reaches −20 to −40 (price BELOW the lower band).
   This is only possible in extreme panic. %B below 0 = Extreme fear.
   Wyckoff SC confirmation: %B < −10% = True SC territory.

Spring reading: %B should be HIGHER than SC's %B (bullish divergence).
   If SC %B = −25% and Spring %B = −5%: Strength. CO absorbed supply.

SOS reading: %B crosses ABOVE 100% (price breaks above upper band).
   Upper band breakout on high volume = Real breakout (SOS confirmed by Bollinger).
   
BANDWIDTH (volatility measure):
Bandwidth = (Upper Band − Lower Band) / Middle Band × 100
→ Phase B: Bandwidth contracting (heading toward 5–8% for Nifty daily chart).
→ SOS: Bandwidth expanding rapidly (heading toward 15–20%).
→ The transition from contracting → expanding bandwidth IS the SOS signal.
```

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### The Indicator Filter Framework

```
MANDATORY INDICATOR CHECKLIST BEFORE TRADE EXECUTION:

PREREQUISITE: Wyckoff structure (Phase D LPS) already confirmed from primary layers.
Now run the following indicator checks:

PASS/FAIL FILTER:

1. 200 EMA FILTER: □ PASS if price is ABOVE 200 EMA at trade entry.
                    □ CONDITIONAL if price < 200 EMA by < 5% (recent breakout).
                    □ FAIL if price is significantly below 200 EMA (wrong side of trend).
   Note: LPS in an early markup may still be below 200 EMA. In this case:
         Require SOS to have crossed ABOVE 200 EMA. LPS should be above where SOS crossed.

2. RSI FILTER: □ PASS if RSI is between 45–65 at LPS entry (healthy pullback).
               □ PASS if RSI shows bullish divergence vs previous low.
               □ FAIL if RSI > 70 at LPS entry (overbought — wait for dip).
               □ FAIL if RSI < 40 at LPS entry (failing, not truly an LPS).

3. MACD FILTER: □ PASS if MACD is ABOVE zero line at LPS entry.
                □ PASS if MACD is pulling back to zero from above (zero-line LPS).
                □ FAIL if MACD is BELOW zero line (bearish momentum — no long trades).

4. ATR FILTER: □ Confirm: ATR contracted during Phase B. Now expanding.
               □ Set stop = Spring low − 0.5× current ATR.
               □ Confirm: Position size × (Entry − Stop) = 1% of account.

5. BOLLINGER BAND FILTER: □ Check Bandwidth: Was it contracting in Phase B?
                           □ Is it now expanding? Confirms SOS energy.
                           □ Did price touch or break upper band on SOS? Confirms.

ALL 5 PASS: Maximum conviction entry at full position size.
3–4 PASS: Standard conviction entry at 75% position size.
2 PASS: Reduced conviction. Half position. Consider waiting.
< 2 PASS: Skip the trade. Better setup will come.

WHEN TO OVERRIDE THE FILTER:
→ If Wyckoff primary layers (Spring + SOS + LPS) are extremely high conviction
  AND FII/delivery/futures all bullish: A failing MACD (still slightly below zero)
  can be overridden — but reduce position size by 25%.
→ An RSI at 71 (slightly above 70) can be tolerated on a strong LPS with delivery < 20%.
→ Never override: 200 EMA FAIL (price far below 200 EMA = wrong side of institutional trend).
```

### ADX — Trend Strength Quantification

```
ADX (AVERAGE DIRECTIONAL INDEX) — Welles Wilder (1978):
Measures TREND STRENGTH (0–100 scale). Not directional.
Settings: 14-period standard.

ADX READINGS:
ADX < 20: Weak trend. Market in range/consolidation. Phase B.
ADX 20–40: Moderate trend developing. Phase D (early SOS).
ADX > 40: Strong trend in progress. Phase D/E Markup.
ADX > 60: Very strong trend. Rare. Major momentum events.

+DI/-DI LINES (Directional Indicators):
+DI > -DI: Uptrend dominant (bullish).
-DI > +DI: Downtrend dominant (bearish).
+DI crosses above -DI: Bullish crossover. Combine with ADX > 20 = Valid.

WYCKOFF + ADX:
Phase B: ADX < 20, +DI and -DI crossing back and forth. Confirms range.
SOS: ADX starts rising FROM < 20 and moves toward 25–35.
     +DI crosses above -DI simultaneously = Institutional momentum entering.
LPS: ADX may pull back slightly but stays above 20. +DI still above -DI.
Markup: ADX > 40 with +DI well above -DI = Strong institutional momentum.
        ADX > 40 and FALLING: Trend momentum is peaking. Caution.

ADX FILTER RULE:
→ Do NOT initiate new longs when ADX < 15 (no trend present — Phase B).
→ Do NOT initiate new longs when ADX > 50 and falling (exhaustion).
→ The optimal ADX range for entering longs: ADX between 20 and 40, rising.
```

---

## EXERCISES

### Beginner Exercises

**Exercise 1 — Indicator Hierarchy**

For each scenario, classify whether this indicator reading should be a primary signal, a confirmation, or a filter:

| Scenario | Reading | Role (Primary/Confirmation/Filter) |
|---------|---------|----------------------------------|
| A | RSI crosses above 30 (oversold) on daily chart | ? |
| B | Wyckoff SC confirmed + RSI shows bullish divergence | ? |
| C | MACD crosses above zero line (no Wyckoff context checked) | ? |
| D | Wyckoff SOS confirmed + MACD crosses above zero on same day | ? |
| E | 200 EMA was crossed by price for first time in 8 months | ? |
| F | RSI at 72 on an LPS day (Wyckoff structure perfect) | ? |

For each: (a) Role. (b) Action (enter trade / confirm trade / filter/skip / reduce size)?

**Exercise 2 — ATR Stop Calculation**

Calculate the correct stop for each NSE setup:

**Setup A — Nifty Spring at 23,980:**
Spring low: 23,980. Current ATR (14-day): 165 points. LPS entry today at 24,280.
a) Stop = Spring low − 0.5× ATR = ?
b) Distance from entry to stop (in points)?
c) Distance as % of entry price?
d) If account = ₹20L and 1% risk: Capital at risk = ₹20,000.
   Nifty futures lot = 25. Loss per lot if stop hit = (Entry − Stop) × 25 = ?
   Number of lots = ₹20,000 / loss per lot = ?

**Setup B — HDFC Bank LPS:**
HDFC Bank Spring low: ₹1,620. ATR: ₹28. Entry today: ₹1,682.
HDFC Bank lot size: 550 shares. Account ₹20L, 1% risk.
a) Stop = Spring low − 0.5× ATR = ?
b) Entry to stop distance (₹)?
c) Loss per lot = (Entry − Stop) × 550 = ?
d) Number of lots at 1% risk?

**Exercise 3 — RSI Divergence Identification**

RSI and price data over 8 weeks:

| Event | Nifty Level | RSI (14) | Is this a Divergence? |
|-------|------------|---------|----------------------|
| SC Low | 22,800 | 21 | Baseline |
| Phase B Week 1 | 23,400 | 38 | ? |
| Phase B Week 2 | 23,200 | 34 | ? |
| Phase B Week 3 | 23,500 | 42 | ? |
| Spring | 22,750 (new low) | 28 | ? |
| Spring +2 days | 23,100 | 38 | ? |
| SOS bar | 24,100 | 58 | ? |
| LPS | 23,600 | 48 | ? |

a) At the Spring: Is there bullish divergence vs SC? What is the RSI reading comparison?
b) Is the Spring confirmed by RSI alone? Or does it need Wyckoff + RSI together?
c) On the SOS bar: RSI crossed 55. What does this confirm?
d) At LPS: RSI at 48 (below 50). Is this a concern? What action?
e) What would RSI need to show to FAIL the LPS trade setup?

---

### Intermediate Exercises

**Exercise 4 — EMA Analysis**

Nifty 50 daily data (end-of-session):

| Date | Nifty Close | 20 EMA | 50 EMA | 200 EMA | 200 EMA % Distance | Phase |
|------|------------|--------|--------|---------|-------------------|-------|
| Jan 15 | 24,800 | 24,920 | 24,780 | 22,840 | +8.6% | ? |
| Feb 28 | 23,200 | 23,680 | 24,100 | 22,960 | ? | ? |
| Mar 10 | 21,840 | 22,480 | 23,400 | 23,020 | ? | SC? |
| Apr 14 | 22,600 | 22,380 | 23,060 | 23,010 | ? | ? |
| May 20 | 22,400 | 22,490 | 22,840 | 22,980 | ? | Phase B |
| Jun 5 | 22,200 | 22,360 | 22,620 | 22,940 | ? | Spring |
| Jul 8 | 23,600 | 22,940 | 22,680 | 22,900 | ? | SOS |
| Jul 22 | 23,100 | 23,180 | 22,740 | 22,870 | ? | LPS |
| Aug 14 | 24,200 | 23,620 | 22,980 | 22,860 | ? | Markup |

a) Fill in all 200 EMA % Distance values.
b) At Mar 10 (SC?): Does the 200 EMA distance qualify as an institutional buy zone?
c) At Jun 5 (Spring): Where is price relative to all three EMAs? Is the EMA structure correct for a valid Spring?
d) At Jul 8 (SOS): Does price cross the 200 EMA? What is the EMA alignment now?
e) At Jul 22 (LPS): Is the LPS above or below the 200 EMA? Is this bullish or concerning?
f) Death Cross: When does 50 EMA cross below 200 EMA in this data? When does Golden Cross form?

**Exercise 5 — MACD + Wyckoff Integration**

Track MACD (12,26,9) readings across a Wyckoff cycle:

| Phase | MACD Line | Signal Line | Histogram | Zero Line Status | Signal |
|-------|----------|-----------|---------|-----------------|-------|
| SC | −148 | −112 | −36 | Below zero (−148) | ? |
| AR | −68 | −94 | +26 | Below zero (−68) | ? |
| Phase B | −22 | −28 | +6 | Below zero, near zero | ? |
| Spring | −8 | −18 | +10 | Below zero, improving | ? |
| SOS | +24 | +8 | +16 | ABOVE ZERO | ? |
| LPS | +16 | +22 | −6 | Above zero | ? |
| Markup Week 2 | +42 | +28 | +14 | Above zero, rising | ? |

a) At SC: MACD histogram = −36. At Spring: MACD histogram = +10 (while prices made new low). Is this divergence? What type?
b) At SOS: MACD crosses ABOVE zero line. What is the standard professional interpretation?
c) At LPS: MACD pulls back to +16 but histogram turns negative (−6). Is this concerning?
d) Histogram is negative at LPS (−6). Does MACD crossing below its signal line mean the LPS is failing?
e) What single MACD reading would CONFIRM the LPS is failing and stop the trade?

**Exercise 6 — Complete Indicator Filter Checklist**

Run the complete indicator filter for this Nifty LPS trade:

**Trade Setup:** Nifty LPS at 24,280. Spring was at 23,890. SOS was at 24,820 (4 days ago).

**Indicator data:**
1. 200 EMA: 23,840. Nifty at 24,280. Distance = +1.85% above 200 EMA.
2. RSI (14-day): 49. (SC RSI was 22. Spring RSI was 29. SOS RSI was 63. LPS today: 49.)
3. MACD: Line = +18. Signal = +24. Histogram = −6 (negative, pulling back to zero).
4. ATR (14-day): 148 points. Spring low = 23,890.
5. Bollinger Band: Bandwidth was 6.8% at Phase B (contracting). Now at 14.2% (expanding after SOS).

For each indicator (1–5):
a) Pass or Fail the filter? If conditional: State what makes it conditional.
b) Calculate stop for this LPS: Spring low − 0.5 × ATR.
c) Distance entry to stop. Loss per lot (lot = 25). Number of lots (₹20L, 1% risk).
d) Overall: All 5 pass/conditional? What conviction level (Full/75%/50%)?
e) What indicator reading would take the RSI filter to "Fail"?

---

### Advanced Exercise

**Exercise 7 — Full Indicator + Institutional Scorecard**

Build the complete trade case combining all layers (Wyckoff + Delivery + FII + Futures + Options + Indicators):

**Trade Setup:** Nifty LPS at 24,180 (18 days to monthly expiry).

**All data collected:**

Wyckoff: Phase D. SC at 22,800. AR at 24,100. Phase B: 22,800–24,100 for 6 weeks. Spring at 22,720. SOS at 24,820. LPS pulling back to 24,180.

Delivery today: 22% (LPS confirmation). SOS delivery: 78%.

FII: 20-day cumulative +₹22,400 Cr. Net positive 14/20 sessions.

Futures: OI: −1,600 (long unwinding = LPS). Basis: +₹88 (fair = ₹82).

Options: VIX = 14.2 (low). Put Wall (24,000) rising (+16,400 today). Call Wall (25,000) declining (−4,800 today). PCR = 1.38. Max Pain = 24,400.

Indicators:
→ 200 EMA: 23,620. Nifty at 24,180. Distance = +2.37%.
→ RSI (14): 47 (SC RSI = 21, Spring RSI = 28). RSI holding 45.
→ MACD: Line = +22. Signal = +28. Histogram = −6 (small negative, pulling back from +38 peak).
→ ATR: 168 points.
→ Bollinger Bandwidth: 12.8% (expanded from 5.4% in Phase B).

Questions:
a) Run the 5-indicator filter. Score: Pass/Conditional/Fail each.
b) RSI: Does it show bullish divergence pattern (Spring > SC)? Calculate: SC RSI 21 → Spring RSI 28 → SOS RSI 63 → LPS RSI 47. Is this a healthy correction?
c) MACD is at +22 but histogram is negative (−6). Should this FAIL the trade or just reduce conviction?
d) Set the stop: Spring low − 0.5× ATR. Entry at 24,180. Calculate stop and R:R to T1 (25,000).
e) Design the options trade from previous chapter's framework: Buy 24,200 CE + Sell 25,000 CE (bull call spread). Net cost = ₹107. Lots at 1% risk (₹20L account).
f) Add the indicator scores to the full scorecard (Layer 7 — Indicators, max 5 pts):
   □ +1: 200 EMA above (price above 200 EMA)
   □ +1: RSI 45–65 at LPS
   □ +1: MACD above zero
   □ +1: ATR contracting in Phase B → Expanding in SOS (confirmed)
   □ +1: Bollinger squeeze → expansion confirmed

Total score with all layers. Conviction level?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** What is the correct hierarchy for using indicators in professional trading? List the three layers (Primary, Secondary, Tertiary) with specific tools in each.

**Q2.** Why do indicators lag? Explain how RSI and MACD are calculated from historical data, and what this means for their use as entry signals vs confirmation signals.

**Q3.** What are the three EMAs in the 20/50/200 EMA system? What does each measure, and what is the "bullish EMA alignment" configuration?

**Q4.** Define the Death Cross and Golden Cross. Why are they lagging signals, and when should an NSE trader act on them (in Wyckoff context)?

**Q5.** What is RSI Bullish Divergence? Give a specific example with RSI values. Why does this occur in Wyckoff Spring setups?

**Q6.** What is the most reliable MACD signal in a Wyckoff context? Describe the zero-line cross and what it confirms about the SOS.

**Q7.** How is ATR used for stop placement? Write the formula for the LPS stop. Why should the stop reference the SPRING LOW (not the LPS low)?

**Q8.** What is the Bollinger Band Squeeze? What does it indicate in Wyckoff context, and why can't it tell you which direction the move will go?

**Q9.** Explain the "Indicator Filter Framework." What is the action for: All 5 pass / 3–4 pass / 2 pass / fewer than 2 pass?

**Q10.** What does ADX measure? What ADX range is optimal for entering a long Wyckoff LPS trade, and what does ADX > 50 falling indicate?

### Chart Questions (5)

**S1.** RSI data across a Wyckoff cycle:

| Session | Nifty Close | RSI |
|---------|------------|-----|
| SC | 22,840 | 21 |
| AR top | 24,100 | 54 |
| Phase B low | 23,200 | 36 |
| Phase B high | 23,800 | 48 |
| Spring | 22,780 | 29 |
| SOS | 24,820 | 66 |
| LPS | 24,100 | 49 |
| Markup Week 2 | 25,200 | 71 |

a) Is there bullish RSI divergence at the Spring vs SC? Calculate and confirm.
b) At SOS: RSI = 66. Does this confirm momentum shift? What does RSI > 55 mean?
c) At LPS: RSI = 49 (slightly below 50). Pass or fail the filter?
d) At Markup Week 2: RSI = 71. Should you EXIT the long? Explain why or why not.
e) What RSI reading at the LPS would cause you to REDUCE position size to 50%?

**S2.** EMA analysis for Nifty:

Date | Nifty | 20 EMA | 50 EMA | 200 EMA
SC Low | 22,840 | 23,680 | 24,200 | 24,100
Phase B | 23,200 | 23,120 | 23,680 | 24,000
Spring | 22,720 | 22,940 | 23,380 | 23,940
SOS | 24,820 | 23,480 | 23,260 | 23,880
LPS | 24,100 | 23,840 | 23,340 | 23,860

a) At SC: What is the 200 EMA % discount? Is this an institutional buy zone?
b) At Spring: Is price above or below all three EMAs? Is this normal for a Spring?
c) At SOS: Does price cross the 200 EMA? What does this confirm?
d) At LPS: Is price above 200 EMA? Is the 20 EMA above 50 EMA? Is EMA alignment bullish?
e) When does the Golden Cross form (approximately) based on this data?

**S3.** MACD data across the same cycle:

| Phase | MACD | Signal | Histogram |
|-------|------|--------|---------|
| SC | −182 | −148 | −34 |
| Phase B | −28 | −44 | +16 |
| Spring | +6 | −12 | +18 |
| SOS | +44 | +22 | +22 |
| LPS Day 1 | +38 | +42 | −4 |
| LPS Day 3 | +28 | +36 | −8 |
| LPS Day 5 | +18 | +28 | −10 |

a) At Spring: MACD = +6, crosses above zero. And price made a NEW LOW (below SC). Is this bullish MACD divergence? Explain.
b) At SOS: MACD crosses above zero (already started at Spring). Is the zero-line cross confirmed?
c) At LPS Day 1–5: MACD declines from +38 to +18. Histogram negative and getting more negative. Is the LPS valid? What is the critical MACD level to watch?
d) If on LPS Day 7: MACD = −4 (crosses below zero). What does this signal?
e) What is the "MACD LPS" concept (MACD pulling back to zero from above) and is it present here?

**S4.** ATR and stop calculation exercise:

NSE Nifty 50:
Phase B ATR average: 88 points/day.
SOS day range: 198 points (ATR expanded to 198 on SOS day).
Current ATR (after SOS): 142 points.
Spring low: 22,720. LPS entry: 24,180.

a) Is the SOS bar range (198 points) > 1.5× Phase B ATR (88)? What does this confirm?
b) ATR expanded from 88 (Phase B) to 198 (SOS) to 142 (current). What does this trajectory show?
c) Calculate the LPS stop using Spring low − 0.5× ATR.
d) Distance from LPS entry (24,180) to stop. In points and %.
e) Account ₹25L. Risk 1% = ₹25,000. Loss per lot = (Entry − Stop) × 25.
   Number of lots at 1% risk?
f) Target T1 = 25,000. R:R of the trade (T1 vs Stop)?

**S5.** Complete indicator filter for a Bank Nifty LPS trade:

Bank Nifty at 52,400 (LPS). Spring low = 49,600. SOS was at 53,800.

Indicator data:
→ 200 EMA: 51,200. BankNifty at 52,400. % distance = +2.34%.
→ RSI (14): 51. Spring RSI = 32. SC RSI = 19. SOS RSI = 68.
→ MACD: Line = +88. Signal = +96. Histogram = −8. (Above zero but pulling back.)
→ ATR: 420 points. (Spring low 49,600.)
→ Bollinger Bandwidth: Phase B bandwidth = 8.2%. Current = 16.4%.

Run the filter:
a) 200 EMA filter: Pass/Fail?
b) RSI filter: Pass/Fail? And: RSI divergence analysis (SC=19, Spring=32, SOS=68, LPS=51).
c) MACD filter: Pass/Fail? (above zero = pass. Histogram negative but MACD above zero.)
d) ATR filter: Calculate stop = Spring low − 0.5× ATR. Entry to stop distance.
e) Bollinger filter: Pass/Fail? (Squeeze confirmed → Expanding.)
f) Overall: Full/75%/50% position?
g) Account ₹30L, 1% risk = ₹30,000. Loss per lot = Entry − Stop × 15 (BankNifty lot). Number of lots?

---

## QUIZ ANSWERS

**A1.** Indicator hierarchy: Primary Layer — The non-negotiables that drive every trade decision: (1) Wyckoff Phase identification (SC / AR / Phase B / Spring / SOS / LPS / Markup), (2) Volume analysis (VSA: Effort vs Result, Relative Volume, Delivery %), (3) Order Flow (Cumulative Delta, Footprint patterns). Secondary Layer — Institutional intelligence: (4) Delivery %, (5) FII/DII data (cash market flow), (6) Futures OI + Basis + Rollover, (7) Options PCR + Participant OI + India VIX. Tertiary Layer — Indicator confirmation: (8) Moving averages (200 EMA trend filter, 20/50 dynamic support), (9) RSI (divergence detection, momentum filter), (10) MACD (momentum confirmation, zero-line), (11) ATR (volatility measurement for stop placement). A signal from Layer 8-11 alone = No trade. Layer 8-11 confirming Layers 1-7 = Higher conviction. Layer 8-11 contradicting Layers 1-7 = Use as filter (reduce position or skip).

**A2.** Why indicators lag: RSI (14): Calculated from the last 14 closing prices. Today's RSI reflects data from the last 14 sessions. An event happening NOW cannot be reflected until AFTER the session closes, and even then only partially (1 out of 14 bars updates). MACD (12,26,9): The 26-EMA requires 26 days of data. Every new close updates only 1 out of 26 bars. Maximum lag = 26 bars for MACD line, then 9 additional bars for Signal line. EMA (200): 200 bars of data. Maximum lag = 200 sessions. Consequence for signals vs confirmation: If used as ENTRY signal: You arrive AFTER institutional players entered (they used leading data: order flow, delivery, futures OI). Your entry is at retail-level timing. If used as CONFIRMATION: You verify that the institutional move (which you identified via leading indicators) is genuine and sustained. Indicators confirm what already happened. Leading indicators (order flow, delivery, FII) signal what is happening NOW.

**A3.** Three EMAs: 20 EMA (Short-term): Measures short-term momentum. Sensitive. Represents ~1-month direction on daily charts. In markup: Price should stay above it. LPS pullback often finds support here. 50 EMA (Medium-term): Swing structure line. Represents ~2.5-month direction. During Phase B: 50 EMA declining. At SOS: 20 EMA crosses above 50 EMA. LPS to 50 EMA = conservative entry zone. 200 EMA (Long-term): Institutional baseline. ~10-month direction. Institutional mandates: "Accumulate below 200 EMA." The fundamental institutional buying trigger. Bullish EMA alignment: Price > 20 EMA > 50 EMA > 200 EMA (all three stacked in correct order, all above). This means: Short-term trend (20 EMA) is positive. Medium-term (50 EMA) is positive. Long-term (200 EMA) is rising. EVERY dip to the 20 EMA in this configuration is a potential LPS entry.

**A4.** Death Cross: 50 EMA crosses BELOW 200 EMA. Bearish signal. Lagging because: By the time 50 EMA crosses below 200 EMA, price has ALREADY fallen substantially (the 50 EMA only crosses 200 EMA AFTER being below it for many sessions, during which price was declining). NSE historical data: Most Death Crosses occurred during Phase B (accumulation is already beginning) or during Phase E (markdown). Death Cross in Phase B = Accumulation already in progress. Act: Wait for Spring + SOS, don't short at the Death Cross itself. Golden Cross: 50 EMA crosses ABOVE 200 EMA. Lagging — occurs AFTER SOS, during early markup. NSE track record: Every major Golden Cross (2003, 2009, 2014, 2020) preceded multi-year bull markets. How to act: Buy the FIRST LPS AFTER the Golden Cross confirmation. Do not buy AT the Golden Cross (you are already 5–15% above the Spring low by that point). Let price come to you (LPS = 20 EMA or 50 EMA test).

**A5.** RSI Bullish Divergence: Condition: Price makes a LOWER LOW (or equal low) while RSI makes a HIGHER LOW. Example: SC low: Nifty = 22,840, RSI = 21. Spring low: Nifty = 22,780 (lower than SC: −60 points). RSI at Spring = 28 (HIGHER than 21 at SC). Price: 22,780 < 22,840 = Lower low. RSI: 28 > 21 = Higher low. Divergence confirmed. Why it occurs at the Spring: The Spring is, by Wyckoff definition, the point where supply has been mostly ABSORBED by the CO. At the SC, maximum panic selling caused the RSI to plunge to its lowest. At the Spring, price makes a new low BUT with far less selling volume (effort fails to carry price lower = VSA's Effort/Result). RSI, which responds to the PACE of price changes (up vs down), shows the downward momentum is WEAKER at the Spring than at the SC — even though price went lower. This hidden strength = RSI divergence = CO absorbing at the Spring = The core Wyckoff-indicator convergence signal.

**A6.** Most reliable MACD signal in Wyckoff context: ZERO-LINE CROSS (MACD Line crossing from negative to positive = from below zero to above zero). When MACD crosses above zero: The 12-day EMA has crossed ABOVE the 26-day EMA. This means: Short-term average (12) is now higher than the 2-month average (26). Buyers have taken consistent control over approximately 12 trading sessions. It confirms: (1) The SOS breakout has sustained momentum (not a one-day false signal). (2) Institutions are consistently buying over multiple sessions (not a one-day spike). (3) The Phase B is definitively over (if MACD was below zero throughout Phase B, the zero-line cross marks the end). Professional action: MACD zero-line cross confirms the SOS was genuine. Now: Wait for the MACD to pull back toward zero (from above) = The MACD-LPS signal. Enter at the MACD pullback to zero (while staying above it), not at the zero-line cross itself. This gives better risk:reward (lower entry, same target, MACD confirms bull trend still intact).

**A7.** ATR stop formula: Stop = Entry Price − (Spring Low − 0.5 × ATR). Or equivalently: Stop = Spring Low − 0.5 × ATR (using Spring Low as the structural reference). Why Spring Low as reference: The Spring low is the STRUCTURAL INVALIDATION point. If Nifty falls BELOW the Spring low: The Wyckoff accumulation thesis is wrong. The trade is invalid regardless of what entry point you are at. So the stop references the point of structural failure (Spring low), not the entry point. The 0.5× ATR buffer: Normal daily volatility for Nifty is ATR = 120–160 points. Without a buffer: A single volatile session can touch the Spring low and trigger your stop, even while the accumulation is intact. The 0.5× ATR buffer (60–80 points below Spring low) filters out routine noise. Example: Spring low = 23,890. ATR = 168. Stop = 23,890 − (0.5 × 168) = 23,890 − 84 = 23,806. For LPS entry at 24,180: Distance = 24,180 − 23,806 = 374 points.

**A8.** Bollinger Band Squeeze: Bollinger Bands use a 20-period standard deviation to calculate band width. When volatility CONTRACTS (Phase B range): Standard deviation of the last 20 sessions shrinks. Upper and lower bands move CLOSER to the middle (20 SMA). Bandwidth = (Upper − Lower) / Middle × 100 contracts (e.g., from 15% to 5–7% for Nifty daily). This visually shows as "the bands squeezing together." What it indicates in Wyckoff: Phase B is a period of range compression. Low volatility, low ATR, declining Bollinger bandwidth = Energy building. The longer and tighter the squeeze: The more energy is stored. Historical reliability: A Bollinger squeeze breaking upward WITH a Wyckoff SOS + volume = extremely reliable explosive move. Why it can't tell direction: Standard deviation is SYMMETRIC — it measures the distance from the mean in BOTH directions equally. It cannot determine whether the next explosive move is up (SOS) or down (breakdown into deeper Phase A). Direction MUST come from Wyckoff structure (Spring = up. UTAD = down).

**A9.** Indicator Filter Framework — actions: All 5 pass: Maximum conviction. Full position size (1% account risk = your standard risk unit). 3–4 pass: Standard conviction. 75% position size (0.75% account risk). 2 pass: Reduced conviction. 50% position size (0.5% account risk). Consider waiting for remaining filters to improve. < 2 pass: SKIP. Do not trade. A better, higher-conviction setup will appear. Wait. Override rule: If Wyckoff primary layers are exceptional (perfect Spring + SOS + LPS with multiple institutional confirmations) AND the failing indicator is only slightly failing (e.g., RSI at 71 instead of 70 limit): Can enter at 75% size and note the marginal filter. Never override: 200 EMA filter failure (price far below 200 EMA = wrong side of institutional trend = structural impediment that no other layer can overcome).

**A10.** ADX (Average Directional Index): Measures TREND STRENGTH (0–100). Not directional. +DI = bullish force. −DI = bearish force. Optimal long entry range: ADX between 20 and 40, RISING. At < 20: No trend. Market in Phase B range. Entering a directional trade in this environment generates high false-signal rates. At 20–40 rising: Trend DEVELOPING. Phase D (SOS through early Markup). Optimal zone. Institutional momentum is entering. At > 40: Strong trend. Phase D/E Markup. Can add on LPS pullbacks but be aware trend is extended. At > 50 AND FALLING: Trend momentum is peaking/exhausting. ADX falling from 50+ = Early warning of distribution beginning or trend deceleration. Do NOT add new positions when ADX > 50 and falling. Begin tightening trailing stops. For NSE context: Nifty's strong bull markets (2020–2021, 2023) saw ADX sustained above 40 for weeks. Nifty bear phases (2022) saw ADX above 40 with −DI > +DI (downtrend with strength). The ADX value alone tells strength. +DI/-DI crossing tells direction.

---

## KEY TAKEAWAYS

> **1. Indicators are TERTIARY — they confirm, they filter, they score points. They do not generate trades. Primary = Wyckoff Structure. Secondary = Volume + Institutional Data. Tertiary = Indicators. An indicator signal contradicting Wyckoff = Ignore it. An indicator confirming Wyckoff = Higher conviction.**

> **2. The 200 EMA is the institutional trend baseline. Price below 200 EMA by 10–18% = SC institutional buy zone (historical NSE). Price above all three EMAs (20 > 50 > 200) in bullish alignment = Every LPS is buyable. 200 EMA slope = regime indicator: Declining = Bear. Flat = Transition. Rising = Bull.**

> **3. RSI Bullish Divergence (price lower low + RSI higher low) at the Spring = The most powerful indicator confirmation in the entire Wyckoff cycle. This divergence proves selling momentum is failing even as price makes a new low. CO absorption is active. Spring is valid.**

> **4. MACD zero-line cross = Most reliable MACD signal. Cross from negative to positive CONFIRMS the SOS was genuine (short-term momentum sustained above the 2-month average). Enter on the MACD LPS (pullback toward zero while staying above it) — not at the zero-line cross itself.**

> **5. ATR stop formula: Stop = Spring Low − 0.5× ATR. The stop ALWAYS references the Spring Low (structural invalidation), not the LPS entry. Position size = Account × 1% risk / Loss per lot (Entry − Stop × lot size). This formula ensures consistent risk regardless of the distance to the stop.**

---

*Essential Indicators — Complete. Part XVI is complete.*

*Next topic in the plan: **Multi-Timeframe Analysis** (Part XVII).*

*Ready? Say: **"NEXT CHAPTER"***
