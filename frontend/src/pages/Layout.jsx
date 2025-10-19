import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, Header, Sidebar } from '../components'


const Layout = () => {
    return (
        <div className='flex items-left justify-left gap-x-10'>
            <div>
                <Sidebar></Sidebar>
            </div>
            <div>
                <header>
                    <Header></Header>
                </header>
                <main>
                    <Outlet></Outlet>
                </main>
                <footer>
                    <Footer></Footer>
                </footer>
            </div>
        </div>
    )
}

export default Layout