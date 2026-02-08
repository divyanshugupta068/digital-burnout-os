"use client";

import { AlertTriangle, RefreshCcw, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ErrorDisplayProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    showHomeButton?: boolean;
}

export function ErrorDisplay({
    title = "Something went wrong",
    message = "We encountered an unexpected error. Please try again.",
    onRetry,
    showHomeButton = true
}: ErrorDisplayProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-rose-500/10">
                        <AlertTriangle className="w-12 h-12 text-rose-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <p className="text-muted-foreground">{message}</p>
                </div>

                <div className="flex gap-3 justify-center">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                        >
                            <RefreshCcw size={20} />
                            Try Again
                        </button>
                    )}
                    {showHomeButton && (
                        <Link
                            href="/"
                            className="btn-secondary px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                        >
                            <Home size={20} />
                            Go Home
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

interface InlineErrorProps {
    message: string;
    onDismiss?: () => void;
}

export function InlineError({ message, onDismiss }: InlineErrorProps) {
    return (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
                <p className="text-sm text-rose-500">{message}</p>
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="text-rose-500 hover:text-rose-600 shrink-0"
                >
                    ✕
                </button>
            )}
        </div>
    );
}

interface FormErrorProps {
    errors: Record<string, string>;
}

export function FormErrors({ errors }: FormErrorProps) {
    const errorMessages = Object.values(errors).filter(Boolean);

    if (errorMessages.length === 0) return null;

    return (
        <div className="space-y-2">
            {errorMessages.map((error, index) => (
                <InlineError key={index} message={error} />
            ))}
        </div>
    );
}

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[300px] p-6">
            <div className="text-center space-y-4 max-w-md">
                {icon && (
                    <div className="flex justify-center opacity-50">
                        {icon}
                    </div>
                )}

                <div className="space-y-2">
                    <h3 className="text-xl font-bold">{title}</h3>
                    {description && (
                        <p className="text-muted-foreground text-sm">{description}</p>
                    )}
                </div>

                {action && (
                    <button
                        onClick={action.onClick}
                        className="btn-primary px-6 py-3 rounded-xl font-bold"
                    >
                        {action.label}
                    </button>
                )}
            </div>
        </div>
    );
}

// Network error component
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
    return (
        <ErrorDisplay
            title="Connection Error"
            message="Unable to connect to the server. Please check your internet connection and try again."
            onRetry={onRetry}
            showHomeButton={false}
        />
    );
}

// 404 Not Found component
export function NotFoundError() {
    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="text-center space-y-6">
                <h1 className="text-9xl font-black gradient-text">404</h1>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold">Page Not Found</h2>
                    <p className="text-muted-foreground">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="btn-secondary px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                    <Link
                        href="/"
                        className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                    >
                        <Home size={20} />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Validation error helper
export function getErrorMessage(error: unknown): string {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    if (error && typeof error === 'object' && 'message' in error) {
        return String(error.message);
    }
    return 'An unexpected error occurred';
}
