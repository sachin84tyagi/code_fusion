import React from "react";

export default function Footer() {
    return (
        <footer className="mt-auto border-t py-12 bg-background">
            <div className="container mx-auto px-4 text-center">
                <p className="text-[0.8125rem] text-muted-foreground tracking-[-0.005em]">
                    &copy; {new Date().getFullYear()} CodeFusion. All Rights Reserved.
                </p>
                <div className="mt-4 flex justify-center gap-6 text-[0.8125rem] text-muted-foreground">
                    <a href="#" className="hover:text-primary transition-colors font-medium">Privacy Policy</a>
                    <a href="#" className="hover:text-primary transition-colors font-medium">Terms of Service</a>
                    <a href="#" className="hover:text-primary transition-colors font-medium">Contact</a>
                </div>
            </div>
        </footer>
    );
}
