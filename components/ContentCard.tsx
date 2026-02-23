import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ContentCardProps {
    title: string;
    description: string;
    category: string;
    date: string;
    slug: string;
    activeCategoryKey: string;
}

export default function ContentCard({ title, description, category, date, slug, activeCategoryKey }: ContentCardProps) {
    const href = `/?category=${activeCategoryKey}&subCategory=${encodeURIComponent(slug)}`;

    return (
        <Link href={href} className="group relative rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-border hover:shadow-md block">
            <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary uppercase tracking-wide">
                    {category}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{date}</span>
            </div>
            <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {title}
            </h3>
            <p className="mb-6 text-muted-foreground line-clamp-2 leading-relaxed text-sm">
                {description}
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                Read Tutorial <ArrowRight className="h-4 w-4" />
            </div>
        </Link>
    );
}
