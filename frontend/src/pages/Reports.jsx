import React, { useEffect, useState } from "react";
import api from "../api/api";
import { StatsGrid, ExpensesChart, CategoryChart, TopExpensesTable, ExportButton } from '../components/reports'

const Reports = () => {
    const [budgets, setBudgets] = useState([]);
    const [activeBudget, setActiveBudget] = useState(null);
    const [stats, setStats] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [rawExpenses, setRawExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [topExpenses, setTopExpenses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: budgetsData } = await api.get("api/budgets/");
                setBudgets(budgetsData);

                const current = budgetsData.find((b) => b.status === "active");
                setActiveBudget(current || null);

                if (!current) return;

                const { data: expenseData } = await api.get("api/expenses/");
                const filtered = expenseData.filter((exp) => exp.budget === current.id);
                setRawExpenses(filtered);

                // Daily totals
                const dailyTotals = {};
                filtered.forEach((exp) => {
                    const date = exp.date;
                    dailyTotals[date] = (dailyTotals[date] || 0) + parseFloat(exp.amount);
                });

                const formattedExpenses = Object.entries(dailyTotals)
                    .map(([date, amount]) => ({ date, amount }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                setExpenses(formattedExpenses);

                const { data: totalData } = await api.get("api/budgets/total_expenses/");
                const totalExpenses = totalData.total_expenses;
                const totalBudget = parseFloat(current.limit_amount);
                const netSavings = totalBudget - totalExpenses;
                const avgDailySpend = totalExpenses > 0 ? (totalExpenses / 30).toFixed(2) : 0;

                setStats([
                    { label: "Total Budget", value: `₱ ${totalBudget.toLocaleString()}`, color: "green" },
                    { label: "Total Expenses", value: `₱ ${totalExpenses.toLocaleString()}`, color: "pink" },
                    { label: "Net Savings", value: `₱ ${netSavings.toLocaleString()}`, color: "blue" },
                    { label: "Avg. Daily Spend", value: `₱ ${avgDailySpend}`, color: "purple" },
                ]);

                const top = filtered
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 5)
                    .map((e) => ({
                        name: e.description || "Unnamed Expense",
                        amount: parseFloat(e.amount),
                        date: e.date,
                        category: e.category?.name || e.category || "Uncategorized",
                    }));

                setTopExpenses(top);
            } catch (err) {
                console.error("Failed to fetch reports data:", err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const { data: categoryData } = await api.get("api/categories/");
                const colors = ["#ec4899", "#f472b6", "#fb7185", "#fda4af", "#fbbf24", "#60a5fa"];

                const categoryTotals = {};
                rawExpenses.forEach((exp) => {
                    const name = exp.category?.name || exp.category;
                    categoryTotals[name] = (categoryTotals[name] || 0) + parseFloat(exp.amount);
                });

                const catWithColors = categoryData.map((cat, i) => ({
                    ...cat,
                    value: categoryTotals[cat.name] || 0,
                    color: colors[i % colors.length],
                }));

                setCategories(catWithColors);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };

        if (activeBudget && rawExpenses.length) fetchCategory();
    }, [rawExpenses, activeBudget]);

    return (
        <div className="w-full mx-auto mt-26 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold leading-relaxed tracking-wide">
                        Reports & Analytics
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Detailed insights into your financial activity
                    </p>
                </div>
                <ExportButton topExpenses={topExpenses} />
            </div>

            <StatsGrid stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ExpensesChart data={expenses} />
                <CategoryChart data={categories} />
            </div>

            <TopExpensesTable data={topExpenses} />
        </div>
    );
};

export default Reports;
