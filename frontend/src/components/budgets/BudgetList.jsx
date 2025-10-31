import React from "react";
import { BudgetCard } from '../../components/budgets'
import { Plus } from "lucide-react";

const BudgetList = ({ budgets, handleDelete, openEditModal, activeBudget, progressPercent }) => {
    if (!budgets.length) {
        return (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="max-w-sm mx-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No budgets yet.</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Create your first budget to start tracking your spending.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((b) => (
                <BudgetCard
                    key={b.id}
                    budget={b}
                    handleDelete={handleDelete}
                    openEditModal={openEditModal}
                    activeBudget={activeBudget}
                    progressPercent={progressPercent}
                />
            ))}
        </div>
    );
};

export default BudgetList;
