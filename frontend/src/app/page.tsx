"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    HeartPulse,
    Brain,
    Shield,
    Zap,
    Moon,
    TrendingDown,
    Check,
    Star,
    ChevronRight,
    ArrowRight,
    Play,
    Sparkles,
    Users,
    Building2,
    BarChart3,
    Bell,
    Lock,
    Smartphone,
    Globe,
    Award,
    Quote,
    Menu,
    X,
    MessageCircle
} from "lucide-react";
import AIChatbot from "@/components/AIChatbot";

const FEATURES = [
    {
        icon: <Brain className="w-8 h-8" />,
        title: "AI-Powered Detection",
        description: "Machine learning algorithms analyze 20+ behavioral signals to predict burnout before it happens.",
        color: "from-violet-500 to-purple-600"
    },
    {
        icon: <Moon className="w-8 h-8" />,
        title: "Sleep Intelligence",
        description: "Track sleep patterns and quality. Our engine correlates rest with productivity and mood.",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: <TrendingDown className="w-8 h-8" />,
        title: "Early Warning System",
        description: "Get alerts 2-3 weeks before burnout hits. Intervention recommendations backed by research.",
        color: "from-amber-500 to-orange-500"
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Privacy-First",
        description: "Your behavioral data is encrypted and never sold. Full GDPR/CCPA compliance.",
        color: "from-emerald-500 to-green-500"
    },
    {
        icon: <BarChart3 className="w-8 h-8" />,
        title: "Deep Analytics",
        description: "Visualize trends, correlations, and patterns. Export beautiful PDF reports.",
        color: "from-rose-500 to-pink-500"
    },
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: "Smart Recommendations",
        description: "Personalized action items based on your unique patterns and goals.",
        color: "from-indigo-500 to-violet-500"
    }
];

const TESTIMONIALS = [
    {
        quote: "BurnoutOS helped me identify my stress patterns before I even realized I was burning out. The early warning saved my sanity.",
        author: "Sarah Chen",
        role: "Engineering Manager, Stripe",
        avatar: "SC",
        rating: 5
    },
    {
        quote: "We deployed this across our 200-person team. Sick days dropped 34% in the first quarter. The ROI is incredible.",
        author: "Michael Torres",
        role: "VP of People, Notion",
        avatar: "MT",
        rating: 5
    },
    {
        quote: "Finally, a wellness app that actually works with data science, not just motivational quotes. This is the future.",
        author: "Dr. Emily Watson",
        role: "Chief Medical Officer, Calm",
        avatar: "EW",
        rating: 5
    }
];

const STATS = [
    { value: "50K+", label: "Active Users" },
    { value: "2.3M", label: "Entries Logged" },
    { value: "89%", label: "Accuracy Rate" },
    { value: "4.9★", label: "App Store" }
];

const PRICING = [
    {
        name: "Free",
        price: "₹0",
        period: "forever",
        description: "For individuals starting their wellness journey",
        features: [
            "Daily mood & sleep tracking",
            "7-day trend analysis",
            "Basic burnout score",
            "3 health reports/month",
            "Community access"
        ],
        cta: "Get Started",
        popular: false,
        priceAmount: 0,
        planId: "free"
    },
    {
        name: "Pro",
        price: "₹749",
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
        ],
        cta: "Subscribe Now",
        popular: true,
        priceAmount: 749,
        planId: "pro"
    },
    {
        name: "Enterprise",
        price: "₹4,999",
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
        ],
        cta: "Get Enterprise",
        popular: false,
        priceAmount: 4999,
        planId: "enterprise"
    }
];

const INTEGRATIONS = [
    "Slack", "Google Calendar", "Apple Health", "Fitbit", "Notion", "Asana", "Microsoft Teams", "Zoom"
];

export default function LandingPage() {
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-primary/20">
                            <HeartPulse className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-bold text-xl">Burnout<span className="text-primary">OS</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                        <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</Link>
                        <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                        <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Log In
                        </Link>
                        <Link href="/signup" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold">
                            Start Free →
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 hover:bg-secondary rounded-xl">
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:hidden bg-card border-b border-border p-6 space-y-4"
                    >
                        <Link href="#features" className="block text-sm font-medium py-2">Features</Link>
                        <Link href="#pricing" className="block text-sm font-medium py-2">Pricing</Link>
                        <Link href="/about" className="block text-sm font-medium py-2">About</Link>
                        <hr className="border-border" />
                        <Link href="/login" className="block text-sm font-medium py-2">Log In</Link>
                        <Link href="/signup" className="btn-primary block text-center px-5 py-3 rounded-xl text-sm font-bold">
                            Start Free →
                        </Link>
                    </motion.div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                            <Sparkles size={16} className="text-primary" />
                            <span className="text-sm font-medium">Backed by Y Combinator W24</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                            Predict Burnout
                            <br />
                            <span className="gradient-text">Before It Hits</span>
                        </h1>

                        <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            AI-powered behavioral analytics that detect burnout signals 2-3 weeks early.
                            Track sleep, mood, and work patterns. Get personalized interventions.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link href="/signup" className="btn-primary px-8 py-4 rounded-2xl text-lg font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
                                Start Free Trial <ArrowRight size={20} />
                            </Link>
                            <Link href="/demo" className="px-8 py-4 rounded-2xl text-lg font-bold inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 transition-colors">
                                <Play size={20} /> Watch Demo
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
                            {STATS.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl lg:text-4xl font-black gradient-text">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="mt-20 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
                        <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
                            <div className="p-4 border-b border-border flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="ml-4 text-xs text-muted-foreground">dashboard.burnout.os</span>
                            </div>
                            <div className="p-8 bg-gradient-to-br from-background to-card">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Score Card Preview */}
                                    <div className="bg-card border border-border rounded-2xl p-6">
                                        <div className="text-xs font-bold uppercase text-muted-foreground mb-4">Burnout Risk</div>
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-24 h-24">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary" />
                                                    <circle cx="48" cy="48" r="42" stroke="url(#previewGrad)" strokeWidth="8" fill="transparent" strokeDasharray={264} strokeDashoffset={264 * 0.72} strokeLinecap="round" />
                                                    <defs><linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#10b981" /></linearGradient></defs>
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center text-2xl font-black">28</div>
                                            </div>
                                            <div>
                                                <div className="text-emerald-400 font-bold flex items-center gap-1"><Check size={16} /> Safe</div>
                                                <div className="text-xs text-muted-foreground mt-1">All signals healthy</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Quick Stats Preview */}
                                    <div className="space-y-4">
                                        {[
                                            { label: "Sleep", value: "7.5h", color: "text-blue-400" },
                                            { label: "Mood", value: "4/5", color: "text-amber-400" },
                                            { label: "Energy", value: "4/5", color: "text-rose-400" }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">{stat.label}</span>
                                                <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Chart Preview */}
                                    <div className="bg-card border border-border rounded-2xl p-6">
                                        <div className="text-xs font-bold uppercase text-muted-foreground mb-4">7-Day Trend</div>
                                        <div className="flex items-end justify-between h-32 gap-2">
                                            {[35, 28, 42, 38, 25, 30, 28].map((h, i) => (
                                                <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-primary/20 to-primary" style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Logos Section */}
            <section className="py-16 border-t border-border/50">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm text-muted-foreground mb-8">Trusted by teams at</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50">
                        {["Google", "Meta", "Stripe", "Notion", "Figma", "Linear"].map((company) => (
                            <div key={company} className="text-xl lg:text-2xl font-bold">{company}</div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-6">
                            <Zap size={16} className="text-primary" />
                            <span className="text-sm font-medium">Powerful Features</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black mb-4">Everything you need to<br /><span className="gradient-text">stay mentally healthy</span></h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Built by psychologists and data scientists. Designed for the modern workplace.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-card border border-border rounded-3xl p-8 hover:border-primary/50 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Integrations */}
            <section className="py-16 bg-card/50 border-y border-border">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl font-bold mb-2">Integrates with your favorite tools</h3>
                        <p className="text-muted-foreground">Sync data automatically from the apps you already use</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {INTEGRATIONS.map((app) => (
                            <div key={app} className="px-6 py-3 bg-secondary rounded-xl font-medium text-sm">{app}</div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl lg:text-5xl font-black mb-4">Loved by <span className="gradient-text">50,000+ users</span></h2>
                        <p className="text-muted-foreground text-lg">See what our community says about BurnoutOS</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-card border border-border rounded-3xl p-8"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, j) => (
                                        <Star key={j} size={18} className="text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <Quote size={24} className="text-primary/30 mb-4" />
                                <p className="text-lg mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold">{testimonial.author}</div>
                                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 bg-card/50 border-y border-border">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl lg:text-5xl font-black mb-4">Simple, transparent <span className="gradient-text">pricing</span></h2>
                        <p className="text-muted-foreground text-lg">Start free. Upgrade when you're ready.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {PRICING.map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{
                                    scale: 1.05,
                                    y: -8,
                                    transition: { duration: 0.2 }
                                }}
                                className={`relative bg-card rounded-3xl p-8 cursor-pointer transition-all duration-300 ${plan.popular
                                    ? 'border-2 border-primary shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/40'
                                    : 'border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black">{plan.price}</span>
                                        <span className="text-muted-foreground">{plan.period}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm">
                                            <Check size={18} className="text-emerald-400 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={plan.planId === "free" ? "/signup" : `/checkout?plan=${plan.planId}`}
                                    className={`block text-center py-4 rounded-2xl font-bold transition-all hover:scale-105 ${plan.popular
                                        ? 'btn-primary shadow-lg shadow-primary/30 hover:shadow-primary/50'
                                        : 'bg-secondary hover:bg-secondary/80'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-[2rem] p-12 lg:p-16 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-grid-white/5" />
                        <div className="relative">
                            <h2 className="text-4xl lg:text-5xl font-black mb-6">Ready to prevent burnout?</h2>
                            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
                                Join 50,000+ professionals who trust BurnoutOS with their mental health.
                            </p>
                            <Link href="/signup" className="btn-primary px-10 py-5 rounded-2xl text-lg font-bold inline-flex items-center gap-2 shadow-lg shadow-primary/30">
                                Start Your Free Trial <ArrowRight size={20} />
                            </Link>
                            <p className="text-sm text-muted-foreground mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 border-t border-border">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                        <div className="col-span-2">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <div className="p-2 rounded-xl bg-primary/20">
                                    <HeartPulse className="h-6 w-6 text-primary" />
                                </div>
                                <span className="font-bold text-xl">Burnout<span className="text-primary">OS</span></span>
                            </Link>
                            <p className="text-muted-foreground text-sm max-w-xs">
                                AI-powered burnout prevention for modern professionals. Built with ❤️ in San Francisco.
                            </p>
                        </div>
                        {[
                            { title: "Product", links: ["Features", "Pricing", "Integrations", "API"] },
                            { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
                            { title: "Legal", links: ["Privacy", "Terms", "Security", "GDPR"] }
                        ].map((col) => (
                            <div key={col.title}>
                                <h4 className="font-bold mb-4">{col.title}</h4>
                                <ul className="space-y-2">
                                    {col.links.map((link) => (
                                        <li key={link}><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="pt-8 border-t border-border flex flex-col lg:flex-row justify-between items-center gap-4">
                        <div className="text-center lg:text-left">
                            <p className="text-sm text-muted-foreground">© 2026 BurnoutOS Inc. All rights reserved.</p>
                            <p className="text-sm text-primary mt-1">Contact: divyanshugupta068@gmail.com</p>
                        </div>
                        <div className="flex gap-6">
                            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                                <Link key={social} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{social}</Link>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating AI Chat Button */}
            <motion.button
                onClick={() => setChatbotOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                title="Ask AI Wellness Coach"
            >
                <MessageCircle size={24} />
            </motion.button>

            <AIChatbot
                isOpen={chatbotOpen}
                onClose={() => setChatbotOpen(false)}
                initialContext={{ type: "general", title: "Wellness Coach" }}
            />
        </div >
    );
}
