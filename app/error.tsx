"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
                Something went wrong!
            </h2>
            <p className="mb-8 max-w-md text-muted-foreground">
                We encountered an error while loading this content. This might be a temporary issue.
            </p>
            <button
                onClick={() => reset()}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
            >
                <RefreshCcw className="h-4 w-4" />
                Try again
            </button>
        </div>
    );
}
