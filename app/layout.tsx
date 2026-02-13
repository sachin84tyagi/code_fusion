import React, { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/MainLayout";

export const metadata: Metadata = {
    title: "CodeFusion | Modern Tech Learning",
    description: "A professional platform for JS, React, and Python developers.",
    icons: {
        icon: "/icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Suspense fallback={null}>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </Suspense>
            </body>
        </html>
    );
}
