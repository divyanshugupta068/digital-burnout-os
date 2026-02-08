"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Send,
    Bot,
    User,
    Sparkles,
    Moon,
    Clock,
    Dumbbell,
    Heart,
    Lightbulb,
    Loader2
} from "lucide-react";

interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface AIChatbotProps {
    isOpen: boolean;
    onClose: () => void;
    initialContext?: {
        type: "bedtime" | "break" | "exercise" | "social" | "general";
        title: string;
    };
}

const CONTEXT_PROMPTS = {
    bedtime: {
        icon: <Moon size={24} />,
        color: "from-blue-400 to-indigo-500",
        systemMessage: "Hello! I'm your wellness companion. I see you want to set a bedtime reminder. Let me help you establish a healthy sleep routine. What time do you usually go to bed?",
        suggestions: [
            "What's the ideal bedtime for 7.5 hours of sleep?",
            "How can I wind down before bed?",
            "Why is consistent sleep important?",
            "Tips for falling asleep faster"
        ]
    },
    break: {
        icon: <Clock size={24} />,
        color: "from-amber-400 to-orange-500",
        systemMessage: "Hi there! Taking regular breaks is crucial for preventing burnout. I'll help you optimize your break schedule. How long are your typical work sessions?",
        suggestions: [
            "When should I take breaks?",
            "What's the Pomodoro technique?",
            "Quick 5-minute break activities",
            "How to set break reminders"
        ]
    },
    exercise: {
        icon: <Dumbbell size={24} />,
        color: "from-emerald-400 to-green-500",
        systemMessage: "Great choice on prioritizing exercise! Physical activity is one of the best ways to combat burnout. What type of exercise do you enjoy?",
        suggestions: [
            "Quick desk stretches I can do",
            "Best time to exercise for energy",
            "How much exercise do I need?",
            "Low-energy workouts for tired days"
        ]
    },
    social: {
        icon: <Heart size={24} />,
        color: "from-pink-400 to-rose-500",
        systemMessage: "Social connections are vital for mental health! I can help you find ways to stay connected. Are you looking to connect with friends, family, or colleagues?",
        suggestions: [
            "How do social connections help burnout?",
            "Quick ways to connect with friends",
            "Balancing social time with work",
            "Virtual connection ideas"
        ]
    },
    general: {
        icon: <Sparkles size={24} />,
        color: "from-violet-400 to-purple-500",
        systemMessage: "Hi! I'm your AI wellness companion. I can help you with sleep, breaks, exercise, stress management, and more. What would you like to work on?",
        suggestions: [
            "How can I reduce my burnout score?",
            "Why do I feel tired all the time?",
            "Tips for better work-life balance",
            "How to manage stress at work"
        ]
    }
};

