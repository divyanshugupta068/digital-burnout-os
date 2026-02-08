"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Play,
    CheckCircle,
    Brain,
    Moon,
    BarChart3,
    Bell,
    TrendingUp,
    Calendar,
    Activity,
    Shield,
    Zap,
    Heart,
    ArrowRight
} from "lucide-react";

export default function DemoPage() {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Track Your Daily Wellness",
            description: "Start each day by logging your mood, sleep quality, energy levels, and work intensity. Takes just 60 seconds.",
            icon: <Calendar className="w-12 h-12 text-primary" />,
            features: [
                "Simple 1-5 rating scales",
                "Quick sleep duration input",
                "Optional notes for context",
                "Daily streaks & reminders"
            ],
            image: "📊" // Placeholder - you can add actual screenshots
        },
        {
            title: "AI Analyzes Your Patterns",
            description: "Our AI engine processes 20+ behavioral signals to detect subtle changes in your mental health patterns.",
            icon: <Brain className="w-12 h-12 text-primary" />,
            features: [
                "Sleep vs. Mood correlation",
                "Work intensity impact analysis",
                "Weekly trend detection",
                "Personalized insights generation"
            ],
            image: "🧠"
        },
        {
            title: "Get Early Warnings",
            description: "Receive alerts 2-3 weeks before burnout hits, giving you time to take preventive action.",
            icon: <Bell className="w-12 h-12 text-primary" />,
            features: [
                "Real-time burnout risk score",
                "Trend-based predictions",
                "Customizable alert thresholds",
                "Smart notification timing"
            ],
            image: "🔔"
        },
        {
            title: "Take Action with Insights",
            description: "Get personalized recommendations based on your unique patterns, backed by psychology research.",
            icon: <Heart className="w-12 h-12 text-primary" />,
            features: [
                "Tailored intervention suggestions",
                "Evidence-based techniques",
                "Goal setting & tracking",
                "Progress visualization"
            ],
            image: "💡"
        }
    ];

    const howItWorks = [
        {
            step: "1",
            title: "Sign Up Free",
            description: "Create your account in 30 seconds. No credit card required for free tier.",
            icon: <Zap className="w-8 h-8" />
        },
        {
            step: "2",
            title: "Complete Onboarding",
            description: "Set your sleep goals and work schedule to establish your baseline.",
            icon: <Activity className="w-8 h-8" />
        },
        {
            step: "3",
            title: "Start Tracking",
            description: "Log your daily metrics. The more you track, the smarter our AI becomes.",
            icon: <BarChart3 className="w-8 h-8" />
        },
        {
            step: "4",
            title: "Monitor & Prevent",
            description: "View your insights, watch for warnings, and take action before burnout hits.",
            icon: <Shield className="w-8 h-8" />
        }
    ];

    const benefits = [
        {
            title: "For Individuals",
            points: [
                "Prevent burnout before it happens",
                "Understand your stress patterns",
                "Improve work-life balance",
                "Build healthier habits"
            ]
        },
        {
            title: "For Teams",
            points: [
                "Reduce employee burnout by 40%",
                "Decrease sick days & turnover",
                "Improve team productivity",
                "Foster a healthier workplace"
            ]
        },
        {
            title: "For Managers",
            points: [
                "Anonymous team health metrics",
                "Early intervention opportunities",
                "Data-driven wellness decisions",
                "ROI tracking & reporting"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <Link href="/signup" className="btn-primary px-6 py-2.5 rounded-xl font-bold">
                        Start Free Trial →
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 lg:py-28 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <Play size={16} className="text-primary" />
                            <span className="text-sm font-medium">Interactive Demo</span>
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-black mb-6">
                            How <span className="gradient-text">BurnoutOS</span> Works
                        </h1>
                        <p className="text-xl text-muted-foreground mb-4">
                            See how our AI-powered platform helps you predict and prevent burnout before it impacts your life.
                        </p>

                        <p className="text-lg text-primary mb-12">
                            👇 Click through the interactive walkthrough below to learn more
                        </p>
                    </div>
                </div>
            </section>

            {/* Interactive Walkthrough */}
            <section className="py-20 bg-card/30">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4">Interactive Walkthrough</h2>
                        <p className="text-lg text-muted-foreground">Click through to see how BurnoutOS works step-by-step</p>
                    </div>

                    {/* Step Navigation */}
                    <div className="flex justify-center gap-2 mb-12">
                        {steps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentStep(index)}
                                className={`w-12 h-2 rounded-full transition-all ${index === currentStep
                                    ? 'bg-primary w-16'
                                    : 'bg-secondary hover:bg-secondary/80'
                                    }`}
                                aria-label={`Go to step ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Current Step */}
                    <div className="bg-card border border-border rounded-3xl p-12">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="mb-6">{steps[currentStep].icon}</div>
                                <h3 className="text-3xl font-black mb-4">{steps[currentStep].title}</h3>
                                <p className="text-lg text-muted-foreground mb-8">{steps[currentStep].description}</p>

                                <ul className="space-y-3 mb-8">
                                    {steps[currentStep].features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <CheckCircle size={20} className="text-emerald-400 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex gap-4">
                                    {currentStep > 0 && (
                                        <button
                                            onClick={() => setCurrentStep(currentStep - 1)}
                                            className="px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 font-medium"
                                        >
                                            ← Previous
                                        </button>
                                    )}
                                    {currentStep < steps.length - 1 ? (
                                        <button
                                            onClick={() => setCurrentStep(currentStep + 1)}
                                            className="btn-primary px-6 py-3 rounded-xl font-bold"
                                        >
                                            Next Step →
                                        </button>
                                    ) : (
                                        <Link href="/signup" className="btn-primary px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2">
                                            Start Free Trial <ArrowRight size={20} />
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Visual Placeholder */}
                            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl aspect-square flex items-center justify-center">
                                <div className="text-9xl">{steps[currentStep].image}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4">Getting Started is Easy</h2>
                        <p className="text-lg text-muted-foreground">Go from signup to insights in less than 5 minutes</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((item, i) => (
                            <div key={i} className="relative">
                                <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all h-full">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-2xl mb-6">
                                        {item.step}
                                    </div>
                                    <div className="text-primary mb-4">{item.icon}</div>
                                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </div>
                                {i < howItWorks.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 text-muted-foreground">→</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 bg-card/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4">Who Benefits from BurnoutOS?</h2>
                        <p className="text-lg text-muted-foreground">Designed for everyone from individuals to enterprises</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="bg-card border border-border rounded-3xl p-8">
                                <h3 className="text-2xl font-bold mb-6">{benefit.title}</h3>
                                <ul className="space-y-4">
                                    {benefit.points.map((point, j) => (
                                        <li key={j} className="flex items-start gap-3">
                                            <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-[2rem] p-12 text-center">
                        <h2 className="text-4xl font-black mb-6">Ready to Prevent Burnout?</h2>
                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                            Join 50,000+ professionals who trust BurnoutOS to protect their mental health.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/signup" className="btn-primary px-10 py-5 rounded-2xl text-lg font-bold inline-flex items-center justify-center gap-2">
                                Start Free Trial <ArrowRight size={20} />
                            </Link>
                            <Link href="/#pricing" className="px-10 py-5 rounded-2xl text-lg font-bold bg-secondary hover:bg-secondary/80 inline-flex items-center justify-center gap-2">
                                View Pricing
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground mt-6">
                            ✓ No credit card required • ✓ 14-day free trial • ✓ Cancel anytime
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
