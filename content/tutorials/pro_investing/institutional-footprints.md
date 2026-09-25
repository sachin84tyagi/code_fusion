# Chapter 17 — Institutional Footprints

> **Course:** NSE/BSE Professional Volume + Price Action + VSA + Wyckoff + Market Microstructure
> **Part:** IX — Institutional Footprints
> **Prerequisite:** Chapters 8–9 (Volume), Chapter 12 (Wyckoff Principles), Chapter 5 (Market Microstructure)

---

## Chapter Overview

Every chapter so far has taught you how to READ the market's structure — price, volume, spread, Wyckoff phases, VWAP, and Volume Profile. Chapter 17 adds a different layer: **publicly available institutional data** that NSE, BSE, and SEBI publish every day. Most traders never look at this data. The few who do treat it as a secondary confirmation. The professional treats it as the PRIMARY evidence of what institutions are doing — and uses price-volume-VSA as the execution-level confirmation.

The six institutional data streams covered in this chapter are all **free, public, and updated daily**. The edge is not access — it is knowing how to read and weight each data source correctly within the Wyckoff framework.

**The Chapter 17 Rule:**

> **Delivery % is the X-ray. FII/DII flow is the ultrasound. Bulk/block deals are the biopsy. F&O OI is the bone scan. Promoter activity is the MRI. No single test is conclusive — but five tests that all point the same direction is a diagnosis you can trade.**

---

## LEVEL 1 — BEGINNER

### 17.1 The Six Institutional Footprint Data Streams

![Institutional Footprints — The Complete NSE Data Intelligence Map](/images/pi-institutional-footprints-map.jpg)

All six data streams are publicly available from NSE (nseindia.com), BSE (bseindia.com), and SEBI (sebi.gov.in).

| Data Stream | Source | Update Frequency | Lag |
|-------------|--------|-----------------|-----|
| FII/DII Net Flows | NSE / SEBI | Daily | Same day, after 4 PM |
| Delivery % | NSE Bhavcopy | Daily | Same day, end of session |
| Bulk & Block Deals | NSE/BSE | Real-time (bulk) / Same day (block) | Minutes to hours |
| F&O OI and PCR | NSE | Real-time during session | Live |
| Promoter/Insider Activity | SEBI | Monthly/Quarterly | 7–30 days lag |
| Institutional Shareholding | SEBI (Shareholding Pattern) | Quarterly | 21-day lag |

**How to access each:**

```
FII/DII:    nseindia.com → Market Data → FII/DII Activity
Delivery %: nseindia.com → Market Data → CM Bhavcopy → Download CSV
Bulk Deals: nseindia.com → Market Data → Bulk Deals / Block Deals
F&O OI:     nseindia.com → Derivatives → Option Chain
Promoter:   SEBI EDGAR / BSE Filing → Insider Trading Reports
Shareholding: BSE Filing → Shareholding Pattern (quarterly disclosure)
```

---

### 17.2 Delivery Percentage — The X-Ray of Institutional Intent

![Delivery % + FII Flow — Reading Institutional Intent Across a Market Cycle](/images/pi-delivery-fii-integration.jpg)

**What is Delivery %?**

```
Delivery % = (Delivery Volume / Total Volume) × 100

Delivery Volume: Shares that were ACTUALLY DELIVERED — i.e., the buyer
                 held the position overnight (T+1 settlement)

Total Volume: All shares traded during the session (including intraday
              buy-sell that nets to zero — the buyer sold back the same day)

If 10 crore shares of Reliance traded on Monday:
And 6 crore shares were delivered (held overnight by the buyer)
Then Delivery % = 60%

The other 4 crore = intraday trades (bought and sold the same session)
                    These do NOT deliver — they are pure speculation
```

**Why delivery % reveals institutional intent:**

```
INSTITUTIONAL INVESTORS (FII, Domestic MF, Insurance):
→ They build POSITIONAL stakes — they intend to hold weeks/months
→ They ALWAYS deliver (take delivery of shares)
→ Their activity = high delivery %

INTRADAY RETAIL TRADERS / HFT:
→ They buy and sell within the same session
→ They do NOT deliver (buy back before 3:30 PM)
→ Their activity = zero delivery %

HFT (High-Frequency Trading):
→ Holds for milliseconds/seconds, never delivers
→ HFT contributes 40–50% of NSE volume but 0% of delivery
→ Delivery % FILTERS OUT HFT completely

Therefore:
→ HIGH delivery % day → Institutional-dominated activity
→ LOW delivery % day → Retail/HFT-dominated activity (noise)
→ RISING delivery % trend → Institutions increasingly active (accumulating)
→ FALLING delivery % trend → Institutions decreasing activity (distributing/exiting)
```

**Delivery % benchmarks for NSE:**

```
Category              Typical Range    Signal
─────────────────────────────────────────────────────
Extreme Accumulation  > 70%            Very high institutional buying
High Institutional    55–70%           Institutional-dominated activity
Normal Range          35–55%           Mixed retail and institutional
Retail-Dominated      20–35%           Mostly retail/momentum activity
Speculative Extreme   < 20%            Almost purely intraday/speculative
```

**Reading delivery % across the Wyckoff cycle:**

```
ACCUMULATION PHASE:
→ Delivery % rising from 25–35% → 55–65% over the accumulation period
→ Rising delivery % at LOW prices = classic accumulation signature
→ Often INVISIBLE to most traders (they look at price, not delivery)

MARKUP PHASE:
→ Delivery % stable at 50–65%
→ Institutional holders holding; new buyers also delivering (trend participants)
→ On pullbacks: Delivery % may temporarily dip (retail selling)
→ On advances: Delivery % rises (new institutional buying at higher prices)

DISTRIBUTION PHASE:
→ Delivery % FALLING from 60–65% → 20–28% over the distribution period
→ FALLING delivery % at HIGH prices = classic distribution signature
→ The CO is SELLING (reduces their delivery each day they sell)
→ Retail is BUYING (but intraday — low conviction, no delivery)

MARKDOWN PHASE:
→ Delivery % low 18–28% (mostly speculative bounces)
→ Occasional spikes when panic sellers force delivery to shorts
→ Rising delivery % at the END of markdown = new accumulation beginning
```

