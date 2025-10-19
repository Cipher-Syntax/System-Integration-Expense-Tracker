import React, { useEffect, useState } from "react";
import { Wallet, TrendingUp, PieChart, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LoadingIndicator } from "../components";
import { useForm } from 'react-hook-form'
import api from "../api/api";

const Form = ({ route, method }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();
    const [error, setError] = useState("");
    const [remembered, setRemembered] = useState(false);
    const navigate = useNavigate();

    const status = method == "login" ? "Login" : "Register";
    useEffect(() => {
        if(error){
            const timer = setTimeout(() => setError(""), 2000)
            return () => clearTimeout(timer)
        }
    }, [error])

    useEffect(() => {
        const savedUsername = localStorage.getItem("rememberedUsername");
        if (savedUsername) {
            setRemembered(true);
            setValue("username", savedUsername);
        }
    }, []);


    const onSubmit = async (data) => {
        try{
            const response = await api.post(route, data, {withCredentials: true});
            console.log(data)
            if(method === "login"){
                if(remembered){
                    localStorage.setItem("rememberedUsername", data.username);
                } else {
                    localStorage.removeItem("rememberedUsername");
                }
                navigate('/');
            }
            else{
                navigate("/login");
            }
        }
        catch(error){
            if(error.response){
                if(error.response.status === 401){
                    const errorDetail = error.response.data.detail

                    if(errorDetail === "No active account found with the given credentials"){
                        setError('Invalid username or password')
                    }
                    else{
                        console.log(errorDetail)
                    }
                }
                else if(error.response.status === 400){
                    if(error.response.data.username){
                        setError(error.response.data.username[0])
                    }
                    else{
                        setError('Something went wrong')
                    }
                }
                else{
                    setError('Network error. Please try again')
                }
            }
        }
    }

    const features = [
        { icon: <Wallet className="w-6 h-6" />, title: "Smart Tracking", desc: "Monitor every expense" },
        { icon: <TrendingUp className="w-6 h-6" />, title: "Analytics", desc: "Visualize spending trends" },
        { icon: <PieChart className="w-6 h-6" />, title: "Budgeting", desc: "Plan your finances" },
    ];

    return (
        <div className="h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute top-5 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="relative flex items-center justify-center h-full px-4">
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full items-center">
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
                            {features.map((feature, index) => (
                                <div key={index} className="flex gap-5 group cursor-pointer mt-3 items-center">
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

                        <div className="pt-2 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <div className="w-1 h-1 rounded-full bg-pink-500"></div>
                                    Join thousands managing their finances
                                </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <div className="w-1 h-1 rounded-full bg-pink-500"></div>
                                Real-time tracking and insights
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <form onSubmit={handleSubmit(onSubmit)} className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-white/20 h-[650px] ${method === "register" ? "sm:h-[600px]" : "sm:h-[500px]"}`}>
                            <div className="md:hidden mb-4 text-center mt-5">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="p-1.5 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg">
                                        <Wallet className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-3xl font-bold text-pink-600 leading-relaxed tracking-wider">SpendWise</span>
                                </div>
                                <p className="text-gray-600 text-xs">Take control of your spending</p>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-0.5 text-center mt-10 leading-relaxed tracking-wider">{status}</h2>
                            <p className="text-center text-gray-500 text-xs mb-3">Sign in to your expense tracker</p>

                            {
                                error && (
                                    <p className="text-red-500 text-sm text-center font-medium animate-fade-in">
                                        {error}
                                    </p>
                                )
                            }
                            
                            <div className="space-y-5 mt-7">

                                {
                                    method === "register" && (
                                        <div className="flex items-center justify-between gap-x-3">
                                            <div className="w-full">
                                                <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                                                    Username
                                                </label>
                                                <input
                                                    id="username"
                                                    type="text"
                                                    placeholder="Username"
                                                    {...register("username", { required: "Username is required" })}
                                                    className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400 placeholder:leading-relaxed placeholder:tracking-widest"
                                                />
                                                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                                            </div>

                                            <div className="w-full">
                                                <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                                                    Phone Number
                                                </label>
                                                <input
                                                    id="phone_number"
                                                    type="text"
                                                    placeholder="+63 912 345 6789"
                                                    {...register("phone_number", { required: "Phone number is required" })}
                                                    className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400 placeholder:leading-relaxed placeholder:tracking-widest"
                                                />
                                                {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    method === "login" ? (
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                                                Username
                                            </label>
                                            <input
                                                id="username"
                                                type="text"
                                                placeholder="Username"
                                                {...register("username", { required: "Username is required" })}
                                                className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400 placeholder:leading-relaxed placeholder:tracking-widest"
                                            />
                                            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                                                Email Address
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                {...register("email", { required: "Email is required" })}
                                                className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400 placeholder:leading-relaxed placeholder:tracking-widest"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                        </div>
                                    )
                                }

                                <div>
                                    <div className="flex justify-between items-center mb-0.5">
                                        <label className="block text-xs font-semibold text-gray-700">
                                        Password
                                        </label>

                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("password", {required: "Password is required", minLength: {value: 8, message: "At least 8 characters"}})}
                                        className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400 placeholder:leading-relaxed placeholder:tracking-widest"
                                    />
                                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                                </div>

                                {
                                    method === "register" && (
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                {...register("confirm_password", {
                                                required: "Please confirm your password",
                                                validate: (value, { password }) =>
                                                    value === password || "Passwords do not match",
                                                })}
                                                className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-xs text-gray-800 placeholder-gray-400 placeholder:leading-relaxed placeholder:tracking-widest"
                                            />
                                            {errors.confirm_password && (
                                                <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>
                                            )}
                                        </div>
                                    )
                                }


                                {
                                    method === "login" && (
                                        <div className="flex items-center justify-between">
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
                                            <Link to="/forgot-password" className="text-xs text-pink-500 hover:text-pink-600 font-medium">
                                                Forgot?
                                            </Link>
                                        </div>
                                    )
                                }

                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full  text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 flex items-center justify-center gap-2 group text-xs cursor-pointer ${isSubmitting ? "bg-pink-400 cursor-not-allowed" : "bg-gradient-to-r from-pink-500 to-pink-600"}`}
                                >
                                    {
                                        isSubmitting ? "Processing..." : status
                                        // method === "login" ? (
                                        //     <p>Sign In</p>
                                        // ): (
                                        //     <p>Sign Up</p>
                                        // )
                                    }
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                {/* <LoadingIndicator></LoadingIndicator> */}
                                
                            </div>

                            {
                                method === "login" ? (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-center text-gray-600 text-xs">
                                            New to SpendWise?{" "}
                                            <Link to="/register" className="text-pink-600 font-bold hover:text-pink-700 transition-colors">
                                                Create an account
                                            </Link>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-center text-gray-600 text-xs">
                                            Already have an account?{" "}
                                            <Link to="/login" className="text-pink-600 font-bold hover:text-pink-700 transition-colors">
                                                Login
                                            </Link>
                                        </p>
                                    </div>
                                )
                            }

                            {
                                method === "register" ? "" : <p className="text-center text-xs text-gray-400 mt-2">
                                    By signing in, you agree to our Terms & Privacy Policy
                                </p>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;