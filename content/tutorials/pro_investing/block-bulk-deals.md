# Block Bulk Deals

> **Course:** NSE/BSE Professional Investing — Price, Volume & Institutional Flow
> **Part:** X — Indian Institutional Data
> **Topic:** Block Bulk Deals

---

## Chapter Overview

Every day on NSE, a small number of massive transactions happen that are invisible on a standard price chart — yet they carry more information about institutional intent than any technical pattern. These are **Block Deals** and **Bulk Deals**: disclosed, exchange-mandated reporting of large institutional trades, complete with the name of the buyer and the seller.

When GIC Singapore (Singapore's sovereign wealth fund) pays ₹850 crore for a stake in an NSE-listed company at 8:47 AM before the market opens, that is not a casual allocation. That is months of research, valuation work, and conviction distilled into a single transaction. When a promoter of a company quietly sells 3% of their own holding to unknown buyers during market hours — that is the most informed person in the room heading for the exit.

Block and Bulk deal data tells you both stories every single trading day. It is one of the most overlooked, freely available, institutionally-rich datasets on the NSE platform.

**The Core Rule:**

> **Block and Bulk deals are the receipts of institutional conviction. Read who is buying and who is selling — not just what stock and at what price. The identity of the counterparties is the signal, not the transaction itself.**

---

## LEVEL 1 — BEGINNER

### Block Deals vs Bulk Deals — The Exact Definitions

![Block Deals vs Bulk Deals — Anatomy & How to Read Them on NSE/BSE](/images/pi-block-bulk-deals-anatomy.jpg)

**Block Deal — The Pre-Market Negotiated Transaction:**

```
DEFINITION:
A Block Deal is a single, negotiated transaction between two specific parties,
executed exclusively during the dedicated Block Deal Window.

NSE/BSE SPECIFICATIONS:
→ Minimum size: 5,00,000 (5 lakh) shares OR ₹10 crore — whichever is LOWER
→ Window: 8:45 AM – 9:00 AM (pre-opening, before the regular session)
→ Price constraint: Must be within ±1% of the previous day's closing price
   (Cannot happen at an extreme price — forces fair dealing)
→ Disclosure: BOTH buyer AND seller names published within 15 minutes
→ Mandatory: Exchange rules require immediate disclosure — no hiding allowed

WHY A BLOCK DEAL WINDOW EXISTS:
Large institutions cannot easily transact hundreds of crores during regular market hours
without causing massive price slippage. A fund wanting to buy ₹1,000 crore of HDFC Bank
during market hours would push the price up significantly before it finished buying.
The block deal window allows pre-market negotiated price — no slippage, clean execution.

WHAT A BLOCK DEAL RECORD LOOKS LIKE (NSE Data):
Date:      Sep 25, 2026
Exchange:  NSE
Stock:     HDFC Bank Ltd
Client:    GIC Re (Singapore) [BUYER]
Type:      BUY
Qty:       42,00,000 shares
Price:     ₹1,724.00
Value:     ₹724.08 Crore
Seller:    HDFC Holdings Ltd [SELLER — Promoter Group]

Reading:
→ GIC Singapore (sovereign wealth fund = FII) bought ₹724 Crore of HDFC Bank
→ Seller was HDFC Holdings (promoter group) — reducing stake
→ Price: ₹1,724 (within ±1% of prev close)
→ Interpretation: Promoter stake sale to a top-tier sovereign fund = mixed signal
   (Promoter reducing = mild negative. GIC entering = strong positive.)
```

**Bulk Deal — The Large Intraday Market Transaction:**

```
DEFINITION:
A Bulk Deal is any transaction in a stock that exceeds 0.5% of the company's
total listed (equity) shares in a single trading session, executed during normal hours.

NSE/BSE SPECIFICATIONS:
→ Threshold: > 0.5% of company's total equity shares outstanding — IN ONE DAY
→ Window: Normal market hours (9:15 AM – 3:30 PM)
→ Price: At prevailing market price — no negotiation
→ Can be accumulated across multiple orders in one day that cross the 0.5% threshold
→ Disclosure: Both buyer and seller published at the end of the same trading day

BLOCK DEAL vs BULK DEAL — KEY DIFFERENCES:

Feature            | Block Deal                  | Bulk Deal
-------------------|-----------------------------|-----------------------
Execution window   | Pre-market (8:45–9:00 AM)   | Market hours
Price              | Negotiated, ±1% of prev close| Market price
Negotiated?        | YES — agreed in advance     | NO — open market
Minimum threshold  | ₹10 Cr or 5L shares         | 0.5% of total shares
Same-day disclosure| YES (within 15 min)         | YES (end of day)
Intent signal      | High — very deliberate      | High — size reveals intent

WHICH MATTERS MORE:
→ Both matter equally. Block deals reveal pre-planned institutional commitments.
→ Bulk deals reveal urgent intraday buying/selling where a fund couldn't wait.
→ A bulk deal during a confirmed Wyckoff SOS session = the most urgent institutional accumulation.
```

**Where to Access the Data (Free, Every Day):**

```
NSE BLOCK DEALS: nseindia.com → Market Data → Block Deals
NSE BULK DEALS:  nseindia.com → Market Data → Bulk Deals

BSE BLOCK DEALS: bseindia.com → Market → Block Deals  
BSE BULK DEALS:  bseindia.com → Market → Bulk Deals

UPDATE TIMES:
→ Block deals: Published within 15 minutes of the 8:45-9:00 AM window closing
               (Available by 9:15 AM — before market opens for regular trading)
→ Bulk deals: Published after market close (5:00–6:00 PM)

PROFESSIONAL ROUTINE:
Every morning at 9:00–9:15 AM: Check block deals on NSE and BSE.
   → See if any watchlist stocks had block deals
   → Identify who bought and who sold
   → Cross-reference with today's market opening

Every evening after 5:30 PM: Check bulk deals.
   → See which stocks had significant institutional activity during the day
   → Update watchlist with new institutional interest

Historical data: NSE and BSE both provide searchable history going back years.
Search by stock or date range.
```

---

### The Three-Step Reading Framework

**Every block or bulk deal requires the same three-step analysis:**

**Step 1 — WHO IS THE BUYER? (Primary signal)**

```
FII/FPI buying (Foreign Institution):
→ Signal: BULLISH. Fresh foreign capital entering the stock.
→ FII has done institutional-grade due diligence (months of research).
→ The bigger and more reputable the FII: The stronger the signal.
   GIC Singapore > Unknown offshore fund (in signal quality)
→ Sovereign wealth funds (GIC, ADIA, Norges Bank) are the most long-term holders.
   Their buys signal a multi-year conviction.

DII buying (Mutual Fund / LIC / Insurance):
→ Signal: BULLISH. Domestic institutional conviction.
→ LIC specifically: Sometimes directed by government, but always a long-term holder.
→ SBI MF, HDFC MF, ICICI Pru MF: These are large, research-driven buyers.
→ DII buy at the bottom of a Wyckoff accumulation = domestic smart money agrees with thesis.

PROMOTER buying:
→ Signal: STRONGEST BULLISH of all.
→ The promoter knows the company better than any external analyst or institution.
→ A promoter paying market price (or above) for their OWN stock = they believe
   it is undervalued relative to their internal view of the business.
→ No promoter deliberately wastes personal capital.
→ Open market promoter buy = the highest possible insider conviction signal.
→ Exception: ESOPs (Employee Stock Option Plans) are not as meaningful — they are
  part of compensation structure, not discretionary capital allocation.

Unknown "Client Account" / Retail HNI:
→ Signal: LOW information. Retail buyers of this size are not as reliable a signal.
→ Could be an HNI riding institutional momentum, not independent research.
→ If the seller is a promoter and the buyer is unknown: RED FLAG (promoter distributing
  to weak hands — classic distribution).
```

**Step 2 — WHO IS THE SELLER? (Context signal)**

```
Promoter / Promoter Group selling:
→ Signal: BEARISH (always investigate immediately, regardless of buyer quality)
→ Questions to ask:
   a) Is this a one-time stake reduction or a PATTERN of selling?
      One-time: Less concerning (personal liquidity, estate planning, charity)
      Repeated sales over months: Serious distribution — avoid the stock
   b) What % of their stake are they selling?
      Selling 0.5% of 60% holding (small trim): Less alarming
      Selling 5% of 25% holding (large proportional exit): Very alarming
   c) Is the promoter pledging shares (separately disclosed via SEBI)?
      High promoter pledge + bulk selling = liquidity crisis at promoter level

VC/PE Firm selling (Venture Capital / Private Equity):
→ Signal: NEUTRAL to mild negative (expected, not necessarily bearish)
→ VC/PE firms have a defined holding period. After lock-in ends, exit is normal.
→ The question is whether there is a strong BUYER absorbing the VC/PE supply.
→ If a top FII is the buyer of the VC/PE block: Very bullish (FII replacing VC as long-term holder).

FII selling to another FII:
→ Signal: NEUTRAL (net FII position unchanged)
→ Portfolio rebalancing, fund mandate change, ETF/index rebalancing
→ No new money entering or leaving. Do not overweight this.

DII selling:
→ Signal: NEUTRAL (DII booking profits = good portfolio management)
→ If FII is the buyer of DII supply: Mild bullish (FII replacing DII)
→ Context: Is DII selling because of macro fears or just profit-booking?
   Cross-check DII net in the FII/DII daily data.
```

**Step 3 — PRICE vs MARKET PRICE**

```
Block Deal at PREMIUM to yesterday's close:
→ The buyer agreed to pay above market. They are EAGER.
→ Bullish — buyer valued the stock higher than the current market price.
→ A premium block deal at a Wyckoff LPS zone is a very strong signal.

Block Deal at DISCOUNT to yesterday's close:
→ The seller accepted below market price. They are EAGER to exit.
→ Bearish — seller needed out and accepted less than market value.
→ Usually indicates urgency (margin call, fund redemption, portfolio mandate change).

Block Deal at EXACT market price (within ±0.1%):
→ Normal negotiation. Neither particularly eager. Neutral.

IMPORTANT: All block deals must be within ±1% of prev close by exchange rules.
           So the price itself only tells you about relative eagerness within that range.
```

---

## LEVEL 2 — INTERMEDIATE

### The Buyer-Seller Interpretation Matrix

![Block Deal Interpretation Matrix — Who Buys, Who Sells, What It Means](/images/pi-block-deal-interpretation-matrix.jpg)

**Reading the matrix — the most important combinations:**

**Case 1: FII buys from Promoter — STRONGEST BULLISH SIGNAL**

```
Mechanism:
→ Promoter wants liquidity (personal estate, family trust, diversification)
→ Instead of selling in the market (which would crash the price), promoter
  negotiates a block deal with a top FII at the block deal window price.
→ The FII accepted: They have done months of valuation and believe the stock
  is worth significantly MORE than the block deal price.
→ Net result: A top global institution paying crores for the promoter's stake.

Why this is the strongest signal:
1. The FII's research quality is the highest in the market.
2. They chose THIS stock at THIS price after evaluating hundreds of alternatives.
3. The block deal structure means they wanted enough shares that they couldn't
   buy it all in the open market without moving the price — true conviction sizing.

Wyckoff integration:
→ If this block deal happens at or near a Wyckoff LPS zone: MAXIMUM conviction long.
→ The LPS tells you the TIMING (accumulation complete, markup starting).
→ The block deal tells you the PARTICIPANT (world-class institution buying with conviction).
→ Combined: The highest-conviction NSE trade setup possible.
```

**Case 2: Promoter buying their own stock — INSIDER BUY**

```
Mechanism:
→ The promoter is using THEIR OWN CAPITAL (personal funds, not company funds)
  to buy MORE shares in their own company on the open market.
→ This is the most asymmetric information signal: They know their own business
  better than any analyst. If they are buying at current prices, they believe
  current prices are LOW relative to intrinsic value.

How to verify it is an open-market buy (vs ESOP):
→ Check SEBI SAST (Substantial Acquisition of Shares and Takeovers) disclosures:
  sebi.gov.in → Filings → SAST disclosures
→ Open market: Buy is disclosed as acquisition, not exercise of ESOPs
→ ESOPs: Separately disclosed under employee compensation scheme

NSE historical examples of promoter buying near bottoms:
→ Many promoters of fundamentally strong companies accumulated during the
  March 2020 crash. Those stocks recovered 3–5× within 18 months.
→ Pattern: Promoter buying + Wyckoff SC/Spring → Multi-bagger markup.

When this is LESS meaningful:
→ Token purchases (promoter buying 500–1,000 shares of a company with 10 crore shares)
→ ESOP-type minimal purchases
→ "Creeping acquisition" as a takeover strategy (different intent entirely)
```

**Case 3: Promoter selling to retail/unknown — DISTRIBUTION RED FLAG**

```
This is the most dangerous combination in block/bulk deal data.

Why it is alarming:
→ Promoter (most informed) → selling to unknown clients (least informed)
→ Classic informed-to-uninformed transfer of shares = distribution
→ The promoter's research shows the stock is OVERVALUED or the business
  has a problem they can see that the market cannot yet see.

Questions to ask immediately:
1. How much stake is being sold? (small trim vs large exit)
2. Is this a one-time or a repeat pattern? (check 3-6 months history)
3. Is promoter pledge rising simultaneously? (SEBI quarterly pledge data)
4. Is there any pending regulatory, legal, or business issue?

Action:
→ If you hold the stock: Immediately review your Wyckoff phase assessment.
→ If the Wyckoff structure is also showing UTAD/LPSY: Exit the position.
→ If the Wyckoff structure is still in markup (but early): Tighten stop sharply.
→ No matter how strong the chart looks: Promoter serial selling = eventual distribution.
→ The institutional scorecard should reflect this: −3 points immediately.
```

---

### Integrating Block/Bulk Deals with Wyckoff

**The highest-conviction trade in NSE analysis is the convergence of three signals:**

```
CONVERGENCE FRAMEWORK:

Signal 1 — Wyckoff Phase (price structure):
→ The stock is in Phase D (post-SOS, LPS forming)
→ Price structure confirms accumulation is complete
→ Entry zone identified: LPS pullback to the Creek (SOS breakout level)

Signal 2 — Delivery % (chapter: Delivery Analysis):
→ SOS day had delivery % > 65% (confirmed institutional buying)
→ LPS days have delivery % < 25% (no supply present)

Signal 3 — Block/Bulk Deal (this chapter):
→ A block or bulk deal appears at or near the LPS zone
→ Buyer: High-quality FII or DII
→ Seller: NOT the promoter (acceptable — VC/PE or another institution)

WHEN ALL THREE ALIGN:
→ This is the MAXIMUM CONVICTION institutional trade setup on NSE.
→ Position size: Full allocation (within risk rules — 1% account risk)
→ Stop: Below the Spring low
→ Target: Volume Profile T1 and T2

PARTIAL ALIGNMENT (2 of 3 signals):
→ Wyckoff Phase D + High delivery SOS: Strong signal. Standard size.
→ Wyckoff Phase D + Block deal buy: Strong signal. Standard size.
→ Delivery + Block deal (but Phase not clear): Reduce size 25%.
```

---

### Promoter Pledge Monitoring — The Hidden Risk Signal

**Block/Bulk deal analysis must be cross-referenced with promoter pledge data:**

```
WHAT IS PROMOTER PLEDGE?
→ Promoters often pledge their shares to banks/NBFCs as collateral for personal loans.
→ Pledged shares are still in the promoter's name but used as collateral.
→ If the stock price falls: The lender issues a margin call.
→ If the promoter cannot pay: The lender FORCE-SELLS the pledged shares into the market.
→ This creates sudden, unexpected supply — drives the stock down sharply.

WHERE TO FIND PLEDGE DATA:
SEBI quarterly shareholding pattern: Every company must disclose promoter pledge in the
quarterly shareholding pattern filed on NSE/BSE (every 3 months).
→ nseindia.com → Company → Shareholding Pattern → Promoter and Promoter Group
→ Column: "Number of shares pledged or otherwise encumbered"

PLEDGE RISK FLAGS:
→ Pledge > 20% of promoter holdings: Moderate risk. Monitor.
→ Pledge > 50% of promoter holdings: HIGH RISK. Forced selling becomes likely on a 15%+ price fall.
→ Pledge RISING quarter-over-quarter: Escalating risk. Promoter needs more loans.
→ Pledge FALLING: Positive — promoter repaying loans, reducing forced-sale risk.

THE PLEDGE-BLOCK DEAL COMBINATION:
Block deal: Promoter selling shares
Simultaneously: Promoter pledge is at 60% and RISING

This combination = Promoter is under financial stress.
The block deal is forced selling for liquidity, not voluntary stake reduction.
This is a SERIOUS RED FLAG. Avoid the stock.

Compare with:
Block deal: Promoter selling shares
Simultaneously: Promoter pledge is at 5% and DECLINING

This = Comfortable, deliberate stake reduction. Less concerning.
The promoter is not under duress — this is planned portfolio management.
```

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### The Block/Bulk Deal Institutional Scorecard

```
Integrate block/bulk deal evidence into the full institutional scorecard:

BULLISH SIGNALS (Block/Bulk Deals):

□ +3 points: Block deal — FII/Sovereign Fund buying at or within 5% of LPS zone
             (Global institution buying at the ideal Wyckoff entry zone)

□ +3 points: Promoter OPEN MARKET BUY (bulk or block)
             (Insider conviction buy at current prices)

□ +2 points: Block deal — DII (LIC/Major MF) buying at Wyckoff Phase C/D
             (Domestic institution accumulating at accumulation zone)

□ +2 points: Block deal — FII buying from VC/PE (natural exit absorbed by institution)
             (New long-term holder replacing short-term one)

□ +1 point:  Bulk deal — FII urgent intraday buying on an SOS session
             (FII unable to wait for block deal window — buying aggressively)

□ +1 point:  Multiple different FIIs buying in bulk deals on the same day
             (Coordinated sector-level institutional accumulation)

Maximum block/bulk deal bullish score: 12 points

BEARISH SIGNALS:

□ −3 points: Promoter SELLING to unknown clients (block or bulk) — serial pattern
             (Distribution by the most informed insider)

□ −2 points: Promoter pledge > 50% AND rising PLUS any block/bulk selling
             (Forced selling under financial stress)

□ −2 points: FII selling in bulk deal during a markup — pattern of 3+ days
             (FII distributing position under institutional exit)

□ −1 point:  Any block deal where seller is promoter (even to high-quality FII)
             (Promoter reducing = always investigate; default mild negative)

Maximum block/bulk deal bearish score: −8 points
```

### The Professional Morning Routine (Block Deal Check)

```
EVERY MORNING 9:00–9:15 AM — 5-MINUTE PROTOCOL:

Step 1: Open NSE block deal page (nseindia.com → Market Data → Block Deals)
        Open BSE block deal page (bseindia.com → Market → Block Deals)

Step 2: Scan the list. Filter by:
        a) Stocks on your active watchlist: Any block deal here?
        b) Deal size > ₹100 Crore: These are significant transactions
        c) Famous FII names as buyer: GIC, Vanguard, BlackRock, Norges, ADIA, CPPIB

Step 3: For any watchlist stock with a block deal:
        → Apply 3-step framework (Buyer? Seller? Price?)
        → Update institutional scorecard immediately
        → Adjust today's trade plan accordingly

Step 4: Update trading journal with the block deal note:
        "[STOCK] — Block deal: [FII] bought ₹[X] Cr from [Seller]. 
         Scorecard +[N] points. Action: [Upgrade to Tier 1 / Maintain / Downgrade]"

EVENING BULK DEAL CHECK (5:30–6:00 PM):
→ Open NSE/BSE bulk deal pages
→ Same 4-step process
→ Add to tomorrow's preparation sheet

Time required: 5 minutes morning + 5 minutes evening = 10 minutes total.
Information gained: Entire day's institutional conviction signals for your watchlist.
There is no easier 10-minute habit for improving trade conviction in NSE analysis.
```

---

## EXERCISES

### Beginner Exercises

**Exercise 1 — Block vs Bulk Classification**

Classify each as a Block Deal or Bulk Deal, and explain why:

a) On Sep 20 at 8:52 AM, GIC Singapore bought 58,00,000 shares of Reliance at ₹2,820 (prev close: ₹2,834). Total value: ₹1,635 Crore.

