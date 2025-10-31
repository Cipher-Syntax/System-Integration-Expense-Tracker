import React from 'react';

const BudgetModal = ({ formDataBudget, setFormDataBudget, onSubmit, onClose, error }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-3 sm:px-0">
            <div className="bg-white rounded-xl p-8 w-[400px] shadow-2xl">
                <h2 className="text-lg font-semibold mb-4">Create New Budget</h2>

                <div className="space-y-3">
                    <label className="block mb-1 text-sm font-medium">Limit Amount</label>
                    <input
                        type="number"
                        name="limit_amount"
                        placeholder="Enter amount"
                        value={formDataBudget.limit_amount}
                        onChange={(e) =>
                            setFormDataBudget((prev) => ({ ...prev, limit_amount: e.target.value }))
                        }
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">Start Date</label>
                    <input
                        type="date"
                        name="start_date"
                        value={formDataBudget.start_date}
                        onChange={(e) =>
                            setFormDataBudget((prev) => ({ ...prev, start_date: e.target.value }))
                        }
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">End Date</label>
                    <input
                        type="date"
                        name="end_date"
                        value={formDataBudget.end_date}
                        onChange={(e) =>
                            setFormDataBudget((prev) => ({ ...prev, end_date: e.target.value }))
                        }
                        className="w-full border p-2 rounded"
                    />
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BudgetModal;
