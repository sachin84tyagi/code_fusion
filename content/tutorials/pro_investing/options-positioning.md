# Options Positioning

> **Course:** NSE/BSE Professional Investing — Price, Volume & Institutional Flow
> **Part:** XV — Options Positioning
> **Topic:** Options Positioning

---

## Chapter Overview

Options are not just instruments to buy and sell — they are a POSITIONING system. The combined weight of all outstanding options at every strike creates a gravitational map of institutional expectations that influences the very price movements that underlie them. This feedback loop — options influencing price, price influencing options — is the core of professional options positioning analysis.

In this chapter we move from the mechanics (previous chapter) to the operational use of options as a positioning intelligence tool. The goal is to read what the most informed participants (FII, institutional desks) are doing in the options market, and align your strategy with the correct Wyckoff phase.

**The Core Rule:**

> **Amateur options traders ask: "Which option should I buy?" Professional traders ask: "What phase is the market in, what is the options market telling me about institutional positioning, and what strategy extracts maximum value from the current market structure?" The answer to the second question always includes PCR, participant-wise OI, India VIX, call/put walls, and Wyckoff phase — never just a price prediction.**

---

## LEVEL 1 — BEGINNER

### Put-Call Ratio (PCR) — The Sentiment Barometer

```
PUT-CALL RATIO (PCR) = Total Put Open Interest / Total Call Open Interest
  OR (alternatively measured by volume): Total Put Volume / Total Call Volume

WHAT IT MEASURES:
→ The relative number of puts (bearish/protective positions) vs calls (bullish positions).
→ Extremes in PCR = Extremes in market sentiment = CONTRARIAN opportunities.

WHERE TO ACCESS NSE PCR:
→ nseindia.com → Derivatives → Put/Call Ratio (daily publication)
→ Sensibull, Opstra: Real-time PCR with historical chart
→ NSE Bhavcopy (F&O): Raw OI data to calculate manually

PCR THRESHOLDS AND SIGNALS:

PCR < 0.7 — EXTREME BULLISHNESS (Contrarian BEARISH):
→ Far more calls than puts. Market is OVERLY bullish.
→ Too many call buyers = Too few skeptics = Everyone already long.
→ Contrarian: When everyone is bullish, who is LEFT to buy?
→ Historical NSE context: PCR < 0.7 has preceded major corrections.
→ Wyckoff: UTAD or distribution peak zone.
→ Action: Do NOT initiate new longs. Prepare for reversal. Add put hedges.

PCR 0.7–0.9 — NEUTRAL-BULLISH (Normal healthy range):
→ Balanced put/call positioning. Market neither fearful nor complacent.
→ No extreme contrarian signal from PCR alone.
→ Wyckoff: Phase D markup or early Phase B.
→ Action: Follow Wyckoff structure and other institutional layers.

PCR 0.9–1.2 — NEUTRAL (Balanced market):
→ Near-equal put/call positioning. Neither fearful nor greedy.
→ Phase B accumulation range is the most common context for PCR in this zone.
→ Action: Range-bound strategy. Sell premium (straddles/strangles). Collect theta.

PCR 1.2–1.5 — MODERATELY FEARFUL (Contrarian BULLISH):
→ More puts than calls. Market has moderate fear.
→ Traders buying put protection = Premium on the table for put sellers.
→ When the market recovers: These puts expire worthless = Boost to sellers.
→ And: Put buyers must sell as puts expire = Natural buying pressure.
→ Wyckoff: LPS zone. Accumulation nearing completion.
→ Action: Consider long calls or bull spreads. Put wall confirmed as support.

PCR > 1.5 — EXTREME FEAR (Contrarian MAXIMUM BULLISH):
→ Massive put buying relative to calls. Panic-level put demand.
→ Maximum put fuel available for a reversal rally.
→ Historical NSE: PCR above 1.8 has coincided with major Nifty bottoms.
→ Examples: COVID March 2020 (PCR > 2.0), October 2022 correction bottom.
→ Wyckoff: Selling Climax (SC) or Spring low.
→ Action: Best time to BUY calls (cheap — low IV). Worst time to buy puts (peak IV).
→ Sell puts if experience/capital allow (collect maximum premium at the bottom).

PCR CALCULATION EXAMPLES:
Total Nifty Put OI: 82,40,000 contracts.
Total Nifty Call OI: 58,60,000 contracts.
PCR = 82,40,000 / 58,60,000 = 1.41 (Moderately Fearful → Contrarian Bullish).

WHICH PCR TO USE — OI vs Volume:
→ OI-based PCR: More stable. Reflects ACCUMULATED institutional positioning.
   Better for multi-day directional bias.
→ Volume-based PCR: More volatile (changes daily). Reflects TODAY'S activity.
   Better for intraday or next-day positioning reads.
→ Professional practice: Use OI-based PCR for weekly bias. Volume PCR for daily confirmation.
```

---

### Participant-wise Options OI — The Institutional X-Ray

![Put-Call Ratio & Participant-wise Options OI — Institutional Positioning Signals](/images/pi-options-pcr-positioning.jpg)

**The most powerful read: What is FII doing with options?**

