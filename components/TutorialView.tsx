"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Clock, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const PreContext = React.createContext(false);

interface TutorialViewProps {
    content: string;
    title: string;
    category: string;
}

const MarkdownCode = ({ className, children, ...props }: any) => {
    const isInsidePre = React.useContext(PreContext);
    const isInline = !isInsidePre;
    return isInline ? (
        <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-foreground relative -top-[1px]" {...props}>
            {children}
        </code>
    ) : (
        <code className={className} {...props}>
            {children}
        </code>
    );
};

const MarkdownImage = ({ ...props }: any) => {
    const { src, alt } = props;
    if (!src) return null;

    return (
        <Image
            src={src as string}
            alt={alt || "Tutorial Image"}
            width={1200}
            height={630}
            className="rounded-xl border border-border shadow-sm my-5 object-cover w-full h-auto"
            loading="lazy"
        />
    );
};

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

            <header className="mb-6 lg:mb-8 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary bg-primary/10 w-fit px-2.5 py-1 rounded-full uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" />
                    <span>{category} Tutorial</span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                    {title || "Untitled Article"}
                </h1>

                <div className="flex items-center gap-4 text-muted-foreground text-xs font-medium">
                    <div className="flex items-center gap-1.5 font-semibold">
                        <Clock className="h-4 w-4" />
                        <span>{readingTime} min read</span>
                    </div>
                </div>
            </header>

            <div className="prose prose-slate dark:prose-invert max-w-[75ch] w-full">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ ...props }) => <h1 className="text-xl font-bold mt-6 mb-3 text-foreground tracking-tight" {...props} />,
                        h2: ({ ...props }) => <h2 className="text-lg font-semibold mt-6 mb-2 text-foreground border-b border-border/40 pb-1 tracking-tight flex items-center gap-2 group" {...props} />,
                        h3: ({ ...props }) => <h3 className="text-base font-medium mt-4 mb-1.5 text-foreground tracking-tight" {...props} />,
                        p: ({ ...props }) => <p className="leading-relaxed text-muted-foreground mb-3 text-[13px] sm:text-sm lg:text-[15px]" {...props} />,
                        a: ({ ...props }) => <a className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all" {...props} />,
                        strong: ({ ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                        ul: ({ ...props }) => <ul className="my-3 ml-5 list-none space-y-1.5 text-muted-foreground text-[13px] sm:text-sm lg:text-[15px]" {...props} />,
                        ol: ({ ...props }) => <ol className="my-3 ml-5 list-decimal space-y-1.5 text-muted-foreground text-[13px] sm:text-sm lg:text-[15px] marker:text-primary/70 marker:font-medium" {...props} />,
                        li: ({ ...props }) => (
                            <li className="relative pl-1.5" {...props}>
                                {props.className !== 'task-list-item' && <span className="absolute -left-5 top-2 h-1 w-1 rounded-full bg-primary/40" />}
                                {props.children}
                            </li>
                        ),
                        blockquote: ({ ...props }) => (
                            <blockquote className="relative my-4 overflow-hidden rounded-xl border border-primary/20 bg-primary/5 px-5 py-3 sm:px-6 text-muted-foreground shadow-sm">
                                <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                                <div className="italic text-[13px] sm:text-sm lg:text-[15px] opacity-95 leading-relaxed font-medium">{props.children}</div>
                            </blockquote>
                        ),
                        code: MarkdownCode,
                        pre: ({ children, ...props }) => (
                            <div className="relative my-4 group rounded-xl overflow-hidden border border-border/50 shadow-sm bg-[#1e1e1e]">
                                {/* Mac OS Window Header */}
                                <div className="flex items-center px-4 py-1.5 bg-[#2d2d2d] border-b border-white/5">
                                    <div className="flex space-x-1.5">
                                        <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                                        <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                                        <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                                    </div>
                                    <div className="ml-auto flex items-center">
                                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest pointer-events-none">Code View</span>
                                    </div>
                                </div>
                                <PreContext.Provider value={true}>
                                    <pre className="p-3 sm:p-4 overflow-x-auto text-[11px] sm:text-[13px] font-mono text-gray-300 leading-relaxed font-medium" {...props}>
                                        {children}
                                    </pre>
                                </PreContext.Provider>
                            </div>
                        ),
                        img: MarkdownImage,
                        hr: () => <hr className="my-6 border-border/50" />
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>

            <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium">You reached the end of this tutorial.</span>
                </div>
            </div>
        </article>
    );
}
