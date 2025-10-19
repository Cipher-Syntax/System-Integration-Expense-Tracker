import React from 'react'
import { Frown } from 'lucide-react';

const NotFound = () => {
    return (
        <div className='min-h-screen flex items-center justify-center flex-col text-gray-500'>
            <Frown size={150}></Frown>
            <h1 className='font-extrabold text-3xl sm:text-7xl leading-relaxed tracking-wider'>404 Not Found</h1>
            <p className='font-medium text-[12px] sm:3xl'>The Page you are looking for doesn't exist or an other error occured.</p>
        </div>
    )
}

export default NotFound