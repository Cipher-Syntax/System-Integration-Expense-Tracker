import React, { useEffect, useState } from "react";
import { Wallet, TrendingUp, PieChart, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/api";

const Form = ({ route, method }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm();
    const [error, setError] = useState("");
    const [remembered, setRemembered] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const passwordValue = watch("password", "");
    const status = method === "login" ? "Login" : "Register";

    // Clear error after 2s
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Load remembered username
    useEffect(() => {
        const savedUsername = localStorage.getItem("rememberedUsername");
        if (savedUsername) {
            setRemembered(true);
            setValue("username", savedUsername);
        }
    }, [setValue]);

    const formatPhoneNumber = (phone) => {
        let formatted = phone.replace(/\s+/g, "").replace(/-/g, "");

        if (formatted.startsWith("0")) {
            formatted = "63" + formatted.slice(1);
        } else if (formatted.startsWith("+63")) {
            formatted = "63" + formatted.slice(3);
        } else if (formatted.startsWith("63")) {
            formatted = formatted; // already correct
        } else if (formatted.length === 10) {
            formatted = "63" + formatted;
        }

        return formatted;
    };


    // Handle form submit
    const onSubmit = async (data) => {
        if (data.phone_number) {
            data.phone_number = formatPhoneNumber(data.phone_number);
        }

        try {
            const res = await api.post(route, data, { withCredentials: true });

            if (method === "login") {
                // Remember username if checked
                remembered
                    ? localStorage.setItem("rememberedUsername", data.username)
                    : localStorage.removeItem("rememberedUsername");

                // Note: We no longer save access_token to localStorage. 
                // It is now an HttpOnly cookie.
                if (data.username) {
                    localStorage.setItem("user", data.username);
                }

                navigate("/");
            } else {
                // On registration, navigate to login
                navigate("/login");
            }
        } catch (err) {
            const res = err.response;
            if (res) {
                if (res.status === 401) {
                    setError(res.data.detail === "No active account found with the given credentials"
                        ? "Invalid username or password"
                        : res.data.detail);
                } else if (res.status === 400) {
                    setError(res.data.username?.[0] || res.data.email?.[0] || "Something went wrong");
                } else setError("Network error. Please try again");
            }
        }
    };

    // Handle Google login
    const handleGoogleLogin = async (credentialResponse) => {
        if (!credentialResponse?.credential) {
            setError("Google login cancelled.");
            return;
        }

        try {
            const res = await api.post(
                "/api/auth/google/",
                { token: credentialResponse.credential },
                { withCredentials: true } // cookies sent & received
            );

            // Access Token is now in a Cookie, so we don't save it to localStorage.
            
            // We only save the username for display purposes. 
            // Note: Verify your backend actually returns "user" key in res.data
            if (res.data.user) {
                localStorage.setItem("user", res.data.user);
            }

            navigate("/");
        } catch (err) {
            console.error("Google login failed", err);
            setError("Google login failed. Try again.");
        }
    };

    const features = [
        { icon: <Wallet className="w-6 h-6" />, title: "Smart Tracking", desc: "Monitor every expense" },
        { icon: <TrendingUp className="w-6 h-6" />, title: "Analytics", desc: "Visualize spending trends" },
        { icon: <PieChart className="w-6 h-6" />, title: "Budgeting", desc: "Plan your finances" },
    ];

    return (
        <div className="h-screen sm:bg-gradient-to-br from-pink-50 via-white to-pink-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 sm:bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 sm:bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute top-5 w-80 h-80 sm:bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

            <div className="relative flex items-center justify-center h-full px-4">
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full items-center">

                    {/* Left panel */}
                    <div className="hidden md:flex flex-col space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl">
                                    <Wallet className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">SpendWise</h1>
                            </div>
                            <p className="text-sm text-gray-600">Master your money with intelligent expense tracking</p>
                        </div>
                        <div className="space-y-1">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex gap-5 group cursor-pointer mt-3 items-center">
                                    <div className="p-3 bg-pink-100 rounded-md text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                                        <div className="w-5 h-5 flex items-center justify-center">{feature.icon}</div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-xs">{feature.title}</h3>
                                        <p className="text-xs text-gray-500">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right panel: Form */}
                    <div className="w-full">
                        <form onSubmit={handleSubmit(onSubmit)} className={`sm:bg-white/80 backdrop-blur-xl rounded-2xl sm:shadow-2xl p-5 sm:border sm:border-white/20 ${method === "register" ? "sm:h-[600px]" : "sm:h-[560px]"}`}>
                            <h2 className="text-2xl font-bold text-gray-800 mb-0.5 text-center mt-10 leading-relaxed tracking-wider">{status}</h2>
                            <p className="text-center text-gray-500 text-xs mb-3">Sign in to your expense tracker</p>

                            {error && <p className="text-red-500 text-sm text-center font-medium animate-fade-in">{error}</p>}

                            <div className="space-y-5 mt-7">
                                {/* Username & Phone Number row */}
                                {
                                    method === "login" && (
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-0.5">Username</label>
                                            <input
                                                type="text"
                                                placeholder="Username"
                                                {...register("username", { required: "Username is required" })}
                                                className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400"
                                            />
                                            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                                        </div>
                                    )
                                }
                                {method === "register" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Username */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-0.5">Username</label>
                                            <input
                                                type="text"
                                                placeholder="Username"
                                                {...register("username", { required: "Username is required" })}
                                                className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400"
                                            />
                                            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                                        </div>

                                        {/* Phone Number */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-0.5">Phone Number</label>
                                            <input
                                                type="text"
                                                placeholder="0912 345 6789"
                                                {...register("phone_number", {
                                                    required: "Phone number is required",
                                                    pattern: {
                                                        value: /^[0-9\s+-]+$/,
                                                        message: "Invalid phone number"
                                                    }
                                                })}
                                                className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400"
                                            />
                                            {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
                                        </div>
                                    </div>
                                )}


                                {method === "register" && (
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-0.5">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            {...register("email", { required: "Email is required" })}
                                            className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                    </div>
                                )}

                               

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-0.5">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...register("password", { required: "Password is required", minLength: { value: 8, message: "At least 8 characters" } })}
                                            className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-pink-600">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                                </div>

                                {method === "register" && (
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-0.5">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                {...register("confirm_password", { required: "Please confirm your password", validate: value => value === passwordValue || "Passwords do not match" })}
                                                className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400"
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-pink-600">
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>}
                                    </div>
                                )}

                                {
                                    method === "login" ? (
                                        <Link to="/forgot-password" className="text-[10px] text-pink-500 text-right w-full mb-[6px] flex items-end justify-end">
                                            Forgot Password?
                                        </Link>
                                    ) : (
                                        ""
                                    )
                                }

                                {/* Submit */}
                                <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting ? "bg-pink-400 cursor-not-allowed" : "bg-gradient-to-r from-pink-500 to-pink-600"}`}>
                                    {isSubmitting ? "Processing..." : status}
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </button>

                                {method === "login" && (
                                    <>
                                            <div className="flex items-center my-3 justify-center">
                                                <div className="flex-grow border-t border-gray-300"></div>
                                                <span className="px-3 text-gray-400 text-xs font-medium">or</span>
                                                <div className="flex-grow border-t border-gray-300"></div>
                                            </div>
                                            <span className="mx-auto">
                                                <GoogleLogin
                                                    onSuccess={handleGoogleLogin}
                                                    onError={() => setError("Google login failed")}
                                                />
                                            </span>
                                    </>
                                )}
                            </div>

                            {/* Footer links */}
                            <div className="text-center mt-4 text-xs text-gray-500">
                                {method === "login" ? (
                                    <p>
                                        Don’t have an account?{' '}
                                        <Link to="/register" className="text-pink-500 hover:text-pink-600 font-medium">Sign up</Link>
                                    </p>
                                ) : (
                                    <p>
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-pink-500 hover:text-pink-600 font-medium">Login</Link>
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;