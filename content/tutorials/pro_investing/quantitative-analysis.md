# Quantitative Analysis

> **Course:** NSE/BSE Professional Investing — Price, Volume & Institutional Flow
> **Part:** XIX — Quantitative Analysis
> **Topic:** Quantitative Analysis

---

## Chapter Overview

Every professional trader eventually confronts the same question: "Do I actually have an edge, or have I been lucky?" The answer requires moving from qualitative observation ("that trade worked") to quantitative measurement ("my expectancy is +0.76R per trade across 80 qualifying setups"). Without this transition, you cannot separate skill from luck, distinguish a bad period from a system failure, or size your positions with mathematical confidence.

This chapter provides the complete quantitative framework for the Wyckoff + institutional data approach: R-multiples, expectancy, position sizing, drawdown management, and performance metrics. These are not academic concepts — they are the daily tools of every prop desk, hedge fund, and serious independent trader.

**The Core Rule:**

> **If you cannot calculate your expectancy, you do not know whether you have an edge. If you do not know whether you have an edge, you are gambling. If you are gambling, position sizing, risk management, and Wyckoff analysis are irrelevant — randomness determines your outcome. The quant layer is what separates the professional from the sophisticated retail trader.**

---

## LEVEL 1 — BEGINNER

### The R-Multiple System

![Expectancy & R-Multiple System — Measuring Your Statistical Edge](/images/pi-expectancy-r-multiple.jpg)

**Why R is the universal unit of trading measurement:**

```
DEFINITION OF R:
R = 1R = The maximum risk on a single trade, defined BEFORE entry.
All trade outcomes are expressed as multiples of R.

WHY R-MULTIPLE INSTEAD OF RUPEES:
→ A ₹47,400 loss on a Nifty trade and a ₹12,000 gain on a stock trade
   cannot be compared meaningfully (different lot sizes, different stops).
   But: −1R and +0.25R can be compared instantly.
→ R-multiples normalise all trades to the SAME SCALE.
   Whether trading Nifty, Bank Nifty, or individual F&O stocks:
   Every trade is measured in R. One universal language.
→ R-multiples FORCE pre-entry risk definition.
   You cannot calculate R AFTER the trade. You must define your stop BEFORE entry.
   This discipline alone eliminates the majority of "I didn't have a stop" disasters.

CALCULATING R FOR A NIFTY LPS TRADE:
Entry: 24,280 (LPS — first green 15-min bar with positive delta)
Stop: Spring Low − 0.5 × ATR = 23,890 − (0.5 × 168) = 23,890 − 84 = 23,806.
1R = Entry − Stop = 24,280 − 23,806 = 474 points.

Per lot (25 units × 474 points):
1R loss per lot = 474 × 25 = ₹11,850 per lot.
2 lots: 1R = ₹23,700.

ALL POSSIBLE OUTCOMES IN R:
+0.5R: Exit at 24,280 + 237 = 24,517 (partial target at mid-zone).
+1R: Exit at 24,280 + 474 = 24,754 (break-even to risk).
+2R: Exit at 24,280 + 948 = 25,228 (T1 Call Wall approximately).
+3R: Exit at 24,280 + 1,422 = 25,702 (T2 next HVN).
+5R: Exit at 24,280 + 2,370 = 26,650 (full markup completion).
−1R: Stop hit at 23,806. Full loss of 1R.
−0.5R: Reduced position (partial exit at breakeven) before stop hit.

PROFESSIONAL R-MULTIPLE TARGETS:
→ Minimum acceptable trade: +2R (T1 = Call Wall level).
→ Standard Wyckoff LPS trade: +2.5R to +3.5R.
→ Home run (full markup): +5R to +8R.
→ NEVER accept a trade where T1 < +1.5R.
   If the expected move from LPS to T1 is less than 1.5× your risk:
   The setup does not offer sufficient reward. Skip.
```

---

### Expectancy — Your Statistical Edge

```
EXPECTANCY FORMULA:
E = (Win Rate % × Average Win in R) − (Loss Rate % × Average Loss in R)

WHAT EXPECTANCY MEANS:
→ E > 0: You have a positive edge. The system is profitable in expectation.
→ E = 0: No edge. Costs (brokerage, STT, exchange charges) make this a losing system.
→ E < 0: You are paying the market. A losing system with certainty over large samples.

THE RETAIL TRAP — HIGH WIN RATE, LOW EXPECTANCY:
Example 1: 70% Win Rate, +1.2R avg win, −1R avg loss.
E = (0.70 × 1.2) − (0.30 × 1.0) = 0.84 − 0.30 = +0.54R per trade.
For 1R = ₹10,000: Expectancy = ₹5,400 per trade.
PROBLEM: Requires wins 70% of the time. Psychologically fragile.
Any bad streak (30 losses out of 100 = NORMAL) feels catastrophic.

THE PROFESSIONAL APPROACH — LOWER WIN RATE, HIGH EXPECTANCY:
Example 2: 42% Win Rate, +3.2R avg win, −1R avg loss.
E = (0.42 × 3.2) − (0.58 × 1.0) = 1.344 − 0.58 = +0.76R per trade.
For 1R = ₹47,000: Expectancy = ₹35,720 per trade.
ADVANTAGE: Win only 42% of the time. Losses are small and expected.
Wins are large (3.2R = 3.2× the risk) when they come.
Psychology: You expect to lose more often than win. A string of losses is NORMAL.
            A string of wins is a BONUS. No emotional damage from losing trades.

ZERO EDGE SCENARIO (most retail traders):
Win rate: 50%. Avg win: +1R. Avg loss: −1R.
E = (0.50 × 1.0) − (0.50 × 1.0) = 0.50 − 0.50 = 0.00R.
= Zero edge BEFORE costs. NEGATIVE edge AFTER costs.
= Every "50% win rate, 1:1 risk:reward" trader is systematically losing money.
This is the single most common retail trading profile.

NSE TRADING COSTS (Round Trip, F&O):
Zerodha/Upstox (flat fee broker):
→ Brokerage: ₹20 per executed order × 2 (entry + exit) = ₹40 per trade.
→ STT: 0.01% of sell turnover. For 1 Nifty futures lot (25 × 24,280 = ₹6,07,000):
   STT = 0.01% × ₹6,07,000 = ₹60.70 per sell leg.
→ NSE Exchange charges: 0.00173% of turnover = ₹10.50 per leg.
→ SEBI charges: 0.0001% = ₹1.21 per leg.
→ GST: 18% on brokerage + exchange charges = ₹8.82.
→ Stamp duty: 0.003% of buy turnover = ₹18.21.
TOTAL ROUND TRIP COST: ≈ ₹170–₹200 for 1 Nifty futures lot.

COST IMPACT ON EXPECTANCY:
If 1R = ₹11,850 (1 lot, 474 points) and cost = ₹185 per trade:
Cost drag = ₹185 / ₹11,850 = 0.016R per trade.
For 80 trades per year: 0.016 × 80 = 1.28R annual cost drag.
Your gross expectancy of +0.76R per trade must EXCEED the 0.016R cost per trade.
0.76R − 0.016R = 0.744R net expectancy. Still strongly positive.

KEY COST RULE: Avoid systems with expectancy below +0.20R per trade.
Cost drag alone (0.015–0.025R) will erode a low-expectancy system completely.
The Wyckoff framework's +0.70R+ expectancy is cost-robust.
```

---

### Position Sizing — Fixed Fractional Method

![Position Sizing & Drawdown Management — The Mathematics of Capital Survival](/images/pi-position-sizing-drawdown.jpg)

```
THE FIXED FRACTIONAL METHOD (Professional Standard):
Risk a fixed PERCENTAGE of your account on every trade.
Standard: 1% per trade. Maximum: 2% per trade (for exceptional setups only).

FORMULA:
Rupees at risk = Account × Risk %
Lots = Rupees at risk / (Entry − Stop) / Lot Size

STEP-BY-STEP FOR NIFTY LPS TRADE:
Account: ₹20,00,000
Risk: 1% = ₹20,000
Entry: 24,280. Stop: 23,806. Distance: 474 points.
Loss per lot: 474 points × 25 = ₹11,850 per lot.
Lots = ₹20,000 / ₹11,850 = 1.68 lots → ROUND DOWN to 1 lot.

WHY ROUND DOWN (not up):
→ Rounding UP means risking MORE than 1%. Capital preservation takes priority.
→ "Roughly right" is better than "precisely risky."
→ The 0.68 of a lot stays as cash. Funds the next trade.

ACCOUNT SIZE SCALING (Nifty futures, 1% risk, same 474-point stop):
₹10L account: ₹10,000 / ₹11,850 = 0.84 → 0 lots (below 1 lot minimum).
   ACTION: Use OPTIONS (bull call spread or long call) at ₹10,000 premium cost.
₹15L account: ₹15,000 / ₹11,850 = 1.26 → 1 lot.
₹20L account: ₹20,000 / ₹11,850 = 1.68 → 1 lot.
₹30L account: ₹30,000 / ₹11,850 = 2.53 → 2 lots.
₹50L account: ₹50,000 / ₹11,850 = 4.21 → 4 lots.
₹1Cr account: 8 lots.

FOR ACCOUNTS BELOW ₹12L — USE OPTIONS:
Nifty lot size (25 units) requires ≈ ₹1,25,000 margin per lot for futures.
At 1% risk of ₹10L = ₹10,000: The margin itself constrains you to 0 futures lots.
Solution: Long call options or bull call spread.
→ Buy Nifty 24,200 CE at ₹120 premium. Cost: ₹120 × 25 = ₹3,000 per lot.
→ 1% of ₹10L = ₹10,000. Max: 3 lots (₹9,000 premium = defined risk).
→ Stop: Option premium falls 70% (from ₹120 to ₹36) = exit. Max loss = ₹2,520 per lot.
This gives DEFINED risk with correct position sizing for smaller accounts.

CONVICTION-BASED POSITION SIZING (MTF Alignment Scorecard):
5-star setup (all 6 institutional layers confirmed, MTF aligned): 1.0–1.5% risk.
4-star setup: 0.75% risk.
3-star setup: 0.50% risk.
2-star setup: 0.25% risk (options only).
1-star setup: NO TRADE.

WHY VARY SIZE BY CONVICTION:
→ 5-star setups occur rarely (< 5% of trading days).
   When they appear: Risk 1.5%. The edge is maximal.
→ 2-star setups occur frequently. At 0.25% risk: Even if many are wrong, no damage.
→ The result: Larger positions on the best setups (where edge is highest).
   Smaller positions on lower-conviction setups.
   This is ASYMMETRIC SIZING: More capital deployed where edge is greatest.
```

---

## LEVEL 2 — INTERMEDIATE

### Drawdown Management

