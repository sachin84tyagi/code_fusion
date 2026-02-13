"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BookOpen, Code2, Database, ChevronDown, Search, Check } from "lucide-react";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { subCategoriesData, StaticKeys, navItems } from "@/lib/constants";

export default function Sidebar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeCategory = searchParams.get("category") || "js";
    const activeSubCategory = searchParams.get("subCategory") || "";

    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const filteredSubCategories = useMemo(() => {
        const subs = subCategoriesData(activeCategory as StaticKeys) || [];
        const newSubs = subs[activeCategory as StaticKeys]
        
        return newSubs.filter(sub =>
            sub.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [activeCategory, searchQuery]);

    const handleCategorySelect = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("category", category);
        params.delete("subCategory");
        router.push(`?${params.toString()}`);
        setSearchQuery("");
        setIsDropdownOpen(false);
    };

    const handleSubCategorySelect = (sub: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (sub) {
            params.set("subCategory", sub);
        } else {
            params.delete("subCategory");
        }
        router.push(`?${params.toString()}`);
        setIsDropdownOpen(false);
        setSearchQuery("");
    };

    return (
        <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-20 rounded-xl border bg-card p-4 shadow-sm space-y-6">
                {/* Searchable Subcategory Dropdown */}
                <div className="space-y-2">
                    <label className="px-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {activeCategory} Topics
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm transition-all hover:bg-secondary/50"
                        >
                            <span className="truncate">
                                {activeSubCategory || "All Topics"}
                            </span>
                            <ChevronDown className={cn("h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute left-0 right-0 mt-2 z-50 rounded-lg border bg-background shadow-xl animate-in fade-in zoom-in-95">
                                <div className="p-2 border-b bg-background rounded-t-lg">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search topic..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full rounded-md border bg-secondary/30 py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-48 overflow-y-auto p-1">
                                    <button
                                        onClick={() => handleSubCategorySelect("")}
                                        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-secondary transition-colors"
                                    >
                                        All Topics
                                        {!activeSubCategory && <Check className="h-3 w-3 text-primary" />}
                                    </button>
                                    {filteredSubCategories.map((sub) => (
                                        <button
                                            key={sub}
                                            onClick={() => handleSubCategorySelect(sub)}
                                            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-secondary transition-colors text-left"
                                        >
                                            {sub}
                                            {activeSubCategory === sub && <Check className="h-3 w-3 text-primary" />}
                                        </button>
                                    ))}
                                    {filteredSubCategories.length === 0 && (
                                        <div className="py-2 px-2 text-center text-xs text-muted-foreground">
                                            No results found.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Categories */}
                <div className="space-y-2">
                    <h2 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Categories
                    </h2>
                    <nav className="space-y-1">
                        {navItems.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => handleCategorySelect(cat.name)}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                    activeCategory === cat.name
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <cat.icon className="h-4 w-4" />
                                {cat.value}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </aside>
    );
}
