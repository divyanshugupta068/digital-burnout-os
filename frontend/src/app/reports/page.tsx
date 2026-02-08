"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    FileText,
    Download,
    Share2,
    Calendar,
    TrendingUp,
    TrendingDown,
    Moon,
    Smile,
    Zap,
    Activity,
    Brain,
    Target,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Flame,
    Trophy
} from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import api from "@/services/api";

const CHART_COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

export default function ReportsPage() {
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedWeek, setSelectedWeek] = useState("current");

    useEffect(() => {
        fetchReport();
    }, [selectedWeek]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/analytics/weekly-report?week=${selectedWeek}`);
            setReport(res.data);
        } catch (err) {
            // Demo data
            setReport({
                period: "Jan 27 - Feb 2, 2026",
                summary: {
                    avgBurnoutScore: 32,
                    scoreChange: -8,
                    daysLogged: 6,
                    streakDays: 12,
                    totalXPEarned: 85
                },
                dailyScores: [
                    { day: "Mon", score: 28, sleep: 7.5, mood: 4 },
                    { day: "Tue", score: 35, sleep: 6.5, mood: 3 },
                    { day: "Wed", score: 42, sleep: 6, mood: 3 },
                    { day: "Thu", score: 38, sleep: 7, mood: 4 },
                    { day: "Fri", score: 30, sleep: 7.5, mood: 4 },
                    { day: "Sat", score: 25, sleep: 8, mood: 5 },
                    { day: "Sun", score: 24, sleep: 8.5, mood: 5 }
                ],
                categoryBreakdown: [
                    { name: "Sleep", value: 85, color: "#3b82f6" },
                    { name: "Mental", value: 72, color: "#8b5cf6" },
                    { name: "Energy", value: 68, color: "#f59e0b" },
                    { name: "Work", value: 75, color: "#10b981" },
                    { name: "Lifestyle", value: 80, color: "#ec4899" }
                ],
                highlights: [
                    { type: "positive", text: "Best sleep week in 3 weeks! Average 7.3 hours." },
                    { type: "positive", text: "Burnout score dropped 8 points from last week." },
                    { type: "warning", text: "Wednesday showed peak stress - consider mid-week breaks." },
                    { type: "achievement", text: "Unlocked 'Week Warrior' badge!" }
                ],
                topFactors: {
                    helping: ["Consistent sleep schedule", "Regular exercise", "Social interactions"],
                    hurting: ["Too many meetings on Wed", "High screen time on weekdays"]
                },
                recommendations: [
                    "Protect your Wednesday - block focus time in morning",
                    "Continue current sleep routine - it's working great",
                    "Consider a 20-min walk after lunch to combat afternoon slump"
                ],
                comparison: {
                    lastWeek: 40,
                    thisWeek: 32,
                    industryAverage: 45
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="p-4 rounded-2xl bg-primary/10 w-fit mx-auto mb-4 animate-pulse">
                        <FileText size={32} className="text-primary" />
                    </div>
                    <p className="text-muted-foreground">Generating your weekly report...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background print:bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border/50 print:hidden">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-xl transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold">Weekly Report</h1>
                            <p className="text-xs text-muted-foreground">{report?.period}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={selectedWeek}
                            onChange={(e) => setSelectedWeek(e.target.value)}
                            className="px-4 py-2 bg-secondary rounded-xl text-sm font-medium"
                        >
                            <option value="current">This Week</option>
                            <option value="last">Last Week</option>
                            <option value="2-weeks">2 Weeks Ago</option>
                        </select>
                        <button
                            onClick={handleDownload}
                            className="p-2 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
                            title="Download PDF"
                        >
                            <Download size={20} />
                        </button>
                        <button
                            className="p-2 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
                            title="Share"
                        >
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10 space-y-8 print:py-4">
                {/* Report Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center print:mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <Calendar size={16} className="text-primary" />
                        <span className="text-sm font-medium">{report?.period}</span>
                    </div>
                    <h1 className="text-4xl font-black mb-2">Your Weekly Wellness Report</h1>
                    <p className="text-muted-foreground">Here's how you did this week</p>
                </motion.div>

                {/* Summary Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-5 gap-4"
                >
                    <div className="bg-card border border-border rounded-2xl p-6 text-center">
                        <div className="text-4xl font-black gradient-text mb-1">{report?.summary?.avgBurnoutScore}</div>
                        <div className="text-xs text-muted-foreground">Avg Burnout Score</div>
                        <div className={`text-xs font-bold mt-2 ${report?.summary?.scoreChange < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {report?.summary?.scoreChange < 0 ? '↓' : '↑'} {Math.abs(report?.summary?.scoreChange)} pts
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6 text-center">
                        <div className="text-4xl font-black text-blue-400 mb-1">{report?.summary?.daysLogged}</div>
                        <div className="text-xs text-muted-foreground">Days Logged</div>
                        <div className="text-xs font-bold text-muted-foreground mt-2">of 7 days</div>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6 text-center">
                        <div className="text-4xl font-black text-orange-400 mb-1">{report?.summary?.streakDays}</div>
                        <div className="text-xs text-muted-foreground">Day Streak</div>
                        <Flame size={16} className="text-orange-400 mx-auto mt-2" />
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6 text-center">
                        <div className="text-4xl font-black text-emerald-400 mb-1">7.3h</div>
                        <div className="text-xs text-muted-foreground">Avg Sleep</div>
                        <div className="text-xs font-bold text-emerald-400 mt-2">↑ 0.5h</div>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6 text-center">
                        <div className="text-4xl font-black text-violet-400 mb-1">+{report?.summary?.totalXPEarned}</div>
                        <div className="text-xs text-muted-foreground">XP Earned</div>
                        <Trophy size={16} className="text-violet-400 mx-auto mt-2" />
                    </div>
                </motion.div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Burnout Trend */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border border-border rounded-3xl p-6"
                    >
                        <h3 className="text-lg font-bold mb-4">Daily Burnout Trend</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={report?.dailyScores}>
                                    <defs>
                                        <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }} />
                                    <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#reportGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Category Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card border border-border rounded-3xl p-6"
                    >
                        <h3 className="text-lg font-bold mb-4">Health Categories</h3>
                        <div className="h-64 flex items-center">
                            <ResponsiveContainer width="50%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={report?.categoryBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {report?.categoryBreakdown?.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex-1 space-y-3">
                                {report?.categoryBreakdown?.map((cat: any) => (
                                    <div key={cat.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                            <span className="text-sm">{cat.name}</span>
                                        </div>
                                        <span className="font-bold text-sm">{cat.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Week Comparison */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card border border-border rounded-3xl p-6"
                >
                    <h3 className="text-lg font-bold mb-4">Week-over-Week Comparison</h3>
                    <div className="flex items-end justify-center gap-16 h-48">
                        {[
                            { label: "Last Week", value: report?.comparison?.lastWeek, color: "bg-secondary" },
                            { label: "This Week", value: report?.comparison?.thisWeek, color: "bg-gradient-to-t from-primary to-accent" },
                            { label: "Industry Avg", value: report?.comparison?.industryAverage, color: "bg-muted" }
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div
                                    className={`w-20 ${item.color} rounded-t-xl mx-auto transition-all`}
                                    style={{ height: `${(item.value / 100) * 150}px` }}
                                />
                                <div className="mt-3 font-bold text-lg">{item.value}</div>
                                <div className="text-xs text-muted-foreground">{item.label}</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Your burnout score is <span className="text-emerald-400 font-bold">29% lower</span> than the industry average!
                    </p>
                </motion.div>

                {/* Highlights */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border rounded-3xl p-6"
                >
                    <h3 className="text-lg font-bold mb-4">Week Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {report?.highlights?.map((h: any, i: number) => (
                            <div
                                key={i}
                                className={`p-4 rounded-xl flex items-start gap-3 ${h.type === 'positive' ? 'bg-emerald-400/10 border border-emerald-400/20' :
                                        h.type === 'achievement' ? 'bg-amber-400/10 border border-amber-400/20' :
                                            'bg-amber-400/5 border border-amber-400/10'
                                    }`}
                            >
                                {h.type === 'positive' && <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />}
                                {h.type === 'achievement' && <Trophy size={18} className="text-amber-400 shrink-0 mt-0.5" />}
                                {h.type === 'warning' && <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />}
                                <span className="text-sm">{h.text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Factors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-3xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-emerald-400" /> What Helped
                        </h3>
                        <ul className="space-y-3">
                            {report?.topFactors?.helping?.map((f: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-rose-400/5 border border-rose-400/20 rounded-3xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <TrendingDown size={20} className="text-rose-400" /> Watch Out For
                        </h3>
                        <ul className="space-y-3">
                            {report?.topFactors?.hurting?.map((f: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                    <AlertTriangle size={16} className="text-rose-400" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Recommendations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-6"
                >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Brain size={20} className="text-primary" /> AI Recommendations for Next Week
                    </h3>
                    <div className="space-y-4">
                        {report?.recommendations?.map((rec: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-background/50 rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-bold text-primary">{i + 1}</span>
                                </div>
                                <p className="text-sm">{rec}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center py-8 print:hidden"
                >
                    <p className="text-muted-foreground mb-4">Keep up the great work! See you next week.</p>
                    <Link href="/dashboard" className="btn-primary px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-2">
                        Back to Dashboard
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}