b) On Sep 21 during market hours, SBI Mutual Fund accumulated 32,00,000 shares of HDFC Bank at prices between ₹1,710 and ₹1,735 through 8 separate orders. Total shares = 0.58% of HDFC Bank's listed capital.

c) On Sep 22 at 8:48 AM, promoter of a mid-cap pharma company bought 5,00,000 shares of their own company at ₹488 (prev close: ₹486).

d) On Sep 23 at 2:15 PM, a VC firm sold 1,20,00,000 shares of a fintech company (which equals 0.8% of total listed shares) at ₹224 to an unknown buyer.

For each: (a) Block or Bulk deal? (b) Who is buying, who is selling? (c) Signal quality?

**Exercise 2 — 3-Step Framework Application**

Apply the 3-step framework to each block deal:

**Deal A:**
Stock: Kotak Mahindra Bank. Buyer: Norges Bank (Norway Sovereign Wealth Fund). Seller: Promoter (Uday Kotak family trust). Qty: 2.1 crore shares. Price: ₹1,786. Prev close: ₹1,790. Value: ₹3,750 Crore.

**Deal B:**
Stock: Reliance Industries. Buyer: Unknown HNI (domestic). Seller: RIL Promoter Group. Qty: 80 lakh shares. Price: ₹2,815. Value: ₹2,252 Crore.

