"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Heart, Briefcase, Brain, CheckCircle2, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { LoadingButton } from "@/components/Loading";

export default function TrackPage() {
    const [step, setStep] = useState<"sleep" | "mood" | "work" | "complete">("sleep");
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [sleepHours, setSleepHours] = useState(7);
    const [sleepQuality, setSleepQuality] = useState(3);
    const [moodScore, setMoodScore] = useState(3);
    const [moodNotes, setMoodNotes] = useState("");
    const [workHours, setWorkHours] = useState(8);
    const [workIntensity, setWorkIntensity] = useState(3);
    const [stressLevel, setStressLevel] = useState(3);

    const handleSubmit = async () => {
        setSubmitting(true);
        const submitToast = toast.loading("Saving your daily log...");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            // Submit sleep log
            await fetch(`${apiUrl}/api/v1/tracking/sleep`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    hours: sleepHours,
                    quality: sleepQuality,
                    date: new Date().toISOString().split('T')[0]
                })
            });

            // Submit mood entry
            await fetch(`${apiUrl}/api/v1/tracking/mood`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    score: moodScore,
                    notes: moodNotes,
                    date: new Date().toISOString().split('T')[0]
                })
            });

            // Submit behavior log
            await fetch(`${apiUrl}/api/v1/tracking/behavior`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    work_hours: workHours,
                    work_intensity: workIntensity,
                    stress_level: stressLevel,
                    date: new Date().toISOString().split('T')[0]
                })
            });

            toast.dismiss(submitToast);
            toast.success("Daily log saved! Great job staying consistent! 🎉");
            setStep("complete");
        } catch (error) {
            console.error("Error submitting:", error);
            toast.dismiss(submitToast);
            toast.error("Failed to save log. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border/50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h1 className="text-xl font-bold">Daily Check-In</h1>
                    </div>
                    <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                        Skip for today →
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12">
                {step !== "complete" ? (
                    <>
                        {/* Progress indicator */}
                        <div className="flex items-center gap-2 mb-8">
                            <div className={`flex-1 h-2 rounded-full ${step === "sleep" || step === "mood" || step === "work" ? "bg-primary" : "bg-muted"}`} />
                            <div className={`flex-1 h-2 rounded-full ${step === "mood" || step === "work" ? "bg-primary" : "bg-muted"}`} />
                            <div className={`flex-1 h-2 rounded-full ${step === "work" ? "bg-primary" : "bg-muted"}`} />
                        </div>

                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Sleep Tracking */}
                            {step === "sleep" && (
                                <div className="space-y-8">
                                    <div className="text-center space-y-3">
                                        <div className="inline-flex p-4 rounded-2xl bg-primary/10">
                                            <Moon className="w-8 h-8 text-primary" />
                                        </div>
                                        <h2 className="text-3xl font-bold">How did you sleep?</h2>
                                        <p className="text-muted-foreground">Quality sleep is crucial for preventing burnout</p>
                                    </div>

                                    <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold mb-3">
                                                Hours of sleep: <span className="text-primary text-2xl">{sleepHours}h</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="12"
                                                step="0.5"
                                                value={sleepHours}
                                                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                                                className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                                <span>0h</span>
                                                <span>6h</span>
                                                <span>12h</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-3">Sleep quality</label>
                                            <div className="grid grid-cols-5 gap-3">
                                                {[1, 2, 3, 4, 5].map((quality) => (
                                                    <button
                                                        key={quality}
                                                        onClick={() => setSleepQuality(quality)}
                                                        className={`p-4 rounded-xl border-2 transition-all ${sleepQuality === quality
                                                                ? "border-primary bg-primary/10 scale-105"
                                                                : "border-border hover:border-primary/50"
                                                            }`}
                                                    >
                                                        <div className="text-2xl mb-1">
                                                            {quality === 1 ? "😫" : quality === 2 ? "😕" : quality === 3 ? "😐" : quality === 4 ? "😊" : "😴"}
                                                        </div>
                                                        <div className="text-xs font-medium">
                                                            {quality === 1 ? "Poor" : quality === 2 ? "Fair" : quality === 3 ? "Good" : quality === 4 ? "Great" : "Excellent"}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setStep("mood")}
                                        className="w-full btn-primary py-4 rounded-xl font-bold"
                                    >
                                        Next: Mood Check →
                                    </button>
                                </div>
                            )}

                            {/* Mood Tracking */}
                            {step === "mood" && (
                                <div className="space-y-8">
                                    <div className="text-center space-y-3">
                                        <div className="inline-flex p-4 rounded-2xl bg-primary/10">
                                            <Heart className="w-8 h-8 text-primary" />
                                        </div>
                                        <h2 className="text-3xl font-bold">How are you feeling?</h2>
                                        <p className="text-muted-foreground">Your emotional state is important to track</p>
                                    </div>

                                    <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold mb-3">Overall mood</label>
                                            <div className="grid grid-cols-5 gap-3">
                                                {[1, 2, 3, 4, 5].map((mood) => (
                                                    <button
                                                        key={mood}
                                                        onClick={() => setMoodScore(mood)}
                                                        className={`p-4 rounded-xl border-2 transition-all ${moodScore === mood
                                                                ? "border-primary bg-primary/10 scale-105"
                                                                : "border-border hover:border-primary/50"
                                                            }`}
                                                    >
                                                        <div className="text-3xl mb-1">
                                                            {mood === 1 ? "😢" : mood === 2 ? "😟" : mood === 3 ? "😐" : mood === 4 ? "😊" : "😄"}
                                                        </div>
                                                        <div className="text-xs font-medium">
                                                            {mood === 1 ? "Bad" : mood === 2 ? "Low" : mood === 3 ? "Okay" : mood === 4 ? "Good" : "Great"}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-3">
                                                Any notes? <span className="text-muted-foreground font-normal">(optional)</span>
                                            </label>
                                            <textarea
                                                value={moodNotes}
                                                onChange={(e) => setMoodNotes(e.target.value)}
                                                placeholder="What's affecting your mood today?"
                                                className="w-full p-4 bg-background border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep("sleep")}
                                            className="flex-1 btn-secondary py-4 rounded-xl font-bold"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            onClick={() => setStep("work")}
                                            className="flex-1 btn-primary py-4 rounded-xl font-bold"
                                        >
                                            Next: Work Check →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Work/Stress Tracking */}
                            {step === "work" && (
                                <div className="space-y-8">
                                    <div className="text-center space-y-3">
                                        <div className="inline-flex p-4 rounded-2xl bg-primary/10">
                                            <Briefcase className="w-8 h-8 text-primary" />
                                        </div>
                                        <h2 className="text-3xl font-bold">Work & Stress</h2>
                                        <p className="text-muted-foreground">Understanding work patterns helps predict burnout</p>
                                    </div>

                                    <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold mb-3">
                                                Work hours today: <span className="text-primary text-2xl">{workHours}h</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="16"
                                                step="0.5"
                                                value={workHours}
                                                onChange={(e) => setWorkHours(parseFloat(e.target.value))}
                                                className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                                <span>0h</span>
                                                <span>8h</span>
                                                <span>16h</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-3">Work intensity</label>
                                            <div className="grid grid-cols-5 gap-3">
                                                {[1, 2, 3, 4, 5].map((intensity) => (
                                                    <button
                                                        key={intensity}
                                                        onClick={() => setWorkIntensity(intensity)}
                                                        className={`p-4 rounded-xl border-2 transition-all ${workIntensity === intensity
                                                                ? "border-primary bg-primary/10 scale-105"
                                                                : "border-border hover:border-primary/50"
                                                            }`}
                                                    >
                                                        <div className="text-2xl mb-1">
                                                            {intensity === 1 ? "🟢" : intensity === 2 ? "🟡" : intensity === 3 ? "🟠" : intensity === 4 ? "🔴" : "🔥"}
                                                        </div>
                                                        <div className="text-xs font-medium">
                                                            {intensity === 1 ? "Light" : intensity === 2 ? "Moderate" : intensity === 3 ? "Busy" : intensity === 4 ? "Intense" : "Extreme"}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-3">Stress level</label>
                                            <div className="grid grid-cols-5 gap-3">
                                                {[1, 2, 3, 4, 5].map((stress) => (
                                                    <button
                                                        key={stress}
                                                        onClick={() => setStressLevel(stress)}
                                                        className={`p-4 rounded-xl border-2 transition-all ${stressLevel === stress
                                                                ? "border-primary bg-primary/10 scale-105"
                                                                : "border-border hover:border-primary/50"
                                                            }`}
                                                    >
                                                        <div className="text-2xl mb-1">
                                                            {stress === 1 ? "😌" : stress === 2 ? "🙂" : stress === 3 ? "😐" : stress === 4 ? "😰" : "🤯"}
                                                        </div>
                                                        <div className="text-xs font-medium">
                                                            {stress === 1 ? "Calm" : stress === 2 ? "Low" : stress === 3 ? "Medium" : stress === 4 ? "High" : "Very High"}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep("mood")}
                                            className="flex-1 btn-secondary py-4 rounded-xl font-bold"
                                        >
                                            ← Back
                                        </button>
                                        <LoadingButton
                                            onClick={handleSubmit}
                                            loading={submitting}
                                            className="flex-1"
                                        >
                                            Complete Check-In 🎉
                                        </LoadingButton>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                ) : (
                    // Completion Screen
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8"
                    >
                        <div className="inline-flex p-6 rounded-full bg-primary/10">
                            <CheckCircle2 className="w-16 h-16 text-primary" />
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-4xl font-bold">You're all set! 🎉</h2>
                            <p className="text-xl text-muted-foreground">
                                Your daily check-in has been saved
                            </p>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-6 max-w-md mx-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <Brain className="w-5 h-5 text-primary" />
                                <h3 className="font-bold">Today's Summary</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Sleep</span>
                                    <span className="font-semibold">{sleepHours}h (Quality: {sleepQuality}/5)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Mood</span>
                                    <span className="font-semibold">{moodScore}/5</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Work Hours</span>
                                    <span className="font-semibold">{workHours}h</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Stress Level</span>
                                    <span className="font-semibold">{stressLevel}/5</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/dashboard"
                                className="block w-full max-w-md mx-auto btn-primary py-4 rounded-xl font-bold"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <TrendingUp size={20} />
                                    View Your Analytics
                                </div>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                                Come back tomorrow to keep your streak going! 🔥
                            </p>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
