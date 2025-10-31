import React from "react";

const TotalsCard = ({ totalExpenses, budget }) => (
    <div className="flex flex-col sm:flex-row w-full sm:w-[350px] items-center justify-between mt-5 gap-5">
        <div className="text-center w-full sm:w-[160px]">
            <h2 className="text-gray-500 text-sm">Total Expenses</h2>
            <h3 className="text-sm mt-2 font-bold text-[#d70909]">
                ₱{totalExpenses !== null ? parseFloat(totalExpenses).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '0.00'}
            </h3>
        </div>
        <div className="hidden sm:block w-[1px] h-[70px] bg-black"></div>
            <div className="text-center w-full sm:w-[160px]">
            <h2 className="text-gray-500 text-sm">Budget</h2>
            <h3 className="text-sm mt-2 font-bold text-[#3B82F6]">
                ₱{budget !== null ? parseFloat(budget).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '0.00'}
            </h3>
        </div>
    </div>
)
export default TotalsCard