**Deal C:**
Stock: Infosys. Buyer: LIC (Life Insurance Corporation). Seller: Vanguard (exiting position). Qty: 1.4 crore shares. Price: ₹1,548. Value: ₹2,167 Crore.

**Deal D:**
Stock: Sun Pharmaceuticals. Buyer: Promoter (Dilip Shanghvi, open market). Seller: Morgan Stanley (FII, exiting). Qty: 50 lakh shares. Price: ₹1,186. Value: ₹593 Crore.

For each deal: (a) Step 1 — Buyer signal? (b) Step 2 — Seller context? (c) Step 3 — Price context? (d) Overall interpretation (bullish/bearish/neutral)? (e) Institutional scorecard points?

**Exercise 3 — Promoter Pledge Assessment**

For each company, assess the block deal risk given the promoter pledge data:

| Company | Block Deal | Promoter Pledge | Quarterly Trend |
|---------|-----------|----------------|----------------|
| A | Promoter sold 3% stake to FII | 8% pledged | Declining |
| B | Promoter sold 2% stake to retail HNI | 62% pledged | Rising |
| C | Promoter bought 1% stake (open market) | 15% pledged | Declining |
| D | Promoter sold 0.5% stake to DII | 34% pledged | Stable |

For each: (a) Is the block deal bullish or bearish? (b) How does the pledge data modify your interpretation? (c) What is the appropriate action for a trader holding each stock?

