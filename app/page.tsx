import React, { Suspense } from "react";
import Loading from "./loading";
import HomeContent from "@/components/HomeContent";
import { getTutorialContent } from "@/lib/docs";

export default async function HomePage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const category = typeof searchParams.category === "string" ? searchParams.category : "";
    const subCategory = typeof searchParams.subCategory === "string" ? searchParams.subCategory : "";

    // Fetch tutorial content on the server
    const tutorialContent = category && subCategory ? getTutorialContent(category, subCategory) : null;

    return (
        <Suspense fallback={<Loading />}>
            <HomeContent tutorialContent={tutorialContent} />
        </Suspense>
    );
}
