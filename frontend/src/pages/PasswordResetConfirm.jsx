import React, { useState } from "react";
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import api from "../api/api";

const PasswordResetConfirm = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long!");
            setLoading(false);
            return;
        }

        try {
        const uid = window.location.pathname.split('/')[3];
        const token = window.location.pathname.split('/')[4];
        const response = await api.post(`/api/reset-password/${uid}/${token}/`, {
          password,
          confirm_password: confirmPassword
        });
        
        setMessage("Password has been reset successfully! Redirecting to login...");
        setError("");
        setPassword("");
        setConfirmPassword("");
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
        
        } catch (err) {
        setError("Invalid or expired token. Please request a new password reset link.");
        setMessage("");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

            <div className="relative flex items-center justify-center h-full px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                        {/* Header with icon */}
                        <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl">
                            <Lock className="w-7 h-7 text-white" />
                        </div>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
                        Reset Your Password
                        </h1>
                        <p className="text-center text-gray-600 text-sm mb-6">
                        Enter your new password below to reset your account password.
                        </p>

                        {/* Success Message */}
                        {message && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-700">{message}</p>
                        </div>
                        )}

                        {/* Error Message */}
                        {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                        )}

                        {/* Form */}
                        <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                            New Password
                            </label>
                            <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-sm text-gray-800 placeholder-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm New Password
                            </label>
                            <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-300 text-sm text-gray-800 placeholder-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-2.5 rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-sm cursor-pointer"
                        >
                            {loading ? "Resetting Password..." : "Reset Password"}
                        </button>
                        </div>

                        {/* Divider */}
                        <div className="my-5 flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-xs text-gray-500">Or</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* Back to Login */}
                        <div className="text-center">
                        <p className="text-xs text-gray-600 mb-3">
                            Remember your password?
                        </p>
                        <a href="/login" className="text-pink-600 font-bold text-sm hover:text-pink-700 transition-colors">
                            Back to Login
                        </a>
                        </div>

                        {/* Footer */}
                        <p className="mt-6 text-center text-xs text-gray-500">
                        Password must contain at least 8 characters
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetConfirm;