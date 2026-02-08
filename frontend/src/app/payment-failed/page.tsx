"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCcw, Mail } from "lucide-react";
import Link from "next/link";

export default function PaymentFailedPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full"
            >
                <div className="bg-gradient-to-br from-card to-secondary border border-border rounded-[2rem] p-12 text-center">
                    {/* Error Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center mb-8"
                    >
                        <XCircle size={48} className="text-white" />
                    </motion.div>

                    {/* Error Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h1 className="text-4xl font-black mb-4">Payment Failed</h1>

                        <p className="text-xl text-muted-foreground mb-8">
                            We couldn't process your payment. Don't worry, no charges were made.
                        </p>

                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 mb-8 text-left">
                            <h3 className="font-bold mb-3">Common reasons for payment failure:</h3>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                                <li>• Insufficient funds in your account</li>
                                <li>• Incorrect card details or CVV</li>
                                <li>• Card expired or blocked by bank</li>
                                <li>• Network connectivity issues</li>
                                <li>• Daily transaction limit exceeded</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link
                                href="/"
                                className="btn-primary px-8 py-4 rounded-2xl font-bold inline-flex items-center justify-center gap-2"
                            >
                                <RefreshCcw size={20} />
                                Try Again
                            </Link>
                            <Link
                                href="/"
                                className="bg-secondary hover:bg-secondary/80 px-8 py-4 rounded-2xl font-bold inline-flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={20} />
                                Back to Home
                            </Link>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <Mail size={16} className="text-primary" />
                                <span>
                                    Need help?{" "}
                                    <a href="mailto:support@burnout.os" className="text-primary font-medium hover:underline">
                                        Contact Support
                                    </a>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
