import React, { useState } from "react";
import { Plus, Edit2, Trash2, TrendingUp, Calendar, DollarSign, AlertCircle, CheckCircle } from "lucide-react";

const Budgets = () => {
    const [budgets, setBudgets] = useState([
        {
            id: 1,
            limit_amount: 5000,
            start_date: "2025-01-01",
            end_date: "2025-01-31",
            spent: 3200
        },
        {
            id: 2,
            limit_amount: 1500,
            start_date: "2025-01-01",
            end_date: "2025-01-31",
            spent: 1600
        },
        {
            id: 3,
            limit_amount: 3000,
            start_date: "2025-01-01",
            end_date: "2025-01-31",
            spent: 1200
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [formData, setFormData] = useState({
        limit_amount: "",
        start_date: "",
        end_date: ""
    });

    const handleSubmit = () => {
        if (editingBudget) {
        setBudgets(budgets.map(b => 
            b.id === editingBudget.id 
            ? { ...b, ...formData, limit_amount: parseFloat(formData.limit_amount) }
            : b
        ));
        } else {
        const newBudget = {
            id: Date.now(),
            ...formData,
            limit_amount: parseFloat(formData.limit_amount),
            spent: 0
        };
        setBudgets([...budgets, newBudget]);
        }
        closeModal();
    };

    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setFormData({
        limit_amount: budget.limit_amount,
        start_date: budget.start_date,
        end_date: budget.end_date
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setBudgets(budgets.filter(b => b.id !== id));
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBudget(null);
        setFormData({ limit_amount: "", start_date: "", end_date: "" });
    };

    const getProgress = (spent, limit) => {
        return Math.min((spent / limit) * 100, 100);
    };

    const getStatus = (spent, limit) => {
        const percentage = (spent / limit) * 100;
        if (percentage >= 100) return { color: "red", text: "Over Budget", icon: AlertCircle };
        if (percentage >= 80) return { color: "yellow", text: "Warning", icon: AlertCircle };
        return { color: "green", text: "On Track", icon: CheckCircle };
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 p-6">
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
                    Budget Management
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">Track and manage your spending limits</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 font-semibold"
                >
                    <Plus className="w-5 h-5" />
                    Create Budget
                </button>
            </div>

            {/* Budget Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => {
                const progress = getProgress(budget.spent, budget.limit_amount);
                const status = getStatus(budget.spent, budget.limit_amount);
                const StatusIcon = status.icon;
                
                return (
                <div
                    key={budget.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                >
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        status.color === 'red' ? 'bg-red-100 text-red-700' :
                        status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.text}
                    </div>
                    <div className="flex gap-2">
                        <button
                        onClick={() => handleEdit(budget)}
                        className="p-1.5 hover:bg-pink-50 rounded-lg transition-colors"
                        >
                        <Edit2 className="w-4 h-4 text-pink-600" />
                        </button>
                        <button
                        onClick={() => handleDelete(budget.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        >
                        <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                    </div>
                    </div>

                    {/* Amount Info */}
                    <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-pink-600" />
                        <span className="text-2xl font-bold text-gray-800">
                        ${budget.limit_amount.toLocaleString()}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">
                        Spent: <span className="font-semibold text-gray-800">${budget.spent.toLocaleString()}</span>
                    </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span className="font-semibold">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                        className={`h-full rounded-full transition-all duration-500 ${
                            status.color === 'red' ? 'bg-red-500' :
                            status.color === 'yellow' ? 'bg-yellow-500' :
                            'bg-gradient-to-r from-pink-500 to-pink-600'
                        }`}
                        style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        ${(budget.limit_amount - budget.spent).toLocaleString()} remaining
                    </p>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(budget.start_date)} - {formatDate(budget.end_date)}</span>
                    </div>
                </div>
                );
            })}
            </div>

            {/* Empty State */}
            {budgets.length === 0 && (
            <div className="text-center py-16">
                <div className="inline-flex p-4 bg-pink-100 rounded-full mb-4">
                    <TrendingUp className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No budgets yet</h3>
                <p className="text-gray-600 mb-6">Create your first budget to start tracking your spending</p>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 font-semibold"
                >
                <Plus className="w-5 h-5" />
                    Create Your First Budget
                </button>
            </div>
            )}

            {/* Modal */}
            {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {editingBudget ? "Edit Budget" : "Create New Budget"}
                </h2>

                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Budget Limit Amount
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="number"
                            placeholder="5000"
                            value={formData.limit_amount}
                            onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all text-sm"
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all text-sm"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white transition-all text-sm"
                    />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={closeModal}
                        className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                    >
                    Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all font-semibold"
                    >
                    {editingBudget ? "Update" : "Create"}
                    </button>
                </div>
                </div>
            </div>
            )}
        </div>
        </div>
    );
};

export default Budgets;