import React from 'react'
import { Wallet, LayoutDashboard, PhilippinePeso, Banknote, MessageCircleWarning, Settings, LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    const navLinks = [
        {icon: <LayoutDashboard/>, linkTo: "/" , name: 'Dashboard'},
        {icon: <PhilippinePeso />, linkTo: "/expenses", name: 'Expense'},
        {icon: <Banknote />, linkTo: "/budget", name: 'Budget'},
        {icon: <MessageCircleWarning />, linkTo: "/reports", name: 'Reports'},
        {icon: <Settings />, linkTo: 'settings', name: 'Settings'},
        {icon: <LogOut />, linkTo: '/logout', name: 'Logout'},
    ];

    return (
        <section className='w-[300px] bg-white min-h-screen'>
            <div className='flex flex-col items-center justify-center mt-7'>
                <div className='bg-pink-500 rounded-full w-[60px] h-[60px] flex items-center justify-center'>
                    <Wallet className='w-10 h-10 text-white'></Wallet>
                </div>
                <h1 className='leading-relaxed tracking-widest font-bold sm:text-3xl mt-2 mb-5'>SpendWise</h1>
            </div>

            {
                navLinks.map((link, index) => (
                    <NavLink to={`${link.linkTo}`} key={index}
                        className={({ isActive }) =>
                            isActive
                                ? 'flex mt-2 gap-x-3 bg-gray-400 text-white w-[80%] py-4 px-2 rounded-r-full transition-all duration-200'
                                : 'flex mt-2 gap-x-3 text-gray-800 w-[80%] py-4 px-2 rounded-r-full hover:bg-gray-400 hover:text-white transition-all duration-200'
                        }
                    >
                        <p className='w-5 h-5'>{link.icon}</p>
                        <h2>{link.name}</h2>
                    </NavLink>
                ))
            }
        </section>
    )
}

export default Sidebar