**NSE practical: Delivery % data extraction:**

```
Daily Bhavcopy (NSE):
→ Download: nseindia.com → Market Data → Historical Data → CM Bhavcopy
→ Fields: SYMBOL, SERIES, OPEN, HIGH, LOW, CLOSE, LAST, PREVCLOSE,
          TOTTRDQTY (Total Volume), TOTALTRADES, ISIN,
          DELIV_QTY (Delivery Volume), DELIV_PER (Delivery %)

Key fields:
TOTTRDQTY = Total Volume
DELIV_QTY = Delivery Volume
DELIV_PER = Delivery % (pre-calculated)

Filter: Look for stocks where DELIV_PER > 60 AND total volume is > 1 lakh shares
        (to avoid illiquid stocks with artificially high delivery %)

NSE Bhavcopy is free and downloadable for any historical date.
```

---

### 17.3 FII and DII Net Flows

**FII (Foreign Institutional Investors):**

```
Who they are:
→ Foreign Portfolio Investors (FPIs) registered with SEBI
→ Categories: Category I (sovereign funds, global MFs), Category II, III
→ Include: Global hedge funds, pension funds (Vanguard, Fidelity, GIC, CPPIB etc.)

What the data shows:
→ Net equity buying or selling by all FPIs in aggregate, daily
→ Reported in ₹ crore and number of shares
→ Separate data for equity, debt, and hybrid instruments

How to read FII flow data:
Bullish signals (accumulation context):
→ Sustained net FII buying > ₹500 crore/day for 5+ consecutive sessions
→ FII buying while price is flat or declining (buying the weakness)
→ FII buying increasing while delivery % is rising

Bearish signals (distribution context):
→ Sustained net FII selling > ₹500 crore/day for 5+ consecutive sessions
→ FII selling while price is at or near ATH (selling the strength)
→ FII selling while delivery % is declining
```

**DII (Domestic Institutional Investors):**

```
Who they are:
→ Domestic mutual funds (SBI MF, HDFC MF, Nippon, etc.)
→ Insurance companies (LIC, HDFC Life, SBI Life)
→ Banks (investing their treasury)
→ Pension funds (NPS, EPFO)

Behaviour pattern vs FII:
→ DII often acts as a counterbalance to FII
→ When FII sells heavily: DII steps in to buy (supporting the market)
   This is because DII receives continuous SIP inflows regardless of market direction
→ When FII buys heavily: DII may reduce buying (rebalancing)
→ DII is LESS REACTIVE to global events; FII is more global-macro-driven

The combined signal:
→ BOTH FII AND DII buying: Maximum institutional demand
→ FII buying + DII selling: FII-driven bullishness; DII rebalancing
→ FII selling + DII buying: Market at risk of FII-driven correction but
                            DII providing a floor
→ BOTH FII AND DII selling: Severe institutional exit — major warning
```

**FII flow and the Wyckoff cycle:**

```
Accumulation Phase:
→ FII flow: Small positive daily (₹200–800 crore net buy)
→ Often BELOW the media radar (reported as "muted" or "mixed")
→ This is intentional — the CO does not announce their accumulation
→ You detect it by TRACKING 20-day cumulative FII flow, not daily noise

Distribution Phase:
→ FII flow: Starts small negative, then grows to large negative
→ Media reports: "FII profit booking," "global risk-off"
→ Reality: The CO is distributing their accumulated position
→ Track 20-day cumulative FII flow — if it crosses −₹10,000 crore: alert

Markup Phase:
→ FII flow: Increasingly positive (they hold and may add)
→ DII also positive (they buy as prices rise — trend-following)
→ 20-day cumulative FII buy > +₹20,000 crore = strong trend

Markdown Phase:
→ FII flow: Large net selling (−₹1,000–3,000 crore/day)
→ DII buying provides a partial floor but cannot offset FII
→ The public "buys the dip" — retail is the buyer that FII/DII both sell to
```

---

### 17.4 Bulk Deals and Block Deals

**Bulk Deal:**

```
Definition: A trade involving MORE than 0.5% of the total shares
            outstanding of a company in a single trading session.

Disclosure: Required to be reported to the exchange within 15 minutes
            of the transaction. Both buyer and seller details disclosed.

Where to find: NSE/BSE → Market Data → Bulk Deals

Key fields:
→ Stock symbol, date
→ Client name (buyer or seller)
→ Buy/Sell
→ Quantity
→ Price (average traded price)

Reading bulk deal data:
BULLISH bulk deal (buyer known institution):
→ "ICICI Prudential Mutual Fund — BUY — 1.2% of float at ₹480"
→ A recognised institution is BUILDING a positional stake
→ At ₹480 in an accumulation range → strong Wyckoff accumulation confirmation

BEARISH bulk deal (seller known institution or promoter):
→ "Promoter Group — SELL — 2% of float at ₹1,840"
→ The promoter is EXITING at the high
→ At ₹1,840 in a distribution range → very strong Wyckoff distribution signal

NEUTRAL (FII selling to another FII):
→ "XYZ Global Fund SELL" + "ABC Fund BUY" on the same day
→ No new information — one institution replacing another
```

**Block Deal:**

```
Definition: A negotiated transaction between two large parties for a
            minimum of ₹10 crore, executed in the Block Deal Window.

Block Deal Window (NSE/BSE):
→ Morning window: 8:45 AM – 9:00 AM (before regular market opens)
→ Afternoon window: 2:05 PM – 2:20 PM

Characteristics:
→ Price must be within the previous day's close ±1%
→ Both buyer and seller agree on price and quantity before execution
→ Immediately disclosed to the exchange
→ DOES appear in the day's Bhavcopy as a separate segment

Reading block deals:
→ Large block sale by promoter: Significant bearish signal (insider exiting)
→ Large block buy by domestic fund: Institutional conviction at this price level
→ Block deal at the low of a range + rising delivery %: Accumulation confirmation
→ Block deal at the high of a range + falling delivery %: Distribution confirmation
```

**The NSE bulk/block deal interpretation matrix:**

```
Who is SELLING?  | Who is BUYING?   | Signal
─────────────────────────────────────────────────────────────
Promoter         | Domestic MF      | Mixed (insider exit, but fund sees value)
FII (outflow)    | DII              | Market supported, but FII bearish
Promoter         | Retail investors | BEARISH (insider exit into retail demand)
FII (one)        | FII (another)    | Neutral (no net change in class)
Nobody special   | FII / MF (major) | BULLISH (institutional accumulation)
Promoter         | Nobody (market)  | Most BEARISH (promoter selling in open market)
```

---

## LEVEL 2 — INTERMEDIATE

### 17.5 F&O Data as Institutional Footprint

**Open Interest (OI):**

```
Definition: Total number of OUTSTANDING contracts in the derivatives market.
            Not cumulative volume — the number of ACTIVE (not yet closed) contracts.

OI increases: A new buyer AND a new seller both enter → OI + 1
OI decreases: An existing buyer AND an existing seller both close → OI − 1
OI unchanged: Existing holder sells to a new buyer → OI stays same

Interpretation in conjunction with price:

Price UP + OI UP:    New LONG positions being built → BULLISH (trend confirmation)
Price UP + OI DOWN:  Short positions being CLOSED (short covering) → Weak bullish
                     (the rally is shorts buying back, not new longs entering)
Price DOWN + OI UP:  New SHORT positions being built → BEARISH (trend confirmation)
Price DOWN + OI DOWN:Long positions being CLOSED (long unwinding) → Weak bearish
```

**Put-Call Ratio (PCR):**

```
PCR = Total Put OI / Total Call OI

Calculated for: All strikes at a given expiry OR specific strikes (e.g., ATM)

Interpretation:
PCR > 1.3: More puts than calls outstanding
           → Retail is BUYING PUTS (bearish hedges, fear)
           → Contrarian signal: When retail is extremely bearish (buying puts)
             the market is often near a BOTTOM (Wyckoff SC or Spring area)

PCR < 0.7: More calls than puts outstanding
           → Retail is BUYING CALLS (bullish speculation)
           → Contrarian signal: When retail is extremely bullish (buying calls)
             the market may be near a TOP (Wyckoff BC or UTAD area)

PCR 0.9–1.1: Balanced — no extreme retail positioning

NSE application:
→ Nifty options PCR (using full OI across all strikes):
  > 1.3 = Extreme fear / potential SC or Spring zone
  < 0.7 = Extreme greed / potential BC or UTAD zone
→ Use this as a CONFIRMATION tool for Wyckoff events,
  not as a standalone trading signal
```

**Max Pain:**

```
Definition: The strike price at which the maximum number of options
            (both puts and calls) would expire worthless.

Calculation: For each potential settlement price, calculate total
             notional loss for all option buyers. The price that
             minimises option buyers' total profit = Max Pain.

Significance: Option sellers (typically institutions and market makers)
              are short the most contracts at the max pain strike.
              They benefit when price settles AT max pain on expiry.
              They have incentives to push/pull price toward max pain.

Practical use:
→ Max pain is a WEEKLY expiry target reference
→ On Thursday (expiry day), price often gravitates toward max pain
→ If current price is ABOVE max pain: Expect some downward pressure
→ If current price is BELOW max pain: Expect some upward support
→ Max pain is not perfectly reliable but works better in range-bound weeks

NSE Max Pain data: Available on optionstradinglearner.com,
                   opstrader.in, or calculate from NSE option chain
```

**OI Buildup analysis — Institutional hedging footprints:**

```
Institutional investors who ACCUMULATE large equity positions
also BUY PUT OPTIONS as hedges.

When you see:
→ Stock delivery % rising (accumulation in cash market)
→ Stock OI in PUTS rising (institutional buying put protection)
→ IV of puts elevated relative to calls
→ This combination = Institutional LONG position in cash market
  with PUT hedge = they are accumulating and protecting

Distribution equivalent:
→ Stock delivery % falling (distribution in cash market)
→ Stock CALL option OI falling (institutions not hedging with calls as before)
→ Put skew reducing (they're not buying put protection anymore because
  they don't have a large long position to protect)
→ This combination = Institutional DISTRIBUTING in cash market
```

---

### 17.6 Promoter Activity and Insider Signals

**Promoter Shareholding Changes:**

```
Disclosure requirement: Listed companies must disclose shareholding
                        patterns quarterly (within 21 days of quarter end)
                        with the promoter/public/FII/DII breakdown.

Where to find: BSE Filings → Shareholding Pattern (by company, by quarter)

Reading promoter shareholding:
BULLISH signals:
→ Promoter shareholding INCREASING (creeping acquisition)
→ Promoter buying open market shares (SAST trigger if > 5%)
→ Promoter pledge % DECREASING (debt reduced, financial strength improving)

BEARISH signals:
→ Promoter shareholding DECREASING
→ Promoter selling in bulk/block deals
→ Promoter pledge % INCREASING (forced selling risk — largest warning)
```

**Promoter Pledge — The Hidden Time Bomb:**

```
Pledge: The promoter has pledged their shares as collateral for a loan.
        If the share price falls below the pledge value, the lender
        can SELL the pledged shares (margin call) → forces further selling
        → price falls more → more margin calls → cascade.

High pledge % risks:
→ Pledge > 50% of promoter holding: HIGH RISK
→ Pledge > 70% of promoter holding: EXTREME RISK
→ Any stock with high pledge is subject to cascade selling risk on any decline

NSE application:
→ For Wyckoff analysis: AVOID accumulation setups where promoter pledge > 50%
  (the potential for forced selling at the SC level makes the accumulation unreliable)
→ Distribution analysis: Stocks with HIGH pledge at ATH may collapse further
  than the Cause-Effect target because of cascade pledge selling

Data: BSE/NSE corporate announcements, SEBI pledge data (quarterly)
```

