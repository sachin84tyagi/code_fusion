# Futures Analysis

> **Course:** NSE/BSE Professional Investing — Price, Volume & Institutional Flow
> **Part:** XIII — Futures Analysis
> **Topic:** Futures Analysis

---

## Chapter Overview

The NSE futures market is not a derivative afterthought — it is the front-running institutional battlefield. FII positions in Nifty futures, the basis between futures and spot, the open interest buildup across participant categories, and rollover patterns are among the richest, most institutionally informative datasets available to any NSE trader. Yet most traders ignore them entirely, watching only the cash price.

Futures data is the institutional intent layer that operates on top of the price chart. It reveals whether the people with the most capital are committed to a direction (Open Interest rising), or closing and walking away (OI falling). It shows whether they are paying a premium to own the future (bullish urgency) or selling the future at a discount (bearish hedging). It tells you, at monthly expiry, how many of the large players maintained conviction into the next month.

**The Core Rule:**

> **Price tells you where the market went. Open Interest tells you how many serious players committed capital to get it there. Basis tells you how urgently they wanted exposure. Rollover tells you how many of them intend to stay. These four together complete the institutional picture that a price bar alone cannot show.**

---

## LEVEL 1 — BEGINNER

### NSE Futures Contract Specifications

```
WHAT IS A FUTURES CONTRACT?
A futures contract is a legally binding agreement to buy or sell an asset
at a pre-agreed price on a future date. On NSE:
→ The buyer AGREES to buy the underlying at the futures price on expiry.
→ The seller AGREES to sell the underlying at the futures price on expiry.
→ Most contracts are cash-settled on NSE (no physical delivery of shares).
   Exception: Single-stock futures can be physically settled if held to expiry.

KEY NSE FUTURES CONTRACTS:

NIFTY 50 FUTURES:
→ Underlying: Nifty 50 Index
→ Lot size: 25 contracts
→ Contract value: ~₹6,00,000–₹7,50,000 (varies with Nifty level)
   At Nifty = 24,500: 24,500 × 25 = ₹6,12,500 per lot
→ Expiry: Last Thursday of each month
→ Available expiries: Near-month, mid-month, far-month (3 monthly contracts simultaneously)
→ Tick size: ₹0.05 (₹1.25 per tick per lot)
→ Margin: Approximately 12–15% of contract value (SPAN + Exposure)
   At ₹6,12,500: ~₹73,500–₹91,875 margin per lot

BANK NIFTY FUTURES:
→ Underlying: Bank Nifty Index (Nifty Bank)
→ Lot size: 15 contracts
→ Contract value: ~₹7,50,000–₹9,00,000 (Bank Nifty typically higher)
   At BankNifty = 53,000: 53,000 × 15 = ₹7,95,000 per lot
→ Expiry: WEEKLY (every Wednesday, not monthly — unique to Bank Nifty)
→ Tick size: ₹0.05 (₹0.75 per tick per lot)
→ Margin: ~12–15% of contract value

SINGLE STOCK FUTURES (SSF):
→ Available for ~200 F&O eligible stocks (approved by NSE/SEBI)
→ Lot sizes vary by stock (determined by NSE based on price)
   Example: HDFC Bank lot = 550 shares. Reliance lot = 250 shares.
→ Expiry: Monthly (last Thursday — same as Nifty)
→ Settlement: Can be physically settled if held to expiry
→ Margin: ~20–25% (higher than index futures due to single-stock risk)

NSE F&O ELIGIBILITY CRITERIA (for stocks):
→ Average daily market cap > ₹2,000 crore (minimum)
→ Average daily traded value > ₹20 crore
→ Minimum 6 months of listing history
→ Stocks failing criteria are delisted from F&O (position limits apply)
```

**How Futures Differ from Cash Equity (The 5 Key Differences):**

```
1. LEVERAGE:
→ Cash equity: Pay 100% of stock value to own shares.
→ Futures: Pay only 12–20% margin for the same exposure.
→ Nifty lot of ₹6,12,500 requires only ~₹80,000 margin.
→ Risk: Leverage amplifies BOTH gains and losses proportionally.

2. EXPIRY:
→ Equity shares: No expiry. Hold forever.
→ Futures: Fixed expiry. Must close or roll before the last Thursday.
→ Impact: Futures OI must be rebuilt each month (rollover). This creates
  predictable monthly OI patterns useful for analysis.

3. MARK-TO-MARKET (MTM) DAILY SETTLEMENT:
→ NSE marks all futures positions to the closing price EVERY DAY.
→ If your long Nifty futures position lost 200 points today:
  NSE debits 200 × 25 = ₹5,000 from your account TODAY.
→ You do not "wait to see if it recovers" — losses are real and immediate.
→ If margin falls below maintenance level: NSE issues margin call.
   You must top up or NSE square off your position forcibly.

4. SHORT SELLING:
→ Cash equity: Short selling is complex (SLBM mechanism, expensive).
→ Futures: Shorting is as easy as buying. No borrowing of shares required.
→ This makes futures the preferred vehicle for institutional hedging and shorting.
→ Implication: High futures short OI = Institutions are genuinely bearish OR hedging.

5. PRICE DIFFERENCE (BASIS):
→ Futures trade at a DIFFERENT price than spot equity.
→ This difference (basis) carries information about institutional sentiment.
→ Covered in depth in the next section.
```

**Where to Access NSE Futures Data:**

```
NSE WEBSITE — KEY PAGES:
1. Futures OI: nseindia.com → Derivatives → Futures Overview → Select instrument
2. Participant-wise OI: nseindia.com → Derivatives → Participant-wise OI (F&O)
3. FII/DII in F&O: Same participant-wise OI page → Select "Futures"
4. Historical OI: nseindia.com → Archives → Derivatives → Bhavcopy (F&O)
5. Rollover data: Published weekly in NSE F&O data during expiry week

TRADING PLATFORMS:
→ Zerodha Kite: Open Interest charts for Nifty/Bank Nifty futures
→ Sensibull: NSE's official options analysis platform (also shows futures OI)
→ Opstra: F&O analytics platform with OI + basis charts
→ TrueData / Global Datafeed: Historical tick-level F&O data (professional/paid)
```

