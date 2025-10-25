import React from 'react'
import { User, Mail, Phone, Bell, Lock, Save, AlertCircle, CheckCircle, Eye, EyeOff, CircleUser, SquarePen, Trash2 } from "lucide-react";

const Settings = () => {
    return (
        <section className="mt-26 max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent leading-relaxed tracking-widest">Settings & Profile</h1>

            <div className="mb-8 w-[1000px] bg-white rounded-2xl py-5 px-15 h-auto">
                <div>
                    <h2 className='font-bold leading-relaxed tracking-wider text-2xl text-gray-500 mt-5'>Personal Information</h2>
                    
                    <div className='flex items-start justify-between mt-3 px-5 gap-x-3 p-5 shadow rounded-2xl'>
                        <div className='flex items-center gap-x-3'>
                            <CircleUser size={100} className='text-gray-500'></CircleUser>
                            <div className='text-gray-500 text-[12px] leading-relaxed tracking-wider'>
                                <h1 className='text-3xl font-bold'>Justine</h1>
                                <p>+639941627819</p>
                                <p>toongjustine014@gmail.com</p>
                            </div>
                        </div>

                        <div className='w-[70px] rounded-full p-2 border flex items-center justify-center text-[12px] gap-x-2 text-gray-500 cursor-pointer hover:bg-pink-500 hover:text-white hover:translate-y-[-5px] transition duration-75 ease-in-out'>
                            <SquarePen size={15}></SquarePen>
                            <p>Edit</p>
                        </div>
                    </div>

                    <div className='flex items-start justify-between mt-3 px-5 gap-x-3 p-5 shadow rounded-2xl'>
                        <div className='flex items-start gap-x-3 flex-col gap-y-5 w-full'>

                            <div className='text-gray-500 text-[12px] leading-relaxed tracking-wider flex flex-col'>
                                <label htmlFor="username" className='text-[10px] font-bold'>Username</label>
                                <input type="text" name='username' value="Justine" className='text-[16px]' readOnly />
                            </div>

                            <div className='text-gray-500 text-[12px] leading-relaxed tracking-wider flex flex-col'>
                                <label htmlFor="phone" className='text-[10px] font-bold'>Phone</label>
                                <input type="text" name='phone' value="+639941627819" className='text-[16px]' readOnly />
                            </div>

                            <div className='text-gray-500 text-[12px] leading-relaxed tracking-wider flex flex-col'>
                                <label htmlFor="email" className='text-[10px] font-bold'>Email</label>
                                <input type="email" name='email' value="toongjustine014@gmail.com" className='text-[16px] w-[500px]' readOnly />
                            </div>

                            
                        </div>

                        <div className='w-[70px] rounded-full p-2 border flex items-center justify-center text-[12px] gap-x-2 text-gray-500 cursor-pointer hover:bg-pink-500 hover:text-white hover:translate-y-[-5px] transition duration-75 ease-in-out'>
                            <SquarePen size={15}></SquarePen>
                            <p>Edit</p>
                        </div>
                    </div>

                    <h2 className='font-bold leading-relaxed tracking-wider text-2xl text-gray-500 mt-10'>Notification Preferences</h2>

                    <div className='space-y-4'>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-pink-600" />
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Email Notifications</p>
                                    <p className="text-xs text-gray-600">Receive updates via email</p>
                                </div>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-pink-600" />
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">SMS Notifications</p>
                                    <p className="text-xs text-gray-600">Receive updates via SMS</p>
                                </div>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                    type="checkbox"
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-pink-600" />
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Budget Alerts</p>
                                    <p className="text-xs text-gray-600">Alert when approaching budget limit</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                            </label>
                        </div>

                        <div className='w-full flex items-center justify-end'>
                            <button className='bg-pink-600 text-white font-bold leading-relaxed tracking-wider w-[100px] rounded-full p-1 cursor-pointer'>Save</button>
                        </div>
                    </div>

                    <h2 className='font-bold leading-relaxed tracking-wider text-2xl text-gray-500 mt-10'>Account Management</h2>

                    <div className='flex items-center mt-3 gap-x-2'>
                        <Trash2 className='text-red-500'></Trash2>
                        <p className='text-red-500 font-bold leading-relaxed tracking-widest cursor-pointer'>Delete Account</p>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default Settings