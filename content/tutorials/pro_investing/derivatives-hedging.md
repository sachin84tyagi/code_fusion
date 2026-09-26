# Chapter 23 — Derivatives and Hedging

> **Course:** NSE/BSE Professional Volume + Price Action + VSA + Wyckoff + Market Microstructure
> **Part:** XV — Derivatives and Hedging
> **Prerequisite:** Chapters 3–5 (order types, microstructure), Chapter 19 (risk management), Chapter 22 (sector analysis)

---

## Chapter Overview

Derivatives are the most powerful and most misused instruments in the NSE toolkit. Used correctly, they transform a stock trader's risk profile: defining maximum loss precisely (through long options), amplifying return on capital (through futures leverage), and protecting an existing portfolio from correlated risk (through hedging). Used incorrectly, they destroy accounts faster than any other instrument — and with mathematical certainty, because most retail option buyers lose money over time as Theta erodes their premium while they wait for a move that never comes in time.

This chapter does not teach you to trade options for income (that is option selling — a separate skill with separate risks). It teaches you the **professional application of derivatives** within the Wyckoff framework: using defined-risk option structures at high-conviction Wyckoff events, using futures for leverage with structural stops, and using index hedges to protect a cash equity portfolio during distribution phases.

**The Chapter 23 Rule:**

> **Derivatives are tools for specific purposes, not instruments to trade because they are "exciting." The purpose of options in this system is RISK DEFINITION. The purpose of futures is LEVERAGE WITH DEFINED RISK. The purpose of hedging is PORTFOLIO PROTECTION. Every derivative position must have a stated purpose before it is entered.**

---

## LEVEL 1 — BEGINNER

### 23.1 F&O Mechanics on NSE — The Foundation

**The three core concepts:**

```
FUTURES CONTRACT:
→ An agreement to buy/sell an underlying asset at a fixed price on a future date
→ On NSE: You can be Long (bullish) or Short (bearish) a futures contract
→ P&L: Every ₹1 move in the underlying = Lot Size × ₹1 profit or loss
→ No premium — futures reflect the underlying price closely (basis = futures − spot)
→ Risk: Theoretically unlimited on both sides (no cap on loss if no stop loss)

OPTIONS CONTRACT:
→ The RIGHT (but not obligation) to buy (Call) or sell (Put) an underlying
   at a specified STRIKE PRICE by a specified EXPIRY DATE
→ CALL = right to buy → benefits from price RISING
→ PUT = right to sell → benefits from price FALLING
→ For the BUYER: Maximum loss = Premium paid. Unlimited upside (call) / 
                 large downside capture (put).
→ For the SELLER: Maximum profit = Premium collected. 
                  Unlimited loss (uncovered call) / large loss (uncovered put).
→ CRITICAL RULE: In this course, we ONLY teach option BUYING. 
                  Option selling requires a separate level of capital, 
                  risk management infrastructure, and expertise.

HEDGING:
→ Holding a position that OFFSETS the risk of an existing position
→ Example: You hold 10,000 shares of Nifty Bank stocks (long) 
           AND hold Nifty short futures (short) as a hedge.
           If market falls: Stock losses are offset by futures profit.
           If market rises: Stock profits offset futures loss.
→ Purpose: Reduce portfolio volatility during periods of uncertainty
           (e.g., F&O expiry, RBI event, budget day)
```

**NSE F&O Universe — Key Specifications:**

```
NIFTY 50 FUTURES AND OPTIONS:
Lot Size: 25 units
Tick Size: ₹0.05
Monthly expiry: Last Thursday of every month
Weekly expiry: Every Thursday (weekly options available)
Margin (SPAN): ~₹1.8L–₹2.2L per lot (varies with VIX)

BANK NIFTY FUTURES AND OPTIONS:
Lot Size: 15 units
Tick Size: ₹0.05
Monthly expiry: Last Thursday
Weekly expiry: Every Wednesday (Bank Nifty has Wednesday weekly expiry)
Margin: ~₹50,000–₹70,000 per lot

INDIVIDUAL STOCK OPTIONS (F&O stocks):
Only stocks on NSE's F&O list (approximately 200 stocks)
Lot sizes vary by stock (HDFC Bank: 550, Reliance: 250, Infosys: 300, etc.)
Monthly expiry only for stock options
Strike intervals: ₹10 to ₹100 depending on stock price

KEY NSE CALENDAR:
→ NSE F&O list: nseindia.com → Derivatives → F&O eligible stocks
→ Lot size changes: Announced when stock price crosses thresholds
→ Dividend alert: Options adjust for dividends above 10% of face value
```

**The moneyness spectrum:**

```
ITM = In The Money: Option has intrinsic value
→ Call ITM: Strike BELOW current price (e.g., stock at ₹480, ₹460 Call = ITM)
→ Put ITM: Strike ABOVE current price (e.g., stock at ₹480, ₹500 Put = ITM)
→ ITM options have HIGH delta, HIGH premium, LOW time value percentage

ATM = At The Money: Strike ≈ current price
→ Highest Gamma, Highest Theta impact, Most liquid, Most active
→ Premium = mostly time value (very little intrinsic value)

OTM = Out of The Money: Option has zero intrinsic value
→ Call OTM: Strike ABOVE current price
→ Put OTM: Strike BELOW current price
→ OTM options: Cheap premium, LOW delta, HIGH time value % — most expire worthless
→ Far OTM calls/puts are lottery tickets. Professional rule: NEVER buy far OTM options
   with speculative intent in this system.
```

---

### 23.2 The Four Option Greeks in Plain English

