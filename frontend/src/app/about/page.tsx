"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    HeartPulse,
    ArrowLeft,
    Sparkles,
    Target,
    Users,
    Heart,
    Globe,
    Award,
    Linkedin,
    Twitter,
    Mail,
    Building2,
    TrendingUp,
    Shield
} from "lucide-react";

const TEAM = [
    {
        name: "Dr. Sarah Mitchell",
        role: "CEO & Co-Founder",
        bio: "Former Google Health PM. PhD in Organizational Psychology from Stanford.",
        avatar: "SM",
        linkedin: "#",
        twitter: "#"
    },
    {
        name: "James Chen",
        role: "CTO & Co-Founder",
        bio: "Ex-Stripe engineer. Built ML systems at scale. MIT CS graduate.",
        avatar: "JC",
        linkedin: "#",
        twitter: "#"
    },
    {
        name: "Dr. Emily Watson",
        role: "Chief Science Officer",
        bio: "Clinical psychologist specializing in workplace burnout. 15+ years experience.",
        avatar: "EW",
        linkedin: "#",
        twitter: "#"
    },
    {
        name: "Marcus Johnson",
        role: "Head of Product",
        bio: "Previously led product at Calm. Passionate about mental health tech.",
        avatar: "MJ",
        linkedin: "#",
        twitter: "#"
    },
    {
        name: "Priya Sharma",
        role: "Head of Engineering",
        bio: "Built infrastructure at Netflix. Loves solving complex distributed systems.",
        avatar: "PS",
        linkedin: "#",
        twitter: "#"
    },
    {
        name: "Alex Rivera",
        role: "Head of Design",
        bio: "Design lead at Figma. Believer in human-centered wellness design.",
        avatar: "AR",
        linkedin: "#",
        twitter: "#"
    }
];

const VALUES = [
    {
        icon: <Heart className="w-8 h-8" />,
        title: "Empathy First",
        description: "We build for humans, not metrics. Every feature is designed with compassion."
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Privacy Sacred",
        description: "Your behavioral data is sacred. We never sell it. Period."
    },
    {
        icon: <TrendingUp className="w-8 h-8" />,
        title: "Science-Backed",
        description: "Every algorithm is validated by peer-reviewed research."
    },
    {
        icon: <Users className="w-8 h-8" />,
        title: "Inclusive Design",
        description: "Mental health tools should be accessible to everyone."
    }
];

const MILESTONES = [
    { year: "2022", event: "Founded in San Francisco" },
    { year: "2023", event: "Y Combinator W23 batch" },
    { year: "2023", event: "Raised $4.2M Seed round" },
    { year: "2024", event: "50,000 users milestone" },
    { year: "2024", event: "Series A: $18M led by a16z" },
    { year: "2025", event: "Enterprise launch & HIPAA" },
    { year: "2026", event: "1M users worldwide" }
];

const INVESTORS = [
    "Y Combinator", "a16z", "General Catalyst", "First Round", "Kleiner Perkins"
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border/50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-secondary rounded-xl transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <Link href="/" className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-primary/20">
                                <HeartPulse className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-bold text-lg">Burnout<span className="text-primary">OS</span></span>
                        </Link>
                    </div>
                    <Link href="/signup" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold">
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                            <Building2 size={16} className="text-primary" />
                            <span className="text-sm font-medium">Our Story</span>
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-black mb-6">
                            We're on a mission to
                            <br />
                            <span className="gradient-text">end workplace burnout</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            BurnoutOS was born from personal experience. After watching talented colleagues
                            leave the industry due to burnout, we decided to build something that could
                            predict and prevent it.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 border-t border-border">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="prose prose-lg prose-invert max-w-none"
                    >
                        <h2 className="text-3xl font-bold mb-6">The Origin Story</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                            In 2022, our co-founder Sarah was a product manager at Google when she witnessed
                            three of her closest colleagues leave tech entirely due to burnout. They were
                            brilliant, passionate people—but the warning signs went unnoticed until it was too late.
                        </p>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                            She partnered with James, her Stanford roommate turned Stripe engineer, and together
                            they asked: <span className="text-foreground font-medium">"What if we could predict burnout like we predict churn?"</span>
                        </p>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            That question became BurnoutOS—an AI-powered system that analyzes behavioral signals
                            (sleep, mood, work patterns) to detect burnout 2-3 weeks before it hits. We're not just
                            tracking wellness metrics; we're building an early warning system for the modern workforce.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-card/50 border-y border-border">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-black mb-4">Our Values</h2>
                        <p className="text-muted-foreground text-lg">The principles that guide everything we build</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-card border border-border rounded-3xl p-8 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-muted-foreground">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-black mb-4">Meet the <span className="gradient-text">Team</span></h2>
                        <p className="text-muted-foreground text-lg">World-class talent united against burnout</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {TEAM.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-card border border-border rounded-3xl p-8 text-center group hover:border-primary/50 transition-all"
                            >
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white group-hover:scale-110 transition-transform">
                                    {member.avatar}
                                </div>
                                <h3 className="text-xl font-bold">{member.name}</h3>
                                <p className="text-primary font-medium text-sm mb-4">{member.role}</p>
                                <p className="text-muted-foreground text-sm mb-6">{member.bio}</p>
                                <div className="flex justify-center gap-4">
                                    <Link href={member.linkedin} className="p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                                        <Linkedin size={18} />
                                    </Link>
                                    <Link href={member.twitter} className="p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                                        <Twitter size={18} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 bg-card/50 border-y border-border">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-black mb-4">Our Journey</h2>
                        <p className="text-muted-foreground text-lg">From idea to million users</p>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
                        {MILESTONES.map((milestone, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative flex items-center gap-8 mb-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                            >
                                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                    <div className="font-bold text-primary text-lg">{milestone.year}</div>
                                    <div className="text-muted-foreground">{milestone.event}</div>
                                </div>
                                <div className="w-4 h-4 rounded-full bg-primary z-10 shrink-0" />
                                <div className="flex-1" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Investors */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Backed by the best</h2>
                        <p className="text-muted-foreground mb-10">$22M+ raised from world-class investors</p>
                        <div className="flex flex-wrap justify-center gap-8">
                            {INVESTORS.map((investor) => (
                                <div key={investor} className="text-xl font-bold text-muted-foreground">{investor}</div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 border-t border-border">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-3xl p-12"
                    >
                        <h2 className="text-4xl font-black mb-4">Join our mission</h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                            We're hiring world-class engineers, designers, and researchers.
                            Help us build the future of workplace wellness.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/signup" className="btn-primary px-8 py-4 rounded-2xl font-bold">
                                Try BurnoutOS Free
                            </Link>
                            <Link href="#" className="px-8 py-4 rounded-2xl font-bold bg-secondary hover:bg-secondary/80 transition-colors">
                                View Open Roles
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">© 2026 BurnoutOS Inc. All rights reserved.</p>
                <p className="text-sm text-primary mt-1">Contact: divyanshugupta068@gmail.com</p>
            </footer>
        </div>
    );
}
