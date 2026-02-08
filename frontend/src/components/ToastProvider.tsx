"use client";

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                // Default options
                duration: 4000,
                style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                // Success
                success: {
                    duration: 3000,
                    iconTheme: {
                        primary: 'hsl(var(--primary))',
                        secondary: 'white',
                    },
                    style: {
                        background: 'hsl(var(--primary) / 0.1)',
                        border: '1px solid hsl(var(--primary) / 0.3)',
                    },
                },
                // Error
                error: {
                    duration: 5000,
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: 'white',
                    },
                    style: {
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                    },
                },
                // Loading
                loading: {
                    iconTheme: {
                        primary: 'hsl(var(--primary))',
                        secondary: 'white',
                    },
                },
            }}
        />
    );
}
