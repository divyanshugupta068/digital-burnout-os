"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Target,
    Plus,
    Check,
    X,
    Moon,
    Dumbbell,
    Droplets,
    Clock,
    Brain,
    Heart,
    Coffee,
    Users,
    Pencil,
    Trash2,
    Trophy,
    TrendingUp,
    Calendar,
    Flame,
    CheckCircle2,
    Circle,
    RotateCcw
} from "lucide-react";
import api from "@/services/api";

const GOAL_TEMPLATES = [
    { id: "sleep", icon: <Moon size={24} />, name: "Sleep 7+ Hours", category: "Sleep", target: 7, unit: "hours", color: "blue" },
    { id: "exercise", icon: <Dumbbell size={24} />, name: "Exercise Daily", category: "Exercise", target: 30, unit: "minutes", color: "green" },
    { id: "water", icon: <Droplets size={24} />, name: "Drink 8 Glasses", category: "Hydration", target: 8, unit: "glasses", color: "cyan" },
    { id: "breaks", icon: <Clock size={24} />, name: "Take 3+ Breaks", category: "Work", target: 3, unit: "breaks", color: "amber" },
    { id: "focus", icon: <Brain size={24} />, name: "Focus Time", category: "Productivity", target: 4, unit: "hours", color: "violet" },
    { id: "social", icon: <Users size={24} />, name: "Social Connection", category: "Social", target: 2, unit: "interactions", color: "pink" },
    { id: "caffeine", icon: <Coffee size={24} />, name: "Limit Caffeine", category: "Health", target: 3, unit: "cups max", color: "orange" },
    { id: "screen", icon: <Clock size={24} />, name: "Screen Time Limit", category: "Digital Wellness", target: 8, unit: "hours max", color: "rose" }
];