---

### Open Interest — The Positions Counter

**Open Interest (OI) = Total number of outstanding (open, not yet closed) contracts.**

```
WHAT OI MEASURES:
→ Every futures contract has TWO sides: One buyer + One seller.
→ OI counts CONTRACTS (not sides) — so 1 buyer + 1 seller = 1 contract of OI.
→ OI INCREASES when: A new buyer + new seller enter (new contract created).
→ OI DECREASES when: An existing buyer closes by selling + existing seller closes
  by buying back (contract destroyed — no new participants).
→ OI is UNCHANGED when: An existing buyer sells to a new buyer
  (the existing buyer exits, new buyer enters = same total contracts).

THE KEY INSIGHT:
→ Rising OI = New money (new positions) entering the market.
   Both a new buyer AND a new seller are committing capital.
→ Falling OI = Money (existing positions) exiting the market.
   Both an existing buyer AND an existing seller are unwinding.

WHY OI MATTERS FOR WYCKOFF TRADERS:
→ Rising OI on an up-bar: NEW LONGS are being opened = genuine directional conviction.
→ Rising OI on a down-bar: NEW SHORTS are being opened = genuine bearish conviction.
→ Falling OI on an up-bar: SHORTS COVERING (forced buy-back) = temporary, borrowed rally.
→ Falling OI on a down-bar: LONGS LIQUIDATING = selling is finite, SC forming.

These four combinations are the OI + Price Matrix (see next section).
```

---

### The Open Interest + Price Matrix

![Open Interest + Price Matrix — The 4 Futures Market Signals](/images/pi-futures-oi-price-matrix.jpg)

**The four combinations and their Wyckoff translations:**

**Quadrant 1 — OI Rising + Price Rising (LONG BUILDUP):**

```
WHAT IS HAPPENING:
→ New buyers and new sellers are both entering the market.
→ The NEW buyers are MORE AGGRESSIVE (they pay higher prices to get long).
→ This is genuine, capital-backed bullishness — not closing shorts.

HOW TO IDENTIFY ON NSE:
→ Nifty closes at 24,850 (+1.8% from yesterday's 24,415).
→ Nifty futures OI: 1,24,800 contracts today vs 1,11,400 yesterday.
→ OI change: +13,400 contracts (+12%). Price +1.8%.
→ Quadrant: Long Buildup. New longs opened.

WYCKOFF TRANSLATION:
→ This is the institutional confirmation of an SOS (Sign of Strength).
→ The SOS bar (wide spread, high volume, close near high) is CONFIRMED when
  accompanied by rising OI (new longs) not falling OI (short covering).
→ Rising OI + SOS = The most reliable breakout confirmation.
→ Falling OI + SOS-looking bar = Caution. Only short-covering. Not a real SOS.

TRADING ACTION:
→ Long positions: Add on the LPS pullback. Trend is confirmed genuine.
→ Do NOT initiate shorts — fresh longs will overpower you.
```

**Quadrant 2 — OI Falling + Price Rising (SHORT COVERING):**

```
WHAT IS HAPPENING:
→ Existing SHORT positions are being forced to close (covering).
→ Covering = Buying back contracts (causes price to rise).
→ OI falls because contracts are being destroyed (not new ones created).

WYCKOFF TRANSLATION:
→ This is the Automatic Rally (AR) after the Selling Climax.
→ The SC forced many short sellers into panic. Now they are covering.
→ The AR rises fast on this forced buying — OI collapses as shorts cover.
→ When OI stops falling: The short covering is complete. The AR has peaked.
→ Phase B begins: Both OI and price stabilise in the range.

CRITICAL DISTINCTION:
First rally after a bottom:
→ OI falling + price rising = SHORT COVERING. This is a bounce, not a new uptrend.
→ OI rising + price rising = LONG BUILDUP. This is genuine accumulation.
The first scenario is the AR (expected and temporary).
The second scenario is the SOS (new uptrend genuinely beginning).
Do not confuse them.
```

**Quadrant 3 — OI Rising + Price Falling (SHORT BUILDUP):**

```
WHAT IS HAPPENING:
→ New SHORT positions being opened by aggressive sellers.
→ Both new sellers and new buyers enter (OI rises) but sellers WIN (price falls).
→ This is genuine, capital-backed bearishness.

WYCKOFF TRANSLATION:
→ This is the SOW (Sign of Weakness) or early Phase E (Markdown).
→ The distribution phase has completed. Institutions are now actively shorting.
→ Rising OI + falling price = The most dangerous signal to hold longs against.

SPECIAL CASE — FII short buildup in Index Futures:
→ If FII participant-wise OI shows FII NET SHORT position RISING:
  FII is building a deliberate, research-backed short in Nifty.
  Retail is often net long at the same time (adverse selection).
  The combination of FII short buildup + retail long buildup =
  Maximum bearish institutional setup. Nifty will likely fall hard.

TRADING ACTION:
→ All longs: EXIT IMMEDIATELY. This is not a dip — it is a structural breakdown.
→ Initiate shorts: OI rising + price falling = the most confirmed short signal.
```

**Quadrant 4 — OI Falling + Price Falling (LONG UNWINDING):**

```
WHAT IS HAPPENING:
→ Existing LONG positions are being liquidated (sold).
→ Longs selling causes price to fall.
→ OI falls because contracts are being destroyed.
→ The SELLING IS FINITE — it can only last as long as there are longs to liquidate.

WYCKOFF TRANSLATION:
→ This is the Selling Climax (SC) pattern in futures OI data.
→ Long unwinding = Panicking longs exiting. Maximum fear.
→ When OI stops falling: All panic-longs have exited. Supply exhausted.
→ The OI bottom = The price bottom (SC completed).
→ This is different from Short Buildup (OI rising + price falling):
  Short Buildup = Infinite potential (new shorts can always enter).
  Long Unwinding = Finite (only existing longs can exit — then it stops).

IDENTIFYING THE SC VIA OI:
→ OI falls sharply over 2–5 sessions (panic longs exiting).
→ Rate of OI decline SLOWS: Day 1: −18,000 contracts. Day 3: −8,000. Day 5: −2,000.
→ OI stabilises: Day 7: +200 contracts (almost no more longs exiting).
→ This OI stabilisation = SC completed. Phase B begins.

TRADING ACTION:
→ Do NOT short during Long Unwinding. You are selling against finite supply.
→ Watch for OI to STABILISE. That is the SC signal.
→ Begin accumulation watchlist preparation.
```

---

## LEVEL 2 — INTERMEDIATE

### Basis, Cost of Carry, and What Futures Premium Signals

![Futures Basis, Cost of Carry & Rollover — Reading the NSE Futures Term Structure](/images/pi-futures-basis-rollover.jpg)

**The mathematical foundation:**

```
BASIS = Futures Price − Spot Price

THEORETICAL FAIR VALUE (Cost of Carry Model):
Futures Fair Value = Spot Price × (1 + Risk-Free Rate − Dividend Yield) ^ (Days to Expiry / 365)

Example — Nifty 50 (25-day to expiry):
Spot Nifty: 24,500
Risk-free rate: 6.5% per annum (90-day T-bill rate)
Dividend yield: 1.2% per annum (Nifty trailing 12-month yield)
Net carry rate: 6.5% − 1.2% = 5.3% per annum

Fair Futures = 24,500 × (1 + 0.053) ^ (25/365)
            = 24,500 × (1.053) ^ 0.0685
            = 24,500 × 1.00352
            = 24,586 (approximately)

If Nifty Futures is trading at ₹24,620: Actual premium = ₹120.
Fair premium (theoretical): ₹86.
Actual premium − Fair premium = ₹120 − ₹86 = +₹34 excess premium.

This +₹34 excess = Participants paying ABOVE fair value to get long exposure.
= Institutional bullishness (they want futures MORE than theory requires).
```

**Basis Signals (the 4 readings):**

```
READING 1 — HEALTHY CONTANGO (+₹50 to +₹150 for 30-day Nifty):
Normal state. Futures at reasonable premium. Cost of carry fully priced.
Wyckoff context: Phase D Markup trending smoothly.
Trading context: Normal. No additional signal. Use other data layers.

READING 2 — PREMIUM EXPANDING (+₹150 to ₹300+):
Futures rising FASTER than spot. Participants paying ABOVE fair value.
WHY: FII or large institutions are URGENTLY buying futures (cannot wait for spot accumulation).
Signal: VERY BULLISH. These buyers have a directional VIEW and need exposure fast.
They pay the premium to get it. This is institutional urgency — the precursor to an SOS.
Wyckoff context: Approaching SOS. CO is accumulating in futures while still managing spot.
Trading action: Upgrade bullish bias. Prepare LPS entry.

READING 3 — PREMIUM COLLAPSING (+₹10 to ₹30, below fair value):
Futures not keeping pace with spot. Sellers entering futures.
WHY: Either (a) Institutions hedging long spot positions by selling futures,
     or (b) Beginning of genuine short buildup.
How to distinguish: Check participant-wise OI.
(a) FII equity cash market = NET BUY + FII futures = NET SHORT: Hedging. Not bearish.
(b) FII equity cash market = NET SELL + FII futures = NET SHORT: Genuinely bearish.
Wyckoff context: (a) = Phase B LPS zone. (b) = UTAD, SOW, or early distribution.

READING 4 — DISCOUNT (Futures < Spot, basis negative):
Futures trading BELOW spot. Sellers pushing futures aggressively below fair value.
This only happens when: Futures sellers are DESPERATE to hedge or short.
The cost-of-carry model says futures SHOULD be above spot. If it's below:
Someone is paying (in the form of negative carry) to be short.
Signal: STRONGLY BEARISH. Institutional fear is explicit.
Wyckoff context: Deep Phase C (approaching SC) or distribution UTAD.
Trading action: MAXIMUM BEARISH BIAS. Only short or cash.
Nifty historical example: March 2020. Nifty futures went to discount as FII
panic-hedged and new shorts piled in. Nifty fell 38% in 6 weeks from that point.
```

---

### Rollover Analysis

**Monthly expiry is a forensic event — it reveals institutional intent for the next month:**

```
WHAT ROLLOVER IS:
→ NSE contracts expire last Thursday of each month.
→ Traders who want to MAINTAIN positions must:
  (a) SELL the expiring near-month contract
  (b) BUY the next month (far-month) contract
  This is the "rollover."

→ Traders who do NOT want to maintain positions:
  Simply close the near-month contract. No rollover. OI goes to zero.

ROLLOVER % CALCULATION:
Rollover % = (OI that Rolled to Next Month) / (Total Near-Month OI 5 days before expiry) × 100

Example:
Near-month Nifty OI at start of rollover week: 1,40,000 contracts
Near-month OI at expiry (remaining, didn't roll): 18,000 contracts
OI that rolled = 1,40,000 − 18,000 = 1,22,000 contracts
Rollover % = 1,22,000 / 1,40,000 × 100 = 87.1%

INTERPRETING ROLLOVER:

HIGH ROLLOVER (> 80%) + PREMIUM IN FAR MONTH:
→ 80%+ of position holders chose to STAY in the market next month.
→ They paid the rollover cost (far month basis) to maintain exposure.
→ BULLISH: Institutional conviction maintained. They didn't take the easy exit.
→ Far month trades at premium: Cost of carry present = Buyers happy to pay.
→ NSE historical context: Bull markets consistently show 80–90% rollover.

LOW ROLLOVER (< 65%) + DISCOUNT IN FAR MONTH:
→ 35%+ of position holders CLOSED at expiry (did not roll).
→ Loss of conviction. They are not willing to commit to next month.
→ BEARISH: Reducing exposure. Position unwinding.
→ Far month trades at discount: Sellers dominating the roll.
→ This creates a void in next month's OI that must rebuild bearishly.
→ NSE historical context: Bear phases and corrections show 60–70% rollover.

ROLLOVER WITH COST (cost of carry in far month):
Near-month: ₹24,580. Far-month: ₹24,720.
Roll cost = ₹24,720 − ₹24,580 = ₹140 per unit = ₹3,500 per lot.
Institutions paid ₹3,500/lot to stay long. This is CONVICTION.
High roll cost paid willingly = Strong institutional commitment to the next month.
Low or negative roll cost (discount): Institutions exiting OR short sellers dominating.

WHERE TO TRACK ROLLOVER:
→ NSE publishes rollover data each expiry week.
→ Financial media (Moneycontrol, ET Markets, NDTV Profit) publishes rollover %
  for Nifty 50, Bank Nifty, and major F&O stocks every expiry Thursday.
→ Zerodha Sensibull, Opstra: Show real-time rollover statistics.
```

---

### Participant-wise Open Interest — FII vs Retail

**The most institutionally informative futures dataset available on NSE:**

```
WHERE: nseindia.com → Derivatives → Participant-wise Open Interest (F&O)

WHAT IT SHOWS:
Daily NET POSITION (Long OI minus Short OI) for each category:
→ FII (Foreign Institutional Investors): The most informed category.
→ DII (Domestic Institutional Investors): Counter-cyclical, long-term.
→ Client (Retail): Structurally wrong at extremes.
→ Pro (Proprietary trading desks): Semi-informed, fast-reacting.

SAMPLE DATA TABLE (Nifty 50 Futures, Friday):
Category | Long OI | Short OI | Net Position | Change from Monday
FII      | 2,84,500| 1,96,200 | +88,300 NET LONG | +34,200 (added)
DII      | 42,800  | 38,600   | +4,200 NET LONG  | +800 (added slightly)
Client   | 1,12,400| 1,98,600 | −86,200 NET SHORT| −28,400 (added shorts)
Pro      | 38,600  | 44,900   | −6,300 NET SHORT | −800

Reading:
→ FII added 34,200 net long contracts over the week (very bullish — FII conviction).
→ Retail added 28,400 net short contracts (retail was shorting aggressively).
→ FII net long = 88,300 vs Retail net short = 86,200. Nearly equal and opposite.
→ CLASSIC SETUP: FII buying, retail selling. The "smart money vs dumb money" divergence.
→ Historical accuracy: When this divergence is at extremes, FII is almost always right.
→ Conclusion: STRONGLY BULLISH. Retail short squeeze coming.

THE RETAIL CONTRARIAN SIGNAL:
Client (Retail) positions are a contra-indicator at EXTREMES:
→ Client maximum net short position: Market typically RALLIES (retail squeezed).
→ Client maximum net long position: Market typically FALLS (retail distributed against).
→ The squeeze mechanism: When market rallies, retail shorts must cover.
  This forced buying ADDS to the rally fuel, amplifying the move.

HOW TO USE PARTICIPANT-WISE OI IN WYCKOFF CONTEXT:
Phase C (Spring confirmation):
→ FII net long position RISES on Spring day: FII buying the Spring dip = genuine Spring.
→ Client net short at maximum: Maximum squeeze fuel for the Phase D SOS.

Phase D (SOS confirmation):
→ FII net long position at season high AND RISING: Maximum institutional conviction.
→ Client net short being reduced (shorts covering): The squeeze is happening.
→ Price rises on short covering (OI falling) + new FII longs (OI rising): Dual fuel.
```

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### Integrating Futures into the Institutional Scorecard

```
ADD FUTURES DATA AS A SCORED LAYER:

BULLISH FUTURES SIGNALS:

□ +3 points: OI RISING + Price RISING (Long Buildup) on SOS day
             (Institutional confirmation of genuine breakout — not just short covering)

□ +2 points: FII participant-wise OI — FII NET LONG at multi-month high AND RISING
             (Most informed participant maximum bullish positioning)

□ +2 points: Client (Retail) participant-wise OI — NET SHORT at maximum
             (Maximum squeeze fuel — contrarian bullish signal)

□ +2 points: Basis EXPANDING (futures premium > fair value by 50%+)
             (Institutional urgency — paying above fair value for futures exposure)

□ +1 point:  Rollover % > 80% + premium maintained in far month
             (Institutional conviction maintained into next expiry cycle)

□ +1 point:  OI FALLING + Price FALLING (Long Unwinding) THEN OI STABILISES
             (SC formation identified in OI data — supply exhaust signal)

Maximum futures bullish score: 11 points

BEARISH FUTURES SIGNALS:

□ +3 points: OI RISING + Price FALLING (Short Buildup) on SOW day
             (Institutional confirmation of genuine breakdown)

□ +2 points: FII participant-wise OI — FII NET SHORT at multi-month high AND RISING
             (Most informed participant maximum bearish positioning)

□ +2 points: Basis going to DISCOUNT (futures below spot)
             (Institutional fear — paying negative carry to be short)

□ +2 points: Client (Retail) participant-wise OI — NET LONG at maximum
             (Maximum squeeze fuel — contrarian bearish signal)

□ +1 point:  Rollover % < 65% + discount in far month
             (Position unwinding — loss of institutional conviction)

Maximum futures bearish score: 10 points
```

---

## EXERCISES

### Beginner Exercises

**Exercise 1 — Contract Specification**

Calculate the following for each NSE futures contract:

**Nifty 50 at 24,640:**
a) Total contract value per lot.
b) If margin requirement is 13%: Margin per lot.
c) If you have ₹5L available for margin: Maximum lots you can trade.
d) If Nifty moves from 24,640 to 24,400 (−240 points): MTM loss per lot (₹).

