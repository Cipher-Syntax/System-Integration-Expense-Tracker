import React from "react";

const BudgetModal = ({ showModal, setShowModal, formData, setFormData, handleSubmit, editingBudget, error }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-8 w-[400px] shadow-2xl">
                <h2 className="text-lg font-semibold mb-4">
                    {editingBudget ? "Edit Budget" : "Create Budget"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Limit Amount</label>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={formData.limit_amount}
                            onChange={(e) =>
                                setFormData({ ...formData, limit_amount: e.target.value })
                            }
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Start Date</label>
                        <input
                            type="date"
                            value={formData.start_date}
                            onChange={(e) =>
                                setFormData({ ...formData, start_date: e.target.value })
                            }
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">End Date</label>
                        <input
                            type="date"
                            value={formData.end_date}
                            onChange={(e) =>
                                setFormData({ ...formData, end_date: e.target.value })
                            }
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
                        >
                            {editingBudget ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BudgetModal;