---

### Intermediate Exercises

**Exercise 4 — Wyckoff + Delivery + Block Deal Convergence**

HDFC Bank data over the past 3 weeks:

**Wyckoff structure:** SOS bar 3 weeks ago (daily, wide spread, 2.8× volume, closed at multi-month high). LPS now forming: 2 weeks of pullback on declining volume.

**Delivery % pattern:** SOS day = 74% delivery. LPS days average = 22% delivery.

**FII/DII data:** FII 20-day cumulative = +₹24,400 Crore (strongly positive).

**Today's block deal (pre-market):** Vanguard (US — one of world's largest fund managers) bought 1.8 crore shares of HDFC Bank at ₹1,726. Seller: JP Morgan (FII → FII rebalancing). Value: ₹3,107 Crore.

**HDFC Bank current price:** ₹1,729 (LPS zone). Spring low was ₹1,682. Stop level: ₹1,679.

Questions:
a) Score the block deal on the institutional scorecard (what combination is this?).
b) What is the Delivery % confirmation from the LPS days?
c) What is the FII/DII confirmation?
d) Calculate the total institutional scorecard (delivery + FII/DII + block deal points).
e) Given the convergence, what is the appropriate position size vs your normal size?
f) Design the trade: Entry, stop, T1, T2. Account: ₹20L, risk 1%.

