import React from 'react'

const Dashboard = () => {
    return (
        <section className='mt-26'>
            <h1 className='font-bold leading-relaxed tracking-widest text-2xl'>DASHBOARD</h1>

            <div className='w-[400px] h-[200px] bg-white rounded-2xl p-5'>
                <h2 className='text-gray-500'>Available Balance</h2>
                <h3 className='text-3xl'>₱ 10,000</h3>
            </div>
        </section>
    )
}

export default Dashboard