// Simulated AI responses (in production, this would call a real AI API)
const getAIResponse = async (message: string, context: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerMessage = message.toLowerCase();

    // Sleep-related responses
    if (lowerMessage.includes("bedtime") || lowerMessage.includes("sleep")) {
        if (lowerMessage.includes("ideal") || lowerMessage.includes("best time")) {
            return "Based on research, the ideal bedtime for most adults is between 10 PM and 11 PM. If you need to wake up at 7 AM and want 7.5 hours of sleep, aim to be asleep by 11:30 PM. Since it takes about 15-20 minutes to fall asleep, I'd recommend getting in bed by 11:10 PM.\n\n📱 Would you like me to set a bedtime reminder for 11:00 PM?";
        }
        if (lowerMessage.includes("wind down") || lowerMessage.includes("falling asleep")) {
            return "Here's a great wind-down routine:\n\n🌙 **60 min before bed:** Dim the lights, stop work\n📱 **45 min:** Put away screens (blue light hurts melatonin)\n☕ **30 min:** No caffeine, maybe herbal tea\n📖 **15 min:** Light reading or gentle stretching\n🧘 **5 min:** Deep breathing or meditation\n\nConsistency is key—your body will start to expect sleep at the same time each night.";
        }
        if (lowerMessage.includes("consistent") || lowerMessage.includes("important")) {
            return "Consistent sleep is incredibly important for preventing burnout:\n\n✅ **Regulates cortisol** (stress hormone)\n✅ **Improves memory and focus** by 20-30%\n✅ **Boosts immune function**\n✅ **Stabilizes mood and emotions**\n✅ **Increases energy levels**\n\nYour body's circadian rhythm thrives on consistency. Even on weekends, try to stay within 30-60 minutes of your regular schedule.";
        }
    }

    // Break-related responses
    if (lowerMessage.includes("break") || lowerMessage.includes("pomodoro")) {
        if (lowerMessage.includes("when") || lowerMessage.includes("how often")) {
            return "Here's the research-backed break schedule:\n\n⏰ **Every 25-30 min:** Quick micro-break (30 seconds, look away from screen)\n⏰ **Every 52 min:** Short break (5-10 minutes, stand and stretch)\n⏰ **Every 90 min:** Longer break (15-20 minutes, walk, fresh air)\n\nYour data shows your focus drops after 2 PM—I'd recommend a longer break around 1:45 PM.";
        }
        if (lowerMessage.includes("pomodoro")) {
            return "The Pomodoro Technique is excellent for focus:\n\n1️⃣ **Work for 25 minutes** (one 'pomodoro')\n2️⃣ **Take a 5-minute break**\n3️⃣ **Repeat 4 times**\n4️⃣ **Take a longer 15-30 minute break**\n\nTips for success:\n• Use a timer (try Pomofocus.io)\n• During breaks, step away from your desk\n• Track your pomodoros to see productivity patterns\n\nWant me to help you set up pomodoro reminders?";
        }
        if (lowerMessage.includes("activities") || lowerMessage.includes("5-minute")) {
            return "Here are great 5-minute break activities:\n\n🚶 **Movement:** Walk to get water, do 10 squats\n👀 **Eye rest:** Look at something 20 feet away for 20 seconds\n🧘 **Breathing:** Box breathing (4-4-4-4)\n💪 **Stretching:** Neck rolls, shoulder shrugs, wrist circles\n🌿 **Nature:** Step outside, look at plants\n☕ **Social:** Quick chat with a colleague\n\nThe key is to fully disengage from work, even for just 5 minutes.";
        }
    }

    // Exercise-related responses
    if (lowerMessage.includes("exercise") || lowerMessage.includes("workout") || lowerMessage.includes("stretch")) {
        if (lowerMessage.includes("desk") || lowerMessage.includes("stretch")) {
            return "Here are desk stretches you can do right now:\n\n🙆 **Neck rolls:** 5 circles each direction\n💪 **Shoulder shrugs:** Raise, hold 5 sec, release x 5\n🙌 **Chest opener:** Clasp hands behind back, squeeze shoulder blades\n🖐️ **Wrist circles:** 10 each direction\n🦵 **Seated leg raises:** 10 each leg\n🧘 **Seated twist:** Hold 15 sec each side\n\nDoing these every hour can reduce tension headaches by 40%!";
        }
        if (lowerMessage.includes("time") || lowerMessage.includes("when")) {
            return "The best time to exercise depends on your goals:\n\n🌅 **Morning (6-9 AM):**\n• Boosts metabolism for the day\n• Improves focus and mood\n• Creates consistent habit\n\n🌞 **Afternoon (12-3 PM):**\n• Body temperature peaks (better performance)\n• Can combat the afternoon slump\n\n🌆 **Evening (5-7 PM):**\n• Muscles are warmest\n• Can help process work stress\n• Avoid within 2 hours of bedtime\n\nBased on your patterns, I'd recommend morning exercise to boost your typically lower morning energy.";
        }
        if (lowerMessage.includes("how much") || lowerMessage.includes("need")) {
            return "For burnout prevention, here's what research shows:\n\n**Minimum effective dose:**\n• 20 min moderate exercise, 3x/week\n• OR 10 min vigorous exercise, 3x/week\n\n**Optimal for mental health:**\n• 30-45 min, 4-5x/week\n• Mix of cardio and strength\n\n**Your current status:**\nYou've logged 2 exercise days this week. Adding just one more 20-min session could reduce your burnout risk by up to 15%! 💪";
        }
    }

    // Social connection responses
    if (lowerMessage.includes("social") || lowerMessage.includes("connect") || lowerMessage.includes("friend")) {
        if (lowerMessage.includes("help burnout") || lowerMessage.includes("how do")) {
            return "Social connections are powerful burnout buffers:\n\n🧠 **Reduces cortisol** (stress hormone) by up to 20%\n💬 **Processing emotions** with others builds resilience\n😊 **Oxytocin release** from social bonding\n🎯 **Perspective** from others helps problem-solving\n💪 **Support network** during tough times\n\nStudies show just 10 minutes of positive social interaction can improve mood for hours. Even introverts benefit from meaningful connections!";
        }
        if (lowerMessage.includes("quick") || lowerMessage.includes("ways")) {
            return "Quick ways to connect:\n\n📱 **Right now (2 min):**\n• Text a friend something you appreciate about them\n• React to someone's social media post thoughtfully\n\n☕ **Today (15 min):**\n• Quick coffee chat with a colleague\n• Voice note to a friend instead of text\n\n📅 **This week:**\n• Schedule a video call with someone you miss\n• Join an online community for a hobby\n\nWho's someone you've been meaning to reach out to?";
        }
    }

    // General burnout responses
    if (lowerMessage.includes("burnout") || lowerMessage.includes("tired") || lowerMessage.includes("stress")) {
        if (lowerMessage.includes("reduce") || lowerMessage.includes("score")) {
            return "Based on your data, here's your personalized burnout-reduction plan:\n\n**Biggest Impact (do these first):**\n1. 🌙 Improve sleep consistency (+7% health score)\n2. 💪 Add 2 exercise days (+5% health score)\n3. ⏰ Take regular breaks (+3% health score)\n\n**Your Key Patterns:**\n• Scores spike on Wednesdays (too many meetings)\n• Better days correlate with 7+ hours sleep\n\n**Quick Win for Today:**\nTake a 15-min walk before your next meeting. This alone can reduce stress by 20%.\n\nWant me to help you implement any of these?";
        }
        if (lowerMessage.includes("tired") || lowerMessage.includes("exhausted")) {
            return "Feeling constantly tired is a key burnout warning sign. Let's figure out why:\n\n**Common causes:**\n1. **Sleep debt** - Your avg is 6.5h (below your 7.5h goal)\n2. **Dehydration** - Are you drinking enough water?\n3. **Overwork** - Your screen time is high (9h avg)\n4. **Lack of recovery** - When did you last take a real break?\n\n**Immediate actions:**\n• Drink a glass of water right now 💧\n• Take 3 deep breaths 🧘\n• Step outside for 5 minutes 🌳\n\nSmall recoveries throughout the day can make a big difference. Would you like help scheduling recovery breaks?";
        }
    }

    // Default response
    return "That's a great question! Let me think about the best approach for you.\n\nBased on your recent patterns, I'd suggest focusing on:\n\n1. **Sleep quality** - Your most impactful factor\n2. **Regular breaks** - You tend to work long stretches\n3. **Movement** - Even short walks help a lot\n\nWould you like specific tips for any of these areas? I can also help you set up reminders and track your progress.";
};

export default function AIChatbot({ isOpen, onClose, initialContext }: AIChatbotProps) {
    const context = initialContext?.type || "general";
    const contextConfig = CONTEXT_PROMPTS[context];

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: "assistant",
            content: contextConfig.systemMessage,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && initialContext) {
            setMessages([{
                id: 1,
                role: "assistant",
                content: contextConfig.systemMessage,
                timestamp: new Date()
            }]);
        }
    }, [isOpen, initialContext]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: messages.length + 1,
            role: "user",
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await getAIResponse(input, context);
            const assistantMessage: Message = {
                id: messages.length + 2,
                role: "assistant",
                content: response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error getting AI response:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-card border border-border rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col relative z-10 overflow-hidden"
                >
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${contextConfig.color} p-6 text-white`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    {contextConfig.icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">AI Wellness Coach</h2>
                                    <p className="text-sm text-white/80">{initialContext?.title || "Your personal wellness assistant"}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                            >
                                <div className={`p-2 rounded-full shrink-0 ${message.role === "assistant"
                                        ? `bg-gradient-to-br ${contextConfig.color} text-white`
                                        : "bg-secondary"
                                    }`}>
                                    {message.role === "assistant" ? <Bot size={20} /> : <User size={20} />}
                                </div>
                                <div className={`max-w-[80%] p-4 rounded-2xl ${message.role === "assistant"
                                        ? "bg-secondary"
                                        : "bg-primary text-primary-foreground"
                                    }`}>
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {message.content}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-start gap-3"
                            >
                                <div className={`p-2 rounded-full bg-gradient-to-br ${contextConfig.color} text-white`}>
                                    <Bot size={20} />
                                </div>
                                <div className="bg-secondary p-4 rounded-2xl">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Loader2 size={16} className="animate-spin" />
                                        <span className="text-sm">Thinking...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions */}
                    {messages.length <= 2 && (
                        <div className="px-6 pb-4">
                            <p className="text-xs text-muted-foreground mb-3">Try asking:</p>
                            <div className="flex flex-wrap gap-2">
                                {contextConfig.suggestions.map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="px-3 py-1.5 bg-secondary rounded-full text-xs hover:bg-secondary/80 transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-border">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Ask me anything about wellness..."
                                className="flex-1 px-4 py-3 rounded-xl focus-ring"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className={`p-3 rounded-xl transition-colors ${input.trim() && !isLoading
                                        ? `bg-gradient-to-r ${contextConfig.color} text-white`
                                        : "bg-secondary text-muted-foreground"
                                    }`}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-3">
                            AI provides general wellness guidance. For medical advice, consult a professional.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