**SEBI Insider Trading Data:**

```
Requirement: Any "connected person" (promoter, director, key managerial
             person) who buys or sells MORE than ₹10 lakh of their
             company's stock must report within 2 days.

Where to find: SEBI EDGAR → Insider Trading Disclosures → XBRL filings

Reading insider data:
BULLISH: Company promoter/director BUYING in the open market
         (They know the company better than anyone — their own money at risk)
         
BEARISH: Multiple insiders SELLING simultaneously
         (Even one insider sale is noted; multiple simultaneous = significant warning)
         
Neutral: Single small sale by a non-promoter director (exercising ESOP, tax planning)
         This is routine and carries less signal weight
```

---

### 17.7 Dark Pools and Negotiated Deals in the NSE Context

**India does NOT have traditional dark pools** (as exist in the US). However, several mechanisms serve a similar function — allowing large institutional trades to occur with reduced market impact:

**Block Deal Window (8:45–9:00 AM / 2:05–2:20 PM):**

```
This IS India's dark pool equivalent:
→ Large trades negotiated bilaterally, executed within ±1% of prior close
→ Not visible in the regular order book during the window
→ Disclosed immediately after execution
→ Allows institutions to trade large blocks without market impact

Impact on analysis:
→ Large block deal + high delivery % = strong institutional commitment
→ Block deal price = institutional consensus on fair value at that moment
→ Block deals at range support = accumulation signal
→ Block deals at range resistance = distribution signal
```

**Iceberg Orders (Hidden Quantity):**

```
NSE allows participants to place "Disclosed Quantity" orders:
→ Only a portion of the total order size is shown in the order book
→ As each disclosed tranche fills, the next tranche appears

Example:
Iceberg buy order: 5 lakh shares, disclosed quantity: 50,000
→ Order book shows: Buy 50,000 at ₹480
→ When filled: Another 50,000 appears at ₹480
→ Continues until 5 lakh is fully executed

Detection:
→ Level 2 (order book) shows repeated large orders appearing at the same price
→ Price cannot easily move through a price level even when "small" orders show
→ This is a footprint of institutional accumulation at a specific price
→ In Wyckoff: Iceberg orders at the SC level = the absorption bar mechanism

NSE availability: Zerodha, Upstox, ICICIdirect all show L2 order book depth
Iceberg footprint: Watch for bids that replenish instantly when consumed at one price
```

---

### 17.8 Integrating All Six Footprints — The Institutional Evidence Scorecard

The power of institutional footprint analysis is in the COMBINATION, not any single metric. Use this scorecard for any potential accumulation trade:

**The Accumulation Evidence Scorecard:**

| Criterion | Bearish (0) | Neutral (1) | Bullish (2) | Score |
|-----------|-------------|-------------|-------------|-------|
| Delivery % trend (past 20 sessions) | Falling | Flat | Rising to >55% | /2 |
| FII 20-day cumulative flow | Large net sell | Mixed | Sustained net buy | /2 |
| DII 20-day cumulative flow | Net sell | Flat | Net buy | /2 |
| Bulk/block deals | Promoter selling | No deals | Institution buying | /2 |
| Promoter pledge % | >70% or rising | 30–70% | <30% or falling | /2 |
| F&O PCR | <0.7 (retail bullish) | 0.8–1.2 | >1.3 (retail bearish) | /2 |
| F&O Put OI trend | Declining | Flat | Rising (institutional hedge) | /2 |
| Insider transactions (past 30 days) | Multi-insider sell | None | Insider buy | /2 |

**Total Score: /16**

```
14–16/16: Maximum institutional confirmation — extremely high confidence
10–13/16: Strong institutional confirmation — high confidence
7–9/16:   Moderate institutional confirmation — proceed with caution
< 7/16:   Weak institutional confirmation — reduce position size or avoid
```

**Mirror scorecard for distribution** (reverse all bullish/bearish criteria).

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### 17.9 Quarterly Shareholding Pattern Analysis

The shareholding pattern is published within 21 days of each quarter end (March 31, June 30, September 30, December 31). It shows:

```
Category breakdown:
1. Promoter and Promoter Group (%)
2. Foreign Institutional Investors / FPI (%)
3. Domestic Institutional Investors (%)
   - Mutual Funds (%)
   - Insurance Companies (%)
   - Banks / Financial Institutions (%)
4. Public (Retail, HNI) (%)
5. Others

For each category: Current quarter % AND prior quarter %
Difference = net addition or reduction
```

**Reading quarterly shareholding for Wyckoff context:**

```
ACCUMULATION SIGNAL (all three together):
→ FPI % INCREASING quarter-over-quarter (FIIs adding)
→ Domestic MF % INCREASING (local institutions adding)
→ Promoter % stable or increasing
→ Public % DECREASING (retail exiting = selling into institutional buying)

DISTRIBUTION SIGNAL:
→ FPI % DECREASING (FIIs reducing position)
→ Public % INCREASING (retail buying = absorbing institutional selling)
→ Promoter % stable or slightly decreasing

DANGER SIGNAL:
→ Promoter % decreasing + Pledge % increasing
→ FPI % and DII % both decreasing simultaneously
→ Public % sharply increasing (retail is the only buyer)

Lag: The data is 21 days after quarter end = maximum 3.5 months old.
     Use to CONFIRM Wyckoff phase, not to time the entry.
     Entry timing uses VSA, VWAP, Volume Profile.
```

---

### 17.10 The Complete Institutional Surveillance System — NSE Daily Checklist

This is the daily pre-market preparation that a professional runs for their watchlist:

