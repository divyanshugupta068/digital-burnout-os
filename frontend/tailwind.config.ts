import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--foreground)",
                },
                destructive: {
                    DEFAULT: "#ef4444",
                    foreground: "#fafafa",
                },
                border: "var(--border)",
                ring: "var(--ring)",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'xl': '16px',
                '2xl': '20px',
                '3xl': '24px',
                '4xl': '32px',
            },
            boxShadow: {
                'glow': '0 0 40px rgba(139, 92, 246, 0.3)',
                'glow-lg': '0 0 60px rgba(139, 92, 246, 0.4)',
                'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' },
                    '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