```
NSE DAILY PUBLICATION:
→ nseindia.com → Derivatives → Participant-wise Open Interest → Options

FOUR PARTICIPANT CATEGORIES (same as futures):
FII, DII, Client (Retail), Pro (Proprietary)

FOR EACH CATEGORY, NSE SHOWS:
→ Call OI Long: Number of CALL options BOUGHT (long call positions)
→ Call OI Short: Number of CALL options SOLD/WRITTEN (short call positions)
→ Put OI Long: Number of PUT options BOUGHT (long put positions)
→ Put OI Short: Number of PUT options SOLD/WRITTEN (short put positions)

THE FOUR CRITICAL POSITIONS AND WHAT THEY SIGNAL:
LONG CALLS: Bullish directional bet. Paying premium for upside.
SHORT CALLS: Bearish/neutral. Receiving premium. Expect price to stay below strike.
LONG PUTS: Bearish/protective. Paying premium for downside protection.
SHORT PUTS: Bullish. Receiving premium. Expect price to stay above strike.

READING THE DATA — FII BEARISH DISTRIBUTION SETUP:
FII: Call OI Long 1,82,400 vs Call OI Short 2,84,200 → NET SHORT CALLS (101,800)
FII: Put OI Long 1,44,200 vs Put OI Short 98,400 → NET LONG PUTS (45,800)

Reading: FII is simultaneously SHORT CALLS (expects price BELOW strikes) +
         LONG PUTS (pays for put protection on their long equity). 
         This is a COLLAR position in options = Distributing.
         They own the equity but are capping upside via short calls
         and protecting downside via long puts. = DISTRIBUTION IN PROGRESS.

READING THE DATA — FII BULLISH ACCUMULATION SETUP:
FII: NET LONG CALLS + NET SHORT PUTS (simultaneously)
→ Long calls: FII expects price ABOVE strikes (bullish directional).
→ Short puts: FII receives premium, agrees to BUY more stock if it falls.
→ This is a BULLISH RISK REVERSAL:
   Collecting put premium to fund call buying. Maximum bullish options posture.
→ Wyckoff: Spring or LPS. CO using options to accumulate cheaply.
   They sell puts (obligate to buy cheaper if it falls) while buying calls (profit from upside).

THE RETAIL ADVERSE SELECTION PATTERN:
At distribution tops, retail positioning consistently shows:
→ Client NET LONG CALLS + NET SHORT PUTS at market HIGHS.
   Retail is buying calls (paying for upside that may not come).
   Retail is selling puts (giving FII the option to sell stock back to them cheaply).
→ FII is on the other side: SHORT CALLS (selling to retail's call buyers) +
   LONG PUTS (buying from retail's put sellers) = FII is hedged.
→ Retail buys calls from FII. FII buys puts from retail.
   FII is HEDGED. Retail is UNHEDGED.
   This is the options market's version of adverse selection at the distribution top.
```

---

## LEVEL 2 — INTERMEDIATE

### Wyckoff Phase → Options Strategy Map

![Wyckoff Phase → Options Strategy Map — Right Strategy at the Right Market Phase](/images/pi-wyckoff-options-strategies-map.jpg)

**The complete phase-strategy alignment:**

**Phase A (Selling Climax) — Sell Puts:**

```
MARKET CONTEXT:
→ India VIX: Maximum (> 22). Options are most expensive they will be.
→ PCR: > 1.5 (extreme fear). Put demand maximum.
→ Order flow: Long unwinding (OI falling + price falling).
→ Delivery: High (panic selling = real delivery change hands).

OPTIMAL STRATEGY: PUT SELLING (Short Put)

WHY SELL PUTS AT THE SC:
→ IV is at its maximum — you collect the highest possible premium.
→ PCR > 1.5 = The crowd is buying puts. You SELL what the crowd is buying.
→ The SC is, by definition, the point where selling exhausts.
   If you sell a put at the SC low: Price holds there (by definition of SC).
   Your put expires worthless. Full premium kept.

NSE IMPLEMENTATION:
→ Nifty in SC zone (SC low ≈ 24,000). India VIX = 28.
→ Sell Nifty 24,000 PE with 15-20 days to expiry.
→ Premium received: ₹280 per unit (inflated 3× by high VIX).
→ Total premium per lot: ₹280 × 25 = ₹7,000.
→ If SC holds and Nifty at 24,400 at expiry: Full ₹7,000 profit.
→ Breakeven: 24,000 − 280 = 23,720 (Nifty must fall BELOW 23,720 for loss).

RISK MANAGEMENT:
→ Cover (buy back) the put if Nifty closes below the SC low by 1.5%+ for 2 sessions.
→ That signals the SC thesis is wrong — genuine breakdown, not SC.
→ Maximum loss scenario: Nifty crashes to 22,000. Loss = (24,000 − 22,000 − 280) × 25 = ₹43,000/lot.
→ This is why put selling at SC requires: (a) Proper Wyckoff conviction, (b) Defined stop rules.

AVOID AT SC: Buying puts. You are paying peak IV right at the bottom.
              Statistically: SC put buyers lose money 70%+ of the time
              because they buy at maximum fear = maximum premium.
```

**Phase B (Accumulation Range) — Sell Straddles/Strangles:**

```
MARKET CONTEXT:
→ India VIX: Declining (14–18). Settling into range.
→ PCR: 0.9–1.2 (neutral). Neither extreme.
→ Range defined: Call Wall (upper) and Put Wall (lower) clearly visible.
→ Max Pain: Predictable and stable.

OPTIMAL STRATEGY: SHORT STRANGLE (sell OTM call + sell OTM put)

NSE IMPLEMENTATION:
→ Nifty range: 24,000 (put wall/support) to 25,000 (call wall/resistance).
→ Sell 24,000 PE + Sell 25,000 CE (weekly expiry, 5–7 days to expiry).
→ Premium collected:
   24,000 PE: ₹65 × 25 = ₹1,625 per lot.
   25,000 CE: ₹28 × 25 = ₹700 per lot.
   Total premium: ₹2,325 per lot per week.
→ Profit range: Nifty stays between 23,935 and 25,028 (breakeven = strikes ± premium).
→ Time horizon: 1 weekly expiry at a time. Renew next week.
→ Monthly approach: 4 weekly strangles in Phase B = 4 × ₹2,325 = ₹9,300/lot income.

STRANGLE MANAGEMENT:
→ Define maximum loss: If Nifty approaches a wall with 50%+ loss on either leg: Exit.
→ Delta hedge: If Nifty moves within 100 points of a wall:
   Sell Nifty futures (if approaching call wall) or Buy futures (if approaching put wall).
   This neutralises the delta exposure as one leg becomes threatened.
→ When SOS occurs: EXIT strangle IMMEDIATELY. Phase B is over. Strategy changes.

KEY INSIGHT: The short strangle in Phase B earns THETA EVERY DAY.
In Phase B: Time is your ally. Every day = income.
In Phase D (SOS): Time is neutral. Options buyer earns from delta.
Know which phase you are in before choosing sides.
```

