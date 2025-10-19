import React, { useState } from "react";
import { Wallet, TrendingUp, PieChart, ArrowRight } from "lucide-react";

const Form = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remembered, setRemembered] = useState(false);

    const features = [
        { icon: <Wallet className="w-6 h-6" />, title: "Smart Tracking", desc: "Monitor every expense" },
        { icon: <TrendingUp className="w-6 h-6" />, title: "Analytics", desc: "Visualize spending trends" },
        { icon: <PieChart className="w-6 h-6" />, title: "Budgeting", desc: "Plan your finances" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ email, password, remembered });
    };

    return (
        <div className="h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                <style>{`
                    @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    }
                    .animate-blob { animation: blob 7s infinite; }
                    .animation-delay-2000 { animation-delay: 2s; }
                    .animation-delay-4000 { animation-delay: 4s; }
                `}</style>

                <div className="relative flex items-center justify-center h-full px-4">
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full items-center">
                    {/* Left section - Content */}
                    <div className="hidden md:flex flex-col space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl">
                                <Wallet className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
                                SpendWise
                                </h1>
                            </div>
                            <p className="text-sm text-gray-600">Master your money with intelligent expense tracking</p>
                            </div>

                            <div className="space-y-1">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="flex gap-2 group cursor-pointer">
                                        <div className="p-1.5 bg-pink-100 rounded-md text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                                            <div className="w-4 h-4">{feature.icon}</div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-xs">{feature.title}</h3>
                                            <p className="text-xs text-gray-500">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <div className="w-0.5 h-0.5 rounded-full bg-pink-500"></div>
                                Join thousands managing their finances
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <div className="w-0.5 h-0.5 rounded-full bg-pink-500"></div>
                                Real-time tracking and insights
                            </div>
                            </div>
                        </div>

                        {/* Right section - Form Card */}
                        <div className="w-full">
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-white/20">
                            {/* Mobile header */}
                            <div className="md:hidden mb-4 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="p-1.5 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg">
                                    <Wallet className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-bold text-pink-600">SpendWise</span>
                                </div>
                                <p className="text-gray-600 text-xs">Take control of your spending</p>
                            </div>

                            <h2 className="text-xl font-bold text-gray-800 mb-0.5 text-center">Welcome Back</h2>
                            <p className="text-center text-gray-500 text-xs mb-3">Sign in to your expense tracker</p>

                            <div className="space-y-3">
                                <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-1.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400"
                                />
                                </div>

                                <div>
                                <div className="flex justify-between items-center mb-0.5">
                                    <label className="block text-xs font-semibold text-gray-700">
                                    Password
                                    </label>
                                    <a href="#" className="text-xs text-pink-500 hover:text-pink-600 font-medium">
                                    Forgot?
                                    </a>
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-1.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400"
                                />
                                </div>

                                <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={remembered}
                                    onChange={(e) => setRemembered(e.target.checked)}
                                    className="w-3 h-3 rounded cursor-pointer accent-pink-500"
                                />
                                <label htmlFor="remember" className="text-xs text-gray-600 cursor-pointer">
                                    Keep me signed in
                                </label>
                                </div>

                                <button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-1.5 rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 flex items-center justify-center gap-2 group text-xs"
                                >
                                Sign In
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-center text-gray-600 text-xs">
                                New to SpendWise?{" "}
                                <a href="/register" className="text-pink-600 font-bold hover:text-pink-700 transition-colors">
                                    Create an account
                                </a>
                                </p>
                            </div>

                            <p className="text-center text-xs text-gray-400 mt-2">
                                By signing in, you agree to our Terms & Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;