"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Menu, X, Rocket, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { navItems } from "@/lib/constants";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const navRef = useRef<HTMLElement>(null);
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

    const checkScroll = () => {
        if (navRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (navRef.current) {
            const scrollAmount = direction === 'left' ? -250 : 250;
            navRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
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
                <div className="hidden md:flex flex-1 items-center justify-center max-w-[calc(100%-200px)] px-4">
                    <div className="relative w-full flex items-center group">
                        {canScrollLeft && (
                            <button 
                                onClick={() => scroll('left')}
                                className="absolute left-0 z-10 p-1 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-sm hover:bg-accent text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                        )}
                        <div className="relative w-full overflow-hidden mask-horizontal">
                            <nav 
                                ref={navRef}
                                onScroll={checkScroll}
                                className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-1 px-4 scroll-smooth"
                            >
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => handleNavClick(item.name)}
                                        className={cn(
                                            "relative whitespace-nowrap text-sm font-medium transition-all hover:text-foreground py-2 px-1",
                                            activeCategory === item.name
                                                ? "text-foreground"
                                                : "text-muted-foreground hover:scale-105"
                                        )}
                                    >
                                        {item.value}
                                        {activeCategory === item.name && (
                                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        {canScrollRight && (
                            <button 
                                onClick={() => scroll('right')}
                                className="absolute right-0 z-10 p-1 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-sm hover:bg-accent text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

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
