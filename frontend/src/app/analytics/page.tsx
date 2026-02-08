"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    TrendingUp,
    Moon,
    Smile,
    Zap,
    AlertTriangle,
    Lightbulb,
    Clock,
    PlusCircle,
    BarChart3
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
    ScatterChart,
    Scatter,
    LineChart,
    Line,
    Legend
} from "recharts";
import api from "@/services/api";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<"week" | "month">("week");
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [correlations, setCorrelations] = useState<any[]>([]);
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [heatmapData, setHeatmapData] = useState<any[]>([]);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get("/analytics/detailed");
            const result = res.data;

            setHasData(result.hasData || false);
            setWeeklyData(result.weeklyTrend || []);
            setMonthlyData(result.monthlyTrend || []);
            setCorrelations(result.sleepMoodCorrelation || []);
            setPerformanceData(result.performanceData || []);
            setHeatmapData(result.heatmap || []);
            setData(result);
        } catch (err) {
            console.error(err);
            setHasData(false);
            setWeeklyData([]);
            setMonthlyData([]);
        } finally {
            setLoading(false);
        }
    };

    // Get the display data based on time range selection
    const trendData = timeRange === "week" ? weeklyData : monthlyData;

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading analytics...</div>
            </div>
        );
    }

    // Empty State Component
    const EmptyState = ({ title, description }: { title: string; description: string }) => (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-2xl bg-secondary mb-4">
                <BarChart3 size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm max-w-xs">{description}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border/50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-xl transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold">Analytics</h1>
                            <p className="text-xs text-muted-foreground">Deep dive into your patterns</p>
                        </div>
                    </div>

                    {/* Time Range Toggle - At the top as requested */}
                    <div className="flex items-center gap-2 bg-secondary rounded-xl p-1">
                        <button
                            onClick={() => setTimeRange("week")}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${timeRange === "week"
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setTimeRange("month")}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${timeRange === "month"
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Month
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                {/* No Data State */}
                {!hasData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-3xl p-12 text-center"
                    >
                        <div className="p-6 rounded-3xl bg-primary/10 w-fit mx-auto mb-6">
                            <Clock size={48} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">No Analytics Data Yet</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-8">
                            Start logging your daily entries to see detailed analytics, trends, and insights about your burnout patterns.
                        </p>
                        <Link
                            href="/dashboard"
                            className="btn-primary px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-3"
                        >
                            <PlusCircle size={20} /> Go to Dashboard & Log Entry
                        </Link>
                    </motion.div>
                )}

                {/* Show analytics only if has data */}
                {hasData && (
                    <>
                        {/* Insights Banner */}
                        {data?.insights?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-primary/20">
                                        <Lightbulb size={20} className="text-primary" />
                                    </div>
                                    <h3 className="font-bold">Key Insights</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {data.insights.slice(0, 3).map((insight: string, i: number) => (
                                        <div key={i} className="bg-card/50 rounded-xl p-4 text-sm">
                                            {insight}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Burnout Trend */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card border border-border rounded-3xl p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold">Burnout Score Trend</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {timeRange === "week" ? "Last 7 days" : "Last 30 days"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                    Risk Score
                                </div>
                            </div>

                            {trendData.length > 0 ? (
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={trendData}>
                                            <defs>
                                                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                            <XAxis
                                                dataKey="label"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 11, fill: '#71717a' }}
                                                interval={timeRange === "month" ? 4 : 0}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: '#71717a' }}
                                                domain={[0, 100]}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#18181b',
                                                    border: '1px solid #27272a',
                                                    borderRadius: '12px'
                                                }}
                                                labelStyle={{ color: '#fafafa', fontWeight: 'bold' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#8b5cf6"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorTrend)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <EmptyState
                                    title="No Trend Data"
                                    description="Log daily entries to see your burnout trend over time."
                                />
                            )}
                        </motion.div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Sleep vs Mood Correlation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-card border border-border rounded-3xl p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-xl bg-blue-400/10">
                                        <Moon size={18} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Sleep vs Mood</h4>
                                        <p className="text-xs text-muted-foreground">Correlation analysis</p>
                                    </div>
                                </div>

                                {correlations.length > 0 ? (
                                    <div className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ScatterChart>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                                <XAxis
                                                    dataKey="sleep"
                                                    name="Sleep (hrs)"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 11, fill: '#71717a' }}
                                                    domain={[4, 10]}
                                                    label={{ value: 'Sleep (hours)', position: 'bottom', fill: '#71717a', fontSize: 11 }}
                                                />
                                                <YAxis
                                                    dataKey="mood"
                                                    name="Mood"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 11, fill: '#71717a' }}
                                                    domain={[1, 5]}
                                                    label={{ value: 'Mood', angle: -90, position: 'left', fill: '#71717a', fontSize: 11 }}
                                                />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                                                    formatter={(value: any, name: string) => [value, name === 'sleep' ? 'Sleep (hrs)' : 'Mood Score']}
                                                />
                                                <Scatter data={correlations} fill="#8b5cf6" />
                                            </ScatterChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No Correlation Data"
                                        description="Log both sleep and mood entries to see patterns."
                                    />
                                )}
                            </motion.div>

                            {/* Weekly Performance */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-card border border-border rounded-3xl p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-xl bg-emerald-400/10">
                                        <TrendingUp size={18} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Performance Metrics</h4>
                                        <p className="text-xs text-muted-foreground">Focus, Energy & Stress</p>
                                    </div>
                                </div>

                                {performanceData.length > 0 ? (
                                    <div className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={performanceData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} domain={[0, 5]} />
                                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }} />
                                                <Legend />
                                                <Bar dataKey="focus" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Focus" />
                                                <Bar dataKey="energy" fill="#10b981" radius={[4, 4, 0, 0]} name="Energy" />
                                                <Bar dataKey="stress" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Stress" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No Performance Data"
                                        description="Log daily entries to track your performance metrics."
                                    />
                                )}
                            </motion.div>
                        </div>

                        {/* Monthly Heatmap */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-card border border-border rounded-3xl p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-rose-400/10">
                                    <Calendar size={18} className="text-rose-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Monthly Overview</h4>
                                    <p className="text-xs text-muted-foreground">Burnout risk by day (darker = higher risk)</p>
                                </div>
                            </div>

                            {heatmapData.length > 0 ? (
                                <div className="grid grid-cols-7 gap-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                        <div key={day} className="text-center text-xs font-bold text-muted-foreground mb-2">{day}</div>
                                    ))}
                                    {heatmapData.map((day: any, i: number) => {
                                        const intensity = day.score ? Math.min(day.score / 100, 1) : 0;
                                        const bgColor = day.score
                                            ? `rgba(239, 68, 68, ${0.2 + intensity * 0.6})`
                                            : 'rgba(39, 39, 42, 0.5)';
                                        return (
                                            <div
                                                key={i}
                                                className="aspect-square rounded-lg flex items-center justify-center text-xs font-medium border border-border/50 cursor-default"
                                                style={{ backgroundColor: bgColor }}
                                                title={day.score ? `Day ${day.day}: Score ${day.score}` : `Day ${day.day}: No data`}
                                            >
                                                {day.day}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <EmptyState
                                    title="No Monthly Data"
                                    description="Log entries throughout the month to see your heatmap."
                                />
                            )}

                            {heatmapData.length > 0 && (
                                <div className="flex items-center justify-center gap-4 mt-6">
                                    <span className="text-xs text-muted-foreground">Low Risk</span>
                                    <div className="flex gap-1">
                                        {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
                                            <div
                                                key={opacity}
                                                className="w-6 h-6 rounded"
                                                style={{ backgroundColor: `rgba(239, 68, 68, ${opacity})` }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">High Risk</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Detailed Metrics Line Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-card border border-border rounded-3xl p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {timeRange === "week" ? "7-Day" : "30-Day"} Multi-Metric Trend
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Sleep, mood, and energy over time</p>
                                </div>
                            </div>

                            {trendData.length > 0 && trendData.some((d: any) => d.sleep || d.mood || d.energy) ? (
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={trendData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                            <XAxis
                                                dataKey="label"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 11, fill: '#71717a' }}
                                                interval={timeRange === "month" ? 4 : 0}
                                            />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                                            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="sleep" stroke="#3b82f6" strokeWidth={2} dot={false} name="Sleep (hrs)" />
                                            <Line type="monotone" dataKey="mood" stroke="#f59e0b" strokeWidth={2} dot={false} name="Mood" />
                                            <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} dot={false} name="Energy" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <EmptyState
                                    title="No Multi-Metric Data"
                                    description="Log multiple entries to see trends across all metrics."
                                />
                            )}
                        </motion.div>
                    </>
                )}
            </main>
        </div>
    );
}
