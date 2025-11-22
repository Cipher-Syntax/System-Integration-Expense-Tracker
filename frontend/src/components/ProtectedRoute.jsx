import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/api';

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const refreshToken = localStorage.getItem("refresh");
            if (!refreshToken) {
                setIsAuthorized(false);
                return;
            }

            try {
                const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
                localStorage.setItem("access", res.data.access);
                setIsAuthorized(true);
            } catch (err) {
                console.log("Token refresh failed:", err);
                setIsAuthorized(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthorized === null) {
        return (
            <div className='flex flex-col text-center items-center justify-center min-h-screen'>
                <h1 className='text-3xl font-bold'>Loading...</h1>
            </div>
        );
    }

    return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
