# FII DII Analysis

> **Course:** NSE/BSE Professional Investing — Price, Volume & Institutional Flow
> **Part:** X — Indian Institutional Data
> **Topic:** FII DII Analysis

---

## Chapter Overview

Every price move on NSE ultimately traces back to one source: **money flows from institutions**. Retail traders are the noise; FII and DII are the signal. Understanding who they are, what drives their decisions, and how to read their daily data on NSE converts a chart-only analyst into someone who reads price AND the institutional engine behind it.

**The Core Rule:**

> **A chart without FII/DII context is like reading a cricket scorecard without knowing who is batting. The score makes sense, but you have no idea what's driving it. FII/DII data tells you who is batting — and whether they are in aggressive or defensive mode.**

---

## LEVEL 1 — BEGINNER

### Who Are FII and DII?

![FII & DII Flow Framework — Reading Institutional Money on NSE](/images/pi-fii-dii-flow-framework.jpg)

**FII — Foreign Institutional Investors (also called FPI — Foreign Portfolio Investors):**

```
LEGAL ENTITY: Foreign Portfolio Investors registered with SEBI under FPI Regulations 2019.

WHO THEY ARE:
→ Global mutual funds (Vanguard, Fidelity, Franklin Templeton)
→ Hedge funds (Renaissance, Bridgewater, Tiger Global)
→ Sovereign wealth funds (GIC Singapore, Abu Dhabi Investment Authority, Norges Bank)
→ Pension funds (CPPIB Canada, CalPERS USA)
→ Endowments and foundations

SIZE: FIIs collectively own approximately 17–22% of NSE-listed companies by market cap.
      Their daily trading volume = 15–25% of total NSE cash market turnover.

WHAT DRIVES THEIR ALLOCATION TO INDIA:
→ India's weight in MSCI Emerging Markets Index
   (When MSCI rebalances India's weight upward: automatic inflows)
→ USD/INR exchange rate (INR weakening = currency loss for USD-denominated fund)
→ US interest rates (Higher US rates = USD assets more attractive = FII outflows from India)
→ India GDP growth differential vs global peers
→ Earnings growth visibility (corporate earnings momentum)
→ Global risk appetite (VIX levels, credit spreads)

KEY INSIGHT: FIIs can move large blocks of capital quickly.
             A decision by a US fund to REDUCE India from 8% to 6% of EM portfolio
             = billions of dollars of SELL orders on NSE over days/weeks.
             This creates the Wyckoff distribution at the INDEX level.
```

**DII — Domestic Institutional Investors:**

```
WHO THEY ARE:
→ Domestic Mutual Funds (SBI MF, HDFC MF, ICICI Pru MF, Nippon MF, Axis MF etc.)
→ Life Insurance Corporation (LIC — single largest DII, owns 4-5% of most large Nifty stocks)
→ Private insurance companies (HDFC Life, ICICI Lombard, SBI Life)
→ Pension funds (EPFO — Employees' Provident Fund Organisation, NPS)
→ Small Finance Banks, Co-operative Banks (limited activity)

THE SIP MACHINE:
→ Systematic Investment Plan (SIP) inflows to mutual funds:
   2022: ₹12,000 Crore/month
   2023: ₹16,500 Crore/month
   2024: ₹20,000+ Crore/month
   This is MANDATED, MONTHLY, IRRESPECTIVE OF MARKET LEVEL.
   Even when FII is selling ₹15,000 Crore: SIP adds ₹20,000 Crore to the market.

WHY DII IS COUNTER-CYCLICAL:
→ FII: Reduces India allocation when global risk-off (sells at market lows)
→ DII: Receives SIP inflows even at market lows. Must deploy capital. Buys at lows.
→ This creates the structural SUPPORT in Indian market corrections.
→ The 2020, 2022, and 2023 market dips were ALL cushioned by DII buying.

LIC FACTOR:
→ LIC is special — when government needs to stabilise markets, LIC buys.
→ LIC buying is sometimes "directed" buying (policy-driven, not purely market-driven).
→ LIC bulk/block purchases show up in the block deal data (Chapter: Block Bulk Deals).
```

---

### How to Access FII/DII Data on NSE

**The NSE daily provisional data (most important for daily traders):**

```
WHERE: nseindia.com → Market Data → FII/DII Activity
       bseindia.com → Market → FII/DII Data

WHEN AVAILABLE: 6:00 PM – 7:00 PM on each trading day (provisional)
               Final figures available the next morning

WHAT IT SHOWS:
→ FII Gross Buy (₹ Crore): Total value of all FII purchases in equity market
→ FII Gross Sell (₹ Crore): Total value of all FII sales in equity market
→ FII Net (₹ Crore): FII Gross Buy − FII Gross Sell

→ DII Gross Buy (₹ Crore)
→ DII Gross Sell (₹ Crore)
→ DII Net (₹ Crore)

SAMPLE DATA TABLE (reading example):
Date      | FII Buy    | FII Sell   | FII Net    | DII Net
Sep 25    | ₹14,240 Cr | ₹12,180 Cr | +₹2,060 Cr | −₹840 Cr
Sep 24    | ₹11,820 Cr | ₹14,390 Cr | −₹2,570 Cr | +₹1,980 Cr
Sep 23    | ₹13,450 Cr | ₹11,200 Cr | +₹2,250 Cr | −₹1,120 Cr

Reading Sep 24:
FII Net = −₹2,570 Cr (FII sold ₹2,570 Cr more than they bought)
DII Net = +₹1,980 Cr (DII bought ₹1,980 Cr more than they sold)
→ Classic Scenario 3: FII selling, DII absorbing. Correction day.
```

