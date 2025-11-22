import React from 'react';
import { SquarePen, Trash2 } from 'lucide-react';
// import { encryptId } from '../../utils/CryptoUtils';
import { encryptId } from '../../utils/cryptoUtils'

const ExpenseList = ({
    currentExpenses,
    searchParams,
    setSearchParams,
    setCurrentExpense,
    setShowModal,
    handleDeleteClick
}) => {
    const handleEdit = (expense) => {
        const params = new URLSearchParams(searchParams);
        params.set('edit', encryptId(expense.id));
        setSearchParams(params);
        setCurrentExpense(expense);
        setShowModal(true);
    };

    return (
        <div className="overflow-x-auto mt-10">
            <table className="min-w-[700px] w-full text-gray-500 text-sm sm:text-base">
                <thead className="border text-center bg-gray-50">
                    <tr>
                        <th className="py-2 border px-2">Expense</th>
                        <th className="py-2 border px-2">Category</th>
                        <th className="py-2 border px-2">Description</th>
                        <th className="py-2 border px-2">Date</th>
                        <th className="py-2 border px-2">Amount</th>
                        <th className="py-2 border px-2">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {currentExpenses.length > 0 ? (
                        currentExpenses.map((expense) => (
                            <tr
                                key={expense.id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                <td className="py-2 border px-3 whitespace-nowrap">
                                    {expense.name}
                                </td>
                                <td className="py-2 border px-3 whitespace-nowrap">
                                    {expense.category?.name || '-'}
                                </td>
                                <td className="py-2 border px-3">
                                    {expense.description ? expense.description : '-'}
                                </td>
                                <td className="py-2 border px-3 whitespace-nowrap">
                                    {expense.date}
                                </td>
                                <td className="py-2 border px-3 whitespace-nowrap">
                                    {Number(expense.amount).toLocaleString('en-PH', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </td>
                                <td className="flex items-center justify-center gap-x-3 py-2 border px-3">
                                    <button onClick={() => handleEdit(expense)}>
                                        <SquarePen className="text-blue-500 cursor-pointer" />
                                    </button>
                                    <button onClick={() => handleDeleteClick(expense)}>
                                        <Trash2 className="text-red-500 cursor-pointer" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-4 text-gray-500">
                                No Expenses
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseList;
