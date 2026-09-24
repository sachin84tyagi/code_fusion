# Chapter 1 — How Financial Markets Actually Work

> **Course:** NSE/BSE Professional Volume + Price Action + VSA + Wyckoff + Market Microstructure
> **Part:** I — Market Foundations
> **Prerequisite:** None — this is the entry point for all participants.

---

## Evidence Standard

Throughout this chapter and the entire course, every statement is classified as:

| Label | Meaning |
|-------|---------|
| **FACT** | Directly supported by official data or documentation |
| **OBSERVATION** | Directly visible in market data |
| **INFERENCE** | A logical interpretation of an observation |
| **HYPOTHESIS** | A possible explanation requiring confirmation |
| **NOT PROVEN** | Insufficient evidence |
| **UNKNOWN** | The available data cannot answer the question |

> **Never convert an inference into a fact.** This is the most common error in market analysis.

---

## LEVEL 1 — BEGINNER

### 1.1 What is a Financial Exchange?

A financial exchange is an organised marketplace where buyers and sellers come together to trade financial instruments — in India's case, primarily equities (shares), futures, and options.

India has two primary stock exchanges:

**NSE — National Stock Exchange**
- Established: 1992
- Headquarters: Mumbai
- Primary index: Nifty 50 (50 largest companies by market cap)
- Technology: Electronic, screen-based trading since inception
- Market segment: Cash (equities), F&O (futures and options), Currency, Debt
- Daily turnover: Among the highest in the world for equity derivatives