**The SEBI monthly data (for deeper analysis):**

```
WHERE: sebi.gov.in → Market Statistics → Monthly Bulletin

WHAT IT SHOWS:
→ Cumulative FII/FPI equity and debt flows for the month
→ Sector-wise FII holding percentages (each sector's FII ownership)
→ Number of registered FPIs and their asset allocation

LIMITATION: Monthly data is published with a 10–15 day lag.
            Use daily NSE data for trading decisions.
            Use monthly SEBI data for macro trend analysis (1–3 month horizon).
```

---

### The 20-Day Cumulative Rule

**Single-day FII data is noise. 20-day cumulative is the signal.**

```
WHY 20 DAYS?
→ Institutional position-building takes time (20+ trading sessions = ~1 month)
→ Large funds cannot buy in one day without moving the market against themselves
→ They accumulate (or distribute) over weeks
→ 20-day cumulative captures the TREND, not the daily fluctuation

HOW TO CALCULATE (takes 2 minutes):
1. Download last 20 trading days of FII Net data from NSE
2. Sum all 20 values
3. Plot or note the result

FOUR KEY READINGS:

Reading 1 — Cumulative POSITIVE and rising (+₹10,000 to +₹50,000 Cr):
→ FII is in sustained buy mode for 20 trading days
→ Market is being accumulated by foreign institutions
→ Wyckoff interpretation: Phase D accumulation or Markup is under way
→ Bias: BULLISH. Long setups take priority.

Reading 2 — Cumulative NEGATIVE and falling (−₹10,000 to −₹50,000 Cr):
→ FII is in sustained sell mode
→ Market is being distributed
→ Wyckoff interpretation: Phase D distribution or Markdown
→ Bias: BEARISH. Short setups or cash.

Reading 3 — Cumulative crosses ZERO (negative → positive):
→ The MOST IMPORTANT signal in FII analysis
→ FII has switched from net seller to net buyer
→ Wyckoff interpretation: Potential Phase C Spring or Phase D SOS at INDEX level
→ Action: Upgrade market bias from BEARISH to BULLISH.
          Begin watching for individual stock LPS setups.

Reading 4 — Cumulative crosses ZERO (positive → negative):
→ FII has switched from net buyer to net seller
→ Wyckoff interpretation: Potential UTAD or SOW at index level
→ Action: Downgrade bias to BEARISH. Tighten stops on all longs.
          Begin watching for individual stock LPSY setups.

NSE HISTORICAL EXAMPLES:
→ October 2021: FII 20-day cumulative crossed zero (positive→negative).
   Nifty peaked at 18,600. Distribution began.
→ June 2022: FII 20-day cumulative crossed zero (negative→positive).
   Nifty bounced from 15,183. Accumulation Phase C.
→ March 2023: FII cumulative turned strongly positive (+₹35,000 Cr / 20 days).
   Nifty marked up from 17,000 to 20,000 in 4 months.
```

---

## LEVEL 2 — INTERMEDIATE

### The 4 FII/DII Scenarios

![FII vs DII Behaviour Patterns — 4 Market Scenarios Decoded](/images/pi-fii-dii-behavior-patterns.jpg)

**Scenario 1 — Both Buying (FII Net Buy + DII Net Buy):**

```
WHEN IT OCCURS: Strong bull markets with positive India macro AND rising SIP flows.
Historical example: 2023-24 bull run (MSCI weight increase + RBI rate pause + strong GDP).

MARKET IMPLICATION:
→ Supply is scarce. Both large buyer categories are competing for the same shares.
→ Every dip is immediately bought (FII + DII both see lower prices as entry opportunities).
→ Nifty trends strongly with low drawdowns.

TRADING ACTION:
→ All longs: Full size. Conviction-sized positions.
→ Shorts: Avoid. Even valid distribution setups fail because fresh buying absorbs supply.
→ Watchlist: Only long candidates. Short watchlist empty.
→ Stop-loss: Can be wider (momentum sustains trends longer in this scenario).
```

**Scenario 2 — FII Buying, DII Selling:**

