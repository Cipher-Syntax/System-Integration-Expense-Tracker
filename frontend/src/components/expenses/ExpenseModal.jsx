import React, { useEffect, useState } from 'react';

const ExpenseModal = ({
    currentExpense,
    setCurrentExpense,
    categories,
    budgets,
    validationErrors,
    setBudgets,
    setCategories,
    setExpenses,
    setShowModal,
    setOpenModalForNewBudget,
    setOpenModalForNewCategory,
    amountError,
    setAmountError,
    loading,
    setLoading,
    handleSave
}) => {
    const isEditing = !!currentExpense.id;
    const [form, setForm] = useState({
        name: '',
        description: '',
        date: '',
        amount: '',
        category: '',
        budget: ''
    });

    useEffect(() => {
        setForm({
            name: currentExpense.name || '',
            description: currentExpense.description || '',
            date: currentExpense.date || '',
            amount: currentExpense.amount || '',
            category: currentExpense.category?.id || currentExpense.category || '',
            budget: currentExpense.budget?.id || currentExpense.budget || ''
        });
    }, [currentExpense]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setCurrentExpense((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 sm:px-0">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-[90%] sm:w-[400px]">
                <h2 className="text-lg font-semibold mb-3 text-center sm:text-left">
                    {isEditing ? 'Edit Expense' : 'Add New Expense'}
                </h2>

                <div>
                    <label>Expense</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`border w-full mb-2 p-2 rounded ${validationErrors?.name ? 'border-red-500 bg-red-50' : ''}`}
                    />
                    {validationErrors?.name && (
                        <p className="text-red-500 text-sm mb-2">{validationErrors.name}</p>
                    )}
                </div>

                <div>
                    <label>Category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={(e) => {
                            if (e.target.value === 'new-category') {
                                setOpenModalForNewCategory(true);
                            } else {
                                handleChange({ target: { name: 'category', value: e.target.value } });
                            }
                        }}
                        className={`border w-full mb-2 p-2 rounded ${validationErrors?.category ? 'border-red-500 bg-red-50' : ''}`}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                        <option value="new-category">Create New Category</option>
                    </select>
                    {validationErrors?.category && (
                        <p className="text-red-500 text-sm mb-2">{validationErrors.category}</p>
                    )}
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="border w-full mb-2 p-2 rounded"
                    />
                </div>

                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date ? new Date(form.date).toISOString().split('T')[0] : ''}
                        onChange={handleChange}
                        className={`border w-full mb-2 p-2 rounded ${validationErrors?.date ? 'border-red-500 bg-red-50' : ''}`}
                    />
                    {validationErrors?.date && (
                        <p className="text-red-500 text-sm mb-2">{validationErrors.date}</p>
                    )}
                </div>

                <div>
                    <label>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        className={`border w-full mb-2 p-2 rounded ${validationErrors?.amount ? 'border-red-500 bg-red-50' : ''}`}
                    />
                    {validationErrors?.amount && (
                        <p className="text-red-500 text-sm mb-2">{validationErrors.amount}</p>
                    )}
                    {amountError && <p className="text-red-500 text-sm mb-2">{amountError}</p>}
                </div>

                <div>
                    <label>Budget</label>
                    <select
                        name="budget"
                        value={form.budget}
                        onChange={(e) => {
                            if (e.target.value === 'new-budget') {
                                setOpenModalForNewBudget(true);
                            } else {
                                handleChange({ target: { name: 'budget', value: e.target.value } });
                            }
                        }}
                        className={`border w-full mb-2 p-2 rounded ${validationErrors?.budget ? 'border-red-500 bg-red-50' : ''}`}
                    >
                        <option value="">Select Budget</option>
                        {budgets.filter((b) => b.status === 'active').length > 0 ? (
                            budgets
                                .filter((b) => b.status === 'active')
                                .map((b) => (
                                    <option key={b.id} value={b.id}>
                                        ₱{' '}
                                        {Number(b.limit_amount).toLocaleString('en-PH', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </option>
                                ))
                        ) : (
                            <option value="new-budget">Create a budget</option>
                        )}
                    </select>
                    {validationErrors?.budget && (
                        <p className="text-red-500 text-sm mb-2">{validationErrors.budget}</p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-3">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-3 py-1 border rounded cursor-pointer w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-pink-500 text-white rounded cursor-pointer w-full sm:w-auto"
                    >
                        Save
                    </button>
                </div>
            </div>
            {loading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="p-4 bg-white rounded">
                        Saving...
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseModal;