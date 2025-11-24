import React from "react";
import { Calendar } from 'lucide-react'

const MonthlyExpenses = ({ expenses }) => {
    const monthlyData = Object.entries(
        expenses.reduce((acc, expense) => {
            const month = new Date(expense.date).toLocaleString('default', {
                month: 'short',
                year: 'numeric',
            })
            acc[month] = (acc[month] || 0) + parseFloat(expense.amount)
            return acc
        }, {})
    )
        .slice(0, 6)
        .reverse()

    const maxTotal = Math.max(...monthlyData.map(([, total]) => total), 1)
    const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
    const avgMonthly = totalSpent / Math.max(monthlyData.length, 1)

    return (
        <div className="w-full lg:w-[600px]">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-pink-500" />
                <h2 className="text-gray-700 font-bold text-lg">Monthly Overview</h2>
            </div>

            {expenses.length > 0 ? (
                <div className="bg-gradient-to-br from-white via-pink-50/30 to-white rounded-2xl shadow-lg border border-pink-100/50 p-6 hover:shadow-xl hover:border-pink-200/70 transition-all duration-300">
                    <div className="space-y-4">
                        {monthlyData.map(([month, total]) => {
                            const percentage = (total / maxTotal) * 100
                            return (
                                <div key={month} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-700 text-sm">{month}</h3>
                                        <p className="text-pink-500 font-bold text-sm">
                                            ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-pink-400 to-pink-500 h-full rounded-full transition-all duration-500 group-hover:from-pink-500 group-hover:to-pink-600"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-pink-50 to-transparent rounded-lg p-3 border border-pink-100">
                            <p className="text-xs text-gray-600 mb-1">Total Spent</p>
                            <p className="text-lg font-bold text-pink-600">
                                ₱{totalSpent.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-transparent rounded-lg p-3 border border-blue-100">
                            <p className="text-xs text-gray-600 mb-1">Avg Monthly</p>
                            <p className="text-lg font-bold text-blue-600">
                                ₱{avgMonthly.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No Monthly Expenses To Show</p>
                </div>
            )}
        </div>
    )
}

export default MonthlyExpenses;