```
WHEN IT OCCURS: Recovery phase when FII is re-entering but MF is booking profits
                (MF investors redeem after market rises — DII must sell).

MARKET IMPLICATION:
→ FII is accumulating supply released by DII profit-taking.
→ This is CLASSIC Wyckoff absorption — CO (FII) absorbing supply from weaker hands (DII profit-booking).
→ Market rises slowly, with periodic dips as DII sells. FII absorbs each dip.
→ Volume on up-days > volume on down-days (FII buying drives up-days, DII selling modest).

TRADING ACTION:
→ Watch for individual stock LPS setups — these form as FII accumulates supply.
→ Delivery % on individual stocks: Rising delivery % = FII absorbing (institutional delivery).
→ Confirm: Nifty trend is UP. FII 20-day cumulative is positive.
→ Short setups: Only in the weakest sector (Scenario 2 doesn't affect all sectors equally).
```

**Scenario 3 — FII Selling, DII Buying (Most Common in Corrections):**

```
WHEN IT OCCURS: Global risk-off events, US rate hikes, rupee depreciation. FII reduces EM.
                DII continues deploying monthly SIP cash.

MARKET IMPLICATION:
→ FII is the SUPPLY. DII is the DEMAND.
→ This is Phase A-B of Wyckoff accumulation at the INDEX level.
→ Market falls in bursts (FII selling days) but is cushioned (DII buying days).
→ The DECLINE SLOWS as FII selling shrinks and DII absorbs available supply.

KEY SIGNAL WITHIN SCENARIO 3:
Watch the FII daily net sell figure over 5 days:
Day 1: FII net −₹4,200 Cr (heavy selling)
Day 2: FII net −₹3,800 Cr
Day 3: FII net −₹2,600 Cr
Day 4: FII net −₹1,400 Cr
Day 5: FII net −₹600 Cr (supply EXHAUSTING)
→ This declining FII sell number = FII supply drying up.
→ Combined with DII holding steady: SC formation imminent.

TRADING ACTION:
→ DO NOT short in this scenario (selling into DII support = high risk).
→ Watch for the SC: When FII net sell is maximum (spike day) AND market closes off the low = SC.
→ Start building watchlist for longs. Best stocks in Scenario 3 = stocks that BARELY FELL
   despite heavy FII selling (these stocks have strong DII/LIC buying underneath).
```

**Scenario 4 — Both Selling (FII Net Sell + DII Net Sell):**

```
WHEN IT OCCURS: Genuine systemic panic. COVID March 2020, 2008-type events.
                Retail investors panic-redeem mutual funds → DII must sell to meet redemptions.

MARKET IMPLICATION:
→ No institutional support. Free fall.
→ This is the Phase E Markdown or the formation of a major Selling Climax.
→ Nifty can fall 5–10% in a single week.

WHAT TO DO:
Step 1: Exit ALL long positions immediately. Do not wait for stop-loss.
Step 2: Capital protection is priority. Go to cash or short-term FD.
Step 3: Watch for the SC: When BOTH FII and DII hit maximum sell on the same day
         with maximum volume = potential Selling Climax. Mark this level.
Step 4: Monitor: When DII switches back to NET BUY = Scenario 4 → Scenario 3 = SC completed.
         Begin watching for accumulation evidence.

HISTORICAL CASE — COVID March 2020:
→ March 9-23, 2020: Both FII and DII selling (mutual fund redemption crisis).
→ March 23, 2020: Both FII net sell AND DII net sell hit multi-month extremes.
                  Nifty at 7,511 (−38% from January high). MAXIMUM VOLUME bar.
→ March 24: DII switched to net buyer. FII still selling but slowing.
            This was the SC. Nifty was at the Spring zone.
→ April–December 2020: Nifty recovered to 13,000. +73% from the SC low.
```

---

### FII F&O Positioning — The Hidden Signal

**Beyond the cash market data, FII positions in F&O (futures and options) reveal their directional bet:**

```
WHERE: nseindia.com → Derivatives → Participant-wise OI (Futures)

WHAT IT SHOWS: Net open interest positions held by each category:
→ FII (Foreign Institutional Investors)
→ DII (Domestic Institutional Investors)
→ Client (Retail)
→ Pro (Proprietary trading desks of brokers)

THE CRITICAL READING — FII INDEX FUTURES:

FII NET LONG in Nifty 50 Futures (FII long OI > FII short OI):
→ FII has bought more Nifty futures than they sold.
→ They are positioned for INDEX UPSIDE.
→ Bullish signal for Nifty.

FII NET SHORT in Nifty 50 Futures:
→ FII is either bearish OR hedging their cash long positions.
→ Cross-check: If FII cash market is NET BUY + FII futures is NET SHORT =
  They are HEDGING (selling futures to protect cash long). Not bearish.
→ If FII cash market is NET SELL + FII futures is NET SHORT =
  They are genuinely BEARISH (double short). Strong bearish signal.

FII NET LONG in Bank Nifty Futures:
→ FII specifically bullish on banking sector.
→ Combined with Nifty Bank RS Rank 1 and Wyckoff Phase D = maximum conviction bank stock long.

THE RETAIL CONTRARIAN SIGNAL:
→ Client (Retail) in F&O is structurally wrong at EXTREMES.
→ When retail is NET SHORT at maximum levels: Market is likely to RISE (retail squeezed).
→ When retail is NET LONG at maximum levels: Market is likely to FALL (retail distributed against).
→ "Retail max net short + FII max net long" = the most powerful bullish combination in NSE.
```

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### Integrating FII/DII with Wyckoff — The Complete Framework

**How to use FII/DII data as a Wyckoff confirmation layer:**

```
WYCKOFF EVENT → FII/DII CONFIRMATION REQUIRED:

SELLING CLIMAX (SC) Identification:
Price signal: Wide spread down bar, closes in lower third, high volume.
FII/DII confirmation: 
→ FII net sell should be at or near the MAXIMUM level for the current episode.
   (Look at FII net sell over the past 20 sessions. SC day should be the largest net sell.)
→ DII net buy should be at a HIGH level (DII absorbing FII supply).
→ If SC bar appears but FII net sell is only moderate: Not a genuine SC. 
   More selling likely to follow.

SECONDARY TEST (ST) Identification:
Price signal: Price returns to SC area on lower volume, holds above SC low.
FII/DII confirmation:
→ FII net sell on ST day should be LESS than on SC day (supply exhausting).
→ DII net buy on ST day should be similar or slightly less (demand still present).
→ The SHRINKAGE of FII supply across SC → ST → ST2 is the evidence of supply exhaustion.

SPRING Identification:
Price signal: Brief penetration below SC low on very low volume, rapid recovery.
FII/DII confirmation:
→ FII net on Spring day: Near ZERO or slightly POSITIVE (FII not adding supply).
→ DII net: Positive (DII buys the Spring dip).
→ If FII is massively net negative on the Spring day: This is NOT a Spring.
   It is a continuation of selling. Wait for FII net to shrink.

SOS (Sign of Strength) Identification:
Price signal: Wide spread up bar, closes in upper half, high volume, breaks above AR.
FII/DII confirmation:
→ FII net on SOS day: Should be POSITIVE (FII buying into the SOS bar).
→ DII net: Can be positive or slightly negative (DII booking some profits).
→ FII net POSITIVE on the SOS day = Institutional validation of the breakout.
→ FII net NEGATIVE on the SOS day (despite price rising): Suspect SOS. 
   Price rose on retail/DII, not FII. Less reliable. 

LPS (Last Point of Support) Identification:
Price signal: Pullback on low volume, closes near the high of the bar.
FII/DII confirmation:
→ FII net on LPS sessions: Should be NEAR ZERO or slightly positive.
   (FII not selling means supply is absent = No Supply VSA confirmation)
→ 5-day FII cumulative around the LPS: Close to zero or gently positive.
→ This is the FII "No Supply" equivalent — FII not adding new supply = LPS confirmed.
```

---

### The FII/DII Institutional Scorecard Integration

Use FII/DII data as scored evidence within each trade's institutional assessment:

```
FII/DII SCORING TABLE (add to your institutional scorecard):

BULLISH EVIDENCE (for long trades):
□ +2 points: FII 20-day cumulative POSITIVE (>+₹5,000 Cr)
□ +2 points: FII 20-day cumulative RISING (improving each week)
□ +1 point:  FII net positive on SOS day specifically
□ +1 point:  FII net near-zero on LPS days (No Supply evidence)
□ +1 point:  FII F&O: Net LONG in Nifty/Bank Nifty futures
□ +1 point:  Retail (Client) F&O: Net SHORT (contrarian bullish)
□ +1 point:  DII net positive for 3+ consecutive sessions

Maximum FII/DII bullish score: 9 points

BEARISH EVIDENCE (for short trades):
□ +2 points: FII 20-day cumulative NEGATIVE (>−₹5,000 Cr)
□ +2 points: FII 20-day cumulative FALLING
□ +1 point:  FII net negative on SOW day
□ +1 point:  FII net near-zero on LPSY days (No Demand evidence)
□ +1 point:  FII F&O: Net SHORT in Nifty/Bank Nifty futures
□ +1 point:  Retail (Client) F&O: Net LONG (contrarian bearish)
□ +1 point:  DII switching from net buy to net sell

Maximum FII/DII bearish score: 9 points

INTERPRETATION:
→ Score 7–9: Very strong institutional confirmation. Full conviction sizing.
→ Score 4–6: Moderate institutional support. Reduce size 25%.
→ Score 0–3: Weak or no institutional confirmation. Reduce size 50% OR skip.
```

---

## EXERCISES

### Beginner Exercises

**Exercise 1 — Participant Identification**

