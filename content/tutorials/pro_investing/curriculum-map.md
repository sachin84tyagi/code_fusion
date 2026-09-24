# NSE/BSE Professional Trading Course
## Master Curriculum Map — Phase 1

> **Evidence Standard enforced throughout:** FACT → OBSERVATION → INFERENCE → HYPOTHESIS → NOT PROVEN → UNKNOWN.
> Never convert an inference into a fact.

---

## COURSE OVERVIEW

| Attribute | Value |
|-----------|-------|
| **Total Parts** | 20 |
| **Total Chapters** | 30 |
| **Primary Market** | NSE / BSE |
| **Instruments Covered** | Equity (Cash), Futures (Index + Stock), Options (Index + Stock) |
| **Depth Levels** | Beginner → Intermediate → Advanced / Professional |
| **Practical Laboratory** | Yes — 23 case types, 4 difficulty tiers |
| **Assessment System** | Chapter quizzes + 4 mastery tests + Final Capstone |
| **Language** | English (technical) — Indian market examples throughout |

---

## COMPLETE MASTER CURRICULUM MAP

---

### PART I — MARKET FOUNDATIONS
*Prerequisite: None. Starting point for all participants.*

---

#### Chapter 1 — How Financial Markets Actually Work
**Level:** Beginner → Intermediate

**Subchapters:**
- 1.1 — What is a Financial Exchange? (NSE / BSE)
- 1.2 — Broker → Clearing Corporation → Depository chain
- 1.3 — Participant Types
  - Retail investors
  - Institutional investors (Domestic — MF, Insurance, Pension)
  - Foreign investors (FII / FPI)
  - Proprietary traders
  - Algorithmic / HFT traders
  - Market makers (where applicable on NSE/BSE)
- 1.4 — What each participant CAN and CANNOT be inferred to do from chart data
- 1.5 — Why the identity of a participant is rarely provable from OHLCV alone

**Dependencies:** None
**Lab:** None at this stage
**Assessment:** 10 conceptual + 5 scenario questions

---

#### Chapter 2 — Price Formation
**Level:** Beginner → Intermediate → Advanced

**Subchapters:**
- 2.1 — What is Price Discovery?
- 2.2 — Supply and Demand at the order level
- 2.3 — Bid / Ask / Spread explained
- 2.4 — Order matching — how the NSE matching engine works
- 2.5 — Price-time priority
- 2.6 — Every trade has BOTH a buyer and a seller (critical rule)
- 2.7 — Market impact — what happens when large orders execute
- 2.8 — Why price moves: the auction process

**Dependencies:** Chapter 1
**Lab:** Numerical exercises on bid/ask/spread
**Assessment:** 10 conceptual + 5 numerical + 5 scenario

---

### PART II — ORDER TYPES & MARKET MICROSTRUCTURE
*Prerequisite: Part I*

---

#### Chapter 3 — Order Types
**Level:** Beginner → Intermediate → Advanced

**Subchapters:**
- 3.1 — Market Order — mechanics, slippage, when to use
- 3.2 — Limit Order — mechanics, queue position, partial fills
- 3.3 — Stop-Loss Order (SL) — trigger price, market SL
- 3.4 — Stop-Loss Market (SL-M) — difference from SL
- 3.5 — IOC (Immediate or Cancel)
- 3.6 — GTT / GTC (where applicable on NSE)
- 3.7 — Order modification and cancellation
- 3.8 — Practical: Slippage calculation for each order type
- 3.9 — Which order type to use in which market condition

**Dependencies:** Chapter 2
**Lab:** Slippage scenarios, order type selection exercises
**Assessment:** 10 conceptual + 5 numerical + 5 chart scenarios

---

#### Chapter 4 — Order Book (Market Depth)
**Level:** Intermediate → Advanced → Professional

**Subchapters:**
- 4.1 — What the order book contains
- 4.2 — Level 1 data (best bid / ask)
- 4.3 — Level 2 / Market Depth data (NSE's 5/20 level depth)
- 4.4 — Bid size, Ask size, cumulative depth
- 4.5 — Price-time queue — who gets filled first
- 4.6 — Order matching mechanics
- 4.7 — Order cancellation and replenishment
- 4.8 — Displayed liquidity vs hidden liquidity (iceberg concept)
- 4.9 — Liquidity withdrawal — what it looks like
- 4.10 — What ordinary retail chart data (OHLCV) can and CANNOT reveal about the order book

**Dependencies:** Chapters 2, 3
**Lab:** Order book reading exercises (conceptual)
**Assessment:** 10 conceptual + 5 scenario

---

#### Chapter 5 — Liquidity & Market Impact
**Level:** Intermediate → Advanced → Professional

**Subchapters:**
- 5.1 — Liquidity defined precisely
- 5.2 — Deep liquidity vs thin liquidity — examples from NSE large-cap vs small-cap
- 5.3 — Bid-ask spread as liquidity proxy
- 5.4 — Slippage — calculation and real cost
- 5.5 — Market impact — how large orders move price
- 5.6 — Liquidity gaps in price
- 5.7 — Liquidity pools and stop clusters
- 5.8 — Liquidity sweeps — what they look like on a chart
- 5.9 — Absorption — absorbing supply at support or demand at resistance
- 5.10 — Failed auctions — when price cannot hold a new level

**Dependencies:** Chapters 3, 4
**Lab:** Liquidity sweep identification; failed auction identification
**Assessment:** 10 conceptual + 5 chart + 5 scenario

---

### PART III — PRICE ACTION
*Prerequisite: Part I (Parts II and IV are parallel prerequisites for advanced interpretation)*

---

#### Chapter 6 — Candlestick Mechanics
**Level:** Beginner → Intermediate → Advanced

**Subchapters:**
- 6.1 — Open, High, Low, Close defined precisely
- 6.2 — Body, wick/shadow, range, spread
- 6.3 — Close location and its meaning (top / middle / bottom of bar)
- 6.4 — Single-bar patterns:
  - Doji (types)
  - Pin bar / Hammer / Shooting star
  - Wide-range candle
  - Narrow-range candle
  - Inside bar
  - Outside bar
  - Engulfing
  - Expansion candle
  - Compression candle
- 6.5 — **Critical rule:** A candle pattern has no fixed meaning without context
- 6.6 — What context means (background, trend, volume, location)

**Dependencies:** Chapter 2
**Lab:** Identify candle types on real NSE charts (without interpreting yet)
**Assessment:** 10 conceptual + 5 chart identification

---

#### Chapter 7 — Market Structure
**Level:** Beginner → Intermediate → Advanced

**Subchapters:**
- 7.1 — Higher High / Higher Low / Lower High / Lower Low
- 7.2 — Trend definition (uptrend / downtrend)
- 7.3 — Range / Consolidation
- 7.4 — Market regime identification
- 7.5 — Support and Resistance — definition, formation, decay
- 7.6 — Supply and Demand zones
- 7.7 — Swing points — identifying significant highs and lows
- 7.8 — Breakout mechanics
- 7.9 — Breakdown mechanics
- 7.10 — Retest — what a valid retest looks like
- 7.11 — Failed breakout — identification and implication
- 7.12 — Failed breakdown — identification and implication
- 7.13 — Market structure shift — when the regime changes

**Dependencies:** Chapter 6
**Lab:** Market structure mapping on 5 random NSE daily charts
**Assessment:** 10 conceptual + 5 chart + 5 scenario

---

### PART IV — VOLUME
*Prerequisite: Parts I, III*

---

#### Chapter 8 — Understanding Volume
**Level:** Beginner → Intermediate → Advanced → Professional

**Subchapters:**
- 8.1 — What volume actually measures (traded quantity / shares)
- 8.2 — Volume vs Turnover vs Value — differences
- 8.3 — Relative Volume (RelVol) — definition and calculation
- 8.4 — Average volume (20-day, 50-day)
- 8.5 — Volume expansion and contraction
- 8.6 — Volume spike — what constitutes a spike vs noise
- 8.7 — Climactic volume — how to identify
- 8.8 — Volume acceleration / deceleration
- 8.9 — Volume anomaly — statistical detection
- 8.10 — Calculations:
  - RelVol = Current Volume / Average Volume
  - Volume Ratio
  - Volume Percentile
  - Volume Z-score

**Dependencies:** Chapters 2, 7
**Lab:** Calculate RelVol, Z-score for 10 NSE sessions
**Assessment:** 10 conceptual + 5 numerical + 5 chart

---

#### Chapter 9 — Price + Volume Relationship
**Level:** Intermediate → Advanced → Professional

**Subchapters:**
- 9.1 — The complete Price × Volume matrix (6 primary combinations)
- 9.2 — Rising price + Rising volume
- 9.3 — Rising price + Falling volume
- 9.4 — Falling price + Rising volume
- 9.5 — Falling price + Falling volume
- 9.6 — Small price movement + Huge volume (absorption / conflict)
- 9.7 — Huge price movement + Huge volume (expansion / climax)
- Each row: Valid interpretation + Alternative interpretation + False positive + Confirmation required
- 9.8 — Divergence between price and volume
- 9.9 — When the Price × Volume rule fails

**Dependencies:** Chapters 7, 8
**Lab:** Classify 20 bars from real NSE charts using the P×V matrix
**Assessment:** 10 conceptual + 5 chart + 5 scenario

---

### PART V — VSA (VOLUME SPREAD ANALYSIS)
*Prerequisite: Parts I, III, IV*

---

#### Chapter 10 — VSA Foundations
**Level:** Beginner → Intermediate → Advanced

**Subchapters:**
- 10.1 — What VSA is and is not
- 10.2 — The five elements: Spread, Volume, Close Location, Context, Background
- 10.3 — Effort vs Result — core principle
- 10.4 — Background reading — the preceding 20-50 bars
- 10.5 — Context — what surrounds the signal bar
- 10.6 — Why VSA is INFERENCE, not FACT
- 10.7 — Common VSA misconceptions

**Dependencies:** Chapters 6, 7, 8, 9
**Lab:** Background reading exercise on 3 NSE daily charts
**Assessment:** 10 conceptual + 5 chart + 5 scenario

---

#### Chapter 11 — VSA Patterns
**Level:** Intermediate → Advanced → Professional

**Subchapters (one section per pattern):**
- 11.1 — No Demand
- 11.2 — No Supply
- 11.3 — Stopping Volume
- 11.4 — Selling Climax
- 11.5 — Buying Climax
- 11.6 — Upthrust
- 11.7 — Reverse Upthrust (bullish)
- 11.8 — Shakeout
- 11.9 — Test
- 11.10 — Successful Test
- 11.11 — Failed Test
- 11.12 — Spring
- 11.13 — Sign of Strength (SOS)
- 11.14 — Sign of Weakness (SOW)
- 11.15 — Absorption
- 11.16 — Exhaustion
- 11.17 — Climactic Action

**For every pattern:**
> Definition → Why it happens → Market mechanism → Price action → Volume → Context → Confirmation → Failure → False positive → Practice case

**Dependencies:** Chapter 10
**Lab:** Identify 3 instances of each pattern on NSE daily/weekly charts
**Assessment:** 10 conceptual + 5 chart + 5 scenario per pattern group

---

### PART VI — WYCKOFF
*Prerequisite: Part V*

---

#### Chapter 12 — Wyckoff Principles
**Level:** Beginner → Intermediate → Advanced

**Subchapters:**
- 12.1 — The Composite Operator — concept, scope, and its limitations as an explanatory model
- 12.2 — Law of Supply and Demand
- 12.3 — Law of Cause and Effect
- 12.4 — Law of Effort and Result
- 12.5 — How Wyckoff and VSA connect
- 12.6 — What Wyckoff can and cannot prove about participant identity

**Dependencies:** Chapter 11
**Lab:** Match VSA patterns to Wyckoff events
**Assessment:** 10 conceptual + 5 scenario

---

#### Chapter 13 — Accumulation Schematic
**Level:** Intermediate → Advanced → Professional

**Subchapters:**
- 13.1 — Overview of Wyckoff Accumulation
- 13.2 — Phase A: Stopping the downtrend
  - PS (Preliminary Support)
  - SC (Selling Climax)
  - AR (Automatic Rally)
  - ST (Secondary Test)
- 13.3 — Phase B: Building the cause
  - ST in Phase B
  - Repeated tests
  - Volume analysis in Phase B
- 13.4 — Phase C: The Spring
  - Spring types (Type 1, 2, 3)
  - Test of the Spring
- 13.5 — Phase D: Demand overcoming supply
  - SOS (Sign of Strength)
  - LPS (Last Point of Support)
- 13.6 — Phase E: Markup
- 13.7 — Re-accumulation — identifying it within a markup
- 13.8 — NSE/BSE real examples (descriptive — no fabricated data)
- 13.9 — Failure conditions — when the accumulation fails

**Dependencies:** Chapters 11, 12
**Lab:** 5 full Wyckoff Accumulation case studies
**Assessment:** 10 conceptual + 5 chart + 5 scenario

---

#### Chapter 14 — Distribution Schematic
**Level:** Intermediate → Advanced → Professional

**Subchapters:**
- 14.1 — Overview of Wyckoff Distribution
- 14.2 — Phase A: Stopping the uptrend
  - PSY (Preliminary Supply)
  - BC (Buying Climax)
  - AR (Automatic Reaction)
  - ST (Secondary Test)
- 14.3 — Phase B: Building the cause
  - UT (Upthrust)
  - Volume analysis in Phase B
- 14.4 — Phase C: UTAD (Upthrust After Distribution)
- 14.5 — Phase D: Supply dominating
  - SOW (Sign of Weakness)
  - LPSY (Last Point of Supply)
- 14.6 — Phase E: Markdown
- 14.7 — Redistribution — identifying it within a markdown
- 14.8 — Failure conditions

**Dependencies:** Chapters 12, 13
**Lab:** 5 full Wyckoff Distribution case studies
**Assessment:** 10 conceptual + 5 chart + 5 scenario

---

### PART VII — VOLUME PROFILE
*Prerequisite: Parts IV, V*

---

#### Chapter 15 — Volume Profile
**Level:** Intermediate → Advanced → Professional

**Subchapters:**
- 15.1 — What Volume Profile is (VAP — Volume at Price)
- 15.2 — POC (Point of Control)
- 15.3 — VAH (Value Area High) and VAL (Value Area Low)
- 15.4 — Value Area (70% rule)
- 15.5 — HVN (High Volume Node) — acceptance zones
- 15.6 — LVN (Low Volume Node) — rejection zones
- 15.7 — Session Profile vs Fixed Range Profile vs Composite Profile
- 15.8 — Anchored Profile
- 15.9 — Developing POC and its migration
- 15.10 — Market concepts:
  - Acceptance
  - Rejection
  - Balance
  - Imbalance
  - Value migration
  - Breakout from value
  - Return to value
  - Failed auction using Volume Profile
- 15.11 — Integrating Volume Profile with VSA and Wyckoff
- 15.12 — NSE/BSE data availability and limitations

**Dependencies:** Chapters 8, 9, 10
**Lab:** Map Volume Profile on 5 NSE Nifty daily sessions
**Assessment:** 10 conceptual + 5 chart + 5 scenario

---

### PART VIII — VWAP
*Prerequisite: Parts IV, VII*

---

#### Chapter 16 — VWAP
**Level:** Intermediate → Advanced → Professional

**Subchapters:**
- 16.1 — VWAP formula and calculation
- 16.2 — What VWAP represents (average price weighted by volume)
- 16.3 — Anchored VWAP — anchoring to significant events
- 16.4 — VWAP slope — trend inference
- 16.5 — VWAP standard deviation bands
- 16.6 — Price above vs below VWAP — bullish/bearish bias
- 16.7 — VWAP reclaim — what it signals
- 16.8 — VWAP rejection — what it signals
- 16.9 — Institutional execution context — why institutions use VWAP
- 16.10 — VWAP failure modes
- 16.11 — Integration: VWAP + Volume Profile + VSA + Market Structure

**Dependencies:** Chapters 8, 15
**Lab:** VWAP analysis on 5 intraday NSE sessions
**Assessment:** 10 conceptual + 5 chart + 5 scenario

---

### PART IX — INSTITUTIONAL FOOTPRINTS
*Prerequisite: Parts IV, V, VI, VII, VIII*

---

#### Chapter 17 — Detecting Institutional-Style Activity
**Level:** Advanced → Professional

**Subchapters:**
- 17.1 — What the chart can and cannot tell us
- 17.2 — Indicators of unusual/large participation:
  - Absorption
  - Accumulation patterns
  - Distribution patterns
  - Large volume + limited price movement
  - Repeated support defence
  - Repeated resistance supply
  - Volume expansion at key levels
  - Failed breakdown
  - Failed breakout
  - Climactic action
  - VWAP interaction patterns
  - Volume Profile positioning
- 17.3 — The evidence hierarchy — OBSERVATION vs INFERENCE vs HYPOTHESIS
- 17.4 — Why chart data alone does not identify the participant
- 17.5 — Building an evidence-weighted interpretation
- 17.6 — Alternative hypotheses for each observation

**Dependencies:** Chapters 11–16
**Lab:** 5 institutional footprint identification cases
**Assessment:** 10 conceptual + 5 chart + 5 scenario

---

### PART X — INDIAN INSTITUTIONAL DATA
*Prerequisite: Part IX*

---

#### Chapter 18 — FII/FPI & DII Data
**Level:** Intermediate → Advanced → Professional

**Subchapters:**
- 18.1 — Who are FII/FPI? Who are DII?
- 18.2 — Gross Buy / Gross Sell / Net Buy / Net Sell — explained precisely
- 18.3 — Aggregate vs individual interpretation limitations
- 18.4 — **Critical rule:** FII net selling ≠ DII bought the same shares
- 18.5 — Data sources: NSE, BSE, SEBI
- 18.6 — How to investigate the FII/DII hypothesis using:
  - Price
  - Volume
  - Delivery
  - Sector rotation
  - Block / Bulk deals
  - Futures OI
  - Options positioning
- 18.7 — Common FII/DII data misconceptions
- 18.8 — Time lags and data publication timing

**Dependencies:** Chapter 17
**Lab:** Cross-reference FII/DII data with chart for 3 NSE sessions
**Assessment:** 10 conceptual + 5 scenario

---

#### Chapter 19 — Delivery Analysis
**Level:** Intermediate → Advanced → Professional

**Subchapters:**
- 19.1 — Delivery quantity and delivery percentage — definitions
- 19.2 — Delivery spike — what constitutes a spike
- 19.3 — Price + Delivery combinations:
  - High delivery + price rising
  - High delivery + price falling
  - Low delivery + price moving strongly
- 19.4 — Delivery during accumulation
- 19.5 — Delivery during distribution
- 19.6 — Delivery during breakout
- 19.7 — Delivery during breakdown
- 19.8 — **Critical rule:** High delivery ≠ institutional buying automatically
- 19.9 — NSE delivery data — where to find it, limitations

**Dependencies:** Chapter 18
**Lab:** Delivery analysis on 5 NSE stocks during breakout/breakdown
**Assessment:** 10 conceptual + 5 chart + 5 scenario

---

#### Chapter 20 — Block & Bulk Deals
**Level:** Intermediate → Advanced

**Subchapters:**
- 20.1 — Block deal — definition, minimum size, reporting window (NSE rules)
- 20.2 — Bulk deal — definition, 0.5% threshold
- 20.3 — Difference between block and bulk deals
- 20.4 — Data provided: price, quantity, buyer/seller name
- 20.5 — What block/bulk deals DO prove
- 20.6 — What they do NOT prove (intent, direction, continuation)
- 20.7 — How to combine block/bulk data with charts
- 20.8 — **Rule:** Never label ordinary high-volume activity as block/bulk without evidence

**Dependencies:** Chapters 18, 19
**Lab:** 5 block/bulk deal + chart correlation exercises
**Assessment:** 10 conceptual + 5 scenario

---

### PART XI — ORDER FLOW
*Prerequisite: Parts IV, V, X (and Chapter 4)*

---

#### Chapter 21 — Order Flow
**Level:** Advanced → Professional

**Subchapters:**
- 21.1 — What order flow analysis is
- 21.2 — Aggressive buyers vs sellers
- 21.3 — Passive liquidity providers
- 21.4 — Delta — definition and calculation
- 21.5 — Cumulative Volume Delta (CVD)
- 21.6 — Order flow imbalance
- 21.7 — Absorption in the order flow context
- 21.8 — Exhaustion — how to detect
- 21.9 — Stacked imbalance
- 21.10 — Liquidity sweep in order flow context
- 21.11 — Trapped traders concept
- 21.12 — Failed auction in order flow context
- 21.13 — **Data requirements and limitations** — what NSE retail data provides vs what footprint charts require
- 21.14 — **Critical rule:** OHLCV does NOT contain order flow information

**Dependencies:** Chapters 4, 5, 9, 17
**Lab:** CVD conceptual exercises
**Assessment:** 10 conceptual + 5 scenario

---

### PART XII — ADVANCED MICROSTRUCTURE
*Prerequisite: Parts I–XI*

---

#### Chapter 22 — Professional Market Microstructure
**Level:** Advanced → Professional

**Subchapters:**
- 22.1 — Price discovery at the microstructure level
- 22.2 — Liquidity providers and liquidity takers
- 22.3 — Market makers on NSE — role and limitations
- 22.4 — HFT (High-Frequency Trading) — what it does, what it doesn't
- 22.5 — Algorithmic execution — VWAP, TWAP, Implementation Shortfall
- 22.6 — Iceberg orders — detection inference
- 22.7 — Queue priority and its implications
- 22.8 — Market impact and slippage at institutional scale
- 22.9 — Spread dynamics intraday
- 22.10 — Order book imbalance
- 22.11 — Liquidity withdrawal dynamics
- 22.12 — Opening auction (NSE pre-open session)
- 22.13 — Closing auction (NSE closing session)
- 22.14 — Expiry effects on microstructure (weekly/monthly)

**Dependencies:** Chapters 4, 5, 21
**Lab:** Pre-open auction analysis exercise
**Assessment:** 10 conceptual + 5 scenario

---

### PART XIII — FUTURES
*Prerequisite: Parts I, III, IV, V*

---

#### Chapter 23 — Futures Analysis
**Level:** Intermediate → Advanced → Professional

**Subchapters:**
- 23.1 — Futures price vs spot price
- 23.2 — Basis — definition, fair value, roll cost
- 23.3 — Futures volume analysis
- 23.4 — Open Interest (OI) — definition and meaning
- 23.5 — Price + OI relationship — the 4-quadrant model
- 23.6 — Long buildup
- 23.7 — Short buildup
- 23.8 — Long unwinding
- 23.9 — Short covering
- 23.10 — **Limitations of the standard 4-quadrant OI interpretation**
- 23.11 — Rollovers — cost of carry, rollover percentage
- 23.12 — Expiry effects on price and volume
- 23.13 — Futures VWAP
- 23.14 — Futures vs cash volume comparison
- 23.15 — NSE F&O data sources and limitations

**Dependencies:** Chapters 7, 8, 9, 16
**Lab:** OI + Price analysis for 3 Nifty expiry cycles
**Assessment:** 10 conceptual + 5 numerical + 5 chart

---

### PART XIV — OPTIONS
*Prerequisite: Part XIII*

---

#### Chapter 24 — Options Market Mechanics
**Level:** Beginner (Options) → Intermediate → Advanced

**Subchapters:**
- 24.1 — Call option — definition, payoff
- 24.2 — Put option — definition, payoff
- 24.3 — Premium — intrinsic value + time value
- 24.4 — Implied Volatility (IV) — what it measures
- 24.5 — Delta — price sensitivity
- 24.6 — Gamma — rate of Delta change
- 24.7 — Theta — time decay
- 24.8 — Vega — sensitivity to IV
- 24.9 — Open Interest in options — aggregation meaning
- 24.10 — Change in OI — interpretation rules
- 24.11 — Volume in options
- 24.12 — Put-Call Ratio (PCR) — calculation and limits
- 24.13 — IV skew — term structure, skew shapes
- 24.14 — Option chain reading — how to read NSE option chain

**Dependencies:** Chapters 2, 23
**Lab:** Read and annotate NSE Nifty option chain
**Assessment:** 10 conceptual + 5 numerical + 5 chain reading

---

#### Chapter 25 — Options Positioning
**Level:** Intermediate → Advanced → Professional

**Subchapters:**
- 25.1 — Call writing — who writes and why
- 25.2 — Put writing — who writes and why
- 25.3 — Long buildup in options
- 25.4 — Short buildup in options
- 25.5 — Short covering in options
- 25.6 — Long unwinding in options
- 25.7 — Strike-wise OI positioning — practical interpretation
- 25.8 — Gamma effects near expiry
- 25.9 — Expiry dynamics — pin risk, magnetic strikes
- 25.10 — Max Pain — concept and **limitations** (why it frequently fails)
- 25.11 — **Rule:** High Call OI alone does NOT mean market will fall. Alternative explanations required.
- 25.12 — PCR interpretation — correct and incorrect uses

**Dependencies:** Chapter 24
**Lab:** Options OI analysis for Nifty weekly expiry
**Assessment:** 10 conceptual + 5 chain analysis + 5 scenario

---

### PART XV — TECHNICAL CONFIRMATION
*Prerequisite: Parts IV, V, VI, VII, VIII*

---

#### Chapter 26 — Essential Indicators
**Level:** Intermediate → Advanced

**Subchapters:**

**Core (Volume-based):**
- 26.1 — Relative Volume (RelVol)
- 26.2 — VWAP (recap — see Chapter 16)
- 26.3 — Volume Profile (recap — see Chapter 15)
- 26.4 — OBV (On-Balance Volume) — formula, meaning, failure modes
- 26.5 — CMF (Chaikin Money Flow) — formula, meaning, failure modes
- 26.6 — MFI (Money Flow Index) — formula, meaning, failure modes
- 26.7 — ATR (Average True Range) — volatility measurement

**Supporting:**
- 26.8 — EMA / SMA — trend direction bias, NOT signals alone
- 26.9 — RSI — overbought/oversold in context

**Advanced:**
- 26.10 — Delta and CVD (recap — see Chapter 21)

**For every indicator:**
> Formula → What it measures → What it does NOT measure → Best use → Failure modes → Redundancy check → Relationship with price → Relationship with volume

**Rule:** Do not create indicator overload. Maximum 5 indicators on any chart.

**Dependencies:** Chapters 8, 15, 16, 21
**Lab:** Multi-indicator confirmation exercise
**Assessment:** 10 conceptual + 5 chart + 5 scenario

---

### PART XVI — MULTI-TIMEFRAME ANALYSIS
*Prerequisite: Parts III–XV*

---

#### Chapter 27 — Multi-Timeframe Analysis
**Level:** Intermediate → Advanced → Professional

**Subchapters:**
- 27.1 — The timeframe hierarchy: Monthly → Weekly → Daily → 4H/1H → Intraday
- 27.2 — Higher-timeframe context — what it governs
- 27.3 — Lower-timeframe execution — how it refines entry/exit
- 27.4 — Volume confirmation across timeframes
- 27.5 — VSA confirmation across timeframes
- 27.6 — Volume Profile alignment
- 27.7 — VWAP alignment across sessions
- 27.8 — Conflicting timeframes — how to resolve, what to do
- 27.9 — Position traders vs intraday traders — different TF combinations
- 27.10 — **Rule:** Never trade intraday against the daily/weekly structure without strong reason

**Dependencies:** All prior parts
**Lab:** 3-timeframe analysis on 5 NSE stocks
**Assessment:** 10 conceptual + 5 chart + 5 scenario

---

### PART XVII — FALSE SIGNALS
*Prerequisite: All prior parts*

---

#### Chapter 28 — False Signals
**Level:** Intermediate → Advanced → Professional

**Subchapters:**
- 28.1 — False breakout — identification, avoidance
- 28.2 — False breakdown — identification, avoidance
- 28.3 — Volume spike trap — when volume is misleading
- 28.4 — Climax trap — misidentifying a continuation as climax
- 28.5 — Short covering — disguised as demand
- 28.6 — Short squeeze — mechanics and misidentification
- 28.7 — Long liquidation — disguised as supply
- 28.8 — News-driven volume — why it corrupts VSA reading
- 28.9 — Result-day volume — how to handle
- 28.10 — Gap traps — volume and price gaps
- 28.11 — Illiquid stock effects — small-cap distortions
- 28.12 — Low-float effects
- 28.13 — Algorithmic-driven activity signatures
- 28.14 — Index rebalancing effects
- 28.15 — Expiry activity distortions
- 28.16 — Block deal distortions on OHLCV
- 28.17 — ETF / index inflow-outflow distortions
- **For each:** How to detect, how to avoid misclassification

**Dependencies:** All prior parts
**Lab:** 10 false signal identification cases
**Assessment:** 10 conceptual + 5 chart + 5 scenario

---

### PART XVIII — QUANTITATIVE ANALYSIS
*Prerequisite: Parts IV, V, XV*

---

#### Chapter 29 — Quantitative Analysis
**Level:** Advanced → Professional

**Subchapters:**
- 29.1 — Relative Volume — implementation
- 29.2 — Volume Z-score — formula, interpretation, threshold setting
- 29.3 — Volume percentile — rolling window approach
- 29.4 — ATR normalization for volume comparison across instruments
- 29.5 — Price-volume relationship — quantitative approach
- 29.6 — Volume anomaly detection — statistical method
- 29.7 — Volatility-adjusted volume
- 29.8 — Regime detection — trending vs ranging using quantitative signals
- 29.9 — Multi-factor confirmation scoring
- 29.10 — Statistical validation of VSA patterns
- 29.11 — **For any scoring system:**
  - Define all variables
  - State the formula
  - Explain assumptions
  - Explain limitations
  - Explain validation method
  - Do not use arbitrary weights

**Dependencies:** Chapters 8, 9, 26
**Lab:** Build a RelVol + Z-score screener (conceptual)
**Assessment:** 10 conceptual + 5 numerical + 5 scenario

---

### PART XIX — PROFESSIONAL ANALYSIS WORKFLOW
*Prerequisite: All prior parts*

---

#### Chapter 30 — Professional Analysis Workflow
**Level:** Professional

**The 23-Step Repeatable Framework:**

| Step | Domain | Question |
|------|---------|----------|
| 1 | Multi-TF | What is the higher-timeframe structure? |
| 2 | Market Regime | Trending or ranging? Bullish or bearish regime? |
| 3 | Trend | Direction and strength |
| 4 | Key Levels | Support, resistance, POC, VWAP, prior highs/lows |
| 5 | Volume Regime | Expanding or contracting? |
| 6 | Relative Volume | Normal or abnormal? |
| 7 | Price-Volume | Which P×V combination is present? |
| 8 | VSA | Any VSA signals in background? Current bar? |
| 9 | Wyckoff | Which Wyckoff phase/event is present? |
| 10 | Volume Profile | Where is value? POC, VAH/VAL, HVN/LVN? |
| 11 | VWAP | Price above or below? Reclaim or rejection? |
| 12 | Liquidity | Where are liquidity pools? Risk of sweep? |
| 13 | Order Flow | (Where data exists) Delta, CVD, imbalance |
| 14 | Delivery | Delivery % — normal or abnormal? |
| 15 | FII/DII | Net buy/sell context — with all caveats |
| 16 | Block/Bulk | Any relevant deals in last 5 sessions? |
| 17 | Futures | Basis, OI, positioning signals |
| 18 | Options | OI positioning, PCR, IV skew |
| 19 | Alternative Hypotheses | What else could explain what I'm seeing? |
| 20 | Confirmation | What must happen to confirm the interpretation? |
| 21 | Invalidation | What would prove this interpretation wrong? |
| 22 | Risk | Position size, stop, risk/reward |
| 23 | Final Conclusion | Evidence-weighted, uncertainty acknowledged |

**Subchapters:**
- 30.1 — The complete 23-step workflow with examples
- 30.2 — Shortcuts for different time horizons (intraday vs positional vs investor)
- 30.3 — Documentation format — how to record analysis
- 30.4 — Self-audit checklist

**Dependencies:** All prior parts
**Lab:** Apply the 23-step framework to 5 live/historical NSE cases
**Assessment:** Professional case analysis (full framework application)

---

### PART XX — PRACTICAL TRADING LABORATORY
*Prerequisite: All prior parts*

#### Laboratory Structure (for every case)

```
OBSERVE     → What do you see?
ANALYSE     → Price / Volume / Structure
HYPOTHESIZE → What could be happening?
TEST        → What evidence supports it?
ALTERNATIVES→ What else could explain it?
CONFIRM     → What would confirm?
INVALIDATE  → What would disprove?
CONCLUDE    → Evidence-weighted final interpretation
```

#### 23 Case Types

| # | Case Type | Difficulty |
|---|-----------|------------|
| 1 | Accumulation | Beginner |
| 2 | Distribution | Beginner |
| 3 | Re-accumulation | Intermediate |
| 4 | Redistribution | Intermediate |
| 5 | Breakout | Beginner |
| 6 | Failed Breakout | Intermediate |
| 7 | Breakdown | Beginner |
| 8 | Failed Breakdown | Intermediate |
| 9 | Absorption | Advanced |
| 10 | Selling Climax | Intermediate |
| 11 | Buying Climax | Intermediate |
| 12 | Spring | Advanced |
| 13 | Upthrust | Advanced |
| 14 | Test (Successful) | Intermediate |
| 15 | No Demand | Intermediate |
| 16 | No Supply | Intermediate |
| 17 | Institutional-style activity | Advanced |
| 18 | Futures + OI analysis | Advanced |
| 19 | Options positioning | Advanced |
| 20 | Volume Profile reading | Advanced |
| 21 | VWAP integration | Advanced |
| 22 | Liquidity sweep | Professional |
| 23 | Order-flow imbalance | Professional |

#### Difficulty Tiers

| Tier | Description |
|------|-------------|
| **Beginner** | Clear signals, clean charts, unambiguous volume |
| **Intermediate** | Multiple signals, some conflicting evidence |
| **Advanced** | Ambiguous real-market conditions, multiple alternatives |
| **Professional** | Messy incomplete data — correct answer may be UNKNOWN |

> **The learner is rewarded for correctly identifying uncertainty.**

---

## 2. COVERAGE CHECKLIST

| Topic | Beginner | Intermediate | Advanced | Practical Lab | Assessment |
|-------|----------|--------------|----------|---------------|------------|
| Exchange / Participant mechanics | Ch 1 | Ch 1 | Ch 22 | Ch 30 | Ch 1 Quiz |
| Price Formation / Auction | Ch 2 | Ch 2 | Ch 22 | Ch 30 | Ch 2 Quiz |
| Order Types | Ch 3 | Ch 3 | Ch 3 | Ch 3 Lab | Ch 3 Quiz |
| Order Book / Depth | Ch 4 | Ch 4 | Ch 4, 22 | Ch 30 | Ch 4 Quiz |
| Liquidity & Market Impact | Ch 5 | Ch 5 | Ch 5, 22 | Lab Cases | Ch 5 Quiz |
| Candlestick Mechanics | Ch 6 | Ch 6 | Ch 10 | Lab Cases | Ch 6 Quiz |
| Market Structure | Ch 7 | Ch 7 | Ch 7, 30 | Lab Cases | Ch 7 Quiz |
| Volume | Ch 8 | Ch 8 | Ch 8, 29 | Ch 8 Lab | Ch 8 Quiz |
| Price × Volume Matrix | — | Ch 9 | Ch 9, 29 | Lab Cases | Ch 9 Quiz |
| VSA Foundations | Ch 10 | Ch 10 | Ch 10 | Ch 10 Lab | Ch 10 Quiz |
| VSA Patterns (all 17) | — | Ch 11 | Ch 11 | Lab Cases 1-23 | Ch 11 Quiz |
| Wyckoff Principles | Ch 12 | Ch 12 | Ch 12 | Ch 12 Lab | Ch 12 Quiz |
| Accumulation Schematic | — | Ch 13 | Ch 13 | Lab Cases 1,3 | Ch 13 Quiz |
| Distribution Schematic | — | Ch 14 | Ch 14 | Lab Cases 2,4 | Ch 14 Quiz |
| Volume Profile | — | Ch 15 | Ch 15 | Lab Case 20 | Ch 15 Quiz |
| VWAP | — | Ch 16 | Ch 16 | Lab Case 21 | Ch 16 Quiz |
| Institutional Footprints | — | — | Ch 17 | Lab Case 17 | Ch 17 Quiz |
| FII / DII Analysis | — | Ch 18 | Ch 18 | Ch 18 Lab | Ch 18 Quiz |
| Delivery Analysis | — | Ch 19 | Ch 19 | Ch 19 Lab | Ch 19 Quiz |
| Block / Bulk Deals | — | Ch 20 | Ch 20 | Ch 20 Lab | Ch 20 Quiz |
| Order Flow | — | — | Ch 21 | Lab Case 23 | Ch 21 Quiz |
| Advanced Microstructure | — | — | Ch 22 | Ch 30 | Ch 22 Quiz |
| Futures Analysis | — | Ch 23 | Ch 23 | Lab Case 18 | Ch 23 Quiz |
| Options Mechanics | Ch 24 | Ch 24 | Ch 24 | Ch 24 Lab | Ch 24 Quiz |
| Options Positioning | — | Ch 25 | Ch 25 | Lab Case 19 | Ch 25 Quiz |
| Essential Indicators | — | Ch 26 | Ch 26 | Ch 26 Lab | Ch 26 Quiz |
| Multi-Timeframe Analysis | — | Ch 27 | Ch 27 | Ch 27 Lab | Ch 27 Quiz |
| False Signals | — | Ch 28 | Ch 28 | Ch 28 Lab | Ch 28 Quiz |
| Quantitative Analysis | — | — | Ch 29 | Ch 29 Lab | Ch 29 Quiz |
| Professional Workflow | — | — | Ch 30 | Ch 30 Lab | Mastery Test |
| Final Capstone | — | — | — | Capstone | Final Exam |

---

## 3. PREREQUISITE MAP

```
Ch 1 ──────────────────────────────────────────────────────────►
Ch 2 ──────────────────────────────────────────────────────────►
Ch 1 + Ch 2 ───► Ch 3 ───► Ch 4 ───► Ch 5
Ch 2 ───► Ch 6 ───► Ch 7
Ch 7 + Ch 2 ───► Ch 8 ───► Ch 9
Ch 6 + Ch 7 + Ch 8 + Ch 9 ───► Ch 10 ───► Ch 11
Ch 11 ───► Ch 12 ───► Ch 13 ───► Ch 14
Ch 8 + Ch 9 + Ch 10 ───► Ch 15 ───► Ch 16
Ch 11 + Ch 12 + Ch 13 + Ch 14 + Ch 15 + Ch 16 ───► Ch 17
Ch 17 ───► Ch 18 ───► Ch 19 ───► Ch 20
Ch 4 + Ch 5 + Ch 9 + Ch 17 ───► Ch 21
Ch 4 + Ch 5 + Ch 21 ───► Ch 22
Ch 7 + Ch 8 + Ch 9 + Ch 16 ───► Ch 23 ───► Ch 24 ───► Ch 25
Ch 8 + Ch 15 + Ch 16 + Ch 21 ───► Ch 26
ALL ───► Ch 27
ALL ───► Ch 28
Ch 8 + Ch 9 + Ch 26 ───► Ch 29
ALL ───► Ch 30
Ch 30 ───► Practical Laboratory ───► Final Capstone
```

**Parallel tracks** (can be studied simultaneously):
- Track A: Ch 1–7 (Foundations + Price Action)
- Track B: Ch 8–9 (Volume) — after Ch 7
- Track C: Ch 23–25 (Derivatives) — after Ch 8

---

## 4. PRACTICAL LABORATORY ROADMAP

| Laboratory Stage | Chapters Completed | Case Types | Difficulty |
|------------------|--------------------|------------|------------|
| **Lab 0** | Ch 1–5 | Order book / slippage exercises | Conceptual |
| **Lab 1** | Ch 6–7 | Candle identification, structure mapping | Beginner |
| **Lab 2** | Ch 8–9 | Volume classification, P×V matrix | Beginner |
| **Lab 3** | Ch 10–11 | VSA pattern identification | Intermediate |
| **Lab 4** | Ch 12–14 | Wyckoff Accumulation & Distribution | Intermediate |
| **Lab 5** | Ch 15–16 | Volume Profile + VWAP integration | Intermediate |
| **Lab 6** | Ch 17–20 | Institutional footprint + delivery + FII/DII | Advanced |
| **Lab 7** | Ch 21–22 | Order Flow + Microstructure | Advanced |
| **Lab 8** | Ch 23–25 | Futures + Options positioning | Advanced |
| **Lab 9** | Ch 26–29 | Multi-TF + indicators + quantitative | Advanced |
| **Lab 10** | Ch 30 | Full 23-step framework application | Professional |
| **Capstone** | ALL | Unknown instrument, all data layers | Professional |

---

## ASSESSMENT STRUCTURE

### Chapter Quizzes (every chapter)
- 10 conceptual questions
- 5 chart-analysis questions
- 5 scenario questions
- Advanced chapters add: evidence classification + hypothesis testing

### Mastery Tests

| Test | Covers | Format |
|------|--------|--------|
| **Beginner Mastery** | Ch 1–9 | 30 questions + 5 chart cases |
| **Intermediate Mastery** | Ch 10–16 | 30 questions + 5 chart cases |
| **Advanced Mastery** | Ch 17–29 | 30 questions + 5 complex cases |
| **Professional Final** | All 30 chapters | 5 full case analyses using the complete framework |

### Final Assessment Grading Criteria
The final assessment does NOT judge directional prediction accuracy.

It judges:
1. Observation quality
2. Market mechanics understanding
3. Evidence citation
4. Context application
5. Alternative hypotheses listed
6. Confirmation criteria stated
7. Invalidation criteria stated
8. Risk management framework
9. Uncertainty acknowledgment
10. Final evidence-weighted conclusion quality

---

## HOW TO PROCEED

**Phase 1 is now complete.** The Master Curriculum Map, Coverage Checklist, Prerequisite Map, and Laboratory Roadmap are presented above.

**When you are ready to begin, say:**

> **"START CHAPTER BY CHAPTER"**

Chapter 1 — *How Financial Markets Actually Work* — will be delivered in full, at all three depth levels (Beginner → Intermediate → Advanced), with exercises, lab work, and assessment questions.

Each chapter will be delivered one at a time. No chapter will be compressed or merged with another.
