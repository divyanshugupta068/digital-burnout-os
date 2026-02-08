"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Brain,
    TrendingUp,
    TrendingDown,
    Activity,
    Moon,
    Heart,
    Zap,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    BarChart3,
    Plus,
    ArrowRight
} from "lucide-react";
import { LoadingSpinner, DashboardSkeleton } from "@/components/Loading";
import { EmptyState, ErrorDisplay } from "@/components/ErrorHandling";
import toast from "react-hot-toast";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<any>(null);
    const [recommendations, setRecommendations] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            // Fetch burnout prediction
            const predictionRes = await fetch(`${apiUrl}/api/v1/analytics/burnout-prediction?user_id=1`);
            if (predictionRes.ok) {
                const predData = await predictionRes.json();
                setPrediction(predData);
            }

            // Fetch recommendations
            const recsRes = await fetch(`${apiUrl}/api/v1/analytics/recommendations?user_id=1`);
            if (recsRes.ok) {
                const recsData = await recsRes.json();
                setRecommendations(recsData);
            }

            setLoading(false);
        } catch (err: any) {
            console.error("Error fetching dashboard data:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <DashboardSkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <ErrorDisplay
                    title="Failed to load dashboard"
                    message={error}
                    onRetry={fetchData}
                />
            </div>
        );
    }

    const hasNoData = !prediction || prediction.data_points === 0;

    if (hasNoData) {
        return (
            <div className="min-h-screen bg-background">
                <header className="sticky top-0 z-50 glass border-b border-border/50">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                            Back to Home
                        </Link>
                    </div>
                </header>
                <EmptyState
                    icon={<BarChart3 className="w-24 h-24" />}
                    title="No data yet"
                    description="Start tracking your daily sleep, mood, and work patterns to see your burnout risk analysis here."
                    action={{
                        label: "Start Daily Check-In",
                        onClick: () => window.location.href = "/track"
                    }}
                />
            </div>
        );
    }

    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
            case "Low": return "text-green-500";
            case "Medium": return "text-yellow-500";
            case "High": return "text-red-500";
            default: return "text-muted-foreground";
        }
    };

    const getRiskBgColor = (riskLevel: string) => {
        switch (riskLevel) {
            case "Low": return "bg-green-500/10 border-green-500/30";
            case "Medium": return "bg-yellow-500/10 border-yellow-500/30";
            case "High": return "bg-red-500/10 border-red-500/30";
            default: return "bg-muted";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border/50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <span className="text-sm text-muted-foreground">
                            {prediction.period_days}-day analysis
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/track"
                            className="btn-primary px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Daily Check-In
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Burnout Risk Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-card border-2 rounded-3xl p-8 mb-8 ${getRiskBgColor(prediction.risk_level)}`}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-background rounded-2xl">
                                <Brain className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Burnout Risk Analysis</h2>
                                <p className="text-muted-foreground">AI-powered prediction based on your patterns</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Score Display */}
                        <div className="text-center">
                            <div className="relative inline-flex items-center justify-center mb-4">
                                <svg className="w-48 h-48 transform -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="none"
                                        className="text-muted"
                                    />
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="none"
                                        strokeDasharray={`${prediction.score * 5.53} 553`}
                                        className={getRiskColor(prediction.risk_level)}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute">
                                    <div className="text-5xl font-black">{Math.round(prediction.score)}</div>
                                    <div className="text-sm text-muted-foreground">/ 100</div>
                                </div>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${getRiskBgColor(prediction.risk_level)}`}>
                                {prediction.risk_level === "Low" && <CheckCircle2 className="w-5 h-5" />}
                                {prediction.risk_level === "Medium" && <AlertTriangle className="w-5 h-5" />}
                                {prediction.risk_level === "High" && <AlertTriangle className="w-5 h-5" />}
                                <span className={getRiskColor(prediction.risk_level)}>
                                    {prediction.risk_level} Risk
                                </span>
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg mb-4">Key Insights</h3>
                            {prediction.insights && prediction.insights.map((insight: string, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-3 bg-background/50 p-4 rounded-xl"
                                >
                                    <div className="mt-0.5">
                                        {insight.startsWith("✅") ? "✅" :
                                            insight.startsWith("⚠️") ? "⚠️" :
                                                insight.startsWith("🚨") ? "🚨" :
                                                    insight.startsWith("🟡") ? "🟡" : "💡"}
                                    </div>
                                    <p className="text-sm flex-1">{insight.replace(/^[✅⚠️🚨🟡💡]\s*/, "")}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Factors Breakdown */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Sleep Factor */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card border border-border rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <Moon className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-bold">Sleep</h3>
                                <p className="text-sm text-muted-foreground">
                                    Avg: {prediction.factors.sleep?.avg_hours || 0}h
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Quality</span>
                                <span className="font-semibold">{prediction.factors.sleep?.avg_quality || 0}/5</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${(prediction.factors.sleep?.avg_quality || 0) * 20}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Mood Factor */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border border-border rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-pink-500/10 rounded-xl">
                                <Heart className="w-6 h-6 text-pink-500" />
                            </div>
                            <div>
                                <h3 className="font-bold">Mood</h3>
                                <p className="text-sm text-muted-foreground">
                                    {prediction.factors.mood?.trend || "Unknown"}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Average</span>
                                <span className="font-semibold">{prediction.factors.mood?.avg_mood || 0}/5</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className="bg-pink-500 h-2 rounded-full"
                                    style={{ width: `${(prediction.factors.mood?.avg_mood || 0) * 20}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Work Factor */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card border border-border rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-orange-500/10 rounded-xl">
                                <Activity className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="font-bold">Work Load</h3>
                                <p className="text-sm text-muted-foreground">
                                    Avg: {prediction.factors.work?.avg_work_hours || 0}h/day
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Stress</span>
                                <span className="font-semibold">{prediction.factors.work?.avg_stress || 0}/5</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full"
                                    style={{ width: `${(prediction.factors.work?.avg_stress || 0) * 20}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recommendations */}
                {recommendations && recommendations.recommendations && recommendations.recommendations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-card border border-border rounded-2xl p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Zap className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold">Personalized Recommendations</h2>
                        </div>
                        <div className="space-y-4">
                            {recommendations.recommendations.map((rec: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.1 }}
                                    className="bg-background/50 border border-border rounded-xl p-6"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${rec.priority === "Critical" ? "bg-red-500/10 text-red-500" :
                                                    rec.priority === "High" ? "bg-orange-500/10 text-orange-500" :
                                                        "bg-yellow-500/10 text-yellow-500"
                                                }`}>
                                                {rec.priority}
                                            </div>
                                            <span className="font-semibold">{rec.category}</span>
                                        </div>
                                    </div>
                                    <p className="text-lg mb-2">{rec.action}</p>
                                    <p className="text-sm text-muted-foreground">{rec.impact}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Action CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 text-center bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8"
                >
                    <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Keep the momentum going!</h3>
                    <p className="text-muted-foreground mb-6">
                        Daily tracking helps us provide better predictions and recommendations
                    </p>
                    <Link
                        href="/track"
                        className="inline-flex items-center gap-2 btn-primary px-8 py-3 rounded-xl font-bold"
                    >
                        Log Today's Data
                        <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}
