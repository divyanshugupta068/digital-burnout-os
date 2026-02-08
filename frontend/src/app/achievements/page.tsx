"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Flame,
    Trophy,
    Target,
    Star,
    Medal,
    Zap,
    Moon,
    Smile,
    Heart,
    Award,
    Crown,
    Lock,
    CheckCircle2,
    Calendar,
    TrendingUp
} from "lucide-react";
import api from "@/services/api";

const BADGES = [
    {
        id: "first_log",
        name: "First Steps",
        description: "Log your first entry",
        icon: <Star />,
        color: "from-amber-400 to-yellow-500",
        requirement: 1
    },
    {
        id: "week_streak",
        name: "Week Warrior",
        description: "7-day logging streak",
        icon: <Flame />,
        color: "from-orange-400 to-red-500",
        requirement: 7
    },
    {
        id: "month_streak",
        name: "Monthly Master",
        description: "30-day logging streak",
        icon: <Crown />,
        color: "from-violet-400 to-purple-600",
        requirement: 30
    },
    {
        id: "sleep_champ",
        name: "Sleep Champion",
        description: "7+ hours sleep for 7 days",
        icon: <Moon />,
        color: "from-blue-400 to-indigo-500",
        requirement: 7
    },
    {
        id: "mood_master",
        name: "Mood Master",
        description: "Average mood 4+ for a week",
        icon: <Smile />,
        color: "from-emerald-400 to-green-500",
        requirement: 7
    },
    {
        id: "burnout_beater",
        name: "Burnout Beater",
        description: "Keep score under 30 for 2 weeks",
        icon: <Trophy />,
        color: "from-rose-400 to-pink-500",
        requirement: 14
    },
    {
        id: "early_bird",
        name: "Early Bird",
        description: "Log before 9 AM for 5 days",
        icon: <Zap />,
        color: "from-cyan-400 to-blue-500",
        requirement: 5
    },
    {
        id: "wellness_warrior",
        name: "Wellness Warrior",
        description: "Exercise 5+ days in a row",
        icon: <Heart />,
        color: "from-pink-400 to-rose-500",
        requirement: 5
    },
    {
        id: "century_club",
        name: "Century Club",
        description: "100 total entries logged",
        icon: <Medal />,
        color: "from-yellow-400 to-amber-500",
        requirement: 100
    }
];

const LEVELS = [
    { level: 1, name: "Beginner", xpRequired: 0, color: "from-zinc-400 to-zinc-500" },
    { level: 2, name: "Explorer", xpRequired: 100, color: "from-green-400 to-emerald-500" },
    { level: 3, name: "Tracker", xpRequired: 300, color: "from-blue-400 to-cyan-500" },
    { level: 4, name: "Analyst", xpRequired: 600, color: "from-violet-400 to-purple-500" },
    { level: 5, name: "Expert", xpRequired: 1000, color: "from-amber-400 to-yellow-500" },
    { level: 6, name: "Master", xpRequired: 1500, color: "from-rose-400 to-red-500" },
    { level: 7, name: "Legend", xpRequired: 2500, color: "from-fuchsia-400 to-pink-600" }
];

