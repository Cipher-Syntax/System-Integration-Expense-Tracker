import React from "react";

const MonthlyExpenses = ({ expenses }) => (
    <div className="w-full lg:w-[500px]">
        <h2 className="text-gray-700 font-semibold mb-4">Monthly Expenses</h2>
        {expenses.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(
                    expenses.reduce((acc, expense) => {
                        const month = new Date(expense.date).toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                        })
                        acc[month] = (acc[month] || 0) + parseFloat(expense.amount)
                        return acc
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
)
export default MonthlyExpenses
