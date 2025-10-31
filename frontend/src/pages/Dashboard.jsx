import React, { useEffect, useState } from 'react'
import { useFetch } from '../hooks';
import { BalanceCard, TotalsCard, ProgressBar, ExpenseChart, RecentExpenses, MonthlyExpenses } from '../components/dashboard'

const Dashboard = () => {
    const [availableBalance, setAvailableBalance] = useState(null)
    const [selectedBudget, setSelectedBudget] = useState(null)
    const [totalExpenses, setTotalExpenses] = useState(null)
    const [budget, setBudget] = useState(null)
    const [expenseTracker, setExpenseTracker] = useState(null)
    const [chartData, setChartData] = useState([])
    const [expenses, setExpenses] = useState([])
    const [filter, setFilter] = useState('day')

    const { data, loading, error } = useFetch('api/budgets/')
    const { data: balanceAvailableData } = useFetch(selectedBudget ? `api/budgets/${selectedBudget}/available_balance/` : null)
    const { data: totalExpensesData } = useFetch('api/budgets/total_expenses/')
    const { data: expensesData } = useFetch('api/expenses/')

    useEffect(() => {
        if (!loading && data?.length > 0) {
        const active = data.find(b => b.status === 'active') || data[data.length - 1]
        setSelectedBudget(active.id)
        setExpenseTracker(active.limit_amount)
        setBudget(active.limit_amount)
        }
    }, [data, loading])

    useEffect(() => {
        if (balanceAvailableData && selectedBudget) {
        setAvailableBalance(Math.max(balanceAvailableData.remaining_balance, 0))
        }
    }, [balanceAvailableData, selectedBudget])

    useEffect(() => {
        if (totalExpensesData) setTotalExpenses(totalExpensesData.total_expenses)
    }, [totalExpensesData])

    useEffect(() => {
        if (expensesData && selectedBudget) {
        const filtered = expensesData.filter(exp => exp.budget === selectedBudget)
        const dailyTotals = {}
        filtered.forEach(exp => {
            const date = exp.date
            dailyTotals[date] = (dailyTotals[date] || 0) + parseFloat(exp.amount)
        })
        const formattedData = Object.entries(dailyTotals)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
        setChartData(formattedData)
        setExpenses(filtered)
        }
    }, [expensesData, selectedBudget])

    if (loading) return <p className='text-[12px]'>Loading...</p>
    if (error) return <p className='text-[12px]'>Something went wrong. Please try again</p>
    if (!data) return null

    const progressPercent = expenseTracker
        ? Math.min(((expenseTracker - availableBalance) / expenseTracker) * 100, 100)
        : 0


    return (
        <section className="mt-26 w-full px-4 sm:px-6 md:px-10">
            <h1 className="text-3xl font-bold leading-relaxed tracking-widest text-left">DASHBOARD</h1>

            <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-start gap-10 mt-10 w-full">
                <div className="flex flex-col items-center lg:items-start w-full">
                <BalanceCard availableBalance={availableBalance} />
                <TotalsCard totalExpenses={totalExpenses} budget={budget} />
                <ProgressBar progressPercent={progressPercent} />
                </div>

                <ExpenseChart chartData={chartData} filter={filter} setFilter={setFilter} />
            </div>

            <div className="flex flex-col lg:flex-row items-start justify-between gap-10 mt-20 mb-10">
                <RecentExpenses expenses={expenses} />
                <MonthlyExpenses expenses={expenses} />
            </div>
        </section>
    )

};

export default Dashboard;
