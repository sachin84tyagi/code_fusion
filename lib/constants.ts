import { BookOpen, Code2, Database } from "lucide-react";
import { jsTopics } from "./utils/js";
import { reactTopics } from "./utils/react_js";
import { pythonTopics } from "./utils/python";
import { pythonAITopics } from "./utils/python_for_ai";
import { generativeAITopics } from "./utils/generative_ai";
import { genAITopics } from "./utils/gen_ai";
import { promptEngTopics } from "./utils/prompt_engineering";

export const navItems = [
  { name: "js", value: "JS", link: jsTopics, icon: Code2 },
  { name: "react_js", value: "React JS", link: reactTopics, icon: BookOpen },
  { name: "python", value: "Python", link: pythonTopics, icon: Database },
  { name: "python_for_ai", value: "Python for AI", link: pythonAITopics, icon: Database },
  { name: "prompt_engineering", value: "Prompt Engineering", link: promptEngTopics, icon: Database },
  { name: "generative_ai", value: "Generative AI", link: generativeAITopics, icon: Database },
  { name: "gen_ai", value: "Gen AI", link: genAITopics, icon: Database }
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
    { title: "Transformers", description: "An overview of Generat ve AI and Large Language Models.", date: "Feb 01, 2026" },
    { title: "Prompting", description: "An overview of Prompting and Large Language Models.", date: "Feb 01, 2026" },
  ],
};
