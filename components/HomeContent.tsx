"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ContentCard from "@/components/ContentCard";
import TutorialView from "@/components/TutorialView";
import { Sparkles } from "lucide-react";
import { contentData, StaticKeys, navItems } from "@/lib/constants";

interface HomeContentProps {
    tutorialContent: string | null;
}

export default function HomeContent({ tutorialContent }: HomeContentProps) {
    const searchParams = useSearchParams();

    const activeCategory = (searchParams.get("category") as StaticKeys) || "JS";
    const activeSubCategory = searchParams.get("subCategory") || "";
    const displayCategory = contentData[activeCategory] ? activeCategory : "JS";
    const displayCategoryView = navItems.find(item => item.name === activeCategory)?.value || "JS";
    console.log("-----------------------------------------------------")
    console.log("searchParams :: ", searchParams);
    console.log("activeCategory :: ", activeCategory);
    console.log("activeSubCategory :: ", activeSubCategory);
    console.log("displayCategory :: ", displayCategory);
    console.log("displayCategoryView :: ", displayCategoryView);
    console.log("contentData :: ", contentData);
    console.log("contentData[activeCategory] :: ", contentData[activeCategory]);
    console.log("navItems :: ", navItems);
    // Filtering logic (mocking subcategory data for demonstration)
    const filteredContent = contentData[activeCategory].filter((item) => {
        if (!activeSubCategory) return true;
        // Simple mock matching for demonstration purposes
        return item.title.toLowerCase().includes(activeSubCategory.toLowerCase()) ||
            item.description.toLowerCase().includes(activeSubCategory.toLowerCase());
    });

    return (
        <div className="flex flex-col gap-8 py-8 md:flex-row lg:gap-12">
            {/* Sidebar - Vertically responsive */}
            <Sidebar />

            {/* Content Area */}
            <div className="flex-1 space-y-8">
                {activeSubCategory && tutorialContent ? (
                    <TutorialView category={displayCategoryView} title={activeSubCategory} content={tutorialContent} />
                ) : (
                    <>
                        <header className="flex items-center justify-between border-b pb-4">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                    <Sparkles className="h-6 w-6 text-yellow-500" />
                                    {displayCategoryView} {activeSubCategory ? `| ${activeSubCategory}` : "Articles"}
                                </h1>
                                <p className="text-muted-foreground">
                                    Explore our latest curated content about {displayCategory} {activeSubCategory && `> ${activeSubCategory}`}.
                                </p>
                            </div>
                        </header>

                        {/* Dynamic Grid */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            {filteredContent.map((content, idx) => (
                                <ContentCard
                                    key={idx}
                                    title={content.title}
                                    description={content.description}
                                    category={displayCategory}
                                    date={content.date}
                                />
                            ))}
                        </div>

                        {/* Empty State / Bottom Message */}
                        {filteredContent.length === 0 && (
                            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed text-muted-foreground p-8 text-center">
                                <div className="space-y-2">
                                    <p className="text-lg font-medium">No articles found</p>
                                    <p className="text-sm">Try selecting a different subcategory or checkout the main topics.</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