**Phase C (Spring) — Buy Calls:**

```
MARKET CONTEXT:
→ India VIX: Brief spike then rapidly DECLINING.
→ PCR: Elevated (>1.3) but about to decline as put premiums collapse.
→ Order flow: Delta reversal from negative to positive (Spring confirmed).
→ Call Wall: Starting to shift higher (range expansion expected).

OPTIMAL STRATEGY: LONG CALL (buy low-IV calls before SOS expansion)

WHY THE SPRING IS THE BEST TIME TO BUY CALLS:
→ VIX declining (from brief Spring spike) = IV FALLING = Options getting CHEAPER.
→ Buying a CALL when IV is LOW = Cheap vega. Low theta cost.
→ When the SOS arrives: VIX may tick higher (volatility expansion) = Vega profit.
→ Delta gain from SOS: ATM call gains ~0.50 per point move.
→ Combined: Delta gain + Vega expansion = maximum call payoff.

NSE IMPLEMENTATION (Spring day or next session):
→ Spring confirmed: Nifty at LPS level (24,280). VIX fell from 16 to 13.4.
→ Buy Nifty 24,500 CE (slightly OTM — 220 points above) with 22 days to expiry.
→ Premium: ₹120. Low IV = cheap entry.
→ Lot cost: ₹120 × 25 = ₹3,000.
→ When SOS arrives (Nifty to 24,850): Call is now ITM by 350 points.
   New premium ≈ ₹350–₹390. Profit per unit: ₹230–₹270. Per lot: ₹5,750–₹6,750.
   Return: 191%–225% on the ₹3,000 investment.
→ Stop: Option premium falls below ₹60 (50% loss = Nifty back below Spring low).
```

**Phase D (SOS + LPS) — Bull Call Spread:**

```
OPTIMAL STRATEGY: BULL CALL SPREAD

BUY lower strike call + SELL higher strike call (same expiry)
→ The sold upper call REDUCES the cost of the lower call.
→ Profit is CAPPED at the upper strike (but that strike IS the target).
→ Maximum loss: Net premium paid (defined risk).

NSE IMPLEMENTATION (SOS day):
→ Nifty breaks above 24,820 (AR high) with volume. SOS confirmed.
→ Bull call spread at breakout:
   BUY Nifty 24,500 CE at ₹145 (now ITM by 320 points after SOS).
   SELL Nifty 25,000 CE at ₹38 (target = call wall level).
   Net cost: ₹145 − ₹38 = ₹107 per unit = ₹2,675 per lot.
→ Maximum profit: (25,000 − 24,500 − 107) = ₹393 per unit = ₹9,825 per lot.
→ Risk:reward = ₹2,675 : ₹9,825 = 1 : 3.67.
→ Probability of max profit: Nifty simply needs to reach 25,000 (the call wall).

LPS ENTRY (better pricing):
→ LPS pullback: Nifty retraces to 24,280 after SOS.
→ Buy Nifty 24,200 CE at ₹110 (near ATM at LPS).
→ Target when Nifty reaches 24,800: CE worth ≈ ₹400–₹500.
→ Profit per unit: ₹290–₹390. Risk: ₹110. R:R = 2.6:1 to 3.5:1.
→ LPS timing rule: Enter at the FIRST POSITIVE DELTA BAR in the LPS zone.
   This is the entry precision tool from Chapter: Order Flow.
```

**Distribution / UTAD — Buy Puts or Bear Put Spread:**

```
MARKET CONTEXT:
→ VIX RISING while Nifty still at high levels.
→ PCR DECLINING (retail buying calls, FII writing puts) — extreme bullishness.
→ Participant OI: FII long puts + short calls. Retail long calls + short puts.
→ IV Skew: STEEPENING rapidly (put buyers aggressive).

OPTIMAL STRATEGY: LONG PUT or BEAR PUT SPREAD

UTAD IDENTIFICATION:
→ Wyckoff UTAD: Price thrusts above the AR high briefly, then REVERSES.
→ Options signal BEFORE the UTAD: FII puts increasing. Skew steepening. VIX rising.
→ The UTAD itself: Brief spike above range high on DECLINING delta (absorption).

NSE IMPLEMENTATION:
→ UTAD at 25,200 (above range high of 24,820). VIX = 18.4 (rising).
→ Buy Nifty 25,000 PE at ₹145 (ATM at UTAD high).
   Stop: Nifty closes ABOVE 25,300 for 2 sessions (UTAD failed = markup continues).
   Target: SC zone (24,000 or below).

BEAR PUT SPREAD (reduce cost with elevated IV):
→ BUY Nifty 25,000 PE at ₹145 + SELL Nifty 24,000 PE at ₹68.
→ Net cost: ₹145 − ₹68 = ₹77 per unit = ₹1,925 per lot.
→ Maximum profit: (25,000 − 24,000 − 77) × 25 = ₹23,075 per lot.
→ Risk:reward = 1 : 11.98. Exceptional if UTAD confirmed.
→ Selling the lower put REDUCES cost but CAPS profit at 24,000.
   If Phase E markdown goes deeper: The bear put spread cap limits gains.
   In that case: Hold long put naked (no cap).
```

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### OI Shift Analysis — Reading Migration Between Strikes

