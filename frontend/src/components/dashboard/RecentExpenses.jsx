import React from "react";
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const RecentExpenses = ({ expenses }) => {
    return (
        <Link to="/expenses" className="w-full lg:w-[480px]">
            <h2 className="text-gray-700 font-semibold mb-4">Recent Expenses</h2>
            {expenses.length > 0 ? (
                expenses.slice(0, 5).reverse().map(expense => (
                    <div
                        key={expense.id}
                        className="p-3 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition cursor-pointer"
                    >
                        <div>
                            <h4 className="font-semibold text-gray-700 text-sm sm:text-base">{expense.category?.name || 'Uncategorized'}</h4>
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
    )
}
export default RecentExpenses
