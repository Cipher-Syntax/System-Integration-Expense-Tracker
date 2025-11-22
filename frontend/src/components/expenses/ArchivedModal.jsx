import React, { useState, useEffect } from 'react';
import { SquarePen, Trash2, X } from 'lucide-react';
// import { useFetch } from '../hooks';
import { useFetch } from '../../hooks';
// import api from '../api/api';
import api from '../../api/api';

const ArchivedModal = ({ isOpen, onClose, setCurrentExpense, setShowModal }) => {
    const [archivedExpenses, setArchivedExpenses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data: budgetData } = useFetch('api/budgets/');
    const { data: expensesData } = useFetch('api/expenses/');

    useEffect(() => {
        if (budgetData && expensesData) {
            // Get all inactive budgets (archived)
            const inactiveBudgets = budgetData.filter(b => b.status !== "active");
            const inactiveBudgetIds = inactiveBudgets.map(b => b.id);

            // Filter expenses that belong to inactive budgets
            const archived = expensesData.filter((expense) =>
                inactiveBudgetIds.includes(expense.budget?.id || expense.budget)
            );

            setArchivedExpenses(archived);
            setCurrentPage(1);
        }
    }, [budgetData, expensesData]);

    const handleEdit = (expense) => {
        setCurrentExpense(expense);
        setShowModal(true);
        onClose();
    };

    const handleDelete = async (expense) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await api.delete(`api/expenses/${expense.id}/`);
                setArchivedExpenses((prev) => prev.filter((exp) => exp.id !== expense.id));
            } catch (err) {
                console.error('Failed to delete expense:', err);
            }
        }
    };

    if (!isOpen) return null;

    // Pagination
    const totalPages = Math.ceil(archivedExpenses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const sortedExpenses = archivedExpenses.slice().sort((a, b) => b.id - a.id);
    const currentExpenses = sortedExpenses.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-gray-800">Archived Expenses</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto p-6">
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
                                                <SquarePen className="text-blue-500 cursor-pointer hover:text-blue-700 transition" />
                                            </button>
                                            <button onClick={() => handleDelete(expense)}>
                                                <Trash2 className="text-red-500 cursor-pointer hover:text-red-700 transition" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-gray-500">
                                        No Archived Expenses
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 p-6 border-t">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        >
                            Previous
                        </button>
                        <span className="text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArchivedModal;