"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    size?: number;
    className?: string;
}

export function LoadingSpinner({ size = 24, className = "" }: LoadingSpinnerProps) {
    return (
        <Loader2
            size={size}
            className={`animate-spin text-primary ${className}`}
        />
    );
}

interface LoadingButtonProps {
    children: React.ReactNode;
    loading?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger";
}

export function LoadingButton({
    children,
    loading = false,
    onClick,
    disabled = false,
    className = "",
    type = "button",
    variant = "primary"
}: LoadingButtonProps) {
    const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "bg-primary hover:bg-primary/90 text-white",
        secondary: "bg-secondary hover:bg-secondary/80 text-foreground",
        danger: "bg-rose-500 hover:bg-rose-600 text-white"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {loading && <LoadingSpinner size={20} className="text-current" />}
            {children}
        </button>
    );
}

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ className = "", variant = "rectangular" }: SkeletonProps) {
    const baseStyles = "animate-pulse bg-muted";

    const variantStyles = {
        text: "h-4 w-full rounded",
        circular: "rounded-full",
        rectangular: "rounded-lg"
    };

    return <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} />;
}

export function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <LoadingSpinner size={48} />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-10 w-32 mt-4" />
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            <Skeleton className="h-12 w-full" /> {/* Header */}
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Stats cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>

            {/* Chart skeleton */}
            <Skeleton className="h-80 w-full" />
        </div>
    );
}

interface LoadingOverlayProps {
    text?: string;
}

export function LoadingOverlay({ text = "Loading..." }: LoadingOverlayProps) {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
                <LoadingSpinner size={48} />
                <p className="text-lg font-semibold">{text}</p>
            </div>
        </div>
    );
}

// Inline loading state for forms/buttons
export function InlineLoader({ text = "Processing..." }: { text?: string }) {
    return (
        <div className="flex items-center gap-3 text-muted-foreground">
            <LoadingSpinner size={16} />
            <span className="text-sm">{text}</span>
        </div>
    );
}
