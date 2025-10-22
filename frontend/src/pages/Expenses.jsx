import React, { useState, useEffect } from 'react';
import { Search, Funnel, SquarePen, Trash2    } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/api';

const Expenses = () => {
    const [searchQuery, setSearchQuery] = useSearchParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const date = searchParams.get('date') || '';
    const amount = searchParams.get('amount') || '';

    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredExpenses = expenses.filter(expense => {
        const searchMatch =
            expense.name.toLowerCase().includes(q.toLowerCase()) ||
            expense.description?.toLowerCase().includes(q.toLowerCase()) ||
            expense.category?.name.toLowerCase().includes(q.toLowerCase());

        // const categoryMatch = category ? expense.category?.name.toLowerCase() === category.toLowerCase() : true;
        const categoryMatch = category ? String(expense.category?.id) === String(category) : true;


        const dateMatch = date
            ? new Date(expense.date).toLocaleString('default', { month: 'long' }).toLowerCase() === date.toLowerCase()
            : true;

        const amountMatch = (() => {
            if (!amount) return true;
            const amt = expense.amount;
            if (amount === 'below-1000') return amt < 1000;
            if (amount === '1000-5000') return amt >= 1000 && amt <= 5000;
            if (amount === '5000-10000') return amt >= 5000 && amt <= 10000;
            if (amount === 'above-10000') return amt > 10000;
            return true;
        })();

        return searchMatch && categoryMatch && dateMatch && amountMatch;
    });


    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
        if (!confirmDelete) return;

        try {
            await api.delete(`api/expenses/${id}/`);
            setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
        } catch (error) {
            console.error("Failed to delete expense:", error);
        }
    };


    useEffect(() => {
        const fetchCategories = async () => {
            try{
                const response = await api.get('api/categories/');
                console.log(response.data)
                setCategories(response.data)
            }
            catch(error){
                console.error('Failed to fetch categories:', error);
            }
        }

        fetchCategories();
    }, [])

    useEffect(() => {
        const fetchExpenses = async () => {
            const response = await api.get('api/expenses/');
            console.log(response.data);
            setExpenses(response.data);
        }

        fetchExpenses();
    }, [])

    
    return (
        <section className='mt-26'>
            <h1 className='font-bold leading-relaxed tracking-widest text-2xl'>Expenses</h1>

            <div className='w-[1000px] mx-auto my-15'>
                <div className='relative w-[900px] mx-auto'>
                    <Search className='absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5' />
                    <input 
                        type="text"
                        placeholder="Search expenses..."
                        value={q}
                        onChange={(e) => {
                            const params = new URLSearchParams(searchParams);
                            params.set('q', e.target.value);
                            setSearchParams(params);
                        }}
                        className="w-full py-3 px-15 bg-white text-gray-500 rounded-full focus:outline-pink-400 text-base text-md border"
                    />


                </div>

                <div className='mt-15'>
                    <div className='flex items-center gap-x-3'>
                        <Funnel />
                        <h2>Filter by:</h2>
                    </div>

                    <div  className='flex items-center justify-between mt-3 text-gray-600'>
                        <div className='w-[500px] flex items-center justify-between gap-x-5'>
                            {/* Category */}
                            <select 
                                value={category}
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams);
                                    params.set('category', e.target.value);
                                    setSearchParams(params);
                                }}
                                className='border w-[200px] py-1 px-2 rounded-full'
                            >
                                <option value="">Category</option>
                                {
                                    categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))
                                }
                            </select>

                            {/* Date */}
                            <select 
                                value={date}
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams);
                                    params.set('date', e.target.value);
                                    setSearchParams(params);
                                }}
                                className='border w-[200px] py-1 px-2 rounded-full'
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

                            {/* Amount */}
                            <select 
                                value={amount}
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams);
                                    params.set('amount', e.target.value);
                                    setSearchParams(params);
                                }}
                                className='border w-[200px] py-1 px-2 rounded-full'
                            >
                                <option value="">Amount</option>
                                <option value="below-1000">Below ₱ 1,000</option>
                                <option value="1000-5000">₱ 1,000 – ₱ 5,000</option>
                                <option value="5000-10000">₱ 5,000 – ₱ 10,000</option>
                                <option value="above-10000">Above ₱ 10,000</option>

                            </select>

                        </div>
                        <Link className='w-[250px] py-2 px-2 bg-pink-500 text-white text-center rounded-md font-bold leading-relaxed tracking-wider'>Add Expenses</Link>
                    </div>
                </div>

                {/* Expenses table */}
                <table className='mt-10 w-full text-gray-500'>
                    <thead className='border text-center'>
                        <tr>
                            <th className='py-1 border'>Expense</th>
                            <th className='py-1 border'>Category</th>
                            <th className='py-1 border'>Description</th>
                            <th className='py-1 border'>Date</th>
                            <th className='py-1 border'>Amount</th>
                            <th className='py-1 border'>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            currentExpenses.length > 0 ? (
                                currentExpenses
                                .reverse()
                                .map((expense) => (
                                    <tr key={expense.id}>
                                        <td className='py-2 border px-3'>{expense.name.slice(0, 100) + "..."}</td>
                                        <td className='py-2 border px-3'>{expense.category.name}</td>
                                        <td className='py-2 border px-3'>{expense.description ? expense.description.slice(0, 150) + "..." : "-"}</td>
                                        <td className='py-2 border px-3'>{expense.date}</td>
                                        <td className='py-2 border px-3'>{expense.amount}</td>
                                        <td className='flex items-center justify-center gap-x-3 py-2 border px-3'>
                                            <SquarePen className='text-blue-500 cursor-pointer'></SquarePen>
                                            <button onClick={() => handleDelete(expense.id)}>
                                                <Trash2 className='text-red-500 cursor-pointer'></Trash2>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <td colSpan={7} className='text-center py-2'>No Expenses</td>
                            )
                        }
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        First
                    </button>

                    {
                        [...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 border rounded ${
                                    currentPage === page ? 'bg-pink-500 text-white' : ''
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })
                    }

                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Last
                    </button>
                </div>

            </div>
        </section>
    )
}

export default Expenses