import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});
const sourceSerif = Source_Serif_4({
    subsets: ["latin"],
    variable: "--font-source-serif",
    display: "swap",
    style: ["normal", "italic"],
});
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});

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
            <body className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
                <Suspense fallback={null}>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </Suspense>
            </body>
        </html>
    );
}