![The Option Greeks — A Practical NSE Trader's Guide](/images/pi-option-greeks-visual.jpg)

**Delta — Directional Sensitivity:**

```
Delta = How much the option's price changes per ₹1 move in the underlying

Call options: Delta from 0 to +1
Put options: Delta from 0 to −1

Deep ITM Call (Delta ≈ 0.90): Behaves almost like owning the stock.
                               Every ₹1 stock rise = ~₹0.90 option gain.
ATM Call (Delta ≈ 0.50):      50/50 sensitivity. Most liquid.
                               ₹1 stock rise = ~₹0.50 option gain.
Far OTM Call (Delta ≈ 0.10):  Lottery ticket.
                               ₹1 stock rise = only ~₹0.10 option gain.

PRACTICAL USE:
For Wyckoff LPS entries: Use ITM Call (Delta 0.65–0.75).
Reason: The option behaves close to the stock. The Wyckoff move to T1
(typically +6–10% from LPS) is efficiently captured.

"Dollar equivalent" of a position:
ITM Call, Delta 0.72, 1 lot of 550 shares:
Equivalent stock exposure = 0.72 × 550 × ₹480 = ₹1,90,080 of stock exposure.
But your risk = only the premium paid (e.g., ₹28 × 550 = ₹15,400).
```

**Theta — Time Decay:**

```
Theta = How much the option loses in value per calendar day (all else equal)

Theta is ALWAYS NEGATIVE for option buyers.
Every day that passes WITHOUT a significant price move: Premium erodes.

NSE Example:
Nifty 50 at 24,500. You buy 24,500 Call at ₹180. Theta = −₹8 per day.
If Nifty stays at 24,500:
Day 0: ₹180
Day 1: ₹172
Day 7: ₹124
Day 14: ₹68
Day 21: ₹0 (approximately, at expiry)

Theta ACCELERATION curve:
4 weeks to expiry: −₹3/day (slow decay)
3 weeks: −₹5/day
2 weeks: −₹8/day
1 week: −₹15/day
Expiry day: Maximum (premium evaporates rapidly)

PROFESSIONAL RULES for option buyers:
Rule 1: Always buy options with MINIMUM 3–4 weeks to expiry.
        This gives the Wyckoff trade time to develop without heavy theta erosion.
Rule 2: If an option has 1 week to expiry and is not significantly profitable: EXIT.
        Do not hold into expiry week hoping for a reversal — theta will destroy you.
Rule 3: Never hold a bought option that is significantly OTM in the last 5 days
        to expiry. The theta acceleration makes recovery mathematically very difficult.
```

**Vega — Volatility Sensitivity:**

```
Vega = How much the option's price changes per 1% change in Implied Volatility (IV)

Implied Volatility (IV) = The market's expectation of future price movement,
                          implied by the current option premium level.
                          Higher IV → Higher premium. Lower IV → Lower premium.

When IV RISES (before events, during uncertainty): Options gain value.
When IV FALLS (IV Crush — after events): Options lose value.

NSE IV Crush Events:
→ RBI MPC decision (announced)
→ Union Budget
→ Quarterly results (TCS, Infosys, Reliance)
→ US Federal Reserve meetings
→ Nifty/Bank Nifty expiry day (IV collapses as uncertainty resolves)

The IV Crush trap:
You correctly predict the RBI cuts rates. You bought Nifty Calls.
RBI cuts → market rises 1.2% → Your Call premium FALLS by 15%.
Why? The IV contracted from 18% to 12% on the event resolution.
The 12% Vega loss exceeded the 1.2% Delta gain.

PROFESSIONAL RULE: Do not buy options within 3 trading sessions of a major event.
If you already hold: Roll or exit BEFORE the event.
If you want the trade post-event: Wait for IV to crush, THEN buy.
```

**Gamma — Acceleration:**

```
Gamma = How fast Delta changes per ₹1 move in the underlying

High Gamma: Delta changes rapidly (ATM options, near expiry)
Low Gamma: Delta changes slowly (deep ITM or far OTM, long-dated)

PRACTICAL EXAMPLE:
ATM Call. Delta = 0.50. Gamma = 0.08.
Stock rises ₹1: New Delta = 0.50 + 0.08 = 0.58
Stock rises another ₹1: New Delta = 0.58 + 0.08 = 0.66
Stock rises another ₹1: New Delta = 0.66 + 0.08 = 0.74

This ACCELERATION is why ATM options near expiry can produce 200-400% gains
on large moves. The Delta keeps INCREASING as the stock moves in your favour.

NSE Gamma Squeeze on Expiry Thursday:
Bank Nifty ATM options (Wednesday expiry):
A 200-point Bank Nifty move in the final hour:
An ATM Call that was ₹15 at 2:00 PM can be worth ₹180 at 3:25 PM.
Why: 12× gain in 85 minutes from Gamma acceleration.

THE DANGER: Gamma also works AGAINST you with equal force.
If Bank Nifty moves 200 points AGAINST your long call on expiry day:
That ₹15 Call goes to ₹0 in the same 85 minutes.
Gamma is a double-edged sword near expiry. Use with extreme caution.
```

---

### 23.3 Wyckoff + Options — The Complete Strategy Matrix

![Wyckoff + Options Strategy Matrix — Which Option for Which Wyckoff Event](/images/pi-wyckoff-options-strategies.jpg)

**The core principle:**

```
WYCKOFF answers DIRECTION and PROBABILITY.
OPTIONS answer RISK DEFINITION and CAPITAL EFFICIENCY.
Combined: The Wyckoff event tells you WHEN to enter and in WHICH DIRECTION.
          The option structure determines HOW MUCH you can lose (defined by premium)
          and HOW MUCH you can gain (by the magnitude of the markup/markdown).
```

**Strategy 1 — LPS Long → Buy ITM Call:**

```
Wyckoff context: Phase D accumulation. SOS confirmed. LPS forming.
Option selection: ITM Call, 1 strike below current price.
                 Minimum 4 weeks to expiry (buy the monthly, not weekly).

Why ITM, not ATM or OTM?
→ ITM: Delta ≈ 0.70–0.80. Moves with the stock efficiently.
→ ATM: Delta ≈ 0.50. Slower response. Too much of premium is time value.
→ OTM: Delta ≈ 0.15–0.25. Stock must move significantly just to offset theta.
        For a Wyckoff LPS (moderate move expected), OTM usually expires worthless.

NSE worked example:
HDFC Bank at ₹1,728 (LPS). Spring low: ₹1,680.
T1 (Volume Profile HVN): ₹1,820. T2: ₹1,900.

Stock approach (Chapter 19): 
Risk: ₹1,728 − ₹1,680 = ₹48/share. Position: 208 shares (₹10,000 / ₹48).

Options approach:
Buy ₹1,700 Call (ITM by ₹28). Premium: ₹58. Delta: 0.68.
Lot size: 550 shares. Premium cost: ₹58 × 550 = ₹31,900 per lot.
Risk: ₹31,900 (maximum loss = premium, if HDFC Bank goes to zero below ₹1,700 by expiry)
But actual risk if trade fails: The option will be worth ~₹28 (intrinsic value = ₹1,728−₹1,700)
if HDFC Bank falls to the Spring low (₹1,680). So you lose: ₹58 − ₹28 = ₹30 × 550 = ₹16,500.
Equivalent 1R = ₹16,500 on this options position.

At T1 (₹1,820): ₹1,700 Call premium ≈ ₹120–₹130. Profit: ₹62–₹72 × 550 = ₹34,100–₹39,600.
R-multiple: ~+2R to +2.4R (good, slightly lower than stock because of theta erosion)
```

**Strategy 2 — Spring → Buy ATM Call or Bull Call Spread:**

```
Why ATM for Spring:
→ The Spring is the LOWEST point of the accumulation
→ Maximum upside potential (the entire markup begins here)
→ ATM Call has maximum Gamma → accelerates powerfully through the SOS and markup
→ The risk is accepting more theta burn if the Spring takes time to confirm

Bull Call Spread (for cost reduction):
Buy ATM Call + Sell OTM Call at the T2 target.
Example: Stock at ₹472 (Spring). 
  Buy ₹470 Call at ₹22. Sell ₹530 Call at ₹6.
  Net premium: ₹22 − ₹6 = ₹16 (maximum loss).
  Maximum profit: ₹530 − ₹470 − ₹16 = ₹44 (at T2 = ₹530).
  Risk/Reward: Risk ₹16, Max gain ₹44 = 2.75R. Clean and defined.
```

**Strategy 3 — UTAD/LPSY → Buy ITM Put or Bear Put Spread:**

```
ITM Put for UTAD/LPSY:
→ Mirror image of the LPS Call strategy
→ ITM Put (strike above current price) has Delta ≈ −0.65 to −0.75
→ Behaves like a short position without unlimited upside loss
→ After UTAD: Markdown is typically fast (distribution → panic selling)
   High Delta put captures this move efficiently

Bear Put Spread:
Buy ATM Put + Sell OTM Put (at T2 level = the markdown target).
Example: Stock at ₹842 (LPSY). T2: ₹760.
  Buy ₹840 Put at ₹28. Sell ₹760 Put at ₹8.
  Net premium: ₹28 − ₹8 = ₹20.
  Maximum profit: ₹840 − ₹760 − ₹20 = ₹60 (at T2 = ₹760).
  Risk/Reward: Risk ₹20, Max gain ₹60 = 3R. Defined and efficient.
```

---

## LEVEL 2 — INTERMEDIATE

### 23.4 Futures Hedging — Protecting Your Cash Portfolio

**When and why to hedge:**

```
A hedge is used when:
1. You hold a strong, well-performing cash equity portfolio
   AND you face a short-term risk event (RBI, budget, expiry)
   AND you do NOT want to sell your positions (tax, delivery, long-term thesis intact)

2. Your portfolio heat is near the maximum (10%) AND a new Wyckoff
   distribution event is appearing at the index level
   → You cannot add new short positions without exceeding portfolio heat
   → A futures hedge allows you to REDUCE DELTA (market exposure)
     without closing individual stock positions

WHAT HEDGING IS NOT:
→ Hedging is not a reason to hold bad positions "because I'm hedged"
→ Hedging does not eliminate loss — it REDUCES it
→ A perfect hedge = zero profit AND zero loss. This is rarely the goal.
   The goal is PARTIAL hedging: reduce portfolio sensitivity by 40–60%
   during high-uncertainty periods.
```

**The portfolio delta hedge calculation:**

```
STEP 1 — Calculate your portfolio's Nifty Beta:
Beta measures how much your portfolio moves per 1% Nifty move.
→ HDFC Bank: Beta ≈ 1.1 (moves 1.1% for every 1% Nifty move)
→ Infosys: Beta ≈ 0.85
→ Reliance: Beta ≈ 0.92
→ Tata Motors: Beta ≈ 1.3

Portfolio Beta = Σ(Stock Beta × Portfolio Weight)
Example:
₹3L HDFC Bank (35% weight, Beta 1.1)
₹2L Infosys (24% weight, Beta 0.85)
₹2L Reliance (24% weight, Beta 0.92)
₹1.5L Tata Motors (17% weight, Beta 1.3)
Portfolio Beta = (0.35 × 1.1) + (0.24 × 0.85) + (0.24 × 0.92) + (0.17 × 1.3)
              = 0.385 + 0.204 + 0.221 + 0.221 = 1.031

STEP 2 — Calculate Nifty futures lots for hedge:
Number of lots = (Portfolio Value × Portfolio Beta) / (Nifty Level × Lot Size)
              = (₹8,50,000 × 1.031) / (24,500 × 25)
              = ₹8,76,350 / ₹6,12,500
              = 1.43 lots → ROUND DOWN to 1 lot (conservative hedge)

STEP 3 — Execute:
Short 1 lot of Nifty Futures at current price.
Now: If Nifty falls 1% (₹245):
→ Portfolio loses: ₹8,50,000 × 1.031 × 1% = ₹8,764
→ Nifty short profit: 1 lot × 25 × ₹245 = ₹6,125
→ Net portfolio loss: ₹8,764 − ₹6,125 = ₹2,639 (vs ₹8,764 unhedged)
→ Hedge effectiveness: 70% protection
```

**NSE-specific hedge instruments:**

```
NIFTY 50 FUTURES: Hedge for large-cap Nifty stocks (most correlations > 0.7)
BANK NIFTY FUTURES: Better hedge for banking stocks specifically
SECTOR FUTURES (where available): Auto, IT, Pharma futures for sector-specific hedging

BUYING PUTS AS HEDGE (insurance approach):
Instead of short futures (unlimited loss if market rises):
Buy Nifty/Bank Nifty Put options as "portfolio insurance"
→ Maximum cost = premium paid
→ If market rises: Put expires worthless, but portfolio profits
→ If market falls: Put profit offsets portfolio loss

Portfolio Insurance cost:
1-month, 2% OTM Nifty Put: ~₹80–₹120 premium (varies with IV)
Cost as % of portfolio: ₹80 × 25 lots / ₹8,50,000 = ~0.23% per month
Think of it as: "Paying 0.23% of portfolio for one month of protection against a >2% fall"

WHEN to buy portfolio insurance:
→ When VIX is LOW (below 14): IV is cheap → puts are cheap → buy insurance
→ BEFORE major events (RBI, budget): Premium will rise → buy before the rise
→ When portfolio is at maximum heat (10%) and you see distribution signs at index level
```

---

### 23.5 NSE Expiry Dynamics — Weekly vs Monthly

**Understanding NSE's expiry structure is critical for any derivative user:**

```
NIFTY 50 EXPIRY:
→ Monthly: Last Thursday of each month
→ Weekly: Every Thursday (4–5 expiries per month)

BANK NIFTY EXPIRY:
→ Monthly: Last Thursday of each month  
→ Weekly: Every Wednesday

F&O expiry is not just a date — it is an EVENT that creates:
(1) Gamma squeeze near ATM strikes on expiry day
(2) Pin risk: Market-makers and institutions push price toward maximum pain
    (the strike where the maximum number of options expire worthless)
(3) IV collapse: IV drops sharply as expiry approaches and uncertainty resolves
(4) Rollover activity: Traders roll positions from near-month to next-month expiry
```

**The Maximum Pain theory and Wyckoff:**

```
Maximum Pain = The strike price at which the total loss of option buyers 
               is maximised (i.e., where most options expire worthless)

Theory: Market makers are net short options (they sold options to retail buyers).
        They have an incentive to manage the price toward the strike where they
        keep maximum premium (= maximum retail pain).

NSE Evidence: Not consistent enough to trade mechanically, but:
→ On expiry days: Nifty/Bank Nifty often gravitates toward key round numbers
  (e.g., 24,500, 25,000) OR toward the open interest maximum strike
→ This is consistent with Wyckoff "manipulation" concepts — the CO manages
  price toward the level that maximises their profit (= maximum retail pain)

PRACTICAL RULES for expiry week:
Rule 1: Do NOT enter NEW options positions in the first 3 days of expiry week
        (Monday, Tuesday, Wednesday). Theta decay is at maximum — you are paying
        high premium for options that expire in < 3 days.

Rule 2: Do NOT open new stock positions on expiry Thursday.
        Gamma risk creates sharp intraday swings that can stop you out of valid setups.

Rule 3: Existing positions: If a stock option position is profitable in expiry week,
        TAKE PROFITS by Tuesday of expiry week. Don't try to hold to maximum profit.
        Gamma squeeze can reverse just as fast as it created the profit.

Rule 4: If you want NEXT month's trade: Wait until AFTER Thursday's expiry. 
        Then buy NEXT month's options — fresh theta clock, new IV level.
```

---

### 23.6 Combining Wyckoff + Futures: The Leveraged Structural Trade

For traders who want to use Futures (not options) within the Wyckoff framework:

**The Structural Futures Trade:**

```
SETUP: Wyckoff LPS confirmed on HDFC Bank.
Entry: ₹1,728 (LPS). Structural stop: ₹1,680 (below Spring low).
Risk per share: ₹48. T1: ₹1,820. T2: ₹1,900.

FUTURES POSITION:
HDFC Bank Futures, Lot size: 550 shares.
Entry: ₹1,729 (futures price ≈ spot + small basis)
Stop: ₹1,681 (below Spring low, adjusted for basis)
Risk per contract: (₹1,729 − ₹1,681) × 550 = ₹48 × 550 = ₹26,400

Account: ₹10,00,000. Max risk 1% = ₹10,000.
Contracts = ₹10,000 / ₹26,400 = 0.38 → MAXIMUM 0 full lots.

Problem: 1 lot already exceeds the 1% risk rule on a ₹10L account.
Options: 
(a) Use stock equity instead of futures (Chapter 19 calculation: 208 shares)
(b) Use a WIDER time horizon (reduce size on the futures position to 0.5 lot 
    equivalent by using mini or reduce account risk to 2.5% — NOT recommended)
(c) Only trade Nifty/Bank Nifty futures where lot sizes and tick risk are
    proportionally smaller relative to capital

THE KEY LESSON: Futures leverage amplifies BOTH gains AND losses.
For a ₹10L account, individual stock futures require a VERY wide stop to be 
used within risk rules. Most practitioners on sub-₹25L accounts use STOCK EQUITY
for individual stock Wyckoff trades and FUTURES only for index-level trades.
```

**Index Futures for Macro Wyckoff Trades:**

```
When Nifty 50 itself is in Wyckoff Phase D (post-SOS, LPS forming on daily):
→ The index trade is available via Nifty Futures or long Call option
→ This captures the MACRO markup at the index level

Nifty Futures LPS trade:
Nifty at 24,200 (LPS). Spring low: 23,800. Stop: 23,790.
Risk per point: Lot Size (25) × ₹1 = ₹25.
Risk per lot: (24,200 − 23,790) × 25 = 410 × 25 = ₹10,250.

Account: ₹15,00,000. Max risk 1% = ₹15,000.
Lots: ₹15,000 / ₹10,250 = 1.46 → MAXIMUM 1 lot.
Margin required: ~₹1.9L for 1 lot. Blocks 12.7% of account as margin.
Actual risk: ₹10,250 = 0.68% of account. Within rules.

T1: Volume Profile HVN at 24,600 (400 points × 25 = ₹10,000 profit = +0.97R)
T2: Next HVN at 25,100 (900 points × 25 = ₹22,500 profit = +2.2R)
```

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### 23.7 The IV Crush Trade — Selling Volatility Around NSE Events

**This section covers volatility trading using options spreads (not naked selling).**

**IV Lifecycle around NSE events:**

```
PRE-EVENT (1–4 weeks before):
→ IV gradually rises as uncertainty builds
→ Option premiums expand (Vega works FOR option buyers here)
→ This is the window to BUY options if you have a directional view

EVENT ANNOUNCEMENT:
→ If event is a surprise (unexpected): IV SPIKES and then normalizes
→ If event is in-line / as expected: IV CRUSHES immediately
→ IV Crush speed: Usually happens within the first 30–60 minutes of market open
   on the day after the announcement

POST-EVENT (1–3 days after):
→ IV settles at a new lower level (the "post-event baseline")
→ This is when Theta becomes the dominant force again
→ This is the window to buy options for the NEXT trend move
   (new catalyst = Wyckoff SOS/SOW triggered by the event)

NSE Annual IV Calendar (approximate):
January: Low IV (range-bound, post-December tax selling)
February: IV rising (Union Budget builds uncertainty)
Budget Day: IV crush post-announcement
March–April: IV moderate (Q4 results build)
April: IV spike for TCS/Infosys results
April–June: IV moderates
June: RBI MPC → IV event
July: Budget (if separate from February) / Mid-year results
October: Diwali muhurat session effects (minor)
November: Q2 results → IV events
December: Year-end, low IV, holiday effect

DIWALI EFFECT: October/November often see elevated IV before Diwali as HNIs
               and institutions manage year-end exposure. Historical pattern:
               Small/mid-cap accumulation in October (pre-Diwali) → markup in
               November–December (post-Diwali rally). Watch for SC events in
               September-October as the setup phase.
```

**The Post-Event Trend Trade (the safest IV timing):**

```
SEQUENCE:
Day 1: Event occurs (RBI cuts rates). IV crushes 30%.
Day 2–3: Market processes the event. Wyckoff SOS bar appears on Nifty Bank.
Day 4: Nifty Bank LPS pullback begins. IV has stabilized at new lower level.
Day 5: ENTRY: Buy Nifty Bank (or individual bank stock) ITM Call.
              IV is now LOW (post-crush). Vega is working in your favour
              (if there is any further uncertainty, IV will rise → bonus gain).
              The SOS confirmed direction (bullish). The LPS offers the entry.
              Theta is still working against you, but IV has already compressed.

THIS IS THE IDEAL TIME TO BUY OPTIONS:
→ Clear direction (Wyckoff SOS confirmed)
→ Low IV (post-event crush reduces premium cost)
→ High-probability setup (Nine Tests, institutional scorecard)
→ Minimum 4 weeks to expiry (buys time for theta, buys time for markup)
```

---

### 23.8 The Professional Hedging Framework — Portfolio-Level Risk Management

**The four-scenario hedge decision matrix:**

```
SCENARIO 1: Market in Phase D (markup). Portfolio performing well.
Action: NO HEDGE. Full exposure. Let winners run.
Rationale: Hedging in a markup = paying for protection you don't need.
           The cost of the hedge (negative carry on short futures, or put premium)
           reduces returns without a corresponding benefit.

SCENARIO 2: Market in Phase B/C (uncertain). Major event upcoming.
Action: PARTIAL HEDGE — buy portfolio insurance (OTM Puts).
        Insurance size: 50% of portfolio delta.
Cost: Accept 0.2–0.3% monthly premium cost as insurance.
Rationale: The event could be positive OR negative. You cannot know which.
           The insurance cap your downside while allowing full upside participation.

SCENARIO 3: Market showing Phase D DISTRIBUTION signals. UTAD visible.
Action: FULL HEDGE or SELECTIVE EXIT + SHORT.
        Exit the weakest 2–3 positions. Sell short 1–2 lots Nifty Futures.
        Buy protective puts on the largest 2–3 portfolio positions.
Rationale: Distribution is confirmed. Markdown is likely. Defensive mode.

SCENARIO 4: Market in Phase E Markdown. Clear downtrend.
Action: EXIT ALL LONGS. SWITCH TO SHORTS OR CASH.
        No hedge needed — the portfolio should be out of long positions.
        Capital goes into: Cash (wait for SC) + Short positions (via puts or short futures)
Rationale: There is no point hedging a falling portfolio. The cost of the hedge
           is less than the cost of watching the portfolio decline.
           EXIT, not hedge, is the correct Phase E response.
```

**The 7 Non-Negotiable Derivative Rules for NSE:**

```
RULE 1: NEVER buy weekly options on Monday or Tuesday with speculative intent.
         Weekly options expire in 3–4 days. Theta decay is catastrophic.
         Exception: Buying intraday on expiry day for a CONFIRMED breakout only.

RULE 2: NEVER buy far OTM options hoping for a "big move."
         Far OTM options (Delta < 0.15) expire worthless > 90% of the time.
         They are lottery tickets, not trading instruments.

RULE 3: NEVER average down on a losing option position.
         If an option has lost 50% of its value: The trade thesis is wrong.
         Exit. Do not buy more. The theta decay on the original + new position
         compounds the loss geometrically.

RULE 4: NEVER hold an option through a major event unless it is your hedge.
         IV crush will likely cause a loss even if the direction is correct.
         Either exit before the event or roll to a post-event position.

RULE 5: NEVER sell naked options (uncovered calls or puts) without
         explicit expertise and a dedicated risk management infrastructure.
         Naked call selling = unlimited risk if the underlying moves up sharply.
         Naked put selling = catastrophic risk if the underlying gaps down (Yes Bank 2020).

RULE 6: Size options positions using the same 1% risk rule.
         Maximum loss on any option position = 1–2% of account.
         For a ₹10L account: Maximum option premium per position = ₹10,000–₹20,000.
         Never size options positions by "lot" without calculating the risk.

RULE 7: MONITOR IV before every option purchase.
         Check the IV of the option relative to its 52-week IV range.
         If IV is in the 80th percentile or above (high): Avoid buying.
         Wait for IV to compress OR use a spread (buy ATM, sell OTM) to reduce Vega cost.
         If IV is in the 20th percentile or below (low): Ideal time to buy options.
```

---

## EXERCISES

### Beginner Exercises

**Exercise 23.1 — Greeks Identification**

For each option scenario, calculate/identify the relevant Greek and its effect:

a) You hold a Nifty 24,500 Call with Delta 0.52. Nifty moves from 24,500 to 24,650. How much does the Call premium approximately change?

