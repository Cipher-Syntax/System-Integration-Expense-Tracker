import React, { useEffect, useState } from 'react'
import api from '../api/api'
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [availableBalance, setAvailableBalance] = useState(null);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [totalExpenses, setTotalExpenses] = useState(null);
    const [budget, setBudget] = useState(null);
    const [expenseTracker, setExpenseTracker] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [filter, setFilter] = useState('day');

    const progressPercent = expenseTracker
        ? Math.min(((expenseTracker - availableBalance) / expenseTracker) * 100, 100)
        : 0;

    const getFilteredData = () => {
        if (!chartData.length) return [];

        if (filter === 'day') return chartData;

        if (filter === 'week') {
            const weekData = {};
            chartData.forEach(({ date, amount }) => {
                const weekStart = new Date(date);
                const weekNumber = Math.ceil(weekStart.getDate() / 7);
                const monthYear = weekStart.toLocaleString('default', { month: 'short', year: 'numeric' });
                const key = `${monthYear} - Week ${weekNumber}`;
                weekData[key] = (weekData[key] || 0) + amount;
            });
            return Object.entries(weekData).map(([date, amount]) => ({ date, amount }));
        }

        if (filter === 'monthly') {
            const monthData = {};
            chartData.forEach(({ date, amount }) => {
                const month = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
                monthData[month] = (monthData[month] || 0) + amount;
            });
            return Object.entries(monthData).map(([date, amount]) => ({ date, amount }));
        }

        return chartData;
    };

    const filteredData = getFilteredData();

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await api.get('api/budgets/');
                if (response.data.length > 0) {
                    const active = response.data.find(b => b.status === "active") || response.data[response.data.length - 1];
                    setSelectedBudget(active.id);
                    setExpenseTracker(active.limit_amount);
                    setBudget(active.limit_amount);
                }
            } catch (error) {
                console.log('Failed to get budgets: ', error);
            }
        };
        fetchBudgets();
    }, []);

    useEffect(() => {
        const fetchAvailableBalance = async () => {
            if (!selectedBudget) return;
            try {
                const response = await api.get(`api/budgets/${selectedBudget}/available_balance/`);
                setAvailableBalance(Math.max(response.data.remaining_balance, 0));
            } catch (error) {
                console.log('Failed to get available balance: ', error);
            }
        };
        fetchAvailableBalance();
    }, [selectedBudget]);

    useEffect(() => {
        const fetchTotalExpenses = async () => {
            try {
                const response = await api.get('api/budgets/total_expenses/');
                setTotalExpenses(response.data.total_expenses);
            } catch (error) {
                console.log('Failed to get total expenses: ', error);
            }
        };
        fetchTotalExpenses();
    }, []);

    useEffect(() => {
        const fetchExpenses = async () => {
            if (!selectedBudget) return;
            try {
                const response = await api.get('api/expenses/');
                const filtered = response.data.filter(exp => exp.budget === selectedBudget);
                const dailyTotals = {};
                filtered.forEach(expense => {
                    const date = expense.date;
                    dailyTotals[date] = (dailyTotals[date] || 0) + parseFloat(expense.amount);
                });
                const formattedData = Object.entries(dailyTotals)
                    .map(([date, amount]) => ({ date, amount }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                setChartData(formattedData);
                setExpenses(filtered);
            } catch (error) {
                console.log('Failed to get expenses:', error);
            }
        };
        fetchExpenses();
    }, [selectedBudget]);

    return (
        <section className="mt-26 w-full px-4 sm:px-6 md:px-10">
            <h1 className="text-3xl font-bold leading-relaxed tracking-widest text-left">
                DASHBOARD
            </h1>

            {/* Balance & Chart Section */}
            <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-start gap-10 mt-10 w-full">
                {/* Left Column */}
                <div className="flex flex-col items-center lg:items-start w-full">
                    <div className="w-full sm:w-[350px] h-[180px] bg-[#efeded] rounded-2xl p-5 border-l-[5px] border-[#F844CE]">
                        <h2 className="text-gray-500 text-sm sm:text-base">Available Balance</h2>
                        <h3 className="text-3xl sm:text-4xl mt-4 font-bold text-[#F844CE]">
                            ₱{availableBalance !== null ? parseFloat(availableBalance).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '0.00'}
                        </h3>
                    </div>

                    {/* Totals */}
                    <div className="flex flex-col sm:flex-row w-full sm:w-[350px] items-center justify-between mt-5 gap-5">
                        <div className="text-center w-full sm:w-[160px]">
                            <h2 className="text-gray-500 text-sm">Total Expenses</h2>
                            <h3 className="text-sm mt-2 font-bold text-[#d70909]">
                                ₱{totalExpenses !== null ? parseFloat(totalExpenses).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '0.00'}
                            </h3>
                        </div>

                        <div className="hidden sm:block w-[1px] h-[70px] bg-black"></div>

                        <div className="text-center w-full sm:w-[160px]">
                            <h2 className="text-gray-500 text-sm">Budget</h2>
                            <h3 className="text-sm mt-2 font-bold text-[#3B82F6]">
                                ₱{budget !== null ? parseFloat(budget).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '0.00'}
                            </h3>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full sm:w-[350px] mt-8">
                        <h2 className="text-gray-500 mb-2 text-sm">Expense Tracker</h2>
                        <div className="w-full rounded-full h-3 overflow-hidden border border-gray-300 relative">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ease-in-out ${progressPercent < 70
                                    ? 'bg-green-500'
                                    : progressPercent < 90
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                    }`}
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        <p className="text-sm mt-1 text-gray-600 text-right">{progressPercent.toFixed(1)}%</p>

                        {progressPercent >= 96 && progressPercent < 100 && (
                            <p className="text-[10px] text-center text-red-500">You've reached 96% of your budget</p>
                        )}
                        {progressPercent === 100 && (
                            <p className="text-[10px] text-center text-red-500">You've reached the maximum budget. Change to a new one.</p>
                        )}
                    </div>
                </div>

                {/* Chart */}
                <div className="w-full h-[350px] mt-10 bg-transparent rounded-2xl p-5 flex flex-col">
                    <div className="flex items-center justify-between">
                        <h2 className="text-gray-700 mb-4 text-lg font-semibold">Expenses Statistic</h2>
                        <select
                            className="border py-1 px-2 rounded-2xl text-sm"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    {chartData.length > 0 ? (
                        <div className="w-full h-[250px] sm:h-[300px] min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={filteredData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <defs>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#F844CE" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="#F844CE" stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip formatter={(value) => `₱${parseFloat(value).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`} />
                                    <Area type="monotone" dataKey="amount" stroke="#F844CE" fill="url(#colorExpense)" strokeWidth={2} activeDot={{ r: 5 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center mt-12 italic">No Chart To Show</p>
                    )}
                </div>
            </div>

            {/* Recent + Monthly Expenses */}
            <div className="flex flex-col lg:flex-row items-start justify-between gap-10 mt-20 mb-10">
                {/* Recent Expenses */}
                <Link to="/expenses" className="w-full lg:w-[480px]">
                    <h2 className="text-gray-700 font-semibold mb-4">Recent Expenses</h2>
                    {expenses.length > 0 ? (
                        expenses.slice(0, 5).reverse().map((expense) => (
                            <div
                                key={expense.id}
                                className="p-3 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition cursor-pointer"
                            >
                                <div>
                                    <h4 className="font-semibold text-gray-700 text-sm sm:text-base">
                                        {expense.category?.name || 'Uncategorized'}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        {expense.date} — ₱{parseFloat(expense.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <ArrowRight className="text-gray-500" />
                            </div>
                        ))
                    ) : (
                        <p className="mt-10 italic text-gray-500">No Recent Expenses To Show</p>
                    )}
                </Link>

                {/* Monthly Expenses */}
                <div className="w-full lg:w-[500px]">
                    <h2 className="text-gray-700 font-semibold mb-4">Monthly Expenses</h2>
                    {expenses.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {Object.entries(
                                expenses.reduce((acc, expense) => {
                                    const month = new Date(expense.date).toLocaleString('default', {
                                        month: 'long',
                                        year: 'numeric',
                                    });
                                    acc[month] = (acc[month] || 0) + parseFloat(expense.amount);
                                    return acc;
                                }, {})
                            )
                                .slice(0, 6)
                                .reverse()
                                .map(([month, total]) => (
                                    <div
                                        key={month}
                                        className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition"
                                    >
                                        <h3 className="font-semibold text-gray-700 text-sm">{month}</h3>
                                        <p className="text-[#F844CE] text-lg font-bold mt-2">
                                            ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <p className="mt-10 italic text-gray-500">No Monthly Expenses To Show</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