```
WHAT IS DRAWDOWN:
Maximum Drawdown (MDD) = Largest peak-to-trough equity decline, expressed as %.
MDD = (Peak Equity − Trough Equity) / Peak Equity × 100

EXAMPLE:
Account starts at ₹20L. Reaches ₹24L (peak). Falls to ₹19.2L.
MDD = (₹24L − ₹19.2L) / ₹24L = ₹4.8L / ₹24L = 20%.

THE ASYMMETRIC RECOVERY PROBLEM:
Drawdown % | Recovery Needed % | Context
10% | 11.1% | Minor. Normal.
20% | 25% | Significant. 2–3 good months.
25% | 33.3% | Serious. 4 months at 8%/month.
33% | 49.3% | Very serious. Edge must be re-confirmed.
50% | 100% | Catastrophic. Need to double to recover.
75% | 300% | Career-ending for most traders.

KEY INSIGHT: A 50% drawdown requires a 100% gain to recover.
Not 50%. Not 75%. 100%. TWICE the work.
This mathematical asymmetry is why AVOIDING large drawdowns is MORE IMPORTANT
than generating large gains. Capital preservation multiplies future opportunities.
Capital destruction eliminates them.

THE 5 PROFESSIONAL DRAWDOWN RULES (for ₹20L account):

Rule 1 — PER TRADE MAX LOSS: 1% of account = ₹20,000 per trade. 
   Absolute maximum: 2% for 5-star setups only.
   NON-NEGOTIABLE. No exceptions for "this one looks different."

Rule 2 — DAILY MAX LOSS: If down 3% in a single day (₹60,000): STOP TRADING TODAY.
   Reasoning: 3 consecutive losing trades = Sequential error probability rising.
   After 3 losses: "Revenge trading" instinct activates. This is cognitive impairment.
   Trading impaired = Larger losses. Stop. Review tomorrow.
   Next day: Start fresh. No carryover emotional debt.

Rule 3 — WEEKLY MAX LOSS: If down 5% in a week (₹1,00,000): STOP and REASSESS.
   Review ALL trades that week. Was the edge present in each?
   Did you take 1-star setups? Did you break the entry protocol?
   Identify the cause before resuming. If edge was present but losing: Resume.
   If edge was absent (you traded without protocol): Fix the process before resuming.

Rule 4 — MONTHLY MAX LOSS: If down 8–10% in a month (₹1,60,000–₹2,00,000):
   REDUCE ALL POSITION SIZES BY 50% (0.5% risk per trade instead of 1%).
   Continue at half size until: Two consecutive profitable months achieved.
   Then: Restore normal 1% risk per trade.
   Reasoning: A bad month may indicate: (a) Random variance (temporary). 
   OR: (b) A change in market conditions your system is not handling.
   Half size gives time to determine which while limiting further damage.

Rule 5 — MAXIMUM DRAWDOWN LIMIT: If account draws down 20% (₹4,00,000 below peak):
   COMPLETE TRADING HALT. Minimum 2 weeks off. No charts. No trades.
   Forensic review: Print every trade. Identify every protocol deviation.
   After 2 weeks: Resume at 25% of normal size (0.25% per trade).
   Rebuild to 50% size after one profitable month.
   Rebuild to 100% size after two profitable months.
   Reasoning: A 20% drawdown at 1% per trade requires 20 consecutive losses.
   This is statistically impossible (< 0.0000001% probability) with a 40%+ win rate
   UNLESS there is a systematic process failure. Find and fix the process failure.

DRAWDOWN HEAT MAP (when to change behavior):
0–5% drawdown: NORMAL. Maintain standard protocol. This is expected.
5–10% drawdown: MILD CONCERN. Analyze recent trades. Maintain size if edge present.
10–15% drawdown: MODERATE. Reduce position size to 75%. Force detailed trade review.
15–20% drawdown: SERIOUS. Reduce to 50% size. Stop taking 2-3 star setups.
                  Only 4–5 star setups at half size.
>20% drawdown: CRITICAL. Full stop. Forensic review. Reset.
```

---

### Performance Metrics — Professional KPIs

```
THE 7 KEY PERFORMANCE INDICATORS FOR YOUR TRADING SYSTEM:

1. EXPECTANCY (E):
Formula: E = (Win% × Avg Win R) − (Loss% × Avg Loss R)
Target: E > +0.50R per trade.
Wyckoff framework benchmark: +0.60R to +0.90R.
Review frequency: Calculate after every 20 trades (minimum sample for reliability).

2. PROFIT FACTOR (PF):
Formula: PF = Total Gross Profit / Total Gross Loss
Target: PF > 1.5 (generates ₹1.50 for every ₹1.00 lost).
Professional target: PF > 2.0.
Wyckoff benchmark: PF = 2.0–3.0 (with proper R:R).
Interpretation: PF = 1.0 = break-even. PF < 1.0 = losing system.

EXAMPLE CALCULATION:
20 trades: 8 wins × avg +₹35,000 = ₹2,80,000 gross profit.
           12 losses × avg −₹11,850 = ₹1,42,200 gross loss.
PF = ₹2,80,000 / ₹1,42,200 = 1.97. → Good system.

3. WIN RATE (W%):
Formula: Winning trades / Total trades × 100.
Context: Win rate alone is meaningless without R:R.
Wyckoff LPS benchmark: 38–48% (it feels like you lose more than you win).
DO NOT try to maximise win rate. Maximise expectancy.

4. MAXIMUM DRAWDOWN (MDD):
Formula: (Peak − Trough) / Peak × 100.
Target: MDD < 15% (well-managed system).
Professional ceiling: MDD < 20%.
If MDD > 25%: System has a position sizing or risk management failure.

5. CALMAR RATIO:
Formula: Calmar = Annualised Return % / Maximum Drawdown %.
Target: Calmar > 2.0 (return is > 2× the maximum pain taken).
Example: 40% annual return with 15% MDD: Calmar = 40/15 = 2.67. Excellent.
Example: 40% annual return with 30% MDD: Calmar = 40/30 = 1.33. Average.
Interpretation: Higher Calmar = Better return per unit of drawdown pain.

6. SHARPE RATIO (simplified for trading):
Formula: Sharpe = (Avg Monthly Return − Risk-Free Rate) / Std Dev of Monthly Returns.
Risk-free rate (NSE context): ~6.5% annualized = 0.54% per month.
Target: Sharpe > 1.0. Professional target > 1.5.
Interpretation: Return per unit of volatility taken. Higher = Smoother returns.

7. TRADE FREQUENCY AND ANNUAL R:
Trades per year × Expectancy per trade = Annual R.
Example: 60 trades/year × 0.76R = 45.6R per year.
At 1R = ₹23,700: Annual profit = 45.6 × ₹23,700 = ₹10,81,200 (₹10.8L on ₹30L account = 36%).
As account grows (compounding): 1R grows proportionally.
Year 1: ₹30L → ₹40.8L (+36%).
Year 2: ₹40.8L → 45.6R × (₹40,800/1R) × (₹1,632) = ... continues compounding.

THE COMPOUNDING POWER OF POSITIVE EXPECTANCY:
At 36% annual return (conservative Wyckoff estimate):
Year 1: ₹30L → ₹40.8L
Year 2: ₹40.8L → ₹55.5L
Year 3: ₹55.5L → ₹75.5L
Year 5: ₹75.5L → ₹1.40Cr
Year 7: → ₹2.59Cr
Year 10: → ₹6.60Cr
This is the mathematical consequence of compounding a positive-expectancy system.
The edge itself doesn't compound. The capital does. This is the only game worth playing.
```

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### The Trading Journal Analytics Framework

