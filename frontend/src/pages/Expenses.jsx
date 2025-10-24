import React, { useState, useEffect } from 'react';
import { Search, Funnel, SquarePen, Trash2    } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/api';

const Expenses = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const date = searchParams.get('date') || '';
    const amount = searchParams.get('amount') || '';
    const [showModal, setShowModal] = useState(false);
    const [currentExpense, setCurrentExpense] = useState({
        name: '',
        description: '',
        date: '',
        amount: '',
        category: '',
        budget: ''
    });
    
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleDeleteClick = (expense) => {
        setDeleteTarget(expense);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`api/expenses/${deleteTarget.id}/`);
            setExpenses((prev) => prev.filter((exp) => exp.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (error) {
            console.error("Failed to delete expense:", error);
        }
    };




    const [budgets, setBudgets] = useState([]);
    // console.log(budgets.limit_amount);
    const [amountError, setAmountError] = useState('');


    const isEditing = !!currentExpense.id;


    const handleSave = async () => {
        try {

             setAmountError('');
            if (currentExpense.budget && currentExpense.amount) {
                const selectedBudget = budgets.find(
                    b => b.id === currentExpense.budget.id || b.id === currentExpense.budget
                );

                if (selectedBudget) {
                    const budgetExpenses = expenses.filter(
                        exp => exp.budget === selectedBudget.id || exp.budget?.id === selectedBudget.id
                    );

                    const currentTotal = budgetExpenses.reduce(
                        (sum, exp) => sum + (exp.id === currentExpense.id ? 0 : parseFloat(exp.amount)),
                        0
                    );

                    const newTotal = currentTotal + parseFloat(currentExpense.amount);

                    if (newTotal > parseFloat(selectedBudget.limit_amount)) {
                        setAmountError(
                            `Adding this expense will exceed your budget limit of ₱${selectedBudget.limit_amount.toLocaleString()}.`
                        );
                        return;
                    }
                }
            }


            const formattedDate = currentExpense.date ? new Date(currentExpense.date).toISOString().split("T")[0]
            : null;

            const payload = {
                name: currentExpense.name,
                description: currentExpense.description,
                date: formattedDate,
                amount: currentExpense.amount,
                category_id: currentExpense.category?.id || currentExpense.category,
                budget: currentExpense.budget.id || null,
            };

            let response;
            if (isEditing) {
                response = await api.patch(`api/expenses/${currentExpense.id}/`, payload);
                setExpenses((prev) =>
                    prev.map((exp) => (exp.id === currentExpense.id ? response.data : exp))
                );
            } else {
                response = await api.post(`api/expenses/`, payload);
                setExpenses((prev) => [...prev, response.data]);
            }

            setShowModal(false);
            setCurrentExpense({
                name: '',
                description: '',
                date: '',
                amount: '',
                category: '',
                budget: ''
            });
        } catch (error) {
            console.error("Failed to save expense:", error);
            console.log(error.response?.data);
        }
    };


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

    useEffect(() => {
        const fetchBudgets = async () => {
            const response = await api.get('api/budgets/');
            setBudgets(response.data);
        }

        fetchBudgets()
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
                        <button
                            className="w-[250px] py-2 px-2 bg-pink-500 text-white text-center rounded-md font-bold cursor-pointer"
                            onClick={() => {
                                setCurrentExpense({
                                    name: '',
                                    description: '',
                                    date: '',
                                    amount: '',
                                    category: '',
                                    budget: ''
                                });
                                setShowModal(true);
                            }}
                        >
                            Add Expense
                        </button>
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
                                            <button 
                                                onClick={() => {
                                                    setCurrentExpense(expense)
                                                    setShowModal(true)
                                                }} 
                                                
                                            >
                                                <SquarePen className='text-blue-500 cursor-pointer'></SquarePen>
                                            </button>
                                            <button onClick={() => handleDeleteClick(expense)}>
                                                <Trash2 className='text-red-500 cursor-pointer' />
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
                        className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
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
                                    className={`w-8 h-8 border rounded cursor-pointer ${
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
                        className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
                    >
                        Last
                    </button>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-[400px]">
                            <h2 className="text-lg font-semibold mb-3">
                                {isEditing ? "Edit Expense" : "Add New Expense"}
                            </h2>

                            <div>
                                <label>Expense</label>
                                <input
                                    type="text"
                                    value={currentExpense.name}
                                    onChange={(e) => setCurrentExpense({ ...currentExpense, name: e.target.value })}
                                    className="border w-full mb-2 p-2 rounded"
                                />
                            </div>

                            <div>
                                <label>Category</label>
                                <select
                                    className="border w-full mb-2 p-2 rounded"
                                    value={currentExpense.category?.id || currentExpense.category || ''}
                                    onChange={(e) =>
                                        setCurrentExpense({
                                            ...currentExpense,
                                            category: categories.find((cat) => cat.id === parseInt(e.target.value)),
                                        })
                                    }
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Description</label>
                                <textarea
                                    value={currentExpense.description}
                                    onChange={(e) => setCurrentExpense({ ...currentExpense, description: e.target.value })}
                                    className="border w-full mb-2 p-2 rounded"
                                ></textarea>
                            </div>

                            <div>
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={currentExpense.date}
                                    onChange={(e) => setCurrentExpense({ ...currentExpense, date: e.target.value })}
                                    className="border w-full mb-2 p-2 rounded"
                                />
                            </div>

                            <div>
                                <label>Amount</label>
                                <input
                                    type="number"
                                    value={currentExpense.amount}
                                    onChange={(e) => setCurrentExpense({ ...currentExpense, amount: e.target.value })}
                                    className="border w-full mb-2 p-2 rounded"
                                />
                                {amountError && (
                                    <p className="text-red-500 text-sm mt-1">{amountError}</p>
                                )}
                            </div>

                            <div>
                                <label>Budget</label>
                                <select
                                    className="border w-full mb-2 p-2 rounded"
                                    value={currentExpense.budget?.id || currentExpense.budget || ''}
                                    onChange={(e) =>
                                        setCurrentExpense({
                                            ...currentExpense,
                                            budget: budgets.find((b) => b.id === parseInt(e.target.value)),
                                        })
                                    }
                                >
                                    <option value="">Select Budget</option>
                                    {budgets.map((b) => (
                                        <option key={b.id} value={b.id}>{b.limit_amount}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-3 py-1 border rounded cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-3 py-1 bg-pink-500 text-white rounded cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {deleteTarget && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-[350px]">
                            <h2 className="text-lg font-semibold mb-4 text-center">
                                Delete this expense?
                            </h2>
                            <p className="text-gray-600 text-center mb-4">
                                “{deleteTarget.name}” will be permanently removed.
                            </p>
                            <div className="flex justify-end gap-3 mt-10">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="px-3 py-1 border rounded cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}



            </div>
        </section>
    )
}

export default Expenses