export default function AchievementsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get("/gamification/stats");
            setStats(res.data);
        } catch (err) {
            console.error(err);
            // Mock data for demo
            setStats({
                currentStreak: 5,
                longestStreak: 12,
                totalEntries: 47,
                totalXP: 470,
                unlockedBadges: ["first_log", "week_streak", "sleep_champ"],
                weeklyGoalProgress: 5,
                weeklyGoal: 7
            });
        } finally {
            setLoading(false);
        }
    };

    const getCurrentLevel = (xp: number) => {
        for (let i = LEVELS.length - 1; i >= 0; i--) {
            if (xp >= LEVELS[i].xpRequired) {
                return {
                    current: LEVELS[i],
                    next: LEVELS[i + 1] || null,
                    progress: LEVELS[i + 1]
                        ? ((xp - LEVELS[i].xpRequired) / (LEVELS[i + 1].xpRequired - LEVELS[i].xpRequired)) * 100
                        : 100
                };
            }
        }
        return { current: LEVELS[0], next: LEVELS[1], progress: 0 };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading achievements...</div>
            </div>
        );
    }

    const levelInfo = getCurrentLevel(stats?.totalXP || 0);
    const unlockedBadges = stats?.unlockedBadges || [];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border/50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-xl transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">Achievements</h1>
                        <p className="text-xs text-muted-foreground">Track your wellness journey</p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
                {/* Level & XP Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-8"
                >
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Level Badge */}
                        <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${levelInfo.current.color} flex items-center justify-center shadow-2xl`}>
                            <div className="text-center text-white">
                                <div className="text-4xl font-black">{levelInfo.current.level}</div>
                                <div className="text-xs font-bold opacity-80">LEVEL</div>
                            </div>
                        </div>

                        <div className="flex-1 text-center lg:text-left">
                            <div className="text-sm text-muted-foreground mb-1">Current Rank</div>
                            <h2 className="text-3xl font-black gradient-text mb-4">{levelInfo.current.name}</h2>

                            {/* XP Progress Bar */}
                            <div className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-bold">{stats?.totalXP || 0} XP</span>
                                    {levelInfo.next && (
                                        <span className="text-muted-foreground">{levelInfo.next.xpRequired} XP to {levelInfo.next.name}</span>
                                    )}
                                </div>
                                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${levelInfo.progress}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full bg-gradient-to-r ${levelInfo.current.color} rounded-full`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-3xl font-black text-orange-400">{stats?.currentStreak || 0}</div>
                                <div className="text-xs text-muted-foreground">Day Streak</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-emerald-400">{stats?.totalEntries || 0}</div>
                                <div className="text-xs text-muted-foreground">Total Entries</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-violet-400">{unlockedBadges.length}</div>
                                <div className="text-xs text-muted-foreground">Badges</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Streak Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Current Streak */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card border border-border rounded-3xl p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-orange-400/10">
                                <Flame size={24} className="text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Current Streak</h3>
                                <p className="text-xs text-muted-foreground">Keep the fire burning!</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-6xl font-black text-orange-400">{stats?.currentStreak || 0}</div>
                            <div className="text-muted-foreground">
                                <div className="font-bold">days in a row</div>
                                <div className="text-sm">Longest: {stats?.longestStreak || 0} days</div>
                            </div>
                        </div>

                        {/* Week Progress */}
                        <div className="flex gap-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 aspect-square rounded-xl flex items-center justify-center text-xs font-bold ${i < (stats?.weeklyGoalProgress || 0)
                                            ? 'bg-orange-400 text-background'
                                            : 'bg-secondary text-muted-foreground'
                                        }`}
                                >
                                    {i < (stats?.weeklyGoalProgress || 0) ? <CheckCircle2 size={16} /> : day}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Weekly Goal */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border border-border rounded-3xl p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-emerald-400/10">
                                <Target size={24} className="text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Weekly Goal</h3>
                                <p className="text-xs text-muted-foreground">Log 7 days this week</p>
                            </div>
                        </div>

                        <div className="relative mb-6">
                            <div className="text-6xl font-black text-center">
                                <span className="text-emerald-400">{stats?.weeklyGoalProgress || 0}</span>
                                <span className="text-muted-foreground text-3xl">/{stats?.weeklyGoal || 7}</span>
                            </div>
                        </div>

                        <div className="h-4 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((stats?.weeklyGoalProgress || 0) / (stats?.weeklyGoal || 7)) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                            />
                        </div>
                        <p className="text-center text-sm text-muted-foreground mt-4">
                            {(stats?.weeklyGoal || 7) - (stats?.weeklyGoalProgress || 0)} more days to complete this week!
                        </p>
                    </motion.div>
                </div>

                {/* Badges Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Badges</h2>
                            <p className="text-muted-foreground text-sm">{unlockedBadges.length} of {BADGES.length} unlocked</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {BADGES.map((badge, i) => {
                            const isUnlocked = unlockedBadges.includes(badge.id);
                            return (
                                <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + i * 0.05 }}
                                    className={`relative bg-card border rounded-2xl p-6 text-center transition-all ${isUnlocked
                                            ? 'border-primary/50 hover:border-primary'
                                            : 'border-border opacity-60'
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isUnlocked
                                            ? `bg-gradient-to-br ${badge.color} text-white shadow-lg`
                                            : 'bg-secondary text-muted-foreground'
                                        }`}>
                                        {isUnlocked ? badge.icon : <Lock size={24} />}
                                    </div>
                                    <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
                                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                                    {isUnlocked && (
                                        <div className="absolute -top-2 -right-2">
                                            <CheckCircle2 size={20} className="text-emerald-400 fill-emerald-400" />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* XP Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border rounded-3xl p-8"
                >
                    <h3 className="text-xl font-bold mb-6">How to Earn XP</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { action: "Log daily entry", xp: "+10 XP", icon: <Calendar size={20} />, color: "text-blue-400" },
                            { action: "Maintain streak", xp: "+5 XP/day", icon: <Flame size={20} />, color: "text-orange-400" },
                            { action: "Unlock badge", xp: "+50 XP", icon: <Award size={20} />, color: "text-amber-400" },
                            { action: "Complete week", xp: "+100 XP", icon: <Trophy size={20} />, color: "text-emerald-400" }
                        ].map((item, i) => (
                            <div key={i} className="bg-secondary/50 rounded-xl p-4 flex items-center gap-4">
                                <div className={item.color}>{item.icon}</div>
                                <div>
                                    <div className="font-bold text-sm">{item.action}</div>
                                    <div className="text-xs text-primary font-bold">{item.xp}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