Classify each entity as FII or DII:
a) Vanguard Total International Stock ETF buying ₹3,200 crore of Reliance shares.
b) SBI Mutual Fund's large-cap equity fund deploying ₹800 crore of monthly SIP cash.
c) GIC Singapore (Singapore sovereign wealth fund) buying HDFC Bank.
d) LIC (Life Insurance Corporation) buying ₹5,000 crore of blue-chip stocks.
e) Abu Dhabi Investment Authority (ADIA) buying Infosys through the FPI route.
f) EPFO (Employees' Provident Fund Organisation) buying Nifty ETFs.

**Exercise 2 — Data Reading**

Using this 5-day FII/DII data, answer the questions:

| Day | FII Net (₹Cr) | DII Net (₹Cr) | Nifty Close |
|-----|--------------|--------------|-------------|
| Mon | −₹3,840 | +₹2,980 | 23,420 |
| Tue | −₹4,210 | +₹3,120 | 23,180 |
| Wed | −₹4,580 | +₹3,280 | 22,960 |
| Thu | −₹2,100 | +₹3,150 | 22,840 |
| Fri | −₹880 | +₹3,020 | 23,050 |

a) Which Scenario (1/2/3/4) describes this week?
b) What does Thursday's sharp drop in FII net sell signal?
c) What does Friday's price recovery with continued DII buying suggest?
d) Is this a Selling Climax forming? What additional data would you need to confirm?
e) What is your trading bias for next week?

**Exercise 3 — 20-Day Cumulative Calculation**

Week 1 FII daily nets: +₹1,200, −₹800, +₹1,500, −₹400, +₹900
Week 2 FII daily nets: −₹2,100, −₹3,400, −₹1,800, −₹2,600, −₹900
Week 3 FII daily nets: −₹400, +₹200, −₹600, +₹800, +₹1,100
Week 4 FII daily nets: +₹2,400, +₹3,100, +₹1,800, +₹2,200, +₹1,600

a) Calculate the 20-day cumulative FII flow.
b) At the end of Week 2: What was the 10-day cumulative?
c) At which point did the cumulative cross from negative to positive?
d) What Wyckoff event does the Zero Cross signal at the end of Week 3/start of Week 4?
e) What is your market bias at the end of Week 4?

---

### Intermediate Exercises

**Exercise 4 — Wyckoff + FII/DII Integration**

You are analyzing Nifty 50 over a 6-week period:

**Week 1–2 (SC period):**
Price: Nifty falls from 24,200 to 21,800 (−9.9%) over 10 sessions.
FII: Week 1 net = −₹18,400 Cr. Week 2 net = −₹22,600 Cr.
DII: Week 1 net = +₹14,200 Cr. Week 2 net = +₹19,800 Cr.
Volume: Session 10 (the low) = 3.8× 20-day average. Close at 21,810 (off the low of 21,420).

**Week 3 (AR period):**
Price: Nifty rallies from 21,810 to 23,040 (+5.6%).
FII: Week 3 net = −₹4,200 Cr (much reduced selling).
DII: +₹6,800 Cr.

**Week 4–5 (Secondary Testing):**
Price: Nifty oscillates 22,200–23,200.
FII: Week 4 = −₹1,800 Cr. Week 5 = −₹600 Cr (nearly zero).
DII: Consistently +₹5,000–₹6,000 Cr each week.

**Week 6 (Spring + SOS attempt):**
Price: Nifty dips to 22,050 (briefly below SC low of 21,810 — Spring!). Then surges to 23,800.
FII: Spring day: +₹1,400 Cr (FII BUY on the dip). SOS day: +₹6,200 Cr.
DII: Spring day: +₹3,800 Cr. SOS day: +₹1,200 Cr.

a) Identify the SC, AR, Secondary Test, Spring, and SOS using both price and FII/DII data.
b) For the SC: Does the FII data confirm it? Explain.
c) For the Spring: What makes the FII data on the Spring day particularly significant?
d) For the SOS: Who drove the SOS — FII or DII? What does this mean?
e) What was the 20-day cumulative FII at the end of Week 6? Is it positive or negative?
f) What is your market bias and intended trade action after Week 6?

**Exercise 5 — F&O Participant OI Reading**

You check NSE's Participant-wise OI data for Nifty 50 Futures on Friday:

| Participant | Long OI | Short OI | Net Position |
|------------|---------|----------|-------------|
| FII | 2,84,500 contracts | 1,96,200 contracts | +88,300 net long |
| DII | 42,800 | 38,600 | +4,200 net long |
| Client (Retail) | 1,12,400 | 1,98,600 | −86,200 net short |
| Pro | 38,600 | 44,900 | −6,300 net short |

Simultaneously: FII cash market 20-day cumulative = +₹28,400 Crore.
Nifty 50 daily chart shows a confirmed SOS from 3 days ago. Price is now in LPS pullback.

a) Interpret the FII F&O net position. Is FII hedging or directionally bullish?
b) How does the cash market data (+₹28,400 Cr) help you interpret the F&O data?
c) What does the Retail net short position of 86,200 contracts signal as a contrarian indicator?
d) Calculate the FII/DII institutional scorecard score (bullish) using the scoring table.
e) With this scorecard score, what is the appropriate position sizing for an LPS trade?

---

### Advanced Exercise

**Exercise 6 — Complete Institutional Analysis**

