import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import api from "../api/api";
import { useFetch } from "../hooks";
import { BudgetList, BudgetModal } from '../components/budgets'

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [error, setError] = useState("");
    const [activeBudget, setActiveBudget] = useState(null);
    const [totalExpenses, setTotalExpenses] = useState(null);
    const [expenseTracker, setExpenseTracker] = useState(null);

    const [formData, setFormData] = useState({
        limit_amount: "",
        start_date: "",
        end_date: "",
    });

    const { data: budgetData, loading, errorData } = useFetch("api/budgets/");
    const { data: totalExpensesData } = useFetch("api/budgets/total_expenses/");

    useEffect(() => {
        if (budgetData) {
            setBudgets(budgetData);
            const current = budgetData.find((b) => b.status === "active");
            setActiveBudget(current || null);
            setExpenseTracker(current ? current.limit_amount : null);
        }
    }, [budgetData]);

    useEffect(() => {
        if (totalExpensesData) {
            setTotalExpenses(totalExpensesData.total_expenses);
        }
    }, [totalExpensesData]);

    const progressPercent = expenseTracker
        ? Math.min((totalExpenses / expenseTracker) * 100, 100)
        : 0;

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
            } else {
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
        } catch (err) {
            console.error("Error saving budget:", err.response?.data || err.message);
            setError("Failed to save. Check your data and try again.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`api/budgets/${id}/`);
            setBudgets(budgets.filter((b) => b.id !== id));
            setActiveBudget(null);
        } catch (err) {
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

    if (loading) return <p>Loading...</p>;
    if (errorData) return <p>Failed to load budgets</p>;

    return (
        <section className="mt-26 w-full mx-auto px-4 sm:px-8">
            <h1 className="text-3xl font-bold leading-relaxed tracking-widest">Budgets</h1>

            <div className="flex flex-col md:flex-row gap-y-5 md:justify-between items-center mb-8 w-full">
                <p className="text-gray-600 text-sm mt-1">
                    {activeBudget
                        ? "You have an active budget running."
                        : "Track and manage your spending limits"}
                </p>

                {(!activeBudget || progressPercent >= 100) && (
                    <button
                        onClick={() => {
                            setEditingBudget(null);
                            setFormData({
                                limit_amount: "",
                                start_date: "",
                                end_date: "",
                            });
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 font-semibold cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        Create Budget
                    </button>
                )}
            </div>

            <BudgetList
                budgets={budgets}
                handleDelete={handleDelete}
                openEditModal={openEditModal}
                activeBudget={activeBudget}
                progressPercent={progressPercent}
            />

            {showModal && (
                <BudgetModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    editingBudget={editingBudget}
                    error={error}
                />
            )}
            
        </section>
    );
};

export default Budgets;
