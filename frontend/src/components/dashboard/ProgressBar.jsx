import React from "react";

const ProgressBar = ({ progressPercent }) => (
    <div className="w-full sm:w-[350px] mt-8">
        <h2 className="text-gray-500 mb-2 text-sm">Expense Tracker</h2>
        <div className="w-full rounded-full h-3 overflow-hidden border border-gray-300 relative">
            <div
                className={`h-full rounded-full transition-all duration-700 ease-in-out ${
                progressPercent < 70 ? 'bg-green-500'
                : progressPercent < 90 ? 'bg-yellow-500'
                : 'bg-red-500'
                }`}
                style={{ width: `${progressPercent}%` }}
            ></div>
        </div>
        <p className="text-sm mt-1 text-gray-600 text-right">{progressPercent.toFixed(1)}%</p>

        {progressPercent >= 96 && progressPercent < 100 && (
            <p className="text-[10px] text-center text-red-500">You've reached 96% of your budget</p>
        )}
        {progressPercent === 100 && (
            <p className="text-[10px] text-center text-red-500">You've reached the maximum budget. Change to a new one.</p>
        )}
    </div>
)
export default ProgressBar