Construct a complete FII/DII analysis for a hypothetical NSE scenario and make a trading decision:

**Available data:**
- Nifty daily chart shows: SC at 21,200, AR at 22,800, three Secondary Tests (each slightly higher low), current price 21,400 (Spring just occurred — price dipped to 21,050 then recovered sharply today).
- Today's FII net: +₹3,800 Crore (bought aggressively on the Spring day).
- Today's DII net: +₹4,200 Crore (also bought).
- FII 20-day cumulative: −₹12,400 Crore (still negative — recent selling episode).
- FII F&O: Net long 44,000 contracts Nifty futures (added 18,000 longs this week).
- Client F&O: Net short 72,000 contracts (maximum short in 6 months).
- Volume today: 2.6× 20-day average. Close at 21,380 (strong recovery from 21,050).
- DII flows for last 5 sessions: +₹3,800, +₹4,200, +₹3,600, +₹4,800, +₹4,200 (today).

Required analysis:
a) Identify the Wyckoff event on today's price action.
b) What does the FII net (+₹3,800 Cr) on the Spring day tell you specifically?
c) The FII 20-day cumulative is still negative. Does this invalidate the Spring? Explain.
d) What will happen to the FII 20-day cumulative if FII continues buying for 5 more sessions at today's pace?
e) Calculate the FII/DII bullish institutional scorecard (out of 9 points).
f) Design the trade: Entry, stop, T1, T2. Size for account of ₹15L at 1% risk.
g) What single FII/DII data point in the NEXT SESSION would give you the HIGHEST confidence that the Spring is confirmed?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** What is the difference between FII and DII? Who are the major participants in each category on NSE?

**Q2.** Why is DII described as "counter-cyclical"? Explain the SIP mechanism and why it creates structural buying support during market corrections.

**Q3.** What is the 20-day cumulative FII flow, and why is a single-day reading insufficient? Describe the two most important zero-crossing signals.

**Q4.** Describe all four FII/DII scenarios. Which scenario is most common during NSE corrections, and what is the key signal within that scenario that suggests a Selling Climax is forming?

**Q5.** What is NSE Participant-wise OI data and where is it found? How do you distinguish between FII hedging (cash long + futures short) vs FII genuine bearishness?

**Q6.** What FII/DII confirmation is required for a Selling Climax (SC) bar identification? What should FII net sell look like ON the SC day vs the Secondary Test day?

**Q7.** Describe the FII/DII evidence you would expect to see on a Spring day. How is the FII data on a valid Spring day different from on a false breakdown day?

**Q8.** What is LIC's special role in the DII category? How does LIC's buying sometimes differ from regular mutual fund DII activity?

**Q9.** How does MSCI Emerging Markets Index rebalancing create mechanical FII flows into India? Give a specific example of how an MSCI weight change translates into NSE buying.

**Q10.** Why does the "Retail (Client) F&O max net short + FII max net long" combination represent the most powerful bullish institutional signal in NSE?

### Chart Questions (5)

**S1.** FII data for the last 20 trading days (₹Crore):
−4,200, −3,800, −5,100, −4,600, −2,900, −1,800, −900, +400, +1,200, +2,100, +3,400, +2,800, +1,600, +2,200, +3,100, +2,600, +1,900, +3,400, +2,800, +4,100

a) Calculate the 20-day cumulative.
b) On which day did the cumulative cross zero?
c) What Wyckoff event does this zero-cross likely correspond to?
d) What is the market bias at the end of day 20?

**S2.** You see a Nifty 50 wide-spread, high-volume bar that closes in the lower third. You suspect it is a Selling Climax. FII net for that day: −₹6,200 Crore. The previous highest daily FII net sell in the last 6 months: −₹7,800 Crore.

a) Does the FII data support the SC identification?
b) What should you see on the Automatic Rally (AR) day in FII data?
c) What should you see on the Secondary Test day?
d) If FII net sell on the ST day is also −₹6,100 Crore (nearly as high as the SC day): Is this a valid Secondary Test?

**S3.** Week 1 FII/DII: FII = −₹18,000 Cr. DII = +₹14,000 Cr. Nifty −7%.
Week 2: FII = −₹8,000 Cr. DII = +₹12,000 Cr. Nifty −2%.
Week 3: FII = −₹2,000 Cr. DII = +₹11,000 Cr. Nifty −0.5%.
Week 4: FII = +₹4,000 Cr. DII = +₹9,000 Cr. Nifty +3%.

a) Which Scenario dominated Weeks 1–3?
b) What key signal appeared in Week 3?
c) What scenario began in Week 4?
d) What Wyckoff events likely correspond to each week?
e) What is the correct trading action at the start of Week 4?

**S4.** Participant-wise OI data today vs 1 week ago:

| Participant | Net 1 week ago | Net Today | Change |
|------------|---------------|----------|--------|
| FII | +12,000 contracts | +48,000 contracts | +36,000 added |
| Retail | −8,000 contracts | −44,000 contracts | −36,000 added short |

