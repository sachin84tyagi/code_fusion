import { BookOpen, Code2, Database, Shield, Server, Cpu, Layout, Globe, Box, Workflow, Cloud, Lock, Dumbbell, TrendingUp } from "lucide-react";
import { jsTopics } from "./utils/js";
import { reactTopics } from "./utils/react_js";
import { pythonTopics } from "./utils/python";
import { pythonAITopics } from "./utils/python_for_ai";
import { generativeAITopics } from "./utils/generative_ai";
import { genAITopics } from "./utils/gen_ai";
import { promptEngTopics } from "./utils/prompt_engineering";
import { agenticAITopics } from "./utils/agentic_ai";
import { langChainAITopics } from "./utils/lang_chain";
import { langGraphAITopics } from "./utils/lang_graph";
import { ragAITopics } from "./utils/rag";
import {
  typescriptTopics, nextjsTopics, nodejsTopics, tailwindTopics,
  dsaTopics, algorithmsTopics, dockerTopics, k8sTopics,
  awsTopics, cyberTopics
} from "./utils/dev_docs";
import { nodeTopics } from "./utils/node";
import { expressTopics } from "./utils/express";
import { mongoTopics } from "./utils/mongo";
import { dockerTopics as dockerTutorialTopics } from "./utils/docker";
import { excerciseTopics } from "./utils/gym";
import { springTopics } from "./utils/spring";
import { javaTopics } from "./utils/java";
import { cicdTopics } from "./utils/cicd";
import { investingTopics } from "./utils/investing";
import { proInvestingTopics } from "./utils/pro_investing";

export const navItems = [
  { name: "js", value: "JS", link: jsTopics, icon: Code2 },
  { name: "react_js", value: "React JS", link: reactTopics, icon: BookOpen },
  { name: "java", value: "Java", link: javaTopics, icon: BookOpen },
  { name: "spring", value: "Spring", link: springTopics, icon: BookOpen },
  { name: "cicd", value: "CICD", link: cicdTopics, icon: Box },
  { name: "docker", value: "Docker", link: dockerTutorialTopics, icon: Box },
  { name: "node", value: "Node JS", link: nodeTopics, icon: BookOpen },
  { name: "express", value: "Express", link: expressTopics, icon: BookOpen },
  { name: "mongo", value: "Mongo", link: mongoTopics, icon: BookOpen },
  { name: "python", value: "Python", link: pythonTopics, icon: Database },
  { name: "python_for_ai", value: "Python for AI", link: pythonAITopics, icon: Database },
  { name: "prompt_engineering", value: "Prompt Engineering", link: promptEngTopics, icon: Database },
  { name: "generative_ai", value: "Generative AI", link: generativeAITopics, icon: Database },
  { name: "gen_ai", value: "Gen AI", link: genAITopics, icon: Database },
  { name: "rag", value: "RAG", link: ragAITopics, icon: Database },
  { name: "agentic_ai", value: "Agentic AI", link: agenticAITopics, icon: Database },
  { name: "lang_chain", value: "Langchain", link: langChainAITopics, icon: Database },
  { name: "lang_graph", value: "Langgraph", link: langGraphAITopics, icon: Database },
  { name: "typescript", value: "TypeScript", link: typescriptTopics, icon: Code2 },
  { name: "nextjs", value: "Next.js", link: nextjsTopics, icon: Globe },
  { name: "nodejs", value: "Node.js", link: nodejsTopics, icon: Server },
  { name: "tailwind", value: "Tailwind CSS", link: tailwindTopics, icon: Layout },
  { name: "dsa", value: "Data Structures", link: dsaTopics, icon: Cpu },
  { name: "algorithms", value: "Algorithms", link: algorithmsTopics, icon: Workflow },
  { name: "k8s", value: "Kubernetes", link: k8sTopics, icon: Server },
  { name: "aws", value: "AWS", link: awsTopics, icon: Cloud },
  { name: "cybersecurity", value: "Cybersecurity", link: cyberTopics, icon: Lock },
  { name: "gym", value: "Gym", link: excerciseTopics, icon: Dumbbell },
  { name: "investing", value: "Investing", link: investingTopics, icon: Dumbbell },
  { name: "pro_investing", value: "Pro Investing", link: proInvestingTopics, icon: TrendingUp },
] as const;

