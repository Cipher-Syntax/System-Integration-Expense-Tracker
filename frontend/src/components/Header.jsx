import React, { useEffect, useState } from 'react'
import api from '../api/api';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks';
import { LoadingIndicator } from "../components"

const Header = () => {
    const { data, loading, error } = useFetch('api/profile/');

    if (loading){
        return (
            <LoadingIndicator />
        )
    };
    if (error){
        return (
            <LoadingIndicator />
        )
    };

    if(!data) return null

    return (
        <Link to="/settings" className='flex items-center gap-x-3 mt-5 cursor-pointer'>
            <div className='h-10 w-10 rounded-full bg-white flex items-center justify-center'>
                <p className='text-2xl text-gray-600'>
                    {data.username.charAt(0).toUpperCase()}
                </p>
            </div>
            <div className='w-[250px] h-[50px] bg-white rounded-l-full flex flex-col items-center justify-center'>
                <p className='text-gray-700 font-medium text-[12px]'>{data.username}</p>
                <p className='text-gray-700 font-medium text-[10px]'>{data.email}</p>
            </div>
        </Link>
    )
}

export default Header