import React, { useState, useEffect} from "react";
import { Download, TrendingUp, Circle, BarChart3, DollarSign } from "lucide-react";
import { Area, AreaChart, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api/api";

const Reports = () => {
    const [budgets, setBudgets] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState([]);
    const [activeBudget, setActiveBudget] = useState(null);
    const [stats, setStats] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [rawExpenses, setRawExpenses] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const budgetResult = await api.get("api/budgets/");
                const budgetsData = budgetResult.data;
                setBudgets(budgetsData);

                const currentBudget = budgetsData.find((b) => b.status === "active");
                setActiveBudget(currentBudget || null);

                if (currentBudget) {
                    const expenseResult = await api.get("api/expenses/");
                    const filtered = expenseResult.data.filter(exp => exp.budget === currentBudget.id);
                    setRawExpenses(filtered);

                    const dailyTotals = {};
                    filtered.forEach(expense => {
                        const date = expense.date;
                        dailyTotals[date] = (dailyTotals[date] || 0) + parseFloat(expense.amount);
                    });

                    const formattedData = Object.entries(dailyTotals)
                    .map(([date, amount]) => ({ date, amount }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                    setExpenses(formattedData);

                    const totalExpenseResult = await api.get("api/budgets/total_expenses/");
                    const totalExpensesData = totalExpenseResult.data.total_expenses;
                    setTotalExpenses(totalExpensesData);

                    const totalBudget = parseFloat(currentBudget.limit_amount);
                    const netSavings = totalBudget - totalExpensesData;
                    const avgDailySpend = totalExpensesData > 0 ? (totalExpensesData / 30).toFixed(2) : 0;

                    setStats([
                        {
                            label: "Total Budget",
                            value: `₱ ${totalBudget.toLocaleString()}`,
                            icon: TrendingUp,
                            color: "green",
                        },
                        {
                            label: "Total Expenses",
                            value: `₱ ${totalExpensesData.toLocaleString()}`,
                            icon: DollarSign,
                            color: "pink",
                        },
                        {
                            label: "Net Savings",
                            value: `₱ ${netSavings.toLocaleString()}`,
                            icon: Circle,
                            color: "blue",
                        },
                        {
                            label: "Avg. Daily Spend",
                            value: `₱ ${avgDailySpend}`,
                            icon: BarChart3,
                            color: "purple",
                        },
                    ]);
                }


            } 
            catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
            const colors = ["#ec4899", "#f472b6", "#fb7185", "#fda4af", "#fbbf24", "#60a5fa"];
            const response = await api.get("api/categories/");
            const categoriesData = response.data;

            const filteredExpenses = activeBudget ? rawExpenses.filter(exp => exp.budget === activeBudget.id) : rawExpenses;

            const categoryTotals = {};
            filteredExpenses.forEach(exp => {
                const categoryName = exp.category?.name || exp.category;
                if (!categoryTotals[categoryName]) {
                categoryTotals[categoryName] = 0;
                }
                categoryTotals[categoryName] += parseFloat(exp.amount);
            });

            const categoriesWithColors = categoriesData.map((cat, idx) => ({
                ...cat,
                value: categoryTotals[cat.name] || 0,
                color: colors[idx % colors.length],
            }));

            setCategories(categoriesWithColors);
            } catch (error) {
            console.log("Failed to get categories: ", error);
            }
        };

        if (rawExpenses.length > 0 && activeBudget) {
            fetchCategory();
        }
    }, [rawExpenses, activeBudget]);

    let topExpenses = [];
    if (activeBudget && rawExpenses.length) {
        topExpenses = rawExpenses
        .filter(e => e.budget === activeBudget.id)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
        .map(e => ({
        name: e.description || "Unnamed Expense",
        amount: parseFloat(e.amount),
        date: e.date,
        category: e.category?.name || e.category || "Uncategorized",
        }));
    }    

    const handleExportCSV = () => {
        const csvData = [["Date", "Category", "Description", "Amount"],
            ...topExpenses.map(exp => [exp.date, exp.category, exp.name, exp.amount])
        ];
        
        const csvContent = csvData.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `expense_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="w-full mx-auto mt-26">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent leading-relaxed tracking-wider">
                        Reports & Analytics
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">Detailed insights into your financial activity</p>
                </div>
                
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 font-semibold text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={idx}
                            className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div
                                    className={`p-2.5 rounded-lg ${
                                        stat.color === "green"
                                            ? "bg-green-100"
                                            : stat.color === "pink"
                                            ? "bg-pink-100"
                                            : stat.color === "blue"
                                            ? "bg-blue-100"
                                            : "bg-purple-100"
                                    }`}
                                >
                                    <Icon
                                        className={`w-5 h-5 ${
                                            stat.color === "green"
                                                ? "text-green-600"
                                                : stat.color === "pink"
                                                ? "text-pink-600"
                                                : stat.color === "blue"
                                                ? "text-blue-600"
                                                : "text-purple-600"
                                        }`}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {stat.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Expenses</h3>
                        <TrendingUp className="w-5 h-5 text-pink-600" />
                    </div>
                    <ResponsiveContainer width="100%" height="90%">
                        <AreaChart
                            data={expenses}
                            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                        >

                            <defs>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F844CE" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#F844CE" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                                formatter={(value) =>
                                `₱ ${parseFloat(value).toLocaleString('en-PH', {
                                    minimumFractionDigits: 2,
                                })}`
                                }
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#F844CE"
                                fill="url(#colorExpense)"
                                strokeWidth={2}
                                activeDot={{ r: 5 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Spending by Category</h3>
                        <Circle className="w-5 h-5 text-pink-600" />
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={categories}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                >
                                {categories.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            formatter={(value) => `₱ ${value}`}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {categories
                            .filter((cat) => cat.value > 0)
                            .map((cat, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                <span className="text-xs text-gray-600 truncate">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Top Expenses Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Top Expenses</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Description</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Category</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Date</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topExpenses.map((expense, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                            <td className="py-3 px-4 text-sm text-gray-800 font-medium">{expense.name}</td>
                            <td className="py-3 px-4">
                            <span className="inline-block px-2 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded">
                                {expense.category}
                            </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{expense.date}</td>
                            <td className="py-3 px-4 text-sm text-gray-800 font-bold text-right">${expense.amount}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default Reports