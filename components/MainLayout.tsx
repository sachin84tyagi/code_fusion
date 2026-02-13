import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="container mx-auto flex-grow px-4 transition-all lg:px-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}
