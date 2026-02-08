"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Briefcase, Zap, Target, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import api from "@/services/api";

const steps = [
    {
        id: "sleep",
        title: "How much do you typically sleep?",
        description: "This helps us establish your baseline recovery rate.",
        icon: <Moon className="h-10 w-10" />,
        iconColor: "text-blue-400",
        iconBg: "bg-blue-400/10",
        field: "baseline_sleep_hours",
        type: "slider",
        min: 4,
        max: 12,
        step: 0.5,
        unit: "hours"
    },
    {
        id: "work",
        title: "What's your ideal work day length?",
        description: "We'll detect when you're overextending beyond this.",
        icon: <Briefcase className="h-10 w-10" />,
        iconColor: "text-amber-400",
        iconBg: "bg-amber-400/10",
        field: "work_hours_goal",
        type: "slider",
        min: 4,
        max: 14,
        step: 0.5,
        unit: "hours"
    },
    {
        id: "stress",
        title: "What stresses you the most?",
        description: "Select all that apply. Understanding your triggers helps personalize recommendations.",
        icon: <Zap className="h-10 w-10" />,
        iconColor: "text-rose-400",
        iconBg: "bg-rose-400/10",
        field: "primary_stress_source",
        type: "multi-select", // Changed to multi-select
        options: [
            { value: "Workload", label: "Heavy Workload", emoji: "📋" },
            { value: "Deadlines", label: "Tight Deadlines", emoji: "⏰" },
            { value: "Uncertainty", label: "Uncertainty", emoji: "❓" },
            { value: "Social", label: "Social Dynamics", emoji: "👥" },
            { value: "Health", label: "Personal/Health", emoji: "💊" },
            { value: "Finances", label: "Financial Stress", emoji: "💰" },
            { value: "Sleep", label: "Poor Sleep", emoji: "😴" },
            { value: "Family", label: "Family Issues", emoji: "👨‍👩‍👧" },
        ]
    },
    {
        id: "goal",
        title: "What's your primary goal?",
        description: "We'll tailor insights based on what matters most.",
        icon: <Target className="h-10 w-10" />,
        iconColor: "text-primary",
        iconBg: "bg-primary/10",
        field: "goal",
        type: "options",
        options: [
            { value: "Productivity", label: "Boost Productivity", emoji: "🚀" },
            { value: "Balance", label: "Work-Life Balance", emoji: "⚖️" },
            { value: "Recovery", label: "Physical Recovery", emoji: "💪" },
            { value: "Sleep", label: "Better Sleep", emoji: "😴" },
            { value: "Stress", label: "Reduce Stress", emoji: "🧘" },
        ]
    }
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<any>({
        baseline_sleep_hours: 7.5,
        work_hours_goal: 8,
        primary_stress_source: [], // Now an array for multi-select
        goal: ""
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            submitOnboarding();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const toggleStressSource = (value: string) => {
        const current = formData.primary_stress_source || [];
        if (current.includes(value)) {
            setFormData({
                ...formData,
                primary_stress_source: current.filter((v: string) => v !== value)
            });
        } else {
            setFormData({
                ...formData,
                primary_stress_source: [...current, value]
            });
        }
    };

    const submitOnboarding = async () => {
        setLoading(true);
        try {
            // Convert array to comma-separated string for backend
            const dataToSend = {
                ...formData,
                primary_stress_source: Array.isArray(formData.primary_stress_source)
                    ? formData.primary_stress_source.join(", ")
                    : formData.primary_stress_source
            };
            await api.post("/users/onboarding", dataToSend);
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            router.push("/dashboard");
        }
    };

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    // Check if can proceed
    const canProceed = () => {
        if (step.type === "slider") return true;
        if (step.type === "multi-select") {
            return formData[step.field] && formData[step.field].length > 0;
        }
        return formData[step.field] && formData[step.field] !== "";
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-2xl w-full relative z-10">
                {/* Progress */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2 flex-1">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? "bg-primary" : "bg-secondary"}`}
                            />
                        ))}
                    </div>
                    <span className="ml-4 text-sm text-muted-foreground font-medium">{currentStep + 1}/{steps.length}</span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="bg-card border border-border rounded-3xl p-8 lg:p-12 shadow-2xl"
                    >
                        {/* Icon */}
                        <div className={`p-4 rounded-2xl w-fit mb-8 ${step.iconBg}`}>
                            <div className={step.iconColor}>{step.icon}</div>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl lg:text-4xl font-bold mb-3">{step.title}</h2>
                        <p className="text-muted-foreground mb-10">{step.description}</p>

                        {/* Input */}
                        <div className="min-h-[220px]">
                            {step.type === "slider" ? (
                                <div className="space-y-8">
                                    <div className="text-center">
                                        <span className="text-6xl font-black text-primary">{formData[step.field]}</span>
                                        <span className="text-2xl text-muted-foreground ml-2">{step.unit}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={step.min}
                                        max={step.max}
                                        step={step.step}
                                        value={formData[step.field]}
                                        onChange={(e) => setFormData({ ...formData, [step.field]: parseFloat(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                        <span>{step.min}h</span>
                                        <span>{step.max}h</span>
                                    </div>
                                </div>
                            ) : step.type === "multi-select" ? (
                                <div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {step.options?.map((option) => {
                                            const isSelected = formData[step.field]?.includes(option.value);
                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => toggleStressSource(option.value)}
                                                    className={`p-4 text-center rounded-2xl border transition-all flex flex-col items-center gap-2 ${isSelected
                                                            ? "border-primary bg-primary/10 ring-2 ring-primary"
                                                            : "border-border hover:border-primary/50 hover:bg-secondary/50"
                                                        }`}
                                                >
                                                    <span className="text-2xl">{option.emoji}</span>
                                                    <span className="text-xs font-bold">{option.label}</span>
                                                    {isSelected && (
                                                        <CheckCircle2 size={16} className="text-primary" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-center text-xs text-muted-foreground mt-4">
                                        {formData[step.field]?.length || 0} selected
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {step.options?.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setFormData({ ...formData, [step.field]: option.value })}
                                            className={`p-5 text-left rounded-2xl border transition-all flex items-center gap-4 ${formData[step.field] === option.value
                                                    ? "border-primary bg-primary/10 ring-2 ring-primary"
                                                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
                                                }`}
                                        >
                                            <span className="text-2xl">{option.emoji}</span>
                                            <span className="font-bold">{option.label}</span>
                                            {formData[step.field] === option.value && (
                                                <CheckCircle2 size={20} className="text-primary ml-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="mt-12 flex justify-between items-center">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all font-medium px-4 py-2 rounded-xl hover:bg-secondary"
                            >
                                <ArrowLeft size={18} /> Back
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!canProceed() || loading}
                                className="btn-primary py-4 px-8 rounded-2xl font-bold flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    "Setting up..."
                                ) : isLastStep ? (
                                    <>
                                        <Sparkles size={18} /> Launch Dashboard
                                    </>
                                ) : (
                                    <>
                                        Continue <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
