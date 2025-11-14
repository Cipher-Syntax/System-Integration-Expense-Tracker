import React, { useState, useEffect } from 'react'
import { Wallet, LayoutDashboard, PhilippinePeso, Banknote, MessageCircleWarning, Settings, LogOut, Bell, Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import api from '../api/api'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState([])

    // Fetch notifications once on mount
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get('api/notifications/')
                setNotifications(response.data)
            } catch (err) {
                console.error('Failed to fetch notifications:', err)
            }
        }
        fetchNotifications()
    }, [])

    // Count unread notifications (Recommendation or Achievement)
    const unreadCount = notifications.filter(n => !n.is_read && (n.type === "Recommendation" || n.type === "Achievement")).length

    // Handle marking notification as read
    const handleMarkAsRead = async (id) => {
        try {
            await api.patch(`api/notifications/${id}/`, { is_read: true })

            // Update state immediately so dot disappears
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            )
        } catch (err) {
            console.error("Failed to mark notification as read:", err)
        }
    }

    const mainLinks = [
        { icon: <LayoutDashboard />, linkTo: "/", name: "Dashboard" },
        { icon: <PhilippinePeso />, linkTo: "/expenses", name: "Expense" },
        { icon: <Banknote />, linkTo: "/budgets", name: "Budget" },
        { icon: <MessageCircleWarning />, linkTo: "/reports", name: "Reports" },
        {
            icon: <Bell />,
            linkTo: "/notifications",
            name: "Notifications",
            hasUnread: unreadCount > 0
        },
        { icon: <Settings />, linkTo: "/settings", name: "Settings" },
    ]

    const logoutLink = { icon: <LogOut />, linkTo: "/logout", name: "Logout" }

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <section className="hidden md:flex flex-col w-[300px] bg-white min-h-screen">
                <div className="flex flex-col flex-1">
                    {/* Logo */}
                    <div className="flex flex-col items-center justify-center mt-7">
                        <div className="bg-pink-500 rounded-full w-[60px] h-[60px] flex items-center justify-center">
                            <Wallet className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="leading-relaxed tracking-widest font-bold sm:text-3xl mt-2 mb-5">
                            SpendWise
                        </h1>
                    </div>

                    {/* Main Links */}
                    <div className="flex flex-col items-center">
                        {mainLinks.map((link, index) => (
                            <NavLink
                                to={link.linkTo}
                                key={index}
                                className={({ isActive }) =>
                                    `relative flex mt-2 gap-x-3 text-gray-900 w-[80%] py-4 px-2 rounded-r-full transition-all duration-200 ${isActive ? "after:content-[''] after:absolute after:left-[-3px] after:top-1/2 after:-translate-y-1/2 after:w-2 after:h-[60%] after:bg-pink-500" : "hover:bg-gray-100"}`
                                }
                            >
                                <div className="relative">
                                    {link.icon}
                                    {link.hasUnread && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" />
                                    )}
                                </div>
                                <h2>{link.name}</h2>
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Logout at Bottom */}
                <div className="flex flex-col items-center mb-6">
                    <NavLink
                        to={logoutLink.linkTo}
                        className={({ isActive }) =>
                            isActive
                                ? "flex gap-x-3 bg-gray-400 text-white w-[80%] py-4 px-2 rounded-r-full transition-all duration-200"
                                : "flex gap-x-3 text-gray-800 w-[80%] py-4 px-2 rounded-r-full hover:bg-gray-400 hover:text-white transition-all duration-200"
                        }
                    >
                        <p className="w-5 h-5">{logoutLink.icon}</p>
                        <h2>{logoutLink.name}</h2>
                    </NavLink>
                </div>
            </section>

            {/* MOBILE NAVBAR */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-5 py-3 z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-pink-500 rounded-full w-[40px] h-[40px] flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="font-bold text-xl text-gray-700">SpendWise</h1>
                </div>

                <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-gray-100 transition">
                    <Menu size={24} />
                </button>
            </div>

            {/* MOBILE SLIDE MENU */}
            <div className={`fixed top-0 right-0 h-full w-[250px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[9999] ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-md hover:bg-gray-100 transition float-end">
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center mt-10 space-y-4">
                    {mainLinks.map((link, index) => (
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
                            <div className="relative">
                                {link.icon}
                                {link.hasUnread && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" />
                                )}
                            </div>
                            <h2>{link.name}</h2>
                        </NavLink>
                    ))}

                    {/* Logout */}
                    <div className="pt-10 w-full flex justify-center">
                        <NavLink
                            to={logoutLink.linkTo}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-x-3 bg-gray-400 text-white w-[80%] py-3 px-2 rounded-lg transition-all duration-200"
                                    : "flex items-center gap-x-3 text-gray-800 w-[80%] py-3 px-2 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-200"
                            }
                        >
                            <span className="w-5 h-5">{logoutLink.icon}</span>
                            <h2>{logoutLink.name}</h2>
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar
