import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { sendEmail } from "../utils/email";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        

        try{
            const response = await api.post('/api/password-reset/', { email });
            const { uid, token } = response.data;
            const reset_link = `${window.location.origin}/reset-password/${uid}/${token}/`;

            const templateParams = {
                to_email: email,
                subject: "Reset Your Password",
                message: `Hi there,\n\nClick this link to reset your password:\n${reset_link}\n\nIf you didn't request this, ignore this email.`,
            };

            await sendEmail(templateParams);
            
            setMessage("Password reset email sent successfully!");
            const timer = setTimeout(() => {
                setMessage("");
            }, 3000)
            setError("");
            return () => clearTimeout(timer);
        }
        catch(error){
            setError('Something went wrong. Please try again');
            setMessage("");
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className="h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="relative flex items-center justify-center h-full px-4">
            <div className="w-full max-w-md">
                <Link to="/login" className="flex items-center gap-2 text-pink-600 font-medium mb-8 hover:text-pink-700 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl">
                            <Mail className="w-7 h-7 text-white" />
                        </div>
                    </div>

                        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
                            Forgot Password?
                        </h1>
                        <p className="text-center text-gray-600 text-sm mb-6">
                            No worries! Enter your email address and we'll send you a link to reset your password.
                        </p>

                    
                        {message && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-green-700">{message}</p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-sm text-gray-800 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-2.5 rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-sm cursor-pointer"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </div>

                        <div className="my-5 flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-xs text-gray-500">Or</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-600 mb-3">
                                Remember your password?
                            </p>
                            <Link to="/login" className="text-pink-600 font-bold text-sm hover:text-pink-700 transition-colors">
                                Back to Login
                            </Link>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-6">
                        Check your spam folder if you don't receive the email within a few minutes
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;