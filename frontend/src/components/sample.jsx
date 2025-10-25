{budgets.map((b) => {
        const isActive = b.status === "active";
        const status = b.status.charAt(0).toUpperCase() + b.status.slice(1);
        const isFull = b.status === "full";


        return (
            <div
                key={b.id}
                className={`rounded-xl shadow-md overflow-hidden transition-shadow duration-300 border-2 ${
                    isFull
                        ? "bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed"
                        : isActive
                        ? "bg-white border-pink-500 hover:shadow-xl"
                        : "bg-white border-gray-200 hover:shadow-xl"
                }`}
            >
                {/* Header with Actions */}
                <div
                    className={`p-4 flex justify-between items-center ${
                        isFull
                            ? "bg-gray-200"
                            : "bg-gradient-to-r from-pink-50 to-purple-50"
                    }`}
                >
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isFull
                                ? "bg-gray-300 text-gray-600"
                                : isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {status}
                    </span>
                    <div className="flex gap-3">
                        <Edit2
                            className={`w-5 h-5 ${
                                isFull
                                    ? "text-gray-400 cursor-not-allowed"
                                    : isActive
                                    ? "text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                                    : "text-gray-400 cursor-not-allowed"
                            }`}
                            onClick={() =>
                                openEditModal(b)
                            }
                        />
                        <Trash2
                            className='w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                            '
                            onClick={() =>
                                handleDelete(b.id)
                            }
                        />
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                    <div className="text-center pb-4 border-b border-gray-200">
                        <p
                            className={`text-sm mb-1 ${
                                isFull ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                            Limit Amount
                        </p>
                        <p
                            className={`text-3xl font-bold ${
                                isFull ? "text-gray-400" : "text-pink-600"
                            }`}
                        >
                            ₱{parseFloat(b.limit_amount).toLocaleString()}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span
                                className={`text-sm ${
                                    isFull ? "text-gray-400" : "text-gray-500"
                                }`}
                            >
                                Start Date
                            </span>
                            <span
                                className={`text-sm font-semibold ${
                                    isFull ? "text-gray-400" : "text-gray-700"
                                }`}
                            >
                                {new Date(b.start_date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span
                                className={`text-sm ${
                                    isFull ? "text-gray-400" : "text-gray-500"
                                }`}
                            >
                                End Date
                            </span>
                            <span
                                className={`text-sm font-semibold ${
                                    isFull ? "text-gray-400" : "text-gray-700"
                                }`}
                            >
                                {new Date(b.end_date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="w-full mt-8">
                        <h2
                            className={`mb-2 text-[14px] ${
                                isFull ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                            Expense Tracker
                        </h2>
                        <div className="w-full rounded-full h-3 overflow-hidden border border-gray-300 relative">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ease-in-out ${
                                    isFull
                                        ? "bg-gray-400"
                                        : progressPercent < 70
                                        ? "bg-green-500"
                                        : progressPercent < 90
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}
                                style={{
                                    width: `${isFull ? 100 : progressPercent}%`,
                                }}
                            ></div>
                        </div>
                        <p
                            className={`text-sm mt-1 text-right ${
                                isFull ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                            {isFull
                                ? "100%"
                                : `${progressPercent.toFixed(1)}%`}
                        </p>

                        {
                            isFull && progressPercent >= 96 && progressPercent <= 99 ? (
                                <p className='text-[10px] text-center text-red-500 w-[300px] mx-auto'>You've' reached 96% of your budget</p>
                            ) : (
                                ""
                            )
                        }
                        {
                            isFull && progressPercent === 100 ? (
                                <p className='text-[10px] text-center text-red-500 w-[300px] mx-auto'>You've' already reached the maximum budget. Change to new budget</p>
                            ) : (
                                ""
                            )
                        }         
                    </div>
                </div>
            </div>
        );
    })}