```
TRADE JOURNAL STRUCTURE — MINIMUM REQUIRED FIELDS:

For EVERY trade, record:

Pre-Trade:
□ Date / Session / Instrument / Entry Time
□ Weekly Phase: ___. Daily Event: ___. Intraday Trigger: ___.
□ MTF Stars: ___/5. Scorecard: ___/65.
□ Entry Price: ___. Stop: ___. T1: ___. T2: ___.
□ 1R = Entry − Stop = ___ points.
□ Lots: ___. Rupees at risk: ___. Risk %: ___.
□ Options (if applicable): Strike, Expiry, Premium, Max loss.

Post-Trade:
□ Exit Price: ___. Exit Time: ___. Duration: ___ (sessions).
□ Exit Reason: T1 hit / T2 hit / Trailing stop / Stop hit / Time exit.
□ P&L in Rupees: ___. P&L in R: ___ (e.g., +2.3R or −1R).
□ Was the Wyckoff thesis correct? YES/NO.
□ Protocol followed? YES/NO. If NO: What deviation?
□ Edge assessment: Did the setup have the expected institutional confirmation?

PERIODIC ANALYTICS (every 20 trades minimum):

Calculate:
1. Win Rate = Wins / Total
2. Avg Win (R) = Sum of positive R outcomes / Win count
3. Avg Loss (R) = Sum of negative R outcomes / Loss count
4. Expectancy = (Win% × Avg Win) − (Loss% × Avg Loss)
5. Profit Factor = Total positive R / Total negative R (absolute)
6. MDD (R) = Largest peak-to-trough in cumulative R curve
7. Avg R per trade (annualised) = Expectancy × Trades per year

DIAGNOSTIC QUESTIONS FROM ANALYTICS:

If Expectancy < +0.30R: System edge is insufficient after costs.
   → Are exits too early? Is R:R below 2:1?
   → Are stops too wide? Is 1R too large?

If Win Rate < 30%: Entries need improvement.
   → Are mandatory Spring checks being applied?
   → Are you taking 1–2 star setups?

If Avg Loss > 1.1R: Stops are not being respected.
   → Are you moving stops after entry?
   → Are you exiting AFTER stops are hit (hesitation)?

If Profit Factor < 1.5: Either wins are too small or losses are too large.
   → T1 being set too conservatively?
   → Losses being taken at 2R instead of 1R?

EQUITY CURVE ANALYSIS:
Plot cumulative R over time (not rupees — R removes account size bias).
A healthy system produces:
→ Upward-sloping equity curve with small, manageable drawdowns.
→ New equity highs regularly (not flat for extended periods).
→ No single trade that accounts for more than 3R of gain or 1R of loss.
   (If one trade is 8R+ of the system's total return: Luck, not skill.)

DETECTING LUCK VS SKILL (Monte Carlo simulation):
→ Take your actual trade R-multiples (e.g., +2.3R, −1R, +3.1R, −1R, +1.8R...).
→ Randomly shuffle them 10,000 times.
→ Plot the resulting 10,000 equity curves.
→ If your actual equity curve is in the TOP 50% of these random curves:
   Your sequencing was fortunate (could be luck).
→ If your actual equity curve is TYPICAL of the distribution:
   Your system is the source of returns, not lucky sequencing.
→ If your win rate and expectancy are high (> +0.50R) with 50+ trades:
   Statistical significance is confirmed. Skill is present.
→ With < 30 trades: You cannot distinguish skill from luck with statistical confidence.
   Trade 30+ qualifying setups before drawing system conclusions.
```

### NSE-Specific Quantitative Benchmarks

```
BENCHMARK PERFORMANCE TARGETS (NSE F&O trading):

For a WYCKOFF + INSTITUTIONAL DATA system on Nifty 50 / Bank Nifty:

Qualifying trades per month: 3–6 (Nifty). 2–4 (Bank Nifty). Less ≠ worse.
Annual qualifying trades: 40–80 (Nifty) + individual stocks in F&O.
Win rate benchmark: 40–48%.
Avg Win benchmark: +2.8R to +3.5R.
Avg Loss benchmark: −1R (approximately).
Expectancy benchmark: +0.65R to +0.90R per trade.
Profit Factor benchmark: 1.8 to 2.5.
Maximum Drawdown target: < 12% in any rolling 12-month period.
Calmar Ratio target: > 2.5.
Annual return target: 35–55% on account (at 1% risk per qualifying trade).

REALISTIC MONTHLY P&L DISTRIBUTION (₹20L account, 5 Nifty trades/month):
Good month (3 wins + 2 losses): Wins avg +2.8R. Losses avg −1R.
Profit = 3 × 2.8R × ₹11,850 − 2 × 1R × ₹11,850 = ₹99,540 − ₹23,700 = ₹75,840 (+3.8%).

Average month (2 wins + 3 losses):
Profit = 2 × 2.8R × ₹11,850 − 3 × 1R × ₹11,850 = ₹66,360 − ₹35,550 = ₹30,810 (+1.5%).

Poor month (1 win + 4 losses):
Profit = 1 × 2.8R × ₹11,850 − 4 × 1R × ₹11,850 = ₹33,180 − ₹47,400 = −₹14,220 (−0.7%).

Monthly distribution is EXPECTED to include occasional negative months.
A losing month is NOT a signal to abandon the system.
A PERSISTENT pattern of losing months (3+ consecutive) IS a signal to review.

NSE BROKERAGE-EFFICIENT MINIMUM TRADE SIZE:
For expectancy to remain positive after costs:
Minimum 1R = ₹10,000 per trade. (Costs ≈ ₹200 = 0.02R per trade. Still viable.)
Below ₹10,000 per trade 1R: Cost drag becomes significant (> 0.02R per trade).
Account minimum for viable Nifty futures trading: ₹12–₹15L.
Account minimum for viable Bank Nifty futures: ₹15–₹20L.
Below these: Use options (defined risk, smaller capital deployment).
```

---

## EXERCISES

### Beginner Exercises

**Exercise 1 — R-Multiple Calculation**

Calculate 1R and all outcomes for each trade setup:

**Trade A — Nifty LPS:**
Entry: 24,200. Stop: 23,760 (Spring low − ATR buffer). Lot: 25. Lots: 2.
a) 1R in points.
b) 1R in rupees (per lot and for 2 lots).
c) P&L in R if exit at: 24,680 / 25,080 / 25,640 / 23,760 (stop).
d) P&L in rupees for each outcome above (2 lots).
e) If T1 = 25,080: What is the R:R ratio?

