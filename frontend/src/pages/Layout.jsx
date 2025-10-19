import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, Header, Sidebar } from '../components'


const Layout = () => {
    return (
        <div className='flex items-left justify-left gap-x-10 bg-gray-300 h-screen'>
            <Sidebar></Sidebar>
            
            <header className='w-full fixed left-[84%]'>
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