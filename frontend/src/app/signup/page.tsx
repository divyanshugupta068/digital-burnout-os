"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HeartPulse, ArrowRight, Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import api from "@/services/api";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // Step 1: Create the user
            await api.post("/auth/signup", {
                email,
                password,
                full_name: fullName,
            });

            // Step 2: Login with form-urlencoded data (required for OAuth2)
            const params = new URLSearchParams();
            params.append("username", email);
            params.append("password", password);

            const loginRes = await api.post("/auth/login", params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            localStorage.setItem("token", loginRes.data.access_token);
            router.push("/onboarding");
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.response?.data?.detail || "An error occurred during signup.");
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        "Personalized burnout risk scoring",
        "Intelligent behavioral analytics",
        "Privacy-first architecture"
    ];

    return (
        <div className="min-h-screen bg-background flex relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
            </div>

            {/* Left Panel - Benefits */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative z-10">
                <div className="max-w-md">
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <div className="p-3 rounded-2xl bg-primary/20">
                            <HeartPulse className="h-8 w-8 text-primary" />
                        </div>
                        <span className="font-bold text-2xl">Burnout<span className="text-primary">OS</span></span>
                    </Link>

                    <h2 className="text-4xl font-bold mb-6">Start your journey to <span className="gradient-text">mental clarity</span></h2>
                    <p className="text-muted-foreground text-lg mb-10">Join thousands of professionals who use BurnoutOS to stay ahead of mental fatigue.</p>

                    <div className="space-y-4">
                        {benefits.map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="p-1 rounded-full bg-accent/20">
                                    <CheckCircle2 size={16} className="text-accent" />
                                </div>
                                <span className="font-medium">{benefit}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <Link href="/" className="flex lg:hidden items-center justify-center gap-2 mb-10">
                        <div className="p-3 rounded-2xl bg-primary/20">
                            <HeartPulse className="h-8 w-8 text-primary" />
                        </div>
                        <span className="font-bold text-2xl">Burnout<span className="text-primary">OS</span></span>
                    </Link>

                    <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
                            <p className="text-muted-foreground">14-day free trial, no credit card required</p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-5">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-rose-400/10 border border-rose-400/20 rounded-xl text-rose-400 text-sm font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div>
                                <label className="text-sm font-medium mb-2 block">Full Name</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl focus-ring"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Email</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl focus-ring"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 rounded-xl focus-ring"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Minimum 8 characters</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? "Creating account..." : "Get Started"} <ArrowRight size={18} />
                            </button>

                            <p className="text-xs text-center text-muted-foreground">
                                By signing up, you agree to our{" "}
                                <Link href="#" className="text-primary hover:underline">Terms</Link> and{" "}
                                <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                            </p>
                        </form>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-bold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