b) You buy a stock Call option with Theta = −₹4. The stock stays flat for 8 days. How much has the option lost in time value?

c) You buy a Nifty Call 2 days before the RBI announcement. IV is at 19%. After the announcement (RBI holds, no surprise): IV falls to 13%. Vega of your Call is ₹0.82 per contract. What is the approximate premium loss from IV crush?

d) You hold an ATM Call with Gamma 0.06 and current Delta 0.51. Stock rises ₹3. What is the new approximate Delta?

e) A Far OTM Call has Delta 0.08. Stock rises ₹10. How much has the Call premium approximately increased? Is this efficient for a Wyckoff LPS trade?

**Exercise 23.2 — Moneyness and Strike Selection**

For each Wyckoff event and stock price, select the appropriate strike and expiry:

| Wyckoff Event | Stock/Index | Entry Price | Strategy | Strike | Expiry |
|---------------|-------------|------------|----------|--------|--------|
| LPS Long | HDFC Bank | ₹1,728 | Buy Call | ? | ? |
| Spring Long | TCS | ₹3,620 (Spring low) | Buy Call | ? | ? |
| UTAD Short | Infosys | ₹1,580 (UTAD high) | Buy Put | ? | ? |
| LPSY Short | Reliance | ₹2,784 (LPSY) | Bear Put Spread | ? | ? |
| Phase B Nifty | Nifty 50 | 24,500 (ranging) | Short Straddle | ? | ? |