**Bank Nifty at 52,800:**
a) Contract value per lot.
b) Margin at 12%: Margin per lot.
c) Stop distance: 420 points. Loss per lot at stop.
d) Weekly vs monthly expiry difference for Bank Nifty.

**HDFC Bank Futures (Lot size 550, price ₹1,726):**
a) Contract value per lot.
b) If margin is 22%: Margin per lot.
c) Price moves from ₹1,726 to ₹1,694 (stop). Loss per lot.
d) Why does HDFC Bank futures have higher margin % than Nifty futures?

**Exercise 2 — OI + Price Quadrant Classification**

Classify each scenario into the correct quadrant and state the Wyckoff interpretation:

| Scenario | Price Change | OI Change | Quadrant | Wyckoff Event |
|---------|------------|---------|---------|--------------|
| A | Nifty +2.1% | +11,400 contracts | ? | ? |
| B | Nifty +3.4% | −18,200 contracts | ? | ? |
| C | Nifty −1.8% | +14,600 contracts | ? | ? |
| D | Nifty −2.6% | −22,400 contracts | ? | ? |
| E | Nifty −0.3% | −1,400 contracts | ? | ? |
| F | Nifty +0.8% | +800 contracts | ? | ? |

For each: (a) Which quadrant? (b) Wyckoff interpretation? (c) Trading action?

**Exercise 3 — Basis Calculation**

Calculate the fair futures value and interpret the actual basis for each situation:

Nifty Spot: 24,300. Risk-free rate: 6.5% p.a. Dividend yield: 1.1% p.a.

| Days to Expiry | Actual Futures Price | Fair Futures | Actual Basis | Fair Basis | Excess Premium |
|---------------|---------------------|-------------|-------------|-----------|----------------|
| 30 days | ₹24,428 | ? | ? | ? | ? |
| 30 days | ₹24,630 | ? | ? | ? | ? |
| 30 days | ₹24,180 | ? | ? | ? | ? |

For each: (a) Calculate fair futures price. (b) Calculate actual and fair basis. (c) What does the excess premium (or deficit) signal about institutional sentiment?

---

### Intermediate Exercises

**Exercise 4 — Wyckoff + OI Convergence**

Track Nifty 50 futures OI over 6 weeks:

**Week 1 (SC forming):**
Day 1: Nifty −2.8%. OI: 1,80,000 → 1,62,400. Change: −17,600. FII net: −22,400 delivery in cash.
Day 3: Nifty −1.6%. OI: 1,62,400 → 1,48,800. Change: −13,600.
Day 5: Nifty −0.4%. OI: 1,48,800 → 1,44,200. Change: −4,600.

**Week 2 (AR + Phase B beginning):**
Day 1: Nifty +2.2%. OI: 1,44,200 → 1,36,800. Change: −7,400 (OI still falling = short covering).
Day 3: Nifty +0.8%. OI: 1,36,800 → 1,38,400. Change: +1,600 (OI stabilising).
Day 5: Nifty −0.3%. OI: 1,38,400 → 1,39,200. Change: +800.

**Week 4 (Secondary Testing, Phase B):**
OI range: 1,38,000 → 1,42,000 (oscillating, low change each session).
Basis: Consistent +₹82–₹88 premium (healthy contango). No excitement.

**Week 6 (Spring + SOS):**
Day 1 (Spring): Nifty −0.8% (brief dip below SC low). OI: 1,41,800 → 1,40,200. Change: −1,600.
Day 2 (SOS): Nifty +2.6%. OI: 1,40,200 → 1,54,800. Change: +14,600.
Basis on SOS day: ₹148 premium (expanded significantly above fair value of ₹86).
FII participant-wise: FII net long +42,000 contracts vs previous day.

Questions:
a) In Week 1: Which OI quadrant? How does the OI data confirm the SC is forming?
b) In Week 2, Day 1 (price +2.2%, OI falling): Which quadrant? What Wyckoff event is this?
c) In Week 2, Day 3 (OI stabilising): What is the OI signal and what does it mean for Wyckoff phase?
d) In Week 4 (OI stable, basis healthy): What Wyckoff phase is confirmed by OI?
e) Spring day (Day 1, Week 6): Which quadrant? Does OI confirm the Spring? How?
f) SOS day (Day 2, Week 6): Multiple signals — identify all of them (OI quadrant, basis signal, FII participant signal). What is the combined reading?

**Exercise 5 — Rollover Analysis**

Nifty 50 expiry week data over three consecutive months:

**Month 1 (Bull run beginning):**
Pre-rollover OI: 1,46,000 contracts.
Rollover %: 84%. Far-month OI buildup: 1,22,640 contracts (84%).
Near-month remaining: 23,360 (closed at expiry).
Far-month basis: +₹96 premium.

**Month 2 (Continuation):**
Pre-rollover OI: 1,68,000 contracts.
Rollover %: 88%. Far-month OI: 1,47,840 contracts.
Far-month basis: +₹110 premium. OI HIGHER than Month 1 → Increasing conviction.

**Month 3 (Market topping):**
Pre-rollover OI: 1,72,000 contracts.
Rollover %: 62%. Far-month OI: 1,06,640 contracts.
Far-month basis: +₹24 premium (near-flat). OI SIGNIFICANTLY LOWER.

Questions:
a) Month 1 rollover: Interpret the 84% + ₹96 premium. What Wyckoff phase?
b) Month 2 rollover: How does the higher OI + higher rollover % change the interpretation vs Month 1?
c) Month 3 rollover: What does the drop to 62% + near-flat premium signal?
d) The OI dropped from 1,47,840 (Month 2 far) to 1,06,640 (Month 3 far). What does this OI contraction mean?
e) What Wyckoff event might Month 3 be the beginning of?

**Exercise 6 — Participant-wise OI Trade Validation**

NSE Participant-wise OI for Nifty 50 Futures, Wednesday:

