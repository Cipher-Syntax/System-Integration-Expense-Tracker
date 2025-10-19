import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='flex itmes-center justify-start flex-col'>
            <div className='flex items-center justify-center gap-2'>
                <Link className='text-pink-500 hover:underline text-[14px]'>Settings</Link>
                <p>|</p>
                <Link className='text-pink-500 hover:underline text-[14px]'>About Us</Link>
            </div>
            <p className='text-gray-700 text-[12px] text-center'>&copy; SpendWise | 2025 | All Rights Reserved</p>
        </footer>
    )
}

export default Footer