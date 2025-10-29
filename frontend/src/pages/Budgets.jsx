import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import api from "../api/api";

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [error, setError] = useState("");
    const [activeBudget, setActiveBudget] = useState(null);

    const [totalExpenses, setTotalExpenses] = useState(null);
    const [expenseTracker, setExpenseTracker] = useState(null);
    const progressPercent = expenseTracker ? Math.min((totalExpenses / expenseTracker) * 100, 100) : 0;

    const [formData, setFormData] = useState({
        limit_amount: "",
        start_date: "",
        end_date: "",
    });

    const fetchBudgets = async () => {
        try {
            const response = await api.get("api/budgets/");
            setBudgets(response.data);

            const current = response.data.find((b) => b.status === "active");
            setActiveBudget(current || null);
            setExpenseTracker(current ? current.limit_amount : null);
        } 
        catch (err) {
            console.error("Failed to fetch budgets:", err);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);


    useEffect(() => {
        const fetchTotalExpenses = async () => {
            try{
                const response = await api.get('api/budgets/total_expenses/');
                setTotalExpenses(response.data.total_expenses);
            }
            catch(error){
                console.log('Failed to get total expenses: ', error)
            }
        }

        fetchTotalExpenses()
    }, [])

   

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.limit_amount || !formData.start_date || !formData.end_date) {
            setError("All fields are required.");
            return;
        }

        try {
            if (editingBudget) {
                await api.put(`api/budgets/${editingBudget.id}/`, formData);
            } 
            else {
                await api.post("api/budgets/", formData);
            }
            const response = await api.get("api/budgets/");
            setBudgets(response.data);

            const current = response.data.find((b) => b.status === "active");
            setActiveBudget(current || null);
            setExpenseTracker(current ? current.limit_amount : null);

            setShowModal(false);
            setEditingBudget(null);
            setFormData({ limit_amount: "", start_date: "", end_date: "" });

        } 
        catch (err) {
            console.error("Error saving budget:", err.response?.data || err.message);
            setError("Failed to save. Check your data and try again.");
        }
    };


    const handleDelete = async (id) => {
        try {
            await api.delete(`api/budgets/${id}/`);
            setBudgets(budgets.filter((b) => b.id !== id));
            setActiveBudget(null);
        } 
        catch (err) {
            console.error("Failed to delete budget:", err);
        }
    };

    const openEditModal = (budget) => {
        setEditingBudget(budget);
        setFormData({
            limit_amount: budget.limit_amount,
            start_date: budget.start_date,
            end_date: budget.end_date,
        });
        setShowModal(true);
    };

    return (
        <section className="mt-26 w-full mx-auto px-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent leading-relaxed tracking-widest">Budgets</h1>

            <div className="flex justify-between items-center mb-8 w-[1000px]">
                <p className="text-gray-600 text-sm mt-1">
                    {activeBudget
                        ? "You have an active budget running."
                        : "Track and manage your spending limits"}
                </p>
                {(!activeBudget || progressPercent >= 100) && (
                    <button
                        onClick={() => {
                            setEditingBudget(null);
                            setFormData({ limit_amount: "", start_date: "", end_date: "" });
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 font-semibold cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        Create Budget
                    </button>
                )}

            </div>

            {budgets.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map((b) => {
                        const isActive = b.status === "active";
                        const isFull = b.status === "full";
                        const isExpired = b.status === "expired";
                        const status = b.status.charAt(0).toUpperCase() + b.status.slice(1);
                        const currentProgress = isActive ? progressPercent : 100;

                        return (
                            <div
                                key={b.id}
                                className={`rounded-xl shadow-md overflow-hidden transition-shadow duration-300 border-2 ${
                                    isExpired
                                    ? "bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed"
                                    : isFull
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
                                        onClick={() => !isExpired && !isFull && openEditModal(b)}
                                    />
                                    <Trash2
                                        className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                                        onClick={() => handleDelete(b.id)}
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div className="text-center pb-4 border-b border-gray-200">
                                    <p className={`text-sm mb-1 ${isExpired || isFull ? "text-gray-400" : "text-gray-500"}`}>
                                        Limit Amount
                                    </p>
                                    <p className={`text-3xl font-bold ${isExpired || isFull ? "text-gray-400" : "text-pink-600"}`}>
                                        ₱{parseFloat(b.limit_amount).toLocaleString()}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm ${isExpired || isFull ? "text-gray-400" : "text-gray-500"}`}>
                                            Start Date
                                        </span>
                                        <span className={`text-sm font-semibold ${isExpired || isFull ? "text-gray-400" : "text-gray-700"}`}>
                                            {new Date(b.start_date).toLocaleDateString("en-US", {
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
                                            {new Date(b.end_date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Expense Tracker */}
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
                                            style={{
                                                width: `${currentProgress}%`,
                                            }}
                                        >
                                        </div>
                                    </div>
                                        <p className={`text-sm mt-1 text-right ${isExpired || isFull ? "text-gray-400" : "text-gray-600"}`}>
                                            {isExpired || isFull ? "100%" : `${currentProgress.toFixed(1)}%`}
                                        </p>

                                        {isActive || !isActive && currentProgress >= 96 && currentProgress < 100 && (
                                            <p className={`text-[10px] text-center w-[300px] mx-auto ${isExpired || isFull ? "text-gray-400" : "text-red-500 "}`}>
                                                You've reached 96% of your budget
                                            </p>
                                        )}
                                        {isActive || !isActive && currentProgress === 100 && (
                                            <p className={`text-[10px] text-center w-[300px] mx-auto ${isExpired || isFull ? "text-gray-400" : "text-red-500 "}`}>
                                                You've already reached the maximum budget. Change to new budget
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="max-w-sm mx-auto">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">No budgets yet.</p>
                        <p className="text-gray-400 text-sm mt-2">
                            Create your first budget to start tracking your spending
                        </p>
                    </div>
                </div>
            )}


            {/* Modal For Creating and Editing */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-8 w-[400px] shadow-2xl">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingBudget ? "Edit Budget" : "Create Budget"}
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Limit Amount
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={formData.limit_amount}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            limit_amount: e.target.value,
                                        })
                                    }
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            start_date: e.target.value,
                                        })
                                    }
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            end_date: e.target.value,
                                        })
                                    }
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
                                >
                                    {editingBudget ? "Update" : "Create"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Budgets;