**BSE — Bombay Stock Exchange**
- Established: 1875 (Asia's oldest stock exchange)
- Headquarters: Mumbai (Dalal Street)
- Primary index: Sensex (30 largest companies)
- Market segment: Cash, F&O, Currency, SME platform
- Historical significance: Transitional from open-outcry to electronic trading

**What the exchange does — precisely:**
1. Provides a regulated platform for order submission
2. Matches buy and sell orders using a defined algorithm (price-time priority)
3. Publishes trade information (price, volume) in real time
4. Enforces circuit limits, position limits, and trading rules
5. Ensures settlement through its clearing corporation

**What the exchange does NOT do:**
- The exchange does not take positions
- The exchange does not care whether price goes up or down
- The exchange does not create price — participants do

---

### 1.2 The Infrastructure Chain: SEBI → Exchange → Clearing → Depository → Broker → You

![NSE/BSE Market Ecosystem — Full Participant and Infrastructure Chain](/images/pi-market-ecosystem.jpg)

Understanding this chain is essential before reading any chart.

**SEBI (Securities and Exchange Board of India)**
- Regulatory authority for all Indian securities markets
- Sets rules for participants, brokers, exchanges, and listed companies
- Enforces disclosure requirements (FII/DII data, block deals, etc.)
- FACT: SEBI's data publications are a primary source — use them as such

**Exchange (NSE / BSE)**
- Receives orders from brokers
- Matches orders using the matching engine
- Publishes the resulting trade as a price and volume data point on your chart
- Every candle on your chart = output of the exchange's matching engine

**Clearing Corporation**
- NSE's clearing corporation: **NSCCL** (NSE Clearing Limited)
- BSE's clearing corporation: **ICCL** (Indian Clearing Corporation Ltd)
- Role: Guarantees that every trade settles, even if the counterparty defaults
- Settlement: Currently T+1 in India (trade settles the next business day)
- This guarantee is why counterparty risk is eliminated for normal participants

**Depository**
- **NSDL** (National Securities Depository Limited) — linked to NSE
- **CDSL** (Central Depository Services Limited) — linked to BSE
- Role: Maintain electronic records of who owns which shares
- Physical share certificates do not exist in modern Indian markets
- FACT: Shares are held in dematerialised (demat) form in NSDL/CDSL accounts

**Broker**
- A SEBI-registered intermediary that routes your orders to the exchange
- Examples: Zerodha, Angel One, ICICI Direct, HDFC Securities, Upstox
- Brokers do NOT control price — they only route your order
- A broker cannot fill your order from their own inventory in the equity cash segment under normal circumstances (unlike some other markets)

**Custodian**
- Institutional participants (mutual funds, FIIs, insurance companies) do not use retail brokers
- They use custodians (e.g., HDFC Custodial Services, Deutsche Bank) who handle settlement
- This is why institutional orders settle differently from retail

---

### 1.3 Who Are the Market Participants?

Every price bar on your chart is the net result of ALL participants' actions during that session. No single participant group owns a candle.

#### Retail Investors and Traders
- Individual participants — from small investors to active day traders
- Access: Through brokers, online platforms (Zerodha, Groww, etc.)
- Capital: Typically ₹1,000 to ₹50 lakh range per trade
- Behaviour: Highly varied — buy-and-hold investors, swing traders, day traders, option buyers
- INFERENCE (not fact): Collectively, retail tends to be reactive to news and price moves
- UNKNOWN: What any specific retail participant is doing cannot be determined from OHLCV

#### High Net Worth Individuals (HNIs) / Proprietary Traders
- HNIs: individuals with significant capital, often trading like institutions
- Proprietary desks: Trading firms using their own capital (not client capital) — Prop desks of banks, NBFCs, and standalone prop firms
- These participants can move individual mid-cap or small-cap stocks significantly
- OBSERVATION: Prop desk activity sometimes appears as block/bulk deals (verifiable)
- INFERENCE: Cannot be confirmed from OHLCV alone

#### Domestic Institutional Investors (DIIs)

**Mutual Funds (MFs)**
- SEBI-regulated collective investment vehicles
- AUM: India's MF industry manages ~₹50+ lakh crore (source: AMFI)
- FACT: AMFI publishes monthly category-wise deployment data
- Mandate-driven: A large-cap fund must invest in large-caps — this constrains their behaviour
- They typically buy/sell over multiple sessions to minimise market impact
- INFERENCE: A large MF rarely causes a single large price spike — they spread orders

**Insurance Companies**
- Life Insurance Corporation (LIC) is one of the largest equity holders in India
- FACT: Insurance companies' equity exposure is regulated by IRDAI
- Long-term oriented — often act as "patient capital"
- SEBI mandates periodic disclosure of their equity holdings

**Pension Funds / EPFO**
- Employees' Provident Fund Organisation (EPFO) invests a portion in equities via ETFs
- FACT: EPFO's equity investment is restricted to ETFs tracking Nifty/Sensex
- This creates predictable, systematic flows

#### Foreign Institutional Investors / Foreign Portfolio Investors (FII/FPI)
- FII is the older term. FPI is the current regulatory classification under SEBI FPI Regulations 2019
- Categories: Cat I (governments, sovereign wealth funds, multilaterals), Cat II (regulated funds, investment managers), Cat III (others)
- Access: Through registered custodians
- FACT: SEBI and exchanges publish FPI aggregate buy/sell data daily
- CRITICAL RULE: Aggregate FPI net buy/sell data does not tell you which stock they bought, in what quantity, or what their intent was

**Common misconception:**
> "FIIs are selling today — markets will fall."

**Why this is INFERENCE at best, NOT FACT:**
- FPI net sell includes all FPIs — some may be buying while others sell
- Net sell in cash does not mean net sell in derivatives (they may be buying futures while selling cash)
- Net sell may be profit-booking, currency hedging, or redemption-driven — not a bearish view on Indian equities
- Time of disclosure may lag — the data reflects yesterday's activity

#### Algorithmic and High-Frequency Traders (HFT)
- Algorithm-driven execution — orders placed by software, not humans
- SEBI has regulations for algo trading (algo approval from exchange required for co-location)
- HFT: A subset of algo trading characterised by extremely high order submission and cancellation rates, very short holding periods (milliseconds to seconds)
- FACT: NSE operates a co-location facility where HFT firms place servers physically close to the exchange matching engine
- INFERENCE: HFT activity likely contributes to the bid-ask spread tightening in liquid stocks
- UNKNOWN: The precise contribution of HFT to any specific price move is not determinable from OHLCV

**What HFT typically does (INFERENCE from academic research):**
- Market making — providing liquidity at both bid and ask
- Statistical arbitrage between related instruments (Nifty futures vs cash basket)
- Latency arbitrage — profiting from speed advantage

**What HFT does NOT do (important misconception):**
- HFT does not "manipulate" price in a sustainable direction — academic consensus suggests HFT generally improves liquidity
- HFT's holding period is too short to create multi-day trends

---

## LEVEL 2 — INTERMEDIATE

### 1.4 What Each Participant CAN and CANNOT Be Inferred to Do

This is the most important intellectual discipline of the entire course.

Every time you look at a chart and say "institutions are buying," you are making an inference. Let's examine what evidence actually supports different conclusions.

**The Evidence Hierarchy Applied to Participant Analysis:**

#### Mutual Funds

| Claim | Classification | Basis |
|-------|---------------|-------|
| MF bought XYZ stock | FACT | If disclosed in monthly portfolio (AMFI data, with 15-day lag) |
| MF is buying on this session | INFERENCE | Cannot verify from OHLCV; requires AMFI data (lagged) |
| High volume means MF buying | NOT PROVEN | High volume means high activity — participant identity unknown |
| MF is accumulating over weeks | HYPOTHESIS | Needs confirmation from AMFI portfolio disclosure |

#### FII / FPI

| Claim | Classification | Basis |
|-------|---------------|-------|
| FPI net bought ₹X crore yesterday (cash) | FACT | NSE/BSE daily FPI data |
| FPI bought this specific stock | NOT PROVEN | Aggregate data only — stock-level data in quarterly disclosures, with lag |
| FPI selling is why Nifty fell today | INFERENCE | Correlation, not causation proven |
| FPI buying is accumulation | HYPOTHESIS | Requires price/volume/delivery/OI confirmation |

#### Retail Participants

| Claim | Classification | Basis |
|-------|---------------|-------|
| Most retail traders lose money | INFERENCE | Supported by SEBI study data (SEBI published F&O study in 2023) |
| Retail is buying this rally | UNKNOWN | Cannot separate retail from other participants in OHLCV |
| Retail panic causes selling | HYPOTHESIS | Requires order-flow data to confirm |

#### Algo / HFT

| Claim | Classification | Basis |
|-------|---------------|-------|
| HFT is active in this stock | INFERENCE | Suggested by high order-cancellation ratio, thin spread (not from OHLCV alone) |
| This price spike is HFT | HYPOTHESIS | Possible but not provable from daily/hourly OHLCV |
| HFT manipulated the close | NOT PROVEN | Requires exchange order-level data |

---

### 1.5 Why Participant Identity Is Rarely Provable From OHLCV Alone

![What OHLCV Can and Cannot Tell You — The Fundamental Limitation of Chart Data](/images/pi-ohlcv-limitation.jpg)

This diagram represents the most important intellectual boundary in technical analysis.

**The core problem:**

Every trade on NSE involves two anonymous counterparties matched by the exchange matching engine. Your charting software receives only the **output** of this matching process: price, volume, open, high, low, close.

Consider this scenario:

```
Session data: Nifty up 1.2%, Volume 3x average, Close on highs.

Who caused this?
Possibility A: Large FPI buying (accumulation)
Possibility B: Short covering by domestic prop desks
Possibility C: Multiple small retail buyers creating momentum
Possibility D: Index rebalancing mechanical flows
Possibility E: ETF creation by an AMC
Possibility F: Combination of all of the above
```

**OHLCV cannot distinguish between these possibilities.**

This is not a failure of the analyst. This is a fundamental property of the data.

**The correct professional approach:**

```
Step 1: OBSERVE — what does OHLCV actually show?
         (Price up 1.2%, 3x volume, close on highs)

Step 2: INFERENCE — what can be logically inferred?
         (Strong net demand; buyers were willing to pay up;
          high volume confirms significant participation)

Step 3: HYPOTHESIS — what might explain this?
         (Possible accumulation; possible short covering;
          possible event-driven buying)

Step 4: ADDITIONAL EVIDENCE — what data can narrow the hypothesis?
         (FII/DII data for the day; delivery % if available;
          futures OI change; options PCR; block/bulk deals)

Step 5: CONCLUSION — evidence-weighted, uncertainty acknowledged
         "This session shows unusually high participation with
          strong demand. FPI data shows net buying of ₹X crore.
          Delivery % is elevated. Futures OI increased.
          This is consistent with accumulation-type behaviour
          from multiple participant types. However, the
          specific participant identity and intent cannot
          be established from available data."
```

**The wrong approach (and why it fails):**

```
❌ "3x volume + price up = FIIs buying. Buy signal."

Problems:
1. FII identity not confirmed from OHLCV
2. Even if FII bought, it may be currency hedging or rebalancing
3. Even genuine accumulation may have 10-20 more sessions before breakout
4. Confirmation bias — you're fitting a narrative to a data point
```

---

### How the Settlement Chain Affects Your Chart Data

Understanding settlement is critical for interpreting **delivery percentage** data (covered in Chapter 19).

**T+1 Settlement in India (FACT):**
- Trade on Monday → Shares delivered Tuesday
- This means high delivery % on a session confirms "committed" buying (participants who took delivery, not just intraday)

**Why this matters for analysis:**
- Intraday trades are squared off by end of session — they don't result in delivery
- Delivery %= (Delivery quantity / Total traded quantity) × 100
- High delivery % on a breakout = more participants are holding overnight = stronger signal
- Low delivery % = mostly intraday activity = less committed capital

**Evidence classification:**
- High delivery % on a up-move = OBSERVATION
- "Strong hands buying and holding" = INFERENCE (not FACT)
- This is still a useful inference — it is directionally meaningful, even if participant identity remains unknown

---

## LEVEL 3 — ADVANCED / PROFESSIONAL

### The Microstructure Perspective on Market Participants

*Full microstructure detail is covered in Chapter 22. This section provides the conceptual foundation.*

From a market microstructure perspective, participants are classified not by their institution type, but by their **order behaviour:**

**Liquidity Providers:**
- Place limit orders — they define the bid and ask prices
- They get filled passively when someone hits their order
- They earn the spread
- Risk: Adverse selection — they may be selling to someone with superior information
- On NSE: Market makers (formally designated in some segments) + anyone placing a resting limit order

**Liquidity Takers:**
- Place market orders or aggressive limit orders
- They pay the spread
- They get immediate execution
- Risk: Slippage — price may move against them
- On NSE: Anyone placing a market order or sweeping the book

**This distinction matters for VSA (Volume Spread Analysis):**
> When you see a wide-spread up bar on high volume, someone was aggressively TAKING liquidity upward. But the counterparty was aggressively PROVIDING liquidity by selling into that move. Which participant was right? The subsequent price action answers that — not the current bar alone.

---

### Information Asymmetry in Indian Markets

Some participants have structural informational advantages:

**Exchange-level visibility:**
- Exchange employees can see aggregate order flow data (all orders, not just executed trades)
- This information is tightly regulated

**Broker-level visibility:**
- Large brokers can observe aggregate order trends from their client base
- This is regulated — front-running based on client orders is illegal (SEBI regulations)

**Institutional research:**
- Large buy-side institutions have dedicated research teams, management access, and proprietary data
- FACT: SEBI's UPSI (Unpublished Price Sensitive Information) regulations prohibit trading on non-public material information

**Practical implication for chart analysis:**
- Some price moves occur because a participant with superior information is acting before you
- Volume and price action are the footprints these participants leave
- You cannot identify them from OHLCV, but you can observe the footprint they create
- This is the core premise of VSA and Wyckoff

**The honest statement of what chart analysis provides:**

> "We can observe the collective output of all participant actions through price and volume. We can make informed inferences about the balance of supply and demand. We cannot reliably identify specific participants, their intent, or guarantee future price direction from this data alone."

This is not a limitation to be embarrassed about. It is intellectual honesty that separates professional analysts from retail punters.

---

## EXERCISES

### Beginner Exercises

**Exercise 1.1 — Infrastructure Chain**
Draw (on paper or mentally map) the complete chain from your Zerodha account to the NSE matching engine and back. Name every entity in the chain and their role.

**Exercise 1.2 — Participant Classification**
Classify each of the following as: Retail / DII / FII / Algo / Prop Trader:
- a) LIC buying Reliance shares for their equity portfolio
- b) A Bengaluru software engineer buying 10 shares of Infosys through Zerodha
- c) A Singapore-based hedge fund buying Nifty futures through their custodian
- d) A proprietary desk at a large bank doing statistical arbitrage between Nifty spot and futures
- e) An algorithm that places and cancels 10,000 orders per second in Nifty options