```
EVERY MORNING BEFORE 9:15 AM:

STEP 1 — FII/DII Update (2 minutes):
□ What was yesterday's FII net flow? (positive/negative, magnitude)
□ What is the 5-day cumulative FII flow? (trending positive or negative?)
□ What is the 20-day cumulative FII flow? (macro direction)
□ Any significant DII counterflow?

STEP 2 — Bhavcopy Delivery % Scan (5 minutes):
□ Download yesterday's Bhavcopy
□ Filter: Stocks in watchlist → check DELIV_PER for each
□ Flag any stock showing: DELIV_PER jump from <40% to >60% in one session
□ Flag any stock showing: DELIV_PER trend rising over past 5 sessions

STEP 3 — Bulk/Block Deal Review (2 minutes):
□ Any bulk/block deals in watchlist stocks yesterday?
□ If yes: Buyer or seller? Quantity? Price vs range?
□ Any promoter selling? (Immediate alert for any accumulation thesis)

STEP 4 — F&O Option Chain (3 minutes):
□ Nifty PCR for current expiry (extreme <0.7 or >1.3?)
□ Max pain for Thursday (if within 3 sessions of expiry)
□ For any individual stock trades: Check stock's PCR and put OI trend

STEP 5 — Insider/Promoter Update (weekly, not daily):
□ Once per week: Check SEBI insider trading disclosures for watchlist stocks
□ Any promoter buys or sells in the past 7 days?
□ Any change in pledge status (from company announcements on BSE/NSE)

Total time: < 15 minutes per morning
```

---

### 17.11 Institutional Footprints at Different Market Caps

The reliability of each data stream varies by market cap:

```
LARGE CAP (Nifty 50, market cap > ₹1 lakh crore):
→ FII data: High signal (FII activity is concentrated in large caps)
→ Delivery %: Moderately reliable (large daily volume dilutes HFT effect)
→ Bulk deals: Meaningful (FII/MF visible through bulk deals)
→ F&O OI: Very reliable (liquid options, genuine institutional hedging)
→ Promoter activity: Lower signal (promoters often locked up or restricted)
Best use: FII flow + F&O OI + Delivery % combination

MID CAP (Nifty Midcap 100, market cap ₹10,000–₹1 lakh crore):
→ FII data: Moderate signal (some FIIs play mid-caps)
→ Delivery %: HIGHEST SIGNAL (less HFT, delivery % is more representative)
→ Bulk deals: Very high signal (large % moves when a mid-cap is bulk-dealt)
→ F&O OI: Limited (many mid-caps don't have liquid options)
→ Promoter activity: High signal (promoters more actively involved)
Best use: Delivery % + Bulk deals + Insider/Promoter

SMALL CAP (< ₹10,000 crore market cap):
→ FII data: Low (FIIs rarely disclose small-cap activity separately)
→ Delivery %: Can be distorted (small float + one large delivery = spike)
→ Bulk deals: HIGHEST SIGNAL (any bulk deal is a major % of float)
→ F&O: Usually none (no F&O available for most small caps)
→ Promoter activity: CRITICAL SIGNAL (promoter the most informed participant)
Best use: Delivery % trend + Bulk deals + Promoter activity
WARNING: Small cap institutional data can be EASIER TO MANUFACTURE (operators)
```

---

## EXERCISES

### Beginner Exercises

**Exercise 17.1 — Delivery % Calculation and Classification**

Calculate delivery % and classify each session:

| Session | Total Volume (lakh shares) | Delivery Volume (lakh shares) | Delivery % | Classification |
|---------|--------------------------|------------------------------|------------|----------------|
| A | 45.2 | 28.1 | ? | ? |
| B | 82.6 | 14.9 | ? | ? |
| C | 23.4 | 18.8 | ? | ? |
| D | 105.8 | 21.2 | ? | ? |
| E | 38.1 | 38.1 | ? | ? |

For each: (a) Calculate delivery %. (b) Classify using the benchmark table. (c) State what this tells you about participant composition.

**Exercise 17.2 — FII/DII Flow Interpretation**

Interpret each FII/DII scenario in the context of a price range (potential Wyckoff accumulation):

| Scenario | FII Flow | DII Flow | Price | Delivery % trend |
|----------|---------|---------|-------|-----------------|
| A | Net buy ₹320 Cr | Net buy ₹180 Cr | Flat, range-bound | Rising 32% → 58% |
| B | Net sell ₹1,200 Cr | Net buy ₹800 Cr | Declining | Low 22–28% |
| C | Net buy ₹180 Cr | Net sell ₹90 Cr | Rising (ATH) | Falling 62% → 31% |
| D | Net sell ₹450 Cr | Net sell ₹220 Cr | Falling | Low 18–24% |
| E | Net buy ₹680 Cr | Net buy ₹420 Cr | Rising, pullback today | Stable 55–60% |

For each: (a) Accumulation, Distribution, Markup, or Markdown signal? (b) Confidence level? (c) Action?

**Exercise 17.3 — Bulk Deal Reading**

Interpret each bulk deal in the context of its stock:

| Stock | Bulk Deal Details | Price context | Interpretation |
|-------|------------------|---------------|----------------|
| A | SBI MF buys 1.8% of float at ₹480 | Stock at 52-week low range | ? |
| B | Promoter sells 2.4% of float at ₹1,820 | Stock near all-time high | ? |
| C | FPI1 sells 1.2%, FPI2 buys 1.2%, same price ₹950 | Mid-markup | ? |
| D | Promoter buys 0.8% of float at ₹320 | Stock down 45% from peak | ? |
| E | Unknown entity sells 3% of float at ₹620 | Stock forming distribution range | ? |

---

### Intermediate Exercises

**Exercise 17.4 — Institutional Evidence Scorecard**

Apply the 8-criterion Accumulation Evidence Scorecard to this stock:

Stock: NSE mid-cap auto ancillary (market cap ₹8,000 crore)

