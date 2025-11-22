import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/api';

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    const checkAuth = async () => {
        try {
            const refreshToken = localStorage.getItem("refresh");

            if (!refreshToken) {
                setIsAuthorized(false);
                return false;
            }

            const res = await api.post("api/token/refresh/", {
                refresh: refreshToken
            });

            // Save the new access token
            localStorage.setItem("access", res.data.access);

            setIsAuthorized(true);
            return true;

        } catch (error) {
            console.log("Failed to refresh token:", error);
            setIsAuthorized(false);
            return false;
        }
    };


    useEffect(() => {
        checkAuth();

        const interval = setInterval(() => {
            checkAuth();
        }, 4 * 60 * 1000);
        
        return () => clearInterval(interval);
    }, []);

    if (isAuthorized === null) {
        return (
            <div className='flex flex-col text-center items-center justify-center min-h-screen'>
                <h1 className='text-3xl font-bold'>Loading...</h1>
            </div>
        );
    }

    return isAuthorized ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
