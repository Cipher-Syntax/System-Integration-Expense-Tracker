import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, Header, Sidebar } from '../components'


const Layout = () => {
    return (
        <div className='flex items-left justify-left bg-gray-200 min-h-screen w-full'>
            <Sidebar></Sidebar>
            
            <header className='absolute right-0'>
                <Header></Header>
            </header>
            <main className='w-full p-10'>
                <Outlet></Outlet>
            </main>
            <footer className='w-[300px] fixed left-[80%] bottom-[5%]'>
                <Footer></Footer>
            </footer>
        </div>
    )
}

export default Layout