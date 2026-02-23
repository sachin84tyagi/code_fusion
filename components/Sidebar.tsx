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
            <div className="sticky top-24 pt-2 space-y-8">
                {/* Searchable Subcategory Dropdown */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                        {activeCategory} Topics
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={cn(
                                "flex w-full items-center justify-between rounded-xl border border-border/50 bg-card px-4 py-3 text-sm transition-all hover:border-border hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
                                isDropdownOpen && "ring-2 ring-primary/20 border-border shadow-sm"
                            )}
                        >
                            <span className="truncate font-medium">
                                {activeSubCategory || "All Topics"}
                            </span>
                            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isDropdownOpen && "rotate-180")} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute left-0 right-0 mt-2 z-50 rounded-xl border border-border/50 bg-background shadow-xl">
                                <div className="p-2 border-b border-border/50">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search topic..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full rounded-lg bg-secondary/30 py-2 pl-9 pr-3 text-sm focus:outline-none focus:bg-secondary/50 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-[250px] overflow-y-auto p-1.5 scrollbar-thin">
                                    <button
                                        onClick={() => handleSubCategorySelect("")}
                                        className={cn(
                                            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors text-left",
                                            !activeSubCategory ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary/50 text-muted-foreground"
                                        )}
                                    >
                                        All Topics
                                        {!activeSubCategory && <Check className="h-4 w-4" />}
                                    </button>
                                    {filteredSubCategories.map((sub) => (
                                        <button
                                            key={sub}
                                            onClick={() => handleSubCategorySelect(sub)}
                                            className={cn(
                                                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors text-left mt-1",
                                                activeSubCategory === sub ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <span className="truncate pr-4">{sub}</span>
                                            {activeSubCategory === sub && <Check className="h-4 w-4 flex-shrink-0" />}
                                        </button>
                                    ))}
                                    {filteredSubCategories.length === 0 && (
                                        <div className="py-4 px-2 text-center text-sm text-muted-foreground">
                                            No results found.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Categories */}
                <div className="space-y-3">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                        Categories
                    </h2>
                    <nav className="space-y-1">
                        {navItems.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => handleCategorySelect(cat.name)}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    activeCategory === cat.name
                                        ? "bg-secondary text-foreground"
                                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                )}
                            >
                                <cat.icon className={cn("h-4 w-4", activeCategory === cat.name ? "text-primary" : "")} />
                                {cat.value}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </aside>
    );
}