**Exercise 1.3 — Evidence Classification**
Classify each statement as FACT / OBSERVATION / INFERENCE / HYPOTHESIS / NOT PROVEN / UNKNOWN:
- a) "Nifty closed up 1.5% today on 2x average volume."
- b) "FIIs bought ₹3,200 crore in equities today." (assume NSE data published)
- c) "This rally is FII-driven accumulation."
- d) "The high volume on this down day means institutions are selling."
- e) "Tomorrow, price will go higher because institutions were buying today."

---

### Intermediate Exercises

**Exercise 1.4 — The Anonymity Problem**
A Nifty 50 stock shows this data for a session:
- Volume: 3.8x the 20-day average
- Price: +2.3% on the day
- Close: Near the top of the session range
- Delivery: 68% (significantly above its average of 35%)

*List five different participant-type combinations that could have produced this exact OHLCV data. For each, explain what additional data would support or reject that hypothesis.*

**Exercise 1.5 — Settlement and Delivery**
If a stock's average delivery percentage is 28% and on a particular breakout session delivery jumped to 74%:
- What does this OBSERVATION tell you?
- What INFERENCE can you draw?
- What would INVALIDATE your inference?
- What additional data would CONFIRM it?

---

### Advanced Exercises

**Exercise 1.6 — Structural Advantages**
A stock gaps up 4% at open with 5x normal volume in the first 15 minutes. Consider:
- What types of participants typically transact in the opening minutes?
- What information might they have that explains the gap?
- Is the gap more likely explained by pre-market information arrival or by random coincidence? Classify your answer.
- What does the rest of the day's price action tell you about whether the initial move was "correct"?

**Exercise 1.7 — FII Data Interpretation**
SEBI publishes FPI data showing:
- Cash equities: Net SELL ₹4,500 crore
- F&O (Index futures): Net BUY equivalent of ₹6,200 crore (long positions)
- F&O (Options): Net PUT writers (short puts)

*Analysis required:*
1. What does this combination suggest about FPI's directional view?
2. Why would FPI sell cash equities while buying index futures?
3. Is the popular headline "FIIs are bearish — they sold ₹4,500 crore" correct? Why or why not?
4. What additional data would you need to assess whether this is a hedged position or a directional bet?

---

## CHAPTER QUIZ

### Conceptual Questions (10)

**Q1.** What is the primary function of the NSE matching engine?

**Q2.** Why does every executed trade have both a buyer and a seller? What does this mean for interpreting volume?

**Q3.** Name the two Indian depositories and explain what they hold.

**Q4.** What is the difference between NSCCL and a broker? What function does each serve?

**Q5.** Under India's T+1 settlement, if you buy a stock on Wednesday, on which day do shares appear in your demat account?

**Q6.** An analyst says: "High volume today confirms FII buying." Using the evidence hierarchy from this chapter, classify this statement and explain why.

**Q7.** What is the difference between a liquidity provider and a liquidity taker? Give one example of each from the NSE context.

**Q8.** Why does HFT typically NOT create multi-day directional trends? What is the characteristic holding period of HFT?

**Q9.** EPFO invests in equities through which specific instrument? Why does this matter for understanding price flows in Nifty constituent stocks?

**Q10.** What is the "anonymity problem" in exchange-based trading, and why does it fundamentally limit participant identification from OHLCV?

---

### Chart Scenario Questions (5)

**S1.** A Nifty 50 stock shows a session with volume equal to 4.2x its 20-day average, price closes up 3.1%, and delivery is 72% vs average of 31%. Write one OBSERVATION, one INFERENCE, one HYPOTHESIS, and one thing that is UNKNOWN.

**S2.** During a steep 8-session downtrend in a mid-cap stock, volume is declining steadily on each down day. On day 9, a wide-spread down bar appears with volume 6x average, but the close is in the upper 30% of the bar's range. Using only the evidence available, classify what this might represent and what you would need to confirm or reject your interpretation.

**S3.** NSE publishes FPI data: Net cash equity SELL of ₹8,200 crore on a day when Nifty falls 1.4%. The mainstream media headline reads: "FIIs dump Indian stocks." Using the evidence hierarchy, evaluate this headline. What are the missing data points?

**S4.** A broker's research note states: "The 3x volume surge in HDFC Bank confirms institutional accumulation — strong buy." Identify every claim in this sentence and classify each as FACT, INFERENCE, HYPOTHESIS, or NOT PROVEN.