```
OI SHIFT = Movement of large Open Interest from one strike to another.
         This reveals institutional repositioning in real-time.

BULLISH OI SHIFT:
→ Large PUT OI moves from LOWER strikes to HIGHER strikes.
→ Example: 24,000 PE OI drops by 80,000 contracts.
           24,200 PE OI increases by 82,000 contracts.
→ Reading: Put wall moving UPWARD. Institutions protecting higher levels.
           They no longer fear Nifty falling to 24,000 — they are now confident
           it will stay above 24,200. This is BULLISH (confidence rising).
→ Wyckoff: This shift often occurs as Phase D (SOS) begins.
   Put sellers (CO) are moving their protection upward = They expect higher prices.

BEARISH OI SHIFT:
→ Large CALL OI moves from HIGHER strikes to LOWER strikes.
→ Example: 25,500 CE OI drops 60,000. 25,000 CE OI increases 58,000.
→ Reading: Call wall moving DOWNWARD. Option sellers positioning for lower ceiling.
           Resistance is moving toward the market = Distribution beginning.
→ Wyckoff: Call wall compression often precedes a UTAD (price cannot break higher
   as more institutional selling pressure appears at lower strike levels).

STRIKE ROLLUP (Bullish — Markup confirmation):
→ Both call wall AND put wall migrate upward simultaneously.
→ The entire trading range is SHIFTING HIGHER.
→ Wyckoff: Phase D markup in progress. Institutional consensus: Prices going higher.
→ Action: Hold long calls. Add on LPS dips.

STRIKE ROLLDOWN (Bearish — Phase E):
→ Both call wall AND put wall migrate downward simultaneously.
→ The entire trading range is SHIFTING LOWER.
→ Wyckoff: Phase E markdown. Institutional consensus: Prices going lower.
→ Action: Hold long puts. Add on rallies.
```

### The Options + Complete Institutional Scorecard

```
COMPLETE 6-LAYER INSTITUTIONAL SCORECARD (maximum 54 points):

Layer 1 — Wyckoff Structure (max 6 pts):
□ +2: Phase D confirmed (SOS + LPS visible)
□ +2: LPS structurally valid (above Creek/Spring low)
□ +2: Volume Profile supports entry (LVN above, HVN below)

Layer 2 — Delivery % (max 10 pts):
□ +3: SOS day delivery > 65% + volume > 2×
□ +2: LPS day delivery < 30%
□ +2: 5-day delivery trend rising
□ +1: Spring delivery < 25%
□ +1: ST delivery < SC delivery
□ +1: Sector delivery 20%+ above average

Layer 3 — FII/DII (max 9 pts):
□ +2: FII 20-day cumulative positive and rising
□ +2: FII cumulative improving
□ +1: FII net positive on SOS day
□ +1: FII near-zero on LPS days
□ +1: FII F&O net long
□ +1: Retail F&O net short
□ +1: DII consistent net positive

Layer 4 — Block/Bulk Deals (max 12 pts):
□ +3: FII/Sovereign block buy at LPS zone
□ +3: Promoter open market buy
□ +2: DII (LIC/MF) block deal buy
□ +2: FII absorbing VC/PE exit
□ +1: FII urgent bulk buy on SOS day
□ +1: Multiple FIIs buying in same sector

Layer 5 — Order Flow + Futures (max 8 + 11 = 19 pts):
ORDER FLOW (max 8):
□ +3: SOS bar: Massively positive delta
□ +2: LPS days: Near-zero delta on down sessions
□ +2: Spring: Delta reversed rapidly
□ +1: CD bullish divergence at LPS

FUTURES (max 11):
□ +3: OI rising + price rising on SOS
□ +2: FII net long at multi-month high and rising
□ +2: Retail net short at maximum
□ +2: Basis expanding above fair value
□ +1: Rollover > 80% + premium
□ +1: OI stabilisation signal (SC)

Layer 6 — OPTIONS (max 9 pts):
□ +2: VIX at 30-day low + Phase D (cheap calls, low IV)
□ +2: Put Wall HOLDING at Wyckoff LPS zone
□ +2: Call Wall OI declining (sellers covering = breakout imminent)
□ +1: VIX declining while Nifty declining (CO selling puts at SC)
□ +1: IV Skew flattening (fear reducing = accumulation completing)
□ +1: Max Pain at or above current Nifty (expiry gravity bullish)

TOTAL MAXIMUM SCORE: 65 points (with Options layer added)

REVISED POSITION SIZING:
55–65 points (Very Rare — < 1% of days): 1.5× normal position.
42–54 points (Strong): 1.0× normal position.
28–41 points (Moderate): 0.75× normal position.
14–27 points (Weak): 0.5× normal position.
< 14 points: No trade.
```

---

## EXERCISES

### Beginner Exercises

**Exercise 1 — PCR Classification**

Classify each PCR reading and state the Wyckoff phase it most likely corresponds to:

| PCR | Classification | Wyckoff Phase | Optimal Options Strategy |
|----|---------------|--------------|------------------------|
| 0.62 | ? | ? | ? |
| 0.84 | ? | ? | ? |
| 1.08 | ? | ? | ? |
| 1.38 | ? | ? | ? |
| 1.76 | ? | ? | ? |
| 2.12 | ? | ? | ? |

For each: (a) Classification (extreme bull/neutral-bull/neutral/bullish/extreme fear). (b) Contrarian directional signal. (c) Most likely Wyckoff phase. (d) Best options strategy.

**Exercise 2 — Phase-Strategy Alignment**

For each scenario, identify the correct options strategy:

**Scenario A:** India VIX = 14.2. Nifty rangebound 23,400–24,800 for 3 weeks. Call wall 24,800. Put wall 23,400. PCR = 1.04. Expiry in 6 days.

**Scenario B:** India VIX = 26.4. Nifty fell 12% in 3 weeks. PCR = 1.72. Delivery = 82% (maximum fear). SC forming at 22,800.

**Scenario C:** Wyckoff Spring confirmed. VIX fell from 18 to 13.8. PCR = 1.34 (elevated but declining). Nifty at 23,200 (Spring low). LPS building. 28 days to expiry.

**Scenario D:** Nifty at 25,400 (UTAD). VIX = 16.4 and rising. FII participant-wise: Net long puts (+82,000 contracts added in 5 days). Retail: Net long calls. Skew steepening. PCR = 0.74 (declining).

For each: (a) Which Wyckoff phase? (b) Best options strategy? (c) NSE implementation (specific strike and expiry)?

**Exercise 3 — Premium Calculation**

Calculate premium collection for each Phase B strangle:

**Weekly Strangle (Nifty Phase B, expiry in 5 days):**
Sell 23,500 PE at ₹42 + Sell 24,800 CE at ₹28. Lot size 25.

a) Total premium collected per lot.
b) Upper and lower breakeven prices.
c) Nifty at expiry = 24,200 (within range). What is the P&L?
d) Nifty at expiry = 25,100 (broke the call wall). What is the P&L?
e) If you repeat this strangle every week for 4 weeks (all profitable): Total income?

