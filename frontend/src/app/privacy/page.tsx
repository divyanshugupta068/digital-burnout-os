"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ShieldCheck,
    Download,
    Trash2,
    Lock,
    CheckCircle2,
    AlertTriangle,
    ChevronRight,
    FileText,
    Server,
    Shield,
    Fingerprint,
    Loader2
} from "lucide-react";
import api from "@/services/api";

export default function PrivacyPage() {
    const [exporting, setExporting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await api.get("/users/me/export");
            const data = res.data;

            // Generate PDF-like HTML content
            const htmlContent = generatePDFContent(data);

            // Create a new window for printing/saving as PDF
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                // Auto-trigger print dialog which allows Save as PDF
                setTimeout(() => {
                    printWindow.print();
                }, 500);
            }
        } catch (err) {
            console.error("Export error:", err);
            alert("Failed to export data. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    const generatePDFContent = (data: any) => {
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>BurnoutOS - My Health Data Export</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 40px; 
            max-width: 800px; 
            margin: 0 auto;
            color: #333;
            line-height: 1.6;
          }
          .header { 
            border-bottom: 3px solid #8b5cf6; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .logo { 
            font-size: 28px; 
            font-weight: bold; 
            color: #8b5cf6; 
          }
          .logo span { color: #333; }
          .date { color: #666; margin-top: 5px; }
          h1 { font-size: 24px; margin: 30px 0 15px; color: #1a1a1a; }
          h2 { font-size: 18px; margin: 25px 0 10px; color: #8b5cf6; }
          .section { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 15px 0; 
          }
          .info-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 10px 0; 
            border-bottom: 1px solid #eee; 
          }
          .info-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #555; }
          .value { color: #333; }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0; 
          }
          th, td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #ddd; 
          }
          th { 
            background: #8b5cf6; 
            color: white; 
            font-weight: 600; 
          }
          tr:nth-child(even) { background: #f8f9fa; }
          .footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #ddd; 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
          }
          .empty { 
            color: #999; 
            font-style: italic; 
            padding: 20px; 
            text-align: center; 
          }
          @media print {
            body { padding: 20px; }
            .section { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo"><span>Burnout</span>OS</div>
          <div class="date">Data Export - ${date}</div>
        </div>

        <h1>📋 Personal Health Data Report</h1>
        
        <h2>👤 Profile Information</h2>
        <div class="section">
          <div class="info-row">
            <span class="label">Email</span>
            <span class="value">${data.user?.email || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Full Name</span>
            <span class="value">${data.user?.full_name || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Baseline Sleep Goal</span>
            <span class="value">${data.user?.onboarding?.baseline_sleep || 'Not set'} hours</span>
          </div>
          <div class="info-row">
            <span class="label">Work Hours Goal</span>
            <span class="value">${data.user?.onboarding?.work_goal || 'Not set'} hours</span>
          </div>
          <div class="info-row">
            <span class="label">Primary Stress Sources</span>
            <span class="value">${data.user?.onboarding?.stress_source || 'Not set'}</span>
          </div>
          <div class="info-row">
            <span class="label">Primary Goal</span>
            <span class="value">${data.user?.onboarding?.goal || 'Not set'}</span>
          </div>
        </div>

        <h2>😴 Sleep Logs</h2>
        ${data.data?.sleep_logs?.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Hours</th>
                <th>Quality (1-5)</th>
              </tr>
            </thead>
            <tbody>
              ${data.data.sleep_logs.slice(0, 30).map((log: any) => `
                <tr>
                  <td>${new Date(log.date).toLocaleDateString()}</td>
                  <td>${log.hours} hrs</td>
                  <td>${log.quality}/5</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<div class="empty">No sleep logs recorded yet.</div>'}

        <h2>😊 Mood Entries</h2>
        ${data.data?.mood_entries?.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Score (1-5)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${data.data.mood_entries.slice(0, 30).map((entry: any) => `
                <tr>
                  <td>${new Date(entry.date).toLocaleDateString()}</td>
                  <td>${entry.score}/5</td>
                  <td>${entry.notes || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<div class="empty">No mood entries recorded yet.</div>'}

        <h2>📊 Burnout Scores</h2>
        ${data.data?.burnout_scores?.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Score (0-100)</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              ${data.data.burnout_scores.slice(0, 30).map((score: any) => `
                <tr>
                  <td>${new Date(score.date).toLocaleDateString()}</td>
                  <td>${score.score}</td>
                  <td>${score.risk_level}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<div class="empty">No burnout scores calculated yet.</div>'}

        <div class="footer">
          <p>This document was generated by BurnoutOS on ${date}</p>
          <p>Your data is private and encrypted. We never sell your behavioral data.</p>
          <p>© ${new Date().getFullYear()} BurnoutOS - All Rights Reserved</p>
        </div>
      </body>
      </html>
    `;
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete("/users/me");
            localStorage.clear();
            window.location.href = "/";
        } catch (err) {
            console.error(err);
            setDeleting(false);
        }
    };

    const securityFeatures = [
        { icon: <Lock size={20} />, title: "AES-256 Encryption", desc: "All data encrypted at rest and in transit" },
        { icon: <Server size={20} />, title: "Isolated Storage", desc: "Your data is siloed, never cross-referenced" },
        { icon: <Shield size={20} />, title: "GDPR Compliant", desc: "Full compliance with data protection laws" },
        { icon: <Fingerprint size={20} />, title: "Secure Auth", desc: "JWT tokens with short-lived sessions" },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border/50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-xl transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">Privacy Center</h1>
                        <p className="text-xs text-muted-foreground">You control your data</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
                {/* Hero Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gradient-border p-8 lg:p-12 rounded-3xl"
                >
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div className="p-6 rounded-3xl bg-primary/10">
                            <ShieldCheck size={48} className="text-primary" />
                        </div>
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold mb-3">Your data is <span className="gradient-text">yours</span></h2>
                            <p className="text-muted-foreground max-w-xl">
                                At BurnoutOS, we treat behavioral data with the same sensitivity as medical records.
                                We never sell your data to third parties or use it for advertising. Period.
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
                                    <CheckCircle2 size={14} /> Zero Data Sales
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
                                    <CheckCircle2 size={14} /> Full Encryption
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
                                    <CheckCircle2 size={14} /> GDPR Ready
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Security Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {securityFeatures.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4"
                        >
                            <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                                {feature.icon}
                            </div>
                            <div>
                                <h4 className="font-bold mb-1">{feature.title}</h4>
                                <p className="text-sm text-muted-foreground">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Data Portability - PDF Export */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border border-border rounded-3xl p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-blue-400/10">
                            <FileText size={22} className="text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Data Portability</h3>
                            <p className="text-sm text-muted-foreground">Download all your data as a PDF report</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground mb-6">
                        Export your complete behavioral history — sleep logs, mood entries, burnout scores, and profile data —
                        in a beautifully formatted PDF document that you can save, print, or share with your healthcare provider.
                    </p>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-3 bg-secondary hover:bg-secondary/80 text-foreground px-6 py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
                    >
                        {exporting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Generating PDF...
                            </>
                        ) : (
                            <>
                                <Download size={20} />
                                Download My Data (PDF)
                            </>
                        )}
                        <ChevronRight size={18} className="ml-auto" />
                    </button>
                </motion.div>

                {/* Danger Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-rose-500/10">
                            <Trash2 size={22} className="text-rose-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-rose-400">Danger Zone</h3>
                            <p className="text-sm text-muted-foreground">Irreversible actions</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground mb-6">
                        Once you delete your account, all your historical behavioral patterns, burnout scores, and profile data will be permanently purged from our databases and backups.
                        <span className="text-rose-400 font-bold"> This action cannot be undone.</span>
                    </p>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-6 py-4 rounded-2xl font-bold transition-all"
                        >
                            Delete My Account Permanently
                        </button>
                    ) : (
                        <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-4">
                            <div className="flex items-center gap-3 text-rose-400">
                                <AlertTriangle size={20} />
                                <span className="font-bold">Are you absolutely sure?</span>
                            </div>
                            <p className="text-sm text-muted-foreground">All your data will be permanently deleted. This includes behavioral logs, scores, and recommendations.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                                >
                                    {deleting ? "Deleting..." : "Yes, Purge Everything"}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="bg-secondary hover:bg-secondary/80 px-6 py-3 rounded-xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Footer */}
                <div className="text-center py-8 opacity-50">
                    <p className="text-xs font-medium">BurnoutOS v1.0.0 • Privacy-First Architecture</p>
                </div>
            </main>
        </div>
    );
}
