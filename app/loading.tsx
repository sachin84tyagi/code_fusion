import { Sparkles } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <Sparkles className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-yellow-500 animate-pulse" />
            </div>
            <p className="font-medium text-muted-foreground animate-pulse">
                Synchronizing content...
            </p>
        </div>
    );
}