For each: (a) Identify ITM/ATM/OTM for the strategy. (b) Select the strike. (c) Select the expiry (weekly or monthly, how many weeks). (d) Justify the choice.

**Exercise 23.3 — IV Crush Awareness**

Identify whether to buy options BEFORE or AFTER the event in each scenario:

a) Budget Day is in 2 weeks. Nifty IV is currently at 16% (annual baseline: 14–18%). You have a bullish view on Nifty for the next 2 months.

b) TCS results are tomorrow. IV on TCS options is at 32% (annual baseline: 18–25%). You are bullish on TCS based on Wyckoff LPS.

c) RBI announced a rate cut 3 hours ago. Nifty Bank opened up 2% and then pulled back. IV has collapsed from 22% to 15%. You see a Wyckoff No Supply bar forming on Bank Nifty. You are bullish.

d) US Fed speaks in 6 hours. Nifty IV is at 20% (high for this period). You want to buy a Nifty put as a hedge.

---

### Intermediate Exercises

**Exercise 23.4 — Wyckoff + Options Full Trade Design**

A Wyckoff LPS setup appears on Infosys (F&O stock):

Infosys at ₹1,548 (LPS after confirmed SOS).
Spring low: ₹1,492. Test low: ₹1,498.
T1 (Volume Profile HVN): ₹1,640.
T2 (next HVN / PnF target): ₹1,720.
Expiry options available: 3 weeks to monthly expiry OR 5 weeks to next monthly.
Current IV: 18% (mid-range for Infosys, baseline 15–22%). Theta is manageable.
Lot size: 300 shares.

