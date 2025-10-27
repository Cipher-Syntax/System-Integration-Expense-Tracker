import React, { useEffect, useState } from 'react'
import api from '../api/api';
import { Link } from 'react-router-dom';
import { useFetchProfile } from '../hooks';

const Header = () => {
    const [user, setUser] = useState(null);
    const { fetchProfile, loading, error } = useFetchProfile()

    useEffect(() => {
        const getUserProfile = async () => {
            const data = await fetchProfile();
            setUser(data);
        }

        getUserProfile();
    }, [])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Failed to load profile</p>;

    if (!user) return null

    return (
        <Link to="/settings" className='flex items-center gap-x-3 mt-5 cursor-pointer'>
            <div className='h-10 w-10 rounded-full bg-white flex items-center justify-center'>
                <p className='text-2xl text-gray-600'>
                    {user.username.charAt(0).toUpperCase()}
                </p>
            </div>
            <div className='w-[250px] h-[50px] bg-white rounded-l-full flex flex-col items-center justify-center'>
                <p className='text-gray-700 font-medium text-[12px]'>{user.username}</p>
                <p className='text-gray-700 font-medium text-[10px]'>{user.email}</p>
            </div>
        </Link>
    )
}

export default Header