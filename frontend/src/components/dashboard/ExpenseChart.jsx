import React from "react";

import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ExpenseChart = ({ chartData, filter, setFilter }) => {
    const getFilteredData = () => {
        if (!chartData.length) return []
        if (filter === 'day') return chartData

        if (filter === 'week') {
            const weekData = {}
            chartData.forEach(({ date, amount }) => {
                const weekStart = new Date(date)
                const weekNumber = Math.ceil(weekStart.getDate() / 7)
                const monthYear = weekStart.toLocaleString('default', { month: 'short', year: 'numeric' })
                const key = `${monthYear} - Week ${weekNumber}`
                weekData[key] = (weekData[key] || 0) + amount
            })
            return Object.entries(weekData).map(([date, amount]) => ({ date, amount }))
        }

        if (filter === 'monthly') {
            const monthData = {}
            chartData.forEach(({ date, amount }) => {
                const month = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' })
                monthData[month] = (monthData[month] || 0) + amount
            })
            return Object.entries(monthData).map(([date, amount]) => ({ date, amount }))
        }

        return chartData
    }

    const filteredData = getFilteredData()

    return (
        <div className="w-full h-[350px] mt-10 bg-transparent rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-gray-700 mb-4 text-lg font-semibold">Expenses Statistic</h2>
                <select className="border py-1 px-2 rounded-2xl text-sm" value={filter} onChange={e => setFilter(e.target.value)}>
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
                        <Tooltip formatter={value => `₱${parseFloat(value).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`} />
                        <Area type="monotone" dataKey="amount" stroke="#F844CE" fill="url(#colorExpense)" strokeWidth={2} activeDot={{ r: 5 }} />
                    </AreaChart>
                </ResponsiveContainer>
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-12 italic">No Chart To Show</p>
            )}
        </div>
    )
}
export default ExpenseChart