Available strikes: 1500, 1520, 1540, 1560, 1580, 1600 (Calls)

Design TWO options strategies:

Strategy A — Single Long Call:
a) Which strike? (ITM or ATM? Justify.)
b) Which expiry? (3 weeks or 5 weeks? Justify.)
c) Assume premium for your chosen strike: ₹42. Total cost per lot?
d) Define the "1R" for this options position.
e) At T1 (₹1,640): Estimate option value (use intrinsic value + small time value).
f) R-multiple at T1?

Strategy B — Bull Call Spread:
a) Buy which Call? (ITM or ATM)
b) Sell which Call? (At T1 or T2?)
c) Assume: Buy ₹1,540 Call at ₹52. Sell ₹1,640 Call at ₹14. Net cost?
d) Maximum profit if T1 is hit exactly?
e) Maximum loss?
f) R-multiple comparison: Which strategy is more efficient, A or B? Under what market conditions?

**Exercise 23.5 — Portfolio Beta Hedge Calculation**

Your portfolio holds:

| Stock | Value | Beta |
|-------|-------|------|
| HDFC Bank | ₹3,20,000 | 1.15 |
| Reliance | ₹2,40,000 | 0.88 |
| TCS | ₹1,80,000 | 0.82 |
| Maruti Suzuki | ₹1,60,000 | 1.25 |
| Sun Pharma | ₹1,00,000 | 0.72 |
| **Total** | **₹10,00,000** | |

Nifty at 24,800. Nifty Futures lot size: 25.

a) Calculate portfolio weighted beta.
b) Calculate number of Nifty Futures lots for a 100% hedge.
c) Calculate number of lots for a 60% partial hedge.
d) If Nifty falls 3%: How much does the unhedged portfolio lose?
e) With the 60% partial hedge: What is the net portfolio loss?
f) Cost of the hedge (basis risk): If Nifty rises 3% after you hedge: How much does the short futures position lose? Is this acceptable?
g) Alternatively: Cost of 1 month OTM Put hedge (2% OTM Nifty Put at ₹95 premium, 1 lot = 25). What is the total insurance cost? Compare to the partial futures hedge.

**Exercise 23.6 — Expiry Week Protocol**

For each scenario, state what the Chapter 23 expiry rules require:

a) It is Monday (3 days before Thursday Nifty expiry). You see a very clean Wyckoff LPS on Nifty. You want to buy a Nifty ATM Call for this week's expiry.

b) It is Tuesday of expiry week. You hold a Nifty Call that you bought 3 weeks ago at ₹180. It is now worth ₹220 (you're in profit). What should you do?

c) It is Thursday (expiry day). Bank Nifty is at 52,400. You see a very strong absorption bar in the tape. You want to buy a 52,400 Call for today's move.

