import { BookOpen, Code2, Database } from "lucide-react";
import { jsTopics } from "./utils/js";
import { reactTopics } from "./utils/react_js";
import { pythonTopics } from "./utils/python";
import { pythonAITopics } from "./utils/python_for_ai";
import { generativeAITopics } from "./utils/generative_ai";
import { promptEngTopics } from "./utils/prompt_engineering";

export const navItems = [
  { name: "js", value: "JS", link: jsTopics, icon: Code2 },
  { name: "react_js", value: "React JS", link: reactTopics, icon: BookOpen },
  { name: "python", value: "Python", link: pythonTopics, icon: Database },
  { name: "python_for_ai", value: "Python for AI", link: pythonAITopics, icon: Database },
  { name: "prompt_engineering", value: "Prompt Engineering", link: promptEngTopics, icon: Database },
  { name: "generative_ai", value: "Generative AI", link: generativeAITopics, icon: Database },

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
    { title: "Mastering Closures", description: "Deep dive into the world of JavaScript closures and how they work under the hood.", date: "Feb 12, 2026" },
    { title: "Async/Await Patterns", description: "Clean ways to handle asynchronous operations in modern JavaScript applications.", date: "Feb 10, 2026" },
    { title: "Modern ES6+ Features", description: "Top features you should be using today to write more efficient and clean JS code.", date: "Feb 05, 2026" },
  ],
  "react_js": [
    { title: "React 19 New Features", description: "What's new in React 19? Exploring the compiler, new hooks, and more.", date: "Feb 11, 2026" },
    { title: "Effective UseMemo & UseCallback", description: "Optimizing your React application's performance with memoization hooks.", date: "Feb 08, 2026" },
    { title: "Server Components vs Client Components", description: "Understanding the hybrid architecture of modern Next.js applications.", date: "Feb 03, 2026" },
  ],
  "python": [
    { title: "FastAPI for Production", description: "Building lightning-fast APIs with Python and FastAPI with best practices.", date: "Feb 09, 2026" },
    { title: "Python Decorators Decystified", description: "How to use and create custom decorators to write more pythonic code.", date: "Feb 06, 2026" },
    { title: "Pandas for Data Analysis", description: "A comprehensive guide to manipulating and analyzing data with Pandas.", date: "Feb 01, 2026" },
  ],
  "python_for_ai": [
    { title: "FastAPI for Production", description: "Building lightning-fast APIs with Python and FastAPI with best practices.", date: "Feb 09, 2026" },
    { title: "Python Decorators Decystified", description: "How to use and create custom decorators to write more pythonic code.", date: "Feb 06, 2026" },
    { title: "Pandas for Data Analysis", description: "A comprehensive guide to manipulating and analyzing data with Pandas.", date: "Feb 01, 2026" },
  ],
  "prompt_engineering": [
    { title: "FastAPI for Production", description: "Building lightning-fast APIs with Python and FastAPI with best practices.", date: "Feb 09, 2026" },
    { title: "Python Decorators Decystified", description: "How to use and create custom decorators to write more pythonic code.", date: "Feb 06, 2026" },
    { title: "Pandas for Data Analysis", description: "A comprehensive guide to manipulating and analyzing data with Pandas.", date: "Feb 01, 2026" },
  ],
  "generative_ai": [
    { title: "FastAPI for Production", description: "Building lightning-fast APIs with Python and FastAPI with best practices.", date: "Feb 09, 2026" },
    { title: "Python Decorators Decystified", description: "How to use and create custom decorators to write more pythonic code.", date: "Feb 06, 2026" },
    { title: "Pandas for Data Analysis", description: "A comprehensive guide to manipulating and analyzing data with Pandas.", date: "Feb 01, 2026" },
  ],
};
