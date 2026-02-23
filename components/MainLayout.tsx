import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground">
            <Header />
            <main className="mx-auto w-full max-w-7xl flex-grow px-4 sm:px-6 lg:px-8 pt-8 pb-16 transition-all">
                {children}
            </main>
            <Footer />
        </div>
    );
}