---

### Intermediate Exercises

**Exercise 4 — Participant-wise OI Analysis**

NSE Participant-wise Options OI for Nifty (Wednesday data):

| Category | Call OI Long | Call OI Short | Put OI Long | Put OI Short |
|---------|------------|-------------|-----------|------------|
| FII | 2,42,400 | 1,24,800 | 88,400 | 2,18,600 |
| DII | 28,400 | 18,600 | 12,400 | 22,800 |
| Client | 88,200 | 2,48,400 | 1,84,200 | 68,400 |
| Pro | 42,200 | 52,400 | 36,400 | 28,400 |

a) Calculate FII's net position in calls (long − short) and puts (long − short).
b) Calculate Client (Retail) net in calls and puts.
c) Describe FII's complete options posture in one sentence. Is it bullish or bearish?
d) Describe Retail's complete options posture. Is it bullish or bearish?
e) FII and Retail are on OPPOSITE sides. Who is on which side of each transaction?
f) What Wyckoff phase does this positioning most likely correspond to?
g) What options strategy should YOU follow, given FII's positioning?

**Exercise 5 — Bull Call Spread vs Long Call**

Nifty LPS confirmed at 24,180. SOS expected to target 25,000 (call wall). 24 days to expiry.

**Option A — Naked Long Call:**
Buy Nifty 24,200 CE at ₹140. Lot size 25.

**Option B — Bull Call Spread:**
Buy Nifty 24,200 CE at ₹140. Sell Nifty 25,000 CE at ₹32.
Net cost: ₹108. Lot size 25.

Compare at these Nifty levels at expiry:

| Nifty Level | Long Call P&L | Bull Spread P&L | Long Call % Return | Spread % Return |
|------------|-------------|----------------|------------------|----------------|
| 24,000 (stop hit) | ? | ? | ? | ? |
| 24,200 (breakeven) | ? | ? | ? | ? |
| 24,800 (midway) | ? | ? | ? | ? |
| 25,000 (target T1) | ? | ? | ? | ? |
| 25,500 (target T2) | ? | ? | ? | ? |

a) Fill in the table.
b) At which Nifty level does the Long Call become more profitable than the Spread?
c) If your target is ONLY 25,000 (call wall): Which strategy is more capital efficient?
d) Under what Wyckoff conditions would you choose naked Long Call over Spread?
e) Calculate the capital deployed and maximum risk per strategy (per lot).

**Exercise 6 — PCR + Participant OI Convergence**

Track PCR and participant OI changes over 5 days:

| Day | PCR | FII Net Options | Retail Net Options | Nifty | Interpretation |
|----|-----|--------------|-----------------|----|---------------|
| Mon | 0.82 | Net short calls | Net long calls | 24,800 | ? |
| Tue | 0.78 | More short calls | More long calls | 24,900 | ? |
| Wed | 0.74 | Added long puts | Sold more puts | 25,100 | ? |
| Thu | 0.71 | Max short calls + max long puts | Max long calls + max short puts | 25,200 | ? |
| Fri | 0.68 | No change (positions set) | FOMO buying | 25,350 (UTAD?) | ? |

a) Describe the PCR trend over the 5 days. What does the decline to 0.68 signal?
b) FII is simultaneously SHORT CALLS + LONG PUTS. What specific combination is this?
c) Retail is LONG CALLS + SHORT PUTS simultaneously. What is their risk profile?
d) On Friday at 25,350: If this is the UTAD, what happens next week?
e) What is the ideal options entry for the UTAD scenario? Specific strike and strategy.
f) Where would you place the stop for this put trade?

---

### Advanced Exercise

**Exercise 7 — Complete Options Positioning Analysis**

Build the full 6-layer institutional scorecard for a Nifty long trade.
Context: Nifty at 24,280 (LPS). SOS was 4 days ago at 24,820. Spring low = 23,890.

**All institutional data collected:**

Wyckoff: Phase D confirmed. LPS structurally valid. Volume Profile LVN above.

Delivery % (last 4 LPS sessions): 22%, 24%, 19%, 21%.
SOS delivery: 76%. 5-day trend rising.

FII/DII: 20-day cumulative +₹21,400 Cr. FII net today = +₹1,200 Cr.
FII F&O futures: Net long (from previous chapter). Retail F&O: Net short.

Block deal today (8:52 AM): GIC Singapore bought ₹1,100 Cr (Index ETF, block window).

Order flow: CD falling today (−14,200) but Nifty only fell −0.4%. Near-zero delta on last bar.

Futures: OI fell −1,800 today (LPS = long unwinding, not short buildup). Basis: +₹94 (vs fair ₹88).

Options:
→ India VIX: 13.8 (at 30-day low).
→ Put Wall at 24,000 PE: OI = 1,12,400 contracts. OI change today: +18,200 (rising — defending).
→ Call Wall at 25,000 CE: OI = 2,04,800 contracts. OI change today: −6,400 (declining — weakening).
→ IV Skew: 23,500 PE IV = 18.6%. 25,500 CE IV = 15.8%. Skew = 2.8% (slightly elevated but flat trend).
→ Max Pain: 24,500 (above current Nifty = gravitational pull upward).
→ VIX trend today: Falling (14.2 → 13.8) while Nifty fell 0.4%. (Divergence = CO selling puts).
→ Participant-wise Options OI: FII net short puts (+62,400 contracts short put = bullish FII posture).

Required:
a) Score each layer against the scorecard (maximum 65 points total).
b) What does FII net short puts (62,400 contracts) specifically confirm about the LPS?
c) The call wall OI is declining. When does this signal a breakout is imminent?
d) VIX falling while Nifty falling: What specific options activity causes this pattern?
e) Design the options trade: Strike, expiry (22 days to monthly), lot size.
   Account ₹20L. Max risk = premium paid (1% = ₹20,000). How many lots?
f) Calculate: If VIX rises from 13.8 to 16 during the SOS (IV expansion):
   Vega of chosen option = 42. Additional vega gain per unit = ?
