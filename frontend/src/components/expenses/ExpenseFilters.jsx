import React from 'react';
import { Search, Funnel } from 'lucide-react';

const ExpenseFilters = ({
    q,
    category,
    date,
    amount,
    categories,
    searchParams,
    setSearchParams,
    onArchived,
    onAdd
}) => {
    const handleParamChange = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set(key, value);
        else params.delete(key);
        setSearchParams(params);
    };

    return (
        <div className="relative w-full mx-auto mt-5">
            <div className="relative">
                <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search expenses..."
                    value={q}
                    onChange={(e) => handleParamChange('q', e.target.value)}
                    className="w-full py-3 px-15 bg-white text-gray-500 rounded-full focus:outline-pink-400 text-base text-md border"
                />
            </div>

            <div className="mt-15 w-full">
                <div className="flex items-center gap-x-3">
                    <Funnel />
                    <h2>Filter by:</h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 text-gray-600 gap-4">
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-x-5">
                        <select
                            value={category}
                            onChange={(e) => handleParamChange('category', e.target.value)}
                            className="border w-full sm:w-[200px] py-1 px-2 rounded-full"
                        >
                            <option value="">Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={date}
                            onChange={(e) => handleParamChange('date', e.target.value)}
                            className="border w-full sm:w-[200px] py-1 px-2 rounded-full"
                        >
                            <option value="">Date</option>
                            <option value="january">January</option>
                            <option value="february">February</option>
                            <option value="march">March</option>
                            <option value="april">April</option>
                            <option value="may">May</option>
                            <option value="june">June</option>
                            <option value="july">July</option>
                            <option value="august">August</option>
                            <option value="september">September</option>
                            <option value="october">October</option>
                            <option value="november">November</option>
                            <option value="december">December</option>
                        </select>

                        <select
                            value={amount}
                            onChange={(e) => handleParamChange('amount', e.target.value)}
                            className="border w-full sm:w-[200px] py-1 px-2 rounded-full"
                        >
                            <option value="">Amount</option>
                            <option value="below-1000">Below ₱ 1,000</option>
                            <option value="1000-5000">₱ 1,000 – ₱ 5,000</option>
                            <option value="5000-10000">₱ 5,000 – ₱ 10,000</option>
                            <option value="above-10000">Above ₱ 10,000</option>
                        </select>
                    </div>

                    <div className='flex items-center justify-center gap-x-5'>
                        <button
                            className="w-full sm:w-[250px] py-2 px-2 bg-gray-700 text-white text-center rounded-md font-bold cursor-pointer"
                            onClick={onArchived}
                        >
                            Archives
                        </button>

                        <button
                            className="w-full sm:w-[250px] py-2 px-2 bg-pink-500 text-white text-center rounded-md font-bold cursor-pointer"
                            onClick={onAdd}
                        >
                            Add Expense
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseFilters;