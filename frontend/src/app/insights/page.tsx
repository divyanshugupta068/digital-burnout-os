"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Sparkles,
    Brain,
    Lightbulb,
    TrendingUp,
    TrendingDown,
    Moon,
    Coffee,
    Dumbbell,
    Clock,
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    Zap,
    Target,
    Heart,
    BarChart3,
    Calendar,
    MessageCircle
} from "lucide-react";
import api from "@/services/api";
import AIChatbot from "@/components/AIChatbot";

const PATTERN_TYPES = {
    positive: { icon: <TrendingUp />, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    negative: { icon: <TrendingDown />, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" },
    neutral: { icon: <BarChart3 />, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    warning: { icon: <AlertTriangle />, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" }
};

// Map actions to chatbot context types
const ACTION_CONTEXT_MAP: Record<string, { type: "bedtime" | "break" | "exercise" | "social" | "general"; title: string }> = {
    "Set bedtime reminder": { type: "bedtime", title: "Set Bedtime Reminder" },
    "Schedule break": { type: "break", title: "Schedule Break" },
    "Log exercise": { type: "exercise", title: "Log Exercise" },
    "Reach out": { type: "social", title: "Connect with Someone" }
};

export default function InsightsPage() {
    const [insights, setInsights] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const [chatbotContext, setChatbotContext] = useState<{ type: "bedtime" | "break" | "exercise" | "social" | "general"; title: string } | null>(null);

    const handleActionClick = (action: string) => {
        const context = ACTION_CONTEXT_MAP[action] || { type: "general", title: action };
        setChatbotContext(context);
        setChatbotOpen(true);
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            const res = await api.get("/analytics/insights");
            setInsights(res.data);
        } catch (err) {
            console.error(err);
            // Demo data for showcase
            setInsights({
                summary: {
                    overallHealth: 72,
                    trend: "improving",
                    riskLevel: "Low"
                },
                patterns: [
                    {
                        id: 1,
                        type: "positive",
                        title: "Sleep-Mood Connection",
                        description: "When you sleep 7+ hours, your mood averages 4.2/5. On less sleep, it drops to 2.8/5.",
                        impact: "high",
                        metric: "+1.4",
                        metricLabel: "mood boost"
                    },
                    {
                        id: 2,
                        type: "warning",
                        title: "Wednesday Slump",
                        description: "Your burnout scores peak mid-week. Consider scheduling lighter work on Wednesdays.",
                        impact: "medium",
                        metric: "+23%",
                        metricLabel: "risk increase"
                    },
                    {
                        id: 3,
                        type: "positive",
                        title: "Exercise Effect",
                        description: "Days with 20+ min exercise show 40% lower burnout risk the next day.",
                        impact: "high",
                        metric: "-40%",
                        metricLabel: "next-day risk"
                    },
                    {
                        id: 4,
                        type: "negative",
                        title: "Late Meetings",
                        description: "Meetings after 5 PM correlate with worse sleep quality that night.",
                        impact: "medium",
                        metric: "-1.2",
                        metricLabel: "sleep quality"
                    },
                    {
                        id: 5,
                        type: "neutral",
                        title: "Screen Time Threshold",
                        description: "Your focus drops significantly after 6 hours of screen time.",
                        impact: "medium",
                        metric: "6h",
                        metricLabel: "optimal limit"
                    }
                ],
                recommendations: [
                    {
                        id: 1,
                        priority: "high",
                        category: "Sleep",
                        title: "Aim for 7.5 hours tonight",
                        description: "Based on your patterns, 7.5 hours is your optimal sleep duration for peak performance.",
                        icon: <Moon className="w-6 h-6" />,
                        action: "Set bedtime reminder"
                    },
                    {
                        id: 2,
                        priority: "high",
                        category: "Work",
                        title: "Take a break at 2 PM",
                        description: "Your energy typically dips after lunch. A 10-minute walk could boost afternoon focus.",
                        icon: <Coffee className="w-6 h-6" />,
                        action: "Schedule break"
                    },
                    {
                        id: 3,
                        priority: "medium",
                        category: "Exercise",
                        title: "20 min movement today",
                        description: "You haven't exercised in 3 days. Even light activity significantly reduces burnout risk.",
                        icon: <Dumbbell className="w-6 h-6" />,
                        action: "Log exercise"
                    },
                    {
                        id: 4,
                        priority: "low",
                        category: "Social",
                        title: "Connect with someone",
                        description: "Social interactions are down this week. A quick chat could boost your mood.",
                        icon: <Heart className="w-6 h-6" />,
                        action: "Reach out"
                    }
                ],
                weeklyInsight: {
                    title: "Your Best Week Pattern",
                    description: "Your lowest burnout risk weeks have these in common: 7+ hours sleep (5+ nights), exercise (3+ days), and fewer than 4 meetings per day.",
                    stats: [
                        { label: "Sleep target", value: "7+ hrs", achieved: true },
                        { label: "Exercise days", value: "3+ days", achieved: false },
                        { label: "Meeting limit", value: "<4/day", achieved: true }
                    ]
                },
                correlations: [
                    { factor1: "Sleep Hours", factor2: "Next-Day Mood", correlation: 0.78, strength: "Strong" },
                    { factor1: "Exercise", factor2: "Burnout Score", correlation: -0.65, strength: "Moderate" },
                    { factor1: "Screen Time", factor2: "Focus Quality", correlation: -0.52, strength: "Moderate" },
                    { factor1: "Meetings", factor2: "Energy Level", correlation: -0.41, strength: "Weak" }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-2xl bg-primary/10 animate-pulse">
                        <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-muted-foreground">AI is analyzing your patterns...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border/50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-xl transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            AI Insights <Sparkles size={18} className="text-primary" />
                        </h1>
                        <p className="text-xs text-muted-foreground">Personalized pattern analysis</p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
                {/* AI Summary Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-primary/20 rounded-3xl p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative flex flex-col lg:flex-row items-center gap-8">
                        <div className="p-6 rounded-3xl bg-primary/20">
                            <Brain size={48} className="text-primary" />
                        </div>

                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 mb-4">
                                <TrendingUp size={14} className="text-emerald-400" />
                                <span className="text-xs font-bold text-emerald-400">
                                    Health Score: {insights?.summary?.overallHealth}% - {insights?.summary?.trend}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Your AI Health Report</h2>
                            <p className="text-muted-foreground">
                                Based on {insights?.patterns?.length || 0} behavioral patterns detected across your logged data,
                                here are personalized insights to optimize your mental health.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="relative w-24 h-24">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary" />
                                    <circle
                                        cx="48" cy="48" r="42"
                                        stroke="url(#insightGrad)"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={264}
                                        strokeDashoffset={264 * (1 - (insights?.summary?.overallHealth || 0) / 100)}
                                        strokeLinecap="round"
                                    />
                                    <defs>
                                        <linearGradient id="insightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#10b981" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black">{insights?.summary?.overallHealth}%</span>
                                    <span className="text-xs text-muted-foreground">Health</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Patterns Detected */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Zap size={20} className="text-primary" />
                        <h2 className="text-2xl font-bold">Patterns Detected</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {insights?.patterns?.map((pattern: any, i: number) => {
                            const config = PATTERN_TYPES[pattern.type as keyof typeof PATTERN_TYPES] || PATTERN_TYPES.neutral;
                            return (
                                <motion.div
                                    key={pattern.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className={`bg-card border ${config.border} rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${config.bg} ${config.color}`}>
                                            {config.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-bold">{pattern.title}</h3>
                                                <div className={`text-sm font-bold ${config.color}`}>
                                                    {pattern.metric} <span className="text-xs font-normal text-muted-foreground">{pattern.metricLabel}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{pattern.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Personalized Recommendations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Lightbulb size={20} className="text-amber-400" />
                        <h2 className="text-2xl font-bold">Today&apos;s Recommendations</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights?.recommendations?.map((rec: any, i: number) => (
                            <motion.div
                                key={rec.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${rec.priority === 'high' ? 'bg-rose-400/10 text-rose-400' :
                                        rec.priority === 'medium' ? 'bg-amber-400/10 text-amber-400' :
                                            'bg-blue-400/10 text-blue-400'
                                        }`}>
                                        {rec.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${rec.priority === 'high' ? 'bg-rose-400/20 text-rose-400' :
                                                rec.priority === 'medium' ? 'bg-amber-400/20 text-amber-400' :
                                                    'bg-blue-400/20 text-blue-400'
                                                }`}>
                                                {rec.priority.toUpperCase()}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{rec.category}</span>
                                        </div>
                                        <h3 className="font-bold mb-1">{rec.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>
                                        <button
                                            onClick={() => handleActionClick(rec.action)}
                                            className="text-sm font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all"
                                        >
                                            <MessageCircle size={14} /> {rec.action} <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Weekly Pattern */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border rounded-3xl p-8"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar size={20} className="text-primary" />
                        <h3 className="text-xl font-bold">{insights?.weeklyInsight?.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">{insights?.weeklyInsight?.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {insights?.weeklyInsight?.stats?.map((stat: any, i: number) => (
                            <div
                                key={i}
                                className={`p-4 rounded-xl border ${stat.achieved
                                    ? 'bg-emerald-400/10 border-emerald-400/20'
                                    : 'bg-secondary border-border'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{stat.label}</span>
                                    {stat.achieved ? (
                                        <CheckCircle2 size={18} className="text-emerald-400" />
                                    ) : (
                                        <Target size={18} className="text-muted-foreground" />
                                    )}
                                </div>
                                <div className="text-2xl font-bold mt-2">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Correlations Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-card border border-border rounded-3xl p-8"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 size={20} className="text-primary" />
                        <h3 className="text-xl font-bold">Correlation Analysis</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 text-sm font-bold text-muted-foreground">Factor 1</th>
                                    <th className="text-left py-3 text-sm font-bold text-muted-foreground">Factor 2</th>
                                    <th className="text-center py-3 text-sm font-bold text-muted-foreground">Correlation</th>
                                    <th className="text-right py-3 text-sm font-bold text-muted-foreground">Strength</th>
                                </tr>
                            </thead>
                            <tbody>
                                {insights?.correlations?.map((corr: any, i: number) => (
                                    <tr key={i} className="border-b border-border/50">
                                        <td className="py-4 font-medium">{corr.factor1}</td>
                                        <td className="py-4 text-muted-foreground">{corr.factor2}</td>
                                        <td className="py-4 text-center">
                                            <span className={`font-bold ${corr.correlation > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${corr.strength === 'Strong' ? 'bg-emerald-400/20 text-emerald-400' :
                                                corr.strength === 'Moderate' ? 'bg-amber-400/20 text-amber-400' :
                                                    'bg-secondary text-muted-foreground'
                                                }`}>
                                                {corr.strength}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </main>

            {/* AI Chatbot */}
            <AIChatbot
                isOpen={chatbotOpen}
                onClose={() => setChatbotOpen(false)}
                initialContext={chatbotContext || undefined}
            />
        </div>
    );
}
