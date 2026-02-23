"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Menu, X, Rocket } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
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
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div
                    className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
                    onClick={() => router.push('/')}
                >
                    <div className="rounded-lg bg-primary/10 p-1.5 flex items-center justify-center">
                        <Rocket className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground">CodeFusion</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => handleNavClick(item.name)}
                            className={cn(
                                "relative text-sm font-medium transition-colors hover:text-foreground py-4",
                                activeCategory === item.name ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {item.value}
                            {activeCategory === item.name && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden border-b border-border/40 bg-background/95 backdrop-blur-md p-4 animate-in slide-in-from-top-2">
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavClick(item.name)}
                                className={cn(
                                    "text-left px-4 py-3 rounded-xl text-base font-medium transition-colors hover:bg-secondary/50",
                                    activeCategory === item.name ? "bg-secondary text-foreground" : "text-muted-foreground"
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
