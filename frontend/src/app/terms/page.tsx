"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Scale, AlertCircle } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-2 text-primary">
                        <Scale size={16} />
                        <span className="text-xs font-medium">Legal Terms</span>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-primary/10">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black">Terms of Service</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                <div className="prose prose-invert max-w-none space-y-8">
                    {/* Introduction */}
                    <section className="bg-card border border-border rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using Digital Burnout OS ("the Service"), you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our Service.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            We reserve the right to modify these terms at any time. Continued use of the Service after changes
                            constitutes acceptance of the new terms.
                        </p>
                    </section>

                    {/* Service Description */}
                    <section className="bg-card border border-border rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
                        <p className="text-muted-foreground mb-4">
                            Digital Burnout OS is a behavioral analytics platform designed to help users predict and prevent burnout through:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Daily mood and sleep tracking</li>
                            <li>AI-powered burnout risk prediction</li>
                            <li>Personalized wellness insights and recommendations</li>
                            <li>Trend analysis and pattern detection</li>
                        </ul>
                        <div className="mt-4 p-4 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                                <strong className="text-amber-400">Medical Disclaimer:</strong> This Service is NOT a medical device
                                and does not provide medical advice, diagnosis, or treatment. Always consult qualified healthcare
                                professionals for medical concerns.
                            </p>
                        </div>
                    </section>

                    {/* User Accounts */}
                    <section className="bg-card border border-border rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4">3. User Accounts & Responsibilities</h2>

                        <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Account Creation</h3>
                        <p className="text-muted-foreground">You must:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-3">
                            <li>Be at least 18 years old</li>
                            <li>Provide accurate, complete, and currentinformation</li>
                            <li>Maintain the security of your account password</li>
                            <li>Notify us immediately of any unauthorized access</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Account Restrictions</h3>
                        <p className="text-muted-foreground">You may NOT:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-3">
                            <li>Share your account with others</li>
                            <li>Create multiple accounts</li>
                            <li>Use automated tools to access the Service</li>
                            <li>Attempt to reverse engineer or hack the platform</li>
                        </ul>
                    </section>

                    {/* Subscription & Payments */}
                    <section className="bg-card border border-border rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4">4. Subscriptions & Payments</h2>

                        <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Subscription Plans</h3>
                        <div className="space-y-3">
                            <div className="bg-background/50 rounded-xl p-4">
                                <h4 className="font-semibold mb-2">Free Plan</h4>
                                <p className="text-sm text-muted-foreground">
                                    Basic tracking features with limited history.
                                </p>
                            </div>
                            <div className="bg-background/50 rounded-xl p-4">
                                <h4 className="font-semibold mb-2">Pro Plan (₹749/month + GST)</h4>
                                <p className="text-sm text-muted-foreground">
                                    AI insights, 30-day analysis, unlimited PDF reports, priority support.
                                </p>
                            </div>
                            <div className="bg-background/50 rounded-xl p-4">
                                <h4 className="font-semibold mb-2">Enterprise Plan (₹4,999/month + GST)</h4>
                                <p className="text-sm text-muted-foreground">
                                    Team analytics, admin controls, API access, dedicated support.
                                </p>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Billing & Auto-Renewal</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>All prices are in Indian Rupees (INR) and <strong>include 18% GST</strong></li>
                            <li>Subscriptions auto-renew monthly unless cancelled</li>
                            <li>Payment processing is handled by Razorpay (PCI-DSS compliant)</li>
                            <li>Failed payments may result in service suspension</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Cancellation & Refunds</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>You can cancel anytime - no cancellation fees</li>
                            <li>Access continues until the end of the billing period</li>
                            <li><strong>Refunds:</strong> Available within 7 days if no data has been logged</li>
                            <li>No partial refunds for partial month usage</li>
                        </ul>
                    </section>

                    {/* Acceptable Use */}
                    <section className="bg-card border border-border rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4">5. Acceptable Use Policy</h2>
                        <p className="text-muted-foreground mb-4">You agree NOT to:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Use the Service for any illegal purpose</li>
                            <li>Upload malicious code or viruses</li>
                            <li>Attempt to gain unauthorized access to systems</li>
                            <li>Scrape data from the platform</li>
                            <li>Harass, abuse, or harm other users</li>
                            <li>Impersonate any person or entity</li>
                            <li>Spam or flood the Service</li>
                        </ul>
                        <p className="text-sm text-rose-400 mt-4">
                            Violation of this policy may result in immediate account termination without refund.
                        </p>
                    </section>

                    {/* Intellectual Property */}
                    <section className="bg-card border border-border rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>

                        <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Our Rights</h3>
                        <p className="text-muted-foreground">
                            All content, design, code, algorithms, and features of Digital Burnout OS are owned by us and protected
                            by copyright, trademark, and other laws. You may not copy, modify, or distribute our intellectual property.
                        </p>

                        <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Your Data</h3>
                        <p className="text-muted-foreground">
                            You retain ownership of all data you provide. By using the Service, you grant us a limited license to
                            process your data solely to provide the Service and improve our AI models (in aggregated, anonymized form).
                        </p>
                    </section>

                    {/* Disclaimers */}
                    <section className="bg-card border border-border rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4">7. Disclaimers & Limitations</h2>

                        <div className="space-y-4">
                            <div className="p-4 bg-amber-400/10 border border-amber-400/20 rounded-xl">
                                <h4 className="font-semibold text-amber-400 mb-2">⚠️ "AS IS" Service</h4>
                                <p className="text-sm text-muted-foreground">
                                    The Service is provided "as is" without warranties of any kind, express or implied. We do not
                                    guarantee accuracy, reliability, or availability of the Service.
                                </p>
                            </div>

                            <div className="p-4 bg-amber-400/10 border border-amber-400/20 rounded-xl">
                                <h4 className="font-semibold text-amber-400 mb-2">⚠️ Limitation of Liability</h4>
                                <p className="text-sm text-muted-foreground">
                                    To the maximum extent permitted by law, we shall not be liable for any indirect, incidental,
                                    special, or consequential damages arising from your use of the Service. Our total liability
                                    is limited to the amount you paid in the last 12 months.
                                </p>
                            </div>

                            <div className="p-4 bg-amber-400/10 border border-amber-400/20 rounded-xl">
                                <h4 className="font-semibold text-amber-400 mb-2">⚠️ Not Medical Advice</h4>
                                <p className="text-sm text-muted-foreground">
                                    Our insights and predictions are for informational purposes only. Do not delay seeking medical
                                    advice or disregard professional medical advice based on our Service. In case of emergency,
                                    contact healthcare professionals immediately.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Termination */}
                    <section className="bg-card border border-border rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
                        <p className="text-muted-foreground mb-4">
                            We reserve the right to suspend or terminate your account:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>For violation of these Terms</li>
                            <li>For fraudulent payment activity</li>
                            <li>For abuse of the Service</li>
                            <li>At our discretion, with or without cause (with refund for unused time)</li>
                        </ul>
                        <p className="text-muted-foreground mt-4">
                            Upon termination, your access will cease immediately, and your data will be deleted as per our
                            Privacy Policy.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section className="bg-card border border-border rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4">9. Governing Law & Dispute Resolution</h2>
                        <p className="text-muted-foreground">
                            These Terms are governed by the laws of India. Any disputes shall be resolved in courts located
                            in [Your City], India.
                        </p>
                        <p className="text-muted-foreground mt-4">
                            Before filing any legal action, you agree to attempt to resolve disputes through good-faith negotiation
                            with us.
                        </p>
                    </section>

                    {/* Changes to Terms */}
                    <section className="bg-card border border-border rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4">10. Changes to These Terms</h2>
                        <p className="text-muted-foreground">
                            We may update these Terms from time to time. Material changes will be notified via email or in-app
                            notification at least 30 days in advance. Your continued use after changes take effect constitutes
                            acceptance.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
                        <p className="text-muted-foreground mb-4">
                            Questions about these Terms? Contact us:
                        </p>
                        <div className="space-y-2 text-muted-foreground">
                            <p><strong>Email:</strong> legal@burnoutsolution.com</p>
                            <p><strong>Support:</strong> support@burnoutsolution.com</p>
                            <p><strong>Address:</strong> [Your Company Address]</p>
                        </div>
                    </section>
                </div>

                {/* Footer CTA */}
                <div className="mt-12 text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                        By clicking "Subscribe" or using our Service, you acknowledge that you have read and agree to these Terms.
                    </p>
                    <Link
                        href="/"
                        className="btn-primary px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