g) At T1 (Nifty 25,000), with 10 days remaining: What % of max profit is realized?
   How would you manage the position at T1?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** What is the Put-Call Ratio (PCR)? How is it calculated (both OI and volume versions)? Why is it a CONTRARIAN indicator, not a trend-following indicator?

**Q2.** What does PCR > 1.5 signal (contrarian interpretation)? What does PCR < 0.7 signal? Give historical NSE examples of when these extremes occurred.

**Q3.** In the NSE Participant-wise Options OI data, what does "FII Net Short Calls + Net Long Puts simultaneously" indicate? What Wyckoff phase does this combination align with?

**Q4.** What does "FII Net Long Calls + Net Short Puts simultaneously" indicate at a price LOW? Why is this the most bullish FII options signal, and what Wyckoff phase does it correspond to?

**Q5.** Describe the Phase B options strategy. Why is selling straddles/strangles (not buying options) the correct strategy during Wyckoff accumulation ranges?

**Q6.** Why is the Spring/LPS zone the OPTIMAL time to buy calls? Describe the three simultaneous advantages (IV, Vega potential, Theta ratio) that make this timing superior to the SOS.

**Q7.** What is an OI Shift? Describe the Bullish OI Shift (put wall moving up) and the Bearish OI Shift (call wall moving down). What Wyckoff phase does each correspond to?

**Q8.** Describe the "retail adverse selection pattern" in options at distribution tops. Who is on each side of the call and put transactions, and why is retail structurally disadvantaged?

**Q9.** What is the bull call spread? Write the structure (buy low call + sell high call). Calculate the max gain, max loss, and risk:reward for a Nifty 24,500 CE buy at ₹145 and 25,000 CE sell at ₹38 (lot size 25).

**Q10.** Describe the complete 6-layer institutional scorecard. What is the total maximum score? What score range indicates a "Strong" conviction trade and what position sizing does it warrant?

### Chart Questions (5)

**S1.** NSE PCR data for 6 weeks:
Week 1: PCR = 1.72. Week 2: PCR = 1.48. Week 3: PCR = 1.22.
Week 4: PCR = 1.04. Week 5: PCR = 0.88. Week 6: PCR = 0.71.

a) What Wyckoff phase is Week 1?
b) Describe the PCR trend. What is it telling you about the accumulation cycle?
c) In Week 4 (PCR 1.04): What options strategy is optimal?
d) In Week 6 (PCR 0.71): What is the PCR warning about? What Wyckoff event may be approaching?
e) If you were holding a Phase B short strangle and PCR moved from 1.04 to 0.71: What action do you take and why?

**S2.** Participant-wise Options OI — two snapshots 3 weeks apart:

**Snapshot A (Nifty at 23,400 — post SC):**
FII: Call Long 1,82,400 / Call Short 88,200 / Put Long 68,400 / Put Short 1,44,200
Client: Call Long 88,200 / Call Short 1,82,400 / Put Long 1,18,400 / Put Short 48,400

**Snapshot B (Nifty at 25,200 — UTAD):**
FII: Call Long 1,44,200 / Call Short 2,42,400 / Put Long 1,84,200 / Put Short 82,400
Client: Call Long 2,84,200 / Call Short 88,400 / Put Long 68,400 / Put Short 1,82,400

a) In Snapshot A: Calculate FII net call and put positions. What is FII's posture?
b) In Snapshot A: Calculate Retail net call and put positions. What is Retail's posture?
c) Who is the informed trader in Snapshot A (at the SC zone)?
d) In Snapshot B: Calculate FII and Retail net. How has FII changed from A to B?
e) What Wyckoff event is Snapshot B signalling? What options trade is appropriate?

**S3.** Call and Put Wall migration data over 4 weeks:

Week 1 (Phase B): Call Wall at 24,800 CE (OI 1,82,400). Put Wall at 23,400 PE (OI 1,44,200).
Week 2 (Phase D SOS confirmed): Call Wall at 24,800 CE (OI declining: 1,68,400). Put Wall at 23,600 PE (OI rising: 1,58,400).
Week 3 (Markup): Call Wall at 25,200 CE (OI 1,88,400). Put Wall at 24,000 PE (OI 1,68,400).
Week 4 (Markup continuation): Call Wall at 25,500 CE (OI 2,04,400). Put Wall at 24,400 PE (OI 1,82,400).

a) Describe the wall migration pattern from Week 1 to Week 4.
b) In Week 2: Call wall OI declining AND put wall OI rising. What is each side of this signalling?
c) What is the "Strike Rollup" pattern? Do Weeks 3–4 show it? What does it mean?
d) In Week 4, if your call target was 25,500 (the call wall): Is the bull call spread still valid? Recalculate with new wall.
e) When would the wall migration REVERSE (downward shift)? What Wyckoff event causes this?

**S4.** Option premium snapshot at different phases (Nifty ATM call, 22 days to expiry):

Phase A (SC): Nifty 24,000. ATM call premium ₹320. IV = 28%.
Phase B (Day 10): Nifty 24,200. ATM call premium ₹145. IV = 14%.
Phase B (Day 22): Nifty 24,200. ATM call premium ₹98. IV = 13%.
Phase C (Spring): Nifty 23,980. ATM call premium ₹88. IV = 12%.
Phase D (SOS breakout): Nifty 24,900. ATM call premium ₹320. IV = 15%.

a) From SC to Phase B (Day 10): Why did premium fall from ₹320 to ₹145 despite Nifty rising?
b) From Phase B Day 10 to Day 22: Why did premium fall from ₹145 to ₹98 with Nifty flat?
c) From Phase B Day 22 to Spring: Why did premium fall further despite Nifty moving lower?
d) The BEST entry: Which phase has the lowest premium? What strategy benefits most?
e) SOS breakout: Premium recovered to ₹320 (same as SC, but now Nifty is 900 points higher). What drove the recovery?

**S5.** Build the complete options scorecard for this setup:

Nifty at 23,980 (confirmed Spring). VIX = 12.8 (3-month low). Expiry in 25 days.
→ Call Wall at 24,800 CE: OI = 1,88,400 (declining last 2 days: −24,200).
→ Put Wall at 23,400 PE: OI = 1,44,200 (rising: +18,400 today — defending).
→ PCR = 1.42 (moderately fearful — put protection being bought).
→ IV Skew: 23,000 PE = 16.8%. 25,000 CE = 13.4%. Skew = 3.4%.
→ Max Pain: 24,200 (above current Nifty = upward gravity).
→ VIX trend: Fell from 14.2 to 12.8 today while Nifty fell 0.3% (intraday).
→ Participant OI: FII net short puts (+48,400 new short put contracts added today).
→ Delivery % today: 18% (LPS confirmation — near-zero supply).

a) Score all 6 bullish options signals (max 9 points).
b) What does FII adding 48,400 short put contracts specifically confirm?
c) The call wall OI declining (−24,200): How many more sessions of decline before breakout becomes imminent?
d) Design the full options trade:
   - Strategy: Bull Call Spread
   - Buy Nifty 24,000 CE at ₹125. Sell Nifty 24,800 CE at ₹36.
   - Net cost: ₹89. Lot size 25. Account ₹20L.
   - Risk = premium paid. How many lots at 1% risk?
   - Max profit per lot at 24,800+ at expiry.
   - Risk:Reward.
e) Combine total scorecard (all 6 layers). State conviction level and position sizing.

---

## QUIZ ANSWERS

**A1.** PCR = Total Put Open Interest / Total Call Open Interest (OI-based). OR: Total Put Volume / Total Call Volume (volume-based). OI-based = reflects accumulated positioning (multi-day trend). Volume-based = reflects today's activity (short-term bias). Why contrarian: PCR measures the CROWD'S sentiment. At extremes, the crowd is usually wrong. High PCR (> 1.5) = Everyone is fearful and buying puts. When everyone has already bought puts: (a) They must SELL those puts eventually (natural buying pressure). (b) There are few new bears left to sell. (c) The fuel for a rally (short/put covering) is at maximum. So high PCR = contrarian bullish. Low PCR (< 0.7) = Everyone is complacent and buying calls. When everyone has already bought calls: (a) They must sell those calls eventually. (b) Few new bulls are left to buy. (c) The fuel for a decline (call unwinding + selling) is at maximum. So low PCR = contrarian bearish.

**A2.** PCR > 1.5: Extreme fear. Maximum put demand. Contrarian signal: BULLISH. Market has already priced in maximum fear. Historical NSE: COVID March 2020 (PCR exceeded 2.0) — coincided with Nifty bottom at 7,610. October 2022 correction (PCR ≈ 1.8) — coincided with Nifty bottom before the 2023 rally. PCR < 0.7: Extreme complacency/bullishness. Maximum call demand. Contrarian signal: BEARISH. Market has priced in maximum optimism. Historical NSE: January 2020 pre-COVID (PCR 0.68) — Nifty fell 38% in 6 weeks. October 2021 at Nifty peak (PCR 0.71) — preceded a 15% correction. The contrarian logic: Maximum sentiment = Maximum positioning = Minimum remaining fuel for that direction = Mean reversion.

**A3.** FII Net Short Calls + Net Long Puts simultaneously: A COLLAR position. FII holds long equity (cash market buys). They are WRITING CALLS against those longs (capping upside, collecting premium). Simultaneously BUYING PUTS (paying for downside protection on their equity holdings). This is textbook DISTRIBUTION posture: They are distributing their long equity to retail (selling spot/futures) while capping their upside with short calls (they expect price to stay below call strikes) and protecting their downside with long puts (they expect a fall). Wyckoff: UTAD zone or active distribution Phase D of distribution. When FII locks in this collar on their equity book: Phase E (markdown) is imminent. FII has already sold most of their equity (or is in the process) and the collar is end-stage risk management.

**A4.** FII Net Long Calls + Net Short Puts at a price LOW: BULLISH RISK REVERSAL. The most bullish FII options posture possible. Long calls: FII is betting the underlying rises above the call strike. They pay premium for this right. Short puts: FII AGREES TO BUY the underlying at the put strike if it falls there. They COLLECT premium for this obligation. Combined: They are paid to agree to buy more stock at lower levels (short put) while simultaneously paying for the right to benefit from an upside move (long call). This is what the CO (Composite Operator) does at the Spring/LPS in Wyckoff accumulation: (a) Short puts = "I agree to buy more at these levels" (collecting premium for agreeing to accumulate more if it falls). (b) Long calls = "I expect and profit from the upcoming Phase D SOS." This is the highest-conviction options signal in accumulation. When FII adopts this posture at a price low: The Spring or LPS is confirmed from the options layer.

**A5.** Phase B options strategy — short straddle/strangle: In Phase B, Nifty is rangebound between the put wall (support) and call wall (resistance). Price goes nowhere for weeks. Options BUYERS pay theta every day for a directional move that doesn't come. Their premium erodes. Options SELLERS collect that theta. Strangle (sell OTM call + sell OTM put at the walls): Profit if Nifty stays in the range. Time decay works for the seller. The range is structurally defined: Put sellers defend the put wall. Call sellers defend the call wall. As long as no SOS or breakdown: Premium decays to zero. Why NOT buying: Theta destroys 40–70% of premium during Phase B. Even if Nifty ends Phase B at the same price: Call buyers have lost most of their premium. The only correct Phase B strategy: SELL time. Collect theta. Accept the risk of a surprise SOS (which you manage with delta hedging and defined stops).

**A6.** Spring/LPS = Optimal call buying timing — 3 simultaneous advantages: (1) IV is at its LOWEST (VIX declining from Spring low, range normalising). Low IV = cheap premium = lower cost per unit of delta/vega. You are buying when options are cheapest. (2) Vega EXPANSION potential: If VIX is at 12–14 (minimum) at LPS, it has nowhere to go but up as the SOS develops. When SOS volatility arrives: VIX ticks higher. Your positive vega call benefits from both the directional move (delta gain) AND the IV expansion (vega gain). This double-benefit maximises your P&L per rupee of premium invested. (3) Theta ratio (time remaining vs move expected): At LPS with 20–30 days to expiry: Theta is moderate. The SOS is expected within 1–5 sessions. You have 20–30 days of time value for a move that arrives in 1–5 days. The theta cost of waiting is minimal relative to the delta/vega gain from the SOS. Compare: At SOS (now ATM or ITM), IV may be rising (more expensive), theta accelerates for the remaining period, and the optimal entry has passed.