**Exercise 5 — Promoter Red Flag Analysis**

A stock (assume a mid-cap, ₹8,000 Crore market cap) shows this block/bulk deal history over 6 months:

Month 1: Promoter sold 2% stake in block deal to retail HNI. Pledge: 38%.
Month 2: No significant deal. Stock rises 8%.
Month 3: Promoter sold another 1.5% stake to unknown buyers (bulk). Pledge: 44%.
Month 4: Stock rises another 6%. Analyst upgrades. Delivery % rising.
Month 5: Promoter sold 2% stake in block deal to unknown entity. Pledge: 52%.
Month 6: Stock rises 4%. Block deal: Same promoter selling 1.5% to an NBFC at ₹[current price].

Simultaneously: Company recently missed earnings. Management guidance downgraded.

a) Create a timeline of promoter selling pattern. Is this a one-time event or a pattern?
b) What does the rising pledge + serial selling combination indicate?
c) Despite the stock rising each month: Should you hold or exit? Why?
d) Which Wyckoff event does this promoter behaviour pattern resemble at the macro level?
e) What would change your assessment from bearish to neutral on this promoter-selling pattern?

**Exercise 6 — The Morning Block Deal Protocol**

It is 9:05 AM. You check NSE block deals and see these for today (your watchlist is marked with *):

| Stock | Buyer | Seller | Value | 
|-------|-------|--------|-------|
| HDFC Bank* | GIC Singapore | HDFC Holdings (Promoter) | ₹820 Cr |
| TCS* | SBI MF | JP Morgan (FII) | ₹340 Cr |
| Infosys* | Unknown HNI | Promoter | ₹180 Cr |
| Reliance | Vanguard | CPPIB (FII) | ₹2,400 Cr |
| Nifty Bees ETF | LIC | Unknown | ₹640 Cr |
| Axis Bank* | Promoter (Shikha Sharma promoter group) | Nil (open market buy) | ₹92 Cr |

Your Wyckoff analysis from last night:
- HDFC Bank: LPS zone. Phase D.
- TCS: Phase B. Not yet ready.
- Infosys: Potential UTAD forming. Caution.
- Axis Bank: Spring just occurred. Phase C confirmed.

a) For HDFC Bank: Apply 3-step framework. Scorecard points. Trade action today.
b) For TCS: Apply 3-step framework. Does the block deal change your Phase B assessment?
c) For Infosys: Apply 3-step framework. Does the promoter selling confirm your UTAD concern?
d) For Axis Bank: Apply 3-step framework. Does the promoter buy confirm the Spring?
e) Priority ranking: Which stock gets first capital allocation today and why?

---

### Advanced Exercise

