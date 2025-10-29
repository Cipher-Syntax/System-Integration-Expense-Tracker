import React, { useState } from 'react'
import { Wallet, LayoutDashboard, PhilippinePeso, Banknote, MessageCircleWarning, Settings, LogOut, Menu, X, } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        {icon: <LayoutDashboard/>, linkTo: "/" , name: 'Dashboard'},
        {icon: <PhilippinePeso />, linkTo: "/expenses", name: 'Expense'},
        {icon: <Banknote />, linkTo: "/budgets", name: 'Budget'},
        {icon: <MessageCircleWarning />, linkTo: "/reports", name: 'Reports'},
        {icon: <Settings />, linkTo: 'settings', name: 'Settings'},
        {icon: <LogOut />, linkTo: '/logout', name: 'Logout'},
    ];

    return (
        <>
            <section className='hidden md:flex flex-col w-[300px] bg-white min-h-screen'>
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

            <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-5 py-3 z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-pink-500 rounded-full w-[40px] h-[40px] flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="font-bold text-xl text-gray-700">SpendWise</h1>
                </div>

                <button onClick={() => setIsOpen(!isOpen)} className='p-2 rounded-md hover:bg-gray-100 transition'>
                    <Menu size={24}></Menu>
                </button>
            </div>

            <div className={`fixed top-0 right-0 h-full w-[250px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[9999] ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <button onClick={() => setIsOpen(!isOpen)} className='p-2 rounded-md hover:bg-gray-100 transition float-end'>
                    <X size={24}></X>
                </button>

                <div className="flex flex-col items-center mt-10 space-y-4">
                    {navLinks.map((link, index) => (
                        <NavLink
                            to={link.linkTo}
                            key={index}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                ? "flex items-center gap-x-3 bg-gray-400 text-white w-[80%] py-3 px-2 rounded-lg transition-all duration-200"
                                : "flex items-center gap-x-3 text-gray-800 w-[80%] py-3 px-2 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-200"
                            }
                        >
                        <span className="w-5 h-5">{link.icon}</span>
                        <h2>{link.name}</h2>
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Sidebar;