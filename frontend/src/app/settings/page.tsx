"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Settings,
    User,
    Bell,
    Moon,
    Shield,
    Palette,
    Clock,
    Globe,
    Smartphone,
    Mail,
    Lock,
    Download,
    Trash2,
    ChevronRight,
    Check,
    Sun,
    Monitor,
    Volume2,
    VolumeX,
    Eye,
    EyeOff,
    Save,
    LogOut,
    HelpCircle,
    MessageSquare,
    ExternalLink
} from "lucide-react";
import api from "@/services/api";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState("profile");

    // Settings state
    const [settings, setSettings] = useState({
        // Profile
        fullName: "",
        email: "",
        timezone: "Asia/Kolkata",

        // Notifications
        emailNotifications: true,
        pushNotifications: true,
        dailyReminder: true,
        reminderTime: "20:00",
        weeklyReport: true,
        achievementAlerts: true,
        insightAlerts: true,

        // Appearance
        compactMode: false,
        animationsEnabled: true,

        // Privacy
        profileVisible: false,
        shareAnonymousData: true,

        // Goals
        sleepGoal: 7.5,
        workHoursGoal: 8,
        exerciseGoal: 30,
        screenTimeLimit: 8
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await api.get("/users/me");
            setUser(res.data);
            setSettings(prev => ({
                ...prev,
                fullName: res.data.full_name || "",
                email: res.data.email || "",
                sleepGoal: res.data.baseline_sleep_hours || 7.5,
                workHoursGoal: res.data.work_hours_goal || 8
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put("/users/me", {
                full_name: settings.fullName,
                baseline_sleep_hours: settings.sleepGoal,
                work_hours_goal: settings.workHoursGoal
            });
            // Save other settings to localStorage
            localStorage.setItem("userSettings", JSON.stringify(settings));
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const SECTIONS = [
        { id: "profile", icon: <User size={20} />, label: "Profile" },
        { id: "notifications", icon: <Bell size={20} />, label: "Notifications" },
        { id: "appearance", icon: <Palette size={20} />, label: "Appearance" },
        { id: "goals", icon: <Clock size={20} />, label: "Goals & Targets" },
        { id: "privacy", icon: <Shield size={20} />, label: "Privacy" },
        { id: "help", icon: <HelpCircle size={20} />, label: "Help & Support" }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border/50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-xl transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <Settings size={20} className="text-primary" /> Settings
                            </h1>
                            <p className="text-xs text-muted-foreground">Manage your preferences</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
                    >
                        {saving ? "Saving..." : <><Save size={18} /> Save Changes</>}
                    </button>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <nav className="w-64 shrink-0 hidden lg:block">
                        <div className="sticky top-24 space-y-1">
                            {SECTIONS.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeSection === section.id
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                        }`}
                                >
                                    {section.icon}
                                    <span className="font-medium">{section.label}</span>
                                </button>
                            ))}

                            <hr className="my-4 border-border" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-rose-400 hover:bg-rose-400/10 transition-all"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Log Out</span>
                            </button>
                        </div>
                    </nav>

                    {/* Content */}
                    <div className="flex-1 space-y-8">
                        {/* Profile Section */}
                        {activeSection === "profile" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Profile</h2>
                                    <p className="text-muted-foreground">Manage your account information</p>
                                </div>

                                <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                                    {/* Avatar */}
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
                                            {settings.fullName?.split(" ").map(n => n[0]).join("") || "U"}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{settings.fullName || "User"}</h3>
                                            <p className="text-sm text-muted-foreground">{settings.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        <div>
                                            <label className="text-sm font-bold mb-2 block">Full Name</label>
                                            <input
                                                type="text"
                                                value={settings.fullName}
                                                onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl focus-ring"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold mb-2 block">Email</label>
                                            <input
                                                type="email"
                                                value={settings.email}
                                                disabled
                                                className="w-full px-4 py-3 rounded-xl bg-secondary text-muted-foreground"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold mb-2 block">Timezone</label>
                                            <select
                                                value={settings.timezone}
                                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl focus-ring"
                                            >
                                                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                                <option value="America/New_York">America/New York (EST)</option>
                                                <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                                                <option value="Europe/London">Europe/London (GMT)</option>
                                                <option value="Europe/Paris">Europe/Paris (CET)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Notifications Section */}
                        {activeSection === "notifications" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Notifications</h2>
                                    <p className="text-muted-foreground">Control how and when we notify you</p>
                                </div>

                                <div className="bg-card border border-border rounded-2xl divide-y divide-border">
                                    <ToggleSetting
                                        icon={<Mail size={20} />}
                                        title="Email Notifications"
                                        description="Receive updates and reports via email"
                                        enabled={settings.emailNotifications}
                                        onChange={(v) => setSettings({ ...settings, emailNotifications: v })}
                                    />
                                    <ToggleSetting
                                        icon={<Smartphone size={20} />}
                                        title="Push Notifications"
                                        description="Get real-time alerts on your device"
                                        enabled={settings.pushNotifications}
                                        onChange={(v) => setSettings({ ...settings, pushNotifications: v })}
                                    />
                                    <ToggleSetting
                                        icon={<Clock size={20} />}
                                        title="Daily Reminder"
                                        description="Remind me to log my daily entry"
                                        enabled={settings.dailyReminder}
                                        onChange={(v) => setSettings({ ...settings, dailyReminder: v })}
                                    />
                                    {settings.dailyReminder && (
                                        <div className="p-6">
                                            <label className="text-sm font-bold mb-2 block">Reminder Time</label>
                                            <input
                                                type="time"
                                                value={settings.reminderTime}
                                                onChange={(e) => setSettings({ ...settings, reminderTime: e.target.value })}
                                                className="px-4 py-2 rounded-xl focus-ring"
                                            />
                                        </div>
                                    )}
                                    <ToggleSetting
                                        icon={<Mail size={20} />}
                                        title="Weekly Report"
                                        description="Receive your wellness report every Sunday"
                                        enabled={settings.weeklyReport}
                                        onChange={(v) => setSettings({ ...settings, weeklyReport: v })}
                                    />
                                    <ToggleSetting
                                        icon={<Bell size={20} />}
                                        title="Achievement Alerts"
                                        description="Notify me when I unlock badges"
                                        enabled={settings.achievementAlerts}
                                        onChange={(v) => setSettings({ ...settings, achievementAlerts: v })}
                                    />
                                    <ToggleSetting
                                        icon={<Bell size={20} />}
                                        title="AI Insight Alerts"
                                        description="Notify me of new AI-detected patterns"
                                        enabled={settings.insightAlerts}
                                        onChange={(v) => setSettings({ ...settings, insightAlerts: v })}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Appearance Section */}
                        {activeSection === "appearance" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Appearance</h2>
                                    <p className="text-muted-foreground">Customize how BurnoutOS looks</p>
                                </div>

                                <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                                    <div>
                                        <label className="text-sm font-bold mb-4 block">Theme</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { id: "light" as const, icon: <Sun size={24} />, label: "Light" },
                                                { id: "dark" as const, icon: <Moon size={24} />, label: "Dark" },
                                                { id: "system" as const, icon: <Monitor size={24} />, label: "System" }
                                            ].map((themeOption) => (
                                                <button
                                                    key={themeOption.id}
                                                    onClick={() => setTheme(themeOption.id)}
                                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === themeOption.id
                                                        ? "border-primary bg-primary/10"
                                                        : "border-border hover:border-primary/50"
                                                        }`}
                                                >
                                                    {themeOption.icon}
                                                    <span className="text-sm font-medium">{themeOption.label}</span>
                                                    {theme === themeOption.id && <Check size={16} className="text-primary" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <ToggleSetting
                                        icon={<Eye size={20} />}
                                        title="Compact Mode"
                                        description="Use a more condensed layout"
                                        enabled={settings.compactMode}
                                        onChange={(v) => setSettings({ ...settings, compactMode: v })}
                                    />
                                    <ToggleSetting
                                        icon={<Palette size={20} />}
                                        title="Animations"
                                        description="Enable smooth transitions and effects"
                                        enabled={settings.animationsEnabled}
                                        onChange={(v) => setSettings({ ...settings, animationsEnabled: v })}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Goals Section */}
                        {activeSection === "goals" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Goals & Targets</h2>
                                    <p className="text-muted-foreground">Set your personal wellness targets</p>
                                </div>

                                <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                                    <div>
                                        <label className="text-sm font-bold mb-2 flex items-center justify-between">
                                            <span>Daily Sleep Goal</span>
                                            <span className="text-primary">{settings.sleepGoal} hours</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="5"
                                            max="10"
                                            step="0.5"
                                            value={settings.sleepGoal}
                                            onChange={(e) => setSettings({ ...settings, sleepGoal: parseFloat(e.target.value) })}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>5h</span><span>10h</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold mb-2 flex items-center justify-between">
                                            <span>Daily Work Hours Limit</span>
                                            <span className="text-primary">{settings.workHoursGoal} hours</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="4"
                                            max="12"
                                            step="0.5"
                                            value={settings.workHoursGoal}
                                            onChange={(e) => setSettings({ ...settings, workHoursGoal: parseFloat(e.target.value) })}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>4h</span><span>12h</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold mb-2 flex items-center justify-between">
                                            <span>Daily Exercise Goal</span>
                                            <span className="text-primary">{settings.exerciseGoal} min</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="120"
                                            step="5"
                                            value={settings.exerciseGoal}
                                            onChange={(e) => setSettings({ ...settings, exerciseGoal: parseInt(e.target.value) })}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>0 min</span><span>120 min</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold mb-2 flex items-center justify-between">
                                            <span>Screen Time Limit</span>
                                            <span className="text-primary">{settings.screenTimeLimit} hours</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="2"
                                            max="14"
                                            step="0.5"
                                            value={settings.screenTimeLimit}
                                            onChange={(e) => setSettings({ ...settings, screenTimeLimit: parseFloat(e.target.value) })}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>2h</span><span>14h</span>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/goals" className="block bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold mb-1">Manage Daily Goals</h3>
                                            <p className="text-sm text-muted-foreground">Track and customize your daily wellness goals</p>
                                        </div>
                                        <ChevronRight size={20} className="text-muted-foreground" />
                                    </div>
                                </Link>
                            </motion.div>
                        )}

                        {/* Privacy Section */}
                        {activeSection === "privacy" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Privacy</h2>
                                    <p className="text-muted-foreground">Control your data and privacy settings</p>
                                </div>

                                <div className="bg-card border border-border rounded-2xl divide-y divide-border">
                                    <ToggleSetting
                                        icon={<Eye size={20} />}
                                        title="Profile Visibility"
                                        description="Allow others to see your profile (for teams)"
                                        enabled={settings.profileVisible}
                                        onChange={(v) => setSettings({ ...settings, profileVisible: v })}
                                    />
                                    <ToggleSetting
                                        icon={<Shield size={20} />}
                                        title="Anonymous Data Sharing"
                                        description="Help improve BurnoutOS with anonymized insights"
                                        enabled={settings.shareAnonymousData}
                                        onChange={(v) => setSettings({ ...settings, shareAnonymousData: v })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Link href="/privacy" className="block bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Download size={20} className="text-primary" />
                                                <div>
                                                    <h3 className="font-bold">Export Your Data</h3>
                                                    <p className="text-sm text-muted-foreground">Download all your data as PDF</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={20} className="text-muted-foreground" />
                                        </div>
                                    </Link>

                                    <Link href="/privacy" className="block bg-card border border-rose-400/20 rounded-2xl p-6 hover:border-rose-400/50 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Trash2 size={20} className="text-rose-400" />
                                                <div>
                                                    <h3 className="font-bold text-rose-400">Delete Account</h3>
                                                    <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={20} className="text-muted-foreground" />
                                        </div>
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        {/* Help Section */}
                        {activeSection === "help" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Help & Support</h2>
                                    <p className="text-muted-foreground">Get help and contact us</p>
                                </div>

                                <div className="space-y-4">
                                    <Link href="#" className="block bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <HelpCircle size={24} className="text-primary" />
                                            <div>
                                                <h3 className="font-bold">Help Center</h3>
                                                <p className="text-sm text-muted-foreground">Browse FAQs and guides</p>
                                            </div>
                                        </div>
                                    </Link>

                                    <a href="mailto:divyanshugupta068@gmail.com" className="block bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <MessageSquare size={24} className="text-primary" />
                                            <div>
                                                <h3 className="font-bold">Contact Support</h3>
                                                <p className="text-sm text-muted-foreground">divyanshugupta068@gmail.com</p>
                                            </div>
                                        </div>
                                    </a>

                                    <a href="mailto:divyanshugupta068@gmail.com" className="block bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <Mail size={24} className="text-primary" />
                                            <div>
                                                <h3 className="font-bold">Email Us</h3>
                                                <p className="text-sm text-muted-foreground">divyanshugupta068@gmail.com</p>
                                            </div>
                                        </div>
                                    </a>

                                    <Link href="#" className="block bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <ExternalLink size={24} className="text-primary" />
                                            <div>
                                                <h3 className="font-bold">API Documentation</h3>
                                                <p className="text-sm text-muted-foreground">For developers and integrations</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>

                                <div className="bg-secondary/50 rounded-2xl p-6 text-center">
                                    <p className="text-sm text-muted-foreground mb-2">BurnoutOS v2.0.0</p>
                                    <p className="text-xs text-muted-foreground">© 2026 BurnoutOS Inc.</p>
                                    <p className="text-xs text-primary mt-2">Contact: divyanshugupta068@gmail.com</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Toggle Setting Component
function ToggleSetting({
    icon,
    title,
    description,
    enabled,
    onChange
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    enabled: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
                <div className="text-muted-foreground">{icon}</div>
                <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`w-12 h-7 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-secondary'}`}
            >
                <motion.div
                    animate={{ x: enabled ? 22 : 2 }}
                    className="w-5 h-5 bg-white rounded-full shadow-sm"
                />
            </button>
        </div>
    );
}
