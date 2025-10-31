import React from "react";
import { TrendingUp } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const ExpensesChart = ({ data }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">Expenses</h3>
            <TrendingUp className="w-5 h-5 text-pink-600" />
        </div>
        {data.length > 0 ? (
            <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <defs>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F844CE" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#F844CE" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(v) => `₱ ${parseFloat(v).toLocaleString()}`} />
                        <Area type="monotone" dataKey="amount" stroke="#F844CE" fill="url(#colorExpense)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        ) : (
            <p className="mt-10 italic text-sm">No Charts To Show</p>
        )}
    </div>
);

export default ExpensesChart;