**Exercise 7 — Full Block/Bulk Deal Investigation**

A large-cap NSE stock shows unusual activity over 2 weeks. Build the complete institutional picture:

**Wyckoff context:** Stock has been in Phase B range for 8 weeks. SC at ₹840. AR at ₹960. Now at ₹882 (within the range). Delivery % has been declining from 42% → 36% → 28% → 22% over 4 weeks (quiet accumulation building).

**Week 1 Block/Bulk deals:**
Day 1 (block, morning): Norges Bank bought 80 lakh shares at ₹878. Seller: Domestic VC/PE firm. Value: ₹702 Crore.
Day 3 (bulk, market hours): SBI MF accumulated 60 lakh shares at ₹884–₹890. Value: ₹535 Crore.
Day 5 (block, morning): LIC bought 1.1 crore shares at ₹876. Seller: Another FII (portfolio rebalancing). Value: ₹964 Crore.

**Week 2:**
Day 1 (bulk): Promoter bought 35 lakh shares in open market at ₹870–₹882. Value: ₹308 Crore.
Day 3 (bulk): Axis MF bulk buy of 42 lakh shares at ₹886.
Day 5: Stock surges 4.8% on 3.6× volume. Delivery % = 79%. No block/bulk deal (happened in regular market at SOS prices).

Questions:
a) Map all the institutional activity across 2 weeks (who, what, when).
b) What Wyckoff event does Day 5 of Week 2 represent? What confirms it?
c) Calculate the total institutional scorecard (delivery + FII/DII + block/bulk) for this trade.
d) The promoter buy on Week 2 Day 1: Why is this particularly significant at the ₹870–₹882 price level?
e) After the Day 5 surge: What do you expect in Week 3? Design the LPS trade.
f) What block/bulk deal combination in Week 3 would give you MAXIMUM conviction for the LPS entry?
g) If instead of the above: Day 5 shows promoter selling 50 lakh shares to unknown clients at ₹886 — how does this completely change the analysis?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** What is the exact definition of a Block Deal on NSE? State the minimum size, execution window, price constraint, and disclosure requirement.

**Q2.** What is a Bulk Deal? How is the 0.5% threshold calculated? How does it differ from a Block Deal in terms of execution, price discovery, and timing?

**Q3.** What are the three steps of the block/bulk deal reading framework? For each step, state what it reveals and why it matters.

**Q4.** Rank the following buyers from most bullish to least bullish signal, and justify each ranking: Sovereign Wealth Fund (FII), Promoter (open market), DII (LIC), DII (Mutual Fund), Unknown Retail HNI.

**Q5.** Explain the "Promoter selling to retail/unknown" scenario. Why is this the most dangerous block deal combination, and what questions should immediately be investigated?

**Q6.** What is the difference between a "promoter block deal sell" (bearish) and a "VC/PE block deal sell to FII" (bullish)? Why does the SELLER identity matter for the interpretation?

**Q7.** Explain the promoter pledge system. What pledge % thresholds signal moderate vs high risk? How does rising pledge combined with block deal selling change the interpretation?

**Q8.** Describe the "Maximum Conviction" trade setup that combines Wyckoff Phase, Delivery %, FII/DII data, and Block/Bulk Deal signal. What must each layer show for the setup to qualify?

**Q9.** What is the professional morning block deal routine? How long does it take and what specifically are you looking for?

**Q10.** Describe how block/bulk deal signals are scored in the institutional scorecard. What is the maximum bullish score, and which single event earns the maximum 3 points?

### Chart Questions (5)

**S1.** Block deal data for a watchlist stock today:
Buyer: CPPIB (Canada Pension Plan Investment Board — sovereign pension fund)
Seller: Promoter Group (selling 1.2% of company to CPPIB)
Price: ₹2,248 (prev close: ₹2,243 — slight premium)
Value: ₹1,840 Crore.

Wyckoff context: Stock is in confirmed LPS. SOS occurred 2 weeks ago. Delivery on SOS day = 71%.

a) Apply the 3-step framework. What is the overall signal?
b) What scorecard points does this block deal earn?
c) Why does the slight PREMIUM price in the block deal add to the bullish case?
d) Is the Promoter selling a concern here? Explain.
e) Design the trade with this confluence.

**S2.** You discover this bulk deal pattern over 3 consecutive days:

Day 1: Promoter family sold 1.8% of shares in bulk to retail HNIs. Pledge: 41%.
Day 2: Stock rises 3% (momentum). Promoter family sold another 0.8% to retail. Pledge: 41%.
Day 3: Stock rises another 2%. Promoter sold 0.6% to unknown offshore entity. Pledge: 44%.

Wyckoff structure: Stock appears to be in Phase E (markup). High volume. Chart looks bullish.

a) What does the 3-day pattern of promoter selling signal?
b) How does the rising pledge on Day 3 modify the interpretation?
c) Despite the bullish chart: What should a holder do?
d) What Wyckoff event might be forming that the promoter can see but the market cannot?
e) What non-block-deal data would you cross-check to confirm your concern?

**S3.** Morning block deals show these two deals in the same sector (Banking):

Deal 1: HDFC Bank. FII (Vanguard) bought from VC/PE exit. ₹1,200 Crore.
Deal 2: ICICI Bank. LIC bought from FII (JPMorgan rebalancing). ₹850 Crore.

Simultaneously: Nifty Bank SOS occurred 4 days ago. LPS pullback ongoing.
FII 20-day cumulative for banking: +₹18,400 Crore.