**Trade B — Bank Nifty LPS:**
Entry: 52,400. Stop: 51,200. Lot: 15 units. Lots: 1.
a) 1R in points and rupees.
b) P&L in R if exit at: 53,600 / 55,000 / 56,200 / 51,200 (stop).
c) P&L in rupees for each outcome (1 lot).
d) If T1 = 55,000: What is the R:R ratio?

**Exercise 2 — Expectancy Calculation**

Calculate expectancy for each trading system:

| System | Win Rate | Avg Win (R) | Avg Loss (R) | Expectancy | Verdict |
|--------|---------|------------|------------|-----------|---------|
| A | 72% | +1.1R | −1.0R | ? | ? |
| B | 45% | +2.8R | −1.0R | ? | ? |
| C | 55% | +1.8R | −1.1R | ? | ? |
| D | 38% | +3.5R | −1.0R | ? | ? |
| E | 60% | +0.9R | −1.0R | ? | ? |
| F | 35% | +4.2R | −1.2R | ? | ? |

a) Calculate E for each.
b) Which systems are profitable (E > 0)?
c) After NSE cost drag (−0.016R per trade): Which systems remain profitable?
d) Rank from highest to lowest expectancy.
e) Which system has the highest win rate but is unprofitable after costs?

**Exercise 3 — Position Sizing**

Calculate lots for each account size and trade setup (Nifty futures, lot = 25):

| Account | Risk % | 1R per lot | Lots | Rupees at Risk |
|---------|--------|-----------|------|--------------|
| ₹10L | 1% | ₹11,850 | ? | ? |
| ₹15L | 1% | ₹11,850 | ? | ? |
| ₹20L | 1% | ₹11,850 | ? | ? |
| ₹20L | 1.5% | ₹11,850 | ? | ? |
| ₹30L | 1% | ₹8,750 | ? | ? |
| ₹50L | 1% | ₹11,850 | ? | ? |
| ₹1Cr | 1% | ₹9,250 | ? | ? |

a) Fill in Lots (round down) and Rupees at Risk columns.
b) For ₹10L with 1% risk: 0 futures lots possible. What alternative instrument and how many units?
c) If entry = 24,280 and stop = 23,806 (474 points): For ₹20L at 1%: What is the exact lot calculation?
d) A 5-star setup warrants 1.5% risk. For ₹20L: How many lots at 1.5% risk?

---

### Intermediate Exercises

**Exercise 4 — Expectancy Analysis from Trade Journal**

Extract the following from your last 20 trades:

| Trade | Outcome (R) |
|-------|-----------|
| 1 | +2.4R |
| 2 | −1.0R |
| 3 | −1.0R |
| 4 | +3.1R |
| 5 | −1.0R |
| 6 | +2.8R |
| 7 | −1.0R |
| 8 | −1.0R |
| 9 | +4.2R |
| 10 | −1.0R |
| 11 | +2.6R |
| 12 | −1.0R |
| 13 | +1.8R (partial exit — early) |
| 14 | −1.0R |
| 15 | +3.4R |
| 16 | −0.5R (partial exit before stop) |
| 17 | +2.2R |
| 18 | −1.0R |
| 19 | −1.0R |
| 20 | +3.8R |

a) Count wins and losses. Calculate Win Rate %.
b) Calculate average win in R (sum of positive outcomes / win count).
c) Calculate average loss in R (sum of negative outcomes / loss count).
d) Calculate Expectancy E.
e) Calculate Profit Factor (sum of positive R / absolute sum of negative R).
f) Identify the Maximum Drawdown in this sequence (cumulative R from peak to trough).
g) At 1R = ₹23,700 (₹30L account): Total P&L in rupees for these 20 trades.
h) Annualise: If 20 trades over 4 months, what is the projected annual R?

**Exercise 5 — Drawdown Rule Application**

Track this account equity curve (₹20L account):

| Week | Account Value | Drawdown % | Action Required? |
|------|-------------|-----------|-----------------|
| Start | ₹20,00,000 | 0% | None |
| Week 2 | ₹21,40,000 (peak) | 0% | ? |
| Week 3 | ₹20,80,000 | ? | ? |
| Week 4 | ₹19,60,000 | ? | ? |
| Week 5 | ₹18,80,000 | ? | ? |
| Week 6 | ₹17,90,000 | ? | ? |
| Week 7 | ₹17,40,000 | ? | ? |
| Week 8 | ₹18,20,000 | ? | ? |

a) Calculate drawdown % from peak (₹21,40,000) at each week.
b) At Week 4: What drawdown rule triggers? What action?
c) At Week 5: What drawdown rule triggers? What action?
d) At Week 6: What drawdown rule triggers? What action?
e) At Week 7: What drawdown rule triggers? What is the severity? Complete action?
f) Week 7 to Week 8: Account recovers by ₹80,000. Are you back to normal size yet? Why/why not?

**Exercise 6 — Performance Metrics Calculation**

12-month trading record summary:

Annual data:
→ Total trades: 64.
→ Wins: 28 trades. Average win: +3.1R each.
→ Losses: 36 trades. Average loss: −1.0R each.
→ Account at start: ₹20L. 1R at start = ₹20,000.
→ Maximum Drawdown: −₹2,60,000 from peak during August.

Calculate:
a) Win rate %.
b) Expectancy per trade (in R).
c) Total R earned over the year.
d) Total rupees profit (1R was approximately ₹20,000 throughout — simplify).
e) Annual return % on ₹20L account.
f) Profit Factor.
g) Calmar Ratio (Annual Return % / Maximum Drawdown %).
h) Is this a well-functioning system? Comment on each metric vs benchmark.

---

### Advanced Exercise

**Exercise 7 — System Optimisation and Risk Assessment**

You have 2 years of trading data (100 qualifying trades per year, same Wyckoff LPS framework).

**Year 1:**
Win Rate: 44%. Avg Win: +2.6R. Avg Loss: −1.1R.
Starting account: ₹20L. Ending account: ₹29.2L (+46%).
MDD during year: 14%.
1R average: ₹22,000.