| Category | Net Monday | Net Wednesday | Change |
|---------|-----------|--------------|--------|
| FII | +48,400 long | +86,200 long | +37,800 |
| DII | +6,200 long | +8,800 long | +2,600 |
| Client | −42,000 short | −82,400 short | −40,400 (more short) |
| Pro | −12,600 short | −12,600 short | 0 |

Simultaneously:
→ Nifty 50 OI change: +18,400 contracts (Long Buildup quadrant).
→ Nifty price: +1.4% today.
→ Basis today: +₹164 premium (vs fair value of ₹86) = +₹78 excess.
→ Delivery %: 74% on today's Nifty 50 tracking ETF (SOS-level delivery).

Questions:
a) FII added 37,800 net long contracts. What does this signal?
b) Retail added 40,400 net SHORT contracts simultaneously. What does this signal (contrarian)?
c) Calculate the "smart money vs dumb money divergence": How does FII net long compare to retail net short? What does this gap signal?
d) Is the OI change (Long Buildup) consistent with the participant data?
e) Calculate the futures portion of the institutional scorecard (11 points max).
f) Design the trade using all available data.

---

### Advanced Exercise

**Exercise 7 — Full Futures-Based Trade Analysis**

You are building the complete institutional case for a Nifty long trade. It is 3:15 PM on a Wednesday.

**Wyckoff structure:** Nifty in Phase D. SOS confirmed 4 days ago (24,820 SOS high). LPS pulling back. Current Nifty: 24,380.

**Today's futures data:**
→ OI change today: −2,400 contracts (falling, on a day where Nifty fell 0.6%).
→ Basis today: +₹92 premium (fair value = ₹88). Excess = +₹4 only.
→ FII participant-wise OI: FII net = +74,200 (added 8,400 today).
→ Client participant-wise OI: Client net = −68,400 (added 6,200 short today).

**Rollover (this is expiry week — next Thursday is expiry):**
→ Near-month OI: 1,28,400 contracts. Rolling at 78%.
→ Far-month basis: +₹86 premium. Roll cost = ₹86 per unit = ₹2,150/lot.

**Delivery % (LPS days 1–4):** 22%, 24%, 19%, 21% (consistently near-zero supply).

**FII cash market 20-day cumulative:** +₹18,200 Crore.

Questions:
a) Classify today's OI change (−2,400, Nifty −0.6%). Which quadrant?
b) What does this confirm about the LPS?
c) The basis is only slightly above fair value (+₹4). Is this bullish, neutral, or bearish?
d) Rollover at 78% with ₹86 premium: Interpret for next month's institutional intent.
e) Calculate the complete futures portion of the institutional scorecard.
f) Combine with delivery % and FII/DII data: Total score across those 3 layers.
g) Design the trade: Entry, stop (Spring low − 0.1% = assume 23,890), T1, T2.
   Account ₹15L. Risk 1%. Calculate lots.
h) What single futures data change in TOMORROW'S SESSION would give maximum confidence
   the LPS is complete and the next SOS is beginning?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** What is the lot size and expiry schedule for Nifty 50, Bank Nifty, and HDFC Bank futures on NSE? What is daily Mark-to-Market (MTM) settlement?

**Q2.** What is Open Interest (OI)? How does it differ from volume? When does OI increase and when does it decrease?

**Q3.** Describe all four quadrants of the OI + Price Matrix. For each, identify the Wyckoff event it corresponds to and the trading action.

**Q4.** What is BASIS? Write the cost of carry formula. What does an EXPANDING premium (above fair value) signal, and what does a DISCOUNT (futures below spot) signal?

**Q5.** What is rollover in the context of NSE futures expiry? What does HIGH rollover % + premium in the far month signal vs LOW rollover % + discount in the far month?

**Q6.** How do you distinguish an Automatic Rally (AR) from a genuine SOS using futures OI data? What is the key OI reading that separates them?

**Q7.** What does the NSE Participant-wise OI data show? What is the "FII net long + Retail net short" combination called, and why is it a powerful bullish signal?

**Q8.** Explain the difference between "Short Buildup" (OI rising, price falling) and "Long Unwinding" (OI falling, price falling). Why does the distinction matter for determining whether to short?

**Q9.** At expiry, what is the Wyckoff significance of tracking OI as it declines to zero (long unwinding) then stabilises? What phase does the OI stabilisation correspond to?

**Q10.** List all bullish signals in the futures institutional scorecard. What is the maximum possible futures bullish score, and which single event scores 3 points?

### Chart Questions (5)

**S1.** Nifty OI data across 5 sessions:

| Day | Nifty Change | OI Change | Quadrant | Event |
|-----|------------|---------|---------|-------|
| Mon | −2.4% | −16,400 | ? | ? |
| Tue | −1.2% | −8,200 | ? | ? |
| Wed | −0.3% | −1,800 | ? | ? |
| Thu | +2.8% | −12,400 | ? | ? |
| Fri | +1.4% | +9,200 | ? | ? |

a) Classify each day into the correct quadrant.
b) Which days form the SC sequence?
c) Which day is the Automatic Rally?
d) Which day signals the genuine new buying beginning?
e) What Wyckoff phase has the market entered by Friday's close?

**S2.** Basis data across a 3-week period:

Week 1 (Markup phase): Basis = +₹92, +₹104, +₹118 (expanding). Fair value = ₹86.
Week 2 (Topping area): Basis = +₹116, +₹88, +₹62, +₹38 (collapsing). Fair value = ₹82.
Week 3 (Distribution): Basis = +₹18, −₹24, −₹68 (discount!). Fair value = ₹78.

a) Describe the basis trend across all three weeks.
b) In Week 2: What does the collapsing premium signal?
c) In Week 3: When futures go to DISCOUNT (below spot): Who is doing this and why?
d) Check FII participant-wise OI: Week 1 = FII net +80,000. Week 3 = FII net −44,000. What does this confirm?
e) What Wyckoff events correspond to each week?