a) What does TWO simultaneous large-value block deals in banking signal?
b) Score both deals using the scorecard.
c) Which deal is more bullish — Deal 1 or Deal 2? Justify.
d) Combined with the Nifty Bank SOS and FII cumulative: What is the sectoral picture?
e) How does this sector block deal analysis help you choose between HDFC Bank and ICICI Bank for the LPS entry?

**S4.** A company announces strong Q2 results (earnings beat by 18%). Stock rises 6% that day. Block deal data shows:

Buyer: Unknown retail HNIs (multiple accounts, ₹580 Crore total)
Seller: Promoter Group (sold 2.2% of their stake at the result-day high)

Delivery % on result day: 16% (despite 6% rise and 2.8× volume).
FII data: FII net SELL of ₹1,200 Crore on this stock today (separate FII exit data).

a) What is the delivery % + block deal combination telling you?
b) Why is the FII net sell particularly alarming given the positive results?
c) What Wyckoff event is this (strong-looking day with underlying institutional selling)?
d) If you are long the stock entering results: What action does this data require?
e) Explain why "strong results + rising price + low delivery + promoter selling + FII selling" is a textbook distribution signal.

**S5.** Build the complete Block/Bulk deal assessment for a hypothetical stock:

Week 1 (Block deals): 
→ Promoter bought ₹180 Cr in open market at Spring zone (₹442–₹448). 
→ Sovereign fund (GIC) bought ₹1,200 Cr from VC/PE at ₹445.

Week 2 (Bulk deals + Wyckoff):
→ SBI MF bulk buy ₹380 Cr at ₹461 (first day after SOS bar). 
→ HDFC MF bulk buy ₹240 Cr at ₹463.
→ Delivery % on SOS day: 78%. FII 20-day cumulative: +₹14,200 Cr.

Current: LPS forming at ₹452. Spring low: ₹438. Stop: ₹436.

a) Calculate the total institutional scorecard across all three layers (delivery + FII/DII + block/bulk).
b) What is the maximum possible score you have achieved here?
c) Are there any red flags in any of the data? (promoter pledge? seller identity? any bearish signals?)
d) Design the complete trade: Entry, stop, T1, T2, position size (₹25L account, 1% risk).
e) What single event in the coming week would cause you to EXIT this position immediately?

---

## QUIZ ANSWERS

**A1.** Block Deal definition: A single, negotiated transaction between two specific parties executed ONLY during the Block Deal Window. NSE/BSE specifications: Minimum size: 5,00,000 shares OR ₹10 crore — whichever is LOWER. Execution window: 8:45 AM – 9:00 AM (pre-market, before regular trading begins). Price constraint: Must be within ±1% of the previous day's closing price. Cannot be executed at extreme premium or discount. Disclosure: BOTH buyer AND seller names must be published by the exchange within 15 minutes of execution. No hiding of counterparties is permitted — full transparency is mandated.

**A2.** Bulk Deal definition: Any transaction that exceeds 0.5% of the company's total listed (equity) shares outstanding in a SINGLE TRADING SESSION. 0.5% threshold calculation: Total listed shares of Company A = 100 crore. 0.5% threshold = 50 lakh shares. Any client buying or selling 50+ lakh shares in one day = Bulk Deal (must be disclosed). Key differences vs Block Deal: Execution window (market hours vs pre-market), Price (market price vs negotiated within ±1%), Negotiation (no negotiation vs agreed price), Accumulation (can be multiple orders on the same day crossing 0.5% vs single transaction), Disclosure timing (end of day vs within 15 minutes).

**A3.** Three-step framework: Step 1 — WHO IS THE BUYER? (Primary signal): The buyer's identity reveals conviction quality. FII = institutional research conviction. Promoter = insider conviction. DII = domestic long-term conviction. Unknown retail = weak signal. Step 2 — WHO IS THE SELLER? (Context signal): The seller's identity reveals why supply is entering. Promoter selling = always investigate (most dangerous). VC/PE selling = natural exit (neutral to mild negative, mitigated by buyer quality). FII to FII = rebalancing (neutral). DII selling = position management (neutral). Step 3 — PRICE vs MARKET PRICE: Within the ±1% constraint: Premium = buyer eager (bullish). Discount = seller eager (bearish). At market = neutral negotiation.

**A4.** Buyer ranking (most to least bullish): (1) Promoter (open market buy): MOST BULLISH. They have the most information. Personal capital at stake. No promoter buys their own stock at bad prices deliberately. (2) Sovereign Wealth Fund (FII): Very bullish. Decades-long investment horizon. Institutional-grade research. Multi-hundred crore allocation = deep conviction. (3) LIC / DII major institution: Bullish. Long-term domestic capital. Often government-linked investment decisions. Large allocations. (4) DII Mutual Fund: Bullish. Research-driven. SIP capital deployed strategically. (5) Unknown Retail HNI: Least informative. Could be momentum chaser, not research-driven. No access to non-public information. Cannot be relied upon as a conviction signal.

**A5.** Promoter to retail/unknown: The most dangerous combination because: Information asymmetry is maximized — the promoter (most informed) is selling to retail (least informed). This is the definition of distribution: informed capital leaving, uninformed capital entering. Classic Wyckoff CO behavior at tops. Immediate investigation questions: (1) Is this a pattern (3+ months) or isolated event? Pattern = serious. (2) What % of total promoter stake is being sold? Large % = serious. (3) Is promoter pledge rising? Pledge + selling = financial distress. (4) Any pending regulatory, litigation, business, or accounting issues? (5) Is management guidance changing? (6) Has the stock been significantly outperforming (promoter taking advantage of high price to exit)?

**A6.** Promoter sell vs VC/PE sell: Promoter sell: The promoter is the FOUNDER/OPERATOR. They run the company, have access to all financial, strategic, and operational information. When they sell: Either they need personal liquidity (minor reason) OR they believe the stock is fairly/overvalued relative to business prospects (major reason). Always investigate because promoters have the most to lose if they sell too early (they know the value best). VC/PE sell: VC/PE funds have a defined holding period (typically 3–8 years) and a fiduciary duty to their own investors to return capital. Their exit is often MANDATED by their fund structure, not by a view on the stock's value. A VC selling after 5 years at a 10× return is fulfilling their mandate — it says nothing about the stock's future. If a top FII absorbs the VC supply: The VC exit is simply a transfer from a time-constrained holder to a long-term holder. Bullish, not bearish.

**A7.** Promoter pledge: Promoters pledge shares as collateral for bank/NBFC loans. If stock price falls below the collateral coverage ratio, lenders issue margin calls. Unpaid margin calls → forced sale of pledged shares → sudden supply → stock falls further (death spiral). Thresholds: 0–20% pledged: Low risk. Normal corporate finance activity. 20–50% pledged: Moderate risk. Monitor quarterly. 50%+ pledged: HIGH risk. Any 15–20% price decline can trigger forced selling. Rising pledge trend: Escalating risk. Promoter taking more loans = more financial pressure. Combined interpretation: Block deal promoter selling + rising pledge > 50% = The most dangerous combination. The selling is likely forced/distressed. The company may face a governance or financial crisis. No matter how bullish the chart: AVOID or EXIT when this combination appears.

**A8.** Maximum conviction trade setup: Wyckoff Phase (price): Phase D confirmed. SOS bar visible (wide spread, high volume, above AR high). LPS pullback forming (declining volume, price holding above Creek). Delivery %: SOS day delivery > 65% (confirmed institutional surge). LPS days delivery < 25% (no supply present). FII/DII data: FII 20-day cumulative positive and rising (>+₹10,000 Cr). FII F&O net long. Retail F&O net short. Block/Bulk Deal: FII or sovereign fund block deal buy at or near LPS zone. Seller NOT a promoter (VC/PE or FII rebalancing). All four layers aligned = Full conviction + Full position size (1% account risk, maximum allocation). Any three layers aligned = Strong conviction, standard size. Two layers = Standard size with tighter stop.

**A9.** Morning block deal routine (9:00–9:15 AM): Total time: 5 minutes. Process: Open NSE block deals + BSE block deals simultaneously. Scan for: (1) Any watchlist stocks with block deals. (2) Deals > ₹100 crore (significant transactions only). (3) Famous/reputable FII names as buyers (GIC, Vanguard, Norges, ADIA, CPPIB). For each watchlist block deal: Apply 3-step framework. Scorecard points. Update today's trading plan. Trading journal update: "[STOCK] — Block deal: [Buyer] bought from [Seller] at ₹[X]. Signal: [Bullish/Bearish]. Scorecard: +[N] points. Trade action: [Upgrade/Maintain/Downgrade]." Evening bulk deal check (5:30–6:00 PM): Same process for bulk deals. Add to tomorrow's preparation. Total daily habit: 10 minutes. Payoff: Complete institutional conviction picture for all watchlist stocks.

**A10.** Block/Bulk deal institutional scorecard: Maximum bullish score = 12 points (sum of all bullish signals). Maximum single event = 3 points (tied): (a) FII/Sovereign Fund buying at Wyckoff LPS zone (global institution at the ideal entry point — research quality + timing alignment = maximum conviction). (b) Promoter open market buy (insider conviction signal — the most informed person in the world about this specific company is deploying personal capital). Both score 3 because: They represent the HIGHEST quality of information (sovereign fund = best institutional research; promoter = best insider knowledge) at the BEST timing (LPS = technically ideal entry). The combination of research quality + timing alignment + capital at risk = maximum signal quality that cannot be exceeded by any other block/bulk deal combination.

---

## KEY TAKEAWAYS

> **1. Block Deals are pre-market (8:45–9:00 AM), negotiated, fully disclosed transactions. Bulk Deals are intraday, market-price, large threshold (0.5% of shares) transactions. Both disclose buyer AND seller — the identity of the counterparties is the signal.**

> **2. The 3-step framework: WHO IS THE BUYER (primary conviction signal), WHO IS THE SELLER (context and risk), PRICE vs MARKET (eagerness indicator). The buyer's identity and the seller's identity together define the interpretation.**

> **3. Strongest bullish: Sovereign fund or promoter (open market) buying. Strongest bearish: Promoter selling to retail/unknown in a pattern. Always investigate promoter selling immediately — they are the most informed sellers.**

> **4. Promoter pledge > 50% + rising + block deal selling = forced distribution under financial stress. This overrides any bullish chart or technical signal. The most informed person is selling under duress.**

> **5. The maximum conviction NSE trade: Wyckoff Phase D (LPS) + high delivery SOS + positive FII cumulative + FII/Sovereign block deal buy at LPS zone. When all four layers align, full position size is justified within the 1% risk rule.**

---

*Block Bulk Deals — Complete. Part X — Indian Institutional Data is now fully complete.*

*Next topic in the plan: **Order Flow** (Part XI).*

*Ready? Say: **"NEXT CHAPTER"***