**A7.** OI Shift: Large Open Interest migrating from one strike to another within the same session or across sessions. Bullish OI Shift (Put Wall moving up): Large PUT OI decreases at a LOWER strike and simultaneously increases at a HIGHER strike. This means put writers are ROLLING their positions upward — they are no longer worried about the market falling to the old strike. They now defend a higher level (more confident about the floor). Wyckoff: Phase D markup beginning. Institutions are "raising the floor" as accumulation completes. Bearish OI Shift (Call Wall moving down): Large CALL OI decreases at a HIGHER strike and increases at a LOWER strike. Call sellers (writers) rolling downward = They expect price to be contained at LOWER levels. The ceiling is being lowered toward the market. Wyckoff: Distribution beginning. Institutional call writers are positioning for a lower trading range. Strike rollup (both walls up simultaneously): Phase D markup in progress, entire range shifting higher = institutional consensus on higher prices. Strike rolldown (both walls down simultaneously): Phase E markdown in progress.

**A8.** Retail adverse selection in options at distribution tops: At price highs (UTAD zone): FII: NET SHORT CALLS (writing calls to retail buyers — receiving premium). FII: NET LONG PUTS (buying puts FROM retail sellers — paying premium). Retail: NET LONG CALLS (buying calls from FII — paying premium). Retail: NET SHORT PUTS (selling puts to FII — receiving premium from FII). Transaction flow: FII sells calls → Retail buys calls from FII (FII receives premium). Retail sells puts → FII buys puts from Retail (FII pays premium). Net result: (1) Retail PAID for calls that will likely expire worthless (distribution means price falls). (2) Retail COLLECTED premium for puts they sold — but FII exercises those puts against retail as price falls (retail forced to buy at high strike = massive loss). FII is fully HEDGED: Short calls cap their upside exposure. Long puts protect from the coming decline. Retail is UNHEDGED: Long calls lose money as price falls. Short puts cause maximum loss as price falls. The options market at a distribution top is the most perfect example of informed (FII) trading against uninformed (Retail) on NSE.

**A9.** Bull Call Spread: BUY lower-strike Call + SELL higher-strike Call (same underlying, same expiry). Structure: Buy Nifty 24,500 CE at ₹145 + Sell Nifty 25,000 CE at ₹38. Net cost: ₹145 − ₹38 = ₹107 per unit. Lot size 25. Max gain: Spread width (500) minus net premium (107) = ₹393 per unit × 25 = ₹9,825 per lot. Occurs when Nifty is at or above 25,000 at expiry. Max loss: Net premium paid = ₹107 per unit × 25 = ₹2,675 per lot. Occurs when Nifty is at or below 24,500 at expiry. Breakeven: 24,500 + 107 = 24,607 (Nifty must be above 24,607 for any profit at expiry). Risk:Reward = ₹2,675 : ₹9,825 = 1 : 3.67. Profit is CAPPED at 25,000 (the sold call). Beyond 25,000: Gains from lower call are offset by losses from upper call. Best use: When your Wyckoff target IS the upper strike (call wall), and you want defined risk with capital efficiency.

**A10.** Complete 6-layer scorecard: Layer 1 Wyckoff (6 pts). Layer 2 Delivery % (10 pts). Layer 3 FII/DII (9 pts). Layer 4 Block/Bulk Deals (12 pts). Layer 5 Order Flow + Futures (19 pts). Layer 6 Options (9 pts). Total maximum: 65 points. Position sizing: 55–65 = Very Rare (1.5× position). 42–54 = Strong (1× full position). 28–41 = Moderate (0.75× position). 14–27 = Weak (0.5× position). < 14 = No trade. "Strong" conviction (42–54 points): Full normal position size at 1% account risk. This means: All 6 layers showing bullish alignment. Multiple independent confirmations (Wyckoff structure, FII cash buying, FII options long calls/short puts, delivery confirming SOS/LPS, order flow showing near-zero delta on pullback, futures OI rising with price, options put wall holding, call wall weakening). This level of convergence is achievable on 5–8 days per month during an active accumulation cycle.

---

## KEY TAKEAWAYS

> **1. PCR is a CONTRARIAN indicator. PCR > 1.5 (extreme fear) = Bullish squeeze coming. PCR < 0.7 (extreme complacency) = Distribution coming. Historical NSE: PCR > 1.8 has coincided with major Nifty bottoms. PCR < 0.70 has preceded major corrections.**

> **2. FII Long Calls + Short Puts at price lows = Most bullish FII options signal. FII Short Calls + Long Puts at price highs = Distribution in progress. Retail is always on the opposite (wrong) side at these extremes. Trade with FII, not with retail.**

> **3. The Wyckoff-Options Strategy Map: SC = Sell puts (peak IV). Phase B = Short strangle between walls (collect theta). Spring/LPS = Buy calls (lowest IV, highest vega potential). SOS = Bull call spread (capture the move efficiently). Distribution = Buy puts (rising VIX vega benefit).**

> **4. The LPS is ALWAYS the better options entry than the SOS: Lower premium (cheaper), same expected target, lowest IV of the cycle (cheapest vega), and order flow precision (first positive delta bar = trigger). LPS call buying with 30+ days remaining = optimal Wyckoff options setup.**

> **5. The complete 6-layer institutional scorecard (Wyckoff + Delivery + FII/DII + Block/Bulk + Order Flow/Futures + Options) = maximum 65 points. 42+ points = full position conviction. This scorecard forces multi-evidence confirmation before capital deployment — eliminating single-signal, low-probability trades.**

---

*Options Positioning — Complete. Part XV is complete.*

*Next topic in the plan: **Essential Indicators** (Part XVI).*

*Ready? Say: **"NEXT CHAPTER"***