export default function GoalsPage() {
    const [goals, setGoals] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState<any>(null);
    const [customGoal, setCustomGoal] = useState({ name: "", target: 1, unit: "", category: "Custom" });

    useEffect(() => {
        // Load goals from localStorage or API
        const saved = localStorage.getItem("userGoals");
        if (saved) {
            setGoals(JSON.parse(saved));
        } else {
            // Default goals
            setGoals([
                { ...GOAL_TEMPLATES[0], progress: 6.5, active: true },
                { ...GOAL_TEMPLATES[1], progress: 20, active: true },
                { ...GOAL_TEMPLATES[2], progress: 5, active: true }
            ]);
        }
    }, []);

    const saveGoals = (newGoals: any[]) => {
        setGoals(newGoals);
        localStorage.setItem("userGoals", JSON.stringify(newGoals));
    };

    const addGoal = (template: any) => {
        const newGoal = { ...template, progress: 0, active: true };
        saveGoals([...goals, newGoal]);
        setShowAddModal(false);
    };

    const toggleGoal = (id: string) => {
        const updatedGoals = goals.map(g =>
            g.id === id ? { ...g, active: !g.active } : g
        );
        saveGoals(updatedGoals);
    };

    const deleteGoal = (id: string) => {
        saveGoals(goals.filter(g => g.id !== id));
    };

    const updateProgress = (id: string, progress: number) => {
        const updatedGoals = goals.map(g =>
            g.id === id ? { ...g, progress: Math.max(0, progress) } : g
        );
        saveGoals(updatedGoals);
    };

    const resetProgress = () => {
        const resetGoals = goals.map(g => ({ ...g, progress: 0 }));
        saveGoals(resetGoals);
    };

    const activeGoals = goals.filter(g => g.active);
    const completedToday = activeGoals.filter(g => g.progress >= g.target).length;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border/50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-xl transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <Target size={20} className="text-primary" /> Goals
                            </h1>
                            <p className="text-xs text-muted-foreground">Track your daily wellness targets</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                    >
                        <Plus size={18} /> Add Goal
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
                {/* Progress Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-8"
                >
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div className="relative w-36 h-36">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-secondary" />
                                <motion.circle
                                    cx="72" cy="72" r="64"
                                    stroke="url(#goalGrad)"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeLinecap="round"
                                    initial={{ strokeDashoffset: 402 }}
                                    animate={{ strokeDashoffset: 402 - (402 * (completedToday / Math.max(activeGoals.length, 1))) }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    style={{ strokeDasharray: 402 }}
                                />
                                <defs>
                                    <linearGradient id="goalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black">{completedToday}</span>
                                <span className="text-xs text-muted-foreground">of {activeGoals.length}</span>
                            </div>
                        </div>

                        <div className="flex-1 text-center lg:text-left">
                            <h2 className="text-2xl font-bold mb-2">Today's Progress</h2>
                            <p className="text-muted-foreground mb-4">
                                {completedToday === activeGoals.length && activeGoals.length > 0
                                    ? "🎉 Amazing! You've completed all your goals today!"
                                    : `Keep going! ${activeGoals.length - completedToday} goals left to complete.`
                                }
                            </p>
                            <button
                                onClick={resetProgress}
                                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 mx-auto lg:mx-0"
                            >
                                <RotateCcw size={16} /> Reset Today's Progress
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-3xl font-black text-orange-400">7</div>
                                <div className="text-xs text-muted-foreground">Day Streak</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-emerald-400">85%</div>
                                <div className="text-xs text-muted-foreground">Weekly Avg</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-violet-400">12</div>
                                <div className="text-xs text-muted-foreground">Best Streak</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Active Goals */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Active Goals</h2>
                        <span className="text-sm text-muted-foreground">{activeGoals.length} goals</span>
                    </div>

                    <div className="space-y-4">
                        {activeGoals.length === 0 ? (
                            <div className="text-center py-12 bg-card border border-border rounded-2xl">
                                <Target size={48} className="mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-bold mb-2">No Active Goals</h3>
                                <p className="text-muted-foreground mb-6">Add some goals to start tracking your progress</p>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="btn-primary px-6 py-3 rounded-xl font-bold"
                                >
                                    <Plus size={18} className="inline mr-2" /> Add Your First Goal
                                </button>
                            </div>
                        ) : (
                            activeGoals.map((goal, i) => {
                                const percentage = Math.min((goal.progress / goal.target) * 100, 100);
                                const isComplete = goal.progress >= goal.target;

                                return (
                                    <motion.div
                                        key={goal.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`bg-card border rounded-2xl p-6 ${isComplete ? 'border-emerald-400/50 bg-emerald-400/5' : 'border-border'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl bg-${goal.color}-400/10 text-${goal.color}-400`}>
                                                {goal.icon}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-bold flex items-center gap-2">
                                                        {goal.name}
                                                        {isComplete && <CheckCircle2 size={18} className="text-emerald-400" />}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => deleteGoal(goal.id)}
                                                            className="p-1.5 rounded-lg hover:bg-rose-400/10 text-muted-foreground hover:text-rose-400 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="h-3 bg-secondary rounded-full overflow-hidden mb-2">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        className={`h-full rounded-full ${isComplete ? 'bg-emerald-400' : `bg-${goal.color}-400`}`}
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        {goal.progress} / {goal.target} {goal.unit}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateProgress(goal.id, goal.progress - 1)}
                                                            className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center"
                                                        >
                                                            -
                                                        </button>
                                                        <button
                                                            onClick={() => updateProgress(goal.id, goal.progress + 1)}
                                                            className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Weekly Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-3xl p-6"
                >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-primary" /> This Week
                    </h3>
                    <div className="grid grid-cols-7 gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                            const isToday = i === new Date().getDay() - 1;
                            const completed = i < new Date().getDay() - 1 ? Math.floor(Math.random() * 4) + 2 : 0;
                            const total = activeGoals.length || 3;

                            return (
                                <div key={day} className={`text-center p-3 rounded-xl ${isToday ? 'bg-primary/10 border border-primary/20' : ''}`}>
                                    <div className="text-xs text-muted-foreground mb-2">{day}</div>
                                    <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${i < new Date().getDay() - 1
                                            ? completed === total ? 'bg-emerald-400 text-background' : 'bg-secondary'
                                            : isToday ? 'bg-primary/20' : 'bg-secondary/50'
                                        }`}>
                                        {i < new Date().getDay() - 1 ? (
                                            completed === total ? <Check size={18} /> : `${completed}`
                                        ) : isToday ? (
                                            `${completedToday}`
                                        ) : (
                                            <Circle size={14} className="text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </main>

            {/* Add Goal Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setShowAddModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border rounded-3xl p-8 max-w-lg w-full relative z-10 max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-secondary rounded-xl"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold mb-6">Add New Goal</h2>

                            <div className="space-y-4">
                                {GOAL_TEMPLATES.filter(t => !goals.find(g => g.id === t.id)).map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => addGoal(template)}
                                        className={`w-full p-4 rounded-xl border border-border hover:border-${template.color}-400/50 hover:bg-${template.color}-400/5 transition-all flex items-center gap-4 text-left`}
                                    >
                                        <div className={`p-3 rounded-xl bg-${template.color}-400/10 text-${template.color}-400`}>
                                            {template.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold">{template.name}</h3>
                                            <p className="text-sm text-muted-foreground">{template.target} {template.unit} per day</p>
                                        </div>
                                        <Plus size={20} className="text-muted-foreground" />
                                    </button>
                                ))}
                            </div>

                            {GOAL_TEMPLATES.filter(t => !goals.find(g => g.id === t.id)).length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    You've added all available goals!
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