**Year 2 (Position sizing updated as account grew):**
Win Rate: 42%. Avg Win: +3.1R. Avg Loss: −1.0R.
Starting account: ₹29.2L. 1R = ₹29,200 (1% of account).
Ending account: ₹42.1L (+44%).
MDD during year: 11%.

Questions:
a) Year 1: Calculate Expectancy, Profit Factor, Calmar Ratio.
b) Year 2: Calculate same metrics.
c) Combined: Did performance improve from Year 1 to Year 2? Which metrics improved?
d) The Win Rate dropped from 44% to 42% in Year 2. Is this concerning? Why or why not?
e) MDD improved from 14% to 11%. What likely caused this improvement?
f) Compound calculation: Starting with ₹20L:
   Year 1: +46% → ₹29.2L.
   Year 2: +44% → ₹42.1L.
   Project Year 3 at same 44% return: Account?
   Project Year 5: Account?
   Project Year 10: Account?
g) The 2-year Calmar Ratio (average annual return / highest MDD across both years):
   Average annual return = 45%. Highest MDD = 14%. Calmar?
h) If Year 3 produces a 20% drawdown (a bad year):
   What action triggers at what account level?
   What is the account value at which Rule 5 (full stop) activates?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** What is the R-Multiple system? What is 1R, and why does expressing all trade outcomes in R-multiples improve trading analysis?

**Q2.** What is Expectancy? Write the formula. Calculate expectancy for: Win rate 45%, Avg Win +2.9R, Avg Loss −1.0R.

**Q3.** Why is a 40% win rate with 3:1 R:R more profitable than a 70% win rate with 1:1 R:R? Show the expectancy calculation for each to prove it.

**Q4.** What are the total NSE round-trip trading costs for 1 Nifty futures lot trade (Zerodha/Upstox)? What is the cost drag in R per trade if 1R = ₹11,850?

**Q5.** Write the position sizing formula (lots). Calculate: Account ₹25L, risk 1%, Entry 24,280, Stop 23,806, Lot size 25. How many lots?

**Q6.** What is Maximum Drawdown (MDD)? Why does a 50% drawdown require a 100% gain to recover? Explain the asymmetric recovery mathematics.

**Q7.** State all 5 professional drawdown rules for a ₹20L account. What is the trigger and action for each?

**Q8.** What is Profit Factor? Calculate PF for: 8 winning trades at avg +₹32,000 and 12 losing trades at avg −₹11,850. Is this a good system?

**Q9.** What is the Calmar Ratio? Calculate for: Annual return 42%, MDD 14%. Is this result above or below the professional target?

**Q10.** Describe the trade journal analytics framework. What 7 fields must be recorded pre-trade, and what 7 performance metrics are calculated periodically?

### Chart Questions (5)

**S1.** Calculate R-multiples and P&L for this trade:

Entry: Nifty 23,980. Stop: 23,516. T1: 24,900 (Call Wall). T2: 25,400 (next HVN). Lots: 2 (25 units each). Account: ₹20L.

a) 1R in points.
b) 1R in rupees (per lot and both lots).
c) T1 in R (how many R is the target from entry?).
d) T2 in R.
e) Outcome: T1 hit, then LPS, then T2 hit (all position held). Total R and rupees.
f) Outcome: Stop hit. Total R and rupees loss.
g) Optimal exit strategy: At T1, exit 50%. At T2, exit remaining 50%. Calculate blended P&L.

**S2.** Expectancy tracking over 40 trades:

Trades 1–20: Win Rate 35%. Avg Win +2.8R. Avg Loss −1.0R. E = ?
Trades 21–40: Win Rate 50%. Avg Win +3.2R. Avg Loss −1.0R. E = ?

a) Calculate E for each 20-trade block.
b) Did performance improve from block 1 to block 2?
c) Overall 40 trades: Weighted Win Rate = (7+10)/40 = 42.5%. What is the combined E?
d) At 1R = ₹20,000: Total rupees earned over 40 trades.
e) If the next 20 trades show Win Rate = 30%, Avg Win +3.8R, Avg Loss −1.0R: Calculate E. Has the edge degraded?

**S3.** Drawdown analysis:

Account equity (₹ Lakhs) over 6 months:

Month | Account
Start | 20.0
Month 1 | 23.4 (peak)
Month 2 | 21.8
Month 3 | 19.6
Month 4 | 18.2
Month 5 | 19.8
Month 6 | 22.1 (new peak)

a) Calculate MDD (from Month 1 peak to Month 4 trough).
b) At Month 3 (−8% from peak): Which drawdown rule triggers?
c) At Month 4 (−12.4% from peak): Which rules trigger?
d) From Month 4 to Month 5: Account partially recovers. Are you back to full size? Why?
e) Month 6: New equity peak at ₹22.1L. What does this confirm about the system?
f) Calmar Ratio: If annual return = (22.1−20)/20 × 100/0.5 years = 21% annualized. MDD = 12.4%. Calmar?

**S4.** Performance metrics from annual record:

Year summary:
→ 72 trades. 30 wins. 42 losses.
→ Wins: avg +3.0R each. Losses: avg −1.0R each.
→ Account: ₹25L. 1R = ₹25,000 per trade.
→ MDD during year: ₹3,75,000 from peak.

a) Win rate %.
b) Expectancy per trade.
c) Total R earned.
d) Total rupees earned.
e) Annual return % on ₹25L account.
f) Profit Factor.
g) MDD % (from peak).
h) Calmar Ratio.
i) Is this system meeting all 4 professional benchmarks (E > +0.50R, PF > 1.5, MDD < 15%, Calmar > 2.0)?

**S5.** Position sizing optimisation:

You have a ₹30L account. Three setups are available today:

Setup A (5-star): Nifty LPS. Entry 24,280. Stop 23,806 (474 pts). All 6 institutional layers confirmed. MTF aligned. 1.5% risk allowed.

Setup B (3-star): Bank Nifty LPS. Entry 52,400. Stop 51,200 (1,200 pts). 3 of 6 layers confirmed. 0.5% risk.

Setup C (2-star): Individual stock LPS (HDFC Bank). Entry ₹1,680. Stop ₹1,620 (₹60). 2 of 6 layers confirmed. 0.25% risk.

