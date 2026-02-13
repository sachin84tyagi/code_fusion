"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Menu, X, Rocket } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BookOpen, Code2, Database, ChevronDown, Search, Check } from "lucide-react";
import { navItems } from "@/lib/constants";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeCategory = searchParams.get("category") || "JS";

    const handleNavClick = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("category", category);
        params.delete("subCategory");
        router.push(`?${params.toString()}`);
        setIsOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Rocket className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold tracking-tight">CodeFusion</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => handleNavClick(item.name)}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                activeCategory === item.name ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                            )}
                        >
                            {item.value}
                        </button>
                    ))}
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden border-b bg-background p-4 animate-in slide-in-from-top-1">
                    <nav className="flex flex-col gap-4">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavClick(item.name)}
                                className={cn(
                                    "text-left text-lg font-medium transition-colors hover:text-primary",
                                    activeCategory === item.name ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {item.value}
                            </button>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
