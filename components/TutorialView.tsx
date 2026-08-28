"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Clock, CheckCircle2, Maximize, Minimize } from "lucide-react";
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
        <code className="rounded-md bg-muted px-1.5 py-1 font-mono text-[0.84em] font-medium text-foreground relative -top-[0.5px] tracking-tight" {...props}>
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
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const toggleFullScreen = () => {
        if (isFullScreen) {
            setIsExiting(true);
            setTimeout(() => {
                setIsFullScreen(false);
                setIsExiting(false);
            }, 250);
        } else {
            setIsFullScreen(true);
        }
    };

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
        <>
            <style>{`
                @keyframes fullScreenPopIn {
                    0% { opacity: 0; transform: scale(0.97) translateY(10px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes fullScreenPopOut {
                    0% { opacity: 1; transform: scale(1) translateY(0); }
                    100% { opacity: 0; transform: scale(0.97) translateY(10px); }
                }
                .fs-enter {
                    animation: fullScreenPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .fs-exit {
                    animation: fullScreenPopOut 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
            <article className={isFullScreen ? `fixed inset-0 z-[100] bg-background overflow-y-auto p-4 sm:p-8 md:p-12 block ${isExiting ? 'fs-exit' : 'fs-enter'}` : "relative w-full transition-all duration-300"}>
                <div className="w-full min-h-full bg-background">
                {/* Reading Progress Bar */}
                <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
                    <div
                        className="h-full bg-primary transition-all duration-150 ease-out"
                        style={{ width: `${readingProgress}%` }}
                    />
                </div>

                <header className="mb-8 lg:mb-10 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-primary bg-primary/10 w-fit px-3 py-1.5 rounded-full uppercase tracking-widest">
                            <Sparkles className="h-3 w-3" />
                            <span>{category} Tutorial</span>
                        </div>
                        <button 
                            onClick={toggleFullScreen}
                            className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 px-3 py-1.5 rounded-lg"
                        >
                            {isFullScreen ? (
                                <><Minimize className="h-3.5 w-3.5" /> <span>Exit Full Screen</span></>
                            ) : (
                                <><Maximize className="h-3.5 w-3.5" /> <span>Read in Full Screen</span></>
                            )}
                        </button>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold tracking-[-0.03em] text-foreground leading-[1.2]">
                        {title || "Untitled Article"}
                    </h1>

                    <div className="flex items-center gap-4 text-muted-foreground text-[13px] font-medium">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{readingTime} min read</span>
                        </div>
                    </div>
                </header>

            <div className={`prose prose-slate dark:prose-invert w-full font-serif ${isFullScreen ? 'max-w-none' : 'max-w-[72ch]'}`}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ ...props }) => <h1 className="font-sans text-[1.5rem] sm:text-[1.65rem] font-bold mt-10 mb-4 text-foreground tracking-[-0.025em] leading-[1.25]" {...props} />,
                        h2: ({ ...props }) => <h2 className="font-sans text-[1.25rem] sm:text-[1.35rem] font-semibold !mt-8 !mb-3 text-foreground border-b border-border/40 pb-2 tracking-[-0.02em] leading-[1.3] flex items-center gap-2 group" {...props} />,
                        h3: ({ ...props }) => <h3 className="font-sans text-[1.1rem] sm:text-[1.15rem] font-semibold !mt-6 !mb-2 text-foreground tracking-[-0.015em] leading-[1.35]" {...props} />,
                        p: ({ ...props }) => <p className="leading-[1.8] text-foreground/80 !mb-4 !mt-0 text-[0.95rem] sm:text-base lg:text-[1.0625rem]" {...props} />,
                        a: ({ ...props }) => <a className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all" {...props} />,
                        strong: ({ ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                        ul: ({ ...props }) => <ul className="my-4 ml-5 list-none space-y-2 text-foreground/80 text-[0.95rem] sm:text-base lg:text-[1.0625rem]" {...props} />,
                        ol: ({ ...props }) => <ol className="my-4 ml-5 list-decimal space-y-2 text-foreground/80 text-[0.95rem] sm:text-base lg:text-[1.0625rem] marker:text-primary/70 marker:font-medium" {...props} />,
                        li: ({ ...props }) => (
                            <li className="relative pl-1.5 leading-[1.75]" {...props}>
                                {props.className !== 'task-list-item' && <span className="absolute -left-5 top-[0.65em] h-1.5 w-1.5 rounded-full bg-primary/30" />}
                                {props.children}
                            </li>
                        ),
                        blockquote: ({ ...props }) => (
                            <blockquote className="relative my-6 overflow-hidden rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 sm:px-6 text-foreground/75 shadow-sm">
                                <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                                <div className="italic text-[0.95rem] sm:text-base lg:text-[1.0625rem] leading-[1.7] font-normal">{props.children}</div>
                            </blockquote>
                        ),
                        code: MarkdownCode,
                        pre: ({ children, ...props }) => (
                            <div className="relative my-6 group rounded-xl overflow-hidden border border-border/50 shadow-sm bg-[#1e1e1e]">
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
                                    <pre className="p-3 sm:p-4 overflow-x-auto text-[12px] sm:text-[13.5px] font-mono text-gray-300 leading-[1.7] font-normal" {...props}>
                                        {children}
                                    </pre>
                                </PreContext.Provider>
                            </div>
                        ),
                        img: MarkdownImage,
                        hr: () => <hr className="!my-6 border-border/50" />
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>

            <div className="mt-10 pt-5 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-muted-foreground font-sans">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-[0.9375rem]">You reached the end of this tutorial.</span>
                </div>
            </div>
            </div>
            </article>
        </>
    );
}