d) It is Thursday after 2:30 PM (expiry day). You hold a Bank Nifty Call position from last week. The option is deep OTM (Bank Nifty at 51,800, your Call strike is 52,500). What is the correct action?

e) It is the Friday immediately after last Thursday's expiry. A new Wyckoff LPS appears on Nifty. You want to buy a Call option. Which expiry should you choose?

---

### Advanced Exercises

**Exercise 23.7 — Complete Options Trade from Wyckoff Signal**

RBI cut rates by 25 bps yesterday. Bank Nifty had a high-volume, wide-spread SOS bar (up 2.8%). Today (Day 2 after the cut): Bank Nifty is pulling back on low volume (LPS). 

Data:
Bank Nifty at 52,200 (LPS forming). Spring low: 51,000. Stop: 50,900.
T1: 53,800 (Volume Profile HVN). T2: 55,200 (Cause-Effect PnF target).
Available Options: Bank Nifty weekly (5 days to expiry) and monthly (3 weeks to expiry).
Strikes: 51,000, 51,500, 52,000, 52,500, 53,000 (Calls).
Current IV: 16% (post-event crush from 22% yesterday). Low IV = good time to buy.
Monthly 52,000 Call premium: ₹320. Monthly 51,500 Call premium: ₹430.
Lot size: 15.

Design the complete options trade:
a) Which option strategy? (Single call? Spread?) Justify.
b) Which strike? (ITM or ATM?) Justify.
c) Which expiry? (Weekly or monthly?) Justify.
d) Calculate total premium cost per lot.
e) What is the "1R" for this options position? (How much will you lose if Bank Nifty falls to the stop at 50,900?)
f) At T1 (53,800): Estimate Call premium value and R-multiple.
g) At T2 (55,200): Estimate Call premium and total R-multiple.
h) How does the low IV environment affect your decision? (Vega impact)
i) If IV rises back to 22% (another event): What happens to your premium?
j) Portfolio heat check: Account ₹25L, risk 1% = ₹25,000. Can you do 1 lot at the premium chosen? What is the actual risk?

**Exercise 23.8 — Derivatives Risk Audit**

Review these real trading errors and identify which of the 7 Non-Negotiable Derivative Rules was violated:

a) A trader bought Nifty Weekly Calls on Monday (4 days before expiry) on a "bullish view."
b) A trader bought far OTM Nifty 50 Calls (Delta 0.06) for ₹3 each, hoping for a circuit move.
c) A trader's Nifty Call lost 40% of value (wrong direction). They bought more of the same Call to "average down the cost."
d) A trader held TCS Calls through the quarterly result announcement. Results were in-line. IV crashed. Premium fell 35% despite TCS gaining 0.8%.
e) A trader sold naked Bank Nifty calls before a Budget Day, collecting ₹8,000 premium. Budget was expansionary. Bank Nifty rose 4%. Loss: ₹62,000.
f) A trader bought 3 lots of Infosys ATM Calls with ₹45,000 premium each (₹1,35,000 total). Account was ₹8,00,000. Risk % = 16.9%.
g) A trader bought Nifty Calls when Nifty IV was at 88th percentile of its annual range.

For each: (a) Which rule violated? (b) What was the specific consequence? (c) What should have been done instead?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** What are the three core purposes of derivatives in the professional Wyckoff system (risk definition, leverage, hedging)? Give one example of each in the NSE context.

**Q2.** Explain Delta with a practical NSE example. Why does the professional system use ITM Calls (Delta 0.65–0.75) for LPS entries rather than ATM or OTM Calls?

**Q3.** Explain Theta decay. Why does the Chapter 23 rule require buying options with minimum 3–4 weeks to expiry? What happens in the last 5 days to expiry to an OTM option?

**Q4.** What is IV Crush? Describe the exact mechanism on an NSE event day (RBI rate cut). Why can a correctly-predicted direction result in a losing option trade?

**Q5.** What is the Gamma squeeze, and when does it most commonly occur on NSE? Why should only experienced traders hold ATM options on expiry Thursday?

**Q6.** Explain the Wyckoff + Options strategy matrix. Which option strategy is appropriate for each of the five events: LPS, Spring, UTAD, LPSY, and Phase B?

**Q7.** What is a portfolio beta hedge? Write the formula for calculating the number of Nifty Futures lots needed to hedge a portfolio. When should a trader hedge vs when should they simply exit positions?

**Q8.** Describe the four scenarios in the professional hedging framework. In which scenario is "NO HEDGE" the correct answer, and why does hedging in a markup damage returns?

**Q9.** What are the NSE expiry week rules for option buyers? Specifically: why should new options NOT be bought on Monday/Tuesday of expiry week, and what should be done with profitable existing positions by Tuesday?

**Q10.** Explain Rule 7 — "Monitor IV before every option purchase." What is the IV percentile threshold above which buying options is inadvisable, and what alternative structure is recommended?

---

### Chart Scenario Questions (5)

**S1.** You identify a Wyckoff LPS on TCS at ₹3,620. Spring low: ₹3,520. Stop: ₹3,510. T1: ₹3,840 (Volume Profile HVN). T2: ₹4,020. Available: ₹3,600 Call (Delta 0.52, Theta −₹6/day, Vega ₹1.2, premium ₹68) and ₹3,500 Call (Delta 0.71, Theta −₹4/day, Vega ₹1.0, premium ₹128). Monthly expiry 4 weeks away. Lot size: 150 shares.

a) Which call do you choose for the LPS strategy? Justify using Delta and Theta.
b) Calculate the maximum loss per lot for each option.
c) At T1 (₹3,840): Estimate the ₹3,500 Call's approximate value (intrinsic + small time value).
d) Calculate R-multiple at T1.
e) If IV rises from 18% to 24% before T1 (1 week into the trade): How does Vega affect your ₹3,500 Call?

**S2.** You hold a ₹12,00,000 portfolio of Nifty Bank stocks (weighted beta: 1.12). The Nifty 50 daily chart shows a UTAD formation. Nifty Bank weekly chart shows a BC + AR complete, now in Phase B.

Nifty at 24,600. Nifty Futures lot size: 25.
Available hedge options: 
(a) Short Nifty Futures at 24,620 (SPAN margin: ₹1.9L per lot)
(b) Buy Nifty 24,000 Put (2.4% OTM) at ₹72 premium, lot size 25

a) Calculate lots for a 60% beta hedge using futures.
b) Calculate the cost of buying 1 lot of the Nifty 24,000 Put as insurance.
c) Which hedge is more appropriate for a Phase B scenario? Why?
d) If you use the Put insurance: What protection do you get if Nifty falls to 22,500?
e) If Nifty rises to 25,400 instead: Compare the impact of each hedge on your portfolio.

**S3.** RBI MPC meets tomorrow. Current Nifty IV: 21% (your assessment: high — 75th percentile).

Your view: If RBI cuts rates (probability 70%), Nifty Bank will break above the Creek resistance at 52,800. You want to express this view with options.

a) Should you buy the Call BEFORE or AFTER the announcement? Justify using Vega.
b) If you buy before: What risk does high IV (75th percentile) create?
c) Alternative: What spread structure reduces your Vega exposure while maintaining the bullish view?
d) If RBI cuts as expected and Bank Nifty rises to 53,200 but IV drops from 21% to 14%: Was a Call buy or a Bull Call Spread more profitable?
e) Design the post-announcement trade (entry the day after RBI cuts): Strike, expiry, and position size (account ₹15L, risk 1%).

**S4.** It is Wednesday, 11:00 AM. Bank Nifty expires today (Wednesday = Bank Nifty weekly expiry). Bank Nifty is at 52,350. You see a significant VSA absorption bar on the 5-minute chart. Tape turning strongly green. AVWAP: 52,200 (price above = bullish). You want to buy a Bank Nifty ATM Call for today's expected intraday move to 52,800.

a) What are the Greek characteristics of a same-day expiry ATM Call at 11:00 AM?
b) What does Gamma look like at this point? Is it helping or hurting you?
c) What does Theta look like? How fast is premium decaying?
d) If Bank Nifty moves to 52,800 in 2 hours: Approximately what has happened to your Call premium?
e) If Bank Nifty FALLS to 52,000 instead by 12:00 PM: What happens?
f) Given the Gamma/Theta characteristics: Is this an appropriate trade per Chapter 23 rules?

**S5.** Complete derivatives audit for this options trade sequence:

Trade A: Bought Nifty 24,500 ATM Call on Monday (4 days before weekly expiry) at ₹180. IV: 17% (medium). Nifty stayed flat for 3 days. By Thursday: Call worth ₹45. Loss: −₹135 per share.
→ Analysis: What killed this trade?

Trade B: Bought Infosys 1,540 Call (ATM at entry) at ₹52. IV: 28% (high — day before results). Results in-line, Infosys rose 0.8%. After results, IV fell to 18%. Call now worth ₹38. Loss despite correct direction.
→ Analysis: What killed this trade?

Trade C: Bought Bank Nifty 52,000 Call (ATM) at ₹320 on post-RBI day 2. IV: 14% (low, post-crush). 3 weeks to expiry. Bank Nifty rose 800 points over 10 days. Call worth ₹870. Profit: +₹550 per share = +1.72R.
→ Analysis: What made this trade work?

Trade D: Bought Nifty 25,000 OTM Call (far OTM, Delta 0.08) at ₹15. Expecting a 3% move. Nifty rose 2%. Call worth ₹28. Profit: only ₹13.
→ Analysis: Was this a good trade despite being profitable?

For each: (a) Identify the primary Greek that drove the outcome. (b) Which Chapter 23 rule, if followed, would have improved the result? (c) What is the improved trade structure?

---

## QUIZ ANSWERS

### Conceptual Answers

**A1.** Three derivative purposes: (1) Risk Definition (Options): Instead of losing ₹48/share if a Wyckoff LPS stop is hit, buying an ITM Call means the maximum loss is the premium paid (₹28/share). The mathematical maximum is known before entering. NSE Example: HDFC Bank LPS → Buy ₹1,700 Call at ₹58 per share. Maximum loss = ₹58 per share regardless of how far HDFC Bank falls. (2) Leverage (Futures): Control ₹6,12,500 of Nifty exposure for ₹1,90,000 SPAN margin. A 1% Nifty move = ₹6,125 profit on ₹1,90,000 margin = 3.2% return. Without leverage: 1% return. NSE Example: Nifty LPS entry at 24,200, target 25,100 (+3.7%). Futures return: ~12% on margin. (3) Hedging (Futures/Puts): Hold ₹10L equity portfolio long in Nifty stocks. Buy Nifty Puts before the Budget. If Budget is negative: Puts profit offsets equity losses. Portfolio survives the event.

**A2.** Delta: How much the option price changes per ₹1 move in the underlying. Delta range: 0 to +1 for calls, 0 to −1 for puts. Example: HDFC Bank at ₹1,728. ₹1,700 Call (ITM), Delta 0.72. Bank rises ₹10: Call price rises ~₹7.20. Why ITM Calls for LPS (not ATM or OTM): ATM Call has Delta 0.50 — only 50% of the stock's move is captured. Theta is highest for ATM options (most premium is time value). OTM Call has Delta 0.10–0.20 — captures very little of the stock move. A Wyckoff markup from LPS to T1 (e.g., ₹1,728 to ₹1,820 = ₹92 move) would give an OTM Call only ~₹10–₹18 gain while eroding more premium to theta. ITM Call (Delta 0.72): Captures ~₹66 of the ₹92 move. Better directional efficiency. Less premium is pure time value = less theta erosion per dollar of premium. ITM is the correct structure for trend-following Wyckoff entries.

**A3.** Theta decay: The daily erosion of option premium due to the passage of time (all else equal). Theta is always negative for option buyers. Every day without a move erodes the premium. NSE Theta acceleration curve: 4 weeks to expiry: −₹3/day. 1 week: −₹15/day. The curve is not linear — it accelerates exponentially near expiry. Minimum 3–4 weeks rule: A Wyckoff markup from LPS to T1 typically takes 2–5 weeks to develop (this is a swing trade, not an intraday trade). Buying 3–4 weeks gives the trade time to develop through slow-start LPS consolidation, SOS confirmation, and the markup leg. Buying 1 week: The first week of the trade (slow accumulation continuation, possibly more testing) will destroy 35–50% of the premium before the markup even begins. Last 5 days for OTM option: Theta acceleration is at maximum. An OTM option that is ₹15 on Monday can be ₹0 by Thursday even if the stock moves slightly in your favour. The theta cost exceeds the delta gain. Mathematically, recovery is nearly impossible for OTM options in the final 5 days.

**A4.** IV Crush: After a major event resolves (RBI decision, quarterly results, budget), the uncertainty disappears. Options were priced with elevated IV because of that uncertainty. When the uncertainty resolves — regardless of whether the event is positive or negative — IV falls. The premium paid for uncertainty is lost. Mechanism: Pre-RBI: IV = 22%. Options premium inflated (you paid for the "uncertainty premium"). RBI cuts as expected: No surprise. Uncertainty resolves. Post-RBI: IV = 14%. Same Call is now worth 35–40% less just from Vega loss, even if Nifty rose. The Delta gain (1% Nifty rise × 0.52 Delta = 0.52% premium gain) is overwhelmed by the Vega loss (8% IV drop × Vega coefficient = 15% premium loss). Net: Correct direction, losing trade. How this happens: IV was high because the market was pricing in a potentially large move. When the actual move is small (or in line with expectations), the "feared large move" premium evaporates. The option buyer paid for a large move and got a small one.

**A5.** Gamma squeeze: Near expiry, Gamma (the rate of change of Delta) is maximized for ATM options. A small stock move creates a large Delta change, which creates a large premium change. On expiry Thursday: ATM options have very little time value left. A 200-point Bank Nifty move (normal intraday range) changes an ATM Call from Delta 0.50 to Delta 0.90+, making the option appreciate 5–15× in hours. But if the move reverses: The Call goes from Delta 0.80 back to Delta 0.20, and the option loses 60–80% of its value in the same time frame. Why only experienced traders: (1) The price swings are violent and can exceed stop-loss triggers faster than they can be executed. (2) The liquidity on expiry day options can thin dramatically as market makers reduce risk near close. (3) A "winning" position can reverse to a "losing" position in minutes — discipline and quick execution are critical. (4) The psychological pressure of holding a position swinging 200–400% in real-time is extreme.

