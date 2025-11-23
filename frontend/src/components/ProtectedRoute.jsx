import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/api';

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // We cannot check localStorage. We simply attempt to hit the endpoint.
                // Because 'withCredentials: true' is in your api.js, cookies are sent automatically.
                // If the Refresh Token cookie is valid, the backend returns 200 OK.
                await api.post("/api/token/refresh/");
                
                // If the code reaches here, the refresh was successful (user is logged in)
                setIsAuthorized(true);
            } catch (err) {
                console.log("Token refresh failed/User not authenticated:", err);
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