**S5.** You observe that a large-cap stock has been trading at 2x average volume for 15 consecutive sessions in a sideways range, with delivery consistently above 60%. List all possible participant-type hypotheses that could explain this behaviour. Which can you eliminate using publicly available data? Which remain as hypotheses?

---

### Scenario Questions (5)

**Sc1.** You are building a market analysis framework. Someone suggests: "We don't need to identify participants — we just need to read supply and demand from the chart." Evaluate this statement. When is it sufficient? When is it insufficient?

**Sc2.** A retail trader insists: "When volume spikes, it means the big players are active." Construct both the case for this statement being useful and the case for it being misleading. Under what conditions would each apply?

**Sc3.** SEBI publishes a study showing that 89% of individual F&O traders lose money over a 3-year period. How does this data point affect how you should model "retail trader behaviour" in your analysis?

**Sc4.** An algo trading firm operating on NSE's co-location facility places 50,000 orders and cancels 49,800 of them in a single session. Only 200 trades execute. What OHLCV footprint, if any, would this activity leave? What would it NOT leave?

**Sc5.** A mutual fund managing a ₹15,000 crore large-cap fund needs to buy 2% more exposure in a single large-cap stock worth ₹5 lakh crore market cap. Estimate the approximate daily volume impact. How would they likely execute this order? What would — or would not — appear on a standard daily OHLCV chart?

---

## QUIZ ANSWERS

### Conceptual Answers

**A1.** The matching engine receives all buy and sell orders and matches them using price-time priority — the highest bid is matched with the lowest ask; ties are broken by order time (first come, first served).

**A2.** Every trade requires both a willing buyer and a willing seller. The exchange only executes a trade when both sides exist and agree on price. Therefore, high volume means many trades occurred — it does NOT tell you whether the "buyer" or "seller" was dominant. The volume belongs to both participants simultaneously.

**A3.** NSDL (National Securities Depository Limited) and CDSL (Central Depository Services Limited). They hold electronic records of share ownership — dematerialised shareholding records.

**A4.** NSCCL (NSE Clearing Limited) is the clearing corporation — it guarantees settlement of trades between anonymous counterparties, eliminating counterparty default risk. A broker is an intermediary that routes client orders to the exchange. The broker does not guarantee settlement.

**A5.** Thursday (T+1 means next business day, excluding trading holidays).

**A6.** INFERENCE at best, NOT PROVEN as stated. OBSERVATION: High volume occurred. INFERENCE: Significant participation took place. The specific claim that "FII was buying" is an inference not supported by OHLCV alone — it requires FPI aggregate data (and even that only confirms aggregate category net flows, not stock-level or intent).

**A7.** Liquidity provider: places resting limit orders — e.g., a market maker placing a limit buy at ₹500 and a limit sell at ₹500.50. Liquidity taker: places market orders or aggressive limit orders that execute immediately — e.g., a retail investor who clicks "Market Buy" and gets filled at the best available ask.

**A8.** HFT holding periods are milliseconds to seconds. They do not hold positions overnight. Therefore, they cannot sustain a directional move beyond the very short-term — they are position-neutral at end of session.

**A9.** EPFO invests through ETFs tracking the Nifty 50 and Sensex. This creates systematic, regular buying of Nifty 50 constituent stocks (proportional to their index weight) — a predictable, passive flow that is not directionally motivated. This is important context when a Nifty stock shows volume patterns that may simply reflect ETF rebalancing.

**A10.** The anonymity problem: NSE's matching engine matches anonymous counterparties. Neither the buyer nor the seller knows who their counterparty is. The OHLCV data published is only the aggregated output of all matched trades — it contains no participant identity information. Therefore, participant identification from OHLCV is structurally impossible without additional data sources.

---

### Scenario Answer Guidance

**S1 Model Answer:**
- OBSERVATION: Volume 4.2x average; price +3.1%; delivery 72% vs average 31%.
- INFERENCE: Significant net demand was present; participants who transacted were willing to hold overnight (high delivery suggests committed capital, not intraday).
- HYPOTHESIS: Institutional-type accumulation — possibly MF or FPI buying a position.
- UNKNOWN: The identity of the participants; whether this is a one-day event or part of a larger campaign; whether FPI cash data confirms FPI involvement.

**S3 Model Answer:** The headline is misleading. FPI sold cash equities (FACT, if data source is NSE). But "dump" implies negative intent and panic, which is NOT PROVEN. Furthermore: Were they simultaneously buying index futures? (Possible hedge.) Was the selling redemption-driven? Currency hedging? Missing data: FPI futures data; delivery data; which stocks were sold; whether any single stock dominated the flow. The headline converts an OBSERVATION (net cash sell) into a negative INFERENCE (bearish/dumping) without evidence for the inference.

---

## KEY TAKEAWAYS — CHAPTER 1

> **1. Every candle on your chart is the aggregated output of ALL participants' actions in that session. No single participant "owns" a candle.**

> **2. OHLCV tells you what happened (price and volume). It cannot tell you who did it or why.**

> **3. Every executed trade has BOTH a buyer and a seller. High volume means high activity — not a directional statement about which side was "right."**

> **4. Participant identity requires additional data: FII/DII reports, delivery data, block/bulk deals, AMFI disclosures, OI data. And even then — intent cannot be established.**

> **5. The correct professional stance: "I observe X. I infer Y. I hypothesise Z. Confirmation requires [specific evidence]. I acknowledge [alternative explanation]."**

> **6. FPI net cash selling does not automatically mean bearish. Context, hedging, currency flows, and derivatives positioning must all be examined.**

---

*Chapter 1 Complete.*

---

**Next:** [Chapter 2 — Price Formation →](./price-formation.md)

*When ready, say: **"NEXT CHAPTER"***