type NavItem = typeof navItems[number];
export type StaticKeys = NavItem["name"];

export function subCategoriesData(key: StaticKeys) {
  return Object.fromEntries(
    navItems.filter(item => item.name === key).map(item => item.name === key ? [item.name, item.link] : [])
  ) as Record<StaticKeys, string[]>;
}

export const contentData = {
  "js": [
    { title: "Introduction", description: "Getting started with JavaScript: basic syntax and setup.", date: "Feb 12, 2026" },
    { title: "Variables & Data Types", description: "Learn about let, const, and the fundamental data types in JS.", date: "Feb 10, 2026" },
    { title: "Functions", description: "A deep dive into JS functions and how they work under the hood.", date: "Feb 05, 2026" },
  ],
  "react_js": [
    { title: "Introduction", description: "Core concepts of React: components, props, and state.", date: "Feb 11, 2026" },
    { title: "Mastering Hooks", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
  ],
  "spring": [
    { title: "Introduction", description: "Core concepts of Spring: components, props, and state.", date: "Feb 11, 2026" },
    { title: "Core", description: "A comprehensive guide to Spring Core: components, props, and state.", date: "Feb 08, 2026" },
    { title: "MVC", description: "A comprehensive guide to Spring MVC: components, props, and state.", date: "Feb 08, 2026" },
    { title: "Security", description: "A comprehensive guide to Spring Security: components, props, and state.", date: "Feb 08, 2026" },
    { title: "Data", description: "A comprehensive guide to Spring Data: components, props, and state.", date: "Feb 08, 2026" },
    { title: "Boot", description: "A comprehensive guide to Spring Boot: components, props, and state.", date: "Feb 08, 2026" },
  ],
  "java": [
    { title: "Introduction", description: "Getting started with Java and OOP concepts.", date: "Feb 12, 2026" },
  ],
  "investing": [
    { title: "Introduction", description: "Wyckoff + VSA master roadmap — Level 0 se Level 10 tak. Foundation se real trading system tak.", date: "Sep 13, 2026" },
    { title: "Up Down Bar", description: "OHLC, candlestick/bar, Up Bar aur Down Bar — chart ki sabse basic language. Trading ka alphabet.", date: "Sep 13, 2026" },
    { title: "Spread", description: "Spread kya hai, narrow vs wide spread ka kya matlab hai, aur yeh price action ko kaise reveal karta hai.", date: "Sep 13, 2026" },
    { title: "Volume", description: "Volume kya batata hai, high vs low volume ka meaning, aur volume ko price ke saath kaise padhein.", date: "Sep 13, 2026" },
    { title: "Close Position", description: "Bar ka close kahaan hua — top, middle, ya bottom — aur yeh kyun sabse important clue hai.", date: "Sep 13, 2026" },
    { title: "Effort Vs Result", description: "VSA ka core principle — effort (volume) aur result (price move) ka relationship. Jab yeh match nahi karte tab kya hota hai.", date: "Sep 13, 2026" },
    { title: "Supply And Demand", description: "Market mein supply aur demand ka actual meaning — buyers vs sellers ki real battle chart par kaise dikhti hai.", date: "Sep 13, 2026" },
    { title: "No Demand No Supply", description: "No Demand aur No Supply bars — unhe kaise identify karen, background check kyun zaroori hai, aur inhe trade karne ke 5 sawaal.", date: "Sep 13, 2026" },
    { title: "Stopping Volume Climaxes", description: "Selling Climax, Buying Climax, aur Stopping Volume — market reversals ki foundation. Climactic action ko kaise padhein.", date: "Sep 13, 2026" },
    { title: "Tests", description: "Supply/demand test kya hota hai, Test bar ko identify karna, aur successful vs failed tests mein kya difference hota hai.", date: "Sep 13, 2026" },
    { title: "Shakeout Spring", description: "Spring aur Shakeout — Wyckoff ke sabse powerful setups. Fake breakdowns, trapped bears, aur real reversals.", date: "Sep 13, 2026" },
    { title: "Upthrust", description: "Upthrust aur Pseudo-Upthrust — fake breakouts, trapped bulls, aur distribution mein unka role.", date: "Sep 13, 2026" },
    { title: "Absorption", description: "Absorption volume kya hai, large operators kaise stock absorb karte hain, aur yeh accumulation/distribution mein kaise fit hota hai.", date: "Sep 13, 2026" },
    { title: "Accumulation", description: "Wyckoff Accumulation Schematic — SC, AR, ST, Spring, Test, SOS, LPS. Har phase ka meaning aur chart par kaise dikhta hai.", date: "Sep 13, 2026" },
    { title: "Distribution", description: "Wyckoff Distribution Schematic — BC, AR, ST, Upthrust, SOW, LPSY. Tops kaise bante hain aur unhe kaise identify karein.", date: "Sep 13, 2026" },
    { title: "Markup Markdown", description: "Market ke 4 phases — Accumulation, Markup, Distribution, Markdown. Aap abhi kis phase mein hain yeh kaise janen.", date: "Sep 13, 2026" },
    { title: "Background Analysis", description: "Background analysis — pichle 20-50 bars ki kahani padhna. Ek candle ka meaning context ke bina kuch nahi hota.", date: "Sep 13, 2026" },
    { title: "Real Charts", description: "Real random charts par Wyckoff+VSA apply karna — textbook se real world mein jump. Galat interpretations se kaise seekhein.", date: "Sep 13, 2026" },
    { title: "Backtesting", description: "100-200 historical setups record karna — win rate, R/R, expectancy, max drawdown. Proof karo ki setup kaam karta hai.", date: "Sep 13, 2026" },
    { title: "Strategy", description: "Complete trading setup banana — entry trigger, stop-loss placement, target logic. No Demand = Sell sirf strategy nahi hai.", date: "Sep 13, 2026" },
    { title: "Risk Management", description: "Position sizing, 1% rule, R-multiple, drawdown management, aur losing streak survival. Bina iske koi system complete nahi.", date: "Sep 13, 2026" },
  ],

  "pro_investing": [
    { title: "Curriculum Map", description: "Complete Master Curriculum — 20 Parts, 30 Chapters, full dependency map, laboratory roadmap & assessment structure for NSE/BSE professional trading.", date: "Sep 22, 2026" },
    { title: "How Markets Work", description: "Exchange, broker, clearing corp, depository, participants — institutional, retail, HFT, MFs, FPIs. What each participant can and cannot do.", date: "Sep 22, 2026" },
    { title: "Price Formation", description: "Price discovery, supply-demand, bid-ask, order matching, price-time priority, market impact — how a price is actually formed.", date: "Sep 22, 2026" },
    { title: "Order Types", description: "Market, Limit, Stop, SL-M, IOC, GTT — mechanics, slippage, advantages, risks with real NSE examples.", date: "Sep 22, 2026" },
    { title: "Order Book", description: "Level 1/2 depth, bid/ask queue, price-time priority, hidden/iceberg liquidity, displayed vs real liquidity.", date: "Sep 22, 2026" },
    { title: "Liquidity And Market Impact", description: "Thin/deep liquidity, spread, slippage, market impact, stop clusters, liquidity sweeps, absorption, failed auctions.", date: "Sep 22, 2026" },
    { title: "Candlestick Mechanics", description: "OHLC, body, wick, range, close location. Doji, pin bar, engulfing, inside/outside bar — no fixed meaning without context.", date: "Sep 22, 2026" },
    { title: "Market Structure", description: "HH/HL/LH/LL, trend, range, breakout, breakdown, retest, failed breakout, support/resistance, swing points, market regime.", date: "Sep 22, 2026" },
    { title: "Understanding Volume", description: "What volume measures, relative volume, average, expansion/contraction, spike, climax. Volume Z-score, percentile, ratio calculations.", date: "Sep 22, 2026" },
    { title: "Price Volume Relationship", description: "Complete 6-row Price×Volume matrix with valid interpretation, alternative, false positive, and confirmation for each combination.", date: "Sep 22, 2026" },
    { title: "VSA Foundations", description: "Effort vs Result, Spread, Volume, Closing Location, Context, Background — the 5 pillars of VSA reading.", date: "Sep 22, 2026" },
    { title: "VSA Patterns", description: "No Demand, No Supply, Stopping Volume, Selling/Buying Climax, Upthrust, Shakeout, Test, Spring, SOS, SOW, Absorption, Exhaustion.", date: "Sep 22, 2026" },
    { title: "Wyckoff Principles", description: "Composite Operator, Supply & Demand, Cause & Effect, Effort & Result — the four laws and their real market mechanics.", date: "Sep 22, 2026" },
    { title: "Accumulation Schematic", description: "PS, SC, AR, ST, Spring, Test, SOS, LPS — Phase A through E with real NSE examples and volume confirmation.", date: "Sep 22, 2026" },
    { title: "Distribution Schematic", description: "PSY, BC, AR, ST, UT, UTAD, SOW, LPSY — Phases A–E, re-accumulation vs redistribution.", date: "Sep 22, 2026" },
    { title: "Volume Profile", description: "VAP, POC, VAH/VAL, HVN/LVN, session/fixed/composite profiles, acceptance, rejection, value migration, failed auction.", date: "Sep 22, 2026" },
    { title: "VWAP", description: "VWAP, Anchored VWAP, slope, deviation, reclaim, rejection — integrated with volume, VSA, Volume Profile, market structure.", date: "Sep 22, 2026" },
    { title: "Institutional Footprints", description: "Absorption, accumulation, distribution, repeated S/R defence, volume at key levels — and why the chart alone doesn't ID the participant.", date: "Sep 22, 2026" },
    { title: "FII DII Analysis", description: "FII/FPI vs DII — gross/net buy-sell data, aggregate limitations, how to cross-check with price, volume, delivery, futures, options.", date: "Sep 22, 2026" },
    { title: "Delivery Analysis", description: "Delivery %, delivery spikes, price+delivery+volume combinations during accumulation, distribution, breakout, breakdown.", date: "Sep 22, 2026" },
    { title: "Block Bulk Deals", description: "Difference between block and bulk deals, what data they provide, what they don't prove, how to combine with charts.", date: "Sep 22, 2026" },
    { title: "Order Flow", description: "Aggressive buyers/sellers, delta, CVD, imbalance, absorption, exhaustion, stacked imbalance, liquidity sweep, trapped traders, failed auction.", date: "Sep 22, 2026" },
    { title: "Advanced Microstructure", description: "Price discovery, liquidity providers/takers, HFT, algo execution, VWAP/TWAP, iceberg, queue priority, opening/closing auction, expiry effects.", date: "Sep 22, 2026" },
    { title: "Futures Analysis", description: "Basis, OI, Long/Short buildup/unwinding, rollovers, expiry, futures VWAP — and limitations of the standard 4-quadrant OI model.", date: "Sep 22, 2026" },
    { title: "Options Mechanics", description: "Call/Put, premium, IV, Delta, Gamma, Theta, Vega, OI, Change in OI, PCR, IV skew, option chain — all mechanics explained.", date: "Sep 22, 2026" },
    { title: "Options Positioning", description: "Call/Put writing, strike-wise positioning, gamma effects, expiry dynamics, max pain limitations, PCR interpretation alternatives.", date: "Sep 22, 2026" },
    { title: "Essential Indicators", description: "RelVol, VWAP, Volume Profile, OBV, CMF, MFI, ATR, EMA, RSI — formula, meaning, failure modes, redundancy checks.", date: "Sep 22, 2026" },
    { title: "Multi Timeframe Analysis", description: "Monthly→Weekly→Daily→4H/1H→Intraday. Higher-TF context, lower-TF execution, conflicting timeframes resolution.", date: "Sep 22, 2026" },
    { title: "False Signals", description: "False breakout/breakdown, volume spike traps, climax traps, short squeeze, news volume, expiry effects, illiquid stocks, algo distortions.", date: "Sep 22, 2026" },
    { title: "Quantitative Analysis", description: "RelVol, Z-score, percentile, ATR normalization, anomaly detection, volatility-adjusted volume, regime detection, statistical validation.", date: "Sep 22, 2026" },
    { title: "Professional Workflow", description: "One repeatable 23-step framework: from higher-TF structure → volume regime → VSA → Wyckoff → OI → options → alternatives → invalidation → conclusion.", date: "Sep 22, 2026" },
    { title: "Practical Laboratory", description: "Real NSE/BSE chart cases: Observe → Analyse → Hypothesize → Test → Alternatives → Confirm → Invalidate → Conclude. Beginner to Pro level.", date: "Sep 22, 2026" },
    { title: "Master Reference Tables", description: "14 master tables: Price×Volume, VSA, Wyckoff, Volume Profile, VWAP, Futures/OI, Options/OI, Delivery, Liquidity, Order Flow, Microstructure, Indicators, False Signals matrices.", date: "Sep 22, 2026" },
    { title: "Glossary", description: "Complete glossary — every technical term with simple definition, professional definition, example, related concepts, and common misconception.", date: "Sep 22, 2026" },
    { title: "Final Capstone", description: "Full professional case study: unknown NSE/BSE instrument, multiple TFs, price+volume+delivery+VP+VWAP+futures+OI+options+FII/DII. Build 10 reports. Model solution provided.", date: "Sep 22, 2026" },
  ],

  "cicd": [
    { title: "Introduction", description: "What CI/CD is, why it matters, and how it transforms software delivery.", date: "Aug 03, 2026" },
    { title: "What is CI CD", description: "Deep dive into CI, CD, pipelines, phases, DORA metrics, and feedback loops.", date: "Aug 03, 2026" },
    { title: "Git for CI CD", description: "Branching strategies, PR workflows, protected branches, and tags for releases.", date: "Aug 03, 2026" },
    { title: "GitHub Actions", description: "The most popular CI/CD platform — built into GitHub, marketplace actions, and examples.", date: "Aug 03, 2026" },
    { title: "Workflow YAML", description: "Complete anatomy of a workflow: on, env, jobs, steps, contexts, and matrix builds.", date: "Aug 03, 2026" },
    { title: "Triggers and Events", description: "push, pull_request, schedule, workflow_dispatch, release — when and how to trigger.", date: "Aug 03, 2026" },
    { title: "Jobs and Steps", description: "Parallel vs sequential jobs, step types, outputs, artifacts, and conditional logic.", date: "Aug 03, 2026" },
    { title: "Runners", description: "GitHub-hosted vs self-hosted runners, container jobs, and service containers.", date: "Aug 03, 2026" },
    { title: "Secrets and Variables", description: "Secure secrets, GitHub Environments, GITHUB_TOKEN, and approval gates.", date: "Aug 03, 2026" },
    { title: "Artifacts and Caching", description: "Save build outputs and cache dependencies to speed up pipeline by 80%.", date: "Aug 03, 2026" },
    { title: "Docker in CI CD", description: "Build, tag, push Docker images and deploy to ECS/K8s inside the pipeline.", date: "Aug 03, 2026" },
    { title: "Testing in Pipeline", description: "Unit, integration, E2E, linting, security scans, and coverage enforcement.", date: "Aug 03, 2026" },
    { title: "Deployment Strategies", description: "Recreate, Rolling, Blue-Green, Canary, and Feature Flags with rollback.", date: "Aug 03, 2026" },
    { title: "Jenkins", description: "Enterprise CI/CD with Jenkinsfile, declarative pipelines, agents, and plugins.", date: "Aug 03, 2026" },
    { title: "Pipeline as Code", description: "Reusable workflows, composite actions, GitOps, and DRY pipeline design.", date: "Aug 03, 2026" },
    { title: "Monitoring Pipelines", description: "Slack alerts, health checks, auto-rollback, DORA metrics, and Grafana dashboards.", date: "Aug 03, 2026" },
    { title: "Whats Next", description: "Kubernetes, Terraform, cloud platforms, SRE — your roadmap after CI/CD.", date: "Aug 03, 2026" },
  ],
  "node": [
    { title: "Introduction", description: "Core concepts of React: components, props, and state.", date: "Feb 11, 2026" },
    { title: "Architecture", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Event Loop", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "EventEmitter", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Modules", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "CommonJS", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "NPM", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Package Json", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "File System", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Buffers", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Streams", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Read Stream", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Write Stream", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Process Object", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Global Objects", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Environment Variables", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "require()", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "exports", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "module.exports", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Cluster", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Worker Threads", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
  ],
  "express": [
    { title: "Introduction", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
  ],
  "mongo": [
    { title: "Introduction", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Collection", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Document", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "BSON", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "CRUD", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Index", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Compound Index", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Aggregation", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "$match", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "$group", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "$lookup", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Mongoose", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Schema", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "populate()", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Transactions", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
    { title: "Sharding", description: "A comprehensive guide to useEffect, useState, and custom hooks.", date: "Feb 08, 2026" },
  ],
  "python": [
    { title: "Introduction", description: "Start your Python journey with basic syntax and data structures.", date: "Feb 09, 2026" },
    { title: "Functions", description: "Building reusable logic with Python functions and decorators.", date: "Feb 06, 2026" },
  ],
  "python_for_ai": [
    { title: "Introduction", description: "Start your Python journey with basic syntax and data structures.", date: "Feb 09, 2026" },
    { title: "Functions", description: "Building reusable logic with Python functions and decorators.", date: "Feb 06, 2026" },
  ],
  "prompt_engineering": [
    { title: "Introduction", description: "Start your Python journey with basic syntax and data structures.", date: "Feb 09, 2026" },
    { title: "Functions", description: "Building reusable logic with Python functions and decorators.", date: "Feb 06, 2026" },
  ],
  "generative_ai": [
    { title: "Multi Head Attention", description: "Deep dive into the Multi-Head Attention mechanism in Transformers.", date: "Feb 09, 2026" },
    { title: "Self Attention", description: "Understanding the Scaled Dot-Product Attention mechanism.", date: "Feb 06, 2026" },
    { title: "Introduction", description: "An overview of Generative AI and Large Language Models.", date: "Feb 01, 2026" },
  ],
  "gen_ai": [
    { title: "Tokens", description: "Deep dive into the Multi-Head Attention mechanism in Transformers.", date: "Feb 09, 2026" },
    { title: "Embeddings", description: "Understanding the Scaled Dot-Product Attention mechanism.", date: "Feb 06, 2026" },
    { title: "Transformers", description: "An overview of Generative AI and Large Language Models.", date: "Feb 01, 2026" },
    { title: "Prompting", description: "An overview of Prompting and Large Language Models.", date: "Feb 01, 2026" },
  ],
  "rag": [
    { title: "Introduction", description: "An overview of RAG and Large Language Models.", date: "Feb 01, 2026" },
    { title: "Fundamentals", description: "Building reusable logic with Python functions and decorators.", date: "Feb 06, 2026" },
  ],
  "agentic_ai": [
    { title: "Introduction", description: "An overview of Agentic AI and Large Language Models.", date: "Feb 01, 2026" },
    { title: "Functions", description: "Building reusable logic with Python functions and decorators.", date: "Feb 06, 2026" },
  ],
  "lang_chain": [
    { title: "Introduction", description: "An overview of Langchain and Large Language Models.", date: "Feb 01, 2026" },
    { title: "Functions", description: "Building reusable logic with Python functions and decorators.", date: "Feb 06, 2026" },
  ],
  "lang_graph": [
    { title: "Introduction", description: "An overview of Langchain and Large Language Models.", date: "Feb 01, 2026" },
    { title: "Fundamentals", description: "Building reusable logic with Python functions and decorators.", date: "Feb 06, 2026" },
    { title: "Cheat Sheet", description: "Building reusable logic with Python functions and decorators.", date: "Feb 06, 2026" },
  ],
  "typescript": [
    { title: "Introduction", description: "Why TypeScript? Setting up and basic types.", date: "Mar 01, 2026" },
    { title: "Interfaces vs Types", description: "Choosing the right way to define shapes.", date: "Mar 02, 2026" },
  ],
  "nextjs": [
    { title: "App Router", description: "The new way to build Next.js applications.", date: "Mar 03, 2026" },
    { title: "Server Actions", description: "Mutate data without client-side JS.", date: "Mar 04, 2026" },
  ],
  "nodejs": [
    { title: "Event Loop", description: "Deep dive into non-blocking I/O.", date: "Mar 05, 2026" },
  ],
  "tailwind": [
    { title: "JIT Mode", description: "Understanding how Tailwind generates CSS on the fly.", date: "Mar 06, 2026" },
  ],
  "dsa": [
    { title: "Arrays & Hashing", description: "Big O notation and basic array operations.", date: "Mar 07, 2026" },
  ],
  "algorithms": [
    { title: "Time Complexity", description: "How to measure algorithm performance.", date: "Mar 07, 2026" },
  ],
  "docker": [
    { title: "Introduction", description: "What Docker is, why it matters, and how to install it.", date: "Aug 03, 2026" },
    { title: "Containers vs VMs", description: "The fundamental difference between containers and virtual machines.", date: "Aug 03, 2026" },
    { title: "Docker Architecture", description: "Client, Daemon, and Registry — how Docker works internally.", date: "Aug 03, 2026" },
    { title: "Images", description: "Docker images, layers, caching, and image commands.", date: "Aug 03, 2026" },
    { title: "Dockerfile", description: "Writing Dockerfiles with FROM, RUN, COPY, CMD, and more.", date: "Aug 03, 2026" },
    { title: "Containers", description: "Running, managing, inspecting, and debugging containers.", date: "Aug 03, 2026" },
    { title: "Volumes", description: "Persistent data storage with named volumes and bind mounts.", date: "Aug 03, 2026" },
    { title: "Networking", description: "Bridge, host, and custom networks for container communication.", date: "Aug 03, 2026" },
    { title: "Docker Compose", description: "Define and run multi-container apps with a single YAML file.", date: "Aug 03, 2026" },
    { title: "Registry", description: "Docker Hub, private registries, push and pull workflows.", date: "Aug 03, 2026" },
    { title: "Multi-Stage Builds", description: "Build tiny production images by separating build and runtime.", date: "Aug 03, 2026" },
    { title: "Environment Variables", description: "Configure containers securely with environment variables.", date: "Aug 03, 2026" },
    { title: "Bind Mounts", description: "Real-time host-to-container file sync for development.", date: "Aug 03, 2026" },
    { title: "Docker Commands", description: "Complete Docker command reference for daily use.", date: "Aug 03, 2026" },
    { title: "Whats Next", description: "Kubernetes, cloud, CI/CD — your roadmap after Docker.", date: "Aug 03, 2026" },
  ],
  "k8s": [
    { title: "Pods", description: "The smallest deployable unit in Kubernetes.", date: "Mar 07, 2026" },
  ],
  "aws": [
    { title: "EC2 Essentials", description: "Getting started with virtual servers.", date: "Mar 07, 2026" },
  ],
  "cybersecurity": [
    { title: "OWASP Top 10", description: "The most critical web security risks.", date: "Mar 07, 2026" },
  ],
  "gym": [
    { title: "Fundamentals", description: "Introduction to Gym and workout plans.", date: "Mar 07, 2026" },
  ],
};