Calculate:
a) Setup A: Rupees at risk. Nifty futures lot = 25. How many lots?
b) Setup B: Rupees at risk. Bank Nifty lot = 15. How many lots?
c) Setup C: Rupees at risk. HDFC Bank lot = 550 shares. How many lots?
d) Total capital at risk (if all 3 taken simultaneously): Is this within prudent limits?
e) If Setup A T1 = 25,000 (call wall, 720 points away): R:R?
f) If all 3 are taken and Setup A hits T1, B and C hit stops: Net P&L in R?
g) Which setup should receive the most capital? Why?

---

## QUIZ ANSWERS

**A1.** R-Multiple system: R = 1R = The maximum risk on a single trade, defined before entry as the distance from entry to stop loss in price × lot size. All trade outcomes are expressed as multiples of R. If entry = 24,280, stop = 23,806: 1R = 474 points. A trade that closes at 25,228 makes 948 points = +2R. A stop hit makes −474 points = −1R. Why R-multiples improve analysis: (1) Removes rupee bias: A ₹47,400 loss and a ₹12,000 gain cannot be compared directly (different instruments, different lot sizes, different stops). But −1R and +0.25R can be compared instantly. All trades speak the same language. (2) Enables cross-instrument comparison: Nifty trades, Bank Nifty trades, individual stock trades — all measured in R. Portfolio analytics become meaningful. (3) Forces pre-entry risk definition: You CANNOT calculate R retrospectively. You must define stop BEFORE entry. This discipline eliminates "I didn't have a stop" disasters. (4) Makes position sizing automatic: Each trade risks exactly 1R = 1% of account. No trade-by-trade guessing about how much to risk.

**A2.** Expectancy formula and calculation: E = (Win Rate % × Avg Win in R) − (Loss Rate % × Avg Loss in R). For Win Rate 45%, Avg Win +2.9R, Avg Loss −1.0R: E = (0.45 × 2.9) − (0.55 × 1.0) = 1.305 − 0.55 = +0.755R per trade. Meaning: For every ₹1 risked per trade (1R), this system earns ₹0.755 on average. For 1R = ₹20,000 and 60 trades per year: Annual expectancy = 0.755 × 60 × ₹20,000 = ₹9,06,000. On a ₹20L account: 45.3% annual return. The system has a clear positive edge of +0.755R per qualifying trade. After NSE cost drag (≈0.016R per trade): Net expectancy = 0.755 − 0.016 = +0.739R per trade. Still strongly positive.

**A3.** 40% win rate with 3:1 R:R vs 70% win rate with 1:1 R:R: System A (Professional Wyckoff): Win Rate 40%, Avg Win +3.0R, Avg Loss −1.0R. E = (0.40 × 3.0) − (0.60 × 1.0) = 1.20 − 0.60 = +0.60R per trade. System B (Retail typical): Win Rate 70%, Avg Win +1.0R, Avg Loss −1.0R. E = (0.70 × 1.0) − (0.30 × 1.0) = 0.70 − 0.30 = +0.40R per trade. System A: +0.60R per trade. System B: +0.40R per trade. System A is 50% MORE profitable per trade despite winning only 40% of the time. After NSE cost drag (0.016R per trade): System A nets +0.584R. System B nets +0.384R. The gap grows after costs. Additional advantage of System A: Psychology is better. Expected to lose 60% of the time = Losses are EXPECTED (no emotional shock). Wins are 3× the risk = Highly satisfying. System B psychology: Expected to win 70% of the time. A losing run (5 losses from 10 = NORMAL for 30% loss rate) feels catastrophic and triggers revenge trading. System B traders often abandon their system during normal variance. System A traders expect losing streaks and plan for them.

**A4.** NSE round-trip trading costs for 1 Nifty futures lot (Zerodha/Upstox): Brokerage: ₹20 × 2 legs = ₹40. STT: 0.01% of sell turnover. For 1 lot at 24,280: Turnover = 24,280 × 25 = ₹6,07,000. STT = 0.01% × ₹6,07,000 = ₹60.70 per sell leg. NSE Exchange charges: 0.00173% of turnover × 2 legs = ₹21. SEBI charges: 0.0001% × 2 legs = ₹2.42. GST: 18% on (brokerage + exchange charges) = 18% × (₹40 + ₹21) = ₹10.98. Stamp duty: 0.003% on buy turnover = 0.003% × ₹6,07,000 = ₹18.21. TOTAL: ≈ ₹153 per round trip. Cost drag in R: If 1R = ₹11,850 (474 points × 25): Cost drag = ₹153 / ₹11,850 = 0.013R per trade. For 80 trades per year: Annual cost drag = 0.013 × 80 = 1.04R. This 1R annual cost drag must be covered by the system's positive expectancy. At +0.76R per trade and 80 trades: Gross annual R = 60.8R. Net after costs = 60.8 − 1.04 = 59.76R. Costs are < 2% of gross returns at this scale. Negligible for a high-expectancy system.

**A5.** Position sizing formula and calculation: Formula: Lots = (Account × Risk %) / ((Entry − Stop) × Lot Size). For ₹25L account, 1% risk, Entry 24,280, Stop 23,806, Lot 25: Rupees at risk = ₹25,00,000 × 1% = ₹25,000. Points risked = 24,280 − 23,806 = 474 points. Loss per lot = 474 × 25 = ₹11,850 per lot. Lots = ₹25,000 / ₹11,850 = 2.11 → Round down to 2 lots. Actual risk with 2 lots = 2 × ₹11,850 = ₹23,700 = 0.948% of ₹25L. Slightly below 1% (conservative, correct). Anti-rounding rule: ALWAYS round DOWN (never up) to avoid exceeding the 1% risk limit. The unused ₹1,300 stays in cash for the next trade.

**A6.** Maximum Drawdown (MDD) and asymmetric recovery: MDD = (Peak Equity − Trough Equity) / Peak Equity × 100. It measures the largest loss from any equity high to subsequent low, as a percentage of the high. The asymmetric recovery mathematics: If you START with ₹20L: A 50% loss takes you to ₹10L. To return from ₹10L to ₹20L: You need to GAIN ₹10L. But ₹10L gain on a ₹10L base = +100%. NOT 50%. The loss was 50% of ₹20L = ₹10L. The required recovery is 100% of ₹10L = ₹10L. SAME absolute amount. Different percentage because the BASE is now smaller. This asymmetry gets WORSE as drawdowns get larger: 75% drawdown leaves ₹5L. Need +300% to return to ₹20L. 90% drawdown leaves ₹2L. Need +900% to return. The implication: PREVENTING a 50% drawdown is more valuable than generating a 50% gain. The gain partially cancels losses. The drawdown prevention creates NO such offset. Capital preservation is the PRIMARY objective, not return maximization.

**A7.** 5 Professional drawdown rules (₹20L account): Rule 1 (Per Trade): Max 1% risk = ₹20,000 per trade. If stop hit = ₹20,000 maximum loss. Non-negotiable. No exceptions. Rule 2 (Daily): If down 3% in one day (₹60,000 = 3 losing trades): STOP TRADING FOR THE DAY. Resume tomorrow fresh. Prevents revenge trading after consecutive losses. Rule 3 (Weekly): If down 5% in a week (₹1,00,000): STOP AND REASSESS. Review all week's trades. Were setups valid? Any protocol deviations? Identify causes before resuming. Rule 4 (Monthly): If down 8–10% in a month (₹1,60,000–₹2,00,000): REDUCE POSITION SIZE TO 50% (0.5% per trade). Trade at half size until two consecutive profitable months. Then restore 1% risk. Rule 5 (Maximum Drawdown): If account draws down 20% from peak (₹4,00,000 below any peak value): COMPLETE HALT. No trading for minimum 2 weeks. Forensic review of ALL trades. Resume at 25% size (0.25% per trade). Rebuild to 50% after one profitable month. Rebuild to 100% after two profitable months.

**A8.** Profit Factor: PF = Total Gross Profit / Total Gross Loss. For 8 wins × avg +₹32,000 = ₹2,56,000 gross profit. 12 losses × avg −₹11,850 = ₹1,42,200 gross loss. PF = ₹2,56,000 / ₹1,42,200 = 1.80. Interpretation: This system generates ₹1.80 for every ₹1.00 lost. PF = 1.0 = break-even. PF = 1.80 = 80% more profit than loss. Is this a good system? YES. PF = 1.80 is above the 1.5 minimum professional target. It falls short of the 2.0 professional target but is solidly positive. The win rate (8/20 = 40%) combined with the PF of 1.80 = Consistent with a Wyckoff-style system (lower win rate, higher per-win R). Note: Avg win = ₹32,000 / ₹11,850 = 2.7R. Win rate 40%. E = (0.40 × 2.7) − (0.60 × 1.0) = 1.08 − 0.60 = +0.48R. Slightly below the +0.50R benchmark. The avg win size needs to improve (let winners run further to T2).

**A9.** Calmar Ratio: Calmar = Annualised Return % / Maximum Drawdown %. For Annual Return 42%, MDD 14%: Calmar = 42 / 14 = 3.0. Professional target: Calmar > 2.0. This result (3.0) is ABOVE the professional target. It means: For every 1% of maximum drawdown pain endured, the system returns 3% annually. Interpretation: Excellent risk-adjusted performance. The return is 3× the maximum pain taken. This is the sign of a well-managed, high-expectancy system with proper position sizing and drawdown rules. The Calmar Ratio is particularly useful because it explicitly captures the relationship between gain and pain. A 42% return with a 5% MDD (Calmar = 8.4) is dramatically superior to 42% with a 35% MDD (Calmar = 1.2). Calmar normalises the comparison.

**A10.** Trade journal analytics framework: Pre-trade mandatory fields (7): (1) Date/Session/Instrument/Entry Time. (2) Weekly Phase / Daily Event / Intraday Trigger (3 layers identified). (3) MTF Stars (x/5) and Scorecard (x/65). (4) Entry Price / Stop / T1 / T2. (5) 1R calculation (Entry − Stop in points and rupees). (6) Lots and exact rupees at risk (risk %). (7) Options details if applicable (Strike, Expiry, Premium, Max loss). Performance metrics (calculated every 20 trades): (1) Win Rate %. (2) Average Win in R. (3) Average Loss in R. (4) Expectancy E = (Win% × Avg Win) − (Loss% × Avg Loss). (5) Profit Factor = Total positive R / |Total negative R|. (6) Maximum Drawdown in R (peak-to-trough in cumulative R curve). (7) Avg R per trade annualised (Expectancy × annual trade frequency).

---

## KEY TAKEAWAYS

> **1. If you cannot calculate your expectancy, you do not know whether you have an edge. Expectancy = (Win% × Avg Win R) − (Loss% × Avg Loss R). The Wyckoff LPS framework targets +0.65R to +0.90R per trade — mathematically proven positive expectancy after NSE costs.**

> **2. A 40% win rate with 3:1 R:R (E = +0.60R) beats a 70% win rate with 1:1 R:R (E = +0.40R) every time. Stop maximising win rate. Maximise expectancy. The uncomfortable truth: You should EXPECT to lose more trades than you win in a high-expectancy Wyckoff system.**

> **3. Position sizing formula: Lots = (Account × 1%) / (Entry − Stop) / Lot Size. Always round DOWN. Never round up. This is the single most important formula in trading. It ensures every losing trade costs exactly 1%, and every winning trade compounds the account geometrically.**

> **4. A 50% drawdown requires a 100% gain to recover. Preventing drawdowns is MORE valuable than generating gains. The 5 drawdown rules (per trade, daily, weekly, monthly, maximum) are your insurance policy against capital destruction — which eliminates all future opportunities.**

> **5. Performance metrics — the 5 benchmarks for a professional system: Expectancy > +0.50R. Profit Factor > 1.5. Maximum Drawdown < 15%. Calmar Ratio > 2.0. Annual return > 30% (at 1% risk per trade, 50+ qualifying trades). Track these every 20 trades. Systems that consistently meet these benchmarks generate geometric compounding.**

---

*Quantitative Analysis — Complete. Part XIX is complete.*

*Next topic in the plan: **Professional Workflow** (Part XX).*

*Ready? Say: **"NEXT CHAPTER"***
