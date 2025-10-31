import React from "react";

const BalanceCard = ({ availableBalance }) => (
    <div className="w-full sm:w-[350px] h-[180px] bg-[#efeded] rounded-2xl p-5 border-l-[5px] border-[#F844CE]">
        <h2 className="text-gray-500 text-sm sm:text-base">Available Balance</h2>
        <h3 className="text-3xl sm:text-4xl mt-4 font-bold text-[#F844CE]">
        ₱{availableBalance !== null ? parseFloat(availableBalance).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '0.00'}
        </h3>
    </div>
)
export default BalanceCard
