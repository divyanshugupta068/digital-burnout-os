"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Download, Sparkles } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan");

    useEffect(() => {
        // Trigger confetti animation
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            confetti({
                particleCount: 3,
                angle: randomInRange(55, 125),
                spread: randomInRange(50, 70),
                origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
                colors: ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full"
            >
                <div className="bg-gradient-to-br from-card to-secondary border border-border rounded-[2rem] p-12 text-center">
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-8"
                    >
                        <CheckCircle size={48} className="text-white" />
                    </motion.div>

                    {/* Success Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="text-primary" size={24} />
                            <h1 className="text-4xl font-black">Payment Successful!</h1>
                            <Sparkles className="text-primary" size={24} />
                        </div>

                        <p className="text-xl text-muted-foreground mb-8">
                            Welcome to BurnoutOS {plan === "pro" ? "Pro" : "Enterprise"}! 🎉
                        </p>

                        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8">
                            <p className="text-sm mb-4">
                                Your subscription is now active. We've sent a confirmation email with your invoice and setup instructions.
                            </p>
                            <div className="text-xs text-muted-foreground">
                                <p>✓ Full access to all {plan === "pro" ? "Pro" : "Enterprise"} features</p>
                                <p>✓ Premium support enabled</p>
                                <p>✓ AI-powered insights unlocked</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/dashboard"
                                className="btn-primary px-8 py-4 rounded-2xl font-bold inline-flex items-center justify-center gap-2"
                            >
                                Go to Dashboard <ArrowRight size={20} />
                            </Link>
                            <button
                                onClick={() => window.print()}
                                className="bg-secondary hover:bg-secondary/80 px-8 py-4 rounded-2xl font-bold inline-flex items-center justify-center gap-2"
                            >
                                <Download size={20} />
                                Download Invoice
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground mt-8">
                            Need help getting started? Check out our{" "}
                            <Link href="/docs" className="text-primary hover:underline">
                                documentation
                            </Link>{" "}
                            or{" "}
                            <Link href="/support" className="text-primary hover:underline">
                                contact support
                            </Link>
                            .
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
