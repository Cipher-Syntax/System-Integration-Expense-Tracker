import React from "react";
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingDown } from 'lucide-react'

const RecentExpenses = ({ expenses }) => {
    return (
        <Link to="/expenses" className="w-full lg:w-[600px] group">
            <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-pink-500" />
                <h2 className="text-gray-700 font-bold text-lg">Recent Expenses</h2>
            </div>
            
            {expenses.length > 0 ? (
                <div className="bg-gradient-to-br from-white via-pink-50/30 to-white rounded-2xl shadow-lg border border-pink-100/50 overflow-hidden hover:shadow-xl hover:border-pink-200/70 transition-all duration-300">
                    {expenses.slice(0, 5).reverse().map((expense, idx) => (
                        <div
                            key={expense.id}
                            className={`p-4 flex items-center justify-between hover:bg-pink-50/50 transition-colors duration-200 ${idx !== Math.min(4, expenses.length - 1) ? 'border-b border-gray-100' : ''}`}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                                        {expense.category?.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{expense.name || 'Expense'}</h4>
                                        <p className="text-xs text-gray-500">{expense.category?.name || 'Uncategorized'}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 ml-13">
                                    {new Date(expense.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-pink-500 text-sm sm:text-base">₱{parseFloat(expense.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                                <ArrowRight className="text-gray-300 w-4 h-4 ml-auto mt-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                    <TrendingDown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No Recent Expenses To Show</p>
                </div>
            )}
        </Link>
    )
}

export default RecentExpenses;