FII cash market today: +₹5,600 Crore.
Nifty rose 1.8% today on high volume (2.2× 20-day average), closing above a key level.

a) What is FII doing in both cash and F&O simultaneously?
b) What does the retail adding 36,000 short contracts tell you?
c) What Wyckoff event is today's price action consistent with?
d) What happens to those 44,000 retail short contracts if Nifty continues rising?

**S5.** Three-month FII/DII comparison:

Month 1: FII = −₹42,000 Cr. DII = +₹38,000 Cr. Nifty: −8%.
Month 2: FII = −₹12,000 Cr. DII = +₹35,000 Cr. Nifty: −1%.
Month 3: FII = +₹28,000 Cr. DII = +₹32,000 Cr. Nifty: +11%.

a) Identify the Wyckoff phases across these three months.
b) In Month 1 and 2: Which entity was the primary reason Nifty didn't fall more?
c) What was the key transition from Month 2 to Month 3?
d) Month 3 is Scenario 1 (both buying). What are the implications for individual stock selection?
e) Looking at Month 3: Is this Phase D Markup or Late Cycle distribution risk? What data would help you decide?

---

## QUIZ ANSWERS

**A1.** FII (Foreign Institutional Investors / FPIs): Foreign Portfolio Investors registered with SEBI. Include global mutual funds (Vanguard, Fidelity), hedge funds (Bridgewater, Tiger Global), sovereign wealth funds (GIC, ADIA), and pension funds (CPPIB, EPFO overseas). DII (Domestic Institutional Investors): Indian entities. Include domestic mutual funds (SBI MF, HDFC MF, ICICI Pru MF), insurance companies (LIC, HDFC Life), and pension funds (EPFO, NPS). Key difference: FII allocates globally and can enter/exit India rapidly based on global macro. DII has domestic mandates and must deploy SIP/insurance inflows regardless of market level.

**A2.** Counter-cyclical DII: When FII sells (global risk-off → India market falls), DII's SIP inflows INCREASE in amount (SIP investors add more when markets fall) and DII must deploy this cash. DII cannot hold cash indefinitely — it must invest. SIP mechanism: 60M+ Indian investors invest fixed amounts monthly. Even in bear markets, these inflows continue. ₹20,000 Crore/month of SIP cash creates mandatory buying. When FII sells ₹15,000 Crore, SIP alone provides ₹20,000 Crore of demand. Net effect: DII absorbs FII selling, creates support, prevents crashes as deep as they would be without DII participation. This is why Indian market corrections are often shallower than global EM corrections.

**A3.** 20-day cumulative: Sum of last 20 trading days' FII Net (Buy−Sell). 20 days = approximately 1 month of trading. Single-day: Can be distorted by hedging, month-end rebalancing, derivative settlement, one large fund's decision — all NOISE. 20-day: Reflects a genuine, sustained directional shift in foreign capital flows. Two zero-crossing signals: (1) Negative → Positive: FII has switched from net seller to net buyer. Sustained accumulation is beginning. Corresponds to Wyckoff Phase C (Spring) or early Phase D at the index level. → Upgrade bias to BULLISH. (2) Positive → Negative: FII switching to net seller. Distribution is beginning. Corresponds to Wyckoff UTAD or early SOW. → Downgrade bias to BEARISH. Both signals are leading (they occur AS the phase transition happens, before it is obvious in price alone).

**A4.** Scenario 1 (FII buy + DII buy): Most bullish. Rare. Bull market with strong global and domestic tailwinds. Scenario 2 (FII buy + DII sell): Accumulation/markup. FII absorbing DII profit-taking. Classic CO accumulation. Scenario 3 (FII sell + DII buy): Most common in corrections. DII = shock absorber. Declining FII sell number over consecutive days = FII supply exhausting = SC/Spring zone forming. Key signal: When FII daily net sell shrinks from peak (e.g., −₹4,200 → −₹3,800 → −₹2,100 → −₹600) while DII holds steady: supply exhaustion = imminent Selling Climax or Spring. Scenario 4 (FII sell + DII sell): Most bearish. Systemic crisis (COVID March 2020). Mutual fund redemption pressure forces DII to sell. Exit all longs. Watch for the SC bar when BOTH hit maximum sell simultaneously with maximum volume.

**A5.** NSE Participant-wise OI: Daily data on net long/short futures positions of each category (FII, DII, Client, Pro). Found at nseindia.com → Derivatives → Participant-wise OI. Hedging vs genuine bearish: If FII cash market is NET BUY + FII futures NET SHORT = HEDGING (long cash, short futures to delta-hedge) → Net exposure still bullish. Not a bearish signal. If FII cash market is NET SELL + FII futures NET SHORT = GENUINELY BEARISH (selling stocks AND buying put protection/short futures) → Strong bearish signal. The cash market FII data is the KEY cross-check to interpret the futures positioning correctly.

