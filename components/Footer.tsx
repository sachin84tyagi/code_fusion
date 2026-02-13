import React from "react";

export default function Footer() {
    return (
        <footer className="mt-auto border-t py-12 bg-background">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} CodeFusion. All Rights Reserved.
                </p>
                <div className="mt-4 flex justify-center gap-6 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-primary transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
}