**S3.** Rollover data for Nifty 50 across 4 consecutive months:

Month 1: Rollover 86%, far-month premium +₹104. Post-rollover Nifty +8% that month.
Month 2: Rollover 84%, far-month premium +₹98. Post-rollover Nifty +6% that month.
Month 3: Rollover 71%, far-month premium +₹44. Post-rollover Nifty −2% that month.
Month 4: Rollover 58%, far-month premium +₹12 (near discount). Post-rollover Nifty −7%.

a) Describe the rollover trend. At which month did the institutional conviction begin to wane?
b) Between Month 2 and Month 3: What was the key rollover signal that preceded the top?
c) Month 4: 58% rollover and near-discount far month. What are the 42% of traders who didn't roll doing?
d) How would FII participant-wise OI likely look in Month 4 vs Month 1?
e) What Wyckoff phase is Month 4 most consistent with?

**S4.** Participant-wise OI for Nifty 50 Futures — two weeks of data:

Week 1 (Accumulation):
FII net: +48,200 long (and rising each day). Client net: −44,800 short (and increasing each day).
Nifty: Rangebound 23,600–24,000.

Week 2 (Post-SOS):
FII net: +82,600 long (massive addition). Client net: −78,400 short (maximum short position).
Nifty: Breakout to 24,650. SOS confirmed. Delivery % on breakout day: 78%.

a) Week 1: FII adding longs + retail adding shorts in a rangebound market. What phase?
b) When both reach maximum divergence in Week 2: What is about to happen?
c) The SOS on Week 2: Is OI rising or falling? What quadrant?
d) After the SOS: Client (retail) has 78,400 net short contracts. What happens mechanically as Nifty continues rising?
e) How much additional buying fuel does the retail short squeeze add? (Calculate forced buy volume if 78,400 contracts × 25 lot size must be covered)

**S5.** Complete futures analysis for a Nifty long trade setup:

Current data:
→ Nifty at 24,280 (LPS zone). SOS was at 24,820 (4 days ago).
→ OI today: −1,800 contracts on a −0.4% session (quadrant = ?).
→ Basis: +₹96 (fair value = ₹88, excess = +₹8).
→ FII net position: +68,400 contracts (added 4,200 today).
→ Client net position: −64,200 contracts (added 3,800 short today).
→ Rollover (tomorrow is expiry): 82%. Far-month basis +₹94.

Calculate:
a) Today's OI quadrant and Wyckoff interpretation.
b) Basis signal (slight excess premium: is this bullish/neutral/bearish?).
c) FII participant signal.
d) Client contrarian signal.
e) Rollover interpretation.
f) Total futures scorecard (11 points max).
g) Is this a high-conviction trade? At what position size?

---

## QUIZ ANSWERS

**A1.** NSE Futures specs: Nifty 50: Lot size = 25 contracts. Expiry = last Thursday of each month. 3 monthly contracts available simultaneously. Margin ~12–15%. Bank Nifty: Lot size = 15 contracts. Expiry = WEEKLY (every Wednesday). Unique on NSE. Higher intraday volatility. Margin ~12–15%. HDFC Bank Futures: Lot size = 550 shares. Monthly expiry (last Thursday). Margin ~20–22% (higher due to single-stock risk). Mark-to-Market (MTM) daily settlement: NSE calculates the difference between your entry price and today's closing price every single day. If you lost ₹5,000: NSE debits your account today. If you gained: NSE credits today. MTM ensures losses are realised daily (no hiding of losses). If account drops below maintenance margin: Margin call issued. Failure to meet → NSE forcibly squares off position.

**A2.** Open Interest vs Volume: Volume = Total number of contracts TRADED (bought + sold) in a session. OI = Total number of contracts OUTSTANDING (still open, not yet closed) at end of session. OI increases: When a new buyer matches with a new seller (new contract created). Both are opening positions. OI decreases: When an existing buyer closes by selling to an existing seller closing by buying (contract destroyed). OI unchanged: When an existing buyer sells to a new buyer (transfer, not new creation). The key distinction: Volume shows activity. OI shows commitment. High volume + rising OI = New participants committing. High volume + falling OI = Existing participants exiting.

**A3.** Four OI + Price quadrants: (1) OI Rising + Price Rising = LONG BUILDUP. New longs being added. BULLISH conviction. Wyckoff: SOS confirmation. Action: Hold longs, enter on LPS. (2) OI Falling + Price Rising = SHORT COVERING. Existing shorts forced to close (buy back). Temporary rally borrowed from shorts. Wyckoff: Automatic Rally (AR) after SC. Action: Do NOT chase. Wait for OI to start rising for genuine longs. (3) OI Rising + Price Falling = SHORT BUILDUP. New shorts being added. BEARISH conviction. Wyckoff: SOW or early Phase E Markdown. Action: Exit all longs immediately. Can short with maximum confidence. (4) OI Falling + Price Falling = LONG UNWINDING. Existing longs closing (panic). Finite selling pressure. Wyckoff: Selling Climax (SC) forming. OI stabilisation = SC completed. Action: Do NOT short. Supply is finite and exhausting.

**A4.** Basis = Futures Price − Spot Price. Cost of Carry formula: Futures Fair Value = Spot Price × (1 + Risk-Free Rate − Dividend Yield) ^ (Days to Expiry / 365). Expanding premium (basis > fair value): Participants paying ABOVE theoretical fair value for futures exposure. They are URGENT — they want exposure faster than they can accumulate spot shares. Very bullish signal. Institutional urgency. Precursor to an SOS. Wyckoff: Approaching Phase D. Discount (futures < spot): Participants paying negative carry to be short or hedge. This only makes economic sense when they expect price to FALL enough to offset the negative carry cost. STRONGLY BEARISH. Institutional fear explicit. Historical: March 2020 Nifty went to discount. Fell 38% from that level.

