import React from "react";

const TopExpensesTable = ({ data }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Top Expenses</h3>
        <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Description</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Category</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Date</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((expense, i) => (
                            <tr key={i} className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                                <td className="py-3 px-4 text-gray-800 font-medium whitespace-nowrap">{expense.name}</td>
                                <td className="py-3 px-4">
                                    <span className="inline-block px-2 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{expense.date}</td>
                                <td className="py-3 px-4 text-gray-800 font-bold text-right">₱ {expense.amount}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center pt-10 italic text-sm text-gray-600">
                                No Top Expenses To Show
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export default TopExpensesTable;