**A6.** Wyckoff + Options strategy matrix: LPS (Phase D Accumulation): BUY ITM CALL (Delta 0.65–0.75, minimum 4 weeks). High delta, defined risk, captures markup. Spring (Phase C): BUY ATM CALL or BULL CALL SPREAD. ATM has maximum Gamma — accelerates from the very beginning of markup. Spread reduces cost but caps at T2. UTAD (Phase C Distribution): BUY ITM PUT (1 strike above current price, Delta −0.65 to −0.75, minimum 4 weeks). Defined risk short. Captures the fast, sharp markdown after UTAD. LPSY (Phase D Distribution): BUY ATM PUT or BEAR PUT SPREAD. ATM Put has maximum Gamma in the markdown direction. Spread caps profit at the SOW target (T2). Phase B (Trading Range): SHORT STRADDLE or SHORT STRANGLE (selling volatility). Phase B is characterized by price oscillating within the range, elevated IV (uncertainty premium), and declining actual realized volatility. This is the rare situation where SELLING options is appropriate (for experienced traders who understand the risk of a Phase break).

**A7.** Portfolio beta hedge: Measures how many Nifty Futures lots are needed to neutralize the systematic risk of a portfolio. Formula: Number of lots = (Portfolio Value × Portfolio Beta) / (Nifty Level × Lot Size). Example: ₹10L portfolio, Beta 1.03, Nifty at 24,500, lot size 25: Lots = (10,00,000 × 1.03) / (24,500 × 25) = 10,30,000 / 6,12,500 = 1.68 → Round to 1 or 2 lots. Hedge vs Exit decision: HEDGE when: You have a specific short-term risk (event, expiry) BUT long-term thesis is intact. Tax consequences make closing too expensive. Positions have strong profits you want to protect from short-term reversal. The hedging cost is less than the expected downside. EXIT when: The Wyckoff thesis is invalidated (Red Lines triggered). The drawdown has reached Tier 3 (15%+). The fundamental reason for holding the stock no longer exists. Hedging a thesis-broken position = paying to hold a bad position. Exit is always superior when the thesis breaks.

**A8.** Four hedge scenarios: Scenario 1 (Phase D Markup): NO HEDGE. Full long exposure. The hedge premium/negative carry reduces returns when the system is working. Hedging in a markup is paying insurance when the building is not on fire. Scenario 2 (Phase B / Event): PARTIAL HEDGE — buy OTM portfolio put insurance. The direction is uncertain (Phase B). Insurance allows full upside participation if the Spring/SOS occurs while providing protection if the UTAD/SOW occurs. Scenario 3 (Phase D Distribution): FULL HEDGE + selective exits. UTAD is visible. The markdown is expected. Short futures + protective puts. Begin rotating out of weakest positions. Scenario 4 (Phase E Markdown): EXIT ALL LONGS. No hedge needed. Hedging a fully declining portfolio → you are paying negative carry on the hedge PLUS the portfolio is still losing. Exit converts the risk from "portfolio declining minus hedge benefit" to zero (cash preserves capital for the next accumulation Phase A SC buy). Hedging in a markup damages returns because: Every day the futures short hedge is held, you pay the roll cost (futures negative carry) AND you miss the upside return on the hedged capital. Over months of markup: A 60% partial hedge can reduce a 20% gain to a 12% gain — the insurance cost was too high for the risk it actually protected.

**A9.** Expiry week rules for option buyers: New options on Monday/Tuesday: DO NOT BUY for that week's expiry. Rationale: Weekly options expiring on Thursday have only 3–4 days of life. Theta decay is at maximum acceleration. Even a perfectly timed directional move may not recover the theta cost from Monday's high IV premium. The premium you pay on Monday will lose 60–70% of its time value by Thursday just from theta, regardless of direction. Any option bought for expiry-week speculation should be traded on expiry day ONLY (5–6 hours, maximum), not for multi-day holding. Profitable existing positions by Tuesday: TAKE PROFITS. By Tuesday of expiry week: The Gamma acceleration (which created the profits) is near its maximum intensity in both directions. A profitable call position can give back 50% of gains in 30 minutes if the underlying reverses on Wednesday/Thursday. Professional practice: Sell 50–75% of a profitable position by Tuesday of expiry week. Let only a small runner (20–25%) potentially capture more Gamma into Thursday.

**A10.** Rule 7 — Monitor IV before every option purchase: IV Percentile is the measure of current IV relative to the past 52 weeks. Formula: IV Percentile = (# of days in past year that IV was below current IV) / 252 × 100. 80th percentile or above: IV is in the top 20% of its annual range. Options are EXPENSIVE. Buying at this level means: (1) You are paying elevated premium. (2) Any IV mean reversion (even without an event) reduces your premium — your trade fights Vega headwinds. (3) The premium cost makes it very difficult to achieve positive expectancy. At 80th+ percentile: AVOID buying single options. Alternative: Use a SPREAD (Buy ATM Call, Sell OTM Call). The spread BUYS Vega exposure but also SELLS Vega exposure at the OTM strike. Net Vega is reduced (you are less exposed to IV crush). The spread is more expensive to set up (two commissions) but significantly reduces IV risk. 20th percentile or below: IV is cheap. Buying options here provides maximum Vega benefit — any increase in IV adds to your premium. Post-event IV crush makes this the ideal entry point for the next trend trade.

---

## KEY TAKEAWAYS — CHAPTER 23

> **1. Derivatives have three purposes: risk definition (options), leverage with structural stops (futures), and portfolio protection (hedging). Every derivative position must have a stated purpose. No purpose = speculation = gambling.**

> **2. The four Greeks are the physics of options: Delta (direction), Theta (time), Vega (volatility), Gamma (acceleration). Know which Greeks work FOR you and which work AGAINST you on every position.**

> **3. For Wyckoff LPS entries: Buy ITM Calls (Delta 0.65–0.75, minimum 4 weeks). ITM provides efficient directional exposure. 4+ weeks prevents theta from killing the trade before the markup develops.**

> **4. IV Crush is the option buyer's most dangerous enemy: Buying options 2–3 days before a major NSE event (RBI, budget, results) means paying maximum premium for volatility that collapses immediately after the announcement. Buy BEFORE IV rises OR buy AFTER IV has crushed.**

> **5. The 7 Non-Negotiable Derivative Rules: Never buy weekly options Monday–Tuesday (theta catastrophe). Never buy far OTM options (90%+ expire worthless). Never average down on losing options. Never hold through major events. Never sell naked options. Size by 1% risk rule. Always check IV percentile before buying.**

> **6. Portfolio hedging: Use Nifty Futures (lots = Portfolio Value × Beta / Index × Lot Size) for partial hedges during uncertain phases (Phase B). Switch to long puts for defined-cost insurance. In Phase D markup: No hedge — the carry cost destroys returns. In Phase E: Exit, don't hedge.**

---

*Chapter 23 Complete. Part XV — Derivatives and Hedging is complete.*

---

**Previous:** [← Chapter 22 — Sector Analysis and Rotation](./sector-analysis.md)
**Next:** [Chapter 24 — Backtesting and Strategy Validation →](./backtesting-validation.md)

*Part XVI — Backtesting and Strategy Validation begins next.*

*When ready, say: **"NEXT CHAPTER"***
