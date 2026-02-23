"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Clock, CheckCircle2 } from "lucide-react";

interface TutorialViewProps {
    content: string;
    title: string;
    category: string;
}

export default function TutorialView({ content, title, category }: TutorialViewProps) {
    const [readingProgress, setReadingProgress] = useState(0);

    // Calculate reading time (avg 200 words per minute)
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    useEffect(() => {
        const updateScrollProgress = () => {
            const currentScrollY = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                setReadingProgress(Number((currentScrollY / scrollHeight).toFixed(2)) * 100);
            }
        };

        window.addEventListener("scroll", updateScrollProgress);
        return () => window.removeEventListener("scroll", updateScrollProgress);
    }, []);

    return (
        <article className="relative w-full">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
                <div
                    className="h-full bg-primary transition-all duration-150 ease-out"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            <header className="mb-10 lg:mb-14 space-y-6">
                <div className="flex items-center gap-3 text-sm font-medium text-primary bg-primary/10 w-fit px-3 py-1.5 rounded-full">
                    <Sparkles className="h-4 w-4" />
                    <span>{category} Tutorial</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                    {title || "Untitled Article"}
                </h1>

                <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{readingTime} min read</span>
                    </div>
                </div>
            </header>

            <div className="prose prose-slate dark:prose-invert max-w-[75ch] w-full">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ ...props }) => <h1 className="text-3xl font-bold mt-10 mb-6 text-foreground tracking-tight" {...props} />,
                        h2: ({ ...props }) => <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground border-b border-border/40 pb-2 tracking-tight flex items-center gap-2 group" {...props} />,
                        h3: ({ ...props }) => <h3 className="text-xl font-medium mt-8 mb-3 text-foreground tracking-tight" {...props} />,
                        p: ({ ...props }) => <p className="leading-loose text-muted-foreground mb-6 text-base sm:text-lg" {...props} />,
                        a: ({ ...props }) => <a className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all" {...props} />,
                        strong: ({ ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                        ul: ({ ...props }) => <ul className="my-6 ml-6 list-none space-y-3 text-muted-foreground text-base sm:text-lg" {...props} />,
                        ol: ({ ...props }) => <ol className="my-6 ml-6 list-decimal space-y-3 text-muted-foreground text-base sm:text-lg marker:text-primary/70 marker:font-medium" {...props} />,
                        li: ({ ...props }) => (
                            <li className="relative pl-2" {...props}>
                                {props.className !== 'task-list-item' && <span className="absolute -left-6 top-2 h-1.5 w-1.5 rounded-full bg-primary/50" />}
                                {props.children}
                            </li>
                        ),
                        blockquote: ({ ...props }) => (
                            <blockquote className="relative my-8 overflow-hidden rounded-xl border border-primary/20 bg-primary/5 px-6 py-5 sm:px-8 text-muted-foreground shadow-sm">
                                <div className="absolute left-0 top-0 h-full w-1.5 bg-primary" />
                                <div className="italic text-base sm:text-lg opacity-90">{props.children}</div>
                            </blockquote>
                        ),
                        code: ({ className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || "");
                            const isInline = !match;
                            return isInline ? (
                                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-foreground relative -top-[1px]" {...props}>
                                    {children}
                                </code>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                        pre: ({ children, ...props }) => (
                            <div className="relative my-8 group rounded-xl overflow-hidden border border-border/50 shadow-sm bg-[#1e1e1e]">
                                {/* Mac OS Window Header */}
                                <div className="flex items-center px-4 py-3 bg-[#2d2d2d] border-b border-white/5">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                    </div>
                                    <div className="ml-auto flex items-center">
                                        {/* Optional: Add copy button logic here */}
                                        <span className="text-xs font-mono text-white/40 uppercase tracking-widest pointer-events-none">Code</span>
                                    </div>
                                </div>
                                <pre className="p-4 sm:p-6 overflow-x-auto text-sm sm:text-base font-mono text-gray-300 leading-relaxed font-medium" {...props}>
                                    {children}
                                </pre>
                            </div>
                        ),
                        img: ({ ...props }) => (
                            <img className="rounded-2xl border border-border shadow-sm my-8 object-cover w-full h-auto" loading="lazy" {...props} />
                        ),
                        hr: () => <hr className="my-10 border-border/50" />
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>

            <div className="mt-16 pt-8 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium">You reached the end of this tutorial.</span>
                </div>
            </div>
        </article>
    );
}
