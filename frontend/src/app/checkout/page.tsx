"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Lock, Shield, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { LoadingButton } from "@/components/Loading";
import { InlineError } from "@/components/ErrorHandling";

const PLANS = {
    pro: {
        name: "Pro",
        price: 749,
        period: "/month",
        description: "For professionals serious about mental health",
        features: [
            "Everything in Free",
            "AI-powered insights",
            "30-day pattern analysis",
            "Unlimited PDF reports",
            "Priority support",
            "Calendar integration",
            "Custom goals & reminders"
        ]
    },
    enterprise: {
        name: "Enterprise",
        price: 4999,
        period: "/month",
        description: "For teams and organizations (5+ users)",
        features: [
            "Everything in Pro",
            "Team analytics dashboard",
            "Admin controls & SSO",
            "API access",
            "Dedicated success manager",
            "Custom integrations",
            "HIPAA compliance",
            "Bulk user management"
        ]
    }
};

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const planId = searchParams.get("plan") as keyof typeof PLANS;
    const [loading, setLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    const plan = PLANS[planId];

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    if (!plan) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Invalid Plan</h1>
                    <Link href="/" className="text-primary hover:underline">
                        Return to homepage
                    </Link>
                </div>
            </div>
        );
    }

    const handlePayment = async () => {
        if (!scriptLoaded) {
            toast.error("Payment gateway is loading. Please try again in a moment.");
            return;
        }

        // Check if Razorpay key is configured
        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_ID";
        if (razorpayKey === "rzp_test_YOUR_KEY_ID" || razorpayKey.includes("REPLACE")) {
            toast.error("Razorpay not configured. Please contact support.");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Creating payment order...");

        try {
            // Create order on your backend  
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            console.log('Calling API:', `${apiUrl}/api/v1/payments/create-order`);

            const response = await fetch(`${apiUrl}/api/v1/payments/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    plan_id: planId,
                    amount: plan.price,
                }),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Backend error:', errorText);
                throw new Error(`Backend error: ${response.status}`);
            }

            const order = await response.json();
            console.log('Order created:', order);

            toast.dismiss(loadingToast);
            toast.success("Opening payment gateway...");

            // Razorpay options
            const options = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: "BurnoutOS",
                description: `${plan.name} Plan Subscription`,
                order_id: order.id,
                handler: async function (response: any) {
                    // Verify payment on backend
                    const verifyToast = toast.loading("Verifying payment...");
                    try {
                        const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/payments/verify`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                plan_id: planId,
                            }),
                        });

                        toast.dismiss(verifyToast);

                        if (verifyResponse.ok) {
                            toast.success("Payment successful! Redirecting...");
                            setTimeout(() => {
                                router.push("/payment-success?plan=" + planId);
                            }, 1000);
                        } else {
                            throw new Error("Payment verification failed");
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        toast.dismiss(verifyToast);
                        toast.error("Payment verification failed. Please contact support.");
                        setTimeout(() => {
                            router.push("/payment-failed");
                        }, 2000);
                    }
                },
                prefill: {
                    name: "",
                    email: "",
                    contact: "",
                },
                theme: {
                    color: "#8b5cf6",
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        toast.dismiss(loadingToast);
                        toast("Payment cancelled", { icon: "ℹ️" });
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
            setLoading(false);
        } catch (error: any) {
            console.error("Payment error:", error);
            toast.dismiss(loadingToast);
            toast.error(`Failed to initiate payment: ${error.message || "Please try again"}`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-2 text-emerald-400">
                        <Lock size={16} />
                        <span className="text-xs font-medium">Secure Checkout</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left: Plan Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="text-primary" size={24} />
                            <h1 className="text-3xl font-black">Complete Your Purchase</h1>
                        </div>

                        <div className="bg-card border border-border rounded-3xl p-8 mb-8">
                            <div className="flex items-baseline justify-between mb-4">
                                <h2 className="text-2xl font-bold">{plan.name} Plan</h2>
                                <div className="text-right">
                                    <div className="text-3xl font-black">₹{plan.price.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">{plan.period}</div>
                                </div>
                            </div>
                            <p className="text-muted-foreground mb-6">{plan.description}</p>

                            <div className="space-y-3">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Check size={18} className="text-emerald-400 shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center gap-6 text-muted-foreground text-sm">
                            <div className="flex items-center gap-2">
                                <Shield size={16} />
                                <span>Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock size={16} />
                                <span>256-bit SSL</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCard size={16} />
                                <span>Razorpay</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Payment Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="bg-gradient-to-br from-card to-secondary border border-border rounded-3xl p-8 sticky top-24">
                            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6 pb-6 border-b border-border">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Plan</span>
                                    <span className="font-medium">{plan.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Billing Cycle</span>
                                    <span className="font-medium">Monthly</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">₹{plan.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">GST (18%)</span>
                                    <span className="font-medium">₹{Math.round(plan.price * 0.18).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-between mb-8 text-xl font-black">
                                <span>Total</span>
                                <span className="gradient-text">₹{Math.round(plan.price * 1.18).toLocaleString()}</span>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loading || !scriptLoaded}
                                className="w-full btn-primary py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={20} />
                                        Pay Securely
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-muted-foreground text-center mt-4">
                                By proceeding, you agree to our Terms of Service and Privacy Policy.
                                Your subscription will auto-renew monthly. Cancel anytime.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
