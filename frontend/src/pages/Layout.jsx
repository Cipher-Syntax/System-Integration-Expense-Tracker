import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, Header, Sidebar } from '../components'

const Layout = () => {
    return (
        <div className='flex h-screen w-full bg-gray-200/30'>
            {/* Fixed Sidebar */}
            <Sidebar></Sidebar>
            
            {/* Scrollable Main Content */}
            <main className='flex-1 flex flex-col overflow-hidden'>
                <header className='fixed right-0 sm:static flex-shrink-0 mb-4 ml-auto mt-15 sm:mt-0 '>
                    <Header></Header>
                </header>
                
                <div className='flex-1 overflow-y-auto'>
                    <Outlet></Outlet>
                </div>
            </main>
        </div>
    )
}

export default Layout