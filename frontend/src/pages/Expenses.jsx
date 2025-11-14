import React, { useState, useEffect } from 'react';
import { Search, Funnel } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import { LoadingIndicator } from '../components';
import { useFetch } from '../hooks';
import { ExpenseFilters, ExpenseList, PaginationControls, ExpenseModal, CategoryModal, BudgetModal, DeleteExpenseModal } from '../components/expenses';
import { encryptId } from '../utils/CryptoUtils';

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

    const [error, setError] = useState(null);
    const [openModalForNewBudget, setOpenModalForNewBudget] = useState(false);
    const [openModalForNewCategory, setOpenModalForNewCategory] = useState(false);
    const [formDataBudget, setFormDataBudget] = useState({
        limit_amount: '',
        start_date: '',
        end_date: ''
    });

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [budgets, setBudgets] = useState([]);
    const [amountError, setAmountError] = useState('');
    const isEditing = !!currentExpense.id;
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data: categoriesData } = useFetch('api/categories/');
    const { data: expensesData } = useFetch('api/expenses/');
    const { data: budgetData } = useFetch('api/budgets/');

    useEffect(() => {
        if (categoriesData) setCategories(categoriesData);
    }, [categoriesData]);

    useEffect(() => {
        if (expensesData) setExpenses(expensesData);
    }, [expensesData]);

    useEffect(() => {
        if (budgetData) {
            // Only include active budgets
            const activeBudgets = budgetData.filter(b => b.status === "active");
            setBudgets(activeBudgets);
        }
    }, [budgetData]);

    const handleSubmitNewBudget = async (e) => {
        e.preventDefault();
        setError('');

        if (!formDataBudget.limit_amount || !formDataBudget.start_date || !formDataBudget.end_date) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await api.post('api/budgets/', formDataBudget);
            setBudgets((prev) => [...prev, response.data]);

            setOpenModalForNewBudget(false);
            setFormDataBudget({
                limit_amount: '',
                start_date: '',
                end_date: ''
            });
        } catch (err) {
            console.error('Error saving budget:', err.response?.data || err.message);
            setError('Failed to save. Check your data and try again.');
        }
    };

    const handleDeleteClick = (expense) => {
        setDeleteTarget(expense);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`api/expenses/${deleteTarget.id}/`);
            setExpenses((prev) => prev.filter((exp) => exp.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            console.error('Failed to delete expense:', err);
        }
    };

    const handleSave = async () => {
        try {
            setAmountError('');
            setLoading(true);

            if (currentExpense.budget && currentExpense.amount) {
                const selectedBudget = budgets.find(
                    (b) =>
                        b.id === currentExpense.budget?.id ||
                        String(b.id) === String(currentExpense.budget)
                );

                if (!selectedBudget) {
                    setAmountError('Selected budget not found. Please choose a valid budget.');
                    setLoading(false);
                    return;
                }

                const budgetExpenses = expenses.filter(
                    (exp) =>
                        exp.budget === selectedBudget.id ||
                        exp.budget?.id === selectedBudget.id
                );

                const currentTotal = budgetExpenses.reduce(
                    (sum, exp) => sum + (exp.id === currentExpense.id ? 0 : parseFloat(exp.amount)),
                    0
                );

                const newTotal = currentTotal + parseFloat(currentExpense.amount);
            }

            const formattedDate = currentExpense.date
                ? new Date(currentExpense.date).toISOString().split('T')[0]
                : null;

            const payload = {
                name: currentExpense.name,
                description: currentExpense.description,
                date: formattedDate,
                amount: currentExpense.amount,
                category_id: currentExpense.category?.id || currentExpense.category,
                budget: currentExpense.budget?.id || currentExpense.budget || null
            };

            let response;
            if (isEditing) {
                response = await api.patch(`api/expenses/${currentExpense.id}/`, payload);
                setExpenses((prev) =>
                    prev.map((exp) => (exp.id === currentExpense.id ? response.data : exp))
                );
            } else {
                response = await api.post('api/expenses/', payload);
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

            setTimeout(() => setLoading(false), 3000);
        } catch (err) {
            console.error('Failed to save expense:', err);
            setLoading(false);
        }
    };

    const addNewCategory = async (name) => {
        try {
            const response = await api.post('api/categories/', { name });
            setCategories((prev) => [...prev, response.data]);
            setCurrentExpense((prev) => ({
                ...prev,
                category: response.data
            }));
        } catch (err) {
            console.error('Failed to create category:', err);
        }
    };

    const closeModal = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('edit');
        setSearchParams(params);
        setShowModal(false);
    };

    useEffect(() => {
        const editId = searchParams.get('edit');
        if (editId && expenses.length > 0) {
            const expenseToEdit = expenses.find((exp) => exp.id === parseInt(editId));
            if (expenseToEdit) {
                setCurrentExpense(expenseToEdit);
                setShowModal(true);
            }
        }
    }, [searchParams, expenses, setSearchParams]);

    // --- Filter expenses by active budgets AND search filters ---
    const activeBudgetIds = budgets.map(b => b.id);

    const filteredExpenses = expenses.filter((expense) => {
        if (!expense.budget || !activeBudgetIds.includes(expense.budget?.id || expense.budget)) {
            return false; // Skip expenses not tied to active budgets
        }

        const searchMatch =
            expense.name.toLowerCase().includes(q.toLowerCase()) ||
            expense.description?.toLowerCase().includes(q.toLowerCase()) ||
            expense.category?.name.toLowerCase().includes(q.toLowerCase());

        const categoryMatch = category ? String(expense.category?.id) === String(category) : true;

        const dateMatch = date
            ? new Date(expense.date)
                .toLocaleString('default', { month: 'long' })
                .toLowerCase() === date.toLowerCase()
            : true;

        const checkAmountMatch = () => {
            if (!amount) return true;

            const amt = expense.amount;
            if (amount === 'below-1000') return amt < 1000;
            if (amount === '1000-5000') return amt >= 1000 && amt <= 5000;
            if (amount === '5000-10000') return amt >= 5000 && amt <= 10000;
            if (amount === 'above-10000') return amt > 10000;

            return true;
        };

        const amountMatch = checkAmountMatch();

        return searchMatch && categoryMatch && dateMatch && amountMatch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const sortedExpenses = filteredExpenses.slice().sort((a, b) => b.id - a.id);
    const currentExpenses = sortedExpenses.slice(startIndex, startIndex + itemsPerPage);

    return (
        <section className="mt-26 w-full px-4 sm:px-8 overflow-x-auto">
            <h1 className="text-3xl font-bold leading-relaxed tracking-widest">Expenses</h1>

            <div className="w-full mx-auto my-15">
                <ExpenseFilters
                    q={q}
                    category={category}
                    date={date}
                    amount={amount}
                    categories={categories}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    onAdd={() => {
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
                />

                <ExpenseList
                    currentExpenses={currentExpenses}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    setCurrentExpense={setCurrentExpense}
                    setShowModal={setShowModal}
                    handleDeleteClick={handleDeleteClick}
                />

                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />

                {showModal && (
                    <ExpenseModal
                        currentExpense={currentExpense}
                        setCurrentExpense={setCurrentExpense}
                        categories={categories}
                        budgets={budgets}
                        setBudgets={setBudgets}
                        setCategories={setCategories}
                        setExpenses={setExpenses}
                        setShowModal={setShowModal}
                        setOpenModalForNewBudget={setOpenModalForNewBudget}
                        setOpenModalForNewCategory={() => setOpenModalForNewCategory(true)}
                        amountError={amountError}
                        setAmountError={setAmountError}
                        loading={loading}
                        setLoading={setLoading}
                        handleSave={handleSave}
                    />
                )}

                {openModalForNewCategory && (
                    <CategoryModal
                        onSave={addNewCategory}
                        onClose={() => setOpenModalForNewCategory(false)}
                    />
                )}

                {openModalForNewBudget && (
                    <BudgetModal
                        formDataBudget={formDataBudget}
                        setFormDataBudget={setFormDataBudget}
                        onSubmit={handleSubmitNewBudget}
                        onClose={() => setOpenModalForNewBudget(false)}
                        error={error}
                    />
                )}

                {deleteTarget && (
                    <DeleteExpenseModal
                        deleteTarget={deleteTarget}
                        onCancel={() => setDeleteTarget(null)}
                        onConfirm={confirmDelete}
                    />
                )}

                {loading && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <LoadingIndicator />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Expenses;