Data:
- Delivery %: Past 20 sessions — rose from 28% to 64%
- FII 20-day cumulative: +₹145 crore net buy (small but consistent)
- DII 20-day cumulative: +₹82 crore net buy
- Bulk deals: No recent bulk deals
- Promoter pledge %: 18% (down from 24% six months ago)
- Nifty PCR: 1.28 (moderately elevated fear)
- Stock Put OI: Rising over past 2 weeks
- Insider transactions: Promoter bought ₹2.2 crore worth 3 weeks ago

Score each criterion (0, 1, or 2) and calculate the total. What is the confidence level? How does this inform position sizing if the Wyckoff Nine Tests score is 7/9?

**Exercise 17.5 — F&O Data Interpretation**

Interpret each F&O scenario in the Wyckoff context:

**Scenario A:** Nifty at 24,500. PCR = 0.62. Max pain = 24,200. Call OI significantly higher than put OI at every strike.

**Scenario B:** Stock at ₹820 (near its SC area after a 40% decline). PCR for this stock = 1.68. Put OI has increased 180% in the past 5 sessions.

**Scenario C:** Nifty at an all-time high. PCR = 0.55. FII futures OI: FIIs have added 12,000 contracts of NET SHORT in Nifty futures. DII futures OI: DIIs have added 8,000 contracts of NET LONG.

For each: (a) What is the retail sentiment? (b) What is the institutional positioning? (c) Wyckoff phase context? (d) Trading implication?

**Exercise 17.6 — Quarterly Shareholding Pattern Reading**

Analyse the shareholding pattern change for a mid-cap PSU bank:

| Category | Dec quarter (%) | Mar quarter (%) | Change |
|----------|----------------|----------------|--------|
| Government (promoter) | 51.2 | 51.2 | 0 |
| FPI | 8.4 | 11.8 | +3.4 |
| Domestic MF | 6.2 | 8.9 | +2.7 |
| Insurance | 4.1 | 3.8 | −0.3 |
| Banks/FI | 1.2 | 1.1 | −0.1 |
| Public (retail) | 28.9 | 23.2 | −5.7 |

a) What happened between December and March? Who was buying/selling?
b) What does the retail decrease + FPI/MF increase tell you about this period?
c) If price was FLAT during this quarter despite heavy institutional buying: Which Wyckoff phase does this suggest?
d) How would this data change your Nine Buying Tests score?
e) What is the next expected phase?

---

### Advanced Exercises

**Exercise 17.7 — Complete Institutional Surveillance for a Live Trade**

You are planning to enter the Wyckoff LPS on a Nifty 50 large-cap IT stock. Before executing, you run the complete institutional surveillance. Apply all five steps of the daily checklist:

**Available data:**
- FII 5-day flow: +₹220, +₹350, +₹180, −₹80, +₹410 crore (net)
- 20-day FII cumulative: +₹2,800 crore
- Yesterday's Bhavcopy: Delivery % = 68% (up from 42% two weeks ago)
- Bulk deals (past 5 sessions): "Mirae Asset MF — BUY — 0.8% of float at ₹3,820"
- F&O: Stock PCR = 1.22, Put OI rising, IV skew flat
- Insider activity: CTO sold ₹18 lakh worth 4 weeks ago (routine ESOP exercise)
- Promoter pledge: 0% (no pledge)

Run the complete checklist and scorecard. What is the total evidence score? Is this sufficient to proceed with the LPS entry? What is the one concern in the data and how do you weight it?

**Exercise 17.8 — Promoter Pledge Risk Analysis**

Two stocks are both showing Wyckoff accumulation setups with Nine Tests score 7/9:

**Stock A:** Promoter holding = 62%, Pledge = 71% of promoter holding, FII increasing, delivery % rising.

**Stock B:** Promoter holding = 55%, Pledge = 0%, FII increasing, delivery % rising.

a) Calculate the pledge risk for Stock A: What % of total shares are pledged by the promoter?
b) At what price decline does the pledge create cascade selling risk? (assume margin ratio of 1.5× — price must not fall below the 67% of pledge value level)
c) How does the pledge risk affect position sizing in Stock A vs Stock B?
d) Should you avoid Stock A entirely or adjust the trade? What specific stop level and position size adjustment is appropriate?
e) Design both trade plans showing the pledge-adjusted version of the Nine Buying Tests.

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** What is Delivery % and how is it calculated? Why does high delivery % specifically indicate institutional (rather than retail or HFT) activity?

**Q2.** Explain how delivery % changes across the four Wyckoff phases. At which phase transition does delivery % give the EARLIEST warning signal?

**Q3.** What are FII and DII? How do their behavioural patterns differ, and what does it mean when BOTH are simultaneously selling?

**Q4.** What is the difference between a Bulk Deal and a Block Deal on NSE? Which carries higher signal value for Wyckoff analysis and why?

**Q5.** Explain Open Interest and the four OI+Price combinations. Which combination provides the strongest bearish confirmation, and which the weakest bullish signal?

**Q6.** What is the Put-Call Ratio (PCR) and how is it used as a contrarian indicator? What specific PCR levels align with Wyckoff accumulation zones and distribution zones?

**Q7.** What is Max Pain in F&O? How does it create a price gravitational effect on Thursday (expiry day) and how should traders adjust for this?

**Q8.** Explain promoter pledge risk. Why does a high pledge % convert an accumulation setup into a high-risk trade, and what specific cascade mechanism is triggered?

**Q9.** Describe India's equivalent of "dark pools" — the Block Deal Window. How does it differ from regular market trading and why does it matter for institutional footprint analysis?

**Q10.** Explain why delivery % is more reliable as an institutional signal in mid-cap stocks than in large-cap stocks. Conversely, why is F&O OI data more useful for large-caps?

---

### Chart Scenario Questions (5)

**S1.** A Nifty 500 mid-cap shows a potential Wyckoff accumulation (Nine Tests: 6/9). You run the institutional evidence scorecard:

- Delivery % trend: 22% → 34% → 41% → 52% → 61% (past 5 weeks)
- FII 20-day: −₹42 crore (small negative — FII not in mid-caps normally)
- DII 20-day: +₹68 crore
- Bulk deal (2 weeks ago): "Nippon India MF — BUY — 1.2% of float at ₹280"
- Promoter pledge: 8%
- No F&O (stock not in F&O)
- Insider: Promoter bought ₹4.8 crore 1 month ago

Score the scorecard (adjusting for N/A on F&O). What is the effective score out of the available criteria? Confidence level? Position size relative to a full-score setup?

**S2.** Nifty 50 is at a potential BC zone (Nine Selling Tests: 5/9). F&O data shows:

- Nifty PCR = 0.58 (falling from 1.1 two weeks ago)
- Call OI buildup: ₹24,500 and ₹25,000 strikes — massive call OI
- FII Nifty futures: FIIs have ADDED 18,000 contracts of SHORT this week
- DII Nifty futures: DIIs have ADDED 6,000 contracts of LONG

Analyse: (a) What does the PCR trend tell you? (b) What does the massive call OI at 24,500–25,000 tell you about institutional intent? (c) What does FII short addition in futures tell you? (d) What does DII long addition in futures tell you? (e) Net interpretation: Bull or Bear? What is the Nine Selling Tests adjustment based on this F&O data?

**S3.** You hold a long position entered at the Wyckoff LPS at ₹480. Current price: ₹620 (30% gain). Today's Bhavcopy shows delivery % = 18% (lowest in 8 weeks). Yesterday's bulk deal: "Promoter — SELL — 1.4% of float at ₹618."

Does the institutional data change your trade management decision? Apply the distribution evidence scorecard with this new data. At what scorecard total would you EXIT the position immediately?

**S4.** A small-cap stock (market cap ₹3,200 crore) shows rising delivery %, a promoter buyback announcement, and a bulk deal where "unknown entity" sold 3% of the float to "related parties." The stock has risen 85% in 3 months. No F&O available.

a) What are the conflicting signals here?
b) What specifically is suspicious about "related party" bulk deals?
c) How does the "operator risk" in small caps change your analysis?
d) What additional checks would you perform before taking any trade?
e) Apply the small-cap institutional data reliability framework from Section 17.11.

**S5.** NSE market-wide institutional footprint analysis:

Three-month data:
- FII cumulative equity: −₹48,000 crore (massive outflow)
- DII cumulative equity: +₹52,000 crore (large inflow — MF SIPs)
- Nifty delivered a −12% return in this period
- Nifty 50 delivery %: Average 34% across the period (below normal)
- PCR for Nifty: Has been above 1.35 for 6 consecutive weeks

a) Is this an accumulation or a distribution at the market level?
b) FII selling + DII buying: What is happening to the market's ownership structure?
c) PCR above 1.35 for 6 weeks: What does retail sentiment look like and what is the contrarian implication?
d) If a Wyckoff SC appears in the next 2 weeks: How does this macro institutional data change your confidence in the SC?
e) Design the market-level trade plan (Nifty long) using Wyckoff + all six institutional footprint streams.

---

## QUIZ ANSWERS

### Conceptual Answers

**A1.** Delivery % = (Delivery Volume / Total Volume) × 100. Delivery volume = shares that physically changed hands overnight (the buyer held them past the session). High delivery % indicates institutional activity because: (1) Institutional investors (MF, FII, insurance) are mandated long-term holders — they ALWAYS take delivery. (2) HFT trades in milliseconds and never delivers. (3) Retail intraday traders buy and sell within the session and do not deliver. HFT constitutes 40–50% of NSE volume but 0% of delivery. Therefore, delivery % FILTERS OUT HFT and intraday noise. High delivery % = the trading was dominated by participants who intended to hold overnight → institutional participants by definition.

**A2.** Delivery % across Wyckoff phases: Accumulation → Rising (25–35% to 55–65%): institutions quietly building positional stakes. Markup → Stable high (50–65%): institutional holders holding + new entrants delivering. Distribution → Falling (65% to 20–28%): institutions exiting, selling to retail buyers who are mostly intraday. Markdown → Low (18–28%): mostly speculative bounces with minimal delivery. EARLIEST warning signal: The transition from Distribution to Markdown — delivery % begins falling WHILE PRICE IS STILL AT HIGHS. This divergence (falling delivery % at ATH) precedes the BC and SOW by 2–4 weeks, giving the earliest signal that distribution is occurring before price breaks down.

**A3.** FII: Foreign Portfolio Investors — global institutions (sovereign funds, hedge funds, global MFs). They are driven by global macro factors, dollar strength, risk appetite, and India's relative attractiveness. They can exit India quickly and completely. DII: Domestic institutions — Indian MFs, insurance, banks. They receive continuous SIP inflows regardless of market direction and cannot exit India. Behavioural difference: DII tends to buy when FII sells (SIP inflows forced into the market), creating a partial floor. Simultaneous FII AND DII selling: Maximum bearish signal — both classes of institutional buyers have withdrawn. Only retail remains as the buyer. This is the classic markdown scenario: retail "buys the dip" while all institutions are selling.

**A4.** Bulk Deal: >0.5% of outstanding shares in a single session, in the regular market. Immediately disclosed. Visible in the regular session OHLCV. Block Deal: ₹10 crore minimum, negotiated bilaterally in the pre-market or afternoon window (8:45–9:00 AM or 2:05–2:20 PM). Executed off the live order book. Disclosed after execution. Higher signal value: Block Deal, for two reasons: (1) It is negotiated — both sides AGREE on price and quantity. This is not a market order hitting random bids/asks; it is a deliberate transaction at a deliberately chosen price. (2) The price must be within ±1% of prior close — it cannot be a distorted outlier. A block deal at range support means a large institution specifically WANTED that price at that level.

**A5.** Open Interest (OI) = total outstanding (not yet closed) contracts. Four combinations: (1) Price UP + OI UP: New long positions → BEARISH CONFIRMATION for bulls (strongest bullish). (2) Price UP + OI DOWN: Short covering → Weak bullish (shorts buying, not new longs entering). (3) Price DOWN + OI UP: New short positions → STRONGEST BEARISH confirmation. (4) Price DOWN + OI DOWN: Long liquidation → Weak bearish (longs selling, not new shorts entering). Strongest bearish: Price DOWN + OI UP = new short sellers entering actively. Weakest bullish signal: Price UP + OI DOWN = short covering only; no genuine new demand.

**A6.** PCR = Total Put OI / Total Call OI. Contrarian indicator: When retail is maximally bearish (PCR > 1.3 — buying puts), the market is near a bottom because (a) Retail is consistently wrong at extremes, (b) Large put OI creates delta-hedging buying by market makers (who are short puts), (c) The high PCR itself signals fear has peaked = potential SC or Spring zone. Distribution zones: PCR < 0.7 — retail is maximally bullish (buying calls) = potential BC or UTAD zone. Contrarian: When retail is most convinced the market will go up (buying calls, PCR < 0.7), the CO has already completed distribution and is ready to begin markdown. NSE accumulation alignment: PCR > 1.3 = retail bearish = consistent with Wyckoff accumulation phases where public is fearful.

**A7.** Max Pain = strike where maximum number of options expire worthless = maximum financial pain for option BUYERS, minimum pain for option SELLERS. Option sellers are typically institutions/market makers who are net short options. They benefit from price settling at Max Pain. Gravitational effect: Market makers who are net short options continuously delta-hedge as price moves. Their hedging activity creates buy pressure when price falls toward Max Pain and sell pressure when price rises above Max Pain. On Thursday (expiry): This effect is strongest — positions must be closed/settled. Adjustment for traders: Note the Max Pain strike before each Thursday. Be cautious of opposing it. If Nifty is significantly above Max Pain entering Thursday, modest downward pressure is expected (reduce long exposure near max pain).

**A8.** Promoter pledge: Promoter uses their shareholding as collateral for a bank loan. If the share price falls below the pledge threshold (typically 133–150% of loan value), the lender triggers a margin call → forces immediate sale of pledged shares → prices fall further → lower prices trigger more margin calls → cascade. High pledge % converts accumulation to high-risk because: The technical accumulation setup assumes no forced sellers below the SC low. But a promoter with 70% of their holding pledged BECOMES a forced seller if price falls 20–30% from the pledge value. The SC may not hold as the bottom because this forced selling can drive price to genuinely new lows. Trade adjustment: Either avoid high-pledge stocks entirely during accumulation setups, or use a much wider stop (below the potential pledge-trigger level) and smaller position size.

**A9.** Block Deal Window (8:45–9:00 AM and 2:05–2:20 PM on NSE/BSE) = India's dark pool equivalent. Regular market: Orders visible in the live order book; price discovery is continuous and open. Block Deal Window: Price negotiated bilaterally BEFORE the window opens; execution happens in the window without being visible in the regular order book during that period. Disclosed AFTER execution. This allows large institutions to trade without the market front-running or impact-costing their order. Importance for footprint analysis: Block deals reveal BILATERAL AGREEMENT at a specific price. Two institutions agreed ₹10 crore+ should change hands at ₹X — that price is an institutional consensus fair value. Block deals at Wyckoff range levels are particularly meaningful.

**A10.** Delivery % more reliable for mid-caps: In large caps (Nifty 50), HFT volume is highest in absolute terms (large caps are most liquid). Even after HFT does not deliver (filters out), the remaining volume has large retail participation that also doesn't deliver. The signal/noise ratio is lower. In mid-caps: HFT is less active (smaller liquidity); retail is less active (less media coverage); institutional delivery is a LARGER proportion of total activity. Therefore each percentage point of delivery % is more meaningful. F&O OI more useful for large-caps: Most mid-caps do NOT have liquid options — their F&O segment is thin or absent. Large-caps (Nifty 50) all have liquid options markets with genuine institutional hedging OI. For large-caps, the options market is a direct institutional communication channel.

---

## KEY TAKEAWAYS — CHAPTER 17

> **1. Six publicly available institutional data streams: Delivery %, FII/DII flows, Bulk/Block deals, F&O OI/PCR, Promoter/Insider activity, Quarterly shareholding. All free. All on NSE/SEBI.**

> **2. Delivery % is the X-ray: Rising in a price RANGE = accumulation. Falling at price HIGHS = distribution. This leads price by 2–4 weeks and filters out all HFT noise.**

> **3. The Accumulation Evidence Scorecard combines all eight criteria. Score 14+/16 = maximum confidence. Score < 7/16 = avoid regardless of how good the Wyckoff setup looks.**

> **4. FII + DII simultaneously buying during a flat range = maximum institutional demand confirmation. FII + DII simultaneously selling = maximum bearish signal — only retail remains as buyer.**

> **5. Promoter pledge > 50% = structural risk to any accumulation thesis. The cascade mechanism can invalidate Wyckoff SC support levels. Adjust position size and stop accordingly.**

> **6. F&O PCR > 1.3 (retail extremely bearish) aligns with Wyckoff accumulation/Spring zone. PCR < 0.7 (retail extremely bullish) aligns with Wyckoff distribution/UTAD zone. Use contrarily.**

> **7. The daily 15-minute surveillance routine (FII flow + Bhavcopy delivery scan + bulk/block deals + F&O PCR + weekly insider check) is the professional's pre-market preparation — not optional.**

---

*Chapter 17 Complete. Part IX — Institutional Footprints is complete.*

---

**Previous:** [← Chapter 16 — VWAP](./vwap.md)
**Next:** [Chapter 18 — Order Flow Analysis →](./order-flow-analysis.md)

*Part X — Order Flow begins next.*

*When ready, say: **"NEXT CHAPTER"***