**A6.** SC confirmation via FII/DII: SC day FII: Should be at or near MAXIMUM net sell for the current episode. If today's FII net sell (−₹6,200 Cr) is the highest in the last 20 sessions: The selling climax in institutional flow matches the price climax. ST day FII: Should be LESS than SC day. E.g., if SC = −₹6,200 Cr, then ST1 should be −₹3,000 to −₹4,000 Cr (declining supply). ST2: Even less, −₹1,000 to −₹2,000 Cr. The shrinkage of FII net sell from SC → ST1 → ST2 is the evidence of institutional supply exhaustion. If ST day FII net sell is EQUAL to or GREATER than SC day: Supply has not exhausted. This is not a valid SC + ST sequence. More selling is coming.

**A7.** Spring day FII evidence: Valid Spring: FII net should be NEAR ZERO or POSITIVE on the Spring day. Explanation: A Spring is a brief, low-supply dip below the SC low. If supply were present (FII selling), the dip would not be "brief" — it would continue. Near-zero or positive FII net = FII is NOT adding supply on the Spring day = low supply = Spring is valid. Invalid breakdown (false Spring): FII net sell is LARGE NEGATIVE on the breakdown day. This means FII IS selling — this is not a brief supply-absent test, it is a genuine new wave of selling. Price may be breaking below SC low not as a Spring but as a Phase E continuation. The FII net is the single most powerful distinguisher between a valid Spring and a false breakdown.

**A8.** LIC's special role: LIC is the largest single DII entity in India (manages ~₹45+ lakh crore of assets, owns 4–5% of most large-cap Nifty stocks). How LIC differs: (1) LIC receives insurance premium inflows (like DII) = mandatory deployment like SIP. (2) LIC sometimes receives "direction" to stabilise the market during periods of extreme selling — this is quasi-policy buying. Signs of LIC buying: Large delivery-based buying in blue-chip Nifty stocks (HDFC Bank, Reliance, TCS) on big correction days. LIC bulk purchases appear in the Block Deal data (NSE). These are NOT listed as FII — they are DII. LIC's buying is important because: When LIC is buying, the government is implicitly supporting the market. This usually limits the downside on Nifty index corrections — LIC doesn't let index fall beyond a political pain threshold.

**A9.** MSCI rebalancing → mechanical FII flow: MSCI Emerging Markets Index is tracked by global passive funds with ~$1.7 trillion AUM. India's weight = 17–20% (as of 2024). When MSCI increases India's weight from 16% to 18%: Every passive EM fund must BUY India to match the new weight. $1.7 trillion × 2% additional weight = $34 billion of MANDATORY buying that must occur within the rebalancing window (typically 1–2 days). This has NO relationship to India's Wyckoff phase or fundamentals — it is mechanical. Example: MSCI QoQ rebalancing in November 2023 added several midcap Indian stocks to the index → FII net buy of ₹18,000+ crore in the week of rebalancing → Nifty Midcap 150 rose 4.2% in that week alone, driven purely by passive rebalancing flows.

**A10.** "Retail max short + FII max long" is the most powerful combination because: (1) FII (the informed, best-resourced participant) is at MAXIMUM bullish positioning. They have the deepest pockets and the best research. (2) Retail (structurally wrong at extremes due to confirmation bias, recency bias, and herd mentality) is at MAXIMUM bearish positioning. They have added maximum short pressure to the market. (3) The mechanical fuel: When the market starts rising, retail's 86,000 net short contracts must eventually be covered (bought back). This buying is FORCED — stop-losses trigger, margin calls hit. Each forced buy pushes the market up further, triggering more retail short covering. This mechanical fuel adds to the organic FII buying. The result: The most explosive, sustained rallies in NSE history begin from this exact FII max long + Retail max short configuration.

---

## KEY TAKEAWAYS

> **1. FII is the Composite Operator of India's equity market at the macro level. When FII accumulates (20-day cumulative positive and rising), the index is in Wyckoff accumulation. When FII distributes, the index is in distribution.**

> **2. DII is counter-cyclical: SIP inflows are mandatory and market-price agnostic. DII's structural monthly buying provides the floor in corrections and creates the SC/Spring environment when FII selling exhausts.**

> **3. Use 20-day cumulative FII, not daily — single days are noise. The zero-cross (negative→positive) is the index-level Spring/SOS signal. The zero-cross (positive→negative) is the index-level UTAD/SOW signal.**

> **4. The four scenarios (FII+DII both buy, FII buy+DII sell, FII sell+DII buy, FII+DII both sell) define market phases. Scenario 3 (FII sell, DII buy) is the most common correction scenario and the incubator of the next accumulation.**

> **5. FII F&O participant-wise OI is the directional intent data. FII net long + Retail net short = maximum bullish structural setup. Cross-check futures data with cash market flows to distinguish hedging from genuine positioning.**

---

*FII DII Analysis — Complete.*

*Next topic in the plan: **Delivery Analysis** (Part X, Topic 2).*

*Ready to proceed? Say: **"NEXT CHAPTER"***
