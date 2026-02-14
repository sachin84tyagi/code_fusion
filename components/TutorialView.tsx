"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";

interface TutorialViewProps {
    content: string;
    title: string;
    category: string;
}

export default function TutorialView({ content, title, category }: TutorialViewProps) {
    return (
        <article className="max-w-none prose prose-slate prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-code:text-gray-900">
            <header className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-yellow-500" />
                        {category} {title ? `| ${title}` : "Articles"}
                    </h1>
                    <p className="text-muted-foreground">
                        Explore our latest curated content about {category} {title && `> ${title}`}.
                    </p>
                </div>
            </header>

            <div className="relative rounded-2xl border bg-card/30 p-8 shadow-sm backdrop-blur-sm">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h2: ({ ...props }) => <h2 className="text-2xl font-bold mt-4 mb-3 text-foreground border-b pb-2" {...props} />,
                        h3: ({ ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground" {...props} />,
                        p: ({ ...props }) => <p className="leading-7 text-muted-foreground mb-3" {...props} />,
                        code: ({ ...props }) => (
                            <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-sm font-medium text-primary" {...props} />
                        ),
                        pre: ({ ...props }) => (
                            <pre className="overflow-x-auto rounded-xl bg-gray-100 p-6 my-4 shadow-sm text-gray-900 border border-gray-200" {...props} />
                        ),
                        ul: ({ ...props }) => <ul className="my-3 ml-6 list-disc space-y-3 text-muted-foreground" {...props} />,
                        ol: ({ ...props }) => <ol className="my-3 ml-6 list-decimal space-y-3 text-muted-foreground" {...props} />,
                        li: ({ ...props }) => <li className="pl-1" {...props} />,
                        blockquote: ({ ...props }) => (
                            <blockquote className="border-l-4 border-primary/40 bg-primary/5 px-6 py-4 italic rounded-r-lg my-4" {...props} />
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </article>
    );
}
