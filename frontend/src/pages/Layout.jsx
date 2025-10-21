import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, Header, Sidebar } from '../components'


const Layout = () => {
    return (
        <div className='flex items-left justify-left gap-x-10 bg-gray-200 min-h-screen'>
            <Sidebar></Sidebar>
            
            <header className='absolute right-0'>
                <Header></Header>
            </header>
            <main>
                <Outlet></Outlet>
            </main>
            <footer className='w-[300px] fixed left-[80%] bottom-[5%]'>
                <Footer></Footer>
            </footer>
        </div>
    )
}

export default Layout