import { BookOpen, Code2, Database, Shield, Server, Cpu, Layout, Globe, Box, Workflow, Cloud, Lock } from "lucide-react";
import { jsTopics } from "./utils/js";
import { reactTopics } from "./utils/react_js";
import { pythonTopics } from "./utils/python";
import { pythonAITopics } from "./utils/python_for_ai";
import { generativeAITopics } from "./utils/generative_ai";
import { genAITopics } from "./utils/gen_ai";
import { promptEngTopics } from "./utils/prompt_engineering";
import { agenticAITopics } from "./utils/agentic_ai";
import { langChainAITopics } from "./utils/lang_chain";
//import { langGraphAITopics } from "./utils/langgraph";
import {
  typescriptTopics, nextjsTopics, nodejsTopics, tailwindTopics,
  dsaTopics, algorithmsTopics, dockerTopics, k8sTopics,
  awsTopics, cyberTopics
} from "./utils/dev_docs";

export const navItems = [
  { name: "js", value: "JS", link: jsTopics, icon: Code2 },
  { name: "react_js", value: "React JS", link: reactTopics, icon: BookOpen },
  { name: "python", value: "Python", link: pythonTopics, icon: Database },
  { name: "python_for_ai", value: "Python for AI", link: pythonAITopics, icon: Database },
  { name: "prompt_engineering", value: "Prompt Engineering", link: promptEngTopics, icon: Database },
  { name: "generative_ai", value: "Generative AI", link: generativeAITopics, icon: Database },
  { name: "gen_ai", value: "Gen AI", link: genAITopics, icon: Database },
  { name: "agentic_ai", value: "Agentic AI", link: agenticAITopics, icon: Database },
  { name: "lang_chain", value: "Langchain", link: langChainAITopics, icon: Database },
  //{ name: "langgraph", value: "Langgraph", link: langGraphAITopics, icon: Database },
  { name: "typescript", value: "TypeScript", link: typescriptTopics, icon: Code2 },
  { name: "nextjs", value: "Next.js", link: nextjsTopics, icon: Globe },
  { name: "nodejs", value: "Node.js", link: nodejsTopics, icon: Server },
  { name: "tailwind", value: "Tailwind CSS", link: tailwindTopics, icon: Layout },
  { name: "dsa", value: "Data Structures", link: dsaTopics, icon: Cpu },
  { name: "algorithms", value: "Algorithms", link: algorithmsTopics, icon: Workflow },
  { name: "docker", value: "Docker", link: dockerTopics, icon: Box },
  { name: "k8s", value: "Kubernetes", link: k8sTopics, icon: Server },
  { name: "aws", value: "AWS", link: awsTopics, icon: Cloud },
  { name: "cybersecurity", value: "Cybersecurity", link: cyberTopics, icon: Lock },
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
  "agentic_ai": [
    { title: "Introduction", description: "An overview of Agentic AI and Large Language Models.", date: "Feb 01, 2026" },
    { title: "Functions", description: "Building reusable logic with Python functions and decorators.", date: "Feb 06, 2026" },
  ],
  "lang_chain": [
    { title: "Introduction", description: "An overview of Langchain and Large Language Models.", date: "Feb 01, 2026" },
    { title: "Functions", description: "Building reusable logic with Python functions and decorators.", date: "Feb 06, 2026" },
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
    { title: "Containers vs VMs", description: "The fundamental differences.", date: "Mar 07, 2026" },
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
};