**A5.** Rollover: Monthly NSE futures expire last Thursday. To maintain positions past expiry: Sell expiring near-month + Buy far-month simultaneously. Rollover % = OI that rolled / Total OI at start of rollover week × 100. High rollover (> 80%) + premium in far month: Most participants STAYED in the market. They paid the cost of carry (far-month premium) to maintain exposure. Institutional conviction persists. Bullish for next month. Low rollover (< 65%) + discount or flat far month: Most participants CLOSED at expiry. Loss of conviction — they don't want next-month exposure. Bearish tilt. OI rebuilds lower. Market may correct as OI rebuilds with shorts dominating.

**A6.** AR vs SOS via OI: Automatic Rally (AR): Price rises FAST. OI FALLS (or stays flat). Mechanism: Existing short sellers are being squeezed to cover (buy back). They close their short contracts → OI falls. The rally is powered by SHORT CLOSING, not new buyers. Temporary. Genuine SOS: Price rises. OI RISES. Mechanism: NEW long positions opened. New buyers AND new sellers enter. The rising OI means fresh capital is betting on upside continuation. This is real, conviction-backed buying. The single most important OI reading: SOS day OI must be RISING (Long Buildup). If SOS day OI is FALLING (Short Covering): This is an AR-type bounce, not a confirmed SOS. The markup won't sustain.

**A7.** Participant-wise OI: Published daily on NSE showing net futures positions (long OI minus short OI) for: FII, DII, Client (retail), Pro (proprietary). "FII net long + Retail net short" at extremes = The most powerful bullish structural signal. Why: FII (most informed, best research, most capital) is maximum bullish. Retail (least informed, structurally wrong at extremes, FOMO/recency bias) is maximum bearish. The divergence creates a SQUEEZE CATALYST: When the market rises, retail's maximum short position MUST be covered (forced buy orders). This mechanical buying from 80,000+ retail short contracts adds enormous fuel to the rally that FII initiated. The combination = directional move (FII initiating) + mechanical amplifier (retail covering) = explosive rally.

**A8.** Short Buildup vs Long Unwinding: Short Buildup (OI rising + price falling): NEW shorts are being opened. OI rises because new contracts (new buyer + new seller, where the seller is the initiator) are being created. The selling pressure is GROWING (more sellers entering) — it can continue indefinitely as new shorts can always enter. This is the sign of institutional bearish conviction. Do NOT counter-trade. Long Unwinding (OI falling + price falling): EXISTING longs are closing. OI falls because contracts are being destroyed. The selling pressure is FINITE: There are only as many longs as already exist. When all panicking longs have exited: OI stops falling. Price finds a floor. Key distinction for trading: Short Buildup = bottomless selling potential = stay away from longs. Long Unwinding = finite selling = approaching a floor. Do NOT initiate new shorts in Long Unwinding.

**A9.** At expiry, OI across the series (as positions roll or close) tracks the institutional conviction of that series. During Phase E (Markdown): OI may have been built through short buildup. As expiry approaches and the SC forms: Long unwinding (OI falling). OI declines toward zero at expiry as positions close. When the next month OI is REBUILDING after expiry: If rebuilding with Long Buildup (new longs entering) = SC completed, accumulation beginning. If rebuilding with Short Buildup (new shorts entering on the re-open) = No accumulation, markdown continues. OI stabilisation at the SC: The moment OI stops declining (during the unwinding phase) corresponds to the Wyckoff SC moment — all panicking longs have exited. Supply is exhausted. This OI floor IS the price floor. Phase B begins as OI stabilises in a low range.

**A10.** Futures bullish scorecard — all bullish signals: (1) OI rising + price rising on SOS day = +3 pts (Institutional confirmation of genuine breakout). (2) FII net long at multi-month high and rising = +2 pts. (3) Client net short at maximum = +2 pts (contrarian bullish). (4) Basis expanding above fair value by 50%+ = +2 pts. (5) Rollover > 80% + premium in far month = +1 pt. (6) OI falling + price falling THEN OI stabilises = +1 pt (SC identification). Maximum futures bullish score: 11 points. Maximum 3-point event: OI Rising + Price Rising (Long Buildup) on SOS day. This scores maximum because: Rising OI means new capital committed from BOTH sides (new longs entering = real conviction). Combined with price breaking resistance (SOS): Proves the breakout is backed by genuine new institutional buying, not just short covering. This is the single most reliable breakout confirmation signal in the NSE futures dataset.

---

## KEY TAKEAWAYS

> **1. The 4 OI quadrants define the futures narrative: Long Buildup (OI↑ + Price↑) = genuine bullish conviction. Short Covering (OI↓ + Price↑) = borrowed rally (AR). Short Buildup (OI↑ + Price↓) = genuine bearish conviction. Long Unwinding (OI↓ + Price↓) = SC forming, finite selling.**

> **2. Basis = Futures − Spot. Expanding premium (above fair value) = institutional urgency, very bullish (SOS territory). Discount (futures below spot) = institutional fear, strongly bearish (approaching SC or distribution). Basis is the market's real-time vote on directional confidence.**

> **3. Rollover > 80% + far-month premium = Institutional conviction maintained into next month. Rollover < 65% + discount = Loss of conviction, position unwinding, bearish for next month. Check rollover every expiry Thursday.**

> **4. FII participant-wise OI maximum net long + Client maximum net short = The most powerful bullish NSE setup. FII (most informed) positioned bullish. Retail (least informed, structurally wrong at extremes) positioned bearish. When rally starts: Retail squeeze adds mechanical fuel.**

> **5. OI is NOT the same as volume. OI = commitment. Volume = activity. An SOS bar's credibility is CONFIRMED by rising OI (Long Buildup) and QUESTIONED by falling OI (Short Covering). Always check OI direction before treating any breakout as a genuine SOS.**

---

*Futures Analysis — Complete. Part XIII is complete.*

*Next topic in the plan: **Options Mechanics** (Part XIV).*

*Ready? Say: **"NEXT CHAPTER"***
