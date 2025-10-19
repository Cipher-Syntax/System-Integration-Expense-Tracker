import React from 'react'

const Header = () => {
    const user = localStorage.getItem('user');

    return (
        <header className='flex items-center gap-x-3'>
            <div className='h-10 w-10 rounded-full bg-white flex items-center justify-center'>
                <p className='text-2xl text-gray-600'>{user.charAt(0).toUpperCase()}</p>
            </div>
            <div className='w-[200px] h-[50px] bg-white rounded-l-full'></div>
        </header>
    )
}

export default Header