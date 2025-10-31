import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const BudgetCard = ({ budget, handleDelete, openEditModal, activeBudget, progressPercent }) => {
    const isActive = budget.status === "active";
    const isFull = budget.status === "full";
    const isExpired = budget.status === "expired";
    const status = budget.status.charAt(0).toUpperCase() + budget.status.slice(1);
    const currentProgress = isActive ? progressPercent : 100;

    return (
        <div
            className={`rounded-xl shadow-md overflow-hidden transition-shadow duration-300 border-2 ${
                isExpired || isFull
                    ? "bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed"
                    : isActive
                    ? "bg-white border-pink-500 hover:shadow-xl"
                    : "bg-white border-gray-200 hover:shadow-xl"
            }`}
        >
            <div
                className={`p-4 flex justify-between items-center ${
                    isExpired || isFull
                        ? "bg-gray-200"
                        : "bg-gradient-to-r from-pink-50 to-purple-50"
                }`}
            >
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isExpired || isFull
                            ? "bg-gray-300 text-gray-600"
                            : isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    {status}
                </span>

                <div className="flex gap-3">
                    <Edit2
                        className={`w-5 h-5 ${
                            isExpired || isFull
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                        }`}
                        onClick={() => !isExpired && !isFull && openEditModal(budget)}
                    />
                    <Trash2
                        className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                        onClick={() => handleDelete(budget.id)}
                    />
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="text-center pb-4 border-b border-gray-200">
                    <p className={`text-sm mb-1 ${isExpired || isFull ? "text-gray-400" : "text-gray-500"}`}>
                        Limit Amount
                    </p>
                    <p className={`text-3xl font-bold ${isExpired || isFull ? "text-gray-400" : "text-pink-600"}`}>
                        ₱{parseFloat(budget.limit_amount).toLocaleString()}
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className={`text-sm ${isExpired || isFull ? "text-gray-400" : "text-gray-500"}`}>
                            Start Date
                        </span>
                        <span className={`text-sm font-semibold ${isExpired || isFull ? "text-gray-400" : "text-gray-700"}`}>
                            {new Date(budget.start_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className={`text-sm ${isExpired || isFull ? "text-gray-400" : "text-gray-500"}`}>
                            End Date
                        </span>
                        <span className={`text-sm font-semibold ${isExpired || isFull ? "text-gray-400" : "text-gray-700"}`}>
                            {new Date(budget.end_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                </div>

                <div className="w-full mt-8">
                    <h2 className={`mb-2 text-[14px] ${isExpired || isFull ? "text-gray-400" : "text-gray-500"}`}>
                        Expense Tracker
                    </h2>
                    <div className="w-full rounded-full h-3 overflow-hidden border border-gray-300 relative">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ease-in-out ${
                                isExpired || isFull
                                    ? "bg-gray-400"
                                    : currentProgress < 70
                                    ? "bg-green-500"
                                    : currentProgress < 90
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{ width: `${currentProgress}%` }}
                        ></div>
                    </div>
                    <p className={`text-sm mt-1 text-right ${isExpired || isFull ? "text-gray-400" : "text-gray-600"}`}>
                        {isExpired || isFull ? "100%" : `${currentProgress.toFixed(1)}%`}
                    </p>

                    {isActive && currentProgress >= 96 && currentProgress < 100 && (
                        <p className="text-[10px] text-center w-[300px] mx-auto text-red-500">
                            You've reached 96% of your budget
                        </p>
                    )}
                    {isActive && currentProgress === 100 && (
                        <p className="text-[10px] text-center w-[300px] mx-auto text-red-500">
                            You've already reached the maximum budget. Create a new one.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BudgetCard;
