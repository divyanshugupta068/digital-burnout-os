"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Bell,
    BellOff,
    Check,
    CheckCheck,
    Trash2,
    AlertTriangle,
    TrendingUp,
    Trophy,
    Lightbulb,
    Heart,
    Moon,
    Zap,
    Clock,
    Filter,
    Settings
} from "lucide-react";
import api from "@/services/api";

const NOTIFICATION_TYPES = {
    alert: { icon: <AlertTriangle />, color: "text-rose-400", bg: "bg-rose-400/10" },
    achievement: { icon: <Trophy />, color: "text-amber-400", bg: "bg-amber-400/10" },
    insight: { icon: <Lightbulb />, color: "text-violet-400", bg: "bg-violet-400/10" },
    reminder: { icon: <Clock />, color: "text-blue-400", bg: "bg-blue-400/10" },
    tip: { icon: <Zap />, color: "text-emerald-400", bg: "bg-emerald-400/10" }
};

// Demo notifications
const DEMO_NOTIFICATIONS = [
    {
        id: 1,
        type: "alert",
        title: "Burnout Risk Increasing",
        message: "Your burnout score has risen 15% this week. Consider taking a break.",
        time: "10 minutes ago",
        read: false,
        actionUrl: "/dashboard"
    },
    {
        id: 2,
        type: "achievement",
        title: "🏆 Badge Unlocked: Week Warrior",
        message: "Congratulations! You've logged 7 days in a row.",
        time: "2 hours ago",
        read: false,
        actionUrl: "/achievements"
    },
    {
        id: 3,
        type: "insight",
        title: "New Pattern Detected",
        message: "We noticed your sleep quality drops on Sundays. Tap to learn more.",
        time: "5 hours ago",
        read: false,
        actionUrl: "/insights"
    },
    {
        id: 4,
        type: "reminder",
        title: "Daily Log Reminder",
        message: "Don't forget to log your daily entry to maintain your streak!",
        time: "8 hours ago",
        read: true,
        actionUrl: "/dashboard"
    },
    {
        id: 5,
        type: "tip",
        title: "Wellness Tip",
        message: "Studies show a 10-minute walk can boost mood for 2 hours. Try it today!",
        time: "1 day ago",
        read: true,
        actionUrl: null
    },
    {
        id: 6,
        type: "achievement",
        title: "🎯 Weekly Goal Complete",
        message: "You logged 7 days this week! You earned +100 XP.",
        time: "2 days ago",
        read: true,
        actionUrl: "/achievements"
    },
    {
        id: 7,
        type: "insight",
        title: "Sleep-Mood Correlation",
        message: "Your data shows a strong link between 7+ hours sleep and high mood scores.",
        time: "3 days ago",
        read: true,
        actionUrl: "/insights"
    }
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
    const [filter, setFilter] = useState<string>("all");
    const [loading, setLoading] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const filteredNotifications = filter === "all"
        ? notifications
        : filter === "unread"
            ? notifications.filter(n => !n.read)
            : notifications.filter(n => n.type === filter);

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border/50">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-xl transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </h1>
                            <p className="text-xs text-muted-foreground">Stay updated on your wellness journey</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                                title="Mark all as read"
                            >
                                <CheckCheck size={20} />
                            </button>
                        )}
                        <Link
                            href="#"
                            className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                            title="Notification settings"
                        >
                            <Settings size={20} />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-8">
                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { value: "all", label: "All" },
                        { value: "unread", label: "Unread" },
                        { value: "alert", label: "Alerts" },
                        { value: "achievement", label: "Achievements" },
                        { value: "insight", label: "Insights" },
                        { value: "reminder", label: "Reminders" }
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setFilter(tab.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === tab.value
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Empty State */}
                {filteredNotifications.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="p-6 rounded-3xl bg-secondary/50 w-fit mx-auto mb-6">
                            <BellOff size={48} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No notifications</h3>
                        <p className="text-muted-foreground">
                            {filter === "unread"
                                ? "You're all caught up!"
                                : "You don't have any notifications yet."}
                        </p>
                    </motion.div>
                )}

                {/* Notifications List */}
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filteredNotifications.map((notification, i) => {
                            const config = NOTIFICATION_TYPES[notification.type as keyof typeof NOTIFICATION_TYPES];
                            return (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`group bg-card border rounded-2xl p-5 transition-all hover:border-primary/50 ${notification.read ? 'border-border opacity-75' : 'border-primary/30 bg-primary/5'
                                        }`}
                                >
                                    <div className="flex gap-4">
                                        <div className={`p-3 rounded-xl ${config.bg} ${config.color} shrink-0`}>
                                            {config.icon}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-1">
                                                <h3 className={`font-bold ${notification.read ? '' : 'text-foreground'}`}>
                                                    {notification.title}
                                                </h3>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">
                                                    {notification.time}
                                                </span>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                                                            title="Mark as read"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-1.5 rounded-lg hover:bg-rose-400/10 transition-colors text-muted-foreground hover:text-rose-400"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    {notification.actionUrl && (
                                                        <Link
                                                            href={notification.actionUrl}
                                                            className="text-xs font-bold text-primary hover:underline"
                                                        >
                                                            View →
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Clear All Button */}
                {notifications.length > 0 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={clearAll}
                            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors"
                        >
                            Clear all notifications
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
