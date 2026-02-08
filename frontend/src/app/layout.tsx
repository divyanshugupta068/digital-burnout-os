import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import ToastProvider from "@/components/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Digital Burnout OS | Predict & Prevent Burnout",
    description: "An intelligent behavioral analytics platform that correlates screen habits, sleep, mood, and work intensity to prevent burnout.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <ThemeProvider>
                    {children}
                    <ToastProvider />
                </ThemeProvider>
            </body>
        </html>
    );
}
